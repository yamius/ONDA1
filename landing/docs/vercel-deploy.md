# Deploying the ONDA landing site to Vercel (static)

The landing site (`landing/`) ships as **static files** built by Vite into `dist/`.
There is no Node/Express runtime on Vercel — routing, redirects and headers are
declared in [`landing/vercel.json`](../vercel.json). The old Express `server.js`
and the Replit bot are parked (not deleted) in
[`landing/_deferred-api/`](../_deferred-api/README.md) for a future revival as
Vercel serverless functions.

---

## 1. Vercel project settings

Create the project from the git repo, then set:

| Setting | Value |
|---|---|
| **Root Directory** | `landing` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` (default) |
| **Node.js Version** | 22.x (LTS) |

Notes:

- Use the **full `npm run build`**, not `build:fast`. The full build runs the
  prerender step that emits ~1070 static SEO pages (verified: `1070 rendered,
  0 failed`). `build:fast` skips prerender and would ship only the SPA shell —
  keep it strictly as an emergency fallback.
- The prerender memory flag (`--max-old-space-size=4096`) is already inline in
  the `build` script, so you do **not** need to set `NODE_OPTIONS` in Vercel.
- Peak build memory observed locally: ~0.6 GB in the heaviest prerender worker,
  ~1.2 GB total — comfortably inside Vercel's 8 GB build container.

## 2. Environment variables

Set these in **Project → Settings → Environment Variables** (Production +
Preview). All client-read vars must be prefixed `VITE_` to be inlined at build.

| Variable | Required | Purpose |
|---|---|---|
| `VITE_POSTHOG_KEY` | yes | PostHog client analytics key |
| `VITE_POSTHOG_HOST` | optional | defaults to `https://us.i.posthog.com` |
| `INDEXNOW_DISABLED` | **`1` during migration** | suppresses IndexNow pings while the domain still points at the old host. **Remove (or set `0`) only after DNS has cut over to Vercel.** |
| `VITE_SUPABASE_URL` | optional | safe to set; only used if the client talks to Supabase directly. Not read at build. |
| `VITE_SUPABASE_ANON_KEY` | optional | as above |
| `VITE_PPG_DEBUG` | no | leave unset in production |
| `VITE_API_ENABLED` | **do not set** (or `0`) | Gates votes / comments / app+Android waitlist. There is no `/api` runtime yet, so these stay hidden. Set to `1` only after adding the serverless functions from `_deferred-api/README.md`. |

## 3. Domains

Add **both** domains in **Project → Settings → Domains**:

- `onda-life.com` (apex) — set as the **primary** domain
- `www.onda-life.com` — Vercel will 301 it to the apex automatically
  (there is also a defensive www→apex 301 in `vercel.json`)

## 4. DNS at GoDaddy

First add both domains to the Vercel project (step 3). Vercel now issues a
**per-project A-record IP** — open **Settings → Domains → `onda-life.com`** and
copy the exact A-record value the dashboard shows *for this domain*. Do not
hard-code an IP from memory; use whatever the dashboard prints. (It is often
`76.76.21.21`, but treat that only as a possible default, not a guarantee.)

Then, in GoDaddy → **DNS Management** for `onda-life.com`:

| Type | Name | Value | Note |
|---|---|---|---|
| `A` | `@` | *the A-record IP shown in the Vercel domain settings* | GoDaddy has no ANAME at apex, so an A record is required |
| `CNAME` | `www` | `cname.vercel-dns.com` | |

- **Remove the old Replit A / CNAME records** for `@` and `www` so nothing
  resolves to the old host.
- Lower the TTL to **60 s** a day before cutover for a fast rollback window.
- SSL: Vercel auto-provisions a Let's Encrypt certificate once the records
  resolve — no action needed.
- After DNS propagates and the site is verified live on Vercel, **remove
  `INDEXNOW_DISABLED`** and redeploy so IndexNow pings resume on the new host.

## 5. Post-deploy smoke test

Verify on the live Vercel URL (and again after DNS cutover):

- `/get` renders the static download page; `/app` and `/download` rewrite to it.
- `www.onda-life.com` → `onda-life.com` (301).
- `/p/mundi`, `/p/info`, `/p/radboud`, `/p/tno` → the matching `/decks/*.pdf`
  (302); `/decks/*` responds with `X-Robots-Tag: noindex, nofollow`.
- A deep article link (e.g. `/articles/<slug>`) returns prerendered HTML, not a
  blank SPA shell.
- Response headers on `/` carry the main CSP (`frame-ancestors 'self'`);
  `/embed/*` carries the permissive-frame CSP (`frame-ancestors *`).
- Votes / comments widgets and the app/Android waitlist are **absent** (API off)
  — no broken buttons, no failed `/api/*` requests in the console.
- Legacy redirects resolve: `/part/i-resonate` → `/part/i-am-vibration`,
  `/articles/system-analysis-cognitive-architecture` →
  `/articles/cognitive-architecture-neural-throughput`.
