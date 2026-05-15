import type { ToolReview } from './types'

const ultrahumanRingAir: ToolReview = {
  slug: 'ultrahuman-ring-air',
  name: 'Ultrahuman Ring Air',
  brand: 'Ultrahuman',
  category: 'hrv-wearable',
  productType: 'Smart ring',
  description:
    'ONDA review of the Ultrahuman Ring Air — a featherweight, subscription-free HRV ring with a real reliability caveat. Scored on accuracy, data and value.',
  verdict:
    'A featherweight, subscription-free ring with strong sleep tracking — undercut by widespread reports of batteries failing within months.',
  summary:
    'The Ultrahuman Ring Air does the fundamentals well — light, subscription-free, continuous HRV and strong sleep tracking. But it is hard to recommend without reservation: through 2026, batteries failing within months have been a widely reported problem.',
  overallScore: 7.3,
  scores: [
    { criterionId: 'hrv-accuracy', score: 8.0, note: 'Continuous HRV (SDNN and RMSSD), updated every couple of minutes at rest — a genuinely continuous overnight signal.' },
    { criterionId: 'sensor', score: 7.5, note: 'Optical PPG in a very light ring; a clean signal at rest.' },
    { criterionId: 'sleep-accuracy', score: 8.0, note: 'Strong sleep tracking — early third-party checks put sleep-stage agreement high, among the better rings.' },
    { criterionId: 'data-access', score: 6.5, note: 'Lifelong access to your own data plus some export, but no truly open API.' },
    { criterionId: 'wearability', score: 5.5, note: 'Featherweight and comfortable — but widely reported battery failures within months undercut its reliability as a 24/7 device.' },
    { criterionId: 'app-ux', score: 7.5, note: 'A capable app, extensible through add-on "PowerPlugs".' },
    { criterionId: 'value', score: 6.5, note: 'No subscription is a real plus, but the battery-reliability reports erode the case at 350 USD.' },
  ],
  pros: [
    'Featherweight, very comfortable for 24/7 wear',
    'No subscription — lifelong access to your data',
    'Continuous HRV and strong sleep tracking',
    'Capable, extensible app',
  ],
  cons: [
    'Widely reported battery failures within months',
    'Reliability concerns undercut the value at 350 USD',
    'Data access is middling — no fully open API',
    'No display',
  ],
  bestFor: 'Best for a featherweight, subscription-free ring — if you accept the battery-reliability risk.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from manufacturer specifications, independent 2026 reviews and published validation literature. Not hands-on tested by ONDA.',
  price: { usd: 350, note: 'one-time; no subscription', asOf: '2026-05-15' },
  link: 'https://www.ultrahuman.com/ring/',
  linkType: 'official',
  content: `## Where it leads

The Ultrahuman Ring Air gets the fundamentals right. It is one of the lightest rings you can wear, it samples HRV continuously — updating every couple of minutes at rest — and there is no subscription: the purchase buys lifelong access to the ring and your own data. Early third-party checks have put its sleep-stage agreement high, and the app, built around add-on "PowerPlugs", is genuinely capable.

## Where it falls short

One issue is hard to set aside. Through 2026, reviewers and owners have reported Ultrahuman Ring Air batteries degrading or failing within months — and a recovery wearable you cannot trust to last is a serious problem, whatever its readings look like on a good day. Data access is also middling: better than a fully closed ecosystem, short of a truly open one.

## Who it is for

Choose the Ultrahuman Ring Air if a featherweight, subscription-free ring with strong sleep tracking is what you want — and go in aware of the battery-reliability reports, ideally buying somewhere with a clear return and warranty path. If long-term reliability is non-negotiable, the Oura Ring 4 or RingConn Gen 2 are safer rings.`,
  references: [
    { label: 'Ultrahuman Ring Air — official product page', url: 'https://www.ultrahuman.com/ring/' },
    { label: 'Smart ring HRV and sleep validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=smart+ring+heart+rate+variability+sleep+validation' },
  ],
  relatedSlugs: ['oura-ring-4', 'samsung-galaxy-ring', 'ringconn-gen-2'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default ultrahumanRingAir
