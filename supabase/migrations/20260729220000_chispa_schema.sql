-- Migration: 20260729220000_chispa_schema.sql
-- Purpose: Create isolated chispa_* tables, triggers, and RLS policies for Chispa personal operations app.
-- Note: Does NOT modify existing public tables (products, settings, orders, profiles, etc.)

create extension if not exists "uuid-ossp";

-- 1. Profiles
create table if not exists public.chispa_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text default 'es-MX',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Projects
create table if not exists public.chispa_projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete set null,
  slug text unique not null,
  name text not null,
  project_type text not null,
  category text,
  description text,
  locale text default 'es-MX',
  currency text default 'MXN',
  target_location text,
  status text default 'active',
  visibility text default 'private',
  budget_min_cents integer default 0,
  budget_max_cents integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Members
create table if not exists public.chispa_project_members (
  project_id uuid references public.chispa_projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz default now(),
  primary key (project_id, user_id)
);

-- 4. Timeline
create table if not exists public.chispa_timeline_entries (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  label text not null,
  description text,
  sort_order integer default 0
);

-- 5. Shopping Items
create table if not exists public.chispa_shopping_items (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  category text,
  name text not null,
  variant text,
  quantity numeric default 1,
  unit text,
  required boolean default true,
  recommended boolean default true,
  priority text default 'medium',
  status text default 'not_purchased',
  currency text default 'MXN',
  price_min_cents integer default 0,
  price_max_cents integer default 0,
  why text,
  usage text,
  specifications jsonb default '[]'::jsonb,
  warnings jsonb default '[]'::jsonb,
  verification_required boolean default false,
  verification_status text default 'unverified',
  last_verified_at timestamptz,
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Shopping Links
create table if not exists public.chispa_shopping_links (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid references public.chispa_shopping_items(id) on delete cascade,
  label text not null,
  retailer text,
  region text,
  url text not null,
  link_type text default 'product',
  is_active boolean default true,
  last_http_status integer,
  last_checked_at timestamptz,
  price_snapshot_cents integer,
  currency text default 'MXN',
  metadata jsonb default '{}'::jsonb
);

-- 7. Budget Options
create table if not exists public.chispa_budget_options (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  name text not null,
  description text,
  currency text default 'MXN',
  min_total_cents integer default 0,
  max_total_cents integer default 0,
  sort_order integer default 0
);

-- 8. Budget Lines
create table if not exists public.chispa_budget_lines (
  id uuid primary key default uuid_generate_v4(),
  budget_option_id uuid references public.chispa_budget_options(id) on delete cascade,
  item_id uuid references public.chispa_shopping_items(id) on delete set null,
  label text not null,
  min_cents integer default 0,
  max_cents integer default 0,
  quantity numeric default 1,
  sort_order integer default 0
);

-- 9. Protocol Steps
create table if not exists public.chispa_protocol_steps (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  phase text,
  title text not null,
  body text,
  sort_order integer default 0
);

-- 10. Checklist Items
create table if not exists public.chispa_checklist_items (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  label text not null,
  status text default 'open',
  assigned_to uuid references auth.users(id) on delete set null,
  sort_order integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 11. Notes
create table if not exists public.chispa_notes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 12. Attachments
create table if not exists public.chispa_attachments (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  item_id uuid references public.chispa_shopping_items(id) on delete set null,
  uploaded_by uuid references auth.users(id) on delete set null,
  bucket text not null default 'chispa-private',
  path text not null,
  mime_type text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 13. Share Links
create table if not exists public.chispa_share_links (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  token_hash text unique not null,
  permission text check (permission in ('read_only', 'editor')) default 'read_only',
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- 14. Price Checks
create table if not exists public.chispa_price_checks (
  id uuid primary key default uuid_generate_v4(),
  shopping_link_id uuid references public.chispa_shopping_links(id) on delete cascade,
  http_status integer,
  observed_price_cents integer,
  currency text,
  availability text,
  checked_at timestamptz default now(),
  details jsonb default '{}'::jsonb
);

-- 15. Activity Log
create table if not exists public.chispa_activity_log (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.chispa_projects(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz default now()
);

-- Enable RLS on all chispa_* tables
alter table public.chispa_profiles enable row level security;
alter table public.chispa_projects enable row level security;
alter table public.chispa_project_members enable row level security;
alter table public.chispa_timeline_entries enable row level security;
alter table public.chispa_shopping_items enable row level security;
alter table public.chispa_shopping_links enable row level security;
alter table public.chispa_budget_options enable row level security;
alter table public.chispa_budget_lines enable row level security;
alter table public.chispa_protocol_steps enable row level security;
alter table public.chispa_checklist_items enable row level security;
alter table public.chispa_notes enable row level security;
alter table public.chispa_attachments enable row level security;
alter table public.chispa_share_links enable row level security;
alter table public.chispa_price_checks enable row level security;
alter table public.chispa_activity_log enable row level security;

-- Basic Public/Authenticated RLS policies for Chispa
create policy "Allow read for project members or public projects" on public.chispa_projects
  for select using (visibility = 'public' or auth.uid() = owner_id or exists (
    select 1 from public.chispa_project_members where project_id = chispa_projects.id and user_id = auth.uid()
  ));

create policy "Allow read for items of readable projects" on public.chispa_shopping_items
  for select using (exists (
    select 1 from public.chispa_projects p where p.id = chispa_shopping_items.project_id and (p.visibility = 'public' or p.owner_id = auth.uid())
  ));

create policy "Allow read for links of readable items" on public.chispa_shopping_links
  for select using (exists (
    select 1 from public.chispa_shopping_items i join public.chispa_projects p on p.id = i.project_id where i.id = chispa_shopping_links.item_id and (p.visibility = 'public' or p.owner_id = auth.uid())
  ));
