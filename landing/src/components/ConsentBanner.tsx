import { useEffect, useState } from 'react'
import { getConsent, onConsentChange, onConsentOpen, openConsentBanner, setConsentChoice, type ConsentState } from '../lib/consent'
import { consentCopy } from '../data/consent-i18n'
import { langHref, type Lang } from '../i18n'

/** Cookie banner (task 105) — shown only to EEA/UK/CH/unknown-country visitors without a stored
 *  choice, or when reopened from the footer. Accept and Reject are deliberately identical. */
export function ConsentBanner({ lang }: { lang: Lang }) {
  const [s, setS] = useState<ConsentState | null>(null)
  const [reopened, setReopened] = useState(false)
  useEffect(() => {
    setS(getConsent())
    const a = onConsentChange(setS)
    const b = onConsentOpen(() => setReopened(true))
    return () => {
      a()
      b()
    }
  }, [])
  const show = reopened || (!!s && s.ready && s.needsConsent && s.choice === null)
  if (!show) return null
  const c = consentCopy(lang)
  const choose = (v: 'granted' | 'denied') => {
    setConsentChoice(v)
    setReopened(false)
  }
  const btn =
    'flex-1 min-w-[120px] rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
  return (
    <div role="dialog" aria-label={c.settings} data-consent-banner className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-[#111]/95 p-4 text-white shadow-2xl backdrop-blur sm:p-5">
        <p className="text-sm leading-relaxed text-white/80">
          {c.text}{' '}
          <a href={langHref('/privacy', lang)} className="underline hover:text-white">{c.privacy}</a>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className={btn} onClick={() => choose('denied')}>{c.reject}</button>
          <button type="button" className={btn} onClick={() => choose('granted')}>{c.accept}</button>
        </div>
      </div>
    </div>
  )
}

/** Footer "Cookie settings" — rendered only for consent countries (EEA/UK/CH/unknown). */
export function CookieSettingsLink({ lang, className }: { lang: Lang; className: string }) {
  const [s, setS] = useState<ConsentState | null>(null)
  useEffect(() => {
    setS(getConsent())
    return onConsentChange(setS)
  }, [])
  if (!s || !s.ready || !s.needsConsent) return null
  return (
    <button type="button" data-nav="cookie_settings" className={className} onClick={openConsentBanner}>
      {consentCopy(lang).settings}
    </button>
  )
}
