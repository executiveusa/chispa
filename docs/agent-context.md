# Agent Context — Chispa V2

## Repo Purpose
Chispa is a bilingual household shopping, project management, price comparison, and offline-first budget application.

## Stack
- Frontend: HTML5, CSS3, Vanilla JS (ES Modules, PWA ready)
- Local Storage: IndexedDB (`chispa-db`)
- Cloud Backend: Supabase Managed Postgres (`chispa` schema) via Vercel serverless endpoints (`/api/sync`, `/api/files`)
- RLS Isolation: Secured via SHA-256 household key verification (`x-chispa-household-key`)

## V2 Navigation & Views
1. `Home`: Hero banner (`hero-chispa.jpg`), Quick Add bar, Shopping Summary (Need vs Nice count), Total Spent, Active Projects card (Solar), Recent activity feed.
2. `Shopping Lists`: Everyday household shopping manager, list categories, full CRUD operations.
3. `Projects`: Dedicated containers (Solar, Hydroponics, Remodel, Vacation, etc.) with isolated checklists, budgets, receipts, photos, and wiring.
4. `Budget`: Real landed cost calculation engine (tax, shipping, discounts, need vs nice, store/category running totals).
5. `Search`: Saved items search, history, multi-store search links (Amazon MX/US, Mercado Libre, Temu, Home Depot, Costco, Walmart).
6. `Settings`: Bilingual toggle (ES/EN), USD/MXN exchange rate, Cloud Sync management, JSON/CSV Export & Import.

## Mobile Navigation
- Discreet 6-item bottom navigation bar for touch-friendly mobile access.

## Verification & Quality
- 100% button audit: Zero dead links or fake placeholder handlers remain.
- IndexedDB offline local-first persistence verified.
- Node syntax check passed on all JS modules.
