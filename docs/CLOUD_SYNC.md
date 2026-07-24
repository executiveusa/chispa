# Chispa household cloud sync

## Architecture

IndexedDB is always written first. Cloud sync is optional and additive.

`browser → IndexedDB → /api/sync → self-hosted Supabase RPC → work.submissions`

The existing `save_submission` / `load_submission` RPC pair is reused for Phase 1. A household code is never sent to the server. The browser derives `SHA-256("chispa:v1:" + normalizedCode)` and sends only `chispa-<hash>` as the shared device/household identifier.

## Safety rules

- Local data remains available if Supabase is offline.
- Joining an existing household backs up the local state in IndexedDB before adopting cloud state.
- Before overwriting cloud data, the client loads remote state and detects whether both local and remote changed since the last successful sync.
- A two-sided change becomes `conflict` and is not silently overwritten.
- Household code is the shared secret. Generated codes use 20 random characters from an ambiguity-reduced alphabet.
- Chispa cloud payloads are capped at 900 KB in the Vercel API proxy.

## Provisioning blocker

Run `supabase/migrations/001_chispa_project.sql` once on the self-hosted Supabase database. The project UUID is deliberately pinned to:

`c0000000-0000-0000-0000-000000000001`

The migration refuses to proceed if it cannot find the existing `The Pauli Effect` company row, preventing accidental attachment to another company.

## Current Phase 1 limitation

This uses one cloud snapshot per household. It is appropriate for the initial two-person household. A later normalized/realtime model can split lists/items/offers into row-level records with optimistic revisions once the workflow is proven.