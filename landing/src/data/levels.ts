/**
 * Level data for parent pages that aggregate parts.
 * Level 1 = Parts 1, 2, 3 (I Am, I Move, I Adapt)
 */

export interface LevelPartArchitecture {
  number: string
  label: string
  slug: string
  protocol: string
  goal: string
  work: string
}

/** Level theme colors for architecture cards (matches LevelsSection) */
const levelThemes: Record<number, { borderColor: string; accentColor: string }> = {
  1: { borderColor: 'border-purple-500/20', accentColor: 'text-purple-400' },
  2: { borderColor: 'border-cyan-500/20', accentColor: 'text-cyan-400' },
}

export interface LevelData {
  number: number
  badge: string
  name: string
  subtitle: string
  theme?: { borderColor: string; accentColor: string }
  intro: string
  architecture: {
    title: string
    intro: string
    parts: LevelPartArchitecture[]
  }
  biologicalProtocol: {
    title: string
    intro: string
    items: { name: string; text: string }[]
  }
  targetSystems: {
    title: string
    intro: string
    items: { name: string; text: string }[]
  }
  results: {
    title: string
    intro: string
    items: string[]
  }
  researchLinks: { label: string; url: string }[]
  glossaryLinks: { label: string; slug: string }[]
}

export const levelsData: Record<number, LevelData> = {
  1: {
    number: 1,
    badge: '[ LEVEL 1: BODY / TERRA ]',
    name: 'BODY / TERRA',
    subtitle: 'Biocomputer Architecture: From Survival to Autonomy',
    theme: levelThemes[1],
    intro:
      'Level 1 is a deep inspection and calibration of your "hardware." At this stage, we descend to "biological zero"—the baseline settings of survival—to transform the body from a "besieged fortress" into a safe and efficient home.\n\nThis is the foundation of the entire ONDA Life ecosystem. Here, consciousness is not yet separated from metabolic processes; our task is to optimize the performance of the most ancient brain structures.',
    architecture: {
      title: 'System Architecture',
      intro: 'Level 1 is divided into three calibration protocols:',
      parts: [
        {
          number: '01',
          label: 'I Am',
          slug: 'i-am',
          protocol: 'Protocol: Homeostasis',
          goal: 'Objective: Shifting the system from "anxious anticipation" into a state of "safe being."',
          work:
            'Work: Tuning the connection between the brainstem and the insular cortex (insula). Activating primary interoception—the ability to sense your pulse, organ rhythms, and breath as the bedrock of self-awareness.',
        },
        {
          number: '02',
          label: 'I Move',
          slug: 'i-move',
          protocol: 'Protocol: Rhythmic Coherence',
          goal: 'Objective: Transitioning from static existence to the dynamics of a "fluid body."',
          work:
            'Work: Activating CPGs (Central Pattern Generators)—spinal cord circuits responsible for automatic grace. We awaken "fish intelligence": effortless movement born from resonance with gravity.',
        },
        {
          number: '03',
          label: 'I Adapt',
          slug: 'i-adapt',
          protocol: 'Protocol: Gravity Mastery',
          goal: 'Objective: Achieving internal autonomy and structural support.',
          work:
            'Work: Tuning the reticular formation and the sensorimotor cortex. We train the system to rapidly switch between "fluidity" and "stability," utilizing gravity as a resource rather than a burden.',
        },
      ],
    },
    biologicalProtocol: {
      title: 'Biological Protocol',
      intro: 'The technological stack of this level includes:',
      items: [
        {
          name: 'Interoceptive Calibration',
          text: 'Developing the skill to detect "biocomputer" signals before they translate into emotions or thoughts.',
        },
        {
          name: 'Vagal Tone (V2)',
          text: 'Exiting "freeze" states by releasing the diaphragm and activating the Vagus nerve.',
        },
        {
          name: 'Vestibulo-Ocular Reflex (VOR)',
          text: 'Stabilizing gaze and navigation within the flow of incoming stimuli.',
        },
        {
          name: 'Energy Efficiency',
          text: 'Training the nervous system to perform tasks with minimal electrical impulse, eliminating "body armor" (chronic tension).',
        },
      ],
    },
    targetSystems: {
      title: 'Target Systems',
      intro: 'The level engages the following neural structures:',
      items: [
        { name: 'Insular Cortex (Insula)', text: 'The primary hub for self-sensing and interoception.' },
        { name: 'Brainstem & Hypothalamus', text: 'Control centers for life support and homeostasis.' },
        { name: 'Cerebellum', text: 'Ensuring precision, coordination, and the elimination of "noise" in movement.' },
        { name: 'Vagus Nerve', text: 'The highway of the parasympathetic system, responsible for the biological sense of safety.' },
      ],
    },
    results: {
      title: 'Results & Benefits',
      intro:
        'The outcome of completing Level 1 is reaching the "Point of Stillness" and "Neural Fluidity." Your biological markers of progress include:',
      items: [
        'Increased HRV: Growth in Heart Rate Variability as a marker of nervous system flexibility.',
        'Basal Cortisol Reduction: Eliminating background stress at the cellular level.',
        'Body Armor Dissolution: Releasing chronic spasms and restoring deep, rhythmic breathing.',
      ],
    },
    researchLinks: [
      { label: 'Interoception & Insular Cortex Study', url: 'https://pubmed.ncbi.nlm.nih.gov/12030437/' },
      { label: 'Polyvagal Theory: Neurophysiological Foundations', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
      { label: 'HRV and Rhythmic Coherence in Locomotion', url: 'https://pubmed.ncbi.nlm.nih.gov/19463818/' },
    ],
    glossaryLinks: [
      { label: 'Biocomputer', slug: 'biocomputer' },
      { label: 'Homeostasis', slug: 'homeostasis' },
      { label: 'Primary Interoception', slug: 'primary-interoception' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Cerebellum', slug: 'cerebellum' },
      { label: 'Central Pattern Generators', slug: 'central-pattern-generators' },
      { label: 'Body Armor', slug: 'body-armor' },
      { label: 'HRV', slug: 'heart-rate-variability' },
      { label: 'Neuroplasticity', slug: 'neuroplasticity' },
    ],
  },
  2: {
    number: 2,
    badge: '[ LEVEL 2: EMOTIONS / AQUA ]',
    name: 'EMOTIONS / AQUA',
    subtitle: 'Energy Biochemistry: From Maneuverability to Social Power',
    theme: levelThemes[2],
    intro:
      'Level 2 is the stage of mastering your emotional system as a high-tech reactor. We stop perceiving emotions as mere "moods" and begin treating them as biological protocols: with specific hormonal signatures, neuromotor patterns, and vegetative profiles.\n\nAt this level, we follow the path of mammalian evolution: from the instantaneous reactions of a small animal to the unshakable calm of a large predator and the complex resonance of a higher primate.',
    architecture: {
      title: 'System Architecture',
      intro: 'Level 2 integrates three resource management strategies:',
      parts: [
        {
          number: '04',
          label: 'I Maneuver',
          slug: 'i-maneuver',
          protocol: 'Protocol: The Maneuverability of the "Small Mammal"',
          goal: 'Objective: Biological flexibility and instantaneous acceleration without paralyzing stress.',
          work:
            'Mechanism: Training neuroception (the brain\'s ability to detect threats before they are consciously perceived). We teach the system to "drift" smoothly between rest and action, turning cortisol and adrenaline from toxins into fuel for precision.',
        },
        {
          number: '05',
          label: 'I Guard the Territory',
          slug: 'i-guard-territory',
          protocol: 'Protocol: The Strength of the "Large Mammal"',
          goal: 'Objective: Status calm and density of presence.',
          work:
            'Mechanism: Reconfiguring the endocrine system. We shift the adrenal glands from emergency cortisol release to the production of DHEA (the hormone of vitality). This is a state of "calm dominance," where your stability is sensed by others at a limbic level before you even speak.',
        },
        {
          number: '06',
          label: "I'm Part of the Pack",
          slug: 'i-am-part-of-the-pack',
          protocol: 'Protocol: Social Resonance',
          goal: 'Objective: Transforming individual survival into collective power.',
          work:
            'Mechanism: Activating the "social brain"—the mirror neuron system and the oxytocin profile. We learn to synchronize our rhythms with the group (co-regulation) while maintaining an autonomous center. Your presence becomes the "glue" that unites the field.',
        },
      ],
    },
    biologicalProtocol: {
      title: 'Biological Protocol',
      intro: 'The energy management technological stack:',
      items: [
        {
          name: 'Polyvagal Theory (Ventral Vagus)',
          text: 'Utilizing "smart parasympathetics" to maintain social engagement even under high loads.',
        },
        {
          name: 'HPA Axis Control',
          text: 'Direct influence on the Hypothalamus-Pituitary-Adrenal chain to manage hormonal response.',
        },
        {
          name: 'Emotional Osmosis',
          text: 'The skill of exchanging states with others without being absorbed by their chaos.',
        },
        {
          name: 'Lymphatic Pumping',
          text: 'Using muscle tone as a pump to clear the body of stress metabolic byproducts.',
        },
      ],
    },
    targetSystems: {
      title: 'Target Systems',
      intro: 'The level engages the following neural structures:',
      items: [
        { name: 'Hypothalamus', text: 'Control center for territorial behavior and hormonal balance.' },
        { name: 'Basal Ganglia', text: 'Formation of stable, "unshakeable" postures and dominance habits.' },
        { name: 'Mirror Neurons', text: 'Your biological Wi-Fi for instantaneous reading of others\' intentions.' },
        { name: 'Anterior Cingulate Cortex', text: 'The detector for social signals and emotional accuracy.' },
      ],
    },
    results: {
      title: 'Results & Benefits',
      intro:
        'The outcome of Level 2 is high cognitive selectivity and control over the limbic field. Your progress markers include:',
      items: [
        'Replacing Impulsivity with Conscious Speed: You feel the trajectory of the maneuver rather than simply reacting.',
        '"Winner\'s" Hormonal Profile: Increased DHEA and stabilized testosterone with low cortisol levels.',
        'Social Density: The ability to influence the group\'s emotional state while remaining in a "Ventral Vagus" state (safety and clarity).',
      ],
    },
    researchLinks: [
      { label: 'Neurobiology of Neuroception & Survival', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
      { label: 'Endocrinology of Dominance and Vitality (DHEA vs Cortisol)', url: 'https://pubmed.ncbi.nlm.nih.gov/10744432/' },
      { label: 'Mirror Neurons and Social Coherence', url: 'https://pubmed.ncbi.nlm.nih.gov/17512470/' },
    ],
    glossaryLinks: [
      { label: 'Polyvagal Theory', slug: 'polyvagal-theory' },
      { label: 'Neuroception', slug: 'neuroception' },
      { label: 'HPA Axis', slug: 'hpa-axis' },
      { label: 'DHEA', slug: 'dhea' },
      { label: 'Oxytocin', slug: 'oxytocin' },
      { label: 'Mirror Neurons', slug: 'mirror-neurons' },
      { label: 'Limbic System', slug: 'limbic-system' },
      { label: 'Ventral Vagus', slug: 'ventral-vagus' },
      { label: 'Coherence', slug: 'coherence' },
      { label: 'Emotional Osmosis', slug: 'emotional-osmosis' },
      { label: 'Homeostasis', slug: 'homeostasis' },
    ],
  },
}
