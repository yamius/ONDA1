import { Link } from 'react-router-dom'
import { articles } from '../data/articles'

export function ArticlesSection() {
  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          [ DEEP DIVES ]
        </div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:mb-6 md:text-4xl">
          Flagship{' '}
          <span className="bg-gradient-to-r from-terminal-cyan to-terminal-green bg-clip-text text-transparent">
            Articles
          </span>
        </h2>
        <p className="mb-12 max-w-2xl font-mono text-sm text-white/40">
          Science-backed guides for nervous system optimization. From vagal tone to longevity hardware.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/articles/${article.slug}`}
              className="glass-card group rounded-xl p-5 transition-all hover:border-terminal-green/10"
            >
              <span className="mb-2 block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/30">
                {article.category}
              </span>
              <h3 className="mb-2 text-base font-semibold leading-tight transition-colors group-hover:text-terminal-green">
                {article.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-white/40 line-clamp-2">
                {article.description}
              </p>
              <span className="mt-2 block font-mono text-xs text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-lg border border-terminal-green/20 bg-terminal-green/5 px-5 py-2.5 font-mono text-sm text-terminal-green transition-all hover:border-terminal-green/40 hover:bg-terminal-green/10"
          >
            View all {articles.length} articles
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
