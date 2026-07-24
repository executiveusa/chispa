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
- full `chispa` schema, including `household_snapshots` and `files`
- `public.chispa_load_snapshot`
- `public.chispa_save_snapshot`
- `public.chispa_save_file`
- `public.chispa_load_file`
- `public.chispa_delete_file`
- Chispa row in `platform.app_registry`
- reserved `chispa-private` bucket metadata only if the target will use Supabase Storage later

Do not export unrelated Botanical or other app data.

## Conceptual database export

```bash
pg_dump \
  --schema=chispa \
  --format=custom \
  "$SOURCE_DATABASE_URL" \
  > chispa.dump
```

The `chispa.files` table contains V1 binary photo/receipt/warranty data, so it is included automatically in the schema dump.

Because Chispa RPC functions live in `public`, preserve their definitions from the repository migrations or dump/recreate them explicitly.

## Restore

```bash
pg_restore \
  --dbname="$DEST_DATABASE_URL" \
  chispa.dump
```

Then apply the Chispa RPC migrations and recreate/update the Chispa registry row.

## Source of truth

Use repository SQL migrations under `supabase/migrations/`:
- `002_managed_supabase_snapshot.sql`
- `003_harden_chispa_rls_rpc_boundary.sql`
- `004_chispa_private_storage.sql` records the reserved private bucket experiment
- `005_chispa_private_files_postgres.sql` is the active V1 private-file backend

Migration 005 intentionally stores small private files in Postgres behind the same household RLS boundary. The reserved Storage bucket is not part of active V1 file serving.

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

1. Check current Supabase capacity and health, including `chispa.files` size/count.
2. Freeze or coordinate writes if required.
3. Create source backup.
4. Inventory selected Hostinger target.
5. Export only Chispa-owned data/schema/functions and any active file backend.
6. Restore to chosen self-hosted Postgres/Supabase destination.
7. Recreate RPCs, RLS, grants, indexes, and optional Storage configuration.
8. Verify snapshot row counts, file row counts, sample files, and checksums where practical.
9. Run cross-household and cross-app isolation tests.
10. Repoint `/api/sync` and `/api/files` configuration.
11. Deploy Vercel production.
12. Test two-device sync and file open/upload/remove.
13. Keep managed Supabase intact until owner acceptance.

## Optional file-storage transition

At migration time, choose either:
- keep `chispa.files` in Postgres for the initial self-hosted version; or
- move binary rows to an isolated private object-storage bucket and rewrite stored item references through a controlled migration.

Do not mix Chispa files into another app's bucket.

## Rollback

Rollback consists of restoring the previous Vercel deployment/configuration and repointing sync/file APIs to the managed Supabase source, which must remain untouched until migration acceptance.
