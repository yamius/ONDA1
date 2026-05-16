import type { ToolReview } from './types'

const withingsScanwatch: ToolReview = {
  slug: 'withings-scanwatch',
  name: 'Withings ScanWatch 2',
  brand: 'Withings',
  category: 'hrv-wearable',
  productType: 'Hybrid smartwatch',
  description:
    'ONDA review of the Withings ScanWatch 2 as an HRV tracker — a hybrid analog watch with medical-grade ECG. Scored on accuracy, sleep, data and value.',
  verdict:
    'A hybrid analog watch with medical-grade ECG and a ~30-day battery — strong on clinical health metrics, competent rather than class-leading as a dedicated HRV tracker.',
  summary:
    'The Withings ScanWatch 2 is the clinical-health pick here — a hybrid analog watch with a regulator-cleared single-lead ECG, SpO2, temperature and sleep-apnea detection, a roughly 30-day battery and no subscription. As a pure HRV tracker it is competent rather than class-leading.',
  overallScore: 7.4,
  scores: [
    { criterionId: 'hrv-accuracy', score: 7.0, note: 'Overnight optical HRV plus an on-demand single-lead ECG — solid, though the continuous signal is optical, not electrical.' },
    { criterionId: 'sensor', score: 8.0, note: 'Optical PPG paired with a regulator-cleared single-lead ECG, SpO2 and a temperature sensor.' },
    { criterionId: 'sleep-accuracy', score: 7.0, note: 'Competent sleep tracking with a sleep-quality score and breathing-disturbance (apnea) detection.' },
    { criterionId: 'data-access', score: 7.0, note: 'The Withings Health Mate app, with reasonable export and a developer API.' },
    { criterionId: 'wearability', score: 8.5, note: 'A roughly 30-day battery in a discreet hybrid analog watch — the easiest device here to simply wear and forget.' },
    { criterionId: 'app-ux', score: 7.0, note: 'Health Mate is clean and clear, if less recovery-focused than Oura or Whoop.' },
    { criterionId: 'value', score: 7.5, note: 'A one-time purchase around 350 USD, no subscription, with genuine clinical-grade features.' },
  ],
  pros: [
    'Regulator-cleared single-lead ECG on the wrist',
    'A discreet hybrid analog design with a ~30-day battery',
    'No subscription — clinical features unlocked at purchase',
    'Sleep-apnea and SpO2 screening built in',
  ],
  cons: [
    'Continuous HRV is optical, not electrical — not reference-grade',
    'Less recovery-focused than Oura or Whoop',
    'A small dial and no full touchscreen',
    'HRV is a secondary metric, not the headline',
  ],
  bestFor: 'Best for a discreet hybrid watch with clinical-grade health screening and no subscription.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, independent 2026 reviews and published validation literature. Not hands-on tested by ONDA.',
  price: { usd: 350, note: 'one-time; no subscription', asOf: '2026-05-16' },
  link: 'https://www.withings.com/scanwatch-2',
  linkType: 'official',
  content: `## Where it leads

The Withings ScanWatch 2 is the clinical-health pick of this comparison. It looks like an ordinary analog watch, but it carries a regulator-cleared single-lead ECG, SpO2, a temperature sensor and breathing-disturbance detection — and it runs for roughly a month on a charge. It is the easiest device here to simply wear and forget, and there is no subscription: the clinical features are unlocked at purchase.

## Where it falls short

For dedicated HRV work it is competent rather than class-leading. The ECG is an on-demand spot reading, not a continuous protocol, so the all-night HRV signal is still optical — fine for trends, short of the reference-grade accuracy of a chest strap. It is also less recovery-focused than Oura or Whoop: HRV is one health metric among many here, not the headline.

## Who it is for

Choose the Withings ScanWatch 2 if you want a discreet, long-lasting watch with genuine clinical screening — ECG, SpO2, apnea — and no subscription, and you treat HRV as one signal among several. If overnight HRV and recovery are the whole point, a dedicated ring or band will track them more closely.`,
  references: [
    { label: 'Withings ScanWatch 2 — official product page', url: 'https://www.withings.com/scanwatch-2' },
    { label: 'Wrist-worn ECG and HRV validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=wrist+ECG+heart+rate+variability+validation' },
  ],
  relatedSlugs: ['apple-watch-series-11', 'garmin-venu-4', 'fitbit-charge-6'],
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
}

export default withingsScanwatch
