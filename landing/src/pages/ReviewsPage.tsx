/**
 * /reviews — hub for ONDA's biohacking-tool reviews and comparisons.
 * Lists comparison round-ups and individual product reviews, and links
 * to the public scoring methodology.
 */
import { Link } from 'react-router-dom'
import { reviews, comparisons, REVIEW_CATEGORIES, CATEGORY_LABELS } from '../data/reviews'

export function ReviewsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">Reviews</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ REVIEWS ]
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">
        Biohacking Tool Reviews
      </h1>
      <p className="mb-6 max-w-2xl font-mono text-sm leading-relaxed text-white/50">
        Independent, criteria-based reviews of biohacking tools — HRV trackers and
        meditation apps — scored against a fixed, public rubric, not on hype.
      </p>
      <Link
        to="/reviews/methodology"
        className="mb-12 inline-block font-mono text-xs text-terminal-cyan/70 transition-colors hover:text-terminal-cyan"
      >
        → How we score (methodology)
      </Link>

      {comparisons.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
            [ COMPARISONS ]
          </h2>
          <div className="grid gap-3">
            {comparisons.map((c) => (
              <Link
                key={c.slug}
                to={`/reviews/compare/${c.slug}`}
                className="glass-card group flex items-start justify-between gap-4 rounded-lg p-5 transition-all hover:border-terminal-green/20"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold transition-colors group-hover:text-terminal-green">
                    {c.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-white/40 line-clamp-2">
                    {c.description}
                  </p>
                </div>
                <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {REVIEW_CATEGORIES.map((cat) => {
        const catReviews = reviews.filter((r) => r.category === cat)
        if (catReviews.length === 0) return null
        return (
          <section key={cat} className="mb-12">
            <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
              [ {CATEGORY_LABELS[cat].toUpperCase()} ]
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {catReviews.map((r) => (
                <Link
                  key={r.slug}
                  to={`/reviews/${r.slug}`}
                  className="glass-card group rounded-xl p-6 transition-all hover:border-terminal-green/20"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/30">
                      {r.brand}
                    </span>
                    <span className="font-mono text-sm font-bold text-terminal-green">
                      {r.overallScore.toFixed(1)}
                      <span className="text-white/30"> / 10</span>
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">
                    {r.name}
                  </h3>
                  <p className="font-mono text-xs leading-relaxed text-white/40">
                    {r.verdict}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
