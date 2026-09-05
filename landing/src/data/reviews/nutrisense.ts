import type { ToolReview } from './types'

const nutrisense: ToolReview = {
  slug: 'nutrisense',
  name: 'Nutrisense',
  brand: 'Nutrisense',
  category: 'cgm',
  productType: 'CGM coaching programme (Dexcom G7 + RD coach)',
  description:
    'ONDA review of Nutrisense — the CGM programme built around a registered-dietitian coach plus Dexcom G7. Scored on insights, coaching, accuracy and value.',
  verdict:
    'The strongest human-coaching CGM programme — a registered dietitian alongside Dexcom G7 data.',
  summary:
    'Nutrisense is the CGM programme that bets on human coaching, not app intelligence, as the differentiator. Every subscriber is paired with a registered dietitian (RD) who reviews the data, sends weekly summaries and answers questions in-app. Hardware is Dexcom G7 — the same sensor underneath Levels and Stelo. The insight engine is competent rather than category-leading, but the coach is the product. Roughly $280 a month including the RD.',
  overallScore: 8.0,
  scores: [
    { criterionId: 'sensor-accuracy', score: 9.0, note: 'Dexcom G7 — same sensor as Levels and Stelo, MARD ~8.2%. 10-day wear, 30-minute warm-up.' },
    { criterionId: 'insights', score: 8.0, note: 'Solid meal scoring, time-in-range and glucose-variability views. Less deep than Levels on AUC decomposition, but covers the metrics that matter.' },
    { criterionId: 'coaching', score: 9.5, note: 'Registered dietitian assigned to every subscriber — weekly written reviews, in-app messaging, video consultations on higher tiers. The strongest human-coaching component in this list.' },
    { criterionId: 'app-integration', score: 8.0, note: 'Clean iOS/Android app. Apple Health, MyFitnessPal and Cronometer integration; ketone-meter support on higher tiers.' },
    { criterionId: 'flexibility', score: 7.0, note: 'Monthly or annual; annual locks the price. Pause supported. Raw data export available on request.' },
    { criterionId: 'value', score: 5.5, note: '$280–$310/month bundled with the RD. Expensive — but the human coach is what most other programmes do not include at all.' },
  ],
  pros: [
    'Registered dietitian assigned to every subscriber — substantive human coaching',
    'Dexcom G7 — same accuracy ceiling as Levels',
    'Weekly written reviews from the coach, not just app summaries',
    'MyFitnessPal and Cronometer integration for serious food logging',
  ],
  cons: [
    'More expensive than Levels once you factor in the RD',
    'Insight engine is solid but less deep than Levels app-side',
    'US-only as of 2026',
    'Coach quality varies between RDs — luck-of-the-draw element',
  ],
  bestFor: 'Best for users who want a registered dietitian alongside their CGM data, not just an app.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Nutrisense product documentation, Dexcom G7 validation literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 280, note: '$280–$310/mo including RD and Dexcom G7 sensors', asOf: '2026-05-21' },
  link: 'https://www.nutrisense.io/',
  linkType: 'official',
  content: `## Where it leads

Nutrisense is the CGM programme for people who want a person, not an app, helping them interpret the data. Every subscriber is paired with a registered dietitian who reviews glucose curves — flagging [glucose spikes](/glossary/glucose-spikes) and coaching toward [insulin sensitivity](/glossary/insulin-sensitivity) — sends weekly written summaries, and answers questions through in-app messaging. The hardware is Dexcom G7, the same sensor underneath Levels and Stelo, so the accuracy ceiling is identical — the difference is the coach. For users who need accountability or who do not trust themselves to interpret meal data alone, that human layer is exactly the value proposition.

## Where it falls short

It is the most expensive programme in this list once the coaching tier is included — $280 to $310 a month. The app insights are competent rather than category-leading; Levels still has the deeper meal-impact analysis at $80 less. Coach quality also varies between RDs — the assignment is luck-of-the-draw and a poor match can be the difference between value and waste. US-only as of 2026.

## Who it is for

Choose Nutrisense if a registered dietitian working through your data weekly is what makes the difference between sustained behaviour change and a $200 month of charts. If you trust the app and want the deepest insight engine on its own, Levels is the right shape. If you want the same Dexcom G7 sensor without coaching at a fraction of the cost, Stelo.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [Metabolic redundancy and hybrid power architecture](/articles/metabolic-redundancy-hybrid-power-architecture) — reading glucose curves as the runtime state of your fuel substrates
- [Energy sensor: leptin](/articles/energy-sensor-leptin) — why leptin sits behind the satiety patterns CGM curves draw
- [Energy governor: TSH](/articles/energy-governor-tsh) — thyroid-driven metabolism as the upstream of glucose-handling capacity
`,
  references: [
    { label: 'Nutrisense — official site', url: 'https://www.nutrisense.io/' },
    { label: 'Dexcom G7 accuracy validation (Diabetes Technology & Therapeutics)', url: 'https://www.liebertpub.com/doi/10.1089/dia.2023.0218' },
  ],
  relatedSlugs: ['ultrahuman-m1', 'levels', 'zoe', 'signos'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default nutrisense
