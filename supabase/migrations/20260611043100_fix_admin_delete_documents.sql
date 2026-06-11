grant delete on table public.documents to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'documents'
      and policyname = 'documents_delete_admin_only'
  ) then
    create policy "documents_delete_admin_only"
    on public.documents
    for delete
    using (public.has_role('ADMIN'));
  end if;
end $$;
