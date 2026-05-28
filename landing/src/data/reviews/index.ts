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
// Red light therapy panels (May 2026)
import joovvSolo3 from './joovv-solo-3'
import mitoRedMitoPro1500 from './mito-red-mitopro-1500'
import platinumledBiomax600 from './platinumled-biomax-600'
import gembaredVesta from './gembared-vesta'
import rubylxLyraPro from './rubylx-lyra-pro'
import infraredi from './infraredi-pro-1500'
import bioLightPro900 from './biolight-pro-900'
import hoogaHg500 from './hooga-hg500'
import bonCharge from './bon-charge-red-light-panel'
import kineonMovePlus from './kineon-move-plus'
// EEG / brain-training headsets (May 2026)
import museSAthena from './muse-s-athena'
import muse2 from './muse-2'
import neurosityCrown from './neurosity-crown'
import emotivInsight2 from './emotiv-insight-2'
import sensAi from './sens-ai'
import myndlift from './myndlift'
import mendi from './mendi'
import focuscalm from './focuscalm'
import flowNeuroscience from './flow-neuroscience'
import neuroskyMindwaveMobile2 from './neurosky-mindwave-mobile-2'
// Continuous glucose monitors (May 2026)
import levels from './levels'
import nutrisense from './nutrisense'
import zoe from './zoe'
import stelo from './stelo'
import ultrahumanM1 from './ultrahuman-m1'
import signos from './signos'
import veri from './veri'
import lingo from './lingo'
import helloInside from './hello-inside'
import supersapiens from './supersapiens'
// Vagus nerve stimulators (May 2026)
import nurosym from './nurosym'
import gammacoreSapphireCv from './gammacore-sapphire-cv'
import truvaga350 from './truvaga-350'
import apolloNeuro from './apollo-neuro'
import vagustim from './vagustim'
import pulsetto from './pulsetto'
import hoolestVeReliefPrime from './hoolest-verelief-prime'
import sensate from './sensate'
import xenByNeuvana from './xen-by-neuvana'
import livanovaVnsTherapy from './livanova-vns-therapy'
// Cold plunge (May 2026)
import plunge from './plunge'
import edgeTub from './edge-tub'
import iceBarrel500 from './ice-barrel-500'
import coldPod from './cold-pod'
import inergizeColdTub from './inergize-cold-tub'
import coldture from './coldture'
import morozkoForge from './morozko-forge'
import renuTherapyColdStoic from './renu-therapy-cold-stoic'
import blueCubeColdPlunge from './bluecube-cold-plunge'
import penguinChillers from './penguin-chillers'
// Smart sleep climate (date-gated to 2026-06-15)
import eightSleepPod4 from './eight-sleep-pod-4'
import eightSleepPodCoverPro from './eight-sleep-pod-cover-pro'
import eightSleepPod3 from './eight-sleep-pod-3'
import chilipadDockPro from './chilipad-dock-pro'
import chilipadCube from './chilipad-cube'
import bedjet3 from './bedjet-3'
import oolerSleepSystem from './ooler-sleep-system'
import sleepNumberClimate360 from './sleep-number-climate360'
import tempurBreezePro from './tempur-breeze-pro'
import slumberCloudDryline from './slumber-cloud-dryline'
// Sauna (May 2026)
import sunlightenMpulse from './sunlighten-mpulse'
import clearlightSanctuary2 from './clearlight-sanctuary-2'
import higherdoseBlanketV4 from './higherdose-blanket-v4'
import saunaspaceFaraday from './saunaspace-faraday'
import therasageTheraSaunaPersonal from './therasage-thera-sauna-personal'
import sunHomeEquinox from './sun-home-equinox'
import jnhLifestylesJoyous from './jnh-lifestyles-joyous'
import almostHeavenSalem from './almost-heaven-salem'
import relaxSaunaPortable from './relax-sauna-portable'
import finnleoHallmark from './finnleo-hallmark'
// PEMF devices (date-gated to 2026-06-22)
import bemerClassicEvo from './bemer-classic-evo'
import healthyWaveMultiWave from './healthy-wave-multi-wave'
import pulseCentersXLPro from './pulse-centers-pulse-xl-pro'
import curatron3d from './curatron-3d'
import imrsPrime from './imrs-prime'
import omiFullBodyMat from './omi-full-body-mat'
import earthpulse from './earthpulse-sleep-on-command'
import resonaVibe from './resona-health-vibe'
import olylifeTera from './olylife-tera-p90-plus'
import higherDosePemf from './higherdose-pemf-mat'
import magnawaveMini from './magnawave-mini'
// Breathwork apps (date-gated to 2026-06-29)
import breathwrk from './breathwrk'
import othership from './othership'
import somaBreath from './soma-breath'
import wimHofMethodApp from './wim-hof-method-app'
import openApp from './open-app'
import pauseBreathwork from './pause-breathwork'
import inhale from './inhale-by-aero-health'
import pranaBreath from './prana-breath'
import ibreathe from './ibreathe'
import breatheToRelax from './breathe-to-relax'
// Red light face masks (date-gated to 2026-07-06)
import omniluxContourFace from './omnilux-contour-face'
import currentbodySeries2 from './currentbody-series-2'
import drDennisGross from './dr-dennis-gross-spectralite'
import lumaraViso from './lumara-viso'
import therafaceMask from './theraface-mask'
import higherDoseFaceMask from './higherdose-red-light-face-mask'
import lightstim from './lightstim-for-wrinkles'
import jovsDpl from './jovs-dpl-photofacial-mask'
import solawave from './solawave-wand-4-in-1'
import sharkCryoglow from './shark-cryoglow'
// Mouth tape & nasal breathing (date-gated to 2026-07-13)
import hostageTape from './hostage-tape'
import somnifix from './somnifix'
import dreamRecovery from './dream-recovery-mouth-tape'
import intakeBreathing from './intake-breathing'
import muteNasal from './mute-nasal-dilator'
import breatheRight from './breathe-right-original'
import nexcareSurgical from './nexcare-surgical-tape'
import ayoSleepTape from './ayo-sleep-tape'
import somnifit from './somnifit-sleep-strips'
import theTapeCo from './the-tape-co'
import sleepRightStrips from './sleep-strips-by-sleepright'
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

/** Current date captured once at module load. Used to filter date-gated
 *  reviews and comparisons out of the live registry until their publishOn
 *  date is reached. Mirrors the head-to-head filter pattern. */
const TODAY = new Date().toISOString().slice(0, 10)

/** Full registry — including date-gated future entries. Internal only. */
const ALL_REVIEWS: ToolReview[] = [
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
  // Vagus nerve stimulators — ordered by overallScore.
  nurosym,
  gammacoreSapphireCv,
  livanovaVnsTherapy,
  truvaga350,
  apolloNeuro,
  pulsetto,
  vagustim,
  hoolestVeReliefPrime,
  sensate,
  xenByNeuvana,
  // Continuous glucose monitors — ordered by overallScore.
  levels,
  nutrisense,
  zoe,
  stelo,
  ultrahumanM1,
  signos,
  veri,
  lingo,
  helloInside,
  supersapiens,
  // EEG / brain-training headsets — ordered by overallScore.
  museSAthena,
  muse2,
  neurosityCrown,
  emotivInsight2,
  sensAi,
  myndlift,
  mendi,
  focuscalm,
  flowNeuroscience,
  neuroskyMindwaveMobile2,
  // Red light therapy panels — ordered by overallScore.
  joovvSolo3,
  mitoRedMitoPro1500,
  platinumledBiomax600,
  gembaredVesta,
  rubylxLyraPro,
  infraredi,
  bioLightPro900,
  hoogaHg500,
  bonCharge,
  kineonMovePlus,
  // Cold plunge — ordered by overallScore.
  plunge,
  coldture,
  edgeTub,
  morozkoForge,
  renuTherapyColdStoic,
  blueCubeColdPlunge,
  penguinChillers,
  inergizeColdTub,
  iceBarrel500,
  coldPod,
  // Saunas — ordered by overallScore.
  sunlightenMpulse,
  clearlightSanctuary2,
  saunaspaceFaraday,
  finnleoHallmark,
  sunHomeEquinox,
  almostHeavenSalem,
  higherdoseBlanketV4,
  therasageTheraSaunaPersonal,
  jnhLifestylesJoyous,
  relaxSaunaPortable,
  // Smart sleep climate — ordered by overallScore. All date-gated to 2026-06-15.
  eightSleepPod4,
  eightSleepPodCoverPro,
  chilipadDockPro,
  eightSleepPod3,
  chilipadCube,
  oolerSleepSystem,
  bedjet3,
  sleepNumberClimate360,
  tempurBreezePro,
  slumberCloudDryline,
  // PEMF devices — ordered by overallScore. All date-gated to 2026-06-22.
  bemerClassicEvo,
  healthyWaveMultiWave,
  pulseCentersXLPro,
  curatron3d,
  imrsPrime,
  magnawaveMini,
  omiFullBodyMat,
  earthpulse,
  resonaVibe,
  olylifeTera,
  higherDosePemf,
  // Breathwork apps — ordered by overallScore. All date-gated to 2026-06-29.
  breathwrk,
  othership,
  somaBreath,
  wimHofMethodApp,
  openApp,
  pauseBreathwork,
  inhale,
  pranaBreath,
  ibreathe,
  breatheToRelax,
  // Red light face masks — ordered by overallScore. All date-gated to 2026-07-06.
  omniluxContourFace,
  currentbodySeries2,
  drDennisGross,
  lumaraViso,
  therafaceMask,
  higherDoseFaceMask,
  lightstim,
  jovsDpl,
  solawave,
  sharkCryoglow,
  // Mouth tape & nasal breathing — ordered by overallScore. All date-gated to 2026-07-13.
  hostageTape,
  somnifix,
  dreamRecovery,
  intakeBreathing,
  muteNasal,
  breatheRight,
  nexcareSurgical,
  ayoSleepTape,
  theTapeCo,
  somnifit,
  sleepRightStrips,
]

/** Live product reviews — date-gated entries are excluded until their
 *  publishOn date is reached. */
export const reviews: ToolReview[] = ALL_REVIEWS.filter(
  (r) => !r.publishOn || r.publishOn <= TODAY,
)

/** Full registry of comparisons — including date-gated future entries. */
const ALL_COMPARISONS: Comparison[] = [
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
]

/** Live round-up comparisons — date-gated entries excluded until their
 *  publishOn date is reached. */
export const comparisons: Comparison[] = ALL_COMPARISONS.filter(
  (c) => !c.publishOn || c.publishOn <= TODAY,
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
    .map((p) => getReviewBySlug(p.reviewSlug))
    .filter((r): r is ToolReview => r !== undefined)
}
