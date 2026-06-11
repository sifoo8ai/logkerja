create policy "Admin can update documents" on public.documents for update to authenticated using ( public.has_role(
\ADMIN\') );
