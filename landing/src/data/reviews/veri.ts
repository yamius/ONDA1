import type { ToolReview } from './types'

const veri: ToolReview = {
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
  overallScore: 7.3,
  scores: [
    { criterionId: 'sensor-accuracy', score: 8.5, note: 'Abbott Libre 3 in EU markets (Dexcom in selected regions) — MARD ~9%, 14-day wear, calibration-free, 60-minute warm-up.' },
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
    'Libre 3 accuracy lags Dexcom G7 in the US market',
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

## Where it falls short

In the US Veri competes against programmes shipping Dexcom G7, which lags Libre 3 only marginally but lags it consistently in independent comparison. Insight depth is one tier below Levels — there is no food-by-food ranking history or deep AUC decomposition. No human coach is included by default. As a general-purpose CGM tool it is solid; as the deepest biohacker instrument, it is not.

## Who it is for

Choose Veri if you are in an EU market and want a polished, locally-supported CGM programme with Garmin/Oura integration baked in. If you are in the US, Stelo (Dexcom G7, cheaper) or Levels (deepest insights) are better fits.`,
  references: [
    { label: 'Veri — official site', url: 'https://www.veri.co/' },
    { label: 'Abbott FreeStyle Libre 3 accuracy validation (J Diabetes Sci Technol)', url: 'https://journals.sagepub.com/doi/10.1177/19322968221101632' },
  ],
  relatedSlugs: ['hello-inside', 'zoe', 'levels'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default veri
