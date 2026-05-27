import type { ToolReview } from './types'

const omiFullBodyMat: ToolReview = {
  slug: 'omi-full-body-mat',
  name: 'OMI Full Body PEMF Mat',
  brand: 'OMI',
  category: 'pemf',
  productType: 'Mid-tier full-body PEMF mat',
  description:
    'ONDA review of the OMI Full Body PEMF Mat — popular mid-tier mat backed by FDA bone-healing waveform research. Scored on field strength, waveform research, build and value.',
  verdict:
    'Solid mid-tier PEMF mat — FDA-cleared bone-healing waveform, simple operation, accessible pricing. Lacks Bemer’s research moat or multi-modality stacking.',
  summary:
    'OMI Full Body Mat is the mid-tier PEMF reference — single-modality PEMF mat using the FDA-cleared bone-healing waveform research band, simple operation, and accessible pricing. No multi-modality stacking, no proprietary research moat. The right product for users who want straightforward PEMF mat use at $1,500–$2,000.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'field-strength', score: 7.5, note: 'Moderate field intensity in the FDA bone-healing research band. Documented usable continuous output.' },
    { criterionId: 'waveform-evidence', score: 7.5, note: 'Uses FDA-cleared bone-healing waveform research band. No proprietary single-waveform research like Bemer.' },
    { criterionId: 'build', score: 7.5, note: 'Solid mat construction, 5-year warranty. Multi-year reliability track record positive in user reviews.' },
    { criterionId: 'programmability', score: 6.5, note: 'Simple preset operation — limited parameter exposure compared to Healthy Wave. Black-box-ish controller.' },
    { criterionId: 'form-factor', score: 7.5, note: 'Full-body mat, single-modality PEMF. Optional pillow applicator at upsell. No coil/spot system.' },
    { criterionId: 'value', score: 7.5, note: '$1,500–$2,000 — accessible mid-tier pricing. Solid value for users wanting straightforward PEMF without paying for multi-modality or research moat.' },
  ],
  pros: [
    'FDA bone-healing waveform research band',
    'Simple operation — easy daily use',
    '5-year mat warranty',
    'Accessible mid-tier pricing ($1,500–$2,000)',
  ],
  cons: [
    'Limited parameter exposure — black-box presets',
    'Single-modality only (no IR or red light stacking)',
    'No proprietary research moat',
    'Less brand recognition than Bemer or HigherDOSE',
  ],
  bestFor: 'Best for users wanting straightforward single-modality PEMF mat use at accessible pricing without paying for multi-modality stacking or premium research moats.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from OMI product documentation and independent 2026 PEMF mat reviews. Not hands-on tested by ONDA.',
  price: { usd: 1750, note: 'full-body mat with controller', asOf: '2026-05-27' },
  link: 'https://www.omimatusa.com/',
  linkType: 'official',
  content: `## Where it leads

OMI Full Body Mat is the mid-tier PEMF reference — straightforward single-modality PEMF mat using FDA bone-healing waveform research, simple daily-use operation, and accessible $1,500–$2,000 pricing.

## Where it falls short

No multi-modality stacking, no proprietary research moat, limited parameter exposure. Users wanting IR + red light + PEMF stacking should look at Healthy Wave; users wanting research-backed proprietary waveforms should look at Bemer.

## Who it is for

Choose OMI Full Body Mat for straightforward mid-tier single-modality PEMF at accessible pricing. For multi-modality, Healthy Wave Multi-Wave. For Bemer waveform research, Bemer Classic Evo. For consumer-brand polish, HigherDOSE PEMF Mat.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'OMI — official site', url: 'https://www.omimatusa.com/' },
  ],
  relatedSlugs: ['healthy-wave-multi-wave', 'higherdose-pemf-mat', 'earthpulse-sleep-on-command'],
  publishOn: '2026-06-22',
  datePublished: '2026-06-22',
  dateModified: '2026-06-22',
}

export default omiFullBodyMat
