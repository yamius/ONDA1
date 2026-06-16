/**
 * Reddit Pixel helper.
 *
 * The base snippet in index.html only installs window.rdt and fires
 * rdt('init', …) — it deliberately does NOT fire PageVisit inline, because that
 * would only count the hard page load and miss every client-side route change
 * (the app is a BrowserRouter SPA, so /emoton etc. mount without a reload).
 * PageVisit is fired per route by the effect in Layout.tsx; custom conversions
 * (e.g. emoton_used) call rdtTrack() directly.
 *
 * rdtTrack() is guarded so a blocked/absent pixel (ad-blocker / CSP / not yet
 * loaded) never throws — callers can fire events unconditionally.
 */
export function rdtTrack(event: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.rdt !== 'function') return
  if (data) window.rdt('track', event, data)
  else window.rdt('track', event)
}
