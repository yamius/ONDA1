import type { ToolReview } from './types'

const lightstim: ToolReview = {
  slug: 'lightstim-for-wrinkles',
  name: 'LightStim for Wrinkles',
  brand: 'LightStim',
  category: 'red-light-mask',
  productType: 'FDA-cleared handheld red + near-infrared LED device',
  description:
    'ONDA review of LightStim for Wrinkles — FDA-cleared decade-old handheld red + near-infrared LED device with the longest track record in consumer red light therapy. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Longest track record in consumer red light therapy — FDA-cleared handheld, multi-decade brand, accessible pricing. Handheld form factor means active positioning per session.',
  summary:
    'LightStim for Wrinkles is the longest-running FDA-cleared consumer red light device — multi-wavelength handheld (red 605/630/660/855 nm), 1+ decade brand pedigree, peer-reviewed studies on the specific device. Handheld form factor means active positioning across the face per session (vs lie-on mask). $249 pricing is meaningfully accessible. Trade-off is convenience: mask alternatives let you do other things during the session.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'irradiance', score: 7.5, note: 'Documented irradiance honest to peer-reviewed studies. Handheld positioning delivers higher local dose than mask area-averaged dose.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Four wavelengths — red 605 / 630 / 660 / 855 nm. Broader red coverage than most masks plus near-infrared depth.' },
    { criterionId: 'led-count-coverage', score: 5.5, note: 'Handheld device — coverage is per-position, requiring active user positioning across face zones. Slower per session than masks.' },
    { criterionId: 'clinical-evidence', score: 9.0, note: 'FDA-cleared with multi-decade clinical track record. Peer-reviewed studies on the specific device for fine lines. Among the deepest evidence bases in the category.' },
    { criterionId: 'comfort-fit', score: 6.0, note: 'Handheld — comfortable to hold but requires active use. Can\'t multitask during session.' },
    { criterionId: 'value', score: 8.5, note: '$249 — accessible pricing for FDA-cleared device with peer-reviewed clinical evidence. Best evidence-per-dollar in the category.' },
  ],
  pros: [
    'FDA-cleared with multi-decade clinical track record',
    'Four-wavelength coverage (605 / 630 / 660 / 855 nm)',
    'Peer-reviewed studies on the specific device',
    'Accessible $249 pricing — best evidence-per-dollar',
  ],
  cons: [
    'Handheld form factor — requires active positioning per session',
    'Slower per-session vs lie-on masks',
    'No app or session-programmability',
    'Brand UX dated vs 2026 competitors',
  ],
  bestFor: 'Best for users wanting FDA-cleared peer-reviewed evidence at accessible pricing and accepting handheld active-positioning vs mask convenience.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from LightStim product documentation, FDA registration and the published peer-reviewed clinical literature on the device. Not hands-on tested by ONDA.',
  price: { usd: 249, note: 'LightStim for Wrinkles handheld', asOf: '2026-05-28' },
  link: 'https://www.lightstim.com/',
  linkType: 'official',
  content: `## Where it leads

LightStim for Wrinkles is the longest-running FDA-cleared consumer red light device — multi-decade clinical track record, four-wavelength coverage, peer-reviewed studies on the specific device. Among the deepest evidence bases in the category at accessible $249 pricing.

## Where it falls short

Form factor. Handheld means active positioning across face zones per session — slower and less convenient than lie-on masks. No app, no programmability, no integrated session timing. The brand UX feels dated next to 2026 mask competitors.

## Who it is for

Choose LightStim for Wrinkles for FDA-cleared peer-reviewed evidence at accessible pricing and you accept handheld active use. For lie-on mask with FDA Class II, Omnilux Contour Face. For consumer market leader, CurrentBody Series 2. For ultra-budget handheld alternative, Solawave Wand.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'LightStim — official site', url: 'https://www.lightstim.com/' },
  ],
  relatedSlugs: ['solawave-wand-4-in-1', 'omnilux-contour-face', 'dr-dennis-gross-spectralite'],
  publishOn: '2026-07-06',
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
}

export default lightstim
