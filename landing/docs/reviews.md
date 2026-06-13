# Reviews / round-up system

The `/reviews` hub: ONDA's editorial reviews, ranked round-ups and head-to-head duels of biohacking tools, scored against a fixed public rubric and emitted with `schema.org/Review` + `ItemList` JSON-LD for SEO/AI-answer surfaces.

## Content model

Everything lives under `landing/src/data/reviews/` (~180 files). Three data archetypes plus a per-category criteria set, all typed in `landing/src/data/reviews/types.ts`:

**`ToolReview`** — one product, one file (e.g. `apollo-neuro.ts`), default-exported. Key fields (`types.ts:78`):
- `slug`, `name`, `brand`, `category` (a `ReviewCategory` — see below), `productType`.
- `description` (SEO meta), `verdict` (one quotable line for AI answers), `summary` (TL;DR above the fold).
- `overallScore` (0–10, one decimal — the weighted mean of `scores`) and `scores[]` (per-`CriterionScore`: `criterionId` must match a `Criterion.id` for the review's category, `score`, `note`).
- `pros[]`, `cons[]`, `bestFor`.
- `testStatus`: `'hands-on' | 'evidence-based'` plus a verbatim `testNote` — the core honesty signal.
- `price?` (`{ usd, note?, asOf }` — `asOf` is the ISO date the price was last verified), `link`, `linkType` (`'official' | 'affiliate'`; v1 ships everything `'official'`).
- `image?` / `imageAlt?` — optional real product photo; **when absent the generated score card is used everywhere** (see SEO).
- `content` — Markdown body (cross-links into `/articles/*` and `/glossary/*`), `references?[]`, `relatedSlugs?[]`.
- `datePublished`, `dateModified` (drives sitemap `<lastmod>` and the "Updated" UI), optional `publishOn` date-gate.

**`Comparison`** — a ranked round-up that composes several `ToolReview`s (e.g. `best-hrv-trackers-2026.ts`). Fields (`types.ts:205`): `slug`, `title`, `description`, `intro`, `category`, `picks[]` (each `{ reviewSlug, award, takeaway }` — **array order is the ranking**), `verdict`, `faq[]` (feeds FAQPage JSON-LD + on-page FAQ), `content`, dates, optional `publishOn`. `getReviewsForComparison()` (`index.ts:469`) resolves picks → reviews in rank order, dropping any pick whose `reviewSlug` has no live review.

**`HeadToHead`** — a 2- or 3-way "X vs Y( vs Z)" duel (`landing/src/data/reviews/head-to-head/`, one file per duel + `index.ts`). Distinct from `Comparison` (which ranks ≥3 products). Fields (`types.ts:159`): `productASlug`/`productBSlug`/`productCSlug?`, `title`, `winnerSlug` (or `null` for a deliberate tie), `verdict`, `bestForA/B/C`, `axes[]` (each row picks `winner: 'a'|'b'|'c'|'tie'`), `faq[]`, `content`, `relatedComparisonSlug?`, dates, optional `publishOn`.

**Criteria / methodology** — `landing/src/data/reviews/criteria.ts` is the single source of truth for scoring. `CRITERIA` keys each `ReviewCategory` to a `Criterion[]` whose `weight`s sum to 1.0; `overallScore` is the weighted mean of a review's `scores`. The 16 categories (`ReviewCategory` in `types.ts:16`) each get their own rubric, human label (`CATEGORY_LABELS`), display order (`REVIEW_CATEGORIES`) and a search-keyword URL slug (`CATEGORY_URL_SLUGS`, e.g. `hrv-wearable` → `hrv-trackers`). The public `/reviews/methodology` page (`landing/src/pages/ReviewMethodologyPage.tsx`) renders these criteria straight from data so it can never drift from the scores it explains.

### Pages and routes
Routes are wired in `landing/src/entry-server.tsx` (`:202`):
- `/reviews` — hub (`ReviewsPage.tsx`)
- `/reviews/methodology` — `ReviewMethodologyPage.tsx`
- `/reviews/compare/:slug` — round-up (`ComparisonPage.tsx`)
- `/reviews/vs/:slug` — duel (`HeadToHeadPage.tsx`)
- `/reviews/:slug` — `ReviewsSlugRouter` resolves to either a per-category landing page (`ReviewCategoryPage.tsx`, when slug is in `CATEGORY_URL_SLUG_SET`) or an individual product review (`ReviewPage.tsx`). Localized mirrors exist under `/{lang}/reviews/...`.

## Date-gated drip publishing

The gate lives in the **data index files**, not the routing layer. Each registry captures `TODAY` once at module load and exports a filtered live view:
- Reviews + round-ups: `landing/src/data/reviews/index.ts:417` / `:443` — `reviews` / `comparisons` are `ALL_REVIEWS` / `ALL_COMPARISONS` filtered by `!publishOn || publishOn <= TODAY`.
- Duels: `landing/src/data/reviews/head-to-head/index.ts:308` — same filter on `headToHeads`.

Because every consumer (hub, category grids, review-page rails, lookup helpers `getReviewBySlug`/`getComparisonBySlug`/`getHeadToHeadBySlug`, the prerender route list, sitemap, JSON-LD) reads only the filtered exports, a future-dated entry is invisible site-wide until its `publishOn` arrives — it isn't prerendered, so its URL 404s until then. `LIVE_REVIEW_CATEGORIES` (`index.ts:455`) further ensures category grids never link to a category whose landing page isn't live yet. The current registry has batches gated through 2026-07-27 (e.g. smart-sleep-climate to 2026-06-15, PEMF to 2026-06-22). Whether a gated entry is live depends on the **build date** — these are static prerendered pages, so a new build must run on/after `publishOn` for the entry to appear.

## SEO

- **Product / Review JSON-LD** — `landing/scripts/meta-inject.ts` injects per-route schema at build time. `buildReviewJsonLd` (`:1250`) emits a `schema.org/Review` with an `itemReviewed` `Product`, `positiveNotes`/`negativeNotes` from pros/cons, an `Offer` when `price` is set, and a **single editorial `reviewRating` (0–10), deliberately never an `aggregateRating`** (which would imply user ratings ONDA doesn't have); it also adds `SpeakableSpecification` for voice answers. Round-ups emit `CollectionPage` + `ItemList` (`buildComparisonItemListJsonLd`, `:1330`) plus FAQPage; duels emit an `ItemList` of the contenders. Breadcrumbs and per-route titles/descriptions for the hub, methodology, category, review, compare and vs routes are all built here too.
- **OG / score cards** — `landing/scripts/generate-review-cards.ts` renders a branded 1200×630 PNG per review and per round-up (SVG → PNG via `sharp`) to `dist/images/reviews/<slug>.png` at **build time** (so date-gated entries get a card the build after they go live). Each card gives the page a real `Product.image`, a unique `og:image`/`twitter:image`, and a visible hero `<img>`. A review that later sets `image:` in its data file overrides the card everywhere — `meta-inject` and the page both fall back to the card only when `image` is absent. Sitemap image entries (`landing/scripts/sitemap.ts`) point at the same `/images/reviews/<slug>.png`; `<lastmod>` comes from each entry's `dateModified`.

## "Adding a review" checklist

1. **Create the data file** `landing/src/data/reviews/<slug>.ts` — default-export a `ToolReview`. The `slug` must be unique and must not collide with any value in `CATEGORY_URL_SLUGS` (those are reserved for category landing pages). Set `category` to an existing `ReviewCategory`; every entry in `scores[]` must use a `criterionId` from that category's rubric in `criteria.ts`, and `overallScore` should equal the weighted mean of those scores.
2. **Register it** in `landing/src/data/reviews/index.ts`: add the `import` and place it in `ALL_REVIEWS` (categories are ordered by `overallScore` — keep that convention).
3. **(Optional) drip it** — set `publishOn: 'YYYY-MM-DD'` to keep it hidden until that build date.
4. **(Optional) add it to a round-up** — add a `{ reviewSlug, award, takeaway }` pick to the relevant `Comparison` file (rank = array position).
5. **(Optional) add head-to-head duels** — create `head-to-head/<a>-vs-<b>.ts` and register it in `head-to-head/index.ts` (`ALL_HEAD_TO_HEADS`).
6. **New category only** — extend `ReviewCategory` (`types.ts`), then add the rubric to `CRITERIA`, label to `CATEGORY_LABELS`, ordering to `REVIEW_CATEGORIES`, and URL slug to `CATEGORY_URL_SLUGS` — all in `criteria.ts`.
7. **Build** — the score card (`generate-review-cards.ts`), JSON-LD/meta (`meta-inject.ts`), prerendered routes (`prerender-routes.ts`) and sitemap entries are all generated automatically from the registry at build time. No manual route edits are needed; routing already handles `/reviews/:slug`. Provide a real `image:` only if you have a licensed product photo — otherwise the generated card is used.

## Source files / where things live

- `landing/src/data/reviews/types.ts` — `ToolReview`, `Comparison`, `HeadToHead`, `Criterion` and supporting types.
- `landing/src/data/reviews/index.ts` — registry, live-view date filter, lookup helpers (`getReviewBySlug`, `getComparisonBySlug`, `getReviewsForComparison`, `LIVE_REVIEW_CATEGORIES`).
- `landing/src/data/reviews/criteria.ts` — per-category rubrics, labels, ordering, URL slugs, `getCriteria`/`getCategoryByUrlSlug`.
- `landing/src/data/reviews/<slug>.ts` — one file per product review (~180).
- `landing/src/data/reviews/head-to-head/` — duel data files + `index.ts` registry/filter.
- `landing/src/pages/ReviewsPage.tsx`, `ReviewPage.tsx`, `ReviewCategoryPage.tsx`, `ComparisonPage.tsx`, `HeadToHeadPage.tsx`, `ReviewMethodologyPage.tsx` — page components.
- `landing/src/components/ReviewsSlugRouter.tsx` — disambiguates `/reviews/:slug` (category vs product).
- `landing/src/config/routes.ts` — route constants (no review-specific entries; routing is in `entry-server.tsx`).
- `landing/scripts/generate-review-cards.ts` — branded OG/score-card PNG generator.
- `landing/scripts/meta-inject.ts` — Review / CollectionPage / FAQ JSON-LD + per-route meta.
- `landing/scripts/prerender-routes.ts` — static route list (reads the filtered live exports).
- `landing/scripts/sitemap.ts` — sitemap URLs, `<lastmod>`, image entries, hreflang.
