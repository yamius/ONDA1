/**
 * Every ToolReview with its overallScore COMPUTED (scoring.ts) and the list
 * ordered by rank within each category (overall, then the tie-break
 * criterion; stable for genuine ties). Category order follows the first
 * appearance below. Kept separate from index.ts so head-to-head/index.ts can
 * derive winners without a circular import.
 */
import type { ToolReview, ToolReviewInput, ReviewCategory } from './types'
import { withOverallScore, sortByRank } from './scoring'
import ouraRing4 from './oura-ring-4'
import ouraRing5 from './oura-ring-5'
import whoop5 from './whoop-5-0'
import appleWatchSeries11 from './apple-watch-series-11'
import appleWatchSeries12 from './apple-watch-series-12'
import appleWatchUltra4 from './apple-watch-ultra-4'
import polarH10 from './polar-h10'
import garminVenu4 from './garmin-venu-4'
import samsungGalaxyRing from './samsung-galaxy-ring'
import ultrahumanRingAir from './ultrahuman-ring-air'
import ultrahumanRingPro from './ultrahuman-ring-pro'
import amazfitHelioRing from './amazfit-helio-ring'
import ringconnGen3 from './ringconn-gen-3'
import circularRing2 from './circular-ring-2'
import lunaRing from './luna-ring'
import ringconnGen2 from './ringconn-gen-2'
import fitbitCharge6 from './fitbit-charge-6'
import fitbitAir from './fitbit-air'
import garminFenix8 from './garmin-fenix-8'
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
import eightSleepPod5 from './eight-sleep-pod-5'
import eightSleepPod6 from './eight-sleep-pod-6'
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
import qiCoil from './qi-coil'
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
// Massage guns (date-gated to 2026-07-20)
import theragunProPlus from './theragun-pro-plus'
import hypervolt2Pro from './hypervolt-2-pro'
import hypervolt3Pro from './hypervolt-3-pro'
import theragunElite from './theragun-elite'
import achedawayPro from './achedaway-pro'
import opoveM3 from './opove-m3-pro-2'
import ekrinB37 from './ekrin-b37'
import hypervoltGo2 from './hypervolt-go-2'
import bobAndBradQ2 from './bob-and-brad-q2-mini'
import renphoR3 from './renpho-r3'
import tolocoGun from './toloco-massage-gun'
// Air purifiers (date-gated to 2026-07-27)
import iqairHealthPro from './iqair-healthpro-plus'
import molekuleAirPro from './molekule-air-pro'
import dysonBigQuiet from './dyson-purifier-big-quiet'
import cowayAirmega400 from './coway-airmega-400'
import blueair7770 from './blueair-healthprotect-7770i'
import levoitCore600s from './levoit-core-600s'
import winix5500 from './winix-5500-2'
import cowayAp1512 from './coway-airmega-ap-1512hh'
import levoitCore300 from './levoit-core-300'
import honeywellHpa300 from './honeywell-hpa300'

/** Review modules (array order inside a category does not matter). */
const REVIEW_MODULES: ToolReviewInput[] = [
  ouraRing4,
  ouraRing5,
  whoop5,
  polarH10,
  garminVenu4,
  samsungGalaxyRing,
  ultrahumanRingAir,
  ultrahumanRingPro,
  amazfitHelioRing,
  ringconnGen3,
  circularRing2,
  lunaRing,
  appleWatchSeries11,
  appleWatchSeries12,
  appleWatchUltra4,
  ringconnGen2,
  fitbitCharge6,
  fitbitAir,
  garminFenix8,
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
  // Vagus nerve stimulators
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
  // Continuous glucose monitors
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
  // EEG / brain-training headsets
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
  // Red light therapy panels
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
  // Cold plunge
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
  // Saunas
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
  // Smart sleep climate All date-gated to 2026-06-15.
  eightSleepPod4,
  eightSleepPod5,
  eightSleepPod6,
  eightSleepPodCoverPro,
  chilipadDockPro,
  eightSleepPod3,
  chilipadCube,
  oolerSleepSystem,
  bedjet3,
  sleepNumberClimate360,
  tempurBreezePro,
  slumberCloudDryline,
  // PEMF devices All date-gated to 2026-06-22.
  bemerClassicEvo,
  healthyWaveMultiWave,
  qiCoil,
  pulseCentersXLPro,
  curatron3d,
  imrsPrime,
  magnawaveMini,
  omiFullBodyMat,
  earthpulse,
  resonaVibe,
  olylifeTera,
  higherDosePemf,
  // Breathwork apps All date-gated to 2026-06-29.
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
  // Red light face masks All date-gated to 2026-07-06.
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
  // Mouth tape & nasal breathing All date-gated to 2026-07-13.
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
  // Massage guns All date-gated to 2026-07-20.
  theragunProPlus,
  hypervolt2Pro,
  hypervolt3Pro,
  theragunElite,
  achedawayPro,
  opoveM3,
  ekrinB37,
  hypervoltGo2,
  bobAndBradQ2,
  renphoR3,
  tolocoGun,
  // Air purifiers All date-gated to 2026-07-27.
  iqairHealthPro,
  dysonBigQuiet,
  molekuleAirPro,
  cowayAirmega400,
  blueair7770,
  levoitCore600s,
  cowayAp1512,
  winix5500,
  honeywellHpa300,
  levoitCore300,
]

function rankWithinCategories(list: ToolReview[]): ToolReview[] {
  const order: ReviewCategory[] = []
  const byCat = new Map<ReviewCategory, ToolReview[]>()
  for (const r of list) {
    if (!byCat.has(r.category)) {
      byCat.set(r.category, [])
      order.push(r.category)
    }
    byCat.get(r.category)!.push(r)
  }
  return order.flatMap((c) => sortByRank(byCat.get(c)!))
}

/** Full registry — including date-gated future entries — scored and ranked. */
export const ALL_REVIEWS: ToolReview[] = rankWithinCategories(REVIEW_MODULES.map(withOverallScore))
