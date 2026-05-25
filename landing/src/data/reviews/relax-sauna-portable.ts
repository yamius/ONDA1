import type { ToolReview } from './types'

const relaxSaunaPortable: ToolReview = {
  slug: 'relax-sauna-portable',
  name: 'Relax Sauna Portable',
  brand: 'Relax Sauna',
  category: 'sauna',
  productType: 'Portable far-IR sauna (tent / chair configuration)',
  description:
    'ONDA review of the Relax Sauna Portable — the long-running portable far-IR sauna in tent / chair form.',
  verdict:
    'The veteran portable far-IR sauna — chair-and-tent design, low EMF, niche but real product.',
  summary:
    'Relax Sauna Portable is the long-running chair-and-tent portable far-IR sauna. Foldable enclosure plus seated configuration delivers far-IR exposure without cabin commitment. Smaller user base than HigherDose Blanket but with documented low EMF and a real 20+ year manufacturing track record.',
  overallScore: 6.4,
  scores: [
    { criterionId: 'heat-source', score: 6.5, note: 'Far-IR-only via semiconductor far-IR generators. Documented far-IR wavelength range; no near or mid.' },
    { criterionId: 'build', score: 7.0, note: 'Long-running brand (20+ years). Tent / chair construction is foldable for storage. Standard warranty.' },
    { criterionId: 'emf', score: 7.5, note: 'Documented low EMF; third-party-verified across multiple independent reviews.' },
    { criterionId: 'form-factor', score: 8.5, note: 'Tent and chair fold for storage. No install. Head outside the enclosure during use (different ergonomic from blanket).' },
    { criterionId: 'evidence', score: 5.5, note: 'Smaller research footprint than mainstream IR brands. Marketing wellness-tier.' },
    { criterionId: 'value', score: 6.5, note: '$1,500 — pricier than HigherDose Blanket for arguably narrower form-factor fit.' },
  ],
  pros: [
    'Long-running brand with multi-decade reliability track record',
    'Documented low EMF',
    'Foldable for storage — no install',
    'Chair-and-tent ergonomic suits users uncomfortable with prone blanket',
  ],
  cons: [
    'Far-IR only — no near or mid IR',
    'Pricier than HigherDose Blanket for portable IR',
    'Smaller user base than mainstream IR brands',
    'Chair-and-tent form factor more involved to set up than a blanket',
  ],
  bestFor: 'Best for users wanting upright portable far-IR sauna without cabin or blanket commitment.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Relax Sauna product documentation and independent 2026 portable-IR reviews. Not hands-on tested by ONDA.',
  price: { usd: 1500, note: 'one-time; chair + tent configuration', asOf: '2026-05-25' },
  link: 'https://www.relaxsaunas.com/',
  linkType: 'official',
  content: `## Where it leads

Relax Sauna Portable is the upright portable far-IR option for users uncomfortable with the prone blanket form factor. Chair-and-tent design, foldable, no install, documented low EMF, 20+ year brand track record. For users who want seated IR exposure that packs away, this is the right shape.

## Where it falls short

Pricier than HigherDose Blanket for narrower form-factor flexibility. Far-IR-only spectrum. Smaller user base and research footprint than mainstream IR brands.

## Who it is for

Choose Relax Sauna Portable if you want upright seated portable IR and the chair-tent ergonomic specifically suits you. For blanket-style portable, HigherDose. For cabin IR, Sunlighten / Clearlight / JNH.

---

## Background reading

The biology of why heat exposure works — and the protocols that compound with the hardware.

- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where sauna slots into a reset routine
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — the heat-shock side of the stress response
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — sauna as a daily anti-entropy stress dose
`,
  references: [
    { label: 'Relax Sauna — official site', url: 'https://www.relaxsaunas.com/' },
  ],
  relatedSlugs: ['higherdose-blanket-v4', 'therasage-thera-sauna-personal', 'jnh-lifestyles-joyous'],
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default relaxSaunaPortable
