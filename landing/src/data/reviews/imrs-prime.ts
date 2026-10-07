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
    'iMRS Prime is the Swiss Bionic Solutions Bemer-alternative — full-body mat plus pillow plus spot applicator, sawtooth waveform with Schumann (7.83 Hz) settings and morning/evening presets that the maker markets as energising and calming (not tested in controlled trials). Multi-decade brand, premium build, mid-premium pricing. Often cross-shopped against Bemer and chosen for the price differential.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'field-strength', score: 7.5, note: 'Low-to-moderate intensity (~150–200 µT mat output). Similar philosophy to Bemer — waveform shape over peak gauss.' },
    { criterionId: 'waveform-evidence', score: 8.0, note: 'Sawtooth waveform with Schumann and bone-healing frequency presets. Relies on general PEMF research; we found no trials of the device itself.' },
    { criterionId: 'build', score: 8.5, note: 'Swiss-engineered premium build, multi-decade brand pedigree, 3-year warranty.' },
    { criterionId: 'programmability', score: 7.5, note: 'Morning and evening preset protocols (marketed as energising and calming; not tested in controlled trials). Less parameter exposure than Healthy Wave; more polished than consumer mats.' },
    { criterionId: 'form-factor', score: 8.5, note: 'Coordinated multi-applicator system — full mat + pillow + spot applicator from single control unit.' },
    { criterionId: 'value', score: 7.0, note: '$3,500–$4,500 — meaningfully cheaper than Bemer Classic Evo for a comparable multi-applicator Swiss build.' },
  ],
  pros: [
    'Swiss-engineered premium build at lower price than Bemer',
    'Coordinated multi-applicator system (mat + pillow + spot)',
    'Morning and evening preset protocols',
    'Multi-decade Swiss Bionic Solutions brand pedigree',
  ],
  cons: [
    'Energising/calming presets are maker claims; no trials of the device itself',
    'Less parameter exposure than Healthy Wave Multi-Wave',
    'Brand recognition lower than Bemer in US market',
    'Mid-premium pricing without clear research differentiation vs Bemer',
  ],
  bestFor: 'Best for users cross-shopping Bemer who want Swiss-engineered multi-applicator PEMF at lower price and accept that the device itself has not been tested in trials.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Swiss Bionic Solutions product documentation and independent 2026 PEMF reviews. Not hands-on tested by ONDA.',
  price: { usd: 4000, note: 'Prime configuration with mat + pillow + spot', asOf: '2026-05-27' },
  link: 'https://www.swissbionic.com/',
  linkType: 'official',
  content: `## Where it leads

iMRS Prime is the rational Bemer alternative — Swiss-engineered multi-applicator PEMF system at meaningfully lower price. Sawtooth waveform with morning and evening preset protocols (the maker calls them energising and calming; this is not tested in controlled trials) and a multi-decade brand pedigree.

## What are the downsides of iMRS Prime?

No device trials. Bemer cites many studies of its signal (mostly small or manufacturer-linked); iMRS uses common PEMF frequencies and we found no trials of the iMRS itself. Brand recognition in the US market is lower.

## Who should buy iMRS Prime?

Choose iMRS Prime if you're cross-shopping Bemer and want Swiss-engineered multi-applicator hardware at lower price. For Bemer’s proprietary signal, Bemer Classic Evo. For multi-modality stacking, Healthy Wave Multi-Wave. For mid-tier with dual coil/mat, Curatron 3D.

---

## Background reading

- [PEMF therapy — what the evidence shows](/science/evidence/pemf) — what is shown in people, what comes from cell studies, and what FDA registration, clearance and approval mean
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors) — how light and timing shape the body clock (not about PEMF)
`,
  references: [
    { label: 'Swiss Bionic Solutions — official site', url: 'https://www.swissbionic.com/' },
  ],
  relatedSlugs: ['bemer-classic-evo', 'curatron-3d', 'omi-full-body-mat'],
  publishOn: '2026-06-22',
  faq: [
    { q: "iMRS Prime vs Bemer: which is better?", a: "iMRS Prime costs less than Bemer and offers a comparable Swiss-engineered build plus a coordinated mat, pillow and spot applicator system. Bemer has more studies of its signal, though most are manufacturer-linked and independent trials found no clear benefit. Choose iMRS for price and applicators, Bemer for its brand and build." },
    { q: "How much does the iMRS Prime cost?", a: "The iMRS Prime costs about $4,000 in the configuration with a full-body mat, pillow and spot applicator. That is mid-premium pricing, below Bemer, for a Swiss-engineered build from a multi-decade brand, though without clear research differentiation from Bemer to justify the choice on evidence alone." },
    { q: "What frequencies does the iMRS Prime use?", a: "The iMRS Prime uses a sawtooth waveform with Schumann (7.83 Hz) settings and morning and evening presets that the maker markets as energising and calming, not tested in controlled trials. It exposes fewer adjustable parameters than the Healthy Wave Multi-Wave, so it suits users who prefer presets over manual tuning." },
  ],
  datePublished: '2026-06-22',
  dateModified: '2026-10-07',
}

export default imrsPrime
