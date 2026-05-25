import type { ToolReview } from './types'

const pillow: ToolReview = {
  slug: 'pillow',
  name: 'Pillow',
  brand: 'Pillow',
  category: 'sleep-app',
  productType: 'Sleep tracking app',
  description:
    'ONDA review of Pillow — the detailed Apple Watch sleep tracker for iOS. Scored on tracking accuracy, insights, app experience and value.',
  verdict:
    'A detailed, well-presented sleep tracker for the Apple Watch — excellent if you are on iOS, irrelevant if you are not.',
  summary:
    'Pillow is the sleep tracker built around the Apple Watch. Worn overnight, the watch lets it track automatically and in detail, and the app turns that into genuinely useful, well-presented analysis. It is also one of the easier sleep apps to navigate — but it is iOS-only.',
  overallScore: 6.9,
  scores: [
    { criterionId: 'tracking-accuracy', score: 8.0, note: 'Automatic tracking via the Apple Watch heart-rate sensor and accelerometer — more precise than a phone on the nightstand.' },
    { criterionId: 'wind-down-content', score: 5.5, note: 'Minimal — a measurement app, not a fall-asleep aid.' },
    { criterionId: 'sleep-science', score: 6.5, note: 'Sound staging and timing, without a distinctive science-led method of its own.' },
    { criterionId: 'insights', score: 8.0, note: 'Every metric opens into weekly, monthly and yearly views; metric comparison helps explain a bad night.' },
    { criterionId: 'app-experience', score: 8.0, note: 'Clear and genuinely easy to navigate.' },
    { criterionId: 'free-tier', score: 6.0, note: 'A freemium app — the fuller feature set needs the subscription.' },
    { criterionId: 'value', score: 6.5, note: 'A subscription on top of needing an Apple Watch and iPhone narrows who it pays off for.' },
  ],
  pros: [
    'Detailed, accurate Apple Watch tracking',
    'Well-presented analysis with weekly to yearly views',
    'Metric comparison to explain a poor night',
    'Easy to navigate',
  ],
  cons: [
    'iOS only — no Android',
    'Leans heavily on owning an Apple Watch',
    'Minimal wind-down content',
    'Fuller features need a subscription',
  ],
  bestFor: 'Best for iPhone and Apple Watch owners who want detailed, well-presented sleep analysis.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 50, note: 'per year (Premium); iOS and Apple Watch only', asOf: '2026-05-16' },
  link: 'https://pillow.app',
  linkType: 'official',
  content: `## Where it leads

Pillow is the sleep tracker built around the Apple Watch. Worn overnight, the watch lets it track automatically and in more detail than a phone on the nightstand, and the app turns that into genuinely useful analysis — every metric opens into weekly, monthly and yearly views, and you can compare metrics to work out what wrecked a particular night. It is also one of the easier sleep apps to navigate.

## Where it falls short

It is iOS-only, and it leans hard on the Apple Watch — without one you lose much of what makes it good. Wind-down content is minimal; this is a measurement app, not a fall-asleep aid. And the fuller feature set sits behind a subscription.

## Who it is for

Choose Pillow if you are on iPhone, wear an Apple Watch to bed, and want detailed, well-presented sleep analysis. Android users, or anyone without a watch, should look elsewhere.

---

## Background reading

The sleep biology behind what these apps measure and the protocols they support.

- [Circadian lighting and dark therapy](/articles/circadian-lighting-dark-therapy) — the protocol layer that compounds with tracking
- [Ancestral sync and circadian anchors](/articles/ancestral-sync-circadian-anchors) — the inputs that keep circadian timing stable across travel and shift work
- [Protocol: the circadian hard reset](/articles/protocol-circadian-hard-reset) — how to actually shift the rhythm when you have to
`,
  references: [
    { label: 'Pillow — official site', url: 'https://pillow.app' },
    { label: 'Sleep tracking app validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sleep+tracking+app+validation' },
  ],
  relatedSlugs: ['sleep-cycle', 'sleepscore', 'autosleep'],
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
}

export default pillow
