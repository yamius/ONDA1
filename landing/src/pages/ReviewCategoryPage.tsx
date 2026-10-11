/**
 * /reviews/<category-slug> — per-category landing page for the reviews hub.
 * One focused page per ReviewCategory (HRV trackers, meditation apps, sleep
 * apps, vagus nerve stimulators, CGMs, EEG & brain-training headsets),
 * surfacing that category's round-up + all individual reviews together,
 * plus a cross-link rail to the other categories.
 *
 * Slug → category resolution lives in `getCategoryByUrlSlug` so a single
 * dynamic route in the SPA covers all six pages without per-page wiring.
 */
import AppStoreCTA, { ctaVariantForCategory } from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { useLocation, Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  reviews,
  comparisons,
  headToHeads,
  LIVE_REVIEW_CATEGORIES,
  getReviewBySlug,
} from '../lib/review-content'
import { CATEGORY_LABELS, CATEGORY_URL_SLUGS, getCategoryByUrlSlug } from '../data/reviews/criteria'
import { langFromPath, langHref, homePathFor } from '../i18n'
import { NotFoundPage } from './NotFoundPage'
import { CATEGORY_INTRO } from '../data/reviews/category-hub-copy'
import { LOCALIZED_COVERAGE } from '../data/localized-coverage.generated'

export function ReviewCategoryPage() {
  // The shared `/reviews/:slug` route hands us the same `slug` param it uses
  // for individual reviews; the parent dispatcher routes us here only when
  // the slug matches a known category URL slug.
  const { slug } = useParams<{ slug: string }>()
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const { t: tReviews } = useTranslation('reviews')

  const category = slug ? getCategoryByUrlSlug(slug) : undefined
  if (!category) return <NotFoundPage />

  // Localized hub: list only children that are prerendered in this language
  // (LOCALIZED_COVERAGE) — never a /<lang>/ link to an EN-only page.
  const cov = lang === 'en' ? null : LOCALIZED_COVERAGE[lang]?.reviews
  const live = (remainder: string) => !cov || cov.has(remainder)
  const allCatReviews = reviews.filter((r) => r.category === category)
  const catReviews = allCatReviews.filter((r) => live(r.slug))
  const catComparison = comparisons.find((c) => c.category === category && live(`compare/${c.slug}`))
  const otherCategories = LIVE_REVIEW_CATEGORIES.filter((c) => c !== category && live(CATEGORY_URL_SLUGS[c]))
  // Head-to-heads where every product (2 or 3) belongs to this category.
  const catReviewSlugs = new Set(allCatReviews.map((r) => r.slug))
  const catHeadToHeads = headToHeads.filter(
    (h) =>
      live(`vs/${h.slug}`) &&
      catReviewSlugs.has(h.productASlug) &&
      catReviewSlugs.has(h.productBSlug) &&
      (h.productCSlug ? catReviewSlugs.has(h.productCSlug) : true),
  )
  const hubKey = `categoryHubs.${CATEGORY_URL_SLUGS[category]}`
  const h1 = tReviews(`${hubKey}.h1`, { defaultValue: CATEGORY_INTRO[category].h1 })
  const intro = tReviews(`${hubKey}.intro`, { defaultValue: CATEGORY_INTRO[category].intro })
  const label = tReviews(`categories.${category}`, { defaultValue: CATEGORY_LABELS[category] })

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={homePathFor(lang)} className="transition-colors hover:text-white/50">
          {tReviews('breadcrumb.home', { defaultValue: 'Home' })}
        </Link>
        <span>/</span>
        <Link to={langHref(`/reviews`, lang)} className="transition-colors hover:text-white/50">
          {tReviews('breadcrumb.reviews', { defaultValue: 'Reviews' })}
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          {label}
        </span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ {tReviews('breadcrumb.reviews', { defaultValue: 'Reviews' }).toUpperCase()} / {label.toUpperCase()} ]
      </div>
      <h1 id="article-intro" className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">
        {h1}
      </h1>
      <p className="mb-6 max-w-3xl font-mono text-sm leading-relaxed text-white/50">
        {intro}
      </p>
      <Link
        to={langHref(`/reviews/methodology`, lang)}
        className="mb-12 inline-block font-mono text-xs text-terminal-cyan/70 transition-colors hover:text-terminal-cyan"
      >
        {tReviews('hub.methodologyLink', { defaultValue: 'How we score →' })}
      </Link>

      <AppStoreCTA ct={storeCt('rvhub', slug, lang)} variant={ctaVariantForCategory(category)} lang={lang} className="mb-14" />

      {catComparison && (
        <section className="mb-14">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
            {tReviews('ui.roundUpHeading', { defaultValue: 'Ranked round-up' })}
          </h2>
          <Link
            to={langHref(`/reviews/compare/${catComparison.slug}`, lang)}
            className="glass-card group flex items-start justify-between gap-4 rounded-lg p-5 transition-all hover:border-terminal-green/20"
          >
            <div className="min-w-0">
              <h3 className="font-semibold transition-colors group-hover:text-terminal-green">
                {tReviews(`comparisons.${catComparison.slug}.title`, { defaultValue: catComparison.title })}
              </h3>
              <p className="mt-1 font-mono text-xs text-white/40 line-clamp-2">
                {tReviews(`comparisons.${catComparison.slug}.description`, { defaultValue: catComparison.description })}
              </p>
            </div>
            <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">→</span>
          </Link>
        </section>
      )}

      {catHeadToHeads.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
            {tReviews('ui.headToHeadHeading', { defaultValue: 'Head-to-head duels' })}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {catHeadToHeads.map((h) => {
              const a = getReviewBySlug(h.productASlug)
              const b = getReviewBySlug(h.productBSlug)
              const c = h.productCSlug ? getReviewBySlug(h.productCSlug) : undefined
              if (!a || !b || (h.productCSlug && !c)) return null
              const names = c ? [a.name, b.name, c.name] : [a.name, b.name]
              return (
                <Link
                  key={h.slug}
                  to={langHref(`/reviews/vs/${h.slug}`, lang)}
                  className="glass-card group flex items-start justify-between gap-3 rounded-lg p-4 transition-all hover:border-terminal-green/20"
                >
                  <p className="font-mono text-sm font-semibold text-white/80 transition-colors group-hover:text-terminal-green">
                    {names.map((n, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-white/35"> vs </span>}
                        {n}
                      </span>
                    ))}
                  </p>
                  <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">→</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {catReviews.length > 0 && (
      <section className="mb-14">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
          {tReviews('ui.allReviewsHeading', { defaultValue: 'All reviews' })} ({catReviews.length})
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {catReviews.map((r) => (
            <Link
              key={r.slug}
              to={langHref(`/reviews/${r.slug}`, lang)}
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
      )}

      {otherCategories.length > 0 && (
      <section className="mb-4 border-t border-white/5 pt-10">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-white/30">
          {tReviews('ui.otherCategoriesHeading', { defaultValue: 'Other review categories' })}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {otherCategories.map((c) => (
            <Link
              key={c}
              to={langHref(`/reviews/${CATEGORY_URL_SLUGS[c]}`, lang)}
              className="group flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-terminal-cyan/30 hover:bg-white/[0.04]"
            >
              <span className="font-mono text-sm text-white/70 transition-colors group-hover:text-terminal-cyan">
                {tReviews(`categories.${c}`, { defaultValue: CATEGORY_LABELS[c] })}
              </span>
              <span className="font-mono text-xs text-white/25 transition-colors group-hover:text-terminal-cyan/60">→</span>
            </Link>
          ))}
        </div>
      </section>
      )}
    </div>
  )
}
