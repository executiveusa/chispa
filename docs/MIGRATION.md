# Chispa Migration

## Current source

- Provider: Supabase managed Postgres
- Organization: `jointhepaulieffect@gmail.com's Org`
- Project: `botanic-creations`
- Project ref: `cyxdevcjycmffhmwxojh`
- App schema: `chispa`
- Registry: `platform.app_registry`
- Production: `https://chispa-nu.vercel.app`

## Export scope

Export only Chispa-owned objects:
- `chispa` schema
- `public.chispa_load_snapshot`
- `public.chispa_save_snapshot`
- Chispa row in `platform.app_registry`
- future `chispa-*` storage namespaces

Do not export unrelated Botanical or other app data.

## Conceptual database export

```bash
pg_dump \
  --schema=chispa \
  --format=custom \
  "$SOURCE_DATABASE_URL" \
  > chispa.dump
```

Because the two Chispa RPC functions live in `public`, also preserve their definitions from migrations or explicitly dump/recreate them.

## Restore

```bash
pg_restore \
  --dbname="$DEST_DATABASE_URL" \
  chispa.dump
```

Then apply the Chispa RPC migration and recreate the registry row.

## Source of truth

Use repository SQL migrations under `supabase/migrations/`. The managed V1 backend is recorded in:

`supabase/migrations/002_managed_supabase_snapshot.sql`

## Self-host trigger

When the owner says:
- migrate this app
- move this to our server
- self host this
- database space is getting low
- export this app

Create/update `MIGRATION_HANDOFF.md` and ask the placement questions from `AGENTS.md`.

## Secret handling

When running in an environment that can access the local Windows drive, obtain Hostinger/DB credentials from:

`E:\THE PAULI FILES\Cosmos_Vault.env`

Never print, echo, commit, log, screenshot, or paste secret values into chat.

## Cutover sequence

1. Check current Supabase capacity and health.
2. Freeze or coordinate writes if required.
3. Create source backup.
4. Inventory selected Hostinger target.
5. Export only Chispa-owned data/schema/functions/storage.
6. Restore to chosen self-hosted Postgres/Supabase destination.
7. Recreate RPCs, RLS, grants, indexes, storage policies, and jobs.
8. Verify counts and sample records.
9. Run cross-app isolation tests.
10. Repoint `/api/sync` configuration.
11. Deploy Vercel production.
12. Test two-device sync.
13. Keep managed Supabase intact until owner acceptance.

## Rollback

Rollback consists of restoring the previous Vercel deployment/configuration and repointing sync to the managed Supabase source, which must remain untouched until migration acceptance.
