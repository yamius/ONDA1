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
  6: { borderColor: 'border-indigo-500/20', accentColor: 'text-indigo-400' },
  7: { borderColor: 'border-emerald-500/20', accentColor: 'text-emerald-400' },
  8: { borderColor: 'border-violet-500/30', accentColor: 'text-amber-300' },
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
  videoUrl?: string
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
    videoUrl: 'https://www.youtube-nocookie.com/embed/fZjKE81nIJ0?rel=0',
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
    videoUrl: 'https://www.youtube-nocookie.com/embed/3HCOCpWwC9Y?rel=0',
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
    videoUrl: 'https://www.youtube-nocookie.com/embed/TtqoMQoS4WQ?rel=0',
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
    videoUrl: 'https://www.youtube-nocookie.com/embed/qsDhvNptrZA?rel=0',
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
        {
          number: '14',
          label: 'I Channel',
          slug: 'i-channel',
          protocol: 'Protocol: Neurodynamic Conductivity and Fascial Flow',
          goal: 'Objective: The body as conductor — transforming impulses into resource while maintaining homeostasis.',
          work:
            'Work: Eliminating muscular, vascular, and neural congestions. Training the nervous system and tissues to let stress, pain, and intense emotions pass through unhindered. Achieving somatic freedom and high conductivity.',
        },
        {
          number: '15',
          label: 'I Attune',
          slug: 'i-attune',
          protocol: 'Protocol: Neurosomatic Fusion and Collective Ecstasy',
          goal: 'Objective: From individual conductivity to collective resonance — creating a unified neurosomatic circuit ("We-state").',
          work:
            'Work: Dissolving the ego-shell boundaries. Activating oxytocin, mirror neurons, ventral vagal complex, and parietal modulation. Achieving neurosomatic coupling where two organisms function as one.',
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
  6: {
    number: 6,
    badge: '[ LEVEL 6: BRAIN / AQUA II ]',
    name: 'BRAIN / AQUA II',
    subtitle: 'Cognitive Sovereignty and Global Neural Integration — the mind as a high-precision supercomputer.',
    theme: levelThemes[6],
    metaDescription:
      'Level 6 BRAIN / AQUA II: Cognitive sovereignty and neuro-integration. DMN deactivation, metacognition, gamma rhythms. Master the meta-programmer protocol. ONDA Life.',
    intro:
      'At this stage, we transition from managing the "biological spacesuit" to mastering the "command deck" of consciousness. We move from sensory intelligence to Cognitive Sovereignty. The objective is to establish neural distance from the internal dialogue, synchronize the entire brain architecture into a unified system, and activate the capacity for collective resonance. You cease to be a participant in the mental storm and become its Architect.',
    architecture: {
      title: 'System Architecture',
      intro: 'Level 6 integrates metacognitive and network-centric protocols:',
      parts: [
        {
          number: '16',
          label: 'I Witness',
          slug: 'i-witness',
          protocol: 'Protocol: Neural Distance and Metacognitive Monitoring',
          goal: 'Objective: Transitioning from being a hostage of the stream of consciousness to becoming its Meta-Programmer.',
          work:
            'Work: Deactivating the Default Mode Network (DMN) and establishing "neural distance." Using sensory anchors to collapse internal dialogue and transform thoughts into transparent electrical impulses.',
        },
        {
          number: '17',
          label: 'I Integrate',
          slug: 'i-integrate',
          protocol: 'Protocol: Global Neural Integration and Experience Synthesis',
          goal: 'Objective: Achieving maximum neural coherence — the brain as a single, frictionless supercomputer.',
          work:
            'Work: Strengthening horizontal (inter-hemispheric) and vertical (cortex-body) connectivity. Utilizing the corpus callosum and mPFC to reconcile cognitive dissonance and unite logic with intuition.',
        },
        {
          number: '18',
          label: 'I Synchronize',
          slug: 'i-synchronize',
          protocol: 'Protocol: Neuroelectric Synchronization and Collective Intelligence',
          goal: 'Objective: From "I-mode" to "Network Node" — activating inter-brain hyperscanning and collective flow.',
          work:
            'Work: Triggering Gamma rhythms (40 Hz) and the Mirror Neuron System. Achieving neuroelectric phase-locking with others to access "oceanic" scale resources and solutions.',
        },
      ],
    },
    biologicalProtocol: {
      title: 'Biological Protocol',
      intro: 'The neuro-integration technological stack:',
      items: [
        {
          name: 'Metacognitive Labeling',
          text: 'Practices to "tag" mental events, activating the mPFC and stripping thoughts of their emotional charge.',
        },
        {
          name: 'Inter-hemispheric Sync',
          text: 'Exercises for the corpus callosum to ensure seamless data flow between analytical and intuitive centers.',
        },
        {
          name: 'Gamma-Flow Tuning',
          text: 'Techniques to stabilize high-frequency (40 Hz) brain activity for collective insight and rapid learning.',
        },
        {
          name: 'Limbic Decoupling',
          text: 'Training the PFC to register "charged" data without triggering cortisol release or the amygdala.',
        },
      ],
    },
    targetSystems: {
      title: 'Target Systems',
      intro: 'The level engages the following neural structures:',
      items: [
        { name: 'Dorsolateral PFC', text: 'The primary filter for separating vital signals from informational noise.' },
        { name: 'Corpus Callosum', text: 'The bridge for horizontal integration and inter-hemispheric synchronization.' },
        { name: 'Anterior Cingulate Cortex (ACC)', text: 'The internal monitor for detecting rumination and conflicting signals.' },
        { name: 'Mirror Neuron Network', text: 'The biological hardware for pre-verbal understanding and collective resonance.' },
        { name: 'rTPJ (Right Temporoparietal Junction)', text: 'The hub for social navigation and modeling the states of others.' },
      ],
    },
    results: {
      title: 'Results & Benefits',
      intro: 'The outcome of completing Level 6 is attaining "Neural Transparency." Your progress markers include:',
      items: [
        'Increased Cognitive Gap: The ability to choose your response to any thought or impulse.',
        'High Heart-Brain Coherence: Total absence of internal conflict and "energy leaks."',
        'Inter-brain Phase Coherence: The ability to instantly "lock into" the rhythm of a group.',
        'Alpha/Gamma Stabilization: A calm, silent mind capable of high-intensity informational bursts.',
      ],
    },
    researchLinks: [
      { label: 'DMN & self-referential processing', url: 'https://pubmed.ncbi.nlm.nih.gov/17329479/' },
      { label: 'Metacognition & PFC', url: 'https://pubmed.ncbi.nlm.nih.gov/15913566/' },
      { label: 'Gamma oscillations & binding', url: 'https://pubmed.ncbi.nlm.nih.gov/15913566/' },
    ],
    glossaryLinks: [
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Central Executive Network', slug: 'central-executive-network' },
      { label: 'Dorsolateral Prefrontal Cortex', slug: 'dorsolateral-prefrontal-cortex' },
      { label: 'Medial Prefrontal Cortex', slug: 'medial-prefrontal-cortex' },
      { label: 'Anterior Cingulate Cortex', slug: 'anterior-cingulate-cortex' },
      { label: 'Mirror Neurons', slug: 'mirror-neurons' },
      { label: 'Gamma Binding', slug: 'gamma-binding' },
      { label: 'Cognitive Gap', slug: 'cognitive-gap' },
      { label: 'Inter-brain Synchrony', slug: 'inter-brain-synchrony' },
      { label: 'rTPJ', slug: 'right-temporoparietal-junction' },
      { label: 'Neuroplasticity', slug: 'neuroplasticity' },
    ],
  },
  7: {
    number: 7,
    badge: '[ LEVEL 7: DNA / AER II ]',
    name: 'DNA / AER II',
    subtitle: 'DNA Consciousness and Epigenetic Mastery — the human as a Biological Designer.',
    theme: levelThemes[7],
    metaDescription:
      'Level 7 DNA / AER II: DNA consciousness, epigenetics, cellular regeneration, autophagy. Become the Biological Designer. ONDA Life.',
    intro:
      'At this stage, we move beyond thoughts and muscles into the informational core of life. We transition from being "biological objects" to becoming Evolutionary Creators. The objective is to access the billion-year-old library of DNA, activate deep cellular regeneration, and align your personal development with the developmental vector of Life itself. You are no longer a hostage to heredity; you are the architect of your biological future.',
    architecture: {
      title: 'System Architecture',
      intro: 'Level 7 integrates genetic memory, cellular repair, and evolutionary synthesis:',
      parts: [
        {
          number: '19',
          label: 'I Remember',
          slug: 'i-remember',
          protocol: 'Protocol: DNA Consciousness and Evolutionary Memory',
          goal: 'Objective: Transitioning from the "Self" to the "Species" — accessing the 4-billion-year-old legacy of survival and triumph.',
          work:
            'Work: Activating the brainstem and archicortex to transform ancient instincts into conscious resources. Using "Ancestral Breathing" to modulate epigenetic markers and stabilize instinctive calm.',
        },
        {
          number: '20',
          label: 'I Restore',
          slug: 'i-restore',
          protocol: 'Protocol: Cellular Regeneration and DNA Self-Correction',
          goal: 'Objective: Shifting from "Survival and Attrition" to "Deep Renewal" — the Prefrontal Cortex as a control panel for cellular repair.',
          work:
            'Work: Activating autophagy and DNA proofreading enzymes via high Vagal Tone. Modulating telomerase through deep meditative states to restore the system to its "factory settings."',
        },
        {
          number: '21',
          label: 'I Synthesize',
          slug: 'i-synthesize',
          protocol: 'Protocol: Epigenetic Mastery and Planetary Symbiosis',
          goal: 'Objective: From "Consumer of Life" to "Engineer of Life" — turning personal experience into a healthy update for the planetary field.',
          work:
            'Work: Using the Orbitofrontal Cortex and Prospection Networks to model a creative future. Aligning heart-brain coherence with global natural cycles (Schumann frequencies) for planetary resonance.',
        },
      ],
    },
    biologicalProtocol: {
      title: 'Biological Protocol',
      intro: 'The epigenetic and regenerative technological stack:',
      items: [
        {
          name: 'Epigenetic Resonance',
          text: 'Modulating internal states to influence gene expression related to immunity, stress resilience, and longevity.',
        },
        {
          name: 'Autophagy Triggering',
          text: 'Conscious deactivation of the "stress axis" (HPA) to allow lysosomes to recycle cellular waste and cleanse the extracellular matrix.',
        },
        {
          name: 'Archaic Recapitulation',
          text: 'Contacting the oldest layers of the brain to "upcycle" primal fears into instinctive wisdom and biological dignity.',
        },
        {
          name: 'Telomerase Modulation',
          text: 'Stabilizing genetic integrity through ultra-deep relaxation phases that stimulate growth hormone and anabolic repair.',
        },
      ],
    },
    targetSystems: {
      title: 'Target Systems',
      intro: 'The level engages the following biological and genetic structures:',
      items: [
        { name: 'The Genetic Code (Epigenetic Markers)', text: 'The primary site for modulating gene expression through conscious physiological shifts.' },
        { name: 'Vagus Nerve (Ventral Complex)', text: 'The main lever for switching the body into "Trophotropic" (repair and build) mode.' },
        { name: 'Brainstem & Reticular Formation', text: 'Access points to archaic survival algorithms and the "reptilian" brain.' },
        { name: 'Lysosomes & Telomeres', text: 'The cellular hardware for waste recycling and maintaining genetic lifespan.' },
        { name: 'Orbitofrontal Cortex', text: 'The center for higher ethical synthesis and evolutionary decision-making.' },
      ],
    },
    results: {
      title: 'Results & Benefits',
      intro: 'The outcome of completing Level 7 is attaining "Biological Sovereignty." Your progress markers include:',
      items: [
        'Epigenetic Freedom: You are no longer a victim of hereditary scripts or family traumas; you are the editor of your code.',
        'Factory Settings Effect: A palpable sense of clarity, functionality, and "newness" in the tissues and mind.',
        'Evolutionary Validity: An unshakeable sense of "rightness" and belonging to the billion-year-old arrow of life.',
        'Sustainable Flow: The ecstasy of creation becomes the baseline frequency, fueled by healthy eustress rather than anxiety.',
      ],
    },
    researchLinks: [
      { label: 'Epigenetics & gene expression', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
      { label: 'Autophagy & cellular repair', url: 'https://pubmed.ncbi.nlm.nih.gov/28011467/' },
    ],
    glossaryLinks: [
      { label: 'Autophagy', slug: 'autophagy' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Ventral Vagus', slug: 'ventral-vagus' },
      { label: 'HPA Axis', slug: 'hpa-axis' },
      { label: 'Brainstem', slug: 'brainstem' },
      { label: 'Reticular Formation', slug: 'reticular-formation' },
      { label: 'Orbitofrontal Cortex', slug: 'orbitofrontal-cortex' },
      { label: 'Senescence', slug: 'senescence' },
    ],
  },
  8: {
    number: 8,
    badge: '[ LEVEL 8: ATOMIC / IGNIS II ]',
    name: 'ATOMIC / IGNIS II',
    subtitle: 'Quantum Consciousness and Reality Creation — the human as the Zero Point.',
    theme: levelThemes[8],
    metaDescription:
      'The final destination of the ONDA system. Achieve Quantum Sovereignty and realize yourself as the Source of reality through Zero-Point protocols.',
    intro:
      'At this ultimate stage, we deconstruct the final filters of "solidity" and "separation." Level 8 is the return to the Singularity Point, where the vacuum of consciousness is recognized not as emptiness, but as a medium of infinite energy density. You transition from being a "biological object" to the Reality Creator, realizing that everything you experience happens within the field of your own consciousness. You are the space from which existence erupts.',
    architecture: {
      title: 'System Architecture',
      intro: 'Level 8 integrates vibrational tuning, non-local awareness, and the singularity of being:',
      parts: [
        {
          number: '22',
          label: 'I Am Vibration',
          slug: 'i-am-vibration',
          protocol: 'Protocol: Quantum Consciousness and Energy Resonance',
          goal: 'Objective: Shifting from object-based to wave-based perception — realizing the body as 99.9% energy field.',
          work:
            'Work: Activating the Pineal Gland as a piezoelectric transducer and stabilizing high-frequency Gamma Rhythms (40+ Hz). Deconstructing the "biographical ego" (DMN) to perceive the interface of reality directly.',
        },
        {
          number: '23',
          label: 'I Am Wholeness',
          slug: 'i-am-wholeness',
          protocol: 'Protocol: Non-local Unity and Quantum Self-Awareness',
          goal: 'Objective: Collapsing the "Subject-Object" duality — becoming a self-luminous field of consciousness.',
          work:
            'Work: Integrating all previously mastered levels (Terra, Aqua, Aer, Ignis) into a single, non-dual structure. Erasing the illusion of separateness through the deactivation of the "ego-censor" in the Dorsolateral PFC.',
        },
        {
          number: '24',
          label: 'I Am the Source',
          slug: 'i-am-the-source',
          protocol: 'Protocol: Consciousness Singularity and Quantum Creation',
          goal: 'Objective: Returning to the Singularity — transitioning from "I am someone" to the "Source from which someone arises."',
          work:
            'Work: Achieving the "Neural Activity Zero Point" — a state of consciousness preceding thought. Utilizing the Thalamus as a gateway to distribute the signals of Being from potential to manifestation.',
        },
      ],
    },
    biologicalProtocol: {
      title: 'Biological Protocol',
      intro: 'The quantum-biological and singularity technological stack:',
      items: [
        {
          name: 'Deconstruction of Density',
          text: 'Scanning the "void" within the atoms of the body, shifting focus from solid tissue to the energy space within.',
        },
        {
          name: 'Gamma-Phase Synchronization',
          text: 'Techniques to achieve nearly 100% brainwave coherence, creating a state of "superconductivity" in the nervous system.',
        },
        {
          name: 'Zero Point Practice',
          text: 'Holding attention in the silence before a thought arises to enter the space of Pure Awareness.',
        },
        {
          name: 'Radiation of Creation',
          text: 'Consciously radiating intent (Clarity, Creation) from the center of being to modulate the external informational field.',
        },
      ],
    },
    targetSystems: {
      title: 'Target Systems',
      intro: 'The level engages the final integration of the consciousness circuit:',
      items: [
        {
          name: 'Pineal Gland',
          text: 'The primary transducer for subtle electromagnetic and vibrational signals.',
        },
        {
          name: 'Thalamo-cortical Resonance',
          text: 'The central hub distributing the signals of "Being" into the manifested world.',
        },
        {
          name: 'Default Mode Network (Annihilation Mode)',
          text: 'The total absence of ego-noise and biographical programming.',
        },
        {
          name: 'Parietal Lobe (Deactivation)',
          text: 'Dissolving spatial orientation to experience transpersonal, non-local unity.',
        },
        {
          name: 'Reticular Formation',
          text: 'The ultimate filter that allows the frequency of the "Source" to reach consciousness.',
        },
      ],
    },
    results: {
      title: 'Results & Benefits',
      intro: 'The outcome of completing Level 8 is attaining "Quantum Sovereignty." Your progress markers include:',
      items: [
        'Fundamental Peace: A baseline state of silence that is independent of any external circumstances.',
        'Direct Authorship: The realization of yourself as the cause of your states; life "emanates" from you rather than happening to you.',
        'Instant Realignment: The ability to annihilate any stress or noise in the "zero point" of your presence within nanoseconds.',
        'Radiation of Presence: A field so coherent that your mere presence harmonizes the surrounding environment and orders chaos.',
      ],
    },
    researchLinks: [
      { label: 'Gamma rhythms & consciousness', url: 'https://pubmed.ncbi.nlm.nih.gov/10677593/' },
      { label: '40 Hz oscillations & perception', url: 'https://pubmed.ncbi.nlm.nih.gov/8028764/' },
    ],
    glossaryLinks: [
      { label: 'Thalamus', slug: 'thalamus' },
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Reticular Formation', slug: 'reticular-formation' },
      { label: 'Dorsolateral PFC', slug: 'dorsolateral-prefrontal-cortex' },
      { label: 'Gamma Binding', slug: 'gamma-binding' },
      { label: 'Posterior Parietal Cortex', slug: 'posterior-parietal-cortex' },
    ],
  },
}
