import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Article } from '../data/articles'
import { getArticleTopicHub, type ArticleTopicSlug } from '../data/article-topics'
import { hubListing, worldGroups } from '../data/article-topic-listing'
import { OptimizedImage } from '../components/OptimizedImage'
import { NotFoundPage } from './NotFoundPage'

/**
 * ONDA Library topic hub — /articles/topic/<topic> (EN).
 * Template: breadcrumbs → H1 → intro → Start here (large card) → the rest of the
 * topic's articles (newest first; World hub grouped by country) → adjacent topics.
 * Everything renders from static data, so the prerendered HTML carries the full
 * list for crawlers. Head meta/JSON-LD come from scripts/meta-inject.ts.
 */
export function ArticleTopicHubPage() {
  const { topic = '' } = useParams<{ topic: string }>()
  const hub = getArticleTopicHub(topic)

  useEffect(() => {
    if (!hub) return
    document.title = `${hub.name} | ONDA Library`
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', hub.tile)
  }, [hub])

  if (!hub) return <NotFoundPage />

  const { startHere, rest } = hubListing(hub.slug as ArticleTopicSlug)
  const groups = hub.slug === 'world' ? worldGroups() : null
  const neighbors = hub.neighbors
    .map((s) => getArticleTopicHub(s))
    .filter((h): h is NonNullable<typeof h> => !!h)

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/articles" className="transition-colors hover:text-white/50">Library</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{hub.name}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">[ ONDA LIBRARY ]</div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">{hub.name}</h1>
      <p className="mb-12 max-w-3xl text-base leading-relaxed text-white/60">{hub.intro}</p>

      {startHere && (
        <section className="mb-14" aria-labelledby="start-here">
          <h2 id="start-here" className="mb-4 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">
            Start here
          </h2>
          <Link
            to={`/articles/${startHere.slug}`}
            className="glass-card group grid overflow-hidden rounded-xl transition-all hover:border-terminal-green/20 md:grid-cols-2"
          >
            {startHere.image && (
              <div className="aspect-video w-full overflow-hidden border-b border-white/5 md:border-b-0 md:border-r">
                <OptimizedImage
                  src={startHere.image}
                  alt={startHere.imageAlt ?? startHere.title}
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col justify-center p-6 md:p-8">
              <h3 className="mb-3 text-xl font-semibold transition-colors group-hover:text-terminal-green md:text-2xl">
                {startHere.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-white/50">{startHere.description}</p>
              <span className="mt-4 font-mono text-xs text-terminal-green/70">Read the guide →</span>
            </div>
          </Link>
        </section>
      )}

      {groups ? (
        groups.map((g) => (
          <section key={g.country} className="mb-12" aria-labelledby={`country-${g.country}`}>
            <h2 id={`country-${g.country}`} className="mb-5 text-lg font-semibold tracking-tight text-white/80">
              {g.country} <span className="font-mono text-xs text-white/30">({g.articles.length})</span>
            </h2>
            <ArticleGrid items={g.articles} />
          </section>
        ))
      ) : (
        <section className="mb-12" aria-labelledby="all-articles">
          <h2 id="all-articles" className="mb-5 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">
            All {hub.name} guides ({rest.length + (startHere ? 1 : 0)})
          </h2>
          <ArticleGrid items={rest} />
        </section>
      )}

      {neighbors.length > 0 && (
        <nav className="mt-16 border-t border-white/10 pt-8" aria-label="Related topics">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-white/40">Related topics</h2>
          <div className="flex flex-wrap gap-3">
            {neighbors.map((n) => (
              <Link
                key={n.slug}
                to={`/articles/topic/${n.slug}`}
                className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/60 transition-all hover:border-terminal-green/30 hover:text-terminal-green"
              >
                {n.name} →
              </Link>
            ))}
            <Link
              to="/articles"
              className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-all hover:border-white/20 hover:text-white/60"
            >
              All topics
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}

function ArticleGrid({ items }: { items: Article[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((a) => (
        <Link
          key={a.slug}
          to={`/articles/${a.slug}`}
          className="glass-card group overflow-hidden rounded-xl transition-all hover:border-terminal-green/10"
        >
          {a.image && (
            <div className="aspect-video w-full overflow-hidden border-b border-white/5">
              <OptimizedImage
                src={a.image}
                alt={a.imageAlt ?? a.title}
                loading="lazy"
                width={640}
                height={360}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">{a.title}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/40">{a.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
