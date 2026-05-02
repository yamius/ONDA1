# SEO ownership verification — checklist

Replit places ownership tokens for each search-engine console as `<meta>` tags
in `landing/index.html`. Update this file whenever a verification status
changes; the comments in `index.html` reference this doc.

| Engine | Status | Token / Note |
|--------|--------|--------------|
| Google Search Console | ✅ Verified | `meta name="google-site-verification"` set in `index.html` |
| Bing Webmaster Tools | ⏳ Pending | Sign in with Microsoft, copy token from "Add a site" → HTML meta tag, paste into the commented `meta name="msvalidate.01"` line in `index.html`, redeploy, click Verify |
| Yandex Webmaster | ⏳ Pending | Sign in, copy token from "Site rights" → meta tag, paste into the commented `meta name="yandex-verification"` line in `index.html`, redeploy, click Verify |
| IndexNow (Bing/Yandex/Seznam) | ✅ Wired | Key file `1918e61cfd9da62111b3ad204c79f12e.txt` already in `public/`; pings are sent automatically by `landing/scripts/indexnow.ts` after every prerender. |

## After verifying Bing
1. Submit `https://onda-life.com/sitemap.xml` under **Sitemaps**.
2. Submit `https://onda-life.com/feed.xml` under **RSS / Atom feeds**.
3. Enable IndexNow in Settings → Configure my site → IndexNow.

## After verifying Yandex
1. Add the property, complete verification.
2. Sitemaps tab → submit `https://onda-life.com/sitemap.xml`.
3. Indexing → IndexNow → confirm key matches `1918e61cfd9da62111b3ad204c79f12e`.

## Production cutover
The verification meta tags must be present in the **prerendered** HTML at
each origin URL. Because they live in `landing/index.html`, every prerendered
file inherits them — no per-route changes are required.
