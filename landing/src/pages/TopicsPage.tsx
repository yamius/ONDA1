/**
 * /topics — index of all topic hubs.
 * EN-only for now (no /<lang>/topics route). Each card links to its hub.
 */
import { Link } from 'react-router-dom'
import { TOPICS } from '../data/topics'

export function TopicsPage() {
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
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        Articles and glossary terms organised by semantic cluster. Each hub
        is a curated entry point into one domain of the biocomputer.
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
    </div>
  )
}
