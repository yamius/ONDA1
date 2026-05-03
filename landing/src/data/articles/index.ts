/**
 * Articles for /articles section. SEO-focused long-form content.
 */
export type { Article } from './types'
import type { Article } from './types'
import vagusArticle from './vagus-nerve-master-key'
import dopamineArticle from './dopamine-architecture-mastering-desire'
import dopamineStackingArticle from './dopamine-stacking-preventing-circuit-overload'
import circadianArticle from './circadian-reset-mastering-light'
import metabolicArticle from './metabolic-flexibility-dual-fuel-system'
import neuroplasticityArticle from './neuroplasticity-flow-overclocking'
import gutBrainArticle from './gut-brain-axis-data-link'
import breathworkArticle from './breathwork-command-line-interface'
import hrvArticle from './hrv-training-nervous-system-latency'
import digitalDementiaArticle from './digital-dementia-attentional-control'
import longevityArticle from './longevity-hardware-cellular-cleanup'
import cognitiveArticle from './cognitive-architecture-nootropic-stacks'
import mitochondrialArticle from './mitochondrial-biogenesis-cellular-power-grid'
import circadianLightingArticle from './circadian-lighting-dark-therapy'
import glp1Article from './glp1-biology-muscle-preservation'
import mtDnaRedLightArticle from './mitochondrial-dna-red-light'
import senolyticArticle from './senolytic-high-dosing-longevity'
import aiBiomarkerArticle from './ai-biomarker-tracking-predictive'
import phaseLockedSleepArticle from './phase-locked-acoustic-sleep'
import neuralEntrainmentArticle from './neural-entrainment-meditation-2'
import electricMedicineArticle from './electric-medicine-neuromodulation'
import muscleMetabolicArticle from './muscle-metabolic-marker'
import chmArticle from './chm-continuous-hormone-monitoring'
import glymphaticFlushArticle from './glymphatic-flush-clearing-neural-cache'
import cpgArticle from './cpg-neural-autopilot'
import co2ToleranceArticle from './co2-tolerance-expanding-oxygen-limit'
import femtechArticle from './femtech-cyclical-architecture'
import cacaoStemCellsArticle from './cacao-stem-cells'
import cognitiveNeuralArticle from './cognitive-architecture-neural-throughput'
import systemFeedbackArticle from './system-feedback-biometric-loop'
import endocrineSocialArticle from './endocrine-social-drive-oxytocin-testosterone'
import hpaAxisArticle from './hpa-axis-control-cortisol-aggression'
import serotoninArticle from './system-stability-serotonin'
import leptinArticle from './energy-sensor-leptin'
import estrogenArticle from './neural-optimizer-estrogen'
import tshArticle from './energy-governor-tsh'
import adaptationHackRangeFractionationArticle from './adaptation-hack-range-fractionation'
import protocolCircadianHardResetArticle from './protocol-circadian-hard-reset'
import ancestralSyncCircadianAnchorsArticle from './ancestral-sync-circadian-anchors'
import longevityProtocolBiologicalClockResetArticle from './longevity-protocol-biological-clock-reset'
import nervousSystemPingLatencyArticle from './nervous-system-ping-latency'
import faultTolerantHumanHrvBufferArticle from './fault-tolerant-human-hrv-buffer'
import resonantFrequencySystemCoherenceArticle from './resonant-frequency-system-coherence'
import baroreflex01hzShiftArticle from './baroreflex-01hz-shift'
import nightlyFlushGlymphaticNeuralCacheArticle from './nightly-flush-glymphatic-neural-cache'
import neuralHydraulicsCsfFlowArticle from './neural-hydraulics-csf-flow'
import antiEntropyNeuralArchitectureArticle from './anti-entropy-neural-architecture'
import idleStateAlphaRhythmsArticle from './idle-state-alpha-rhythms'
import neuralBridgeAlphaFlowGatewayArticle from './neural-bridge-alpha-flow-gateway'
import quietModeAlphaCortisol from './quiet-mode-alpha-cortisol-buffer'
import spinalHarddriveCpgArticle from './spinal-harddrive-cpg-autonomous-scripts'
import rhythmicEntrainmentArticle from './rhythmic-entrainment-system-frequencies'
import spinalIntelligenceArticle from './spinal-intelligence-decentralized-control'
import adrenalGovernorArticle from './adrenal-governor-thermal-runaway'
import interoceptivePrecisionArticle from './interoceptive-precision-sensor-calibration'
import neuralSignalToNoiseArticle from './neural-signal-to-noise-cleaning-system-channel'
import biologicalLatencyArticle from './biological-latency-optimizing-system-ping'
import metabolicRedundancyArticle from './metabolic-redundancy-hybrid-power-architecture'
import physiologicalConcentrationArticle from './physiological-concentration-flow-state-hardwired'
import acetylcholineLensArticle from './acetylcholine-lens-neuro-mechanics'
import vtaReactorArticle from './ventral-tegmental-core-motivational-salience'
import fascialTensegrityArticle from './fascial-tensegrity-protocol-myofascial-noise'
import vascularTensegrityArticle from './vascular-tensegrity-microvascular-mechanics'
import bohrEffectArticle from './bohr-effect-oxygen-telemetry'
import accCoreArticle from './anterior-cingulate-core-coherence-monitoring'
import accCalibrationArticle from './acc-calibration-protocol-cognitive-control'
import hydraulicViscosityArticle from './hydraulic-viscosity-onda-transport-bus'

/**
 * Auto-publishing gate. An article with `publishedAt` in the future is
 * filtered out at module load so EVERY downstream consumer (article index,
 * sitemap, sitemap-news, sitemap-images, RSS/Atom feeds, llms.txt, JSONL
 * corpus, prerender route registry, glossary back-links) sees the exact
 * same trimmed list. The next build that runs after the timestamp passes
 * brings the article live without any content edit.
 *
 * `now` is captured once at module load — this is fine because every
 * consumer re-imports the registry per build (Node module cache resets
 * between `npm run build` invocations).
 */
const NOW = Date.now()
function isPublished(a: Article): boolean {
  if (!a.publishedAt) return true
  const t = Date.parse(a.publishedAt)
  if (Number.isNaN(t)) return true
  return t <= NOW
}

export const articles: Article[] = ([...vagusArticle, ...dopamineArticle, ...dopamineStackingArticle, ...circadianArticle, ...metabolicArticle, ...neuroplasticityArticle, ...gutBrainArticle, ...breathworkArticle, ...hrvArticle, ...digitalDementiaArticle, ...longevityArticle, ...cognitiveArticle, ...mitochondrialArticle, ...circadianLightingArticle, ...glp1Article, ...mtDnaRedLightArticle, ...senolyticArticle, ...aiBiomarkerArticle, ...phaseLockedSleepArticle, ...neuralEntrainmentArticle, ...electricMedicineArticle, ...muscleMetabolicArticle, ...chmArticle, ...glymphaticFlushArticle, ...cpgArticle, ...co2ToleranceArticle, ...femtechArticle, ...cacaoStemCellsArticle, ...cognitiveNeuralArticle, ...systemFeedbackArticle, ...endocrineSocialArticle, ...hpaAxisArticle, ...serotoninArticle, ...leptinArticle, ...estrogenArticle, ...tshArticle, ...adaptationHackRangeFractionationArticle, ...protocolCircadianHardResetArticle, ...ancestralSyncCircadianAnchorsArticle, ...longevityProtocolBiologicalClockResetArticle, ...nervousSystemPingLatencyArticle, ...faultTolerantHumanHrvBufferArticle, ...resonantFrequencySystemCoherenceArticle, ...baroreflex01hzShiftArticle, ...nightlyFlushGlymphaticNeuralCacheArticle, ...neuralHydraulicsCsfFlowArticle, ...antiEntropyNeuralArchitectureArticle, ...idleStateAlphaRhythmsArticle, ...neuralBridgeAlphaFlowGatewayArticle, ...quietModeAlphaCortisol, ...spinalHarddriveCpgArticle, ...rhythmicEntrainmentArticle, ...spinalIntelligenceArticle, ...adrenalGovernorArticle, ...interoceptivePrecisionArticle, ...neuralSignalToNoiseArticle, ...biologicalLatencyArticle, ...metabolicRedundancyArticle, ...physiologicalConcentrationArticle, ...acetylcholineLensArticle, ...vtaReactorArticle, ...fascialTensegrityArticle, ...vascularTensegrityArticle, ...bohrEffectArticle, ...accCoreArticle, ...accCalibrationArticle, ...hydraulicViscosityArticle] as Article[]).filter(isPublished)

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

/**
 * Returns articles that reference the given glossary term (in relatedSlugs or content).
 * Used for bidirectional linking: glossary term → related articles.
 */
export function getArticlesForTerm(termSlug: string, termTitle: string): Article[] {
  const slugLower = termSlug.toLowerCase()
  const titleLower = termTitle.toLowerCase()
  return articles.filter((a) => {
    if (a.relatedSlugs?.includes(termSlug)) return true
    const contentLower = a.content.toLowerCase()
    return (
      contentLower.includes(titleLower) ||
      contentLower.includes(slugLower.replace(/-/g, ' '))
    )
  })
}
