/**
 * /how-it-works — "How ONDA works". Technical-methodology companion to
 * /measurements: the biofeedback loop and, at an honest conceptual level, how
 * HRV and the coherence score are computed. Localized to ru + es via
 * how-it-works-i18n.ts. Honesty rules: describe method at the level we can
 * stand behind; never invent internals; always state the boundaries
 * (coherence is not a biomarker; ONDA is not a medical device).
 *
 * jsonLd(lang) → localized WebPage, emitted statically by meta-inject.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { langFromPath, langHref } from '../i18n'
import { renderRich, type RichLink } from '../utils/richText'
import { HOW_IT_WORKS_I18N, type HiwCopy } from '../data/how-it-works-i18n'

type Lang = 'en' | 'ru' | 'es'
const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

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

/** WebPage JSON-LD in the given language. Emitted statically by meta-inject. */
export function howItWorksJsonLd(lang: Lang = 'en'): Record<string, unknown>[] {
  const c = HOW_IT_WORKS_I18N[lang] ?? HOW_IT_WORKS_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/how-it-works`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: c.metaTitle,
      description: c.metaDescription,
      inLanguage: lang,
      isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL },
      about: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
    },
  ]
}

export function HowItWorksPage() {
  const location = useLocation()
  const lang = langFromPath(location.pathname) as Lang
  const copy: HiwCopy = HOW_IT_WORKS_I18N[lang] ?? HOW_IT_WORKS_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/how-it-works`

  const links: Record<string, RichLink> = Object.fromEntries(
    Object.entries(copy.links).map(([k, v]) => [k, { to: langHref(v.path, lang), label: v.label }]),
  )

  useEffect(() => {
    document.title = copy.metaTitle
    setMeta('description', copy.metaDescription)
    setMeta('og:title', copy.metaTitle, true)
    setMeta('og:description', copy.metaDescription, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', copy.metaTitle, true)
    setMeta('twitter:description', copy.metaDescription, true)
    setMeta('twitter:image', OG_IMAGE, true)
    // WebPage JSON-LD + hreflang emitted statically by prerender/meta-inject.
  }, [copy, pageUrl])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* HERO */}
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">{copy.kicker}</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{copy.h1}</h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">{copy.heroLead}</p>
      </header>

      {/* THE LOOP */}
      <section className="pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">{copy.loopHeading}</h2>
        <ol className="space-y-5">
          {copy.loop.map((s) => (
            <li key={s.n} className="flex gap-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-terminal-green/40 font-mono text-sm text-terminal-green">
                {s.n}
              </span>
              <div>
                <h3 className="mb-1 font-semibold text-white">{s.title}</h3>
                <p className="font-mono text-sm leading-relaxed text-white/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* HOW HRV IS COMPUTED */}
      <section className="pt-14">
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{copy.hrvHeading}</h2>
        {copy.hrvParas.map((p, i) => (
          <p key={i} className="mb-4 font-mono text-sm leading-relaxed text-white/70">{renderRich(p, links, `hrv${i}`)}</p>
        ))}
      </section>

      {/* HOW COHERENCE IS COMPUTED */}
      <section className="pt-12">
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{copy.coherenceHeading}</h2>
        {copy.coherenceParas.map((p, i) => (
          <p key={i} className="mb-4 font-mono text-sm leading-relaxed text-white/70">{renderRich(p, links, `coh${i}`)}</p>
        ))}
      </section>

      {/* BOUNDARIES */}
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-3 text-lg font-bold text-white">{copy.boundariesHeading}</h2>
        <ul className="space-y-2 font-mono text-sm text-white/70">
          {copy.boundaries.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-sm leading-relaxed text-white/70">{renderRich(copy.boundariesMore, links, 'bm')}</p>
      </section>
    </main>
  )
}
