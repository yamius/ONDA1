# Interactive Tools system (`/tools`)

The landing site ships a catalogue of free, self-contained interactive tools at `/tools/<slug>` — calculators, quizzes, planners, timers and live camera/mic biofeedback. They are the SEO/GEO "wedge": each tool ranks for a high-intent keyword, carries its own FAQ JSON-LD + branded share card, and cross-links into the app, articles, glossary and reviews.

This doc is the ground truth for **what exists** and **how to add a new tool**, derived from the real code. Paths are relative to `landing/`.

---

## 1. Catalogue (what actually exists)

The hub grid is driven by `src/data/tools.ts` → `TOOLS: ToolEntry[]`. As of this writing there are **30 tools in `TOOLS`** plus a **31st featured entry, Bio OS (`/bio`)**, which the hub surfaces by hand (it is not in the `TOOLS` array and keeps its own richer engine/route). Counting Bio OS, the `/tools` hub links **31** destinations.

> The `~32 tools` figure in project memory also counts `/emoton` (the emotional check-in, route `/emoton`), which is grouped with Tools in the nav but is **not** in `TOOLS` and **not** under `/tools/*`. Treat `TOOLS.length` (30) as the authoritative count for the `/tools/<slug>` family.

Every entry in `TOOLS` has `live: true` today. Grouped by what they do (the `category` field is the card eyebrow, not a strict taxonomy):

### Live biofeedback (camera / mic, on-device)
These run real signal processing in the browser; nothing is recorded or uploaded.
- `camera-heart-rate` — Camera Heart Rate (fingertip PPG, `CameraHeartRatePage.tsx`)
- `breathing-rate` — Breathing Rate Monitor (mic, `MicBreathingPage.tsx`)
- `breath-heart-biofeedback` — Breath–Heart Biofeedback (camera PPG + pacer, `BreathHeartBiofeedbackPage.tsx`)
- *(featured, separate)* Bio OS `/bio`, Emoton `/emoton`

### Calculators (numeric, formula-driven)
- `hrv` — HRV Interpreter
- `caffeine` — Caffeine Cut-Off Calculator
- `sleep-debt` — Sleep Debt Calculator
- `zone-2` — Zone 2 Heart Rate Calculator
- `protein` — Protein Intake Calculator
- `vo2max` — VO₂max Estimator
- `tdee` — TDEE Calculator
- `water` — Water Intake Calculator
- `alcohol` — Alcohol Clearance Calculator
- `fasting` — Intermittent Fasting Calculator
- `one-rep-max` — One-Rep Max Calculator
- `body-fat` — Body Fat Calculator
- `sleep-cycle` — Sleep Cycle Calculator
- `biological-age` — Biological Age Calculator
- `resting-heart-rate` — Resting Heart Rate by Age
- `recovery-score` — Recovery Score Explained

### Quizzes / assessments
- `chronotype` — Chronotype Quiz
- `burnout` — Burnout Self-Assessment
- `nervous-system` — Nervous System State Quiz
- `brain-fog` — Brain Fog Quiz

### Planners / guides / timers
- `jet-lag` — Jet Lag Light-Timing Planner
- `cognitive-shuffle` — Cognitive Shuffle (sleep technique)
- `breathing` — Breathing Pacer
- `resonance-breathing` — Resonance Breathing Rate Finder
- `dopamine-detox` — Dopamine Reset Planner (slug `dopamine-detox`)
- `digital-detox` — Digital Detox Planner
- `wim-hof` — Wim Hof Timer & Cold Guide

**Slug gotchas to copy verbatim:** the Dopamine tool slug is `dopamine-detox` (name "Dopamine Reset Planner"); the mic tool slug is `breathing-rate` (page `MicBreathingPage`); the breath+heart slug is `breath-heart-biofeedback` (data file `breath-heart.ts`). Slugs do **not** always match their data filename or component name.

---

## 2. Anatomy of a tool

A single tool is wired across **six** places. Using `hrv` as the worked example:

| Layer | File | What it holds |
|---|---|---|
| 1. Data + FAQ | `src/data/hrv-norms.ts` | The dataset, science `SOURCES` (`ScienceSource[]`), `METHODOLOGY` string, and the exported FAQ array (`HRV_FAQ: { q, a }[]`). Plus any pure compute fn (`interpretHrv`). |
| 2. Page component | `src/pages/HrvInterpreterPage.tsx` | The React page (named export). Imports its data file, renders inputs/results, `<SourcesSection>`, an on-page FAQ block that **mirrors** the JSON-LD, and footer cross-links. Sets `document.title` in a `useEffect`. |
| 3. Route (client) | `src/main.tsx` | `lazy()` import + `<Route path="/tools/hrv" element={<HrvInterpreterPage />} />` inside the `<Layout/>` route. |
| 3b. Route (SSR) | `src/entry-server.tsx` | Direct (non-lazy) import + the same `<Route>`, used by the prerender build. **Must mirror `main.tsx`.** |
| 4. Prerender + meta + FAQ JSON-LD | `scripts/prerender-routes.ts` (`nonLocalizedStaticPaths`) and `scripts/meta-inject.ts` (`getMetaForRoute` `if (route === '/tools/hrv')` block + the `buildBreadcrumbs` `tools` branch) | Registers the URL for static HTML generation + the sitemap; supplies `title`/`description`/`og:image`/breadcrumbs; and (if `faq` is set) emits `FAQPage` JSON-LD via `buildFAQPageJsonLd`. |
| 5. OG / share card | `scripts/generate-tool-cards.ts` (auto, from `TOOLS`) | Renders `dist/images/tools/<slug>.png` (1200×630 SVG→PNG via `sharp`) at build time using each `TOOLS` entry's `name`/`category`/`badge`. No per-tool code. |
| 6. Hub listing | `src/data/tools.ts` (`TOOLS`) | The `ToolEntry` (`slug`, `name`, `blurb`, `live`, `category`, `badge`) that puts the tool in the `/tools` grid (`ToolsPage.tsx`) and drives its card art. |

### Notes that bite you
- **i18n:** tool pages are **EN-only**. They do **not** use `useTranslation`/namespaces — copy is hardcoded in the component. They import only `langFromPath`/`langHref` from `../i18n` to prefix internal links, but `/tools/*` is **not** in `LOCALIZED_PAGES` and is listed under `nonLocalizedStaticPaths` ("Interactive biohacking tools. EN-only for now."). There are no `/<lang>/tools/...` routes.
- **`src/config/routes.ts` is NOT the tools registry.** Its `staticPaths` lists only the top-level pages; it does not include `/tools/*`. Tool prerendering is driven entirely by `scripts/prerender-routes.ts`.
- **Sitemap is automatic.** `scripts/sitemap.ts` calls `getPrerenderRoutes()`, so once a `/tools/<slug>` is in `nonLocalizedStaticPaths` it is in the sitemap — no separate sitemap edit.
- **FAQ duplication is intentional.** The on-page FAQ (the component's `{FAQ.map(...)}` block) and the `FAQPage` JSON-LD (meta-inject's `faq` field) read from the **same exported array** in the data file. Keep them sourced from one constant so they never drift.
- **Card art is fully derived from `TOOLS`.** Adding the `ToolEntry` is the only step the card generator needs; do not hand-author a PNG. `category`/`badge` only affect the card; keep `badge` short and ASCII-safe (the SVG uses a mono fallback font).

---

## 3. Adding a new tool — checklist

Concrete steps, mirroring how existing tools are wired. Replace `myslug` / `MyToolPage` / `MY_*`.

1. **Data file** — create `src/data/myslug.ts`. Export:
   - the dataset / compute function (pure, testable);
   - `MY_SOURCES: ScienceSource[]` (peer-reviewed refs) and a `MY_METHODOLOGY` string for `<SourcesSection>`;
   - `MY_FAQ: Array<{ q: string; a: string }>` (4–5 honest Q&As — this is the single source for both the on-page FAQ and the JSON-LD).

2. **Page component** — create `src/pages/MyToolPage.tsx` as a **named export** `MyToolPage`. Copy an existing tool of the same kind (calculator → `HrvInterpreterPage.tsx`; live-biofeedback → `CameraHeartRatePage.tsx`). It should:
   - set `document.title` + `window.scrollTo({top:0})` in a `useEffect`;
   - render the breadcrumb nav, inputs/results, `<SourcesSection methodology={MY_METHODOLOGY} sources={MY_SOURCES} />`, the FAQ block mapped from `MY_FAQ`, and footer cross-links to a related article / glossary term / review;
   - use `langPrefix = lang === 'en' ? '' : '/${lang}'` for internal `<Link>`s (links only — page copy stays EN).

3. **Hub entry** — add a `ToolEntry` to `TOOLS` in `src/data/tools.ts`: `{ slug: 'myslug', name, blurb, live: true, category, badge }`. (This alone lists it on `/tools` and generates its OG card.)

4. **Client route** — in `src/main.tsx`: add `const MyToolPage = lazy(() => import('./pages/MyToolPage').then(m => ({ default: m.MyToolPage })))` and `<Route path="/tools/myslug" element={<MyToolPage />} />` inside the `<Layout/>` block.

5. **SSR route** — in `src/entry-server.tsx`: add the (direct) `import { MyToolPage } from './pages/MyToolPage'` and the identical `<Route path="/tools/myslug" element={<MyToolPage />} />`. Keep it byte-for-byte aligned with step 4 or SSR/CSR will diverge.

6. **Prerender registration** — in `scripts/prerender-routes.ts`, add `'/tools/myslug'` to `nonLocalizedStaticPaths` (the "Interactive biohacking tools" group). This puts the page in the static build **and** the sitemap.

7. **Meta + breadcrumb + FAQ JSON-LD** — in `scripts/meta-inject.ts`:
   - add a `} else if (segments[1] === 'myslug') { items.push({ name: '…', url: `${SITE_URL}/tools/myslug` }) }` arm in the `tools` branch of `buildBreadcrumbs`;
   - add an `if (route === '/tools/myslug') { return { title, description, url, breadcrumbs, ogType: 'website', image: `${SITE_URL}/images/tools/myslug.png`, faq: { mainEntity: MY_FAQ.map(f => ({ question: f.q, answer: f.a })), url } } }` block in `getMetaForRoute`, importing `MY_FAQ` at the top of the file. Keep `title` ≤ ~65 chars and `description` 150–160.

8. **Build & verify** — run the landing build. Confirm:
   - `dist/images/tools/myslug.png` was generated (`[tool-cards] generated N cards`);
   - `dist/tools/myslug/index.html` exists with the injected `<title>`, `og:image`, breadcrumb JSON-LD and (if `faq` set) `FAQPage` JSON-LD;
   - the URL appears in the generated `sitemap.xml`;
   - the card is **not** committed (cards are build-time, in `dist/`, not version-controlled).

No edits are needed to `src/config/routes.ts`, the sitemap script, or any i18n/locale file.

---

## 4. Where things live (source map)

- Hub catalogue + card source of truth: `src/data/tools.ts` (`TOOLS`, `ToolEntry`)
- Per-tool data + FAQ + sources: `src/data/<tool>.ts` (e.g. `hrv-norms.ts`, `camera-heart-rate.ts`, `mic-breathing.ts`, `breath-heart.ts`)
- Page components: `src/pages/*Page.tsx`
- Hub page: `src/pages/ToolsPage.tsx`
- Client router: `src/main.tsx`
- SSR router (prerender): `src/entry-server.tsx`
- Prerender URL list (→ also feeds sitemap): `scripts/prerender-routes.ts` (`nonLocalizedStaticPaths`, `getPrerenderRoutes`)
- Per-route meta + breadcrumbs + FAQ JSON-LD: `scripts/meta-inject.ts` (`getMetaForRoute`, `buildBreadcrumbs`, `buildFAQPageJsonLd`)
- Branded OG cards: `scripts/generate-tool-cards.ts` → `dist/images/tools/<slug>.png`
- Sitemap (auto from prerender routes): `scripts/sitemap.ts`
- Shared UI: `src/components/SourcesSection.tsx` (methodology + citations block reused by every tool)
