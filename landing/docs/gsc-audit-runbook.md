# GSC Coverage Audit — Runbook

> Operational handoff for the weekly Google Search Console coverage audit.
> Pick up this doc in any new Claude session — everything needed to run,
> interpret, and act on the audit lives below.

## What this is

`landing/scripts/gsc-coverage-audit.mjs` calls Google's Search Console URL
Inspection API on every URL in `dist/sitemap.xml` and writes a prioritised
action list to:

- `landing/dist/seo-audit/gsc-coverage.json` — raw API response per URL
- `landing/dist/seo-audit/gsc-coverage.md` — human-readable buckets + action list

Buckets:
- ✅ **Indexed** — in Google's index, served in SERP
- 🟡 **Discovered, not indexed** — Google knows the URL, hasn't indexed it
  → top priority for **manual** GSC URL Inspection → Request Indexing
- 🔴 **Crawled, not indexed** — Google fetched but excluded → content quality
  issue, fix the page before resubmitting
- ⚪ **Excluded (canonical / duplicate)** — Google chose a different canonical
- ⚫ **Excluded (other / blocked)** — 404, robots block, noindex meta
- ❓ **Unmatched** — coverage state Google added since the script was written

## One-time setup (already done in 2026-05-10 session)

If you're picking this up fresh and the setup ISN'T done:

1. Google Cloud Console → enable **Search Console API**
2. Create service account, download JSON key
3. Search Console → Settings → Users → add the service account email as
   **Owner** (URL Inspection requires Owner, not Full)
4. Place JSON at `landing/.cache/gsc-credentials.json` (already gitignored)

The current setup uses service account
`indexing-manager@onda-life-game.iam.gserviceaccount.com` (project
`onda-life-game`). Verify it's still listed as Owner in Search Console
→ Settings → Users.

## How to run

From the worktree root:

```bash
npm --prefix landing run audit:gsc
```

That's it. The script:
- Loads credentials from `.cache/gsc-credentials.json`
- Reads URLs from `dist/sitemap.xml` (run `npm run build` first if dist
  is stale)
- Inspects each URL paced at 200ms/request (~110s for 596 URLs)
- Writes the two output files
- Prints summary + top 10 "Discovered, not indexed" URLs

Default property is `https://onda-life.com/` (URL-prefix). Override via
`GSC_SITE_PROPERTY` env var if you ever switch to a sc-domain property.

## What to do with the output

### 🟡 Discovered, not indexed → manual GSC submission
Open Google Search Console → URL Inspection. For each URL in this bucket
(start with the top 10 from console output):
1. Paste URL into the inspection bar
2. Click **Request Indexing**
3. Daily quota: ~10 URLs per property

Cadence: prioritise pillar URLs (`/topics/*`), `FEATURED_ARTICLE_SLUGS`
articles, glossary terms with high traffic potential.

### 🔴 Crawled, not indexed → content fix, NOT resubmit
This is Google saying "I saw it, I don't think it's worth indexing."
Resubmitting will not help. Open the URL and ask:
- Is the body content < 300 words? Add depth.
- Is the title generic (`Page | ONDA Life`)? Make it specific.
- Is the description boilerplate? Rewrite.
- Is it a near-duplicate of another article? Merge or differentiate.
- Does it have inbound internal links? Add them from related articles
  / topic hubs.

After fixing, edit the article TS file (any non-trivial change), commit,
push. The git log change rolls the page into `/sitemap-news.xml` for 48h
priority crawling, after which it should re-evaluate.

### ⚪ Excluded (canonical / duplicate) → audit the canonical
The `gsc-coverage.md` lists the Google-selected canonical. Compare against
our declared `<link rel=canonical>`. Common causes:
- Trailing slash mismatch (`/foo/` vs `/foo`)
- Locale duplicates (an `/es/articles/...` URL Google merges with EN)
- Empty article bodies that Google deems duplicates of `/articles` index

Fix: ensure `meta-inject.ts` emits the right canonical for that route, or
add an explicit redirect in `server.js`.

### ⚫ Excluded (other / blocked) → audit each
Most are intentional (privacy/terms with low value, `/contact` thin,
license page). Check for accidents like a stray `noindex` meta tag.

## Cadence

**Weekly is the sweet spot.** Track these KPIs over time:

| Metric | Target | Watch for |
|---|---|---|
| Indexed % | 60-80% by month 3, 80%+ by month 6 | Sudden drop = penalty or technical issue |
| Discovered, not indexed | < 20% | Spike = sitemap delivery issue or low domain authority |
| Crawled, not indexed | < 10% | Spike = recent content-quality regression |
| Excluded (canonical) | < 5% | Spike = canonical bug or hreflang misconfiguration |

Each weekly run produces a fresh `gsc-coverage.json`. Keep them in a
folder (or commit to a separate analytics branch) for trend tracking.

## Troubleshooting

**`403 Permission denied`** — service account no longer Owner in
Search Console. Re-add via Settings → Users.

**`404 Site not found`** — property type mismatch. Check
`GSC_SITE_PROPERTY` env var matches the verified property
(`sc-domain:onda-life.com` vs `https://onda-life.com/`).

**`429 quota exceeded`** — exceeded 2000 calls/day. Wait until midnight
PT for quota reset, or split runs across days.

**`credentials not found at ...`** — `.cache/gsc-credentials.json` missing
or moved. Re-download from Google Cloud Console → Credentials →
service account → Keys tab → Add Key.

**Script hangs / times out** — Google API throttling. Increase
`REQUEST_DELAY_MS` in the script (currently 200) to 400-500.

## Quotas / cost

- **2000 inspection calls/day** per Cloud project (free tier — no billing
  required)
- **600 requests/minute** rate limit (script paces under this)
- 596 URLs ≈ one full daily run; ~3 runs/day max with current sitemap size

## Related files

- `landing/scripts/gsc-coverage-audit.mjs` — the script
- `landing/.cache/gsc-credentials.json` — service account JSON (gitignored)
- `landing/dist/seo-audit/gsc-coverage.{json,md}` — output (gitignored, lives
  in dist)
- `.gitignore` includes `landing/.cache/` so credentials never commit

## Pickup checklist for a new Claude session

If a fresh agent picks this up:

1. Read this doc
2. Confirm `landing/.cache/gsc-credentials.json` exists (don't open it
   — it's a secret)
3. Run `npm --prefix landing run audit:gsc`
4. Read `landing/dist/seo-audit/gsc-coverage.md`
5. Surface the top 10 from each problem bucket to the user
6. Optionally suggest specific content/canonical fixes for the worst
   offenders
