import type { ToolReview } from './types'

const jovsDpl: ToolReview = {
  slug: 'jovs-dpl-photofacial-mask',
  name: 'JOVS DPL Photofacial Mask',
  brand: 'JOVS',
  category: 'red-light-mask',
  productType: 'Korean-built multi-wavelength LED face mask',
  description:
    'ONDA review of the JOVS DPL Photofacial Mask — Korean-built multi-wavelength red light face mask with seven-wavelength protocols. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Best multi-wavelength spec for the price — Korean K-beauty tech with seven wavelength modes. Light clinical-evidence moat; brand newer than category references.',
  summary:
    'JOVS DPL Photofacial Mask is the K-beauty multi-wavelength entry — seven wavelength modes (red, blue, amber, green and more), hard-shell hybrid build, $399 pricing. Brand recognised in K-beauty / Asian skincare market but newer in Western consumer red light category. Spec maximalism over clinical-evidence depth.',
  overallScore: 6.8,
  scores: [
    { criterionId: 'irradiance', score: 6.5, note: 'Documented irradiance per mode. Less independently verified than category references; spec sheets emphasize peak rather than continuous output.' },
    { criterionId: 'wavelength-coverage', score: 9.0, note: 'Seven wavelength modes — broadest coverage in consumer face masks. Goes beyond standard red + NIR into blue / amber / green.' },
    { criterionId: 'led-count-coverage', score: 7.0, note: 'Solid LED count across hard-shell coverage. No neck flap.' },
    { criterionId: 'clinical-evidence', score: 5.5, note: 'FDA registered. Strong K-beauty consumer market but limited Western peer-reviewed validation on the specific device.' },
    { criterionId: 'comfort-fit', score: 6.5, note: 'Hard-shell hybrid build — less comfortable than full silicone alternatives. Korean ergonomic design tries to soften the hard form factor.' },
    { criterionId: 'value', score: 7.5, note: '$399 — accessible mid-tier pricing for the multi-wavelength spec. Strong per-wavelength cost.' },
  ],
  pros: [
    'Seven wavelength modes — broadest spectrum coverage in consumer category',
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
    'Evidence-based assessment — scored from JOVS product documentation, FDA registration and 2026 K-beauty / Western consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 399, note: 'DPL Photofacial Mask standalone', asOf: '2026-05-28' },
  link: 'https://www.jovs.com/',
  linkType: 'official',
  content: `## Where it leads

JOVS DPL Photofacial Mask is the K-beauty multi-wavelength entry — seven wavelength modes (red, blue, amber, green and more), accessible $399 pricing, Korean engineering pedigree. Best spectrum coverage in the consumer face-mask category.

## Where it falls short

Western clinical evidence and comfort. JOVS has K-beauty market credibility but limited Western peer-reviewed validation on the specific device. Hard-shell hybrid build is less comfortable than full silicone alternatives.

## Who it is for

Choose JOVS DPL for maximum wavelength coverage at mid-tier pricing. For Western clinical evidence reference, Omnilux Contour Face. For consumer market leader silicone, CurrentBody Series 2. For dermatology-brand dual-spectrum, Dr. Dennis Gross.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'JOVS — official site', url: 'https://www.jovs.com/' },
  ],
  relatedSlugs: ['dr-dennis-gross-spectralite', 'lumara-viso', 'currentbody-series-2'],
  publishOn: '2026-07-06',
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
}

export default jovsDpl
