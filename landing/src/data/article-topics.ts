/**
 * ONDA Library — topic taxonomy for /articles (9 tiles → 9 hubs at /articles/topic/<topic>).
 *
 * Source of truth for which hub an article belongs to. GENERATED from the editorial
 * map (articles_topic_map.json, task 13) — edit the map and regenerate, or edit here
 * directly for one-offs. Article URLs never change; hubs only link to them.
 *
 * - ARTICLE_PRIMARY_TOPIC: exactly one primary topic per article (breadcrumbs + main hub list).
 *   Includes "pending" slugs so a newly published article lands in its hub automatically.
 * - ARTICLE_WORLD: curated "Science From Around the World" collection (by country). Articles
 *   appear there as extra links; their canonical URL and primary topic stay the same.
 *
 * Hubs render only articles that actually exist in the articles registry.
 */

export type PrimaryTopicSlug =
  | "meditation"
  | "breathing"
  | "hrv-heart-rate"
  | "stress-vagus"
  | "sleep-body-clock"
  | "lifestyle"
  | "heart-fitness-metabolism"
  | "brain-focus-aging"
  | "doctors-your-data"
export type ArticleTopicSlug = PrimaryTopicSlug | 'world'
export type WorldCountry = 'Japan' | 'India' | 'Germany' | 'Netherlands' | 'France'

export interface ArticleTopicHub {
  slug: ArticleTopicSlug
  /** Hub H1 + tile title. */
  name: string
  /** One-line tile description. */
  tile: string
  /** Hub introduction (answer-engine friendly, not an empty filter). */
  intro: string
  /** Article slug shown large in the "Start here" block. */
  startHere: string
  /** 2–3 adjacent topics linked at the bottom of the hub. */
  neighbors: ArticleTopicSlug[]
  /** Tile / og:image cover (4:3). Falls back to the Start-here article image. */
  image?: string
  /** Descriptive alt for the cover (what the illustration shows + topic keyword). */
  imageAlt?: string
}

/** Order = business priority (meditation first — the ad angle). */
export const ARTICLE_TOPIC_HUBS: ArticleTopicHub[] = [
  {
    slug: 'meditation',
    image: '/images/topics/meditation.jpg',
    imageAlt: 'Meditation with Progress — illustration: a seated meditator silhouette with an ascending mint progress line of light rising behind them.',
    name: 'Meditation with Progress',
    tile: 'Meditation you can measure — how practice changes your brain and body, and how to see it.',
    intro:
      'Meditation works — and its progress is measurable. These guides cover what research shows about how meditation changes your brain and nervous system, the major traditions from Zen to Vipassana to the jhanas, how much practice you actually need, and the honest risks few apps mention. The common thread: meditation is a trainable skill, and you can track your progress instead of practicing blind.',
    startHere: 'meditation-with-measurable-progress',
    neighbors: ['breathing', 'brain-focus-aging', 'stress-vagus'],
  },
  {
    slug: 'breathing',
    image: '/images/topics/breathing.jpg',
    imageAlt: 'Breathing Techniques — illustration: stylized lungs made of light with flowing breath waves moving in and out.',
    name: 'Breathing Techniques',
    tile: 'From the physiological sigh to pranayama — what each technique does and when to use it.',
    intro:
      "Breathing is the fastest lever you have on your nervous system. Here you'll find the techniques worth knowing — coherent breathing, the physiological sigh, 4-7-8, box breathing, and traditional pranayama like Nadi Shodhana and Bhramari — explained through the physiology behind them. Each guide covers how to do it, what the research shows, and which technique fits which moment: calming fast, winding down, or energizing.",
    startHere: 'coherent-breathing-guide',
    neighbors: ['meditation', 'stress-vagus', 'hrv-heart-rate'],
  },
  {
    slug: 'hrv-heart-rate',
    image: '/images/topics/hrv-heart-rate.jpg',
    imageAlt: 'HRV & Heart Rate — illustration: a glowing heart with a variable-rhythm waveform flowing out of it.',
    name: 'HRV & Heart Rate',
    tile: 'What your HRV and resting heart rate mean — and how to move them.',
    intro:
      "Heart rate variability and resting heart rate are two of the most useful signals your body gives you — if you read them correctly. These guides explain what's normal for your age, why your personal baseline matters more than any average, how to measure consistently across devices, what a low reading really means, and which habits raise HRV over time.",
    startHere: 'normal-hrv-by-age',
    neighbors: ['breathing', 'lifestyle', 'heart-fitness-metabolism'],
  },
  {
    slug: 'stress-vagus',
    image: '/images/topics/stress-vagus.jpg',
    imageAlt: 'Stress & the Vagus Nerve — illustration: a glowing nerve path running from the brain down to the heart and gut, shifting from tense red to calm mint.',
    name: 'Stress & the Vagus Nerve',
    tile: 'How stress lives in your body — cortisol, the vagus nerve, and how to switch off.',
    intro:
      'Chronic stress isn\'t only in your head — it\'s a nervous system stuck in "on." These guides explain how the vagus nerve, cortisol and the stress response work, why some people can\'t switch off, and what reliably brings the body back to calm: breathing, cold, nature, and a healthier relationship with your own signals.',
    startHere: 'vagus-nerve-master-key',
    neighbors: ['breathing', 'sleep-body-clock', 'hrv-heart-rate'],
  },
  {
    slug: 'sleep-body-clock',
    image: '/images/topics/sleep-body-clock.jpg',
    imageAlt: 'Sleep & Body Clock — illustration: a bed beneath a circular arc where the sun sets and the moon rises, a faint clock ring around it.',
    name: 'Sleep & Body Clock',
    tile: 'Sleep, light and your circadian rhythm — why timing matters as much as hours.',
    intro:
      'Good sleep depends as much on timing as on hours. These guides cover how much sleep you need, how light sets your body clock, why social jet lag harms more than being a night owl, and practical ways to wind down — from breathing before bed to Yoga Nidra and clinical approaches to insomnia.',
    startHere: 'how-much-sleep-do-you-need',
    neighbors: ['stress-vagus', 'lifestyle', 'hrv-heart-rate'],
  },
  {
    slug: 'lifestyle',
    image: '/images/topics/lifestyle.jpg',
    imageAlt: 'Lifestyle Effects — illustration: a coffee cup, a wine glass and a phone arranged around a central heart-rate line.',
    name: 'Lifestyle Effects',
    tile: 'What alcohol, caffeine, screens and late meals do to your numbers.',
    intro:
      'Everyday habits leave a clear trace in your heart rate and HRV. These guides show — with data — what alcohol, caffeine, nicotine, late meals and screen time do to your body overnight, how long the effects last, and what dopamine, brain fog and "digital overload" really are.',
    startHere: 'how-much-alcohol-lowers-hrv',
    neighbors: ['hrv-heart-rate', 'sleep-body-clock', 'heart-fitness-metabolism'],
  },
  {
    slug: 'heart-fitness-metabolism',
    image: '/images/topics/heart-fitness-metabolism.jpg',
    imageAlt: 'Heart, Fitness & Metabolism — illustration: a runner silhouette merging with a heart shape and a smooth pulse wave.',
    name: 'Heart, Fitness & Metabolism',
    tile: 'Blood pressure, aerobic fitness and metabolic health — the long game.',
    intro:
      'Your cardiovascular and metabolic health is built over years. These guides cover blood pressure and slow breathing, VO2 max and Zone 2 training, heart rate recovery, overtraining, nutrition basics, hormones and metabolic flexibility — including what yoga and breathing research shows for blood sugar and metabolic syndrome.',
    startHere: 'high-blood-pressure-slow-breathing',
    neighbors: ['hrv-heart-rate', 'lifestyle', 'breathing'],
  },
  {
    slug: 'brain-focus-aging',
    image: '/images/topics/brain-focus-aging.jpg',
    imageAlt: 'Brain, Focus & Aging — illustration: a brain with a single focused beam of light passing through it.',
    name: 'Brain, Focus & Aging',
    tile: 'Attention, memory and a healthier aging brain.',
    intro:
      "Focus and memory aren't fixed traits — they respond to how you breathe, rest and train your attention. These guides explore the neuroscience of concentration and flow, how breathing affects memory, practices like Trataka, and what research says about keeping the brain and body young.",
    startHere: 'how-to-get-rid-of-brain-fog',
    neighbors: ['meditation', 'sleep-body-clock', 'lifestyle'],
  },
  {
    slug: 'doctors-your-data',
    image: '/images/topics/doctors-your-data.jpg',
    imageAlt: 'Doctors and Your Data — illustration: five doctor silhouettes in a calm semicircle, each marked by a glowing symbol (heart, moon, brain, runner, medical cross), connected by thin mint lines to a single one-page report in the center.',
    name: 'Doctors and Your Data',
    tile: 'Which specialist can use your heart, HRV and sleep trends — and how to bring your data to an appointment.',
    intro:
      "Your watch records weeks of resting heart rate, HRV, breathing and sleep that no doctor normally sees. These guides show who can use that history for what — your GP, a cardiologist, a sleep specialist, a therapist or psychiatrist, a sports doctor — how to put it on one page, and where watch data stops: it points to a question, it is never a diagnosis.",
    startHere: 'doctors-and-your-data',
    neighbors: ['hrv-heart-rate', 'sleep-body-clock', 'stress-vagus'],
  },
  {
    slug: 'world',
    image: '/images/topics/world.jpg',
    imageAlt: 'Science From Around the World — illustration: a dark globe with glowing points on Japan, India, Germany, the Netherlands and France, connected by thin arcs of light.',
    name: 'Science From Around the World',
    tile: "Research you won't find in most English sources — from Japan, India, Germany, the Netherlands and France.",
    intro:
      'Much of the most interesting research on breathing, sleep and the nervous system was done outside the English-speaking world. This collection brings it together: Japanese studies on forest bathing and Zen, Indian pranayama trials, German chronobiology, Dutch research on the Wim Hof Method, and France\'s cardiac coherence tradition.',
    startHere: 'forest-bathing-shinrin-yoku-science',
    neighbors: ['meditation', 'breathing', 'sleep-body-clock'],
  },
]

/** World hub section order. */
export const WORLD_COUNTRIES: WorldCountry[] = ['Japan', 'India', 'Germany', 'Netherlands', 'France']

export const ARTICLE_PRIMARY_TOPIC: Record<string, PrimaryTopicSlug> = {
  "4-7-8-breathing": "breathing",
  "acc-calibration-protocol-cognitive-control": "brain-focus-aging",
  "acetylcholine-lens-neuro-mechanics": "brain-focus-aging",
  "active-intervention-vs-passive-tracking": "hrv-heart-rate",
  "adaptation-hack-range-fractionation": "heart-fitness-metabolism",
  "adrenal-governor-thermal-runaway": "stress-vagus",
  "ai-biomarker-tracking-predictive": "hrv-heart-rate",
  "alternate-nostril-breathing": "breathing",
  "ancestral-sync-circadian-anchors": "sleep-body-clock",
  "anterior-cingulate-core-coherence-monitoring": "brain-focus-aging",
  "anti-entropy-neural-architecture": "brain-focus-aging",
  "anxiety-panic-breathing-hrv": "stress-vagus",
  "app-between-meditation-and-fitness-tracker": "meditation",
  "apple-watch-recovery-hrv-vs-overall-hrv": "hrv-heart-rate",
  "attention-trainable-skill-meditation": "meditation",
  "baroreflex-01hz-shift": "hrv-heart-rate",
  "bhastrika-pranayama-brain-anxiety": "breathing",
  "biological-latency-optimizing-system-ping": "brain-focus-aging",
  "body-awareness-training-app": "meditation",
  "body-fat-percentage-composition": "heart-fitness-metabolism",
  "bohr-effect-oxygen-telemetry": "breathing",
  "box-breathing-how-it-works": "breathing",
  "breathing-altitude-acclimatization": "breathing",
  "breathing-exercises-older-adults": "brain-focus-aging",
  "breathing-for-focus-and-attention": "brain-focus-aging",
  "breathing-lowers-stress-hormones": "stress-vagus",
  "breathwork-command-line-interface": "breathing",
  "cacao-stem-cells": "lifestyle",
  "caffeine-half-life-sleep-pressure": "lifestyle",
  "caffeine-hrv-resting-heart-rate": "lifestyle",
  "calm-your-nervous-system-down": "stress-vagus",
  "cardiac-coherence-365-method": "breathing",
  "cardiac-coherence-insomnia-sleep": "sleep-body-clock",
  "chm-continuous-hormone-monitoring": "hrv-heart-rate",
  "chronic-stress-nervous-system-never-off": "stress-vagus",
  "chronotherapy-light-dark-timing": "sleep-body-clock",
  "circadian-lighting-dark-therapy": "sleep-body-clock",
  "circadian-reset-mastering-light": "sleep-body-clock",
  "co2-tolerance-expanding-oxygen-limit": "breathing",
  "cognitive-architecture-neural-throughput": "brain-focus-aging",
  "cognitive-architecture-nootropic-stacks": "brain-focus-aging",
  "cognitive-shuffling": "sleep-body-clock",
  "coherent-breathing-guide": "breathing",
  "cold-exposure-vagus-nerve": "stress-vagus",
  "consciousness-training-app": "meditation",
  "cpg-neural-autopilot": "brain-focus-aging",
  "digital-dementia-attentional-control": "lifestyle",
  "does-dopamine-detox-work": "lifestyle",
  "dopamine-architecture-mastering-desire": "lifestyle",
  "dopamine-stacking-preventing-circuit-overload": "lifestyle",
  "dysautonomia-long-covid-breathing": "breathing",
  "eating-late-heart-rate-sleep": "lifestyle",
  "electric-medicine-neuromodulation": "stress-vagus",
  "endocrine-social-drive-oxytocin-testosterone": "heart-fitness-metabolism",
  "energy-governor-tsh": "heart-fitness-metabolism",
  "energy-sensor-leptin": "heart-fitness-metabolism",
  "fascial-tensegrity-protocol-myofascial-noise": "heart-fitness-metabolism",
  "fast-vs-slow-pranayama": "breathing",
  "fault-tolerant-human-hrv-buffer": "hrv-heart-rate",
  "femtech-cyclical-architecture": "heart-fitness-metabolism",
  "find-your-resonance-breathing-rate": "breathing",
  "forest-bathing-shinrin-yoku-science": "stress-vagus",
  "glp1-biology-muscle-preservation": "heart-fitness-metabolism",
  "glymphatic-flush-clearing-neural-cache": "sleep-body-clock",
  "gut-brain-axis-data-link": "lifestyle",
  "heart-rate-recovery-fitness-marker": "heart-fitness-metabolism",
  "high-blood-pressure-slow-breathing": "heart-fitness-metabolism",
  "how-long-does-alcohol-stay-in-your-system": "lifestyle",
  "how-much-alcohol-lowers-hrv": "lifestyle",
  "how-much-meditation-do-you-need": "meditation",
  "how-much-sleep-do-you-need": "sleep-body-clock",
  "how-much-water-should-you-drink": "lifestyle",
  "how-to-beat-jet-lag": "sleep-body-clock",
  "how-to-calculate-maintenance-calories": "heart-fitness-metabolism",
  "how-to-calculate-one-rep-max": "heart-fitness-metabolism",
  "how-to-get-rid-of-brain-fog": "lifestyle",
  "how-to-lower-cortisol": "stress-vagus",
  "how-to-measure-hrv-consistently": "hrv-heart-rate",
  "how-to-raise-hrv-naturally": "hrv-heart-rate",
  "how-to-regulate-emotions": "stress-vagus",
  "how-to-train-your-nervous-system": "stress-vagus",
  "hpa-axis-control-cortisol-aggression": "stress-vagus",
  "hrv-breathing-cold-honest-limits": "hrv-heart-rate",
  "hrv-different-every-device": "hrv-heart-rate",
  "hrv-harmony-of-rhythms": "hrv-heart-rate",
  "hrv-training-nervous-system-latency": "hrv-heart-rate",
  "humming-breath-vagus": "breathing",
  "hydraulic-viscosity-onda-transport-bus": "heart-fitness-metabolism",
  "idle-state-alpha-rhythms": "brain-focus-aging",
  "intermittent-fasting-metabolic-switch": "lifestyle",
  "interoceptive-precision-sensor-calibration": "stress-vagus",
  "jhana-meditation-stages": "meditation",
  "longevity-hardware-cellular-cleanup": "brain-focus-aging",
  "longevity-protocol-biological-clock-reset": "brain-focus-aging",
  "mbsr-mindfulness-clinical-evidence": "meditation",
  "measuring-meditation-progress": "meditation",
  "meditation-adverse-effects-safety": "meditation",
  "meditation-aging-telomeres": "meditation",
  "meditation-app-with-biofeedback": "meditation",
  "meditation-brain-aging-protection": "meditation",
  "meditation-brain-changes-how-fast": "meditation",
  "meditation-gamma-waves-experience": "meditation",
  "meditation-neuroscience-expert-monks": "meditation",
  "meditation-vs-breathwork": "meditation",
  "meditation-with-apple-watch": "meditation",
  "meditation-with-measurable-progress": "meditation",
  "metabolic-flexibility-dual-fuel-system": "heart-fitness-metabolism",
  "metabolic-redundancy-hybrid-power-architecture": "heart-fitness-metabolism",
  "mitochondrial-biogenesis-cellular-power-grid": "brain-focus-aging",
  "mitochondrial-dna-red-light": "brain-focus-aging",
  "molecular-psychology-hormonal-firmware": "stress-vagus",
  "morita-therapy-tracking-paradox": "stress-vagus",
  "muscle-metabolic-marker": "heart-fitness-metabolism",
  "naikan-japanese-reflection": "meditation",
  "name-it-to-tame-it-affect-labeling": "stress-vagus",
  "nervous-system-ping-latency": "stress-vagus",
  "neural-bridge-alpha-flow-gateway": "brain-focus-aging",
  "neural-entrainment-meditation-2": "meditation",
  "neural-hydraulics-csf-flow": "sleep-body-clock",
  "neural-optimizer-estrogen": "heart-fitness-metabolism",
  "neural-signal-to-noise-cleaning-system-channel": "brain-focus-aging",
  "neuroplasticity-flow-overclocking": "brain-focus-aging",
  "nicotine-vaping-hrv-heart-rate": "lifestyle",
  "nightly-flush-glymphatic-neural-cache": "sleep-body-clock",
  "normal-hrv-by-age": "hrv-heart-rate",
  "nose-vs-mouth-breathing": "breathing",
  "om-chanting-brain-vagus": "breathing",
  "overtraining-hrv-resting-heart-rate": "heart-fitness-metabolism",
  "phase-locked-acoustic-sleep": "sleep-body-clock",
  "physiological-concentration-flow-state-hardwired": "brain-focus-aging",
  "physiological-sigh": "breathing",
  "pranayama-metabolic-syndrome": "heart-fitness-metabolism",
  "protein-intake-muscle-protein-synthesis": "heart-fitness-metabolism",
  "protocol-circadian-hard-reset": "sleep-body-clock",
  "quiet-mode-alpha-cortisol-buffer": "stress-vagus",
  "rajyoga-open-eye-meditation": "meditation",
  "resonant-frequency-system-coherence": "breathing",
  "respiratory-rate-hidden-signal": "breathing",
  "resting-heart-rate-by-age": "hrv-heart-rate",
  "rhythmic-entrainment-system-frequencies": "brain-focus-aging",
  "screen-apnea-breathing": "lifestyle",
  "senolytic-high-dosing-longevity": "brain-focus-aging",
  "short-daily-breathing-routine": "breathing",
  "sitting-all-day-nervous-system": "stress-vagus",
  "social-jet-lag-irregular-sleep": "sleep-body-clock",
  "spinal-harddrive-cpg-autonomous-scripts": "brain-focus-aging",
  "spinal-intelligence-decentralized-control": "brain-focus-aging",
  "structured-meditation-training-by-levels": "meditation",
  "sudarshan-kriya-yoga-breathing": "breathing",
  "system-feedback-biometric-loop": "hrv-heart-rate",
  "system-stability-serotonin": "stress-vagus",
  "tanden-breathing-serotonin": "breathing",
  "train-hrv-iphone-camera-no-wearable": "hrv-heart-rate",
  "trataka-candle-gazing-focus": "brain-focus-aging",
  "vagus-nerve-exercises": "stress-vagus",
  "vagus-nerve-master-key": "stress-vagus",
  "vascular-tensegrity-microvascular-mechanics": "heart-fitness-metabolism",
  "ventral-tegmental-core-motivational-salience": "brain-focus-aging",
  "vipassana-meditation-attention-brain": "meditation",
  "vo2max-increase-aerobic-engine": "heart-fitness-metabolism",
  "wearables-train-not-just-track": "hrv-heart-rate",
  "what-is-my-chronotype": "sleep-body-clock",
  "what-to-do-after-low-hrv-reading": "hrv-heart-rate",
  "what-your-apple-watch-records": "hrv-heart-rate",
  "wim-hof-breathing-inflammation": "breathing",
  "wind-down-before-sleep-breathing": "sleep-body-clock",
  "yoga-breathing-diabetes-blood-sugar": "heart-fitness-metabolism",
  "yoga-nidra-sleep-science": "sleep-body-clock",
  "yoga-poses-heart-rate-blood-pressure": "heart-fitness-metabolism",
  "your-baseline-knows-first": "hrv-heart-rate",
  "zazen-zen-meditation-brain": "meditation",
  "zen-koans-brain-cognition": "meditation",
  "zone-2-training-aerobic-base": "heart-fitness-metabolism",
  "talk-to-your-doctor-about-wearable-data": "doctors-your-data",
  "onda-report-for-your-gp": "doctors-your-data",
  "onda-report-for-your-cardiologist": "doctors-your-data",
  "onda-report-for-your-sleep-specialist": "doctors-your-data",
  "onda-report-for-your-sports-doctor": "doctors-your-data",
  "doctors-and-your-data": "doctors-your-data",
  "onda-report-for-your-neurologist": "doctors-your-data",
  "onda-report-for-your-endocrinologist": "doctors-your-data",
  "onda-report-for-your-gynecologist": "doctors-your-data",
  "onda-report-for-your-pulmonologist": "doctors-your-data",
  "onda-report-for-your-occupational-health-doctor": "doctors-your-data",
  "onda-report-for-your-rehabilitation-team": "doctors-your-data",
  "onda-report-for-your-therapist-or-psychiatrist": "doctors-your-data",
}

export const ARTICLE_WORLD: Record<string, WorldCountry> = {
  "alternate-nostril-breathing": "India",
  "bhastrika-pranayama-brain-anxiety": "India",
  "breathing-altitude-acclimatization": "Netherlands",
  "breathing-exercises-older-adults": "Japan",
  "breathing-lowers-stress-hormones": "Japan",
  "cardiac-coherence-365-method": "France",
  "cardiac-coherence-insomnia-sleep": "France",
  "chronotherapy-light-dark-timing": "Germany",
  "fast-vs-slow-pranayama": "India",
  "forest-bathing-shinrin-yoku-science": "Japan",
  "hrv-breathing-cold-honest-limits": "Netherlands",
  "hrv-harmony-of-rhythms": "Germany",
  "humming-breath-vagus": "India",
  "meditation-gamma-waves-experience": "India",
  "morita-therapy-tracking-paradox": "Japan",
  "naikan-japanese-reflection": "Japan",
  "nose-vs-mouth-breathing": "Japan",
  "om-chanting-brain-vagus": "India",
  "pranayama-metabolic-syndrome": "India",
  "rajyoga-open-eye-meditation": "India",
  "social-jet-lag-irregular-sleep": "Germany",
  "sudarshan-kriya-yoga-breathing": "India",
  "tanden-breathing-serotonin": "Japan",
  "trataka-candle-gazing-focus": "India",
  "vipassana-meditation-attention-brain": "India",
  "wim-hof-breathing-inflammation": "Netherlands",
  "yoga-breathing-diabetes-blood-sugar": "India",
  "yoga-nidra-sleep-science": "India",
  "yoga-poses-heart-rate-blood-pressure": "India",
  "zazen-zen-meditation-brain": "Japan",
  "zen-koans-brain-cognition": "Japan",
}

export function getArticleTopicHub(slug: string): ArticleTopicHub | undefined {
  return ARTICLE_TOPIC_HUBS.find((h) => h.slug === slug)
}

/** Primary hub of an article (for breadcrumbs), if mapped. */
export function getPrimaryHubForArticle(articleSlug: string): ArticleTopicHub | undefined {
  const t = ARTICLE_PRIMARY_TOPIC[articleSlug]
  return t ? getArticleTopicHub(t) : undefined
}

/** All article slugs belonging to a hub (primary topic, or country for "world"), unordered. */
export function slugsForTopic(topic: ArticleTopicSlug): string[] {
  if (topic === 'world') return Object.keys(ARTICLE_WORLD)
  return Object.keys(ARTICLE_PRIMARY_TOPIC).filter((s) => ARTICLE_PRIMARY_TOPIC[s] === topic)
}
