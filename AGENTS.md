# AGENTS.md

## App identity
- App: Chispa
- Slug: `chispa`
- Purpose: bilingual household shopping, project lists, price comparison, purchase memory, private receipts/documents, offline-first shared planning
- Owner: The Pauli Effect
- Intended users: initial two-person household; architecture remains household-ready

## Repository
- GitHub: `https://github.com/executiveusa/chispa`
- Default branch: `main`
- Production branch: `main`

## Production
- Production URL: `https://chispa-nu.vercel.app`
- Vercel project: `chispa`
- Vercel project ID: `prj_hbXYXBFBzyOwJMpcnTTDb0ZCpCXc`

## Architecture
```text
PWA/browser
  ├─ IndexedDB local-first state
  │      ↓
  │   /api/sync on Vercel
  │      ↓ x-chispa-household-key
  │   public.chispa_* snapshot RPCs
  │      ↓ RLS
  │   chispa.household_snapshots
  │
  └─ Item photo/receipt/warranty upload
         ↓ /api/files
      public.chispa_* file RPCs
         ↓ RLS
      chispa.files
```

## Database
- Provider: Supabase managed Postgres
- Supabase organization: `jointhepaulieffect@gmail.com's Org`
- Supabase project: `botanic-creations`
- Project ref: `cyxdevcjycmffhmwxojh`
- Region: `us-west-1`
- Plan: Free
- PostgreSQL: 17.x
- Database size at 2026-07-24 check: about 11 MB

## Schema namespace
- App schema: `chispa`
- Shared platform schema: `platform`
- Registry: `platform.app_registry`
- Forbidden direct cross-app access: all unrelated schemas/tables, including Botanical application tables in `public`

## Namespace collision status
- [x] `app_slug=chispa` unique
- [x] `schema_name=chispa` unique
- [x] storage namespace reserved as `chispa-private`
- [x] RPC prefix `chispa_` used for Chispa only
- [x] registry entry created

## Tenancy
- Model: household
- Current V1 cloud key: high-entropy household code is normalized and SHA-256 hashed client-side; only the `chispa-<64 hex>` derived key reaches the backend
- Cloud persistence is one snapshot per household for V1
- Private files carry the same derived `household_key`

## Authentication
- Current V1: local-first household-code sharing
- Planned scale hardening: Supabase Auth magic-link/OTP plus household membership rows before sensitive or broader multi-household use
- The household code is a bearer-style shared secret for this initial household V1; do not reuse this pattern for sensitive multi-tenant apps

## RLS model
- `chispa.household_snapshots` and `chispa.files` have RLS enabled and forced
- narrowly scoped table privileges exist only so SECURITY INVOKER RPCs can operate
- RLS requires row `household_key` to exactly equal the validated `x-chispa-household-key` request header
- `/api/sync` and `/api/files` add that header after validating the derived household-key format
- Chispa RPCs run as SECURITY INVOKER, so RLS remains authoritative
- RPC argument/header mismatch is explicitly rejected
- snapshot `revision` prevents silent stale overwrites

Required tests:
- [x] RLS-protected snapshot save/load works for matching household key/header
- [x] mismatched household key/header is denied
- [x] production `/api/sync-health` reports `database=connected` and `isolation=rls+rpc`
- [x] private file save/load/delete completed end-to-end through the RLS RPC path
- [x] production `/api/files-health` reports the private file backend connected
- [x] no Chispa anonymous SECURITY DEFINER advisor warning remains after hardening
- [ ] two physical devices using the same household code verified by owner
- [ ] simultaneous real-device conflict UX verified manually

## Storage
- V1 product photos, receipts, and warranties are stored in `chispa.files` as private Postgres binary data behind household RLS
- Maximum persisted file size: 2 MB
- Large phone images are compressed client-side before upload
- Replacing or removing a Chispa-managed file deletes the old binary record to limit orphan growth
- Reserved bucket `chispa-private` exists but is not used by V1; its temporary anonymous policies were removed after Storage did not expose the custom household header to the policy context
- Do not use `botanical-images` or any other app bucket
- When Supabase Auth is added, migrating binaries from `chispa.files` into `chispa-private` is optional and should preserve the same app/tenant isolation contract

## Environment variable names
Current sync/file APIs use the Supabase project URL and public anon credential only. No service-role or database password is required for V1 application traffic.

Future server-only variables may include:
```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```
Never place privileged values in frontend code or documentation.

## Deployment
- Frontend/API host: Vercel
- Git integration: `main` → production
- PWA: service worker + IndexedDB
- Production alias: `https://chispa-nu.vercel.app`

## Backup
- Local: IndexedDB plus JSON/CSV export
- Cloud state: `chispa.household_snapshots`
- Private documents: `chispa.files`
- Before cloud adoption, Chispa stores a `pre-cloud-*` IndexedDB backup

## Restore
- Local JSON import restores application state
- Cloud household join loads the shared snapshot after first backing up local state
- File references in the snapshot resolve through `/api/files` to `chispa.files`
- Self-host migration uses `docs/MIGRATION.md` and `MIGRATION_HANDOFF.md`

## Capacity status
Last checked: 2026-07-24
- Database size: ~11 MB before normal Chispa usage
- Project health: active/healthy
- Risk: LOW for Chispa V1
- Binary files consume database quota, so capacity checks must include `chispa.files`
- Migration planning threshold: roughly 70–80% practical shared capacity or earlier for performance/security/business reasons

## Migration trigger status
- [x] Not needed now
- [ ] Prepare migration
- [ ] Approved
- [ ] In progress
- [ ] Migrated

# ONE-CLICK MIGRATION HANDOFF

Trigger phrases:
- `migrate this app`
- `move this to our server`
- `self host this`
- `database space is getting low`
- `export this app`

When triggered:
1. Create or refresh `MIGRATION_HANDOFF.md`.
2. Read this file fully.
3. Read `docs/MIGRATION.md`.
4. Check current Supabase capacity, including `chispa.files` size.
5. Inventory only the `chispa` schema, Chispa RPCs, registry row, reserved storage namespace, and deployment config.
6. Ask the Migration Placement Questions.
7. Access local secrets only from `E:\THE PAULI FILES\Cosmos_Vault.env` when that path is actually accessible from the execution environment.
8. Never print, echo, commit, log, screenshot, or expose secret values.
9. SSH into the selected Hostinger server.
10. Inventory existing Supabase/Postgres targets.
11. Ask target DB/schema if ambiguous.
12. Backup source and target.
13. Export only Chispa-owned database objects/data/files.
14. Import and recreate RLS/grants/functions/triggers/indexes/storage/jobs.
15. Verify snapshot counts, file counts, conflict behavior, cross-app denial, and production health.
16. Update environment variables and deploy.
17. Keep managed Supabase as rollback until owner acceptance.
18. Update this file and `MIGRATION_HANDOFF.md`.

## Migration Placement Questions
1. Which Hostinger VPS/server should host this app?
2. Existing self-hosted Supabase, new Postgres DB, new Supabase stack, or another server?
3. Dedicated database or isolated schema?
4. Production domain/subdomain?
5. Migrate auth users?
6. Move file storage now or keep binary files in Postgres initially?
7. Zero/near-zero downtime or short maintenance window?
8. How long keep managed Supabase as rollback?
