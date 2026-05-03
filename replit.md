# ONDA - Mindfulness & Wellness Mobile App

> **Лендинг:** https://onda-life.com — основной домен.  
> **Деплой:** push → хостинг (Replit / Vercel / др.) подтягивает изменения и пересобирает. См. `README.md` и `.assistant/MODULE_LANDING.md`.

### Replit: сервер и healthcheck

Лендинг на Replit Autoscale: `landing/server.js` слушает порт 5000. Критично для стабильности:
- **`/health`** — первый маршрут, 200 OK
- **`/`** — кэш `index.html` в памяти; healthcheck по User-Agent → мгновенный ответ
- **Порт** — `PORT=5000` в run, `localPort = 5000` в `.replit`
- **Логи** — `[timestamp] - METHOD /path`, `[root] cached in Xms` / `healthcheck → OK`

При `signal: terminated` — см. раздел «Replit: signal: terminated» в `.assistant/MODULE_LANDING.md`.

## Overview

ONDA is a mobile application for mindfulness and wellness that combines meditation practices with real-time biometric tracking and gamification. The app guides users through progressive "circuits" of consciousness development practices, rewarding completion with virtual currency (OND). It uses real-time health data from Apple Watch, Bluetooth heart rate monitors, and platform health APIs to create adaptive meditation experiences.

**Core Features:**
- Guided meditation and breathing practices with audio
- Real-time heart rate monitoring via Apple Watch, Bluetooth HRM, HealthKit, and Health Connect
- Stress and energy calculation from heart rate variability (HRV)
- Gamification with rewards, achievements, and virtual currency
- Multi-language support (EN, ES, RU, UK, ZH)
- Dark and light themes

## User Preferences

Preferred communication style: Simple, everyday language.

**Development Environment Constraints:**
- User does NOT have a Mac - all iOS builds happen via GitHub Actions + Fastlane → TestFlight
- All UI text and communications should be in Russian
- Code changes should be small and incremental
- Always explain where to insert code and how to verify changes

**Critical Files (do not modify without explicit approval):**
- `src/onda-level1-demo_27.tsx` - Main component (4000+ lines)
- `src/hooks/useVitals.ts` - Vitals calculation from HR
- `src/utils/ondCalculator.ts` - OND reward calculation
- `ios/App/` - Native iOS code
- `supabase/functions/` - Edge Functions

## System Architecture

### Frontend (React PWA)
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| TailwindCSS | Styling |
| i18next | Internationalization (5 languages) |
| Capacitor | Bridge to native iOS APIs |

**Key Directories:**
- `src/components/` - UI components (modals, diagnostics, etc.)
- `src/hooks/` - React hooks for vitals, health data, watch HR
- `src/utils/` - Calculations (biometrics, OND rewards)
- `src/plugins/` - Capacitor plugin wrappers

### iOS Native (Capacitor + Swift)
| Component | Purpose |
|-----------|---------|
| `ios/App/App/` | iPhone app with WKWebView |
| `ios/App/OndaWatch Watch App/` | Apple Watch companion app |
| `OndaWatchPlugin.swift` | Capacitor plugin bridging JS ↔ Swift |
| `WorkoutManager.swift` | HKWorkoutSession for real-time HR streaming |

**Heart Rate Data Flow (Apple Watch → React):**
1. Watch: `WorkoutManager` captures HR via HKWorkoutSession
2. Watch: Sends via WCSession (multi-level: sendMessage → transferUserInfo → queue)
3. iPhone: `OndaWatchPlugin` receives and calls JS via WebView
4. React: `useWatchHeartRate` hook processes the data

**Autonomous Watch Session Features:**
- Three-level data delivery (real-time, background, queued)
- Auto-recovery of HKWorkoutSession on failures
- Extended Runtime Session with auto-restart
- Connection monitoring every 2 seconds
- HR validation (30-220 bpm range)

### Android (WebView)
| Component | Purpose |
|-----------|---------|
| `android-webview/` | Native Android WebView wrapper |
| `MainActivity.kt` | WebView + native bridges |
| Health Connect integration | Android health data API |
| Bluetooth HRM support | Direct BLE heart rate monitors |

### Backend (Supabase)
| Service | Usage |
|---------|-------|
| Auth | Email/password, Google OAuth, Apple Sign-In |
| Database | PostgreSQL - user profiles, progress, practice history |
| Storage | CDN for audio files |
| Edge Functions | Server-side logic (Hume AI integration, etc.) |

**Database Tables:**
- `user_profiles` - Display name, avatar, creation date
- `user_game_progress` - OND balance, completed practices, achievements
- `practice_sessions` - Practice history with biometric data

### CI/CD Pipeline
- **iOS:** GitHub Actions → Fastlane → TestFlight (automatic on push to main)
- **Android:** Manual APK builds via Android Studio or `npm run prepare:android`

## External Dependencies

### Third-Party Services
| Service | Purpose |
|---------|---------|
| Supabase | Backend-as-a-Service (Auth, DB, Storage, Functions) |
| RevenueCat | Subscription management |
| Google Analytics | Usage analytics |
| Meta Pixel | Marketing analytics |
| Google AdSense | Monetization (production only) |

### Native SDKs & APIs
| Platform | Integration |
|----------|-------------|
| iOS | HealthKit, WatchConnectivity, Apple Sign-In |
| Android | Health Connect, Bluetooth LE |
| Watch | HKWorkoutSession, HKLiveWorkoutBuilder |

### Key NPM Packages
- `@capacitor/core`, `@capacitor/ios` - Native bridge
- `@supabase/supabase-js` - Supabase client
- `@revenuecat/purchases-capacitor` - In-app purchases
- `capacitor-health` - HealthKit integration
- `i18next`, `react-i18next` - Translations
- `lucide-react` - Icons

### Audio Content
- Practice audio files hosted on Supabase Storage CDN
- Large files uploaded via TUS protocol (`scripts/upload-large-audio-tus.ts`)

---

## Landing Site: Performance Architecture (Sprint 2026-05)

**Main client bundle: 19 KB / 5.5 KB gzip** (was 3.3 MB / 954 KB before sprint).

Two big wins:
1. **Article body split** — `landing/scripts/articles-meta.ts` runs in the build pipeline (before `tsc -b`) and emits `landing/src/data/articles/articles-meta.generated.ts` (Article minus `content`/`howToSteps`) + `term-articles.generated.ts` (precomputed glossary-term → article-slug map). HomePage's `ArticlesSection`, `ArticlesPage`, `SitemapPage`, `GlossaryTermPage` import from the generated meta. The full `data/articles/index.ts` (with content) stays sync only for `ArticlePage` (lazy chunk on client) and `entry-server.tsx` (build-time SSR).

2. **Per-language i18n lazy-load** — `landing/src/i18n.ts` now initializes i18next with empty resources and exposes `loadLocale(lang)` which fetches `/locales/${lang}/${ns}.json` from the public folder. `main.tsx` awaits the active language (and EN fallback) before `hydrateRoot()` so SSR-translated HTML matches React's first render. Layout's URL-driven language switch awaits `loadLocale` before flipping `i18n.changeLanguage`. SSR uses `landing/src/i18n-server.ts`, which statically imports every `public/locales/**/*.json` and registers them on the shared i18next instance — never reachable from `main.tsx`, so it stays out of the client bundle.

Other sprint changes:
- `vite.config.ts` — `manualChunks` splits vendor-react / vendor-router / vendor-i18n / vendor-markdown / vendor-supabase / vendor; `cssCodeSplit: true`; `assetsInlineLimit: 2048`. `package.json` build script prefixes every step with `NODE_OPTIONS='--max-old-space-size=4096'`.
- `landing/scripts/prerender.ts` — JSDOM removed; template pre-split once around `<div id="root"></div>` (`TEMPLATE_HEAD`/`TEMPLATE_TAIL` constants), per-route is string concat. 544 routes prerendered in ~16 s.
- `landing/server.js` — static middleware sets `max-age=31536000 immutable` for `/assets/*` + fonts, `max-age=3600 must-revalidate` for the rest (incl. `/locales/*`), ETag enabled.

## Landing Site: Articles System

Полный чеклист добавления новой статьи — в **`.assistant/MODULE_LANDING.md`**, раздел «Чеклист: добавление новой статьи».

Краткая сводка обязательных мест:

| Шаг | Файл | Что добавить |
|-----|------|-------------|
| 1 | `landing/src/data/articles/<slug>.ts` | Файл статьи |
| 2 | `landing/src/data/articles/index.ts` | Импорт + включить в массив |
| 3 | `landing/src/pages/ArticlePage.tsx` → `ARTICLE_SYNC_TIMES` | `'<slug>': '4 min 30 sec'` — без этого показывается `[-]` |
| 4 | `landing/scripts/meta-inject.ts` | `ARTICLE_SEO_TITLES`, `ARTICLE_SEO_DESCRIPTIONS`, `techArticleExtras`, `FAQ_SCHEMA` |
| 5 | `landing/public/images/articles/` | Картинка `.png` + `.webp` |
| 6 | `cd landing && npm run build` | Пересборка + пререндер |

---

## Debug Tools

### DebugMonitor (`src/components/DebugMonitor.tsx`)
Плавающая панель логов приложения. Перехватывает `console.log/warn/error`, показывает build-инфо (номер сборки, commit hash, branch).

**Скрыт по умолчанию.** Включается через `localStorage`:
```js
localStorage.setItem('debugMode', 'true'); location.reload();
```
Выключается: `localStorage.removeItem('debugMode'); location.reload();`

Рендерится дважды в `src/onda-level1-demo_27.tsx`:
- Строка ~2828 — во время активной практики
- Строка ~4317 — на главном экране

### Debug Banner
Строка `🔧 DEBUG: ...` вверху экрана (fixed top, z-200). Показывает `debugInfo` и кнопку «Test Sentry».  
Тоже скрыт — завязан на `localStorage.debugMode === 'true'`. Находится в `src/onda-level1-demo_27.tsx` ~строка 4326.
## Glossary Localization (Phase 2 — in progress, started May 2026)

**Goal:** 215 glossary terms × 4 langs (es/ru/uk/zh) ≈ 860 localized pages, max-quality human-style translation.

**Status:**
- Infrastructure: ✅ DONE. Localized routes `/glossary` + `/glossary/:slug`, prerender per-lang meta with EN-fallback canonical for un-translated bodies, sitemap gating via `glossaryHasLocalizedBody()`, hreflang clusters limited to translated langs only. Build clean: 1466 HTML, 0 hreflang violations, 0 jsonld errors.
- Content (`bodies.{slug}.{title,shortDescription,content}` in `public/locales/<lang>/glossary.json`):
  - **EN**: 0 (uses `glossary.ts` as source-of-truth via tField fallback)
  - **ES**: 210/215 (5 gaps: acetylcholine-lens, hydraulic-viscosity, motivational-salience, prediction-error, system-jitter)
  - **RU**: 5/215 (featured: biocomputer, vagus-nerve, neuroplasticity, dopamine, flow-state)
  - **UK**: 0/215
  - **ZH**: 0/215

**Pipeline (per batch):**
1. Read source EN block from `landing/src/data/glossary.ts` (slug located via `rg -n "slug: ['\"]<slug>['\"]"`).
2. Translate title/shortDescription/content (markdown preserved — headings, lists, tables, links, citations).
3. Stage as `/tmp/<lang>_batchN.json` `{ "bodies": { "<slug>": {...} } }`.
4. Merge: `jq -s '.[0] * .[1]' public/locales/<lang>/glossary.json /tmp/<lang>_batchN.json > /tmp/m.json && mv /tmp/m.json public/locales/<lang>/glossary.json`.
5. Build: background `(vite build && tsx scripts/prerender.ts) > /tmp/onda-buildN.log 2>&1 &`, poll with pgrep.
6. Verify: 0 hreflang/jsonld violations, sample `dist/<lang>/glossary/<slug>/index.html` has localized `<title>` + canonical to self.

**Priority order (RU → UK → ZH):** featured 5 → ONDA Protocol category (~22 terms) → Core Concepts → Neuroscience → Body Systems → remaining categories. Featured/categories listed in `landing/src/data/glossary-categories.ts`.

**Files:**
- Source terms: `landing/src/data/glossary.ts` (215 terms, 5704 lines)
- Translations: `landing/public/locales/{en,es,ru,uk,zh}/glossary.json`
- Prerender meta: `applyGlossarySlugLocalizedMeta` in `landing/scripts/prerender.ts` (uses i18next `getFixedT(lang, 'glossary')` + EN term fallback; canonical→EN when body absent)
- Sitemap gate: `glossaryHasLocalizedBody()` + `altsByGlossary` in `landing/scripts/sitemap.ts`

