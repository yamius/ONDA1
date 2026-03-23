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

      {/* Back + measure CTA */}
      <div className="mt-16 flex flex-col gap-4">
        <Link
          to="/bio"
          className="inline-flex items-center gap-2 font-mono text-xs text-white/30 transition-colors hover:text-cyan-400/60"
        >
          ← Back to Bio OS
        </Link>
        <div className="rounded-2xl border border-cyan-500/15 bg-[#1e1540] p-5 text-center">
          <p className="mb-1 text-sm font-semibold text-white/70">Ready to measure?</p>
          <p className="mb-4 text-xs text-white/30">Open Bio OS and place your finger on the camera.</p>
          <Link
            to="/bio"
            className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-6 py-2.5 text-sm font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600"
          >
            Open Bio OS →
          </Link>
        </div>
      </div>
    </div>
  )
}
