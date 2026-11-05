-- ERP-CAPTURE-01: semakan kewujudan nombor rujukan merentasi semua pengguna.
--
-- RLS pada public.documents hanya membenarkan pengguna melihat dokumen milik sendiri / ditugaskan,
-- jadi semakan duplikasi dari klien tidak boleh guna SELECT biasa. Fungsi SECURITY DEFINER ini
-- pulangkan maklumat MINIMUM sahaja:
--   - dokumen pengguna lain : ref_exists + current_status (tiada id, nama atau keterangan)
--   - dokumen milik sendiri : turut pulangkan doc_id + nama pelaku yang sedang ditunggu
-- Tiada perubahan pada jadual, RLS atau RPC sedia ada.

create or replace function public.check_reference_exists(p_ref_no text)
returns table (
    ref_exists boolean,
    is_own boolean,
    doc_id uuid,
    current_status public.document_status,
    pending_actor_name text,
    updated_at timestamp with time zone
)
language plpgsql
security definer
stable
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_doc public.documents;
    v_actor text;
begin
    if not public.is_active_user() then
        raise exception 'User is not active or authenticated';
    end if;

    if p_ref_no is null or trim(p_ref_no) = '' then
        return query select false, false, null::uuid, null::public.document_status, null::text, null::timestamptz;
        return;
    end if;

    select d.* into v_doc
    from public.documents d
    where upper(trim(d.reference_no)) = upper(trim(p_ref_no))
    limit 1;

    if not found then
        return query select false, false, null::uuid, null::public.document_status, null::text, null::timestamptz;
        return;
    end if;

    if v_doc.creator_id = v_uid then
        if v_doc.current_status = 'PENDING_VERIFIER' then
            select p.full_name into v_actor from public.profiles p where p.id = v_doc.verifier_id;
        elsif v_doc.current_status = 'PENDING_APPROVER' then
            select p.full_name into v_actor from public.profiles p where p.id = v_doc.approver_id;
        end if;

        return query select true, true, v_doc.id, v_doc.current_status, v_actor, v_doc.updated_at;
    else
        return query select true, false, null::uuid, v_doc.current_status, null::text, null::timestamptz;
    end if;
end;
$$;

revoke all on function public.check_reference_exists(text) from public;
revoke all on function public.check_reference_exists(text) from anon;
grant execute on function public.check_reference_exists(text) to authenticated;
