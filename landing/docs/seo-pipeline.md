# SEO / GEO Build Pipeline

How `npm run build` turns the React/Vite landing source into a fully prerendered, crawler- and LLM-ready `dist/` (HTML per route, sitemaps, feeds, llms.txt, RAG corpus, IndexNow ping), served statically by `server.js`. GEO = "Generative Engine Optimization" (llms.txt + RAG corpus + JSON-LD for AI search engines).

Everything below is grounded in the actual scripts under `landing/scripts/` and `landing/package.json`. Where a statement is inferred rather than directly stated in code, it is flagged.

---

## Build order

The single source of truth for ordering is the `build` script in `landing/package.json`:

```
write-build-sha.mjs → optimize-images.mjs → article-dates.mjs →
generate-localized-coverage.ts → tsc -b → vite build → check-budget.mjs →
generate-review-cards.ts → generate-tool-cards.ts → prerender.ts → validate-seo.mjs
```

Note that **`prerender.ts` itself fans out to a second chain at its tail** (sitemap → sitemap-news → feed → llms-txt → rag-corpus → indexnow) via `execSync` — these are NOT separate npm steps. The full effective sequence:

| # | Stage | Runner | Emits |
|---|-------|--------|-------|
| 1 | `write-build-sha.mjs` | node | `.build-sha` (short commit SHA) |
| 2 | `optimize-images.mjs` | node | `public/**/*.{webp,avif}` variants + `src/data/image-manifest.generated.ts` |
| 3 | `article-dates.mjs` | node | `src/data/article-dates.generated.ts` (git-derived published/modified) |
| 4 | `generate-localized-coverage.ts` | tsx | `src/data/localized-coverage.generated.ts` |
| 5 | `tsc -b` | tsc | type-check + project build (no JS output relied on; Vite does the bundling) |
| 6 | `vite build` | vite | `dist/` SPA bundle (hashed `assets/`, `dist/index.html` shell) |
| 7 | `check-budget.mjs` | node | (guard — no output; fails build if entry chunk > 150 KB gzip) |
| 8 | `generate-review-cards.ts` | tsx | `dist/images/reviews/<slug>.png` (1200×630 OG cards) |
| 9 | `generate-tool-cards.ts` | tsx | `dist/images/tools/<slug>.png` |
| 10 | `prerender.ts` | tsx (`--max-old-space-size=4096 --expose-gc`) | `dist/<route>/index.html` per route; stamps build beacon |
| 10a | `sitemap.ts` | tsx (called by prerender) | `dist/sitemap.xml` |
| 10b | `sitemap-news.ts` | tsx (called by prerender) | `dist/sitemap-news.xml` |
| 10c | `feed.ts` | tsx (called by prerender) | `dist/feed.xml` (RSS 2.0) + `dist/atom.xml` (Atom 1.0) |
| 10d | `llms-txt.ts` | tsx (called by prerender) | `dist/llms.txt`, `dist/llms-full.txt`, `dist/<lang>/llms.txt` |
| 10e | `rag-corpus.ts` | tsx (called by prerender) | `dist/datasets/onda-corpus.jsonl` + `.gz` |
| 10f | `indexnow.ts` | tsx (called by prerender, non-fatal) | POSTs changed URLs to IndexNow; writes `.cache/indexnow-state.json` |
| 11 | `validate-seo.mjs` | node | (guard — no output; fails build on structural SEO defects) |

`build:fast` is a dev shortcut: `optimize-images → article-dates → tsc -b → vite build → check-budget`. It does **not** prerender, so it does not exercise the GEO/sitemap stages or `validate-seo`.

Deploy entry point (`.replit`): `git pull origin main --ff-only || true && cd landing && rm -rf dist && npm install && npm run build`; runtime is `PORT=5000 node server.js` (Replit Autoscale, healthcheck `/health`).

---

## Per-stage detail

| Stage · file | Input → output | Notes / env / gating |
|---|---|---|
| **write-build-sha** `scripts/write-build-sha.mjs` | `git rev-parse --short HEAD` → `.build-sha` | Best-effort; never throws. Fallback for envs where in-process git later fails in prerender. |
| **optimize-images** `scripts/optimize-images.mjs` | `public/**/*.{png,jpg,jpeg}` → `.webp` + `.avif` (+ `-640w` responsive when source > ~768px) → `src/data/image-manifest.generated.ts` | Skips favicon/app-icon set. Walks quality ladder to keep each output ≤ 99 KB. Manifest (path → w×h) feeds `OptimizedImage` so width/height ship in HTML (CLS = 0). Idempotent: skips variants that already exist. |
| **article-dates** `scripts/article-dates.mjs` | git history of `src/data/articles/*.ts` + `glossary.ts` → `src/data/article-dates.generated.ts` | First commit = `published`, last = `modified`; mtime fallback (shallow clones/CI). Fingerprint cache `.article-dates.cache.json` skips ~136 git-log spawns on a no-op rebuild. `__glossary` key holds shared glossary dates. |
| **generate-localized-coverage** `scripts/generate-localized-coverage.ts` | `LOCALIZED_*_ROUTE_SET` (from `prerender-routes.ts`) → `src/data/localized-coverage.generated.ts` | Per-locale set of slugs that have a *real* prerendered localized page, so `langHref()` falls back to the EN URL for untranslated content instead of emitting a soft-404 `/<lang>/…` link. |
| **tsc -b / vite build** | `src/` → `dist/` (hashed `assets/`, `dist/index.html` shell) | Standard Vite SPA build. `dist/index.html` is the template prerender mutates. |
| **check-budget** `scripts/check-budget.mjs` | `dist/index.html` entry chunk → (guard) | **Fails build** (`exit 1`) if the eager `assets/index-*.js` chunk > `ENTRY_BUDGET_KB = 150` KB gzip. Stops a heavy static import from re-bloating the lazy-i18n entry. |
| **generate-review-cards** `scripts/generate-review-cards.ts` | `src/data/reviews` → `dist/images/reviews/<slug>.png` | SVG→PNG via `sharp`. One branded 1200×630 score card per review + round-up; gives review pages a real `Product.image` / `og:image` / hero `<img>`. Date-gated reviews get a card the build after they go live. A review's explicit `image:` overrides the card. |
| **generate-tool-cards** `scripts/generate-tool-cards.ts` | `src/data/tools` (`TOOLS`) → `dist/images/tools/<slug>.png` | Mirror of review cards for every `/tools/<slug>`; wired as `og:image` in meta-inject. |
| **prerender** `scripts/prerender.ts` | route list + `src/entry-server` + `public/locales/**` → `dist/<route>/index.html` | The SSG core — see next section. Stamps `onda-build-commit` / `onda-build-time` beacon + per-page build fingerprint into `<head>`. Runs with `--max-old-space-size=4096 --expose-gc`; major GC every 12 routes to cap heap on small containers. Per-route failures are logged and counted, not fatal. |
| **sitemap** `scripts/sitemap.ts` | `getPrerenderRoutes()` + `ARTICLE_DATES` + reviews/data → `dist/sitemap.xml` | hreflang `<xhtml:link>` alternates + `<image:image>` blocks (article hero / review score card) + `<lastmod>` only for article/glossary/review/comparison (build-date `<lastmod>` on 500+ URLs reads as spam, so omitted elsewhere). Priority/changefreq tiered; featured slugs rank higher. Filters out `/embed/*` (noindex) and topic hubs without a pillar (`INDEXED_TOPIC_SLUGS`). |
| **sitemap-news** `scripts/sitemap-news.ts` | articles + reviews + comparisons (dates) → `dist/sitemap-news.xml` | Google News extension; only URLs modified in last 48h. Empty window → falls back to 10 most-recent so the urlset is never empty (GSC rejects empty). Submit separately in GSC. |
| **feed** `scripts/feed.ts` | `src/data/articles` (first 50) → `dist/feed.xml` + `dist/atom.xml` | RSS 2.0 + Atom 1.0 for aggregators (Bing News, Inoreader, Feedly). Date = source `.ts` mtime, else build date. Source order treated as reverse-chronological. |
| **llms-txt** `scripts/llms-txt.ts` | articles + glossary + levels + parts + reviews + `public/locales/**` → `dist/llms.txt`, `dist/llms-full.txt`, `dist/<lang>/llms.txt` | llmstxt.org spec for AI search (Perplexity/ChatGPT/Claude). `llms.txt` = link index; `llms-full.txt` = index + full markdown bodies (EN only — per-locale full dump intentionally skipped while bodies are EN-only). Per-locale `llms.txt` uses localized titles where pilot URLs exist, else EN canonical. |
| **rag-corpus** `scripts/rag-corpus.ts` | articles + glossary + reviews + comparisons + `ARTICLE_DATES` → `dist/datasets/onda-corpus.jsonl` (+ `.gz`) | One JSON record per line (slug/type/url/title/body/wordCount/dates/author). Single-fetch corpus for RAG ingestion. Discoverable via `Dataset` JSON-LD on homepage + `<link rel=alternate type=application/x-jsonlines>`. Stable sort (type, then slug) for cheap cross-build diffing. `.gz` at level 9. |
| **indexnow** `scripts/indexnow.ts` | `dist/sitemap.xml` ↔ `.cache/indexnow-state.json` → POST to `api.indexnow.org` | Diffs `<loc>`/`<lastmod>` vs last run; submits only changed URLs (batched ≤ 10000, 15s timeout per batch). Fans out to Bing/Yandex/Seznam/Naver. **Skips** when `INDEXNOW_DISABLED=1`, sitemap missing, or no URL changes. State updated only if ≥1 batch accepted. Wrapped in try/catch in prerender → never fails the build. (Google/Bing legacy `ping?sitemap` endpoints are dead; not pinged. Google needs manual/API GSC submission.) |
| **validate-seo** `scripts/validate-seo.mjs` | `dist/**/index.html` → (guard) | **Fails build** (`exit 1`) on: invalid JSON-LD block, ≠ exactly 1 `<link rel=canonical>`, or an hreflang cluster missing `x-default`. Conservative — only genuine defects. |

Auxiliary scripts in `scripts/` that are **not** part of `npm run build` (run on demand): `audit-baseline.mjs` (read-only `dist/` SEO audit → `dist/audit-baseline.{json,md}`), `generate-favicons.mjs` (`favicons` npm script), `gsc-coverage-audit.mjs` (`audit:gsc`), `ai-audit.mjs` (`audit:ai`).

---

## The SSG model

`prerender.ts` is **renderToString + JSDOM, not Puppeteer** — no Chrome / system libs, so it runs anywhere (Replit, plain Node). Confirmed in the file header and imports (`react-dom/server`, `jsdom`).

Mechanics:

- **Route enumeration** lives in `prerender-routes.ts` → `getPrerenderRoutes()`. It imports the data registries (articles, glossary, levels, parts, bio metrics, reviews, comparisons, head-to-heads, topics) and the i18n route-variant helpers. Localized static pages, `/bio/:metric`, `/level/:n`, and `/part/:slug` are each expanded **× 5 languages** (`SUPPORTED_LANGS` = en/es/ru/uk/zh) via `*RouteVariants()`.
- **Render loop:** the JSDOM window is constructed **once** and reused across all routes (the previous per-route `new JSDOM()` was the main Replit OOM contributor). Each route: `renderToString(createApp(route, lang))` → assign to `#root.innerHTML` → `dom.serialize()` → string-level meta rewrites → write `dist/<route>/index.html`.
- **Meta injection** comes from `meta-inject.ts` (`getMetaForRoute` + `injectMetaIntoHtml`): per-route title/description/canonical/OG/Twitter plus a large JSON-LD graph (TechArticle, FAQPage, HowTo, BreadcrumbList, DefinedTerm(Set), Organization, WebSite, Person, Dataset, Review, ItemList, etc.). `TITLE_MAX = 65`, `DESC_MAX = 160`; titles are clamped to `TITLE_IDEAL = 60` brand-aware (never drops the " | ONDA Life" suffix). GTM is kept only on the EN homepage and stripped from subpages.
- **Localization & hreflang:** localized branches (page / metric / level / part / article / review / glossary) patch `<html lang>`, title/description/OG, canonical, `og:locale`, and emit hreflang clusters (`en` + live siblings + `x-default`). Pages with no localized cluster get a self-referencing `hreflang="en"` + `x-default` fallback so `validate-seo` always passes.
- **Drip / pilot gating (build-time):** localized rollouts are gated against `BUILD_DATE` (UTC, computed at build) so a finished-but-future translation sits inert in the repo — no prerendered HTML, not in sitemap, not linked — until its Monday:
  - ES articles: hand-curated `ES_ARTICLE_PILOT_BASE` (22 live) + `ES_ARTICLE_ROLLOUT` (~11/Monday, `publishOn <= BUILD_DATE`).
  - RU articles: hand-curated `RU_PILOT_ARTICLE_SLUGS`.
  - UK/ZH articles: programmatic `ARTICLE_LOCALE_ROLLOUTS` (11/Monday from a start date).
  - Glossary (es/ru): `GLOSSARY_ROLLOUTS` (21/Monday from start date).
  - Reviews (ru/es/uk): `REVIEW_ROLLOUT` (one category/Monday).
  - Rationale stated in-code: drip-feeding reads to Google as organic growth, not a "scaled content abuse" dump of LLM-translated YMYL content.

`server.js` then serves the result statically: for `GET /<path>` it sends `dist/<path>/index.html` (root HTML is cached in memory); `/sitemap.xml` and `/sw.js` get explicit short-cache routes; unknown routes return 404 + the SPA shell. So crawlers see the fully prerendered HTML for every enumerated route.

---

## Build guards (what fails the build)

Two hard gates, plus per-route resilience:

1. **`check-budget.mjs`** (after `vite build`, before card generation) — `exit 1` if the eager entry chunk exceeds **150 KB gzip**. Protects the lazy-i18n entry-size win.
2. **`validate-seo.mjs`** (final stage) — `exit 1` on invalid JSON-LD, missing/duplicated canonical, or an hreflang cluster with no `x-default`. Walks every `dist/**/index.html`.

Non-fatal by design: individual prerender route failures are logged + counted (`done`/`failed`) but do not stop the build; `indexnow.ts` is wrapped in try/catch so a network/IndexNow error never breaks a deploy. The card generators (`generate-review-cards`, `generate-tool-cards`) **do** `process.exit(1)` on a top-level throw — so a malformed review/tool data record can fail the build (inferred from their `.catch(() => process.exit(1))`).

---

## Running / verifying locally

- Full pipeline: `cd landing && npm run build` (matches deploy). Fast dev iteration without SSG: `npm run build:fast`.
- **Env-less host parity** (per `landing/docs/emoton.md` §6): `landing/.env` is gitignored, so the production host has no `VITE_SUPABASE_*`. Verify the way the host sees it: `mv landing/.env aside && npm run build` must exit 0 (prerender N/N rendered, `validate-seo` clean). Prerender runs the **real source tree under tsx** (not the Vite bundle), so:
  - `import.meta.env` is undefined under tsx → module-scope `import.meta.env.X` throws; read it through a guard.
  - Every `LOCALIZED_PAGES` namespace must have a JSON for **all 5** `SUPPORTED_LANGS` — prerender hard-`readFileSync`s `public/locales/<lang>/<ns>.json` with no runtime fallback (es/uk/zh may be EN copies). A missing file → `ENOENT`.
- **Memory:** prerender uses `--max-old-space-size=4096 --expose-gc`; if it OOMs, lower the heap flag or batch prerender — do not raise it above container RAM (Replit Autoscale 4 vCPU / 8 GiB).
- **Read-only audit** of a built `dist/`: `node scripts/audit-baseline.mjs` → `dist/audit-baseline.{json,md}` (title/desc budgets, canonical, og, hreflang, JSON-LD types, h1/alt). Does not touch production code.
- **Verify the deployed build** in one fetch: view source / `curl … | grep onda-build-commit` — the beacon stamped by prerender reflects the actual built commit.

---

## Source files

- Build order: `landing/package.json` (`scripts.build`), `.replit` (deploy build/run)
- Static server: `landing/server.js`
- SSG core: `landing/scripts/prerender.ts`, `landing/scripts/prerender-routes.ts`, `landing/scripts/meta-inject.ts`
- Sitemaps / feeds / GEO: `landing/scripts/sitemap.ts`, `sitemap-news.ts`, `feed.ts`, `llms-txt.ts`, `rag-corpus.ts`, `indexnow.ts`
- Generators: `landing/scripts/optimize-images.mjs`, `article-dates.mjs`, `generate-localized-coverage.ts`, `generate-review-cards.ts`, `generate-tool-cards.ts`, `generate-favicons.mjs`, `write-build-sha.mjs`
- Guards / audit: `landing/scripts/check-budget.mjs`, `validate-seo.mjs`, `audit-baseline.mjs`
- Generated artifacts (committed, regenerated each build): `landing/src/data/article-dates.generated.ts`, `image-manifest.generated.ts`, `localized-coverage.generated.ts`
- Related doc: `landing/docs/emoton.md` §6 (prerender build invariants), `landing/docs/gsc-audit-runbook.md`
