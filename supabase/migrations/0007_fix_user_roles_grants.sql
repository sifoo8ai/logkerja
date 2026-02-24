-- Allow authenticated users to attempt insert/update/delete
-- RLS will restrict to admin only

grant select on table public.user_roles to authenticated;
grant insert on table public.user_roles to authenticated;
grant update on table public.user_roles to authenticated;
grant delete on table public.user_roles to authenticated;
