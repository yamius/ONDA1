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
  ReviewCategory,
  CriterionScore,
  ReviewReference,
  ReviewPrice,
  LinkType,
  TestStatus,
  Criterion,
} from './types'
export { CRITERIA, getCriteria, getCriterion } from './criteria'

import type { ToolReview, Comparison } from './types'
import ouraRing4 from './oura-ring-4'
import whoop5 from './whoop-5-0'
import appleWatchSeries11 from './apple-watch-series-11'
import polarH10 from './polar-h10'
import garminVenu4 from './garmin-venu-4'
import samsungGalaxyRing from './samsung-galaxy-ring'
import ultrahumanRingAir from './ultrahuman-ring-air'
import ringconnGen2 from './ringconn-gen-2'
import fitbitCharge6 from './fitbit-charge-6'
import bestHrvTrackers2026 from './best-hrv-trackers-2026'

/** All published product reviews. Ordered best-scored first for the hub grid. */
export const reviews: ToolReview[] = [
  ouraRing4,
  whoop5,
  polarH10,
  garminVenu4,
  samsungGalaxyRing,
  ultrahumanRingAir,
  appleWatchSeries11,
  ringconnGen2,
  fitbitCharge6,
]

/** All published comparison / round-up pages. */
export const comparisons: Comparison[] = [bestHrvTrackers2026]

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
    .map((p) => getReviewBySlug(p.reviewSlug))
    .filter((r): r is ToolReview => r !== undefined)
}
