/**
 * ONDA Life — App Store link configuration.
 *
 * Campaign links enable source tracking in App Store Connect →
 * Analytics → Sources. Each CTA on the site passes a short `campaign`
 * tag so we can see which pages drive installs.
 */

export const APP_STORE_ID = '6755912529'

/** App Store Connect provider token (safe to expose in URLs). */
export const APP_STORE_PROVIDER = '128331898'

/**
 * Build an App Store link with campaign tracking.
 *
 * @param campaign - short tag (≤40 chars) shown in ASC → Sources.
 *                   Use snake_case, e.g. "home_cta", "article_hrv".
 */
export function appStoreUrl(campaign: string): string {
  const ct = encodeURIComponent(campaign.slice(0, 40))
  return `https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=${APP_STORE_PROVIDER}&ct=${ct}&mt=8`
}

/** Tenjin click key for the Emoton web source (ONE link; per-placement lives in
 *  the Apple `ct` inside redirect_url — we deliberately don't mint a 2nd link). */
export const TENJIN_EMOTON_CLICK = 'fnR3SpdCPaWVGNh6snescc'

/** Apple campaign link in the canonical `/app/id` form — exactly the shape we
 *  verified Tenjin's redirect_url forwards intact (pt + ct + mt preserved). */
function appleCtLink(placement: string): string {
  const ct = encodeURIComponent(placement.slice(0, 40))
  return `https://apps.apple.com/app/id${APP_STORE_ID}?pt=${APP_STORE_PROVIDER}&ct=${ct}&mt=8`
}

/**
 * Emoton CTA destination (Layer 2). One tap feeds BOTH:
 *  - Tenjin (click → install → revenue via the in-app SDK; probabilistic under
 *    iOS ATT — trust Apple `ct` for install counts, Tenjin for the LTV linkage),
 *  - Apple Sources (`ct` per placement).
 * It's one Tenjin click (source `emoton_web`) whose `redirect_url` is the
 * per-placement Apple ct-link. `redirect_url` is the ONLY param Tenjin v0 honours
 * and must be fully URL-encoded (verified). Does NOT touch the global
 * CONFIGURE→Apps store URL — per-click override only.
 *
 * NOTE: the href is track.tenjin.com (not apps.apple.com), so the Layout
 * delegated Reddit-Lead listener no longer fires for Emoton CTAs — accepted
 * loss (Emoton is organic). See download-tracking brief.
 */
export function emotonCtaUrl(placement: string): string {
  return `https://track.tenjin.com/v0/click/${TENJIN_EMOTON_CLICK}?redirect_url=${encodeURIComponent(appleCtLink(placement))}`
}
