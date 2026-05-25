import type { ToolReview } from './types'

const saunaspaceFaraday: ToolReview = {
  slug: 'saunaspace-faraday',
  name: 'SaunaSpace Faraday',
  brand: 'SaunaSpace',
  category: 'sauna',
  productType: 'Near-IR incandescent sauna with Faraday cage',
  description:
    'ONDA review of the SaunaSpace Faraday — near-IR incandescent sauna with full Faraday-cage EMF shielding.',
  verdict:
    'The biohacker premium near-IR sauna — incandescent emitters, full Faraday cage, distinct from full-spectrum IR.',
  summary:
    'SaunaSpace Faraday is the near-IR incandescent sauna that defined the biohacker premium tier. Tungsten-filament incandescent bulbs deliver near-IR (no carbon-fibre far-IR heaters), full Faraday-cage shielding eliminates external EMF, all-wood construction. Different category positioning from full-spectrum IR — incandescent near-IR is the SaunaSpace bet.',
  overallScore: 8.0,
  scores: [
    { criterionId: 'heat-source', score: 9.0, note: 'Tungsten-filament incandescent bulbs delivering near-IR (700–1200 nm). Distinct from carbon/ceramic far-IR; closer to natural sunlight spectrum.' },
    { criterionId: 'build', score: 8.5, note: 'All-wood (poplar) construction with Faraday-cage EMF shielding. 5-year warranty. Strong build-quality reputation.' },
    { criterionId: 'emf', score: 9.5, note: 'Full Faraday-cage shielding — eliminates external EMF entirely. The most rigorous EMF discipline in the consumer sauna category.' },
    { criterionId: 'form-factor', score: 7.0, note: '1-person tent-style or cabin configurations. Smaller footprint than full cabin IR; tent requires assembly.' },
    { criterionId: 'evidence', score: 7.0, note: 'Founder-led with serious biohacker community presence. Honest about near-IR-vs-full-spectrum distinction; no overclaiming.' },
    { criterionId: 'value', score: 6.5, note: '$4,000–$6,500 depending on configuration. Premium tier; the Faraday cage is the value differentiator.' },
  ],
  pros: [
    'Tungsten-filament incandescent near-IR — distinct from carbon-fibre far-IR',
    'Full Faraday-cage EMF shielding — the most rigorous in the consumer category',
    'All-wood (poplar) construction with 5-year warranty',
    'Strong biohacker community brand presence',
  ],
  cons: [
    'Near-IR-only — no mid or far IR',
    'Tent-style configurations require assembly',
    'Premium pricing — $4K+ for the base setup',
    'Smaller user base than mainstream IR brands (Sunlighten, Clearlight)',
  ],
  bestFor: 'Best for biohackers prioritising near-IR-specific protocols and ultimate EMF discipline.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from SaunaSpace product documentation, the near-IR research literature and independent 2026 biohacker reviews. Not hands-on tested by ONDA.',
  price: { usd: 5000, note: 'tent configuration; cabin from $6,500', asOf: '2026-05-25' },
  link: 'https://sauna.space/',
  linkType: 'official',
  content: `## Where it leads

SaunaSpace Faraday is the near-IR-specific premium sauna. Instead of carbon-fibre far-IR heaters, it uses tungsten-filament incandescent bulbs that deliver the near-IR spectrum closer to natural sunlight. Combined with full Faraday-cage EMF shielding and all-wood construction, it occupies a distinct premium niche that biohackers specifically seek out.

## Where it falls short

Near-IR-only. Users who want full-spectrum IR will find SaunaSpace’s wavelength coverage narrower than Sunlighten or Clearlight by design. Tent configurations require assembly. Mainstream IR-sauna users typically end up at Sunlighten or Clearlight instead.

## Who it is for

Choose SaunaSpace Faraday if near-IR-specific exposure and maximum EMF shielding are the deciding criteria. For full-spectrum cabin IR, Sunlighten mPulse. For portable IR, HigherDose Blanket.

---

## Background reading

The biology of why heat exposure works — and the protocols that compound with the hardware.

- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why heat stress drives mitochondrial density up
- [Mitochondrial DNA and red light](/articles/mitochondrial-dna-red-light) — how near-IR photons reach mitochondria — the mechanism IR saunas borrow
- [Longevity hardware and cellular cleanup](/articles/longevity-hardware-cellular-cleanup) — how sauna fits the broader autophagy / mitophagy stack
`,
  references: [
    { label: 'SaunaSpace — official site', url: 'https://sauna.space/' },
  ],
  relatedSlugs: ['sunlighten-mpulse', 'clearlight-sanctuary-2', 'therasage-thera-sauna-personal'],
  publishOn: '2026-06-04',
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default saunaspaceFaraday
