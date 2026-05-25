import type { ToolReview } from './types'

const signos: ToolReview = {
  slug: 'signos',
  name: 'Signos',
  brand: 'Signos',
  category: 'cgm',
  productType: 'AI-driven CGM weight-loss programme (Dexcom G7)',
  description:
    'ONDA review of Signos — the AI-driven CGM programme focused on weight loss through real-time glucose-curve coaching. Scored on insights, coaching and value.',
  verdict:
    'The most weight-loss-focused CGM programme — Dexcom G7 plus an AI agent that pushes meal-by-meal recommendations.',
  summary:
    'Signos is the CGM programme built for weight loss rather than general biohacker insight. Hardware is Dexcom G7; the differentiator is an AI agent that watches glucose curves in real time and pushes meal-by-meal recommendations through the app. Insights focus on glucose spikes that drive insulin and weight gain, with strong food-logging and exercise-prompt integration. Less academic than Levels, more behaviourally directive.',
  overallScore: 7.4,
  scores: [
    { criterionId: 'sensor-accuracy', score: 9.0, note: 'Dexcom G7 — MARD ~8.2%, 10-day wear, 30-minute warm-up. Same hardware as Levels and Stelo.' },
    { criterionId: 'insights', score: 8.0, note: 'Strong on glucose-spike interpretation and meal scoring; weight-loss framing throughout. Less general-purpose than Levels.' },
    { criterionId: 'coaching', score: 7.0, note: 'AI agent surfaces meal-by-meal nudges and exercise prompts in real time. No human RD by default; some plans include access.' },
    { criterionId: 'app-integration', score: 7.5, note: 'Polished app with food logging and exercise integration. Apple Health support; narrower third-party stack than Levels.' },
    { criterionId: 'flexibility', score: 6.5, note: 'Monthly or annual subscription; annual is locked. Pause supported. Raw data export available.' },
    { criterionId: 'value', score: 6.5, note: '$140–$160/month including sensors. Cheaper than Levels, more expensive than Stelo.' },
  ],
  pros: [
    'Best AI-coaching loop in the category — real-time meal and exercise nudges',
    'Dexcom G7 hardware — same accuracy ceiling as Levels',
    'Weight-loss outcomes documented in company-published case data',
    'Cheaper than Levels with similar accuracy',
  ],
  cons: [
    'Weight-loss framing may not fit users who want general biohacker insight',
    'No human RD in the default plan',
    'Insight engine less academically deep than Levels',
    'Annual commitment locks the price',
  ],
  bestFor: 'Best for users whose primary CGM goal is weight loss and who respond to AI coaching nudges.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Signos product documentation, Dexcom G7 validation literature, company-published outcome data and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 140, note: '$140–$160/mo including Dexcom G7 sensors', asOf: '2026-05-21' },
  link: 'https://www.signos.com/',
  linkType: 'official',
  content: `## Where it leads

Signos is the CGM programme that picked a specific job — weight loss — and built around it. The Dexcom G7 sensor underneath is the same one Levels and Nutrisense ship, but the app is the difference: an AI agent watches glucose curves in real time and pushes meal-by-meal recommendations, exercise nudges and snack-stack suggestions through notifications. The framing is consistent: glucose spikes drive insulin, insulin drives fat storage, and the app helps you flatten the curves that matter.

## Where it falls short

That same focus is the limit. If you want general biohacker insight — flow-state glucose stability, fasting metabolic adaptation, post-workout recovery curves — Levels gives you a more open analytical frame. The default plan has no human coach; access to a registered dietitian is a separate tier. Annual commitment locks the price even if the programme stops fitting your goals.

## Who it is for

Choose Signos if weight loss is the primary reason you are wearing a CGM and you respond well to in-app AI nudges. If you want a deeper general-purpose insight engine, Levels. If you want a human coach, Nutrisense. The hardware is the same in all three — pick on what sits above it.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [GLP-1 biology and muscle preservation](/articles/glp1-biology-muscle-preservation) — what CGM data shows during GLP-1 protocol use
- [AI biomarker tracking](/articles/ai-biomarker-tracking-predictive) — CGM as the highest-density consumer biomarker stream available
- [Continuous hormone monitoring](/articles/chm-continuous-hormone-monitoring) — why CGM is the closest consumer product to the hormone-stream future
`,
  references: [
    { label: 'Signos — official site', url: 'https://www.signos.com/' },
    { label: 'Signos outcome data summary', url: 'https://www.signos.com/science' },
    { label: 'Dexcom G7 accuracy validation (Diabetes Technology & Therapeutics)', url: 'https://www.liebertpub.com/doi/10.1089/dia.2023.0218' },
  ],
  relatedSlugs: ['levels', 'nutrisense', 'stelo'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default signos
