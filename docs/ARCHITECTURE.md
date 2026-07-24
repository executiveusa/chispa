# Chispa Architecture

## System

```text
Browser/PWA
  ├─ UI: index.html + app.js
  ├─ Local-first persistence: IndexedDB
  ├─ Offline shell: service worker
  ├─ Cloud sync adapter: cloud-sync.js
  │         ↓
  │    /api/sync (Vercel)
  │         ↓
  │    public.chispa_* snapshot RPCs
  │         ↓ RLS
  │    chispa.household_snapshots
  │
  └─ Private file UI: files-ui.js
            ↓
       /api/files (Vercel)
            ↓
       public.chispa_* file RPCs
            ↓ RLS
       chispa.files
```

## Isolation

- App schema: `chispa`
- Shared registry schema: `platform`
- Cross-app data access: denied by default
- Botanical and other app transactional tables/buckets are not queried by Chispa
- snapshot and private-file rows are constrained by the same derived household key
- RPC functions are SECURITY INVOKER so RLS remains authoritative

## Local-first behavior

1. User changes are written to IndexedDB.
2. Connected households sync approximately every five seconds while online.
3. Cloud snapshot writes use optimistic revision checking.
4. Remote changes are adopted only after a local pre-cloud backup is stored.
5. Two-sided changes produce a conflict state rather than a silent overwrite.
6. Photos, receipts and warranties are uploaded only when Shared Cloud is connected; the item stores a portable `/api/files` reference.
7. Replacing or removing a Chispa-managed file cleans up the old binary row.

## V1 cloud model

One JSON snapshot is stored per household key. This intentionally keeps lists/items/projects simple and portable for the first household.

Small private files are stored separately in `chispa.files` so snapshot payloads remain below the sync size limit. Files are capped at 2 MB and large mobile photos are compressed client-side.

A later scale phase may normalize lists/items/offers into relational rows and optionally move files to authenticated object storage after the real workflow is proven.

## Deployment

- GitHub: `executiveusa/chispa`
- `main` auto-deploys to Vercel production
- Production: `https://chispa-nu.vercel.app`
- Health: `/api/sync-health` and `/api/files-health`

## Rollback

IndexedDB remains available if cloud sync fails. Managed Supabase can later be replaced by restoring the Chispa schema/RPC contract on self-hosted Postgres/Supabase and repointing both `/api/sync` and `/api/files`.
