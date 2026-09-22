/**
 * GTM dataLayer helpers.
 *
 * GA4 lives INSIDE the GTM container (GTM-NJ7LMQXD) — there is no direct gtag in
 * the code. These push self-describing Custom Events that the container forwards
 * to GA4, so the whole funnel is measurable in GA4:
 *   - arrival + on-site movement  → `spa_pageview` (page_path per SPA route change)
 *   - conversion, tied to page    → `app_store_click` (page_path + Apple `ct` campaign)
 *
 * A pushed event that has no matching GTM trigger is inert (does nothing), so
 * these are safe to ship before the GTM tags exist. See the GTM/GA4 setup notes
 * in docs.
 */
type DL = Record<string, unknown>

function push(obj: DL): void {
  try {
    const w = window as unknown as { dataLayer?: DL[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push(obj)
  } catch {
    /* SSR / storage blocked → no-op */
  }
}

/** In-site navigation (initial load + every SPA route change) → GA4 page_view
 *  carrying the real path, so Acquisition (landing page) and Path exploration
 *  (movement through the site) work. */
export function gtmPageView(pagePath: string): void {
  push({
    event: 'spa_pageview',
    page_path: pagePath,
    page_location: typeof window !== 'undefined' ? window.location.href : pagePath,
    page_title: typeof document !== 'undefined' ? document.title : '',
  })
}

/** App Store CTA click anywhere on the site → GA4 conversion event, tied to the
 *  exact page it fired from and the Apple `ct` campaign tag on the link. */
export function gtmAppStoreClick(pagePath: string, campaign: string): void {
  push({ event: 'app_store_click', page_path: pagePath, campaign })
}
