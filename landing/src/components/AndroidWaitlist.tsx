import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Android-only waitlist capture for tool pages.
 *
 * The ONDA Life app is iOS-only, so Android visitors who land on a tool from
 * search hit a dead end at the "App Store" CTA. This surfaces the SAME waitlist
 * mechanism used on the homepage (the Google Play button → modal → /api/waitlist
 * → Supabase) so that non-iOS traffic is captured, not burned.
 *
 * Renders nothing unless the client is Android (detected after mount, so SSR/
 * prerender output is empty and there is no hydration mismatch). Desktop and
 * iPhone are unaffected. Copy reuses the homepage cta.modal.* strings.
 */
export function AndroidWaitlist() {
  const { t } = useTranslation('home')
  const [isAndroid, setIsAndroid] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)) setIsAndroid(true)
  }, [])

  if (!isAndroid) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value.trim()
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform: 'android' }),
      })
      if (res.status === 409) {
        setError(t('cta.modal.errorDuplicate'))
        return
      }
      if (!res.ok) {
        setError(t('cta.modal.errorGeneric'))
        return
      }
      setIsSubmitted(true)
    } catch {
      setError(t('cta.modal.errorGeneric'))
    } finally {
      setIsLoading(false)
    }
  }

  const close = () => {
    setIsOpen(false)
    setError(null)
  }

  return (
    <section className="mx-auto max-w-3xl px-5 pb-14 md:px-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
        <p className="mb-3 font-mono text-xs leading-relaxed text-white/60">
          {t('cta.androidNote', {
            defaultValue: 'The ONDA Life Android app isn’t ready yet — leave your email and we’ll tell you the moment it lands.',
          })}
        </p>
        <button
          type="button"
          onClick={() => { setIsSubmitted(false); setIsOpen(true) }}
          className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-xs transition-all hover:border-white/30 hover:bg-white/10"
          aria-label={t('cta.googlePlayAria')}
        >
          <PlayIcon />
          <div className="text-left">
            <div className="text-[9px] text-white/40">{t('cta.googlePlaySup')}</div>
            <div className="text-sm font-semibold">{t('cta.googlePlayLabel')}</div>
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="android-waitlist-title"
        >
          <div
            className="relative mx-4 w-full max-w-md rounded-2xl border border-terminal-green/20 bg-[#1a1b26] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-lg p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t('cta.modal.close')}
            >
              ✕
            </button>

            <div className="flex h-[270px] shrink-0 flex-col">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
                  <h2 id="android-waitlist-title" className="mb-4 text-2xl font-bold text-white">
                    {t('cta.modal.title')}
                  </h2>
                  <p className="mb-6 text-sm text-white/60">{t('cta.modal.subtitle')}</p>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={t('cta.modal.placeholder')}
                    disabled={isLoading}
                    className="mb-4 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-terminal-cyan/50 focus:ring-1 focus:ring-terminal-cyan/30 disabled:opacity-50"
                  />
                  {error && <p className="mb-4 text-sm text-rose-400" role="alert">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-auto w-full rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 py-3 font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? t('cta.modal.submitting') : t('cta.modal.submit')}
                  </button>
                </form>
              ) : (
                <div className="flex flex-1 flex-col">
                  <h2 className="mb-4 text-2xl font-bold text-terminal-green">{t('cta.modal.thankTitle')}</h2>
                  <p className="mb-6 text-sm text-white/60">{t('cta.modal.thankSubtitle')}</p>
                  <div className="min-h-0 flex-1" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={close}
                    className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 py-3 font-bold text-black transition-opacity hover:opacity-90"
                  >
                    {t('cta.modal.ok')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/80" aria-hidden="true">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  )
}
