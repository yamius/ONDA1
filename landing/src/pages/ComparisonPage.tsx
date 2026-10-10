/**
 * /reviews/compare/:slug — a ranked comparison that composes several
 * ToolReviews into one round-up. The ranked picks and the comparison
 * table are the artifact AI answer engines extract for "best X" queries.
 * ItemList + FAQPage JSON-LD is injected at build time by meta-inject.ts.
 *
 * Body content is localised via the `reviews` i18n namespace
 * (comparisons.<slug>.*), falling back to the English data file.
 */
import { OtherLanguages } from '../components/OtherLanguages'
import AppStoreCTA, { ctaVariantForCategory } from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import FastBreathingSafetyBlock from '../components/FastBreathingSafetyBlock'
import RedLightSafetyBlock from '../components/RedLightSafetyBlock'
import SaunaSafetyBlock from '../components/SaunaSafetyBlock'
import PemfSafetyBlock from '../components/PemfSafetyBlock'
import HeadsetMeasuresNote from '../components/HeadsetMeasuresNote'
import { FAST_BREATHING_COMPARISON_SLUGS } from '../data/fast-breathing-safety-i18n'
import { isRedLightComparison } from '../data/red-light-safety-i18n'
import { isSaunaComparison } from '../data/sauna-safety-i18n'
import { isPemfComparison } from '../data/pemf-safety-i18n'
import { isHeadsetComparison } from '../data/headset-measures-i18n'
import ColdSafetyBlock from '../components/ColdSafetyBlock'
import MouthTapeSafetyBlock, { MOUTH_TAPE_SAFETY_CATEGORY } from '../components/MouthTapeSafetyBlock'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { NotFoundPage } from './NotFoundPage'
import { readComparison, getReviewsForComparison, getReviewBySlug } from '../lib/review-content'
import { getCriteria } from '../data/reviews/criteria'
import { rankPositions, scoreComparison } from '../data/reviews/scoring'
import { langFromPath, langHref, homePathFor } from '../i18n'

export function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>()
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const { t: tReviews } = useTranslation('reviews')
  // Full text of THIS comparison only (browser: fetched on demand; prerender: registry).
  const comparison = slug ? readComparison(slug, lang) : undefined
  if (!comparison) return <NotFoundPage />

  const tField = (key: string, fallback: string): string =>
    tReviews(`comparisons.${slug}.${key}`, { defaultValue: fallback }) as string
  const tTitle = tField('title', comparison.title)
  const tIntro = tField('intro', comparison.intro)
  const tVerdict = tField('verdict', comparison.verdict)
  const tContent = tField('content', comparison.content)

  const tableReviews = getReviewsForComparison(comparison)
  const criteria = getCriteria(comparison.category)
  // Picks arrive ranked (overall → tie-break criterion). Genuine ties share a
  // rank and are shown as "#2=" (scoring.ts rankPositions).
  const rankedPickReviews = comparison.picks.filter((p) => !p.comparisonOnly).map((p) => getReviewBySlug(p.reviewSlug)).filter((r): r is NonNullable<typeof r> => !!r)
  const rankPos = rankPositions(rankedPickReviews)
  const rankBySlug = new Map(rankedPickReviews.map((r, i) => [r.slug, rankPos[i]]))
  // Top two within PRACTICALLY_EQUAL_GAP (0.1): awards stay, but the top of
  // the list says the leaders are practically equal by ONDA score.
  const topScores = scoreComparison(rankedPickReviews)
  const topEqualLine = topScores.practicallyEqual && topScores.ranked.length > 1
    ? (tReviews('ui.practicallyEqual', {
        scores: `${topScores.ranked[0].name} ${topScores.ranked[0].overallScore.toFixed(1)}${tReviews('ui.scoresAnd', { defaultValue: ' and ' }) as string}${topScores.ranked[1].name} ${topScores.ranked[1].overallScore.toFixed(1)}`,
        defaultValue: 'Practically equal by ONDA score ({{scores}})',
      }) as string)
    : null

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 md:px-6">
      <nav
        className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30"
        aria-label="Breadcrumb"
      >
        <Link to={homePathFor(lang)} className="transition-colors hover:text-white/50">{tReviews('breadcrumb.home')}</Link>
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
      {comparison.category === 'cold-plunge' && <ColdSafetyBlock lang={lang} />}
      {comparison.category === MOUTH_TAPE_SAFETY_CATEGORY && <MouthTapeSafetyBlock lang={lang} variant="tape" />}
      {FAST_BREATHING_COMPARISON_SLUGS.has(comparison.slug) && <FastBreathingSafetyBlock lang={lang} />}
      {isRedLightComparison(comparison.slug, comparison.category) && <RedLightSafetyBlock lang={lang} />}
      {isSaunaComparison(comparison.slug, comparison.category) && <SaunaSafetyBlock lang={lang} />}
      {isPemfComparison(comparison.slug, comparison.category) && <PemfSafetyBlock lang={lang} />}
      {isHeadsetComparison(comparison.slug, comparison.category) && <HeadsetMeasuresNote lang={lang} />}
      {/* EN: answer-first summary built from the ranked picks — the direct
          answer to "what is the best …?" before the hero image (GEO). */}
      {lang === 'en' && (() => {
        // The top pick is the "Best overall" award holder (it stays with the
        // former leader when the new #1 leads by ≤ 0.1); otherwise #1.
        const competing = comparison.picks.filter((p) => !p.comparisonOnly)
        const bestOverall = competing.find((p) => /^best overall/i.test(p.award))
        const top = bestOverall ?? competing[0]
        // No "Best overall" and #1 is a genuine tie (shared rank): say so
        // instead of naming one of the tied products as the top pick.
        const tiedTop = !bestOverall && rankPositions(rankedPickReviews)[0]?.tied
          ? rankedPickReviews.filter((_, i) => rankPositions(rankedPickReviews)[i].rank === 1)
          : null
        const rest = competing.filter((p) => p !== top && p.award && !(tiedTop && tiedTop.some((r) => r.slug === p.reviewSlug)))
        const lc = (t: string) => (/^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t)
        const topReview = top && getReviewBySlug(top.reviewSlug)
        if (!topReview) return null
        const others = rest.slice(0, 3)
          .map((p) => ({ p, r: getReviewBySlug(p.reviewSlug) }))
          .filter((x) => x.r)
          .map((x) => `${x.r!.name} (${lc(x.p.award.replace(/\s*\([^)]*\)/g, ''))})`)
        const list = others.length > 1 ? `${others.slice(0, -1).join(', ')} and ${others.at(-1)}` : others[0]
        const scope = comparison.title.replace(/\s*\((\d{4})\)\s*$/, ' of $1').replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase())
        return (
          <div className="mb-8 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5">
            <p id="comparison-answer" className="text-[15px] leading-relaxed text-white/85">
              {tiedTop ? (
                <>
                  Our top picks among the {scope} are tied:{' '}
                  <span className="font-semibold text-white/95">{tiedTop.map((r) => r.name).join(' and ')}</span>{' '}
                  ({topReview.overallScore.toFixed(1)}/10 each).
                </>
              ) : (
                <>
                  Our top pick among the {scope} is{' '}
                  <span className="font-semibold text-white/95">{topReview.name}</span>{' '}
                  ({topReview.overallScore.toFixed(1)}/10): {lc(top.takeaway)}
                </>
              )}
              {list ? ` Other winners: ${list}.` : ''}
            </p>
          </div>
        )
      })()}
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
        {topEqualLine && (
          <p className="mb-4 font-mono text-xs text-white/60" data-testid="top-practically-equal">
            {topEqualLine}
          </p>
        )}
        {topEqualLine && comparison.topEqualWhoSuits && (
          <p className="mb-4 font-mono text-xs text-white/60" data-testid="top-who-suits">
            {tField('topEqualWhoSuits', comparison.topEqualWhoSuits)}
          </p>
        )}
        <div className="grid gap-3">
          {comparison.picks.filter((p) => !p.comparisonOnly).map((pick) => {
            const r = getReviewBySlug(pick.reviewSlug)
            if (!r) return null
            const pos = rankBySlug.get(r.slug)
            return (
              <div
                key={pick.reviewSlug}
                className="glass-card rounded-lg p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-terminal-green">
                    #{pos?.rank}{pos?.tied ? '=' : ''}
                  </span>
                  {pick.award && (
                    <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-3 py-0.5 font-mono text-[10px] tracking-wider text-terminal-green">
                      {tReviews(`comparisons.${slug}.picks.${pick.reviewSlug}.award`, { defaultValue: pick.award })}
                    </span>
                  )}
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
        {/* Comparison-only picks (e.g. a prescription implant): shown for
            reference, never ranked or awarded. */}
        {comparison.picks.filter((p) => p.comparisonOnly).map((pick) => {
          const r = getReviewBySlug(pick.reviewSlug)
          if (!r) return null
          return (
            <div key={pick.reviewSlug} className="mt-6" data-testid="comparison-only">
              <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-white/50">
                {tReviews(`comparisons.${slug}.picks.${pick.reviewSlug}.comparisonOnly`, { defaultValue: pick.comparisonOnly })}
              </h3>
              <div className="glass-card rounded-lg border border-dashed border-white/10 p-5">
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <Link to={langHref(`/reviews/${r.slug}`, lang)} className="font-semibold transition-colors hover:text-terminal-green">
                    {r.name}
                  </Link>
                  <span className="shrink-0 font-mono text-sm font-bold text-white/60">
                    {r.overallScore.toFixed(1)}
                    <span className="text-white/30"> / 10</span>
                  </span>
                </div>
                <p className="font-mono text-xs leading-relaxed text-white/50">
                  {tReviews(`comparisons.${slug}.picks.${pick.reviewSlug}.takeaway`, { defaultValue: pick.takeaway })}
                </p>
              </div>
            </div>
          )
        })}
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

      <OtherLanguages className="mb-8" />
      <AppStoreCTA ct={storeCt('rvhub', `cmp_${comparison.slug}`, lang)} variant={ctaVariantForCategory(comparison.category)} lang={lang} />

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
