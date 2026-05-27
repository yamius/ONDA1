import type { ToolReview } from './types'

const lumaraViso: ToolReview = {
  slug: 'lumara-viso',
  name: 'Lumara Viso',
  brand: 'Lumara',
  category: 'red-light-mask',
  productType: 'Premium high-LED flexible silicone red light face mask',
  description:
    'ONDA review of the Lumara Viso — 2026 premium-tier flexible silicone face mask with 470 LEDs and medical-grade build. Scored on irradiance, wavelength, LED count and value.',
  verdict:
    'Highest LED count in 2026 — 470 LEDs in flexible silicone with neck coverage. Premium pricing; clinical-evidence moat lighter than Omnilux.',
  summary:
    'Lumara Viso is the 2026 premium-spec winner — 470 LEDs (highest in consumer red light masks), flexible medical-grade silicone, integrated neck flap, three-wavelength coverage (red 633 nm + near-infrared 830 nm + amber 590 nm). Brand newer than Omnilux or CurrentBody but the spec sheet is aggressive. Premium pricing reflects the LED count and build; clinical-evidence moat is lighter than dermatology references.',
  overallScore: 7.8,
  scores: [
    { criterionId: 'irradiance', score: 8.5, note: '470 LEDs deliver high irradiance across treatment area. Documented spec; less independently verified than Omnilux.' },
    { criterionId: 'wavelength-coverage', score: 9.0, note: 'Red 633 nm + near-infrared 830 nm + amber 590 nm — three wavelengths covering surface skin, deeper tissue and pigmentation. Broader than the standard red + NIR pair.' },
    { criterionId: 'led-count-coverage', score: 9.5, note: '470 LEDs — highest in consumer red light masks. Coverage extends face + neck with even distribution. The 2026 LED-count benchmark.' },
    { criterionId: 'clinical-evidence', score: 6.5, note: 'FDA registered. Brand newer than dermatology references; no peer-reviewed clinical studies on the specific device yet. Spec-driven rather than evidence-driven.' },
    { criterionId: 'comfort-fit', score: 8.5, note: 'Medical-grade flexible silicone — comparable comfort to Omnilux and CurrentBody. 470 LEDs add weight but distribution keeps it wearable.' },
    { criterionId: 'value', score: 6.0, note: '$650 — premium-tier pricing. Per-LED cost is competitive given the 470-count; per-clinical-study cost is weak.' },
  ],
  pros: [
    '470 LEDs — highest count in consumer red light masks',
    'Three-wavelength coverage (red + NIR + amber)',
    'Integrated neck flap',
    'Flexible medical-grade silicone build',
  ],
  cons: [
    'Lighter clinical-evidence moat than Omnilux',
    'Premium pricing ($650)',
    'Newer brand without multi-year track record',
    'Spec-driven marketing leans on LED count over published studies',
  ],
  bestFor: 'Best for users wanting maximum LED count and three-wavelength coverage in flexible silicone — premium spec maximalism over dermatology-clinical pedigree.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Lumara product documentation and 2026 consumer reviews. Not hands-on tested by ONDA.',
  price: { usd: 650, note: 'Viso flagship; neck flap included', asOf: '2026-05-28' },
  link: 'https://www.lumara.com/',
  linkType: 'official',
  content: `## Where it leads

Lumara Viso is the 2026 spec-maximalist reference — 470 LEDs, three-wavelength coverage (red + NIR + amber), flexible silicone with integrated neck flap. The LED count is by far the highest in the consumer category and the wavelength mix is broader than the standard red + NIR pair.

## Where it falls short

Clinical evidence and price. Lumara is a newer brand than Omnilux, CurrentBody or Dr. Dennis Gross — FDA registered but no peer-reviewed studies on the specific device yet. At $650 the premium relies on spec maximalism rather than clinical-evidence moat. For evidence-first buyers, Omnilux remains the rational reference.

## Who it is for

Choose Lumara Viso if you want maximum LED count and three-wavelength coverage in premium silicone. For FDA Class II evidence reference, Omnilux Contour Face. For consumer market leader with neck flap, CurrentBody Series 2. For dermatology-brand pedigree, Dr. Dennis Gross.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'Lumara — official site', url: 'https://www.lumara.com/' },
  ],
  relatedSlugs: ['omnilux-contour-face', 'currentbody-series-2', 'higherdose-red-light-face-mask'],
  publishOn: '2026-07-06',
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
}

export default lumaraViso
