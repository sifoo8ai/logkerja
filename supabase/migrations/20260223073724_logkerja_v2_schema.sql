create extension if not exists pgcrypto;

do $$ begin
    create type public.app_role as enum ('ADMIN', 'PENYEMAK', 'PENGESAH', 'PELULUS');
exception when duplicate_object then null; end $$;

do $$ begin
    create type public.document_status as enum ('PENDING_VERIFIER', 'PENDING_APPROVER', 'REJECTED', 'LULUS', 'ON_HOLD');
exception when duplicate_object then null; end $$;

do $$ begin
    create type public.document_action_type as enum ('CREATE', 'APPROVE_VERIFIER', 'APPROVE_APPROVER', 'REJECT_VERIFIER', 'REJECT_APPROVER', 'AUTO_FINALIZE', 'RESUBMIT', 'SET_ON_HOLD');
exception when duplicate_object then null; end $$;

-- profiles
create table if not exists public.profiles (
    id uuid references auth.users not null primary key,
    full_name text not null,
    is_active boolean default true not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- user_roles
create table if not exists public.user_roles (
    user_id uuid references public.profiles(id) on delete cascade not null,
    role public.app_role not null,
    primary key (user_id, role)
);

-- document_categories
create table if not exists public.document_categories (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    is_active boolean default true not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- category_routing
create table if not exists public.category_routing (
    category_id uuid references public.document_categories(id) on delete cascade not null primary key,
    default_verifier_id uuid references public.profiles(id) not null,
    default_approver_id uuid references public.profiles(id) not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- documents
create table if not exists public.documents (
    id uuid default gen_random_uuid() primary key,
    reference_no text not null unique,
    category_id uuid references public.document_categories(id) not null,
    creator_id uuid references public.profiles(id) not null,
    current_status public.document_status not null,
    description text,
    verifier_id uuid references public.profiles(id),
    approver_id uuid references public.profiles(id),
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- document_actions
create table if not exists public.document_actions (
    id uuid default gen_random_uuid() primary key,
    document_id uuid references public.documents(id) on delete cascade not null,
    actor_id uuid references public.profiles(id) not null,
    action public.document_action_type not null,
    from_status public.document_status,
    to_status public.document_status not null,
    note text,
    created_at timestamp with time zone default now() not null
);

-- document_attachments
create table if not exists public.document_attachments (
    id uuid default gen_random_uuid() primary key,
    document_id uuid references public.documents(id) on delete cascade not null,
    file_path text not null,
    file_name text not null,
    content_type text not null,
    size_bytes bigint not null,
    uploaded_by uuid references public.profiles(id) not null,
    created_at timestamp with time zone default now() not null
);

-- push_subscriptions
create table if not exists public.push_subscriptions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    subscription jsonb not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Enable RLS (policies to be added in task T2.2)
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.document_categories enable row level security;
alter table public.category_routing enable row level security;
alter table public.documents enable row level security;
alter table public.document_actions enable row level security;
alter table public.document_attachments enable row level security;
alter table public.push_subscriptions enable row level security;

-- Updated at triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

do $$ begin
    create trigger t_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
    create trigger t_document_categories_updated_at before update on public.document_categories for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
    create trigger t_category_routing_updated_at before update on public.category_routing for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
    create trigger t_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
    create trigger t_push_subscriptions_updated_at before update on public.push_subscriptions for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- Indexes
create index if not exists idx_user_roles_user on public.user_roles(user_id);
create index if not exists idx_documents_creator on public.documents(creator_id);
create index if not exists idx_documents_verifier on public.documents(verifier_id);
create index if not exists idx_documents_approver on public.documents(approver_id);
create index if not exists idx_document_actions_doc on public.document_actions(document_id);

-- Helper functions
create or replace function public.has_role(check_role public.app_role)
returns boolean
security definer stable
as $$
begin
    return exists (
        select 1 from public.user_roles
        where user_id = auth.uid() and role = check_role
    );
end;
$$ language plpgsql;

create or replace function public.is_active_user()
returns boolean
security definer stable
as $$
begin
    return exists (
        select 1 from public.profiles
        where id = auth.uid() and is_active = true
    );
end;
$$ language plpgsql;

create or replace function public.get_routing_for_category(cat_id uuid)
returns record
security definer stable
as $$
declare
    rec record;
begin
    select default_verifier_id as verifier_id, default_approver_id as approver_id
    into rec
    from public.category_routing
    where category_id = cat_id;
    return rec;
end;
$$ language plpgsql;

-- Core functions
create or replace function public.create_document(p_ref_no text, p_cat_id uuid, p_desc text)
returns uuid
security definer
as $$
declare
    v_doc_id uuid;
    v_creator_id uuid := auth.uid();
    v_sys_routing record;
begin
    if not public.is_active_user() then
        raise exception 'User is not active or authenticated';
    end if;
    if not public.has_role('PENYEMAK') then
        raise exception 'User does not have PENYEMAK role';
    end if;

    select default_verifier_id, default_approver_id into v_sys_routing
    from public.category_routing where category_id = p_cat_id;

    if not found then
        raise exception 'Category routing not found';
    end if;

    insert into public.documents (
        reference_no, category_id, creator_id, current_status, description, verifier_id, approver_id
    ) values (
        p_ref_no, p_cat_id, v_creator_id, 'PENDING_VERIFIER', p_desc, v_sys_routing.default_verifier_id, v_sys_routing.default_approver_id
    ) returning id into v_doc_id;

    insert into public.document_actions (
        document_id, actor_id, action, from_status, to_status, note
    ) values (
        v_doc_id, v_creator_id, 'CREATE', null, 'PENDING_VERIFIER', 'Document created'
    );

    return v_doc_id;
end;
$$ language plpgsql;

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
                update public.documents set current_status = 'PENDING_APPROVER', updated_at = now() where id = p_doc_id;
                insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
                values (p_doc_id, v_actor_id, 'APPROVE_VERIFIER', 'PENDING_VERIFIER', 'PENDING_APPROVER', p_note);
            else
                update public.documents set current_status = 'LULUS', updated_at = now() where id = p_doc_id;
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

            update public.documents set current_status = 'REJECTED', updated_at = now() where id = p_doc_id;
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

            update public.documents set current_status = 'LULUS', updated_at = now() where id = p_doc_id;
            insert into public.document_actions (document_id, actor_id, action, from_status, to_status, note)
            values (p_doc_id, v_actor_id, 'APPROVE_APPROVER', 'PENDING_APPROVER', 'LULUS', p_note);

        elsif p_action = 'REJECT' then
            if v_actor_id != v_doc.approver_id then
                raise exception 'Only assigned approver can reject at this stage';
            end if;
            if trim(coalesce(p_note, '')) = '' then
                raise exception 'Rejection note is required';
            end if;

            update public.documents set current_status = 'REJECTED', updated_at = now() where id = p_doc_id;
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

            update public.documents set current_status = 'ON_HOLD', updated_at = now() where id = p_doc_id;
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
