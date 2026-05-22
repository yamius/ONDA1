import type { ToolReview } from './types'

const lingo: ToolReview = {
  slug: 'lingo',
  name: 'Lingo by Abbott',
  brand: 'Abbott',
  category: 'cgm',
  productType: 'OTC CGM (Abbott Libre 3 consumer variant)',
  description:
    'ONDA review of Lingo — Abbott’s direct-to-consumer CGM built on Libre 3 hardware, sold OTC without a prescription. Scored on accuracy, insights, flexibility and value.',
  verdict:
    'Abbott’s Libre hardware sold without a prescription — the simplest entry into CGM at the lowest single-sensor price.',
  summary:
    'Lingo is Abbott’s direct-to-consumer CGM, sold over the counter (no prescription) with Libre 3 hardware and an app aimed at metabolic-health beginners. Two-week sensors at roughly $49 each, no subscription required. The app focuses on a single “Lingo Count” metric per meal rather than the deep analytics of Levels. The right entry point if cost and simplicity matter more than insight depth.',
  overallScore: 7.2,
  scores: [
    { criterionId: 'sensor-accuracy', score: 8.5, note: 'Abbott Libre 3 — MARD ~9%, 14-day wear, calibration-free, 60-minute warm-up. Marginally less accurate than Dexcom G7 in independent comparison.' },
    { criterionId: 'insights', score: 7.0, note: 'Built around a single per-meal “Lingo Count” spike score. Simpler than Levels — easier for beginners, frustrating for advanced users.' },
    { criterionId: 'coaching', score: 5.0, note: 'Minimal — in-app guidance only, no coach. Abbott bet on simplicity over coaching.' },
    { criterionId: 'app-integration', score: 7.5, note: 'Clean iOS/Android app with Apple Health and Google Fit support. Limited third-party connectors compared with Levels.' },
    { criterionId: 'flexibility', score: 8.5, note: 'No subscription required — buy single 2-week sensors as needed at $49 each, or a 4-pack at $89. The most flexible commercial CGM in this list.' },
    { criterionId: 'value', score: 9.0, note: '$49 per 2-week sensor (~$98/month) or $89 for 4 sensors on subscription (~$22/month effective). The cheapest legitimate CGM access in the US.' },
  ],
  pros: [
    'No prescription, no subscription — buy single sensors as you need them',
    'Cheapest legitimate consumer CGM access in the US',
    'Abbott Libre 3 — reliable 14-day wear, calibration-free',
    'Clean app aimed at first-time CGM users',
  ],
  cons: [
    'Insight engine simpler than Levels — just a per-meal spike score',
    'No human coach available at any tier',
    'Limited third-party integration compared with Levels',
    'Libre 3 accuracy lags Dexcom G7 in independent comparison',
  ],
  bestFor: 'Best for first-time CGM users who want the cheapest legitimate entry without subscription.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Abbott Lingo product documentation, Libre 3 validation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 49, note: '$49 per 2-week sensor, or $89 for 4 (~$22/mo effective)', asOf: '2026-05-21' },
  link: 'https://www.hellolingo.com/',
  linkType: 'official',
  content: `## Where it leads

Lingo is the cheapest legitimate path into CGM for a US non-diabetic. Abbott’s Libre 3 sensor — the same reliable 14-day platform used by Ultrahuman M1, Veri and Hello Inside — sold OTC without a prescription, with no subscription requirement. A single sensor is $49; a four-pack drops the effective monthly cost to about $22. The app is deliberately simple: a per-meal “Lingo Count” spike score rather than a deep analytics suite. For a first-time CGM user who wants to experiment without committing to a $200-a-month programme, that simplicity is the value.

## Where it falls short

It is a beginner tool. The single-score insight layer becomes frustrating once you have learned to read your own curves — there is no AUC decomposition, no food-by-food ranking history, no coaching. The third-party integration list is short, and Libre 3 accuracy lags Dexcom G7 marginally in independent comparison. As an instrument for ongoing biohacker self-experimentation, Lingo is the entry point, not the destination.

## Who it is for

Choose Lingo if you have never worn a CGM and want the lowest-cost legitimate way to find out whether it changes anything for you. If you have outgrown the beginner framing and want depth, Levels or Stelo are the natural next steps.`,
  references: [
    { label: 'Lingo — official site', url: 'https://www.hellolingo.com/' },
    { label: 'Abbott FreeStyle Libre 3 accuracy validation (J Diabetes Sci Technol)', url: 'https://journals.sagepub.com/doi/10.1177/19322968221101632' },
  ],
  relatedSlugs: ['stelo', 'levels', 'ultrahuman-m1'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default lingo
