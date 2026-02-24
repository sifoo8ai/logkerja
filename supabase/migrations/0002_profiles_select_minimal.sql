grant select on table public.profiles to authenticated;

create policy "profiles_read_authenticated"
on public.profiles
for select
to authenticated
using (true);
