import type { ToolReview } from './types'

const appleWatchSeries11: ToolReview = {
  slug: 'apple-watch-series-11',
  name: 'Apple Watch Series 11',
  brand: 'Apple',
  category: 'hrv-wearable',
  productType: 'Smartwatch',
  description:
    'ONDA review of the Apple Watch Series 11 as an HRV tracker — an outstanding all-round smartwatch, but a casual recovery tool. Scored on accuracy, data and value.',
  verdict:
    'An outstanding all-round smartwatch, but a casual HRV tool — it spot-checks rather than tracks.',
  summary:
    'The Apple Watch Series 11 is the most capable device in this comparison and the only one with no subscription. As a dedicated HRV tracker, though, it is the weakest of the three: it records HRV in irregular background spot-checks rather than a structured overnight protocol.',
  overallScore: 7.2,
  scores: [
    { criterionId: 'hrv-accuracy', score: 6.0, note: 'HRV is captured in irregular background spot-checks, not a continuous overnight protocol — a sparse, uneven record.' },
    { criterionId: 'sensor', score: 8.5, note: 'Strong hardware: an optical sensor paired with a genuine single-lead ECG.' },
    { criterionId: 'sleep-accuracy', score: 6.5, note: 'Sleep tracking is serviceable but behind the dedicated trackers, and battery life discourages all-night wear.' },
    { criterionId: 'data-access', score: 8.0, note: 'HealthKit is comparatively open — broad third-party app support and straightforward export.' },
    { criterionId: 'wearability', score: 6.0, note: 'A roughly day-long battery means a daily charge, which works against consistent overnight measurement.' },
    { criterionId: 'app-ux', score: 7.5, note: 'Excellent software overall, but HRV is buried — the Vitals view does not surface it as a headline metric.' },
    { criterionId: 'value', score: 8.5, note: 'A one-time purchase with no subscription, and a genuinely multi-purpose device for the money.' },
  ],
  pros: [
    'The most capable hardware here — optical sensor plus a real ECG',
    'No subscription; you own the device outright',
    'Open data via HealthKit and a deep third-party ecosystem',
    'A genuinely multi-purpose device, not a single-task tracker',
  ],
  cons: [
    'HRV is spot-checked, not tracked continuously overnight',
    'Apple does not treat HRV as a primary metric',
    'A day-long battery makes consistent overnight wear awkward',
    'Sleep tracking trails the dedicated devices',
  ],
  bestFor: 'Best for one device that does everything — with HRV as a secondary metric.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, independent 2026 reviews and published validation literature. Not hands-on tested by ONDA.',
  price: { usd: 399, note: 'one-time; no subscription required', asOf: '2026-05-15' },
  link: 'https://www.apple.com/watch/',
  linkType: 'official',
  content: `## Where it leads

As a piece of hardware the Apple Watch Series 11 is the most capable device in this comparison: an optical sensor paired with a genuine single-lead ECG, a bright display, and the deepest third-party ecosystem through HealthKit. It is also the only one here with no subscription — the purchase price buys the device outright. For someone who wants one wearable that handles notifications, workouts, payments and health, nothing else here competes.

## Where it falls short

For dedicated HRV work it is the weakest of the three. The watch records HRV in irregular background spot-checks rather than a structured overnight protocol, and Apple's own Vitals view does not even surface HRV as a headline metric. Combined with a battery that realistically needs a daily charge — awkward for consistent all-night wear — it produces a sparse, uneven HRV record next to Oura or Whoop.

## Who it is for

Choose the Apple Watch Series 11 if you want a single excellent all-round smartwatch and treat HRV as a useful bonus rather than the point. If overnight HRV and recovery are your primary reason to buy, a dedicated tracker will give you a far cleaner signal.

---

## Background reading

The science behind why HRV is the signal worth tracking — and how the body produces it.

- [HRV training and nervous-system latency](/articles/hrv-training-nervous-system-latency) — how HRV reflects autonomic responsiveness
- [HRV as fault-tolerant buffer](/articles/fault-tolerant-human-hrv-buffer) — why a wide HRV envelope is what you are actually training for
- [The baroreflex and the 0.1 Hz shift](/articles/baroreflex-01hz-shift) — the resonant-frequency breathing signature in your HRV trace
`,
  references: [
    { label: 'Apple Watch — official product page', url: 'https://www.apple.com/watch/' },
    { label: 'Apple Watch HRV validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=apple+watch+heart+rate+variability+validation' },
  ],
  relatedSlugs: ['oura-ring-4', 'whoop-5-0'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default appleWatchSeries11
