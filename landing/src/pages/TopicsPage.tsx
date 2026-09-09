/**
 * /topics — index of all topic hubs. Localized to ru + es (pilot).
 *
 * Thick, self-contained page: expanded intro, the hub grid, and a closing body
 * that explains the clustering model for search/answer engines. The framing
 * prose localizes (topics-i18n.ts); the hub cards' names + taglines stay
 * English because the pillar pages at /topics/<slug> are English-only, and
 * their links keep EN paths. Cross-links go through langHref (localized where a
 * localized route exists, EN otherwise). CollectionPage/ItemList JSON-LD and
 * the hreflang cluster are emitted statically by meta-inject/prerender.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TOPICS } from '../data/topics'
import { langFromPath, langHref, homePathFor } from '../i18n'
import { TOPICS_I18N, type TopicsCopy } from '../data/topics-i18n'

const SITE_URL = 'https://onda-life.com'

/** English copy — the built-in default; ru/es overlay from TOPICS_I18N. */
const EN_COPY: TopicsCopy = {
  metaTitle: 'Topic Hubs | ONDA Life — Articles by Cluster',
  metaDescription:
    'Articles and glossary terms grouped by semantic cluster: HRV, circadian, dopamine, metabolic, breathwork, neuroplasticity, cognition, spinal, hormones and longevity — each a curated pillar with the science behind it.',
  breadcrumbTopics: 'Topics',
  h1: 'Topic Hubs',
  intro1:
    'Articles and glossary terms organised by semantic cluster. Each hub is a curated pillar into one domain of the biocomputer — the science, the practice and the vocabulary in one place, rather than scattered across separate posts.',
  intro2:
    'Start with the hub that matches what you’re working on and follow the links inward; every member article and defined term cross-references the others, so one cluster opens the next.',
  pillarInReview: '[ pillar in review — coming soon ]',
  orgHeading: 'How the hubs are organised',
  orgP1:
    'ONDA’s knowledge base is grouped into topic hubs rather than a flat blog feed. Each hub is a pillar — a long-form overview of one system of the body treated as part of a “biocomputer” — with its member articles and glossary terms clustered beneath it. The clusters map to the domains that actually govern how you feel and perform: heart-rate variability and the autonomic nervous system, circadian rhythm, dopamine and motivation, metabolism, breathwork, neuroplasticity, cognition, the spinal/motor system, hormones and longevity.',
  orgP2Pre:
    'The point of clustering is context. A single article answers one question; a hub shows how that answer sits inside a whole system — so you can see, for example, how HRV, sleep timing and breathwork are three views of the same nervous-system state rather than three unrelated tips. Where a claim is well-supported we cite it and link to the ',
  researchLink: 'evidence',
  orgP2Post:
    '; where an idea is a framing or a metaphor we say so, and keep it separate from the measured science.',
  orgP3Pre:
    'Hubs still in review are marked as such and left out of search until their pillar is finished and checked — a half-written page never enters the index. To go deeper on the measured side, see ',
  measuresLink: 'what ONDA measures',
  orgP3Mid1: ', the ',
  hrvLink: 'HRV biofeedback',
  orgP3Mid2: ' explainer, or the full ',
  articlesLink: 'articles',
  orgP3And: ' and ',
  glossaryLink: 'glossary',
  orgP3Post: '.',
}

function prefixFor(lang: string): string {
  return lang === 'ru' ? '/ru' : lang === 'es' ? '/es' : ''
}

/** Locale-aware "{n} articles" label (Russian has 3 plural forms). */
function articleCountLabel(n: number, lang: string): string {
  if (lang === 'ru') {
    const mod10 = n % 10
    const mod100 = n % 100
    let word: string
    if (mod10 === 1 && mod100 !== 11) word = 'статья'
    else if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) word = 'статьи'
    else word = 'статей'
    return `${n} ${word}`
  }
  if (lang === 'es') return `${n} ${n === 1 ? 'artículo' : 'artículos'}`
  return `${n} ${n === 1 ? 'article' : 'articles'}`
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

export function TopicsPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const copy = lang === 'ru' || lang === 'es' ? TOPICS_I18N[lang] : EN_COPY
  const pageUrl = `${SITE_URL}${prefixFor(lang)}/topics`

  useEffect(() => {
    document.title = copy.metaTitle
    setMeta('description', copy.metaDescription)
    setMeta('og:title', copy.metaTitle, true)
    setMeta('og:description', copy.metaDescription, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', pageUrl, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', copy.metaTitle, true)
    setMeta('twitter:description', copy.metaDescription, true)
    // CollectionPage/ItemList JSON-LD and hreflang cluster are emitted
    // statically by prerender/meta-inject (prerender skips useEffect).
  }, [copy, pageUrl])

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={homePathFor(lang)} className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{copy.breadcrumbTopics}</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">{copy.h1}</h1>
      <p className="mb-3 font-mono text-sm leading-relaxed text-white/60 md:text-base">{copy.intro1}</p>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60 md:text-base">{copy.intro2}</p>

      <div className="grid gap-3">
        {TOPICS.map((t) => {
          const live = !!t.pillar
          return (
            <Link
              key={t.slug}
              to={`/topics/${t.slug}`}
              className={`glass-card group flex flex-col gap-1 rounded-lg p-4 transition-all ${
                live ? 'hover:border-terminal-green/30' : 'opacity-60'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-semibold transition-colors group-hover:text-terminal-green">
                  {t.name}
                </h2>
                <span className="font-mono text-[10px] tracking-wider text-white/30">
                  {articleCountLabel(t.articleSlugs.length, lang)}
                </span>
              </div>
              <p className="font-mono text-xs text-white/50">{t.tagline}</p>
              {!live && (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-amber-500/60">
                  {copy.pillarInReview}
                </p>
              )}
            </Link>
          )
        })}
      </div>

      {/* ── SEO / answer-engine body ─────────────────────────────────────── */}
      <section className="mt-14 border-t border-white/10 pt-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{copy.orgHeading}</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/65">
          <p>{copy.orgP1}</p>
          <p>
            {copy.orgP2Pre}
            <Link to={langHref('/research', lang)} className="text-terminal-green hover:underline">{copy.researchLink}</Link>
            {copy.orgP2Post}
          </p>
          <p>
            {copy.orgP3Pre}
            <Link to={langHref('/measurements', lang)} className="text-terminal-green hover:underline">{copy.measuresLink}</Link>
            {copy.orgP3Mid1}
            <Link to={langHref('/hrv-biofeedback', lang)} className="text-terminal-green hover:underline">{copy.hrvLink}</Link>
            {copy.orgP3Mid2}
            <Link to={langHref('/articles', lang)} className="text-terminal-green hover:underline">{copy.articlesLink}</Link>
            {copy.orgP3And}
            <Link to={langHref('/glossary', lang)} className="text-terminal-green hover:underline">{copy.glossaryLink}</Link>
            {copy.orgP3Post}
          </p>
        </div>
      </section>
    </div>
  )
}
