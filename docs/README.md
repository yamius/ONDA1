# ONDA — Documentation

Documentation for the ONDA monorepo: an **iOS app** (React + Capacitor, in `src/`
+ native `ios/`), a **landing site** (separate Vite/SSG build, in `landing/`), and
a **Supabase** backend (`supabase/`).

Docs live in three places:

| Where | What |
|---|---|
| **`docs/`** (this tree) | The app, the native layer, the backend, and shared/ops topics. |
| **`landing/docs/`** | Everything specific to the marketing/SEO landing site. |
| **`.assistant/`** | Thin operating instructions for the AI coding agent (points back here). |

> **Current canonical facts** (some archived docs predate these): attribution/MMP is
> **Tenjin** (Airbridge was removed in v1.4.0); emotion analysis is **Hume AI** voice
> (not OpenAI vision); the **ATT prompt was removed** in v1.7.3 (SKAN-only); analytics
> flow through one typed `track()` (see [architecture/analytics.md](architecture/analytics.md)).

---

## Getting started
- [getting-started/environment.md](getting-started/environment.md) — run/build commands + env files (app vs landing)
- [getting-started/setup-ios.md](getting-started/setup-ios.md) — iOS build + TestFlight via GitHub Actions/Fastlane
- [getting-started/build-apk.md](getting-started/build-apk.md) — Android APK build
- [guides/ci-cd-setup.md](guides/ci-cd-setup.md) — GitHub Actions CI/CD

## Architecture (app · native · backend)
- [architecture/overview.md](architecture/overview.md) — system map & data flows
- [architecture/system-snapshot.md](architecture/system-snapshot.md) — dated full-stack snapshot + scale metrics
- [architecture/app-shell-map.md](architecture/app-shell-map.md) — navigation map of the 8.4k-line `onda-level1-demo_27.tsx` shell
- [architecture/frontend.md](architecture/frontend.md) — React app (hooks, vitals, practices, gamification, onboarding)
- [architecture/native.md](architecture/native.md) — iOS/Android native, attribution (Tenjin/Axon/SKAN), RevenueCat
- [architecture/supabase.md](architecture/supabase.md) — DB tables, RLS, Edge Functions
- [architecture/edge-functions.md](architecture/edge-functions.md) — analyze-emotion (Hume), delete-account, revenuecat-webhook
- [architecture/analytics.md](architecture/analytics.md) — **canonical** event schema (Firebase/GA4 + Supabase + Tenjin)
- [architecture/practices.md](architecture/practices.md) — basic vs adaptive practices, OND reward formula
- [architecture/vitals.md](architecture/vitals.md) — stress/energy derivation from HR (formulas)
- [architecture/camera-ppg.md](architecture/camera-ppg.md) — camera heart-rate engine (HR-only contract, pulse-source resolver)
- [architecture/eye-scan.md](architecture/eye-scan.md) — face/eye "Nervous System Scan" (on-device, non-clinical)
- [architecture/watch-hr-flow.md](architecture/watch-hr-flow.md) — Apple Watch → React heart-rate streaming
- [architecture/heart-rate-integration.md](architecture/heart-rate-integration.md) · [architecture/healthkit-solution.md](architecture/healthkit-solution.md) — HR sources (HealthKit / Health Connect)
- [architecture/permissions-solution.md](architecture/permissions-solution.md) — unified permission UX
- [architecture/life-rhythm-artifact.md](architecture/life-rhythm-artifact.md) — sleep-streak artifact
- [architecture/webview-stability.md](architecture/webview-stability.md) — iOS WKWebView OOM/audio-leak workarounds + crash detection
- [architecture/liza-bot.md](architecture/liza-bot.md) — "Liza" ELIZA + scripted-flow chat (local, not a therapist)

## Guides (how-to · ops)
**Monetization:** [guides/in-app-purchase.md](guides/in-app-purchase.md) · [guides/paywall.md](guides/paywall.md)
**Analytics:** [guides/analytics-views.md](guides/analytics-views.md) · [guides/analytics-roadmap.md](guides/analytics-roadmap.md) · [guides/firebase.md](guides/firebase.md)
**Audio/Storage:** [guides/audio-cdn-setup.md](guides/audio-cdn-setup.md) · [guides/upload-large-files.md](guides/upload-large-files.md) · [guides/supabase-migrations.md](guides/supabase-migrations.md)
**Wearables/HR:** [guides/watch-autonomy.md](guides/watch-autonomy.md) · [guides/watch-testing.md](guides/watch-testing.md) · [guides/android-health-connect.md](guides/android-health-connect.md) · [guides/smoke-test-android.md](guides/smoke-test-android.md) · [guides/bluetooth-tracker.md](guides/bluetooth-tracker.md) · [guides/xiaomi-health-connect.md](guides/xiaomi-health-connect.md)
**Build/CI:** [guides/android-debug-build.md](guides/android-debug-build.md) · [guides/keystore-regeneration.md](guides/keystore-regeneration.md)
**Content:** [guides/authoring-content.md](guides/authoring-content.md) (practices/parts) · [guides/telegram-articles-bot.md](guides/telegram-articles-bot.md)

## Release
- [ios-release-history.md](ios-release-history.md) — full iOS version log (1.0 → 1.8.x), approvals & rejections, App Store copy archive

## Landing site
See **[../landing/docs/](../landing/docs/)**:
- [architecture.md](../landing/docs/architecture.md) — routes, articles, glossary, SEO/SSG, Express/CSP server
- [seo-pipeline.md](../landing/docs/seo-pipeline.md) — the SEO/GEO build pipeline (prerender → sitemaps → feeds → llms-txt → rag-corpus → indexnow), build gates
- [tools.md](../landing/docs/tools.md) — interactive tools catalogue + "add a tool" checklist
- [reviews.md](../landing/docs/reviews.md) — product reviews / round-ups / head-to-heads, drip publishing, Review JSON-LD
- [i18n.md](../landing/docs/i18n.md) — 5-language i18n (lazy namespaces, localized routes, soft-404 coverage)
- [emoton.md](../landing/docs/emoton.md) — the Emoton emotional check-in feature
- [roadmap.md](../landing/docs/roadmap.md) — engineering roadmap (perf/SEO/GEO/auto-publish)
- [gsc-audit-runbook.md](../landing/docs/gsc-audit-runbook.md) · [ai-audit-runbook.md](../landing/docs/ai-audit-runbook.md) — SEO/GEO audit runbooks
- [seo-baselines/](../landing/docs/seo-baselines/) — point-in-time GSC baselines

## Pitch & history
- [pitch/](pitch/) — investor/design decks (versioned patch chain)
- [archive/](archive/) — **historical / superseded** docs (removed tech, one-off reports) — see [archive/README.md](archive/README.md)

---

## Documentation coverage

**Phase 2 done** — the previously-undocumented subsystems now have docs (verified
against code): camera-PPG, eye-scan, vitals, webview-stability, liza-bot, the
app-shell map, edge-functions (app/backend) and the landing seo-pipeline, tools,
reviews, i18n.

**Remaining minor gaps** (low priority, not yet documented): OneSignal push
(`services/pushNotifications.ts`), OAuth deep-link handlers (`lib/ios-auth-handler`,
`android-bridge`), small hooks (`useTodaysPractice`, `useHRV7Day`,
`usePracticesProgress`), and the app-side i18n tooling (`scripts/*.cjs`).
