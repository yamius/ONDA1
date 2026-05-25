/**
 * /reviews/vs/<slug> — head-to-head duel between two ToolReviews.
 * Distinct from /reviews/compare/<slug> (≥3-product round-ups) and from
 * /reviews/<category> (per-category landing pages). Each page is a
 * pair-wise "X vs Y" comparison aimed at the high-volume search keyword.
 */
import { useLocation, useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import {
  getHeadToHeadBySlug,
  getReviewBySlug,
  getComparisonBySlug,
} from '../data/reviews'
import { langFromPath } from '../i18n'
import { NotFoundPage } from './NotFoundPage'

export function HeadToHeadPage() {
  const { slug } = useParams<{ slug: string }>()
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const { t: tReviews } = useTranslation('reviews')

  const h2h = slug ? getHeadToHeadBySlug(slug) : undefined
  if (!h2h) return <NotFoundPage />

  const a = getReviewBySlug(h2h.productASlug)
  const b = getReviewBySlug(h2h.productBSlug)
  const c = h2h.productCSlug ? getReviewBySlug(h2h.productCSlug) : undefined
  if (!a || !b) return <NotFoundPage />
  if (h2h.productCSlug && !c) return <NotFoundPage />

  // Either a 2-product duel or a 3-product duel. The page renders 2 or 3
  // columns based on `products.length`; the axis rows render the winning
  // side's name (or "Tie") regardless of arity.
  const products = c ? [a, b, c] : [a, b]
  const colsClass = products.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'

  const winner = products.find((p) => p.slug === h2h.winnerSlug) ?? null
  const related = h2h.relatedComparisonSlug ? getComparisonBySlug(h2h.relatedComparisonSlug) : undefined

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={lang === 'en' ? '/' : `/${lang}`} className="transition-colors hover:text-white/50">
          {tReviews('breadcrumb.home', { defaultValue: 'Home' })}
        </Link>
        <span>/</span>
        <Link to={`${langPrefix}/reviews`} className="transition-colors hover:text-white/50">
          {tReviews('breadcrumb.reviews', { defaultValue: 'Reviews' })}
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          {products.map((p) => p.name).join(' vs ')}
        </span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ HEAD-TO-HEAD ]
      </div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">{h2h.title}</h1>
      <p id="article-intro" className="mb-8 font-mono text-sm leading-relaxed text-white/55">
        {h2h.intro}
      </p>

      {/* Verdict card — the single quotable answer to "which one". */}
      <section className="mb-10 rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-6">
        <p className="mb-2 font-mono text-xs tracking-widest text-terminal-green/80">
          {winner ? `WINNER: ${winner.name}` : 'VERDICT: TIE'}
        </p>
        <p className="text-sm leading-relaxed text-white/85">{h2h.verdict}</p>
      </section>

      {/* Product cards — scores side by side. Renders 2 or 3 columns
          depending on whether the duel includes a third product. */}
      <section className={`mb-10 grid gap-4 ${colsClass}`}>
        {products.map((p) => (
          <Link
            key={p.slug}
            to={`${langPrefix}/reviews/${p.slug}`}
            className="glass-card group rounded-xl p-5 transition-all hover:border-terminal-green/20"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/30">
                {p.brand}
              </span>
              <span className="font-mono text-sm font-bold text-terminal-green">
                {p.overallScore.toFixed(1)}
                <span className="text-white/30"> / 10</span>
              </span>
            </div>
            <h3 className="mb-1 text-lg font-semibold transition-colors group-hover:text-terminal-green">
              {p.name}
            </h3>
            <p className="mb-3 font-mono text-[11px] text-white/35">{p.productType}</p>
            <p className="font-mono text-xs leading-relaxed text-white/55">{p.verdict}</p>
          </Link>
        ))}
      </section>

      {/* Per-axis breakdown — the head-to-head rows. */}
      <section className="mb-10">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
          {tReviews('ui.headToHeadBreakdownHeading', { defaultValue: 'Head-to-head breakdown' })}
        </h2>
        <ul className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
          {h2h.axes.map((axis) => {
            const winnerName =
              axis.winner === 'a'
                ? a.name
                : axis.winner === 'b'
                  ? b.name
                  : axis.winner === 'c' && c
                    ? c.name
                    : 'Tie'
            const winnerColor =
              axis.winner === 'tie'
                ? 'text-white/40'
                : 'text-terminal-green'
            return (
              <li key={axis.name} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-white/80">
                    {axis.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{axis.note}</p>
                </div>
                <span className={`font-mono text-xs uppercase tracking-wider ${winnerColor}`}>
                  {winnerName}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* "Choose X if…" callouts — 2 or 3 columns depending on duel arity. */}
      <section className={`mb-10 grid gap-4 ${colsClass}`}>
        {(
          [
            [a, h2h.bestForA],
            [b, h2h.bestForB],
            ...(c && h2h.bestForC ? [[c, h2h.bestForC] as const] : []),
          ] as ReadonlyArray<readonly [typeof a, string]>
        ).map(([p, line]) => (
          <div key={p.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-terminal-cyan/70">
              Choose {p.name}
            </p>
            <p className="text-sm leading-relaxed text-white/75">{line}</p>
          </div>
        ))}
      </section>

      {/* Extended editorial verdict. */}
      <article className="prose-onda mb-10">
        <Markdown>{h2h.content}</Markdown>
      </article>

      {/* FAQ — also emitted as FAQPage JSON-LD by meta-inject. */}
      {h2h.faq.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
            {tReviews('ui.faqHeading', { defaultValue: 'Common questions' })}
          </h2>
          <div className="grid gap-3">
            {h2h.faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-white/10 bg-white/[0.02] p-5"
              >
                <summary className="cursor-pointer font-mono text-sm font-semibold text-white/85">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related && (
        <section className="border-t border-white/5 pt-8">
          <p className="mb-3 font-mono text-xs tracking-widest text-white/30">
            {tReviews('ui.seeFullRanking', { defaultValue: 'See the full ranking' })}
          </p>
          <Link
            to={`${langPrefix}/reviews/compare/${related.slug}`}
            className="glass-card group flex items-start justify-between gap-4 rounded-lg p-4 transition-all hover:border-terminal-green/20"
          >
            <div className="min-w-0">
              <h3 className="font-semibold transition-colors group-hover:text-terminal-green">
                {related.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-white/40 line-clamp-2">
                {related.description}
              </p>
            </div>
            <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">→</span>
          </Link>
        </section>
      )}
    </div>
  )
}
