/**
 * Meta data for build-time injection into prerendered HTML.
 * Single source of truth for title/description per route.
 */
import { IMAGE_DIMENSIONS } from '../src/data/image-manifest.generated'
import { getTermBySlug, glossaryTerms } from '../src/data/glossary'
import { GLOSSARY_SEO } from '../src/data/glossary-seo'
import { glossaryLayer } from '../src/data/glossary-layer'
import { levelsData } from '../src/data/levels'
import { PART_SEO } from '../src/data/part-seo'
import { parts } from '../src/pages/PartPage'
import { getArticleBySlug, articles } from '../src/data/articles'
import { ARTICLE_TOPIC_HUBS, getArticleTopicHub, getPrimaryHubForArticle, type ArticleTopicSlug } from '../src/data/article-topics'
import { hubItemSlugs, hubLastModified, hubAvailable, localizedHubItemSlugs, localizedHubLastModified } from '../src/data/article-topic-listing'
import { libraryCopy, fillLib } from '../src/data/library-i18n'
import { TOPIC_HUB_FAQ, hubFaqFor } from '../src/data/topic-hub-faq'
import { ARTICLE_FAQ as FAQ_SCHEMA, ARTICLE_FAQ_SCHEMA_ONLY } from '../src/data/article-faq'
import { ARTICLE_CITATIONS, type StudyCitation } from '../src/data/article-citations'
import { METRIC_DETAILS } from '../src/data/bioMetrics'
import { hrvToolCopy } from '../src/data/hrv-tool-i18n'
import { baselineCopy } from '../src/data/baseline-i18n'
import { rhrToolCopy } from '../src/data/rhr-tool-i18n'
import { SUPPORTED_LANGS, type Lang } from '../src/i18n'
import { MEASUREMENTS_I18N } from '../src/data/measurements-i18n'
import { measurementsJsonLd } from '../src/pages/MeasurementsPage'
import { aiAppsJsonLd, AI_APPS_TITLE, AI_APPS_DESC } from '../src/pages/AiAppsPage'
import { scienceMeta, parseScienceRoute } from '../src/lib/science-meta'
import { SCIENCE_FULL } from '../src/generated/science-full'
import { HOW_IT_WORKS_I18N } from '../src/data/how-it-works-i18n'
import { PEOPLE_I18N } from '../src/data/people-i18n'
import { getOndaVs, ONDA_VS } from '../src/data/onda-vs'
import { getRoundup } from '../src/data/onda-roundups'
import { ONDA_FAQ_FLAT } from '../src/data/onda-faq'
import { SERP_OVERRIDES } from '../src/data/serp-overrides'
import { PRODUCT_I18N } from '../src/data/product-i18n'
import { FAQ_I18N } from '../src/data/faq-i18n'
import { TOOLS } from '../src/data/tools'
import { TOOLS_I18N, TOOLS_EN } from '../src/data/tools-i18n'
import { localizedToolCard } from '../src/data/tools-localized'
import { COMPARE_I18N } from '../src/data/compare-i18n'
import { ARTICLE_DATES } from '../src/data/article-dates.generated'
import { hrvBiofeedbackJsonLd } from '../src/pages/HrvBiofeedbackPage'
import { HRV_BIOFEEDBACK_I18N } from '../src/data/hrv-biofeedback-i18n'
import { RESONANCE_BREATHING_I18N } from '../src/data/resonance-breathing-i18n'
import { HRV_VS_COHERENCE_I18N } from '../src/data/hrv-vs-coherence-i18n'
import { APPLE_WATCH_HRV_I18N } from '../src/data/apple-watch-hrv-i18n'
import { resonanceBreathingJsonLd } from '../src/pages/ResonanceBreathingGuidePage'
import { hrvVsCoherenceJsonLd } from '../src/pages/HrvVsCoherencePage'
import { appleWatchHrvJsonLd } from '../src/pages/AppleWatchHrvBiofeedbackPage'
import { researchJsonLd } from '../src/pages/ResearchPage'
import { founderJsonLd } from '../src/pages/FounderPage'
import { productJsonLd } from '../src/pages/ProductPage'
import { howItWorksJsonLd } from '../src/pages/HowItWorksPage'
import { EMOTON_FAQ } from '../src/data/emoton-faq'
import { caffToolCopy } from '../src/data/caff-tool-i18n'
import { SLEEP_DEBT_FAQ } from '../src/data/sleep-debt'
import { HR_ZONE_FAQ } from '../src/data/hr-zones'
import { chronoToolCopy } from '../src/data/chrono-tool-i18n'
import { PROTEIN_FAQ } from '../src/data/protein-target'
import { VO2MAX_FAQ } from '../src/data/vo2max'
import { TDEE_FAQ } from '../src/data/tdee'
import { WATER_FAQ } from '../src/data/water-intake'
import { alcToolCopy } from '../src/data/alc-tool-i18n'
import { FASTING_FAQ } from '../src/data/fasting'
import { JETLAG_FAQ } from '../src/data/jetlag'
import { ONE_REP_MAX_FAQ } from '../src/data/one-rep-max'
import { BODY_FAT_FAQ } from '../src/data/body-fat'
import { sleepToolCopy } from '../src/data/sleep-tool-i18n'
import { SHUFFLE_FAQ } from '../src/data/cognitive-shuffle'
import { breathToolCopy } from '../src/data/breath-tool-i18n'
import { resoToolCopy } from '../src/data/reso-tool-i18n'
import { DOPAMINE_FAQ } from '../src/data/dopamine-reset'
import { bioToolCopy } from '../src/data/bioage-tool-i18n'
import { DETOX_FAQ } from '../src/data/digital-detox'
import { BURNOUT_FAQ } from '../src/data/burnout-assessment'
import { NS_FAQ } from '../src/data/nervous-system-state'
import { whmToolCopy } from '../src/data/whm-tool-i18n'
import { FOG_FAQ } from '../src/data/brain-fog'
import { RECOVERY_FAQ } from '../src/data/recovery-score'
import { camToolCopy } from '../src/data/cam-tool-i18n'
import { MIC_FAQ } from '../src/data/mic-breathing'
import { BH_FAQ } from '../src/data/breath-heart'
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
const AUTHOR_SAME_AS = [
  'https://www.linkedin.com/in/yamius',
  'https://wateremotions.tilda.ws/kukoom',
]

/**
 * Brand profiles for the ONDA Life *Organization* (distinct from the founder's
 * personal LinkedIn above). These sameAs links are the strongest signal that
 * disambiguates "ONDA Life" the app from the unrelated "ONDA Life, Inc" /
 * Onda Beauty entities — they point Google at the canonical owned profiles.
 */
const ORG_SAME_AS = [
  // Wikidata entity (Q141490740) — the canonical node in the entity graph;
  // strongest disambiguation of "ONDA Life" (the HRV app) from the many other
  // "Onda" entities for Google Knowledge Graph and LLMs.
  'https://www.wikidata.org/wiki/Q141490740',
  'https://apps.apple.com/app/apple-store/id6755912529',
  'https://www.reddit.com/user/onda_life/',
  'https://www.facebook.com/waterstree.yakov',
]

// Google desktop SERP renders ~70-78 chars in 2026; 65 keeps a safe margin
// while no longer forcing our own ellipsis on titles Google would show in
// full. (Raised from 60 — 2026-05-29 SEO audit, roadmap 6.3.)
export const TITLE_MAX = 65
export const DESC_MAX = 160

/** Decode the handful of HTML entities that appear in titles / descriptions
 *  so length is measured against the *visible* character count, not the
 *  encoded byte length. `&amp;` is 5 chars encoded but renders as 1 char in
 *  the SERP — counting the encoded form falsely trips the budget and forces
 *  a spurious ellipsis (2026-05-29 audit, roadmap 6.2). */
function decodeBasicEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/** Re-encode the structural HTML characters after truncation, so a value
 *  that arrived HTML-encoded leaves HTML-encoded. Only `&`, `<`, `>` — these
 *  are the chars that are unsafe in both element text and attribute values;
 *  quotes/apostrophes are left as-is because the truncation tail never ends
 *  on one and re-encoding them would risk double-encoding the meta-inject
 *  (raw-input) call path. */
function encodeBasicEntities(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const HTML_ENTITY_RE = /&(?:amp|lt|gt|quot|apos|#39);/

/**
 * Trim text to fit within Google's SERP slot, preserving word boundary.
 *
 * - Measures length against the DECODED (visible) string, so `&amp;` counts
 *   as one char, not five.
 * - Pass-through when already within budget.
 * - Otherwise cut at the last space before (max - 1) and append `…`.
 * - Idempotent: text already ending in `…` is left alone.
 * - Re-encodes &/</> only when the input arrived HTML-encoded (prerender
 *   final-pass call path); the raw-input meta-inject call path is untouched.
 *
 * Intentionally does not pad short texts — padded descriptions look like
 * keyword stuffing to Google and provide no SEO benefit. Short titles and
 * descriptions are fine; Google will use them as-is or rewrite slightly.
 */
export function truncateForBudget(text: string, max: number): string {
  const hadEntities = HTML_ENTITY_RE.test(text)
  const decoded = hadEntities ? decodeBasicEntities(text) : text
  if (decoded.length <= max) return text
  if (decoded.endsWith('…')) return text
  const slice = decoded.slice(0, max - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > Math.floor(max * 0.6) ? slice.slice(0, lastSpace) : slice
  const truncated = `${cut.replace(/[\s,;:.!?\-—…]+$/, '')}…`
  return hadEntities ? encodeBasicEntities(truncated) : truncated
}

/**
 * Ideal SERP title length. Google renders ~580–600px of title (~60 chars for
 * Latin text) before truncating with an ellipsis. TITLE_MAX (65) is the hard
 * ceiling that triggers truncateForBudget's dumb tail-cut; TITLE_IDEAL is the
 * soft target we shape titles to so the brand suffix is never the thing that
 * gets dropped.
 */
export const TITLE_IDEAL = 60

/** Trailing words too weak to end a title on — dropped after a word trim. */
const TRAILING_STOPWORDS = new Set([
  'a', 'an', 'and', 'or', 'the', 'to', 'of', 'for', 'your', 'with', 'in', 'on',
  'at', 'by', 'from', 'into', 'is', 'are', 'how', 'what', 'find', '&', 'vs', 'vs.', '+',
])

/**
 * Greedy word-boundary trim with no ellipsis: keep the maximal run of whole
 * words that fits, strip trailing punctuation, then drop a final dangling
 * function word ("… Returning to" → "… Returning") so the title doesn't end
 * mid-thought.
 */
function wordTrim(s: string, max: number): string {
  if (s.length <= max) return s
  const words = s.split(' ')
  let out = ''
  for (const w of words) {
    const cand = out ? `${out} ${w}` : w
    if (cand.length > max) break
    out = cand
  }
  if (!out) out = s.slice(0, max) // single oversized token — hard cut
  out = out.replace(/[\s,;:.!?\-–—…]+$/, '')
  // Drop up to two trailing stopwords (also re-strip punctuation between).
  for (let i = 0; i < 2; i++) {
    const parts = out.split(' ')
    if (parts.length > 1 && TRAILING_STOPWORDS.has(parts[parts.length - 1].toLowerCase())) {
      parts.pop()
      out = parts.join(' ').replace(/[\s,;:.!?\-–—…]+$/, '')
    } else break
  }
  // Never end on an unclosed parenthetical ("… HRV (SDNN vs").
  if (out.lastIndexOf('(') > out.lastIndexOf(')')) {
    out = out.slice(0, out.lastIndexOf('(')).replace(/[\s,;:.!?\-–—…]+$/, '')
  }
  return out
}

/**
 * Shape a title to <= TITLE_IDEAL chars WITHOUT ever dropping the " | ONDA Life"
 * brand suffix or appending an ellipsis (unlike truncateForBudget). Strategy:
 *   1. If already within budget, return as-is.
 *   2. Drop a year token "(20XX)" if that alone brings it under (preserves words).
 *   3. Detect the brand-suffix separator (the last ' | ' / ' — ' / ' – ' whose
 *      tail mentions ONDA) and word-trim only the STEM so stem + suffix fit.
 *   4. If there is no recognisable brand suffix (or it's too long to leave a
 *      meaningful stem), fall back to a plain word-trim of the whole title.
 * Deterministic and idempotent — safe to run on every build.
 */
/** Library hub meta description: the intro's first sentence when it is a proper
 *  snippet (70–160 chars), else the intro cut on a word boundary — the tile
 *  one-liner is too short for a SERP snippet (roadmap 9.6). */
function hubMetaDescription(intro: string, tile: string): string {
  const first = intro.split(/(?<=[.!?。！？])\s+/)[0]?.trim() ?? ''
  if (first.length >= 70 && first.length <= 160) return first
  if (intro.length <= 160) return intro.length >= 70 ? intro : tile
  const cut = intro.slice(0, 158)
  const sp = cut.lastIndexOf(' ')
  return `${(sp > 100 ? cut.slice(0, sp) : cut).replace(/[\s,;:—–-]+$/, '')}…`
}

export function clampTitleToIdeal(title: string, max = TITLE_IDEAL): string {
  if (title.length <= max) return title

  // 2 — try shedding a year parenthetical first.
  const noYear = title.replace(/\s*\((?:19|20)\d\d\)/, '')
  if (noYear !== title && noYear.length <= max) return noYear
  const work = noYear.length < title.length ? noYear : title
  if (work.length <= max) return work

  // 3 — brand-aware stem trim.
  const seps = [' | ', ' — ', ' – ', ' - ']
  let best: { idx: number; sep: string } | null = null
  for (const sep of seps) {
    const idx = work.lastIndexOf(sep)
    if (idx > 0 && work.slice(idx).includes('ONDA') && (!best || idx > best.idx)) {
      best = { idx, sep }
    }
  }
  if (best) {
    const stem = work.slice(0, best.idx)
    const suffix = work.slice(best.idx) // includes the leading separator
    const room = max - suffix.length
    if (room >= 24) {
      const trimmed = wordTrim(stem, room)
      if (trimmed.length >= 12) return trimmed + suffix
    }
  }

  // 4 — no usable brand suffix; trim the whole thing on a word boundary.
  return wordTrim(work, max)
}

/** Build canonical URL without trailing slash. Google sees only one URL variant. */
function buildCanonicalUrl(route: string): string {
  const base = SITE_URL.replace(/\/+$/, '')
  const cleanPath = (route || '/').replace(/\/+$/, '') || '/'
  return cleanPath === '/' ? base : `${base}${cleanPath}`
}
/** Year stamped into individual review titles (freshness/CTR). Bump yearly; the
 *  category-landing titles carry the same year and should be bumped together. */
const REVIEW_TITLE_YEAR = '2026'
const DEFAULT_TITLE = 'ONDA Life: Stop Tracking Stress. Start Training It.'
const DEFAULT_DESC =
  'Guided breathing with real-time feedback from your own heart rhythm. Structured 8-level training for your nervous system. Free to start, no account.'

const ABOUT_TITLE = 'About ONDA Life — Who Builds It, and Why'
const ABOUT_DESC =
  "Built by a developer-founder and a science advisor with a PhD in physics and neuroscience — HRV biofeedback training, honest about what it can and can't do."

const GLOSSARY_TITLE = 'HRV, Breathwork & Neuroscience Glossary | ONDA Life'
const GLOSSARY_DESC =
  'A knowledge base of the science ONDA builds on — heart-rate variability (HRV), the vagus nerve, resonance breathing, autonomic regulation and interoception — plus the wider neuroscience and biohacking terms behind the ONDA system.'

const CONTACT_TITLE = 'Contact ONDA Life | Support & Community'
const CONTACT_DESC =
  'Questions, support, or collaboration — reach the ONDA Life team. We read every message and respond.'

const THE_STACK_TITLE = 'The Stack | System Configuration | ONDA Life'
const THE_STACK_DESC =
  'Complete daily operational protocol for human hardware optimization. All 13 system upgrades in one dashboard.'

export interface BreadcrumbItem {
  name: string
  url: string
}

/** SEO descriptions for articles (150–160 chars). Honest, keyword-forward — no overclaim register. */
const ARTICLE_SEO_DESCRIPTIONS: Record<string, string> = {
  'dopamine-architecture-mastering-desire':
    'Dopamine drives wanting and learning, not pleasure. What the science shows about motivation, why "reset your baseline" claims overreach, and what really helps.',
  'circadian-reset-mastering-light':
    'How light sets your circadian clock — using photic timing to ease circadian drift, insomnia, and brain fog.',
  'metabolic-flexibility-dual-fuel-system':
    'Metabolic flexibility is your ability to shift between burning fat and carbs. How it is measured, why it is not ketosis, and which habits actually improve it.',
  'neuroplasticity-flow-overclocking':
    'How BDNF, flow states, and myelination relate to learning and focus — and what practice can actually influence.',
  'gut-brain-axis-data-link':
    'How the gut-brain axis links the microbiome to mood, immunity, and cognition — and what supports it.',
  'breathwork-command-line-interface':
    'Breath as your nervous-system command line: box breathing, the physiological sigh, and nasal breathing, explained.',
  'digital-dementia-attentional-control':
    'How constant digital input fragments attention — and practical ways to protect and rebuild your focus.',
  'longevity-hardware-cellular-cleanup':
    'How autophagy and senescent-cell clearance relate to healthy aging — what the research suggests, honestly.',
  'cognitive-architecture-nootropic-stacks':
    'Nootropics, explained: neuroprotection, neurotransmission, and cerebral blood flow — and what to stay skeptical of.',
  'mitochondrial-biogenesis-cellular-power-grid':
    'How exercise and cold exposure drive mitochondrial biogenesis — building cellular energy capacity over time.',
  'circadian-lighting-dark-therapy':
    'How light and dark exposure shape circadian and hormonal rhythms — reducing photic noise for better sleep.',
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
    'Cognitive architecture, explained: attention, signal-to-noise, and mental bandwidth — what practice can support, without overpromising.',
  'system-feedback-biometric-loop':
    'Stop tracking and start optimizing. Learn how ONDA turns your biometric data into immediate corrective protocols for peak performance.',
  'endocrine-social-drive-oxytocin-testosterone':
    'Oxytocin is not a simple trust hormone and testosterone is not a simple aggression hormone. What studies show, which findings failed, and what shapes both.',
  'hpa-axis-control-cortisol-aggression':
    'Master your stress architecture. Learn how to manage the HPA axis, cortisol spikes, and reactive aggression using ONDA neuro-protocols.',
  'system-stability-serotonin':
    'Serotonin helps regulate mood, sleep, appetite and the gut. Gut serotonin does not reach the brain. What the evidence shows about light, food, exercise and pills.',
  'energy-sensor-leptin':
    'Leptin tells your brain how much fat you store. Why high leptin does not stop hunger, why dieting lowers it, how short sleep cuts it, and what actually helps.',
  'neural-optimizer-estrogen':
    'Brain fog in perimenopause is real but usually temporary. How estrogen affects the brain, what hormone therapy can and cannot do, and other options that work.',
  'protocol-circadian-hard-reset':
    'The 72-hour Circadian Hard Reset: three Zeitgeber interventions — Photonic Anchor, Thermal Spike, Metabolic Gate — to reflash a drifted biological clock in under three days.',
  'ancestral-sync-circadian-anchors':
    'Three ancestral Zeitgeber anchors — morning light, thermal reset, and metabolic gate — to lock your circadian clock and prevent epigenetic drift. ONDA Protocol.',
  'longevity-protocol-biological-clock-reset':
    'Reset your epigenetic age with the ONDA Deep Reset stack: 48-hour dark surge, pulsed hormesis, and DFA-guided wind down to optimize the Horvath Clock and slow biological aging.',
  'molecular-psychology-hormonal-firmware':
    'Partly, but not alone. Hormones and brain chemicals shape mood together with sleep, stress, thoughts and people. What the evidence shows and what helps.',
  'nervous-system-ping-latency':
    'Only weakly. Higher resting HRV is linked to slightly better focus and steadier reactions, but effects are small. What HRV measures and what training can do.',
  'fault-tolerant-human-hrv-buffer':
    'Low HRV = no headroom — any load triggers cascade failure. The ONDA hardening protocol builds your HRV buffer via hormetic loading, VNS calibration, and predictive morning HRV monitoring.',
  'resonant-frequency-system-coherence':
    'Every person has a unique resonant breathing frequency (4.5–6.5 breaths/min) where HRV peaks, vascular resistance drops, and the brain shifts to Alpha/Theta clarity. A simple resonance scan with an HRV monitor finds yours.',
  'baroreflex-01hz-shift':
    'At 0.1 Hz your breathing locks with Mayer Waves, hijacking the baroreflex to maximize HRV amplitude, lower blood pressure, and phase-lock the heart-brain coherence signal in under 90 seconds.',
  'nightly-flush-glymphatic-neural-cache':
    'Sleep likely helps the brain clear waste, but most evidence is from mice and a 2024 study disputes it. What is proven in humans, sleep position, and what helps.',
  'neural-hydraulics-csf-flow':
    'The brain is a hydraulic machine — arteries act as pistons, CSF flushes metabolic waste, posture controls pressure. The ONDA hydraulic protocol primes vascular elasticity, gravity, and breath for full nightly purge.',
  'anti-entropy-neural-architecture':
    'Aging is accumulated entropy. The ONDA Anti-Entropy Protocol layers glymphatic clearance, autophagy-sync fasting, and thermal regulation to halt beta-amyloid drift before it crosses the irreversibility threshold.',
  'neural-bridge-alpha-flow-gateway':
    'Alpha waves are an 8–12 Hz brain rhythm that grows when you close your eyes or turn attention inward. What they do, what they do not, and what really helps.',
  'spinal-harddrive-cpg-autonomous-scripts':
    'CPGs are spinal neural circuits that execute complex movement without brain input. The ONDA Harddrive Protocol uses sensory priming, rhythmic entrainment, and eyes-closed drills to free the prefrontal cortex for strategic thought.',
  'rhythmic-entrainment-system-frequencies':
    'Biological oscillators waste energy when out of phase. The ONDA Entrainment Protocol locks breath, heart, CPGs, and brain to a single 0.1 Hz master clock via slow breathing, locomotor-respiratory coupling, and acoustic entrainment.',
  'spinal-intelligence-decentralized-control':
    'The spinal cord is a distributed processor with motor memory and reflex logic. The ONDA Protocol develops edge-computing movement intelligence via unpredictable loading, proprioceptive focus, and Alpha-state triggers.',
  'adrenal-governor-thermal-runaway':
    'Adrenal fatigue is not a recognised medical condition. Why the tiredness is still real, which adrenal diseases do exist, and when to see a doctor.',
  'ventral-tegmental-core-motivational-salience':
    'The VTA is the reactor of motivational salience. ONDA recalibrates dopamine telemetry via system reset, hormetic stress and delayed-reward deep work to restore drive without external triggers.',
  'fascial-tensegrity-protocol-myofascial-noise':
    'Trapezius lock and cervical compression strangle cerebral blood flow. The ONDA Fascial Tensegrity Protocol pairs targeted myofascial release with humming vagal exhale to restore structural balance.',
  'vascular-tensegrity-microvascular-mechanics':
    'The vascular network is a tensegrity transport bus, not a pipeline. Balanced fascial tension delivers oxygen and nutrients to the cortex with zero impedance and absorbs mechanical shocks.',
  'chm-continuous-hormone-monitoring':
    'Not yet: no validated consumer wearable measures cortisol. Research sweat sensors exist; saliva, blood and urine tests remain the standard. What to track instead.',
  'co2-tolerance-expanding-oxygen-limit':
    'The urge to breathe is driven mostly by CO₂, not low oxygen. What the BOLT breath-hold test measures, why it is barely validated, and how to practice safely.',
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
  ogType?: 'article' | 'website' | 'profile'
  /** Force <meta name=robots content="noindex, nofollow"> on the page.
   *  Used for placeholder topic hubs that haven't been reviewed yet. */
  noindex?: boolean
  /** Topic hub data — for ONDA Library /articles/topic/<t> hubs. */
  topicHub?: {
    name: string
    description: string
    url: string
    articleSlugs: readonly string[]
    glossarySlugs: readonly string[]
    /** YYYY-MM-DD — newest article in the hub (ONDA Library hubs). */
    dateModified?: string
    /** '' for EN, '/ru' etc. for localized ONDA Library hubs (ItemList URLs). */
    langPrefix?: string
  }
  /** Article image for og:image, twitter:image (absolute URL) */
  image?: string
  imageAlt?: string
  definedTerm?: {
    name: string
    description: string
    url: string
    /** Term set this belongs to. Defaults to the ONDA Life Glossary; bio-metric
     *  pages pass the Bio OS metrics set so they don't claim glossary membership. */
    termSet?: { id: string; name: string; url: string }
  }
  /** Extracted "The Hack" blockquote bodies — emitted as Quotation JSON-LD. */
  hackQuotes?: string[]
  techArticle?: {
    name: string
    description: string
    url: string
    datePublished: string
    dateModified?: string
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
  /** SoftwareApplication JSON-LD (a free web tool, e.g. /emoton). */
  softwareApplication?: { name: string; description: string; url: string; category: string }
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
    /** YYYY-MM-DD — freshness signal on the CollectionPage (roadmap 9.4). */
    datePublished?: string
    dateModified?: string
  }
  /** Generic extra JSON-LD nodes emitted verbatim (each as its own script).
   *  For pages whose JSON-LD is built in a useEffect that prerender can't run. */
  jsonLd?: Record<string, unknown>[]
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
  if (segments[0] === 'tools') {
    items.push({ name: 'Tools', url: `${SITE_URL}/tools` })
    if (segments[1] === 'hrv') {
      items.push({ name: 'HRV Calculator by Age', url: `${SITE_URL}/tools/hrv` })
    } else if (segments[1] === 'caffeine') {
      items.push({ name: 'Caffeine Cut-Off', url: `${SITE_URL}/tools/caffeine` })
    } else if (segments[1] === 'sleep-debt') {
      items.push({ name: 'Sleep Debt', url: `${SITE_URL}/tools/sleep-debt` })
    } else if (segments[1] === 'zone-2') {
      items.push({ name: 'Zone 2 Heart Rate', url: `${SITE_URL}/tools/zone-2` })
    } else if (segments[1] === 'chronotype') {
      items.push({ name: 'Chronotype Quiz', url: `${SITE_URL}/tools/chronotype` })
    } else if (segments[1] === 'protein') {
      items.push({ name: 'Protein Target', url: `${SITE_URL}/tools/protein` })
    } else if (segments[1] === 'vo2max') {
      items.push({ name: 'VO2max', url: `${SITE_URL}/tools/vo2max` })
    } else if (segments[1] === 'tdee') {
      items.push({ name: 'TDEE', url: `${SITE_URL}/tools/tdee` })
    } else if (segments[1] === 'water') {
      items.push({ name: 'Water Intake', url: `${SITE_URL}/tools/water` })
    } else if (segments[1] === 'alcohol') {
      items.push({ name: 'Alcohol Calculator', url: `${SITE_URL}/tools/alcohol` })
    } else if (segments[1] === 'fasting') {
      items.push({ name: 'Fasting', url: `${SITE_URL}/tools/fasting` })
    } else if (segments[1] === 'jet-lag') {
      items.push({ name: 'Jet Lag', url: `${SITE_URL}/tools/jet-lag` })
    } else if (segments[1] === 'one-rep-max') {
      items.push({ name: 'One-Rep Max', url: `${SITE_URL}/tools/one-rep-max` })
    } else if (segments[1] === 'body-fat') {
      items.push({ name: 'Body Fat', url: `${SITE_URL}/tools/body-fat` })
    } else if (segments[1] === 'sleep-cycle') {
      items.push({ name: 'Sleep Cycle', url: `${SITE_URL}/tools/sleep-cycle` })
    } else if (segments[1] === 'cognitive-shuffle') {
      items.push({ name: 'Cognitive Shuffle', url: `${SITE_URL}/tools/cognitive-shuffle` })
    } else if (segments[1] === 'breathing') {
      items.push({ name: 'Breathing Timer', url: `${SITE_URL}/tools/breathing` })
    } else if (segments[1] === 'resonance-breathing') {
      items.push({ name: 'Resonance Breathing', url: `${SITE_URL}/tools/resonance-breathing` })
    } else if (segments[1] === 'dopamine-detox') {
      items.push({ name: 'Dopamine Reset', url: `${SITE_URL}/tools/dopamine-detox` })
    } else if (segments[1] === 'biological-age') {
      items.push({ name: 'Fitness Age', url: `${SITE_URL}/tools/biological-age` })
    } else if (segments[1] === 'digital-detox') {
      items.push({ name: 'Digital Detox', url: `${SITE_URL}/tools/digital-detox` })
    } else if (segments[1] === 'burnout') {
      items.push({ name: 'Burnout Test', url: `${SITE_URL}/tools/burnout` })
    } else if (segments[1] === 'nervous-system') {
      items.push({ name: 'Nervous System State', url: `${SITE_URL}/tools/nervous-system` })
    } else if (segments[1] === 'wim-hof') {
      items.push({ name: 'Wim Hof & Cold', url: `${SITE_URL}/tools/wim-hof` })
    } else if (segments[1] === 'brain-fog') {
      items.push({ name: 'Brain Fog', url: `${SITE_URL}/tools/brain-fog` })
    } else if (segments[1] === 'resting-heart-rate') {
      items.push({ name: 'Resting Heart Rate', url: `${SITE_URL}/tools/resting-heart-rate` })
    } else if (segments[1] === 'recovery-score') {
      items.push({ name: 'Recovery Score', url: `${SITE_URL}/tools/recovery-score` })
    } else if (segments[1] === 'baseline') {
      items.push({ name: 'Apple Watch Baseline', url: `${SITE_URL}/tools/baseline` })
    } else if (segments[1] === 'camera-heart-rate') {
      items.push({ name: 'Camera Heart Rate', url: `${SITE_URL}/tools/camera-heart-rate` })
    } else if (segments[1] === 'breathing-rate') {
      items.push({ name: 'Breathing Rate', url: `${SITE_URL}/tools/breathing-rate` })
    } else if (segments[1] === 'breath-heart-biofeedback') {
      items.push({ name: 'Breath–Heart Biofeedback', url: `${SITE_URL}/tools/breath-heart-biofeedback` })
    }
    return items
  }
  if (segments[0] === 'articles') {
    items.push({ name: 'Library', url: `${SITE_URL}/articles` })
    // ONDA Library topic hub: Home › Library › <Topic>
    if (segments[1] === 'topic' && segments[2]) {
      const hub = getArticleTopicHub(segments[2])
      items.push({ name: hub?.name ?? segments[2], url: `${SITE_URL}/articles/topic/${segments[2]}` })
      return items
    }
    if (segments[1]) {
      const article = getArticleBySlug(segments[1])
      // Home › Library › <primary topic> › <Article>
      const hub = getPrimaryHubForArticle(segments[1])
      if (hub) items.push({ name: hub.name, url: `${SITE_URL}/articles/topic/${hub.slug}` })
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

/** Q&A pairs for a glossary entry, taken from its own markdown: the definition
 *  paragraph answers "What is X?", and each question-form H2 is answered by the
 *  first paragraph under it. Markdown is flattened to plain text. */
function glossaryFaq(title: string, content: string): { question: string; answer: string }[] {
  const plain = (s: string) =>
    s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim()
  const isPara = (b: string) => b && !/^(#|[-*•>|]|\d+\.)/.test(b.trim())
  const blocks = content.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean)
  const out: { question: string; answer: string }[] = []
  const firstPara = blocks.find((b) => isPara(b))
  const name = /^[A-Z][a-z]+(?: [a-z]+)*$/.test(title) ? title.toLowerCase() : title
  if (firstPara && !blocks.some((b) => /^#{2,3}\s+What (is|are)\b/i.test(b))) {
    out.push({ question: `What is ${name}?`, answer: plain(firstPara) })
  }
  blocks.forEach((b, i) => {
    const h = b.match(/^#{2,3}\s+(.+\?)\s*$/)
    if (!h) return
    const next = blocks.slice(i + 1).find((x) => isPara(x) || /^#/.test(x))
    if (next && isPara(next)) out.push({ question: plain(h[1]), answer: plain(next) })
  })
  return out.filter((q) => q.answer.split(' ').length >= 8)
}

function buildDefinedTermJsonLd(
  name: string,
  description: string,
  url: string,
  termSet?: { id: string; name: string; url: string },
  dates?: { published: string; modified: string },
): string {
  const set = termSet ?? { id: `${SITE_URL}/glossary#glossary`, name: 'ONDA Life Glossary', url: `${SITE_URL}/glossary` }
  const term = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description,
    url,
    ...(dates ? { datePublished: dates.published, dateModified: dates.modified } : {}),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': set.id,
      name: set.name,
      url: set.url,
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
    dateModified?: string
    image?: string
    imageAlt?: string
    imageCaption?: string
    keywords?: string[]
    audience?: string
    dependencies?: string
    proficiencyLevel?: string
    educationalLevel?: string
    citations?: StudyCitation[]
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
    ...(opts?.dateModified ? { dateModified: opts.dateModified } : {}),
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
    const heroImgPath = opts.image.startsWith('http') ? opts.image.replace(SITE_URL, '') : opts.image
    const heroImgDims = IMAGE_DIMENSIONS[heroImgPath]
    article.image = {
      '@type': 'ImageObject',
      url: opts.image,
      // Intrinsic dimensions + representativeOfPage — Google Images / rich
      // results best practice; helps the hero win the page's image slot.
      ...(heroImgDims ? { width: heroImgDims.width, height: heroImgDims.height } : {}),
      representativeOfPage: true,
      ...(opts.imageCaption ? { caption: opts.imageCaption } : {}),
      ...(opts.imageAlt ? { description: opts.imageAlt } : {}),
      creditText: 'ONDA Life',
      creator: { '@id': AUTHOR_ID },
      copyrightNotice: '© ONDA Life',
      // Image-license metadata closes the GSC "Image metadata structured
      // data" warning for missing `license` and `acquireLicensePage`
      // (reported 2026-05-29). Creative Commons BY-NC-SA 4.0 is the
      // public reuse license for editorial imagery; /contact is the
      // existing page where commercial-use requests are handled.
      license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      acquireLicensePage: `${SITE_URL}/contact`,
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
  // Verified primary sources (roadmap 9.1) — schema.org citation → ScholarlyArticle.
  if (opts?.citations?.length) {
    article.citation = opts.citations.map((c) => ({
      '@type': 'ScholarlyArticle',
      name: c.title,
      author: c.authors,
      datePublished: String(c.year),
      ...(c.journal ? { isPartOf: { '@type': 'Periodical', name: c.journal } } : {}),
      url: c.url,
      ...(c.doi ? { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: c.doi } } : {}),
      ...(c.doi ? { sameAs: `https://doi.org/${c.doi}` } : {}),
    }))
  }
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
    description:
      'ONDA Life is an HRV biofeedback and guided-breathing app for real-time physiological self-regulation and nervous-system training (iOS, iPad and Apple Watch).',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/onda-logo-source.png`,
      width: 1024,
      height: 1024,
      // Image-metadata fields close the GSC "missing creator/creditText/
      // copyrightNotice" warning (reported 2026-06) on the Organization logo.
      creditText: 'ONDA Life',
      creator: { '@id': `${SITE_URL}/#organization` },
      copyrightNotice: '© ONDA Life',
      license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      acquireLicensePage: `${SITE_URL}/contact`,
    },
    sameAs: ORG_SAME_AS,
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
      'HRV',
      'heart rate variability',
      'HRV biofeedback',
      'resonance breathing',
      'breathwork',
      'autonomic nervous system',
      'neuroscience',
      'biohacking',
      'glossary',
    ],
    inLanguage: 'en',
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
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
    description: 'HRV biofeedback and breathing training — guided practice with live feedback from your own heart rhythm.',
    sameAs: ORG_SAME_AS,
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
    inLanguage: ['en', 'es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt'],
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
    jobTitle: 'Founder & CEO, ONDA Life',
    description:
      'Yakiv Bilenko — architect (Kyiv National University of Construction and Architecture, KNUCA, 2006) and Gestalt therapist (MIGIS institute, 2018), founder and CEO of ONDA Life. As an architect he researches structured forms — domes, spheres, pyramids, zomes — that influence human mental, physical and psychological states; as a Gestalt and systemic-family therapist he develops programs for psychological development and self-regulation. He leads ONDA\'s product and engineering. ONDA\'s physiology and neuroscience are overseen by its scientific advisor — Yakiv\'s own expertise is architecture, psychology and Gestalt therapy, not clinical neuroscience.',
    // knowsAbout is deliberately his ACTUAL domains — architecture, Gestalt /
    // systemic therapy, psychology, and the applied breath/HRV practice he
    // builds and writes about. Neuroscience is intentionally NOT claimed here:
    // that authority belongs to the scientific advisor, not the founder.
    knowsAbout: [
      'architecture',
      'architecture and human psychological states',
      'Gestalt therapy',
      'systemic family therapy',
      'psychology',
      'breathwork',
      'heart rate variability',
      'interoception',
      'physiological self-regulation',
      'HRV biofeedback',
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Kyiv National University of Construction and Architecture (KNUCA)',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'MIGIS institute (Gestalt therapy)',
      },
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        name: 'Architect (urban planning), KNUCA, 2006',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'Gestalt & systemic-family therapist, MIGIS, 2018',
      },
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
        name: 'Founder & CEO, ONDA Life',
      },
      {
        '@type': 'Occupation',
        name: 'Architect (urban planning)',
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
  dateModified?: string,
  langPrefix = '',
): string {
  let position = 1
  const items: Record<string, unknown>[] = []
  for (const s of articleSlugs) {
    items.push({
      '@type': 'ListItem',
      position: position++,
      url: `${SITE_URL}${langPrefix}/articles/${s}`,
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
    ...(dateModified ? { dateModified } : {}),
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
        'Structured HRV biofeedback training: guided breathing with live heart-rhythm feedback, across an 8-level path for your nervous system.',
      url: SITE_URL,
    },
  }
  return JSON.stringify(aboutPage)
}

function buildSoftwareApplicationJsonLd(app: NonNullable<RouteMeta['softwareApplication']>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: app.name,
    description: app.description,
    url: app.url,
    applicationCategory: app.category,
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
  })
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
        'Level 7 is the slow level — where practice becomes permanent. The states you learned to reach in earlier levels (calm, focus, steadiness) stop being something you do and become part of who you are, through months of consistency. Protocols: I Remember, I Restore, I Synthesize.',
    },
    {
      question: 'What is the I Remember protocol?',
      answer:
        'I Remember (Part 19) is Baseline Recall: making a settled nervous system the place you return to by default. The body learns calm the way it learns any skill — through repetition — until the regulated baseline becomes the one your system reaches for on its own.',
    },
    {
      question: 'What does Level 7 build toward?',
      answer:
        'A steadier baseline you do not have to work for, lower background stress more often, and a practice that starts to run on its own without willpower. It is the long horizon — what is left after many sessions, not the result of a single one.',
    },
  ],
  8: [
    {
      question: 'What is Level 8 ATOMIC / IGNIS II in the ONDA System?',
      answer:
        'Level 8 is the edge of the map — the deep, quiet states of stillness and presence that long-term practitioners across many traditions describe. It is experiential, not measured: there is no biomarker, badge or score. ONDA provides the conditions; the experience is your own. Orientations: I Am Vibration, I Am Wholeness, I Am the Source.',
    },
    {
      question: 'Does ONDA measure or promise Level 8 states?',
      answer:
        'No. We are straight about this: Level 8 is experiential, not measured. We do not track it and we cannot promise it. Research on flow and deep meditation describes states that resemble these, but resemblance is not measurement — so we point you toward the experience and stay honest about the rest.',
    },
    {
      question: 'What do people describe at Level 8?',
      answer:
        'Profound calm and a sense of spaciousness, the mind going quiet, and a feeling of presence that is hard to put into words. Experiential, not measured — the conditions are provided, the experience is yours.',
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
    author: { '@type': 'Person', '@id': AUTHOR_ID, name: AUTHOR_NAME },
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'ONDA Life' },
    reviewBody: r.reviewBody,
    itemReviewed: {
      '@type': 'Product',
      name: r.productName,
      brand: { '@type': 'Brand', name: r.brand },
      ...(r.productType ? { category: r.productType } : {}),
      ...(r.image ? { image: r.image } : {}),
      description: r.reviewBody,
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
      // Attach the single editorial review onto the Product itself so Google's
      // Product-snippet validator sees a rating on the product (it reads the
      // itemReviewed node, not the wrapping Review). Still ONE editorial score
      // — deliberately NOT an aggregateRating, which would imply many user
      // ratings we don't have.
      review: {
        '@type': 'Review',
        author: { '@type': 'Person', '@id': AUTHOR_ID, name: AUTHOR_NAME },
        datePublished: r.datePublished,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.ratingValue,
          bestRating: 10,
          worstRating: 0,
        },
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: r.ratingValue,
      bestRating: 10,
      worstRating: 0,
    },
    // SpeakableSpecification — Google Assistant / Siri / Alexa read the H1
    // (product name + "review") and the summary paragraph as a spoken answer
    // to "what's the best <product>" voice queries. Parity with articles,
    // which already carry speakable markup (2026-05-29 audit, roadmap 6.11).
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '#review-summary'],
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
    ...(il.datePublished ? { datePublished: il.datePublished } : {}),
    ...(il.dateModified ? { dateModified: il.dateModified } : {}),
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
  const meta = getMetaForRouteBase(route)
  const o = SERP_OVERRIDES[route]
  return o ? { ...meta, ...(o.title ? { title: o.title } : {}), ...(o.description ? { description: o.description } : {}) } : meta
}

function getMetaForRouteBase(route: string): RouteMeta {
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
  if (route === '/emoton') {
    // title/description are overridden per-language by applyLocalizedMeta
    // (prerender.ts) from locales/<lang>/emoton.json; kept here as the EN base.
    return {
      title: "Emoton: Free Feelings Wheel — Name What You Feel",
      description:
        'A free interactive feelings wheel. Name what you feel right now, then take a quiet moment to be with it — no sign-up, no diagnosis, no advice.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/og-emoton.png`,
      imageAlt: 'Emoton — a feelings wheel to name what you feel',
      faq: { mainEntity: EMOTON_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
      softwareApplication: {
        name: 'Emoton — Feelings Wheel',
        description:
          'A free interactive feelings wheel: name what you feel, then be with it. No account, no diagnosis.',
        url,
        category: 'HealthApplication',
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
      // Use the first prose section as the real definition — richer than a
      // generic sentence, and answer-engine-friendly.
      const firstBody = metric.sections.find((s) => s.body && s.body.trim())?.body?.trim()
      const metaDesc = firstBody
        ? (firstBody.length > 300 ? firstBody.slice(0, 297).replace(/\s+\S*$/, '') + '…' : firstBody)
        : `${metric.title} — what this biometric means, how to interpret your score, and how to use it in daily practice.`
      return {
        title: `${metric.title} | ONDA Life Bio OS`,
        description: metaDesc,
        url,
        breadcrumbs,
        // DefinedTerm makes each metric page a citable definition ("what is X").
        // Own term set (Bio OS metrics), not the glossary — these aren't in it.
        definedTerm: {
          name: metric.title,
          description: firstBody ?? metaDesc,
          url,
          termSet: { id: `${SITE_URL}/bio#metrics`, name: 'ONDA Bio OS metrics', url: `${SITE_URL}/bio` },
        },
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
        email: 'info@onda-life.com',
      },
    }
  }
  // /research — "The Science Behind ONDA". Honest two-register page: the
  // cited evidence the app rests on today, plus a clearly-labelled research
  // frontier. EN-only. Plain WebPage schema — deliberately NOT
  // ResearchProject (would imply a funded, active programme) and NOT
  // MedicalWebPage (would imply medical claims).
  if (parseScienceRoute(route)) {
    const sm = scienceMeta(route, (l, k, s) => SCIENCE_FULL[l]?.find((p) => p.kind === k && p.slug === s))
    if (sm) return { title: sm.title, description: sm.description, url, breadcrumbs: sm.breadcrumbs, ogType: sm.ogType, jsonLd: sm.jsonLd, ...(sm.image ? { image: sm.image, imageAlt: sm.imageAlt } : {}) }
  }
  if (route === '/ai-apps') {
    return {
      title: `${AI_APPS_TITLE} | ONDA Life`,
      description: AI_APPS_DESC,
      url,
      breadcrumbs,
      ogType: 'website',
      jsonLd: aiAppsJsonLd(),
    }
  }
  if (route === '/research') {
    const researchTitle =
      'The Science Behind ONDA — HRV Biofeedback, Evidence & Research Roadmap | ONDA Life'
    const researchDesc =
      "The evidence ONDA is built on — resonance breathing and HRV biofeedback, cited in plain sight — and the research frontier we're working to validate."
    return {
      title: researchTitle,
      description: researchDesc,
      url,
      breadcrumbs,
      ogType: 'website',
      jsonLd: researchJsonLd(),
    }
  }

  // /measurements — "What ONDA actually measures". WebPage + FAQPage JSON-LD.
  // Localized to ru + es.
  if (route === '/ru/measurements' || route === '/es/measurements') {
    const lang = route.startsWith('/ru/') ? 'ru' : 'es'
    const c = MEASUREMENTS_I18N[lang]
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'website',
      jsonLd: measurementsJsonLd(lang),
    }
  }
  if (route === '/measurements') {
    return {
      title: 'What ONDA Measures — HRV, Coherence & What’s Estimated | ONDA Life',
      description:
        'Exactly what ONDA measures directly (heart rate, HRV), what it derives (coherence, resting-HRV trend) and what it estimates (stress, energy) — plus what it does not measure.',
      url,
      breadcrumbs,
      ogType: 'website',
      jsonLd: measurementsJsonLd('en'),
    }
  }
  // /ru/how-it-works, /es/how-it-works — localized method page.
  if (route === '/ru/how-it-works' || route === '/es/how-it-works') {
    const lang = route.startsWith('/ru/') ? 'ru' : 'es'
    const c = HOW_IT_WORKS_I18N[lang]
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'website',
      jsonLd: howItWorksJsonLd(lang),
    }
  }
  // /how-it-works — the biofeedback method (HRV + coherence computation). EN-only.
  if (route === '/how-it-works') {
    return {
      title: 'How ONDA Works — HRV, Coherence & the Biofeedback Loop | ONDA Life',
      description:
        'How ONDA works: from Apple Watch or iPhone-camera pulse to beat intervals, HRV (RMSSD/SDNN), a live coherence score and paced resonance breathing — explained with its limits.',
      url,
      breadcrumbs,
      ogType: 'website',
      jsonLd: howItWorksJsonLd('en'),
    }
  }
  // /product — canonical product page (Product Facts). Localized to ru + es.
  if (route === '/product') {
    return {
      title: 'ONDA Life — HRV Biofeedback & Guided Breathing App | Product',
      description:
        'ONDA Life is an HRV biofeedback and guided-breathing app for iPhone, iPad and Apple Watch: live heart-rhythm feedback, a coherence score, resonance breathing and resting-HRV trends. Free to start, no account.',
      url,
      breadcrumbs,
      ogType: 'website',
      jsonLd: productJsonLd(),
    }
  }
  if (route === '/ru/product' || route === '/es/product') {
    const c = route === '/ru/product' ? PRODUCT_I18N.ru : PRODUCT_I18N.es
    return { title: c.metaTitle, description: c.metaDescription, url, breadcrumbs, ogType: 'website', jsonLd: productJsonLd() }
  }
  // /ru/hrv-biofeedback, /es/hrv-biofeedback — localized cornerstone.
  if (route === '/ru/hrv-biofeedback' || route === '/es/hrv-biofeedback') {
    const lang = route.startsWith('/ru/') ? 'ru' : 'es'
    const c = HRV_BIOFEEDBACK_I18N[lang]
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'article',
      image: `${SITE_URL}/onda-life-hrv-consciousness-hero.png`,
      imageAlt: c.articleHeadline,
      jsonLd: hrvBiofeedbackJsonLd(lang),
    }
  }
  // /hrv-biofeedback — cornerstone bridge-entity page. EN-only.
  if (route === '/hrv-biofeedback') {
    return {
      title: 'HRV Biofeedback: How It Works & the Evidence | ONDA Life',
      description:
        'HRV biofeedback explained: what it is, how the real-time feedback loop works, what the evidence supports, how it differs from HRV tracking, and how ONDA implements it. Honest and cited.',
      url,
      breadcrumbs,
      ogType: 'article',
      image: `${SITE_URL}/onda-life-hrv-consciousness-hero.png`,
      imageAlt: 'ONDA Life — HRV biofeedback: a live heart-rhythm wave you train with your breath',
      jsonLd: hrvBiofeedbackJsonLd(),
    }
  }
  // /ru/resonance-breathing, /es/resonance-breathing — localized cornerstone.
  if (route === '/ru/resonance-breathing' || route === '/es/resonance-breathing') {
    const lang = route.startsWith('/ru/') ? 'ru' : 'es'
    const c = RESONANCE_BREATHING_I18N[lang]
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'article',
      image: `${SITE_URL}/onda-life-hrv-consciousness-hero.png`,
      imageAlt: c.articleHeadline,
      jsonLd: resonanceBreathingJsonLd(lang),
    }
  }
  // /resonance-breathing — cornerstone science page. EN-only.
  if (route === '/resonance-breathing') {
    return {
      title: 'Resonance Breathing: Slow Breathing & HRV | ONDA Life',
      description:
        'Resonance breathing explained: what it is, why ~6 breaths a minute maximises HRV, how to find your resonance frequency, the evidence, how to practise, and how ONDA guides it.',
      url,
      breadcrumbs,
      ogType: 'article',
      image: `${SITE_URL}/onda-life-hrv-consciousness-hero.png`,
      imageAlt: 'ONDA Life — resonance breathing: slow ~6-breaths-a-minute paced breathing that raises HRV',
      jsonLd: resonanceBreathingJsonLd(),
    }
  }
  // /ru/hrv-vs-coherence, /es/hrv-vs-coherence — localized cornerstone.
  if (route === '/ru/hrv-vs-coherence' || route === '/es/hrv-vs-coherence') {
    const lang = route.startsWith('/ru/') ? 'ru' : 'es'
    const c = HRV_VS_COHERENCE_I18N[lang]
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'article',
      image: `${SITE_URL}/onda-life-hrv-consciousness-hero.png`,
      imageAlt: c.articleHeadline,
      jsonLd: hrvVsCoherenceJsonLd(lang),
    }
  }
  // /hrv-vs-coherence — cornerstone explainer. EN-only.
  if (route === '/hrv-vs-coherence') {
    return {
      title: 'HRV vs Coherence: What’s the Difference? | ONDA Life',
      description:
        'HRV vs coherence explained: HRV is the raw variation between heartbeats; coherence is how smooth and rhythmic that variation is as you breathe. Which to watch, and how ONDA uses each.',
      url,
      breadcrumbs,
      ogType: 'article',
      image: `${SITE_URL}/onda-life-hrv-consciousness-hero.png`,
      imageAlt: 'ONDA Life — HRV vs coherence: the raw beat-to-beat variation versus how smooth it is as you breathe',
      jsonLd: hrvVsCoherenceJsonLd(),
    }
  }
  // /ru/apple-watch-hrv-biofeedback, /es/… — localized cornerstone.
  if (route === '/ru/apple-watch-hrv-biofeedback' || route === '/es/apple-watch-hrv-biofeedback') {
    const lang = route.startsWith('/ru/') ? 'ru' : 'es'
    const c = APPLE_WATCH_HRV_I18N[lang]
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'article',
      image: `${SITE_URL}/onda-life-hrv-consciousness-hero.png`,
      imageAlt: c.articleHeadline,
      jsonLd: appleWatchHrvJsonLd(lang),
    }
  }
  // /apple-watch-hrv-biofeedback — cornerstone device page. EN-only.
  if (route === '/apple-watch-hrv-biofeedback') {
    return {
      title: 'HRV Biofeedback on Apple Watch: How It Works | ONDA Life',
      description:
        'HRV biofeedback on Apple Watch: what the Watch measures, why it records HRV rather than giving live biofeedback on its own, how accurate it is, and how ONDA turns it into a real-time coherence loop.',
      url,
      breadcrumbs,
      ogType: 'article',
      image: `${SITE_URL}/onda-life-hrv-consciousness-hero.png`,
      imageAlt: 'ONDA Life — HRV biofeedback on Apple Watch: turning the Watch’s heart data into a live coherence loop',
      jsonLd: appleWatchHrvJsonLd(),
    }
  }
  // /ru/people/yakiv-bilenko, /es/… — localized founder page.
  if (route === '/ru/people/yakiv-bilenko' || route === '/es/people/yakiv-bilenko') {
    const lang = route.startsWith('/ru/') ? 'ru' : 'es'
    const c = PEOPLE_I18N[lang]
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'profile',
      jsonLd: founderJsonLd(lang),
    }
  }
  // /people/yakiv-bilenko — founder person/authority page. EN-only.
  if (route === '/people/yakiv-bilenko') {
    return {
      title: 'Yakiv Bilenko — Founder & CEO of ONDA Life',
      description:
        'Yakiv Bilenko, founder & CEO of ONDA Life — architect (KNUCA, 2006) and Gestalt therapist (MIGIS, 2018) who builds the product. ONDA’s physiology and neuroscience are led by its scientific advisor.',
      url,
      breadcrumbs,
      ogType: 'profile',
      jsonLd: founderJsonLd(),
    }
  }
  // /ru/faq, /es/faq — localized Q&A hub + localized FAQPage JSON-LD.
  if (route === '/ru/faq' || route === '/es/faq') {
    const c = route === '/ru/faq' ? FAQ_I18N.ru : FAQ_I18N.es
    const items = c.groups.flatMap((g) => g.items.map((it) => ({ question: it.q, answer: it.a })))
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'website',
      faq: { mainEntity: items, url },
    }
  }
  // /faq — consolidated Q&A hub + FAQPage JSON-LD. EN-only.
  if (route === '/faq') {
    return {
      title: 'ONDA Life FAQ — HRV Biofeedback, Breathing & the App | ONDA Life',
      description:
        'Straight answers about HRV biofeedback, resonance breathing, HRV science and the ONDA app: what it measures, whether it needs an Apple Watch, how it compares, and more.',
      url,
      breadcrumbs,
      ogType: 'website',
      faq: { mainEntity: ONDA_FAQ_FLAT.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  // /compare — ONDA's own comparison hub. EN-only.
  // /ru/compare, /es/compare — localized compare hub. Detail pages EN-only, so
  // ItemList entries keep EN /compare/<slug> URLs.
  if (route === '/ru/compare' || route === '/es/compare') {
    const c = route === '/ru/compare' ? COMPARE_I18N.ru : COMPARE_I18N.es
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'website',
      itemList: {
        name: c.h1,
        description: c.metaDescription,
        url,
        items: ONDA_VS.map((e) => ({ url: `${SITE_URL}/compare/${e.slug}`, name: e.title })),
      },
    }
  }
  if (route === '/compare') {
    return {
      title: 'ONDA vs Oura, WHOOP, Headspace, Calm & more — Compared | ONDA Life',
      description:
        'How ONDA Life’s HRV biofeedback compares to Oura, WHOOP, Headspace, Calm, Breathwrk and Elite HRV — objective capability tables and who each is best for.',
      url,
      breadcrumbs,
      ogType: 'website',
      itemList: {
        name: 'ONDA vs the alternatives',
        description:
          'ONDA Life’s own comparisons vs Oura, WHOOP, Headspace, Calm, Breathwrk and Elite HRV.',
        url,
        items: ONDA_VS.map((e) => ({ url: `${SITE_URL}/compare/${e.slug}`, name: e.title })),
      },
    }
  }
  // /compare/<slug> — either a pairwise ONDA-vs page or a "top X" round-up.
  if (route.startsWith('/compare/')) {
    const slug = route.slice('/compare/'.length)
    const entry = getOndaVs(slug)
    if (entry) {
      return {
        title: `${entry.title} — HRV Biofeedback Compared (2026) | ONDA Life`,
        description: entry.description,
        url,
        breadcrumbs,
        ogType: 'website',
        faq: { mainEntity: entry.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      }
    }
    const roundup = getRoundup(slug)
    if (roundup) {
      return {
        title: `${roundup.title} (2026) | ONDA Life`,
        description: roundup.description,
        url,
        breadcrumbs,
        ogType: 'website',
        faq: { mainEntity: roundup.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      }
    }
  }

  // /ru/tools, /es/tools — localized tools hub. Tool pages themselves EN-only,
  // so ItemList entries keep EN /tools/<slug> URLs.
  if (/^\/[a-z]{2}\/tools$/.test(route) && TOOLS_I18N[route.slice(1, 3) as Lang]) {
    const lang = route.slice(1, 3) as Lang
    const c = TOOLS_I18N[lang]!
    return {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      breadcrumbs,
      ogType: 'website',
      itemList: {
        name: c.h1,
        description: c.metaDescription,
        url,
        items: TOOLS.map((t) => {
          const loc = localizedToolCard(t.slug, lang)
          return { url: loc ? `${SITE_URL}/${lang}/tools/${t.slug}` : `${SITE_URL}/tools/${t.slug}`, name: loc ? loc.name : t.name }
        }),
      },
    }
  }
  if (route === '/tools') {
    return {
      title: TOOLS_EN.metaTitle,
      description: TOOLS_EN.metaDescription,
      url,
      breadcrumbs,
      ogType: 'website',
      itemList: {
        name: TOOLS_EN.h1,
        description: TOOLS_EN.metaDescription,
        url,
        items: TOOLS.map((t) => ({ url: `${SITE_URL}/tools/${t.slug}`, name: t.name })),
      },
    }
  }
  if (route === '/tools/hrv' || /^\/[a-z]{2}\/tools\/hrv$/.test(route)) {
    const lang = (route === '/tools/hrv' ? 'en' : route.slice(1, 3)) as Lang
    const c = hrvToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/hrv.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/hrv.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  // /tools/caffeine — all 12 languages (copy in src/data/caff-tool-i18n).
  if (route === '/tools/caffeine' || /^\/[a-z]{2}\/tools\/caffeine$/.test(route)) {
    const lang = (route === '/tools/caffeine' ? 'en' : route.slice(1, 3)) as Lang
    const c = caffToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/caffeine.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/caffeine.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/sleep-debt') {
    return {
      title: 'Sleep Debt Calculator — Are You Sleep Deprived? | ONDA Life',
      description:
        'Free sleep debt calculator: enter your last 7 nights to see your accumulated sleep deficit against your age-based need — plus how much is realistically repayable and how.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/sleep-debt.png`,
      faq: { mainEntity: SLEEP_DEBT_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/zone-2') {
    return {
      title: 'Zone 2 Heart Rate Calculator — Aerobic Zone | ONDA Life',
      description:
        'Free Zone 2 heart rate calculator: enter your age (and resting HR for Karvonen) to find your aerobic-base target and all 5 training zones — using the accurate Tanaka max-HR formula.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/zone-2.png`,
      faq: { mainEntity: HR_ZONE_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  // /tools/chronotype — all 12 languages (copy in src/data/chrono-tool-i18n).
  if (route === '/tools/chronotype' || /^\/[a-z]{2}\/tools\/chronotype$/.test(route)) {
    const lang = (route === '/tools/chronotype' ? 'en' : route.slice(1, 3)) as Lang
    const c = chronoToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/chronotype.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/chronotype.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/protein') {
    return {
      title: 'Protein Intake Calculator — How Much Per Day? | ONDA Life',
      description:
        'Free protein calculator: enter your bodyweight and goal (maintain, build muscle, fat loss) to get your daily protein target in grams — based on ISSN/ACSM guidelines — plus a per-meal split.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/protein.png`,
      faq: { mainEntity: PROTEIN_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/vo2max') {
    return {
      title: 'VO₂max Estimator — Free Calculator by Heart Rate | ONDA Life',
      description:
        'Free VO₂max calculator: estimate your cardiorespiratory fitness from resting and max heart rate (Uth–Sørensen formula) and compare it against age- and sex-based fitness norms.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/vo2max.png`,
      faq: { mainEntity: VO2MAX_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/tdee') {
    return {
      title: 'TDEE Calculator — Daily Calorie & Macro Needs | ONDA Life',
      description:
        'Free TDEE calculator: find your total daily energy expenditure with the Mifflin–St Jeor equation, then get a calorie target and protein/carb/fat split for your goal.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/tdee.png`,
      faq: { mainEntity: TDEE_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/water') {
    return {
      title: 'Water Intake Calculator — How Much Water a Day? | ONDA Life',
      description:
        'Free water intake calculator: estimate how much water to drink per day from your bodyweight, with adjustments for exercise, hot weather and caffeine or alcohol.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/water.png`,
      faq: { mainEntity: WATER_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  // /tools/alcohol — published in all 12 languages (copy in src/data/alc-tool-i18n).
  if (route === '/tools/alcohol' || /^\/[a-z]{2}\/tools\/alcohol$/.test(route)) {
    const lang = (route === '/tools/alcohol' ? 'en' : route.slice(1, 3)) as Lang
    const c = alcToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/alcohol.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/alcohol.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/fasting') {
    return {
      title: 'Intermittent Fasting Calculator — Eating Window | ONDA Life',
      description:
        'Free intermittent fasting calculator: pick a protocol (16:8, 18:6, 20:4, OMAD) and your first-meal time to get your exact eating and fasting windows, plus a metabolic-phase timeline.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/fasting.png`,
      faq: { mainEntity: FASTING_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/jet-lag') {
    return {
      title: 'Jet Lag Calculator — Light-Timing Planner | ONDA Life',
      description:
        'Free jet lag calculator: enter your trip to see which way your body clock must shift and exactly when to seek and avoid bright light — the strongest tool for beating jet lag.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/jet-lag.png`,
      faq: { mainEntity: JETLAG_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/one-rep-max') {
    return {
      title: 'One-Rep Max Calculator — Estimate Your 1RM | ONDA Life',
      description:
        'Free one-rep max calculator: estimate your 1RM from a hard set using the Epley and Brzycki equations, plus a training-load table for every %1RM. Best with sets of 6 reps or fewer.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/one-rep-max.png`,
      faq: { mainEntity: ONE_REP_MAX_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/body-fat') {
    return {
      title: 'Body Fat Calculator — U.S. Navy Tape Method | ONDA Life',
      description:
        'Free body fat calculator using the U.S. Navy circumference method (Hodgdon–Beckett): estimate your body-fat percentage from neck, waist (and hip) measurements with just a tape measure.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/body-fat.png`,
      faq: { mainEntity: BODY_FAT_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  // /tools/sleep-cycle — all 12 languages (copy in src/data/sleep-tool-i18n).
  if (route === '/tools/sleep-cycle' || /^\/[a-z]{2}\/tools\/sleep-cycle$/.test(route)) {
    const lang = (route === '/tools/sleep-cycle' ? 'en' : route.slice(1, 3)) as Lang
    const c = sleepToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/sleep-cycle.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/sleep-cycle.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/cognitive-shuffle') {
    return {
      title: 'Cognitive Shuffle — Random Words to Fall Asleep | ONDA Life',
      description:
        'Free cognitive shuffle tool: a stream of random neutral words to picture at bedtime (serial diverse imagining) that crowds out worry-loops and helps you fall asleep faster.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/cognitive-shuffle.png`,
      faq: { mainEntity: SHUFFLE_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  // /tools/breathing — guided breathing timer, all 12 languages (copy in src/data/breath-tool-i18n).
  if (route === '/tools/breathing' || /^\/[a-z]{2}\/tools\/breathing$/.test(route)) {
    const lang = (route === '/tools/breathing' ? 'en' : route.slice(1, 3)) as Lang
    const c = breathToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/breathing.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/breathing.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  // /tools/resonance-breathing — all 12 languages (copy in src/data/reso-tool-i18n).
  if (route === '/tools/resonance-breathing' || /^\/[a-z]{2}\/tools\/resonance-breathing$/.test(route)) {
    const lang = (route === '/tools/resonance-breathing' ? 'en' : route.slice(1, 3)) as Lang
    const c = resoToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/resonance-breathing.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/resonance-breathing.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/dopamine-detox') {
    return {
      title: 'Dopamine Detox: Build Your Reset Plan | ONDA Life',
      description:
        'Free dopamine detox planner: build a structured behavioural reset (stimulus control) — choose your window and the cheap-reward loops to cut, and get a plan to recalibrate focus.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/dopamine-detox.png`,
      faq: { mainEntity: DOPAMINE_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  // /tools/biological-age — fitness age (HUNT model), all 12 languages (copy in src/data/bioage-tool-i18n).
  if (route === '/tools/biological-age' || /^\/[a-z]{2}\/tools\/biological-age$/.test(route)) {
    const lang = (route === '/tools/biological-age' ? 'en' : route.slice(1, 3)) as Lang
    const c = bioToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/biological-age.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/biological-age.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/digital-detox') {
    return {
      title: 'Digital Detox: Build a Screen-Reset Plan | ONDA Life',
      description:
        'Free digital detox planner: pick the screen habits draining your attention and sleep and get evidence-based swaps plus a phone-setup checklist. Sustainable changes, not a purge.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/digital-detox.png`,
      faq: { mainEntity: DETOX_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/burnout') {
    return {
      title: 'Burnout Test — Free Stress-Load Self-Assessment | ONDA Life',
      description:
        'Free burnout test: 8 questions across exhaustion, cynicism and efficacy gauge your stress-load and give a recovery-focused next step. Educational self-check, not a diagnosis.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/burnout.png`,
      faq: { mainEntity: BURNOUT_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/nervous-system') {
    return {
      title: 'Nervous System Quiz — Stuck in Fight-or-Flight? | ONDA Life',
      description:
        'Free nervous system quiz: 8 questions read whether you’re in fight-or-flight, shutdown or a regulated state — with a vagal-tone protocol to shift it. Educational, not a diagnosis.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/nervous-system.png`,
      faq: { mainEntity: NS_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  // /tools/wim-hof — all 12 languages (copy in src/data/whm-tool-i18n).
  if (route === '/tools/wim-hof' || /^\/[a-z]{2}\/tools\/wim-hof$/.test(route)) {
    const lang = (route === '/tools/wim-hof' ? 'en' : route.slice(1, 3)) as Lang
    const c = whmToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/wim-hof.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/wim-hof.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/brain-fog') {
    return {
      title: "Brain Fog Quiz — Why Can't You Focus? | ONDA Life",
      description:
        'Free brain fog quiz: 8 questions pinpoint which factors — sleep, stress, overstimulation or lifestyle — are clouding your focus, each with a targeted fix. Educational, not a diagnosis.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/brain-fog.png`,
      faq: { mainEntity: FOG_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  // /tools/resting-heart-rate — published in all 12 languages (copy in
  // src/data/rhr-tool-i18n). WebApplication + FAQPage JSON-LD per language.
  if (route === '/tools/resting-heart-rate' || /^\/[a-z]{2}\/tools\/resting-heart-rate$/.test(route)) {
    const lang = (route === '/tools/resting-heart-rate' ? 'en' : route.slice(1, 3)) as Lang
    const c = rhrToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/resting-heart-rate.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/resting-heart-rate.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/recovery-score') {
    return {
      title: 'Recovery Score Explained — Whoop, Oura, Garmin | ONDA Life',
      description:
        'What your Whoop, Oura or Garmin recovery score really measures (HRV, resting HR, sleep) — plus a quick readiness estimate and what to actually do today. Educational, not medical.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/recovery-score.png`,
      faq: { mainEntity: RECOVERY_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/tools/baseline' || /^\/[a-z]{2}\/tools\/baseline$/.test(route)) {
    const blLang = (route === '/tools/baseline' ? 'en' : route.slice(1, 3)) as Lang
    const BASELINE_SEO = baselineCopy(blLang).seo
    const steps = (BASELINE_SEO.sections as Array<{ steps?: string[] }>).find((x) => x.steps)?.steps ?? []
    return {
      title: BASELINE_SEO.metaTitle,
      description: BASELINE_SEO.metaDescription,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/baseline.png`,
      faq: { url, mainEntity: BASELINE_SEO.faq.map((f) => ({ question: f.q, answer: f.a })) },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Apple Watch Baseline',
          description: BASELINE_SEO.metaDescription,
          url,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'iOS (iPhone with Apple Health and Shortcuts)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: BASELINE_SEO.sections.find((x) => (x as { steps?: string[] }).steps)?.h2 ?? 'How to see two weeks of your Apple Watch heart data',
          inLanguage: blLang,
          totalTime: 'PT1M',
          step: steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
        },
      ],
    }
  }
  // /tools/camera-heart-rate — published in all 12 languages (copy in src/data/cam-tool-i18n).
  if (route === '/tools/camera-heart-rate' || /^\/[a-z]{2}\/tools\/camera-heart-rate$/.test(route)) {
    const lang = (route === '/tools/camera-heart-rate' ? 'en' : route.slice(1, 3)) as Lang
    const c = camToolCopy(lang)
    return {
      title: c.meta.title,
      description: c.meta.description,
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/camera-heart-rate.png`,
      faq: { mainEntity: c.faq.map((f) => ({ question: f.q, answer: f.a })), url },
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: c.meta.appName,
          description: c.meta.appDescription,
          url,
          inLanguage: lang,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any (web browser with camera)',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          image: `${SITE_URL}/images/tools/camera-heart-rate.png`,
          publisher: { '@type': 'Organization', name: 'ONDA Life', url: SITE_URL },
        },
      ],
    }
  }
  if (route === '/tools/breathing-rate') {
    return {
      title: 'Breathing Rate Monitor — Measure It With Your Mic | ONDA Life',
      description:
        'Measure your breathing rate with your phone mic and slow toward the ~6 breaths/min calm zone. Live breath biofeedback, processed on-device — rough estimate, not medical.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/breathing-rate.png`,
      faq: { mainEntity: MIC_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
    }
  }
  if (route === '/embed/hrv') {
    return {
      title: 'HRV Calculator by Age — ONDA Life',
      description: 'Embeddable HRV interpreter: enter age and resting RMSSD to see where heart rate variability lands against population norms. By ONDA Life.',
      url,
      breadcrumbs,
      ogType: 'website',
      noindex: true,
    }
  }
  if (route === '/tools/breath-heart-biofeedback') {
    return {
      title: 'Breath–Heart Biofeedback — Camera + Pacer | ONDA Life',
      description:
        'Breathe with the pacer while your phone camera reads your pulse — and watch your heart rate rise on the inhale and fall on the exhale (RSA). A live, on-device biofeedback demo.',
      url,
      breadcrumbs,
      ogType: 'website',
      image: `${SITE_URL}/images/tools/breath-heart-biofeedback.png`,
      faq: { mainEntity: BH_FAQ.map((f) => ({ question: f.q, answer: f.a })), url },
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
        // Real git dates (article-dates.mjs). The old hard-coded '2025-02-22'
        // stamped every article with one fake date and no dateModified.
        datePublished: ARTICLE_DATES[slug]?.published ?? '2025-02-22',
        dateModified: ARTICLE_DATES[slug]?.modified,
      }
      const hackQuotes = extractHackQuotes(article.content)
      const techArticleExtras =
        slug === 'cacao-stem-cells'
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
                          'Oxytocin and Trust',
                          'What Does Oxytocin Do',
                          'Testosterone and Aggression',
                          'Testosterone and Dominance',
                          'How to Raise Testosterone Naturally',
                          'Oxytocin Nasal Spray',
                        ],
                        audience: 'General Public, People Interested in Hormones and Relationships',
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
                              'What Does Serotonin Do',
                              'Serotonin Gut Brain',
                              'How to Increase Serotonin Naturally',
                              'Low Serotonin Depression',
                              'Sunlight and Serotonin',
                              'Tryptophan and 5-HTP',
                              'Serotonin Syndrome',
                            ],
                            audience: 'General Public, People Interested in Mood and Mental Health',
                            proficiencyLevel: 'Intermediate',
                          }
                        : slug === 'energy-sensor-leptin'
                          ? {
                              keywords: [
                                'Leptin',
                                'Leptin Resistance',
                                'Sleep and Appetite',
                                'Hunger Hormones',
                                'Weight Loss Plateau',
                              ],
                              audience: 'Adults managing appetite, weight and sleep',
                              proficiencyLevel: 'Intermediate',
                            }
                          : slug === 'neural-optimizer-estrogen'
                            ? {
                                keywords: [
                                  'Estrogen and the Brain',
                                  'Perimenopause Brain Fog',
                                  'Menopause Memory Problems',
                                  'Hormone Therapy and Cognition',
                                  'Hot Flush Treatment',
                                  'Fezolinetant',
                                  'Non-Hormonal Menopause Treatment',
                                ],
                                audience: 'Women in Perimenopause and Menopause, General Public',
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
                          : slug === 'molecular-psychology-hormonal-firmware'
                            ? {
                                keywords: [
                                  'Do Hormones Control Mood',
                                  'Molecular Psychology',
                                  'Hormones and Mood',
                                  'Chemical Imbalance Depression',
                                  'Serotonin Theory of Depression',
                                  'Dual-Hormone Hypothesis',
                                  'PMDD and Perimenopause Mood',
                                  'What Improves Mood',
                                ],
                                audience: 'Curious readers, People with mood changes, Wearable users',
                                proficiencyLevel: 'Beginner',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'nervous-system-ping-latency'
                            ? {
                                keywords: [
                                  'HRV and Reaction Time',
                                  'Heart Rate Variability Cognitive Performance',
                                  'HRV and Focus',
                                  'Neurovisceral Integration',
                                  'HRV Biofeedback Attention',
                                  'Vagal Tone Self-Control',
                                  'Resonance Breathing',
                                  'What HRV Measures',
                                ],
                                audience: 'Curious readers, Wearable users, Athletes, Knowledge Workers',
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
                                  'glymphatic system',
                                  'does sleep clean the brain',
                                  'sleep and brain waste clearance',
                                  'cerebrospinal fluid sleep',
                                  'amyloid beta sleep deprivation',
                                  'sleep position glymphatic',
                                  'sleep and Alzheimer risk',
                                ],
                                audience: 'Adults interested in sleep and brain health',
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
                          : slug === 'adrenal-governor-thermal-runaway'
                            ? {
                                keywords: [
                                  'Adrenal Fatigue',
                                  'Is Adrenal Fatigue Real',
                                  'Adrenal Insufficiency',
                                  'Cushing Syndrome',
                                  'Cortisol Rhythm',
                                  'Fatigue Red Flags',
                                  'ONDA Protocol',
                                ],
                                audience: 'Adults with persistent fatigue, Burnout Recovery',
                                proficiencyLevel: 'Beginner',
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
                          : slug === 'neural-bridge-alpha-flow-gateway'
                            ? {
                                keywords: [
                                  'Alpha Brain Waves',
                                  'What Are Alpha Waves',
                                  'Alpha Waves Creativity',
                                  'Alpha Waves Flow State',
                                  'Alpha Waves and Stress',
                                  'Binaural Beats Alpha',
                                  'Alpha Neurofeedback',
                                  'EEG Alpha Rhythm',
                                ],
                                audience: 'Curious readers, Meditators, Knowledge Workers, Creatives',
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
                          : slug === 'chm-continuous-hormone-monitoring'
                            ? {
                                keywords: [
                                  'continuous cortisol monitoring',
                                  'cortisol wearable',
                                  'sweat cortisol sensor',
                                  'wearable hormone monitor',
                                  'cortisol awakening response',
                                  'late-night salivary cortisol',
                                  'diurnal cortisol rhythm',
                                  'HRV and stress',
                                ],
                                audience: 'Adults interested in stress, hormones and wearables',
                                proficiencyLevel: 'Beginner',
                                educationalLevel: 'Intermediate',
                              }
                          : slug === 'co2-tolerance-expanding-oxygen-limit'
                            ? {
                                keywords: [
                                  'CO2 tolerance',
                                  'BOLT test',
                                  'BOLT score',
                                  'breath hold test',
                                  'urge to breathe CO2',
                                  'over-breathing hyperventilation',
                                  'Bohr effect',
                                  'shallow water blackout',
                                  'Buteyko breathing',
                                ],
                                audience: 'Adults interested in breathing, anxiety and fitness',
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
      const faqItems = FAQ_SCHEMA[slug] ?? ARTICLE_FAQ_SCHEMA_ONLY[slug]
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
      // Short terms (acronyms like "ATP") make weak 20-char titles — ask the question instead.
      const title =
        seo?.title ??
        (term.title.length <= 8
          ? `What Is ${term.title}? Definition & Role | ONDA Life`
          : `${term.title} | ONDA Life Glossary`)
      const description = seo?.description ?? term.shortDescription
      return {
        title,
        description,
        url,
        breadcrumbs,
        definedTerm: { name: term.title, description, url },
        // FAQPage from the entry's own text (science terms only — ONDA
        // metaphors must not be lifted as facts): "What is X?" → the
        // definition paragraph, plus every question-form H2 → its first paragraph.
        ...(glossaryLayer(slug) === 'science' ? (() => {
          const faq = glossaryFaq(term.title, term.content)
          return faq.length >= 2 ? { faq: { mainEntity: faq, url } } : {}
        })() : {}),
      }
    }
  }

  // /articles — knowledge-base index. Emit CollectionPage + ItemList over the
  // articles so the hub is a structured listing, not just breadcrumbs. (EN;
  // localized /<lang>/articles get their meta via applyLocalizedMeta.)
  // /articles — ONDA Library: CollectionPage + ItemList over the 10 topic hubs.
  if (route === '/articles') {
    return {
      title: 'ONDA Library — Breathing, HRV & Meditation Guides | ONDA Life',
      description:
        'Science-based guides on breathing, HRV, meditation and the nervous system, organized into ten topics. Pick a topic to start.',
      url,
      breadcrumbs,
      itemList: {
        name: 'ONDA Library',
        description: 'Science-based guides on breathing, HRV, meditation and the nervous system, by topic.',
        url,
        items: ARTICLE_TOPIC_HUBS.map((h) => ({ url: `${SITE_URL}/articles/topic/${h.slug}`, name: h.name })),
      },
    }
  }

  // /<lang>/articles — localized ONDA Library: ItemList over the hubs that exist in that language.
  const libIdxMatch = route.match(/^\/([a-z]{2})\/articles$/)
  if (libIdxMatch && (SUPPORTED_LANGS as readonly string[]).includes(libIdxMatch[1])) {
    const lang = libIdxMatch[1] as Lang
    const lc = libraryCopy(lang)
    const hubs = ARTICLE_TOPIC_HUBS.filter((h) => hubAvailable(h.slug, lang))
    return {
      title: lc.ui.metaTitle,
      description: lc.ui.metaDescription,
      url,
      breadcrumbs: [
        { name: lc.ui.home, url: `${SITE_URL}/${lang}` },
        { name: lc.ui.library, url },
      ],
      itemList: {
        name: lc.ui.h1,
        description: lc.ui.subtitle,
        url,
        items: hubs.map((h) => ({ url: `${SITE_URL}/${lang}/articles/topic/${h.slug}`, name: lc.hubs[h.slug]?.name ?? h.name })),
      },
    }
  }

  // /<lang>/articles/topic/:topic — localized ONDA Library hub (only translated articles).
  const libLocTopicMatch = route.match(/^\/([a-z]{2})\/articles\/topic\/([^/]+)$/)
  if (libLocTopicMatch) {
    const lang = libLocTopicMatch[1] as Lang
    const hub = getArticleTopicHub(libLocTopicMatch[2])
    if (hub && hubAvailable(hub.slug as ArticleTopicSlug, lang)) {
      const topic = hub.slug as ArticleTopicSlug
      const lc = libraryCopy(lang)
      const hc = lc.hubs[hub.slug]
      const name = hc?.name ?? hub.name
      const longTitle = fillLib(lc.ui.hubMetaTitle, { topic: name })
      const hubFaq = hubFaqFor(topic, lang)
      return {
        ...(hubFaq ? { faq: { url, mainEntity: hubFaq.items.map((f) => ({ question: f.q, answer: f.a })) } } : {}),
        title: longTitle.length <= 60 ? longTitle : `${name} | ${lc.ui.hubTitleSuffix}`,
        description: hubMetaDescription(hc?.intro ?? hub.intro, hc?.tile ?? hub.tile),
        ...(hub.image ? { image: `${SITE_URL}${hub.image}` } : {}),
        url,
        breadcrumbs: [
          { name: lc.ui.home, url: `${SITE_URL}/${lang}` },
          { name: lc.ui.library, url: `${SITE_URL}/${lang}/articles` },
          { name, url },
        ],
        topicHub: {
          name: `${name} — ${lc.ui.hubTitleSuffix}`,
          description: hc?.intro ?? hub.intro,
          url,
          articleSlugs: localizedHubItemSlugs(topic, lang),
          glossarySlugs: [],
          dateModified: localizedHubLastModified(topic, lang) ?? undefined,
          langPrefix: `/${lang}`,
        },
      }
    }
  }

  // /articles/topic/:topic — ONDA Library topic hub: CollectionPage + ItemList
  // (Start here first, then the list in rendered order), dateModified = newest article.
  const libTopicMatch = route.match(/^\/articles\/topic\/([^/]+)$/)
  if (libTopicMatch) {
    const hub = getArticleTopicHub(libTopicMatch[1])
    if (hub) {
      const topic = hub.slug as ArticleTopicSlug
      // Keep under the ~60-char title limit (long names drop the "Guides & Research" tail
      // instead of being cut mid-phrase).
      const longTitle = `${hub.name} — Guides & Research | ONDA Library`
      const hubFaq = TOPIC_HUB_FAQ[topic]
      return {
        ...(hubFaq ? { faq: { url, mainEntity: hubFaq.map((f) => ({ question: f.q, answer: f.a })) } } : {}),
        title: longTitle.length <= 60 ? longTitle : `${hub.name} | ONDA Library`,
        description: hubMetaDescription(hub.intro, hub.tile),
        ...(hub.image ? { image: `${SITE_URL}${hub.image}` } : {}),
        url,
        breadcrumbs,
        topicHub: {
          name: `${hub.name} — ONDA Library`,
          description: hub.intro,
          url,
          articleSlugs: hubItemSlugs(topic),
          glossarySlugs: [],
          dateModified: hubLastModified(topic) ?? undefined,
        },
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
      // CreativeWork (not Article): the Parts are the ONDA Path — an experiential
      // practice framework, not evidence-based science. Honest by type choice.
      return {
        title,
        description,
        url,
        breadcrumbs,
        creativeWork: {
          name: `${part.title} ${part.titleHighlight}`.trim(),
          description,
          url,
          about: ['ONDA Path', 'nervous-system self-regulation practice', 'experiential framework'],
        },
      }
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
            name: 'Where Practice Becomes Permanent',
            description:
              'Level 7 — DNA / AER II: the slow level. Months of consistency turning calm, focus and steadiness into a durable baseline — where states become traits. ONDA Life.',
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
          datePublished: h2h.datePublished,
          dateModified: h2h.dateModified,
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
        // Branded ranked-round-up card as og:image (roadmap 6.5).
        image: `${SITE_URL}/images/reviews/${comparison.slug}.png`,
        itemList: { name: comparison.title, description: comparison.description, url, items, datePublished: comparison.datePublished, dateModified: comparison.dateModified },
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
      // Category pages target "<thing> reviews"; the round-up (/reviews/compare/best-…)
      // owns "best <thing>". Both used to share one "Best … (2026)" title and
      // competed for the same query (GSC 2026-09: category pos 40-45, round-up ~10).
      const nounByCat: Record<typeof category, string> = {
        'hrv-wearable': 'HRV Tracker',
        'meditation-app': 'Meditation App',
        'sleep-app': 'Sleep App',
        'vagus-stim': 'Vagus Nerve Stimulator',
        cgm: 'CGM',
        'eeg-headset': 'EEG Headset',
        'red-light': 'Red Light Panel',
        'cold-plunge': 'Cold Plunge',
        sauna: 'Sauna',
        'sleep-climate': 'Sleep Cooling System',
        pemf: 'PEMF Device',
        'breathwork-app': 'Breathwork App',
        'red-light-mask': 'Red Light Mask',
        'breathing-aid': 'Mouth Tape',
        'massage-gun': 'Massage Gun',
        'air-purifier': 'Air Purifier',
      } as Record<typeof category, string>
      const noun = nounByCat[category] ?? label
      const titleByCat = { [category]: `${noun} Reviews: ${catReviews.length} Scored (2026) | ONDA Life` } as Record<typeof category, string>
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
        'air-purifier':
          'Independent ONDA reviews of air purifiers — IQAir, Molekule, Dyson, Coway Airmega, Blueair, Levoit, Winix, Honeywell and more — scored on filtration, CADR, noise and value.',
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
      // Default to the generated branded score card (roadmap 6.5/6.6) when a
      // review has no explicit photo. A review that later gets a real photo
      // sets `image:` in its data file, which overrides the card here.
      const absImage = `${SITE_URL}${review.image ?? `/images/reviews/${review.slug}.png`}`
      return {
        // Year in the title is a freshness/CTR signal on review SERPs (the category
        // pages already carry "(2026)"; individual reviews did not — they sit on page 1
        // for many queries but bled clicks, GSC near_top 2026-09). The independent
        // "/10" score stays: it is the on-brand differentiator. Title budget is clamped
        // downstream (clampTitleToIdeal), so a long product name degrades gracefully.
        title: `${review.name} Review (${REVIEW_TITLE_YEAR}) — Scored ${review.overallScore.toFixed(1)}/10 | ONDA Life`,
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
        faq: review.faq?.length
          ? { mainEntity: review.faq.map((f) => ({ question: f.q, answer: f.a })), url }
          : undefined,
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
  // Shape to the ideal SERP length (brand-aware, no ellipsis), then run the
  // hard-ceiling guard as a backstop — clamped titles are already <= TITLE_IDEAL
  // so truncateForBudget is a no-op for them.
  const trimmedTitle = truncateForBudget(clampTitleToIdeal(meta.title), TITLE_MAX)
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

  // Per-item git dates (article-dates.mjs): glossary terms and tools, any language.
  const basePath = (() => {
    try {
      const p = new URL(meta.url).pathname.replace(/\/$/, '')
      const seg = p.split('/')[1]
      return (SUPPORTED_LANGS as readonly string[]).includes(seg) ? p.slice(seg.length + 1) : p
    } catch {
      return ''
    }
  })()
  const glossaryDates = basePath.startsWith('/glossary/') ? ARTICLE_DATES[`glossary:${basePath.slice(10)}`] : undefined
  const toolDates = basePath.startsWith('/tools/') ? ARTICLE_DATES[`tool:${basePath}`] : undefined

  // JSON-LD: DefinedTerm (glossary pages only)
  if (meta.definedTerm) {
    const definedTermScript = `<script type="application/ld+json">${buildDefinedTermJsonLd(meta.definedTerm.name, meta.definedTerm.description, meta.definedTerm.url, meta.definedTerm.termSet, glossaryDates)}</script>`
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
      meta.topicHub.dateModified,
      meta.topicHub.langPrefix,
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
      meta.techArticle.dateModified ||
      meta.techArticle.image ||
      meta.techArticle.keywords ||
      meta.techArticle.audience ||
      meta.techArticle.dependencies ||
      meta.techArticle.proficiencyLevel ||
      meta.techArticle.educationalLevel
        ? {
            dateModified: meta.techArticle.dateModified,
            image: meta.techArticle.image,
            imageAlt: meta.techArticle.imageAlt,
            imageCaption: meta.techArticle.imageCaption,
            keywords: meta.techArticle.keywords,
            audience: meta.techArticle.audience,
            dependencies: meta.techArticle.dependencies,
            proficiencyLevel: meta.techArticle.proficiencyLevel,
            educationalLevel: meta.techArticle.educationalLevel,
            citations: ARTICLE_CITATIONS[meta.techArticle.url.split('/articles/')[1] ?? ''],
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

  if (meta.softwareApplication) {
    const appScript = `<script type="application/ld+json">${buildSoftwareApplicationJsonLd(meta.softwareApplication)}</script>`
    out = out.replace('</head>', `  ${appScript}\n</head>`)
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

  // JSON-LD: generic extra nodes (e.g. cornerstone Article + FAQPage,
  // /research ScholarlyArticles, /people Person/ProfilePage). These pages
  // build their JSON-LD in a useEffect, which prerender's renderToString
  // never runs — so the static HTML would otherwise carry only breadcrumbs.
  // Emitting them here makes the structured data visible to non-JS crawlers
  // (GPTBot, PerplexityBot, Bing) that never hydrate the page.
  // Every /tools/<x> page is a free web app: tools whose meta carries no
  // WebApplication node get a generic one from the page title/description.
  const isToolPage = /^\/tools\/[^/]+$/.test(basePath)
  const toolNodes = [...(meta.jsonLd ?? [])]
  if (isToolPage && !meta.softwareApplication && !toolNodes.some((n) => n['@type'] === 'WebApplication')) {
    const seg = new URL(meta.url).pathname.split('/')[1]
    toolNodes.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: meta.title.replace(/\s*[|—–-]\s*ONDA Life.*$/, ''),
      description: meta.description,
      url: meta.url,
      inLanguage: (SUPPORTED_LANGS as readonly string[]).includes(seg) ? seg : 'en',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })
  }
  if (toolNodes.length > 0) {
    for (const raw of toolNodes) {
      const node =
        isToolPage && raw['@type'] === 'WebApplication'
          ? {
              ...raw,
              ...(toolDates && !raw.dateModified ? { datePublished: toolDates.published, dateModified: toolDates.modified } : {}),
              ...(raw.author ? {} : { author: { '@type': 'Person', '@id': AUTHOR_ID, name: AUTHOR_NAME, url: AUTHOR_URL } }),
            }
          : raw
      const s = `<script type="application/ld+json">${JSON.stringify(node)}</script>`
      out = out.replace('</head>', `  ${s}\n</head>`)
    }
  }

  // JSON-LD: canonical Person on review + round-up pages (roadmap 6.8).
  // Review and CollectionPage schema reference the author by @id, but the
  // Person entity itself was only emitted on homepage + /about — so on a
  // review page Google saw a dangling @id with no resolvable node. These
  // are YMYL (health) pages where author E-E-A-T is exactly what Google
  // weighs, so we emit the FULL canonical Person (credentials + knowsAbout),
  // not a sparse stub. Same @id as homepage → Google de-dupes to one node,
  // no conflict. Fires for either a product review or a round-up, never the
  // homepage/article paths (those emit Person via their own branches).
  if (meta.review || meta.itemList) {
    const personScript = `<script type="application/ld+json">${buildPersonJsonLd()}</script>`
    out = out.replace('</head>', `  ${personScript}\n</head>`)
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
    // The app entity on the brand page too (same @id as /product), so a
    // "onda life" search resolves to the app, not just the website.
    const appScript = `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/product#app`,
      name: 'ONDA Life',
      alternateName: 'ONDA',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'iOS, watchOS',
      description:
        'HRV biofeedback and guided-breathing app: breathing practice with live feedback from your own heart rhythm, across an 8-level path for your nervous system.',
      url: `${SITE_URL}/product`,
      downloadUrl: 'https://apps.apple.com/app/id6755912529',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${SITE_URL}#organization` },
    })}</script>`
    out = out.replace('</head>', `  ${orgScript}\n  ${siteScript}\n  ${appScript}\n  ${datasetScript}\n</head>`)
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
    } else {
      // index.html ships a generic og:image:alt, so "add if missing" never
      // fired and every article kept the template alt (task 15). Overwrite.
      out = out.replace(/(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/i, `$1${escapedImageAlt}$2`)
      if (/(?:property|name)="twitter:image:alt"/.test(out)) {
        out = out.replace(/(<meta\s+(?:property|name)="twitter:image:alt"\s+content=")[^"]*(")/i, `$1${escapedImageAlt}$2`)
      } else {
        out = out.replace(/(<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>)/i, `$1\n  <meta property="twitter:image:alt" content="${escapedImageAlt}">`)
      }
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

  // Freshness + authorship for pages whose JSON-LD carries no date (about,
  // faq, product, /bio/*, /level/*…): a WebPage node with git dates of the
  // page component and its data files (article-dates.mjs `page:<route>`).
  if (!/"dateModified"/.test(out) && !meta.noindex) {
    const pageDates =
      ARTICLE_DATES[`page:${basePath || '/'}`] ??
      Object.entries(ARTICLE_DATES).find(([k]) =>
        k.startsWith('page:') && k.includes(':', 5) &&
        new RegExp('^' + k.slice(5).replace(/:[^/]+/g, '[^/]+') + '$').test(basePath),
      )?.[1]
    if (pageDates) {
      // No name/inLanguage: localized passes rewrite titles after this runs.
      const node = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: meta.url,
        datePublished: pageDates.published,
        dateModified: pageDates.modified,
        author: { '@type': 'Person', '@id': AUTHOR_ID, name: AUTHOR_NAME, url: AUTHOR_URL },
      }
      out = out.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(node)}</script>\n</head>`)
    }
  }

  return out
}
