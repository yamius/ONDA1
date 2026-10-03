import type { ToolReview } from './types'

const ultrahumanRingAir: ToolReview = {
  slug: 'ultrahuman-ring-air',
  name: 'Ultrahuman Ring Air',
  brand: 'Ultrahuman',
  category: 'hrv-wearable',
  productType: 'Smart ring',
  description:
    'Ultrahuman Ring Air review (2026): light, no subscription, good sleep data — but banned from US sale since Oct 2025 and dogged by battery failures.',
  verdict:
    'A featherweight, subscription-free ring with strong sleep tracking — undercut by widespread reports of batteries failing within months, and now banned from US sale. Ultrahuman’s successor is the Ring Pro.',
  summary:
    'The Ultrahuman Ring Air does the fundamentals well — light, subscription-free, continuous HRV and strong sleep tracking. But it is hard to recommend without reservation: through 2026, batteries failing within months have been a widely reported problem, and since 21 October 2025 it can no longer be imported into or sold new in the US.',
  overallScore: 7.3,
  scores: [
    { criterionId: 'hrv-accuracy', score: 8.0, note: 'Continuous HRV (SDNN and RMSSD), updated every couple of minutes at rest — a genuinely continuous overnight signal.' },
    { criterionId: 'sensor', score: 7.5, note: 'Optical PPG in a very light ring; a clean signal at rest.' },
    { criterionId: 'sleep-accuracy', score: 8.0, note: 'Strong sleep tracking — early third-party checks put sleep-stage agreement high, among the better rings.' },
    { criterionId: 'data-access', score: 6.5, note: 'Lifelong access to your own data plus some export, but no truly open API.' },
    { criterionId: 'wearability', score: 5.5, note: 'Featherweight and comfortable — but widely reported battery failures within months undercut its reliability as a 24/7 device.' },
    { criterionId: 'app-ux', score: 7.5, note: 'A capable app, extensible through add-on "PowerPlugs".' },
    { criterionId: 'value', score: 6.5, note: 'No subscription is a real plus, but the battery-reliability reports erode the case at about 349 USD.' },
  ],
  pros: [
    'Featherweight, very comfortable for 24/7 wear',
    'No subscription — lifelong access to your data',
    'Continuous HRV and strong sleep tracking',
    'Capable, extensible app',
  ],
  cons: [
    'Banned from US import and sale since October 2025 (Oura patent case)',
    'Widely reported battery failures within months',
    'Reliability concerns undercut the value at about 349 USD',
    'Data access is middling — no fully open API; no display',
  ],
  bestFor: 'Best for buyers outside the US who want a featherweight, subscription-free ring — and accept the battery-reliability risk.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, independent 2026 reviews and published validation literature. Not hands-on tested by ONDA.',
  price: { usd: 349, note: 'one-time; no subscription (UK £329). Not sold new in the US since 21 Oct 2025 — only leftover retail stock or used units', asOf: '2026-10-01' },
  link: 'https://www.ultrahuman.com/ring/',
  linkType: 'official',
  content: `## Our verdict in short

The Ultrahuman Ring Air is a light, comfortable smart ring with no subscription and good overnight HRV and sleep data. Two problems hold it back: many owners report the battery failing within months, and it has been banned from US sale since October 2025. **In the US, buy the [Ultrahuman Ring Pro](/reviews/ultrahuman-ring-pro) or another ring instead.** Outside the US it is still an option, but only with a clear return and warranty path.

## Can you still buy the Ultrahuman Ring Air in the US?

> **No — not new from Ultrahuman.** In 2025 the US International Trade Commission found that Ultrahuman’s rings infringed an Oura patent. The exclusion order took effect on **21 October 2025**. Since then the Ring Air cannot be imported into the US. Retailers could sell only the stock they already had, and Ultrahuman said it would keep supporting rings bought after that date. In practice, a Ring Air in the US today is leftover stock or a used ring.

Ultrahuman’s answer is the **Ring Pro**: announced in February 2026, US pre-orders from March 2026, shipping since June 2026, **$479 one-time with no subscription** and a stated battery life of up to 15 days. If you are in the US and want an Ultrahuman ring, that is the one to buy. Outside the US, Ultrahuman still sells the Ring Air for about $349 (£329 in the UK).

## What does the Ultrahuman Ring Air measure — and how well?

The ring uses an optical sensor (PPG) on the inside of the finger. It reads heart rate and [HRV](/glossary/heart-rate-variability) continuously, updating every few minutes at rest, plus skin temperature, blood oxygen and movement. From these it builds sleep stages, a recovery score and daily readiness.

The night is where a ring is strongest. The finger gives a cleaner signal than the wrist, and you lie still. Published validation work on finger rings (mostly on Oura) shows nightly HRV close to an ECG. There is less independent research on the Ring Air itself, so we score it a little below Oura on accuracy. Daytime HRV during movement is a rough estimate on every ring. To read your numbers, compare them with [normal HRV by age](/articles/normal-hrv-by-age) — and, above all, with your own baseline.

## How much does the Ultrahuman Ring Air cost?

About **$349 one-time** outside the US. There is no membership: all features and your data history are included. Over two years that is cheaper than an Oura Ring 4 ($349 plus $5.99 per month). But if the battery fails after a year, the low total cost disappears — so check the warranty in your country before you buy.

| Ring | Price | Subscription | US availability |
|---|---|---|---|
| Ultrahuman Ring Air | ~$349 | none | banned since Oct 2025 |
| [Ultrahuman Ring Pro](/reviews/ultrahuman-ring-pro) | $479 | none | yes |
| [Oura Ring 4](/reviews/oura-ring-4) | from $349 | $5.99/month | yes |
| [RingConn Gen 2](/reviews/ringconn-gen-2) | $299 | none | yes |

## What are the downsides of the Ultrahuman Ring Air?

The main one is battery reliability. Through 2025 and 2026, reviewers and owners have reported Ring Air batteries losing capacity fast or dying within months. A recovery wearable has to work every night; a ring you cannot trust to last is a serious problem. The US ban is the second issue: no new US sales, and buying grey-import stock makes warranty claims harder. Data access is middling — some export, no fully open API — and there is no display.

## Who should buy the Ultrahuman Ring Air — and who should not?

**Buy it** if you live outside the US, want a very light ring with no subscription, and can buy from a seller with an easy return and warranty process.

**Skip it** if you are in the US (get the [Ring Pro](/reviews/ultrahuman-ring-pro) — see [Ring Pro vs Ring Air](/reviews/vs/ultrahuman-ring-pro-vs-ultrahuman-ring-air)), or if long-term reliability matters most to you. Then the [Oura Ring 4](/reviews/oura-ring-4) (see [Oura Ring 4 vs Ultrahuman Ring Air](/reviews/vs/oura-ring-4-vs-ultrahuman-ring-air)) or the cheaper [RingConn Gen 2](/reviews/ringconn-gen-2) (see [RingConn Gen 2 vs Ultrahuman Ring Air](/reviews/vs/ringconn-gen-2-vs-ultrahuman-ring-air)) are safer choices.

For the full field, see [the best HRV trackers of 2026](/reviews/compare/best-hrv-trackers-2026).

---

## Background reading

The science behind why HRV is the signal worth tracking — and how the body produces it.

- [Normal HRV by age](/articles/normal-hrv-by-age) — what a typical HRV looks like at your age, and why your own trend matters more
- [Resonant-frequency system coherence](/articles/resonant-frequency-system-coherence) — why 5.5–6 breaths per minute is the HRV-training sweet spot
- [Interoceptive precision and sensor calibration](/articles/interoceptive-precision-sensor-calibration) — why your own perception is the upstream baseline HRV measures against
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — HRV as the daily maintenance signal of the autonomic system
`,
  references: [
    { label: 'Ultrahuman Ring Air — official product page', url: 'https://www.ultrahuman.com/ring/' },
    { label: 'Oura: ITC patent ruling against Ultrahuman (Oura blog)', url: 'https://ouraring.com/blog/oura-itc-case/' },
    { label: 'TechRadar: Ultrahuman smart rings banned in the US', url: 'https://www.techradar.com/health-fitness/ultrahuman-smart-rings-have-just-been-banned-in-the-us-but-theres-better-news-for-ringconn-fans' },
    { label: 'TechCrunch: Ultrahuman unveils Ring Pro to win back the US market (Feb 2026)', url: 'https://techcrunch.com/2026/02/27/ultrahuman-unveils-new-smart-ring-as-it-awaits-u-s-clearance-after-oura-dispute/' },
    { label: 'Smart ring HRV and sleep validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=smart+ring+heart+rate+variability+sleep+validation' },
  ],
  relatedSlugs: ['ultrahuman-ring-pro', 'ultrahuman-m1', 'oura-ring-4', 'samsung-galaxy-ring', 'ringconn-gen-2'],
  faq: [
    { q: "Can I buy the Ultrahuman Ring Air in the US?", a: "No, the Ultrahuman Ring Air is banned from US sale as of October 2025 under an import ban following Oura's ITC patent win, so US buyers cannot purchase it. Ultrahuman's US-available successor is the Ring Pro, a one-time $479 with no subscription and a roughly 15-day battery that targets the reliability problem." },
    { q: "Is the Ultrahuman Ring Air reliable?", a: "The Ultrahuman Ring Air has a real reliability caveat: through 2026, reviewers and owners widely reported batteries degrading or failing within months. It scores just 5.5/10 on wearability for that reason, which undercuts its value at about $349 despite strong sleep tracking and continuous HRV." },
    { q: "Is the Ultrahuman Ring Air worth it?", a: "The Ultrahuman Ring Air scores 7.3/10 and does the fundamentals well: featherweight, subscription-free with lifelong data access, continuous HRV and strong sleep tracking. But battery-reliability reports erode the case at about $349. If long-term reliability is non-negotiable, the Oura Ring 4 or RingConn Gen 2 are safer choices." },
    { q: "Can you still buy an Ultrahuman Ring Air in the US in 2026?", a: "Not new from Ultrahuman. The ITC exclusion order has blocked imports since 21 October 2025; retailers could only sell existing stock, so what remains is leftover or used units. Ultrahuman still supports rings bought after the ban. For a new Ultrahuman ring in the US, buy the Ring Pro ($479, no subscription)." },
    { q: "What are the Ultrahuman Ring Air battery problems?", a: "Many owners and reviewers report Ring Air batteries losing capacity quickly or failing within months, so the ring needs charging far more often than promised. If you buy one, use a seller with an easy return process and keep proof of purchase for a warranty claim. The Ring Pro was redesigned with a much larger battery." },
    { q: "Does the Ultrahuman Ring Air need a subscription?", a: "No. The Ring Air is a one-time purchase of about $349 with no membership; all features and your data history are included. By comparison the Oura Ring 4 needs a $5.99/month membership for full data." },
  ],

  datePublished: '2026-05-15',
  dateModified: '2026-10-03',
}

export default ultrahumanRingAir
