# Session Handoff — Continue Optimization Work

> Read this first when picking up the optimization work in a new session.
> Then read `landing/docs/sprint-status.md` for the detailed sprint state.

## Стан репо на момент передачі (2026-05-03)

- Branch: `claude/romantic-joliot-9f0302` (worktree at `D:/_ONDA/Cursor/ONDA1/.claude/worktrees/romantic-joliot-9f0302`), in sync with `origin/main`.
- Останній push: `be3a282` — Add Russian translations for glossary terms.
- 17 коммітів від Replit реалізували brief "10-Hour Optimization Marathon" (Performance + SEO + GEO + Auto-publish + 2/50 articles).

## Що зроблено за попередні сесії

### Translations (повністю)
- Articles: RU 67/67, UK 67/67, ZH 67/67 — push'ені в main.
- 5 локалей: en, es, ru, uk, zh.

### Glossary (часткова)
- ES: 210 термінів body localized.
- RU: частковий переклад від Replit сесії (комміт `be3a282`).
- UK, ZH: 0 термінів (UI-keys only).

### Інфраструктура (детально у `sprint-status.md`)
- **Phase 1 (Performance) ~80%** — image ladder 480/640/960/1920w, parallel prerender, lazy-load, manifest, Lighthouse CI. Initial JS bundle = 135KB gzip (target був 80KB).
- **Phase 2 (SEO) ~85%** — hreflang validator (0 violations), JSON-LD validator (0 errors), description budget 106→0, OG image generator, internal linking rails.
- **Phase 3 (GEO/AI) ~95%** — llms.txt × 5 локалей, RAG corpus у `/datasets/onda-corpus.jsonl`, ai.txt, sitemap-news/images, FAQ JSON-LD framework, brand reinforcement validator, LICENSE CC-BY-4.0 + `/license` route, Wikidata docs, AI audit cron. Pending: parquet + OpenAI embeddings (skip-without-key).
- **Phase 4 (Auto-publish) 100%** — `Article.publishedAt`, scheduler CLI, daily empty-commit cron у GitHub Actions.
- **Phase 5 (Content 50 articles) 4%** — `zone-2-cardio-mitochondrial-bandwidth` + `cold-thermogenesis-adaptation-curve` shipped. 48 left.

### Не задеплоєно ще
Користувач НЕ натискав Deploy у Replit після push. Перший деплой з усіма змінами ще попереду.

## Що робити в наступній сесії

### Crisis mode: якщо деплой впав
Найбільш імовірні точки відмови, по убутку ймовірності:

1. `landing/src/i18n-server.ts` міг бути не створений / зламаний. `prerender.ts` від нього залежить, без нього SSR ламається. Перша перевірка: `cat landing/src/i18n-server.ts` — має існувати, експортувати ініціалізований i18n instance.
2. `tsx scripts/articles-meta.ts` падає → весь pipeline ламається. Файл генерує `landing/src/data/articles/articles-meta.generated.ts` який імпортується в `SitemapPage`, `ArticlePage`, `GlossaryTermPage`.
3. TypeScript помилка в одному з нових файлів — нові pages (`LicensePage.tsx`, `TopicPage.tsx`, `TopicsPage.tsx`) або нові скрипти у `landing/scripts/*.mjs`.
4. `landing/src/data/image-manifest.generated.json` — генерується `optimize-images.mjs`, OptimizedImage.tsx його імпортує. Якщо файл відсутній і JSON порожній на старті build — все одно має працювати (fallback до single src). Перевірити що він закомічений у git.
5. Replit cap на 199-line log — diagnostic banners у `prerender.ts` тепер `[build] sitemap`, `[build] feed` etc., але якщо знову truncate'ується — перевірити IndexNow timeout (вже 15s) і шукати на якій banner-line зник лог.

### Happy path: якщо деплой пройшов
1. Перевірити URL: `https://onda-life.com/llms.txt`, `/datasets/onda-corpus.jsonl`, `/sitemap.xml`, `/sitemap-news.xml`, `/sitemap-images.xml`, `/feed.xml`, `/atom.xml`, `/license`, `/topics`, `/topics/hrv` — все має віддавати 200.
2. Google Rich Results Test на 3 URL: home, `/articles/vagus-nerve-master-key`, `/glossary/dopamine`. Підтвердити Article + HowTo + DefinedTerm + BreadcrumbList + FAQPage всі validated.
3. Submit `sitemap.xml` у GSC + Bing Webmaster + Yandex Webmaster (verification IDs у `<meta>` в `index.html`, перевірити що активні).
4. Пройтися по `sprint-status.md` секцією "Что ещё PENDING":
   - Bundle <80KB gzip (Phase 1.1) — потребує dynamic import articles-meta тільки на /articles, lazy i18n.
   - Title budget trim (174 outside 50-60) — manual rewrite per locale × 5.
   - Glossary first-paragraph format (5 violations) — у `dist/seo-audit/glossary-definition.json`.

### Continued content sprint (Phase 5)
Канон у `landing/docs/content-sprint-50.md` — 50 тем по 5 батчах. Темп: 2-3 статті за сесію з повним циклом:
- Тіло 1500-2500 слів у `landing/src/data/articles/<slug>.ts`.
- Source manifest у `landing/docs/sources/<slug>.md` (DOI/PubMed citations).
- Image prompt у `landing/docs/image-prompts/<slug>.md` (для подальшої генерації).
- Реєстрація імпорту + spread у `landing/src/data/articles/index.ts`.
- ≥3 howToSteps з protocolId, 3-5 relatedSlugs, neuralSuggestion.
- `## Common Questions` (5 Q&A для FAQPage JSON-LD), `## TL;DR` (5 bullets), `## References` (footnote citations).
- Stub переклади у `landing/public/locales/{es,ru,uk,zh}/articles.json` `bodies.<slug>` (мінімум title + description).

Першими йти batch 1 продовження — slugs 3-10 у `sprint-status.md` таблиці.

### Translation gaps (паралельний трек)
- **Glossary RU/UK/ZH bodies** — основна прогалина. ES має 210 повністю. RU частково (від Replit). UK + ZH = 0.
- **Article body для нових 2 статей** (zone-2-cardio, cold-thermogenesis) у всіх 4 не-EN локалях.

## Стиль і конвенції (важливо для контент-сприну)

- **ONDA voice**: technical-poetic-engineering. Біоніка + операційна система + кіберпанк-медицина. Тіло як "biocomputer", "hardware", "firmware".
- **Section headers**: `## SECTION N: TITLE` або `## [ ALL CAPS BLOCK ]`.
- **Protocols**: `> **The Hack:** ...` блокноти.
- **Footer**: `> [ HARDWARE_VALIDATION ]\n> VALIDATION_DEVICE: ...\n> METRIC: ...\n> STATUS: ...` блок.
- **Brand markers** (STATUS:, SYSTEM_ALERT, HARDWARE_VALIDATION, IMPACT_LOG, ONDA_STATEMENT, FINALIZE_ANALYSIS) — **залишати в EN** навіть у локалізованих текстах.
- **Abbreviations** (HRV, ATP, ACh, mtDNA, BAT, NIR, CSF, GABA, CPG, AMPK, NAD+, fMRI, etc.) — preserve verbatim.
- **Категорії статей** строго з enum: `'Neural Hardware'` / `'Biological Software'` / `'OS States'` / `'ONDA Protocol'`. Нові не додавати без рішення власника.

## Push policy

- Translation/content batches → push до main допустимо без PR.
- Інфраструктурні зміни (scripts/, pages/, build pipeline) → feature branch + manual review.
- Push в main блокується guardrail'ом — потрібен явний дозвіл користувача (раніше працювало через одноразовий "одноразове разрешение", або через rebase + force-with-lease при деплоях).

## Useful commands

```bash
# Локальний build (потребує node_modules — у поточному worktree відсутні)
cd landing && npm run build

# Schedule batch
node scripts/schedule-articles.mjs --slugs slug-a,slug-b,slug-c --start 2026-06-10 --interval 7d --time 09:00Z

# Тихий build для тестів (без IndexNow ping)
INDEXNOW_DISABLED=1 npm run build

# SEO crawl audit
SEO_AUDIT_LABEL=manual SEO_STRICT=0 tsx scripts/seo-crawl.mjs

# Re-generate articles-meta з тіла article TS
tsx scripts/articles-meta.ts

# Lighthouse local (потребує chrome)
node scripts/lighthouse.mjs
```

## Деплой-середовище

- Replit Deployments. Persistent /public між білдами не гарантується — тому AVIF/WebP та `image-manifest.generated.json` закомічені в git.
- Build лог обмежений ~199 рядками. `prerender.ts` тихий (per-route logs прибрано), кожна стадія pipeline має banner.
- IndexNow має 15-секундний AbortController timeout.
- Sharp encode effort знижений (AVIF=2, WebP=4) щоб не таймаутити.

## Контекст про користувача

- Власник `yamius/ONDA1`, бренд ONDA Life (https://onda-life.com).
- Перші мови: російська + українська. Англійську читає вільно.
- Стиль: коротко, по суті, без verbose. Не любить чрезмерну верзію в моїх відповідях.
- Працює в auto-mode з course corrections. Воліє щоб AI робив сам, питав мінімум.
- Любить конкретні plan-of-action з пронумерованими кроками + acceptance criteria.
- Деплой робить через Replit UI (не CLI), пуш у main триггерить деплой автоматично.

## Ключові файли для перших 5 хвилин

```
landing/docs/sprint-status.md           — детальний звіт всіх спринтів
landing/docs/content-sprint-50.md       — топік-план для Phase 5
landing/docs/auto-publish.md            — як працює scheduler
landing/docs/seo-verification.md        — статус GSC/Bing/Yandex ownership
landing/scripts/articles-meta.ts        — генератор slim ArticleMeta для bundle split
landing/src/data/articles/index.ts      — registry з publishedAt filter
landing/src/data/articles/types.ts      — Article interface (з publishedAt JSDoc)
landing/scripts/prerender.ts            — SSR pipeline з 5-stage banners
landing/scripts/schedule-articles.mjs   — CLI планувальник публікацій
.github/workflows/scheduled-publish.yml — daily cron rebuild
.github/workflows/ai-audit.yml          — daily AI visibility tracking
.github/workflows/lighthouse.yml        — performance regression CI
```
