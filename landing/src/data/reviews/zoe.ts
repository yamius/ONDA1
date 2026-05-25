import type { ToolReview } from './types'

const zoe: ToolReview = {
  slug: 'zoe',
  name: 'Zoe',
  brand: 'Zoe',
  category: 'cgm',
  productType: 'Personalised nutrition programme (Libre + microbiome + blood)',
  description:
    'ONDA review of Zoe — Tim Spector’s science-backed personalised-nutrition programme combining CGM, gut microbiome test and blood biomarker analysis. Scored on insights, accuracy and value.',
  verdict:
    'The most science-backed CGM programme — and the only one fusing glucose, microbiome and blood biomarkers into one nutrition plan.',
  summary:
    'Zoe is the UK-built personalised-nutrition programme run by epidemiologist Tim Spector. It combines a two-week Abbott Libre CGM stretch with an at-home gut microbiome test and a blood biomarker panel, then turns the three signals into food rankings personalised to your physiology. After the 2-week measurement phase you keep the app and rankings on a £60/month subscription. Strong science, strong content, less suited to ongoing CGM use.',
  overallScore: 7.7,
  scores: [
    { criterionId: 'sensor-accuracy', score: 7.5, note: 'Abbott Libre (2-week wear), MARD ~9–11%. Calibration-free; accuracy in the second week is the weakest point.' },
    { criterionId: 'insights', score: 8.5, note: 'The only programme here that fuses CGM with gut microbiome and blood biomarkers into a single food-ranking score — unique multi-biomarker view backed by the published PREDICT studies.' },
    { criterionId: 'coaching', score: 8.0, note: 'No 1-on-1 coach by default, but the content library and personalised food rankings stand in for ongoing guidance. Spector and the team are credible scientific authorities.' },
    { criterionId: 'app-integration', score: 8.5, note: 'Polished app with personalised food rankings, recipes and meal logging. Apple Health integration available.' },
    { criterionId: 'flexibility', score: 5.5, note: 'CGM phase is fixed at two weeks; after that, the programme is the rankings and app rather than ongoing CGM. No raw glucose data export. Annual commitment after setup.' },
    { criterionId: 'value', score: 6.5, note: '£300 (~$370) setup including the testing kit, then £60/month (~$75) ongoing. Cheaper long-run than Levels, more expensive than Stelo.' },
  ],
  pros: [
    'The only programme fusing CGM, gut microbiome and blood biomarkers in one analysis',
    'Run by Tim Spector — the most credible scientific lead in the consumer-nutrition space',
    'Personalised food rankings backed by the published PREDICT studies',
    'Long-term value lower than Levels or Nutrisense',
  ],
  cons: [
    'CGM phase is fixed at two weeks — not an ongoing CGM tool',
    'No raw glucose data export',
    'Libre accuracy lags Dexcom G7 in independent comparison',
    'UK-focused availability, slower US expansion',
  ],
  bestFor: 'Best for users who want personalised nutrition grounded in real published science, not just glucose curves.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Zoe product documentation, the published PREDICT trial series and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 370, note: '£300 setup + £60/month — multi-biomarker programme, CGM is two weeks only', asOf: '2026-05-21' },
  link: 'https://zoe.com/',
  linkType: 'official',
  content: `## Where it leads

Zoe is the only programme in this list that does not pretend glucose is the whole story. The 2-week CGM phase runs alongside a gut microbiome stool test and a blood biomarker panel, and the three signals are fused into a single set of personalised food rankings — backed by the published PREDICT-1 and PREDICT-2 studies from Tim Spector’s King’s College London group. The scientific lineage is the strongest in this category by a meaningful margin.

## Where it falls short

The CGM is a snapshot, not an instrument. Two weeks of Abbott Libre wear feed the initial ranking model and then end; if you want ongoing CGM data, Zoe is the wrong shape. There is no raw data export, the Libre sensor lags Dexcom G7 on accuracy, and the annual subscription commitment after the £300 setup is steep for a programme that has stopped giving you new glucose data after week two.

## Who it is for

Choose Zoe if you want personalised nutrition grounded in published science and the once-only CGM phase is enough — it is the right shape for a hard reset of your eating patterns based on your own physiology, not for ongoing glucose tracking. If continuous CGM is the point, Levels (premium) or Stelo (value) are better fits.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [Energy governor: TSH](/articles/energy-governor-tsh) — thyroid-driven metabolism as the upstream of glucose-handling capacity
- [GLP-1 biology and muscle preservation](/articles/glp1-biology-muscle-preservation) — what CGM data shows during GLP-1 protocol use
- [AI biomarker tracking](/articles/ai-biomarker-tracking-predictive) — CGM as the highest-density consumer biomarker stream available
`,
  references: [
    { label: 'Zoe — official site', url: 'https://zoe.com/' },
    { label: 'PREDICT-1: postprandial responses to identical foods (Nature Medicine)', url: 'https://www.nature.com/articles/s41591-020-0934-0' },
  ],
  relatedSlugs: ['levels', 'nutrisense', 'veri'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default zoe
