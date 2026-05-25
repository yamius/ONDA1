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
import whoopVsPolarH10 from './whoop-5-0-vs-polar-h10'
import ringconnVsUltrahuman from './ringconn-gen-2-vs-ultrahuman-ring-air'
import appleWatchVsFitbit from './apple-watch-series-11-vs-fitbit-charge-6'
// CGM
import levelsVsNutrisense from './levels-vs-nutrisense'
import steloVsLingo from './stelo-vs-lingo'
import levelsVsUltrahumanM1 from './levels-vs-ultrahuman-m1'
import zoeVsLevels from './zoe-vs-levels'
import signosVsLevels from './signos-vs-levels'
import veriVsLevels from './veri-vs-levels'
// Vagus
import apolloNeuroVsPulsetto from './apollo-neuro-vs-pulsetto'
import nurosymVsPulsetto from './nurosym-vs-pulsetto'
import truvagaVsPulsetto from './truvaga-350-vs-pulsetto'
import sensateVsApollo from './sensate-vs-apollo-neuro'
import gammacoreVsNurosym from './gammacore-sapphire-cv-vs-nurosym'
import hoolestVsPulsetto from './hoolest-verelief-prime-vs-pulsetto'
// EEG
import museSAthenaVsMuse2 from './muse-s-athena-vs-muse-2'
import neurosityVsEmotiv from './neurosity-crown-vs-emotiv-insight-2'
import muse2VsFocuscalm from './muse-2-vs-focuscalm'
// Meditation
import headspaceVsCalm from './headspace-vs-calm'
import headspaceVsWakingUp from './headspace-vs-waking-up'
import calmVsInsightTimer from './calm-vs-insight-timer'
// Sleep
import sleepCycleVsSleepAsAndroid from './sleep-cycle-vs-sleep-as-android'
import sleepioVsPzizz from './sleepio-vs-pzizz'
import bettersleepVsSleepCycle from './bettersleep-vs-sleep-cycle'
// Three-way duels
import pulsettoVsNurosymVsApollo from './pulsetto-vs-nurosym-vs-apollo-neuro'
import ouraVsWhoopVsApple from './oura-ring-4-vs-whoop-5-0-vs-apple-watch-series-11'
import threeRings from './oura-ring-4-vs-ultrahuman-ring-air-vs-ringconn-gen-2'
import threeCgm from './levels-vs-nutrisense-vs-stelo'
import threeOtcCgm from './lingo-vs-stelo-vs-ultrahuman-m1'
import threeEeg from './muse-s-athena-vs-muse-2-vs-neurosity-crown'
import threeMeditation from './headspace-vs-calm-vs-insight-timer'
import threeVagusForms from './apollo-neuro-vs-sensate-vs-hoolest-verelief-prime'
import threeCervical from './gammacore-sapphire-cv-vs-truvaga-350-vs-pulsetto'
import threeSleep from './sleepio-vs-sleep-cycle-vs-pzizz'
// More two-way fillers
import ouraVsRingconn from './oura-ring-4-vs-ringconn-gen-2'
import nurosymVsVagustim from './nurosym-vs-vagustim'
// HRV (continued)
import polarH10VsGarmin from './polar-h10-vs-garmin-venu-4'
// CGM (continued)
import nutrisenseVsZoe from './nutrisense-vs-zoe'
// Vagus (continued)
import flowVsApollo from './flow-neuroscience-vs-apollo-neuro'
// EEG (continued)
import sensAiVsMuse from './sens-ai-vs-muse-s-athena'
import mendiVsMuse2 from './mendi-vs-muse-2'
// Meditation (continued)
import headspaceVsInsight from './headspace-vs-insight-timer'
import healthyMindsVsWakingUp from './healthy-minds-program-vs-waking-up'

/** All published head-to-head duels, in editorial order. */
export const headToHeads: HeadToHead[] = [
  // Three-way duels
  ouraVsWhoopVsApple,
  threeRings,
  pulsettoVsNurosymVsApollo,
  threeCervical,
  threeVagusForms,
  threeCgm,
  threeOtcCgm,
  threeEeg,
  threeMeditation,
  threeSleep,
  // HRV
  ouraRing4VsWhoop50,
  ouraVsAppleWatch,
  appleWatchVsGarminVenu4,
  whoop50VsGarminVenu4,
  ouraVsUltrahuman,
  ouraVsSamsungRing,
  whoopVsPolarH10,
  ringconnVsUltrahuman,
  appleWatchVsFitbit,
  polarH10VsGarmin,
  ouraVsRingconn,
  // CGM
  levelsVsNutrisense,
  steloVsLingo,
  levelsVsUltrahumanM1,
  zoeVsLevels,
  signosVsLevels,
  veriVsLevels,
  nutrisenseVsZoe,
  // Vagus
  apolloNeuroVsPulsetto,
  nurosymVsPulsetto,
  truvagaVsPulsetto,
  sensateVsApollo,
  gammacoreVsNurosym,
  hoolestVsPulsetto,
  flowVsApollo,
  nurosymVsVagustim,
  // EEG
  museSAthenaVsMuse2,
  neurosityVsEmotiv,
  muse2VsFocuscalm,
  sensAiVsMuse,
  mendiVsMuse2,
  // Meditation
  headspaceVsCalm,
  headspaceVsWakingUp,
  calmVsInsightTimer,
  headspaceVsInsight,
  healthyMindsVsWakingUp,
  // Sleep
  sleepCycleVsSleepAsAndroid,
  sleepioVsPzizz,
  bettersleepVsSleepCycle,
]

export function getHeadToHeadBySlug(slug: string): HeadToHead | undefined {
  return headToHeads.find((h) => h.slug === slug)
}

/** All head-to-heads that reference a given product slug as any of the
 *  two or three sides. */
export function getHeadToHeadsForProduct(productSlug: string): HeadToHead[] {
  return headToHeads.filter(
    (h) =>
      h.productASlug === productSlug ||
      h.productBSlug === productSlug ||
      h.productCSlug === productSlug,
  )
}
