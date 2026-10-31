// Task 105-fix: Vercel Routing Middleware (framework-agnostic, runs before the CDN cache on every
// request). Puts the visitor's country into a readable cookie on the very first HTML response, so
// the consent script in index.html decides synchronously - no /api/geo round-trip, no banner flash
// for non-EEA visitors. The Set-Cookie header is added per request on top of the (shared, cached)
// static HTML; it is never stored in the cache.
import { next } from '@vercel/functions';

export const config = {
  // HTML navigations only. Excluded: /api, /mcp (rewrite to onda-chatgpt - must stay untouched),
  // /assets, /_content, /badges, /embed, /_vercel and any path with a file extension.
  matcher: ['/((?!api/|api$|mcp|assets/|_content/|badges/|embed/|_vercel/|.*\.[A-Za-z0-9]+$).*)'],
};

export default function middleware(request: Request) {
  const raw = request.headers.get('x-vercel-ip-country') || '';
  const country = /^[A-Za-z]{2}$/.test(raw) ? raw.toUpperCase() : '';
  if (!country) return next();
  const cookie = request.headers.get('cookie') || '';
  if (cookie.includes('geo_country=' + country)) return next();
  return next({
    headers: { 'Set-Cookie': `geo_country=${country}; Path=/; Max-Age=3600; SameSite=Lax; Secure` },
  });
}
