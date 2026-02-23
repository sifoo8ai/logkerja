-- 1. Enable RLS explicitly for all tables (idempotent)
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.document_categories enable row level security;
alter table public.category_routing enable row level security;
alter table public.documents enable row level security;
alter table public.document_actions enable row level security;
alter table public.document_attachments enable row level security;
alter table public.push_subscriptions enable row level security;

-- 2. Revoke overly-broad privileges and grant minimum
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_roles from anon, authenticated;
revoke all on table public.document_categories from anon, authenticated;
revoke all on table public.category_routing from anon, authenticated;
revoke all on table public.documents from anon, authenticated;
revoke all on table public.document_actions from anon, authenticated;
revoke all on table public.document_attachments from anon, authenticated;
revoke all on table public.push_subscriptions from anon, authenticated;

-- Grant select to authenticated
grant select on table public.profiles to authenticated;
grant select on table public.user_roles to authenticated;
grant select on table public.document_categories to authenticated;
grant select on table public.documents to authenticated;
grant select on table public.document_actions to authenticated;
grant select on table public.document_attachments to authenticated;
grant select on table public.push_subscriptions to authenticated;

-- Granular grants based on requirements
grant update (full_name) on table public.profiles to authenticated;
grant insert on table public.profiles to authenticated;

grant insert, update, delete on table public.push_subscriptions to authenticated;

-- Core function grants
grant execute on function public.create_document(text, uuid, text) to authenticated;
grant execute on function public.transition_document(uuid, text, text) to authenticated;

-- 3. RLS Policies

-- profiles
create policy "Users can view own profile or admin can view all" on public.profiles
for select to authenticated using (
  id = auth.uid() or public.has_role('ADMIN')
);

create policy "Users can update own profile full_name or admin" on public.profiles
for update to authenticated using (
  id = auth.uid() or public.has_role('ADMIN')
);

create policy "Users can insert own profile" on public.profiles
for insert to authenticated with check (
  id = auth.uid()
);

create policy "Admin can delete profiles" on public.profiles
for delete to authenticated using (
  public.has_role('ADMIN')
);

-- user_roles
create policy "Users can view own roles or admin can view all" on public.user_roles
for select to authenticated using (
  user_id = auth.uid() or public.has_role('ADMIN')
);
create policy "Admin can manage user_roles" on public.user_roles
for all to authenticated using (
  public.has_role('ADMIN')
);

-- document_categories
create policy "Authenticated can view document_categories" on public.document_categories
for select to authenticated using (true);

create policy "Admin can manage document_categories" on public.document_categories
for all to authenticated using (
  public.has_role('ADMIN')
);

-- category_routing
create policy "Admin can manage category_routing" on public.category_routing
for all to authenticated using (
  public.has_role('ADMIN')
);

-- documents
create policy "Admin can view all documents" on public.documents
for select to authenticated using (
  public.has_role('ADMIN')
);
create policy "Creator can view their documents" on public.documents
for select to authenticated using (
  creator_id = auth.uid()
);
create policy "Verifier can view assigned documents" on public.documents
for select to authenticated using (
  verifier_id = auth.uid()
);
create policy "Approver can view assigned documents" on public.documents
for select to authenticated using (
  approver_id = auth.uid()
);

create policy "Admin can delete documents" on public.documents
for delete to authenticated using (
  public.has_role('ADMIN')
);

-- document_actions
create policy "Admin can view all actions" on public.document_actions
for select to authenticated using (
  public.has_role('ADMIN')
);
create policy "Users can view actions for accessible documents" on public.document_actions
for select to authenticated using (
  exists (
    select 1 from public.documents d
    where d.id = document_actions.document_id
    and (d.creator_id = auth.uid() or d.verifier_id = auth.uid() or d.approver_id = auth.uid())
  )
);

-- document_attachments
create policy "Admin can view all attachments" on public.document_attachments
for select to authenticated using (
  public.has_role('ADMIN')
);
create policy "Users can view attachments for accessible documents" on public.document_attachments
for select to authenticated using (
  exists (
    select 1 from public.documents d
    where d.id = document_attachments.document_id
    and (d.creator_id = auth.uid() or d.verifier_id = auth.uid() or d.approver_id = auth.uid())
  )
);
create policy "Admin can delete attachments" on public.document_attachments
for delete to authenticated using (
  public.has_role('ADMIN')
);

-- push_subscriptions
create policy "Users can view own push_subscriptions or admin can view all" on public.push_subscriptions
for select to authenticated using (
  user_id = auth.uid() or public.has_role('ADMIN')
);
create policy "Users can manage own push_subscriptions" on public.push_subscriptions
for insert to authenticated with check (
  user_id = auth.uid()
);
create policy "Users can update own push_subscriptions" on public.push_subscriptions
for update to authenticated using (
  user_id = auth.uid()
);
create policy "Users can delete own push_subscriptions or admin" on public.push_subscriptions
for delete to authenticated using (
  user_id = auth.uid() or public.has_role('ADMIN')
);
