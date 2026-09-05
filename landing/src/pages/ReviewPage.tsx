/**
 * /reviews/:slug — a single biohacking-tool review.
 *
 * Renders the editorial score, the per-criterion breakdown, pros/cons,
 * price snapshot, the markdown body and references. JSON-LD (Review +
 * itemReviewed Product) is injected at build time by meta-inject.ts.
 *
 * Body content is localised via the `reviews` i18n namespace
 * (bodies.<slug>.*), falling back to the English fields in the data file.
 */
import { useParams, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { NotFoundPage } from './NotFoundPage'
import { getReviewBySlug, getCriterion, getHeadToHeadsForProduct } from '../data/reviews'
import { langFromPath, langHref } from '../i18n'

export function ReviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const { t: tReviews } = useTranslation('reviews')
  const review = slug ? getReviewBySlug(slug) : undefined
  if (!review) return <NotFoundPage />

  // Translation helpers — fall back to the original EN field if no translation.
  const tField = (key: string, fallback: string): string =>
    tReviews(`bodies.${slug}.${key}`, { defaultValue: fallback }) as string
  const tList = (key: string, fallback: string[]): string[] => {
    const v = tReviews(`bodies.${slug}.${key}`, { returnObjects: true, defaultValue: fallback })
    return Array.isArray(v) ? (v as string[]) : fallback
  }
  const tVerdict = tField('verdict', review.verdict)
  const tSummary = tField('summary', review.summary)
  const tBestFor = tField('bestFor', review.bestFor)
  const tTestNote = tField('testNote', review.testNote)
  const tContent = tField('content', review.content)
  const tPros = tList('pros', review.pros)
  const tCons = tList('cons', review.cons)

  const related = (review.relatedSlugs ?? [])
    .map((s) => getReviewBySlug(s))
    .filter((r): r is NonNullable<typeof r> => !!r)

  // Head-to-head duels featuring this product — surfaced as their own rail
  // because users land on a review page often after a "X vs Y" search.
  const productHeadToHeads = getHeadToHeadsForProduct(review.slug)

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={lang === 'en' ? '/' : `/${lang}`} className="transition-colors hover:text-white/50">{tReviews('breadcrumb.home')}</Link>
        <span>/</span>
        <Link to={langHref(`/reviews`, lang)} className="transition-colors hover:text-white/50">{tReviews('breadcrumb.reviews')}</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{review.name}</span>
      </nav>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/40">
          {review.brand}
        </span>
        <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/40">
          {review.productType}
        </span>
        <span className="rounded-md border border-terminal-cyan/20 bg-terminal-cyan/5 px-3 py-0.5 font-mono text-[10px] text-terminal-cyan/80">
          {tReviews(`testStatus.${review.testStatus}`)}
        </span>
      </div>

      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
        {review.name} review
      </h1>
      <p className="mb-6 font-mono text-xs text-white/30">
        {tReviews('ui.updated')} {review.dateModified}
      </p>

      {/* Branded score card — og:image + Product.image + visible hero (6.5).
          Falls back to the generated card when no explicit product photo. */}
      <img
        src={review.image ?? `/images/reviews/${slug}.png`}
        alt={review.imageAlt ?? `${review.name} — ONDA review, scored ${review.overallScore.toFixed(1)}/10`}
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      {/* Score + verdict */}
      <div className="mb-8 flex items-start gap-5 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5">
        <div className="shrink-0 text-center">
          <div className="font-mono text-3xl font-bold text-terminal-green">
            {review.overallScore.toFixed(1)}
          </div>
          <div className="font-mono text-[10px] tracking-widest text-white/30">/ 10</div>
        </div>
        <div>
          <p className="mb-1 font-semibold text-white/90">{tVerdict}</p>
          <p className="font-mono text-xs text-white/40">{tBestFor}</p>
        </div>
      </div>

      <p id="review-summary" className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {tSummary}
      </p>
      <p className="mb-8 font-mono text-xs leading-relaxed text-white/40">
        <span className="text-white/60">{tReviews('ui.howWeTested')} </span>
        {tTestNote}
      </p>

      <a
        href={review.link}
        target="_blank"
        rel={
          review.linkType === 'affiliate'
            ? 'sponsored nofollow noopener noreferrer'
            : 'nofollow noopener noreferrer'
        }
        className="mb-3 inline-block rounded-lg border border-terminal-green/30 px-5 py-2 font-mono text-xs text-terminal-green transition-colors hover:bg-terminal-green/10"
      >
        {tReviews('ui.visitSite', { brand: review.brand })}
      </a>
      {review.linkType === 'affiliate' && (
        <p className="mb-10 font-mono text-[10px] text-white/30">
          {tReviews('ui.affiliateNote')}
        </p>
      )}
      {review.linkType !== 'affiliate' && <div className="mb-10" />}

      {/* Baseline cross-link (task 76): on tracker reviews, offer the free way to see your own data.
          Same intent as reading a $300-wearable review, and it passes equity to the new tool page. */}
      {review.category === 'hrv-wearable' && (
        <aside className="mb-10 rounded-xl border border-terminal-green/25 bg-terminal-green/[0.06] p-5">
          <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-terminal-green/80">
            Before you buy
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            You may already own the data. Our free{' '}
            <Link to={langHref('/tools/baseline', lang)} className="text-terminal-green underline decoration-terminal-green/40 underline-offset-2 hover:decoration-terminal-green">
              Apple Watch Baseline
            </Link>{' '}
            tool reads two weeks of your resting heart rate, HRV and breathing off your own Apple
            Health — the range, not one number — on your iPhone, with nothing uploaded.
          </p>
        </aside>
      )}

      {/* Criterion breakdown */}
      <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
        {tReviews('ui.scoreBreakdown')}
      </h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {review.scores.map((s) => {
          const criterion = getCriterion(review.category, s.criterionId)
          return (
            <div key={s.criterionId} className="py-4">
              <div className="mb-1 flex items-baseline justify-between gap-4">
                <h3 className="font-semibold">
                  {tReviews(`criteria.${s.criterionId}`, { defaultValue: criterion?.label ?? s.criterionId })}
                </h3>
                <span className="shrink-0 font-mono text-xs font-bold text-terminal-green">
                  {s.score.toFixed(1)}
                </span>
              </div>
              <div className="mb-2 h-1 w-full overflow-hidden rounded bg-white/5">
                <div
                  className="h-full rounded bg-terminal-green/60"
                  style={{ width: `${Math.max(0, Math.min(100, s.score * 10))}%` }}
                />
              </div>
              <p className="font-mono text-xs leading-relaxed text-white/50">
                {tReviews(`bodies.${slug}.scoreNotes.${s.criterionId}`, { defaultValue: s.note })}
              </p>
            </div>
          )
        })}
      </div>

      {/* Pros / cons */}
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/80">
            {tReviews('ui.pros')}
          </h2>
          <ul className="space-y-2">
            {tPros.map((p, i) => (
              <li key={i} className="font-mono text-xs leading-relaxed text-white/60">
                <span className="mr-2 text-terminal-green/60">+</span>{p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-rose-400/70">
            {tReviews('ui.cons')}
          </h2>
          <ul className="space-y-2">
            {tCons.map((c, i) => (
              <li key={i} className="font-mono text-xs leading-relaxed text-white/60">
                <span className="mr-2 text-rose-400/60">−</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {review.price && (
        <p className="mb-10 font-mono text-xs text-white/50">
          <span className="text-white/70">{tReviews('ui.price')} </span>
          ${review.price.usd}
          {review.price.note ? ` ${review.price.note}` : ''}
          <span className="text-white/30"> ({tReviews('ui.asOf')} {review.price.asOf})</span>
        </p>
      )}

      {tContent && (
        <article className="prose-onda mb-10">
          <Markdown
            components={{
              a: ({ href, children }) => {
                const ext = href?.startsWith('http')
                const cls =
                  'text-terminal-green underline decoration-terminal-green/30 underline-offset-2 transition-colors hover:text-terminal-green/80'
                return href && !ext && href.startsWith('/') ? (
                  <Link to={langHref(href, lang)} className={cls}>
                    {children}
                  </Link>
                ) : (
                  <a
                    href={href}
                    target={ext ? '_blank' : undefined}
                    rel={ext ? 'noopener noreferrer' : undefined}
                    className={cls}
                  >
                    {children}
                  </a>
                )
              },
            }}
          >
            {tContent}
          </Markdown>
        </article>
      )}

      {review.references && review.references.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-white/40">
            {tReviews('ui.references')}
          </h2>
          <ol className="list-decimal space-y-1 pl-5">
            {review.references.map((ref, i) => (
              <li key={i} className="font-mono text-xs leading-relaxed text-white/40">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terminal-cyan/60 hover:text-terminal-cyan"
                >
                  {ref.label}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}

      {productHeadToHeads.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
            {tReviews('ui.headToHeadHeading', { defaultValue: 'Compared head-to-head' })}
          </h2>
          <div className="grid gap-3">
            {productHeadToHeads.map((h) => {
              // Build the duel's list of products with the current review
              // pinned first, then the other 1 or 2 sides.
              const otherSlugs = [h.productASlug, h.productBSlug, h.productCSlug]
                .filter((s): s is string => !!s && s !== review.slug)
              const others = otherSlugs
                .map((s) => getReviewBySlug(s))
                .filter((r): r is NonNullable<typeof r> => !!r)
              if (others.length === 0) return null
              const names = [review.name, ...others.map((o) => o.name)]
              return (
                <Link
                  key={h.slug}
                  to={langHref(`/reviews/vs/${h.slug}`, lang)}
                  className="glass-card group flex items-center justify-between gap-4 rounded-lg p-4 transition-all hover:border-terminal-cyan/30"
                >
                  <span className="font-mono text-sm font-semibold text-white/80 transition-colors group-hover:text-terminal-cyan">
                    {names.map((n, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-white/35"> vs </span>}
                        {n}
                      </span>
                    ))}
                  </span>
                  <span className="font-mono text-xs text-white/30 transition-colors group-hover:text-terminal-cyan/60">→</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/80">
            {tReviews('ui.relatedReviews')}
          </h2>
          <div className="grid gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={langHref(`/reviews/${r.slug}`, lang)}
                className="glass-card group flex items-center justify-between gap-4 rounded-lg p-4 transition-all hover:border-terminal-green/20"
              >
                <span className="font-semibold transition-colors group-hover:text-terminal-green">
                  {r.name}
                </span>
                <span className="font-mono text-xs font-bold text-terminal-green">
                  {r.overallScore.toFixed(1)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-4">
        <Link
          to={langHref(`/reviews`, lang)}
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          {tReviews('ui.allReviews')}
        </Link>
      </div>
    </div>
  )
}
