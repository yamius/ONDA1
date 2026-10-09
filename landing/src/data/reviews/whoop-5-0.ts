import type { ToolReviewInput } from './types'

const whoop5: ToolReviewInput = {
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
    'The Whoop 5.0 is built around recovery. It builds its daily recovery signal from HRV measured during sleep rather than from a morning spot-check. The trade-off is the model: there is no hardware to own, only an ongoing membership.',
  scores: [
    { criterionId: 'hrv-accuracy', score: 7.5, note: 'Recovery is built on HRV measured during sleep, not on one morning spot-check.' },
    { criterionId: 'sensor', score: 8.0, note: 'A multi-wavelength optical band that holds heart-rate well when worn snugly.' },
    { criterionId: 'sleep-accuracy', score: 7.5, note: 'Recovery-grade sleep tracking, close behind Oura and well ahead of a general-purpose smartwatch.' },
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
  price: { usd: 239, note: 'per year for WHOOP Peak — membership includes the band; WHOOP One $199/year, WHOOP Life (WHOOP MG band, ECG and blood-pressure insights) $359/year', asOf: '2026-10-02' },
  link: 'https://whoop.com',
  linkType: 'official',
  content: `## Where it leads

The Whoop 5.0 is built around one idea: recovery. Rather than a morning spot-check, it builds its daily recovery signal from [HRV](/glossary/heart-rate-variability) measured during sleep; Whoop does not publish exactly how that nightly value is weighted. The screenless band is easy to forget you are wearing, the current generation pushed battery life out to roughly two weeks, and the slide-on battery pack means it never has to leave your wrist to charge.

**2026 validation update.** A wrist band is still short of a finger-based ring or an ECG chest strap for beat-to-beat precision, and its sleep stages are estimates. Read the *trend* Whoop reports each morning rather than any single value.

## What are the downsides of Whoop 5.0?

Whoop is sold as a membership, not a product. There is no hardware to own — stop paying and the band stops working — and the membership — 199 USD a year for WHOOP One, 239 USD for Peak, 359 USD for Life — is an ongoing cost, not a one-time purchase. The app is powerful but dense: Strain, Recovery and the AI coach reward users who want to study their data and can overwhelm those who do not. Raw data access, as with Oura, is limited.

## Who should buy Whoop 5.0?

Choose the Whoop 5.0 if you are an athlete or serious trainer who makes decisions on a daily recovery score and wants continuous overnight [HRV](/glossary/heart-rate-variability) without a screen on your wrist. If you dislike perpetual subscriptions, or you want a device that also tells the time, the alternatives will fit better.

---

## Background reading

The science behind why HRV is the signal worth tracking — and how the body produces it.

- [Does HRV predict reaction time and focus?](/articles/nervous-system-ping-latency) — what resting HRV does and does not say about attention and self-control
- [HRV as fault-tolerant buffer](/articles/fault-tolerant-human-hrv-buffer) — why a wide HRV envelope is what you are actually training for
- [The baroreflex and the 0.1 Hz shift](/articles/baroreflex-01hz-shift) — the resonant-frequency breathing signature in your HRV trace
`,
  references: [
    { label: 'Whoop — official product page', url: 'https://whoop.com' },
    { label: 'Whoop HRV and recovery validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=whoop+heart+rate+variability+validation' },
  ],
  relatedSlugs: ['oura-ring-4', 'apple-watch-series-11'],
  faq: [
    { q: "Does Whoop 5.0 require a subscription?", a: "Yes. Whoop is subscription-only: $199 per year for WHOOP One, $239 for Peak or $359 for Life, each including the band — there is no separate hardware purchase. Stop paying and the band stops working." },
    { q: "Is Whoop 5.0 accurate for HRV?", a: "Whoop builds its nightly HRV value from measurements taken during sleep. It is good enough to follow trends, but as a wrist band it is behind a finger ring or ECG chest strap for precision. The 5.0 itself has not been separately tested." },
    { q: "Who is Whoop 5.0 best for?", a: "Athletes and serious trainers who act on a daily recovery-and-strain score. The ~14-day battery and screenless band suit 24/7 wear; it is overkill for casual users who dislike subscriptions." },
  ],

  datePublished: '2026-05-15',
  dateModified: '2026-10-02',
}

export default whoop5
