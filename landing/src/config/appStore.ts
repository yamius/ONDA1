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
