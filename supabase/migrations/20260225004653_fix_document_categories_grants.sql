-- Allow authenticated role to access table; RLS still controls what they can see/do
grant select on table public.document_categories to authenticated;
grant insert on table public.document_categories to authenticated;
grant update on table public.document_categories to authenticated;
grant delete on table public.document_categories to authenticated;

-- Policies for document_categories already exist as:
-- "Authenticated can view document_categories" for select
-- "Admin can manage document_categories" for all
