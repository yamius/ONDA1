/**
 * /reviews/compare/:slug — a ranked comparison that composes several
 * ToolReviews into one round-up. The ranked picks and the comparison
 * table are the artifact AI answer engines extract for "best X" queries.
 * ItemList + FAQPage JSON-LD is injected at build time by meta-inject.ts.
 */
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { NotFoundPage } from './NotFoundPage'
import {
  getComparisonBySlug,
  getReviewsForComparison,
  getReviewBySlug,
  getCriteria,
} from '../data/reviews'

export function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>()
  const comparison = slug ? getComparisonBySlug(slug) : undefined
  if (!comparison) return <NotFoundPage />

  const tableReviews = getReviewsForComparison(comparison)
  const criteria = getCriteria(comparison.category)

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/reviews" className="transition-colors hover:text-white/50">Reviews</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{comparison.title}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ COMPARISON ]
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
        {comparison.title}
      </h1>
      <p className="mb-6 font-mono text-xs text-white/30">
        Updated {comparison.dateModified}
      </p>
      <p className="mb-12 font-mono text-sm leading-relaxed text-white/60">
        {comparison.intro}
      </p>

      {/* Ranked picks */}
      <section className="mb-12">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
          [ TOP_PICKS ]
        </h2>
        <div className="grid gap-3">
          {comparison.picks.map((pick, i) => {
            const r = getReviewBySlug(pick.reviewSlug)
            if (!r) return null
            return (
              <div
                key={pick.reviewSlug}
                className="glass-card rounded-lg p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-terminal-green">
                    #{i + 1}
                  </span>
                  <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-3 py-0.5 font-mono text-[10px] tracking-wider text-terminal-green">
                    {pick.award}
                  </span>
                </div>
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <Link
                    to={`/reviews/${r.slug}`}
                    className="font-semibold transition-colors hover:text-terminal-green"
                  >
                    {r.name}
                  </Link>
                  <span className="shrink-0 font-mono text-sm font-bold text-terminal-green">
                    {r.overallScore.toFixed(1)}
                    <span className="text-white/30"> / 10</span>
                  </span>
                </div>
                <p className="font-mono text-xs leading-relaxed text-white/50">
                  {pick.takeaway}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Comparison table */}
      {tableReviews.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
            [ COMPARISON_TABLE ]
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-left text-white/40">
                  <th scope="col" className="py-2 pr-4 font-semibold">Product</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Overall</th>
                  {criteria.map((c) => (
                    <th key={c.id} scope="col" className="px-3 py-2 font-semibold">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableReviews.map((r) => (
                  <tr key={r.slug} className="border-b border-white/5">
                    <th scope="row" className="py-3 pr-4 text-left font-semibold text-white/80">
                      <Link to={`/reviews/${r.slug}`} className="hover:text-terminal-green">
                        {r.name}
                      </Link>
                    </th>
                    <td className="px-3 py-3 font-bold text-terminal-green">
                      {r.overallScore.toFixed(1)}
                    </td>
                    {criteria.map((c) => {
                      const sc = r.scores.find((s) => s.criterionId === c.id)
                      return (
                        <td key={c.id} className="px-3 py-3 text-white/60">
                          {sc ? sc.score.toFixed(1) : '—'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Verdict */}
      <section className="mb-12 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5">
        <h2 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
          Verdict
        </h2>
        <p className="font-mono text-sm leading-relaxed text-white/70">
          {comparison.verdict}
        </p>
      </section>

      {comparison.content && (
        <article className="prose-onda mb-12">
          <Markdown>{comparison.content}</Markdown>
        </article>
      )}

      {comparison.faq.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
            [ FAQ ]
          </h2>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {comparison.faq.map((f, i) => (
              <div key={i} className="py-4">
                <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
                <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
              </div>
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
