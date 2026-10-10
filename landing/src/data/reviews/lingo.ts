import type { ToolReviewInput } from './types'

const lingo: ToolReviewInput = {
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
    'Lingo is Abbott’s direct-to-consumer CGM, sold over the counter (no prescription) with Libre 3 hardware and an app aimed at metabolic-health beginners. Two-week sensors at $54 each, no subscription required. The app focuses on a single “Lingo Count” metric per meal rather than the deep analytics of Levels. The right entry point if cost and simplicity matter more than insight depth.',
  scores: [
    { criterionId: 'sensor-accuracy', score: 8.5, note: 'Abbott Libre 3-based sensor — 14-day wear, calibration-free, 60-minute warm-up. In an independent head-to-head study (Eichenlaub et al. 2025) Libre 3 and Dexcom G7 were similarly accurate. Lingo presents itself honestly: the site says it is “NOT intended for diagnosis of diseases, including diabetes” and makes no clinical overclaims.' },
    { criterionId: 'insights', score: 7.0, note: 'Built around a single per-meal “Lingo Count” spike score. Simpler than Levels — easier for beginners, frustrating for advanced users.' },
    { criterionId: 'coaching', score: 5.0, note: 'Minimal — in-app guidance only, no coach. Abbott bet on simplicity over coaching.' },
    { criterionId: 'app-integration', score: 7.5, note: 'Clean iOS/Android app with Apple Health and Google Fit support. Limited third-party connectors compared with Levels.' },
    { criterionId: 'flexibility', score: 8.5, note: 'No subscription required — buy single 2-week sensors as needed at $54 each, or multi-sensor plans. The most flexible commercial CGM in this list.' },
    { criterionId: 'value', score: 9.0, note: '$54 per 2-week sensor with no commitment; multi-sensor and subscription plans lower the per-sensor cost. Among the cheapest legitimate CGM access in the US.' },
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
    '60-minute sensor warm-up, twice Stelo’s 30 minutes',
  ],
  bestFor: 'Best for first-time CGM users who want the cheapest legitimate entry without subscription.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Abbott Lingo product documentation, Libre 3 validation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 54, note: '$54 for a 2-week plan (1 sensor, no auto-renew); multi-sensor/subscription plans cost less per sensor', asOf: '2026-09-30' },
  link: 'https://www.hellolingo.com/',
  linkType: 'official',
  content: `## Where it leads

Lingo is the cheapest legitimate path into CGM for a US non-diabetic. Abbott’s Libre 3 sensor — the same reliable 14-day platform used by Ultrahuman M1, Veri and Hello Inside — sold OTC without a prescription, with no subscription requirement. A single two-week sensor is $54 with no commitment; multi-sensor and subscription plans bring the per-sensor cost down. The app is deliberately simple: a per-meal “Lingo Count” spike score rather than a deep analytics suite. For a first-time CGM user who wants to experiment without committing to a $200-a-month programme, that simplicity is the value.

## What are the downsides of the Lingo?

It is a beginner tool. The single-score insight layer becomes frustrating once you have learned to read your own curves — there is no AUC decomposition, no food-by-food ranking history, no coaching. The third-party integration list is short, and the 60-minute sensor warm-up is twice Stelo’s 30 minutes. As an instrument for ongoing biohacker self-experimentation, Lingo is the entry point, not the destination.

## Who should buy the Lingo?

Choose Lingo if you have never worn a CGM and want the lowest-cost legitimate way to find out whether it changes anything for you. If you have outgrown the beginner framing and want depth, Levels or Stelo are the natural next steps.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [Can you track cortisol continuously yet?](/articles/chm-continuous-hormone-monitoring) — why no consumer wearable measures hormones today, unlike glucose
- [The gut-brain axis as a data link](/articles/gut-brain-axis-data-link) — where microbiome and glucose patterns meet
- [Metabolic flexibility: what it is and how to tell](/articles/metabolic-flexibility-dual-fuel-system) — what a glucose curve can and cannot tell you about fuel switching
`,
  references: [
    { label: 'Lingo — official site', url: 'https://www.hellolingo.com/' },
    { label: 'Alva et al. 2023 — Accuracy of the third generation of a 14-day continuous glucose monitoring system (FreeStyle Libre 3; Diabetes Ther)', url: 'https://doi.org/10.1007/s13300-023-01385-6' },
  ],
  relatedSlugs: ['stelo', 'levels', 'ultrahuman-m1'],
  faq: [
    { q: "Do you need a prescription for Lingo?", a: "No. Lingo is Abbott's over-the-counter CGM, sold without a prescription or subscription. It uses Libre 3 hardware with reliable, calibration-free 14-day wear, and you simply buy sensors as you need them. It is the cheapest legitimate consumer CGM access in the US." },
    { q: "How much does Lingo cost?", a: "Lingo costs $54 for a two-week plan (one sensor, no auto-renew), with multi-sensor and subscription plans that cost less per sensor. No subscription is required: you can buy single sensors as you need them. That makes it the lowest-cost entry into continuous glucose monitoring for a US non-diabetic." },
    { q: "Lingo vs Levels: which is better?", a: "Lingo is cheaper and simpler: no subscription, and one Lingo Count score per meal. Levels offers far deeper analytics on Dexcom Stelo (G7 platform), as a membership from about $80 a year (app-only) to $1,329 a year. Neither includes a human coach. Choose Lingo if cost and simplicity matter more than insight depth." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-10-10',
}

export default lingo
