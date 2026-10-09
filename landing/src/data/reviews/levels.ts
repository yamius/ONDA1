import type { ToolReviewInput } from './types'

const levels: ToolReviewInput = {
  slug: 'levels',
  name: 'Levels',
  brand: 'Levels Health',
  category: 'cgm',
  productType: 'CGM coaching programme (Dexcom Stelo)',
  description:
    'Levels review: the most polished biohacker CGM, built on Dexcom Stelo — best-in-class food-by-food insights now sold as tiered memberships from $15/month. Is it worth it?',
  verdict:
    'The most polished biohacker CGM programme — best-in-class insights, now in tiered memberships (from $80/year app-only to $1,329/year with labs and two months of CGM).',
  summary:
    'Levels is the CGM programme that defined the biohacker category. It ships Dexcom Stelo sensors (Dexcom’s over-the-counter CGM, no prescription needed) with an app whose food-by-food impact analysis, time-in-range scoring and meal-by-meal coaching are the deepest in the market. There is no human coach by default — Levels bets on app intelligence plus content from its medical advisory board. Levels has moved from a flat ~$199/month programme to tiered memberships: an app-only plan ($80/year), Core ($399/year with one month of CGM and two lab panels) and Complete ($1,329/year with two months of CGM, comprehensive labs and a nutritionist session). Continuous CGM beyond the included month(s) is an add-on. Members can also connect their own Stelo or Dexcom G7 (G7 needs a prescription, which Levels can arrange through partner physicians) or any CGM that syncs to Apple Health or Health Connect.',
  scores: [
    { criterionId: 'sensor-accuracy', score: 9.0, note: 'Dexcom Stelo — the OTC sensor built on the Dexcom G7 platform, among the most accurate consumer CGMs on independent comparison (G7-platform MARD ~8.2% versus reference). 15-day wear, 30-minute warm-up, no prescription. Score unchanged: the switch from G7 to Stelo keeps the same sensor platform.' },
    { criterionId: 'insights', score: 9.0, note: 'The deepest meal-impact analysis on the market — per-meal score, AUC, peak, time-to-baseline, plus daily/weekly time-in-range and glucose variability views.' },
    { criterionId: 'coaching', score: 7.5, note: 'No human coach included by default; the app is the coach, supported by a deep content library and a medical advisory board. Add-on coaching available separately.' },
    { criterionId: 'app-integration', score: 8.5, note: 'Polished iOS/Android app. Integrates with Apple Health and Oura; MyFitnessPal food logging supported.' },
    { criterionId: 'flexibility', score: 7.5, note: 'Monthly or annual billing; can pause. Raw data export available on request. No commitment beyond the current month.' },
    { criterionId: 'value', score: 7.5, note: 'Now tiered: $80/year app-only, $399/year Core (1 month CGM + 2 lab panels), $1,329/year Complete (2 months CGM + labs + nutritionist). Far cheaper entry than the old $199/month, but continuous CGM wear costs extra.' },
  ],
  pros: [
    'The deepest food-by-food insight analysis in the category',
    'Dexcom Stelo (G7 platform) — top-tier consumer CGM accuracy, no prescription needed',
    'Polished app and content library backed by a credible medical board',
    'Apple Health and Oura integration out of the box',
  ],
  cons: [
    'Core and Complete include only 1–2 months of CGM per year — continuous wear is an extra add-on',
    'No human coach in the default tier — app-only guidance',
    'US-only as of 2026',
    'Annual billing is the headline price; monthly works out the same only on annual commitment',
  ],
  bestFor: 'Best for serious biohackers who want the deepest CGM insight tool and will pay premium for it.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Levels product documentation and support articles, Dexcom G7-platform validation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 399, note: 'Core membership $399/year (1 month CGM + 2 lab panels); app-only $80/year; Complete $1,329/year; extra CGM is an add-on', asOf: '2026-09-30' },
  link: 'https://www.levels.com/',
  linkType: 'official',
  content: `## Where it leads

Levels is the programme that turned CGM into a consumer category for non-diabetics, and the app is still the most thoughtful piece of software in the field. Meals do not just appear on a timeline — each is scored, ranked against your own history, decomposed into peak [glucose spike](/glossary/glucose-spikes), AUC and time-to-baseline, and rolled into daily and weekly time-in-range views that train [metabolic flexibility](/glossary/metabolic-flexibility). The included sensor is now Dexcom Stelo — the over-the-counter, no-prescription sensor built on the Dexcom G7 platform, which independent MARD comparison puts at the top of the consumer-CGM accuracy ranking. The medical advisory board adds credibility most coaching-light programmes do not have.

## What are the downsides of Levels?

The pricing model is the thing to read carefully. Levels dropped its old ~$199-a-month all-in programme for tiered memberships: $80 a year for the app alone (bring your own CGM), $399 a year for Core with one month of CGM and two lab panels, and $1,329 a year for Complete with two months of CGM. The entry is far cheaper than before, but if you want to wear a sensor continuously you pay for extra CGM on top — or buy an OTC Dexcom Stelo or Abbott Lingo and use the app-only tier. There is no human coach by default; if a registered dietitian is part of what you need, Nutrisense is the right shape.

## Who should buy Levels?

Choose Levels if you treat CGM as an instrument rather than an experiment — you want the deepest insight engine, you trust app intelligence over human coaching, and you value labs plus periodic CGM blocks over continuous wear. If you only want the sensor and a simpler app, Dexcom Stelo or Lingo on their own is the cheaper tool. If human coaching is the priority, Nutrisense.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [Energy governor: TSH](/articles/energy-governor-tsh) — thyroid-driven metabolism as the upstream of glucose-handling capacity
- [GLP-1 biology and muscle preservation](/articles/glp1-biology-muscle-preservation) — what CGM data shows during GLP-1 protocol use
- [AI biomarker tracking](/articles/ai-biomarker-tracking-predictive) — CGM as the highest-density consumer biomarker stream available
`,
  references: [
    { label: 'Levels — official site', url: 'https://www.levels.com/' },
    { label: 'Garg et al. 2022 — Accuracy and safety of Dexcom G7 continuous glucose monitoring in adults with diabetes (Diabetes Technol Ther)', url: 'https://doi.org/10.1089/dia.2022.0011' },
  ],
  relatedSlugs: ['ultrahuman-m1', 'nutrisense', 'stelo', 'zoe'],
  faq: [
    { q: "How much does Levels cost?", a: "As of September 2026 Levels sells tiered memberships: about $80 per year for the app alone (bring your own CGM), $399 per year for Core (one month of CGM plus two lab panels) and $1,329 per year for Complete (two months of CGM, comprehensive labs and a nutritionist session). Extra CGM months are an add-on. The old flat ~$199-a-month programme is gone." },
    { q: "Does Levels include a coach?", a: "No. There is no human coach in the default tier. Levels relies on app intelligence, with food-by-food impact analysis, time-in-range scoring and meal-by-meal guidance, plus content from its medical advisory board. Users who want human coaching should look at other programmes." },
    { q: "Levels vs Lingo: which CGM should I choose?", a: "Levels gives the deepest insights and ships Dexcom Stelo (G7 platform, slightly more accurate than Libre 3), but is a membership (from $80 a year app-only to $1,329 a year) and is US-only. Lingo needs no subscription and is the cheapest legitimate entry, offering a simpler per-meal score on Libre 3. Choose Levels for depth, Lingo for cost." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-10-10',
}

export default levels
