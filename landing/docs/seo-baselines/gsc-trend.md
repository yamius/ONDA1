# GSC Coverage — Weekly Trend

Per-week stats from `npm run audit:gsc`. The full per-URL JSON for each
run lives at `landing/.cache/gsc-history/<date>.json` (gitignored — local
copy only); only the aggregate stats are tracked here so the file stays
small and reviewable across versions.

## Reading the table

- **🔵 Unknown** — Google never crawled the URL. Usually fixes itself
  with the next sitemap refresh; environmental, not per-URL.
- **🟡 Discovered** — Google knows it but hasn't indexed yet. Manual
  GSC URL-Inspection submit accelerates these.
- **🔴 Crawled** — Google fetched and rejected. Content quality issue;
  improve the page before resubmitting.

| Date | URLs | ✅ Indexed | 🟡 Discovered | 🔵 Unknown | 🔴 Crawled | ⚪ Canonical | ⚫ Blocked | API fail |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 2026-05-10 | 589 | 304 (52%) | 132 (22%) | 134 (23%) | 18 (3%) | 1 (0%) | 0 (0%) | 0 |

## Notes

### 2026-05-10 — Week 1 baseline
- Property: `https://onda-life.com/`
- First-ever GSC audit on the site. Captured immediately after the
  topic-hubs / pillar / image-sitemap / news-sitemap rollouts, so the
  large 🔵 Unknown bucket (134) is expected — sitemap had not yet been
  refetched by Google.
- ⚪ Canonical: 1 URL (`/glossary/microbiome` was the GSC duplicate
  artefact we saw earlier — cf. CONTRIBUTING.md note about Replit ping
  duplicate-canonical issue).
- 🔴 Crawled-not-indexed: 13 glossary terms + 5 articles. See
  `dist/seo-audit/gsc-coverage.md` (run-local) for the full list.
