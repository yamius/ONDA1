import type { ToolReview } from './types'

const polarH10: ToolReview = {
  slug: 'polar-h10',
  name: 'Polar H10',
  brand: 'Polar',
  category: 'hrv-wearable',
  productType: 'ECG chest strap',
  description:
    'ONDA review of the Polar H10 — the ECG chest strap that sets the HRV accuracy benchmark. Scored on accuracy, data access, wearability and value.',
  verdict:
    'The most accurate HRV device you can buy — a reference instrument, not an all-day wearable.',
  summary:
    'The Polar H10 is the chest strap that the rest of this category is measured against. Its electrical ECG sensor delivers HRV accuracy no optical wearable matches, and it streams raw data to any app. The catch is by design — it is a deliberate measurement tool, not something you wear around the clock.',
  overallScore: 7.6,
  scores: [
    { criterionId: 'hrv-accuracy', score: 9.7, note: 'Electrical ECG read directly from the chest; peer-reviewed work finds near-perfect agreement with clinical ECG at rest.' },
    { criterionId: 'sensor', score: 9.5, note: 'A true ECG electrode pair — the gold-standard sensor type, not optical inference from blood flow.' },
    { criterionId: 'sleep-accuracy', score: 3.0, note: 'Not a sleep device — a chest strap does no sleep staging and is not worn overnight.' },
    { criterionId: 'data-access', score: 9.5, note: 'Broadcasts raw beat-to-beat (RR) intervals over Bluetooth and ANT+; pairs with virtually any HRV app.' },
    { criterionId: 'wearability', score: 3.5, note: 'A chest strap worn for a measurement or a workout — not 24/7 passive tracking.' },
    { criterionId: 'app-ux', score: 6.5, note: 'Polar Flow is serviceable, but the H10 is at its best paired with dedicated third-party HRV apps.' },
    { criterionId: 'value', score: 9.0, note: 'Around 90 USD, no subscription, and reliable for years — the cheapest device in this comparison.' },
  ],
  pros: [
    'ECG-grade accuracy — the reference standard for HRV',
    'Fully open: raw RR data over Bluetooth and ANT+, any app',
    'Cheapest device here, with no subscription',
    'Reliable for years of use',
  ],
  cons: [
    'A chest strap — not worn around the clock',
    'No sleep tracking or passive all-day data',
    'Needs a third-party app for real HRV analysis',
    'Must sit snug against skin to read cleanly',
  ],
  bestFor: 'Best for ground-truth HRV accuracy — a measurement instrument, not an all-day wearable.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, independent 2026 reviews and published validation literature. Not hands-on tested by ONDA.',
  price: { usd: 90, note: 'one-time; no subscription', asOf: '2026-05-15' },
  link: 'https://www.polar.com/en/sensors/h10-heart-rate-sensor',
  linkType: 'official',
  content: `## Where it leads

The Polar H10 is not really a wearable — it is a measurement instrument, and within this comparison it is the reference the others are judged against. Its electrical ECG sensor reads the heart's signal directly rather than inferring it from blood flow, and peer-reviewed validation finds near-perfect agreement with clinical ECG for resting HRV. It also broadcasts raw beat-to-beat (RR) intervals over both Bluetooth and ANT+, so it pairs with effectively any HRV app. At around 90 USD with no subscription, nothing else here is this accurate or this open.

## Where it falls short

The trade-off is deliberate. A chest strap is not something you wear around the clock — there is no all-day passive tracking, and it does no sleep staging at all, which costs it heavily on the two criteria built around 24/7 lifestyle use. For a morning orthostatic measurement or a training session it is ideal; as a continuous recovery monitor it is the wrong tool.

## Who it is for

Choose the Polar H10 if you want ground-truth HRV — a clean, app-agnostic signal for a structured morning protocol, or for validating another device — and you are willing to put a strap on to get it. If you want HRV collected passively while you sleep, pair it with one of the rings or bands here, or pick one of them instead.`,
  references: [
    { label: 'Polar H10 — official product page', url: 'https://www.polar.com/en/sensors/h10-heart-rate-sensor' },
    { label: 'Validity of the Polar H10 sensor for HRV analysis (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9459793/' },
  ],
  relatedSlugs: ['oura-ring-4', 'whoop-5-0', 'garmin-venu-4'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default polarH10
