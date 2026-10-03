/**
 * Outbound links. Every bridge carries its own tag so installs and visits can
 * be traced back to the tool: Apple `ct` on App Store links (same format as
 * landing/src/config/appStore.ts) and utm_* on site links.
 */
export const SITE = 'https://onda-life.com';
const APP_STORE_ID = '6755912529';
const APP_STORE_PROVIDER = '128331898';

export function appStoreUrl(ct) {
  return `https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=${APP_STORE_PROVIDER}&ct=${encodeURIComponent(ct.slice(0, 40))}&mt=8`;
}

export function siteUrl(path, campaign) {
  const u = new URL(path, SITE);
  u.searchParams.set('utm_source', 'chatgpt');
  u.searchParams.set('utm_medium', 'app');
  u.searchParams.set('utm_campaign', campaign);
  return u.toString();
}
