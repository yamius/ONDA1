# Auto-publishing pipeline

This document describes how scheduled article publishing works on `landing/`
and how to operate it.

## TL;DR

1. Add `publishedAt: '2026-01-15T08:00:00Z'` to any article in
   `src/data/articles/<slug>.ts`.
2. Commit and merge. The article is **invisible** on every build until that
   timestamp passes.
3. The daily GitHub Actions workflow (`.github/workflows/scheduled-publish.yml`)
   runs at 06:00 UTC. The first build after the timestamp passes regenerates
   the sitemap, RSS/Atom feeds, llms.txt and the JSONL corpus with the article
   live.

No content edit is needed to flip the article live — just wait for the cron.

## Why a single chokepoint

`landing/src/data/articles/index.ts` filters the registry once, at module
load:

```ts
const NOW = Date.now()
function isPublished(a: Article): boolean {
  if (!a.publishedAt) return true
  const t = Date.parse(a.publishedAt)
  if (Number.isNaN(t)) return true
  return t <= NOW
}
export const articles: Article[] = ([...]).filter(isPublished)
```

Every downstream consumer imports `articles` from this single module:

- `scripts/sitemap.ts` (sitemap.xml + per-locale variants)
- `scripts/sitemap-news.ts` (last-48h Google News sitemap)
- `scripts/sitemap-images.ts` (image sitemap)
- `scripts/feed.ts` (RSS + Atom)
- `scripts/llms-txt.ts` (llms.txt + llms-full.txt)
- `scripts/build-corpus.mjs` (JSONL corpus)
- `scripts/articles-meta.ts` (front-end article index)
- `scripts/prerender-routes.ts` (which routes to prerender)
- `scripts/meta-inject.ts` (per-route meta + breadcrumbs)
- `src/pages/ArticlesPage.tsx`, `ArticlePage.tsx`, related-article widgets

Because they all share the registry, a single filter naturally hides scheduled
articles from every public surface — no per-script gating required.

`ArticlePage.tsx` falls through to `NotFoundPage` when the slug isn't in the
filtered registry, so direct URL access to a scheduled article returns a 404
during the prerender step (the route is also absent from the prerender list,
so no static HTML is emitted).

## Date alignment

The `publishedAt` field is the canonical scheduling timestamp **and** the
canonical `datePublished` for SEO surfaces. Three places consume it directly
so JSON-LD, OG metadata, RSS and the JSONL corpus all advertise the same
moment:

| Surface | File | Behavior |
|---|---|---|
| JSON-LD `datePublished` + OG `article:published_time` | `src/pages/ArticlePage.tsx` | `article.publishedAt ?? gitDates.published` |
| RSS pubDate / Atom updated | `scripts/feed.ts` (`articlePubDate`) | `article.publishedAt ?? sourceMtime` |
| sitemap-news `<news:publication_date>` | `scripts/sitemap-news.ts` | `PUBLISHED_AT[slug] ?? gitDates.publishedAt` |
| JSONL corpus `published` | `scripts/build-corpus.mjs` | `a.publishedAt ?? gitDates.publishedAt` |

`dateModified` continues to track git history regardless — `publishedAt` only
overrides the publication moment, not the modification moment.

## CLI: `scripts/schedule-articles.mjs`

```bash
# List everything with status (live / scheduled).
node scripts/schedule-articles.mjs list

# Filter.
node scripts/schedule-articles.mjs list --pending
node scripts/schedule-articles.mjs list --published

# Schedule an article. ISO 8601 in UTC.
node scripts/schedule-articles.mjs set vagus-nerve 2026-01-15T08:00:00Z

# Unschedule (publish immediately on next build).
node scripts/schedule-articles.mjs clear vagus-nerve

# CI sanity: prints articles due in the next 24h.
node scripts/schedule-articles.mjs check
```

The CLI rewrites `src/data/articles/<slug>.ts` in place. Diff is minimal —
it only injects/replaces a single `publishedAt:` line. Commit the result and
merge.

## Daily cron

`.github/workflows/scheduled-publish.yml` runs at 06:00 UTC. It:

1. Checks out `main` with full history (article-dates.generated.ts walks git).
2. `npm ci` inside `landing/`.
3. Runs `schedule-articles check` as a soft warning.
4. Runs `npx vite build` then `npx tsx scripts/prerender.ts` with
   `INDEXNOW_DISABLED=1` and `AI_AUDIT_DISABLED=1` (those stages require live
   credentials and shouldn't run on every cron tick).
5. Uploads the SEO audit artifact for review.

To force a publish off-schedule, run the workflow manually via
**Actions → Scheduled article publish → Run workflow**. Pass `strict: true`
to make any audit warning fatal.

## Optional: `/coming-soon` page

Not implemented yet. The intent is a small page that lists scheduled articles
(slug + `publishedAt`) for internal previews. Because `articles` is filtered,
this would need a parallel un-filtered export (e.g. `articlesIncludingScheduled`)
gated behind a build flag. Skipped for now to keep the surface area minimal.

## IndexNow / RSS interaction

`scripts/indexnow.ts` reads from `dist/sitemap.xml` and submits new URLs to
Bing / Yandex. Since the sitemap is already filtered, scheduled articles are
never submitted. The first build after `publishedAt` passes naturally
generates an IndexNow payload for the new URL — no extra wiring required.

RSS feeds are regenerated on every build with the same filtering logic, so
aggregators (Feedly, Inoreader) pick up the article on its first published
build.

## Deploy hookup (important)

The cron builds `landing/dist/` and uploads the SEO audit as a workflow
artifact, but the workflow does **not** deploy on its own. For scheduled
publishing to be visible in production, one of the following must be true:

- The host pulls `landing/dist/` from a downstream pipeline triggered by the
  cron's commit/build (e.g. a separate deploy workflow watches the artifact
  or the same branch and ships to S3 / Cloudflare / GitHub Pages).
- Or the `Scheduled article publish` workflow is extended with a final
  deploy step (rsync, `aws s3 sync`, `wrangler pages deploy`, etc.) that
  publishes `landing/dist/` to the production origin.

If neither path is wired, scheduled articles will appear in the build
artifact but never in production — verify your deploy pipeline before
relying on `publishedAt`.

## Caveats

- `Date.now()` is captured at module load. A long-running dev server (`npm
  run dev`) won't re-evaluate the registry until restart, so a `publishedAt`
  that passes mid-session won't appear until the next module reload. This is
  fine for builds (each build is a fresh Node process).
- Timezone is always UTC. Always write `Z` suffix in `publishedAt` to avoid
  ambiguity.
- Invalid ISO strings are treated as `published immediately` (graceful
  degradation). The CLI validates input so this only triggers on hand-edits.
- The CLI's in-place edit is regex + brace-counting, not AST-based. It
  assumes article files keep their conventional shape (single top-level
  `const article: Article = { ... }` with no unmatched `}` in string
  literals before the closing brace). If you introduce an exotic template
  literal pattern that breaks this, port the transform to the TypeScript
  compiler API.
