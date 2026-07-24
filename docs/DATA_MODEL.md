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
- no direct `anon` or `authenticated` table grants
- access only through `public.chispa_load_snapshot` and `public.chispa_save_snapshot`

## Application state inside payload

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
- photo/receipt/warranty/serial/return references

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

## Cross-app boundary

Chispa owns only `chispa.*`, its `platform.app_registry` row, and future `chispa-*` storage namespaces. It must not depend on Botanical or other app transactional tables.
