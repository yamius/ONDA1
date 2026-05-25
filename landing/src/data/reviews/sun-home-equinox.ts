import type { ToolReview } from './types'

const sunHomeEquinox: ToolReview = {
  slug: 'sun-home-equinox',
  name: 'Sun Home Equinox',
  brand: 'Sun Home Saunas',
  category: 'sauna',
  productType: 'Mid-premium full-spectrum IR cabin sauna',
  description:
    'ONDA review of the Sun Home Equinox — newer mid-premium full-spectrum IR sauna with chromotherapy and sound system.',
  verdict:
    'A capable newer entrant — full-spectrum IR with bundled chromotherapy and sound, price-disciplined relative to category leaders.',
  summary:
    'Sun Home Equinox is the newer mid-premium IR sauna brand competing with Sunlighten and Clearlight by bundling more features at lower price. Full-spectrum IR via separate near and far emitters, chromotherapy lighting, Bluetooth sound system, cedar cabin. Solid execution from a newer brand, multi-year reliability track record still being built.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'heat-source', score: 8.0, note: 'Full-spectrum IR with separate near and far emitter panels. More wavelength rigour than mid-tier; less granular than Sunlighten mPulse.' },
    { criterionId: 'build', score: 8.0, note: 'Cedar cabin construction with bundled chromotherapy and Bluetooth audio. 5-year warranty.' },
    { criterionId: 'emf', score: 8.0, note: 'Documented low EMF; third-party-verified. Comparable to Clearlight at seated position.' },
    { criterionId: 'form-factor', score: 7.5, note: '1–4-person cabin configurations. Standard 110V or 220V depending on size.' },
    { criterionId: 'evidence', score: 6.0, note: 'Newer brand without the published-research footprint of Sunlighten. Honest marketing about being newer to market.' },
    { criterionId: 'value', score: 7.5, note: '$4,500–$8,000 depending on configuration. Bundled features (chromotherapy, audio) at price below comparable Sunlighten / Clearlight configs.' },
  ],
  pros: [
    'Full-spectrum IR with separate near and far emitters',
    'Bundled chromotherapy lighting and Bluetooth audio',
    'Cedar cabin with 5-year warranty',
    'Mid-premium pricing below comparable Sunlighten / Clearlight',
  ],
  cons: [
    'Newer brand — multi-year reliability data still being built',
    'Less rigorous wavelength control than Sunlighten mPulse',
    'Published-research footprint thinner than category leaders',
    'Bundled features may not be reasons users actually buy a sauna',
  ],
  bestFor: 'Best for users wanting category-leader-tier full-spectrum IR at marginally lower price with bundled extras.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Sun Home Saunas product documentation and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 6000, note: '2-person Equinox starting configuration', asOf: '2026-05-25' },
  link: 'https://sunhomesaunas.com/',
  linkType: 'official',
  content: `## Where it leads

Sun Home Equinox is the newer mid-premium IR sauna brand that bundles chromotherapy and audio to differentiate from Sunlighten / Clearlight while undercutting them on price. Full-spectrum delivery via separate near and far emitters, cedar build, 5-year warranty. Solid execution from a credible newer entrant.

## Where it falls short

Newer brand presence means less multi-year reliability data and thinner published-research footprint than Sunlighten or Clearlight. The bundled features are competently implemented but unlikely to be the reason most users buy a sauna.

## Who it is for

Choose Sun Home Equinox if you want category-leader-tier full-spectrum IR with marginally lower price and bundled extras. For longest-established brand pedigree, Sunlighten or Clearlight remain the safer picks.

---

## Background reading

The biology of why heat exposure works — and the protocols that compound with the hardware.

- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where sauna slots into a reset routine
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — the heat-shock side of the stress response
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — sauna as a daily anti-entropy stress dose
`,
  references: [
    { label: 'Sun Home Saunas — official site', url: 'https://sunhomesaunas.com/' },
  ],
  relatedSlugs: ['sunlighten-mpulse', 'clearlight-sanctuary-2', 'therasage-thera-sauna-personal'],
  publishOn: '2026-06-04',
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default sunHomeEquinox
