import type { ToolReviewInput } from './types'

const lightstim: ToolReviewInput = {
  slug: 'lightstim-for-wrinkles',
  name: 'LightStim for Wrinkles',
  brand: 'LightStim',
  category: 'red-light-mask',
  productType: 'Handheld red + near-infrared LED device',
  description:
    'ONDA review of LightStim for Wrinkles — decade-old handheld red + near-infrared LED device with the longest track record in consumer red light therapy. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Longest track record in consumer red light therapy — handheld (FDA-cleared, per LightStim), multi-decade brand, accessible pricing. Handheld form factor means active positioning per session.',
  summary:
    'LightStim for Wrinkles is one of the longest-running consumer red light devices (FDA-cleared, per LightStim) — multi-wavelength handheld (red 605/630/660/855 nm), 1+ decade brand pedigree, peer-reviewed studies on the specific device. Handheld form factor means active positioning across the face per session (vs lie-on mask). $249 pricing is meaningfully accessible. Trade-off is convenience: mask alternatives let you do other things during the session.',
  scores: [
    { criterionId: 'irradiance', score: 7.5, note: 'Documented irradiance honest to peer-reviewed studies. Handheld positioning delivers higher local dose than mask area-averaged dose.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Four wavelengths — red 605 / 630 / 660 / 855 nm. Broader red coverage than most masks plus near-infrared depth.' },
    { criterionId: 'led-count-coverage', score: 5.5, note: 'Handheld device — coverage is per-position, requiring active user positioning across face zones. Slower per session than masks.' },
    { criterionId: 'clinical-evidence', score: 9.0, note: 'FDA-cleared per LightStim (clearance is not FDA approval), with a multi-decade clinical track record. Peer-reviewed studies on the specific device for fine lines. Among the deepest evidence bases in the category.' },
    { criterionId: 'comfort-fit', score: 6.0, note: 'Handheld — comfortable to hold but requires active use. Can\'t multitask during session.' },
    { criterionId: 'value', score: 8.5, note: '$249 — accessible pricing for a device with peer-reviewed clinical evidence. Best evidence-per-dollar in the category.' },
  ],
  pros: [
    'Multi-decade clinical track record (FDA-cleared, per LightStim)',
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
  bestFor: 'Best for users wanting peer-reviewed evidence at accessible pricing and accepting handheld active-positioning vs mask convenience.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from LightStim product documentation, the brand’s FDA-clearance statement and the published peer-reviewed clinical literature on the device. Not hands-on tested by ONDA.',
  price: { usd: 249, note: 'LightStim for Wrinkles handheld', asOf: '2026-05-28' },
  link: 'https://www.lightstim.com/',
  linkType: 'official',
  content: `## Where it leads

LightStim for Wrinkles is one of the longest-running consumer red light devices, which LightStim says is FDA-cleared — multi-decade clinical track record, four-wavelength coverage, peer-reviewed studies on the specific device. Among the deepest evidence bases in the category at accessible $249 pricing.

## What are the downsides of LightStim for Wrinkles?

Form factor. Handheld means active positioning across face zones per session — slower and less convenient than lie-on masks. No app, no programmability, no integrated session timing. The brand UX feels dated next to 2026 mask competitors.

## Who should buy LightStim for Wrinkles?

Choose LightStim for Wrinkles for peer-reviewed evidence at accessible pricing and you accept handheld active use. For a lie-on mask with clinical evidence, Omnilux Contour Face. For consumer market leader, CurrentBody Series 2. For ultra-budget handheld alternative, Solawave Wand.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid)
`,
  references: [
    { label: 'LightStim — official site', url: 'https://www.lightstim.com/' },
  ],
  relatedSlugs: ['solawave-wand-4-in-1', 'omnilux-contour-face', 'dr-dennis-gross-spectralite'],
  publishOn: '2026-07-06',
  faq: [
    { q: "Is LightStim for Wrinkles FDA-cleared?", a: "LightStim says it is. FDA clearance means the FDA found a device substantially equivalent to one already on the market for a named use; it is not FDA approval. LightStim for Wrinkles is one of the longest-running consumer red light devices, with more than a decade of brand history and peer-reviewed studies on this specific device. It uses four wavelengths: 605, 630, 660 and 855 nm." },
    { q: "How much does LightStim for Wrinkles cost?", a: "The LightStim for Wrinkles handheld costs $249. Given its device-specific peer-reviewed studies, that makes it the best evidence-per-dollar option in consumer red light therapy. The trade-off is convenience: it is a handheld you position by hand each session, with no app." },
    { q: "LightStim vs a red light face mask: which is better?", a: "LightStim has the stronger evidence base, but it is a handheld you must actively move across your face each session, which is slower than a lie-on mask. Masks let you do other things during treatment. LightStim also has no app or session programming." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
}

export default lightstim
