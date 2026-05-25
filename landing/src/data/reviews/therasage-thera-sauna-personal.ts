import type { ToolReview } from './types'

const therasageTheraSaunaPersonal: ToolReview = {
  slug: 'therasage-thera-sauna-personal',
  name: 'Therasage TheraSauna Personal',
  brand: 'Therasage',
  category: 'sauna',
  productType: 'Mid-tier IR sauna (tent / cabin configurations)',
  description:
    'ONDA review of Therasage TheraSauna Personal — mid-tier IR sauna with tent and cabin configurations and biohacker brand positioning.',
  verdict:
    'A solid mid-tier biohacker IR sauna — full-spectrum, decent EMF discipline, accessible price for the tier.',
  summary:
    'Therasage TheraSauna Personal occupies the gap between budget portable (HigherDose) and premium cabin (Sunlighten, Clearlight). Full-spectrum IR delivery, low-EMF documentation, tent-style and cabin configurations. Biohacker-positioned brand without Sunlighten or SaunaSpace premium pricing.',
  overallScore: 7.2,
  scores: [
    { criterionId: 'heat-source', score: 7.5, note: 'Full-spectrum IR via carbon-fibre and ceramic heaters. Less rigorous wavelength separation than Sunlighten but credibly broad-spectrum.' },
    { criterionId: 'build', score: 7.5, note: 'Tent or cabin configurations. 3-year warranty. Mid-tier build quality.' },
    { criterionId: 'emf', score: 7.5, note: 'Documented low EMF; third-party-verified in spot checks. Less rigorous than SaunaSpace Faraday but acceptable.' },
    { criterionId: 'form-factor', score: 7.5, note: 'Tent and cabin configurations available. 1–2-person typical use.' },
    { criterionId: 'evidence', score: 6.5, note: 'Biohacker-positioned marketing. Wellness-tier rather than clinical-grade.' },
    { criterionId: 'value', score: 7.5, note: '$1,500–$3,500 depending on configuration. Mid-tier pricing matched to mid-tier build.' },
  ],
  pros: [
    'Full-spectrum IR at mid-tier pricing',
    'Tent and cabin configurations cover different install scenarios',
    'Documented low EMF with third-party verification',
    'Biohacker brand positioning with strong community presence',
  ],
  cons: [
    'Less rigorous wavelength separation than Sunlighten mPulse',
    'EMF profile higher than SaunaSpace Faraday',
    'Build less premium than Sunlighten or Clearlight cabins',
    'Brand recognition narrower than the category leaders',
  ],
  bestFor: 'Best for biohackers wanting full-spectrum cabin or tent IR at mid-tier pricing.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Therasage product documentation and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 2500, note: 'tent from $1,500; cabin from $3,500', asOf: '2026-05-25' },
  link: 'https://therasage.com/',
  linkType: 'official',
  content: `## Where it leads

Therasage occupies the mid-tier IR sauna sweet spot — full-spectrum delivery at half the cost of Sunlighten or Clearlight, with credible EMF documentation. The biohacker community knows the brand, and the tent / cabin configuration choice covers more install scenarios than fixed-cabin competitors.

## Where it falls short

Wavelength rigour and EMF discipline are both a tier below the category leaders. Brand recognition is narrower. Cabin build is less premium than Sunlighten cedar.

## Who it is for

Choose Therasage TheraSauna Personal if you want full-spectrum biohacker IR at mid-tier pricing. For premium full-spectrum, Sunlighten or Clearlight. For near-IR-specific, SaunaSpace.

---

## Background reading

The biology of why heat exposure works — and the protocols that compound with the hardware.

- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where sauna slots into a reset routine
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — the heat-shock side of the stress response
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — sauna as a daily anti-entropy stress dose
`,
  references: [
    { label: 'Therasage — official site', url: 'https://therasage.com/' },
  ],
  relatedSlugs: ['sunlighten-mpulse', 'higherdose-blanket-v4', 'sun-home-equinox'],
  publishOn: '2026-06-04',
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default therasageTheraSaunaPersonal
