# ONDA Life app in ChatGPT

Public MCP server for the OpenAI Apps SDK. Spec: `D:\_PValley\_work\610_ONDA_ChatGPT_app_functional_spec.docx`.

**Public by design, so it holds nothing private:** no credentials, no analytics, no user data, nothing logged. Never merge it with the private analytics server in `../mcp`.

## Tools (v1)

| Tool | What it does | Card | Bridge tag |
|---|---|---|---|
| `check_hrv` | One HRV number vs age norms (Apple Watch → SDNN table, others → RMSSD) | scale with “You” marker | `ct=chatgpt_hrv` |
| `breathe_now` | Animated breathing guide with timer: coherent, 4-7-8, box, sigh, longer exhale | live circle | `ct=chatgpt_breathe` |
| `find_practice` | 1–3 of the 18 free **adaptive** practices by goal / experience / position | practice list + “play free” → `/emoton` | `ct=chatgpt_practice`, `utm_campaign=chatgpt_practice` |
| `compare` | 2–3 devices or apps from ONDA reviews: price, score, HRV metric, verdict, “works with ONDA” | side-by-side table | `ct=chatgpt_compare` |

Cards follow the MCP Apps standard (`text/html;profile=mcp-app`, `_meta.ui.resourceUri`; bump the `-vN` in the URI on breaking card changes — it is a cache key). Bridges go to the App Store (no deep links yet). Wording follows `landing/docs/onda-facts-source-of-truth.md`: no numeric pacer claim; HRV and the personal baseline need Apple Watch; the camera pulse works on any iPhone. ONDA is never scored inside a comparison — if asked about it, the card labels it “Our product”.

## Data — generated, never edited by hand

```
cd landing && npx tsx scripts/export-chatgpt-data.ts
```

| File | Source |
|---|---|
| `data/reviews.json` | `landing/src/data/reviews` (+ hand map of HRV metric / works-with-ONDA in the script) |
| `data/practices.json` | `landing/src/data/adaptivePractices.ts` + `data/practice-tags.json` (hand tags: goal, level, position, one line) |
| `lib/generated/hrv-norms.js`, `breathing.js` | the site modules, bundled as-is |

Re-run after changing reviews, practices, HRV norms or breathing patterns, then redeploy. The script fails if a practice is untagged or a wearable review has no HRV metric.

## Run and test

```
npm test                 # protocol + tool behaviour
npm run preview          # http://localhost:4417 — the four cards with real output; POST /mcp
```

## Deploy

Separate Vercel project with root directory `chatgpt-app`. Endpoint: `https://onda-chatgpt.vercel.app/mcp`, published as `https://onda-life.com/mcp` through a rewrite in `landing/vercel.json` (the URL both directories use — never remove the rewrite). In ChatGPT: Settings → Apps & Connectors → Developer mode → add the endpoint, test each tool, then submit for review.
