# Translating content (articles, reviews, comparisons, duels, glossary)

One schema, one workflow, automatic checks.

## The pieces

| File | Role |
|---|---|
| `src/data/i18n-schema.ts` | **The schema**: per collection — which locale file/path holds translations, which fields are translatable and in what shape, which fields a published translation must have. |
| `public/locales/<lang>/{articles,reviews,glossary}.json` | **Source of truth** for translations (`bodies`, `comparisons`, `headToHeads`). |
| `scripts/locale-publish.ts` | **One list of localized releases** for every collection (`{ collection, lang, slug, publishOn }`). Older schedules in `prerender-routes.ts` (article drips, review category pilots) still work; this list adds to them. |
| `scripts/i18n-export.ts` | Hands one entry to translators: `translations/<collection>/<slug>/en.json` + `BRIEF.md`. |
| `scripts/i18n-import.ts` | Merges `<lang>.json` translations back, normalizes, optionally publishes, runs the checks. |
| `scripts/i18n-normalize.ts` | Rewrites locale files into the canonical shape (idempotent). |
| `scripts/check-translations.ts` | **Build gate**: every translation vs schema + EN. Errors fail the build; warnings go to `.cache/translation-report.md`. |
| `scripts/check-localized-english.mjs` | **Post-build report**: English sentences on built localized pages (`.cache/localized-english.md`) — catches components that render an EN field instead of the translation. |

## Conventions

- Q&A is always `{ "q", "a" }`.
- Only text is translated. Ids, links, slugs, numbers, flags stay in the EN source — never copy them into a translation (the checker rejects `protocolId`, `neuralSuggestion.link`, `imagePlacement`, …).
- `indexed` lists (`axes`, `howToSteps`) match EN item-for-item. `keyed` maps (`scoreNotes`, `picks`) use EN ids.
- Markdown keeps every link URL; in-page anchors (`#…`) may change with translated headings.

## Workflow: translate one item into every language

```bash
npx tsx scripts/i18n-export.ts reviews oura-ring-4
# → translations/reviews/oura-ring-4/en.json + BRIEF.md
# translate: write translations/reviews/oura-ring-4/<lang>.json (same structure) for each language
npx tsx scripts/i18n-import.ts reviews oura-ring-4 --publish today
npm run build   # schema gate + budget + SEO + localized-English report
```

`en.json` has two parts:
- `entry` — the item's own text.
- `support` — shared strings the page also needs (criteria/category labels, UI strings, product-card lines). Import only **adds** the ones a language is missing; it never overwrites existing translations.

`--publish today|YYYY-MM-DD` appends the releases to `scripts/locale-publish.ts` (route + hreflang + sitemap from that date). Without it the translation is stored but not published.

## Reading the reports

- `check-translations` warnings:
  - *published, but missing: …* — page shows those fields in English.
  - *translation is behind EN* — EN gained links after the translation was made.
  - *still English* — a field was copied, not translated.
- `.cache/localized-english.md` — strings that repeat on many pages usually mean a component isn't reading translations; one-offs are usually untranslated content or links to EN-only articles (expected).

## Release queue (since 2026-10-07)

Waiting translations go live through `scripts/article-release-queue.ts`: **ONE site-wide stream of 20 pages every 2 days** from `QUEUE_START`. Languages take turns (one page per language per turn); each language's list = its queued articles, then the queued review pages (`REVIEW_RELEASE_QUEUE`). To publish a newly translated article, import it **without** `--publish` and append its slug to that language's list in `ARTICLE_RELEASE_QUEUE` (append only; only slugs whose translation body exists). Old weekly drips no longer publish queued slugs. Dates are build-date gates; `.github/workflows/landing-scheduled-rebuild.yml` rebuilds daily (secret `VERCEL_DEPLOY_HOOK_LANDING`).

## /science translations

Science pages use their own pipeline (`content/science-i18n/`, rollout in `src/data/science/i18n.ts`). A stale `sourceHash` in a live language fails the build; see `docs/science-pack/08-handoff-checklist.md` ("Outdated translations") for the fix and the `ALLOW_STALE` override.
