/**
 * Unique protocol IDs for granular tracking.
 * Format: {articleShort}-{protocolKey}
 * Storage: onda-protocol-{uniqueId}: active
 */
/** MD articles (Telegram): slug -> protocol IDs in order (PROTOCOL_01, PROTOCOL_02, ...) */
export const ARTICLE_PROTOCOL_ORDER: Record<string, string[]> = {
  'cacao-stem-cells': ['cacao-cellular-ignition', 'cacao-micro-circulation-loop', 'cacao-recovery-firewall'],
  'cognitive-architecture-neural-throughput': [
    'cognitive-neural-neural-circuit-digital-sunset',
    'cognitive-neural-neural-lipid-fuel',
    'cognitive-neural-neural-co-regulation',
    'cognitive-neural-neural-photic-anchor',
  ],
}

const ARTICLE_SHORT: Record<string, string> = {
  'cacao-stem-cells': 'cacao',
  'vagus-nerve-master-key': 'vagus',
  'breathwork-command-line-interface': 'breathwork',
  'hrv-training-nervous-system-latency': 'hrv',
  'dopamine-architecture-mastering-desire': 'dopamine',
  'dopamine-stacking-preventing-circuit-overload': 'dopamine-stack',
  'digital-dementia-attentional-control': 'digital',
  'circadian-reset-mastering-light': 'circadian',
  'circadian-lighting-dark-therapy': 'circadian-light',
  'metabolic-flexibility-dual-fuel-system': 'metabolic',
  'mitochondrial-biogenesis-cellular-power-grid': 'mito',
  'longevity-hardware-cellular-cleanup': 'longevity',
  'neuroplasticity-flow-overclocking': 'neuro',
  'cognitive-architecture-nootropic-stacks': 'cognitive',
  'cognitive-architecture-neural-throughput': 'cognitive-neural',
  'gut-brain-axis-data-link': 'gut',
  'glp1-biology-muscle-preservation': 'glp1',
  'mitochondrial-dna-red-light': 'mt-dna',
  'senolytic-high-dosing-longevity': 'senolytic',
  'ai-biomarker-tracking-predictive': 'predictive',
  'phase-locked-acoustic-sleep': 'phase-lock',
  'neural-entrainment-meditation-2': 'neural-ent',
  'electric-medicine-neuromodulation': 'neuromod',
  'muscle-metabolic-marker': 'muscle',
  'chm-continuous-hormone-monitoring': 'chm',
  'glymphatic-flush-clearing-neural-cache': 'glymph',
  'cpg-neural-autopilot': 'cpg',
  'co2-tolerance-expanding-oxygen-limit': 'co2',
  'femtech-cyclical-architecture': 'femtech',
  'endocrine-social-drive-oxytocin-testosterone': 'endocrine',
  'hpa-axis-control-cortisol-aggression': 'hpa',
  'system-stability-serotonin': 'serotonin',
  'energy-sensor-leptin': 'leptin',
  'neural-optimizer-estrogen': 'estrogen',
  'energy-governor-tsh': 'tsh',
}

/** Protocol base id -> article slug (for building unique IDs) */
export const PROTOCOL_TO_ARTICLE: Record<string, string> = {
  // vagus-nerve-master-key
  'breathwork-resonant-frequency': 'vagus-nerve-master-key',
  'vagus-cold-spike': 'vagus-nerve-master-key',
  'vagus-ocular-vagal': 'vagus-nerve-master-key',
  // breathwork-command-line-interface
  'breathwork-box-breathing': 'breathwork-command-line-interface',
  'breathwork-physiological-sigh': 'breathwork-command-line-interface',
  'breathwork-nasal-only': 'breathwork-command-line-interface',
  // hrv-training-nervous-system-latency
  'hrv-hrv-baseline': 'hrv-training-nervous-system-latency',
  'hrv-biofeedback-resync': 'hrv-training-nervous-system-latency',
  'hrv-cold-spike': 'hrv-training-nervous-system-latency',
  // dopamine-architecture-mastering-desire
  'dopamine-intermittent-reward': 'dopamine-architecture-mastering-desire',
  'dopamine-morning-light': 'dopamine-architecture-mastering-desire',
  'dopamine-cold-baseline': 'dopamine-architecture-mastering-desire',
  // dopamine-stacking-preventing-circuit-overload
  'dopamine-stacking-monotasking': 'dopamine-stacking-preventing-circuit-overload',
  'dopamine-stacking-zero-input': 'dopamine-stacking-preventing-circuit-overload',
  'dopamine-stacking-cold-shock': 'dopamine-stacking-preventing-circuit-overload',
  // digital-dementia-attentional-control
  'digital-analog-morning': 'digital-dementia-attentional-control',
  'digital-monotasking': 'digital-dementia-attentional-control',
  'digital-dopamine-fast': 'digital-dementia-attentional-control',
  // circadian-reset-mastering-light
  'circadian-first-photon': 'circadian-reset-mastering-light',
  'circadian-blue-firewall': 'circadian-reset-mastering-light',
  'circadian-temp-down': 'circadian-reset-mastering-light',
  // circadian-lighting-dark-therapy
  'circadian-light-photonic-anchor': 'circadian-lighting-dark-therapy',
  'circadian-light-spectral-shift': 'circadian-lighting-dark-therapy',
  'circadian-light-photic-firewall': 'circadian-lighting-dark-therapy',
  // metabolic-flexibility-dual-fuel-system
  'metabolic-fasted-window': 'metabolic-flexibility-dual-fuel-system',
  'metabolic-glucose-buffer': 'metabolic-flexibility-dual-fuel-system',
  'metabolic-zone2': 'metabolic-flexibility-dual-fuel-system',
  // glp1-biology-muscle-preservation
  'glp1-fiber-pre-loading': 'glp1-biology-muscle-preservation',
  'glp1-berberine-pulsing': 'glp1-biology-muscle-preservation',
  'glp1-protein-leverage-16': 'glp1-biology-muscle-preservation',
  'glp1-bitter-signaling': 'glp1-biology-muscle-preservation',
  // mitochondrial-biogenesis-cellular-power-grid
  'longevity-thermal-shock': 'mitochondrial-biogenesis-cellular-power-grid',
  'mito-photonic-charging': 'mitochondrial-biogenesis-cellular-power-grid',
  'mito-nad-fuel': 'mitochondrial-biogenesis-cellular-power-grid',
  // mitochondrial-dna-red-light
  'mt-dna-photonic-mtdna': 'mitochondrial-dna-red-light',
  // longevity-hardware-cellular-cleanup
  'longevity-system-flush': 'longevity-hardware-cellular-cleanup',
  'longevity-senolytics': 'longevity-hardware-cellular-cleanup',
  'longevity-sauna-cold': 'longevity-hardware-cellular-cleanup',
  // senolytic-high-dosing-longevity
  'senolytic-senolytic-purge': 'senolytic-high-dosing-longevity',
  // neuroplasticity-flow-overclocking
  'neuro-alpha-priming': 'neuroplasticity-flow-overclocking',
  'neuro-bdnf-trigger': 'neuroplasticity-flow-overclocking',
  'neuro-nsdr': 'neuroplasticity-flow-overclocking',
  // cognitive-architecture-nootropic-stacks
  'cognitive-focus-baseline': 'cognitive-architecture-nootropic-stacks',
  'cognitive-memory-encoder': 'cognitive-architecture-nootropic-stacks',
  'cognitive-recovery-loop': 'cognitive-architecture-nootropic-stacks',
  // ai-biomarker-tracking-predictive
  'predictive-anomaly-detection-pulse': 'ai-biomarker-tracking-predictive',
  // phase-locked-acoustic-sleep
  'phase-lock-delta-wave-amplification': 'phase-locked-acoustic-sleep',
  // neural-entrainment-meditation-2
  'neural-ent-closed-loop-neural-sync': 'neural-entrainment-meditation-2',
  // electric-medicine-neuromodulation
  'neuromod-vagus-reset': 'electric-medicine-neuromodulation',
  'neuromod-cognitive-focus': 'electric-medicine-neuromodulation',
  'neuromod-ces-sleep': 'electric-medicine-neuromodulation',
  // muscle-metabolic-marker
  'muscle-grip-strength': 'muscle-metabolic-marker',
  'muscle-metabolic-overclocking': 'muscle-metabolic-marker',
  'muscle-peptide-patch': 'muscle-metabolic-marker',
  // chm-continuous-hormone-monitoring
  'chm-cortisol-sync': 'chm-continuous-hormone-monitoring',
  'chm-performance-window': 'chm-continuous-hormone-monitoring',
  'chm-crash-prevention': 'chm-continuous-hormone-monitoring',
  // glymphatic-flush-clearing-neural-cache
  'glymph-sleep-posture': 'glymphatic-flush-clearing-neural-cache',
  'glymph-thermal-flush': 'glymphatic-flush-clearing-neural-cache',
  'glymph-insulin-block': 'glymphatic-flush-clearing-neural-cache',
  // cpg-neural-autopilot
  'cpg-cross-lateral': 'cpg-neural-autopilot',
  'cpg-cadence-hack': 'cpg-neural-autopilot',
  'cpg-sensory-override': 'cpg-neural-autopilot',
  // co2-tolerance-expanding-oxygen-limit
  'co2-bolt-test': 'co2-tolerance-expanding-oxygen-limit',
  'co2-box-calibration': 'co2-tolerance-expanding-oxygen-limit',
  'co2-apnea-tables': 'co2-tolerance-expanding-oxygen-limit',
  // femtech-cyclical-architecture
  'femtech-phase-sync': 'femtech-cyclical-architecture',
  'femtech-bbt-tracking': 'femtech-cyclical-architecture',
  'femtech-micronutrient-load': 'femtech-cyclical-architecture',
  // cacao-stem-cells (use base keys — no prefix in article)
  'cellular-ignition': 'cacao-stem-cells',
  'micro-circulation-loop': 'cacao-stem-cells',
  'recovery-firewall': 'cacao-stem-cells',
  // gut-brain-axis-data-link
  'gut-microbiome-patch': 'gut-brain-axis-data-link',
  'gut-polyphenol': 'gut-brain-axis-data-link',
  'gut-cold-restart': 'gut-brain-axis-data-link',
  // cognitive-architecture-neural-throughput (use base keys — no prefix in article)
  'neural-circuit-digital-sunset': 'cognitive-architecture-neural-throughput',
  'neural-lipid-fuel': 'cognitive-architecture-neural-throughput',
  'neural-co-regulation': 'cognitive-architecture-neural-throughput',
  'neural-photic-anchor': 'cognitive-architecture-neural-throughput',
  // endocrine-social-drive-oxytocin-testosterone
  'visual-calibration': 'endocrine-social-drive-oxytocin-testosterone',
  'vocal-resonance': 'endocrine-social-drive-oxytocin-testosterone',
  'tactile-input': 'endocrine-social-drive-oxytocin-testosterone',
  // hpa-axis-control-cortisol-aggression
  'hpa-forced-deceleration': 'hpa-axis-control-cortisol-aggression',
  'hpa-micro-loading': 'hpa-axis-control-cortisol-aggression',
  'hpa-cognitive-reframing': 'hpa-axis-control-cortisol-aggression',
  // system-stability-serotonin
  'serotonin-posture-patch': 'system-stability-serotonin',
  'serotonin-solar-loading': 'system-stability-serotonin',
  'serotonin-prebiotic-input': 'system-stability-serotonin',
  // energy-sensor-leptin
  'leptin-silence-window': 'energy-sensor-leptin',
  'leptin-protein-first': 'energy-sensor-leptin',
  'leptin-thermal-reset': 'energy-sensor-leptin',
  // neural-optimizer-estrogen
  'estrogen-phyto-patch': 'neural-optimizer-estrogen',
  'estrogen-resistance-training': 'neural-optimizer-estrogen',
  'estrogen-omega3-shield': 'neural-optimizer-estrogen',
  // energy-governor-tsh
  'tsh-fuel-check': 'energy-governor-tsh',
  'tsh-thermal-test': 'energy-governor-tsh',
  'tsh-stress-bypass': 'energy-governor-tsh',
}

export const PROTOCOL_STORAGE_PREFIX = 'onda-protocol-'
export const ARTICLE_STORAGE_PREFIX = 'onda-article-completed-'

/** Get unique protocol ID for storage and display */
export function getProtocolUniqueId(protocolBaseId: string): string {
  const articleSlug = PROTOCOL_TO_ARTICLE[protocolBaseId]
  const short = articleSlug ? ARTICLE_SHORT[articleSlug] : 'unknown'
  return `${short}-${protocolBaseId}`
}
