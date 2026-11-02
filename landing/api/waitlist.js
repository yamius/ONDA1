/**
 * POST /api/waitlist — Vercel Function (revived from _deferred-api/server.js, task 104 r5).
 * Body: { email, platform?, source? } → Supabase `waitlist` (anon key; RLS = anon INSERT only).
 *
 * Fails SAFE when the database isn't ready:
 *  - no Supabase env vars          → 503, nothing written
 *  - `source` column not migrated  → retries the insert without `source`
 *  - duplicate email (23505)       → 409 (the UI shows "you're on the list")
 * Never logs the email. The frontend only calls this when VITE_API_ENABLED=1.
 *
 * Env (Vercel → Settings → Environment Variables, runtime): VITE_SUPABASE_URL,
 * VITE_SUPABASE_ANON_KEY (same names the client build uses; SUPABASE_URL /
 * SUPABASE_ANON_KEY are accepted as fallbacks).
 */
import { createClient } from '@supabase/supabase-js'

const URL_ = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supa = URL_ && KEY ? createClient(URL_, KEY, { auth: { persistSession: false } }) : null

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/
const cleanTag = (s, max = 40) => (typeof s === 'string' && new RegExp(`^[a-z0-9_]{1,${max}}$`).test(s) ? s : null)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!supa) return res.status(503).json({ error: 'Waitlist service unavailable' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ error: 'Invalid email' })
  const platform = cleanTag(body?.platform, 20)
  const source = cleanTag(body?.source)

  try {
    const row = { email, platform }
    let { error } = await supa.from('waitlist').insert(source ? { ...row, source } : row)
    // `source` column not there yet (migration not applied) → store without it.
    if (error && source && (error.code === 'PGRST204' || /source/i.test(error.message || ''))) {
      ({ error } = await supa.from('waitlist').insert(row))
    }
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'duplicate' })
      console.error('[waitlist] insert failed', error.code) // code only — never the email
      return res.status(500).json({ error: 'insert failed' })
    }
    return res.status(200).json({ ok: true })
  } catch {
    console.error('[waitlist] unexpected error')
    return res.status(500).json({ error: 'unexpected' })
  }
}
