-- Chispa managed Supabase V1 snapshot backend
-- Applied to Supabase project cyxdevcjycmffhmwxojh on 2026-07-24.
-- App isolation: dedicated `chispa` schema; direct table access revoked; RPC-only access.

create schema if not exists platform;
create schema if not exists chispa;

create table if not exists platform.app_registry (
  id uuid primary key default gen_random_uuid(),
  app_slug text not null unique,
  app_name text not null,
  schema_name text not null unique,
  repository text,
  production_url text,
  owner text,
  database_provider text not null default 'supabase',
  storage_namespace text,
  tenancy_model text,
  status text not null default 'active',
  migration_status text not null default 'managed',
  last_capacity_check timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
create unique index if not exists app_registry_storage_namespace_unique
  on platform.app_registry(storage_namespace)
  where storage_namespace is not null;
alter table platform.app_registry enable row level security;
revoke all on platform.app_registry from anon, authenticated;

insert into platform.app_registry (
  app_slug, app_name, schema_name, repository, production_url, owner,
  database_provider, storage_namespace, tenancy_model, status, migration_status,
  last_capacity_check, metadata
) values (
  'chispa','Chispa','chispa','https://github.com/executiveusa/chispa',
  'https://chispa-nu.vercel.app','The Pauli Effect','supabase',
  'chispa-private','household','active','managed',now(),
  jsonb_build_object('version','v1','local_first',true)
)
on conflict (app_slug) do update set
  app_name=excluded.app_name,
  schema_name=excluded.schema_name,
  repository=excluded.repository,
  production_url=excluded.production_url,
  owner=excluded.owner,
  storage_namespace=excluded.storage_namespace,
  tenancy_model=excluded.tenancy_model,
  status='active',
  last_capacity_check=now(),
  updated_at=now();

create table if not exists chispa.household_snapshots (
  household_key text primary key check (household_key ~ '^chispa-[a-f0-9]{64}$'),
  payload jsonb not null,
  revision bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table chispa.household_snapshots enable row level security;
alter table chispa.household_snapshots force row level security;
revoke all on schema chispa from public, anon, authenticated;
revoke all on all tables in schema chispa from public, anon, authenticated;

create or replace function public.chispa_load_snapshot(p_household_key text)
returns table(payload jsonb, revision bigint, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public, chispa
as $$
begin
  if p_household_key is null or p_household_key !~ '^chispa-[a-f0-9]{64}$' then
    raise exception 'invalid household key';
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
security definer
set search_path = pg_catalog, public, chispa
as $$
declare
  v_revision bigint;
  v_updated timestamptz;
begin
  if p_household_key is null or p_household_key !~ '^chispa-[a-f0-9]{64}$' then
    raise exception 'invalid household key';
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
