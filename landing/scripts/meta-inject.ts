/**
 * Meta data for build-time injection into prerendered HTML.
 * Single source of truth for title/description per route.
 */
import { IMAGE_DIMENSIONS } from '../src/data/image-manifest.generated'
import { getTermBySlug, glossaryTerms } from '../src/data/glossary'
import { getTopicBySlug, TOPICS } from '../src/data/topics'
import { GLOSSARY_SEO } from '../src/data/glossary-seo'
import { levelsData } from '../src/data/levels'
import { PART_SEO } from '../src/data/part-seo'
import { parts } from '../src/pages/PartPage'
import { getArticleBySlug } from '../src/data/articles'
import { ARTICLE_FAQ as FAQ_SCHEMA } from '../src/data/article-faq'
import { METRIC_DETAILS } from '../src/data/bioMetrics'
import {
  reviews,
  comparisons,
  getReviewBySlug,
  getComparisonBySlug,
  getReviewsForComparison,
  getHeadToHeadBySlug,
  getCategoryByUrlSlug,
  CATEGORY_LABELS,
} from '../src/data/reviews'

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/og-preview.png`

/**
 * Canonical author identity. Used in:
 *  - <meta name="author"> on every page
 *  - JSON-LD Person block on homepage + /about
 *  - JSON-LD TechArticle.author reference (by @id) on every article
 *
 * The @id is what links the per-article reference to the full Person
 * description on the homepage. Google walks the graph and treats them
 * as the same entity.
 */
const AUTHOR_ID = `${SITE_URL}/#author`
const AUTHOR_NAME = 'Yakiv Bilenko'
const AUTHOR_URL = 'https://www.linkedin.com/in/yamius'
const AUTHOR_SAME_AS = ['https://www.linkedin.com/in/yamius']

export const TITLE_MAX = 60
export const DESC_MAX = 160

/**
 * Trim text to fit within Google's SERP slot, preserving word boundary.
 *
 * - Pass-through when already within budget.
 * - Otherwise cut at the last space before (max - 1) and append `…`.
 * - Idempotent: text already ending in `…` is left alone.
 *
 * Intentionally does not pad short texts — padded descriptions look like
 * keyword stuffing to Google and provide no SEO benefit. Short titles and
 * descriptions are fine; Google will use them as-is or rewrite slightly.
 */
export function truncateForBudget(text: string, max: number): string {
  if (text.length <= max) return text
  if (text.endsWith('…')) return text
  const slice = text.slice(0, max - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > Math.floor(max * 0.6) ? slice.slice(0, lastSpace) : slice
  return `${cut.replace(/[\s,;:.!?\-—…]+$/, '')}…`
}

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
  'spinal-harddrive-cpg-autonomous-scripts':
    'CPGs are spinal neural circuits that execute complex movement without brain input. The ONDA Harddrive Protocol uses sensory priming, rhythmic entrainment, and eyes-closed drills to free the prefrontal cortex for strategic thought.',
  'rhythmic-entrainment-system-frequencies':
    'Biological oscillators waste energy when out of phase. The ONDA Entrainment Protocol locks breath, heart, CPGs, and brain to a single 0.1 Hz master clock via pacing, locomotor-respiratory coupling, and acoustic entrainment.',
  'spinal-intelligence-decentralized-control':
    'The spinal cord is a distributed processor with motor memory and reflex logic. The ONDA Protocol develops edge-computing movement intelligence via unpredictable loading, proprioceptive focus, and Alpha-state triggers.',
  'adrenal-governor-thermal-runaway':
    'The adrenals inject cortisol on command — the problem is the Beta-mode brain keeps signaling threat. The ONDA Governor uses HRV thresholding, Alpha-buffering, and anticipatory reset to block Redline entry.',
  'ventral-tegmental-core-motivational-salience':
    'The VTA is the reactor of motivational salience. ONDA recalibrates dopamine telemetry via system reset, hormetic stress and delayed-reward deep work to restore drive without external triggers.',
  'fascial-tensegrity-protocol-myofascial-noise':
    'Trapezius lock and cervical compression strangle cerebral blood flow. The ONDA Fascial Tensegrity Protocol pairs targeted myofascial release with humming vagal exhale to restore structural balance.',
  'vascular-tensegrity-microvascular-mechanics':
    'The vascular network is a tensegrity transport bus, not a pipeline. Balanced fascial tension delivers oxygen and nutrients to the cortex with zero impedance and absorbs mechanical shocks.',
  'bohr-effect-oxygen-telemetry':
    'Hemoglobin needs CO2 to release oxygen. ONDA calibrates the Bohr trigger via slow breathing and vasodilation cycles to end cellular hypoxia and stabilize prefrontal processing speed.',
  'anterior-cingulate-core-coherence-monitoring':
    'The anterior cingulate cortex arbitrates conflict between focus and distraction. dACC handles task-switching, vACC handles autonomic load — together they keep cognitive flexibility coherent.',
  'acc-calibration-protocol-cognitive-control':
    'Cool the system arbiter. The ONDA ACC Calibration Protocol pairs 50-minute monotasking blocks with a mindfulness pause gate to clear the dACC error buffer and lock focus.',
  'hydraulic-viscosity-onda-transport-bus':
    'Blood viscosity is the resistance of the cerebral transport bus. ONDA treats viscosity as a tunable parameter — thermal control and vascular tone keep impedance at zero point.',
}

export interface RouteMeta {
  title: string
  description: string
  url: string
  breadcrumbs: BreadcrumbItem[]
  ogType?: 'article' | 'website'
  /** Force <meta name=robots content="noindex, nofollow"> on the page.
   *  Used for placeholder topic hubs that haven't been reviewed yet. */
  noindex?: boolean
  /** Topic hub data — for /topics/:slug pages with pillar in place. */
  topicHub?: {
    name: string
    description: string
    url: string
    articleSlugs: readonly string[]
    glossarySlugs: readonly string[]
  }
  /** Article image for og:image, twitter:image (absolute URL) */
  image?: string
  imageAlt?: string
  definedTerm?: { name: string; description: string; url: string }
  /** Extracted "The Hack" blockquote bodies — emitted as Quotation JSON-LD. */
  hackQuotes?: string[]
  techArticle?: {
    name: string
    description: string
    url: string
    datePublished: string
    image?: string
    imageAlt?: string
    imageCaption?: string
    keywords?: string[]
    audience?: string
    dependencies?: string
    proficiencyLevel?: string
    educationalLevel?: string
  }
  howTo?: {
    name: string
    description?: string
    step: { name: string; text: string; protocolId?: string }[]
    url: string
  }
  /** Glossary index — emitted as a DefinedTermSet listing every term. */
  definedTermSet?: { url: string; terms: { name: string; url: string }[] }
  faq?: { mainEntity: { question: string; answer: string }[]; url: string }
  contactPage?: { name: string; description: string; url: string; email: string }
  aboutPage?: { name: string; description: string; url: string }
  /** Dedicated research-partnership landing — emitted as schema.org/ResearchProject. */
  researchProject?: { name: string; description: string; url: string }
  creativeWork?: { name: string; description: string; url: string; about: string[] }
  course?: { name: string; description: string; url: string }
  /** Individual product review — emitted as schema.org/Review with an
   *  itemReviewed Product and a single editorial reviewRating. */
  review?: {
    name: string
    productName: string
    brand: string
    reviewBody: string
    ratingValue: number
    datePublished: string
    dateModified: string
    image?: string
    pros: string[]
    cons: string[]
    url: string
    /** Form factor, e.g. "Smart ring" — Product.category. */
    productType?: string
    /** Most-recent verified USD price — emitted as an Offer on the Product. */
    priceUsd?: number
  }
  /** Comparison round-up — emitted as CollectionPage + ItemList. */
  itemList?: {
    name: string
    description: string
    url: string
    items: { url: string; name: string }[]
  }
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
  if (segments[0] === 'reviews') {
    items.push({ name: 'Reviews', url: `${SITE_URL}/reviews` })
    if (segments[1] === 'methodology') {
      items.push({ name: 'Methodology', url: `${SITE_URL}/reviews/methodology` })
    } else if (segments[1] === 'compare' && segments[2]) {
      const cmp = getComparisonBySlug(segments[2])
      items.push({ name: cmp?.title ?? segments[2], url: `${SITE_URL}/reviews/compare/${segments[2]}` })
    } else if (segments[1] === 'vs' && segments[2]) {
      const h2h = getHeadToHeadBySlug(segments[2])
      const a = h2h ? getReviewBySlug(h2h.productASlug) : undefined
      const b = h2h ? getReviewBySlug(h2h.productBSlug) : undefined
      const c = h2h?.productCSlug ? getReviewBySlug(h2h.productCSlug) : undefined
      const names = [a?.name, b?.name, c?.name].filter(Boolean) as string[]
      const name = names.length >= 2 ? names.join(' vs ') : (h2h?.title ?? segments[2])
      items.push({ name, url: `${SITE_URL}/reviews/vs/${segments[2]}` })
    } else if (segments[1]) {
      // A /reviews/<slug> URL is either a per-category landing page
      // (CATEGORY_URL_SLUGS) or an individual review. Both surface the
      // same way in the breadcrumb — by their human-readable label.
      const cat = getCategoryByUrlSlug(segments[1])
      if (cat) {
        items.push({ name: CATEGORY_LABELS[cat], url: `${SITE_URL}/reviews/${segments[1]}` })
      } else {
        const rev = getReviewBySlug(segments[1])
        items.push({ name: rev ? `${rev.name} review` : segments[1], url: `${SITE_URL}/reviews/${segments[1]}` })
      }
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

/**
 * Extract every "The Hack" protocol blockquote from an article's markdown
 * body. Matches a blockquote that starts with `> **The Hack:**` and walks
 * forward through subsequent `>` lines so multi-paragraph hacks come out
 * as a single string. Markdown is stripped of leading `>` markers and the
 * `**The Hack:**` label.
 *
 * Each returned string becomes a schema.org/Quotation JSON-LD blob — AI
 * quote-extraction (Perplexity citations, Bing AI snippets, You.com
 * cite-in-line) prefers explicit Quotation markers when deciding what
 * text to surface and attribute.
 */
function extractHackQuotes(content: string): string[] {
  const quotes: string[] = []
  const lines = content.split('\n')
  let current: string | null = null
  const close = () => {
    if (current === null) return
    const trimmed = current.replace(/\s+/g, ' ').trim()
    if (trimmed) quotes.push(trimmed)
    current = null
  }
  for (const line of lines) {
    const bq = line.match(/^>\s?(.*)$/)
    if (bq) {
      const text = bq[1]
      if (current === null) {
        const hm = text.match(/^\*\*The Hack:\*\*\s*(.*)/)
        if (hm) current = hm[1]
      } else {
        current = current + ' ' + text
      }
    } else {
      close()
    }
  }
  close()
  return quotes
}

function buildQuotationJsonLd(text: string, articleUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Quotation',
    text,
    creator: { '@id': AUTHOR_ID },
    isPartOf: { '@id': `${articleUrl}#article` },
  })
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
      '@id': `${SITE_URL}/glossary#glossary`,
      name: 'ONDA Life Glossary',
      url: `${SITE_URL}/glossary`,
      // E-E-A-T: link the glossary set to its canonical author so every
      // term page inherits an author signal via the @id reference.
      // Full Person record lives on the homepage and /about.
      author: {
        '@type': 'Person',
        '@id': AUTHOR_ID,
        name: AUTHOR_NAME,
        url: AUTHOR_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'ONDA Life',
        url: SITE_URL,
      },
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
    imageAlt?: string
    imageCaption?: string
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
    '@id': `${url}#article`,
    headline: name,
    description,
    url,
    datePublished,
    author: {
      '@type': 'Person',
      '@id': AUTHOR_ID,
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
      sameAs: AUTHOR_SAME_AS,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ONDA Life',
      url: SITE_URL,
    },
    // SpeakableSpecification — Google Assistant, Siri and Alexa read the
    // marked sections aloud when the user voice-queries a related topic.
    // cssSelector targets the on-page H1 and the lead intro paragraph
    // (#article-intro), so the spoken answer is the real article opening
    // (~20–30 second read), not just the <title>/meta-description echo.
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '#article-intro'],
    },
  }
  if (opts?.image) {
    // Hero image as a full ImageObject — gives Google Images and AI
    // answer engines a caption + credit to attribute, not just a bare URL.
    article.image = {
      '@type': 'ImageObject',
      url: opts.image,
      ...(opts.imageCaption ? { caption: opts.imageCaption } : {}),
      ...(opts.imageAlt ? { description: opts.imageAlt } : {}),
      creditText: 'ONDA Life',
      creator: { '@id': AUTHOR_ID },
      copyrightNotice: '© ONDA Life',
    }
  }
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

/**
 * Organization JSON-LD for the brand. Emitted on homepage so Google
 * can build a Knowledge Graph entity around "ONDA Life". Founder
 * references the canonical Person by @id, completing the graph
 * Organization → Person.
 */
function buildOrganizationJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'ONDA Life',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/onda-logo-source.png`,
      width: 1024,
      height: 1024,
    },
    sameAs: AUTHOR_SAME_AS,
    founder: {
      '@id': AUTHOR_ID,
    },
  })
}

/**
 * Dataset JSON-LD describes the /datasets/onda-corpus.jsonl single-fetch
 * RAG endpoint. AI agents and academic crawlers (Perplexity, Anthropic
 * Web, Common Crawl, AI2 Semantic Scholar) read schema.org/Dataset to
 * decide which corpora to ingest. Pairs with the <link rel=alternate
 * type=application/x-jsonlines> in index.html.
 */
function buildDatasetJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${SITE_URL}/datasets/onda-corpus.jsonl#dataset`,
    name: 'ONDA Life RAG Corpus',
    description:
      'JSONL dump of every ONDA Life article and glossary term — slug, title, URL, category, keywords, datePublished, author, full markdown body, and word count. One JSON object per line so AI ingestion pipelines can stream-parse without loading the whole file.',
    url: `${SITE_URL}/datasets/onda-corpus.jsonl`,
    encodingFormat: 'application/x-jsonlines',
    keywords: [
      'biohacking',
      'neuroscience',
      'HRV',
      'circadian biology',
      'metabolic flexibility',
      'breathwork',
      'consciousness',
      'glossary',
    ],
    inLanguage: 'en',
    license: `${SITE_URL}/license`,
    creator: { '@id': AUTHOR_ID },
    publisher: { '@id': `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/x-jsonlines',
        contentUrl: `${SITE_URL}/datasets/onda-corpus.jsonl`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/gzip',
        contentUrl: `${SITE_URL}/datasets/onda-corpus.jsonl.gz`,
      },
    ],
  })
}

/**
 * WebSite JSON-LD anchors the domain as a brand entity and links to
 * its publisher Organization. The SearchAction points at /articles?q=…,
 * which ArticlesPage now reads on load to pre-filter the list — so the
 * action is genuinely honoured and not a misleading claim.
 */
function buildWebSiteJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'ONDA Life',
    description: 'Operating system for the biocomputer — biohacking, HRV tracking, and consciousness optimization protocols.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/articles?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en', 'es', 'ru', 'uk', 'zh'],
  })
}

/**
 * Person JSON-LD for the canonical author. Emitted on homepage and /about
 * so Google has one rich Person entity to crawl; per-article TechArticle
 * blocks reference it by @id.
 */
function buildPersonJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    sameAs: AUTHOR_SAME_AS,
    jobTitle: 'Founder & Lead Architect, ONDA Life',
    description:
      'Yakiv Bilenko — architect and psychologist, founder of ONDA Life. Over 20 years designing physical environments and 10 years of psychological practice as a Gestalt therapist; his work researches how people\'s external and internal environments shape one another. Author of ONDA Life\'s biohacking and consciousness articles.',
    // knowsAbout populates the topical signal AI agents read when ranking
    // experts for a query. Mirrors the major article clusters on the site.
    knowsAbout: [
      'biohacking',
      'neuroscience',
      'heart rate variability',
      'autonomic nervous system',
      'vagus nerve',
      'neuroplasticity',
      'circadian biology',
      'metabolic flexibility',
      'breathwork',
      'dopamine regulation',
      'glymphatic system',
      'flow state',
      'consciousness studies',
    ],
    worksFor: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'ONDA Life',
      url: SITE_URL,
    },
    // hasOccupation states the author's professional roles explicitly —
    // an E-E-A-T "Experience/Expertise" signal that pairs with knowsAbout.
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Founder & Lead Architect, ONDA Life',
      },
      {
        '@type': 'Occupation',
        name: 'Gestalt therapist',
        occupationalCategory: 'Psychologist',
      },
    ],
  })
}

/**
 * CollectionPage + ItemList JSON-LD for a topic hub. Search engines and
 * AI agents read ItemList as the curated, ordered table of contents for
 * a cluster — turns the hub into a Google rich-result candidate.
 */
function buildTopicHubJsonLd(
  name: string,
  description: string,
  url: string,
  articleSlugs: readonly string[],
  glossarySlugs: readonly string[],
): string {
  let position = 1
  const items: Record<string, unknown>[] = []
  for (const s of articleSlugs) {
    items.push({
      '@type': 'ListItem',
      position: position++,
      url: `${SITE_URL}/articles/${s}`,
    })
  }
  for (const s of glossarySlugs) {
    items.push({
      '@type': 'ListItem',
      position: position++,
      url: `${SITE_URL}/glossary/${s}`,
    })
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: { '@id': AUTHOR_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items,
    },
  })
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

function buildResearchProjectJsonLd(name: string, description: string, url: string): string {
  const project = {
    '@context': 'https://schema.org',
    '@type': 'ResearchProject',
    '@id': `${url}#project`,
    name,
    description,
    url,
    sponsor: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
    funder: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life' },
    keywords: [
      'heart rate variability',
      'autonomic nervous system',
      'interoceptive accuracy',
      'BDNF',
      'cortisol awakening response',
      'EEG coherence',
      'default mode network',
      'salience network',
      'transient hypofrontality',
      'allostatic load',
      'digital therapeutics',
      'neurophysiology',
    ],
    about: [
      { '@type': 'Thing', name: 'Autonomic Homeostasis' },
      { '@type': 'Thing', name: 'Executive Function' },
      { '@type': 'Thing', name: 'Network Integration' },
      { '@type': 'Thing', name: 'Structural Neuroplasticity' },
      { '@type': 'Thing', name: 'Peak States' },
    ],
  }
  return JSON.stringify(project)
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

/**
 * HowTo JSON-LD for an article's practical protocols. Each HowToStep
 * carries a deep-link `url` to its anchored protocol block on the page,
 * so Google's HowTo rich result can jump straight to a single step.
 *
 * We intentionally omit totalTime / tool / supply: ONDA protocols have
 * no fixed duration or equipment list in the content model, and inventing
 * placeholder values would be misleading structured data.
 */
function buildHowToJsonLd(h: NonNullable<RouteMeta['howTo']>): string {
  const howTo: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: h.name,
    url: h.url,
    step: h.step.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.protocolId ? { url: `${h.url}#${s.protocolId}` } : {}),
    })),
  }
  if (h.description) howTo.description = h.description
  return JSON.stringify(howTo)
}

/**
 * DefinedTermSet JSON-LD for the /glossary index — the canonical schema
 * for a glossary. Lists every term as a DefinedTerm child so search and
 * AI engines read /glossary as the structured vocabulary of the site.
 */
function buildDefinedTermSetJsonLd(dts: NonNullable<RouteMeta['definedTermSet']>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE_URL}/glossary#glossary`,
    name: 'ONDA Life Glossary',
    description: GLOSSARY_DESC,
    url: dts.url,
    inLanguage: 'en',
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': `${SITE_URL}/#organization` },
    hasDefinedTerm: dts.terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.name,
      url: t.url,
      inDefinedTermSet: { '@id': `${SITE_URL}/glossary#glossary` },
    })),
  })
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

/**
 * schema.org/Review for an individual product review. itemReviewed is a
 * Product; the score is a single editorial reviewRating (0–10), never an
 * aggregateRating. Pros/cons map to positiveNotes/negativeNotes.
 */
function buildReviewJsonLd(r: NonNullable<RouteMeta['review']>): string {
  const review: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    url: r.url,
    name: r.name,
    datePublished: r.datePublished,
    dateModified: r.dateModified,
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': `${SITE_URL}/#organization` },
    reviewBody: r.reviewBody,
    itemReviewed: {
      '@type': 'Product',
      name: r.productName,
      brand: { '@type': 'Brand', name: r.brand },
      ...(r.productType ? { category: r.productType } : {}),
      ...(r.image ? { image: r.image } : {}),
      ...(r.priceUsd
        ? {
            offers: {
              '@type': 'Offer',
              price: r.priceUsd,
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: r.ratingValue,
      bestRating: 10,
      worstRating: 0,
    },
  }
  if (r.pros.length) {
    review.positiveNotes = {
      '@type': 'ItemList',
      itemListElement: r.pros.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })),
    }
  }
  if (r.cons.length) {
    review.negativeNotes = {
      '@type': 'ItemList',
      itemListElement: r.cons.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c })),
    }
  }
  return JSON.stringify(review)
}

/**
 * CollectionPage + ItemList for a comparison round-up — the ranked list
 * of reviewed products. AI answer engines read ItemList as the curated
 * answer to a "best X" query.
 */
function buildComparisonItemListJsonLd(il: NonNullable<RouteMeta['itemList']>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: il.name,
    description: il.description,
    url: il.url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: { '@id': AUTHOR_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: il.items.length,
      itemListElement: il.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: it.url,
        name: it.name,
      })),
    },
  })
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
    return {
      title: GLOSSARY_TITLE,
      description: GLOSSARY_DESC,
      url,
      breadcrumbs,
      definedTermSet: {
        url,
        terms: glossaryTerms.map((t) => ({
          name: t.title,
          url: `${SITE_URL}/glossary/${t.slug}`,
        })),
      },
    }
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
  // /research — Research-partnership landing. Linked from the Eurostar
  // deck final slide. EN-only; peer-review audience.
  if (route === '/research') {
    const researchTitle =
      'ONDA Research Network — Validating the 24-Step Neuro-Physiological Framework | ONDA Life'
    const researchDesc =
      'Academic and clinical partnership programme for validating the 24-step ONDA framework: longitudinal HRV, eye-scan ANS markers, BDNF, EEG coherence, DMN dynamics.'
    return {
      title: researchTitle,
      description: researchDesc,
      url,
      breadcrumbs,
      ogType: 'website',
      researchProject: { name: researchTitle, description: researchDesc, url },
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
      const hackQuotes = extractHackQuotes(article.content)
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
                          : slug === 'adrenal-governor-thermal-runaway'
                            ? {
                                keywords: [
                                  'Adrenal Fatigue Cortisol Precision',
                                  'HRV Stress Limiter Protocol',
                                  'Endocrine Architecture Biohacking',
                                  'Cortisol Receptor Desensitization',
                                  'Thermal Runaway Prevention',
                                  'Anticipatory Reset Breathing',
                                  'Adrenal Health Optimization',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, High-Performers, Knowledge Workers, Burnout Recovery',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'spinal-intelligence-decentralized-control'
                            ? {
                                keywords: [
                                  'Spinal Intelligence Edge Computing',
                                  'CPG Autonomy Decentralized Control',
                                  'Proprioceptive Flow Motor Learning',
                                  'Choke Effect Movement Biohacking',
                                  'Unpredictable Loading Training',
                                  'Reactive Resilience Protocol',
                                  'Motor Learning Spinal Cord',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Athletes, High-Performers, Movement Practitioners',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                          : slug === 'rhythmic-entrainment-system-frequencies'
                            ? {
                                keywords: [
                                  'Rhythmic Entrainment CPG Synchronization',
                                  '0.1 Hz Resonance Breathing',
                                  'Locomotor Respiratory Coupling',
                                  'Neural Oscillator Synchronization',
                                  'Phase Desync Biohacking',
                                  'HRV Coherence Protocol',
                                  'Acoustic Entrainment Performance',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Athletes, High-Performers, Movement Practitioners',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'spinal-harddrive-cpg-autonomous-scripts'
                            ? {
                                keywords: [
                                  'Central Pattern Generators CPG',
                                  'Spinal Cord Motor Intelligence',
                                  'Cognitive Offloading Movement',
                                  'Rhythmic Entrainment CPG Sync',
                                  'Proprioception Sensory Priming',
                                  'Autonomous Movement Protocol',
                                  'Neural Efficiency Biohacking',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Athletes, High-Performers, Movement Practitioners',
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
                          : slug === 'ventral-tegmental-core-motivational-salience'
                            ? {
                                keywords: [
                                  'Ventral Tegmental Area VTA',
                                  'Motivational Salience',
                                  'Dopamine Telemetry',
                                  'Mesolimbic Circuit',
                                  'Prediction Error Biohacking',
                                  'Receptor Sensitivity Reset',
                                  'Hormetic Stress Recalibration',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, High-Performers, Neuroscientists',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                          : slug === 'fascial-tensegrity-protocol-myofascial-noise'
                            ? {
                                keywords: [
                                  'Fascial Tensegrity Protocol',
                                  'Myofascial Release Trapezius',
                                  'Vagus Nerve Humming Activation',
                                  'Cervical Decompression',
                                  'Structural Balance Recalibration',
                                  'Cerebral Blood Flow Biohacking',
                                  'Parasympathetic Shift',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Knowledge Workers, High-Performers, Movement Practitioners',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'vascular-tensegrity-microvascular-mechanics'
                            ? {
                                keywords: [
                                  'Vascular Tensegrity',
                                  'Microvascular Mechanics',
                                  'Hagen-Poiseuille Cerebral Flow',
                                  'Myofascial Vascular Compression',
                                  'Low Impedance Delivery',
                                  'Cerebral Hypoxia Prevention',
                                  'Structural Integrity Biohacking',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, High-Performers, Movement Practitioners, Neuroscientists',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                          : slug === 'bohr-effect-oxygen-telemetry'
                            ? {
                                keywords: [
                                  'Bohr Effect',
                                  'Oxygen Telemetry CO2',
                                  'Hemoglobin Binding Affinity',
                                  'CO2 Tolerance Calibration',
                                  'BOLT Score Biohacking',
                                  'Cerebral Vasodilation Breathwork',
                                  'Cellular Hypoxia Prevention',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Athletes, High-Performers, Freedivers',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'anterior-cingulate-core-coherence-monitoring'
                            ? {
                                keywords: [
                                  'Anterior Cingulate Cortex ACC',
                                  'Conflict Monitoring Brain',
                                  'Prediction Error dACC vACC',
                                  'Cognitive Flexibility Task Switching',
                                  'System Arbiter Cognitive Control',
                                  'Jitter Suppression Focus',
                                  'Coherence Monitoring Protocol',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Knowledge Workers, High-Performers, Neuroscientists',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                          : slug === 'acc-calibration-protocol-cognitive-control'
                            ? {
                                keywords: [
                                  'ACC Calibration Protocol',
                                  'Cognitive Control Training',
                                  'Monotasking Deep Work',
                                  'Mindfulness Impulse Pause',
                                  'dACC Error Buffer Reset',
                                  'Focus Retention Biohacking',
                                  'Distraction Resilience',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, Knowledge Workers, High-Performers, Mindfulness Practitioners',
                                proficiencyLevel: 'Intermediate',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'hydraulic-viscosity-onda-transport-bus'
                            ? {
                                keywords: [
                                  'Blood Viscosity Cerebral Flow',
                                  'Hagen-Poiseuille Hydraulics',
                                  'Hydraulic Impedance Brain',
                                  'Thermal Control Vascular Tone',
                                  'Microcirculation Resistance',
                                  'Cerebral Perfusion Latency',
                                  'Centipoise Body Temperature',
                                  'ONDA Protocol',
                                ],
                                audience: 'Biohackers, High-Performers, Neuroscientists, Movement Practitioners',
                                proficiencyLevel: 'Advanced',
                                educationalLevel: 'Advanced',
                              }
                            : undefined
      const meta: RouteMeta = {
        title: article.seoTitle ?? `${article.title} | ONDA Life`,
        description: seoDesc,
        url,
        breadcrumbs,
        ogType: 'article',
        techArticle: { ...techArticleBase, ...techArticleExtras },
        hackQuotes: hackQuotes.length ? hackQuotes : undefined,
      }
      if (article.image) {
        const absImage = `${SITE_URL}${article.image}`
        meta.image = absImage
        if (article.imageAlt) meta.imageAlt = article.imageAlt
        if (meta.techArticle) {
          meta.techArticle.image = absImage
          if (article.imageAlt) meta.techArticle.imageAlt = article.imageAlt
          if (article.imageCaption) meta.techArticle.imageCaption = article.imageCaption
        }
      }
      if (article.howToSteps && article.howToSteps.length > 0) {
        meta.howTo = {
          name: `${article.title} — Practical Protocols`,
          description: `Step-by-step protocols from "${article.title}".`,
          step: article.howToSteps.map((s) => ({
            name: s.name,
            text: s.text,
            protocolId: s.protocolId,
          })),
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

  // /topics — index of all topic hubs.
  if (route === '/topics') {
    return {
      title: 'Topic Hubs | ONDA Life — Articles by Cluster',
      description:
        'Articles and glossary terms grouped by semantic cluster: HRV, Circadian, Dopamine, Metabolic, Breathwork, Neuroplasticity, Cognitive, Spinal, Hormones, Longevity.',
      url,
      breadcrumbs,
    }
  }

  // /topics/:slug — single hub. Hubs without `pillar` ship with noindex
  // so half-finished placeholders never enter Google's index. Hubs WITH
  // pillar emit topicHub data for CollectionPage + ItemList JSON-LD.
  const topicMatch = route.match(/^\/topics\/([^/]+)$/)
  if (topicMatch) {
    const topic = getTopicBySlug(topicMatch[1])
    if (topic) {
      const live = !!topic.pillar
      return {
        title: `${topic.name} | ONDA Life`,
        description: topic.shortDescription,
        url,
        breadcrumbs,
        noindex: !live,
        topicHub: live
          ? {
              name: topic.name,
              description: topic.shortDescription,
              url,
              articleSlugs: topic.articleSlugs,
              glossarySlugs: topic.glossarySlugs,
            }
          : undefined,
      }
    }
  }

  // /reviews — biohacking-tool review hub.
  if (route === '/reviews') {
    const hubDesc =
      'Independent, criteria-based reviews of HRV trackers and wearables — scored on measurement accuracy, data access and real-world use. The scoring methodology is public.'
    return {
      title: 'HRV Trackers & Wearables — Independent Reviews | ONDA Life',
      description: hubDesc,
      url,
      breadcrumbs,
      ogType: 'website',
      // CollectionPage + ItemList: the full catalogue of scored tools, so
      // search and AI engines read /reviews as the curated index of reviews.
      itemList: {
        name: 'ONDA Life — Biohacking Tool Reviews',
        description: hubDesc,
        url,
        items: [
          ...comparisons.map((c) => ({
            url: `${SITE_URL}/reviews/compare/${c.slug}`,
            name: c.title,
          })),
          ...reviews.map((r) => ({
            url: `${SITE_URL}/reviews/${r.slug}`,
            name: `${r.name} review`,
          })),
        ],
      },
    }
  }
  if (route === '/reviews/methodology') {
    return {
      title: 'Review Methodology — How We Score Tools | ONDA Life',
      description:
        'The fixed scoring rubric behind ONDA reviews: weighted criteria, the 0–10 scale, and how hands-on testing is distinguished from evidence-based assessment.',
      url,
      breadcrumbs,
      ogType: 'website',
    }
  }
  // Head-to-head duel pages — /reviews/vs/<product-a>-vs-<product-b>. AI
  // engines and SERPs surface these for "X vs Y" queries; we emit an
  // ItemList of the two products plus a FAQPage so they read as a single
  // structured answer rather than free-form text.
  const headToHeadMatch = route.match(/^\/reviews\/vs\/([^/]+)$/)
  if (headToHeadMatch) {
    const h2h = getHeadToHeadBySlug(headToHeadMatch[1])
    if (h2h) {
      const a = getReviewBySlug(h2h.productASlug)
      const b = getReviewBySlug(h2h.productBSlug)
      const c = h2h.productCSlug ? getReviewBySlug(h2h.productCSlug) : undefined
      const items =
        a && b
          ? [
              { url: `${SITE_URL}/reviews/${a.slug}`, name: a.name },
              { url: `${SITE_URL}/reviews/${b.slug}`, name: b.name },
              ...(c ? [{ url: `${SITE_URL}/reviews/${c.slug}`, name: c.name }] : []),
            ]
          : []
      return {
        title: `${h2h.title} — Side-by-Side Comparison | ONDA Life`,
        description: h2h.description,
        url,
        breadcrumbs,
        ogType: 'article',
        itemList: {
          name: h2h.title,
          description: h2h.description,
          url,
          items,
        },
        faq: h2h.faq.length
          ? { mainEntity: h2h.faq.map((f) => ({ question: f.q, answer: f.a })), url }
          : undefined,
      }
    }
  }

  const comparisonMatch = route.match(/^\/reviews\/compare\/([^/]+)$/)
  if (comparisonMatch) {
    const comparison = getComparisonBySlug(comparisonMatch[1])
    if (comparison) {
      const items = getReviewsForComparison(comparison).map((r) => ({
        url: `${SITE_URL}/reviews/${r.slug}`,
        name: r.name,
      }))
      return {
        title: `${comparison.title} | ONDA Life`,
        description: comparison.description,
        url,
        breadcrumbs,
        ogType: 'article',
        itemList: { name: comparison.title, description: comparison.description, url, items },
        faq: comparison.faq.length
          ? { mainEntity: comparison.faq.map((f) => ({ question: f.q, answer: f.a })), url }
          : undefined,
      }
    }
  }
  // Per-category landing pages — /reviews/hrv-trackers, /reviews/cgm, etc.
  // Checked before the individual-review handler because category URL slugs
  // sit in the same /reviews/:slug path space.
  const categoryMatch = route.match(/^\/reviews\/([^/]+)$/)
  if (categoryMatch) {
    const category = getCategoryByUrlSlug(categoryMatch[1])
    if (category) {
      const label = CATEGORY_LABELS[category]
      const catReviews = reviews.filter((r) => r.category === category)
      const catComparison = comparisons.find((c) => c.category === category)
      const titleByCat: Record<typeof category, string> = {
        'hrv-wearable': `Best HRV Trackers (2026) — Independent Reviews | ONDA Life`,
        'meditation-app': `Best Meditation Apps (2026) — Independent Reviews | ONDA Life`,
        'sleep-app': `Best Sleep Apps (2026) — Independent Reviews | ONDA Life`,
        'vagus-stim': `Best Vagus Nerve Stimulators (2026) — Independent Reviews | ONDA Life`,
        cgm: `Best CGMs for Biohackers (2026) — Independent Reviews | ONDA Life`,
        'eeg-headset': `Best EEG & Brain-Training Headsets (2026) — Independent Reviews | ONDA Life`,
        'red-light': `Best Red Light Therapy Panels (2026) — Independent Reviews | ONDA Life`,
        'cold-plunge': `Best Cold Plunge & Ice Bath (2026) — Independent Reviews | ONDA Life`,
        sauna: `Best Infrared Sauna & Sauna (2026) — Independent Reviews | ONDA Life`,
        'sleep-climate': `Best Smart Sleep Climate Systems (2026) — Independent Reviews | ONDA Life`,
        pemf: `Best PEMF Devices (2026) — Independent Reviews | ONDA Life`,
        'breathwork-app': `Best Breathwork Apps (2026) — Independent Reviews | ONDA Life`,
        'red-light-mask': `Best Red Light Face Masks (2026) — Independent Reviews | ONDA Life`,
        'breathing-aid': `Best Mouth Tape & Nasal Breathing Aids (2026) — Independent Reviews | ONDA Life`,
        'massage-gun': `Best Massage Guns (2026) — Independent Reviews | ONDA Life`,
      } as Record<typeof category, string>
      const descriptionByCat: Record<typeof category, string> = {
        'hrv-wearable':
          'Independent ONDA reviews of HRV trackers — rings, bands, smartwatches and chest straps — scored on measurement accuracy, sleep, data access, wearability and value.',
        'meditation-app':
          'Independent ONDA reviews of meditation apps — scored on library, teaching quality, personalisation, free tier, evidence base and value.',
        'sleep-app':
          'Independent ONDA reviews of sleep apps — trackers and wind-down tools — scored on tracking accuracy, content, sleep-science grounding, insights and value.',
        'vagus-stim':
          'Independent ONDA reviews of vagus nerve stimulators — auricular and cervical tVNS, vibrotactile and infrasonic devices — scored on evidence, mechanism, protocols and value.',
        cgm:
          'Independent ONDA reviews of CGMs for biohackers — Levels, Nutrisense, Stelo, Lingo, Ultrahuman, Signos, Veri, Zoe and more — scored on insights, accuracy, coaching and value.',
        'eeg-headset':
          'Independent ONDA reviews of EEG and brain-training headsets — Muse, Neurosity Crown, Emotiv, Mendi, FocusCalm and more — scored on signal, content, openness and value.',
        'red-light':
          'Independent ONDA reviews of red light therapy panels — Joovv, Mito Red, PlatinumLED, GembaRed, Hooga and more — scored on irradiance, wavelength coverage, EMF and value.',
        'cold-plunge':
          'Independent ONDA reviews of cold plunge tubs and ice baths — Plunge, BlueCube, Ice Barrel, Cold Pod, Edge and more — scored on chiller capacity, build, filtration and value.',
        sauna:
          'Independent ONDA reviews of infrared and traditional saunas — Sunlighten, Clearlight, HigherDose, SaunaSpace, Therasage and more — scored on heat source, EMF, build and value.',
        'sleep-climate':
          'Independent ONDA reviews of smart sleep climate systems — Eight Sleep Pod, ChiliPad, BedJet, Sleepme, OOLER and more — scored on climate range, build, app and value.',
        pemf:
          'Independent ONDA reviews of PEMF devices — Bemer, Healthy Wave, Pulse Centers, Curatron, iMRS, OMI, EarthPulse and more — scored on field strength, waveform research, build and value.',
        'breathwork-app':
          'Independent ONDA reviews of breathwork apps — Breathwrk, Othership, SOMA Breath, Wim Hof Method, Open, Pause and more — scored on library, technique coverage, evidence and value.',
        'red-light-mask':
          'Independent ONDA reviews of red light face masks — Omnilux Contour, CurrentBody Series 2, Dr. Dennis Gross, Lumara Viso, TheraFace, HigherDOSE and more — scored on irradiance, wavelength, evidence and value.',
        'breathing-aid':
          'Independent ONDA reviews of mouth tape and nasal breathing aids — Hostage Tape, Somnifix, Dream Recovery, Intake Breathing, Mute, Breathe Right and more — scored on adhesion, mechanism, safety and value.',
        'massage-gun':
          'Independent ONDA reviews of massage guns — Theragun PRO Plus, Hypervolt 2 Pro, Theragun Elite, Achedaway, Bob and Brad, Renpho, OPOVE and more — scored on stall force, amplitude, build and value.',
      } as Record<typeof category, string>
      const itemListEntries = [
        ...(catComparison
          ? [{ url: `${SITE_URL}/reviews/compare/${catComparison.slug}`, name: catComparison.title }]
          : []),
        ...catReviews.map((r) => ({ url: `${SITE_URL}/reviews/${r.slug}`, name: `${r.name} review` })),
      ]
      return {
        title: titleByCat[category],
        description: descriptionByCat[category],
        url,
        breadcrumbs,
        ogType: 'website',
        itemList: {
          name: `ONDA Life — Best ${label} (2026)`,
          description: descriptionByCat[category],
          url,
          items: itemListEntries,
        },
      }
    }
  }

  const reviewMatch = route.match(/^\/reviews\/([^/]+)$/)
  if (reviewMatch) {
    const review = getReviewBySlug(reviewMatch[1])
    if (review) {
      const absImage = review.image ? `${SITE_URL}${review.image}` : undefined
      return {
        title: `${review.name} Review — Scored ${review.overallScore.toFixed(1)}/10 | ONDA Life`,
        description: review.description,
        url,
        breadcrumbs,
        ogType: 'article',
        image: absImage,
        imageAlt: review.imageAlt,
        review: {
          name: `${review.name} review`,
          productName: review.name,
          brand: review.brand,
          reviewBody: review.summary,
          ratingValue: review.overallScore,
          datePublished: review.datePublished,
          dateModified: review.dateModified,
          image: absImage,
          pros: review.pros,
          cons: review.cons,
          url,
          productType: review.productType,
          priceUsd: review.price?.usd,
        },
      }
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
  // Truncate to SERP budgets BEFORE escaping — escapeHtmlAttr can turn one
  // character into a 5-char entity which would skew length math.
  const trimmedTitle = truncateForBudget(meta.title, TITLE_MAX)
  const trimmedDesc = truncateForBudget(meta.description, DESC_MAX)
  const escapedTitle = escapeHtmlAttr(trimmedTitle)
  const escapedDesc = escapeHtmlAttr(trimmedDesc)
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

  // JSON-LD: DefinedTermSet (the /glossary index)
  if (meta.definedTermSet) {
    const definedTermSetScript = `<script type="application/ld+json">${buildDefinedTermSetJsonLd(meta.definedTermSet)}</script>`
    out = out.replace('</head>', `  ${definedTermSetScript}\n</head>`)
  }

  // JSON-LD: Topic hub CollectionPage + ItemList (only when pillar is live).
  if (meta.topicHub) {
    const topicScript = `<script type="application/ld+json">${buildTopicHubJsonLd(
      meta.topicHub.name,
      meta.topicHub.description,
      meta.topicHub.url,
      meta.topicHub.articleSlugs,
      meta.topicHub.glossarySlugs,
    )}</script>`
    out = out.replace('</head>', `  ${topicScript}\n</head>`)
  }

  // Force noindex for placeholder topic hubs (and any future page that opts in).
  // Replaces the default <meta name="robots" content="index, follow, …">
  // shipped in index.html so Google never adds the placeholder to its index.
  if (meta.noindex) {
    out = out.replace(
      /<meta\s+name="robots"\s+content="[^"]*">/i,
      '<meta name="robots" content="noindex, nofollow">',
    )
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
            imageAlt: meta.techArticle.imageAlt,
            imageCaption: meta.techArticle.imageCaption,
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

    // Quotation JSON-LD per "The Hack" blockquote — references the
    // TechArticle by @id so the graph stays connected. Empty array =
    // no emission, no harm done.
    if (meta.hackQuotes?.length) {
      const quotationScripts = meta.hackQuotes
        .map((q) => `<script type="application/ld+json">${buildQuotationJsonLd(q, meta.techArticle!.url)}</script>`)
        .join('\n  ')
      out = out.replace('</head>', `  ${quotationScripts}\n</head>`)
    }

    // Highwire Press citation_* meta tags. Read by Google Scholar AND
    // most academic AI agents (Semantic Scholar, Elicit, Consensus.app,
    // ResearchGate, Connected Papers). Lightweight academic-citation
    // surface — does not affect Google web search.
    const datePublished = meta.techArticle.datePublished
    // Highwire prefers YYYY/MM/DD (slashes), but YYYY-MM-DD also accepted.
    const citationDate = datePublished ? datePublished.split('T')[0].replace(/-/g, '/') : ''
    const citationAuthor = escapeHtmlAttr(AUTHOR_NAME)
    const citationTitle = escapeHtmlAttr(meta.techArticle.name)
    const citationAbstract = escapeHtmlAttr(meta.techArticle.description)
    const citationUrl = escapeHtmlAttr(meta.techArticle.url)
    const citationTags = [
      `<meta name="citation_title" content="${citationTitle}">`,
      `<meta name="citation_author" content="${citationAuthor}">`,
      `<meta name="citation_author_institution" content="ONDA Life">`,
      citationDate ? `<meta name="citation_publication_date" content="${citationDate}">` : '',
      citationDate ? `<meta name="citation_online_date" content="${citationDate}">` : '',
      `<meta name="citation_fulltext_html_url" content="${citationUrl}">`,
      `<meta name="citation_abstract_html_url" content="${citationUrl}">`,
      `<meta name="citation_abstract" content="${citationAbstract}">`,
      `<meta name="citation_journal_title" content="ONDA Life">`,
      `<meta name="citation_publisher" content="ONDA Life">`,
      `<meta name="citation_language" content="en">`,
    ].filter(Boolean).join('\n  ')
    out = out.replace('</head>', `  ${citationTags}\n</head>`)
  }

  // JSON-LD: ContactPage
  if (meta.contactPage) {
    const contactScript = `<script type="application/ld+json">${buildContactPageJsonLd(meta.contactPage.name, meta.contactPage.description, meta.contactPage.url, meta.contactPage.email)}</script>`
    out = out.replace('</head>', `  ${contactScript}\n</head>`)
  }

  // JSON-LD: AboutPage
  if (meta.researchProject) {
    const rpScript = `<script type="application/ld+json">${buildResearchProjectJsonLd(meta.researchProject.name, meta.researchProject.description, meta.researchProject.url)}</script>`
    out = out.replace('</head>', `  ${rpScript}\n</head>`)
  }
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
    const howToScript = `<script type="application/ld+json">${buildHowToJsonLd(meta.howTo)}</script>`
    out = out.replace('</head>', `  ${howToScript}\n</head>`)
  }

  // JSON-LD: FAQPage (article pages with FAQ schema)
  if (meta.faq) {
    const faqScript = `<script type="application/ld+json">${buildFAQPageJsonLd(meta.faq.mainEntity, meta.faq.url)}</script>`
    out = out.replace('</head>', `  ${faqScript}\n</head>`)
  }

  // JSON-LD: Review (individual product review pages)
  if (meta.review) {
    const reviewScript = `<script type="application/ld+json">${buildReviewJsonLd(meta.review)}</script>`
    out = out.replace('</head>', `  ${reviewScript}\n</head>`)
  }

  // JSON-LD: CollectionPage + ItemList (comparison round-ups)
  if (meta.itemList) {
    const itemListScript = `<script type="application/ld+json">${buildComparisonItemListJsonLd(meta.itemList)}</script>`
    out = out.replace('</head>', `  ${itemListScript}\n</head>`)
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

  // E-E-A-T: meta name="author" on every page. The full Person identity is
  // emitted as JSON-LD on homepage + /about (below); this meta tag is the
  // lightweight signal Google scans on every URL.
  const authorMeta = `<meta name="author" content="${escapeHtmlAttr(AUTHOR_NAME)}">`
  if (out.includes('name="author"')) {
    out = out.replace(/<meta\s+name="author"\s+content="[^"]*">/i, authorMeta)
  } else {
    out = out.replace('</head>', `  ${authorMeta}\n</head>`)
  }

  // Person JSON-LD on homepage and /about — Google links per-article
  // TechArticle.author (which uses @id) to this full Person record.
  if (canonicalUrl === SITE_URL || meta.aboutPage) {
    const personScript = `<script type="application/ld+json">${buildPersonJsonLd()}</script>`
    out = out.replace('</head>', `  ${personScript}\n</head>`)
  }

  // Organization + WebSite JSON-LD on homepage only. Together with the
  // Person record on the same page they form a connected Knowledge
  // Graph (WebSite → publisher → Organization → founder → Person).
  if (canonicalUrl === SITE_URL) {
    const orgScript = `<script type="application/ld+json">${buildOrganizationJsonLd()}</script>`
    const siteScript = `<script type="application/ld+json">${buildWebSiteJsonLd()}</script>`
    const datasetScript = `<script type="application/ld+json">${buildDatasetJsonLd()}</script>`
    out = out.replace('</head>', `  ${orgScript}\n  ${siteScript}\n  ${datasetScript}\n</head>`)
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

  // og:image:width / og:image:height / og:image:type — keep them in sync
  // with the actual ogImage URL (template defaults match the homepage OG card;
  // article pages override og:image to article.image so the dimensions need
  // to follow). Looked up in the build-time IMAGE_DIMENSIONS manifest.
  const ogImagePath = ogImage.replace(/^https?:\/\/[^/]+/, '')
  const ogImageDims = IMAGE_DIMENSIONS[ogImagePath]
  if (ogImageDims) {
    out = out.replace(
      /<meta\s+property="og:image:width"\s+content="[^"]*">/gi,
      `<meta property="og:image:width" content="${ogImageDims.width}">`
    )
    out = out.replace(
      /<meta\s+property="og:image:height"\s+content="[^"]*">/gi,
      `<meta property="og:image:height" content="${ogImageDims.height}">`
    )
  }
  const ogImageType =
    ogImagePath.endsWith('.webp') ? 'image/webp' :
    ogImagePath.endsWith('.avif') ? 'image/avif' :
    ogImagePath.endsWith('.png')  ? 'image/png'  :
    /\.(jpe?g)$/i.test(ogImagePath) ? 'image/jpeg' : null
  if (ogImageType) {
    if (out.includes('og:image:type')) {
      out = out.replace(
        /<meta\s+property="og:image:type"\s+content="[^"]*">/gi,
        `<meta property="og:image:type" content="${ogImageType}">`
      )
    } else {
      out = out.replace(
        /(<meta\s+property="og:image"\s+content="[^"]*">)/i,
        `$1\n  <meta property="og:image:type" content="${ogImageType}">`
      )
    }
  }

  return out
}
