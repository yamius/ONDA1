import type { ToolReview } from './types'

const whoop5: ToolReview = {
  slug: 'whoop-5-0',
  name: 'Whoop 5.0',
  brand: 'Whoop',
  category: 'hrv-wearable',
  productType: 'Screenless band',
  description:
    'ONDA review of the Whoop 5.0 — a continuous-HRV recovery tracker for athletes, scored on accuracy, sensor quality, data access and value.',
  verdict:
    'A recovery coach on your wrist: continuous overnight HRV and sharp strain insight, locked behind a perpetual membership.',
  summary:
    'The Whoop 5.0 is built around recovery. It samples HRV continuously through the night and reports a full-sleep average rather than a morning spot-check, which makes its daily recovery signal the cleanest of the three. The trade-off is the model: there is no hardware to own, only an ongoing membership.',
  overallScore: 7.7,
  scores: [
    { criterionId: 'hrv-accuracy', score: 8.5, note: 'Continuous overnight sampling builds a full-night HRV average from hundreds of readings, not one spot-check.' },
    { criterionId: 'sensor', score: 8.0, note: 'A multi-wavelength optical band that holds heart-rate well when worn snugly.' },
    { criterionId: 'sleep-accuracy', score: 8.0, note: 'Recovery-grade sleep tracking, close behind Oura and well ahead of a general-purpose smartwatch.' },
    { criterionId: 'data-access', score: 6.5, note: 'A developer API exists, but like Oura the raw beat-to-beat stream stays largely closed.' },
    { criterionId: 'wearability', score: 8.5, note: 'Screenless and easy to forget; ~14 day battery, and the slide-on pack charges it without removal.' },
    { criterionId: 'app-ux', score: 7.5, note: 'Strain, Recovery and an AI coach reward data-minded users but can overwhelm everyone else.' },
    { criterionId: 'value', score: 5.5, note: 'Subscription-only — roughly 239 USD a year, forever, with no device you ever own.' },
  ],
  pros: [
    'Continuous overnight HRV, not a single morning reading',
    'Sharp, actionable recovery and strain coaching',
    'Screenless and comfortable; ~14 day battery, charges on-body',
    'Lowest first-year cost of the three',
  ],
  cons: [
    'Subscription-only — stop paying and the band stops working',
    'A perpetual annual cost, not a one-time purchase',
    'Dense app that can overwhelm casual users',
    'Limited access to raw data',
  ],
  bestFor: 'Best for athletes who train on daily recovery and strain signals.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, independent 2026 reviews and published validation literature. Not hands-on tested by ONDA.',
  price: { usd: 239, note: 'per year — membership includes the band; no separate hardware purchase', asOf: '2026-05-15' },
  link: 'https://whoop.com',
  linkType: 'official',
  content: `## Where it leads

The Whoop 5.0 is built around one idea: recovery. Rather than a morning spot-check, it samples HRV continuously through the night and reports a full-sleep average drawn from hundreds of readings — the cleanest basis for a daily recovery signal of the three devices here. The screenless band is easy to forget you are wearing, the current generation pushed battery life out to roughly two weeks, and the slide-on battery pack means it never has to leave your wrist to charge.

## Where it falls short

Whoop is sold as a membership, not a product. There is no hardware to own — stop paying and the band stops working — and the roughly 239 USD first year is an ongoing cost, not a one-time purchase. The app is powerful but dense: Strain, Recovery and the AI coach reward users who want to study their data and can overwhelm those who do not. Raw data access, as with Oura, is limited.

## Who it is for

Choose the Whoop 5.0 if you are an athlete or serious trainer who makes decisions on a daily recovery score and wants continuous overnight HRV without a screen on your wrist. If you dislike perpetual subscriptions, or you want a device that also tells the time, the alternatives will fit better.

---

## Background reading

The science behind why HRV is the signal worth tracking — and how the body produces it.

- [HRV training and nervous-system latency](/articles/hrv-training-nervous-system-latency) — how HRV reflects autonomic responsiveness
- [HRV as fault-tolerant buffer](/articles/fault-tolerant-human-hrv-buffer) — why a wide HRV envelope is what you are actually training for
- [The baroreflex and the 0.1 Hz shift](/articles/baroreflex-01hz-shift) — the resonant-frequency breathing signature in your HRV trace
`,
  references: [
    { label: 'Whoop — official product page', url: 'https://whoop.com' },
    { label: 'Whoop HRV and recovery validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=whoop+heart+rate+variability+validation' },
  ],
  relatedSlugs: ['oura-ring-4', 'apple-watch-series-11'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default whoop5
