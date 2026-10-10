import type { ToolReviewInput } from './types'

const veri: ToolReviewInput = {
  slug: 'veri',
  name: 'Veri',
  brand: 'Veri',
  category: 'cgm',
  productType: 'CGM coaching programme (Abbott Libre 3, EU-focused)',
  description:
    'ONDA review of Veri — the Helsinki-built CGM programme aimed at metabolic-health insight in EU markets. Scored on insights, accuracy, app and value.',
  verdict:
    'The strongest EU-focused CGM programme — clean app, solid insights, the right choice if Levels and Stelo are unavailable to you.',
  summary:
    'Veri is a Finnish CGM programme that does in EU markets what Levels does in the US — Abbott Libre 3 hardware (or Dexcom in selected regions) wrapped in a polished biohacker-oriented app. Strong meal scoring, time-in-range and AUC views. No human coach by default, but the app interface is tidy and the localisation is real. The right pick for European users who cannot access Levels or Stelo directly.',
  scores: [
    { criterionId: 'sensor-accuracy', score: 8.5, note: 'Abbott Libre 3 in EU markets (Dexcom in selected regions) — maker-reported MARD ~9% (maker figures do not count as evidence in ONDA scores), 14-day wear, calibration-free, 60-minute warm-up.' },
    { criterionId: 'insights', score: 7.5, note: 'Solid meal scoring, time-in-range, AUC and glucose-variability views. Cleaner than Lingo, less deep than Levels.' },
    { criterionId: 'coaching', score: 7.0, note: 'No human coach by default; the app is well-designed enough to compensate for most users. Higher-tier plans add coach access.' },
    { criterionId: 'app-integration', score: 8.0, note: 'Polished iOS/Android app. Apple Health, Garmin, Oura and MyFitnessPal integration. Multi-language support across EU markets.' },
    { criterionId: 'flexibility', score: 7.0, note: 'Monthly or annual subscription; annual locks the price. Raw glucose data export available.' },
    { criterionId: 'value', score: 7.0, note: '€199 (~$220) setup, €99–€129 (~$110–$145) per month. Mid-pack pricing for the EU.' },
  ],
  pros: [
    'The strongest EU-focused CGM programme — local availability where Levels is not',
    'Polished app with multi-language EU support',
    'Garmin, Oura and MyFitnessPal integration out of the box',
    'Raw glucose data export available',
  ],
  cons: [
    'Limited availability in the US market',
    'No human coach in the default plan',
    'Insight depth lags Levels for serious users',
    'Limited US availability',
  ],
  bestFor: 'Best for EU-market biohackers who want Levels-style insight in their region.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Veri product documentation, Abbott Libre 3 validation literature and independent 2026 EU-market reviews. Not hands-on tested by ONDA.',
  price: { usd: 220, note: '€199 setup + €99–€129/mo', asOf: '2026-05-21' },
  link: 'https://www.veri.co/',
  linkType: 'official',
  content: `## Where it leads

Veri is the CGM programme an EU biohacker reaches for when Levels is not an option. The app is polished, the integrations cover the wearables Europeans actually use (Garmin, Oura, Polar via export), and multi-language support is real rather than machine-translated. Meal scoring, time-in-range and AUC views are competent and clean. Crucially, raw glucose data export is supported — something Zoe and Lingo do not offer.

## What are the downsides of Veri?

In the US Veri competes against programmes shipping Dexcom G7; in an independent head-to-head study (Eichenlaub et al. 2025) the G7 and Libre 3 were similarly accurate, so the choice there comes down to the wrapper. Insight depth is one tier below Levels — there is no food-by-food ranking history or deep AUC decomposition. No human coach is included by default. As a general-purpose CGM tool it is solid; as the deepest biohacker instrument, it is not.

## Who should buy Veri?

Choose Veri if you are in an EU market and want a polished, locally-supported CGM programme with Garmin/Oura integration baked in. If you are in the US, Stelo (Dexcom G7, cheaper) or Levels (deepest insights) are better fits.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [Metabolic flexibility: what it is and how to tell](/articles/metabolic-flexibility-dual-fuel-system) — what a glucose curve can and cannot tell you about fuel switching
- [Energy sensor: leptin](/articles/energy-sensor-leptin) — why leptin sits behind the satiety patterns CGM curves draw
`,
  references: [
    { label: 'Veri — official site', url: 'https://www.veri.co/' },
    { label: 'Alva et al. 2023 — Accuracy of the third generation of a 14-day continuous glucose monitoring system (FreeStyle Libre 3; Diabetes Ther)', url: 'https://doi.org/10.1007/s13300-023-01385-6' },
  ],
  relatedSlugs: ['hello-inside', 'zoe', 'levels'],
  faq: [
    { q: "Is Veri worth it?", a: "Veri is worth it for EU biohackers who want Levels-style glucose insight where Levels isn't available. It has a polished multi-language app, Garmin, Oura and MyFitnessPal integration, and raw data export. Its insight depth lags Levels." },
    { q: "How much does Veri cost?", a: "Veri costs €199 for setup plus €99 to €129 per month. The default plan does not include a human coach, so the monthly fee covers the app, CGM insight and integrations with Garmin, Oura and MyFitnessPal." },
    { q: "Veri vs Levels: which is better?", a: "Levels offers deeper insight for serious users on Dexcom Stelo (G7-platform) hardware; in an independent head-to-head study it was similarly accurate to Veri's Libre 3. Veri wins on EU availability, multi-language support and integrations. Choose Veri if you are in the EU, Levels otherwise." },
    { q: "What are the downsides of Veri?", a: "Veri's default plan has no human coach, its insight depth lags Levels for serious users, and US availability is limited, so it mainly makes sense for EU buyers." },
  ],
  datePublished: '2026-05-21',
  dateModified: '2026-10-10',
}

export default veri
