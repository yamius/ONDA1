/**
 * /reviews — hub for ONDA's biohacking-tool reviews and comparisons.
 * Lists comparison round-ups and individual product reviews, and links
 * to the public scoring methodology.
 *
 * Localised via the `reviews` i18n namespace, falling back to English.
 */
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { reviews, comparisons, REVIEW_CATEGORIES, CATEGORY_LABELS, CATEGORY_URL_SLUGS } from '../data/reviews'
import { langFromPath } from '../i18n'

export function ReviewsPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const { t: tReviews } = useTranslation('reviews')

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={lang === 'en' ? '/' : `/${lang}`} className="transition-colors hover:text-white/50">{tReviews('breadcrumb.home')}</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{tReviews('breadcrumb.reviews')}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ REVIEWS ]
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">
        {tReviews('hub.h1')}
      </h1>
      <p className="mb-6 max-w-2xl font-mono text-sm leading-relaxed text-white/50">
        {tReviews('hub.intro')}
      </p>
      <Link
        to={`${langPrefix}/reviews/methodology`}
        className="mb-10 inline-block font-mono text-xs text-terminal-cyan/70 transition-colors hover:text-terminal-cyan"
      >
        {tReviews('hub.methodologyLink')}
      </Link>

      {/* Category nav — links to the per-category landing pages. Surfaced
          before the round-up list so visitors targeting one category jump
          straight to it instead of scrolling through the omnibus. */}
      <section className="mb-14">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
          {tReviews('ui.categoriesHeading', { defaultValue: 'Browse by category' })}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {REVIEW_CATEGORIES.map((cat) => {
            const count = reviews.filter((r) => r.category === cat).length
            if (count === 0) return null
            return (
              <Link
                key={cat}
                to={`${langPrefix}/reviews/${CATEGORY_URL_SLUGS[cat]}`}
                className="glass-card group flex items-center justify-between gap-3 rounded-lg p-4 transition-all hover:border-terminal-cyan/30"
              >
                <span className="font-mono text-sm text-white/80 transition-colors group-hover:text-terminal-cyan">
                  {tReviews(`categories.${cat}`, { defaultValue: CATEGORY_LABELS[cat] })}
                </span>
                <span className="font-mono text-xs text-white/30">
                  {count} {tReviews('ui.reviewsCountSuffix', { defaultValue: 'reviews' })}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {comparisons.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
            {tReviews('ui.comparisonsHeading')}
          </h2>
          <div className="grid gap-3">
            {comparisons.map((c) => (
              <Link
                key={c.slug}
                to={`${langPrefix}/reviews/compare/${c.slug}`}
                className="glass-card group flex items-start justify-between gap-4 rounded-lg p-5 transition-all hover:border-terminal-green/20"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold transition-colors group-hover:text-terminal-green">
                    {tReviews(`comparisons.${c.slug}.title`, { defaultValue: c.title })}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-white/40 line-clamp-2">
                    {tReviews(`comparisons.${c.slug}.description`, { defaultValue: c.description })}
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
              [ {tReviews(`categories.${cat}`, { defaultValue: CATEGORY_LABELS[cat] }).toUpperCase()} ]
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {catReviews.map((r) => (
                <Link
                  key={r.slug}
                  to={`${langPrefix}/reviews/${r.slug}`}
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
                    {tReviews(`bodies.${r.slug}.verdict`, { defaultValue: r.verdict })}
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
