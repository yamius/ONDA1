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
