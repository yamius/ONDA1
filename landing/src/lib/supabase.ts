import { createClient } from '@supabase/supabase-js'

const env = (import.meta as { env?: Record<string, string> }).env
const url = env?.VITE_SUPABASE_URL ?? ''
const anonKey = env?.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = url && anonKey ? createClient(url, anonKey) : null

const FINGERPRINT_KEY = 'onda_fingerprint'

export function getFingerprint(): string {
  if (typeof window === 'undefined') return ''
  let fp = localStorage.getItem(FINGERPRINT_KEY)
  if (!fp) {
    fp = crypto.randomUUID?.() ?? `fp_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
    localStorage.setItem(FINGERPRINT_KEY, fp)
  }
  return fp
}
