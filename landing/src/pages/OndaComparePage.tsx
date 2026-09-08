/**
 * /compare — hub for ONDA Life's own "ONDA vs <competitor>" comparisons.
 * EN-only. Self-contained meta + CollectionPage JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ONDA_VS, CAPABILITIES, ONDA_CAPS, type Cap } from '../data/onda-vs'
import { ONDA_ROUNDUPS } from '../data/onda-roundups'

const CAP_GLYPH: Record<Cap, string> = { yes: '✓', limited: '~', no: '—' }
const CAP_CLASS: Record<Cap, string> = {
  yes: 'text-terminal-green',
  limited: 'text-amber-300',
  no: 'text-white/25',
}

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/compare`

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

export function OndaComparePage() {
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'ONDA vs Oura, WHOOP, Headspace, Calm & more — Compared | ONDA Life'
    const desc =
      'How ONDA Life’s HRV biofeedback compares to Oura, WHOOP, Headspace, Calm, Breathwrk and Elite HRV — objective capability tables and who each is best for.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)

    setOrCreateScript('ld-compare-collection', {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${PAGE_URL}#collection`,
      url: PAGE_URL,
      name: title,
      description: desc,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL },
      hasPart: ONDA_VS.map((e) => ({
        '@type': 'WebPage',
        name: e.title,
        url: `${SITE_URL}/compare/${e.slug}`,
      })),
    })

    return () => {
      const el = document.getElementById('ld-compare-collection')
      if (el) el.remove()
    }
  }, [location])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ COMPARE ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">ONDA vs the alternatives.</h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">
          How ONDA&rsquo;s real-time HRV biofeedback stacks up against the apps and wearables people
          cross-shop. These are ONDA&rsquo;s own comparisons, kept objective — the same capability
          rows for every one — with an honest &ldquo;best for&rdquo; on each side.
        </p>
      </header>

      {/* Capability matrix — ONDA and every competitor on the same axes, at a
          glance. Reuses the onda-vs data so it can't drift. */}
      <section className="mt-12">
        <h2 className="mb-1 text-xl font-bold tracking-tight md:text-2xl">Capabilities at a glance</h2>
        <p className="mb-4 font-mono text-xs text-white/45">
          ONDA and the apps people cross-shop, on the same axes.{' '}
          <span className="text-terminal-green">✓</span> yes ·{' '}
          <span className="text-amber-300">~</span> limited ·{' '}
          <span className="text-white/30">—</span> no
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 font-mono text-[11px] uppercase tracking-wider text-white/50">
                <th className="py-3 pr-4 font-medium">Capability</th>
                <th className="px-2 py-3 text-center text-terminal-green">ONDA</th>
                {ONDA_VS.map((e) => (
                  <th key={e.slug} className="px-2 py-3 text-center font-medium text-white/60">
                    <Link to={`/compare/${e.slug}`} className="hover:text-terminal-green">
                      {e.competitorName}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map((cap) => (
                <tr key={cap} className="border-b border-white/10">
                  <td className="min-w-[220px] py-3 pr-4 align-top text-white/75">{cap}</td>
                  <td className={`px-2 py-3 text-center font-mono ${CAP_CLASS[ONDA_CAPS[cap]]}`}>
                    {CAP_GLYPH[ONDA_CAPS[cap]]}
                  </td>
                  {ONDA_VS.map((e) => (
                    <td key={e.slug} className={`px-2 py-3 text-center font-mono ${CAP_CLASS[e.them[cap]]}`}>
                      {CAP_GLYPH[e.them[cap]]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/40">
          This is ONDA&rsquo;s own comparison. Tap any competitor for the full head-to-head, and see{' '}
          <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>.
        </p>
      </section>

      {/* Top-X guides */}
      <h2 className="mt-12 mb-4 text-xl font-bold tracking-tight md:text-2xl">Top picks by category</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {ONDA_ROUNDUPS.map((r) => (
          <li key={r.slug}>
            <Link
              to={`/compare/${r.slug}`}
              className="block h-full rounded-lg border border-terminal-green/25 bg-terminal-green/5 p-5 transition-colors hover:border-terminal-green/50"
            >
              <div className="mb-1 text-lg font-bold text-white">{r.title}</div>
              <p className="font-mono text-xs leading-relaxed text-white/60 line-clamp-3">{r.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 mb-4 text-xl font-bold tracking-tight md:text-2xl">Head-to-head</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {ONDA_VS.map((e) => (
          <li key={e.slug}>
            <Link
              to={`/compare/${e.slug}`}
              className="block h-full rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-terminal-green/40 hover:bg-terminal-green/5"
            >
              <div className="mb-1 text-lg font-bold text-white">{e.title}</div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-white/40">
                {e.category}
              </div>
              <p className="font-mono text-xs leading-relaxed text-white/60 line-clamp-3">{e.verdict}</p>
            </Link>
          </li>
        ))}
      </ul>

      {/* ── How we compare — methodology + honesty note ──────────────────── */}
      <section className="mt-16 border-t border-white/10 pt-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">How we compare</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/65">
          <p>
            These are ONDA&rsquo;s <em>own</em> comparisons, so we hold them to a stricter rule than a
            typical &ldquo;vs&rdquo; page: every competitor is scored on the same capability rows, from public
            information and hands-on use, and each head-to-head carries an honest &ldquo;best for&rdquo; on both
            sides — including the cases where a rival is the better pick. ONDA is a real-time HRV
            biofeedback and guided-breathing app; when what you actually want is passive overnight
            tracking from a ring or band, we say so.
          </p>
          <p>
            Because we can&rsquo;t be neutral about our own product, we keep our self-comparisons here at{' '}
            <Link to="/compare" className="text-terminal-green hover:underline">/compare</Link> and out
            of the independent{' '}
            <Link to="/reviews" className="text-terminal-green hover:underline">reviews</Link>, which are
            scored against a{' '}
            <Link to="/reviews/methodology" className="text-terminal-green hover:underline">public rubric</Link>{' '}
            that ONDA is deliberately left out of. For the underlying detail, see{' '}
            <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>{' '}
            and the{' '}
            <Link to="/research" className="text-terminal-green hover:underline">evidence</Link> it builds on.
          </p>
        </div>
      </section>
    </main>
  )
}
