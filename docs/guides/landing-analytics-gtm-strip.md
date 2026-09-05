# Landing analytics — the GTM-strip defect

**Found:** 2026-09-05, while building the script-free Baseline tool (`/tools/baseline`).
**Scope:** `landing/` (onda-life.com).
**Status: RESOLVED 2026-09-05.** Product decision: **GTM stays site-wide** (analytics on
articles/tools/reviews, not just the homepage). The fix removed the dead `route !== '/'` strip
block (it never worked anyway) and made site-wide GTM explicit in `prerender.ts`. GA4 collection
was unchanged (the head script already loaded on every page); the only real diff is the GTM
noscript `<iframe>` is now consistently present on subpages too. Baseline stays script-free via
the separate `SCRIPT_FREE_ROUTES` matcher. The record below is kept for context.

## The defect

`landing/scripts/prerender.ts` tries to keep Google Tag Manager on the homepage only and
strip it from every prerendered subpage:

```js
if (route !== '/') {
  out = out.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\s*/g, '')
  out = out.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/g, '')
}
```

The head-block **opener never matches**. In `landing/index.html` the real comment carries
trailing text:

```html
<!-- Google Tag Manager: dataLayer init immediate; container deferred until after load+idle -->
```

`<!-- Google Tag Manager -->` (with the immediate `-->`) does not match
`<!-- Google Tag Manager: … -->`, so the regex never fires.

**Result:** every prerendered landing **subpage still ships GTM** (and, by the same design,
the Reddit pixel init — that one was never stripped at all). The `route !== '/'` intent
("GTM only on the homepage") does nothing in practice.

**Why it stayed hidden:** a GTM tag that *is* present looks identical to one you meant to
strip — you only see it by grepping the built HTML (`grep gtm.start dist/<route>/index.html`).

## Baseline is not affected

`/tools/baseline` is a script-free health page. It is cleaned by a **separate, loose**
matcher added in the same file (`SCRIPT_FREE_ROUTES`), which matches the real opener:

```js
if (SCRIPT_FREE_ROUTES.has(route)) {
  out = out
    .replace(/<!-- Google Tag Manager[\s\S]*?<!-- End Google Tag Manager -->\s*/g, '')
    .replace(/<!-- Google Tag Manager \(noscript\)[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/g, '')
    .replace(/<!-- Reddit Pixel[\s\S]*?<!-- End Reddit Pixel -->\s*/g, '')
}
```

Verified: 0 third-party scripts load on Baseline at runtime. It also renders outside Layout,
so the Reddit route tracker never fires. This is the pattern the general fix could reuse.

## The fix is a product decision, not a mechanical one

Do **not** just "make the regex match" without deciding the intended end state — the two
directions have opposite consequences:

- **Keep GTM on all pages** (what happens today). Then the real fix is to **remove the dead,
  misleading strip** and make site-wide GTM intentional. Analytics stay everywhere.
  Most sites want this.
- **GTM on homepage only** (the code's stated but never-working intent). Then **fix the
  opener regex** so subpages are actually stripped — and accept that **GA4/GTM analytics from
  every subpage stops**. That is a deliberate data loss, not a free cleanup.

Whichever way: do it in its **own commit**, not bundled into unrelated work, and verify by
grepping the built HTML for `gtm.start` / `rdt(` across a homepage and a couple of subpages.
