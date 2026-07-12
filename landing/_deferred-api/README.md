# `_deferred-api/` — server-side code parked during the Vercel migration

Vercel serves `landing/` as a **static** site (`dist/`), with no long-running
Node process. The files here need a server runtime, so they are **parked**, not
deleted. Nothing in the build or the client imports them — they are inert.

**None of this runs on Vercel today.** The site works fully static; the only
user-facing effect is that a few interactive bits degrade gracefully (see
"Frontend impact" below).

---

## What's here

| File | What it was | Why it can't run on static Vercel |
|---|---|---|
| `server.js` | The whole Replit production Express server: prerendered-HTML routing, redirects (now in `../vercel.json`), the Supabase proxy API, the Telegram-article file API, `/get` page HTML, CSP. | Needs a live Node process. Routing/redirects/CSP already ported to `../vercel.json`; the API routes are what remains to revive. |
| `bot.js` | Telegram bot (same process as the server) that wrote generated articles to `../articles/*.md`. | Long-running bot + writes to disk. Replit-only. |
| `protocol-name-mapping.js` | Helper used by `server.js`'s `/api/save-article` to detect `PROTOCOL_XX` blocks. | Only imported by the article-write API. |

> Note on paths: these files were moved down one directory. When reviving,
> `__dirname`-relative paths inside `server.js`/`bot.js` (`dist`, `../articles`)
> now resolve one level too deep — add a `..` segment, or run from `landing/`.

---

## Endpoints that stopped working (and how to revive them)

The **recommended** revival is Vercel Serverless Functions — a `landing/api/`
folder where each file exports a handler. Vercel auto-deploys `api/*` as
functions; no Express needed. The logic below is copy-paste from `server.js`.

### 1. Supabase proxy — votes / comments / waitlist (revive first, low effort)

These only read/write Supabase with the public anon key. Straight port:

```
landing/api/votes.js        → GET/POST  (article_votes)      [server.js:422–460]
landing/api/comments.js     → GET/POST  (article_comments)   [server.js:463–495]
landing/api/waitlist.js     → POST      (waitlist)           [server.js:498–512]
```

Skeleton (`api/waitlist.js`):

```js
import { createClient } from '@supabase/supabase-js'
const supa = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, platform } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Missing email' })
  const { error } = await supa.from('waitlist').insert({ email, platform: platform || null })
  if (error) return res.status(error.code === '23505' ? 409 : 500).json({ error: error.message })
  res.json({ ok: true })
}
```

Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in Vercel env for BOTH the
build (already needed) and the functions runtime. The frontend already calls
`/api/votes`, `/api/comments`, `/api/waitlist` (relative), so once the functions
exist the UI lights back up with no client change — see the graceful-degrade
guards added in the migration.

### 2. Telegram-article file API — DO NOT port as-is

`/api/save-article`, `/api/article/:filename` (PUT/DELETE), `/api/articles-list`,
`/api/md-articles`, `/api/md-article/:slug` all **write/read `../articles/*.md`
on disk**. Serverless functions have an ephemeral, read-only filesystem — disk
writes don't persist. If this workflow is still wanted, re-architect it to store
articles in Supabase/a DB (or a git-backed CMS), not the filesystem. The bot
(`bot.js`) would move to a scheduled job or a separate always-on host.

---

## Frontend impact (already handled in the migration)

Components that called these endpoints now **degrade gracefully** instead of
erroring: article reactions (votes/comments) and the Android/app waitlist forms
hide or disable themselves when the API returns non-OK / is absent, so there are
no red console errors on the static site. Reviving the functions above restores
full behaviour automatically.

## Routing/redirects/CSP — already migrated

Everything non-API from `server.js` lives in `../vercel.json`:
www→non-www, trailing-slash, legacy 301s, `/p/*` deck short links (302 +
`/decks/*` noindex), `/app` `/download` → `/get`, SPA fallback, and the full
helmet CSP (+ the `/embed/*` `frame-ancestors *` exception). The `/get` page is
now a static file at `../public/get/index.html`.
