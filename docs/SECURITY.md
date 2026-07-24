# Chispa Security

## Threat model

Primary risks:
- cross-household data access
- cross-app spillover in shared Supabase
- leaked privileged credentials
- silent overwrite during concurrent edits
- orphaned or overly broad private file access

## Current controls

### App isolation
- dedicated `chispa` schema
- registry entry in `platform.app_registry`
- no Chispa queries against unrelated application tables

### Table access
- `chispa.household_snapshots` and `chispa.files` have RLS enabled and forced
- `anon`/`authenticated` privileges are limited to operations required by SECURITY INVOKER RPCs
- RLS only permits rows whose `household_key` exactly matches the `x-chispa-household-key` request header
- browser code does not query Chispa private tables directly; Vercel API boundaries validate and forward the derived household key

### RPC boundary
Public Chispa RPC surface:
- `public.chispa_load_snapshot(text)`
- `public.chispa_save_snapshot(text,jsonb,bigint)`
- `public.chispa_save_file(text,text,text,text,text,text)`
- `public.chispa_load_file(text,uuid)`
- `public.chispa_delete_file(text,uuid)`

These functions run as `SECURITY INVOKER`, so Postgres RLS remains authoritative. They reject a mismatch between the RPC argument and request household header.

The household key must match `chispa-<64 lowercase hex>`.

### Household secret
The human household code is normalized and SHA-256 hashed in the browser. The raw code is not sent to the sync/file endpoints.

This is appropriate for the initial low-sensitivity two-person V1. Before broader multi-household or sensitive use, add Supabase Auth and explicit `household_members` authorization.

### Conflict safety
Cloud snapshots carry a monotonic `revision`. Stale expected revisions return a conflict instead of silently overwriting newer cloud state.

### Private files
- photos, receipts and warranties are persisted in `chispa.files`
- each file row carries `household_key`
- maximum persisted file size is 2 MB
- accepted MIME types: JPEG, PNG, WebP and PDF
- large images are compressed client-side before upload
- `/api/files` validates household key, file UUID, type and size
- replacing or explicitly removing a Chispa-managed file deletes the old binary row
- the reserved `chispa-private` Storage bucket remains private and is not used by V1 after Storage did not expose the custom household header to the policy context

## Secret policy

Safe client/public values may include project URL and anon/publishable credentials.

Never expose:
- service-role key
- database password
- direct privileged connection string
- SSH credentials
- `Cosmos_Vault.env` contents

## Required verification

Completed:
- RLS-protected snapshot save/load smoke tests
- mismatched household key denial
- production `/api/sync-health` returns connected with `rls+rpc`
- private file save/load/delete completed end-to-end and cleaned up
- production `/api/files-health` confirms the file RPC/RLS backend is reachable
- post-hardening Supabase advisor no longer flags Chispa snapshot RPCs as anonymous SECURITY DEFINER functions

Physical acceptance still required for the only workflow a server cannot simulate:
- two real devices join the same household
- device A edit appears on device B
- device B edit appears on device A
- simultaneous divergent edits show conflict rather than silent overwrite

## Unrelated project warnings

Any remaining shared-project advisor warnings that reference Botanical infrastructure are outside Chispa's namespace and should be remediated in the owning app without weakening Chispa isolation.
