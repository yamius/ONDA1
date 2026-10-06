/**
 * Overall review score — computed, never hand-typed.
 *
 *   overall = round1( Σ score × weight  +  editorialAdjustment.value )
 *
 * Weights come from criteria.ts (they sum to 1 per category). Rounding is
 * to one decimal, half up, with an epsilon so binary float error
 * (e.g. 7.25 stored as 7.2499999…) cannot round the wrong way.
 *
 * Ranking rule (category pages, round-ups, head-to-heads):
 *   1. higher overall wins;
 *   2. if equal, the higher score on the category's tie-break criterion
 *      (its evidence / scientific-grounding criterion — TIE_BREAK_CRITERION);
 *   3. if still equal, it is a tie (shared rank, no single winner).
 *
 * scripts/check-review-scores.ts enforces all of this at build time.
 */
import type { CriterionScore, ReviewCategory, ToolReview, ToolReviewInput } from './types'
import { CRITERIA, TIE_BREAK_CRITERION } from './criteria'

/** Largest allowed |editorialAdjustment.value|. */
export const MAX_EDITORIAL_ADJUSTMENT = 0.3

/** Round to one decimal, half up, robust to float error. */
export function roundHalfUp1(x: number): number {
  return Math.round(x * 10 + 1e-9) / 10
}

/** Unrounded weighted mean of the criterion scores. Throws if a criterion
 *  of the category is missing or an unknown criterion id is present. */
export function weightedMean(category: ReviewCategory, scores: Pick<CriterionScore, 'criterionId' | 'score'>[], slug = '?'): number {
  const criteria = CRITERIA[category]
  if (!criteria) throw new Error(`[review-score] ${slug}: unknown category "${category}"`)
  const byId = new Map(scores.map((s) => [s.criterionId, s.score]))
  for (const s of scores) {
    if (!criteria.some((c) => c.id === s.criterionId)) {
      throw new Error(`[review-score] ${slug}: unknown criterion "${s.criterionId}" for ${category}`)
    }
  }
  let sum = 0
  for (const c of criteria) {
    const v = byId.get(c.id)
    if (typeof v !== 'number' || Number.isNaN(v)) {
      throw new Error(`[review-score] ${slug}: missing criterion "${c.id}" (${category})`)
    }
    sum += v * c.weight
  }
  return sum
}

/** The published overall score: weighted mean + editorial adjustment, rounded. */
export function computeOverallScore(r: Pick<ToolReviewInput, 'slug' | 'category' | 'scores' | 'editorialAdjustment'>): number {
  const adj = r.editorialAdjustment?.value ?? 0
  return roundHalfUp1(weightedMean(r.category, r.scores, r.slug) + adj)
}

/** Attach the computed overallScore to a review module. */
export function withOverallScore(r: ToolReviewInput): ToolReview {
  return { ...r, overallScore: computeOverallScore(r) }
}

type Rankable = Pick<ToolReview, 'category' | 'overallScore'> & { scores: Pick<CriterionScore, 'criterionId' | 'score'>[] }

function tieBreakScore(r: Rankable): number {
  const id = TIE_BREAK_CRITERION[r.category]
  return r.scores.find((s) => s.criterionId === id)?.score ?? 0
}

/** Sort comparator: best first. 0 = a genuine tie under the ranking rule. */
export function compareReviews(a: Rankable, b: Rankable): number {
  if (a.overallScore !== b.overallScore) return b.overallScore - a.overallScore
  return tieBreakScore(b) - tieBreakScore(a)
}

/** Stable best-first sort (ties keep their input order). */
export function sortByRank<T extends Rankable>(list: readonly T[]): T[] {
  return list
    .map((r, i) => ({ r, i }))
    .sort((x, y) => compareReviews(x.r, y.r) || x.i - y.i)
    .map((x) => x.r)
}

/** Competition ranks ("1, 2, 2, 4") for an already-sorted list, plus a
 *  tied flag for entries sharing their rank with another. */
export function rankPositions<T extends Rankable>(sorted: readonly T[]): { rank: number; tied: boolean }[] {
  const ranks: number[] = []
  sorted.forEach((r, i) => {
    ranks.push(i > 0 && compareReviews(sorted[i - 1], r) === 0 ? ranks[i - 1] : i + 1)
  })
  return ranks.map((rank) => ({ rank, tied: ranks.filter((x) => x === rank).length > 1 }))
}

/** Head-to-head winner under the ranking rule: the single best product's
 *  slug, or null when the top spot is tied. */
export function scoreWinnerSlug<T extends Rankable & { slug: string }>(products: readonly T[]): string | null {
  const sorted = sortByRank(products)
  if (sorted.length < 2) return sorted[0]?.slug ?? null
  return compareReviews(sorted[0], sorted[1]) === 0 ? null : sorted[0].slug
}
