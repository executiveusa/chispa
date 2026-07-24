# Chispa Architecture

## System

```text
Browser/PWA
  ├─ UI: index.html + app.js
  ├─ Local-first persistence: IndexedDB
  ├─ Offline shell: service worker
  └─ Cloud sync adapter: cloud-sync.js
            ↓
       /api/sync (Vercel)
            ↓
   public.chispa_* RPCs
            ↓
  chispa.household_snapshots
```

## Isolation

- App schema: `chispa`
- Shared registry schema: `platform`
- Cross-app data access: denied by default
- Botanical and other app tables are not queried by Chispa
- Direct grants on `chispa.household_snapshots` are revoked from `anon` and `authenticated`

## Local-first behavior

1. User changes are written to IndexedDB.
2. Connected households sync approximately every five seconds while online.
3. Cloud writes use optimistic revision checking.
4. Remote changes are adopted only after a local pre-cloud backup is stored.
5. Two-sided changes produce a conflict state rather than a silent overwrite.

## V1 cloud model

One JSON snapshot is stored per household key. This is intentionally simple for the first two-person household and keeps V1 fast and portable.

A later scale phase may normalize lists/items/offers into relational rows after the real workflow is proven.

## Deployment

- GitHub: `executiveusa/chispa`
- `main` auto-deploys to Vercel production
- Production: `https://chispa-nu.vercel.app`

## Rollback

The local IndexedDB state remains available even if cloud sync fails. Managed Supabase can be replaced later by restoring the Chispa schema/RPC contract on self-hosted Postgres/Supabase and repointing the server sync boundary.
