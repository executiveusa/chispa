# Chispa Data Model

## Namespace

- App schema: `chispa`
- Shared registry: `platform.app_registry`

## Current V1 persistence

### `chispa.household_snapshots`

Purpose: one portable cloud snapshot per household for the initial two-person household V1.

Columns:
- `household_key text primary key`
- `payload jsonb not null`
- `revision bigint not null default 1`
- `created_at timestamptz`
- `updated_at timestamptz`

Security:
- RLS enabled and forced
- household-key RLS derived from `x-chispa-household-key`
- access through `public.chispa_load_snapshot` and `public.chispa_save_snapshot`

### `chispa.files`

Purpose: small private product photos, receipts and warranties for the initial V1 without requiring privileged Storage credentials.

Columns:
- `id uuid primary key`
- `household_key text not null`
- `item_id text not null`
- `kind text` constrained to `photo|receipt|warranty`
- `file_name text`
- `mime_type text` constrained to JPEG/PNG/WebP/PDF
- `size_bytes integer` capped at 2,000,000
- `data bytea`
- `created_at timestamptz`

Security:
- RLS enabled and forced
- same household-key RLS boundary as snapshots
- SECURITY INVOKER save/load/delete RPCs
- no cross-app table dependency

## Application state inside snapshot payload

The current state contains:
- lists
- projects
- items
- suppliers
- settings
- UI/meta state

Items distinguish:
- `ct=list|project`
- `cid=<container id>`
- `priority=need|nice`
- status, urgency, assignment, budget, target date
- estimate source amount/currency
- saved offers and landed-cost fields
- purchase fields
- notes
- photo/receipt/warranty references pointing either to an external URL or `/api/files?...`
- serial and return-deadline fields

## Future normalized model

When Chispa outgrows snapshot persistence, migrate within the same `chispa` namespace to normalized tables such as:
- `chispa.households`
- `chispa.household_members`
- `chispa.lists`
- `chispa.projects`
- `chispa.items`
- `chispa.offers`
- `chispa.suppliers`
- `chispa.purchases`
- `chispa.revisions`

Do not normalize prematurely unless real usage requires multi-row realtime, richer audit history, or larger payloads.

Private files may remain in `chispa.files` for small/self-hosted use or later move to an isolated authenticated object-storage bucket.

## Cross-app boundary

Chispa owns only `chispa.*`, its `platform.app_registry` row, its RPC prefix, and reserved `chispa-private` storage namespace. It must not depend on Botanical or other app transactional tables or buckets.
