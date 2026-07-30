# AGENTS.md — Chispa & Felipe Execution Contract

## App Identity & Scope
- **App Name:** Chispa
- **Slug:** `chispa`
- **Purpose:** Personal operations, bilingual household shopping, project lists, price comparison, purchase memory, private receipts, offline-first execution, and interactive project management (Felipe Kit de Arenero).
- **Owner:** The Pauli Effect

## Production & Infrastructure
- **GitHub:** `https://github.com/executiveusa/chispa`
- **Vercel Project:** `chispa` (`prj_hbXYXBFBzyOwJMpcnTTDb0ZCpCXc`)
- **Vercel Domains:** `https://chispa-nu.vercel.app`, `https://chispa-the-pauli-effect.vercel.app`
- **Supabase Project:** `botanic-creations` (`cyxdevcjycmffhmwxojh`, Region `us-west-1`)
- **Supabase URL:** `https://cyxdevcjycmffhmwxojh.supabase.co`

## Strict Operating Rules
1. **NO EMOJIS ANYWHERE IN THE PRODUCTION INTERFACE**: Use text and restrained line icons only.
2. **SUPABASE ISOLATION**: All Chispa tables MUST be prefixed with `chispa_`. Do NOT modify, alter, truncate, or reference existing public tables (`products`, `settings`, `orders`, `profiles`, etc.).
3. **NEVER EXPOSE SECRETS**: Publishable key `sb_publishable_PoqI-3PsCqewtJWJ0Z73Ag_5hIE0oKI` is used in client code. Never expose `SUPABASE_SERVICE_ROLE_KEY`, DB passwords, or signing secrets.
4. **HTML-FIRST AUDIT WORKFLOW**: Update `artifacts/design-audit/audit.html`, `prd.html`, `fix-lab.html`, and `implementation-report.html` with verifiable evidence.
5. **FELIPE SEED DATA INTEGRITY**: 4 items, 5 purchase links, 2 budget options, 5 setup steps, 7 checklist items, 4 timeline entries. All content in `es-MX`.

## System Layout
```text
executiveusa/chispa/
  .mcp.json
  AGENTS.md
  .claude/skills/
  agent-tools/
    reference-lock.json
    install-skills.mjs
    verify-tools.mjs
  artifacts/
    design-audit/
      audit.html
      prd.html
      fix-lab.html
      implementation-report.html
      screenshots/
    knowledge-graph/
  openspec/changes/chispa-felipe-production/
  rollback/
  docs/system/
  supabase/migrations/
```
