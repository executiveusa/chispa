-- Chispa V1 private file persistence in isolated Postgres.
-- This avoids service-role credentials while keeping household RLS authoritative.
-- Applied to Supabase project cyxdevcjycmffhmwxojh on 2026-07-24.

-- The reserved Storage bucket remains private/deny-all for future authenticated storage migration.
drop policy if exists chispa_private_read on storage.objects;
drop policy if exists chispa_private_insert on storage.objects;
drop policy if exists chispa_private_delete on storage.objects;

create table if not exists chispa.files (
  id uuid primary key default gen_random_uuid(),
  household_key text not null check (household_key ~ '^chispa-[a-f0-9]{64}$'),
  item_id text not null,
  kind text not null check (kind in ('photo','receipt','warranty')),
  file_name text not null,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp','application/pdf')),
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 2000000),
  data bytea not null,
  created_at timestamptz not null default now()
);
create index if not exists chispa_files_household_item_idx on chispa.files(household_key,item_id,created_at desc);
alter table chispa.files enable row level security;
alter table chispa.files force row level security;
grant select,insert,delete on chispa.files to anon,authenticated;

drop policy if exists chispa_files_select on chispa.files;
drop policy if exists chispa_files_insert on chispa.files;
drop policy if exists chispa_files_delete on chispa.files;
create policy chispa_files_select on chispa.files for select to anon,authenticated using (household_key=chispa.request_household_key());
create policy chispa_files_insert on chispa.files for insert to anon,authenticated with check (household_key=chispa.request_household_key());
create policy chispa_files_delete on chispa.files for delete to anon,authenticated using (household_key=chispa.request_household_key());

create or replace function public.chispa_save_file(p_household_key text,p_item_id text,p_kind text,p_file_name text,p_mime_type text,p_data_base64 text)
returns table(id uuid,file_name text,mime_type text,size_bytes integer,created_at timestamptz)
language plpgsql security invoker set search_path=pg_catalog,public,chispa
as $$
declare v_data bytea;
begin
 if p_household_key<>chispa.request_household_key() or p_household_key !~ '^chispa-[a-f0-9]{64}$' then raise exception 'household key mismatch'; end if;
 if p_kind not in ('photo','receipt','warranty') then raise exception 'invalid kind'; end if;
 if p_mime_type not in ('image/jpeg','image/png','image/webp','application/pdf') then raise exception 'invalid mime type'; end if;
 v_data:=decode(p_data_base64,'base64');
 if octet_length(v_data)=0 or octet_length(v_data)>2000000 then raise exception 'file too large'; end if;
 return query insert into chispa.files(household_key,item_id,kind,file_name,mime_type,size_bytes,data)
 values(p_household_key,left(p_item_id,180),p_kind,left(p_file_name,180),p_mime_type,octet_length(v_data),v_data)
 returning files.id,files.file_name,files.mime_type,files.size_bytes,files.created_at;
end $$;

create or replace function public.chispa_load_file(p_household_key text,p_file_id uuid)
returns table(file_name text,mime_type text,size_bytes integer,data_base64 text)
language plpgsql security invoker set search_path=pg_catalog,public,chispa
as $$
begin
 if p_household_key<>chispa.request_household_key() or p_household_key !~ '^chispa-[a-f0-9]{64}$' then raise exception 'household key mismatch'; end if;
 return query select f.file_name,f.mime_type,f.size_bytes,encode(f.data,'base64') from chispa.files f where f.id=p_file_id and f.household_key=p_household_key;
end $$;

create or replace function public.chispa_delete_file(p_household_key text,p_file_id uuid)
returns boolean language plpgsql security invoker set search_path=pg_catalog,public,chispa as $$
begin
 if p_household_key<>chispa.request_household_key() then raise exception 'household key mismatch'; end if;
 delete from chispa.files where id=p_file_id and household_key=p_household_key;
 return found;
end $$;

revoke all on function public.chispa_save_file(text,text,text,text,text,text) from public;
revoke all on function public.chispa_load_file(text,uuid) from public;
revoke all on function public.chispa_delete_file(text,uuid) from public;
grant execute on function public.chispa_save_file(text,text,text,text,text,text) to anon,authenticated;
grant execute on function public.chispa_load_file(text,uuid) to anon,authenticated;
grant execute on function public.chispa_delete_file(text,uuid) to anon,authenticated;
