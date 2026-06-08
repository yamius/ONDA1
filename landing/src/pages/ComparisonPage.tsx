/**
 * /reviews/compare/:slug — a ranked comparison that composes several
 * ToolReviews into one round-up. The ranked picks and the comparison
 * table are the artifact AI answer engines extract for "best X" queries.
 * ItemList + FAQPage JSON-LD is injected at build time by meta-inject.ts.
 *
 * Body content is localised via the `reviews` i18n namespace
 * (comparisons.<slug>.*), falling back to the English data file.
 */
import { useParams, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { NotFoundPage } from './NotFoundPage'
import {
  getComparisonBySlug,
  getReviewsForComparison,
  getReviewBySlug,
  getCriteria,
} from '../data/reviews'
import { langFromPath, langHref } from '../i18n'

export function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>()
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const { t: tReviews } = useTranslation('reviews')
  const comparison = slug ? getComparisonBySlug(slug) : undefined
  if (!comparison) return <NotFoundPage />

  const tField = (key: string, fallback: string): string =>
    tReviews(`comparisons.${slug}.${key}`, { defaultValue: fallback }) as string
  const tTitle = tField('title', comparison.title)
  const tIntro = tField('intro', comparison.intro)
  const tVerdict = tField('verdict', comparison.verdict)
  const tContent = tField('content', comparison.content)

  const tableReviews = getReviewsForComparison(comparison)
  const criteria = getCriteria(comparison.category)

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={lang === 'en' ? '/' : `/${lang}`} className="transition-colors hover:text-white/50">{tReviews('breadcrumb.home')}</Link>
        <span>/</span>
        <Link to={langHref(`/reviews`, lang)} className="transition-colors hover:text-white/50">{tReviews('breadcrumb.reviews')}</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{tTitle}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        {tReviews('ui.comparisonTag')}
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
        {tTitle}
      </h1>
      <p className="mb-6 font-mono text-xs text-white/30">
        {tReviews('ui.updated')} {comparison.dateModified}
      </p>
      {/* Branded round-up card — og:image + visible hero (roadmap 6.5). */}
      <img
        src={`/images/reviews/${slug}.png`}
        alt={`${comparison.title} — ONDA editorial ranking`}
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />
      <p className="mb-12 font-mono text-sm leading-relaxed text-white/60">
        {tIntro}
      </p>

      {/* Ranked picks */}
      <section className="mb-12">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-green/90">
          {tReviews('ui.topPicks')}
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
                    {tReviews(`comparisons.${slug}.picks.${pick.reviewSlug}.award`, { defaultValue: pick.award })}
                  </span>
                </div>
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <Link
                    to={langHref(`/reviews/${r.slug}`, lang)}
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
                  {tReviews(`comparisons.${slug}.picks.${pick.reviewSlug}.takeaway`, { defaultValue: pick.takeaway })}
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
            {tReviews('ui.comparisonTable')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-left text-white/40">
                  <th scope="col" className="py-2 pr-4 font-semibold">{tReviews('ui.product')}</th>
                  <th scope="col" className="px-3 py-2 font-semibold">{tReviews('ui.overall')}</th>
                  {criteria.map((c) => (
                    <th key={c.id} scope="col" className="px-3 py-2 font-semibold">
                      {tReviews(`criteria.${c.id}`, { defaultValue: c.label })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableReviews.map((r) => (
                  <tr key={r.slug} className="border-b border-white/5">
                    <th scope="row" className="py-3 pr-4 text-left font-semibold text-white/80">
                      <Link to={langHref(`/reviews/${r.slug}`, lang)} className="hover:text-terminal-green">
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
          {tReviews('ui.verdict')}
        </h2>
        <p className="font-mono text-sm leading-relaxed text-white/70">
          {tVerdict}
        </p>
      </section>

      {tContent && (
        <article className="prose-onda mb-12">
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

      {comparison.faq.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-terminal-cyan/80">
            {tReviews('ui.faq')}
          </h2>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {comparison.faq.map((f, i) => (
              <div key={i} className="py-4">
                <h3 className="mb-1 font-semibold text-white/90">
                  {tReviews(`comparisons.${slug}.faq.${i}.q`, { defaultValue: f.q })}
                </h3>
                <p className="font-mono text-xs leading-relaxed text-white/50">
                  {tReviews(`comparisons.${slug}.faq.${i}.a`, { defaultValue: f.a })}
                </p>
              </div>
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
