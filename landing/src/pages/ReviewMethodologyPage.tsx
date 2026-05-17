/**
 * /reviews/methodology — how ONDA scores biohacking tools.
 *
 * The trust anchor for the /reviews hub: the fixed scoring rubric,
 * criteria weights, what the score means, and how hands-on testing is
 * distinguished from evidence-based assessment. Criteria are rendered
 * straight from data/reviews/criteria.ts so the page can never drift
 * from the scores it explains.
 *
 * Localised via the `reviews` i18n namespace, falling back to English.
 */
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { REVIEW_CATEGORIES, CATEGORY_LABELS, getCriteria } from '../data/reviews'
import { langFromPath } from '../i18n'

export function ReviewMethodologyPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const { t: tReviews } = useTranslation('reviews')

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={lang === 'en' ? '/' : `/${lang}`} className="transition-colors hover:text-white/50">{tReviews('breadcrumb.home')}</Link>
        <span>/</span>
        <Link to={`${langPrefix}/reviews`} className="transition-colors hover:text-white/50">{tReviews('breadcrumb.reviews')}</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{tReviews('breadcrumb.methodology')}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ METHODOLOGY ]
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {tReviews('methodology.h1')}
      </h1>
      <p className="mb-12 font-mono text-sm leading-relaxed text-white/60">
        {tReviews('methodology.intro')}
      </p>

      <h2 className="mb-3 text-xl font-bold tracking-tight">{tReviews('methodology.scoreHeading')}</h2>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        {tReviews('methodology.scoreBody')}
      </p>

      {REVIEW_CATEGORIES.map((cat) => (
        <div key={cat}>
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            {tReviews('methodology.criteriaHeading', {
              category: tReviews(`categories.${cat}`, { defaultValue: CATEGORY_LABELS[cat] }),
            })}
          </h2>
          <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
            {getCriteria(cat).map((c) => (
              <div key={c.id} className="py-4">
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold">
                    {tReviews(`criteria.${c.id}`, { defaultValue: c.label })}
                  </h3>
                  <span className="shrink-0 font-mono text-xs font-bold text-terminal-green">
                    {Math.round(c.weight * 100)}%
                  </span>
                </div>
                <p className="font-mono text-xs leading-relaxed text-white/50">
                  {tReviews(`methodology.criteriaDesc.${cat}.${c.id}`, { defaultValue: c.description })}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <h2 className="mb-3 text-xl font-bold tracking-tight">
        {tReviews('methodology.testHeading')}
      </h2>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        {tReviews('methodology.testBody')}
      </p>

      <h2 className="mb-3 text-xl font-bold tracking-tight">{tReviews('methodology.independenceHeading')}</h2>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        {tReviews('methodology.independenceBody')}
      </p>

      <h2 className="mb-3 text-xl font-bold tracking-tight">{tReviews('methodology.authorHeading')}</h2>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/60">
        {tReviews('methodology.authorBody')}{' '}
        <Link to={`${langPrefix}/about`} className="text-terminal-green/70 hover:text-terminal-green">
          {tReviews('methodology.authorLink')}
        </Link>
        .
      </p>

      <div className="mt-4">
        <Link
          to={`${langPrefix}/reviews`}
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          {tReviews('ui.allReviews')}
        </Link>
      </div>
    </div>
  )
}
