# Chispa v2 rollback checkpoint

Pre-change production commit: `624be0b70209ff77938fb0fb66296437fdf82646`

This commit is the exact rollback point before the Chispa information-architecture, currency, pricing, navigation, and PWA update. To restore, move `main` back to that commit or redeploy that Vercel deployment.

Protected data behavior: the v2 client migrates the existing IndexedDB state rather than intentionally clearing it.