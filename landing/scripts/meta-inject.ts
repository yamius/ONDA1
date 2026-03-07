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

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/og-preview.png`
const DEFAULT_TITLE = 'ONDA Life | Biohacking App, HRV Tracker & Consciousness OS'
const DEFAULT_DESC =
  'Upgrade your biological code with ONDA Life. A systematic biohacking platform for HRV tracking, neural hardware optimization, and structured 8-level consciousness development.'

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

/** SEO descriptions for articles (150–160 chars). Style: Technical protocol for biocomputer upgrade. */
const ARTICLE_SEO_DESCRIPTIONS: Record<string, string> = {
  'vagus-nerve-master-key':
    'Technical protocol on Vagus Nerve optimization for biocomputer upgrade. Hack stress response, unlock deep resilience via parasympathetic access.',
  'dopamine-architecture-mastering-desire':
    'Technical protocol on Dopamine as biological Prediction Error for biocomputer upgrade. Reclaim drive, escape Dopamine Traps.',
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
}

export interface RouteMeta {
  title: string
  description: string
  url: string
  breadcrumbs: BreadcrumbItem[]
  ogType?: 'article' | 'website'
  definedTerm?: { name: string; description: string; url: string }
  techArticle?: { name: string; description: string; url: string; datePublished: string }
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
  datePublished: string
): string {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: name,
    description,
    url,
    datePublished,
    author: {
      '@type': 'Organization',
      name: 'ONDA Life',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ONDA Life',
      url: SITE_URL,
    },
  }
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
  const url = `${SITE_URL}${route === '/' ? '' : route}`

  const breadcrumbs = buildBreadcrumbs(route)

  if (route === '/') {
    return { title: DEFAULT_TITLE, description: DEFAULT_DESC, url, breadcrumbs, ogType: 'website' }
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
      const meta: RouteMeta = {
        title: `${article.title} | ONDA Life`,
        description: seoDesc,
        url,
        breadcrumbs,
        ogType: 'article',
        techArticle: {
          name: article.title,
          description: seoDesc,
          url,
          datePublished: '2025-02-22',
        },
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
  const escapedUrl = escapeHtmlAttr(meta.url)

  let out = html

  // Google Search Console verification
  const googleVerification = '<meta name="google-site-verification" content="ZbGWsLeH2NXSrxUe00KHQsd4g3SEBS2NptUCrzLU4HE" />'
  if (!out.includes('google-site-verification')) {
    out = out.replace('</head>', `  ${googleVerification}\n</head>`)
  }

  // Canonical link — replace existing or add before </head>
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
    const techArticleScript = `<script type="application/ld+json">${buildTechArticleJsonLd(meta.techArticle.name, meta.techArticle.description, meta.techArticle.url, meta.techArticle.datePublished)}</script>`
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
  const replacements: [RegExp, string][] = [
    [/<meta\s+property="og:type"\s+content="[^"]*">/gi, `<meta property="og:type" content="${ogType}">`],
    [/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${escapedTitle}">`],
    [/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${escapedDesc}">`],
    [/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escapedUrl}">`],
    [/<meta\s+property="og:image"\s+content="[^"]*">/gi, `<meta property="og:image" content="${OG_IMAGE}">`],
    [/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escapedUrl}">`],
    [/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${escapedTitle}">`],
    [/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${escapedDesc}">`],
    [/<meta\s+property="twitter:image"\s+content="[^"]*">/gi, `<meta property="twitter:image" content="${OG_IMAGE}">`],
  ]

  for (const [regex, replacement] of replacements) {
    out = out.replace(regex, replacement)
  }

  return out
}
