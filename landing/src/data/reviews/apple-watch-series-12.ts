import type { ToolReview } from './types'

const appleWatchSeries12: ToolReview = {
  slug: 'apple-watch-series-12',
  name: 'Apple Watch Series 12',
  brand: 'Apple',
  category: 'hrv-wearable',
  productType: 'Smartwatch',
  description:
    'ONDA review of the Apple Watch Series 12 as an HRV tracker — the new Health Sensing System finally takes HRV seriously. Scored on accuracy, sensor, sleep, data and value.',
  verdict:
    'The best Apple Watch yet for HRV: 24× more frequent sampling and a Recovery-vs-Overall HRV split — but still a smartwatch first, and battery still competes with overnight wear.',
  summary:
    'The Series 12’s all-new Health Sensing System is the first Apple Watch update to take HRV seriously: it samples HRV up to 24× more often, splits it into Recovery HRV (RMSSD) and Overall HRV (SDNN), and adds hypertension notifications. It closes much of the gap to dedicated trackers — but a ~1-day battery still makes overnight wear a compromise, and a finger ring is still more precise for a continuous overnight record.',
  overallScore: 7.7,
  scores: [
    { criterionId: 'hrv-accuracy', score: 7.0, note: 'HRV is now sampled about every 5 minutes (24× more often) and split into Recovery HRV (RMSSD) and Overall HRV (SDNN) — a real step up from the Series 11’s sparse spot-checks, though still wrist optical rather than a continuous ring or ECG.' },
    { criterionId: 'sensor', score: 9.0, note: 'The all-new Health Sensing System: larger power-efficient green LEDs reading heart rate every 5 seconds, a single-lead ECG, and optical hypertension detection. The strongest sensor stack on any watch here.' },
    { criterionId: 'sleep-accuracy', score: 7.0, note: 'Overnight Vitals now analyse Recovery HRV against your personal baseline. Sleep tracking is improved but still behind dedicated sleep trackers, and battery discourages every-night wear.' },
    { criterionId: 'data-access', score: 8.0, note: 'HealthKit is comparatively open, and it now writes a native RMSSD type (heartRateVariabilityRMSSD) alongside SDNN — so third-party apps can finally read the recovery-grade metric.' },
    { criterionId: 'wearability', score: 6.5, note: 'Up to ~24 hours of battery (12 hours from a 15-minute fast charge) still means a daily charge that competes with overnight measurement — the one place a ring or multi-week watch clearly wins.' },
    { criterionId: 'app-ux', score: 8.0, note: 'HRV is finally surfaced — a dedicated section in the Heart Rate app with Recovery and Overall HRV — rather than buried as on the Series 11. Apple Health remains the cleanest health UI here.' },
    { criterionId: 'value', score: 8.0, note: 'From $399, a one-time purchase with no subscription, and a genuinely multi-purpose device with ECG and hypertension notifications for the money.' },
  ],
  pros: [
    'HRV sampled 24× more often, split into Recovery (RMSSD) and Overall (SDNN)',
    'All-new Health Sensing System: ECG plus optical hypertension notifications',
    'Native RMSSD in HealthKit — third-party recovery apps can finally read it',
    'No subscription; the most capable everyday smartwatch here',
  ],
  cons: [
    '~1-day battery still makes consistent overnight HRV a compromise',
    'Wrist optical HRV trails a finger ring or ECG chest strap for a continuous overnight record',
    'Recovery and Overall HRV are different metrics — easy to confuse',
    'Sleep tracking still behind dedicated sleep trackers',
  ],
  bestFor: 'Best for an all-round smartwatch whose HRV is finally good enough to act on.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Apple’s September 2026 announcement and specs, independent hands-on reviews, and published Apple Watch HRV validation literature. Not hands-on tested by ONDA.',
  price: { usd: 399, note: 'from $399 (aluminium); titanium and ceramic cost more; no subscription', asOf: '2026-09-18' },
  link: 'https://www.apple.com/apple-watch-series-12/',
  linkType: 'official',
  content: `## Where it leads

The Apple Watch Series 12, announced in September 2026, is the first Apple Watch whose headline upgrade is *health sensing*, not the screen or chip. The all-new Health Sensing System uses larger, power-efficient green LEDs to read heart rate every five seconds and to sample [HRV](/glossary/heart-rate-variability) up to **24× more often** than before — where earlier watches captured it roughly once every two hours.

More importantly, it changes *which* HRV number you get. The Series 12 now reports two: **Recovery HRV** (based on RMSSD, for daily stress and recovery, analysed against your personal baseline in overnight Vitals) and **Overall HRV** (the historical SDNN metric, for broader cardiovascular context). Under the hood, HealthKit gained a native \`heartRateVariabilityRMSSD\` type — the same family of metric Whoop, Oura and Garmin build their recovery scores on — so third-party apps can finally read a recovery-grade number from an Apple Watch. It also adds **hypertension notifications**, using the optical sensor to analyse how blood vessels respond to heartbeats over 30-day windows. For the full breakdown of the two-number change, see [Recovery HRV vs Overall HRV](/articles/apple-watch-recovery-hrv-vs-overall-hrv).

## Where it falls short

The physics haven’t changed as much as the software. It is still a **wrist optical sensor**, which trails a finger-based ring or an ECG chest strap for a clean, continuous overnight HRV record. And the battery — up to about 24 hours, with a 15-minute fast charge giving roughly 12 hours — still means a daily charge that competes with all-night wear, the one place a ring or a multi-week Garmin clearly wins. The two HRV numbers are also easy to conflate: Recovery HRV (RMSSD) reads higher than Overall HRV (SDNN), and they should not be plotted as one line.

## Who it is for

Choose the Series 12 if you want the best everyday smartwatch and you now want HRV you can actually act on — the more frequent sampling plus Recovery HRV against a baseline is a genuine step up from the Series 11. If a clean overnight HRV trend is your single priority, a finger ring still serves you better; see the [best HRV trackers of 2026](/reviews/compare/best-hrv-trackers-2026).

---

## Background reading

The science behind why HRV is the signal worth tracking — and how the body produces it.

- [Why HRV reads differently on every device](/articles/hrv-different-every-device) — SDNN vs RMSSD, and why numbers don’t line up across brands
- [Apple Watch Recovery HRV vs Overall HRV](/articles/apple-watch-recovery-hrv-vs-overall-hrv) — the 2026 two-number change, explained
- [HRV training and nervous-system latency](/articles/hrv-training-nervous-system-latency) — how HRV reflects autonomic responsiveness
`,
  references: [
    { label: 'Apple — Apple Watch Series 12 (official)', url: 'https://www.apple.com/apple-watch-series-12/' },
    { label: 'Apple Newsroom — the all-new Health Sensing System (Sept 2026)', url: 'https://www.apple.com/newsroom/2026/09/introducing-apple-watch-series-12-with-the-all-new-health-sensing-system/' },
    { label: 'Apple Watch HRV validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=apple+watch+heart+rate+variability+validation' },
  ],
  faq: [
    {
      q: 'Is the Apple Watch Series 12 better for HRV than the Series 11?',
      a: 'Yes, clearly. The Series 12’s Health Sensing System samples HRV about 24× more often and splits it into Recovery HRV (RMSSD) and Overall HRV (SDNN), analysed against your baseline — a real upgrade over the Series 11’s sparse spot-checks. It also surfaces HRV in the Heart Rate app instead of burying it.',
    },
    {
      q: 'How much does the Apple Watch Series 12 cost and does it need a subscription?',
      a: 'The Series 12 starts at $399 for aluminium (titanium and ceramic cost more) and needs no subscription for its HRV, ECG or hypertension features. It launched on 18 September 2026.',
    },
    {
      q: 'Is the Apple Watch Series 12 accurate enough for HRV, or should I get a ring?',
      a: 'For daily recovery it is now good enough to act on, and Recovery HRV (RMSSD) is comparable in kind to Whoop and Oura. For a clean, continuous overnight HRV record, a finger ring or an ECG chest strap is still more precise, and its ~1-day battery competes with all-night wear.',
    },
    {
      q: 'Does the Apple Watch Series 12 detect high blood pressure?',
      a: 'It adds hypertension notifications: the optical sensor analyses how your blood vessels respond to heartbeats over roughly 30-day windows and can flag possible hypertension. It is a screening signal, not a diagnosis or a replacement for a blood-pressure cuff.',
    },
  ],
  relatedSlugs: ['apple-watch-series-11', 'oura-ring-4', 'whoop-5-0', 'garmin-fenix-8'],
  datePublished: '2026-09-18',
  dateModified: '2026-09-18',
}

export default appleWatchSeries12
