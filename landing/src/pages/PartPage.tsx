import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { levelsData } from '../data/levels'
import { PART_SEO } from '../data/part-seo'
import { GlossaryTooltip } from '../components/GlossaryTooltip'

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/og-preview.png`

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const DEFAULT_DESCRIPTION =
  'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.'

/** Intro block for parts that need inline links (e.g. internal linking) */
type IntroBlock = { type: 'text'; content: string } | { type: 'link'; content: string; href: string }

export const parts: Record<string, {
  badge: string
  title: string
  titleHighlight: string
  subtitle: string
  metaDescription?: string
  intro: string
  /** Optional: intro as blocks for parts needing inline links. When set, overrides intro render. */
  introBlocks?: IntroBlock[][]
  /** Optional: YouTube video URL (shorts or regular). Rendered after intro. */
  videoUrl?: string
  /** Optional: FAQ for "People also ask" SEO. */
  faq?: { question: string; answer: string }[]
  protocol: { title: string; intro: string; items: { name: string; text: string }[] }
  targets: { intro: string; items: { name: string; text: string }[] }
  results: { intro: string; items: string[] }
  outro: string
  glossaryLinks: { label: string; slug: string }[]
  researchLinks?: { label: string; url: string }[]
}> = {
  'i-am': {
    badge: '[ PART 1 — LEVEL 1: BODY / TERRA ]',
    title: 'I',
    titleHighlight: 'Am',
    subtitle: 'Protocol: Homeostasis and Primary Interoception',
    metaDescription: 'Part 1: Homeostasis and primary interoception. Calibrate your biological zero — HRV, vagal tone, diaphragmatic release. ONDA Life.',
    intro:
      'We descend into the very foundation\u2014the \u201cbiological zero.\u201d This is the level of cellular survival, where consciousness is not yet separated from metabolic processes. The primary goal of this stage is to shift the system from a mode of \u201canxious anticipation\u201d and deficit into a mode of \u201csafe being.\u201d\n\nAt this level, we work with the most ancient brain structures that govern life before we even begin to think about it: primary interoception (the connection between the brainstem and the insula), vagal tone (exiting the \u201cfreeze\u201d or \u201cflight\u201d response), sensory navigation (thalamic calibration), and the activation of proto-consciousness through contact with physiological rhythms.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'This protocol aims to calibrate the baseline settings of survival, transforming the body from a \u201cbesieged fortress\u201d into a \u201csafe home\u201d:',
      items: [
        {
          name: 'Homeostatic Alignment',
          text: 'Working with the hypothalamus to establish internal equilibrium and ensure the efficient distribution of the body\u2019s resources.',
        },
        {
          name: 'Interoceptive Calibration',
          text: 'Practices designed to develop the ability to feel pulsation, pressure, and the movement of internal organs as the bedrock of self-awareness.',
        },
        {
          name: 'Sensory Filtering & Psychoneuroimmunology (PNI)',
          text: 'Training the thalamus to filter out redundant stimuli, thereby reducing the load on the nervous system. Leveraging neuroplasticity to strengthen the link between mental states and immune responses at the cellular level.',
        },
        {
          name: 'Diaphragmatic Release',
          text: 'Releasing spasms in the primary respiratory muscle to free the vagus nerve and trigger deep parasympathetic recovery.',
        },
      ],
    },
    targets: {
      intro: 'The main objective is the activation of \u201cproto-consciousness\u201d and the creation of an unconditional sense of safety.',
      items: [
        { name: 'Insular Cortex (Insula)', text: 'The primary hub for interoception and self-sensing.' },
        { name: 'Brainstem & Hypothalamus', text: 'Control centers for life support and homeostasis.' },
        { name: 'Vagus Nerve & Diaphragm', text: 'The highway of the parasympathetic system and the motor of breath.' },
      ],
    },
    results: {
      intro: 'The outcome of completing Part 1 is the discovery of the \u201cpoint of stillness.\u201d Your biological markers of progress include:',
      items: [
        'Increased Heart Rate Variability (HRV).',
        'Reduced levels of basal cortisol (the \u201cstress hormone\u201d).',
        'Restoration of rhythmic peristalsis and stable, deep breathing.',
      ],
    },
    outro:
      'You are teaching your nervous system to perceive safety and the pure fact of existence without any external conditions. This is the state from which any purposeful movement (\u201cI Move\u201d) and any transformation (\u201cI Adapt\u201d) become possible.',
    glossaryLinks: [
      { label: 'Brainstem', slug: 'brainstem' },
      { label: 'Homeostasis', slug: 'homeostasis' },
      { label: 'Primary Interoception', slug: 'primary-interoception' },
      { label: 'Interoception', slug: 'interoception' },
      { label: 'Metabolism', slug: 'metabolism' },
      { label: 'Brain', slug: 'brain' },
      { label: 'Mind', slug: 'mind' },
      { label: 'Insular Cortex', slug: 'insular-cortex' },
      { label: 'Insula', slug: 'insula' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Thalamus', slug: 'thalamus' },
      { label: 'Hypothalamus', slug: 'hypothalamus' },
      { label: 'Proto-consciousness', slug: 'proto-consciousness' },
      { label: 'Physiological Rhythms', slug: 'physiological-rhythms' },
      { label: 'Psychoneuroimmunology', slug: 'psychoneuroimmunology' },
      { label: 'Diaphragm', slug: 'diaphragm' },
      { label: 'Parasympathetic System', slug: 'parasympathetic-nervous-system' },
      { label: 'Sympathetic System', slug: 'sympathetic-nervous-system' },
      { label: 'Cortisol', slug: 'cortisol' },
      { label: 'Heart Rate Variability', slug: 'heart-rate-variability' },
      { label: 'Peristalsis', slug: 'peristalsis' },
      { label: 'Biocomputer', slug: 'biocomputer' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
      { label: 'Molecular Psychology', slug: 'molecular-psychology' },
    ],
    researchLinks: [
      { label: 'Diaphragmatic breathing & HRV', url: 'https://pubmed.ncbi.nlm.nih.gov/19246382/' },
      { label: 'HRV & vagal tone', url: 'https://pubmed.ncbi.nlm.nih.gov/19463818/' },
      { label: 'Polyvagal Theory', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
    ],
  },
  'i-move': {
    badge: '[ PART 2 — LEVEL 1: BODY / TERRA ]',
    title: 'I',
    titleHighlight: 'Move',
    subtitle: 'Protocol: Rhythmic Coherence and Primary Locomotion',
    metaDescription: 'Part 2: Rhythmic coherence and CPG. Awaken primary motor skills — fluid body, effortless movement. ONDA Life.',
    intro:
      'The transition from the static state of \u201cI Am\u201d to the dynamic \u201cI Flow.\u201d At this stage, we awaken primary motor skills and master navigation within the flow. This is the engineering of the \u201cfluid body,\u201d where movement does not require exhausting effort but is born from resonance with the environment.\n\nWe descend to the level of \u201cfish intelligence\u201d\u2014activating ancient brainstem structures and spinal cord circuits responsible for automatic grace and survival: activating CPGs (Central Pattern Generators), engaging primary motor circuits of the brainstem, working with spinal micro-movements, and learning to navigate through the flow of incoming stimuli.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'This protocol transforms the \u201cFish\u201d metaphor into a precise sequence for tuning neural fluidity:',
      items: [
        {
          name: 'Spinal Patterns (CPG)',
          text: 'Activating centers in the spinal cord to create natural, \u201cautopilot\u201d locomotion. Movement becomes as effortless as swimming.',
        },
        {
          name: 'Vestibulo-Ocular Reflex (VOR)',
          text: 'Stabilizing gaze while the head is in motion. This is the foundation for visual navigation and the feeling of stability within the flow.',
        },
        {
          name: 'Rhythmic Coherence',
          text: 'Increasing Heart Rate Variability (HRV) by synchronizing axial movements with the respiratory cycle.',
        },
        {
          name: 'Intermuscular Coordination and Energy Efficiency',
          text: 'Transferring force through fascial chains, allowing the whole body to move as a single vector. Training the brain to use the minimal electrical impulse to achieve the maximum biomechanical result.',
        },
      ],
    },
    targets: {
      intro: 'The primary goal is to launch the body\u2019s wave dynamics and radically reduce the coefficient of internal resistance.',
      items: [
        { name: 'The Spine', text: 'The axial skeleton as the primary waveguide for movement.' },
        { name: 'Spinal Neural Circuits and Cerebellum', text: 'Centers for rhythmic movement; modulating smoothness and eliminating \u201cnoise.\u201d' },
        { name: 'Vestibular System', text: 'The primary gyroscope for orientation within the flow.' },
      ],
    },
    results: {
      intro: 'The outcome of completing Part 2 is the attainment of \u201cneural fluidity.\u201d Your biological markers of progress include:',
      items: [
        'The disappearance of \u201cjerky\u201d movements (micro-coordination).',
        'Improved fascial gliding and synovial joint lubrication.',
        'Synchronization of breath and movement into a single cycle.',
      ],
    },
    outro:
      'You stop \u201cpushing\u201d yourself through space and begin to move within it, utilizing inertia, rhythm, and the natural curves of the spine. The body becomes responsive, and navigation becomes intuitive.',
    glossaryLinks: [
      { label: 'Brainstem', slug: 'brainstem' },
      { label: 'Central Pattern Generators', slug: 'central-pattern-generators' },
      { label: 'Vestibulo-Ocular Reflex', slug: 'vestibulo-ocular-reflex' },
      { label: 'Vestibular System', slug: 'vestibular-system' },
      { label: 'Cerebellum', slug: 'cerebellum' },
      { label: 'Fascia', slug: 'fascia' },
      { label: 'Heart Rate Variability', slug: 'heart-rate-variability' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Physiological Rhythms', slug: 'physiological-rhythms' },
      { label: 'Brain', slug: 'brain' },
      { label: 'Parasympathetic System', slug: 'parasympathetic-nervous-system' },
      { label: 'Biocomputer', slug: 'biocomputer' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
    researchLinks: [
      { label: 'HRV & rhythmic coherence', url: 'https://pubmed.ncbi.nlm.nih.gov/19463818/' },
      { label: 'Resonance breathing', url: 'https://pubmed.ncbi.nlm.nih.gov/19246382/' },
    ],
  },
  'i-adapt': {
    badge: '[ PART 3 — LEVEL 1: BODY / TERRA ]',
    title: 'I',
    titleHighlight: 'Adapt',
    subtitle: 'Protocol: Gravity Mastery and Interoception',
    metaDescription: 'Part 3: Gravity mastery and body armor release. From swimming to support — interoception and energy efficiency. ONDA Life.',
    intro:
      'This stage is dedicated to mastering gravity and transitioning from the state of \u201cswimming\u201d (complete dependence on the environment) to \u201csupport\u201d (attaining internal autonomy). Here, we lay the foundation for how our body interacts with the physical world. We move from passive survival to the active management of our position in space.\n\nFrom a neurophysiological perspective, we are working with the deepest, automated processes. The primary goal is to tune the brainstem and reticular formation, as well as to activate the primary sensorimotor cortex: managing muscle tone (optimizing the balance between flexors and extensors), learning to switch rapidly between states of \u201crelaxation/fluidity\u201d and \u201ctone/stability,\u201d and activating spinal pattern generators for natural locomotion.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'The protocol is aimed at a deep alignment of the body with Earth\u2019s physical constants. Each practice at this stage has a clear scientific basis:',
      items: [
        {
          name: 'Rhythmic Coherence',
          text: 'Synchronizing breathing cycles with micro-movements to tune cardiovascular resonance.',
        },
        {
          name: 'Spinal Patterns (CPG)',
          text: 'Working with Central Pattern Generators in the spinal cord. We transform the metaphor of \u201cswimming in the ocean\u201d into an algorithm for light and efficient movement.',
        },
        {
          name: 'Vestibulo-Ocular Reflex (VOR)',
          text: 'Training the coupling of eye and head movements to stabilize gaze and orientation.',
        },
        {
          name: 'Interoception and Energy Efficiency',
          text: 'Developing the skill of perceiving internal states (organ signals, pressure, heartbeat) as the foundation for emotional intelligence. Training the nervous system to perform tasks with the minimum necessary muscular effort, eliminating parasitic tension.',
        },
      ],
    },
    targets: {
      intro: 'The \u201ctechnological stack\u201d of Part 3 is directed at optimizing the proprioceptive feedback loop (the brain-muscle-brain chain).',
      items: [
        { name: 'Vestibular Apparatus', text: 'Spatial stabilization and navigation.' },
        { name: 'Cerebellum', text: 'Coordination and precision of movement.' },
        { name: 'Vagus Nerve (Ventral Branch)', text: 'Social engagement and a biological sense of safety.' },
      ],
    },
    results: {
      intro: 'The outcome of completing Part 3 is the deep adaptation of the body to the physical world. Your biological markers of progress include:',
      items: [
        'Reduction of muscular tension (the \u201cbody armor\u201d).',
        'Stabilization of breathing rhythms under physical exertion.',
        'Increased Heart Rate Variability (HRV).',
      ],
    },
    outro:
      'You transition from \u201cswimming\u201d (a chaotic response to external stimuli) to \u201csupport\u201d (the ability to maintain centeredness and stability in any changing environment). You transform your body from an object acted upon by gravity into a subject that utilizes gravity as a resource.',
    glossaryLinks: [
      { label: 'Brainstem', slug: 'brainstem' },
      { label: 'Interoception', slug: 'interoception' },
      { label: 'Primary Interoception', slug: 'primary-interoception' },
      { label: 'Central Pattern Generators', slug: 'central-pattern-generators' },
      { label: 'Vestibulo-Ocular Reflex', slug: 'vestibulo-ocular-reflex' },
      { label: 'Vestibular System', slug: 'vestibular-system' },
      { label: 'Cerebellum', slug: 'cerebellum' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Heart Rate Variability', slug: 'heart-rate-variability' },
      { label: 'Physiological Rhythms', slug: 'physiological-rhythms' },
      { label: 'Brain', slug: 'brain' },
      { label: 'Fascia', slug: 'fascia' },
      { label: 'Neurophysiology', slug: 'neurophysiology' },
      { label: 'Reticular Formation', slug: 'reticular-formation' },
      { label: 'Sensorimotor Cortex', slug: 'sensorimotor-cortex' },
      { label: 'Locomotion', slug: 'locomotion' },
      { label: 'Body Armor', slug: 'body-armor' },
      { label: 'Biocomputer', slug: 'biocomputer' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
    researchLinks: [
      { label: 'Interoception & insula', url: 'https://pubmed.ncbi.nlm.nih.gov/12030437/' },
      { label: 'HRV & vagal tone', url: 'https://pubmed.ncbi.nlm.nih.gov/19463818/' },
    ],
  },
  'i-maneuver': {
    badge: '[ PART 4 — LEVEL 2: EMOTIONS / AQUA ]',
    title: 'I',
    titleHighlight: 'Maneuver',
    subtitle: 'Protocol: The Maneuverability of the \u201cSmall Mammal\u201d',
    metaDescription: 'Part 4: Neuroception and polyvagal drift. Small mammal maneuverability — cortisol and adrenaline as fuel. ONDA Life.',
    intro:
      'Welcome to the stage where biological flexibility transforms into applied mastery. If the previous stages were about learning to simply \u201cbe,\u201d here we learn to be in motion.\n\nAt the core of Part 4 lies the evolutionary gift of small mammals: the ability for instantaneous evasion, subtle navigation, and micro-avoidance of threats without falling into paralyzing stress. We translate maneuverability from a matter of \u201cluck\u201d into a measurable biological skill.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'Our practices are based on the four pillars of modern science:',
      items: [
        {
          name: 'Polyvagal Theory',
          text: 'Training the nervous system to \u201cdrift\u201d smoothly between the Ventral Vagus (the state of social engagement and safety) and the Sympathetic system (energy for action). Utilizing sympathetic tone for a maneuver without collapsing into panic or rage.',
        },
        {
          name: 'Neurobiology and Neuroception',
          text: 'We train the chain: Reticular Formation \u2192 Thalamus \u2192 Motor Cortex. This allows the brain to read environmental changes (neuroception) and issue a reaction \u201cbefore the thought,\u201d bypassing slow cognitive filters.',
        },
        {
          name: 'Neuroendocrinology',
          text: 'Directly impacting the HPA axis (hypothalamus-pituitary-adrenal). We teach the body to control the release of cortisol and adrenaline, turning them from poison into fuel for precision.',
        },
        {
          name: 'Lymphology',
          text: 'Using muscle tone as a natural pump to clear the body of stress metabolic byproducts, ensuring physical freshness even under high-load conditions.',
        },
      ],
    },
    targets: {
      intro: 'Instead of rigid reflexes, we develop sensorimotor emotional reactivity.',
      items: [
        { name: 'Vestibular Apparatus', text: 'Precise orientation within chaos.' },
        { name: 'Proprioception', text: 'A sense of trajectory and the boundaries of one\u2019s \u201csafety bubble.\u201d' },
        { name: 'Diffuse Perception', text: '360\u00b0 \u201cpole attention,\u201d allowing one to see the world as a flow of opportunities rather than obstacles.' },
      ],
    },
    results: {
      intro: 'The outcome of completing Part 4 is high cognitive selectivity. You gain the ability to:',
      items: [
        'Reduce impulsivity, replacing it with conscious speed.',
        'Execute smooth and rapid transitions in both life and work.',
        'Utilize micro-movements and breathing for real-time self-soothing.',
      ],
    },
    outro:
      'Emotional navigation at this stage is not a cognitive calculation but a sensory process. You don\u2019t think about how to evade\u2014you feel the trajectory and flow through it.',
    glossaryLinks: [
      { label: 'Polyvagal Theory', slug: 'polyvagal-theory' },
      { label: 'Neuroception', slug: 'neuroception' },
      { label: 'HPA Axis', slug: 'hpa-axis' },
      { label: 'Proprioception', slug: 'proprioception' },
      { label: 'Lymphatic System', slug: 'lymphatic-system' },
      { label: 'Lymphology', slug: 'lymphology' },
      { label: 'Motor Cortex', slug: 'motor-cortex' },
      { label: 'Neurobiology', slug: 'neurobiology' },
      { label: 'Cognitive System', slug: 'cognitive-system' },
      { label: 'Neuroendocrinology', slug: 'neuroendocrinology' },
      { label: 'Pituitary', slug: 'pituitary' },
      { label: 'Adrenal', slug: 'adrenal' },
      { label: 'Hypothalamus', slug: 'hypothalamus' },
      { label: 'Adrenaline', slug: 'adrenaline' },
      { label: 'Vestibular System', slug: 'vestibular-system' },
      { label: 'Reticular Formation', slug: 'reticular-formation' },
      { label: 'Thalamus', slug: 'thalamus' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Sympathetic System', slug: 'sympathetic-nervous-system' },
      { label: 'Parasympathetic System', slug: 'parasympathetic-nervous-system' },
      { label: 'Cortisol', slug: 'cortisol' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
  },
  'i-guard-territory': {
    badge: '[ PART 5 — LEVEL 2: EMOTIONS / AQUA ]',
    title: 'I Guard',
    titleHighlight: 'the Territory',
    subtitle: 'Protocol: The Strength of the \u201cLarge Mammal\u201d',
    metaDescription: 'Part 5: DHEA, ventral vagus, calm dominance. Large mammal strength — density of presence. ONDA Life.',
    intro:
      'At this stage, we stop maneuvering and begin to take up space. We shift to working with the body\u2019s biochemical reactor at the level of the \u201clarge beast.\u201d Here, emotion is viewed not as an abstract feeling, but as a bio-engineering process with a hormonal signature, a neuromotor pattern, and a vegetative profile.\n\nIn Part 5, our focus is homeostasis. This is the ability to maintain the stability of the internal environment, the density of presence, and a state of \u201cstatus calm,\u201d regardless of the external pressure the world exerts on us.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'We reconfigure the body through four key systems:',
      items: [
        {
          name: 'Endocrine System (Dominance Hormonal Circuit)',
          text: 'The adrenal glands switch from emergency cortisol release to the production of DHEA\u2014the hormone of vitality and longevity. The Pituitary-Gonadal axis forms the \u201cwinner\u2019s state\u201d through moderate testosterone stimulation. The Thymus restores the link between the sense of social safety and a powerful immune response.',
        },
        {
          name: 'Autonomic Nervous System (Smart Parasympathetic)',
          text: 'Drawing on Stephen Porges\' Polyvagal Theory, we activate the Ventral Vagus. This is a state of \u201ccalm alertness,\u201d where the heart beats powerfully and steadily, and the brain is ready for effective dominance rather than panic.',
        },
        {
          name: 'Lymphatic System (Mechanical Cleansing)',
          text: 'Chronic stress blocks the diaphragm and the pelvic floor. Our practices of \u201cweight\u201d and \u201cvolume\u201d act as deep lymphatic drainage, literally squeezing stress metabolites out of the tissues.',
        },
        {
          name: 'Quantum Biology (Coherence)',
          text: 'We work on the \u201cdensity of presence.\u201d From the perspective of biophotonics, this is a state of high coherence in the electromagnetic field of the cells. Your presence becomes palpable to others on a physical level.',
        },
      ],
    },
    targets: {
      intro: 'The Part 5 protocol engages the deep layers of regulation:',
      items: [
        { name: 'Hypothalamus', text: 'Control of territorial behavior and dominance.' },
        { name: 'Basal Ganglia', text: 'Formation of stable, \u201cunshakeable\u201d postures.' },
        { name: 'Deep Postural Muscles', text: 'Creation of an internal framework of strength.' },
      ],
    },
    results: {
      intro: 'Neurobiological Results',
      items: [
        'The Feedback Loop: Hypothalamus activation \u2192 Increased testosterone \u2192 Decreased cortisol. This yields a state of calm dominance without aggression.',
        'Neuro-Signaling: You broadcast status through neuromotor signals.',
        'Limbic Influence: Others register your stability and limbic confidence before you even say your first word.',
      ],
    },
    outro:
      'Your body is not just a shell; it is your territory. It is time to occupy it.\n\nCalm dominance is a biological state. It requires no effort when your hormonal profile and vegetative tone are tuned correctly.',
    glossaryLinks: [
      { label: 'Homeostasis', slug: 'homeostasis' },
      { label: 'Endocrine System', slug: 'endocrine-system' },
      { label: 'Gonads', slug: 'gonads' },
      { label: 'DHEA', slug: 'dhea' },
      { label: 'Testosterone', slug: 'testosterone' },
      { label: 'Thymus', slug: 'thymus' },
      { label: 'Hypothalamus', slug: 'hypothalamus' },
      { label: 'Basal Ganglia', slug: 'basal-ganglia' },
      { label: 'Autonomic Nervous System', slug: 'autonomic-nervous-system' },
      { label: 'Ventral Vagus', slug: 'ventral-vagus' },
      { label: 'Polyvagal Theory', slug: 'polyvagal-theory' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Lymphatic System', slug: 'lymphatic-system' },
      { label: 'Quantum Biology', slug: 'quantum-biology' },
      { label: 'Coherence', slug: 'coherence' },
      { label: 'Biophotonics', slug: 'biophotonics' },
      { label: 'Limbic System', slug: 'limbic-system' },
      { label: 'Adrenal', slug: 'adrenal' },
      { label: 'Pituitary', slug: 'pituitary' },
      { label: 'Cortisol', slug: 'cortisol' },
      { label: 'Diaphragm', slug: 'diaphragm' },
      { label: 'Pelvic Diaphragm', slug: 'pelvic-diaphragm' },
      { label: 'Parasympathetic System', slug: 'parasympathetic-nervous-system' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
  },
  'i-am-part-of-the-pack': {
    badge: '[ PART 6 — LEVEL 2: EMOTIONS / AQUA ]',
    title: "I'm Part of",
    titleHighlight: 'the Pack',
    subtitle: 'Protocol: The Social Resonance of the \u201cHigher Primate\u201d',
    metaDescription: 'Part 6: Mirror neurons, oxytocin, social resonance. Higher primate — co-regulation and pack dynamics. ONDA Life.',
    intro:
      'Welcome to the pinnacle of Level 2. While previous stages were focused on building maneuverability and personal boundaries, Part 6 moves us toward the most complex biological interface: social resonance.\n\nBiologically, this is the stage of the \u201cHigher Primate.\u201d Our task is to transform individual survival into collective power. We learn to synchronize our biological rhythms with those of others without losing our own \u201ccoherent center.\u201d We don\u2019t just exist near people\u2014we enter into resonance with them.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'This protocol is based on the activation of the \u201csocial brain\u201d:',
      items: [
        {
          name: 'Mirror Neuron System (Premotor Cortex)',
          text: 'Your biological Wi-Fi. We train the ability to instantaneously read the intentions and states of others through micro-expressions and gestures, turning intuition into a precise navigational tool.',
        },
        {
          name: 'Oxytocin Profile (Hypothalamus)',
          text: 'Working with the hormone of trust and belonging. The goal is to train the system to produce oxytocin in response to safe social contact, which automatically lowers baseline anxiety and aggression.',
        },
        {
          name: 'Ventral Vagus (Social Engagement)',
          text: 'Activation of \u201csmart parasympathetics.\u201d This is a state where facial muscles and hearing are tuned to the human voice and face, providing co-regulation\u2014the ability to calm oneself through another and to calm others in return.',
        },
        {
          name: 'Anterior Cingulate Cortex (Social Sensing)',
          text: 'Training the detector for social errors and signals. We learn \u201cemotional osmosis\u201d\u2014the exchange of states\u2014while maintaining autonomy and avoiding being pulled into someone else\'s chaos.',
        },
      ],
    },
    targets: {
      intro: 'The Part 6 protocol is aimed at limbic resonance:',
      items: [
        { name: 'Synchronization', text: 'The skill of aligning breathing and heart rate rhythms with a group to create a unified field of action.' },
        { name: 'Micro-mimic Mobility', text: 'Reading and broadcasting signals of safety and status through the subtlest facial movements.' },
        { name: 'Autonomous Co-regulation', text: 'The ability to influence the emotional field of a group while remaining in a ventral-vagal state.' },
      ],
    },
    results: {
      intro: 'Neurobiological Results',
      items: [
        'The Feedback Loop: Mirror Neurons + Ventral Vagus + Oxytocin. The result is social engagement without anxiety.',
        'Group Dynamics: You gain the ability to feel the \u201cpack,\u201d influence it, and utilize collective resources to achieve goals.',
        'Social Integration: Your presence becomes the \u201cglue\u201d that unites the group and the \u201cvector\u201d that directs it.',
      ],
    },
    outro:
      'You are part of the whole, yet you remain yourself.\n\nIt is time to enter into resonance.',
    glossaryLinks: [
      { label: 'Co-regulation', slug: 'co-regulation' },
      { label: 'Mirror Neurons', slug: 'mirror-neurons' },
      { label: 'Premotor Cortex', slug: 'premotor-cortex' },
      { label: 'Oxytocin', slug: 'oxytocin' },
      { label: 'Emotional Osmosis', slug: 'emotional-osmosis' },
      { label: 'Ventral Vagus', slug: 'ventral-vagus' },
      { label: 'Anterior Cingulate Cortex', slug: 'anterior-cingulate-cortex' },
      { label: 'Social Sensing', slug: 'social-sensing' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Hypothalamus', slug: 'hypothalamus' },
      { label: 'Limbic System', slug: 'limbic-system' },
      { label: 'Polyvagal Theory', slug: 'polyvagal-theory' },
      { label: 'Parasympathetic System', slug: 'parasympathetic-nervous-system' },
      { label: 'Coherence', slug: 'coherence' },
      { label: 'Motor Cortex', slug: 'motor-cortex' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
  },
  'i-distinguish': {
    badge: '[ PART 7 — LEVEL 3: MIND / AER ]',
    title: 'I',
    titleHighlight: 'Distinguish',
    subtitle: 'Protocol: Cognitive Control and S/N (Signal-to-Noise) Optimization',
    metaDescription: 'Part 7: S/N optimization — cognitive gap between stimulus and reaction. Thalamus tuning. ONDA Life.',
    intro:
      'At this stage, we rise above limbic reactions and instincts. The focus is on the foundation of intelligence: the brain\u2019s ability to extract the \u201csignal\u201d from the \u201cnoise.\u201d We train the mind not to merely \u201cthink thoughts,\u201d but to purely perceive the discreteness of the world\u2014its forms, contours, and structures.\n\nThis is the first level where the cognitive system takes on the role of the lead conductor. The key biological challenge is increasing cognitive clarity and transitioning from reactivity to observation.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'We activate the \u201ctools\u201d of the higher order:',
      items: [
        {
          name: 'The Thalamus — The Ultimate Gatekeeper',
          text: 'The filter of sensory streams. Tuning the thalamus to separate critically important information from background \u201cwhite noise.\u201d',
        },
        {
          name: 'Prefrontal Cortex (PFC)',
          text: 'The command center for attention and executive functions. Activating the link between the PFC and the Anterior Cingulate Cortex for the instantaneous detection of inconsistencies.',
        },
        {
          name: 'Neural Clarity (Norepinephrine)',
          text: 'Utilizing norepinephrine modulation to enhance alertness and inhibitory control over impulsive reactions. Metacognitive monitoring\u2014training the medial PFC to separate objective facts from subjective interpretations.',
        },
        {
          name: 'Sensorimotor Integration',
          text: 'Developing the ability to isolate key signals from a dense flow of external stimuli. Deep processing of contours, shapes, and movement vectors through the visual cortex (V1\u2013V5).',
        },
      ],
    },
    targets: {
      intro: 'Target Systems and Progress Biomarkers:',
      items: [
        { name: 'Dorsolateral Prefrontal Cortex (dlPFC)', text: 'Cognitive clarity and focus retention.' },
        { name: 'Anterior Cingulate Cortex (ACC)', text: 'A high-precision \u201cerror detector\u201d and discriminator of differences.' },
        { name: 'P300 Amplitude Increase', text: 'A biomarker indicating how quickly and efficiently the brain recognizes a significant stimulus.' },
        { name: 'Saccadic Stability', text: 'The precision and controllability of eye micro-movements when scanning space.' },
        { name: 'Perceptual Stabilization', text: 'Entering a Theta/Alpha state to ground the mind.' },
      ],
    },
    results: {
      intro: 'The outcome is the creation of a \u201ccognitive gap\u201d between stimulus and reaction.',
      items: [
        'Pattern Recognition: You gain the ability to recognize patterns before they hijack your attention.',
        'Clarity under Pressure: You maintain crystal-clear thinking even under conditions of information overload.',
        'Perceptual Honing: You gain the ability to see the world as it truly is, devoid of unnecessary mental noise.',
        'Load Reduction: A radical decrease in cognitive load by \u201csharpening\u201d the tools of perception.',
      ],
    },
    outro:
      'Discernment is the first step toward true mental autonomy.',
    glossaryLinks: [
      { label: 'Thalamus', slug: 'thalamus' },
      { label: 'Prefrontal Cortex', slug: 'prefrontal-cortex' },
      { label: 'Dorsolateral Prefrontal Cortex', slug: 'dorsolateral-prefrontal-cortex' },
      { label: 'Norepinephrine', slug: 'norepinephrine' },
      { label: 'Anterior Cingulate Cortex', slug: 'anterior-cingulate-cortex' },
      { label: 'Sensorimotor Cortex', slug: 'sensorimotor-cortex' },
      { label: 'Visual Cortex', slug: 'visual-cortex' },
      { label: 'Biofeedback', slug: 'biofeedback' },
      { label: 'P300', slug: 'p300' },
      { label: 'Saccades', slug: 'saccades' },
      { label: 'Theta State', slug: 'theta-state' },
      { label: 'Alpha State', slug: 'alpha-state' },
      { label: 'Cognitive Gap', slug: 'cognitive-gap' },
      { label: 'Cognitive System', slug: 'cognitive-system' },
      { label: 'Limbic System', slug: 'limbic-system' },
      { label: 'Brain', slug: 'brain' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
    researchLinks: [
      { label: 'Neuroplasticity', url: 'https://pubmed.ncbi.nlm.nih.gov/17329479/' },
    ],
  },
  'i-focus': {
    badge: '[ PART 8 — LEVEL 3: MIND / AER ]',
    title: 'I',
    titleHighlight: 'Focus',
    subtitle: 'Protocol: Cognitive Control and Neural Resilience',
    metaDescription: 'Part 8: Deep Work and neural resilience. Voluntary attention, focus retention — dlPFC and DMN suppression. ONDA Life.',
    intro:
      'Part 8 is the heart of the cognitive level. Here, attention ceases to be a reactive response to external stimuli and becomes a controlled instrument. We learn to choose what is important in the moment and maintain that focus while ignoring noise. This is the stage of transforming attention from chaotic to voluntary.\n\nAt this stage, we work with the architecture of attention and the mechanisms for suppressing \u201cinternal noise.\u201d The key biological challenge is goal retention and the efficient distribution of cognitive energy.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'Target systems and mechanisms for deep work:',
      items: [
        {
          name: 'dlPFC and Executive Control',
          text: 'The Dorsolateral Prefrontal Cortex is the primary controller of goal retention. Strengthening the link between the PFC and the basal ganglia for a seamless return to the goal and the filtering of impulsive urges.',
        },
        {
          name: 'Dorsal Attention Network (DAN) and DMN Suppression',
          text: 'Activating the network of voluntary, directed attention. Training the brain to timely deactivate the Default Mode Network (DMN) \u2014 the \u201cmind-wandering mode\u201d \u2014 for deep immersion in the task.',
        },
        {
          name: 'Gamma Binding and Cholinergic Modulation',
          text: 'Synchronizing neurons at gamma frequency to assemble scattered elements of perception into a single, cohesive image. Working with acetylcholine, which literally \u201chighlights\u201d the necessary neural connections.',
        },
        {
          name: 'Locus Coeruleus',
          text: 'Regulating alertness levels through norepinephrine. The Anterior Cingulate Cortex (ACC) monitors distractions and detects errors.',
        },
      ],
    },
    targets: {
      intro: 'Tuning the brain for \u201cDeep Work\u201d mode and preventing cognitive burnout:',
      items: [
        { name: 'Neural Stabilization', text: 'Stabilizing the dlPFC for rigid control over focus.' },
        { name: 'Dopamine Calibration', text: 'Utilizing micro-rewards to maintain high motivation and working memory capacity.' },
        { name: 'Ultradian Optimization', text: 'Working within natural rhythms (90/20-minute cycles) for the timely restoration of neurotransmitters.' },
        { name: 'Metacognitive Return', text: 'A gentle, effortless redirection of attention back to the object of focus.' },
        { name: 'Vagal Brake', text: 'Using breath to maintain somatic calmness during high-intensity mental focus.' },
      ],
    },
    results: {
      intro: 'The attainment of \u201cNeural Resilience.\u201d',
      items: [
        'Ownership of Attention: You don\u2019t just concentrate \u2014 you become the owner of your attention.',
        'Effortless Focus: The brain learns to enter a state of deep focus without excessive strain, maintaining clarity and conserving biological energy.',
        'Cognitive Inhibition: Optimizing the system\u2019s ability to actively ignore irrelevant stimuli.',
        'Biological Markers: Increased beta-rhythm power in the frontal lobes, stabilization of heart rate, and reduced reaction time when switching between tasks.',
      ],
    },
    outro:
      'You don\'t just concentrate \u2014 you become the owner of your attention.',
    glossaryLinks: [
      { label: 'Dorsolateral Prefrontal Cortex', slug: 'dorsolateral-prefrontal-cortex' },
      { label: 'Prefrontal Cortex', slug: 'prefrontal-cortex' },
      { label: 'Frontal Lobes', slug: 'frontal-lobes' },
      { label: 'Dorsal Attention Network', slug: 'dorsal-attention-network' },
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Gamma Binding', slug: 'gamma-binding' },
      { label: 'Cholinergic Modulation', slug: 'cholinergic-modulation' },
      { label: 'Acetylcholine', slug: 'acetylcholine' },
      { label: 'Neurotransmitters', slug: 'neurotransmitters' },
      { label: 'Beta Rhythm', slug: 'beta-rhythm' },
      { label: 'Locus Coeruleus', slug: 'locus-coeruleus' },
      { label: 'Norepinephrine', slug: 'norepinephrine' },
      { label: 'Dopamine', slug: 'dopamine' },
      { label: 'Ultradian Rhythm', slug: 'ultradian-rhythm' },
      { label: 'Anterior Cingulate Cortex', slug: 'anterior-cingulate-cortex' },
      { label: 'Basal Ganglia', slug: 'basal-ganglia' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Cognitive Gap', slug: 'cognitive-gap' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
    researchLinks: [
      { label: 'Neuroplasticity', url: 'https://pubmed.ncbi.nlm.nih.gov/17329479/' },
    ],
  },
  'i-shape-the-vision': {
    badge: '[ PART 9 — LEVEL 3: MIND / AER ]',
    title: 'I Shape the',
    titleHighlight: 'Vision',
    subtitle: 'Protocol: Mental Simulation and Neural Plasticity',
    metaDescription: 'Part 9: Mental simulation and predictive coding. Imagination as software — hippocampus, RAS. ONDA Life.',
    intro:
      'Part 9 is the moment we launch internal "rendering." Here, imagination is viewed not as idle fantasy, but as a powerful biological tool for behavioral engineering. We move from analyzing the present to modeling the future, creating mental prototypes of reality.\n\nAt this level, we engage the brain\'s highest integrative systems to assemble scattered fragments of experience into a unified image. The key biological challenge is the creation of a precise Predictive Coding model of reality.',
    protocol: {
      title: 'Biological Protocol',
      intro:
        'Training the brain to use imagination as a program for rewiring reality:',
      items: [
        {
          name: 'Sensory Visualization',
          text: 'Activating the primary sensory cortex to create a deep, "tangible" internal experience.',
        },
        {
          name: 'Mental Modeling',
          text: 'Linking the hippocampus and the medial PFC (mPFC) to play out future scenarios.',
        },
        {
          name: 'Proactive Programming (RAS)',
          text: 'Tuning the Reticular Activating System to automatically search for opportunities that match the internal vision.',
        },
        {
          name: 'Neural Reframing',
          text: 'Using cognitive metaphors to alter synaptic connections.',
        },
        {
          name: 'Biochemical Resonance',
          text: 'Training the hypothalamus to generate the "victory state" even before real action begins.',
        },
      ],
    },
    targets: {
      intro: 'Target systems and mechanisms of mental modeling:',
      items: [
        {
          name: 'Prefrontal Cortex (dlPFC + vmPFC)',
          text: 'The architecture and evaluation of future strategies. The conductor directing the creative process. The Hypothalamus translates the mental image into a chemical response (hormones and neurotransmitters).',
        },
        {
          name: 'Hippocampus and Default Mode Network (DMN)',
          text: 'Reconstructing past experiences to model new scenarios. The DMN is responsible for creative insight and visualization.',
        },
        {
          name: 'Occipital Cortex (V1–V4) and γ-Synchronization',
          text: 'Visualizing and rendering images in the absence of external stimuli. Instantaneous unification of neural ensembles for a "flash" of understanding and image integrity.',
        },
        {
          name: 'Posterior Parietal Cortex (PPC)',
          text: 'Assembling spatial maps and placing the image within the environmental context. Synchronizing the mental sketch with the body\'s physiological response.',
        },
      ],
    },
    results: {
      intro: 'Transforming imagination into a tool for managing reality.',
      items: [
        'Proactive Mastery: You gain the ability not just to react to events, but to "pre-write" them at the neural level.',
        'Operational Efficiency: The vision becomes a program, and the brain acts as an efficient executor, finding the shortest paths to the goal.',
        'Flow State: Predominance of Alpha and Theta rhythms, characteristic of creative flow and insight.',
        'Biological Belief: Changes in Galvanic Skin Response (GSR) — an indicator that the body "believes" in the created image as if it were real.',
      ],
    },
    outro:
      'The vision becomes a program, and the brain acts as an efficient executor. You gain the ability not just to react to events, but to "pre-write" them at the neural level.',
    glossaryLinks: [
      { label: 'Predictive Coding', slug: 'predictive-coding' },
      { label: 'Prefrontal Cortex', slug: 'prefrontal-cortex' },
      { label: 'Dorsolateral Prefrontal Cortex', slug: 'dorsolateral-prefrontal-cortex' },
      { label: 'Medial Prefrontal Cortex (mPFC)', slug: 'medial-prefrontal-cortex' },
      { label: 'Hippocampus', slug: 'hippocampus' },
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Occipital Cortex (V1–V4)', slug: 'occipital-cortex' },
      { label: 'Visual Cortex', slug: 'visual-cortex' },
      { label: 'γ-Synchronization', slug: 'gamma-synchronization' },
      { label: 'Gamma Binding', slug: 'gamma-binding' },
      { label: 'Posterior Parietal Cortex (PPC)', slug: 'posterior-parietal-cortex' },
      { label: 'Hypothalamus', slug: 'hypothalamus' },
      { label: 'Neurotransmitters', slug: 'neurotransmitters' },
      { label: 'Hormones', slug: 'hormones' },
      { label: 'Proactive Programming (RAS)', slug: 'proactive-programming' },
      { label: 'Reticular Activating System', slug: 'reticular-activating-system' },
      { label: 'Neural Reframing', slug: 'neural-reframing' },
      { label: 'Synaptic Connections', slug: 'synaptic-connections' },
      { label: 'Galvanic Skin Response', slug: 'galvanic-skin-response' },
      { label: 'Flow State', slug: 'flow-state' },
      { label: 'Alpha State', slug: 'alpha-state' },
      { label: 'Theta State', slug: 'theta-state' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
    researchLinks: [
      { label: 'Neuroplasticity', url: 'https://pubmed.ncbi.nlm.nih.gov/17329479/' },
      { label: 'Hemispheric synchronization', url: 'https://pubmed.ncbi.nlm.nih.gov/15913566/' },
    ],
  },
  'i-express': {
    badge: '[ PART 10 — LEVEL 4: SOCIETY / IGNIS ]',
    title: 'I',
    titleHighlight: 'Express',
    subtitle: 'Protocol: Neuroendocrinology of Influence and Vocal Resonance',
    metaDescription: 'Part 10: Vocal resonance and social manifestation. Neuroendocrinology of influence — from simulation to expression. ONDA Life.',
    intro:
      'This is the stage of social realization and tempering. Here, the "internal sketch" created at the Mind level must pass through the filter of the external environment. The goal of this stage is to synchronize the heart (feelings), the brain (vision), and the throat (the instrument of manifestation). We transform self-expression into a sovereign act.\n\nAt this level, a powerful leap occurs: the brain engages systems for social monitoring and speech production. The key biological challenge is overcoming social anxiety and transitioning from internal simulation to real-world manifestation.',
    protocol: {
      title: 'Biological Protocol',
      intro:
        'Transforming the body into a powerful transmitter of ideas through neurochemical mechanisms:',
      items: [
        {
          name: 'Hormonal Engineering',
          text: '"Power posing" and breathing patterns to lower cortisol and increase testosterone.',
        },
        {
          name: 'Vagal Stimulation',
          text: 'Vocal exercises to activate the ventral vagus.',
        },
        {
          name: 'Cognitive Reappraisal',
          text: 'A prefrontal control technique that physiologically dampens amygdala activity, replacing fear with excitement.',
        },
        {
          name: 'Oxytocin Loops',
          text: 'Managing eye contact and micro-expressions to build social trust.',
        },
        {
          name: 'Personality Embodiment',
          text: 'Practices focusing on the somatic sensation of "I Speak," where the voice is supported by the entire body — the diaphragm, the feet, and the spine.',
        },
      ],
    },
    targets: {
      intro: 'Target systems and mechanisms of social manifestation:',
      items: [
        {
          name: "Broca's Area, Wernicke's Area, and the Ventral Vagus",
          text: 'The centers for assembling and delivering speech structures. The Ventral Vagus acts as a "social brake," ensuring a state of calm engagement and friendliness.',
        },
        {
          name: 'Amygdala and Mirror Neurons',
          text: 'Reducing amygdala reactivity to suppress paralyzing social fear. Mirror neurons enable reading audience reactions and instantaneous adjustment to the context.',
        },
        {
          name: 'Insular Cortex and Vocal Apparatus',
          text: 'The Insula provides the sense of authenticity — how much your words align with your internal state. The laryngeal nerve and vocal apparatus serve as tools for sonic resonance.',
        },
        {
          name: 'Thyroid Gland and PFC',
          text: 'The Thyroid acts as the driver of metabolic tempo and the energy of manifestation. The Prefrontal Cortex (PFC) handles social modeling and impulse control.',
        },
      ],
    },
    results: {
      intro: 'Exiting the state of "social paralysis" and entering the state of the Master of Manifestation.',
      items: [
        'Sovereign Expression: Your voice gains weight, your words gain precision, and your self-expression becomes clear and authentic.',
        'Energy Transformation: You no longer fear being noticed; instead, you use attention as fuel for your manifestation.',
        'Biological Markers: Optimized testosterone-to-cortisol ratio; changes in vocal timbre and amplitude.',
        'Resonant Presence: Removal of social filters and tuning the resonant sound of the personality. Absence of jaw tension and throat constriction.',
      ],
    },
    outro:
      'Your voice gains weight, your words gain precision. You transform self-expression into a sovereign act — no longer fearing attention, but using it as fuel for manifestation.',
    glossaryLinks: [
      { label: "Broca's Area", slug: 'brocas-area' },
      { label: "Wernicke's Area", slug: 'wernickes-area' },
      { label: 'Ventral Vagus', slug: 'ventral-vagus' },
      { label: 'Amygdala', slug: 'amygdala' },
      { label: 'Mirror Neurons', slug: 'mirror-neurons' },
      { label: 'Insular Cortex', slug: 'insular-cortex' },
      { label: 'Insula', slug: 'insula' },
      { label: 'Thyroid Gland', slug: 'thyroid-gland' },
      { label: 'Prefrontal Cortex', slug: 'prefrontal-cortex' },
      { label: 'Cortisol', slug: 'cortisol' },
      { label: 'Testosterone', slug: 'testosterone' },
      { label: 'Cognitive Reappraisal', slug: 'cognitive-reappraisal' },
      { label: 'Oxytocin', slug: 'oxytocin' },
      { label: 'Diaphragm', slug: 'diaphragm' },
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Neuroendocrinology', slug: 'neuroendocrinology' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
  },
  'i-interact': {
    badge: '[ PART 11 — LEVEL 4: SOCIETY / IGNIS ]',
    title: 'I',
    titleHighlight: 'Interact',
    subtitle: 'Protocol: Social Cognition and Empathic Regulation',
    metaDescription: 'Part 11: Social cognition and empathic regulation. Theory of Mind, social predictive coding. ONDA Life.',
    intro:
      'Part 11 is the transition from self-expression to interference. In physics, this is the moment when two waves overlap, creating a new, complex pattern. In ONDA, this is the tuning of your "neural Wi-Fi." We learn to be with another in a way that ensures interaction does not turn into a conflict of interest or manipulation.\n\nAt this level, the "social brain" is activated — a sophisticated network responsible for interpersonal synchronization. The key biological challenge is the balance between maintaining autonomy ("I") and deep connection ("We").',
    protocol: {
      title: 'Biological Protocol',
      intro:
        'Tuning the tools of interpersonal navigation to the highest level of precision:',
      items: [
        {
          name: 'Empathic Calibration',
          text: 'Activating mirror neurons and the Anterior Cingulate Cortex (ACC) to read subtle emotional micro-signals.',
        },
        {
          name: 'Cognitive Flexibility (ToM)',
          text: 'Training the ability to "walk in someone else\'s shoes."',
        },
        {
          name: 'Social Predictive Coding',
          text: 'Training the brain to forecast a partner\'s reactions, thereby reducing social noise.',
        },
        {
          name: 'Oxytocin Loop Stimulation',
          text: 'Shifting the system into a mode of deep cooperation.',
        },
        {
          name: 'Interoception in Contact',
          text: 'Using the Insular Cortex (Insula) to feel one\'s own and others\' boundaries in real-time, preventing either total merging or alienation.',
        },
      ],
    },
    targets: {
      intro: 'Target systems and mechanisms of interpersonal interaction:',
      items: [
        {
          name: 'Mirror Neurons and Theory of Mind (ToM) Network',
          text: 'The direct resonance of actions and emotions — the foundation for instantaneous empathy. The ability of the medial Prefrontal Cortex (mPFC) to understand the perspectives, intentions, and beliefs of another person.',
        },
        {
          name: 'Orbitofrontal Cortex and the Ventral Vagus',
          text: 'Ensuring social harmony and ethical choices in the moment. The Ventral Vagus creates a physiological "container" of safety for open communication.',
        },
        {
          name: 'mPFC and rTPJ (Right Temporoparietal Junction)',
          text: 'The mPFC serves as the center for understanding the "Self" of another. The rTPJ is a key node for reading non-verbal signals and managing the "mental model" of others.',
        },
        {
          name: 'Oxytocin-Vasopressin System and Inter-brain Synchrony',
          text: 'The biochemical balance between trust and boundary protection. Inter-brain synchrony is a phenomenon where the brain rhythms of partners begin to operate in a coherent mode.',
        },
      ],
    },
    results: {
      intro: 'Mastery of the "space between."',
      items: [
        'Co-resonance: You learn to create a resonance that empowers both participants in the process.',
        'Nutritious Interaction: Interaction becomes light, productive, and biologically nourishing.',
        'Biological Markers: Synchronization of Heart Rate Variability (HRV) between partners and Alpha-rhythm brain coherence.',
        'Resonance Strategy: Shifting from "social survival" to "social resonance" strategies. Relaxation of the pelvic diaphragm and the release of deep bodily blocks.',
      ],
    },
    outro:
      'You learn to create a resonance that empowers both participants. Interaction becomes light, productive, and biologically nourishing — mastery of the "space between."',
    glossaryLinks: [
      { label: 'Mirror Neurons', slug: 'mirror-neurons' },
      { label: 'Theory of Mind', slug: 'theory-of-mind' },
      { label: 'Medial Prefrontal Cortex (mPFC)', slug: 'medial-prefrontal-cortex' },
      { label: 'Orbitofrontal Cortex', slug: 'orbitofrontal-cortex' },
      { label: 'Ventral Vagus', slug: 'ventral-vagus' },
      { label: 'Right Temporoparietal Junction (rTPJ)', slug: 'right-temporoparietal-junction' },
      { label: 'Oxytocin', slug: 'oxytocin' },
      { label: 'Vasopressin', slug: 'vasopressin' },
      { label: 'Inter-brain Synchrony', slug: 'inter-brain-synchrony' },
      { label: 'Anterior Cingulate Cortex', slug: 'anterior-cingulate-cortex' },
      { label: 'Predictive Coding', slug: 'predictive-coding' },
      { label: 'Insular Cortex', slug: 'insular-cortex' },
      { label: 'Insula', slug: 'insula' },
      { label: 'Interoception', slug: 'interoception' },
      { label: 'Heart Rate Variability', slug: 'heart-rate-variability' },
      { label: 'Alpha State', slug: 'alpha-state' },
      { label: 'Diaphragm', slug: 'diaphragm' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
  },
  'i-co-create': {
    badge: '[ PART 12 — LEVEL 4: SOCIETY / IGNIS ]',
    title: 'I',
    titleHighlight: 'Co-Create',
    subtitle: 'Protocol: Neural Synchronization and Collective Intelligence',
    metaDescription: 'Part 12: Neural coupling and collective intelligence. Gamma sync, brain-to-brain coherence. ONDA Life.',
    intro:
      'Part 12 is the culmination of the ONDA system\'s social evolution. We transition from "I" to "WE" without the loss of individuality, entering a state of neural coupling. This is the point where the intelligence, emotions, and meanings of a group synchronize, creating a collective flow.\n\nAt this level, the brain demonstrates the highest form of interpersonal coordination: the synchronous operation of rhythms across multiple individuals. The key biological challenge is the integration of individual consciousness into a collective neural network.',
    protocol: {
      title: 'Biological Protocol',
      intro:
        'Transforming "teamwork" into a measurable process of biological alignment:',
      items: [
        {
          name: 'Neural Coupling',
          text: 'Practices for synchronizing attention and breathing rhythms to enter a shared neural field.',
        },
        {
          name: 'Depersonalization of Ideas',
          text: 'Reducing the activity of ego-centered networks (DMN).',
        },
        {
          name: 'Oxytocin Resonance',
          text: 'Lowering amygdala reactivity within the group through an atmosphere of radical trust.',
        },
        {
          name: 'Intentional Synchronization',
          text: 'High-order mirror systems for the "seamless" execution of joint tasks.',
        },
        {
          name: 'Dopaminergic Reinforcement',
          text: 'Protocols for celebrating collective victories to form stable neural circuits of cooperative behavior.',
        },
      ],
    },
    targets: {
      intro: 'Target systems and mechanisms of collective co-creation:',
      items: [
        {
          name: 'Brain-to-Brain Coupling and Gamma Synchronization',
          text: 'Inter-brain synchronization where the neural patterns of participants mirror one another. The Gamma rhythm (40+ Hz) is responsible for collective insight and the instantaneous synthesis of ideas.',
        },
        {
          name: 'DMN Inhibition and Joint Attention',
          text: 'Suppressing the brain\'s "ego-network" to shift from protecting personal boundaries to realizing a common goal. Joint Attention forms a single focus as the group\'s center of synergy.',
        },
        {
          name: 'dlPFC and ACC',
          text: 'The coordinator of joint actions and shared strategies. The Anterior Cingulate Cortex (ACC) smooths out micro-conflicts and tunes the group\'s tempo.',
        },
        {
          name: 'TPJ and Endorphin-Oxytocin Systems',
          text: 'The Temporoparietal Junction (TPJ) provides a deep understanding of each participant\'s intentions. The endorphin and oxytocin systems act as the "hormonal glue" of collective cohesion.',
        },
      ],
    },
    results: {
      intro: 'Reaching the level of "Homo Creativus" (The Creative Human).',
      items: [
        'Synergetic Mastery: You gain the skill of integrating into group processes of any complexity, maintaining sovereignty while exponentially amplifying the overall result.',
        'Living Network: The group transforms into a living neural network capable of solving tasks inaccessible to the individual mind.',
        'Biological Markers: Inter-brain coherence, group heart rate variability (HRV) alignment, and collective dopamine surges.',
        'We-Consciousness: Creating a hyper-productive environment where ideas self-organize into results through a unified field of consciousness.',
      ],
    },
    outro:
      'The group transforms into a living neural network. You maintain sovereignty while exponentially amplifying the result — the level of Homo Creativus.',
    glossaryLinks: [
      { label: 'Neural Coupling', slug: 'neural-coupling' },
      { label: 'Synchronization', slug: 'synchronization' },
      { label: 'Inter-brain Synchrony', slug: 'inter-brain-synchrony' },
      { label: 'Inter-brain Coherence', slug: 'inter-brain-coherence' },
      { label: 'γ-Synchronization', slug: 'gamma-synchronization' },
      { label: 'Gamma Binding', slug: 'gamma-binding' },
      { label: 'Oxytocin System', slug: 'oxytocin-system' },
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Joint Attention', slug: 'joint-attention' },
      { label: 'Dorsolateral Prefrontal Cortex', slug: 'dorsolateral-prefrontal-cortex' },
      { label: 'Anterior Cingulate Cortex', slug: 'anterior-cingulate-cortex' },
      { label: 'Right Temporoparietal Junction (rTPJ)', slug: 'right-temporoparietal-junction' },
      { label: 'Endorphins', slug: 'endorphins' },
      { label: 'Oxytocin', slug: 'oxytocin' },
      { label: 'Dopamine', slug: 'dopamine' },
      { label: 'Amygdala', slug: 'amygdala' },
      { label: 'Mirror Neurons', slug: 'mirror-neurons' },
      { label: 'Heart Rate Variability', slug: 'heart-rate-variability' },
      { label: 'Psycho-Neural Network', slug: 'psycho-neural-network' },
    ],
  },
  'i-sense': {
    badge: '[ PART 13 — LEVEL 5: NEURO-SOMATIC MIND / SENSORY INTELLIGENCE ]',
    title: 'I',
    titleHighlight: 'Sense',
    subtitle: 'Protocol: Interoceptive Accuracy and Sensory Expansion',
    metaDescription:
      'Part 13: Sensory Intelligence. Interoception, insula, C-tactile fibers. Transform the body into a high-precision antenna. ONDA Life.',
    intro:
      'At this stage, we return to the "biological spacesuit"—not as passive passengers, but as expert pilots. We transition from simple self-observation to high-precision Sensory Intelligence. The objective is to transform the body from an object that needs maintenance into a perfect "antenna" capable of reading the subtlest data from both internal and external environments. Here, we learn to separate the raw electrical signal of the nervous system from automatic mental interpretation.\n\nKey Biological Challenge: Synchronizing the "Body Schema" (where I am) and the "Body Image" (how I feel) into a single stream of ultra-precise data.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'This protocol turns the body into a sensitive measuring instrument ready to manage internal flows:',
      items: [
        {
          name: 'Interoceptive Accuracy',
          text: 'Practices to activate the insula, allowing you to hear pulsation, peristalsis, and micro-movements beneath the skin without fear or judgment.',
        },
        {
          name: 'Sensory Discrimination',
          text: 'Exercises to sharpen exteroception (hearing, touch, smell) through the conscious management of thalamic filters.',
        },
        {
          name: 'DMN Suppression via Sensories',
          text: 'Shifting attention to the "direct wire" of sensations, which physiologically deactivates mental "rumination" and reduces stress.',
        },
        {
          name: 'Neuro-Vegetative Calibration',
          text: "Tuning the brain's ability to instantly recognize changes in the internal chemical background (e.g., an adrenaline surge) before it even becomes an emotion.",
        },
        {
          name: 'Embodiment Clarity',
          text: 'Eliminating the delay between the body\'s signal and its realization ("I feel — I know — I act").',
        },
      ],
    },
    targets: {
      intro: 'We activate systems responsible for deep presence and the decoding of bodily codes:',
      items: [
        {
          name: 'Interoception (Insula)',
          text: 'Activating the insular cortex—the hub of our bodily self-awareness that processes signals from internal organs.',
        },
        {
          name: 'Somatosensory Cortex (S1/S2)',
          text: 'Sharpening tactile perception and stimulus discrimination.',
        },
        {
          name: 'Sensory Gateway (Thalamus)',
          text: 'Lowering filtration thresholds to allow more detailed information about textures, sounds, and scents.',
        },
        {
          name: 'Proprioceptive Integration',
          text: 'Engaging the cerebellum and parietal cortex to create an ultra-precise "body map" in space.',
        },
        {
          name: 'C-Tactile Fibers',
          text: 'Activating the pathways of "emotional" touch that link the skin to the brain\'s well-being centers.',
        },
      ],
    },
    results: {
      intro: 'Attaining "Bodily Transparency."',
      items: [
        'You begin to perceive the body not as noise, but as a high-precision data stream.',
        'This is the state of a "pilot" who feels the slightest vibration of the aircraft\'s wing.',
        'Progress biomarkers: Increased gray matter density in the insular cortex, reduced resting muscle tone, normalization of Galvanic Skin Response (GSR).',
        'Transition from "Survival Mode" to total "Presence Mode" through sensory anchors.',
      ],
    },
    outro:
      'You are now ready for the next step: managing internal energy flows and deep state regulation.',
    glossaryLinks: [
      { label: 'Interoception', slug: 'interoception' },
      { label: 'Insular Cortex', slug: 'insular-cortex' },
      { label: 'Insula', slug: 'insula' },
      { label: 'Thalamus', slug: 'thalamus' },
      { label: 'Somatosensory Cortex', slug: 'somatosensory-cortex' },
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Parasympathetic System', slug: 'parasympathetic-nervous-system' },
      { label: 'Galvanic Skin Response', slug: 'galvanic-skin-response' },
      { label: 'Body Schema', slug: 'body-schema' },
      { label: 'C-Tactile Fibers', slug: 'c-tactile-fibers' },
      { label: 'Proprioception', slug: 'proprioception' },
      { label: 'Cerebellum', slug: 'cerebellum' },
      { label: 'Posterior Parietal Cortex', slug: 'posterior-parietal-cortex' },
    ],
  },
  'i-channel': {
    badge: '[ PART 14 — LEVEL 5: NEURO-SOMATIC MIND / SENSORY INTELLIGENCE ]',
    title: 'I',
    titleHighlight: 'Channel',
    subtitle: 'Protocol: Neurodynamic Conductivity and Fascial Flow',
    metaDescription:
      'Part 14: The body as conductor. Vagal tone, neurodynamics, fascial flow. Master of flow states — eliminate congestions, achieve high conductivity. ONDA Life.',
    intro:
      'At this stage, we work with the "informational fluidity" of the organism. The goal is to train the nervous system and tissues not to block incoming or internal impulses (stress, pain, intense emotions), but to let them pass through unhindered. We stop being a "form" that resists pressure and become a "process" that transforms any impulse into a resource while maintaining homeostasis.\n\nKey Biological Challenge: Eliminating "congestions"—muscular, vascular, and neural blocks—for the free distribution of energy and signals.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'Neurodynamic Conductivity and Fascial Flow transforms the body into an open channel:',
      items: [
        {
          name: 'Neurodynamic Discharge',
          text: 'Modulating spinal reflexes to pass excess excitation through the body without turning it into a chronic blockage.',
        },
        {
          name: 'Fascial Gliding',
          text: 'Working with fascial mechanoreceptors to improve the transmission of mechanical and energetic information throughout the entire "tensegrity" framework.',
        },
        {
          name: 'Vasomotor Control',
          text: 'Conscious management of microcirculation and heat flow through attention, directly affecting tissue conductivity.',
        },
        {
          name: 'Vagal Bridge',
          text: 'Using breathing and vocal techniques to increase the "bandwidth" of the vagus nerve during peak loads.',
        },
        {
          name: 'Flow Integration',
          text: 'Reducing the activity of the Default Mode Network (DMN) through total somatic presence, where action is born from conductivity rather than effort.',
        },
      ],
    },
    targets: {
      intro: 'Target systems and biomarkers of progress:',
      items: [
        {
          name: 'Peripheral Nervous System',
          text: 'Fiber conductivity without "noise."',
        },
        {
          name: 'Fascial Chains (Tensegrity)',
          text: 'Connective tissue as the body\'s global information network.',
        },
        {
          name: 'Spinal Canal',
          text: 'The main highway for impulse transmission.',
        },
        {
          name: 'HPA Axis',
          text: 'Regulation of the stress response.',
        },
        {
          name: 'Biomarkers',
          text: 'Reduction in skin electrical impedance; stabilization of vascular tone; disappearance of "sensory amnesia" zones.',
        },
      ],
    },
    results: {
      intro: 'Achieving somatic freedom and "high conductivity."',
      items: [
        'The body stops accumulating stress and begins to transmit it, processing it into kinetic or creative energy.',
        'You become a master of flow states, capable of maintaining internal softness and conductivity even under ultra-strong external influences.',
        'Transition to minimal internal friction: ANS harmonization, vagal tone optimization, neurodynamics, vasomotricity, CSF dynamics.',
      ],
    },
    outro:
      'You are no longer a form that resists—you are a process that transforms. Every impulse becomes a resource.',
    glossaryLinks: [
      { label: 'Vagus Nerve', slug: 'vagus-nerve' },
      { label: 'Autonomic Nervous System', slug: 'autonomic-nervous-system' },
      { label: 'Heart Rate Variability', slug: 'heart-rate-variability' },
      { label: 'Fascia', slug: 'fascia' },
      { label: 'Tensegrity', slug: 'tensegrity' },
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'HPA Axis', slug: 'hpa-axis' },
      { label: 'Flow State', slug: 'flow-state' },
      { label: 'Neurodynamics', slug: 'neurodynamics' },
      { label: 'Vasomotricity', slug: 'vasomotricity' },
      { label: 'Parasympathetic System', slug: 'parasympathetic-nervous-system' },
      { label: 'Sympathetic System', slug: 'sympathetic-nervous-system' },
    ],
    researchLinks: [
      { label: 'Polyvagal Theory', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
      { label: 'Neurodynamics & nerve mobility', url: 'https://pubmed.ncbi.nlm.nih.gov/17329479/' },
    ],
  },
  'i-attune': {
    badge: '[ PART 15 — LEVEL 5: NEURO-SOMATIC MIND / SENSORY INTELLIGENCE ]',
    title: 'I',
    titleHighlight: 'Attune',
    subtitle: 'Protocol: Neurosomatic Fusion and Collective Ecstasy',
    metaDescription:
      'Part 15: Neurosomatic fusion. Oxytocin, mirror neurons, ventral vagal. From individual conductivity to collective resonance — the connected human. ONDA Life.',
    intro:
      'Part 15 is about the transition from individual conductivity to collective resonance. It is not just "contact"; it is the creation of a unified neurosomatic circuit ("We-state"). We utilize powerful neurochemical levers—oxytocin, dopamine, and endorphins—not for mere discharge, but to expand cognitive and sensory capacities through another human being. At this stage, the body becomes a high-tech instrument for exploring the "other" and the "self" simultaneously.\n\nKey Biological Challenge: Dissolving the boundaries of the "ego-shell" to create a synchronized physiological field.',
    protocol: {
      title: 'Biological Protocol',
      intro: 'Neurosomatic Fusion and Collective Ecstasy transforms intimacy into a precise method of neurobiological programming:',
      items: [
        {
          name: 'Physiological Synchronization',
          text: 'Practices involving synchronized breathing, micro-movements, and heart-rate entrainment to activate the "neurosomatic bridge."',
        },
        {
          name: 'Biochemistry of Trust',
          text: 'Using prolonged eye contact and specific tactile stimulation to flood the system with oxytocin and vasopressin, stabilizing the bond.',
        },
        {
          name: 'Sensory Field Expansion',
          text: 'Techniques to modulate the parietal lobe, blurring the physical edges of the body to experience the partner\'s sensations as one\'s own.',
        },
        {
          name: 'State Alchemy',
          text: 'Transforming biological stress and tension into the energy of action and pleasure (converting cortisol-driven states into dopamine/endorphin flow).',
        },
        {
          name: 'Conscious Ecstasy',
          text: 'Training the PFC to remain "online" during peak experiences, allowing for the integration of ecstatic states into long-term neuroplasticity.',
        },
      ],
    },
    targets: {
      intro: 'Target systems and biomarkers of progress:',
      items: [
        {
          name: 'Oxytocinergic Pathways',
          text: 'Centers of bonding and stress reduction.',
        },
        {
          name: 'Somatosensory Cortex',
          text: 'For expanded sensory mapping.',
        },
        {
          name: 'Prefrontal Cortex (PFC)',
          text: 'Maintaining awareness even within intense ecstatic states.',
        },
        {
          name: 'Biomarkers',
          text: 'HRV coherence between partners; brainwave coupling (Alpha/Theta sync); oxytocin/cortisol ratio shift toward bonding biochemistry.',
        },
      ],
    },
    results: {
      intro: 'Achieving the state of "The Connected Human."',
      items: [
        'You gain the ability to enter deep resonance with another, where intimacy is transformed into a profound spiritual and biological experience.',
        'The boundaries of "I" and "Thou" dissolve into a single, pulsating organism.',
        'Intimacy becomes a source of immense energy, healing, and mutual cognitive expansion.',
      ],
    },
    outro:
      'You are no longer two separate beings—you are one synchronized field. The connected human.',
    glossaryLinks: [
      { label: 'Oxytocin', slug: 'oxytocin' },
      { label: 'Vasopressin', slug: 'vasopressin' },
      { label: 'Mirror Neurons', slug: 'mirror-neurons' },
      { label: 'Ventral Vagus', slug: 'ventral-vagus' },
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Prefrontal Cortex', slug: 'prefrontal-cortex' },
      { label: 'Somatosensory Cortex', slug: 'somatosensory-cortex' },
      { label: 'Posterior Parietal Cortex', slug: 'posterior-parietal-cortex' },
      { label: 'Heart Rate Variability', slug: 'heart-rate-variability' },
      { label: 'Dopamine', slug: 'dopamine' },
      { label: 'Endorphins', slug: 'endorphins' },
      { label: 'Cortisol', slug: 'cortisol' },
      { label: 'Neuroplasticity', slug: 'neuroplasticity' },
    ],
    researchLinks: [
      { label: 'Oxytocin & social bonding', url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/' },
      { label: 'Mirror neurons & inter-brain synchrony', url: 'https://pubmed.ncbi.nlm.nih.gov/17512470/' },
    ],
  },
  'i-witness': {
    badge: '[ PART 16 — LEVEL 6: BRAIN CONSCIOUSNESS / AQUA II ]',
    title: 'I',
    titleHighlight: 'Witness',
    subtitle: 'Protocol: Neural Distance and Metacognitive Monitoring',
    metaDescription:
      'Part 16: The observing human. DMN deactivation, metacognitive monitoring. Establish neural distance — become the witness of your thoughts. Meta-programmer. ONDA Life.',
    intro:
      'Part 16 marks the transition from managing the "spacesuit" (the body) to managing the "command deck" (the mind). While previous stages taught us how to feel, here we learn to see how we think.\n\nThe primary goal is to establish "neural distance" between yourself and your thoughts. We cease being participants in the internal dialogue and become its Witness. This is not about suppressing the mind, but about making it "transparent," where every thought is registered as a transient electrical impulse that no longer triggers an automatic emotional storm. This is the stage of cognitive sovereignty.\n\nKey Biological Challenge: Deactivating the Default Mode Network (DMN) and developing a stable skill of disidentification from mental noise.',
    introBlocks: [
      [
        { type: 'text', content: 'Part 16 of the ' },
        { type: 'link', content: 'Operating System for Your Consciousness', href: '/' },
        {
          type: 'text',
          content:
            ' marks a critical firmware update: the transition from managing the "spacesuit" (the body) to mastering the "command deck" (the mind). While earlier stages of biohacking focus on physical optimization, here we initialize Real-Time Bio-Sync with our neural hardware. It is no longer about random meditation; it is about learning to see exactly how we think, effectively upgrading the interface between your awareness and your brain.',
        },
      ],
      [
        {
          type: 'text',
          content:
            'The primary goal is to establish "neural distance" between yourself and your thoughts. We cease being participants in the internal dialogue and become its Witness. This is not about suppressing the mind, but about making it "transparent," where every thought is registered as a transient electrical impulse that no longer triggers an automatic emotional storm. This is the stage of cognitive sovereignty.',
        },
      ],
      [
        {
          type: 'text',
          content:
            'Key Biological Challenge: Deactivating the Default Mode Network (DMN) and developing a stable skill of disidentification from mental noise.',
        },
      ],
    ],
    videoUrl: 'https://www.youtube.com/embed/r9F65UWdSRI',
    faq: [
      {
        question: 'What is the I Witness protocol in biohacking?',
        answer:
          'The I Witness protocol is Part 16 of the ONDA system. It trains neural distance and metacognitive monitoring — establishing a "witness" stance toward your thoughts rather than being absorbed by them. Key practices include Thought Inventory, Neural Inhibition, and DMN Silence to deactivate the Default Mode Network and achieve cognitive sovereignty.',
      },
      {
        question: 'How to decouple the limbic response?',
        answer:
          'Limbic Response Decoupling is trained by registering "charged" thoughts as dry data. The PFC learns to detect emotional triggers without releasing cortisol. Practices include tagging thoughts (planning, memory, criticism), sensory anchors to collapse internal dialogue, and maintaining meta-attention on the process of perception itself.',
      },
    ],
    protocol: {
      title: 'Biological Protocol',
      intro: 'Neural Distance and Metacognitive Monitoring trains you to be the "System Administrator" of your own brain:',
      items: [
        {
          name: 'Thought Inventory',
          text: 'The practice of "tagging" incoming thoughts: "planning," "memory," "criticism." This activates the mPFC and strips the thought of its power over you.',
        },
        {
          name: 'Neural Inhibition',
          text: 'Training the ability to instantly sever a chain of associations, preventing it from growing into an emotional narrative.',
        },
        {
          name: '"Witness" Meta-Monitoring',
          text: 'Maintaining attention not on the object, but on the process of perception itself. You observe the one who is observing.',
        },
        {
          name: 'Limbic Response Decoupling',
          text: 'Training the PFC to register "charged" thoughts as dry data, preventing the release of cortisol.',
        },
        {
          name: 'DMN Silence',
          text: 'Using sensory anchors to "collapse" the internal dialogue and transition into a state of deep cognitive silence.',
        },
      ],
    },
    targets: {
      intro: 'Target systems and biomarkers of progress:',
      items: [
        {
          name: 'Dorsolateral PFC',
          text: 'A powerful filter that separates vital signals from informational junk.',
        },
        {
          name: 'Anterior Cingulate Cortex (ACC)',
          text: 'Your internal monitor that signals: "Attention! We have just slipped back into rumination."',
        },
        {
          name: 'Amygdala (Circuit Breaking)',
          text: 'Blocking the pathway where a thought instantly triggers a fear response in the body.',
        },
        {
          name: 'Biomarkers',
          text: 'Cognitive Gap increase; Alpha-rhythm stabilization; reduction in mental rumination.',
        },
      ],
    },
    results: {
      intro: 'Achieving the status of a Meta-Programmer.',
      items: [
        'You are no longer a hostage to your stream of consciousness.',
        'The brain becomes a submissive tool, and you become the one who chooses which programs to run and which to delete.',
        'This is the foundation for true intellectual and emotional freedom.',
      ],
    },
    outro:
      'You are no longer inside the storm—you are the one watching it. The meta-programmer.',
    glossaryLinks: [
      { label: 'Default Mode Network', slug: 'default-mode-network' },
      { label: 'Central Executive Network', slug: 'central-executive-network' },
      { label: 'Prefrontal Cortex', slug: 'prefrontal-cortex' },
      { label: 'Medial Prefrontal Cortex (mPFC)', slug: 'medial-prefrontal-cortex' },
      { label: 'Posterior Cingulate Cortex', slug: 'posterior-cingulate-cortex' },
      { label: 'Anterior Cingulate Cortex', slug: 'anterior-cingulate-cortex' },
      { label: 'Amygdala', slug: 'amygdala' },
      { label: 'Insular Cortex', slug: 'insular-cortex' },
      { label: 'Cortisol', slug: 'cortisol' },
      { label: 'Cognitive Gap', slug: 'cognitive-gap' },
      { label: 'Alpha State', slug: 'alpha-state' },
      { label: 'Neuroplasticity', slug: 'neuroplasticity' },
    ],
    researchLinks: [
      { label: 'DMN & self-referential processing', url: 'https://pubmed.ncbi.nlm.nih.gov/17329479/' },
      { label: 'Metacognition & PFC', url: 'https://pubmed.ncbi.nlm.nih.gov/15913566/' },
    ],
  },
}

export function PartPage() {
  const { slug } = useParams<{ slug: string }>()
  const part = slug ? parts[slug] : undefined

  useEffect(() => {
    if (!part) return
    const seo = slug ? PART_SEO[slug] : undefined
    const title = seo?.title ?? `${part.title} ${part.titleHighlight} | ONDA Life`
    const desc = seo?.description ?? part.metaDescription ?? DEFAULT_DESCRIPTION
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:url', `${SITE_URL}/part/${slug}`, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)
    // FAQ schema for "People also ask"
    if (part.faq && part.faq.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: part.faq.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
      }
      let el = document.querySelector('script[data-faq-schema]')
      if (!el) {
        el = document.createElement('script')
        el.setAttribute('type', 'application/ld+json')
        el.setAttribute('data-faq-schema', '')
        document.head.appendChild(el)
      }
      el.textContent = JSON.stringify(faqSchema)
    }
    return () => {
      document.title = 'ONDA Life | Operating System for Your Consciousness'
      setMeta('description', DEFAULT_DESCRIPTION)
      setMeta('og:title', 'ONDA Life | Operating System for Your Consciousness', true)
      setMeta('og:description', DEFAULT_DESCRIPTION, true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', 'ONDA Life | Operating System for Your Consciousness', true)
      setMeta('twitter:description', DEFAULT_DESCRIPTION, true)
      setMeta('twitter:image', OG_IMAGE, true)
      const faqEl = document.querySelector('script[data-faq-schema]')
      if (faqEl) faqEl.remove()
    }
  }, [part, slug])

  if (!part) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
        <p className="font-mono text-white/60">Part not found.</p>
        <Link to="/" className="mt-4 inline-block font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60">
          ← Back to Home
        </Link>
      </div>
    )
  }

  const levelNum = part.badge.match(/LEVEL (\d+)/)?.[1]
  const level = levelNum ? levelsData[parseInt(levelNum, 10)] : undefined

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">
          Home
        </Link>
        <span>/</span>
        {level && (
          <>
            <Link to={`/level/${level.number}`} className="transition-colors hover:text-white/50">
              Level {level.number}: {level.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-terminal-green/60" aria-current="page">
          {part.title} {part.titleHighlight}
        </span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
        {part.title}{' '}
        <span className="bg-gradient-to-r from-terminal-cyan to-terminal-green bg-clip-text text-transparent">
          {part.titleHighlight}
        </span>
      </h1>

      <h2 className="mb-8 text-2xl font-bold tracking-tight md:text-4xl">
        <span className="text-terminal-green">{part.subtitle.split(':')[0]}:</span>
        {part.subtitle.slice(part.subtitle.indexOf(':') + 1)}
      </h2>

      {part.introBlocks ? (
        part.introBlocks.map((blocks, i) => (
          <p key={i} className="mb-6 font-mono text-sm leading-relaxed text-white/60 md:text-base">
            {blocks.map((b, j) =>
              b.type === 'link' ? (
                <Link key={j} to={b.href} className="text-terminal-cyan underline decoration-terminal-cyan/30 underline-offset-2 transition-colors hover:text-terminal-cyan/80 hover:decoration-terminal-cyan/50">
                  {b.content}
                </Link>
              ) : (
                b.content
              )
            )}
          </p>
        ))
      ) : (
        part.intro.split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-6 font-mono text-sm leading-relaxed text-white/60 md:text-base">
            {paragraph}
          </p>
        ))
      )}

      {part.videoUrl && (
        <div className="mb-16">
          <div className="aspect-[9/16] max-h-[500px] w-full max-w-[280px] overflow-hidden rounded-lg border border-white/10">
            <iframe
              src={part.videoUrl}
              title={`${part.title} ${part.titleHighlight} — video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      )}

      <div className="mb-16" />

      {/* Biological Protocol */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        <span className="text-terminal-green">Biological</span> Protocol
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {part.protocol.intro}
      </p>
      <div className="mb-16 space-y-6">
        {part.protocol.items.map((item) => (
          <div key={item.name}>
            <h3 className="mb-1 font-mono text-sm font-bold text-white/80">{item.name}</h3>
            <p className="font-mono text-sm leading-relaxed text-white/50">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Target Systems */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        Target{' '}
        <span className="bg-gradient-to-r from-terminal-green to-terminal-cyan bg-clip-text text-transparent">
          Systems
        </span>
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {part.targets.intro}
      </p>
      <ul className="mb-16 space-y-3 pl-1">
        {part.targets.items.map((t) => (
          <li key={t.name} className="font-mono text-sm leading-relaxed text-white/50">
            <span className="mr-2 text-terminal-green/40">•</span>
            <span className="font-bold text-white/70">{t.name}:</span> {t.text}
          </li>
        ))}
      </ul>

      {/* Results */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        Results &{' '}
        <span className="bg-gradient-to-r from-terminal-cyan to-terminal-green bg-clip-text text-transparent">
          Benefits
        </span>
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {part.results.intro}
      </p>
      <ul className="mb-8 space-y-2 pl-1">
        {part.results.items.map((r, i) => (
          <li key={i} className="font-mono text-sm leading-relaxed text-white/50">
            <span className="mr-2 text-terminal-green/40">•</span>{r}
          </li>
        ))}
      </ul>
      <div className="mb-16 space-y-4">
        {part.outro.split('\n\n').map((p, i) => (
          <p key={i} className="font-mono text-sm leading-relaxed text-white/60">
            {p}
          </p>
        ))}
      </div>

      {/* Research Links */}
      {part.researchLinks && part.researchLinks.length > 0 && (
        <div className="border-t border-white/5 pt-10">
          <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
            <span className="text-terminal-green">Research</span> Basis
          </h2>
          <div className="mb-10 flex flex-wrap gap-2">
            {part.researchLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-terminal-cyan/20 bg-terminal-cyan/5 px-3 py-1.5 font-mono text-xs text-terminal-cyan transition-all hover:border-terminal-cyan/40 hover:bg-terminal-cyan/10"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Glossary Links */}
      <div className="border-t border-white/5 pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
          <span className="text-terminal-green">Related</span> Terms
        </h2>
        <div className="flex flex-wrap gap-2">
          {part.glossaryLinks.map((link) => (
            <GlossaryTooltip
              key={link.slug}
              label={link.label}
              slug={link.slug}
              className="rounded-lg border border-terminal-cyan/20 bg-terminal-cyan/5 px-3 py-1.5 font-mono text-xs text-terminal-cyan transition-all hover:border-terminal-cyan/40 hover:bg-terminal-cyan/10"
            />
          ))}
        </div>
      </div>

      {/* FAQ — People also ask */}
      {part.faq && part.faq.length > 0 && (
        <div className="mt-10 border-t border-white/5 pt-10">
          <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
            <span className="text-terminal-green">People</span> Also Ask
          </h2>
          <div className="space-y-6">
            {part.faq.map((item, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h3 className="mb-2 font-mono text-sm font-semibold text-white/90">{item.question}</h3>
                <p className="font-mono text-sm leading-relaxed text-white/50">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <Link
          to="/"
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
