/**
 * Head-to-head duels — pair-wise "X vs Y" comparisons of two or three
 * ToolReviews. Distinct from Comparison (which is a ≥3-product ranked
 * round-up). Lives at /reviews/vs/<slug> on the site.
 *
 * The exported `headToHeads` array is filtered by `publishOn` against the
 * current date: any entry with a publishOn in the future is excluded so
 * it does not appear in the hub, category, review-page rails, prerender
 * route list or any helper lookup until its rollout date.
 */
import type { HeadToHead } from '../types'

/** Current date (YYYY-MM-DD), captured once at module load. Used to filter
 *  date-gated duels out of `headToHeads` until their `publishOn` date. */
const TODAY = new Date().toISOString().slice(0, 10)
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
// Red light therapy (May 2026)
import joovvVsMitoRed from './joovv-solo-3-vs-mito-red-mitopro-1500'
import joovvVsPlatinumLed from './joovv-solo-3-vs-platinumled-biomax-600'
import mitoRedVsHooga from './mito-red-mitopro-1500-vs-hooga-hg500'
import gembaredVsJoovv from './gembared-vesta-vs-joovv-solo-3'
import platinumledVsBioLight from './platinumled-biomax-600-vs-biolight-pro-900'
import topThreePanels from './joovv-solo-3-vs-mito-red-mitopro-1500-vs-platinumled-biomax-600'
import threeValuePanels from './hooga-hg500-vs-bon-charge-red-light-panel-vs-infraredi-pro-1500'
// Three-way duels date-gated to 2026-06-04 — hidden until that date by
// the publishOn filter at the bottom of this file.
import ouraVsWhoopVsGarmin from './oura-ring-4-vs-whoop-5-0-vs-garmin-venu-4'
import polarVsWhoopVsGarmin from './polar-h10-vs-whoop-5-0-vs-garmin-venu-4'
import apolloVsNurosymVsSensate from './apollo-neuro-vs-nurosym-vs-sensate'
import pulsettoVsTruvagaVsHoolest from './pulsetto-vs-truvaga-350-vs-hoolest-verelief-prime'
import nurosymVsVagustimVsXen from './nurosym-vs-vagustim-vs-xen-by-neuvana'
import levelsVsZoeVsNutrisense from './levels-vs-zoe-vs-nutrisense'
import muse2VsFocusCalmVsMendi from './muse-2-vs-focuscalm-vs-mendi'
import headspaceVsWakingUpVsHealthyMinds from './headspace-vs-waking-up-vs-healthy-minds-program'
import sleepCycleVsSleepAsAndroidVsAutoSleep from './sleep-cycle-vs-sleep-as-android-vs-autosleep'
import endelVsPzizzVsBettersleep from './endel-vs-pzizz-vs-bettersleep'
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

/** The full registry — including any future-dated entries. Internal only. */
const ALL_HEAD_TO_HEADS: HeadToHead[] = [
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
  // Red light therapy
  joovvVsMitoRed,
  joovvVsPlatinumLed,
  mitoRedVsHooga,
  gembaredVsJoovv,
  platinumledVsBioLight,
  topThreePanels,
  threeValuePanels,
  // Date-gated to 2026-06-04 (all three-way duels)
  ouraVsWhoopVsGarmin,
  polarVsWhoopVsGarmin,
  apolloVsNurosymVsSensate,
  pulsettoVsTruvagaVsHoolest,
  nurosymVsVagustimVsXen,
  levelsVsZoeVsNutrisense,
  muse2VsFocusCalmVsMendi,
  headspaceVsWakingUpVsHealthyMinds,
  sleepCycleVsSleepAsAndroidVsAutoSleep,
  endelVsPzizzVsBettersleep,
]

/** Live head-to-head duels — date-gated entries are excluded until their
 *  `publishOn` date is reached. Consumers (hub, category and review pages,
 *  prerender route list, lookup helpers) all read from this filtered view
 *  so future-dated entries cannot leak into the live site. */
export const headToHeads: HeadToHead[] = ALL_HEAD_TO_HEADS.filter(
  (h) => !h.publishOn || h.publishOn <= TODAY,
)

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
