import { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { METRIC_DETAILS, type DetailSection } from '../data/bioMetrics'
import { NotFoundPage } from './NotFoundPage'
import { appStoreUrl } from '../config/appStore'
import { langFromPath, localizedPathFor } from '../i18n'
import { syncOgLocale } from '../utils/ogLocale'
const SITE_URL = 'https://onda-life.com'

interface TranslatedMetric {
  title: string
  shortTitle: string
  sections: DetailSection[]
}

export function BioMetricPage() {
  const { metric } = useParams<{ metric: string }>()
  const { t } = useTranslation('bio-metric')
  const location = useLocation()
  const lang = langFromPath(location.pathname)

  const exists = !!(metric && METRIC_DETAILS[metric])
  // Pull translated metric content from i18n; fall back to EN data file if missing.
  const detail: TranslatedMetric | undefined = exists
    ? (t(`metrics.${metric}`, { returnObjects: true, defaultValue: METRIC_DETAILS[metric!] as unknown }) as TranslatedMetric)
    : undefined

  const [isOpen, setIsOpen] = useState(false)
  const [platform, setPlatform] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform: platform || null }),
      })
      if (res.status === 409) { setError(t('ui.modal.errorDuplicate')); return }
      if (!res.ok) { setError(t('ui.modal.errorGeneric')); return }
      setIsSubmitted(true)
    } catch {
      setError(t('ui.modal.errorGeneric'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => { setIsOpen(false); setPlatform(''); setError(null) }

  useEffect(() => {
    if (!detail || !metric) return
    const title = `${detail.title} | ONDA Life Bio OS`
    document.title = title
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name'
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.content = content
    }
    const desc = t('ui.metaDescriptionTpl', { title: detail.title })
    const url = `${SITE_URL}${localizedPathFor('/bio', lang)}/${metric}`
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:url', url, true)
    syncOgLocale(lang)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = url
  }, [detail, metric, t, lang])

  if (!detail) return <NotFoundPage />

  const bioPath = localizedPathFor('/bio', lang)
  const homePath = localizedPathFor('/', lang)

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to={homePath} className="transition-colors hover:text-white/50">{t('ui.breadcrumbHome')}</Link>
        <span>/</span>
        <Link to={bioPath} className="transition-colors hover:text-white/50">{t('ui.breadcrumbBio')}</Link>
        <span>/</span>
        <span className="text-cyan-400/60" aria-current="page">{detail.shortTitle}</span>
      </nav>

      {/* Title */}
      <h1 className="mb-6 text-2xl font-bold leading-snug tracking-tight text-white md:text-3xl">
        {detail.title}
      </h1>

      {/* Honesty banner — every metric is a single-reading camera (PPG) estimate;
          the state labels in particular are heuristic patterns, not emotion
          detection or a measurement. */}
      <p className="mb-10 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs leading-relaxed text-white/40">
        {t('ui.measurementDisclaimer', {
          defaultValue:
            'Estimated from a single camera (PPG) reading — an educational estimate, not a medical measurement. State labels (Flow, Focus, Alarm…) are rough, experimental patterns, not emotion detection.',
        })}
      </p>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        {detail.sections.map((sec, i) => (
          <div key={i}>
            {sec.heading && (
              <h2 className="mb-3 text-base font-semibold text-cyan-400">{sec.heading}</h2>
            )}
            {sec.body && (
              <p className="mb-3 font-mono text-sm leading-relaxed text-white/60">{sec.body}</p>
            )}
            {sec.bullets && (
              <div className="flex flex-col gap-2">
                {sec.bullets.map((b, j) => (
                  <div key={j} className="rounded-xl border border-white/5 bg-white/[0.04] px-5 py-4">
                    <p className="mb-1 text-sm font-semibold text-white/80">{b.label}</p>
                    <p className="font-mono text-xs leading-relaxed text-white/45">{b.text}</p>
                  </div>
                ))}
              </div>
            )}
            {sec.highlight && (
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-4">
                <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400/60">
                  {t('ui.ondaPrinciple')}
                </p>
                <p className="text-sm leading-relaxed text-white/70 italic">{sec.highlight}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Download CTA */}
      <div className="mt-16 flex flex-col gap-4">
        <Link
          to={bioPath}
          className="inline-flex items-center gap-2 font-mono text-xs text-white/30 transition-colors hover:text-cyan-400/60"
        >
          {t('ui.back')}
        </Link>
        <div className="rounded-2xl border border-cyan-500/15 bg-[#1e1540] p-6 text-center">
          <p className="mb-1 text-sm font-semibold text-white/80">{t('ui.ctaReady')}</p>
          <p className="mb-5 text-xs text-white/35">{t('ui.ctaSubtitle')}</p>
          <div className="mx-auto flex max-w-[200px] flex-col items-center justify-center gap-2 sm:max-w-none sm:flex-row sm:gap-3">
            <a
              href={appStoreUrl('bio_metric')}
              target="_blank"
              rel="noopener"
              onClick={() => { (window as any).lastPlatform = 'ios' }}
              className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs transition-all hover:border-white/20 hover:bg-white/10 sm:w-auto sm:px-5 sm:py-2.5"
              aria-label={t('ui.appStoreAria')}
              data-button="apple"
              data-platform="ios"
            >
              <AppleIcon />
              <div className="text-left">
                <div className="text-[9px] text-white/40">{t('ui.appStoreSup')}</div>
                <div className="text-sm font-semibold">{t('ui.appStoreLabel')}</div>
              </div>
            </a>
            <button
              type="button"
              onClick={() => { (window as any).lastPlatform = 'android'; setPlatform('android'); setIsOpen(true) }}
              className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs transition-all hover:border-white/20 hover:bg-white/10 sm:w-auto sm:px-5 sm:py-2.5"
              aria-label={t('ui.googlePlayAria')}
              data-button="android"
              data-platform="android"
            >
              <PlayIcon />
              <div className="text-left">
                <div className="text-[9px] text-white/40">{t('ui.googlePlaySup')}</div>
                <div className="text-sm font-semibold">{t('ui.googlePlayLabel')}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Waitlist modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-modal-title"
        >
          <div
            className="relative mx-4 w-full max-w-md rounded-2xl border border-terminal-green/20 bg-[#1a1b26] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-lg p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t('ui.modal.close')}
            >
              ✕
            </button>
            <div className="h-[270px] flex flex-col shrink-0">
              {!isSubmitted ? (
                <form id="waitlist-form" onSubmit={handleFormSubmit} className="flex flex-col flex-1">
                  <h2 id="waitlist-modal-title" className="mb-4 text-2xl font-bold text-white">
                    {t('ui.modal.title')}
                  </h2>
                  <p className="mb-6 text-sm text-white/60">
                    {t('ui.modal.subtitle')}
                  </p>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={t('ui.modal.placeholder')}
                    disabled={isLoading}
                    className="mb-4 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-terminal-cyan/50 focus:ring-1 focus:ring-terminal-cyan/30 disabled:opacity-50"
                  />
                  {error && (
                    <p className="mb-4 text-sm text-rose-400" role="alert">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-auto w-full rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 py-3 font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? t('ui.modal.submitting') : t('ui.modal.submit')}
                  </button>
                </form>
              ) : (
                <div id="thank-you-message" className="flex flex-col flex-1">
                  <h2 className="mb-4 text-2xl font-bold text-terminal-green">{t('ui.modal.thankTitle')}</h2>
                  <p className="mb-6 text-sm text-white/60">
                    {t('ui.modal.thankSubtitle')}
                  </p>
                  <div className="flex-1 min-h-0" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 py-3 font-bold text-black transition-opacity hover:opacity-90"
                  >
                    {t('ui.modal.ok')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/80" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/80" aria-hidden="true">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  )
}
