/**
 * /hrv-biofeedback — the cornerstone "bridge entity" page. Localized to ru + es
 * (pilot) via hrv-biofeedback-i18n.ts; prose renders through the richText
 * mini-syntax so inline links survive translation. The exported jsonLd(lang)
 * builder feeds meta-inject (localized Article + FAQPage, static) and the EN
 * variant feeds the RAG corpus / llms-full. Honesty: cite evidence at the level
 * it supports; ONDA is not a medical device.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { EVIDENCE_REFERENCES } from '../data/evidence'
import { CornerstoneRelated } from '../components/CornerstoneRelated'
import { langFromPath, langHref } from '../i18n'
import { renderRich, type RichLink } from '../utils/richText'
import { HRV_BIOFEEDBACK_I18N, type CornerstoneCopy } from '../data/hrv-biofeedback-i18n'

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

/** Article + FAQPage JSON-LD in the given language. Emitted statically by
 *  meta-inject (prerender skips useEffect). EN is the default. */
export function hrvBiofeedbackJsonLd(lang: Lang = 'en'): Record<string, unknown>[] {
  const c = HRV_BIOFEEDBACK_I18N[lang] ?? HRV_BIOFEEDBACK_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/hrv-biofeedback`
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
      about: 'HRV biofeedback',
      citation: EVIDENCE_REFERENCES.map((r) => ({
        '@type': 'ScholarlyArticle',
        name: r.title,
        author: r.authors.split(', ').map((name) => ({ '@type': 'Person', name })),
        datePublished: String(r.year),
        isPartOf: { '@type': 'Periodical', name: r.journal },
        sameAs: [`https://doi.org/${r.doi}`, ...(r.pmid ? [`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`] : [])],
      })),
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

export function HrvBiofeedbackPage() {
  const location = useLocation()
  const lang = langFromPath(location.pathname) as Lang
  const copy: CornerstoneCopy = HRV_BIOFEEDBACK_I18N[lang] ?? HRV_BIOFEEDBACK_I18N.en
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/hrv-biofeedback`

  // Resolve link tokens once: EN path → langHref'd target + localized label.
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
    // Article + FAQPage JSON-LD + hreflang are emitted statically by prerender/meta-inject.
  }, [copy, pageUrl])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      {/* HERO / DEFINITION */}
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">{copy.kicker}</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{copy.h1}</h1>
        <p className="font-mono text-sm leading-relaxed text-white/75 md:text-base">{renderRich(copy.heroLead, links, 'hero')}</p>
      </header>

      {/* TOC */}
      <nav className="mt-8 flex flex-wrap gap-2 font-mono text-xs" aria-label="On this page">
        {copy.toc.map((t) => (
          <a key={t.id} href={`#${t.id}`} className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5">
            {t.label}
          </a>
        ))}
      </nav>

      {copy.sections.map((s) => (
        <Section key={s.id} id={s.id} kicker={s.kicker} title={s.title}>
          {s.paras.map((p, i) => (
            <p key={i}>{renderRich(p, links, `${s.id}${i}`)}</p>
          ))}
          {s.box && (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 font-mono text-xs text-white/55">
              <strong className="text-white/80">{s.box.label}</strong>
              {s.box.text}
            </div>
          )}
        </Section>
      ))}

      <Section id={copy.limits.id} kicker={copy.limits.kicker} title={copy.limits.title}>
        <ul className="space-y-2">
          {copy.limits.items.map((it, i) => (
            <li key={i}>• {it}</li>
          ))}
        </ul>
      </Section>

      <Section id={copy.research.id} kicker={copy.research.kicker} title={copy.research.title}>
        <p className="!text-white/60">{copy.research.intro}</p>
        <ol className="mt-2 space-y-3 font-mono text-xs leading-relaxed text-white/60">
          {EVIDENCE_REFERENCES.map((r) => (
            <li key={r.id}>
              <span className="text-white/75">{r.authors}</span> ({r.year}).{' '}
              <span className="italic text-white/70">{r.title}</span>. <span className="text-white/60">{r.journal}</span>.{' '}
              <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green break-all">
                DOI: {r.doi}
              </a>
              {r.pmid && (
                <>
                  {' · '}
                  <a href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`} target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green">
                    PMID: {r.pmid}
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 !text-white/55">{renderRich(copy.research.more, links, 'resmore')}</p>
      </Section>

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

      <CornerstoneRelated current="hrv-biofeedback" lang={lang} />
    </main>
  )
}
