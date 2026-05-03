# ONDA Life — Sprint Status

> Источник истины по всем спринтам инфраструктуры/контента, выполненным
> относительно брифа **«10-Hour Optimization Marathon»** (5 фаз).
> Обновляется в конце каждой сессии.

**Последнее обновление:** 2026-05-03
**Текущий состав:** 69 статей в `landing/src/data/articles/` + 215 glossary terms
**Build health:** ✓ vite 6.9s · ✓ prerender 558 routes · ✓ 0 hreflang violations · ✓ 0 JSON-LD errors

---

## Фазы брифа — карта статуса

| Phase | Тема | Статус |
|---|---|---|
| **Phase 1** | Performance | 🟢 ~80% (lazy-load, parallel I/O, image ladder, manifest, Lighthouse CI ✓; bundle <80KB pending) |
| **Phase 2** | SEO | 🟢 ~85% (рейлы, валидаторы, OG-генератор, JSON-LD, hreflang ✓; budget-trim pending) |
| **Phase 3** | AI Visibility / GEO | 🟢 ~95% (всё кроме parquet+embeddings) |
| **Phase 4** | Auto-publishing | 🟢 100% |
| **Phase 5** | Content (50 articles) | 🔴 4% (2/50) |

---

## Sprint A — GEO (T01–T17) ✓ ОТГРУЖЕНО

Полное покрытие Phase 3 брифа.

| ID | Что | Артефакт |
|---|---|---|
| T01 | AI baseline audit | `scripts/ai-audit.mjs` + `docs/ai-audit-prompts.md` (50 seed prompts), skip-without-key |
| T02 | llms.txt aggressive expansion | `scripts/llms-txt.ts` — How-to-cite, Topic taxonomy, Key facts, per-locale (5 langs), llms-full с anchor IDs |
| T03 | RAG-friendly dataset | `/datasets/onda-corpus.jsonl(.gz)` (284 records, ~1.7MB) + README + `<link rel="alternate">` в index.html |
| T04 | Wikidata entity docs | `docs/wikidata-entities.md` (manual submission tracking) |
| T05 | Citation gap audit | `scripts/research-citation-audit.mjs` |
| T06 | FAQ JSON-LD framework | `scripts/audit-faq-coverage.mjs` (gate) + FAQ_SCHEMA в meta-inject |
| T07 | Topic hub pages | `/topics`, `/topics/:slug` (10 hubs) + CollectionPage/ItemList JSON-LD + sitemap inclusion |
| T08 | Glossary first-paragraph format | `scripts/validate-glossary-definition.mjs` (210/215 accepted, 5 violations to fix) |
| T09 | AI-targeted sitemaps | `sitemap-news.xml`, `sitemap-images.xml` (68 URLs), `/ai.txt` |
| T10 | Canonical bio | `docs/canonical-bio.md` |
| T11 | Press coverage tracking | `docs/press-coverage.md` |
| T12 | Keyword early-position validator | `scripts/validate-keyword-position.mjs` (397/558 clean = 71%) |
| T13 | Direct submission automation | `scripts/submit-to-engines.mjs` (Bing + IndexNow) |
| T14 | AI audit cron | `.github/workflows/ai-audit.yml` (daily 03:00 UTC) + `scripts/ai-audit-history.mjs` |
| T15 | Content licensing | `LICENSE` (CC-BY-4.0) + `/license` route (`LicensePage.tsx`) + `<link rel="license">` |
| T16 | Brand reinforcement | `scripts/validate-brand-reinforcement.mjs` (0 violations / 70 articles) |
| T17 | Final acceptance build | `dist/seo-audit/post-sprint.json` |

---

## Sprint B — Auto-publishing (Phase 4) ✓ ОТГРУЖЕНО

Все 11 этапов брифа Phase 4.

- `Article.publishedAt?: string` (JSDoc explains scheduled/published/legacy)
- Single-chokepoint registry filter в `data/articles/index.ts`
- `scripts/schedule-articles.mjs` CLI (`set` / `clear` / `list` / `check`, exit-1 при due)
- `.github/workflows/scheduled-publish.yml` — daily empty-commit cron
- Все downstream consumers (sitemap, feed, llms-txt, prerender, corpus, sitemap-news) читают `publishedAt`
- RSS pubDate / JSON-LD datePublished / Article.datePublished синхронизированы
- IndexNow diff catches newly-published URLs автоматически
- `docs/auto-publish.md` (workflow, deploy-pipeline caveat)

---

## Sprint E — Phase 1 Performance ✓ ОТГРУЖЕНО (текущая сессия)

| Задача | Файл | Результат |
|---|---|---|
| 1.1 Lazy-load всех 19 страниц | `src/main.tsx` (предсуществующее) | ✓ HomePage/About/Articles/Glossary/Topics/Bio/etc — все через `lazy()` |
| 1.1 Manual chunks vendor split | `vite.config.ts` (предсуществующее) | ✓ vendor-react/router/i18n/markdown/supabase |
| 1.2 NODE_OPTIONS=4096 | `package.json` (предсуществующее) | ✓ `--max-old-space-size=4096` в build script |
| 1.4 Parallel prerender I/O | `scripts/prerender.ts` | ✓ batch 16, async writeFile/mkdir + Promise.all + flush, timing log |
| 1.6 Responsive image ladder | `scripts/optimize-images.mjs` | ✓ 480w/640w/960w/1920w (skip-if-source-too-small), всего 68 источников × до 8 файлов |
| 1.6 Image manifest | `scripts/optimize-images.mjs` → `public/image-manifest.json` | ✓ 68 entries с width/height/variants для CLS=0 |
| 1.6 OptimizedImage srcset | `src/components/OptimizedImage.tsx` | ✓ `480w, 640w, 960w, 1920w, 2400w` в `<source>` srcset |
| 1.7 Node ≥20 pin | `.replit`, `replit.nix` (предсуществующее) | ✓ `nodejs-20` + `pkgs.nodejs_20` |
| 1.8 Lighthouse CI script | `scripts/lighthouse.mjs` | ✓ skip-if-no-Chrome, skip-if-not-installed, 10 routes, mobile profile, P/A11y/BP/SEO thresholds |
| 1.8 Lighthouse GitHub Action | `.github/workflows/lighthouse.yml` | ✓ build → preview server → npx lighthouse on demand → upload artifact |

**Текущий bundle (после Phase 1):**
- index.js 426KB / **135KB gzip** (over 80KB target — Phase 1.1 follow-up: разбить i18n/articles-meta из main chunk)
- vendor-react 192KB / 60KB gzip
- vendor-i18n 52KB / 16KB gzip
- HomePage 20KB / 6KB gzip ✓
- PartPage 120KB / 34KB gzip ✓
- glossary chunk 278KB / 76KB gzip ✓ (loaded only on /glossary)

## Sprint C — Infrastructure gap-fix (Phase 1+2 partial) ✓ ОТГРУЖЕНО

Закрытие пробелов из брифа, найденных при ретро-аудите.

| Задача | Файл | Статус |
|---|---|---|
| Hreflang cluster validator | `scripts/validate-hreflang.mjs` | ✓ 0 violations / 558 URLs |
| JSON-LD shape + @graph walker | `scripts/validate-jsonld.mjs` | ✓ 0 errors / 977 blobs |
| Branded OG-card generator | `scripts/og-image-generator.mjs` | ✓ 2 generated, 67 cached |
| OG fallback в meta-inject | `scripts/meta-inject.ts` | ✓ `og:image → /og-images/<slug>.png` |
| ArticlePage Related rail | `src/pages/ArticlePage.tsx` | ✓ 3 sibling-cards by category |
| ArticlesPage Recently Updated rail | `src/pages/ArticlesPage.tsx` | ✓ top 5 by `ARTICLE_DATES.modified` |
| AI audit cron | `.github/workflows/ai-audit.yml` | ✓ daily, secrets: PERPLEXITY/OPENAI/BRAVE_SEARCH/BING_SEARCH |

**Architect review fixes (4 бага найдено и закрыто):**
1. OG fallback не доходил до meta → проброшен через `meta-inject.ts`
2. JSON-LD не walked `@graph` → recursive `visit()` с depth limit
3. AI audit secret names mismatch → переименовано в `*_SEARCH_API_KEY`
4. Hreflang missing exactly-one-x-default + x-default-must-be-EN → добавлено + normalize trailing-slash

---

## Sprint D — Content (Phase 5) — IN PROGRESS

**Канон и план:** `docs/content-sprint-50.md` (стилевой канон ОНДА из 3 эталонов + 50 тем с обоснованием + 5 батчей по 10).

**Темп:** 2–3 статьи за сессию с полным циклом (тело 1500–2500w + source manifest + image prompt + регистрация). Качество > скорость.

**Per-article spec:** ≥3 howToSteps с protocolId, 3–5 relatedSlugs, neuralSuggestion, hero blockquote, `## SECTION N: TITLE` headers, `> **The Hack:**` blocks, `[ HARDWARE_VALIDATION ]` footer, `## Common Questions` (5 Q&A), `## TL;DR` (5 bullets), `## References` (DOI footnotes), source manifest в `docs/sources/<slug>.md`.

| # | Slug | Кластер | Status |
|---|---|---|---|
| 1 | `zone-2-cardio-mitochondrial-bandwidth` | Power-grid | ✅ shipped |
| 2 | `cold-thermogenesis-adaptation-curve` | Thermal | ✅ shipped |
| 3 | `deep-sleep-n3-slow-wave-architecture` | Sleep | ⏳ next |
| 4 | `rem-extension-cognitive-defragmentation` | Sleep | ⏳ next |
| 5 | `chronotype-cpu-clock-detection` | Sleep | ⏳ next |
| 6–10 | (Batch 1 продолжение) | mixed | 📋 queued |
| 11–20 | Batch 2: Circadian cluster | Energy-grid | 📋 queued |
| 21–30 | Batch 3: Rising-queries from Trends | mixed | 📋 queued |
| 31–40 | Batch 4: Authority-gap topics | mixed | 📋 queued |
| 41–50 | Batch 5: Wildcards / comparison | mixed | 📋 queued |

**Per-batch ritual** (после каждых 10 статей):
- `npm run build` — все аудиты
- Lighthouse на 3 representative articles (когда CI готов)
- `validate-headings` + `validate-alt-text` + `audit-faq-coverage`
- Обновить internal links (`audit-internal-links.mjs` ⚠️ TODO)
- Ротировать `FEATURED_ARTICLE_SLUGS` (топ-2-3 новые)

---

## Что ещё PENDING из брифа

### Phase 1 (Performance) — single follow-up

| # | Задача | Сложность | Why pending |
|---|---|---|---|
| 1.1 | Initial JS <80KB gzip | L | Требует разбить i18n/articles-meta/index из main chunk; сейчас 135KB. Возможные пути: dynamic import articles-meta только на /articles, lazy i18n loading per-locale, route-level code split на уровне Layout |
| 1.1 | Bundle visualizer (`rollup-plugin-visualizer`) | S | One-off audit tool — install on demand: `npx rollup-plugin-visualizer dist/stats.html` |

### Phase 2 (SEO) — мелкие добивки

| # | Задача | Сложность |
|---|---|---|
| 2.6 | Title/description budget trim (174 titles outside 50-60 range, 106 descriptions outside 140-160) | M (manual rewrite per locale × 5) |

### Phase 3 (GEO) — мелкие добивки

| # | Задача | Сложность | Why pending |
|---|---|---|---|
| 3.3 | `/datasets/onda-corpus.parquet` + embeddings | L | Требует `OPENAI_API_KEY` для embeddings (skip-without-key OK per brief), parquet нужен arrow runtime |

### Phase 5 (Content) — основная работа

48 статей по 2–3 за сессию = 16–24 сессии до полного покрытия.

---

## Build commands cheat-sheet

```bash
# Полная сборка (как в CI)
cd landing && npm run build

# Быстрая итерация (без optimize-images, articles-meta)
cd landing && NODE_OPTIONS='--max-old-space-size=4096' \
  npx vite build && \
  SEO_AUDIT_LABEL=dev INDEXNOW_DISABLED=1 \
  npx tsx scripts/prerender.ts

# Strict mode — fail build на любой content gap
SEO_STRICT=1 npm run build
```

---

## Аудиты — где смотреть отчёты

- `dist/seo-audit/<label>.{json,md}` — seo-crawl baseline
- `dist/seo-audit/hreflang.{json,md}` — hreflang violations
- `dist/seo-audit/jsonld.{json,md}` — JSON-LD validation
- `dist/seo-audit/alt-coverage.json` — alt-text coverage
- `dist/seo-audit/research-citations.json` — citation gaps
- `dist/seo-audit/faq-coverage.json` — FAQ density
- `dist/seo-audit/glossary-definition.json` — first-paragraph format
- `dist/seo-audit/keyword-position.json` — early-keyword position
- `dist/ai-audit/history.jsonl` — AI visibility trend (CI cron)
- `dist/og-images/manifest.json` — generated OG cards inventory
- `dist/lighthouse/summary.{md,json}` — Lighthouse scorecard (CI only, skip locally)
- `public/image-manifest.json` — image dimensions + responsive variants inventory
