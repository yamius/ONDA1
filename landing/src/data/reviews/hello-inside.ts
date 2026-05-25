import type { ToolReview } from './types'

const helloInside: ToolReview = {
  slug: 'hello-inside',
  name: 'Hello Inside',
  brand: 'Hello Inside',
  category: 'cgm',
  productType: 'CGM coaching programme (Abbott Libre 3, EU)',
  description:
    'ONDA review of Hello Inside — the Austrian-built CGM programme for German-speaking and EU metabolic-health users. Scored on insights, accuracy and value.',
  verdict:
    'A solid mid-tier EU CGM programme — local language depth, competent insights, narrower scope than Veri.',
  summary:
    'Hello Inside is a Vienna-built CGM programme aimed at DACH (Germany-Austria-Switzerland) and wider EU metabolic-health users. Abbott Libre 3 hardware with an app that emphasises beginner-friendly framing, weekly progress reports and dietitian-style content modules. Less integration breadth than Veri; stronger local-language content for German speakers.',
  overallScore: 6.9,
  scores: [
    { criterionId: 'sensor-accuracy', score: 8.0, note: 'Abbott Libre 3 — MARD ~9%, 14-day wear. Same sensor as Veri, Ultrahuman M1 and Lingo.' },
    { criterionId: 'insights', score: 7.0, note: 'Solid time-in-range and meal-impact views, weekly written progress reports. Less analytical depth than Veri or Levels.' },
    { criterionId: 'coaching', score: 6.5, note: 'Higher tiers include dietitian-led group sessions; default tier is app + content modules.' },
    { criterionId: 'app-integration', score: 7.0, note: 'Apple Health and Google Fit support; narrower third-party connector list than Veri. Strong German-language content.' },
    { criterionId: 'flexibility', score: 7.5, note: 'Monthly subscription; pause supported. No annual lock-in by default. Raw data export available on request.' },
    { criterionId: 'value', score: 7.0, note: '€99–€129/month (~$110–$145) including sensors. Mid-pack EU pricing.' },
  ],
  pros: [
    'Strongest German-language CGM content in the category',
    'No annual lock-in — monthly billing default',
    'Group dietitian sessions on higher tiers',
    'Weekly written progress reports — a coaching substitute',
  ],
  cons: [
    'Insight engine less deep than Veri or Levels',
    'Narrower third-party integration than Veri',
    'Mostly DACH-region focus; limited brand recognition elsewhere',
    'Libre 3 accuracy lags Dexcom G7 in independent comparison',
  ],
  bestFor: 'Best for German-speaking EU users who want CGM coaching in their language.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Hello Inside product documentation, Abbott Libre 3 validation literature and independent 2026 EU-market reviews. Not hands-on tested by ONDA.',
  price: { usd: 130, note: '€99–€129/mo including sensors', asOf: '2026-05-21' },
  link: 'https://helloinside.com/',
  linkType: 'official',
  content: `## Where it leads

Hello Inside is the right fit for German-speaking biohackers in the DACH region. The content modules are written natively in German, the dietitian-led group sessions at the higher tiers run in German, and the app pacing assumes a beginner audience that wants to be guided rather than dropped in front of analytics. The weekly written progress report fills part of the human-coaching gap without the cost of a 1-on-1 RD.

## Where it falls short

Stand it next to Veri and the comparison is clear: Veri has the wider integration list, the deeper analytical engine and the broader EU reach. Hello Inside’s strength is local language, not feature parity. Outside the DACH region the brand has limited recognition and the German-content advantage disappears.

## Who it is for

Choose Hello Inside if you read and learn in German and want a CGM programme that meets you in your language. Outside DACH, Veri (EU) or Lingo (cheapest in markets where it ships) are better fits.

---

## Background reading

The metabolic biology these programmes surface — and the protocols the data unlocks.

- [Metabolic flexibility and the dual-fuel system](/articles/metabolic-flexibility-dual-fuel-system) — why fat-to-glucose switching is the metric CGM data makes visible
- [Metabolic redundancy and hybrid power architecture](/articles/metabolic-redundancy-hybrid-power-architecture) — reading glucose curves as the runtime state of your fuel substrates
- [Energy sensor: leptin](/articles/energy-sensor-leptin) — why leptin sits behind the satiety patterns CGM curves draw
`,
  references: [
    { label: 'Hello Inside — official site', url: 'https://helloinside.com/' },
    { label: 'Abbott FreeStyle Libre 3 accuracy validation (J Diabetes Sci Technol)', url: 'https://journals.sagepub.com/doi/10.1177/19322968221101632' },
  ],
  relatedSlugs: ['veri', 'lingo', 'zoe'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
}

export default helloInside
