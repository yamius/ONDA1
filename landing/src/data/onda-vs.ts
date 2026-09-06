/**
 * ONDA vs alternatives — ONDA Life's OWN capability comparisons against the
 * apps and wearables people cross-shop. Renders at /compare/onda-vs-<slug>.
 *
 * This is NOT part of the independent-review system (/reviews/*). These pages
 * are ONDA comparing itself to others, and every page says so plainly. The
 * discipline that keeps them citable:
 *   - Objective capability rows, the SAME set for every competitor, with
 *     ONDA's own column defined once (ONDA_CAPS) so it can't drift.
 *   - Competitor values are factual (verified 2026), not "we win everything".
 *     Where a competitor genuinely matches or beats ONDA, the row says so.
 *   - Every verdict is "ONDA if you want X, <competitor> if you want Y" —
 *     never "ONDA is better".
 *   - Where an independent ONDA review of the competitor exists, we link it,
 *     keeping the review firewall visible.
 */

export type Cap = 'yes' | 'limited' | 'no'

/** The fixed capability axes, identical across every comparison. */
export const CAPABILITIES = [
  'Real-time HRV biofeedback (live feedback as you breathe)',
  'Live coherence score',
  'Guided / paced breathing',
  'Works with no wearable or chest strap (iPhone camera)',
  'Apple Watch support',
  'Resting-HRV trend over time',
  'Sleep / overnight readiness tracking',
  'Large meditation / sleep content library',
  'Structured, progressive program',
] as const

export type CapabilityAxis = (typeof CAPABILITIES)[number]

/** ONDA Life's own column — defined once, reused on every page. */
export const ONDA_CAPS: Record<CapabilityAxis, Cap> = {
  'Real-time HRV biofeedback (live feedback as you breathe)': 'yes',
  'Live coherence score': 'yes',
  'Guided / paced breathing': 'yes',
  'Works with no wearable or chest strap (iPhone camera)': 'yes',
  'Apple Watch support': 'yes',
  'Resting-HRV trend over time': 'yes',
  'Sleep / overnight readiness tracking': 'no',
  'Large meditation / sleep content library': 'limited',
  'Structured, progressive program': 'yes',
}

export interface OndaVsEntry {
  slug: string
  competitorName: string
  /** Independent ONDA review slug, if one exists (/reviews/<slug>). */
  reviewSlug?: string
  competitorUrl: string
  category: string
  title: string
  description: string
  intro: string
  /** Competitor's column on the same axes as ONDA. */
  them: Record<CapabilityAxis, Cap>
  /** Optional per-axis clarification shown under the row. */
  notes?: Partial<Record<CapabilityAxis, string>>
  bestForOnda: string
  bestForThem: string
  verdict: string
  faq: { q: string; a: string }[]
}

export const ONDA_VS: OndaVsEntry[] = [
  {
    slug: 'onda-vs-oura',
    competitorName: 'Oura Ring',
    reviewSlug: 'oura-ring-4',
    competitorUrl: 'https://ouraring.com/',
    category: 'Smart ring / sleep & readiness',
    title: 'ONDA vs Oura Ring',
    description:
      'ONDA vs Oura Ring — active HRV biofeedback training vs passive sleep-and-readiness tracking. An objective capability comparison from ONDA Life.',
    intro:
      'Oura is a smart ring that passively tracks your sleep, readiness and overnight HRV. ONDA is an app that actively trains your nervous system with real-time HRV biofeedback while you breathe. They answer different questions — "how did I recover?" vs "can I shift my state right now?" — and many people use both.',
    them: {
      'Real-time HRV biofeedback (live feedback as you breathe)': 'no',
      'Live coherence score': 'no',
      'Guided / paced breathing': 'limited',
      'Works with no wearable or chest strap (iPhone camera)': 'no',
      'Apple Watch support': 'no',
      'Resting-HRV trend over time': 'yes',
      'Sleep / overnight readiness tracking': 'yes',
      'Large meditation / sleep content library': 'no',
      'Structured, progressive program': 'no',
    },
    notes: {
      'Guided / paced breathing': 'Oura has some guided breathing sessions, but no live HRV feedback during them.',
      'Works with no wearable or chest strap (iPhone camera)': 'Oura requires buying and wearing the ring.',
      'Resting-HRV trend over time': 'Overnight HRV is Oura’s strength — arguably more continuous than a spot reading.',
    },
    bestForOnda:
      'Choose ONDA if you want to actively train your nervous system — real-time HRV biofeedback and paced breathing you can feel working — without buying a wearable.',
    bestForThem:
      'Choose Oura if you want passive, accurate overnight tracking of sleep, readiness and HRV in a ring you forget you’re wearing.',
    verdict:
      'Different jobs. Oura measures your recovery overnight; ONDA trains your state in the moment. If you want a readiness score, Oura. If you want active HRV biofeedback, ONDA. Together they cover both — track with Oura, train with ONDA.',
    faq: [
      {
        q: 'Is ONDA a replacement for an Oura Ring?',
        a: 'Not exactly — they do different things. Oura passively tracks sleep, readiness and overnight HRV; ONDA is an active HRV biofeedback trainer you use during breathing practice. Many people use both: Oura for measurement, ONDA for training.',
      },
      {
        q: 'Does ONDA need a ring or wearable like Oura?',
        a: 'No. ONDA works with the iPhone camera (pulse/PPG) or an Apple Watch you already own — there is no dedicated wearable to buy.',
      },
    ],
  },
  {
    slug: 'onda-vs-whoop',
    competitorName: 'WHOOP',
    reviewSlug: 'whoop-5-0',
    competitorUrl: 'https://www.whoop.com/',
    category: 'Recovery band / strain & HRV',
    title: 'ONDA vs WHOOP',
    description:
      'ONDA vs WHOOP — active HRV biofeedback training vs passive recovery-and-strain tracking. An objective capability comparison from ONDA Life.',
    intro:
      'WHOOP is a screenless band that tracks recovery, strain and HRV for athletes, with a daily readiness loop. ONDA is an app that actively trains your nervous system with real-time HRV biofeedback while you breathe. WHOOP tells you how recovered you are; ONDA gives you something to actually do about it.',
    them: {
      'Real-time HRV biofeedback (live feedback as you breathe)': 'no',
      'Live coherence score': 'no',
      'Guided / paced breathing': 'limited',
      'Works with no wearable or chest strap (iPhone camera)': 'no',
      'Apple Watch support': 'no',
      'Resting-HRV trend over time': 'yes',
      'Sleep / overnight readiness tracking': 'yes',
      'Large meditation / sleep content library': 'no',
      'Structured, progressive program': 'no',
    },
    notes: {
      'Guided / paced breathing': 'WHOOP offers guided breathwork, but not a live HRV-feedback loop while you breathe.',
      'Works with no wearable or chest strap (iPhone camera)': 'WHOOP requires its band and a membership.',
    },
    bestForOnda:
      'Choose ONDA if you want to actively train recovery — real-time HRV biofeedback and paced breathing — without a band or subscription hardware.',
    bestForThem:
      'Choose WHOOP if you train hard and want continuous recovery, strain and HRV monitoring with a daily coaching loop.',
    verdict:
      'WHOOP measures the load and the recovery; ONDA trains the recovery response. Athletes often pair them: WHOOP to see strain and readiness, ONDA to actively down-regulate between sessions.',
    faq: [
      {
        q: 'ONDA or WHOOP for HRV?',
        a: 'WHOOP continuously measures HRV to score recovery and strain; ONDA uses HRV as live biofeedback you train against while breathing. For passive recovery data, WHOOP; for active HRV training, ONDA.',
      },
      {
        q: 'Does ONDA require a subscription band like WHOOP?',
        a: 'No. ONDA has free core practices and works with your iPhone camera or Apple Watch — there is no mandatory hardware or membership to start.',
      },
    ],
  },
  {
    slug: 'onda-vs-headspace',
    competitorName: 'Headspace',
    reviewSlug: 'headspace',
    competitorUrl: 'https://www.headspace.com/',
    category: 'Meditation / mindfulness library',
    title: 'ONDA vs Headspace',
    description:
      'ONDA vs Headspace — real-time HRV biofeedback vs a guided meditation library. An objective capability comparison from ONDA Life.',
    intro:
      'Headspace is one of the biggest guided-meditation and mindfulness libraries, with courses on stress, focus and sleep. ONDA is narrower and more physiological: it trains your nervous system with real-time HRV biofeedback, so you can see your body respond as you breathe. One is a content library; the other is a feedback instrument.',
    them: {
      'Real-time HRV biofeedback (live feedback as you breathe)': 'no',
      'Live coherence score': 'no',
      'Guided / paced breathing': 'limited',
      'Works with no wearable or chest strap (iPhone camera)': 'yes',
      'Apple Watch support': 'limited',
      'Resting-HRV trend over time': 'no',
      'Sleep / overnight readiness tracking': 'no',
      'Large meditation / sleep content library': 'yes',
      'Structured, progressive program': 'limited',
    },
    notes: {
      'Guided / paced breathing': 'Headspace has breathing exercises, but no biometric feedback.',
      'Large meditation / sleep content library': 'This is Headspace’s core strength — a deep, polished library.',
    },
    bestForOnda:
      'Choose ONDA if you want physiological feedback — to see your heart rhythm respond as you breathe — rather than guided audio alone.',
    bestForThem:
      'Choose Headspace if you want a broad, polished library of guided meditations and mindfulness courses to explore.',
    verdict:
      'Headspace teaches you to meditate; ONDA shows you your body doing it. If you want variety of guided content, Headspace. If you want measurable, feel-it-working HRV biofeedback, ONDA. They complement each other well.',
    faq: [
      {
        q: 'Is ONDA a meditation app like Headspace?',
        a: 'Not really. Headspace is a guided-meditation library; ONDA is an HRV biofeedback trainer that gives live physiological feedback while you breathe. ONDA is narrower and more measurement-driven.',
      },
      {
        q: 'Does Headspace track HRV?',
        a: 'No. Headspace offers guided audio and breathing exercises but does not measure heart-rate variability or give biometric feedback. That is ONDA’s focus.',
      },
    ],
  },
  {
    slug: 'onda-vs-calm',
    competitorName: 'Calm',
    reviewSlug: 'calm',
    competitorUrl: 'https://www.calm.com/',
    category: 'Meditation / sleep content',
    title: 'ONDA vs Calm',
    description:
      'ONDA vs Calm — real-time HRV biofeedback vs a meditation-and-sleep content library. An objective capability comparison from ONDA Life.',
    intro:
      'Calm is a large meditation and sleep-content app, best known for its sleep stories and relaxing audio. ONDA is a physiological trainer: real-time HRV biofeedback and paced breathing so you can see your nervous system respond. Calm helps you wind down with content; ONDA gives you a measurable practice.',
    them: {
      'Real-time HRV biofeedback (live feedback as you breathe)': 'no',
      'Live coherence score': 'no',
      'Guided / paced breathing': 'limited',
      'Works with no wearable or chest strap (iPhone camera)': 'yes',
      'Apple Watch support': 'limited',
      'Resting-HRV trend over time': 'no',
      'Sleep / overnight readiness tracking': 'no',
      'Large meditation / sleep content library': 'yes',
      'Structured, progressive program': 'limited',
    },
    notes: {
      'Guided / paced breathing': 'Calm has a breathing-bubble exercise, but no biometric feedback.',
      'Large meditation / sleep content library': 'Calm’s sleep stories and audio library are its core strength.',
    },
    bestForOnda:
      'Choose ONDA if you want a measurable practice — live HRV biofeedback you can feel and track — rather than relaxing content alone.',
    bestForThem:
      'Choose Calm if you mainly want sleep stories, soundscapes and a broad library of relaxation content.',
    verdict:
      'Calm helps you relax with content; ONDA trains your physiology with feedback. For winding down at night, Calm. For active, measurable nervous-system training, ONDA.',
    faq: [
      {
        q: 'Is ONDA like Calm?',
        a: 'They overlap on calming down but work differently. Calm is a meditation-and-sleep content library; ONDA is an HRV biofeedback trainer that measures your heart rhythm and gives live feedback while you breathe.',
      },
      {
        q: 'Does Calm measure HRV?',
        a: 'No. Calm provides guided audio, sleep stories and a simple breathing exercise, but does not measure HRV or provide biofeedback.',
      },
    ],
  },
  {
    slug: 'onda-vs-breathwrk',
    competitorName: 'Breathwrk',
    reviewSlug: 'breathwrk',
    competitorUrl: 'https://www.breathwrk.com/',
    category: 'Breathing exercises app',
    title: 'ONDA vs Breathwrk',
    description:
      'ONDA vs Breathwrk — HRV-biofeedback-first vs breathing-exercise-first. An objective capability comparison from ONDA Life.',
    intro:
      'Breathwrk is a large library of guided breathing exercises for calm, focus and sleep; its premium tier can add HRV/coherence monitoring via a Bluetooth device. ONDA is HRV-biofeedback-first: live heart-rhythm feedback and a coherence score using the iPhone camera or Apple Watch, no extra device. Both are breath-centred; they differ in whether the biometric loop is core or an add-on.',
    them: {
      'Real-time HRV biofeedback (live feedback as you breathe)': 'limited',
      'Live coherence score': 'limited',
      'Guided / paced breathing': 'yes',
      'Works with no wearable or chest strap (iPhone camera)': 'limited',
      'Apple Watch support': 'limited',
      'Resting-HRV trend over time': 'limited',
      'Sleep / overnight readiness tracking': 'no',
      'Large meditation / sleep content library': 'no',
      'Structured, progressive program': 'limited',
    },
    notes: {
      'Real-time HRV biofeedback (live feedback as you breathe)': 'Breathwrk adds HRV/coherence biofeedback only in its premium tier, via a Bluetooth heart-rate device.',
      'Works with no wearable or chest strap (iPhone camera)': 'Breathwrk’s breathing works device-free, but its HRV biofeedback needs a Bluetooth sensor.',
      'Guided / paced breathing': 'Breathwrk’s deep exercise library is its core strength.',
    },
    bestForOnda:
      'Choose ONDA if you want HRV biofeedback and a coherence score as the core experience, using just your phone or Apple Watch — no Bluetooth sensor.',
    bestForThem:
      'Choose Breathwrk if you mainly want a large library of guided breathing exercises and classes, and only optionally add HRV monitoring.',
    verdict:
      'Breathwrk is breathing-first with HRV as a premium add-on; ONDA is HRV-biofeedback-first with breathing as the vehicle. For exercise variety, Breathwrk. For a built-in, device-free biofeedback loop, ONDA.',
    faq: [
      {
        q: 'ONDA or Breathwrk for HRV biofeedback?',
        a: 'ONDA puts HRV biofeedback and a live coherence score at the centre, using the iPhone camera or Apple Watch. Breathwrk offers HRV/coherence only in its premium tier and via a Bluetooth device. For device-free biofeedback, ONDA; for the widest breathing-exercise library, Breathwrk.',
      },
      {
        q: 'Does Breathwrk measure HRV?',
        a: 'Only in its paid tier, and it needs a Bluetooth heart-rate device to do so. Its free experience is guided breathing patterns without biometric feedback.',
      },
    ],
  },
  {
    slug: 'onda-vs-elite-hrv',
    competitorName: 'Elite HRV',
    competitorUrl: 'https://elitehrv.com/',
    category: 'HRV measurement & biofeedback app',
    title: 'ONDA vs Elite HRV',
    description:
      'ONDA vs Elite HRV — two genuine HRV-biofeedback apps compared. Accessibility (camera / Apple Watch) vs measurement depth (chest strap). An objective comparison from ONDA Life.',
    intro:
      'Elite HRV is the closest thing to a direct peer: a serious HRV app with morning readiness, ANS balance and a live coherence breathing pacer. The main difference is access. Elite HRV measures HRV most accurately with a chest strap; ONDA is built to work with the iPhone camera or an Apple Watch, wrapped in a guided, progressive practice. Elite HRV leans measurement-and-data; ONDA leans guided training.',
    them: {
      'Real-time HRV biofeedback (live feedback as you breathe)': 'yes',
      'Live coherence score': 'yes',
      'Guided / paced breathing': 'yes',
      'Works with no wearable or chest strap (iPhone camera)': 'limited',
      'Apple Watch support': 'limited',
      'Resting-HRV trend over time': 'yes',
      'Sleep / overnight readiness tracking': 'limited',
      'Large meditation / sleep content library': 'no',
      'Structured, progressive program': 'no',
    },
    notes: {
      'Real-time HRV biofeedback (live feedback as you breathe)': 'Elite HRV genuinely does live HRV biofeedback with a coherence pacer — a true peer here.',
      'Works with no wearable or chest strap (iPhone camera)': 'Elite HRV measures HRV via a chest strap / HR monitor; camera measurement is exploratory, not its main path.',
      'Sleep / overnight readiness tracking': 'Elite HRV focuses on morning readiness rather than overnight sleep tracking.',
    },
    bestForOnda:
      'Choose ONDA if you want HRV biofeedback that works with your phone or Apple Watch — no chest strap — inside a guided, progressive practice.',
    bestForThem:
      'Choose Elite HRV if you want the most measurement-focused HRV app and you’re happy to use a chest strap for the most accurate data.',
    verdict:
      'The honest peer comparison. Both do real HRV biofeedback and coherence training. Elite HRV is measurement-first and most accurate with a chest strap; ONDA is access-first (camera / Apple Watch) and guided. Pick by whether you prioritise measurement precision or a device-free, guided practice.',
    faq: [
      {
        q: 'Is ONDA the same as Elite HRV?',
        a: 'They’re close peers — both offer HRV biofeedback and coherence breathing. The difference is access and framing: Elite HRV is measurement-first and most accurate with a chest strap; ONDA works with the iPhone camera or Apple Watch inside a guided, progressive program.',
      },
      {
        q: 'Do I need a chest strap for ONDA like Elite HRV?',
        a: 'No. ONDA is designed to work with the iPhone camera (pulse/PPG) or an Apple Watch. Elite HRV’s most accurate measurement uses a chest strap.',
      },
    ],
  },
]

export function getOndaVs(slug: string): OndaVsEntry | undefined {
  return ONDA_VS.find((e) => e.slug === slug)
}
