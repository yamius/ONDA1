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
export { CRITERIA, CATEGORY_LABELS, REVIEW_CATEGORIES, getCriteria, getCriterion } from './criteria'

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
import withingsScanwatch from './withings-scanwatch'
import calm from './calm'
import headspace from './headspace'
import insightTimer from './insight-timer'
import wakingUp from './waking-up'
import balance from './balance'
import healthyMindsProgram from './healthy-minds-program'
import smilingMind from './smiling-mind'
import happierMeditation from './happier-meditation'
import medito from './medito'
import buddhify from './buddhify'
import sleepCycle from './sleep-cycle'
import sleepio from './sleepio'
import sleepscore from './sleepscore'
import sleepAsAndroid from './sleep-as-android'
import bettersleep from './bettersleep'
import pillow from './pillow'
import rise from './rise'
import pzizz from './pzizz'
import autosleep from './autosleep'
import endel from './endel'
import bestHrvTrackers2026 from './best-hrv-trackers-2026'
import bestMeditationApps2026 from './best-meditation-apps-2026'
import bestSleepApps2026 from './best-sleep-apps-2026'

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
  withingsScanwatch,
  insightTimer,
  healthyMindsProgram,
  headspace,
  calm,
  smilingMind,
  balance,
  wakingUp,
  happierMeditation,
  medito,
  buddhify,
  sleepio,
  sleepCycle,
  sleepscore,
  sleepAsAndroid,
  bettersleep,
  pillow,
  rise,
  pzizz,
  autosleep,
  endel,
]

/** All published comparison / round-up pages. */
export const comparisons: Comparison[] = [bestHrvTrackers2026, bestMeditationApps2026, bestSleepApps2026]

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
