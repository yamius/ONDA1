import type { ToolReview } from './types'

const supersapiens: ToolReview = {
  slug: 'supersapiens',
  name: 'Supersapiens',
  brand: 'TT1 Products / Abbott',
  category: 'cgm',
  productType: 'Athlete-focused CGM (Abbott Libre Sense, EU only)',
  description:
    'ONDA review of Supersapiens — the athlete-focused CGM programme built on Abbott’s Libre Sense sport sensor. EU-only after the US exit. Scored on insights, sport relevance and value.',
  verdict:
    'The only CGM programme designed natively for athletic performance — race-day glucose pacing, restricted to EU markets.',
  summary:
    'Supersapiens is the only CGM programme in this list aimed at endurance athletic performance rather than general metabolic health. Hardware is Abbott’s Libre Sense — a sport-tuned variant of the Libre sensor. The app emphasises race-day glucose pacing, fuelling timing and intra-session fuelling rather than meal scoring. After regulatory friction in the US the programme is EU-only as of 2026. Niche but well-executed for its audience.',
  overallScore: 6.7,
  scores: [
    { criterionId: 'sensor-accuracy', score: 8.0, note: 'Abbott Libre Sense — sport-tuned variant of Libre, MARD ~9%, 14-day wear. Adequate for performance trending; not a clinical instrument.' },
    { criterionId: 'insights', score: 7.5, note: 'Sport-specific: race-day glucose pacing, intra-session fuelling targets, recovery-window glycaemic profiles. No food-by-food meal scoring for general nutrition.' },
    { criterionId: 'coaching', score: 5.0, note: 'No coach — athletic content library only. The programme assumes a coached athlete already.' },
    { criterionId: 'app-integration', score: 7.5, note: 'Strava, Garmin, TrainingPeaks integration — the right stack for endurance athletes. No general health-app integration.' },
    { criterionId: 'flexibility', score: 5.5, note: 'EU only as of 2026 after US regulatory exit. Subscription required for access to the app once the sensor is on.' },
    { criterionId: 'value', score: 6.5, note: '€250+ device plus sensor refills (~€100/month). Niche pricing for a niche audience.' },
  ],
  pros: [
    'The only CGM programme designed natively for endurance athletes',
    'Strava, Garmin and TrainingPeaks integration out of the box',
    'Race-day glucose-pacing tools no other programme offers',
    'Abbott manufacturing pedigree on the sport-tuned Libre Sense',
  ],
  cons: [
    'EU only as of 2026 — withdrew from the US market',
    'No general-nutrition meal scoring — pure performance focus',
    'No coaching layer at any tier',
    'Niche audience limits long-term product investment',
  ],
  bestFor: 'Best for endurance athletes in EU markets who want race-day glucose pacing in their wearable stack.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Supersapiens product documentation, Abbott Libre Sense specifications and independent 2026 endurance-sport reviews. Not hands-on tested by ONDA.',
  price: { usd: 110, note: '€250+ device + ~€100/mo sensor subscription, EU only', asOf: '2026-05-21' },
  link: 'https://www.supersapiens.com/',
  linkType: 'official',
  content: `## Where it leads

Supersapiens is the only CGM programme in this list aimed at the endurance-athletic use case rather than general metabolic health. The Libre Sense sensor under it is Abbott’s sport-tuned Libre variant, and the app reframes glucose data accordingly: race-day fuelling targets, intra-session glycaemic dips, recovery-window curves, all integrated with Strava, Garmin and TrainingPeaks. For a triathlete or cyclist already coached on power and HR, adding glucose is a clean fit.

## Where it falls short

The programme is regulatorily marooned. Supersapiens withdrew from the US in 2022–2023 after FDA friction over its general-purpose claims, and 2026 availability remains EU-only. There is no meal-by-meal scoring for general nutrition — the entire framing assumes you already have a sport context. No coaching is included.

## Who it is for

Choose Supersapiens if you are an endurance athlete in an EU market who wants race-day glucose pacing in your Garmin/TrainingPeaks stack. For general biohacker insight, this is the wrong shape — Levels, Stelo or Veri are the right fits. If you are in the US, Supersapiens is not currently an option.`,
  references: [
    { label: 'Supersapiens — official site', url: 'https://www.supersapiens.com/' },
    { label: 'Abbott Libre Sense — sport sensor specification', url: 'https://www.freestyle.abbott/uk-en/libre-sense.html' },
  ],
  relatedSlugs: ['veri', 'hello-inside', 'lingo'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default supersapiens
