-- Harden Chispa V1 sync so Postgres RLS, not SECURITY DEFINER bypass, enforces household access.
-- Applied to managed Supabase project cyxdevcjycmffhmwxojh on 2026-07-24.

create or replace function chispa.request_household_key()
returns text
language sql
stable
security invoker
set search_path = pg_catalog
as $$
  select coalesce((nullif(current_setting('request.headers', true), ''))::jsonb ->> 'x-chispa-household-key', '')
$$;

grant usage on schema chispa to anon, authenticated;
grant execute on function chispa.request_household_key() to anon, authenticated;
grant select, insert, update on chispa.household_snapshots to anon, authenticated;

alter table chispa.household_snapshots enable row level security;
alter table chispa.household_snapshots force row level security;

drop policy if exists chispa_snapshot_select on chispa.household_snapshots;
drop policy if exists chispa_snapshot_insert on chispa.household_snapshots;
drop policy if exists chispa_snapshot_update on chispa.household_snapshots;

create policy chispa_snapshot_select
on chispa.household_snapshots
for select
to anon, authenticated
using (
  household_key = chispa.request_household_key()
  and household_key ~ '^chispa-[a-f0-9]{64}$'
);

create policy chispa_snapshot_insert
on chispa.household_snapshots
for insert
to anon, authenticated
with check (
  household_key = chispa.request_household_key()
  and household_key ~ '^chispa-[a-f0-9]{64}$'
);

create policy chispa_snapshot_update
on chispa.household_snapshots
for update
to anon, authenticated
using (
  household_key = chispa.request_household_key()
  and household_key ~ '^chispa-[a-f0-9]{64}$'
)
with check (
  household_key = chispa.request_household_key()
  and household_key ~ '^chispa-[a-f0-9]{64}$'
);

create or replace function public.chispa_load_snapshot(p_household_key text)
returns table(payload jsonb, revision bigint, updated_at timestamptz)
language plpgsql
security invoker
set search_path = pg_catalog, public, chispa
as $$
begin
  if p_household_key is null or p_household_key !~ '^chispa-[a-f0-9]{64}$' then
    raise exception 'invalid household key';
  end if;
  if p_household_key <> chispa.request_household_key() then
    raise exception 'household key mismatch';
  end if;
  return query
    select s.payload, s.revision, s.updated_at
    from chispa.household_snapshots s
    where s.household_key = p_household_key;
end;
$$;

create or replace function public.chispa_save_snapshot(
  p_household_key text,
  p_payload jsonb,
  p_expected_revision bigint default null
)
returns table(revision bigint, updated_at timestamptz)
language plpgsql
security invoker
set search_path = pg_catalog, public, chispa
as $$
declare
  v_revision bigint;
  v_updated timestamptz;
begin
  if p_household_key is null or p_household_key !~ '^chispa-[a-f0-9]{64}$' then
    raise exception 'invalid household key';
  end if;
  if p_household_key <> chispa.request_household_key() then
    raise exception 'household key mismatch';
  end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'invalid payload';
  end if;

  if exists (select 1 from chispa.household_snapshots where household_key=p_household_key) then
    update chispa.household_snapshots
      set payload=p_payload, revision=revision+1, updated_at=now()
      where household_key=p_household_key
        and (p_expected_revision is null or revision=p_expected_revision)
      returning household_snapshots.revision, household_snapshots.updated_at
      into v_revision, v_updated;
    if not found then
      raise exception 'revision_conflict' using errcode='40001';
    end if;
  else
    if p_expected_revision is not null and p_expected_revision <> 0 then
      raise exception 'revision_conflict' using errcode='40001';
    end if;
    insert into chispa.household_snapshots(household_key,payload,revision)
    values(p_household_key,p_payload,1)
    returning household_snapshots.revision, household_snapshots.updated_at
    into v_revision, v_updated;
  end if;
  return query select v_revision, v_updated;
end;
$$;

revoke all on function public.chispa_load_snapshot(text) from public;
revoke all on function public.chispa_save_snapshot(text,jsonb,bigint) from public;
grant execute on function public.chispa_load_snapshot(text) to anon, authenticated;
grant execute on function public.chispa_save_snapshot(text,jsonb,bigint) to anon, authenticated;
