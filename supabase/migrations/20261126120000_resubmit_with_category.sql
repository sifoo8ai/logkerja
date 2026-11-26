-- CATEGORY-RESUBMIT-01: penyemak boleh betulkan kategori semasa Hantar Semula.
--
-- Dokumen REJECTED / ON_HOLD milik sendiri boleh dihantar semula dengan kategori baharu.
-- Semuanya berlaku dalam SATU transaksi:
--   1. category_id ditukar
--   2. pengesah/pelulus dicari semula ikut routing kategori baharu
--   3. status -> PENDING_VERIFIER
--   4. audit RESUBMIT dengan nota "[Kategori ditukar: A -> B]" (+ nota penyemak)
-- transition_document sedia ada TIDAK diubah; Hantar Semula tanpa tukar kategori masih guna laluan lama.
-- Tiada perubahan pada enum, jadual atau RLS.

create or replace function public.resubmit_document_with_category(
    p_doc_id uuid,
    p_cat_id uuid,
    p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_doc public.documents;
    v_routing record;
    v_old_name text;
    v_new_name text;
    v_note text;
begin
    if not public.is_active_user() then
        raise exception 'User is not active or authenticated';
    end if;
    if not public.has_role('PENYEMAK') then
        raise exception 'Only PENYEMAK can resubmit';
    end if;

    select * into v_doc from public.documents where id = p_doc_id for update;
    if not found then
        raise exception 'Document not found';
    end if;

    if v_doc.creator_id is distinct from v_uid then
        raise exception 'Only document creator can resubmit';
    end if;
    if v_doc.current_status not in ('REJECTED', 'ON_HOLD') then
        raise exception 'Invalid action RESUBMIT for status %', v_doc.current_status;
    end if;

    select name into v_new_name
    from public.document_categories
    where id = p_cat_id and is_active = true;
    if not found then
        raise exception 'Kategori tidak sah atau tidak aktif';
    end if;

    select default_verifier_id, default_approver_id into v_routing
    from public.category_routing where category_id = p_cat_id;
    if not found then
        raise exception 'Category routing not found';
    end if;

    select name into v_old_name from public.document_categories where id = v_doc.category_id;

    v_note := case
        when v_doc.category_id = p_cat_id then nullif(trim(coalesce(p_note, '')), '')
        else concat_ws(E'\n',
            format('[Kategori ditukar: %s → %s]', coalesce(v_old_name, '-'), v_new_name),
            nullif(trim(coalesce(p_note, '')), ''))
    end;

    update public.documents
    set category_id = p_cat_id,
        current_status = 'PENDING_VERIFIER',
        verifier_id = v_routing.default_verifier_id,
        approver_id = v_routing.default_approver_id,
        version = version + 1,
        updated_at = now()
    where id = p_doc_id;

    insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
    values (p_doc_id, v_uid, 'RESUBMIT', v_doc.current_status, 'PENDING_VERIFIER', v_note);
end;
$$;

revoke all on function public.resubmit_document_with_category(uuid, uuid, text) from public, anon;
grant execute on function public.resubmit_document_with_category(uuid, uuid, text) to authenticated;
