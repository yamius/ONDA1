/**
 * /topics — index of all topic hubs. EN-only for now (no /<lang>/topics route).
 *
 * Thick, self-contained page: expanded intro, the hub grid, and a closing body
 * that explains the clustering model for search/answer engines. Client-side
 * meta + CollectionPage/ItemList JSON-LD (parity with the build-time inject).
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TOPICS } from '../data/topics'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/topics`

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
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'Topic Hubs | ONDA Life — Articles by Cluster'
    const desc =
      'Articles and glossary terms grouped by semantic cluster: HRV, circadian, dopamine, metabolic, breathwork, neuroplasticity, cognition, spinal, hormones and longevity — each a curated pillar with the science behind it.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    // CollectionPage/ItemList JSON-LD is emitted statically by meta-inject.
  }, [location])

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">Topics</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">Topic Hubs</h1>
      <p className="mb-3 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        Articles and glossary terms organised by semantic cluster. Each hub is a curated pillar
        into one domain of the biocomputer — the science, the practice and the vocabulary in one
        place, rather than scattered across separate posts.
      </p>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        Start with the hub that matches what you&rsquo;re working on and follow the links inward; every
        member article and defined term cross-references the others, so one cluster opens the next.
      </p>

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
                  {t.articleSlugs.length} articles
                </span>
              </div>
              <p className="font-mono text-xs text-white/50">{t.tagline}</p>
              {!live && (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-amber-500/60">
                  [ pillar in review — coming soon ]
                </p>
              )}
            </Link>
          )
        })}
      </div>

      {/* ── SEO / answer-engine body ─────────────────────────────────────── */}
      <section className="mt-14 border-t border-white/10 pt-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">How the hubs are organised</h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/65">
          <p>
            ONDA&rsquo;s knowledge base is grouped into topic hubs rather than a flat blog feed. Each
            hub is a <em>pillar</em> — a long-form overview of one system of the body treated as part
            of a &ldquo;biocomputer&rdquo; — with its member articles and glossary terms clustered beneath it.
            The clusters map to the domains that actually govern how you feel and perform: heart-rate
            variability and the autonomic nervous system, circadian rhythm, dopamine and motivation,
            metabolism, breathwork, neuroplasticity, cognition, the spinal/motor system, hormones and
            longevity.
          </p>
          <p>
            The point of clustering is context. A single article answers one question; a hub shows
            how that answer sits inside a whole system — so you can see, for example, how HRV, sleep
            timing and breathwork are three views of the same nervous-system state rather than three
            unrelated tips. Where a claim is well-supported we cite it and link to the{' '}
            <Link to="/research" className="text-terminal-green hover:underline">evidence</Link>; where
            an idea is a framing or a metaphor we say so, and keep it separate from the measured science.
          </p>
          <p>
            Hubs still in review are marked as such and left out of search until their pillar is
            finished and checked — a half-written page never enters the index. To go deeper on the
            measured side, see{' '}
            <Link to="/measurements" className="text-terminal-green hover:underline">what ONDA measures</Link>,
            the{' '}
            <Link to="/hrv-biofeedback" className="text-terminal-green hover:underline">HRV biofeedback</Link>{' '}
            explainer, or the full{' '}
            <Link to="/articles" className="text-terminal-green hover:underline">articles</Link> and{' '}
            <Link to="/glossary" className="text-terminal-green hover:underline">glossary</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
