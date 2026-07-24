# Chispa

Chispa is a bilingual (Spanish/English), mobile-first shopping-list PWA for everyday lists, projects, travel, supplier navigation, saved-offer comparison, budgets, spending, shared household memory, and offline use.

## Product model

- **Priorities:** Need to have / Nice to have.
- **Everyday lists:** Personal, Home, Food & household, Health & care, Travel, Gifts, Emergency, Recurring/restock.
- **Projects:** Separate containers with their own checklists, budgets, documents and specialist references. The Starlink solar backup is the first real project example; it is not the app itself.
- **Prices:** Stored in original currency. MXN/USD is derived from one exchange rate. Saved offers compare landed cost: item + shipping + tax + import - discount.
- **Offline:** IndexedDB autosave + service-worker cache.
- **Cloud sharing:** household-code sync through Vercel `/api/sync` into the isolated `chispa` schema on managed Supabase. Optimistic revisions prevent silent stale overwrites.
- **Sharing/export:** read-only links, WhatsApp summaries, JSON/CSV backup and print/PDF.

## Database isolation

Chispa shares one Supabase project with other micro-apps but does not share application tables.

- Supabase project: `botanic-creations`
- Project ref: `cyxdevcjycmffhmwxojh`
- Chispa schema: `chispa`
- Registry: `platform.app_registry`
- Direct table access for `anon`/`authenticated`: revoked
- Cloud access: narrowly scoped `public.chispa_*` RPCs only

The database was approximately 11 MB at the 2026-07-24 capacity check, so the shared-project risk for this V1 is low.

## Production

Vercel project: `chispa` / `prj_hbXYXBFBzyOwJMpcnTTDb0ZCpCXc`

Primary production domain: `https://chispa-nu.vercel.app/`

Cloud health endpoint: `/api/sync-health`

## Portability

Operational and migration contracts live in:

- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/SECURITY.md`
- `docs/MIGRATION.md`
- `docs/ENVIRONMENT.md`
- `supabase/migrations/`

Chispa is intentionally kept exportable to self-hosted Postgres/Supabase later.

## Remaining non-core upgrades

1. Approved binary hero image at `/chispa-hero.webp`; the app uses a neutral fallback until the approved asset is available to the repository writer.
2. Real binary receipt/photo/warranty uploads in the reserved `chispa-private` storage namespace.
3. Supabase Auth + explicit household-membership rows before broader multi-household or sensitive-data use.
4. Formal retailer/API integrations for automated live price retrieval; current V1 uses outbound search plus saved verified offers rather than fabricated prices.
