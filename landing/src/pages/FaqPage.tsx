/**
 * /faq — ONDA Life's consolidated question-and-answer hub, written for
 * answer engines (AI Overviews, ChatGPT). Renders the grouped Q&A from
 * src/data/onda-faq.ts and emits a single FAQPage JSON-LD over every item.
 *
 * EN-only. Self-contained meta, mirroring the other GEO pages.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ONDA_FAQ, ONDA_FAQ_FLAT } from '../data/onda-faq'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/faq`

function slugifyCategory(c: string): string {
  return c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

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

export function FaqPage() {
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'ONDA Life FAQ — HRV Biofeedback, Breathing & the App | ONDA Life'
    const desc =
      'Straight answers about HRV biofeedback, resonance breathing, HRV science and the ONDA app: what it measures, whether it needs an Apple Watch, how it compares, and more.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)

    setOrCreateScript('ld-faq-page', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      url: PAGE_URL,
      mainEntity: ONDA_FAQ_FLAT.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })

    return () => {
      const el = document.getElementById('ld-faq-page')
      if (el) el.remove()
    }
  }, [location])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* HERO */}
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ FAQ ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">Questions & answers</h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Straight answers about HRV biofeedback, breathing, the science, and how ONDA works —
          each written to stand on its own.
        </p>
      </header>

      {/* TOC */}
      <nav className="mt-8 flex flex-wrap gap-2 font-mono text-xs" aria-label="FAQ sections">
        {ONDA_FAQ.map((g) => (
          <a
            key={g.category}
            href={`#${slugifyCategory(g.category)}`}
            className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5"
          >
            {g.category}
          </a>
        ))}
      </nav>

      {/* GROUPS */}
      {ONDA_FAQ.map((g) => (
        <section key={g.category} id={slugifyCategory(g.category)} className="mt-14 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">{g.category}</h2>
          <div className="space-y-6">
            {g.items.map((item) => (
              <div key={item.q} className="border-b border-white/10 pb-6">
                <h3 className="mb-2 font-semibold text-white">{item.q}</h3>
                <p className="font-mono text-sm leading-relaxed text-white/70">{item.a}</p>
                {item.link && (
                  <Link
                    to={item.link.to}
                    className="mt-2 inline-block font-mono text-xs text-terminal-green hover:underline"
                  >
                    {item.link.label} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* CROSS-LINKS */}
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.02] p-6 font-mono text-sm leading-relaxed text-white/70">
        More depth:{' '}
        <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>,{' '}
        <Link to="/how-it-works" className="text-terminal-green hover:underline">how it works</Link>,{' '}
        <Link to="/research" className="text-terminal-green hover:underline">the evidence</Link>, and{' '}
        <Link to="/compare" className="text-terminal-green hover:underline">how ONDA compares</Link>.
      </section>
    </main>
  )
}
