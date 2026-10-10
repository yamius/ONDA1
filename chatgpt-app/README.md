# ONDA Life app in ChatGPT and Claude

**Status:** Claude — Published (Community), 2026-10-04, https://claude.ai/directory/connectors/onda-life. ChatGPT — in review.

**The server is live for all Claude users.** Every change to https://onda-life.com/mcp reaches them immediately, with no re-review. So: test tool changes on a separate test URL first, ship version 2 only on its own URL, and never touch the `/mcp` rewrite in `landing/vercel.json` or the Vercel project `onda-chatgpt`.

Public MCP server for the OpenAI Apps SDK. Spec: `D:\_PValley\_work\610_ONDA_ChatGPT_app_functional_spec.docx`.

**Public by design, so it holds nothing private:** no credentials, no analytics, no user data, nothing logged. Never merge it with the private analytics server in `../mcp`.

## Tools (v1)

| Tool | What it does | Card | Bridge tag |
|---|---|---|---|
| `check_hrv` | One RMSSD value vs a published distribution from one wearable’s users (Natarajan 2020, Fitbit), nearest age point, optional sex; Apple Watch SDNN not compared | three zones (below / middle half / above) + disclaimer | `ct=chatgpt_hrv` |
| `breathe_now` | Animated breathing guide with timer: coherent, 4-7-8, box, sigh, longer exhale | live circle | `ct=chatgpt_breathe` |
| `find_practice` | 1–3 of the 18 free **adaptive** practices by goal / experience / position | practice list + “play free” → `/emoton` | `ct=chatgpt_practice`, `utm_campaign=chatgpt_practice` |
| `compare` | 2–3 devices or apps from ONDA reviews: price, score, HRV metric, verdict, “works with ONDA”; for a duel page, the line the page shows above the verdict (`label`: WINNER / Higher ONDA score / Practically equal by ONDA score), `winnerStatus`, `onda_scores`, and `winner` only when the page names one. An ambiguous name (“HigherDOSE”) resolves to the product of a duel page | side-by-side table | `ct=chatgpt_compare` |

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

re-run after changing reviews, practices, the HRV distribution or breathing patterns, then redeploy. The script fails if a practice is untagged or a wearable review has no HRV metric.

## Run and test

```
npm test                 # protocol + tool behaviour
npm run preview          # http://localhost:4417 — the four cards with real output; POST /mcp
```

## Deploy

Separate Vercel project with root directory `chatgpt-app`. Endpoint: `https://onda-chatgpt.vercel.app/mcp`, published as `https://onda-life.com/mcp` through a rewrite in `landing/vercel.json` (the URL both directories use — never remove the rewrite). In ChatGPT: Settings → Apps & Connectors → Developer mode → add the endpoint, test each tool, then submit for review.

## ChatGPT plugin package (directory submission)

The ChatGPT directory takes a plugin ZIP (Codex plugin format):

```
plugin/
  .codex-plugin/plugin.json   # manifest: name, version, interface (listing texts, category, URLs, starter prompts, images)
  .mcp.json                   # the server: https://onda-life.com/mcp, type http, no auth
  assets/                     # icon.png 128px, logo.png 512px (square), screenshot-*.png (706 px wide, 400–860 tall, one per starter prompt)
```

Rebuild after any change:

```
python chatgpt-app/scripts/build_plugin.py
```

It re-runs OpenAI's documented checks locally, checks the live server, and writes `submission/onda-life-plugin.zip`. OpenAI has no local validator, so this is the closest pre-check. **Bump `version` in `plugin.json` before every new upload** — an upload with an unchanged version is rejected. Changes to tool descriptions or cards on the server do not need a new ZIP, unless the listing texts, prompts or images change.
