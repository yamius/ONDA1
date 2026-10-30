/**
 * Android waitlist badge — sits next to the App Store badge in every <AppStoreCTA>, same black
 * badge style. Shown only on Android-like devices (feature detection: vibrate + touch, never UA;
 * decided after mount, so the prerendered HTML has no badge). Opens the waitlist form:
 * POST /api/waitlist → Supabase `waitlist` {email, platform:'android', source}. Consent required.
 * Own switch ANDROID_WAITLIST_ENABLED (the shared API_ENABLED stays off).
 */
import { useEffect, useRef, useState } from 'react'
import { ANDROID_WAITLIST_ENABLED } from '../config/features'
import { gtmAndroidWaitlist } from '../lib/gtm'

/** ct / page tag → waitlist source: short [a-z0-9_] tag (the API drops anything else). */
export function waitlistSource(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'site'
}

/** "Get it for Android" badge (public/badges/android.svg) — same frame, size and type as the
 *  App Store badge. size: 'md' 48px tall (default), 'sm' 40px. */
export default function AndroidWaitlistBadge({ source, size = 'md', always = false }: { source: string; size?: 'md' | 'sm'; /** show on every device, not only Android (e.g. /product) */ always?: boolean }) {
  const [android, setAndroid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    try {
      setAndroid('vibrate' in navigator && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window))
    } catch { /* no badge */ }
  }, [])
  if (!ANDROID_WAITLIST_ENABLED || (!android && !always)) return null
  return (
    <>
      <button
        type="button"
        data-button="android-waitlist"
        onClick={() => { setOpen(true); gtmAndroidWaitlist('android_waitlist_view', source) }}
        aria-label="Get it for Android"
        className="inline-flex shrink-0 transition-opacity hover:opacity-85"
      >
        <img src="/badges/android.svg" alt="Get it for Android" width={162} height={48} className={size === 'sm' ? 'h-10 w-auto' : 'h-12 w-auto'} />
      </button>
      {open && <AndroidWaitlistForm source={source} onClose={() => setOpen(false)} />}
    </>
  )
}

/** Android waitlist form — reuses the existing waitlist mechanism (POST /api/waitlist →
 *  Supabase `waitlist` {email, platform, source}); no new table. `source` needs the column from
 *  supabase-waitlist-source.sql (the handler only writes it when present). Consent is required. */
function AndroidWaitlistForm({ onClose, source }: { onClose: () => void; source: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  // Deliberately NOT a <form>: GTM's built-in form listeners (gtm.formInteract / gtm.formSubmit,
  // GA4 enhanced-measurement forms) attach the form DOM node to the dataLayer, which would put the
  // typed email into the dataLayer. A plain container + button keeps the email out of it entirely.
  async function submit() {
    const ei = emailRef.current, ci = consentRef.current
    if (!ei || !ci) return
    if (!ei.checkValidity()) { ei.reportValidity(); return }
    if (!ci.checked) { ci.reportValidity(); return }
    const email = ei.value.trim()
    setError(null); setState('sending')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform: 'android', source: source }),
      })
      if (res.status === 409) { setState('done'); return } // already on the list
      if (!res.ok) { setError('Something went wrong. Please try again later.'); setState('idle'); return }
      gtmAndroidWaitlist('android_waitlist_submit', source)
      setState('done')
    } catch { setError('Something went wrong. Please try again later.'); setState('idle') }
  }
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-4" role="dialog" aria-modal="true" aria-labelledby="aw-title" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b0d14] p-6" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 rounded p-1 text-white/50 hover:text-white">✕</button>
        {state !== 'done' ? (
          <div role="form" aria-labelledby="aw-title" onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') { e.preventDefault(); void submit() } }}>
            <h2 id="aw-title" className="mb-2 text-xl font-semibold text-white">ONDA for Android is on its way</h2>
            <p className="mb-4 text-sm text-white/60">Leave your email — we’ll send you the download link as soon as it’s ready.</p>
            <label className="mb-1 block font-mono text-[11px] text-white/50" htmlFor="aw-email">Email</label>
            <input id="aw-email" ref={emailRef} type="email" name="email" required autoComplete="email" disabled={state === 'sending'}
              className="mb-4 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/50" />
            <label className="mb-4 flex items-start gap-2 text-left text-xs leading-relaxed text-white/70">
              <input type="checkbox" ref={consentRef} name="consent" required className="mt-0.5 h-4 w-4 shrink-0" />
              <span>I agree that ONDA Life stores my email to tell me when the Android app is available. <a href="/privacy" target="_blank" rel="noopener" className="underline hover:text-white">Privacy Policy</a></span>
            </label>
            {error && <p className="mb-3 text-sm text-rose-400" role="alert">{error}</p>}
            <button type="button" onClick={() => void submit()} disabled={state === 'sending'} className="w-full rounded-full bg-white/90 py-3 text-sm font-semibold text-black hover:bg-white disabled:opacity-50">
              {state === 'sending' ? 'Sending…' : 'Notify me'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 id="aw-title" className="mb-2 text-xl font-semibold text-white">You’re on the list</h2>
            <p className="mb-5 text-sm text-white/60">We’ll send you the download link as soon as ONDA for Android is ready.</p>
            <button type="button" onClick={onClose} className="rounded-full border border-white/25 px-6 py-2 text-sm text-white">OK</button>
          </div>
        )}
      </div>
    </div>
  )
}
