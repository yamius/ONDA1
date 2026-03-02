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
  3: { borderColor: 'border-sky-500/20', accentColor: 'text-sky-400' },
  4: { borderColor: 'border-amber-500/20', accentColor: 'text-amber-400' },
  5: { borderColor: 'border-rose-500/20', accentColor: 'text-rose-400' },
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
  metaDescription?: string
}

export const levelsData: Record<number, LevelData> = {
  1: {
    number: 1,
    badge: '[ LEVEL 1: BODY / TERRA ]',
    name: 'BODY / TERRA',
    subtitle: 'Biocomputer Architecture: From Survival to Autonomy',
    theme: levelThemes[1],
    metaDescription:
      'Level 1: Homeostasis, interoception, HRV. Breathing, diaphragm, vagal tone — the foundation of parasympathetic activation. Calibrate your biological zero.',
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
    metaDescription:
      'Level 2: Emotional mastery. HPA axis, DHEA, mirror neurons — neuroception, ventral vagus, social resonance. From maneuverability to calm dominance.',
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
  3: {
    number: 3,
    badge: '[ LEVEL 3: MIND / AER ]',
    name: 'MIND / AER',
    subtitle: 'Mind Architecture: From Reactivity to Design',
    theme: levelThemes[3],
    metaDescription:
      'Level 3: Deep Work and productivity. PFC, norepinephrine, gamma binding — cognitive clarity. Train focus, pattern recognition, and mental simulation for entrepreneurs and IT professionals.',
    intro:
      'Level 3 is the level of cognitive sovereignty. We rise above instincts and limbic reactions to transform attention from a chaotic process into a controlled instrument. Here, the mind takes on the role of the lead conductor of the biocomputer.\n\nAt this stage, we train the brain to extract the "signal" from the "noise," maintain focus under information overload, and use imagination as biological software to rewrite reality.',
    architecture: {
      title: 'System Architecture',
      intro: 'Level 3 integrates three consciousness management algorithms:',
      parts: [
        {
          number: '07',
          label: 'I Distinguish',
          slug: 'i-distinguish',
          protocol: 'Protocol: S/N Optimization',
          goal: 'Objective: Creating a "cognitive gap" between stimulus and reaction.',
          work:
            'Mechanism: Tuning the Thalamus—the primary gatekeeper of sensory streams. We train the brain to separate objective facts from subjective noise, achieving crystal-clear perceptual clarity.',
        },
        {
          number: '08',
          label: 'I Focus',
          slug: 'i-focus',
          protocol: 'Protocol: Neural Resilience',
          goal: 'Objective: Shifting from reactive attention to voluntary resource management.',
          work:
            'Mechanism: Activating the Dorsal Attention Network (DAN) and suppressing the Default Mode Network (DMN—"mind-wandering"). This is "Deep Work" mode, allowing deep immersion without wasting energy on distractions.',
        },
        {
          number: '09',
          label: 'I Shape the Vision',
          slug: 'i-shape-the-vision',
          protocol: 'Protocol: Mental Simulation',
          goal: 'Objective: Engineering the future at the neural level.',
          work:
            'Mechanism: Launching internal "rendering." We utilize the hippocampus and the prefrontal cortex to create predictive models (Predictive Coding). Imagination here is not a fantasy but an action program for the RAS (Reticular Activating System).',
        },
      ],
    },
    biologicalProtocol: {
      title: 'Biological Protocol',
      intro: 'The cognitive control technological stack:',
      items: [
        {
          name: 'Cognitive Gap',
          text: 'Increasing the pause between an event and an automatic reaction to allow for freedom of choice.',
        },
        {
          name: 'Cholinergic Modulation',
          text: 'Utilizing acetylcholine to literally "highlight" necessary neural connections during focus.',
        },
        {
          name: 'Gamma Binding',
          text: 'Synchronizing neurons at gamma frequency to assemble scattered fragments of experience into a single insight.',
        },
        {
          name: 'Proactive Programming (RAS)',
          text: 'Tuning the brain\'s filters to automatically seek opportunities that match your internal vision.',
        },
      ],
    },
    targetSystems: {
      title: 'Target Systems',
      intro: 'The level engages the following neural structures:',
      items: [
        { name: 'DLPFC (Dorsolateral PFC)', text: 'The command center for attention and working memory.' },
        { name: 'Thalamus', text: 'The gatekeeper of sensory streams, filtering out the redundant.' },
        { name: 'ACC (Anterior Cingulate Cortex)', text: 'A high-precision detector of errors and differences.' },
        { name: 'Locus Coeruleus', text: 'Regulator of alertness and neuroplasticity via norepinephrine.' },
      ],
    },
    results: {
      title: 'Results & Benefits',
      intro:
        'The outcome of Level 3 is the attainment of mental autonomy and "Neural Resilience." Your progress markers include:',
      items: [
        'Pattern Recognition: The ability to recognize event patterns before they hijack your attention.',
        'Deep Work Efficiency: Sustained focus in 90/20 cycles without cognitive burnout.',
        'Biological Belief: Changes in Galvanic Skin Response (GSR)—the body begins to "believe" in the created mental image as if it were real.',
        'Load Reduction: A radical decrease in cognitive costs by "sharpening" the tools of perception.',
      ],
    },
    researchLinks: [
      { label: 'Prefrontal cortex & attention', url: 'https://pubmed.ncbi.nlm.nih.gov/17329479/' },
      { label: 'Norepinephrine & locus coeruleus', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
      { label: 'Gamma oscillations & binding', url: 'https://pubmed.ncbi.nlm.nih.gov/15913566/' },
    ],
    glossaryLinks: [
      { label: 'Cognitive Gap', slug: 'cognitive-gap' },
      { label: 'Dorsolateral Prefrontal Cortex', slug: 'dorsolateral-prefrontal-cortex' },
      { label: 'Thalamus', slug: 'thalamus' },
      { label: 'Norepinephrine', slug: 'norepinephrine' },
      { label: 'Acetylcholine', slug: 'acetylcholine' },
      { label: 'Gamma Binding', slug: 'gamma-binding' },
      { label: 'Predictive Coding', slug: 'predictive-coding' },
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Reticular Activating System', slug: 'reticular-activating-system' },
      { label: 'Flow State', slug: 'flow-state' },
    ],
  },
  4: {
    number: 4,
    badge: '[ LEVEL 4: SOCIETY / IGNIS ]',
    name: 'SOCIETY / IGNIS',
    subtitle: 'Oxytocin, Mirror Neurons, and Ventral Vagus — the fuel of social resonance.',
    theme: levelThemes[4],
    metaDescription:
      'Level 4: Social Intelligence, Leadership Biology, Team Synergy. Oxytocin, mirror neurons, ventral vagus — neurobiology of empathy. From self-expression to collective mind.',
    intro:
      'Social Intelligence: From Self-Expression to Collective Mind\n\nLevel 4 is the stage of social realization and tempering. Here, the "internal sketch" created at the Mind level passes through the filter of the external environment. We transform the body into a powerful transmitter of ideas, and human interaction into the art of resonance.\n\nAt this level, we master the biology of influence, empathy, and group synergy, transitioning from personal survival to the state of Homo Creativus (The Creative Human).',
    architecture: {
      title: 'System Architecture',
      intro: 'Level 4 integrates three stages of social evolution:',
      parts: [
        {
          number: '10',
          label: 'I Express',
          slug: 'i-express',
          protocol: 'Protocol: Neuroendocrinology of Influence',
          goal: 'Objective: Overcoming social paralysis and attaining a sovereign voice.',
          work:
            'Mechanism: Synchronizing the heart (feelings), the brain (vision), and the throat (the instrument of manifestation). We use cognitive reappraisal to turn stage fright into drive and the voice into a tool for physical resonance.',
        },
        {
          number: '11',
          label: 'I Interact',
          slug: 'i-interact',
          protocol: 'Protocol: Empathic Regulation',
          goal: 'Objective: Mastery of the "space between." Moving from conflict to interference.',
          work:
            'Mechanism: Activating the "social brain" (Theory of Mind). We learn to sense boundaries—both our own and others\'—in real-time, creating a nourishing interaction that empowers both participants.',
        },
        {
          number: '12',
          label: 'I Co-Create',
          slug: 'i-co-create',
          protocol: 'Protocol: Collective Intelligence',
          goal: 'Objective: Transforming a group into a living neural network.',
          work:
            'Mechanism: Achieving Neural Coupling. We learn to synchronize breathing and brain rhythms within a team, reaching collective insights and synergies inaccessible to the individual mind.',
        },
      ],
    },
    biologicalProtocol: {
      title: 'Biological Protocol',
      intro: 'The social interaction technological stack:',
      items: [
        {
          name: 'Cognitive Reappraisal',
          text: 'A PFC technique to physiologically dampen amygdala activity (fear) and replace it with excitement.',
        },
        {
          name: 'Oxytocin Loops',
          text: 'Managing eye contact and micro-expressions to build instantaneous biological trust.',
        },
        {
          name: 'Inter-brain Synchrony',
          text: 'The phenomenon where partners\' brain rhythms align for seamless joint task execution.',
        },
        {
          name: 'DMN Inhibition',
          text: 'Suppressing the brain\'s "ego-network" to shift from protecting personal boundaries to realizing a common goal.',
        },
      ],
    },
    targetSystems: {
      title: 'Target Systems',
      intro: 'The level engages the following neural structures:',
      items: [
        { name: "Broca's & Wernicke's Areas", text: 'Centers for speech structure assembly and delivery.' },
        { name: 'Mirror Neurons', text: 'The biological basis for empathy and intuitive reading of intentions.' },
        { name: 'Orbitofrontal Cortex', text: 'Modulator of ethical choices and social harmony in the moment.' },
        { name: 'rTPJ (Right Temporoparietal Junction)', text: 'Key node for managing the "mental model" of others.' },
      ],
    },
    results: {
      title: 'Results & Benefits',
      intro:
        'The outcome of Level 4 is entering a space of social freedom and co-creation. Your progress markers include:',
      items: [
        'Sovereign Expression: Your voice gains weight, and your self-expression becomes clear and authentic, free of jaw or throat tension.',
        'Empathic Precision: The ability to "read" a partner\'s state before it is voiced.',
        'Synergetic Mastery: The skill of integrating into group processes of any complexity while maintaining personal sovereignty.',
        'Hormonal Glue: Establishing stable oxytocin and endorphin reward circuits for collective activities.',
      ],
    },
    researchLinks: [
      { label: 'Mirror neurons & social cognition', url: 'https://pubmed.ncbi.nlm.nih.gov/17512470/' },
      { label: 'Oxytocin & social bonding', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
      { label: 'Inter-brain synchrony', url: 'https://pubmed.ncbi.nlm.nih.gov/15913566/' },
    ],
    glossaryLinks: [
      { label: 'Ventral Vagus', slug: 'ventral-vagus' },
      { label: "Broca's Area", slug: 'brocas-area' },
      { label: 'Mirror Neurons', slug: 'mirror-neurons' },
      { label: 'Theory of Mind', slug: 'theory-of-mind' },
      { label: 'Oxytocin', slug: 'oxytocin' },
      { label: 'Inter-brain Synchrony', slug: 'inter-brain-synchrony' },
      { label: 'Neural Coupling', slug: 'neural-coupling' },
      { label: 'Cognitive Reappraisal', slug: 'cognitive-reappraisal' },
      { label: 'rTPJ', slug: 'right-temporoparietal-junction' },
      { label: 'Endorphins', slug: 'endorphins' },
    ],
  },
  5: {
    number: 5,
    badge: '[ LEVEL 5: NEURO-SOMATIC MIND / SENSORY INTELLIGENCE ]',
    name: 'NEURO-SOMATIC MIND / SENSORY INTELLIGENCE',
    subtitle: 'Interoceptive Accuracy and Sensory Expansion — the body as a high-precision antenna.',
    theme: levelThemes[5],
    metaDescription:
      'Level 5: Sensory Intelligence. Interoception, insula, C-tactile fibers. Transform the body into a high-precision antenna for internal and external data.',
    intro:
      'At this stage, we return to the "biological spacesuit"—not as passive passengers, but as expert pilots. We transition from simple self-observation to high-precision Sensory Intelligence. The objective is to transform the body from an object that needs maintenance into a perfect "antenna" capable of reading the subtlest data from both internal and external environments.',
    architecture: {
      title: 'System Architecture',
      intro: 'Level 5 integrates sensory precision protocols:',
      parts: [
        {
          number: '13',
          label: 'I Sense',
          slug: 'i-sense',
          protocol: 'Protocol: Interoceptive Accuracy and Sensory Expansion',
          goal: 'Objective: Transitioning from "Survival Mode" to total "Presence Mode" through sensory anchors.',
          work:
            'Work: Activating the insular cortex, somatosensory cortex, and thalamic filters. Engaging C-tactile fibers and proprioceptive integration to create an ultra-precise body map.',
        },
      ],
    },
    biologicalProtocol: {
      title: 'Biological Protocol',
      intro: 'The sensory expansion technological stack:',
      items: [
        {
          name: 'Interoceptive Accuracy',
          text: 'Practices to activate the insula, allowing you to hear pulsation, peristalsis, and micro-movements beneath the skin.',
        },
        {
          name: 'Sensory Discrimination',
          text: 'Exercises to sharpen exteroception through the conscious management of thalamic filters.',
        },
        {
          name: 'DMN Suppression via Sensories',
          text: 'Shifting attention to the "direct wire" of sensations to deactivate mental rumination.',
        },
        {
          name: 'Embodiment Clarity',
          text: 'Eliminating the delay between the body\'s signal and its realization.',
        },
      ],
    },
    targetSystems: {
      title: 'Target Systems',
      intro: 'The level engages the following neural structures:',
      items: [
        { name: 'Insular Cortex', text: 'The center for translating physiological signals into conscious sensations.' },
        { name: 'Parasympathetic Nervous System', text: 'Creating a background of safety for maximum sensitivity.' },
        { name: 'Right Hemisphere', text: 'Holistic, unified perception of the bodily experience.' },
        { name: 'Somatosensory Cortex (S1/S2)', text: 'Sharpening tactile perception and stimulus discrimination.' },
        { name: 'Thalamus', text: 'Sensory gateway—lowering filtration thresholds for detailed information.' },
        { name: 'C-Tactile Fibers', text: 'Pathways of "emotional" touch linking skin to well-being centers.' },
      ],
    },
    results: {
      title: 'Results & Benefits',
      intro: 'The outcome of completing Level 5 is attaining "Bodily Transparency." Your progress markers include:',
      items: [
        'Increased gray matter density in the insular cortex.',
        'Reduced resting muscle tone.',
        'Normalization of Galvanic Skin Response (GSR) for autonomic stability.',
        'The body perceived not as noise, but as a high-precision data stream.',
      ],
    },
    researchLinks: [
      { label: 'Interoception & Insula', url: 'https://pubmed.ncbi.nlm.nih.gov/12030437/' },
      { label: 'C-tactile fibers & affective touch', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
    ],
    glossaryLinks: [
      { label: 'Interoception', slug: 'interoception' },
      { label: 'Insular Cortex', slug: 'insular-cortex' },
      { label: 'Thalamus', slug: 'thalamus' },
      { label: 'Galvanic Skin Response', slug: 'galvanic-skin-response' },
      { label: 'Body Schema', slug: 'body-schema' },
      { label: 'C-Tactile Fibers', slug: 'c-tactile-fibers' },
      { label: 'Proprioception', slug: 'proprioception' },
    ],
  },
}
