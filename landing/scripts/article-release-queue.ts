/**
 * Article release queue (owner decision 2026-10-07): every language publishes its waiting
 * translated articles at a fixed cadence — {PER_BATCH} articles every {EVERY_DAYS} days per
 * language, from QUEUE_START. Replaces the older weekly drips (ES/RU dated lists after
 * 2026-10-07, ZH 11-per-Monday) for everything not yet live on 2026-10-07.
 *
 * To queue a newly translated article: append its slug to the language's list (never reorder
 * or remove — positions set the dates). A slug goes live on its date only if the translation
 * body exists in public/locales/<lang>/articles.json (checked in prerender-routes.ts).
 *
 * NB: the gate is the BUILD date — pages appear when the site is rebuilt on or after the date.
 */
import type { PublishEntry } from './locale-publish'

export const QUEUE_START = '2026-10-08'
export const PER_BATCH = 10
export const EVERY_DAYS = 2

export const ARTICLE_RELEASE_QUEUE: Record<string, readonly string[]> = {
  es: [
    'name-it-to-tame-it-affect-labeling',
    'cold-exposure-vagus-nerve',
    'nicotine-vaping-hrv-heart-rate',
    'short-daily-breathing-routine',
    'find-your-resonance-breathing-rate',
    'train-hrv-iphone-camera-no-wearable',
    'calm-your-nervous-system-down',
    'body-awareness-training-app',
    'consciousness-training-app',
    'breathing-for-focus-and-attention',
    'wearables-train-not-just-track',
    'wind-down-before-sleep-breathing',
    'how-to-regulate-emotions',
    'meditation-with-apple-watch',
    'anxiety-panic-breathing-hrv',
    'dysautonomia-long-covid-breathing',
    'high-blood-pressure-slow-breathing',
  ],
  ru: [
    'glp1-biology-muscle-preservation',
    'metabolic-flexibility-dual-fuel-system',
    'mitochondrial-biogenesis-cellular-power-grid',
    'mitochondrial-dna-red-light',
    'longevity-hardware-cellular-cleanup',
    'senolytic-high-dosing-longevity',
    'energy-governor-tsh',
    'energy-sensor-leptin',
    'neural-optimizer-estrogen',
    'femtech-cyclical-architecture',
    'endocrine-social-drive-oxytocin-testosterone',
    'acc-calibration-protocol-cognitive-control',
    'acetylcholine-lens-neuro-mechanics',
    'adaptation-hack-range-fractionation',
    'ai-biomarker-tracking-predictive',
    'anterior-cingulate-core-coherence-monitoring',
    'cacao-stem-cells',
    'cognitive-architecture-neural-throughput',
    'cognitive-architecture-nootropic-stacks',
    'digital-dementia-attentional-control',
    'hydraulic-viscosity-onda-transport-bus',
    'neural-hydraulics-csf-flow',
    'neural-signal-to-noise-cleaning-system-channel',
    'spinal-harddrive-cpg-autonomous-scripts',
    'spinal-intelligence-decentralized-control',
    'system-feedback-biometric-loop',
    'system-stability-serotonin',
    'vascular-tensegrity-microvascular-mechanics',
    'ventral-tegmental-core-motivational-salience',
    'fascial-tensegrity-protocol-myofascial-noise',
    'respiratory-rate-hidden-signal',
    'heart-rate-recovery-fitness-marker',
    'screen-apnea-breathing',
    'caffeine-hrv-resting-heart-rate',
    'social-jet-lag-irregular-sleep',
    'eating-late-heart-rate-sleep',
    'chronic-stress-nervous-system-never-off',
    'sitting-all-day-nervous-system',
    'name-it-to-tame-it-affect-labeling',
    'cold-exposure-vagus-nerve',
    'nicotine-vaping-hrv-heart-rate',
    'how-to-train-your-nervous-system',
    'meditation-app-with-biofeedback',
    'structured-meditation-training-by-levels',
    'app-between-meditation-and-fitness-tracker',
    'short-daily-breathing-routine',
    'find-your-resonance-breathing-rate',
    'train-hrv-iphone-camera-no-wearable',
    'calm-your-nervous-system-down',
    'body-awareness-training-app',
    'consciousness-training-app',
    'breathing-for-focus-and-attention',
    'wearables-train-not-just-track',
    'wind-down-before-sleep-breathing',
    'how-to-regulate-emotions',
    'meditation-with-apple-watch',
    'anxiety-panic-breathing-hrv',
    'dysautonomia-long-covid-breathing',
    'high-blood-pressure-slow-breathing',
  ],
  zh: [
    'acc-calibration-protocol-cognitive-control',
    'acetylcholine-lens-neuro-mechanics',
    'adaptation-hack-range-fractionation',
    'adrenal-governor-thermal-runaway',
    'ai-biomarker-tracking-predictive',
    'ancestral-sync-circadian-anchors',
    'anterior-cingulate-core-coherence-monitoring',
    'anti-entropy-neural-architecture',
    'baroreflex-01hz-shift',
    'breathwork-command-line-interface',
    'cacao-stem-cells',
    'circadian-lighting-dark-therapy',
    'circadian-reset-mastering-light',
    'cognitive-architecture-neural-throughput',
    'cognitive-architecture-nootropic-stacks',
    'cpg-neural-autopilot',
    'digital-dementia-attentional-control',
    'electric-medicine-neuromodulation',
    'energy-governor-tsh',
    'fascial-tensegrity-protocol-myofascial-noise',
    'fault-tolerant-human-hrv-buffer',
    'femtech-cyclical-architecture',
    'glp1-biology-muscle-preservation',
    'gut-brain-axis-data-link',
    'hpa-axis-control-cortisol-aggression',
    'hydraulic-viscosity-onda-transport-bus',
    'interoceptive-precision-sensor-calibration',
    'longevity-hardware-cellular-cleanup',
    'longevity-protocol-biological-clock-reset',
    'mitochondrial-biogenesis-cellular-power-grid',
    'mitochondrial-dna-red-light',
    'muscle-metabolic-marker',
    'neural-entrainment-meditation-2',
    'neural-hydraulics-csf-flow',
    'neural-signal-to-noise-cleaning-system-channel',
    'neuroplasticity-flow-overclocking',
    'phase-locked-acoustic-sleep',
    'physiological-concentration-flow-state-hardwired',
    'protocol-circadian-hard-reset',
    'resonant-frequency-system-coherence',
    'rhythmic-entrainment-system-frequencies',
    'senolytic-high-dosing-longevity',
    'spinal-harddrive-cpg-autonomous-scripts',
    'spinal-intelligence-decentralized-control',
    'system-feedback-biometric-loop',
    'vascular-tensegrity-microvascular-mechanics',
    'ventral-tegmental-core-motivational-salience',
  ],
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export const ARTICLE_QUEUE_ENTRIES: PublishEntry[] = Object.entries(ARTICLE_RELEASE_QUEUE).flatMap(([lang, slugs]) =>
  slugs.map((slug, i) => ({
    collection: 'articles' as const,
    lang,
    slug,
    publishOn: addDays(QUEUE_START, Math.floor(i / PER_BATCH) * EVERY_DAYS),
  })),
)
