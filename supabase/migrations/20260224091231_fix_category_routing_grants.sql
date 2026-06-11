-- Allow authenticated to attempt select; RLS still enforces admin-only visibility
grant select on table public.category_routing to authenticated;

-- Optional: if admin UI needs categories too (usually already granted in 0002)
grant select on table public.document_categories to authenticated;
