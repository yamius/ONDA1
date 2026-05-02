/**
 * Topic hubs (Stage 7 of GEO sprint).
 *
 * Each topic is an editorial cluster — a high-intent search facet ONDA
 * Life publishes about. The hub aggregates the canonical articles +
 * glossary terms for that cluster and gives generative engines a
 * single, well-structured `CollectionPage + ItemList` they can cite
 * when answering "everything about HRV / vagus nerve / circadian
 * rhythm" style questions.
 *
 * The slug list per topic is curated rather than derived to keep
 * cluster boundaries crisp and avoid runtime keyword false positives.
 * A new article is added to a topic by appending its slug here.
 */
export interface Topic {
  slug: string
  title: string
  /** ≤160 char SEO description; also seeds the meta description. */
  description: string
  /** 1-paragraph editorial overview shown on the hub (≤500 chars). */
  overview: string
  /** Canonical article slugs (must exist in src/data/articles). */
  articleSlugs: string[]
  /** Canonical glossary slugs (must exist in src/data/glossary). */
  glossarySlugs: string[]
  /** Optional related part route (`/part/<slug>`). */
  partSlug?: string
  /** Editorial keywords for AI/SERP — comma-joined into <meta name="keywords">. */
  keywords: string[]
}

export const TOPICS: Topic[] = [
  {
    slug: 'hrv',
    title: 'Heart Rate Variability (HRV) Training',
    description:
      'Engineering protocols for HRV expansion: vagal-tone amplification, baroreflex resonance at 0.1 Hz, and nervous-system latency reduction.',
    overview:
      'HRV is the millisecond-scale variation between heartbeats and the most reliable single readout of autonomic-nervous-system flexibility. The ONDA Life HRV cluster covers the full engineering loop — measurement, interpretation, and the protocols that durably expand the resonant bandwidth of your nervous system.',
    articleSlugs: [
      'hrv-training-nervous-system-latency',
      'fault-tolerant-human-hrv-buffer',
      'baroreflex-01hz-shift',
      'resonant-frequency-system-coherence',
      'nervous-system-ping-latency',
      'biological-latency-optimizing-system-ping',
      'system-feedback-biometric-loop',
    ],
    glossarySlugs: [],
    keywords: [
      'HRV training',
      'heart rate variability',
      'vagal tone',
      'baroreflex 0.1 Hz',
      'autonomic flexibility',
      'resonant frequency breathing',
      'parasympathetic activation',
    ],
  },
  {
    slug: 'vagus-nerve',
    title: 'Vagus Nerve Stimulation & Vagal Tone',
    description:
      'Vagus-nerve protocols — humming, cold exposure, electrical neuromodulation, fascial release — for measurable parasympathetic uplift.',
    overview:
      'The vagus nerve is the master autonomic cable connecting brainstem to viscera. ONDA treats it as the highest-leverage intervention surface in the body: small inputs (humming, cold, exhale extension, transcutaneous stimulation) cause large, measurable shifts in HRV, gut motility, mood, and cognitive recovery.',
    articleSlugs: [
      'vagus-nerve-master-key',
      'electric-medicine-neuromodulation',
      'fascial-tensegrity-protocol-myofascial-noise',
      'gut-brain-axis-data-link',
    ],
    glossarySlugs: [],
    keywords: [
      'vagus nerve',
      'vagal tone',
      'transcutaneous vagus nerve stimulation',
      'tVNS',
      'cold exposure vagus',
      'humming vagus activation',
      'parasympathetic nervous system',
    ],
  },
  {
    slug: 'circadian-rhythm',
    title: 'Circadian Rhythm Engineering',
    description:
      'Light, temperature, and timing protocols for resetting and stabilizing the master circadian clock — including jet lag and shift work recovery.',
    overview:
      'Every cell carries a 24-hour clock. The ONDA circadian cluster is the operations manual for keeping that clock entrained: morning light dosage, dark therapy, food/exercise timing, and the multi-day reset protocol used to clear jet lag, recover from shift work, or restore broken sleep architecture.',
    articleSlugs: [
      'circadian-reset-mastering-light',
      'circadian-lighting-dark-therapy',
      'ancestral-sync-circadian-anchors',
      'protocol-circadian-hard-reset',
      'longevity-protocol-biological-clock-reset',
      'phase-locked-acoustic-sleep',
    ],
    glossarySlugs: [],
    keywords: [
      'circadian rhythm',
      'circadian reset protocol',
      'morning light therapy',
      'jet lag recovery',
      'zeitgeber',
      'dark therapy',
      'sleep architecture',
    ],
  },
  {
    slug: 'dopamine',
    title: 'Dopamine Architecture & Motivation',
    description:
      'Mesolimbic-circuit protocols for restoring baseline dopamine, preventing dopaminergic burnout, and engineering durable motivation.',
    overview:
      'Dopamine is the prediction-error signal — the neuromodulator that decides what is worth pursuing next. The ONDA dopamine cluster is the engineering manual for the mesolimbic system: how baseline tone collapses, why most "dopamine detox" advice fails, and the receptor-sensitivity protocols that durably restore motivational drive.',
    articleSlugs: [
      'dopamine-architecture-mastering-desire',
      'dopamine-stacking-preventing-circuit-overload',
      'ventral-tegmental-core-motivational-salience',
    ],
    glossarySlugs: [],
    keywords: [
      'dopamine baseline',
      'dopamine detox',
      'dopamine stacking',
      'ventral tegmental area',
      'mesolimbic circuit',
      'receptor sensitivity reset',
      'motivational salience',
    ],
  },
  {
    slug: 'breathwork',
    title: 'Breathwork Protocols (Box, Resonant, CO2 Tolerance)',
    description:
      'Engineering-grade breathwork: 0.1 Hz resonant breathing, box, physiological sigh, CO2-tolerance training, and the Bohr-effect chemistry behind oxygen delivery.',
    overview:
      'Breathwork is the only autonomic input under voluntary control, which makes it the single fastest lever on the entire nervous system. The ONDA breathwork cluster covers the four protocols with the strongest evidence base — resonant frequency, box, physiological sigh, and CO2-tolerance training — plus the underlying Bohr-effect physiology that explains why CO2, not O2, is the rate-limiting variable.',
    articleSlugs: [
      'breathwork-command-line-interface',
      'co2-tolerance-expanding-oxygen-limit',
      'bohr-effect-oxygen-telemetry',
      'quiet-mode-alpha-cortisol-buffer',
      'resonant-frequency-system-coherence',
    ],
    glossarySlugs: [],
    keywords: [
      'box breathing',
      'resonant frequency breathing 0.1 Hz',
      'physiological sigh',
      'CO2 tolerance training',
      'BOLT score',
      'Bohr effect',
      'pranayama protocol',
    ],
  },
  {
    slug: 'metabolic-flexibility',
    title: 'Metabolic Flexibility & Dual-Fuel Switching',
    description:
      'Restore the ability to switch between glucose and ketones on demand — the foundation of energy stability, insulin sensitivity, and longevity.',
    overview:
      'Metabolic flexibility is the cellular ability to switch fuel sources between glucose and fatty acids/ketones without producing fatigue, brain fog, or insulin spikes. The ONDA metabolic cluster covers the four engineering levers — fasting, exercise, food composition, and circadian alignment — plus the leptin/TSH/GLP-1 endocrine axes that govern how the switch is calibrated.',
    articleSlugs: [
      'metabolic-flexibility-dual-fuel-system',
      'metabolic-redundancy-hybrid-power-architecture',
      'glp1-biology-muscle-preservation',
      'energy-sensor-leptin',
      'energy-governor-tsh',
      'muscle-metabolic-marker',
    ],
    glossarySlugs: [],
    keywords: [
      'metabolic flexibility',
      'fat adaptation',
      'GLP-1 natural activation',
      'leptin sensitivity',
      'TSH thyroid governor',
      'zone 2 cardio mitochondria',
      'insulin sensitivity',
    ],
  },
  {
    slug: 'glymphatic-clearance',
    title: 'Glymphatic Clearance & Cerebral Hydraulics',
    description:
      'Sleep-position, lateralization, and CSF-flow protocols that maximize the brain\'s nightly waste-clearance system.',
    overview:
      'The glymphatic system is the brain\'s overnight waste-clearance pipeline — only fully active during deep NREM sleep and only at maximal flow when CSF dynamics are unobstructed. The ONDA cluster covers the engineering controls: sleep position, head/neck angle, fluid viscosity, vascular tensegrity, and the protocol stack that converts a normal night into a full neural-cache flush.',
    articleSlugs: [
      'glymphatic-flush-clearing-neural-cache',
      'nightly-flush-glymphatic-neural-cache',
      'neural-hydraulics-csf-flow',
      'vascular-tensegrity-microvascular-mechanics',
      'hydraulic-viscosity-onda-transport-bus',
    ],
    glossarySlugs: [],
    keywords: [
      'glymphatic system',
      'cerebrospinal fluid clearance',
      'NREM deep sleep flush',
      'beta amyloid clearance',
      'cerebral hydraulics',
      'side sleep position glymphatic',
      'CSF flow optimization',
    ],
  },
  {
    slug: 'neuroplasticity',
    title: 'Neuroplasticity, Flow, and Cognitive Architecture',
    description:
      'Protocols for inducing flow states, opening neuroplasticity windows, and engineering distraction-resilient cognitive architecture.',
    overview:
      'Neuroplasticity is the brain\'s rewire-on-demand capability — gated by acetylcholine, BDNF, dopamine, and a precise sleep-and-novelty stack. The ONDA neuroplasticity cluster covers the full pipeline: how to enter flow reliably, how to consolidate the rewire overnight, and the cognitive-control protocols (ACC calibration, alpha-theta gateway, monotasking discipline) that make the new wiring stick.</p>',
    articleSlugs: [
      'neuroplasticity-flow-overclocking',
      'anti-entropy-neural-architecture',
      'cognitive-architecture-neural-throughput',
      'cognitive-architecture-nootropic-stacks',
      'neural-bridge-alpha-flow-gateway',
      'neural-entrainment-meditation-2',
      'idle-state-alpha-rhythms',
      'physiological-concentration-flow-state-hardwired',
      'anterior-cingulate-core-coherence-monitoring',
      'acc-calibration-protocol-cognitive-control',
      'digital-dementia-attentional-control',
      'neural-signal-to-noise-cleaning-system-channel',
    ],
    glossarySlugs: [],
    keywords: [
      'neuroplasticity',
      'flow state',
      'BDNF',
      'acetylcholine attention',
      'cross-frequency coupling',
      'ACC calibration protocol',
      'cognitive control training',
    ],
  },
  {
    slug: 'mitochondria',
    title: 'Mitochondria, Photobiomodulation & Cellular Power',
    description:
      'PGC-1α biogenesis, red-light therapy wavelengths, senolytics, and the autophagy stack — the engineering of the cellular power grid.',
    overview:
      'Mitochondria convert food and oxygen into ATP and reactive-oxygen-species signaling. The ONDA mitochondria cluster covers the protocols that durably increase mitochondrial density (zone-2 cardio, cold/heat exposure), repair existing organelles (PGC-1α, autophagy), and reach inside them with red-light photobiomodulation at the 660–850 nm cytochrome-c-oxidase peaks.',
    articleSlugs: [
      'mitochondrial-biogenesis-cellular-power-grid',
      'mitochondrial-dna-red-light',
      'longevity-hardware-cellular-cleanup',
      'senolytic-high-dosing-longevity',
      'cacao-stem-cells',
    ],
    glossarySlugs: [],
    keywords: [
      'mitochondrial biogenesis',
      'PGC-1 alpha',
      'red light therapy 660nm 850nm',
      'photobiomodulation',
      'autophagy protocol',
      'senolytics quercetin fisetin',
      'cytochrome c oxidase',
    ],
  },
  {
    slug: 'cold-exposure',
    title: 'Cold Exposure, Adrenal Governor & Hormesis',
    description:
      'Cold-plunge dosing, range-fractionation training, and HPA-axis recovery — the hormetic stack for adrenal resilience.',
    overview:
      'Cold exposure is hormetic stress: small, well-dosed challenges that train the adrenal governor, expand brown-adipose thermogenesis, and durably raise dopamine baseline. The ONDA cold cluster covers the dose-response curve, the HPA-axis recovery protocol, and the range-fractionation training that prevents cold from becoming chronic stress.',
    articleSlugs: [
      'adaptation-hack-range-fractionation',
      'adrenal-governor-thermal-runaway',
      'hpa-axis-control-cortisol-aggression',
    ],
    glossarySlugs: [],
    keywords: [
      'cold exposure protocol',
      'cold plunge dosing',
      'HPA axis recovery',
      'adrenal resilience',
      'hormesis',
      'brown adipose thermogenesis',
      'cortisol regulation',
    ],
  },
]

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}
