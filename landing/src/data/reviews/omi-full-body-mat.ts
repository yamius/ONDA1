import type { ToolReviewInput } from './types'

const omiFullBodyMat: ToolReviewInput = {
  slug: 'omi-full-body-mat',
  name: 'OMI Full Body PEMF Mat',
  brand: 'OMI',
  category: 'pemf',
  productType: 'Mid-tier full-body PEMF mat',
  description:
    'ONDA review of the OMI Full Body PEMF Mat — popular mid-tier mat with simple presets. Not FDA-cleared for bone healing. Scored on field strength, waveform research, build and value.',
  verdict:
    'Solid mid-tier PEMF mat — simple operation, accessible pricing. Not FDA-cleared for bone healing, no trials of the mat itself, no multi-modality stacking.',
  summary:
    'OMI Full Body Mat is the mid-tier PEMF reference — single-modality PEMF mat with simple preset operation and accessible pricing. OMI is not FDA-cleared for bone healing: medical bone-growth stimulators are prescription devices with their own trials, and a consumer mat using similar frequencies does not inherit their status or evidence. No multi-modality stacking, no trials of the mat itself. The right product for users who want straightforward PEMF mat use at $1,500–$2,000.',
  scores: [
    { criterionId: 'field-strength', score: 7.5, note: 'Moderate field intensity; the maker documents usable continuous output.' },
    { criterionId: 'waveform-evidence', score: 7.0, note: 'Uses common PEMF frequencies. OMI is not FDA-cleared for bone healing, and we found no trials of the mat itself.' },
    { criterionId: 'build', score: 7.5, note: 'Solid mat construction, 5-year warranty. Multi-year reliability track record positive in user reviews.' },
    { criterionId: 'programmability', score: 6.5, note: 'Simple preset operation — limited parameter exposure compared to Healthy Wave. Black-box-ish controller.' },
    { criterionId: 'form-factor', score: 7.5, note: 'Full-body mat, single-modality PEMF. Optional pillow applicator at upsell. No coil/spot system.' },
    { criterionId: 'value', score: 7.5, note: '$1,500–$2,000 — accessible mid-tier pricing. Solid value for users wanting straightforward PEMF without paying for multi-modality or a premium brand.' },
  ],
  pros: [
    'Moderate field intensity with documented continuous output',
    'Simple operation — easy daily use',
    '5-year mat warranty',
    'Accessible mid-tier pricing ($1,500–$2,000)',
  ],
  cons: [
    'Limited parameter exposure — black-box presets',
    'Single-modality only (no IR or red light stacking)',
    'Not FDA-cleared for bone healing; no trials of the mat itself',
    'Less brand recognition than Bemer or HigherDOSE',
  ],
  bestFor: 'Best for users wanting straightforward single-modality PEMF mat use at accessible pricing without paying for multi-modality stacking or a premium brand.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from OMI product documentation and independent 2026 PEMF mat reviews. Not hands-on tested by ONDA.',
  price: { usd: 1750, note: 'full-body mat with controller', asOf: '2026-05-27' },
  link: 'https://www.omimatusa.com/',
  linkType: 'official',
  content: `## Where it leads

OMI Full Body Mat is the mid-tier PEMF reference — straightforward single-modality PEMF mat with simple daily-use operation and accessible $1,500–$2,000 pricing. It is not FDA-cleared for bone healing — that status belongs to prescription bone-growth stimulators, not to consumer mats.

## What are the downsides of OMI Full Body PEMF Mat?

No multi-modality stacking, no trials of the mat itself, limited parameter exposure. Users wanting IR + red light + PEMF stacking should look at Healthy Wave; users wanting a proprietary signal should look at Bemer.

## Who should buy OMI Full Body PEMF Mat?

Choose OMI Full Body Mat for straightforward mid-tier single-modality PEMF at accessible pricing. For multi-modality, Healthy Wave Multi-Wave. For Bemer’s proprietary signal, Bemer Classic Evo. For consumer-brand polish, HigherDOSE PEMF Mat.

---

## Background reading

- [PEMF therapy — what the evidence shows](/science/evidence/pemf) — what is shown in people, what comes from cell studies, and what FDA registration, clearance and approval mean
`,
  references: [
    { label: 'OMI — official site', url: 'https://www.omimatusa.com/' },
  ],
  relatedSlugs: ['healthy-wave-multi-wave', 'higherdose-pemf-mat', 'earthpulse-sleep-on-command'],
  publishOn: '2026-06-22',
  faq: [
    { q: "Is the OMI Full Body PEMF Mat worth it?", a: "The OMI mat is worth it if you want straightforward, single-modality PEMF at accessible pricing. It is simple for daily use and has a 5-year mat warranty, but it is not FDA-cleared for bone healing and has no trials of its own. It lacks parameter control and IR or red light stacking." },
    { q: "How much does the OMI Full Body PEMF Mat cost?", a: "The OMI full-body mat with controller is listed at $1,750, within a mid-tier range of $1,500 to $2,000, and it comes with a 5-year mat warranty. There is no IR or red light stacking at that price." },
    { q: "What are the downsides of the OMI Full Body PEMF Mat?", a: "The OMI mat relies on black-box presets with limited parameter exposure, is single-modality with no IR or red light stacking, has no trials of the mat itself, and carries less brand recognition than Bemer or HigherDOSE. It is a simple, single-purpose mat." },
  ],
  datePublished: '2026-06-22',
  dateModified: '2026-10-10',
}

export default omiFullBodyMat
