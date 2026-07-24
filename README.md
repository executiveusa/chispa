# Chispa

Chispa is a bilingual (Spanish/English), mobile-first shopping-list PWA for everyday lists, projects, travel, supplier navigation, saved-offer comparison, budgets, spending, and offline memory.

## Product model

- **Priorities:** Need to have / Nice to have.
- **Everyday lists:** Personal, Home, Food & household, Health & care, Travel, Gifts, Emergency, Recurring/restock.
- **Projects:** Separate containers with their own checklists, budgets, documents and specialist references. The Starlink solar backup is the first real project example; it is not the app itself.
- **Prices:** Stored in original currency. MXN/USD is derived from one exchange rate. Saved offers compare landed cost: item + shipping + tax + import - discount.
- **Offline:** IndexedDB autosave + service-worker cache.
- **Sharing:** Read-only links, WhatsApp summaries, JSON/CSV backup and print/PDF. Shared editing is reserved for the self-hosted Supabase connection.

## Production

Vercel project: `chispa` / `prj_hbXYXBFBzyOwJMpcnTTDb0ZCpCXc`

Primary production domain: `https://chispa-nu.vercel.app/`

## Remaining external connections

1. Self-hosted Supabase endpoint/public client configuration for household multi-device editing and cloud file storage.
2. Approved binary hero image at `/chispa-hero.webp`; the app has a neutral fallback until that asset is available to the repository writer.
