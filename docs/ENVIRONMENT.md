# Chispa Environment

Document variable names only. Never commit privileged values.

## Current managed V1

The Vercel sync endpoint currently uses only a Supabase project URL plus a public anon credential to call narrowly scoped RPCs. No service-role or database password is required for normal V1 sync.

## Client/public-safe categories

```text
SUPABASE_URL
SUPABASE_ANON_KEY
```

## Server-only categories for future phases

```text
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
```

Never expose server-only values in browser bundles.

## Self-host migration secret source

When a local-capable agent environment can access it:

`E:\THE PAULI FILES\Cosmos_Vault.env`

Use the vault only to retrieve required Hostinger SSH/database credentials. Never print, echo, commit, log, screenshot, or paste vault contents into chat.
