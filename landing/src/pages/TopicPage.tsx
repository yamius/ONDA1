/**
 * /topics/:slug — single topic hub.
 *
 * Renders the pillar markdown (if set), then a list of member articles
 * and glossary terms with their canonical metadata. When pillar is
 * undefined the page renders a "coming soon" placeholder; the prerender
 * pipeline emits <meta name=robots content=noindex> so the placeholder
 * never enters Google's index.
 */
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { NotFoundPage } from './NotFoundPage'
import { getTopicBySlug } from '../data/topics'
import { getArticleBySlug } from '../data/articles'
import { getTermBySlug } from '../data/glossary'

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = slug ? getTopicBySlug(slug) : undefined
  if (!topic) return <NotFoundPage />

  const articles = topic.articleSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is NonNullable<typeof a> => !!a)
  const terms = topic.glossarySlugs
    .map((s) => getTermBySlug(s))
    .filter((t): t is NonNullable<typeof t> => !!t)

  const live = !!topic.pillar

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/topics" className="transition-colors hover:text-white/50">Topics</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{topic.name}</span>
      </nav>

      <div className="mb-4">
        <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-3 py-1 font-mono text-[10px] tracking-wider text-terminal-green">
          Topic Hub
        </span>
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">{topic.name}</h1>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        {topic.tagline}
      </p>

      {live ? (
        <article className="prose-onda mb-12">
          <Markdown>{topic.pillar!}</Markdown>
        </article>
      ) : (
        <aside className="mb-12 border border-amber-500/30 bg-amber-500/5 p-5 font-mono text-xs text-amber-200/80">
          <div className="mb-2 tracking-wider text-amber-400">[ PILLAR_IN_REVIEW ]</div>
          <p>
            The curated overview for this topic is being drafted and reviewed for
            accuracy. The article and glossary index below is canonical — every
            link points at the live, indexable content.
          </p>
        </aside>
      )}

      {articles.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
            [ DEEP_DIVES ] — {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </h2>
          <div className="grid gap-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                to={`/articles/${a.slug}`}
                className="glass-card group flex items-start justify-between gap-4 rounded-lg p-4 transition-all hover:border-terminal-green/20"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold transition-colors group-hover:text-terminal-green">
                    {a.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-white/40 line-clamp-2">{a.description}</p>
                </div>
                <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {terms.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
            [ FOUNDATIONS ] — glossary
          </h2>
          <div className="flex flex-wrap gap-2">
            {terms.map((t) => (
              <Link
                key={t.slug}
                to={`/glossary/${t.slug}`}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70 transition-colors hover:border-terminal-cyan/30 hover:text-terminal-cyan"
                title={t.shortDescription}
              >
                {t.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12">
        <Link
          to="/topics"
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← All topics
        </Link>
      </div>
    </div>
  )
}
