/**
 * Meta data for build-time injection into prerendered HTML.
 * Single source of truth for title/description per route.
 */
import { getTermBySlug } from '../src/data/glossary'
import { GLOSSARY_SEO } from '../src/data/glossary-seo'
import { levelsData } from '../src/data/levels'
import { PART_SEO } from '../src/data/part-seo'
import { parts } from '../src/pages/PartPage'
import { getArticleBySlug } from '../src/data/articles'
import { METRIC_DETAILS } from '../src/data/bioMetrics'

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

/** Build canonical URL without trailing slash. Google sees only one URL variant. */
function buildCanonicalUrl(route: string): string {
  const base = SITE_URL.replace(/\/+$/, '')
  const cleanPath = (route || '/').replace(/\/+$/, '') || '/'
  return cleanPath === '/' ? base : `${base}${cleanPath}`
}
const DEFAULT_TITLE = 'ONDA Life | Biohacking App, HRV Tracker & Consciousness OS'
const DEFAULT_DESC =
  'Your body is a biological computer. ONDA Life is the OS that upgrades it — 8 levels of structured consciousness development, HRV tracking, and neural optimization protocols.'

const ABOUT_TITLE = 'About ONDA Life | Operating System for Your Consciousness & Biohacking'
const ABOUT_DESC =
  'Discover how ONDA Life upgrades your biological firmware through systematic HRV tracking, neural hardware optimization, and 8 levels of consciousness development.'

const GLOSSARY_TITLE = 'Biohacking & Neuroscience Glossary | ONDA Life Knowledge Base'
const GLOSSARY_DESC =
  'Explore 100+ key terms in molecular psychology, neurophysiology, and consciousness architecture. Your comprehensive guide to the ONDA Life system.'

const CONTACT_TITLE = 'Contact ONDA Life | Support & Community'
const CONTACT_DESC =
  'Need technical support for your biological upgrade? Connect with the ONDA Core Team. Email, Telegram, Discord — we respond.'

const THE_STACK_TITLE = 'The Stack | System Configuration | ONDA Life'
const THE_STACK_DESC =
  'Complete daily operational protocol for human hardware optimization. All 13 system upgrades in one dashboard.'

export interface BreadcrumbItem {
  name: string
  url: string
}

/** Optional custom title overrides for articles (default: article.title + " | ONDA Life") */
const ARTICLE_SEO_TITLES: Record<string, string> = {
  'dopamine-stacking-preventing-circuit-overload': 'Dopamine Stacking & Circuit Overload | ONDA Biology',
  'cacao-stem-cells': 'Cacao & Stem Cells: Biological Logic | ONDA',
  'cognitive-architecture-neural-throughput': 'Cognitive Architecture: Neural Throughput Optimization | ONDA',
  'system-feedback-biometric-loop': 'Biometric Feedback Loop: Real-Time Bio-Optimization | ONDA',
  'endocrine-social-drive-oxytocin-testosterone': 'Endocrine Social Drive: Oxytocin vs Testosterone | ONDA Life',
  'hpa-axis-control-cortisol-aggression': 'HPA Axis Control: Cortisol & Aggression Management | ONDA Life',
  'system-stability-serotonin': 'Serotonin & System Stability: Managing the Gut-Brain Link | ONDA Life',
  'energy-sensor-leptin': 'Leptin & Energy Sensing: Fixing Metabolic Blindness | ONDA Life',
  'neural-optimizer-estrogen': 'Estrogen & Neural Plasticity: Protecting the Cognitive Hardware | ONDA Life',
  'protocol-circadian-hard-reset': 'Hard Reset: 72-Hour Circadian Reflash Protocol | ONDA Life',
  'ancestral-sync-circadian-anchors': 'Ancestral Circadian Anchors: 3 Zeitgeber Signals That Fix Your Clock | ONDA Life',
  'longevity-protocol-biological-clock-reset': 'Biological Clock Reset: Reverse Your Cellular Age with Deep Epigenetic Protocols | ONDA Life',
  'nervous-system-ping-latency': 'Nervous System Latency: HRV Biofeedback & Resonant Frequency Protocol | ONDA Life',
  'fault-tolerant-human-hrv-buffer': 'Fault-Tolerant Human: Build Your HRV Buffer & Resilience Architecture | ONDA Life',
  'resonant-frequency-system-coherence': 'Resonant Frequency Breathing: Find Your HRV Coherence Peak & Tune Your Biology | ONDA Life',
  'baroreflex-01hz-shift': '0.1 Hz Baroreflex Hack: Engineer HRV Coherence & Lower Blood Pressure Without Drugs | ONDA Life',
  'nightly-flush-glymphatic-neural-cache': 'Glymphatic System Optimization: Deep Sleep Brain Flush & Neural Cache Clearance Protocol | ONDA Life',
  'neural-hydraulics-csf-flow': 'Neural Hydraulics: Engineer CSF Flow, Glymphatic Purge & Mental Clarity via Brain Fluid Dynamics | ONDA Life',
  'anti-entropy-neural-architecture': 'Anti-Entropy Brain Protocol: Prevent Neural Drift, Clear Amyloid & Protect Neural Architecture | ONDA Life',
  'idle-state-alpha-rhythms': 'Alpha State Brain Optimization: Escape the Beta Trap & Engage the Neural Idle Frequency | ONDA Life',
  'neural-bridge-alpha-flow-gateway': 'Neural Bridge: Alpha-Theta Gateway to Flow State, Insight Delivery & Creative Access | ONDA Life',
  'quiet-mode-alpha-cortisol-buffer': 'Quiet Mode Protocol: Alpha Rhythms as Cortisol Buffer, Parasympathetic Activation & Stress Recovery | ONDA Life',
}

/** SEO descriptions for articles (150–160 chars). Style: Technical protocol for biocomputer upgrade. */
const ARTICLE_SEO_DESCRIPTIONS: Record<string, string> = {
  'vagus-nerve-master-key':
    'Technical protocol on Vagus Nerve optimization for biocomputer upgrade. Hack stress response, unlock deep resilience via parasympathetic access.',
  'dopamine-architecture-mastering-desire':
    'Technical protocol on Dopamine as biological Prediction Error for biocomputer upgrade. Reclaim drive, escape Dopamine Traps.',
  'dopamine-stacking-preventing-circuit-overload':
    'Learn how to prevent neural burnout. Master your dopamine baseline and stop glutamate storms with ONDA\'s neurochemical protocols.',
  'circadian-reset-mastering-light':
    'Technical protocol on photic signal and System Clock for biocomputer upgrade. Fix Circadian Drift, insomnia, brain fog.',
  'metabolic-flexibility-dual-fuel-system':
    'Technical protocol on dual-fuel (glucose/ketones) for biocomputer upgrade. Eliminate brain fog, access stable metabolic power.',
  'neuroplasticity-flow-overclocking':
    'Technical protocol on BDNF, Flow State, myelination for biocomputer upgrade. Rewrite neural hardware for peak cognition.',
  'gut-brain-axis-data-link':
    'Technical protocol on Gut-Brain Axis for biocomputer upgrade. Optimize microbiome, mood, immunity, and cognition.',
  'breathwork-command-line-interface':
    'Technical protocol on breath as CLI for biocomputer upgrade. Box Breathing, Physiological Sigh, Nasal Breathing for Root Access.',
  'hrv-training-nervous-system-latency':
    'Technical protocol on HRV and nervous system latency for biocomputer upgrade. Calibrate recovery, read the pulse of your code.',
  'digital-dementia-attentional-control':
    'Technical protocol on attentional firewall for biocomputer upgrade. Install protection against digital fragmentation.',
  'longevity-hardware-cellular-cleanup':
    'Technical protocol on Autophagy and Senolysis for biocomputer upgrade. Extend hardware operational lifespan.',
  'cognitive-architecture-nootropic-stacks':
    'Technical protocol on nootropic stacks for biocomputer upgrade. Neuroprotection, neurotransmission, Cerebral Blood Flow.',
  'mitochondrial-biogenesis-cellular-power-grid':
    'Technical protocol on mitochondrial biogenesis for biocomputer upgrade. Build new power units, raise total wattage.',
  'circadian-lighting-dark-therapy':
    'Technical protocol on Circadian Lighting and Dark Therapy for biocomputer upgrade. Restore hormonal integrity, eliminate photic noise.',
  'glp1-biology-muscle-preservation':
    'Natural GLP-1 activation protocols using Berberine and Protein Leverage to optimize metabolism without muscle loss.',
  'mitochondrial-dna-red-light':
    'How NIR light reduces water viscosity and boosts ATP synthase efficiency. A deep dive into mitochondrial photonics.',
  'senolytic-high-dosing-longevity':
    'Learn the "Hit and Run" protocol using Quercetin, Dasatinib, and Fisetin to clear senescent "zombie" cells and slow biological aging.',
  'ai-biomarker-tracking-predictive':
    'Move beyond static tracking. Learn how AI-driven predictive analytics can forecast illness and burnout before symptoms appear.',
  'phase-locked-acoustic-sleep':
    'Learn how to use phase-locked acoustic stimulation and real-time EEG to amplify deep sleep waves and optimize cognitive recovery.',
  'neural-entrainment-meditation-2':
    'Master your brain\'s operating frequency using EEG-driven AI audio and the Frequency Following Response.',
  'cacao-stem-cells':
    'Filter the noise. Learn how purified cacao flavonols trigger stem cell production and optimize your regenerative matrix without stimulant overload.',
  'cognitive-architecture-neural-throughput':
    'Upgrade your neural hardware. Master the protocols of cognitive architecture: clear the signal, manage neural noise, and expand bandwidth without external patches.',
  'system-feedback-biometric-loop':
    'Stop tracking and start optimizing. Learn how ONDA turns your biometric data into immediate corrective protocols for peak performance.',
  'endocrine-social-drive-oxytocin-testosterone':
    'Learn to balance the trust protocol (Oxytocin) and the status protocol (Testosterone) for optimal social resonance and charismatic leadership.',
  'hpa-axis-control-cortisol-aggression':
    'Master your stress architecture. Learn how to manage the HPA axis, cortisol spikes, and reactive aggression using ONDA neuro-protocols.',
  'system-stability-serotonin':
    'Learn how to calibrate your inner status and cognitive calm. Explore the link between posture, gut health, and serotonin production.',
  'energy-sensor-leptin':
    'Master your hunger signals. Learn how to recalibrate leptin sensitivity, fix metabolic resistance, and restore energy balance using ONDA protocols.',
  'neural-optimizer-estrogen':
    'Discover how estrogen functions as a neural optimizer, enhancing memory and protecting the brain from inflammation and cognitive decline.',
  'protocol-circadian-hard-reset':
    'The 72-hour Circadian Hard Reset: three Zeitgeber interventions — Photonic Anchor, Thermal Spike, Metabolic Gate — to reflash a drifted biological clock in under three days.',
  'ancestral-sync-circadian-anchors':
    'Three ancestral Zeitgeber anchors — morning light, thermal reset, and metabolic gate — to lock your circadian clock and prevent epigenetic drift. ONDA Protocol.',
  'longevity-protocol-biological-clock-reset':
    'Reset your epigenetic age with the ONDA Deep Reset stack: 48-hour dark surge, pulsed hormesis, and DFA-guided wind down to optimize the Horvath Clock and slow biological aging.',
  'nervous-system-ping-latency':
    'Your ANS has a ping rate. Low HRV = biological packet loss. The ONDA latency audit uses resonant frequency breathing and VNS patching to reduce autonomic lag and upgrade system performance.',
  'fault-tolerant-human-hrv-buffer':
    'Low HRV = no headroom — any load triggers cascade failure. The ONDA hardening protocol builds your HRV buffer via hormetic loading, VNS calibration, and predictive morning HRV monitoring.',
  'resonant-frequency-system-coherence':
    'Every person has a unique resonant breathing frequency (4.5–6.5 breaths/min) where HRV peaks, vascular resistance drops, and the brain shifts to Alpha/Theta clarity. The ONDA resonance scan finds yours.',
  'baroreflex-01hz-shift':
    'At 0.1 Hz your breathing locks with Mayer Waves, hijacking the baroreflex to maximize HRV amplitude, lower blood pressure, and phase-lock the heart-brain coherence signal in under 90 seconds.',
  'nightly-flush-glymphatic-neural-cache':
    'The glymphatic system only runs during Deep Sleep — flushing beta-amyloids via 60% expanded intercellular space. The ONDA purge protocol maximizes N3 depth, arterial pulsatility, and lateral positioning.',
  'neural-hydraulics-csf-flow':
    'The brain is a hydraulic machine — arteries act as pistons, CSF flushes metabolic waste, posture controls pressure. The ONDA hydraulic protocol primes vascular elasticity, gravity, and breath for full nightly purge.',
  'anti-entropy-neural-architecture':
    'Aging is accumulated entropy. The ONDA Anti-Entropy Protocol layers glymphatic clearance, autophagy-sync fasting, and thermal regulation to halt beta-amyloid drift before it crosses the irreversibility threshold.',
  'idle-state-alpha-rhythms':
    'Alpha waves (8–12 Hz) are the brain\'s neutral gear — noise-cancelled, energy-efficient, globally coherent. The ONDA idle protocol triggers Alpha manually via visual reset, 0.1 Hz coupling, and digital decoupling.',
  'neural-bridge-alpha-flow-gateway':
    'Alpha waves (8–12 Hz) are the network gateway to Theta insight storage and Gamma-bound flow. The ONDA bridge protocol opens cross-frequency coupling via 0.1 Hz resonance, diffused focus, and 90-second system silence.',
  'quiet-mode-alpha-cortisol-buffer':
    'Alpha waves (8–12 Hz) are the brain\'s active noise-cancellation layer — suppressing cortisol, filtering amygdala reactivity, and restoring vagal tone. The ONDA Quiet Mode uses exhale extension, peripheral awareness, and the Alpha-Drop.',
}

export interface RouteMeta {
  title: string
  description: string
  url: string
  breadcrumbs: BreadcrumbItem[]
  ogType?: 'article' | 'website'
  /** Article image for og:image, twitter:image (absolute URL) */
  image?: string
  imageAlt?: string
  definedTerm?: { name: string; description: string; url: string }
  techArticle?: {
    name: string
    description: string
    url: string
    datePublished: string
    image?: string
    keywords?: string[]
    audience?: string
    dependencies?: string
    proficiencyLevel?: string
    educationalLevel?: string
  }
  howTo?: { name: string; step: { name: string; text: string }[] }
  faq?: { mainEntity: { question: string; answer: string }[]; url: string }
  contactPage?: { name: string; description: string; url: string; email: string }
  aboutPage?: { name: string; description: string; url: string }
  creativeWork?: { name: string; description: string; url: string; about: string[] }
  course?: { name: string; description: string; url: string }
}

function buildBreadcrumbs(route: string): BreadcrumbItem[] {
  const home = { name: 'Home', url: SITE_URL }
  if (route === '/') return [home]

  const items: BreadcrumbItem[] = [home]
  const segments = route.split('/').filter(Boolean)

  if (segments[0] === 'about') {
    items.push({ name: 'About', url: `${SITE_URL}/about` })
    return items
  }
  if (segments[0] === 'glossary') {
    items.push({ name: 'Glossary', url: `${SITE_URL}/glossary` })
    if (segments[1]) {
      const term = getTermBySlug(segments[1])
      items.push({
        name: term?.title ?? segments[1],
        url: `${SITE_URL}/glossary/${segments[1]}`,
      })
    }
    return items
  }
  if (segments[0] === 'contact') {
    items.push({ name: 'Contact', url: `${SITE_URL}/contact` })
    return items
  }
  if (segments[0] === 'the-stack') {
    items.push({ name: 'The Stack', url: `${SITE_URL}/the-stack` })
    return items
  }
  if (segments[0] === 'articles') {
    items.push({ name: 'Articles', url: `${SITE_URL}/articles` })
    if (segments[1]) {
      const article = getArticleBySlug(segments[1])
      items.push({
        name: article?.title ?? segments[1],
        url: `${SITE_URL}/articles/${segments[1]}`,
      })
    }
    return items
  }
  if (segments[0] === 'part' && segments[1]) {
    const part = parts[segments[1]]
    if (part) {
      const levelNum = part.badge.match(/LEVEL (\d+)/)?.[1]
      const level = levelNum ? levelsData[parseInt(levelNum, 10)] : undefined
      if (level) {
        items.push({ name: `Level ${level.number}: ${level.name}`, url: `${SITE_URL}/level/${level.number}` })
      }
      const levelDomain = part.badge.match(/LEVEL \d+: ([^/]+)/)?.[1]?.trim()?.split(' ')[0] ?? ''
      const domainLabel = levelDomain ? levelDomain.charAt(0) + levelDomain.slice(1).toLowerCase() : ''
      const partLabel = `${part.title} ${part.titleHighlight}`.trim()
      const label = domainLabel ? `${domainLabel} / ${partLabel}` : partLabel
      items.push({ name: label, url: `${SITE_URL}/part/${segments[1]}` })
    } else {
      items.push({ name: segments[1], url: `${SITE_URL}/part/${segments[1]}` })
    }
    return items
  }
  if (segments[0] === 'level' && segments[1]) {
    const level = levelsData[parseInt(segments[1], 10)]
    const label = level ? `Level ${level.number}: ${level.name}` : `Level ${segments[1]}`
    items.push({ name: label, url: `${SITE_URL}/level/${segments[1]}` })
    return items
  }
  if (segments[0] === 'bio') {
    items.push({ name: 'Bio OS', url: `${SITE_URL}/bio` })
    if (segments[1]) {
      const metric = METRIC_DETAILS[segments[1]]
      items.push({
        name: metric?.shortTitle ?? segments[1],
        url: `${SITE_URL}/bio/${segments[1]}`,
      })
    }
    return items
  }

  return items
}

function buildBreadcrumbListJsonLd(breadcrumbs: BreadcrumbItem[]): string {
  const list = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return JSON.stringify(list)
}

function buildDefinedTermJsonLd(name: string, description: string, url: string): string {
  const term = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'ONDA Life Glossary',
      url: `${SITE_URL}/glossary`,
    },
  }
  return JSON.stringify(term)
}

function buildTechArticleJsonLd(
  name: string,
  description: string,
  url: string,
  datePublished: string,
  opts?: {
    image?: string
    keywords?: string[]
    audience?: string
    dependencies?: string
    proficiencyLevel?: string
    educationalLevel?: string
  }
): string {
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: name,
    description,
    url,
    datePublished,
    author: {
      '@type': 'Organization',
      name: 'ONDA',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ONDA Life',
      url: SITE_URL,
    },
  }
  if (opts?.image) article.image = opts.image
  if (opts?.keywords?.length) article.keywords = opts.keywords.join(', ')
  if (opts?.audience) {
    article.audience = {
      '@type': 'Audience',
      name: opts.audience,
    }
  }
  if (opts?.dependencies) article.dependencies = opts.dependencies
  if (opts?.proficiencyLevel) article.proficiencyLevel = opts.proficiencyLevel
  if (opts?.educationalLevel) article.educationalLevel = opts.educationalLevel
  return JSON.stringify(article)
}

function buildContactPageJsonLd(
  name: string,
  description: string,
  url: string,
  email: string
): string {
  const contactPage = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    description,
    url,
    mainEntity: {
      '@type': 'Organization',
      name: 'ONDA Life',
      email,
      url: SITE_URL,
    },
  }
  return JSON.stringify(contactPage)
}

function buildCreativeWorkJsonLd(
  name: string,
  description: string,
  url: string,
  about: string[]
): string {
  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    author: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
    about: about.map((item) => ({ '@type': 'Thing', name: item })),
  }
  return JSON.stringify(creativeWork)
}

function buildCourseJsonLd(name: string, description: string, url: string): string {
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
    courseCode: 'ONDA-L7-DNA',
  }
  return JSON.stringify(course)
}

function buildAboutPageJsonLd(name: string, description: string, url: string): string {
  const aboutPage = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name,
    description,
    url,
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'ONDA Life',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'iOS, Android',
      description:
        'Operating system for consciousness. Biohacking platform with HRV tracking, neural hardware optimization, and 8 levels of consciousness development.',
      url: SITE_URL,
    },
  }
  return JSON.stringify(aboutPage)
}

function buildHowToJsonLd(name: string, steps: { name: string; text: string }[], url: string): string {
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    url,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
  return JSON.stringify(howTo)
}

/** FAQ schema for level pages. 2–3 key Q&As per level for FAQPage JSON-LD. */
const FAQ_LEVEL_SCHEMA: Record<number, { question: string; answer: string }[]> = {
  6: [
    {
      question: 'What is Level 6 BRAIN / AQUA II in the ONDA System?',
      answer:
        'Level 6 is the stage of Cognitive Sovereignty and Global Neural Integration. You transition from managing the body to mastering the "command deck" of consciousness — establishing neural distance from the internal dialogue, synchronizing brain architecture, and activating collective resonance. Protocols: I Witness, I Integrate, I Synchronize.',
    },
    {
      question: 'What is the meta-programmer protocol?',
      answer:
        'The meta-programmer is the outcome of Part 16 (I Witness): you cease to be a hostage of the stream of consciousness and become its Architect. Through DMN deactivation and metacognitive monitoring, thoughts become transparent electrical impulses you observe rather than react to.',
    },
    {
      question: 'How does Level 6 improve inter-brain coherence?',
      answer:
        'Part 18 (I Synchronize) triggers Gamma rhythms (40 Hz) and the Mirror Neuron System, achieving neuroelectric phase-locking with others. You gain the ability to instantly "lock into" the rhythm of a group — inter-brain phase coherence for collective insight.',
    },
  ],
  7: [
    {
      question: 'What is Level 7 DNA / AER II in the ONDA System?',
      answer:
        'Level 7 is the stage of DNA Consciousness and Epigenetic Mastery — the human as a Biological Designer. You transition from biological objects to Evolutionary Creators, accessing the billion-year-old library of DNA, activating cellular regeneration, and aligning with the developmental vector of Life. Protocols: I Remember, I Restore, I Synthesize.',
    },
    {
      question: 'What is the I Remember protocol?',
      answer:
        'I Remember (Part 19) is the protocol of DNA Consciousness and Evolutionary Memory. It transitions you from "Self" to "Species" by activating the brainstem and archicortex, transforming ancient instincts into conscious resources. Ancestral Breathing modulates epigenetic markers and stabilizes instinctive calm.',
    },
    {
      question: 'What is Biological Sovereignty?',
      answer:
        'Biological Sovereignty is the outcome of completing Level 7. It includes epigenetic freedom (editing your hereditary code), the Factory Settings Effect (clarity and "newness" in tissues and mind), evolutionary validity (belonging to the arrow of life), and sustainable flow fueled by healthy eustress.',
    },
  ],
  8: [
    {
      question: 'What is Level 8 ATOMIC / IGNIS II in the ONDA System?',
      answer:
        'Level 8 is the final stage of the ONDA system — Quantum Consciousness and Reality Creation. You transition from biological object to Reality Creator, returning to the Singularity Point where consciousness is recognized as a medium of infinite energy density. Protocols: I Am Vibration, I Am Wholeness, I Am the Source.',
    },
    {
      question: 'What is Quantum Sovereignty?',
      answer:
        'Quantum Sovereignty is the outcome of completing Level 8. It includes Fundamental Peace (silence independent of circumstances), Direct Authorship (life emanates from you), Instant Realignment (annihilating stress in nanoseconds), and Radiation of Presence (your field harmonizes the environment).',
    },
    {
      question: 'What is the Zero Point Practice?',
      answer:
        'Zero Point Practice is a Level 8 protocol: holding attention in the silence before a thought arises to enter the space of Pure Awareness. It leads to the Neural Activity Zero Point — a state of consciousness preceding thought — using the Thalamus as a gateway from potential to manifestation.',
    },
  ],
}

/** FAQ schema for article pages. 2–3 key Q&As per article for FAQPage JSON-LD. */
const FAQ_SCHEMA: Record<string, { question: string; answer: string }[]> = {
  'vagus-nerve-master-key': [
    {
      question: 'How can I stimulate my Vagus Nerve?',
      answer:
        'You can stimulate the Vagus Nerve through deep diaphragmatic breathing, cold exposure (face dunking), gargling, and singing. These activities trigger the parasympathetic nervous system and improve heart rate variability (HRV).',
    },
    {
      question: 'What are the signs of low vagal tone?',
      answer:
        'Common signs include chronic stress, difficulty relaxing, digestive issues, high resting heart rate, and poor emotional regulation.',
    },
  ],
  'dopamine-architecture-mastering-desire': [
    {
      question: 'How do I fix my dopamine levels?',
      answer:
        "To stabilize dopamine, implement a 'Dopamine Fast' by reducing hyper-stimulating inputs (social media, ultra-processed food), getting morning sunlight, and practicing delayed gratification.",
    },
    {
      question: 'What is a dopamine baseline?',
      answer:
        'The dopamine baseline is the steady level of dopamine circulating in your system. Spiking it too high with cheap rewards leads to a subsequent crash below the baseline, causing lack of motivation.',
    },
  ],
  'metabolic-flexibility-dual-fuel-system': [
    {
      question: 'How do I achieve metabolic flexibility?',
      answer:
        'By utilizing intermittent fasting, reducing refined carbohydrate intake, and performing zone 2 cardio. This trains your mitochondria to switch efficiently between burning glucose and stored body fat.',
    },
    {
      question: 'What is the benefit of being metabolically flexible?',
      answer:
        "It provides stable energy levels throughout the day, eliminates 'energy crashes' after meals, and improves cognitive clarity and physical endurance.",
    },
  ],
  'circadian-reset-mastering-light': [
    {
      question: 'How does morning light affect my circadian rhythm?',
      answer:
        'Viewing sunlight within 30 minutes of waking triggers a timed Cortisol pulse and sets a 16-hour countdown for Melatonin release. It is the single most important sync-signal for your biological clock.',
    },
    {
      question: 'Why does blue light at night disrupt sleep?',
      answer:
        'Blue light suppresses Melatonin by tricking the Suprachiasmatic Nucleus (SCN) into thinking it is still noon. Your brain never receives the shutdown signal, so you lie in bed with a body that thinks it is midday.',
    },
    {
      question: 'What is the First Photon protocol?',
      answer:
        'View sunlight within 30 minutes of waking—10 mins on a clear day, 20–30 mins on a cloudy day. This resyncs your System Clock with the solar cycle.',
    },
  ],
  'longevity-hardware-cellular-cleanup': [
    {
      question: 'What are senescent cells and why do they matter?',
      answer:
        'Senescent cells are "zombie cells" that stop dividing but refuse to die, leaking inflammatory signals (SASP) that corrupt neighboring healthy tissue. They accelerate aging across your entire system.',
    },
    {
      question: 'How do I trigger autophagy?',
      answer:
        'Extended fasting (36–72 hours), intermittent fasting, and zone 2 cardio trigger autophagy. During nutrient scarcity, your cells break down old proteins and damaged organelles to create new energy.',
    },
    {
      question: 'What are natural senolytics?',
      answer:
        'Quercetin (capers, red onions) and Fisetin (strawberries) act as targeted deletion tools. They selectively induce apoptosis in senescent cells while leaving healthy cells untouched.',
    },
  ],
  'neuroplasticity-flow-overclocking': [
    {
      question: 'What is BDNF and why does it matter for learning?',
      answer:
        'BDNF (Brain-Derived Neurotrophic Factor) is a protein that supports neuron survival and synaptic plasticity. It is the "growth hormone" for your brain—essential for learning, memory, and flow state.',
    },
    {
      question: 'How do I enter flow state more reliably?',
      answer:
        'Flow requires a challenge-skill balance, clear goals, immediate feedback, and elimination of distractions. Physical triggers include zone 2 cardio, cold exposure, and proper sleep.',
    },
  ],
  'gut-brain-axis-data-link': [
    {
      question: 'How does the gut affect the brain?',
      answer:
        'The gut-brain axis is a bidirectional communication system. Gut microbes produce neurotransmitters (e.g., serotonin), short-chain fatty acids, and inflammatory signals that directly influence mood, cognition, and stress response.',
    },
    {
      question: 'What improves gut-brain signaling?',
      answer:
        'High fiber intake (30g/day), polyphenols (dark chocolate, berries), fermented foods, and avoiding ultra-processed foods support a healthy microbiome and stronger vagal tone.',
    },
  ],
  'breathwork-command-line-interface': [
    {
      question: 'What is resonant frequency breathing?',
      answer:
        'Resonant frequency breathing (typically 5–6 breaths per minute) synchronizes heart rate with breathing, maximizing heart rate variability (HRV) and activating the parasympathetic nervous system.',
    },
    {
      question: 'When should I use the physiological sigh?',
      answer:
        'The physiological sigh (double inhale through nose, long exhale) is an instant reboot for acute stress. Use it before meetings, during anxiety spikes, or when you need to downshift quickly.',
    },
  ],
  'hrv-training-nervous-system-latency': [
    {
      question: 'What does HRV tell me about my nervous system?',
      answer:
        'HRV (Heart Rate Variability) reflects the balance between sympathetic and parasympathetic tone. Higher HRV indicates better stress resilience, faster recovery, and a more responsive nervous system.',
    },
    {
      question: 'How do I improve my HRV baseline?',
      answer:
        'Morning baseline scans, resonant breathing (5.5s inhale/exhale), cold exposure, and consistent sleep improve HRV. Track it daily to calibrate your recovery protocols.',
    },
  ],
  'digital-dementia-attentional-control': [
    {
      question: 'What is the attentional firewall?',
      answer:
        'The attentional firewall is a set of protocols that protect your focus from digital fragmentation: monotasking blocks, analog mornings, and dopamine fasting to reclaim sustained attention.',
    },
    {
      question: 'How does multitasking damage cognition?',
      answer:
        'Context-switching fragments working memory and prevents deep encoding. Each switch incurs a "cognitive tax" that accumulates as brain fog and reduced productivity.',
    },
  ],
  'cognitive-architecture-nootropic-stacks': [
    {
      question: 'What is the Focus Baseline stack?',
      answer:
        'A 1:2 ratio of Caffeine (100mg) to L-Theanine (200mg). Theanine smooths the caffeine edge while preserving alertness, reducing jitter and improving sustained focus.',
    },
    {
      question: 'How does Alpha-GPC support memory?',
      answer:
        'Alpha-GPC is a cholinergic precursor that crosses the blood-brain barrier. Paired with Bacopa Monnieri, it supports acetylcholine production for memory encoding and recall.',
    },
  ],
  'mitochondrial-biogenesis-cellular-power-grid': [
    {
      question: 'How do I build new mitochondria?',
      answer:
        'HIIT, zone 2 cardio, cold exposure, and photonic charging (red/NIR light) trigger mitochondrial biogenesis. The PGC-1α pathway is the master switch for creating new power units.',
    },
    {
      question: 'What is the sauna-cold cycle for?',
      answer:
        '20 minutes of sauna followed by 3 minutes of cold triggers heat shock and cold shock proteins. These molecular chaperones help proteins fold correctly and protect against cellular damage.',
    },
  ],
  'circadian-lighting-dark-therapy': [
    {
      question: 'What is dark therapy?',
      answer:
        'Dark therapy involves blocking blue light and reducing overall light exposure after sunset. Orange/red lenses or blue-blocking glasses allow natural melatonin release and circadian alignment.',
    },
    {
      question: 'Why use red light at night?',
      answer:
        'Red light (2000K or lower) does not suppress melatonin. It provides enough illumination for evening activities without disrupting the shutdown sequence for sleep.',
    },
  ],
  'glp1-biology-muscle-preservation': [
    {
      question: 'Can Berberine replace resistance training?',
      answer:
        'No. Berberine manages fuel efficiency (software), but resistance training is the only signal that tells the body to retain muscle mass (hardware).',
    },
    {
      question: 'Why not just use the drug?',
      answer:
        'Endogenous stimulation preserves your metabolism\'s natural feedback loops, preventing "Ozempic face" (the loss of facial fat pads and muscle tone) and rebound weight gain.',
    },
  ],
  'mitochondrial-dna-red-light': [
    {
      question: 'What wavelengths are best for NIR photobiomodulation?',
      answer:
        '660nm (red) penetrates surface tissue; 850nm (near-infrared) reaches deeper. Combined, they target both superficial and mitochondrial layers. Medical-grade panels typically use both.',
    },
    {
      question: 'Why does hydration matter for red light sessions?',
      answer:
        'Water serves as the substrate for the fourth-phase (EZ) structured layer around ATP Synthase. Adequate hydration ensures the viscosity-reducing effect can occur at biological membranes.',
    },
  ],
  'cacao-stem-cells': [
    {
      question: 'Why use decaffeinated cacao for stem cell protocols?',
      answer:
        'Caffeine and theobromine create adrenal spikes that conflict with deep recovery states. By filtering them out, polyphenols work directly on blood flow and stem cell mobilization without overclocking the nervous system.',
    },
    {
      question: 'What is the Micro-Circulation Loop protocol?',
      answer:
        '20 minutes of low-intensity movement (heart rate < 110 bpm) after cacao ingestion. Physical movement acts as the pump, ensuring cacao-driven signals reach the furthest capillaries of your vascular system.',
    },
    {
      question: 'How does red light therapy close the regeneration loop?',
      answer:
        'Red light (660nm) provides mitochondria with ATP to utilize stem cells produced during the day. It completes the regeneration sequence before sleep.',
    },
  ],
  'system-feedback-biometric-loop': [
    {
      question: 'What is the Biometric Feedback Loop?',
      answer:
        'A real-time system where HRV, resting heart rate, and sleep data are continuously ingested and used to select the correct protocol. Instead of fixed schedules, the system adapts: low HRV triggers Recovery Mode, high HRV enables Performance Mode.',
    },
    {
      question: 'What is the Delta Analysis in biometric optimization?',
      answer:
        'Delta Analysis compares current HRV and body temperature against your 14-day rolling average. Any drop in HRV more than 20% below baseline triggers the System Protection Protocol—replacing high-intensity plans with vagal reset and recovery protocols.',
    },
    {
      question: 'What is the difference between Performance, Maintenance, and Recovery Mode?',
      answer:
        'Performance Mode (high HRV): ideal for learning, complex tasks, and high physical load. Maintenance Mode (normal HRV): standard operational cycles. Recovery Mode (low HRV): forced digital detox, CO2 tolerance breathing, and early glymphatic flush.',
    },
  ],
  'cognitive-architecture-neural-throughput': [
    {
      question: 'What is the Digital Sunset protocol?',
      answer:
        'Initiate a blue-light block 60 minutes before sleep. This prevents Melatonin suppression and ensures the Glymphatic System can flush metabolic waste from neural hardware during deep sleep.',
    },
    {
      question: 'Why does the brain need Omega-3 and antioxidants?',
      answer:
        'The brain is 60% fat. Omega-3 fatty acids and structural antioxidants update the lipid layer of neurons, increasing signal conduction speed without insulin spikes—delivering a steady current of ATP.',
    },
    {
      question: 'How does social interaction reduce neural noise?',
      answer:
        'Social isolation increases Amygdala hyperactivity (System Noise). In-person group synchronization aligns brain frequencies and lowers baseline stress load, freeing CPU resources for analytical tasks.',
    },
  ],
  'protocol-circadian-hard-reset': [
    {
      question: 'How long does a Circadian Hard Reset take?',
      answer:
        'The ONDA Circadian Hard Reset runs for 72 hours. Three consecutive days of synchronized Zeitgeber inputs — morning photonic anchor, afternoon thermal spike, and timed metabolic gate — are required to fully reflash a severely drifted biological clock.',
    },
    {
      question: 'What is a Zeitgeber and why does it reset the clock?',
      answer:
        'A Zeitgeber (German: "time giver") is any environmental signal that synchronizes the internal biological clock to the external 24-hour cycle. The most powerful are light (photonic anchor), temperature (thermal spike), and food timing (metabolic gate). Applying all three in the correct sequence forces the Suprachiasmatic Nucleus to realign within 72 hours.',
    },
    {
      question: 'Can I do the Hard Reset without cold exposure?',
      answer:
        'The thermal spike (cold exposure after morning light) is the second Zeitgeber in the stack. Skipping it reduces the reset speed significantly. A minimum of 60 seconds of face-and-neck cold-water immersion at ≤15°C is sufficient to trigger the norepinephrine pulse that signals "daytime" to the sympathetic nervous system.',
    },
  ],
  'ancestral-sync-circadian-anchors': [
    {
      question: 'What are the three ancestral circadian anchors?',
      answer:
        'The three ancestral Zeitgeber anchors in the ONDA protocol are: 1) Photonic Trigger — morning light within 30 minutes of waking to set the cortisol pulse and 16-hour melatonin countdown; 2) Thermal Reset — cold exposure in natural light to lock the temperature-circadian axis; 3) Metabolic Gate — first meal no earlier than 90 minutes after waking to synchronize the peripheral clocks in organs.',
    },
    {
      question: 'Why must the first meal be delayed after waking?',
      answer:
        'The Metabolic Gate principle states that immediate eating on waking sends an "any-time is feeding time" signal to peripheral liver and gut clocks, decoupling them from the central SCN clock. Delaying the first meal by 90 minutes ensures the cortisol peak has passed and peripheral clocks synchronize with the central rhythm, reducing epigenetic drift.',
    },
    {
      question: 'How quickly do circadian anchors fix disrupted sleep?',
      answer:
        'Consistent application of all three ancestral anchors — Photonic Trigger, Thermal Reset, and Metabolic Gate — typically produces measurable improvement in sleep onset latency and HRV within 5–7 days. Full resynchronization of the biological clock after severe jet lag or shift work takes 10–14 days of consistent anchor implementation.',
    },
  ],
  'quiet-mode-alpha-cortisol-buffer': [
    {
      question: 'How do Alpha waves (8–12 Hz) actively suppress cortisol and sympathetic arousal?',
      answer:
        'Alpha dominance interrupts the stress cascade via the prefrontal cortex. Sustained High-Beta neural activity drives tonic CRH (corticotropin-releasing hormone) release through an amygdala-hypothalamus loop. When Alpha power increases, the prefrontal cortex shifts from task-positive to default-mode operation and exerts inhibitory control over amygdala activation — reducing the perceived threat signal forwarded to the hypothalamus. With a diminished HPA axis input signal, CRH and ACTH output decreases, and the adrenal glands deprioritize cortisol production. The suppression is active, not passive: Alpha directly engages the top-down regulatory pathway, not merely the absence of stress.',
    },
    {
      question: 'What is Thermal Runaway in the context of chronic stress and why does it prevent sleep?',
      answer:
        'Thermal Runaway is the self-amplifying failure cascade that occurs when the nervous system loses access to the Alpha-state buffer. In this mode, chronic High-Beta entrainment becomes the default state — the brain keeps scanning for threats even after the threat is gone, because the threat-detection loop has decoupled from actual threat input. Sleep latency increases because the Beta-to-Delta sleep transition requires Alpha as the mandatory intermediate state. A brain locked in Beta at bedtime cannot skip the bridge and enter Theta or Delta directly. The result is that more exhaustion without Alpha intervention worsens sleep latency, not improves it — the system needs access to the Alpha bridge, not simply "enough tiredness."',
    },
    {
      question: 'Why does a slight forward head tilt (the Alpha-Drop) enhance Alpha wave generation?',
      answer:
        'The slight forward head tilt (~10–15° chin lowering) in the Alpha-Drop protocol works via two physical mechanisms. First, it increases CSF pressure at the occipital pole — the primary location of Alpha generators in the cortex — marginally improving the electrochemical environment for 8–12 Hz oscillation. Second, it reduces activation of the cervical sympathetic chain, which runs adjacent to the cervical vertebrae and contributes to sympathetic tone when the head is in an upright or extended position. The head-forward tilt passively reduces this input. Combined with eyes-closed sensory reduction and exhale-extended breathing, the Alpha-Drop creates three simultaneous hardware conditions that facilitate occipital Alpha generation without requiring willpower or technique mastery.',
    },
  ],
  'neural-bridge-alpha-flow-gateway': [
    {
      question: 'What is the Alpha-Theta bridge and how does it enable creative insights?',
      answer:
        'The Alpha-Theta bridge is the transitional brain state at the border of Alpha (8–12 Hz) and Theta (4–8 Hz) where the conscious prefrontal workspace becomes permeable to subconscious Theta-stored material — deep memory traces, non-linear associations, and emotional pattern networks. In this state, the prefrontal "censor" that normally filters out divergent ideas partially relaxes, allowing Theta content to surface into Alpha-range awareness. Insights experienced as "Eureka moments" are this bridging event made conscious — the result of Alpha-Gamma coupling propagating Theta-generated associations into prefrontal attention.',
    },
    {
      question: 'What is cross-frequency coupling and why does Alpha act as a carrier for Gamma waves?',
      answer:
        'Cross-frequency coupling (CFC) is the mechanism by which oscillations at different frequencies modulate each other. In the neural bridge context, Alpha waves (8–12 Hz) act as the phase carrier for Gamma bursts (30–80 Hz) — a phenomenon called phase-amplitude coupling. Alpha phase determines when Gamma amplitude is high (insight windows) and when it is suppressed. Without a stable Alpha carrier, Gamma bursts occur at random phases and are not coordinated across brain regions — insights are generated but not broadcast to the conscious workspace. A stable Alpha bridge synchronizes the timing of Gamma insight events with prefrontal attention windows, making them accessible.',
    },
    {
      question: 'How does the diffused focus technique open the neural bridge faster than relaxation?',
      answer:
        'Narrow screen-focus activates the dorsal attention network and frontal eye fields in High-Beta mode — a target-seeking, threat-scanning posture that actively suppresses Alpha and the default mode network. Switching to panoramic, diffused vision (soft gaze, full peripheral awareness) shifts activation to the ventral attention network and default mode network, which are associated with Alpha dominance and creative synthesis. This visual-posture switch is a direct hardware trigger: it acts on the alpha generators in the occipital cortex within seconds via visuomotor feedback loops — bypassing the slow, top-down cognitive effort required to "try to relax." The bridge opens faster via the eyes than via conscious intention.',
    },
  ],
  'idle-state-alpha-rhythms': [
    {
      question: 'What is the Alpha State (8–12 Hz) and why is it the optimal baseline for high performance?',
      answer:
        'The Alpha State (8–12 Hz) is the brain\'s "neutral gear" — a state of synchronized, low-noise neural activity where the thalamocortical system is maximally ready to engage any cognitive mode without residual friction from previous states. Alpha dominance indicates high thalamocortical gating efficiency (irrelevant sensory signals filtered), default mode network activation (strategic, integrative thinking), and inter-regional coherence (prefrontal-limbic coordination). Unlike the popular misconception of Alpha as "relaxation," it is the technical prerequisite for flow state entry — the system cannot enter deep focus from High-Beta; it must transit through Alpha first.',
    },
    {
      question: 'What is the Beta Trap and how does it degrade cognitive performance over the workday?',
      answer:
        'The Beta Trap is the state of chronic High-Beta entrainment (15–30 Hz) from which the modern high-demand brain cannot exit without deliberate intervention. Sustained stress, continuous digital input, and context switching maintain constant Amygdala-prefrontal competition — suppressing Alpha and keeping the system in reactive threat-evaluation mode. The cognitive costs compound over the workday: High-Beta neural firing consumes up to 3x more glucose than Alpha baseline, depleting prefrontal resources faster and degrading decision quality progressively from morning to evening. The trap closes completely when the inability to return to Idle prevents restorative sleep, starting the next day from an already-depleted baseline.',
    },
    {
      question: 'How does 0.1 Hz resonance breathing shift the brain from Beta to Alpha?',
      answer:
        'At 0.1 Hz baroreflex resonance, the heart generates a coherent oscillation that propagates via vagal afferents to the brainstem nucleus tractus solitarius and then to the thalamus. This pathway shifts thalamic firing from High-Beta gating (high vigilance, high filtering against incoming signals) to Alpha-frequency gating (readiness mode, efficient filtering of irrelevant signals). The thalamic shift propagates to the cortex within 2–3 minutes of sustained resonance breathing. HRV and Alpha amplitude are bidirectionally coupled: high HRV predicts high resting Alpha power, and Alpha entrainment (via visual reset or resonance breathing) measurably increases HRV coherence.',
    },
  ],
  'anti-entropy-neural-architecture': [
    {
      question: 'What is Neural Drift and how does it relate to neurodegeneration?',
      answer:
        'Neural Drift is the gradual accumulation of metabolic entropy in the brain — the progressive buildup of beta-amyloid plaques and tau protein tangles that occurs when glymphatic clearance chronically underperforms. Each night of poor sleep or low HRV adds to a metabolic debt that compounds over years. When the accumulated protein burden crosses recovery thresholds, it begins to impair synaptic plasticity, inhibit axonal transport, and disrupt neural circuitry — the transition from recoverable suboptimality to irreversible neurodegeneration. The ONDA Anti-Entropy Protocol addresses this as an engineering failure, not an inevitable biological process.',
    },
    {
      question: 'How does intermittent fasting synchronize with glymphatic clearance for dual-channel detox?',
      answer:
        'Glymphatic flushing clears extracellular waste (beta-amyloid, tau, glutamate) from between neurons. Autophagy — triggered by mTOR suppression during fasting — clears intracellular waste (damaged organelles, misfolded proteins, dysfunctional mitochondria) from inside neurons. A 4-hour pre-sleep fasting window initiates both processes simultaneously: the glymphatic pump activates with N3 sleep onset, while autophagy is already running from the fast. Running both in the same time window creates a dual-channel purge that eliminates waste at both the extracellular and intracellular level — a combinatorial effect no single-mechanism approach achieves.',
    },
    {
      question: 'Why does brain temperature during sleep affect glymphatic clearance efficiency?',
      answer:
        'Glymphatic flow velocity is temperature-dependent. At lower brain temperatures (17–18°C ambient), two mechanisms amplify clearance: first, CSF viscosity decreases slightly, reducing hydraulic resistance in the perivascular channels and increasing flow velocity per arterial pump stroke. Second, the hypothalamic thermostat interprets head cooling as a deep-night signal, extending Stage N3 duration and allowing the glymphatic pump to operate longer per sleep cycle. Maintaining cool head temperature throughout the night — via cooling gel pillows and controlled room temperature — sustains both effects for the full glymphatic window.',
    },
  ],
  'neural-hydraulics-csf-flow': [
    {
      question: 'How do arteries function as the brain\'s hydraulic pump for CSF clearance?',
      answer:
        'With each heartbeat, arteries in the brain expand and contract — generating a pressure wave that physically pushes cerebrospinal fluid (CSF) through the perivascular glymphatic channels surrounding them. This arterial pulsatility is the primary active force driving CSF through brain tissue to flush metabolic byproducts (beta-amyloids, tau proteins, glutamate). Higher HRV = more elastic arterial walls = larger pulsation amplitude = deeper CSF penetration per heartbeat. Low HRV and arterial stiffness reduce this pump stroke, leaving metabolic waste in deeper tissue layers.',
    },
    {
      question: 'What is hydraulic stasis and how does it cause morning brain fog?',
      answer:
        'Hydraulic stasis occurs when CSF flow velocity drops below clearance-effective thresholds — due to low HRV, poor sleep architecture, or supine sleep positioning. The result is incomplete overnight metabolic clearance: beta-amyloid and tau proteins accumulate on neuronal membranes, increasing electrical signal latency and raising the synaptic noise floor. This manifests as morning brain fog, heavy-headedness, and slow cognitive boot-up. In chronic cases, repeated stasis nights create the protein accumulation pathway associated with long-term neurodegeneration.',
    },
    {
      question: 'Why does diaphragmatic breathing before sleep improve brain fluid drainage?',
      answer:
        'Deep diaphragmatic breathing creates negative intra-thoracic pressure on each inhale — a partial vacuum in the chest cavity that assists venous return from the head via the jugular veins. This reduces cerebral venous congestion and lowers the baseline intracranial pressure entering the sleep window. Lower pre-sleep intracranial pressure creates a wider hydrostatic gradient for CSF outflow, allowing the glymphatic system to initiate flow faster at N3 onset. Extended exhale (6s vs 4s) additionally activates the parasympathetic branch, clearing residual cortisol and accelerating the sleep-onset transition.',
    },
  ],
  'nightly-flush-glymphatic-neural-cache': [
    {
      question: 'What is the glymphatic system and why does it only activate during deep sleep?',
      answer:
        'The glymphatic system is the brain\'s waste-clearance network — a series of perivascular channels through which cerebrospinal fluid (CSF) flushes metabolic byproducts (beta-amyloids, tau proteins, glutamate) from neural tissue. It activates exclusively during Stage N3 (Deep Sleep) because this is the only phase when the brain\'s intercellular space expands by 60%, creating the hydraulic pressure differential needed to drive CSF through the tissue at clearance-effective flow rates. During wakefulness, the neural activity and cellular volume prevent this expansion, making active glymphatic flushing impossible.',
    },
    {
      question: 'How does HRV affect glymphatic clearance efficiency?',
      answer:
        'Arterial pulsatility — the pressure wave generated by each heartbeat — is the primary hydraulic pump driving CSF through glymphatic perivascular channels. High HRV indicates a strong, rhythmically coherent pulse wave that generates consistent perivascular pressure cycles and deep CSF tissue penetration. Low HRV produces a weak, arrhythmic pump with shallow perivascular flow — leaving metabolic waste in deeper tissue layers. Evening 0.1 Hz resonance breathing maximizes baroreflex coherence, steadying and amplifying the pulse wave to prime the glymphatic pump before sleep onset.',
    },
    {
      question: 'Why does lateral sleep positioning improve brain detoxification?',
      answer:
        'The glymphatic drainage network is gravity-sensitive — CSF outflow via cervical lymphatic ducts and spinal subarachnoid pathways is geometrically favored by lateral positioning. Studies measuring CSF tracer clearance in animal models and human neuroimaging show 25–30% improvement in glymphatic outflow efficiency in lateral (side-sleeping) vs. supine position. The lateral position reduces hydraulic resistance in the drainage channels, allowing CSF to flow through the entire glymphatic network rather than pooling in posterior regions with restricted outflow.',
    },
  ],
  'baroreflex-01hz-shift': [
    {
      question: 'What are Mayer Waves and why does 0.1 Hz breathing synchronize with them?',
      answer:
        'Mayer Waves are slow oscillations in blood pressure with a natural frequency of approximately 0.1 Hz — one cycle every 10 seconds — produced by the baroreflex feedback loop as it regulates arterial pressure. Normally, breathing runs out of phase with this oscillation, causing partial cancellation of the HRV signal. When breathing frequency matches Mayer Wave frequency at 0.1 Hz (6 breaths per minute), the respiratory and cardiovascular oscillations phase-lock, creating constructive resonance — HRV amplitude surges to its physiological ceiling and baroreflex sensitivity reaches its maximum.',
    },
    {
      question: 'How does 0.1 Hz breathing lower blood pressure without medication?',
      answer:
        'Repeated sessions of 0.1 Hz baroreflex resonance training sensitize arterial baroreceptors — they become faster and more precise at detecting pressure deviations and commanding compensatory responses. Over 4–8 weeks of daily 10–20 minute sessions, this produces measurable increases in baroreflex sensitivity (BRS) and arterial elasticity, resulting in systolic blood pressure reductions of 7–15 mmHg in hypertensive individuals. The mechanism is neuroplastic: the brainstem cardiovascular control centers recalibrate their setpoint downward in response to the improved signal-to-noise ratio delivered by resonance breathing.',
    },
    {
      question: 'How quickly does the 0.1 Hz baroreflex hook produce measurable effects?',
      answer:
        'The acute effects begin within 90 seconds of reaching resonance: vagal efferent output increases, heart rate variability rises, and cortisol begins dropping. A 5-minute session is the minimum effective dose for measurable parasympathetic activation and cognitive noise reduction. A full 20-minute session produces baroreflex sensitization that persists 4–6 hours post-session, making it practical as a pre-work or pre-decision protocol. Blood pressure reduction accumulates over 4–8 weeks of consistent daily practice.',
    },
  ],
  'resonant-frequency-system-coherence': [
    {
      question: 'What is resonant frequency breathing and how does it differ from standard breathing exercises?',
      answer:
        'Resonant frequency breathing targets the exact individual rhythm (typically 4.5–6.5 breaths/min) where the cardiovascular and respiratory systems enter phase-lock — called baroreflex resonance. Unlike generic "deep breathing" with fixed timing, resonant frequency is identified through a personalized frequency sweep and LF-HRV peak analysis. At this specific frequency, HRV surges to its ceiling, vascular resistance drops, and the Vagus Nerve broadcasts a system-wide safety signal simultaneously.',
    },
    {
      question: 'How long does it take to identify my personal resonant frequency?',
      answer:
        'A basic resonance scan takes 20–30 minutes. Test 5.0, 5.5, 6.0, and 6.5 breaths per minute, holding each pattern for 3–4 minutes while monitoring HRV in real time. The frequency producing the highest LF spectral power peak is your resonant frequency. Once identified, it remains stable and becomes a lifelong calibration reference. A starting point before scanning: the 5:5 ratio (5-second inhale, 5-second exhale = 6 breaths/min) is the most common resonant point for adults.',
    },
    {
      question: 'What is "vagal capture" and how does resonant breathing trigger it?',
      answer:
        'Vagal capture is the phenomenon where sustained breathing at resonant frequency forces the Vagus Nerve into synchronized, high-amplitude oscillation — increasing efferent vagal output to the heart, gut, and immune system simultaneously. This begins within 90 seconds of reaching resonance and escalates over 5–10 minutes. The result is measurable cortisol reduction, improved gut motility, enhanced immune cell activity, and a brain shift into Alpha/Theta border activity — the state of relaxed alertness optimal for creative work and recovery.',
    },
  ],
  'fault-tolerant-human-hrv-buffer': [
    {
      question: 'What is the HRV buffer and how does it relate to resilience?',
      answer:
        'The HRV buffer is the physiological "headroom" available to absorb stress without system failure. High HRV indicates multiple redundant regulatory pathways between the Sympathetic and Parasympathetic branches — meaning the system can absorb shocks, adapt, and continue operating at near-optimal state. Low HRV means the system is already at max capacity; any additional stressor triggers cascade failure: burnout, illness, or cognitive paralysis.',
    },
    {
      question: 'What is hormetic stress loading and how does it expand the HRV buffer?',
      answer:
        'Hormetic stress loading uses controlled, short-duration stress spikes — cold exposure (≤15°C, 2–3 min), CO₂ tolerance training, or HIIT at 80–90% max HR — to force the regulatory system to practice recovery. Each spike followed by complete recovery trains the system to exit stress states faster. Over 4–6 weeks, the HRV baseline rises and the recovery slope steepens, expanding the operational buffer.',
    },
    {
      question: 'How can morning HRV predict illness 48 hours in advance?',
      answer:
        'HRV trends reflect immune and autonomic load before subjective symptoms appear. A sustained drop of >10% from a 7-day rolling morning HRV average signals that the system is fighting an incoming threat — viral, bacterial, or accumulated stress overload — 24–72 hours before any symptoms manifest. Acting on this signal by reducing training intensity, increasing sleep, and adding VNS sessions allows the system to resolve the threat at the buffer level rather than escalating to full cascade failure.',
    },
  ],
  'nervous-system-ping-latency': [
    {
      question: 'What is HRV and why does it measure nervous system latency?',
      answer:
        'HRV (Heart Rate Variability) measures the millisecond variation between heartbeats (R-R intervals). High variability indicates that the Parasympathetic branch (Vagus Nerve) is actively modulating cardiac rhythm, meaning the system responds fast to incoming signals and returns to baseline quickly — low latency. A metronome-like, low-variability heartbeat signals Sympathetic overactivation: the network is stuck, recovery is slow, and the "ping" is high.',
    },
    {
      question: 'What is resonant frequency breathing and how does it reduce ANS latency?',
      answer:
        'Resonant frequency breathing synchronizes the heart, lungs, and baroreflex at a shared oscillation frequency — typically ~0.1 Hz (one full breath cycle every 10 seconds). At this rate, cardiac oscillation, blood pressure waves, and cerebral blood flow phase-lock into a coherent wave, dramatically increasing HRV during the session. The elevated baseline persists for hours. This is not relaxation; it is network synchronization that reduces autonomic response lag.',
    },
    {
      question: 'How long does HRV biofeedback training take to show results?',
      answer:
        'Short-term effects (elevated HRV, reduced cortisol, improved cognitive switching) appear within a single 10–20 minute resonant frequency breathing session. Structural improvements in vagal tone and resting HRV baseline become measurable after 4–6 weeks of consistent daily practice. Load-followed-by-recovery training — performing biofeedback immediately after high-stress events — accelerates the adaptation timeline.',
    },
  ],
  'longevity-protocol-biological-clock-reset': [
    {
      question: 'What is the Horvath Clock and can it be reversed?',
      answer:
        'The Horvath Clock is a DNA methylation-based biomarker developed by Steve Horvath that measures biological age independently of chronological age. Research shows that behavioral interventions targeting circadian synchronization — combined with specific hormetic stressors — can slow and in some cases partially reverse the methylation age score.',
    },
    {
      question: 'How does the 48-Hour Dark Surge reset the epigenetic clock?',
      answer:
        'The 48-Hour Dark Surge eliminates all artificial blue light after sunset for two consecutive days, maximizing endogenous melatonin production. Beyond its role as a sleep hormone, melatonin functions as the most potent mitochondrial antioxidant — entering mitochondria directly to neutralize reactive oxygen species that drive epigenetic drift and DNA methylation aging.',
    },
    {
      question: 'What is DFA alpha 1 and how is it used in the wind-down protocol?',
      answer:
        'DFA alpha 1 (Detrended Fluctuation Analysis) measures the fractal correlation of heart rate, serving as a real-time indicator of autonomic balance. A value above 1.0 signals parasympathetic dominance and readiness for restorative sleep. In the ONDA Deep Reset protocol, DFA alpha 1 is monitored in the evening; if it remains low, a targeted VNS session (paced breathing at 0.1 Hz) forces the transition within 8–12 minutes.',
    },
  ],
}

function buildFAQPageJsonLd(
  mainEntity: { question: string; answer: string }[],
  url: string
): string {
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: mainEntity.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url,
  }
  return JSON.stringify(faqPage)
}

export function getMetaForRoute(route: string): RouteMeta {
  const url = buildCanonicalUrl(route)

  const breadcrumbs = buildBreadcrumbs(route)

  if (route === '/') {
    return { title: DEFAULT_TITLE, description: DEFAULT_DESC, url, breadcrumbs, ogType: 'website' }
  }
  if (route === '/sitemap') {
    return {
      title: 'Site Map | ONDA Life — All Pages & Sections',
      description: 'Complete index of all ONDA Life pages: articles, glossary terms, 8 levels, practice modules, and main sections. Navigate the full knowledge base.',
      url,
      breadcrumbs,
      ogType: 'website',
    }
  }
  if (route === '/about') {
    return {
      title: ABOUT_TITLE,
      description: ABOUT_DESC,
      url,
      breadcrumbs,
      ogType: 'website',
      aboutPage: {
        name: 'About ONDA Life',
        description: ABOUT_DESC,
        url,
      },
    }
  }
  if (route === '/glossary') {
    return { title: GLOSSARY_TITLE, description: GLOSSARY_DESC, url, breadcrumbs }
  }
  if (route === '/the-stack') {
    return { title: THE_STACK_TITLE, description: THE_STACK_DESC, url, breadcrumbs }
  }
  if (route === '/bio') {
    return {
      title: 'Bio OS — Live Biometrics in Your Browser | ONDA Life',
      description: 'Measure your heart rate, stress, energy and HRV right in the browser — no wearable required. Place your finger on the camera and get real-time biometric analysis.',
      url,
      breadcrumbs,
    }
  }
  const bioMetricMatch = route.match(/^\/bio\/([^/]+)$/)
  if (bioMetricMatch) {
    const key = bioMetricMatch[1]
    const metric = METRIC_DETAILS[key]
    if (metric) {
      return {
        title: `${metric.title} | ONDA Life Bio OS`,
        description: `${metric.title} — learn what this biometric means, how to interpret your score, and how to use it in your daily practice.`,
        url,
        breadcrumbs,
      }
    }
  }
  if (route === '/contact') {
    return {
      title: CONTACT_TITLE,
      description: CONTACT_DESC,
      url,
      breadcrumbs,
      contactPage: {
        name: 'Contact ONDA Life',
        description: CONTACT_DESC,
        url,
        email: 'hello@onda-life.com',
      },
    }
  }

  const articlesMatch = route.match(/^\/articles\/([^/]+)$/)
  if (articlesMatch) {
    const slug = articlesMatch[1]
    const article = getArticleBySlug(slug)
    if (article) {
      const seoDesc = ARTICLE_SEO_DESCRIPTIONS[slug] ?? article.description
      const techArticleBase = {
        name: article.title,
        description: seoDesc,
        url,
        datePublished: '2025-02-22',
      }
      const techArticleExtras =
        slug === 'dopamine-stacking-preventing-circuit-overload'
          ? {
              keywords: [
                'dopamine baseline',
                'receptor downregulation',
                'glutamate excitotoxicity',
                'neurochemistry optimization',
                'biohacking focus',
                'intermittent fasting for brain',
              ],
              audience: 'Biohackers, Neuroscientists, High-Performers',
            }
          : slug === 'cacao-stem-cells'
            ? {
                keywords: [
                  'stem cell mobilization',
                  'epicatechin biohacking',
                  'nitric oxide signaling',
                  'non-stimulant cacao',
                  'ONDA regeneration loop',
                ],
                audience: 'Advanced / High-Performance',
                dependencies: 'Non-stimulant Cacao Flavonols',
                proficiencyLevel: 'Advanced / High-Performance',
              }
            : slug === 'cognitive-architecture-neural-throughput'
              ? {
                  keywords: [
                    'Cognitive Architecture',
                    'Neural Throughput',
                    'Circadian Calibration',
                    'Digital Sunset',
                    'Neurogenesis Protocols',
                  ],
                  audience: 'Biohackers, High-Performers, Neuroscientists',
                  proficiencyLevel: 'Advanced',
                  educationalLevel: 'Advanced',
                }
              : slug === 'system-feedback-biometric-loop'
                ? {
                    keywords: [
                      'Biometric Feedback Loop',
                      'HRV Guided Training',
                      'Real-time Biohacking',
                      'ONDA Adaptive Protocols',
                      'Predictive Health Adjustment',
                    ],
                    audience: 'Biohackers, Athletes, High-Performers',
                    proficiencyLevel: 'Intermediate',
                  }
                  : slug === 'endocrine-social-drive-oxytocin-testosterone'
                    ? {
                        keywords: [
                          'Oxytocin',
                          'Testosterone',
                          'Endocrine System',
                          'Social Resonance',
                          'Biohacking Social Skills',
                          'ONDA Protocol',
                        ],
                        audience: 'Biohackers, High-Performers, Human Endocrine Architecture',
                        proficiencyLevel: 'Intermediate',
                      }
                    : slug === 'hpa-axis-control-cortisol-aggression'
                      ? {
                          keywords: [
                            'HPA Axis',
                            'Cortisol',
                            'Stress Management',
                            'Physiological Sigh',
                            'Biohacking Aggression',
                            'Neuroplasticity',
                          ],
                          audience: 'Biohackers, High-Performers, Stress Management',
                          proficiencyLevel: 'Intermediate',
                        }
                      : slug === 'system-stability-serotonin'
                        ? {
                            keywords: [
                              'Serotonin',
                              'Gut-Brain Axis',
                              'Posture',
                              'Biohacking Confidence',
                              'Tryptophan',
                              'Social Status',
                              'ONDA Protocol',
                            ],
                            audience: 'Biohackers, High-Performers, Mood Optimization',
                            proficiencyLevel: 'Intermediate',
                          }
                        : slug === 'energy-sensor-leptin'
                          ? {
                              keywords: [
                                'Leptin Resistance',
                                'Intermittent Fasting',
                                'Metabolic Health',
                                'Circadian Rhythm',
                                'Biohacking Hunger',
                                'ONDA Protocol',
                              ],
                              audience: 'Biohackers, High-Performers, Metabolic Optimization',
                              proficiencyLevel: 'Intermediate',
                            }
                          : slug === 'neural-optimizer-estrogen'
                            ? {
                                keywords: [
                                  'Estrogen',
                                  'Neuroplasticity',
                                  'BDNF',
                                  'Brain Fog',
                                  'Cognitive Longevity',
                                  'Biohacking Hormones',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, High-Performers, Cognitive Optimization',
                                proficiencyLevel: 'Intermediate',
                              }
                          : slug === 'protocol-circadian-hard-reset'
                            ? {
                                keywords: [
                                  'Circadian Hard Reset',
                                  'Zeitgeber Protocol',
                                  'Photonic Anchor',
                                  'Thermal Spike Biohacking',
                                  'Metabolic Gate',
                                  'SCN Synchronization',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, High-Performers, Circadian Optimization',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                          : slug === 'ancestral-sync-circadian-anchors'
                            ? {
                                keywords: [
                                  'Ancestral Circadian Rhythm',
                                  'Zeitgeber Anchors',
                                  'Morning Sunlight Protocol',
                                  'Thermal Reset',
                                  'Metabolic Gate Fasting',
                                  'Epigenetic Drift Prevention',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Longevity Researchers, High-Performers',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'longevity-protocol-biological-clock-reset'
                            ? {
                                keywords: [
                                  'Horvath Clock',
                                  'Epigenetic Age Reversal',
                                  'DNA Methylation Reset',
                                  'Sirtuin Activation',
                                  'Dark Surge Melatonin',
                                  'AMPK Autophagy',
                                  'DFA Alpha 1',
                                  'Biological Age Optimization',
                                  'ONDA Protocol',
                                ],
                                audience: 'Longevity Researchers, Biohackers, High-Performers',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                          : slug === 'nervous-system-ping-latency'
                            ? {
                                keywords: [
                                  'HRV Biofeedback',
                                  'Nervous System Latency',
                                  'Resonant Frequency Breathing',
                                  'Autonomic Nervous System Optimization',
                                  'Vagal Tone Training',
                                  'Heart Rate Variability Protocol',
                                  'VNS Patching',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Athletes, High-Performers, Neuroscientists',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'fault-tolerant-human-hrv-buffer'
                            ? {
                                keywords: [
                                  'HRV Buffer',
                                  'Fault Tolerance Human Body',
                                  'Stress Resilience Architecture',
                                  'Hormetic Stress Loading',
                                  'VNS Calibration',
                                  'Predictive HRV Monitoring',
                                  'Graceful Degradation Biohacking',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Athletes, High-Performers, Stress Engineers',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'resonant-frequency-system-coherence'
                            ? {
                                keywords: [
                                  'Resonant Frequency Breathing',
                                  'HRV Coherence',
                                  'Baroreflex Resonance',
                                  'Vagal Capture',
                                  'System Coherence Biohacking',
                                  'Heart Rate Variability Optimization',
                                  'Autonomic Nervous System Tuning',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Athletes, Meditators, High-Performers',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'baroreflex-01hz-shift'
                            ? {
                                keywords: [
                                  '0.1 Hz Breathing',
                                  'Baroreflex Optimization',
                                  'Mayer Waves Synchronization',
                                  'HRV Amplitude Maximization',
                                  'Blood Pressure Biofeedback',
                                  'Vagal Tone Injection',
                                  'Brain-Heart Coherence',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Athletes, Cardiologists, High-Performers',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'nightly-flush-glymphatic-neural-cache'
                            ? {
                                keywords: [
                                  'Glymphatic System Optimization',
                                  'Deep Sleep Brain Detox',
                                  'Beta-Amyloid Clearance',
                                  'Neural Cache Clearance',
                                  'Stage N3 Sleep',
                                  'Cerebrospinal Fluid Circulation',
                                  'Sleep Position Optimization',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Neuroscientists, Longevity Researchers, High-Performers',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'neural-hydraulics-csf-flow'
                            ? {
                                keywords: [
                                  'Neural Hydraulics',
                                  'Cerebrospinal Fluid Flow',
                                  'Glymphatic Hydraulics',
                                  'Intracranial Pressure Optimization',
                                  'Vascular Pulsatility Brain',
                                  'CSF Drainage Engineering',
                                  'Brain Fluid Dynamics',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Neuroscientists, Sleep Optimizers, High-Performers',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                          : slug === 'anti-entropy-neural-architecture'
                            ? {
                                keywords: [
                                  'Neural Anti-Entropy Protocol',
                                  'Amyloid Clearance Optimization',
                                  'Glymphatic Longevity',
                                  'Brain Aging Prevention',
                                  'Autophagy Sleep Sync',
                                  'Neural Drift Prevention',
                                  'Neurodegeneration Biohacking',
                                  'ONDA Protocol',
                                ],
                                audience: 'Longevity Researchers, Biohackers, Neuroscientists, High-Performers',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                          : slug === 'idle-state-alpha-rhythms'
                            ? {
                                keywords: [
                                  'Alpha Waves Brain Optimization',
                                  'Neural Idle State',
                                  'Beta Trap Burnout Prevention',
                                  '8-12 Hz Brain Performance',
                                  'Thalamocortical Alpha Gating',
                                  'Flow State Prerequisites',
                                  'Cognitive Baseline Optimization',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, High-Performers, Knowledge Workers, Athletes',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'quiet-mode-alpha-cortisol-buffer'
                            ? {
                                keywords: [
                                  'Alpha Relaxation Cortisol Buffer',
                                  'Parasympathetic Activation Protocol',
                                  'Quiet Mode Stress Recovery',
                                  'Vagal Tone Alpha Rhythm',
                                  'Exhale Extension Baroreflex',
                                  'Amygdala Buffering Technique',
                                  'Thermal Runaway Prevention',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, High-Performers, Knowledge Workers, Burnout Recovery',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'neural-bridge-alpha-flow-gateway'
                            ? {
                                keywords: [
                                  'Alpha-Theta Bridge Flow State',
                                  'Neural Gateway Creativity',
                                  'Cross-Frequency Coupling Brain',
                                  'Alpha Gamma Coupling Insights',
                                  'Flow State Biohacking',
                                  'Diffused Focus Technique',
                                  'Insight Delivery Protocol',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Creatives, High-Performers, Knowledge Workers',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                            : undefined
      const meta: RouteMeta = {
        title: ARTICLE_SEO_TITLES[slug] ?? `${article.title} | ONDA Life`,
        description: seoDesc,
        url,
        breadcrumbs,
        ogType: 'article',
        techArticle: { ...techArticleBase, ...techArticleExtras },
      }
      if (article.image) {
        const absImage = `${SITE_URL}${article.image}`
        meta.image = absImage
        if (article.imageAlt) meta.imageAlt = article.imageAlt
        if (meta.techArticle) meta.techArticle.image = absImage
      }
      if (article.howToSteps && article.howToSteps.length > 0) {
        meta.howTo = {
          name: `${article.title} — Practical Protocols`,
          step: article.howToSteps.map((s) => ({ name: s.name, text: s.text })),
          url,
        }
      }
      const faqItems = FAQ_SCHEMA[slug]
      if (faqItems && faqItems.length > 0) {
        meta.faq = { mainEntity: faqItems, url }
      }
      return meta
    }
  }

  const glossaryMatch = route.match(/^\/glossary\/([^/]+)$/)
  if (glossaryMatch) {
    const slug = glossaryMatch[1]
    const term = getTermBySlug(slug)
    if (term) {
      const seo = GLOSSARY_SEO[slug]
      const title = seo?.title ?? `${term.title} | ONDA Life Glossary`
      const description = seo?.description ?? term.shortDescription
      return {
        title,
        description,
        url,
        breadcrumbs,
        definedTerm: { name: term.title, description, url },
      }
    }
  }

  const partMatch = route.match(/^\/part\/([^/]+)$/)
  if (partMatch) {
    const slug = partMatch[1]
    const part = parts[slug]
    if (part) {
      const seo = PART_SEO[slug]
      const title = seo?.title ?? `${part.title} ${part.titleHighlight} | ONDA Life`
      const description = seo?.description ?? part.metaDescription ?? DEFAULT_DESC
      return { title, description, url, breadcrumbs }
    }
  }

  const levelMatch = route.match(/^\/level\/([^/]+)$/)
  if (levelMatch) {
    const levelNum = parseInt(levelMatch[1], 10)
    const level = levelsData[levelNum]
    const title = level
      ? `Level ${level.number}: ${level.name} | ONDA Life`
      : `Level ${levelMatch[1]} | ONDA Life`
    const description = level?.metaDescription ?? level?.subtitle ?? ''
    const about =
      level?.targetSystems?.items?.map((t) => t.name) ??
      level?.architecture?.parts?.map((p) => p.label) ??
      []
    const faqItems = level ? FAQ_LEVEL_SCHEMA[level.number] : undefined
    const course =
      level?.number === 7
        ? {
            name: 'Epigenetic Design and DNA Consciousness',
            description:
              'Level 7 DNA / AER II: DNA consciousness, epigenetic mastery, cellular regeneration, autophagy. Become the Biological Designer. ONDA Life.',
            url,
          }
        : undefined
    return {
      title,
      description,
      url,
      breadcrumbs,
      creativeWork: level
        ? { name: `Level ${level.number}: ${level.name}`, description, url, about }
        : undefined,
      course,
      faq: faqItems?.length
        ? { mainEntity: faqItems, url }
        : undefined,
    }
  }

  return { title: DEFAULT_TITLE, description: DEFAULT_DESC, url, breadcrumbs }
}

function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Injects meta tags, canonical link, and JSON-LD into HTML string.
 */
export function injectMetaIntoHtml(html: string, meta: RouteMeta): string {
  const escapedTitle = escapeHtmlAttr(meta.title)
  const escapedDesc = escapeHtmlAttr(meta.description)
  const canonicalUrl = (meta.url || SITE_URL).replace(/\/+$/, '') || SITE_URL
  const escapedUrl = escapeHtmlAttr(canonicalUrl)

  let out = html

  // Google Search Console verification
  const googleVerification = '<meta name="google-site-verification" content="ZbGWsLeH2NXSrxUe00KHQsd4g3SEBS2NptUCrzLU4HE" />'
  if (!out.includes('google-site-verification')) {
    out = out.replace('</head>', `  ${googleVerification}\n</head>`)
  }

  // Canonical link — always without trailing slash; replace existing or add before </head>
  const canonicalTag = `<link rel="canonical" href="${escapedUrl}">`
  if (out.includes('rel="canonical"')) {
    out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, canonicalTag)
  } else {
    out = out.replace('</head>', `  ${canonicalTag}\n</head>`)
  }

  // JSON-LD: BreadcrumbList (always)
  const breadcrumbScript = `<script type="application/ld+json">${buildBreadcrumbListJsonLd(meta.breadcrumbs)}</script>`
  out = out.replace('</head>', `  ${breadcrumbScript}\n</head>`)

  // JSON-LD: DefinedTerm (glossary pages only)
  if (meta.definedTerm) {
    const definedTermScript = `<script type="application/ld+json">${buildDefinedTermJsonLd(meta.definedTerm.name, meta.definedTerm.description, meta.definedTerm.url)}</script>`
    out = out.replace('</head>', `  ${definedTermScript}\n</head>`)
  }

  // JSON-LD: TechArticle (article pages only)
  if (meta.techArticle) {
    const opts =
      meta.techArticle.image ||
      meta.techArticle.keywords ||
      meta.techArticle.audience ||
      meta.techArticle.dependencies ||
      meta.techArticle.proficiencyLevel ||
      meta.techArticle.educationalLevel
        ? {
            image: meta.techArticle.image,
            keywords: meta.techArticle.keywords,
            audience: meta.techArticle.audience,
            dependencies: meta.techArticle.dependencies,
            proficiencyLevel: meta.techArticle.proficiencyLevel,
            educationalLevel: meta.techArticle.educationalLevel,
          }
        : undefined
    const techArticleScript = `<script type="application/ld+json">${buildTechArticleJsonLd(
      meta.techArticle.name,
      meta.techArticle.description,
      meta.techArticle.url,
      meta.techArticle.datePublished,
      opts
    )}</script>`
    out = out.replace('</head>', `  ${techArticleScript}\n</head>`)
  }

  // JSON-LD: ContactPage
  if (meta.contactPage) {
    const contactScript = `<script type="application/ld+json">${buildContactPageJsonLd(meta.contactPage.name, meta.contactPage.description, meta.contactPage.url, meta.contactPage.email)}</script>`
    out = out.replace('</head>', `  ${contactScript}\n</head>`)
  }

  // JSON-LD: AboutPage
  if (meta.aboutPage) {
    const aboutScript = `<script type="application/ld+json">${buildAboutPageJsonLd(meta.aboutPage.name, meta.aboutPage.description, meta.aboutPage.url)}</script>`
    out = out.replace('</head>', `  ${aboutScript}\n</head>`)
  }

  // JSON-LD: CreativeWork (level pages)
  if (meta.creativeWork) {
    const cwScript = `<script type="application/ld+json">${buildCreativeWorkJsonLd(meta.creativeWork.name, meta.creativeWork.description, meta.creativeWork.url, meta.creativeWork.about)}</script>`
    out = out.replace('</head>', `  ${cwScript}\n</head>`)
  }

  // JSON-LD: Course (Level 7 — Epigenetic Design and DNA Consciousness)
  if (meta.course) {
    const courseScript = `<script type="application/ld+json">${buildCourseJsonLd(meta.course.name, meta.course.description, meta.course.url)}</script>`
    out = out.replace('</head>', `  ${courseScript}\n</head>`)
  }

  // JSON-LD: HowTo (article pages with protocols)
  if (meta.howTo) {
    const howToScript = `<script type="application/ld+json">${buildHowToJsonLd(meta.howTo.name, meta.howTo.step, meta.howTo.url)}</script>`
    out = out.replace('</head>', `  ${howToScript}\n</head>`)
  }

  // JSON-LD: FAQPage (article pages with FAQ schema)
  if (meta.faq) {
    const faqScript = `<script type="application/ld+json">${buildFAQPageJsonLd(meta.faq.mainEntity, meta.faq.url)}</script>`
    out = out.replace('</head>', `  ${faqScript}\n</head>`)
  }

  // Replace <title>...</title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`)

  // Replace meta name="title" if present
  if (out.includes('name="title"')) {
    out = out.replace(/<meta\s+name="title"\s+content="[^"]*">/i, `<meta name="title" content="${escapedTitle}">`)
  }

  // Replace or add meta name="description"
  const descMeta = `<meta name="description" content="${escapedDesc}">`
  if (out.includes('name="description"')) {
    out = out.replace(/<meta\s+name="description"\s+content="[^"]*">/i, descMeta)
  } else {
    out = out.replace('</head>', `  ${descMeta}\n</head>`)
  }

  // Replace og:* and twitter:* meta tags
  const ogType = meta.ogType ?? 'website'
  const ogImage = meta.image ?? OG_IMAGE
  const escapedImageAlt = meta.imageAlt ? escapeHtmlAttr(meta.imageAlt) : ''
  const twitterCard = 'summary_large_image'
  const replacements: [RegExp, string][] = [
    [/<meta\s+property="og:type"\s+content="[^"]*">/gi, `<meta property="og:type" content="${ogType}">`],
    [/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${escapedTitle}">`],
    [/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${escapedDesc}">`],
    [/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escapedUrl}">`],
    [/<meta\s+property="og:image"\s+content="[^"]*">/gi, `<meta property="og:image" content="${ogImage}">`],
    [/<meta\s+property="twitter:card"\s+content="[^"]*">/gi, `<meta property="twitter:card" content="${twitterCard}">`],
    [/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escapedUrl}">`],
    [/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${escapedTitle}">`],
    [/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${escapedDesc}">`],
    [/<meta\s+property="twitter:image"\s+content="[^"]*">/gi, `<meta property="twitter:image" content="${ogImage}">`],
  ]
  for (const [regex, replacement] of replacements) {
    out = out.replace(regex, replacement)
  }

  // Ensure twitter:card exists (add if missing, e.g. on injected pages)
  if (!out.includes('twitter:card')) {
    out = out.replace(
      /(<meta\s+property="og:image"\s+content="[^"]*">)/i,
      `$1\n  <meta property="twitter:card" content="${twitterCard}">`
    )
  }

  // Add og:image:alt and twitter:image:alt for articles with image (SEO, accessibility)
  if (escapedImageAlt) {
    const imageAltTags = `  <meta property="og:image:alt" content="${escapedImageAlt}">\n  <meta property="twitter:image:alt" content="${escapedImageAlt}">`
    if (!out.includes('og:image:alt')) {
      out = out.replace(
        /(<meta\s+property="og:image"\s+content="[^"]*">)/i,
        `$1\n${imageAltTags}`
      )
    }
  }

  return out
}
