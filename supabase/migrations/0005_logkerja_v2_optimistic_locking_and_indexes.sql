-- 1. Optimistic Locking
alter table public.documents add column if not exists version integer default 1;

-- Update transition function to increment version
create or replace function public.transition_document(p_doc_id uuid, p_action text, p_note text default null)
returns void
security definer
as $$
declare
    v_doc public.documents;
    v_actor_id uuid := auth.uid();
    v_sys_routing record;
begin
    if not public.is_active_user() then
        raise exception 'User is not active or authenticated';
    end if;

    select * into v_doc from public.documents where id = p_doc_id for update;

    if not found then
        raise exception 'Document not found';
    end if;

    -- State machine logic
    if v_doc.current_status = 'PENDING_VERIFIER' then
        if p_action = 'APPROVE' then
            if v_actor_id != v_doc.verifier_id then
                raise exception 'Only assigned verifier can approve at this stage';
            end if;
            
            if v_doc.verifier_id != v_doc.approver_id then
                update public.documents set current_status = 'PENDING_APPROVER', version = version + 1, updated_at = now() where id = p_doc_id;
                insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
                values (p_doc_id, v_actor_id, 'APPROVE_VERIFIER', 'PENDING_VERIFIER', 'PENDING_APPROVER', p_note);
            else
                update public.documents set current_status = 'LULUS', version = version + 1, updated_at = now() where id = p_doc_id;
                insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
                values (p_doc_id, v_actor_id, 'APPROVE_VERIFIER', 'PENDING_VERIFIER', 'LULUS', p_note);
                insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
                values (p_doc_id, v_actor_id, 'AUTO_FINALIZE', 'LULUS', 'LULUS', 'Auto finalized as verifier equals approver');
            end if;

        elsif p_action = 'REJECT' then
            if v_actor_id != v_doc.verifier_id then
                raise exception 'Only assigned verifier can reject at this stage';
            end if;
            if trim(coalesce(p_note, '')) = '' then
                raise exception 'Rejection note is required';
            end if;

            update public.documents set current_status = 'REJECTED', version = version + 1, updated_at = now() where id = p_doc_id;
            insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
            values (p_doc_id, v_actor_id, 'REJECT_VERIFIER', 'PENDING_VERIFIER', 'REJECTED', p_note);
            
        else
            raise exception 'Invalid action % for status %', p_action, v_doc.current_status;
        end if;

    elsif v_doc.current_status = 'PENDING_APPROVER' then
        if p_action = 'APPROVE' then
            if v_actor_id != v_doc.approver_id then
                raise exception 'Only assigned approver can approve at this stage';
            end if;

            update public.documents set current_status = 'LULUS', version = version + 1, updated_at = now() where id = p_doc_id;
            insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
            values (p_doc_id, v_actor_id, 'APPROVE_APPROVER', 'PENDING_APPROVER', 'LULUS', p_note);

        elsif p_action = 'REJECT' then
            if v_actor_id != v_doc.approver_id then
                raise exception 'Only assigned approver can reject at this stage';
            end if;
            if trim(coalesce(p_note, '')) = '' then
                raise exception 'Rejection note is required';
            end if;

            update public.documents set current_status = 'REJECTED', version = version + 1, updated_at = now() where id = p_doc_id;
            insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
            values (p_doc_id, v_actor_id, 'REJECT_APPROVER', 'PENDING_APPROVER', 'REJECTED', p_note);
        else
            raise exception 'Invalid action % for status %', p_action, v_doc.current_status;
        end if;

    elsif v_doc.current_status in ('REJECTED', 'ON_HOLD') then
        if p_action = 'RESUBMIT' then
            if v_actor_id != v_doc.creator_id then
                raise exception 'Only document creator can resubmit';
            end if;
            if not public.has_role('PENYEMAK') then
                raise exception 'Only PENYEMAK can resubmit';
            end if;
            
            -- Re-lookup routing based on current category
            select default_verifier_id, default_approver_id into v_sys_routing
            from public.category_routing where category_id = v_doc.category_id;
            
            update public.documents 
            set current_status = 'PENDING_VERIFIER', 
                verifier_id = v_sys_routing.default_verifier_id, 
                approver_id = v_sys_routing.default_approver_id,
                version = version + 1,
                updated_at = now()
            where id = p_doc_id;

            insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
            values (p_doc_id, v_actor_id, 'RESUBMIT', v_doc.current_status, 'PENDING_VERIFIER', p_note);
        else
            raise exception 'Invalid action % for status %', p_action, v_doc.current_status;
        end if;

    elsif v_doc.current_status = 'LULUS' then
        if p_action = 'SET_ON_HOLD' then
            if not public.has_role('ADMIN') then
                raise exception 'Only ADMIN can hold a LULUS document';
            end if;
            if trim(coalesce(p_note, '')) = '' then
                raise exception 'On hold note is required';
            end if;

            update public.documents set current_status = 'ON_HOLD', version = version + 1, updated_at = now() where id = p_doc_id;
            insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
            values (p_doc_id, v_actor_id, 'SET_ON_HOLD', 'LULUS', 'ON_HOLD', p_note);
        else
            raise exception 'Invalid action % for status %', p_action, v_doc.current_status;
        end if;
    else
        raise exception 'Unknown state %', v_doc.current_status;
    end if;

end;
$$ language plpgsql;

-- 2. DB Index Optimization (Redundant check just to be safe as per directive)
create index if not exists idx_documents_creator on documents(creator_id);
create index if not exists idx_documents_verifier on documents(verifier_id);
create index if not exists idx_documents_approver on documents(approver_id);
create index if not exists idx_documents_status on documents(current_status);
create index if not exists idx_actions_doc on document_actions(document_id);
