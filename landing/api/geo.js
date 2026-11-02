/**
 * GET /api/geo — Vercel Function (task 105, cookie consent).
 * Returns { country } from Vercel's own `x-vercel-ip-country` header — no third-party lookup,
 * no IP stored or logged. `private, no-store` so no CDN/browser cache ever serves one visitor's
 * country to another; static pages keep their normal cache (this is a separate request).
 * Unknown country → { country: null } (the client then keeps consent denied + shows the banner).
 */
export default function handler(req, res) {
  const raw = req.headers['x-vercel-ip-country']
  const c = typeof raw === 'string' && /^[A-Z]{2}$/.test(raw) ? raw : null
  res.setHeader('Cache-Control', 'private, no-store, max-age=0')
  res.status(200).json({ country: c })
}
