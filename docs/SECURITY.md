# Chispa Security

## Threat model

Primary risks:
- cross-household data access
- cross-app spillover in shared Supabase
- leaked privileged credentials
- silent overwrite during concurrent edits
- overly broad storage access

## Current controls

### App isolation
- dedicated `chispa` schema
- registry entry in `platform.app_registry`
- no Chispa queries against unrelated application tables

### Table access
- `chispa.household_snapshots` has RLS enabled and forced
- direct grants to `anon` and `authenticated` are revoked
- browser code does not connect to the private table

### RPC boundary
Only these public RPCs are exposed for Chispa sync:
- `public.chispa_load_snapshot(text)`
- `public.chispa_save_snapshot(text,jsonb,bigint)`

The household key must match `chispa-<64 lowercase hex>`.

### Household secret
The human household code is normalized and SHA-256 hashed in the browser. The raw code is not sent to the sync endpoint.

This is acceptable only for the initial low-sensitivity two-person V1. Before broader multi-household or sensitive use, add Supabase Auth and explicit `household_members` authorization.

### Conflict safety
Cloud rows carry a monotonic `revision`. Stale expected revisions return a conflict instead of silently overwriting newer cloud state.

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
- RPC save smoke test
- RPC load smoke test
- test data cleanup

Manual acceptance still required:
- two real devices join same household
- device A edit appears on device B
- device B edit appears on device A
- simultaneous divergent edits show conflict rather than silent overwrite

## Storage

No private binary upload is enabled yet. Future files must use the reserved `chispa-private` namespace with tenant-aware storage policies. Do not reuse `botanical-images`.
