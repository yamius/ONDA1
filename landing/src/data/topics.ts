/**
 * Topic hubs — pillar pages that consolidate article + glossary content
 * by semantic cluster, each optimised for one primary search keyword.
 *
 * A hub appears in sitemap.xml + hreflang clusters + JSON-LD CollectionPage
 * ONLY when its `pillar` markdown is set. Hubs without pillar text render
 * with <meta name="robots" content="noindex"> so half-finished placeholders
 * never enter Google's index.
 *
 * Adding a slug to articleSlugs/glossarySlugs is purely declarative — the
 * TopicPage component renders the linked items in declared order, and the
 * SEO machinery (sitemap, JSON-LD ItemList) follows the same array.
 */
export interface Topic {
  /** URL slug, lower-kebab. Becomes /topics/<slug>. */
  slug: string
  /** Display name shown in <h1> and breadcrumbs. */
  name: string
  /** One-line tagline shown under <h1> on the hub page. */
  tagline: string
  /** Primary search keyword the hub ranks for. */
  primaryKeyword: string
  /** Secondary keywords woven into pillar text. */
  secondaryKeywords: readonly string[]
  /** 140-160 char meta description for SERPs and social cards. */
  shortDescription: string
  /**
   * Long-form pillar markdown. Undefined = hub is in placeholder state and
   * its page renders noindex. As soon as pillar is set + reviewed the hub
   * goes live (sitemap + JSON-LD + hreflang).
   */
  pillar?: string
  /** Member article slugs in declared order. */
  articleSlugs: readonly string[]
  /** Member glossary term slugs in declared order. */
  glossarySlugs: readonly string[]
  /** Optional canonical entry-point article for the cluster. */
  startHere?: string
  /** Tailwind accent class fragment ('green' | 'cyan' | 'amber' | …). */
  accent?: 'green' | 'cyan' | 'amber' | 'emerald' | 'purple'
}

const HRV_PILLAR = `Heart Rate Variability is your nervous system's signal-to-noise ratio.

Every heartbeat arrives microseconds early or late, governed by an ongoing negotiation between sympathetic activation (push) and parasympathetic recovery (pull). The amount of variability is the direct readout of how flexibly the autonomic system is switching between modes — and how much reserve capacity it has in either direction.

A healthy biocomputer shows wide HRV. The pulse is irregular by design. Inhale arrives faster, exhale slower, and the gap between them is the vagus nerve writing its signature on each cardiac cycle. A chronically stressed system shows narrow HRV — fixed pacing, no slack, no recovery margin. The same monitor reading "low HRV" three days in a row is usually the earliest detectable signal of overtraining, sleep debt, illness or unmetabolized stress — days before symptoms emerge.

## [ START_HERE ]

[**Vagus Nerve: The Master Key to Your Biocomputer**](/articles/vagus-nerve-master-key) is the canonical entry point. The vagus carries roughly eighty percent of parasympathetic traffic and gates nearly every HRV-relevant signal. Read it first; the rest of this cluster builds on its anatomy.

## [ DEEP_DIVES ]

The protocol stack progresses from real-time intervention to long-term reserve:

- **Resonant frequency breathing** — the single most efficient way to drive HRV up in real time. Five-and-a-half-second inhales paired with five-and-a-half-second exhales align the cardiac rhythm with the baroreflex loop. This is your daily calibration tool.
- **0.1 Hz baroreflex hack** — what is happening neurochemically when coherent breathing works. The mechanism is the baroreflex itself, an ancient blood-pressure sensor loop that, when entrained at 0.1 Hz, amplifies parasympathetic gain.
- **Nervous system ping latency** — measuring response *speed*, not just variability. HRV tells you how flexible the system is at rest; ping latency tells you how fast it switches modes under load.
- **Fault-tolerant human** — building HRV reserve so the system can absorb shocks without breaking. The unit of resilience here is the *buffer*: how much load you can take before HRV collapses.
- **HRV training and biofeedback** — the closed-loop protocol. Real-time HRV-coherence training during ten-minute sessions trains both vagal tone and conscious access to the parasympathetic state.
- **Biological latency optimization** — the framework that ties latency, HRV, and recovery into one operating model.

## [ FOUNDATIONS ]

The glossary terms below define the substrate every HRV protocol stands on: HRV itself as a metric, vagal tone as the steady-state output, polyvagal theory as the explanatory model, and the autonomic states the metric reports on.

## [ HARDWARE_VALIDATION ]

> DEVICE: Polar H10, Whoop, Oura, Garmin Fenix — any chest-strap or finger-PPG sensor with native HRV reporting.
> METRIC: rMSSD (preferred) or the device's own HRV score.
> TARGET: track a thirty-day rolling baseline first; intervene only after. Context — sleep, training load, alcohol, illness — matters more than any single morning reading. A single low day proves nothing; three in a row is signal.
`

export const TOPICS: readonly Topic[] = [
  {
    slug: 'hrv',
    name: 'HRV — Heart Rate Variability',
    tagline: 'The master telemetry channel for autonomic state.',
    primaryKeyword: 'HRV training biohacking',
    secondaryKeywords: [
      'heart rate variability protocol',
      'vagal tone training',
      'resonant frequency breathing',
      'autonomic balance',
      'baroreflex training',
    ],
    shortDescription:
      'HRV is your nervous system signal-to-noise ratio. Six protocols + foundational glossary for measuring vagal tone, baroreflex training, and resilience reserve.',
    pillar: HRV_PILLAR,
    articleSlugs: [
      'vagus-nerve-master-key',
      'resonant-frequency-system-coherence',
      'baroreflex-01hz-shift',
      'nervous-system-ping-latency',
      'fault-tolerant-human-hrv-buffer',
      'hrv-training-nervous-system-latency',
      'biological-latency-optimizing-system-ping',
    ],
    glossarySlugs: [
      'heart-rate-variability',
      'vagus-nerve',
      'vagal-tone',
      'polyvagal-theory',
      'autonomic-nervous-system',
      'parasympathetic-nervous-system',
      'sympathetic-nervous-system',
      'coherence',
    ],
    startHere: 'vagus-nerve-master-key',
    accent: 'cyan',
  },
  // The 9 hubs below ship without `pillar`. They render with noindex until
  // a reviewed pillar text is added — sitemap.xml and hreflang ignore them
  // entirely so half-finished placeholders never enter Google's index.
  {
    slug: 'circadian',
    name: 'Circadian — Sleep, Light, and the Master Clock',
    tagline: 'Reset the biological clock with light and rhythm.',
    primaryKeyword: 'circadian rhythm reset protocol',
    secondaryKeywords: [
      'morning light exposure protocol',
      'sleep optimization biohacking',
      'glymphatic flush',
      'melatonin biology',
      'chronotype calibration',
    ],
    shortDescription:
      'The biocomputer runs on a 24-hour clock anchored by light. Eight protocols for circadian reset, sleep architecture, and glymphatic clearance.',
    articleSlugs: [
      'circadian-reset-mastering-light',
      'circadian-lighting-dark-therapy',
      'ancestral-sync-circadian-anchors',
      'protocol-circadian-hard-reset',
      'nightly-flush-glymphatic-neural-cache',
      'glymphatic-flush-clearing-neural-cache',
      'phase-locked-acoustic-sleep',
      'neural-hydraulics-csf-flow',
    ],
    glossarySlugs: ['circadian-rhythm', 'melatonin', 'glymphatic-system'],
    accent: 'amber',
  },
  {
    slug: 'dopamine',
    name: 'Dopamine — Drive and Reward Architecture',
    tagline: 'Calibrate the motivation reactor.',
    primaryKeyword: 'dopamine optimization protocol',
    secondaryKeywords: [
      'dopamine baseline reset',
      'dopamine fasting',
      'motivation biohacking',
      'reward circuit recovery',
    ],
    shortDescription:
      'Dopamine is the prediction-error signal that powers drive. Four protocols for restoring a clean baseline, preventing receptor downregulation, and reading the VTA.',
    articleSlugs: [
      'dopamine-architecture-mastering-desire',
      'dopamine-stacking-preventing-circuit-overload',
      'ventral-tegmental-core-motivational-salience',
      'digital-dementia-attentional-control',
    ],
    glossarySlugs: ['dopamine'],
    accent: 'purple',
  },
  {
    slug: 'metabolic',
    name: 'Metabolic — Dual-Fuel Architecture',
    tagline: 'Switch between glucose and ketones at will.',
    primaryKeyword: 'metabolic flexibility biohacking',
    secondaryKeywords: [
      'mitochondrial biogenesis',
      'glucose ketone switching',
      'fasting protocols',
      'metabolic adaptation',
    ],
    shortDescription:
      'Metabolic flexibility is dual-fuel access without lock-in. Six protocols for mitochondrial biogenesis, fuel switching, and adaptation hacking.',
    articleSlugs: [
      'metabolic-flexibility-dual-fuel-system',
      'metabolic-redundancy-hybrid-power-architecture',
      'mitochondrial-biogenesis-cellular-power-grid',
      'mitochondrial-dna-red-light',
      'glp1-biology-muscle-preservation',
      'muscle-metabolic-marker',
    ],
    glossarySlugs: [],
    accent: 'green',
  },
  {
    slug: 'breathwork',
    name: 'Breathwork — The Command-Line Interface to Autonomic State',
    tagline: 'Direct CLI access to nervous-system mode.',
    primaryKeyword: 'breathwork protocols biohacking',
    secondaryKeywords: [
      'CO2 tolerance training',
      'Bohr effect oxygen',
      'box breathing',
      'breath retention',
    ],
    shortDescription:
      'Breath is the only autonomic signal under voluntary control. Three protocols for CO2 tolerance, the Bohr effect, and CLI-style breath programming.',
    articleSlugs: [
      'breathwork-command-line-interface',
      'co2-tolerance-expanding-oxygen-limit',
      'bohr-effect-oxygen-telemetry',
    ],
    glossarySlugs: [],
    accent: 'cyan',
  },
  {
    slug: 'neuroplasticity',
    name: 'Neuroplasticity — Flow State and Brain Rewriting',
    tagline: 'Overclock the cortex; access flow on demand.',
    primaryKeyword: 'neuroplasticity flow state protocol',
    secondaryKeywords: [
      'flow state biohacking',
      'alpha brainwave training',
      'neural entrainment',
      'BDNF optimization',
    ],
    shortDescription:
      'The cortex rewrites itself when the right alpha-theta state is engaged. Seven protocols for flow access, neural entrainment, and plasticity reserve.',
    articleSlugs: [
      'neuroplasticity-flow-overclocking',
      'physiological-concentration-flow-state-hardwired',
      'neural-bridge-alpha-flow-gateway',
      'neural-entrainment-meditation-2',
      'idle-state-alpha-rhythms',
      'quiet-mode-alpha-cortisol-buffer',
      'anti-entropy-neural-architecture',
    ],
    glossarySlugs: [],
    accent: 'emerald',
  },
  {
    slug: 'cognitive',
    name: 'Cognitive Control — The Acetylcholine Lens',
    tagline: 'Sharpen attention; clear the signal-to-noise ratio.',
    primaryKeyword: 'cognitive control training',
    secondaryKeywords: [
      'attention training',
      'ACC calibration',
      'acetylcholine biohacking',
      'nootropic stack',
    ],
    shortDescription:
      'Cognitive control is the ACC arbitrating between focus and conflict. Six protocols for attention sharpening, nootropic stacking, and signal-to-noise calibration.',
    articleSlugs: [
      'acc-calibration-protocol-cognitive-control',
      'anterior-cingulate-core-coherence-monitoring',
      'cognitive-architecture-neural-throughput',
      'cognitive-architecture-nootropic-stacks',
      'acetylcholine-lens-neuro-mechanics',
      'neural-signal-to-noise-cleaning-system-channel',
    ],
    glossarySlugs: [],
    accent: 'cyan',
  },
  {
    slug: 'spinal',
    name: 'Spinal Hardware — The Decentralised Motor Core',
    tagline: 'Edge-compute the body; offload the cortex.',
    primaryKeyword: 'central pattern generator training',
    secondaryKeywords: [
      'spinal CPG protocol',
      'rhythmic entrainment',
      'motor autonomy',
      'autonomic gait',
    ],
    shortDescription:
      'The spinal cord runs autonomous motor scripts via central pattern generators. Four protocols for engaging spinal CPGs and rhythmic entrainment.',
    articleSlugs: [
      'cpg-neural-autopilot',
      'spinal-harddrive-cpg-autonomous-scripts',
      'spinal-intelligence-decentralized-control',
      'rhythmic-entrainment-system-frequencies',
    ],
    glossarySlugs: [],
    accent: 'green',
  },
  {
    slug: 'hormones',
    name: 'Hormones — Endocrine Signal Routing',
    tagline: 'Tune the slow-clock peptide messages.',
    primaryKeyword: 'hormone optimization biohacking',
    secondaryKeywords: [
      'cortisol management',
      'testosterone protocol',
      'oxytocin biology',
      'female hormone cycle biohacking',
    ],
    shortDescription:
      'The endocrine system runs the slow protocol clock. Nine protocols across HPA axis, sex hormones, leptin, TSH, and cyclical architecture.',
    articleSlugs: [
      'chm-continuous-hormone-monitoring',
      'endocrine-social-drive-oxytocin-testosterone',
      'hpa-axis-control-cortisol-aggression',
      'adrenal-governor-thermal-runaway',
      'system-stability-serotonin',
      'energy-sensor-leptin',
      'energy-governor-tsh',
      'neural-optimizer-estrogen',
      'femtech-cyclical-architecture',
    ],
    glossarySlugs: [],
    accent: 'amber',
  },
  {
    slug: 'longevity',
    name: 'Longevity — Hardware Maintenance and Cellular Cleanup',
    tagline: 'Prevent decay; reverse the biological clock.',
    primaryKeyword: 'longevity biohacking protocol',
    secondaryKeywords: [
      'autophagy protocol',
      'senolytic dosing',
      'biological clock reset',
      'cellular regeneration',
    ],
    shortDescription:
      'Longevity is hardware maintenance, not magic. Four protocols for autophagy, senolytic dosing, biological clock reset, and stem-cell mobilization.',
    articleSlugs: [
      'longevity-hardware-cellular-cleanup',
      'longevity-protocol-biological-clock-reset',
      'senolytic-high-dosing-longevity',
      'cacao-stem-cells',
    ],
    glossarySlugs: [],
    accent: 'emerald',
  },
] as const

export const TOPIC_SLUGS: readonly string[] = TOPICS.map((t) => t.slug)
const TOPIC_BY_SLUG = new Map<string, Topic>(TOPICS.map((t) => [t.slug, t]))

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPIC_BY_SLUG.get(slug)
}

/** Slugs whose pillar is set — these go into sitemap.xml and ARE indexable. */
export const INDEXED_TOPIC_SLUGS: readonly string[] = TOPICS.filter((t) => !!t.pillar).map((t) => t.slug)
