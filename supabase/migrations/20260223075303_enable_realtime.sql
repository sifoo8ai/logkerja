-- MENGAKTIFKAN REALTIME UNTUK KEMAS KINI DASHBOARD MOBILE SECARA LANGSUNG
begin;
  -- Sekiranya publication belum wujud, kita ciptakan (Supabase biasanya sudah menyediakannya)
  do $$
  begin
      if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
          create publication supabase_realtime;
      end if;
  end
  $$;
commit;

-- Tambahkan jadual 'documents' ke dalam langganan realtime Supabase
alter publication supabase_realtime add table documents;
