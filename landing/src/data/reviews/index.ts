/**
 * Registry for the /reviews hub. Mirrors src/data/articles/index.ts:
 * each review and comparison lives in its own file and is registered
 * in the arrays below.
 *
 * Empty until Phase A content lands — page components, routing and
 * JSON-LD all read from these arrays, so an empty registry simply
 * renders an empty hub without breaking the build.
 */
export type {
  ToolReview,
  Comparison,
  ComparisonPick,
  ComparisonFAQ,
  HeadToHead,
  HeadToHeadAxis,
  ReviewCategory,
  CriterionScore,
  ReviewReference,
  ReviewPrice,
  LinkType,
  TestStatus,
  Criterion,
} from './types'
export { headToHeads, getHeadToHeadBySlug, getHeadToHeadsForProduct } from './head-to-head'
export {
  CRITERIA,
  CATEGORY_LABELS,
  REVIEW_CATEGORIES,
  CATEGORY_URL_SLUGS,
  CATEGORY_URL_SLUG_SET,
  getCriteria,
  getCriterion,
  getCategoryByUrlSlug,
} from './criteria'

import type { ToolReview, Comparison, ReviewCategory, RuleAward, RuleAwardSpec } from './types'
import { PRACTICALLY_EQUAL_GAP } from './scoring'
import { REVIEW_CATEGORIES } from './criteria'
import bestHrvTrackers2026 from './best-hrv-trackers-2026'
import bestMeditationApps2026 from './best-meditation-apps-2026'
import bestSleepApps2026 from './best-sleep-apps-2026'
import bestVagusNerveStimulators2026 from './best-vagus-nerve-stimulators-2026'
import bestCgmForBiohackers2026 from './best-cgm-for-biohackers-2026'
import bestEegHeadsets2026 from './best-eeg-headsets-2026'
import bestRedLightPanels2026 from './best-red-light-therapy-panels-2026'
import bestColdPlunge2026 from './best-cold-plunge-2026'
import bestInfraredSauna2026 from './best-infrared-sauna-2026'
import bestSmartSleepClimate2026 from './best-smart-sleep-climate-2026'
import bestPemfDevices2026 from './best-pemf-devices-2026'
import bestBreathworkApps2026 from './best-breathwork-apps-2026'
import bestRedLightFaceMasks2026 from './best-red-light-face-masks-2026'
import bestMouthTapeNasalBreathing2026 from './best-mouth-tape-nasal-breathing-2026'
import bestMassageGuns2026 from './best-massage-guns-2026'
import bestAirPurifiers2026 from './best-air-purifiers-2026'

/** Current date captured once at module load. Used to filter date-gated
 *  reviews and comparisons out of the live registry until their publishOn
 *  date is reached. Mirrors the head-to-head filter pattern. */
const TODAY = new Date().toISOString().slice(0, 10)

import { ALL_REVIEWS } from './all-reviews'
import { resolveScoresDeep } from './score-text'
import { sortByRank } from './scoring'
export { ALL_REVIEWS }
export { ALL_REVIEWS_RAW } from './all-reviews'
export {
  computeOverallScore,
  weightedMean,
  roundHalfUp1,
  compareReviews,
  sortByRank,
  rankPositions,
  scoreWinnerSlug,
  scoreComparison,
  PRACTICALLY_EQUAL_GAP,
  MAX_EDITORIAL_ADJUSTMENT,
} from './scoring'
export { TIE_BREAK_CRITERION } from './criteria'
export type { ToolReviewInput, EditorialAdjustment } from './types'

const REVIEW_BY_SLUG_ALL = new Map(ALL_REVIEWS.map((r) => [r.slug, r]))

/** Round-up picks ordered by computed rank (overall → tie-break criterion →
 *  stable for genuine ties). The array order in the comparison file is NOT
 *  the ranking. Picks without a review keep their place at the end. */
const DEFAULT_RULE_AWARDS: RuleAwardSpec[] = [
  { key: 'best-overall', label: 'Best overall', score: 'overall' },
  { key: 'best-value', label: 'Best value', score: 'value' },
]
/** Score-based awards are computed (task 089): a round-up opts in by naming the award on any pick
 *  (the hand label is removed) or via c.ruleAwards; holders = every pick within 0.1 of the best score. */
const awardBase = (a: string) => a.replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase()
function withRuleAwards(c: Comparison): Comparison {
  const specs = [
    ...DEFAULT_RULE_AWARDS.filter((s) => c.picks.some((p) => awardBase(p.award) === s.label.toLowerCase())),
    ...(c.ruleAwards ?? []),
  ]
  if (!specs.length) return c
  const picks = c.picks.map((p) => ({ ...p, award: specs.some((s) => s.label.toLowerCase() === awardBase(p.award)) ? '' : p.award, ruleAwards: [] as RuleAward[] }))
  for (const s of specs) {
    const scored = picks
      .filter((p) => !p.comparisonOnly && !s.exclude?.includes(p.reviewSlug))
      .map((p) => {
        const r = REVIEW_BY_SLUG_ALL.get(p.reviewSlug)
        return { p, v: !r ? undefined : s.score === 'overall' ? r.overallScore : r.scores.find((x) => x.criterionId === s.score)?.score }
      })
      .filter((x): x is { p: (typeof picks)[number]; v: number } => x.v !== undefined)
    if (!scored.length) continue
    const max = Math.max(...scored.map((x) => x.v))
    const holders = scored.filter((x) => max - x.v <= PRACTICALLY_EQUAL_GAP + 1e-9)
    for (const h of holders) h.p.ruleAwards.push({ key: s.key, label: s.label, practicallyEqual: holders.length > 1 })
  }
  return { ...c, picks: picks.map(({ ruleAwards, ...p }) => (ruleAwards.length ? { ...p, ruleAwards } : p)) }
}

function rankComparison(input: Comparison): Comparison {
  const c = withRuleAwards(input)
  const competing = c.picks.filter((p) => !p.comparisonOnly)
  const withReview = competing.filter((p) => REVIEW_BY_SLUG_ALL.has(p.reviewSlug))
  const without = competing.filter((p) => !REVIEW_BY_SLUG_ALL.has(p.reviewSlug))
  const ranked = sortByRank(withReview.map((p) => ({ ...REVIEW_BY_SLUG_ALL.get(p.reviewSlug)!, pick: p }))).map((x) => x.pick)
  // Comparison-only picks (e.g. a prescription implant) sit after the ranked
  // list and never take part in ranking or awards.
  return { ...c, picks: [...ranked, ...without, ...c.picks.filter((p) => p.comparisonOnly)] }
}

/** Live product reviews — date-gated entries are excluded until their
 *  publishOn date is reached. */
export const reviews: ToolReview[] = ALL_REVIEWS.filter(
  (r) => !r.publishOn || r.publishOn <= TODAY,
)

/** Full registry of comparisons — including date-gated future entries. */
export const ALL_COMPARISONS_RAW: Comparison[] = [
  bestHrvTrackers2026,
  bestMeditationApps2026,
  bestSleepApps2026,
  bestVagusNerveStimulators2026,
  bestCgmForBiohackers2026,
  bestEegHeadsets2026,
  bestRedLightPanels2026,
  bestColdPlunge2026,
  bestInfraredSauna2026,
  bestSmartSleepClimate2026,
  bestPemfDevices2026,
  bestBreathworkApps2026,
  bestRedLightFaceMasks2026,
  bestMouthTapeNasalBreathing2026,
  bestMassageGuns2026,
  bestAirPurifiers2026,
].map(rankComparison)
export const ALL_COMPARISONS: Comparison[] = ALL_COMPARISONS_RAW.map((c) => resolveScoresDeep(c, `round-up ${c.slug}`))

/** Live round-up comparisons — date-gated entries excluded until their
 *  publishOn date is reached. */
export const comparisons: Comparison[] = ALL_COMPARISONS.filter(
  (c) => !c.publishOn || c.publishOn <= TODAY,
)

/** Categories with at least one live review or comparison. Use this for
 *  category grids and cross-links so we never link to a date-gated category
 *  whose landing page isn't prerendered yet (it would 404 until its drip
 *  date). Order follows the canonical REVIEW_CATEGORIES list. */
const LIVE_CATEGORY_SET = new Set<ReviewCategory>([
  ...reviews.map((r) => r.category),
  ...comparisons.map((c) => c.category),
])
export const LIVE_REVIEW_CATEGORIES: ReviewCategory[] = REVIEW_CATEGORIES.filter((c) =>
  LIVE_CATEGORY_SET.has(c),
)

export function getReviewBySlug(slug: string): ToolReview | undefined {
  return reviews.find((r) => r.slug === slug)
}

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug)
}

/** Reviews referenced by a comparison, in pick (ranking) order. Picks whose
 *  reviewSlug has no matching review are dropped. */
export function getReviewsForComparison(comparison: Comparison): ToolReview[] {
  return comparison.picks
    .filter((p) => !p.comparisonOnly)
    .map((p) => getReviewBySlug(p.reviewSlug))
    .filter((r): r is ToolReview => r !== undefined)
}
