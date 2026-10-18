import type { ToolReviewInput } from './types'

const jovsDpl: ToolReviewInput = {
  slug: 'jovs-dpl-photofacial-mask',
  name: 'JOVS DPL Photofacial Mask',
  brand: 'JOVS',
  category: 'red-light-mask',
  productType: 'Korean-built multi-wavelength LED face mask',
  description:
    'ONDA review of the JOVS DPL Photofacial Mask, a Korean-built LED face mask with seven wavelength modes. Scored on irradiance, evidence and value.',
  verdict:
    'Seven wavelength modes (maker spec) at a mid-tier price — Korean K-beauty tech. Limited clinical evidence; brand newer than category references.',
  summary:
    'JOVS DPL Photofacial Mask is the K-beauty multi-wavelength entry — seven wavelength modes (red, blue, amber, green and more), hard-shell hybrid build, $399 pricing. Brand recognised in K-beauty / Asian skincare market but newer in Western consumer red light category. Spec maximalism over clinical-evidence depth.',
  scores: [
    { criterionId: 'irradiance', score: 6.5, note: 'Documented irradiance per mode. Less independently verified than category references; spec sheets emphasize peak rather than continuous output.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: "Seven wavelength modes (as reviewed). Stated purposes per retail copy: uneven tone, redness and pigmentation, plus wrinkles and acne — JOVS's own product page could not be reached (2026-10-13); re-check. Counted as covering wrinkles (red / near-infrared) and acne (blue / red); extra modes add no score." },
    { criterionId: 'led-count-coverage', score: 7.0, note: 'Solid LED count across hard-shell coverage. No neck flap.' },
    { criterionId: 'clinical-evidence', score: 5.5, note: 'FDA registered (a listing, not clearance or approval). 510(k) K261851 covers the OEM’s LED masks JML1–JML10; whether the DPL mask is included is not visible in the FDA database. Strong K-beauty consumer market but limited Western peer-reviewed validation on the specific device.' },
    { criterionId: 'comfort-fit', score: 6.5, note: 'Hard-shell hybrid build — less comfortable than full silicone alternatives. Korean ergonomic design tries to soften the hard form factor.' },
    { criterionId: 'value', score: 7.5, note: '$399 — accessible mid-tier pricing for the multi-wavelength spec. Strong per-wavelength cost.' },
  ],
  pros: [
    'Seven wavelength modes (maker spec)',
    'Accessible $399 pricing for the multi-wavelength spec',
    'K-beauty engineering pedigree',
    'Multiple session modes for different indications',
  ],
  cons: [
    'Light Western clinical-evidence base',
    'Hard-shell hybrid less comfortable than silicone',
    'No neck flap',
    'Newer brand in Western market without multi-year track record',
  ],
  bestFor: 'Best for users wanting maximum wavelength coverage at mid-tier pricing — spec maximalism over Western clinical-evidence credentials.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from JOVS product documentation, the brand’s FDA-registration statement and 2026 K-beauty / Western consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 399, note: 'DPL Photofacial Mask standalone', asOf: '2026-05-28' },
  link: 'https://www.jovs.com/',
  linkType: 'official',
  content: `## Where it leads

JOVS DPL Photofacial Mask is the K-beauty multi-wavelength entry — seven wavelength modes (red, blue, amber, green and more), accessible $399 pricing, Korean engineering pedigree. Seven wavelength modes (maker spec).

## What are the downsides of JOVS DPL Photofacial Mask?

Western clinical evidence and comfort. JOVS has K-beauty market credibility but limited Western peer-reviewed validation on the specific device. Hard-shell hybrid build is less comfortable than full silicone alternatives.

## Who should buy JOVS DPL Photofacial Mask?

Choose JOVS DPL for maximum wavelength coverage at mid-tier pricing. For a red + near-infrared silicone mask, Omnilux Contour Face. For consumer market leader silicone, CurrentBody Series 2. For dermatology-brand dual-spectrum, Dr. Dennis Gross.

---

## Background reading

- [Mitochondrial DNA and red light](/articles/mitochondrial-dna-red-light) — background on how red and near-infrared light reach cells
`,
  references: [
    { label: 'JOVS — official site', url: 'https://www.jovs.com/' },
  ],
  relatedSlugs: ['dr-dennis-gross-spectralite', 'lumara-viso', 'currentbody-series-2'],
  publishOn: '2026-07-06',
  faq: [
    { q: "How many wavelengths does the JOVS DPL mask have?", a: "The JOVS DPL Photofacial Mask has seven wavelength modes, including red, blue, amber and green (maker spec). It also offers multiple session modes for different indications, all at a $399 price." },
    { q: "Who is the JOVS DPL Photofacial Mask best for?", a: "It suits buyers who want maximum wavelength coverage at mid-tier pricing and value spec over Western clinical credentials. It brings K-beauty engineering and seven modes for $399. Buyers who prioritise comfort or clinical evidence may prefer silicone masks or brands with a longer Western track record." },
    { q: "What are the downsides of the JOVS DPL Photofacial Mask?", a: "Its Western clinical-evidence base is light, and its hard-shell hybrid build is less comfortable than silicone masks. There is no neck flap. JOVS is recognised in K-beauty but newer in the Western red-light market, without a multi-year track record there." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-10-10',
}

export default jovsDpl
