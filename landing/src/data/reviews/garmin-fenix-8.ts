import type { ToolReview } from './types'

const garminFenix8: ToolReview = {
  slug: 'garmin-fenix-8',
  name: 'Garmin Fenix 8',
  brand: 'Garmin',
  category: 'hrv-wearable',
  productType: 'Multisport GPS smartwatch',
  description:
    'ONDA review of the Garmin Fenix 8 as an HRV tracker — a premium multisport flagship with an Elevate v5 sensor (ECG), multi-week battery and no subscription. Scored on accuracy, sleep, data and value.',
  verdict:
    'The most capable heart-sensor hardware Garmin puts on a wrist — inside a $1,000 expedition watch you are mostly paying for GPS, dive and battery, not HRV.',
  summary:
    'The Fenix 8 carries Garmin’s newest Elevate v5 optical suite (with an ECG app) and multi-week battery that makes continuous overnight HRV genuinely practical. But it is a large, heavy, ~$1,000 multisport flagship: as a dedicated HRV tracker it is overkill, and a ring or band tracks overnight HRV just as well for a fraction of the price.',
  overallScore: 7.3,
  scores: [
    { criterionId: 'hrv-accuracy', score: 7.5, note: 'Garmin HRV Status builds an overnight baseline over ~3 weeks; solid, though wrist PPG on a large watch still moves more than a ring or strap.' },
    { criterionId: 'sensor', score: 8.0, note: 'Elevate v5 — Garmin’s newest optical array, adding an ECG app and skin-temperature on top of HR, HRV and Pulse Ox (SpO2).' },
    { criterionId: 'sleep-accuracy', score: 7.5, note: 'Advanced sleep tracking with a morning report, Body Battery and nap detection; the multi-week battery makes wearing it every night realistic.' },
    { criterionId: 'data-access', score: 7.5, note: 'Garmin Connect plus a developer API — reasonably open for export and third-party tools.' },
    { criterionId: 'wearability', score: 6.5, note: 'A large, heavy 47–51 mm outdoors watch — but up to ~28–48 days (solar) means it is rarely off your wrist to charge.' },
    { criterionId: 'app-ux', score: 7.0, note: 'Garmin Connect is deep but cluttered and dated next to Oura or Apple.' },
    { criterionId: 'value', score: 6.0, note: 'From ~$999.99 (AMOLED) to $1,099.99 (51 mm Solar). No subscription, but you are paying flagship-multisport money for the HRV.' },
  ],
  pros: [
    'Elevate v5 sensor with an ECG app — Garmin’s most complete heart hardware',
    'Multi-week battery (up to ~28–48 days solar) makes nightly HRV wear effortless',
    'No subscription — every feature unlocked at purchase',
    'Deep training, outdoor and dive features with reasonably open data',
  ],
  cons: [
    'Very expensive (~$1,000+) for what is, HRV-wise, an overnight baseline',
    'Large and heavy — a lot of watch to sleep in',
    'HRV is not more overnight-specialised than a dedicated recovery ring or band',
    'Garmin Connect feels cluttered and dated',
  ],
  bestFor: 'Best for athletes and outdoor users who want one do-everything multisport watch — with capable HRV along for the ride.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, independent 2024–2026 reviews and published HRV-validation literature. Not hands-on tested by ONDA.',
  price: { usd: 999, note: 'from $999.99 (AMOLED); $1,099.99 for 51mm Solar; no subscription', asOf: '2026-09-12' },
  link: 'https://www.garmin.com/en-US/p/pdp',
  linkType: 'official',
  content: `## Where it leads

The Fenix 8 has the best heart-sensor hardware Garmin fits to a wrist: the **Elevate v5** suite adds an ECG app and skin-temperature to the usual optical [HRV](/glossary/heart-rate-variability), heart rate and Pulse Ox. Garmin HRV Status builds an overnight baseline over roughly three weeks and flags balanced-versus-unbalanced, feeding a morning report alongside Body Battery and sleep. The killer feature for HRV specifically is battery: up to ~28 days on the 47 mm Solar and ~48 days on the 51 mm, so the watch is almost never off your wrist charging — which is exactly what a continuous overnight HRV record needs. And like all Garmin, there is no subscription.

## Where it falls short

It is a ~$1,000 expedition-grade multisport watch. For HRV alone, that is enormous overkill: a ring or a chest strap tracks overnight HRV just as well, or better, for a fraction of the price and far less bulk. The Fenix 8 is large and heavy to sleep in, HRV Status is not more overnight-specialised than a dedicated recovery tracker, and Garmin Connect — while deep — is a cluttered, dated experience next to Oura or Apple. You are paying for multi-band GPS, a 40 m dive computer, a flashlight and a speaker, not the heart math.

## Who it is for

Buy the Fenix 8 if you want one no-subscription watch that does serious training, outdoor navigation and diving *and* competent HRV, with battery life that makes nightly wear trivial. If overnight HRV precision is the only thing you care about, spend a fifth of the money on a ring or a strap.

---

## Background reading

Why HRV is the signal worth tracking — and why the number differs by device.

- [Why your HRV is different on every device](/articles/hrv-different-every-device) — RMSSD vs SDNN, PPG vs ECG, and which reading to trust
- [HRV training and nervous-system latency](/articles/hrv-training-nervous-system-latency) — how HRV reflects autonomic responsiveness
`,
  references: [
    { label: 'Garmin fēnix 8 — official announcement', url: 'https://www.garmin.com/en-US/newsroom/press-release/outdoor/garmin-adds-amoled-displays-to-fenix-8-series-its-most-capable-lineup-of-premium-multisport-gps-smartwatches-with-something-for-everyone/' },
    { label: 'Garmin HRV Status — technology overview', url: 'https://www.garmin.com/en-US/garmin-technology/health-science/hrv-status/' },
    { label: 'Garmin Fenix 8 in-depth review (DC Rainmaker)', url: 'https://www.dcrainmaker.com/2024/08/garmin-fenix-8-in-depth-review.html' },
  ],
  relatedSlugs: ['garmin-venu-4', 'apple-watch-series-11', 'whoop-5-0'],
  datePublished: '2026-09-12',
  dateModified: '2026-09-12',
}

export default garminFenix8
