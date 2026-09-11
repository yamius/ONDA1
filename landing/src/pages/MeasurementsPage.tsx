/**
 * /measurements — "What ONDA actually measures". The most machine-verifiable
 * page on the site: a signal table separating measured / derived / estimated,
 * plus an explicit "what ONDA does NOT measure" register. Localized to ru + es
 * via measurements-i18n.ts. Honesty rules (do not break): coherence is DERIVED,
 * stress/energy are ESTIMATES, never list fitness/sleep/blood biomarkers as
 * measured, ONDA is not a medical device.
 *
 * jsonLd(lang) → localized WebPage + FAQPage, emitted statically by meta-inject.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { langFromPath, langHref } from '../i18n'
import { renderRich, type RichLink } from '../utils/richText'
import { MEASUREMENTS_I18N, type MCopy, type MKind } from '../data/measurements-i18n'

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

const KIND_CLASS: Record<MKind, string> = {
  measured: 'text-terminal-green border-terminal-green/40',
  derived: 'text-cyan-300 border-cyan-300/40',
  estimated: 'text-amber-300 border-amber-300/40',
}

/** WebPage + FAQPage JSON-LD in the given language. Emitted statically by meta-inject. */
export function measurementsJsonLd(lang: Lang = 'en'): Record<string, unknown>[] {
  const c = MEASUREMENTS_I18N[lang] ?? MEASUREMENTS_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/measurements`
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
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      inLanguage: lang,
      mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
}

export function MeasurementsPage() {
  const location = useLocation()
  const lang = langFromPath(location.pathname) as Lang
  const copy: MCopy = MEASUREMENTS_I18N[lang] ?? MEASUREMENTS_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/measurements`

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
    // WebPage + FAQPage JSON-LD + hreflang emitted statically by prerender/meta-inject.
  }, [copy, pageUrl])

  const kinds: MKind[] = ['measured', 'derived', 'estimated']

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* HERO */}
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">{copy.kicker}</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{copy.h1}</h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">{copy.heroLead}</p>
      </header>

      {/* LEGEND */}
      <section className="pt-10">
        <div className="flex flex-wrap gap-3 font-mono text-xs">
          {kinds.map((k) => (
            <span key={k} className={`rounded border px-3 py-1.5 ${KIND_CLASS[k]}`}>
              {copy.kindLabels[k]}
            </span>
          ))}
        </div>
      </section>

      {/* SIGNAL TABLE */}
      <section className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 font-mono text-xs uppercase tracking-wider text-white/50">
                <th className="py-3 pr-4">{copy.tableHeaders.signal}</th>
                <th className="py-3 pr-4">{copy.tableHeaders.source}</th>
                <th className="py-3 pr-4">{copy.tableHeaders.type}</th>
                <th className="py-3">{copy.tableHeaders.meaning}</th>
              </tr>
            </thead>
            <tbody>
              {copy.signals.map((row) => (
                <tr key={row.signal} className="border-b border-white/10 align-top">
                  <td className="py-4 pr-4 font-semibold text-white">{row.signal}</td>
                  <td className="py-4 pr-4 text-white/70">{row.source}</td>
                  <td className="py-4 pr-4">
                    <span className={`inline-block whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[11px] ${KIND_CLASS[row.kind]}`}>
                      {copy.kindLabels[row.kind]}
                    </span>
                  </td>
                  <td className="py-4 text-white/70">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHAT ONDA DOES NOT MEASURE */}
      <section className="pt-14">
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          {copy.notMeasuredPre}<span className="text-amber-300">{copy.notMeasuredNot}</span>{copy.notMeasuredPost}
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70">{copy.notMeasuredIntro}</p>
        <ul className="space-y-2 font-mono text-sm text-white/70">
          {copy.notMeasured.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-amber-300">✕</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* HOW IT'S COMPUTED — link out */}
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.02] p-6">
        <p className="font-mono text-sm leading-relaxed text-white/70">{renderRich(copy.computeBox, links, 'cb')}</p>
      </section>

      {/* FAQ */}
      <section className="pt-14">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">{copy.faqHeading}</h2>
        <div className="space-y-6">
          {copy.faq.map((f) => (
            <div key={f.q} className="border-b border-white/10 pb-6">
              <h3 className="mb-2 font-semibold text-white">{f.q}</h3>
              <p className="font-mono text-sm leading-relaxed text-white/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
