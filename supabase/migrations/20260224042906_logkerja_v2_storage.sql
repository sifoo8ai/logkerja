insert into storage.buckets (id, name, public) 
values ('document-attachments', 'document-attachments', false)
on conflict (id) do nothing;

create policy "Allow authenticated users to upload files"
on storage.objects for insert to authenticated
with check ( bucket_id = 'document-attachments' );
