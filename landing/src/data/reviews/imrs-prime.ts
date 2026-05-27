import type { ToolReview } from './types'

const imrsPrime: ToolReview = {
  slug: 'imrs-prime',
  name: 'iMRS Prime',
  brand: 'Swiss Bionic Solutions',
  category: 'pemf',
  productType: 'Swiss-engineered PEMF mat + pillow + spot applicator system',
  description:
    'ONDA review of the iMRS Prime — Swiss-engineered PEMF system with full-body mat, pillow and spot applicator. Scored on field strength, waveform research, build and value.',
  verdict:
    'Swiss-engineered Bemer alternative — sawtooth waveform, multi-applicator system, multi-decade brand. Lower price than Bemer with comparable build.',
  summary:
    'iMRS Prime is the Swiss Bionic Solutions Bemer-alternative — full-body mat plus pillow plus spot applicator, sawtooth waveform with documented Schumann (7.83 Hz) and circadian-aligned frequency protocols. Multi-decade brand, premium build, mid-premium pricing. Often cross-shopped against Bemer and chosen for the price differential.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'field-strength', score: 7.5, note: 'Low-to-moderate intensity (~150–200 µT mat output). Similar philosophy to Bemer — waveform shape over peak gauss.' },
    { criterionId: 'waveform-evidence', score: 8.0, note: 'Sawtooth waveform with Schumann and bone-healing frequency presets. Backed by general PEMF research, not single-waveform proprietary research like Bemer.' },
    { criterionId: 'build', score: 8.5, note: 'Swiss-engineered premium build, multi-decade brand pedigree, 3-year warranty.' },
    { criterionId: 'programmability', score: 7.5, note: 'Circadian-aligned preset protocols (morning energising, evening calming). Less parameter exposure than Healthy Wave; more polished than consumer mats.' },
    { criterionId: 'form-factor', score: 8.5, note: 'Coordinated multi-applicator system — full mat + pillow + spot applicator from single control unit.' },
    { criterionId: 'value', score: 7.0, note: '$3,500–$4,500 — meaningfully cheaper than Bemer Classic Evo for a comparable multi-applicator Swiss build.' },
  ],
  pros: [
    'Swiss-engineered premium build at lower price than Bemer',
    'Coordinated multi-applicator system (mat + pillow + spot)',
    'Circadian-aligned preset protocols (morning/evening)',
    'Multi-decade Swiss Bionic Solutions brand pedigree',
  ],
  cons: [
    'No proprietary single-waveform research moat like Bemer',
    'Less parameter exposure than Healthy Wave Multi-Wave',
    'Brand recognition lower than Bemer in US market',
    'Mid-premium pricing without clear research differentiation vs Bemer',
  ],
  bestFor: 'Best for users cross-shopping Bemer who want Swiss-engineered multi-applicator PEMF at lower price and accept the lack of single-waveform research moat.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Swiss Bionic Solutions product documentation and independent 2026 PEMF reviews. Not hands-on tested by ONDA.',
  price: { usd: 4000, note: 'Prime configuration with mat + pillow + spot', asOf: '2026-05-27' },
  link: 'https://www.swissbionic.com/',
  linkType: 'official',
  content: `## Where it leads

iMRS Prime is the rational Bemer alternative — Swiss-engineered multi-applicator PEMF system at meaningfully lower price. Sawtooth waveform with circadian-aligned preset protocols (morning energising, evening calming) and a multi-decade brand pedigree.

## Where it falls short

No research moat. Where Bemer has 50+ peer-reviewed studies on the specific biorhythmic signal, iMRS uses well-documented general PEMF frequencies without a proprietary single-waveform research base. Brand recognition in the US market is lower.

## Who it is for

Choose iMRS Prime if you're cross-shopping Bemer and want Swiss-engineered multi-applicator hardware at lower price. For research-backed biorhythmic signal, Bemer Classic Evo. For multi-modality stacking, Healthy Wave Multi-Wave. For mid-tier with dual coil/mat, Curatron 3D.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors) — why circadian-aligned protocols matter for recovery hardware
`,
  references: [
    { label: 'Swiss Bionic Solutions — official site', url: 'https://www.swissbionic.com/' },
  ],
  relatedSlugs: ['bemer-classic-evo', 'curatron-3d', 'omi-full-body-mat'],
  publishOn: '2026-06-22',
  datePublished: '2026-06-22',
  dateModified: '2026-06-22',
}

export default imrsPrime
