# ONDA Life — Техническая документация

> Снимок репозитория на **2026-05-20**. Документ для презентации: архитектура,
> стек, метрики масштаба, ключевые инженерные решения. Цифры (URL, статьи,
> миграции) подсчитаны прямо из репозитория.

---

## 1. Продукт

**ONDA Life** — экосистема из двух связанных продуктов:

| Продукт | Назначение | URL/Платформа |
|---------|------------|---------------|
| **Mobile App** | Биофидбек-практики, медитации, дыхательные упражнения, геймификация (валюта OND, уровни, артефакты) | iOS (App Store) + Android (внешний APK / WebView) |
| **Landing & Knowledge Site** | SEO/контент-маркетинг: 68 статей, 216 терминов glossary, 28 reviews, 11 topic-hubs на 5 языках | onda-life.com |

Связь между продуктами: общая Supabase-база, общая бренд-идентичность, ленд
служит точкой входа в App Store / Google Play и SEO/AI-visibility слоем для
бренда.

---

## 2. Архитектура высокого уровня

```
┌────────────────────────────────────────────────────────────────────┐
│  USER DEVICES                                                       │
│  ┌──────────────────────┐         ┌──────────────────────────────┐  │
│  │  iOS (Capacitor)     │         │  Android (WebView + Kotlin)  │  │
│  │  ├─ WebApp (React)   │         │  ├─ WebApp (React)           │  │
│  │  ├─ Swift plugins    │         │  ├─ HealthConnectManager.kt  │  │
│  │  ├─ Apple Watch app  │         │  ├─ BluetoothManager.kt      │  │
│  │  │   (WatchKit)      │         │  └─ HeartRateService.kt      │  │
│  │  └─ HealthKit        │         └──────────────────────────────┘  │
│  └──────────────────────┘                                            │
└────────────────────────────────────────────────────────────────────┘
                │                                    │
                └──────────┐         ┌───────────────┘
                           ▼         ▼
┌────────────────────────────────────────────────────────────────────┐
│  BACKEND  (Supabase)                                                │
│  ┌──────────┐  ┌──────────────┐  ┌─────────┐  ┌──────────────────┐  │
│  │  Auth    │  │  PostgreSQL  │  │ Storage │  │  Edge Functions   │  │
│  │  + RLS   │  │  20 migrations│  │  audio  │  │  analyze-emotion │  │
│  │          │  │  user_profiles│  │  assets │  │  delete-account  │  │
│  │          │  │  practices    │  │         │  │  revenuecat-     │  │
│  │          │  │  progress     │  │         │  │   webhook        │  │
│  └──────────┘  └──────────────┘  └─────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────┐
│  EXTERNAL                                                            │
│  OpenAI (emotion analysis) · Sentry · OneSignal (push)              │
│  RevenueCat (subscriptions) · Tenjin/Axon (attribution) · GSC / GA  │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  LANDING (separate Vite + React 19 codebase in /landing)             │
│  Static site generator → 630 prerendered HTML pages                  │
│  Served via Express + Helmet + compression                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. Mobile App — технологический стек

### 3.1. Frontend (общий React-слой)

- **React 18** + **TypeScript** + **Vite 5**
- **TailwindCSS 3** + custom theme (light/dark)
- **i18next** + **react-i18next** — 5 языков (EN, ES, RU, UK, ZH)
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — 3D
  визуализации (welcome scene, biological void interface)
- **MediaPipe Tasks Vision** (`@mediapipe/tasks-vision`) — компьютерное
  зрение для eye-scan биофидбека (новая фича в разработке)
- **vitest** + **@testing-library/react** — юнит-тесты (eye-scan metrics,
  hooks)

Главный файл: `src/onda-level1-demo_27.tsx` — **7589 строк**, монолитный
компонент первого уровня практик. Постепенный рефактор в разрезе компонентов
(`src/components/` — 27 файлов: `NervousSystemScan.tsx`,
`PracticeAudioPlayer.tsx`, `EmotionalCheckModal.tsx` и т.д.).

### 3.2. Native слой — iOS (Capacitor 7)

- **Capacitor 7** как нативный мост; конфиг `capacitor.config.ts`
  (`appId: com.onda-life.ios`)
- **Swift plugins** (`ios/App/App/`):
  - `HealthKitHeartRatePlugin.swift` — пульс из HealthKit
  - `OndaWatchPlugin.swift` — связь с Apple Watch через WCSession
  - `OndaTenjinPlugin.swift`/`.m` — атрибуция установок (server-side)
- **Apple Watch app** (`ios/App/watchkitapp Watch App/`):
  - `OndaWatchApp.swift`, `ContentView.swift`, `WorkoutManager.swift`
  - WCSession real-time стриминг пульса в WebApp
- **Capacitor community plugins**:
  - `@capacitor-community/apple-sign-in` — Sign in with Apple
  - `@capacitor-community/firebase-analytics` — события
  - `@capacitor-community/keep-awake` — экран во время практик
  - `@capacitor/local-notifications` — будильники практик
  - `capacitor-plugin-app-tracking-transparency` — ATT prompt (iOS 14+)
  - `capacitor-health` — унифицированный HealthKit/Health Connect API
- **Подписки**: `@revenuecat/purchases-capacitor` — единый чек-аут (App Store
  IAP + Play Billing) + аналитика через RevenueCat webhook → Supabase

### 3.3. Native слой — Android

- **WebView-based** архитектура (`android-webview/`)
- **Kotlin** modules:
  - `HealthConnectManager.kt` — Google Health Connect API
  - `BluetoothManager.kt` — BLE-пульсометры (Polar, Xiaomi)
  - `OndaHeartRateService.kt` — foreground service для долгих сессий
  - `OndaNotificationListener.kt` — push handling
- Gradle build через CI (`.github/workflows/build-android-apk.yml`,
  `workflow_dispatch`): versionCode/versionName проставляются из
  `github.run_number` (тот же номер, что в релиз-теге `v1.0.<run>`),
  передаются в gradle как `-PondaVersionCode/-PondaVersionName`

### 3.4. Биометрические интеграции

| Источник | Платформа | Hook/Service |
|----------|-----------|--------------|
| Apple Watch (real-time HR) | iOS | `useWatchHeartRate.ts` + WCSession |
| HealthKit (historical HR, sleep, mindfulness) | iOS | `useHealthKitData.ts`, `useHealthKitHeartRate.ts` |
| Health Connect (Android equivalent) | Android | `useHealthConnect.ts` + `HealthConnectManager.kt` |
| Bluetooth chest-strap / ring | Android | BLE через `BluetoothManager.kt` |
| Eye-scan (camera-based ANS detection) | All | `useEyeScan.ts` + MediaPipe + `eyeScanMetrics.ts` |
| Motion sensor (accelerometer/gyro) | All | `useMotion.ts` |
| Notification listener (вторичный канал HR) | Android | `useNotificationHeartRate.ts` |

### 3.5. Аудио-слой

- **`useAudioCache.ts`** — кеширование длинных аудио-практик в IndexedDB
- **`PracticeAudioPlayer.tsx`**, **`RemoteAudioPlayer.tsx`** — два режима:
  локальное закешированное и streaming с Supabase Storage
- **`tus-js-client`** — resumable upload (для админских загрузок аудио)
- **`audioContextSingleton.ts`** — единый Web Audio context (фикс
  iOS Safari WKWebView странностей)

### 3.6. Аналитика и атрибуция

- **Firebase Analytics** (Capacitor plugin) — поведение
- **Tenjin + Axon + ATT** — SKAdNetwork-совместимая атрибуция
  установок (working stack документирован в `docs/native/`)
- **Sentry** (`@sentry/capacitor` + `@sentry/react`) — crash + error
  tracking; недавно: фильтрация failed-HTTP noise (commit `80fe171`)
- **Supabase events** — продуктовая аналитика лайфцикла подписок (lifecycle
  funnel, paywall conversion, onboarding screens)

### 3.7. Чат-бот / эмоциональный чек

- **`src/bot/`** — собственный диалоговый движок
  - `eliza.ts`, `conversationEngine.ts` — паттерн-матчинг ответов
  - `flows.json` — графы разговорных сценариев
  - `useChatEngine.ts` — React-обёртка
- **Edge Function `analyze-emotion`** (Supabase) — OpenAI GPT-4 для разбора
  свободного текста пользователя в emotional-check модалке

---

## 4. Backend — Supabase

### 4.1. PostgreSQL

- **20 миграций** в `supabase/migrations/` (от 2025-10-25 до 2026-05)
- Ключевые таблицы:
  - `user_profiles` — display_name, avatar_url, language, theme,
    onboarding_completed
  - `practice_rewards` — лог получения OND-валюты
  - `user_progress` — текущий уровень, разблокированные артефакты
  - `localization_*` — переводимые контент-блоки (для админки)
- **RLS-политики** по `auth.uid()` — пользователь видит только свои строки

### 4.2. Edge Functions (Deno)

| Функция | Назначение |
|---------|------------|
| `analyze-emotion` | OpenAI GPT-4 → структурированный JSON по тексту пользователя |
| `delete-account` | GDPR — каскадное удаление user_profiles + auth.users |
| `revenuecat-webhook` | Server-side подписочные события (start_trial, renewal, churn) → Supabase events |

### 4.3. Storage

- **Audio bucket** — длинные практики (5-30 минут), MP3/M4A
- Резюмируемые загрузки через TUS-протокол
- CDN-кешируется через Supabase edge

---

## 5. Landing & Knowledge Site (`/landing`)

### 5.1. Стек

- **React 19** + **Vite 7** + **TypeScript 5.9**
- **react-router-dom 7** (SPA navigation + StaticRouter для SSR)
- **TailwindCSS 4** (с `@tailwindcss/vite` плагином — новая v4 архитектура)
- **i18next 23** — 5 языков (зеркало приложения)
- **react-markdown** + **rehype-slug** — рендер длинных статей из TS-литералов
- **jsdom** + **renderToString** — SSR без Puppeteer (для пререндера)
- **sharp** — оптимизация изображений (WebP, responsive sizes)
- **gray-matter** — frontmatter parsing (markdown-only статьи)
- **openai 6** — генерация черновиков переводов (в скриптах)

### 5.2. Контент

Подсчёт прямо из репозитория:

| Тип | Количество | Источник |
|-----|------------|----------|
| Статьи (.ts файлы) | **68** | `src/data/articles/*.ts` |
| Glossary terms | **216** | `src/data/glossary.ts` |
| Reviews (продуктовые) | **28** | `src/data/reviews/*.ts` |
| Comparisons (round-ups) | **3** | "Best HRV/Meditation/Sleep apps 2026" |
| Topic hubs | **11** | `src/data/topics.ts` |
| Levels (1-8) | **8** | `src/data/levels.ts` |
| Bio metrics (live BioOS) | ~17 | `src/data/bioMetrics.ts` |
| Локализованные URL pages | **9** | LOCALIZED_PAGES в `i18n.ts` (home, about, articles, bio, contact, inner-spectrum, privacy, sitemap, terms) |
| **Всего prerendered URL** | **630** | `dist/sitemap.xml` count |

Каждая статья — TypeScript объект (`Article`) с полями: `slug`, `title`,
`description`, `imageAlt`, `imageTitle`, `relatedSlugs`, `content`
(markdown), `howToSteps`, `neuralSuggestion` (cross-link block), категория,
SEO-метаданные.

Reviews — отдельная модель `ToolReview` с критериями (`Criterion`),
оценками (`CriterionScore`, 0-10), `pros`/`cons`, ценой со снапшотом
даты, `testStatus` (hands-on / evidence-based), `references`, `datePublished`
+ `dateModified`.

### 5.3. Build pipeline

Команда `npm run build` в `/landing` выполняет последовательно:

```
1. optimize-images.mjs     — sharp: AVIF/WebP, srcset
2. article-dates.mjs       — git log → datePublished/dateModified
                             для каждой статьи
3. tsc -b                  — type-check
4. vite build              — JS/CSS бандлы, code splitting
5. check-budget.mjs        — fail если бандл превысил budget
6. prerender.ts            — JSDOM + renderToString → 630 HTML
7. validate-seo.mjs        — title/description бюджеты, canonical, og
8. sitemap.ts              — sitemap.xml + image:image для каждой статьи
                             + xhtml:link hreflang кластер
9. sitemap-news.ts         — Google News sitemap (articles + reviews,
                             48ч окно + fallback на 10 свежих)
10. feed.ts                — feed.xml (RSS 2.0) + atom.xml
11. llms-txt.ts            — llms.txt + llms-full.txt (для AI краулеров)
12. rag-corpus.ts          — JSONL корпус для RAG-систем
13. indexnow.ts            — push новых URL в IndexNow (Bing/Yandex)
```

### 5.4. SEO/AI-visibility инфраструктура

- **Hreflang clusters** — симметричные `en + es + ru + uk + zh + x-default`
  на каждом URL что имеет переводы
- **JSON-LD schema** (`scripts/meta-inject.ts` — ~2400 строк):
  - `Person` + `Organization` + `WebSite` с `@id` cross-references
  - `Article` / `TechArticle` (с `audience`, `keywords`, `citation`)
  - `BreadcrumbList` на каждом URL
  - `FAQPage` (Common Questions блоки)
  - `HowTo` (PROTOCOL шаги)
  - `Review` + `reviewRating` для /reviews
  - `CollectionPage` + `ItemList` для topic-hubs
  - `CourseInstance` для /level страниц
- **GSC URL Inspection API** мониторинг (`scripts/gsc-coverage-audit.mjs`)
  — Google Auth Library JWT, weekly run, JSON-history snapshots
- **AI audit** (`scripts/ai-audit.mjs`) — проверка попадания в ChatGPT/
  Perplexity/Claude
- **IndexNow** — push свежих URL в Bing + Yandex после каждого билда
- **News sitemap** — расширен на reviews (свежий контент → fast re-crawl)
- **Image SEO** — каждый `<img>` имеет `alt` (~165+ chars, keyword-rich),
  `title`, `width`/`height`, `loading="lazy"`. Image sitemap покрывает
  68/68 статей с `image:loc` + `image:title` + `image:caption`
- **YMYL E-E-A-T**: явный `Person` schema автора (Yakiv Bilenko / LinkedIn
  yamius) + `rel="me"` cross-reference + Organization + sameAs
- **ES + RU URL pilots** — раздельные `*_PILOT_ARTICLE_SLUGS` массивы +
  `ES_ARTICLE_ROLLOUT` (drip-publish расписание по понедельникам, чтобы
  избежать "scaled content abuse" сигнала)

### 5.5. Hosting / Serving

- **Express 5** + **Helmet** + **compression** (`server.js` корня landing)
- 630 prerendered HTML — каждый URL = свой файл в `dist/<path>/index.html`
- SPA fallback для динамических роутов
- Деплой на Replit (текущий) + DNS на onda-life.com

---

## 6. Команда / автор / методология

- **Автор контента и продукта**: Yakiv Bilenko (LinkedIn: yamius)
- **Reviews**: единая редакционная оценка (никаких aggregateRating —
  только `reviewRating` Yakiv'а как expert reviewer)
- **Контент-цикл**: каждая статья проходит ONDA voice gate — терминологический
  стиль "biocomputer" (системные метафоры: `[ PROTOCOL_N ]`, `STATUS:`,
  `[ HARDWARE_VALIDATION ]`, `ONDA_STATEMENT`)
- **Стандарты**: CONTRIBUTING.md — ≤500-строчные PR, обязательный
  `npm run build` зелёным, один concern на PR

---

## 7. Числа масштаба (snapshot 2026-05-20)

| Метрика | Значение |
|---------|----------|
| Mobile app: deps + devDeps | 41 + 15 |
| Mobile app: главный компонент | 7589 строк |
| Mobile app: Swift файлы (iOS) | 8 |
| Mobile app: Kotlin модули (Android) | 6 |
| Mobile app: hooks | 18 |
| Mobile app: services | 9 |
| Mobile app: components | 27 |
| Backend: Supabase миграций | 20 |
| Backend: Edge Functions | 3 |
| Landing: статей | 68 |
| Landing: glossary terms | 216 |
| Landing: reviews | 28 (3 категории × ~9) |
| Landing: prerendered URLs | 630 |
| Landing: build scripts | 13 этапов pipeline |
| Локализация: языков | 5 (EN, ES, RU, UK, ZH) |
| SEO: hreflang variants | x-default + 5 |
| iOS app version | 1.7.0 |

---

## 8. Безопасность / приватность

- **RLS** на каждой таблице (auth.uid() = row owner)
- **Helmet** на landing — CSP, X-Frame-Options, HSTS
- **GDPR**: `delete-account` Edge Function — каскадное удаление
- **ATT** на iOS — корректный prompt + Tenjin/Axon SKAdNetwork-only после
  отказа
- **No analytics PII** — все события через анонимный session_id до логина
- **Secrets**: ключи Supabase + RevenueCat + OpenAI через env-vars; ничего
  в репо
- **Privacy Policy** + **Terms of Use (EULA)** — на 5 языках,
  prerendered (`/privacy`, `/terms` и `/{lang}/*` варианты)

---

## 9. Roadmap (видно из git + memory)

- 🟢 Доставлено: reviews-секция (28 продуктов + 3 round-ups), localized
  privacy/terms на 5 языков, GSC weekly audit, image SEO normalization
- 🟡 В работе: ES drip-publish 45 статей (4 батча, начиная 2026-06-22),
  internal linking density для 18 GSC-проблемных URL, Nervous System Scan
  (eye-scan биофидбек, в дизайне)
- 🔵 Backlog: расширение RU URL pilots, FAQ JSON-LD автогенерация из
  markdown секций, `dateModified` из git history везде

---

## 10. Лицензии / зависимости

- Все ключевые пакеты — MIT/Apache
- Capacitor 7 — MIT (Ionic Team)
- Supabase clients — MIT
- Three.js / MediaPipe — Apache 2.0
- React / Vite — MIT
- RevenueCat / Sentry / OneSignal / Tenjin — коммерческие SaaS подписки

---

*Документ автогенерирован: 2026-05-20. Все цифры — прямой подсчёт из
текущего состояния `main` в репозитории `yamius/ONDA1`.*
