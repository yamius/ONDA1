/**
 * Head-to-head duels — pair-wise "X vs Y" comparisons of two ToolReviews.
 * Distinct from Comparison (which is a ≥3-product ranked round-up). Lives
 * at /reviews/vs/<slug> on the site.
 */
import type { HeadToHead } from '../types'
import ouraRing4VsWhoop50 from './oura-ring-4-vs-whoop-5-0'
import ouraVsAppleWatch from './oura-ring-4-vs-apple-watch-series-11'
import appleWatchVsGarminVenu4 from './apple-watch-series-11-vs-garmin-venu-4'
import levelsVsNutrisense from './levels-vs-nutrisense'
import steloVsLingo from './stelo-vs-lingo'
import museSAthenaVsMuse2 from './muse-s-athena-vs-muse-2'
import apolloNeuroVsPulsetto from './apollo-neuro-vs-pulsetto'
import nurosymVsPulsetto from './nurosym-vs-pulsetto'
import headspaceVsCalm from './headspace-vs-calm'

/** All published head-to-head duels, in editorial order. */
export const headToHeads: HeadToHead[] = [
  ouraRing4VsWhoop50,
  ouraVsAppleWatch,
  appleWatchVsGarminVenu4,
  levelsVsNutrisense,
  steloVsLingo,
  museSAthenaVsMuse2,
  apolloNeuroVsPulsetto,
  nurosymVsPulsetto,
  headspaceVsCalm,
]

export function getHeadToHeadBySlug(slug: string): HeadToHead | undefined {
  return headToHeads.find((h) => h.slug === slug)
}

/** All head-to-heads that reference a given product slug as either side. */
export function getHeadToHeadsForProduct(productSlug: string): HeadToHead[] {
  return headToHeads.filter(
    (h) => h.productASlug === productSlug || h.productBSlug === productSlug,
  )
}
