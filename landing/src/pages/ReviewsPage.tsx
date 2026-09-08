/**
 * /reviews — hub for ONDA's biohacking-tool reviews and comparisons.
 * Lists comparison round-ups and individual product reviews, and links
 * to the public scoring methodology.
 *
 * Localised via the `reviews` i18n namespace, falling back to English.
 */
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { reviews, comparisons, headToHeads, LIVE_REVIEW_CATEGORIES, CATEGORY_LABELS, CATEGORY_URL_SLUGS, getReviewBySlug } from '../data/reviews'
import { langFromPath, langHref } from '../i18n'

export function ReviewsPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const { t: tReviews } = useTranslation('reviews')

  // Head-to-heads whose 2–3 products all belong to a given category — used to
  // show how big each category's comparison group is on the tile.
  const h2hCountFor = (cat: string) =>
    headToHeads.filter((h) => {
      const slugs = [h.productASlug, h.productBSlug, h.productCSlug].filter(Boolean) as string[]
      const prods = slugs.map((s) => getReviewBySlug(s))
      return prods.length > 0 && prods.every((p) => p && p.category === cat)
    }).length

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
        to={langHref(`/reviews/methodology`, lang)}
        className="mb-6 inline-block font-mono text-xs text-terminal-cyan/70 transition-colors hover:text-terminal-cyan"
      >
        {tReviews('hub.methodologyLink')}
      </Link>

      {/* ONDA's own comparisons — kept visibly separate from the independent
          reviews above. EN-only (the /compare hub is English). */}
      <Link
        to="/compare"
        className="mb-10 block rounded-lg border border-terminal-green/25 bg-terminal-green/5 p-4 transition-colors hover:border-terminal-green/50"
      >
        <div className="font-mono text-xs uppercase tracking-widest text-terminal-green/80">Compare · ONDA vs alternatives</div>
        <div className="mt-1 font-mono text-xs leading-relaxed text-white/55">
          How ONDA compares to Oura, WHOOP, Headspace, Calm, Breathwrk and Elite HRV — ONDA&rsquo;s own
          objective comparisons and top-picks guides (separate from the independent reviews below). &rarr;
        </div>
      </Link>

      {/* Category tiles — each opens that category's own page (its round-up,
          reviews and head-to-head comparisons together). This is the primary
          way into the reviews; the full lists live on the category pages, not
          as one endless scroll here. */}
      <section className="mb-14">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
          {tReviews('ui.categoriesHeading', { defaultValue: 'Browse by category' })}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_REVIEW_CATEGORIES.map((cat) => {
            const count = reviews.filter((r) => r.category === cat).length
            if (count === 0) return null
            const vsCount = h2hCountFor(cat)
            const hasGuide = comparisons.some((c) => c.category === cat)
            const meta = [
              `${count} ${tReviews('ui.reviewsCountSuffix', { defaultValue: 'reviews' })}`,
              vsCount > 0 ? `${vsCount} vs` : null,
              hasGuide ? tReviews('ui.guideLabel', { defaultValue: 'buying guide' }) : null,
            ].filter(Boolean).join(' · ')
            return (
              <Link
                key={cat}
                to={langHref(`/reviews/${CATEGORY_URL_SLUGS[cat]}`, lang)}
                className="glass-card group flex h-full flex-col justify-between gap-3 rounded-lg p-4 transition-all hover:border-terminal-cyan/30"
              >
                <span className="font-medium text-white/85 transition-colors group-hover:text-terminal-cyan">
                  {tReviews(`categories.${cat}`, { defaultValue: CATEGORY_LABELS[cat] })}
                </span>
                <span className="font-mono text-[11px] text-white/35">{meta} &rarr;</span>
              </Link>
            )
          })}
        </div>
      </section>

      {comparisons.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
            {tReviews('ui.comparisonsHeading', { defaultValue: 'Buying guides' })}
          </h2>
          <div className="grid gap-3">
            {comparisons.map((c) => (
              <Link
                key={c.slug}
                to={langHref(`/reviews/compare/${c.slug}`, lang)}
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

      {/* ── About these reviews — independence + method, for search/AI ───── */}
      <section className="mt-4 border-t border-white/10 pt-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
          {tReviews('hub.about.heading', { defaultValue: 'About these reviews' })}
        </h2>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/60">
          <p>
            {tReviews('hub.about.p1', {
              defaultValue:
                'These are independent, criteria-based reviews of HRV trackers, wearables and recovery tools — each product scored on the same rubric (measurement accuracy, data access, app and ecosystem, comfort, value) rather than a vibe or a sponsorship. The scoring method is public, and the same axes apply to every device so scores are comparable across the catalogue.',
            })}
          </p>
          <p>
            {tReviews('hub.about.p2', {
              defaultValue:
                'We keep this independent on purpose. The links here are plain product links, not affiliate links, so a review has nothing to gain from steering you toward a purchase. And ONDA — our own app — is deliberately left out of the scored reviews entirely; when you want to see how ONDA stacks up against the alternatives, that lives separately in our labelled comparisons, never mixed into the independent scores.',
            })}
          </p>
          <p>
            {tReviews('hub.about.p3', {
              defaultValue:
                'Browse by category above for the round-up, individual reviews and head-to-head comparisons in one place, or read the scoring rubric first.',
            })}{' '}
            <Link to={langHref('/reviews/methodology', lang)} className="text-terminal-green hover:underline">
              {tReviews('hub.about.methodologyLink', { defaultValue: 'See the full methodology' })}
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
