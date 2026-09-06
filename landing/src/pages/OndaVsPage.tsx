/**
 * /compare/onda-vs-<slug> — ONDA Life's OWN comparison against a competitor.
 *
 * Deliberately separate from the independent /reviews/* system. A visible
 * transparency banner says this is ONDA's own comparison, and where an
 * independent ONDA review of the competitor exists we link straight to it.
 * The capability table uses the same axes for every competitor with ONDA's
 * column defined once (see src/data/onda-vs.ts), so it reads as an objective
 * matrix, not a sales sheet.
 *
 * EN-only. Self-contained meta + WebPage/FAQPage JSON-LD, mirroring the other
 * GEO pages.
 */
import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CAPABILITIES, ONDA_CAPS, getOndaVs, type Cap } from '../data/onda-vs'
import { NotFoundPage } from './NotFoundPage'

const SITE_URL = 'https://onda-life.com'

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setOrCreateScript(id: string, json: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(json)
}

const CAP_GLYPH: Record<Cap, string> = { yes: '✓', limited: '~', no: '—' }
const CAP_CLASS: Record<Cap, string> = {
  yes: 'text-terminal-green',
  limited: 'text-amber-300',
  no: 'text-white/30',
}
const CAP_LABEL: Record<Cap, string> = { yes: 'Yes', limited: 'Limited', no: 'No' }

function CapCell({ v }: { v: Cap }) {
  return (
    <span className={`font-mono ${CAP_CLASS[v]}`} title={CAP_LABEL[v]} aria-label={CAP_LABEL[v]}>
      {CAP_GLYPH[v]}
    </span>
  )
}

export function OndaVsPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const entry = slug ? getOndaVs(slug) : undefined

  useEffect(() => {
    if (!entry) return
    const pageUrl = `${SITE_URL}/compare/${entry.slug}`
    const title = `${entry.title} — HRV Biofeedback Compared (2026) | ONDA Life`
    const desc = entry.description
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)

    setOrCreateScript('ld-ondavs-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description: desc,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL },
      about: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
    })
    setOrCreateScript('ld-ondavs-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: entry.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })

    return () => {
      for (const id of ['ld-ondavs-webpage', 'ld-ondavs-faq']) {
        const el = document.getElementById(id)
        if (el) el.remove()
      }
    }
  }, [entry, location])

  if (!entry) return <NotFoundPage />

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/compare" className="transition-colors hover:text-white/50">Compare</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{entry.title}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ ONDA VS {entry.competitorName.toUpperCase()} ]
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">{entry.title}</h1>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/55">{entry.intro}</p>

      {/* Transparency banner */}
      <div className="mb-10 rounded-lg border border-white/10 bg-white/[0.02] p-4 font-mono text-xs leading-relaxed text-white/50">
        This is ONDA Life&rsquo;s own comparison, kept as objective as we can make it — the
        capability rows are the same for every competitor.{' '}
        {entry.reviewSlug ? (
          <>
            For our separate, independent review of {entry.competitorName}, see{' '}
            <Link to={`/reviews/${entry.reviewSlug}`} className="text-terminal-cyan hover:text-terminal-green">
              the {entry.competitorName} review
            </Link>
            .
          </>
        ) : (
          <>
            {entry.competitorName} details are drawn from its public product information.
          </>
        )}
      </div>

      {/* Verdict */}
      <section className="mb-10 rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-widest text-terminal-green/80">VERDICT</p>
        <p className="text-sm leading-relaxed text-white/85">{entry.verdict}</p>
      </section>

      {/* Capability table */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Capabilities side by side</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 font-mono text-xs uppercase tracking-wider text-white/50">
                <th className="py-3 pr-4">Capability</th>
                <th className="py-3 pr-4 text-center text-terminal-green">ONDA</th>
                <th className="py-3 pr-4 text-center">{entry.competitorName}</th>
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map((cap) => (
                <tr key={cap} className="border-b border-white/10 align-top">
                  <td className="py-3 pr-4 text-white/75">
                    {cap}
                    {entry.notes?.[cap] && (
                      <span className="mt-0.5 block font-mono text-[11px] leading-snug text-white/40">
                        {entry.notes[cap]}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-center"><CapCell v={ONDA_CAPS[cap]} /></td>
                  <td className="py-3 pr-4 text-center"><CapCell v={entry.them[cap]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[11px] text-white/40">
          <span className="text-terminal-green">✓</span> Yes ·{' '}
          <span className="text-amber-300">~</span> Limited ·{' '}
          <span className="text-white/30">—</span> No
        </p>
      </section>

      {/* Best for */}
      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-terminal-green/25 bg-terminal-green/5 p-5">
          <h3 className="mb-2 font-mono text-xs tracking-widest text-terminal-green/80">BEST FOR ONDA</h3>
          <p className="font-mono text-xs leading-relaxed text-white/75 md:text-sm">{entry.bestForOnda}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
          <h3 className="mb-2 font-mono text-xs tracking-widest text-white/60">BEST FOR {entry.competitorName.toUpperCase()}</h3>
          <p className="font-mono text-xs leading-relaxed text-white/75 md:text-sm">{entry.bestForThem}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">Questions</h2>
        <div className="space-y-6">
          {entry.faq.map((f) => (
            <div key={f.q} className="border-b border-white/10 pb-6">
              <h3 className="mb-2 font-semibold text-white">{f.q}</h3>
              <p className="font-mono text-sm leading-relaxed text-white/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-links */}
      <section className="rounded-lg border border-white/10 bg-white/[0.02] p-6 font-mono text-sm leading-relaxed text-white/70">
        See exactly{' '}
        <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>{' '}
        and{' '}
        <Link to="/how-it-works" className="text-terminal-green hover:underline">how it works</Link>. More
        comparisons on the{' '}
        <Link to="/compare" className="text-terminal-green hover:underline">compare hub</Link>
        {entry.reviewSlug && (
          <>
            , or read the independent{' '}
            <Link to={`/reviews/${entry.reviewSlug}`} className="text-terminal-cyan hover:text-terminal-green">
              {entry.competitorName} review
            </Link>
          </>
        )}
        .
      </section>
    </div>
  )
}
