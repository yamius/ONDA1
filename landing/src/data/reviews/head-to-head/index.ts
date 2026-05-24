/**
 * Head-to-head duels — pair-wise "X vs Y" comparisons of two ToolReviews.
 * Distinct from Comparison (which is a ≥3-product ranked round-up). Lives
 * at /reviews/vs/<slug> on the site.
 */
import type { HeadToHead } from '../types'
// HRV
import ouraRing4VsWhoop50 from './oura-ring-4-vs-whoop-5-0'
import ouraVsAppleWatch from './oura-ring-4-vs-apple-watch-series-11'
import appleWatchVsGarminVenu4 from './apple-watch-series-11-vs-garmin-venu-4'
import whoop50VsGarminVenu4 from './whoop-5-0-vs-garmin-venu-4'
import ouraVsUltrahuman from './oura-ring-4-vs-ultrahuman-ring-air'
import ouraVsSamsungRing from './oura-ring-4-vs-samsung-galaxy-ring'
// CGM
import levelsVsNutrisense from './levels-vs-nutrisense'
import steloVsLingo from './stelo-vs-lingo'
import levelsVsUltrahumanM1 from './levels-vs-ultrahuman-m1'
import zoeVsLevels from './zoe-vs-levels'
// Vagus
import apolloNeuroVsPulsetto from './apollo-neuro-vs-pulsetto'
import nurosymVsPulsetto from './nurosym-vs-pulsetto'
import truvagaVsPulsetto from './truvaga-350-vs-pulsetto'
import sensateVsApollo from './sensate-vs-apollo-neuro'
// EEG
import museSAthenaVsMuse2 from './muse-s-athena-vs-muse-2'
import neurosityVsEmotiv from './neurosity-crown-vs-emotiv-insight-2'
// Meditation
import headspaceVsCalm from './headspace-vs-calm'
import headspaceVsWakingUp from './headspace-vs-waking-up'
// Sleep
import sleepCycleVsSleepAsAndroid from './sleep-cycle-vs-sleep-as-android'

/** All published head-to-head duels, in editorial order. */
export const headToHeads: HeadToHead[] = [
  // HRV
  ouraRing4VsWhoop50,
  ouraVsAppleWatch,
  appleWatchVsGarminVenu4,
  whoop50VsGarminVenu4,
  ouraVsUltrahuman,
  ouraVsSamsungRing,
  // CGM
  levelsVsNutrisense,
  steloVsLingo,
  levelsVsUltrahumanM1,
  zoeVsLevels,
  // Vagus
  apolloNeuroVsPulsetto,
  nurosymVsPulsetto,
  truvagaVsPulsetto,
  sensateVsApollo,
  // EEG
  museSAthenaVsMuse2,
  neurosityVsEmotiv,
  // Meditation
  headspaceVsCalm,
  headspaceVsWakingUp,
  // Sleep
  sleepCycleVsSleepAsAndroid,
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
