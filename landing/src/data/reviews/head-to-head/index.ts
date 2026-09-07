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
// Cold plunge (May 2026)
import plungeVsEdge from './plunge-vs-edge-tub'
import plungeVsColdture from './plunge-vs-coldture'
import plungeVsIceBarrel from './plunge-vs-ice-barrel-500'
import morozkoVsPlunge from './morozko-forge-vs-plunge'
import threePremiumPlunge from './plunge-vs-coldture-vs-renu-therapy-cold-stoic'
import threeBudgetPlunge from './ice-barrel-500-vs-cold-pod-vs-inergize-cold-tub'
// Sauna (May 2026)
import sunlightenVsClearlight from './sunlighten-mpulse-vs-clearlight-sanctuary-2'
import higherdoseVsTherasage from './higherdose-blanket-v4-vs-therasage-thera-sauna-personal'
import saunaspaceVsSunlighten from './saunaspace-faraday-vs-sunlighten-mpulse'
import finnleoVsAlmostHeaven from './finnleo-hallmark-vs-almost-heaven-salem'
import threePremiumSauna from './sunlighten-vs-clearlight-vs-saunaspace'
import irVsTraditional from './sunlighten-vs-finnleo-vs-almost-heaven'
// PEMF (date-gated to 2026-06-22)
import bemerVsHealthyWave from './bemer-classic-evo-vs-healthy-wave-multi-wave'
import healthyWaveVsQiCoil from './healthy-wave-multi-wave-vs-qi-coil'
import whoopVsUltrahuman from './whoop-5-0-vs-ultrahuman-ring-air'
import hv3ProVsTheragunProPlus from './hypervolt-3-pro-vs-theragun-pro-plus'
import hv3ProVsHv2Pro from './hypervolt-3-pro-vs-hypervolt-2-pro'
import hv3ProVsTheragunElite from './hypervolt-3-pro-vs-theragun-elite'
import hv3ProVsAchedaway from './hypervolt-3-pro-vs-achedaway-pro'
import ouraRing5VsRing4 from './oura-ring-5-vs-oura-ring-4'
import ouraRing5VsWhoop from './oura-ring-5-vs-whoop-5-0'
import ouraRing5VsAppleWatch11 from './oura-ring-5-vs-apple-watch-series-11'
import ouraRing5VsUltrahuman from './oura-ring-5-vs-ultrahuman-ring-air'
import ringProVsOura5 from './ultrahuman-ring-pro-vs-oura-ring-5'
import ringProVsSamsung from './ultrahuman-ring-pro-vs-samsung-galaxy-ring'
import ringProVsRingconn from './ultrahuman-ring-pro-vs-ringconn-gen-2'
import ringProVsRingAir from './ultrahuman-ring-pro-vs-ultrahuman-ring-air'
import helioVsRingconn from './amazfit-helio-ring-vs-ringconn-gen-2'
import helioVsOura4 from './amazfit-helio-ring-vs-oura-ring-4'
import helioVsSamsung from './amazfit-helio-ring-vs-samsung-galaxy-ring'
import pod4VsPod5 from './eight-sleep-pod-4-vs-eight-sleep-pod-5'
import pod5VsChilipad from './eight-sleep-pod-5-vs-chilipad-dock-pro'
import pod5VsClimate360 from './eight-sleep-pod-5-vs-sleep-number-climate360'
import pod5VsBedjet from './eight-sleep-pod-5-vs-bedjet-3'
import ultrahumanVsSamsungRing from './ultrahuman-ring-air-vs-samsung-galaxy-ring'
import ouraVsFitbitCharge6 from './oura-ring-4-vs-fitbit-charge-6'
import plungeVsColdPod from './plunge-vs-cold-pod'
import bemerVsPulseCenters from './bemer-classic-evo-vs-pulse-centers-pulse-xl-pro'
import healthyWaveVsHigherDose from './healthy-wave-multi-wave-vs-higherdose-pemf-mat'
import imrsVsOmi from './imrs-prime-vs-omi-full-body-mat'
import resonaVsOlylife from './resona-health-vibe-vs-olylife-tera-p90-plus'
import bemerVsHealthyWaveVsPulse from './bemer-classic-evo-vs-healthy-wave-multi-wave-vs-pulse-centers-pulse-xl-pro'
// Breathwork apps (date-gated to 2026-06-29)
import breathwrkVsOthership from './breathwrk-vs-othership'
import breathwrkVsSoma from './breathwrk-vs-soma-breath'
import othershipVsOpen from './othership-vs-open-app'
import wimHofVsSoma from './wim-hof-method-app-vs-soma-breath'
import ibreatheVsB2r from './ibreathe-vs-breathe-to-relax'
import breathwrkVsOthershipVsWhm from './breathwrk-vs-othership-vs-wim-hof-method-app'
// Red light face masks (date-gated to 2026-07-06)
import omniluxVsCurrentbody from './omnilux-contour-face-vs-currentbody-series-2'
import omniluxVsGross from './omnilux-contour-face-vs-dr-dennis-gross-spectralite'
import currentbodyVsHigherDose from './currentbody-series-2-vs-higherdose-red-light-face-mask'
import therafaceVsHigherDose from './theraface-mask-vs-higherdose-red-light-face-mask'
import lightstimVsSolawave from './lightstim-for-wrinkles-vs-solawave-wand-4-in-1'
import omniluxVsCurrentbodyVsGross from './omnilux-contour-face-vs-currentbody-series-2-vs-dr-dennis-gross-spectralite'
// Mouth tape & nasal breathing (date-gated to 2026-07-13)
import hostageVsSomnifix from './hostage-tape-vs-somnifix'
import hostageVsDream from './hostage-tape-vs-dream-recovery-mouth-tape'
import intakeVsMute from './intake-breathing-vs-mute-nasal-dilator'
import intakeVsBreatheRight from './intake-breathing-vs-breathe-right-original'
import hostageVsIntake from './hostage-tape-vs-intake-breathing'
import hostageVsSomnifixVsIntake from './hostage-tape-vs-somnifix-vs-intake-breathing'
// Massage guns (date-gated to 2026-07-20)
import theragunVsHypervolt from './theragun-pro-plus-vs-hypervolt-2-pro'
import proPlusVsElite from './theragun-pro-plus-vs-theragun-elite'
import eliteVsHypervolt from './theragun-elite-vs-hypervolt-2-pro'
import bobVsRenpho from './bob-and-brad-q2-mini-vs-renpho-r3'
import goVsQ2 from './hypervolt-go-2-vs-bob-and-brad-q2-mini'
import theragunVsHypervoltVsAchedaway from './theragun-pro-plus-vs-hypervolt-2-pro-vs-achedaway-pro'
// Air purifiers (date-gated to 2026-07-27)
import iqairVsMolekule from './iqair-healthpro-plus-vs-molekule-air-pro'
import cowayVsBlueair from './coway-airmega-400-vs-blueair-healthprotect-7770i'
import levoitVsWinix from './levoit-core-600s-vs-winix-5500-2'
import cowayApVsLevoit300 from './coway-airmega-ap-1512hh-vs-levoit-core-300'
import dysonVsIqair from './dyson-purifier-big-quiet-vs-iqair-healthpro-plus'
import iqairVsMolekuleVsDyson from './iqair-healthpro-plus-vs-molekule-air-pro-vs-dyson-purifier-big-quiet'
// Sleep climate (date-gated to 2026-06-15)
import eightSleepVsChilipad from './eight-sleep-pod-4-vs-chilipad-dock-pro'
import pod4VsCoverPro from './eight-sleep-pod-4-vs-eight-sleep-pod-cover-pro'
import chilipadVsBedjet from './chilipad-dock-pro-vs-bedjet-3'
import dockProVsCube from './chilipad-dock-pro-vs-chilipad-cube'
import pod3VsCoverPro from './eight-sleep-pod-3-vs-eight-sleep-pod-cover-pro'
import eightSleepVsChilipadVsBedjet from './eight-sleep-pod-4-vs-chilipad-dock-pro-vs-bedjet-3'
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
  // Cold plunge (live)
  plungeVsEdge,
  plungeVsColdture,
  plungeVsIceBarrel,
  morozkoVsPlunge,
  threePremiumPlunge,
  threeBudgetPlunge,
  // Sauna (live)
  sunlightenVsClearlight,
  saunaspaceVsSunlighten,
  higherdoseVsTherasage,
  finnleoVsAlmostHeaven,
  threePremiumSauna,
  irVsTraditional,
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
  // Sleep climate (date-gated to 2026-06-15)
  eightSleepVsChilipad,
  pod4VsCoverPro,
  chilipadVsBedjet,
  dockProVsCube,
  pod3VsCoverPro,
  eightSleepVsChilipadVsBedjet,
  // PEMF (date-gated to 2026-06-22)
  bemerVsHealthyWave,
  healthyWaveVsQiCoil,
  whoopVsUltrahuman,
  hv3ProVsTheragunProPlus,
  hv3ProVsHv2Pro,
  hv3ProVsTheragunElite,
  hv3ProVsAchedaway,
  ouraRing5VsRing4,
  ouraRing5VsWhoop,
  ouraRing5VsAppleWatch11,
  ouraRing5VsUltrahuman,
  ringProVsOura5,
  ringProVsSamsung,
  ringProVsRingconn,
  ringProVsRingAir,
  helioVsRingconn,
  helioVsOura4,
  helioVsSamsung,
  pod4VsPod5,
  pod5VsChilipad,
  pod5VsClimate360,
  pod5VsBedjet,
  ultrahumanVsSamsungRing,
  ouraVsFitbitCharge6,
  plungeVsColdPod,
  bemerVsPulseCenters,
  healthyWaveVsHigherDose,
  imrsVsOmi,
  resonaVsOlylife,
  bemerVsHealthyWaveVsPulse,
  // Breathwork apps (date-gated to 2026-06-29)
  breathwrkVsOthership,
  breathwrkVsSoma,
  othershipVsOpen,
  wimHofVsSoma,
  ibreatheVsB2r,
  breathwrkVsOthershipVsWhm,
  // Red light face masks (date-gated to 2026-07-06)
  omniluxVsCurrentbody,
  omniluxVsGross,
  currentbodyVsHigherDose,
  therafaceVsHigherDose,
  lightstimVsSolawave,
  omniluxVsCurrentbodyVsGross,
  // Mouth tape & nasal breathing (date-gated to 2026-07-13)
  hostageVsSomnifix,
  hostageVsDream,
  intakeVsMute,
  intakeVsBreatheRight,
  hostageVsIntake,
  hostageVsSomnifixVsIntake,
  // Massage guns (date-gated to 2026-07-20)
  theragunVsHypervolt,
  proPlusVsElite,
  eliteVsHypervolt,
  bobVsRenpho,
  goVsQ2,
  theragunVsHypervoltVsAchedaway,
  // Air purifiers (date-gated to 2026-07-27)
  iqairVsMolekule,
  cowayVsBlueair,
  levoitVsWinix,
  cowayApVsLevoit300,
  dysonVsIqair,
  iqairVsMolekuleVsDyson,
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
