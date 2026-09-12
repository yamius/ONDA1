import type { ToolReview } from './types'

const fitbitAir: ToolReview = {
  slug: 'fitbit-air',
  name: 'Fitbit Air',
  brand: 'Google',
  category: 'hrv-wearable',
  productType: 'Screenless health tracker',
  description:
    'ONDA review of the Google Fitbit Air — a $99 screenless 24/7 tracker with HRV, SpO2 and sleep, and no Premium wall on the basics. Scored on accuracy, sleep, data and value.',
  verdict:
    'The cheapest way into continuous, all-day HRV without a subscription wall — a screenless WHOOP-style pod at a fifth of the price, with accuracy still unproven.',
  summary:
    'Launched May 2026 at $99.99, the Fitbit Air is a screenless, pebble-sized pod that tracks HRV, SpO2, breathing rate, skin temperature and sleep 24/7 for about a week per charge — and, unusually for Fitbit, the core metrics (HR, sleep, HRV, SpO2, AFib) work without Premium. It is the most affordable serious entry to continuous HRV, but it is a brand-new optical wrist device with no independent validation yet, and data export stays inside Google’s ecosystem.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'hrv-accuracy', score: 6.5, note: 'Optical PPG on the wrist, tracked 24/7 — plausible for trends, but this is a brand-new device with no independent HRV-validation data yet.' },
    { criterionId: 'sensor', score: 6.5, note: 'PPG heart sensor plus red/IR for SpO2 and breathing rate, skin-temperature and a 3-axis accelerometer/gyro. No ECG.' },
    { criterionId: 'sleep-accuracy', score: 7.0, note: 'Fitbit’s sleep tracking has a strong track record; the tiny, screenless pod is easy to keep on overnight.' },
    { criterionId: 'data-access', score: 5.5, note: 'Metrics live in the Fitbit/Google app; historically closed to open export, with a Premium tier layered on top.' },
    { criterionId: 'wearability', score: 8.0, note: 'A screenless, pebble-sized pod with swappable bands and ~1 week battery — about as unobtrusive as 24/7 wear gets.' },
    { criterionId: 'app-ux', score: 7.5, note: 'The Fitbit app is polished and beginner-friendly on both Android and iOS.' },
    { criterionId: 'value', score: 8.0, note: '$99.99 ($129.99 Special Edition), and the core HR/HRV/SpO2/AFib/sleep run without the $9.99/mo Premium — rare for Fitbit.' },
  ],
  pros: [
    'Just $99.99 — the cheapest capable 24/7 HRV tracker here',
    'Core metrics (HR, HRV, SpO2, sleep, AFib) work without Premium',
    'Screenless, pebble-sized and unobtrusive, ~1 week battery',
    'Android + iOS, with a polished, beginner-friendly app',
  ],
  cons: [
    'Brand-new device — no independent HRV-accuracy validation yet',
    'Optical PPG only — no ECG',
    'Data stays inside the Fitbit/Google ecosystem; limited open export',
    'Google Health Coach and guided workouts still sit behind $9.99/mo Premium',
  ],
  bestFor: 'Best for a first, low-cost step into continuous HRV and sleep tracking without a subscription wall on the basics.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Google’s launch specifications and early 2026 coverage. As a device released in May 2026, it has no independent HRV-validation studies yet; the accuracy score reflects that uncertainty. Not hands-on tested by ONDA.',
  price: { usd: 99, note: '$99.99 (Special Edition $129.99); core metrics no-Premium, optional $9.99/mo', asOf: '2026-09-12' },
  link: 'https://blog.google/products-and-platforms/devices/fitbit/fitbit-air/',
  linkType: 'official',
  content: `## Where it leads

The Fitbit Air’s pitch is access. At **$99.99** it is the cheapest device here that tracks [HRV](/glossary/heart-rate-variability) continuously, 24/7 — a screenless, pebble-sized pod (with a swappable band) that also reads SpO2, breathing rate, skin temperature and sleep, and runs about a week per charge. The form factor is a WHOOP-style “no screen, just data” band at a fraction of WHOOP’s cost. Most importantly for a Fitbit, the **core metrics — HR, sleep, HRV, SpO2, AFib — work without Premium**; the $9.99/month tier only adds Google Health Coach and guided workouts. It is the least-friction, lowest-cost on-ramp to a continuous HRV trend.

## Where it falls short

It is brand new (launched May 2026), so there is **no independent HRV-validation data yet** — the accuracy score here reflects that uncertainty, not a measured result. The sensor is optical PPG only, with no ECG, and wrist PPG is the noisiest place to compute beat-to-beat intervals. Data also stays inside the Fitbit/Google ecosystem, which has historically been closed to clean export and layers a Premium upsell over everything. Screenless means the phone is mandatory to see anything.

## Who it is for

Choose the Fitbit Air if you want the cheapest honest way to start watching a 24/7 HRV and sleep trend, without paying a subscription to see the basics. If you need validated accuracy or open data, a chest strap or a proven ring is the safer buy — revisit the Air once independent validation exists.

---

## Background reading

- [Why your HRV is different on every device](/articles/hrv-different-every-device) — why a wrist PPG number differs from a strap, and which to trust
- [HRV training and nervous-system latency](/articles/hrv-training-nervous-system-latency) — what the HRV trend actually reflects
`,
  references: [
    { label: 'Introducing the Google Fitbit Air — official', url: 'https://blog.google/products-and-platforms/devices/fitbit/fitbit-air/' },
  ],
  relatedSlugs: ['fitbit-charge-6', 'whoop-5-0', 'amazfit-helio-ring'],
  datePublished: '2026-09-12',
  dateModified: '2026-09-12',
}

export default fitbitAir
