import type { ToolReview } from './types'

const drDennisGross: ToolReview = {
  slug: 'dr-dennis-gross-spectralite',
  name: 'Dr. Dennis Gross SpectraLite FaceWare Pro',
  brand: 'Dr. Dennis Gross Skincare',
  category: 'red-light-mask',
  productType: 'Hard-shell dermatology-brand red + blue LED face mask',
  description:
    'ONDA review of the Dr. Dennis Gross SpectraLite FaceWare Pro — dermatology-brand FDA-cleared hard-shell red + blue LED face mask. Scored on irradiance, wavelength, evidence and value.',
  verdict:
    'Best dermatology-brand pedigree — FDA-cleared, dual red + blue protocol (anti-aging + acne), hard-shell build. Less comfortable than silicone alternatives.',
  summary:
    'Dr. Dennis Gross SpectraLite FaceWare Pro is the dermatology-brand reference — backed by Dr. Dennis Gross\'s decades of dermatology practice, FDA-cleared, and one of the few masks combining red 633 nm (anti-aging) with blue 415 nm (acne) in alternating protocols. Hard-shell construction is the trade-off — less comfortable than silicone but cheaper to manufacture and proven over multiple device generations. 3-minute session protocol is the shortest in the category.',
  overallScore: 8.0,
  scores: [
    { criterionId: 'irradiance', score: 8.0, note: 'Documented irradiance honest for the 3-minute protocol. Shorter session compensated by higher LED density.' },
    { criterionId: 'wavelength-coverage', score: 8.5, note: 'Red 633 nm + blue 415 nm — dual-spectrum approach unique among hard-shell masks. Covers anti-aging and acne in alternating protocols.' },
    { criterionId: 'led-count-coverage', score: 7.0, note: '162 LEDs across hard-shell coverage. Even distribution on the face surface; no neck flap.' },
    { criterionId: 'clinical-evidence', score: 8.5, note: 'FDA-cleared device, backed by Dr. Dennis Gross dermatology practice. Brand-funded studies on the dual-spectrum protocol. Strong dermatology-brand credibility.' },
    { criterionId: 'comfort-fit', score: 6.5, note: 'Hard-shell construction — less comfortable than flexible silicone alternatives. Weight noticeable on extended sessions. Pro tier is more refined than the original FaceWare.' },
    { criterionId: 'value', score: 7.0, note: '$455 — premium pricing for the dermatology-brand pedigree. Comparable to Omnilux Contour with dual-spectrum trade.' },
  ],
  pros: [
    'Strongest dermatology-brand pedigree (Dr. Dennis Gross)',
    'Dual red + blue spectrum for anti-aging + acne',
    'FDA-cleared with brand-funded clinical studies',
    'Shortest session protocol in category (3 min)',
  ],
  cons: [
    'Hard-shell construction less comfortable than flexible silicone',
    'No neck flap',
    'Heavy for extended unattended wear',
    '$455 premium pricing without silicone comfort',
  ],
  bestFor: 'Best for users wanting dermatology-brand pedigree with dual red + blue spectrum coverage (anti-aging + acne) and accepting hard-shell comfort trade-off.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Dr. Dennis Gross Skincare product documentation, FDA registration and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 455, note: 'FaceWare Pro model', asOf: '2026-05-28' },
  link: 'https://drdennisgross.com/',
  linkType: 'official',
  content: `## Where it leads

Dr. Dennis Gross SpectraLite FaceWare Pro is the dermatology-brand reference — backed by Dr. Dennis Gross\'s decades of dermatology practice and the rare dual red + blue spectrum protocol (anti-aging + acne in alternating modes). FDA-cleared, brand-funded studies, strong skincare-vertical credibility.

## Where it falls short

Hard-shell comfort. The Pro is meaningfully better than the original FaceWare but still hard-plastic — flexible-silicone competitors (Omnilux, CurrentBody, Lumara) deliver better wearability. No neck flap. Heavy for long unattended sessions.

## Who it is for

Choose Dr. Dennis Gross SpectraLite if you want dermatology-brand pedigree with dual red + blue spectrum and accept the hard-shell trade. For FDA Class II silicone, Omnilux Contour Face. For consumer market reference with neck flap, CurrentBody Series 2. For premium spec maximalism, Lumara Viso.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols)
`,
  references: [
    { label: 'Dr. Dennis Gross Skincare — official site', url: 'https://drdennisgross.com/' },
  ],
  relatedSlugs: ['omnilux-contour-face', 'currentbody-series-2', 'lightstim-for-wrinkles'],
  publishOn: '2026-07-06',
  datePublished: '2026-07-06',
  dateModified: '2026-07-06',
}

export default drDennisGross
