/**
 * /faq — ONDA Life's consolidated question-and-answer hub, written for
 * answer engines (AI Overviews, ChatGPT). Renders the grouped Q&A from
 * src/data/onda-faq.ts and emits a single FAQPage JSON-LD over every item.
 *
 * Localized to ru + es via faq-i18n.ts (pilot; uk/zh follow later). English
 * is the source of truth for structure, links and anchor slugs — localized
 * copy is overlaid by index, falling back to English if counts diverge.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ONDA_FAQ } from '../data/onda-faq'
import { langFromPath } from '../i18n'
import { FAQ_I18N, type FaqLocale } from '../data/faq-i18n'

const SITE_URL = 'https://onda-life.com'

function slugifyCategory(c: string): string {
  return c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
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

export function FaqPage() {
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const loc: FaqLocale | null = lang === 'ru' || lang === 'es' ? FAQ_I18N[lang] : null
  const p = prefixFor(lang)
  const pageUrl = `${SITE_URL}${p}/faq`

  // Zip English structure (slugs, links) with localized copy by index.
  const groups = ONDA_FAQ.map((g, gi) => {
    const lg = loc?.groups[gi]
    return {
      slug: slugifyCategory(g.category),
      category: lg?.category ?? g.category,
      items: g.items.map((item, ii) => ({
        q: lg?.items[ii]?.q ?? item.q,
        a: lg?.items[ii]?.a ?? item.a,
        link: item.link,
      })),
    }
  })

  useEffect(() => {
    const title =
      loc?.metaTitle ??
      'ONDA Life FAQ — HRV Biofeedback, Breathing & the App | ONDA Life'
    const desc =
      loc?.metaDescription ??
      'Straight answers about HRV biofeedback, resonance breathing, HRV science and the ONDA app: what it measures, whether it needs an Apple Watch, how it compares, and more.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    // FAQPage JSON-LD and hreflang cluster are emitted statically by
    // prerender/meta-inject (prerender skips useEffect).
  }, [loc, pageUrl, groups])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* HERO */}
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ FAQ ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{loc?.h1 ?? 'Questions & answers'}</h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">
          {loc?.intro ??
            'Straight answers about HRV biofeedback, breathing, the science, and how ONDA works — each written to stand on its own.'}
        </p>
      </header>

      {/* TOC */}
      <nav className="mt-8 flex flex-wrap gap-2 font-mono text-xs" aria-label="FAQ sections">
        {groups.map((g) => (
          <a
            key={g.slug}
            href={`#${g.slug}`}
            className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5"
          >
            {g.category}
          </a>
        ))}
      </nav>

      {/* GROUPS */}
      {groups.map((g) => (
        <section key={g.slug} id={g.slug} className="mt-14 scroll-mt-20">
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
        {loc?.crossPre ?? 'More depth: '}
        <Link to="/measurements" className="text-terminal-green hover:underline">
          {loc?.crossLinks.measures ?? 'what ONDA measures'}
        </Link>
        ,{' '}
        <Link to="/how-it-works" className="text-terminal-green hover:underline">
          {loc?.crossLinks.how ?? 'how it works'}
        </Link>
        ,{' '}
        <Link to="/research" className="text-terminal-green hover:underline">
          {loc?.crossLinks.research ?? 'the evidence'}
        </Link>
        , {loc ? '' : 'and '}
        <Link to="/compare" className="text-terminal-green hover:underline">
          {loc?.crossLinks.compare ?? 'how ONDA compares'}
        </Link>
        .
      </section>
    </main>
  )
}
