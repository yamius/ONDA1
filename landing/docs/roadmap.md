# ONDA Life — Engineering Roadmap

> **Origin:** Distilled from `landing/docs/sprint-status.md` + `landing/docs/session-handoff.md` (created by Replit Agent across ~19 commits in a "10-Hour Optimization Marathon"). Repo was rolled back to commit `f7ae5e0` on 2026-05-03 because Replit work was hard to review piece-by-piece. We now rebuild the same scope properly: small PRs, build-tested, manually reviewed.
> **Replit archive:** Full Replit work preserved in `claude/romantic-joliot-9f0302` branch + tag `replit-marathon-archive` (commit `059f9d0`). Can cherry-pick or diff-reference at any time.
> **Original brief:** "10-Hour Optimization Marathon" — 5 phases (Performance + SEO + GEO/AI + Auto-publish + Content).

---

## Top-level principles (lessons from Replit retro)

1. **One PR ≤ ~500 lines diff.** Replit shipped 19 mixed commits — impossible to bisect bugs.
2. **Build-test locally after every change.** `npm run build` must pass; no commit on red.
3. **Human review before merge to main.** Show diff, wait for OK, then merge.
4. **YMYL caution.** ONDA is biohacking/health = Your-Money-Your-Life category. Google/AI evaluators are strict. Every infrastructure decision must serve E-E-A-T (Experience, Expertise, Authoritativeness, Trust).
5. **No auto-translation at scale without sample human review.** Replit translated RU glossary partially via LLM; Google's webmaster guidelines explicitly call out machine-translated content as auto-generated abuse risk.
6. **No "scaled content" smell.** Bursts of 100+ URLs at once are a March 2024 Helpful Content trigger. Drip-feed via `publishedAt` scheduler at 1 article/week pace, not 50 at once.
7. **Document `Why:` for every non-obvious choice.** Not just `What:`.

---

## Phase 0 — Roadmap restoration & guardrails (do FIRST, after reset)

| # | Task | Acceptance |
|---|---|---|
| 0.1 | Restore this roadmap to `landing/docs/roadmap.md` | File present, committed as first post-reset commit |
| 0.2 | Add `landing/docs/replit-sprint-archive.md` reference (link to memory + tag) | Future sessions know where the archive lives |
| 0.3 | Add lightweight `CONTRIBUTING.md` notes: PR size limit, build-before-commit rule, YMYL principle | Anyone (incl. future Claude sessions) can read the rules |

---

## Phase 1 — Performance baseline

**Goal:** initial JS bundle ≤ 80KB gzip, image LCP < 2.5s mobile, Lighthouse Performance ≥ 90.

**Status before reset:** ~80% done by Replit. Initial bundle was 135KB gzip (target 80KB) — they failed the bundle target but shipped the rest.

| # | Task | File | Acceptance | Risk |
|---|---|---|---|---|
| 1.1 | Lazy-load all 19 page components | `src/main.tsx` | All pages via `lazy()` import; HomePage stays eager | Low — pre-existed |
| 1.2 | Manual chunk splitting (vendor-react, vendor-router, vendor-i18n, vendor-markdown, vendor-supabase) | `vite.config.ts` | `dist/assets/vendor-*.js` files exist | Low — pre-existed |
| 1.3 | NODE_OPTIONS `--max-old-space-size=4096` for build | `package.json` build script | OOM-free build on Replit | Low — pre-existed |
| 1.4 | Parallel prerender I/O (batch 16, async writeFile/mkdir + Promise.all) | `scripts/prerender.ts` | Prerender time < 10s for 558 routes | Medium — touches build pipeline |
| 1.5 | Responsive image ladder 480/640/960/1920w via sharp | `scripts/optimize-images.mjs` | `public/optimized/*.{webp,avif,jpg}` for each source ≥ 480w | Medium — sharp encode timeout risk on Replit (use effort=2 AVIF, =4 WebP) |
| 1.6 | Image manifest with width/height/variants for CLS=0 | `scripts/optimize-images.mjs` → `public/image-manifest.json` | Manifest committed in git, not regen-on-build (Replit /public not persistent) | Medium |
| 1.7 | OptimizedImage srcset component | `src/components/OptimizedImage.tsx` | `<source srcset="...480w, ...640w, ...960w, ...1920w">` | Low |
| 1.8 | Lighthouse CI script (skip-if-no-Chrome) + GitHub Action | `scripts/lighthouse.mjs` + `.github/workflows/lighthouse.yml` | CI uploads `dist/lighthouse/summary.json` | Low |
| 1.9 | **NEW: hit 80KB bundle target** (Replit failed this) | `vite.config.ts`, `src/i18n.ts` | initial JS ≤ 80KB gzip via lazy i18n + dynamic articles-meta import | High — needs route-level code split for Layout |

**Build-pipeline guardrails:**
- Replit log capped at 199 lines → keep prerender silent (no per-route logs); use 5-stage banners only.
- IndexNow MUST have AbortController timeout (15s) so it cannot hang build.

---

## Phase 2 — SEO infrastructure

**Goal:** 0 hreflang violations, 0 JSON-LD errors, all titles 50-60 chars, all descriptions 140-160 chars, branded OG cards on every page.

**Status before reset:** ~85% done. Description budget = 0 violations ✓. Titles 174/558 still outside budget.

| # | Task | File | Acceptance | Risk |
|---|---|---|---|---|
| 2.1 | Hreflang cluster validator (no orphan, x-default present, x-default = EN) | `scripts/validate-hreflang.mjs` | 0 violations / all URLs | Low |
| 2.2 | Self-referencing hreflang fallback for EN-only pages (glossary, articles, topics, license, privacy, terms, contact) | `scripts/prerender.ts` (last stage) | EN-only pages get `<link rel="alternate" hreflang="en">` + `x-default` | Medium — gate `!out.includes('hreflang=')` to avoid duplicates |
| 2.3 | JSON-LD shape + `@graph` recursive walker validator | `scripts/validate-jsonld.mjs` | 0 errors / all blobs validated; depth-limited recursion | Medium |
| 2.4 | Branded OG-card generator (resvg + svg template) | `scripts/og-image-generator.mjs` | `dist/og-images/<slug>.png` for every URL | Medium — sharp/resvg render |
| 2.5 | OG fallback wired through meta-inject | `scripts/meta-inject.ts` | Every page has `og:image` resolving to `/og-images/<slug>.png` | Low |
| 2.6 | Centralized `trimDescription()` (DESC_MIN=80, DESC_MAX=200) — idempotent, handles short input via padding tail | `scripts/meta-inject.ts` + `prerender.ts` (4 sites: applyLocalizedMeta, metric, level, part) | descriptionOutsideBudget = 0; idempotent across N calls | High — Replit had idempotency bug |
| 2.7 | `escapeHtmlAttr` encodes `'` → `&#39;` (parser safety) | `scripts/meta-inject.ts` | No raw apostrophes in attribute values | Medium — caused regex bug in seo-crawl earlier |
| 2.8 | seo-crawl regex: parse `content="…"` AND `content='…'`, decode entities | `scripts/seo-crawl.mjs` | Reports correct description length for `brain's` etc. | Medium |
| 2.9 | ArticlePage Related rail (3 sibling cards by category) | `src/pages/ArticlePage.tsx` | Visible at bottom of every article | Low |
| 2.10 | ArticlesPage Recently Updated rail (top 5 by `ARTICLE_DATES.modified`) | `src/pages/ArticlesPage.tsx` | Visible on /articles | Low |
| 2.11 | E-E-A-T meta: datePublished/Modified + author meta | meta-inject + JSON-LD | `<meta name="author">`, JSON-LD `Article.author` populated | Low |
| 2.12 | OG: `og:locale` + `og:locale:alternate` on every page | meta-inject | Every page has `og:locale` matching active locale | Low |
| 2.13 | RSS 2.0 + Atom 1.0 feeds for articles | `scripts/feed.ts` | `/feed.xml`, `/atom.xml` valid | Low |
| 2.14 | **MANUAL: title budget trim** — 174 titles outside 50-60 range × 5 locales | `articles/<slug>.ts` `translations[locale].title` | All titles 50-60 chars | High effort — manual rewrite |

**Brand-reinforcement validator:**
- `scripts/validate-brand-reinforcement.mjs` — check ONDA voice markers (STATUS:, HARDWARE_VALIDATION etc) preserved across locales.

---

## Phase 3 — GEO / AI Visibility

**Goal:** ONDA cited by Perplexity / ChatGPT / Claude search / Gemini for biohacking + neuroscience queries. AI crawlers ingest llms.txt + RAG corpus.

**Status before reset:** ~95% done. Pending: parquet + OpenAI embeddings (skip-without-key per brief).

| # | Task | File | Acceptance |
|---|---|---|---|
| 3.1 | AI baseline audit (50 seed prompts, skip-without-key) | `scripts/ai-audit.mjs` + `docs/ai-audit-prompts.md` | History at `dist/ai-audit/history.jsonl` |
| 3.2 | llms.txt aggressive expansion (How-to-cite, Topic taxonomy, Key facts, per-locale × 5, llms-full with anchor IDs) | `scripts/llms-txt.ts` | `/llms.txt` + `/llms-full.txt` + `/{locale}/llms.txt` × 5 |
| 3.3 | RAG corpus dataset | `scripts/rag-corpus.ts` → `/datasets/onda-corpus.jsonl(.gz)` | ~284 records, ~1.7MB; `<link rel="alternate">` in index.html |
| 3.4 | Wikidata entity docs (manual submission tracking) | `docs/wikidata-entities.md` | Track Q-IDs for ONDA, founder bio, key concepts |
| 3.5 | Citation gap audit | `scripts/research-citation-audit.mjs` | Report at `dist/seo-audit/research-citations.json` |
| 3.6 | FAQ JSON-LD framework + density gate | `scripts/audit-faq-coverage.mjs` + meta-inject | All articles with `## Common Questions` section get `FAQPage` schema |
| 3.7 | Topic hub pages (10 hubs, CollectionPage/ItemList JSON-LD) | `src/pages/TopicsPage.tsx`, `TopicPage.tsx`, sitemap inclusion | `/topics` + `/topics/:slug` |
| 3.8 | Glossary first-paragraph format validator | `scripts/validate-glossary-definition.mjs` | 215/215 accepted (Replit had 5 violations) |
| 3.9 | AI-targeted sitemaps + ai.txt | `scripts/sitemap-news.ts`, `sitemap-images.ts` | `/sitemap-news.xml`, `/sitemap-images.xml`, `/ai.txt` |
| 3.10 | Canonical bio doc | `docs/canonical-bio.md` | Source of truth for author bio across surfaces |
| 3.11 | Press coverage tracking | `docs/press-coverage.md` | Backlink + mention log |
| 3.12 | Keyword early-position validator (target term in first 100 chars) | `scripts/validate-keyword-position.mjs` | ≥ 80% pass rate |
| 3.13 | Direct submission automation (Bing + IndexNow) | `scripts/submit-to-engines.mjs` | Diff-based: only newly-published URLs pinged |
| 3.14 | AI audit cron (daily 03:00 UTC) | `.github/workflows/ai-audit.yml` | Secrets: `PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `BRAVE_SEARCH_API_KEY`, `BING_SEARCH_API_KEY` |
| 3.15 | Content licensing (CC-BY-4.0 + /license route) | `LICENSE` + `src/pages/LicensePage.tsx` + `<link rel="license">` | Public license discoverable |
| 3.16 | Brand reinforcement validator | `scripts/validate-brand-reinforcement.mjs` | 0 violations / all articles |
| 3.17 | (PENDING) embeddings + parquet (gated by `ENABLE_EMBEDDINGS`, `ENABLE_PARQUET`) | `scripts/embeddings.mjs`, `scripts/parquet.mjs` | Skip-without-key OK; produces `embeddings/onda-embeddings.jsonl(.gz)` and `onda-corpus.parquet` |

---

## Phase 4 — Auto-publish scheduler

**Goal:** schedule articles months in advance, drip-publish via daily cron, no manual deploy needed.

**Status before reset:** 100% done by Replit, but with concern (see "RISK" below).

| # | Task | File | Acceptance |
|---|---|---|---|
| 4.1 | `Article.publishedAt?: string` field with JSDoc (scheduled / published / legacy semantics) | `src/data/articles/types.ts` | TS interface documented |
| 4.2 | Single-chokepoint registry filter | `src/data/articles/index.ts` | Only published articles exported |
| 4.3 | Scheduler CLI (`set` / `clear` / `list` / `check`, exit-1 when due) | `scripts/schedule-articles.mjs` | `--slugs a,b,c --start 2026-06-10 --interval 7d --time 09:00Z` works |
| 4.4 | Daily empty-commit cron | `.github/workflows/scheduled-publish.yml` | Triggers `npm run build` + push when `publishedAt` becomes past |
| 4.5 | All downstream consumers read `publishedAt` (sitemap, feed, llms-txt, prerender, corpus, sitemap-news) | various | RSS pubDate / JSON-LD datePublished / Article.datePublished synced |
| 4.6 | IndexNow diff catches newly-published URLs | `scripts/submit-to-engines.mjs` | Only new diff pinged |
| 4.7 | Workflow doc | `docs/auto-publish.md` | Author writeup with deploy-pipeline caveat |

**RISK:** if `<lastmod>` in sitemap is bumped from git commit time instead of `Article.modified`, every empty-commit cron looks like a fake content-refresh to Google → "stale-content refresh manipulation" pattern. **Acceptance must include:** sitemap `<lastmod>` reads from `Article.modified` ONLY, never from filesystem mtime or git log.

---

## Phase 5 — Content sprint (50 articles)

**Goal:** 50 long-form articles (1500-2500w each) covering biohacking + neuroscience clusters. 2-3 per session = 16-24 sessions to complete.

**Canon:** `landing/docs/content-sprint-50.md` (must restore from Replit archive — keep their canon).

**Status before reset:** 2/50 shipped (`zone-2-cardio-mitochondrial-bandwidth`, `cold-thermogenesis-adaptation-curve`).

### Per-article spec (mandatory)

- Body 1500-2500w in `landing/src/data/articles/<slug>.ts`
- ≥ 3 howToSteps with `protocolId`
- 3-5 `relatedSlugs`
- 1 `neuralSuggestion`
- Hero blockquote
- `## SECTION N: TITLE` headers
- `> **The Hack:**` blocks for protocols
- `[ HARDWARE_VALIDATION ]` footer block
- `## Common Questions` (5 Q&A → fuels FAQPage JSON-LD)
- `## TL;DR` (5 bullets)
- `## References` (DOI/PubMed footnotes)
- Source manifest in `landing/docs/sources/<slug>.md`
- Image prompt in `landing/docs/image-prompts/<slug>.md`
- Stub translation in `landing/public/locales/{es,ru,uk,zh}/articles.json` `bodies.<slug>` (min: title + description)

### ONDA voice rules (do NOT translate)

Brand markers always stay EN even in localized text:
`STATUS:`, `SYSTEM_ALERT`, `HARDWARE_VALIDATION`, `IMPACT_LOG`, `ONDA_STATEMENT`, `FINALIZE_ANALYSIS`

Abbreviations preserve verbatim across all locales:
`HRV`, `ATP`, `ACh`, `mtDNA`, `BAT`, `NIR`, `CSF`, `GABA`, `CPG`, `AMPK`, `NAD+`, `fMRI`, etc.

Article categories enum (do NOT extend without owner approval):
`'Neural Hardware'` / `'Biological Software'` / `'OS States'` / `'ONDA Protocol'`

### Content roadmap (50 slugs in 5 batches × 10)

Slugs 1-2 done. Next sequence (from Replit `sprint-status.md`):

| # | Slug | Cluster |
|---|---|---|
| 1 | `zone-2-cardio-mitochondrial-bandwidth` | Power-grid ✅ |
| 2 | `cold-thermogenesis-adaptation-curve` | Thermal ✅ |
| 3 | `deep-sleep-n3-slow-wave-architecture` | Sleep |
| 4 | `rem-extension-cognitive-defragmentation` | Sleep |
| 5 | `chronotype-cpu-clock-detection` | Sleep |
| 6-10 | Batch 1 continuation | mixed |
| 11-20 | Batch 2: Circadian cluster | Energy-grid |
| 21-30 | Batch 3: Rising-queries from Trends | mixed |
| 31-40 | Batch 4: Authority-gap topics | mixed |
| 41-50 | Batch 5: Wildcards / comparison | mixed |

**Per-batch ritual** (after every 10 articles):
- `npm run build` — all audits
- Lighthouse on 3 representative articles
- `validate-headings`, `validate-alt-text`, `audit-faq-coverage`
- Update internal links (`audit-internal-links.mjs` ⚠️ Replit had as TODO)
- Rotate `FEATURED_ARTICLE_SLUGS` (top 2-3 newest)

### Drip-feed pacing (anti-scaled-content)

Use Phase 4 scheduler: 1 article published per 7 days = looks human. NEVER batch-publish all 50 at once. Each new article gets `publishedAt: 2026-06-10T09:00Z + N*7d`.

---

## Translation tracks (parallel work)

| Locale | Articles | Glossary body | Status |
|---|---|---|---|
| EN | 67/67 | 215/215 (source of truth) | ✓ |
| ES | 67/67 | 210/215 | ✓ (LLM, no human review yet) |
| RU | 67/67 | partial (~?/215) | ⚠️ LLM, partial, no human review |
| UK | 67/67 | 0/215 | ⏳ |
| ZH | 67/67 | 0/215 | ⏳ |

**Policy:** do NOT auto-translate UK/ZH glossary at scale until we have a human reviewer for at least sample. Risk = scaled-content abuse signal to Google.

**For NEW articles** (#3-50): provide stub translation (title + description) per locale. Full body translation done in batches with sample review.

---

## E-E-A-T track (CRITICAL for YMYL ranking)

Must exist before serious Google traffic on health queries:

- [ ] Real author bio with credentials at `/about` or `/team` (PhD/MD/research bg, photo, LinkedIn)
- [ ] Every article links `<author>` to author page
- [ ] Medical reviewer signature on YMYL articles (or explicit "this is opinion / for education only" disclaimer)
- [ ] About page with org structure, mission, contact
- [ ] Real backlinks from other domains (digital PR / guest posts / scientific blogs) — this is manual outreach, no script

---

## Push policy

- **Translation/content batches** → push to main allowed without PR (after build-test passes)
- **Infrastructure changes** (`scripts/`, `pages/`, build pipeline) → feature branch + manual diff review + my OK before merge
- **Push to main** is gated — needs explicit user permission per session unless one-time auth granted in advance
- **Force-push to main** only with explicit per-instance authorization

---

## Commands cheat-sheet

```bash
# Full build (as in CI)
cd landing && npm run build

# Quiet build (no IndexNow ping)
INDEXNOW_DISABLED=1 npm run build

# SEO crawl audit
SEO_AUDIT_LABEL=manual SEO_STRICT=0 tsx scripts/seo-crawl.mjs

# Strict mode — fail build on any content gap
SEO_STRICT=1 npm run build

# Schedule article batch
node scripts/schedule-articles.mjs --slugs a,b,c --start 2026-06-10 --interval 7d --time 09:00Z

# Re-generate articles-meta from article TS bodies
tsx scripts/articles-meta.ts

# Lighthouse local (requires Chrome)
node scripts/lighthouse.mjs
```

## Environment notes

- **Replit Deployments** — `/public` between builds NOT guaranteed → AVIF/WebP + `image-manifest.generated.json` MUST be committed in git, not regenerated on build.
- **Build log capped at ~199 lines** on Replit — keep prerender silent; per-stage banners only.
- **IndexNow** must have 15s `AbortController` timeout — never let it hang the build.
- **Sharp encode effort** lowered to AVIF=2 / WebP=4 to avoid Replit timeout.
- **Node 20** pinned in `.replit` and `replit.nix`.

## Key files reference (after re-build)

```
landing/docs/roadmap.md                       — this file (in-repo copy)
landing/docs/replit-sprint-archive.md         — pointer to memory archive + tag
landing/docs/content-sprint-50.md             — 50-article topic plan (re-introduce from Replit archive)
landing/docs/auto-publish.md                  — scheduler workflow
landing/docs/seo-verification.md              — GSC/Bing/Yandex ownership status
landing/scripts/articles-meta.ts              — slim ArticleMeta generator for bundle split
landing/scripts/prerender.ts                  — SSR pipeline with 5-stage banners
landing/scripts/schedule-articles.mjs         — publish scheduler CLI
landing/src/data/articles/index.ts            — registry with publishedAt filter
landing/src/data/articles/types.ts            — Article interface
.github/workflows/scheduled-publish.yml       — daily cron rebuild
.github/workflows/ai-audit.yml                — daily AI visibility tracking
.github/workflows/lighthouse.yml              — performance regression CI
```

## How to use this roadmap

1. Pick a phase task (e.g. 1.5 Image ladder).
2. Reference Replit's implementation in archive: `git show replit-marathon-archive:landing/scripts/optimize-images.mjs`
3. Decide: re-implement from scratch, or cherry-pick + review with diff?
4. Make change in feature branch ≤ 500 lines.
5. `npm run build` locally — must pass green.
6. Show diff to user, wait for OK.
7. Merge to main.
8. Mark task done in this roadmap (update file).

---

## Phase 6 — SEO audit findings (2026-05-29)

> **Origin:** Full-site SEO/GEO/performance audit run 2026-05-29 against the live build
> (843 prerendered routes, 215 glossary terms, 80 reviews, 8 round-ups). The site already
> scores above-average — clean robots.txt with explicit AI-bot allowlist, hreflang clusters,
> premium JSON-LD (TechArticle/FAQPage/HowTo/DefinedTerm/Product/Review/Dataset), llms.txt +
> ai.txt, multi-locale prerender. This phase tracks the gaps the audit surfaced, ordered by
> ROI (impact ÷ effort).

### 6A — Quick wins

| # | Task | File | Acceptance | Status |
|---|---|---|---|---|
| 6.1 | **H1 on review pages.** ~~Review pages had NO `<h1>`~~ — **FALSE ALARM.** Audit grep was fooled by React `<!-- -->` text-node markers (`{review.name} review` renders `<h1>Oura Ring 4<!-- --> review</h1>`). Review pages DO have a correct single `<h1>` at `ReviewPage.tsx:75`. No change needed. | `src/pages/ReviewPage.tsx:75` | Already correct | ✅ already done |
| 6.2 | **Title truncation bug.** Homepage HTML title rendered `ONDA Life \| Biohacking App, HRV Tracker &amp…` — truncated with ellipsis. Root cause: `truncateForBudget` counted the HTML-encoded string (`&amp;` = 5 chars) instead of decoded `&` (1 char), pushing a 58-char source title over budget. **Fixed:** function now measures decoded length, re-encodes &/</> only on the encoded call path. | `scripts/meta-inject.ts` (truncateForBudget) | No `…` in any `<title>` whose decoded source ≤ budget. Verified: homepage now full. | ✅ done 2026-05-29 |
| 6.3 | **TITLE_MAX 60 → 65.** Google desktop SERP renders ~70-78 chars in 2026; 60 over-conservative. | `scripts/meta-inject.ts:44` | `TITLE_MAX = 65` | ✅ done 2026-05-29 |
| 6.11 | **SpeakableSpecification on reviews** (pulled forward from 6C in place of 6.1's no-op). Articles had speakable markup; reviews didn't. Added `speakable` to Review JSON-LD (`['h1', '#review-summary']`) + stable `id="review-summary"` on the summary paragraph. | `scripts/meta-inject.ts` (buildReviewJsonLd) + `src/pages/ReviewPage.tsx` | Every review page emits SpeakableSpecification. Verified. | ✅ done 2026-05-29 |
| 6.4 | **Inline glossary links on review pages.** Articles got a rich inline-glossary-link pass (2026-05-29); reviews did not. Reviews discuss HRV / VO2max / ATP etc. but link only to sibling reviews. Add contextual `[term](/glossary/slug)` links in review summary/verdict/criteria copy. | `src/data/reviews/*.ts` (criteria notes, summaries) OR review render layer | ≥ 30 new internal glossary backlinks from review pages | ☐ next |

### 6B — High-impact, needs a decision or larger effort

| # | Task | Impact | Effort | Blocker / decision needed |
|---|---|---|---|---|
| 6.5 | **Product images on review pages.** `<img>` count = 0 on review pages; Product schema has no `image:` field. Kills Google Image + Shopping surfaces for 80 review pages. | 🔴 High | 1-2 days | DECISION: generate (DALL-E/MJ branded renders), buy stock, or use manufacturer press images (licensing risk)? |
| 6.6 | **Product schema `image` field.** Once 6.5 lands, add `image: [url]` to the `Product` JSON-LD for rich-result eligibility. | 🟡 Med | 5 min | Depends on 6.5 |
| 6.7 | **Image sitemap for reviews + glossary.** `sitemap.xml` has 68 `<image:loc>` entries — all articles. Reviews/glossary absent. Extend generator after 6.5. | 🟡 Med | 30 min | Depends on 6.5 |
| 6.8 | **Inline Author Person entity on review pages.** Review schema references `author` by `@id` but the `Person` entity is only emitted on homepage. Valid via @id, but Google sometimes prefers inline. Emit sparse Person (4 fields) per review. | 🟢 Low | 20 min | None |

### 6C — Performance / nice-to-have

| # | Task | Impact | Effort | Notes |
|---|---|---|---|---|
| 6.9 | **Entry bundle 1.4MB raw (107KB gzip).** Gzip is under budget; raw parse/execute cost hits INP on slow mobile. Vendor-chunk React/ReactDOM, split heavy review/meditation data further. | 🔵 Low | Med | Diminishing returns — Vite chunking already smart |
| 6.10 | **Render-blocking CSS (87KB sync in head).** Inline critical CSS, async the rest. ~100-200ms LCP win on slow connections. | 🔵 Low | Med | Vite critical-CSS plugin |
| 6.11 | **SpeakableSpecification on reviews.** ~~Articles have it; reviews don't.~~ **DONE 2026-05-29** — pulled forward into 6A (see above). | 🔵 Low | 30 min | ✅ done |
| 6.12 | **NewsArticle vs TechArticle for round-ups.** "Best X 2026" round-ups are time-sensitive — `Article` with publication-date priority fits Google News better than `TechArticle`. | 🔵 Low | 1 hr | Contextual judgment per round-up |
| 6.13 | **FAQ position above fold.** FAQPage schema present, but if FAQ `<details>` sit at page bottom Google may skip them. Audit placement. | 🔵 Low | Audit | None |

### Audit baseline snapshot (2026-05-29)

- robots.txt: ✓ clean, AI allowlist present, /api /decks /p disallowed
- sitemap.xml: 842 URLs, hreflang clusters, 68 article image entries
- sitemap-news.xml: 48h rolling window ✓
- JSON-LD: TechArticle, FAQPage, HowTo, DefinedTerm, DefinedTermSet, Product, Review, Offer, Rating, Brand, ItemList, CollectionPage, Dataset, Organization, Person, WebSite, SearchAction ✓
- ImageObject license fields: ✓ (fixed 2026-05-29, CC BY-NC-SA 4.0)
- Bundle: entry 107KB gzip (budget 150KB) ✓; raw 1.4MB
- Images: 74 PNG sources → 147 WebP + 138 AVIF variants
- TITLE_MAX 60 / DESC_MAX 160
- Build: 843 pages, validate-seo clean, ~61s warm
