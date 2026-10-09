import type { ToolReviewInput } from './types'

const lumaraViso: ToolReviewInput = {
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
  scores: [
    { criterionId: 'irradiance', score: 8.5, note: '470 LEDs deliver high irradiance across treatment area. Documented spec; less independently verified than Omnilux.' },
    { criterionId: 'wavelength-coverage', score: 9.0, note: 'Red 633 nm + near-infrared 830 nm + amber 590 nm — three wavelengths covering surface skin, deeper tissue and pigmentation. Broader than the standard red + NIR pair.' },
    { criterionId: 'led-count-coverage', score: 9.5, note: '470 LEDs — highest in consumer red light masks. Coverage extends face + neck with even distribution. The 2026 LED-count benchmark.' },
    { criterionId: 'clinical-evidence', score: 6.0, note: 'FDA registered (a listing, not clearance or approval). Brand newer than dermatology references; no peer-reviewed clinical studies on the specific device yet. Spec-driven rather than evidence-driven.' },
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

## What are the downsides of Lumara Viso?

Clinical evidence and price. Lumara is a newer brand than Omnilux, CurrentBody or Dr. Dennis Gross — FDA registered (a listing, not clearance) but no peer-reviewed studies on the specific device yet. At $650 the premium relies on spec maximalism rather than clinical-evidence moat. For evidence-first buyers, Omnilux remains the rational reference.

## Who should buy Lumara Viso?

Choose Lumara Viso if you want maximum LED count and three-wavelength coverage in premium silicone. For a peer-reviewed evidence reference, Omnilux Contour Face. For consumer market leader with neck flap, CurrentBody Series 2. For dermatology-brand pedigree, Dr. Dennis Gross.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid)
`,
  references: [
    { label: 'Lumara — official site', url: 'https://www.lumara.com/' },
  ],
  relatedSlugs: ['omnilux-contour-face', 'currentbody-series-2', 'higherdose-red-light-face-mask'],
  publishOn: '2026-07-06',
  faq: [
    { q: "Is the Lumara Viso worth it?", a: "The Lumara Viso is worth it if you want spec maximalism: 470 LEDs, the highest count in consumer red light masks, plus red, NIR and amber wavelengths, an integrated neck flap and flexible medical-grade silicone. If dermatology-clinical pedigree matters more, its lighter evidence base is the trade-off." },
    { q: "How much does the Lumara Viso cost?", a: "The Lumara Viso flagship is listed at $650, with the neck flap included. That is premium pricing for a red light mask, and the review notes the brand leans on LED count in its marketing rather than on published studies." },
    { q: "What are the downsides of the Lumara Viso?", a: "The Lumara Viso has a lighter clinical-evidence moat than Omnilux, premium pricing at $650, and it comes from a newer brand without a multi-year track record. Its spec-driven marketing leans on LED count over published studies, so buyers get specs rather than device-specific research." },
    { q: "Lumara Viso vs Omnilux: which is better?", a: "Omnilux is the stronger pick for clinical evidence, while the Lumara Viso wins on raw specs. Viso offers 470 LEDs, three wavelengths and an included neck flap in flexible silicone; its evidence moat is lighter than Omnilux's. Choose Viso for coverage, Omnilux for dermatology pedigree." },
  ],
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
}

export default lumaraViso
