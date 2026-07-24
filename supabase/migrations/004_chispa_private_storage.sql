-- Private Chispa file storage.
-- Applied to Supabase project cyxdevcjycmffhmwxojh on 2026-07-24.
-- Files are isolated by the first path segment: chispa-<sha256 household key>.

insert into storage.buckets (id, name, public)
values ('chispa-private','chispa-private',false)
on conflict (id) do update set public=false;

drop policy if exists chispa_private_read on storage.objects;
drop policy if exists chispa_private_insert on storage.objects;
drop policy if exists chispa_private_delete on storage.objects;

create policy chispa_private_read
on storage.objects
for select
to anon, authenticated
using (
  bucket_id='chispa-private'
  and storage.allow_any_operation(array['object.get_authenticated_info','object.get_authenticated'])
  and coalesce((storage.foldername(name))[1],'') = chispa.request_household_key()
  and coalesce((storage.foldername(name))[1],'') ~ '^chispa-[a-f0-9]{64}$'
);

create policy chispa_private_insert
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id='chispa-private'
  and coalesce((storage.foldername(name))[1],'') = chispa.request_household_key()
  and coalesce((storage.foldername(name))[1],'') ~ '^chispa-[a-f0-9]{64}$'
);

create policy chispa_private_delete
on storage.objects
for delete
to anon, authenticated
using (
  bucket_id='chispa-private'
  and coalesce((storage.foldername(name))[1],'') = chispa.request_household_key()
  and coalesce((storage.foldername(name))[1],'') ~ '^chispa-[a-f0-9]{64}$'
);
