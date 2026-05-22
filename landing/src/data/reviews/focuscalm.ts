import type { ToolReview } from './types'

const focuscalm: ToolReview = {
  slug: 'focuscalm',
  name: 'FocusCalm',
  brand: 'BrainCo',
  category: 'eeg-headset',
  productType: 'Consumer EEG headband (focus and calm training)',
  description:
    'ONDA review of FocusCalm — the consumer EEG headband from BrainCo focused on content-driven focus and calm training. Scored on signal, content and value.',
  verdict:
    'Content-driven EEG headband — accessible price, decent app, single-channel signal limits the depth.',
  summary:
    'FocusCalm is BrainCo’s consumer EEG headband — single-channel forehead electrode plus accelerometer, paired with a content-heavy app of guided focus and calm sessions. Cheaper than Muse 2 and Neurosity Crown, with a more polished training library than Mendi or Emotiv. The trade is signal depth: one electrode means simpler interpretation. Best as an entry into EEG-feedback content for first-time users who do not need raw data.',
  overallScore: 6.9,
  scores: [
    { criterionId: 'signal-quality', score: 6.5, note: 'Single forehead EEG electrode plus accelerometer. Adequate consumer signal for the focus/calm metric the app surfaces; lower information density than multi-electrode systems.' },
    { criterionId: 'training-content', score: 8.0, note: 'Strong library of guided focus and calm sessions, games and exercises. Content-driven by design — the app drives the experience, not the data.' },
    { criterionId: 'insights', score: 6.5, note: 'Single focus / calm score per session plus aggregate trends. Less analytical depth than multi-electrode alternatives.' },
    { criterionId: 'comfort', score: 7.0, note: 'Soft headband — comfortable for 10–20 minute sessions; not designed for sleep.' },
    { criterionId: 'app-ux', score: 7.5, note: 'Polished iOS/Android app with structured programme progression.' },
    { criterionId: 'open-data', score: 4.0, note: 'Closed platform — no raw EEG export and no developer SDK. Designed for content consumers, not researchers.' },
    { criterionId: 'value', score: 7.5, note: '$199 hardware + optional FocusCalm Plus subscription. Cheapest legitimate EEG meditation/focus device after NeuroSky.' },
  ],
  pros: [
    'Strong content library — programme-driven focus and calm training',
    'Cheapest legitimate consumer EEG focus device after NeuroSky',
    'Soft headband comfortable for daily 10–20 minute sessions',
    'Polished app with structured progression',
  ],
  cons: [
    'Single-channel EEG — informationally thinner than multi-electrode systems',
    'No raw data access or SDK — closed platform',
    'No sleep tracking',
    'Premium content gated behind FocusCalm Plus subscription',
  ],
  bestFor: 'Best for first-time EEG users who want content-driven focus training without a developer toolchain.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from BrainCo / FocusCalm product documentation and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 199, note: '$199 device + optional Plus subscription', asOf: '2026-05-21' },
  link: 'https://focuscalm.com/',
  linkType: 'official',
  content: `## Where it leads

FocusCalm bets on content. The single forehead EEG electrode is enough to produce a credible focus/calm metric, and the app wraps it in a structured programme of guided sessions, mini-games and progression tracking that pull a first-time user through the early weeks more reliably than a measurement-first device like Emotiv. At $199 the hardware is the second-cheapest legitimate EEG headset in this list, beaten only by the educational-tier NeuroSky.

## Where it falls short

A single electrode is informationally thin. Multi-channel systems like Muse, Crown and Emotiv reveal more about what the brain is doing during a session; FocusCalm reduces it to one score. There is no raw data access, no SDK and no developer ecosystem — the platform is closed by design. And premium content sits behind the FocusCalm Plus subscription, so the $199 ticket understates the full ownership cost.

## Who it is for

Choose FocusCalm if you want the cheapest legitimate EEG-feedback experience with real content depth and you do not care about raw data. If meditation depth is the deciding criterion, Muse 2 or Muse S Athena are the better fit at higher cost. If raw EEG is the point, look at Neurosity Crown or Emotiv Insight 2.`,
  references: [
    { label: 'FocusCalm — official product page', url: 'https://focuscalm.com/' },
    { label: 'BrainCo — consumer EEG research summary', url: 'https://www.brainco.tech/' },
  ],
  relatedSlugs: ['muse-2', 'mendi', 'neurosky-mindwave-mobile-2'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default focuscalm
