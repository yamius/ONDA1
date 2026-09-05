import type { ToolReview } from './types'

const levels: ToolReview = {
  slug: 'levels',
  name: 'Levels',
  brand: 'Levels Health',
  category: 'cgm',
  productType: 'CGM coaching programme (Dexcom G7)',
  description:
    'Levels review: the most polished biohacker CGM, built on Dexcom G7 — best-in-class food-by-food insights at the steepest price in the category. Is it worth it?',
  verdict:
    'The most polished biohacker CGM programme — best-in-class insights at the highest price in the category.',
  summary:
    'Levels is the CGM programme that defined the biohacker category. It ships Dexcom G7 sensors with an app whose food-by-food impact analysis, time-in-range scoring and meal-by-meal coaching are the deepest in the market. There is no human coach by default — Levels bets on app intelligence plus content from its medical advisory board. At roughly $199 a month it is the most expensive consumer CGM programme; the experience justifies it for serious users.',
  overallScore: 8.4,
  scores: [
    { criterionId: 'sensor-accuracy', score: 9.0, note: 'Dexcom G7 — the most accurate consumer CGM on independent comparison, MARD ~8.2% versus reference. 10-day wear, 30-minute warm-up.' },
    { criterionId: 'insights', score: 9.0, note: 'The deepest meal-impact analysis on the market — per-meal score, AUC, peak, time-to-baseline, plus daily/weekly time-in-range and glucose variability views.' },
    { criterionId: 'coaching', score: 7.5, note: 'No human coach included by default; the app is the coach, supported by a deep content library and a medical advisory board. Add-on coaching available separately.' },
    { criterionId: 'app-integration', score: 8.5, note: 'Polished iOS/Android app. Integrates with Apple Health and Oura; MyFitnessPal food logging supported.' },
    { criterionId: 'flexibility', score: 7.5, note: 'Monthly or annual billing; can pause. Raw data export available on request. No commitment beyond the current month.' },
    { criterionId: 'value', score: 5.5, note: '$199/month including sensors (~$2,388/year) — the most expensive consumer CGM programme by a meaningful margin.' },
  ],
  pros: [
    'The deepest food-by-food insight analysis in the category',
    'Dexcom G7 — the most accurate consumer CGM hardware',
    'Polished app and content library backed by a credible medical board',
    'Apple Health and Oura integration out of the box',
  ],
  cons: [
    'Most expensive consumer CGM programme — ~$2,400/year',
    'No human coach in the default tier — app-only guidance',
    'US-only as of 2026',
    'Annual commitment beats monthly on price, locking in the cost',
  ],
  bestFor: 'Best for serious biohackers who want the deepest CGM insight tool and will pay premium for it.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Levels product documentation, Dexcom G7 validation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 199, note: '$199/mo including Dexcom G7 sensors; $2,388/year annual', asOf: '2026-05-21' },
  link: 'https://www.levels.com/',
  linkType: 'official',
  content: `## Where it leads

Levels is the programme that turned CGM into a consumer category for non-diabetics, and the app is still the most thoughtful piece of software in the field. Meals do not just appear on a timeline — each is scored, ranked against your own history, decomposed into peak [glucose spike](/glossary/glucose-spikes), AUC and time-to-baseline, and rolled into daily and weekly time-in-range views that train [metabolic flexibility](/glossary/metabolic-flexibility). The underlying hardware is Dexcom G7, which independent MARD comparison puts at the top of the consumer-CGM accuracy ranking. The medical advisory board adds credibility most coaching-light programmes do not have.

## Where it falls short

Price is the deciding constraint. At $199 a month — $2,388 a year — Levels is roughly twice the cost of the OTC Dexcom Stelo programme that uses the same sensor, and three times the cost of an Abbott Lingo subscription. The trade is real depth of insight, but it is also out of reach for anyone who is curious rather than committed. There is no human coach by default; if a registered dietitian is part of what you need, Nutrisense is the right shape.

## Who it is for

Choose Levels if you treat CGM as an instrument rather than an experiment — you want the deepest insight engine, you trust app intelligence over human coaching, and the cost is acceptable for what is essentially a year of food-by-food research on yourself. If price matters and you want most of the insight at a third of the cost, Dexcom Stelo is the right tool. If human coaching is the priority, Nutrisense.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [Energy governor: TSH](/articles/energy-governor-tsh) — thyroid-driven metabolism as the upstream of glucose-handling capacity
- [GLP-1 biology and muscle preservation](/articles/glp1-biology-muscle-preservation) — what CGM data shows during GLP-1 protocol use
- [AI biomarker tracking](/articles/ai-biomarker-tracking-predictive) — CGM as the highest-density consumer biomarker stream available
`,
  references: [
    { label: 'Levels — official site', url: 'https://www.levels.com/' },
    { label: 'Dexcom G7 accuracy validation (Diabetes Technology & Therapeutics)', url: 'https://www.liebertpub.com/doi/10.1089/dia.2023.0218' },
  ],
  relatedSlugs: ['ultrahuman-m1', 'nutrisense', 'stelo', 'zoe'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default levels
