import type { ToolReview } from './types'

const stelo: ToolReview = {
  slug: 'stelo',
  name: 'Stelo by Dexcom',
  brand: 'Dexcom',
  category: 'cgm',
  productType: 'OTC CGM (Dexcom G7 hardware, consumer app)',
  description:
    'ONDA review of Stelo — Dexcom’s FDA-cleared OTC CGM for non-diabetics. The Dexcom G7 sensor without a prescription gate. Scored on accuracy, insights, flexibility and value.',
  verdict:
    'Dexcom G7 hardware with no prescription gate — the most accurate consumer CGM at the lowest price for it.',
  summary:
    'Stelo is Dexcom’s direct-to-consumer CGM for non-diabetic biohackers, cleared by the FDA in 2024 as the first OTC CGM in the US. Hardware is the Dexcom G7 sensor — the same sensor underneath Levels and Nutrisense — sold through Dexcom’s own app at $99 for two sensors (a one-month supply). Insight engine is simpler than Levels but the data is the same. The price-to-accuracy ratio is the best in the consumer CGM market.',
  overallScore: 7.6,
  scores: [
    { criterionId: 'sensor-accuracy', score: 9.0, note: 'Dexcom G7, the same hardware Levels and Nutrisense ride on — MARD ~8.2%, 15-day wear in the Stelo variant, 30-minute warm-up.' },
    { criterionId: 'insights', score: 7.0, note: 'Solid meal-impact and daily time-in-range views. Less depth than Levels — no AUC decomposition or food-ranking history — but covers what most users need.' },
    { criterionId: 'coaching', score: 5.5, note: 'No human coach; in-app AI guidance and educational content only. Coaching is the trade for the price.' },
    { criterionId: 'app-integration', score: 7.5, note: 'Dexcom Stelo app on iOS/Android with Apple Health integration. Limited third-party connectors compared with Levels.' },
    { criterionId: 'flexibility', score: 8.0, note: 'Buy one or many — no subscription required, sensors purchased as needed. 15-day wear gives more flexibility than 10-day G7 in Levels/Nutrisense.' },
    { criterionId: 'value', score: 8.5, note: '$99 for two sensors (~30 days) or $89 on subscription. The best price for Dexcom G7 hardware available, no prescription required.' },
  ],
  pros: [
    'Dexcom G7 hardware — same accuracy ceiling as Levels and Nutrisense',
    'FDA-cleared OTC — no prescription, no coaching subscription required',
    'Cheapest way to put Dexcom on your body',
    '15-day sensor wear in the Stelo variant — longer than standard G7',
  ],
  cons: [
    'Insight engine simpler than Levels — no food-by-food ranking history',
    'No human coach available — app-only guidance',
    'US-only (Dexcom-direct shipping)',
    'Limited third-party app integration compared with Levels',
  ],
  bestFor: 'Best for biohackers who want Dexcom G7 accuracy at the best price, without a coaching subscription.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Dexcom Stelo product documentation, Dexcom G7 validation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 99, note: '$99 for 2 sensors (~30 days), $89/mo on subscription; no Rx', asOf: '2026-05-21' },
  link: 'https://www.stelo.com/',
  linkType: 'official',
  content: `## Where it leads

Stelo is the cheapest legitimate way to put Dexcom G7 on your arm and watch your [glucose spikes](/glossary/glucose-spikes) in real time. The hardware is identical to what Levels and Nutrisense ship at two to three times the price — the same sensor, the same accuracy ceiling (MARD ~8.2% in independent comparison), the same 30-minute warm-up. What you give up is the wrapper: Stelo’s app is competent rather than category-leading, the coaching layer is in-app AI rather than a registered dietitian, and the integration ecosystem is narrower than Levels. As an OTC product cleared by the FDA in 2024 it requires no prescription, and you can buy sensors one pack at a time.

## Where it falls short

The insight engine is the trade. Stelo gives meal-impact and time-in-range views; Levels adds AUC decomposition, food-by-food ranking history and a deeper analytics suite. There is no human coach, the third-party integration list is shorter, and US-only Dexcom-direct shipping limits international availability. If those features are the reason you are buying, Stelo is not the right tool.

## Who it is for

Choose Stelo if you want the most accurate CGM hardware available at the best price and you trust yourself to interpret the data. If you want the deepest insight engine on top of the same sensor, Levels. If you want a registered dietitian, Nutrisense. The hardware is identical in all three cases — you are paying for what sits above it.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [The gut-brain axis as a data link](/articles/gut-brain-axis-data-link) — where microbiome and glucose patterns meet
- [Metabolic flexibility and the dual-fuel system](/articles/metabolic-flexibility-dual-fuel-system) — why fat-to-glucose switching is the metric CGM data makes visible
- [Metabolic redundancy and hybrid power architecture](/articles/metabolic-redundancy-hybrid-power-architecture) — reading glucose curves as the runtime state of your fuel substrates
`,
  references: [
    { label: 'Stelo — official site', url: 'https://www.stelo.com/' },
    { label: 'FDA — Stelo OTC CGM authorisation summary', url: 'https://www.fda.gov/news-events/press-announcements/fda-clears-first-over-counter-continuous-glucose-monitor' },
    { label: 'Dexcom G7 accuracy validation (Diabetes Technology & Therapeutics)', url: 'https://www.liebertpub.com/doi/10.1089/dia.2023.0218' },
  ],
  relatedSlugs: ['ultrahuman-m1', 'levels', 'lingo', 'signos'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default stelo
