/**
 * /hrv-vs-coherence — cornerstone explainer: HRV vs coherence and how ONDA uses
 * each. Localized to ru + es via hrv-vs-coherence-i18n.ts (richText syntax +
 * a comparison table). jsonLd(lang) → localized Article + FAQPage (no citations
 * — an explainer, not an evidence page). EN callers use the 'en' default.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CornerstoneRelated } from '../components/CornerstoneRelated'
import { langFromPath, langHref } from '../i18n'
import { renderRich, type RichLink } from '../utils/richText'
import { HRV_VS_COHERENCE_I18N, type HvcCopy } from '../data/hrv-vs-coherence-i18n'

type Lang = 'en' | 'ru' | 'es'
const SITE_URL = 'https://onda-life.com'
const AUTHOR_ID = `${SITE_URL}/#author`
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

/** Article + FAQPage JSON-LD in the given language. Emitted statically by meta-inject. */
export function hrvVsCoherenceJsonLd(lang: Lang = 'en'): Record<string, unknown>[] {
  const c = HRV_VS_COHERENCE_I18N[lang] ?? HRV_VS_COHERENCE_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/hrv-vs-coherence`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${pageUrl}#article`,
      headline: c.articleHeadline,
      description: c.metaDescription,
      url: pageUrl,
      inLanguage: lang,
      author: { '@id': AUTHOR_ID },
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      about: ['Heart rate variability', 'Cardiac coherence'],
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

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-20">
      <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">{kicker}</div>
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">{children}</div>
    </section>
  )
}

export function HrvVsCoherencePage() {
  const location = useLocation()
  const lang = langFromPath(location.pathname) as Lang
  const copy: HvcCopy = HRV_VS_COHERENCE_I18N[lang] ?? HRV_VS_COHERENCE_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/hrv-vs-coherence`

  const links: Record<string, RichLink> = Object.fromEntries(
    Object.entries(copy.links).map(([k, v]) => [k, { to: langHref(v.path, lang), label: v.label }]),
  )

  useEffect(() => {
    document.title = copy.metaTitle
    setMeta('description', copy.metaDescription)
    setMeta('og:title', copy.metaTitle, true)
    setMeta('og:description', copy.metaDescription, true)
    setMeta('og:type', 'article', true)
    setMeta('og:url', pageUrl, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', copy.metaTitle, true)
    setMeta('twitter:description', copy.metaDescription, true)
    setMeta('twitter:image', OG_IMAGE, true)
    // Article + FAQPage JSON-LD + hreflang emitted statically by prerender/meta-inject.
  }, [copy, pageUrl])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">{copy.kicker}</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{copy.h1}</h1>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">{renderRich(copy.heroLead, links, 'hero')}</p>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 font-mono text-xs" aria-label="On this page">
        {copy.toc.map((t) => (
          <a key={t.id} href={`#${t.id}`} className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">
            {t.label}
          </a>
        ))}
      </nav>

      {copy.sections.map((s) => (
        <Section key={s.id} id={s.id} kicker={s.kicker} title={s.title}>
          {s.table && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <tbody className="font-mono text-xs md:text-sm">
                  {s.table.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-white/10">
                      <td className="w-32 py-3 pr-4 align-top text-white/45">{row[0]}</td>
                      <td className="py-3 pr-4 text-white/75">{row[1]}</td>
                      <td className="py-3 text-white/75">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.paras?.map((p, i) => (
            <p key={i}>{renderRich(p, links, `${s.id}${i}`)}</p>
          ))}
        </Section>
      ))}

      <section id="faq" className="mt-14 scroll-mt-20">
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

      <CornerstoneRelated current="hrv-vs-coherence" lang={lang} />
    </main>
  )
}
