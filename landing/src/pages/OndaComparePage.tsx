/**
 * /compare — hub for ONDA Life's own "ONDA vs <competitor>" comparisons.
 * EN-only. Self-contained meta + CollectionPage JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ONDA_VS } from '../data/onda-vs'

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

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
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
    </main>
  )
}
