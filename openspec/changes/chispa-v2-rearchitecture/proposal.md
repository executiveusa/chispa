# Chispa v2 proposal

## Problem
The first production build treated the Starlink solar checklist as the whole application, mixed projects with shopping categories, stored USD and MXN as independent hard-coded prices, and exposed controls that did not perform their implied task.

## Outcome
Make Chispa a bilingual general-purpose shopping/list app. Priorities (Need to have / Nice to have), categories, lists, and projects become separate concepts. The solar system becomes the first project inside Projects.

## Scope
Home, Lists, Search, Projects, More; generic add/list/project flows; solar project subspace; correct single-source currency conversion; offer/landed-cost comparison; local persistence; read-only share links; WhatsApp summaries; supplier navigation; backup/export; PWA cache update.

## Out of scope / blocker
Shared multi-device editing and cloud file uploads require credentials/endpoints for the user's self-hosted Supabase. The app remains local-first until that connection is supplied.

## Rollback
`rollback/2026-07-23-before-chispa-v2/README.md`