# Download / App Store tracking — the full funnel

Goal: see **where people arrive on the site → how they move through it → who clicks into the App Store**, with per-page attribution, day by day.

## What each layer measures

| Layer | What it counts | Where to look | Granularity |
|---|---|---|---|
| **Apple App Store Connect** | App Store product-page views + downloads, attributed to the link's `ct` campaign | ASC → Analytics → **Sources → Campaigns** | per campaign tag (`home_cta`, `tool_*`, `article_<slug>`, …), per day. Authoritative for "reached the store", but Apple's campaign attribution is sparse/aggregated. |
| **GA4** (via GTM) | On-site pageviews + the `app_store_click` event | GA4 reports / Explore | per real URL path, per day. Full funnel. |
| **Reddit Pixel** | `Lead` on every `apps.apple.com` click | Reddit Ads Manager | ad-attributed only. |
| **PostHog** | Emoton-only events (`download_cta_clicked`) | PostHog | Emoton pages only. |

## Campaign tags (`ct`) — already page-granular

Every App Store link is built by `appStoreUrl(campaign)` / `appleCtLink(placement)` in `src/config/appStore.ts` with a per-surface `ct`:

- Home → `home_cta`
- Each tool → `tool_hrv`, `tool_vo2max`, `tool_wimhof`, …
- **Each article → `article_<slug>`** (fully per-article)
- Cornerstone / product / bio / emoton → own tags

So ASC → Sources → Campaigns already answers "which page drove the store visit", as far as Apple attributes it.

## Code events (dataLayer → GTM → GA4)

`src/lib/gtm.ts` pushes two Custom Events, wired in `src/components/Layout.tsx`:

- **`spa_pageview`** — on initial load AND every SPA route change. Params: `page_path`, `page_location`, `page_title`. Fills Acquisition (landing page) + Path exploration (movement).
- **`app_store_click`** — on any click of an `apps.apple.com` link, site-wide (delegated capture listener). Params: `page_path` (the page it fired from), `campaign` (the Apple `ct` on the link). This is the conversion, tied to the exact page.

A pushed event with no matching GTM trigger is inert, so these were safe to ship before the GTM tags exist.

## One-time GTM + GA4 setup (UI — needs GTM/GA4 access)

In the GTM container `GTM-NJ7LMQXD`:

1. **Trigger** — Custom Event, event name `app_store_click`.
2. **Tag** — GA4 Event, Event Name `app_store_click`, params `page_path` = `{{DLV - page_path}}`, `campaign` = `{{DLV - campaign}}` (create two Data Layer Variables). Fire on the trigger above.
3. **Pageviews** — you likely already get SPA pageviews from GA4 **Enhanced Measurement → "Page changes based on browser history events"**. If so, do NOT also create a `spa_pageview → page_view` tag (double-count). If Enhanced Measurement is off, add: Trigger = Custom Event `spa_pageview`; Tag = GA4 Event `page_view` with `page_path`/`page_location`/`page_title` from Data Layer Variables.
4. In **GA4 → Admin → Events**, mark `app_store_click` as a **Key event** (conversion).

## Reading the funnel in GA4 (once events flow)

- **Arrival** → Reports → Acquisition → Traffic acquisition (source/medium) + **Landing page** dimension.
- **Movement** → Explore → **Path exploration** on `page_path` (forwards from landing, or backwards from `app_store_click`).
- **Conversion by page** → Explore → **Funnel** (step 1 `page_view`, step 2 `app_store_click`), or free-form with `page_path` × `app_store_click` count, with a date breakdown for per-day.

Verified 2026-09-22 in a local build: `spa_pageview` fires on load and on SPA route change with the correct path; `app_store_click` fires with the correct `page_path` and extracts `campaign` from the link's `ct`.
