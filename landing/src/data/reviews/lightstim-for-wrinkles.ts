import type { ToolReviewInput } from './types'

const lightstim: ToolReviewInput = {
  slug: 'lightstim-for-wrinkles',
  name: 'LightStim for Wrinkles',
  brand: 'LightStim',
  category: 'red-light-mask',
  productType: 'Handheld red + near-infrared LED device',
  description:
    'ONDA review of LightStim for Wrinkles — handheld red + near-infrared LED device from a maker with FDA wrinkle clearances since 2009. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Four-wavelength red + near-infrared handheld, FDA-cleared (K120775; current model K261482), at accessible pricing — but no published trials of the device itself. Handheld form factor means active positioning per session.',
  summary:
    'LightStim for Wrinkles is a four-wavelength handheld (amber 605, red 640 and 652, near-infrared 850 nm), FDA-cleared (current model K261482); the maker\'s first FDA wrinkle clearance dates from 2009. We found no published trials of this device: the only wrinkle data in LightStim\'s FDA filings come from the company\'s own unpublished study of an earlier model. Handheld form factor means active positioning across the face per session (vs lie-on mask). $249 pricing is meaningfully accessible. Trade-off is convenience: mask alternatives let you do other things during the session.',
  scores: [
    { criterionId: 'irradiance', score: 7.5, note: 'LightStim\'s FDA filing for the current model (K261482) states 21.6 mW/cm² at treatment distance and 3.89 J/cm² per 3-minute area — the maker\'s figures, not independently measured.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Four wavelengths — amber 605, red 640 and 652, near-infrared 850 nm (current model, per FDA K261482 and LightStim). Broader red coverage than most masks plus near-infrared depth.' },
    { criterionId: 'led-count-coverage', score: 5.5, note: 'Handheld device — coverage is per-position, requiring active user positioning across face zones. Slower per session than masks.' },
    { criterionId: 'clinical-evidence', score: 7.0, note: 'FDA-cleared (K120775; current model K261482) — clearance is not FDA approval and is scored as neutral. We found no peer-reviewed trials of this device. The only wrinkle data are the company\'s own unpublished 8-week, 40-person study of the earlier model, with no control group described; studies run by the maker do not count as evidence in ONDA scores. LightStim\'s "clinically proven" claim is company-stated and comes without study design or publication details. Independent red-light skin research is mixed, not negative — 7.0, the base score for a device without trials of its own.' },
    { criterionId: 'comfort-fit', score: 6.0, note: 'Handheld — comfortable to hold but requires active use. Can\'t multitask during session.' },
    { criterionId: 'value', score: 8.5, note: '$249 — accessible pricing for four wavelengths including near-infrared; the trade-off is slower per-zone handheld sessions.' },
  ],
  editorialAdjustment: { value: -0.3, reason: 'Marketing honesty — LightStim’s product page says “Clinically Proven Results” and “significant improvement in fine lines and wrinkles in 100% of participants” without a published trial; the only wrinkle data are the company’s own unpublished study of an earlier model (checked October 2026). This is scored here, not under evidence.' },
  pros: [
    'FDA-cleared (current model K261482); the maker\'s first wrinkle clearance dates from 2009',
    'Four-wavelength coverage (605 / 640 / 652 / 850 nm)',
    'Accessible $249 pricing',
  ],
  cons: [
    'No published trials of the device itself — LightStim\'s "clinically proven" claim (company-stated) comes without study design or publication details',
    'Handheld form factor — requires active positioning per session',
    'Slower per-session vs lie-on masks',
    'No app or session-programmability',
    'Brand UX dated vs 2026 competitors',
  ],
  bestFor: 'Best for users who want an FDA-cleared four-wavelength handheld at accessible pricing and accept active positioning instead of mask convenience.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from LightStim product documentation, the FDA 510(k) summaries K120775 and K261482 and the general red-light skin research; we found no published trials of the device itself. Not hands-on tested by ONDA.',
  price: { usd: 249, note: 'LightStim for Wrinkles handheld', asOf: '2026-05-28' },
  link: 'https://www.lightstim.com/',
  linkType: 'official',
  content: `## Where it leads

LightStim for Wrinkles is a four-wavelength handheld (amber 605, red 640 and 652, near-infrared 850 nm) at accessible $249 pricing; the current model is FDA-cleared (K261482), and the maker's first FDA wrinkle clearance dates from 2009. A clearance is not proof that the device works, and we found no published trials of this device: the only wrinkle data are the company's own unpublished study of an earlier model.

## What are the downsides of LightStim for Wrinkles?

Form factor. Handheld means active positioning across face zones per session — slower and less convenient than lie-on masks. No app, no programmability, no integrated session timing. The brand UX feels dated next to 2026 mask competitors.

## Who should buy LightStim for Wrinkles?

Choose LightStim for Wrinkles if you want a four-wavelength red + near-infrared handheld at accessible pricing and you accept handheld active use. For a lie-on mask, Omnilux Contour Face. For consumer market leader, CurrentBody Series 2. For ultra-budget handheld alternative, Solawave Wand.

---

## Background reading

- [Red light therapy — what the evidence shows](/science/evidence/red-light-therapy) — what is shown for skin ageing, and how much of it is maker-funded
- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid)
`,
  references: [
    { label: 'LightStim — official site', url: 'https://www.lightstim.com/' },
    { label: 'FDA 510(k) K120775 — LightStim for Wrinkles (2012)', url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K120775' },
    { label: 'FDA 510(k) K261482 — LightStim for Wrinkles, current model (2026)', url: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K261482' },
  ],
  relatedSlugs: ['solawave-wand-4-in-1', 'omnilux-contour-face', 'dr-dennis-gross-spectralite'],
  publishOn: '2026-07-06',
  faq: [
    { q: "Is LightStim for Wrinkles FDA-cleared?", a: "Yes. The FDA database lists 510(k) K120775 (2012) and, for the current battery model, K261482 (2026). FDA clearance means the FDA found a device substantially equivalent to one already on the market for a named use; it is not FDA approval, and the current model was cleared on safety and technical testing without clinical data. We found no published trials of this device. It uses four wavelengths: 605, 640, 652 and 850 nm." },
    { q: "How much does LightStim for Wrinkles cost?", a: "The LightStim for Wrinkles handheld costs $249, one of the lower prices among the red light devices we rank. The trade-off is convenience: it is a handheld you position by hand each session, with no app." },
    { q: "LightStim vs a red light face mask: which is better?", a: "We found no published trials of LightStim itself, so the choice comes down to form factor: it is a handheld you must actively move across your face each session, which is slower than a lie-on mask. Masks let you do other things during treatment. LightStim also has no app or session programming." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-10-10',
}

export default lightstim
