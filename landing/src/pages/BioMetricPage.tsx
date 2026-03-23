import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { METRIC_DETAILS } from '../data/bioMetrics'
import { NotFoundPage } from './NotFoundPage'

const SITE_URL = 'https://onda-life.com'

export function BioMetricPage() {
  const { metric } = useParams<{ metric: string }>()
  const detail = metric ? METRIC_DETAILS[metric] : undefined

  useEffect(() => {
    if (!detail) return
    const title = `${detail.title} | ONDA Life Bio OS`
    document.title = title
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name'
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.content = content
    }
    setMeta('description', `${detail.title} — learn what this biometric means and how to use it in your daily practice.`)
    setMeta('og:title', title, true)
    setMeta('og:url', `${SITE_URL}/bio/${metric}`, true)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = `${SITE_URL}/bio/${metric}`
  }, [detail, metric])

  if (!detail) return <NotFoundPage />

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/bio" className="transition-colors hover:text-white/50">Bio OS</Link>
        <span>/</span>
        <span className="text-cyan-400/60" aria-current="page">{detail.shortTitle}</span>
      </nav>

      {/* Title */}
      <h1 className="mb-10 text-2xl font-bold leading-snug tracking-tight text-white md:text-3xl">
        {detail.title}
      </h1>

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
                  The ONDA Principle
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
          to="/bio"
          className="inline-flex items-center gap-2 font-mono text-xs text-white/30 transition-colors hover:text-cyan-400/60"
        >
          ← Back to Bio OS
        </Link>
      <div className="rounded-2xl border border-cyan-500/15 bg-[#1e1540] p-6 text-center">
        <p className="mb-1 text-sm font-semibold text-white/80">Ready to measure?</p>
        <p className="mb-5 text-xs text-white/35">Place your finger on the camera and see this metric live.</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/#download"
            onClick={() => { (window as any).lastPlatform = 'ios' }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition-all hover:border-cyan-500/50 hover:bg-white/15 sm:w-auto"
            aria-label="Download ONDA Life on App Store"
            data-button="apple"
            data-platform="ios"
          >
            <AppleIcon />
            <span>App Store</span>
          </a>
          <a
            href="/#download"
            onClick={() => { (window as any).lastPlatform = 'android' }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition-all hover:border-cyan-500/50 hover:bg-white/15 sm:w-auto"
            aria-label="Download ONDA Life on Google Play"
            data-button="android"
            data-platform="android"
          >
            <PlayIcon />
            <span>Google Play</span>
          </a>
        </div>
      </div>
      </div>
    </div>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.73M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.18 23.76c.3.17.64.24.99.2L15.9 12 4.17.04a1.5 1.5 0 0 0-.99.2C2.58.62 2.25 1.27 2.25 2v20c0 .73.33 1.38.93 1.76zM19.5 9.75l-2.76-1.6L13.5 12l3.24 3.85 2.76-1.6c.87-.5 1.37-1.18 1.37-2.25s-.5-1.75-1.37-2.25z" />
    </svg>
  )
}
