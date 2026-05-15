/**
 * /reviews/:slug — a single biohacking-tool review.
 *
 * Renders the editorial score, the per-criterion breakdown, pros/cons,
 * price snapshot, the markdown body and references. JSON-LD (Review +
 * itemReviewed Product) is injected at build time by meta-inject.ts.
 */
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { NotFoundPage } from './NotFoundPage'
import { getReviewBySlug, getCriterion } from '../data/reviews'
import type { TestStatus } from '../data/reviews'

const TEST_STATUS_LABEL: Record<TestStatus, string> = {
  'hands-on': 'Hands-on tested',
  'evidence-based': 'Evidence-based assessment',
}

export function ReviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const review = slug ? getReviewBySlug(slug) : undefined
  if (!review) return <NotFoundPage />

  const related = (review.relatedSlugs ?? [])
    .map((s) => getReviewBySlug(s))
    .filter((r): r is NonNullable<typeof r> => !!r)

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/reviews" className="transition-colors hover:text-white/50">Reviews</Link>
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
          {TEST_STATUS_LABEL[review.testStatus]}
        </span>
      </div>

      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
        {review.name} review
      </h1>
      <p className="mb-6 font-mono text-xs text-white/30">
        Updated {review.dateModified}
      </p>

      {/* Score + verdict */}
      <div className="mb-8 flex items-start gap-5 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5">
        <div className="shrink-0 text-center">
          <div className="font-mono text-3xl font-bold text-terminal-green">
            {review.overallScore.toFixed(1)}
          </div>
          <div className="font-mono text-[10px] tracking-widest text-white/30">/ 10</div>
        </div>
        <div>
          <p className="mb-1 font-semibold text-white/90">{review.verdict}</p>
          <p className="font-mono text-xs text-white/40">{review.bestFor}</p>
        </div>
      </div>

      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {review.summary}
      </p>
      <p className="mb-8 font-mono text-xs leading-relaxed text-white/40">
        <span className="text-white/60">How we tested: </span>
        {review.testNote}
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
        Visit {review.brand} official site →
      </a>
      {review.linkType === 'affiliate' && (
        <p className="mb-10 font-mono text-[10px] text-white/30">
          Affiliate link — ONDA may earn a commission. It does not affect the score.
        </p>
      )}
      {review.linkType !== 'affiliate' && <div className="mb-10" />}

      {/* Criterion breakdown */}
      <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
        [ SCORE_BREAKDOWN ]
      </h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {review.scores.map((s) => {
          const criterion = getCriterion(review.category, s.criterionId)
          return (
            <div key={s.criterionId} className="py-4">
              <div className="mb-1 flex items-baseline justify-between gap-4">
                <h3 className="font-semibold">
                  {criterion?.label ?? s.criterionId}
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
              <p className="font-mono text-xs leading-relaxed text-white/50">{s.note}</p>
            </div>
          )
        })}
      </div>

      {/* Pros / cons */}
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/80">
            Pros
          </h2>
          <ul className="space-y-2">
            {review.pros.map((p, i) => (
              <li key={i} className="font-mono text-xs leading-relaxed text-white/60">
                <span className="mr-2 text-terminal-green/60">+</span>{p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-rose-400/70">
            Cons
          </h2>
          <ul className="space-y-2">
            {review.cons.map((c, i) => (
              <li key={i} className="font-mono text-xs leading-relaxed text-white/60">
                <span className="mr-2 text-rose-400/60">−</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {review.price && (
        <p className="mb-10 font-mono text-xs text-white/50">
          <span className="text-white/70">Price: </span>
          ${review.price.usd}
          {review.price.note ? ` ${review.price.note}` : ''}
          <span className="text-white/30"> (as of {review.price.asOf})</span>
        </p>
      )}

      {review.content && (
        <article className="prose-onda mb-10">
          <Markdown>{review.content}</Markdown>
        </article>
      )}

      {review.references && review.references.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-white/40">
            References
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

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/80">
            Related reviews
          </h2>
          <div className="grid gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/reviews/${r.slug}`}
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
          to="/reviews"
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← All reviews
        </Link>
      </div>
    </div>
  )
}
