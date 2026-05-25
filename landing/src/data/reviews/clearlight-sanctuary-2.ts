import type { ToolReview } from './types'

const clearlightSanctuary2: ToolReview = {
  slug: 'clearlight-sanctuary-2',
  name: 'Clearlight Sanctuary 2',
  brand: 'Clearlight (Jacuzzi)',
  category: 'sauna',
  productType: 'Premium full-spectrum IR cabin sauna (2-person)',
  description:
    'ONDA review of the Clearlight Sanctuary 2 — Jacuzzi-owned premium 2-person full-spectrum IR sauna.',
  verdict:
    'The closest premium competitor to Sunlighten — full-spectrum IR, Jacuzzi-backed warranty, slightly cheaper.',
  summary:
    'Clearlight Sanctuary 2 is the Jacuzzi-owned premium IR sauna. Full-spectrum delivery (near + mid + far IR), basswood or red cedar cabin, third-party EMF measurement, lifetime warranty on heaters under Jacuzzi’s backing. Slightly less rigorous wavelength implementation than Sunlighten mPulse but at a marginally lower price.',
  overallScore: 8.3,
  scores: [
    { criterionId: 'heat-source', score: 8.5, note: 'Full-spectrum IR via True Wave heaters — combined near, mid and far in single emitters (less granular than mPulse but credibly broad-spectrum).' },
    { criterionId: 'build', score: 8.5, note: 'Basswood or red cedar cabin. Lifetime warranty on heaters (Jacuzzi backing). Multi-decade brand reliability.' },
    { criterionId: 'emf', score: 8.5, note: 'Independently-measured low EMF; published numbers. Slightly higher at seated position than Sunlighten but well within acceptable range.' },
    { criterionId: 'form-factor', score: 7.5, note: '2-person cabin from 4×3.5 ft. 110V or 220V depending on configuration.' },
    { criterionId: 'evidence', score: 7.0, note: 'Jacuzzi-backed product line with consumer-grade infrared sauna research footprint. FDA Class II registration in some configurations.' },
    { criterionId: 'value', score: 7.0, note: '$4,500–$7,500 — slightly cheaper than Sunlighten mPulse for comparable feature set.' },
  ],
  pros: [
    'Full-spectrum IR with Jacuzzi-backed lifetime heater warranty',
    'Choice of basswood or red cedar cabin construction',
    'Independently-measured low EMF',
    'Slightly cheaper than Sunlighten for comparable spec',
  ],
  cons: [
    'Less granular wavelength control than Sunlighten mPulse (no separate near/mid/far programming)',
    'Premium tier — $4,500+ for 2-person',
    'Heater design combines wavelengths rather than dedicating emitters',
    'Lead times during peak demand',
  ],
  bestFor: 'Best for buyers wanting Sunlighten-tier full-spectrum IR with Jacuzzi backing at marginally lower cost.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Clearlight product documentation and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 5500, note: '2-person Sanctuary 2 base configuration', asOf: '2026-05-25' },
  link: 'https://infraredsauna.com/',
  linkType: 'official',
  content: `## Where it leads

Clearlight Sanctuary 2 is the closest premium competitor to Sunlighten mPulse. Full-spectrum IR delivery, Jacuzzi-owned brand backing with lifetime heater warranty, basswood or red cedar build, independently-measured low EMF, FDA Class II in some configs. Marginally cheaper than Sunlighten for comparable feature depth.

## Where it falls short

The full-spectrum implementation combines wavelengths in single emitters rather than running separate near/mid/far systems like Sunlighten mPulse. Less granular control per session.

## Who it is for

Choose Clearlight Sanctuary 2 if you want premium full-spectrum IR with Jacuzzi brand backing and marginally lower price than Sunlighten. For programmable per-wavelength control, mPulse is the right shape.

---

## Background reading

The biology of why heat exposure works — and the protocols that compound with the hardware.

- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where sauna slots into a reset routine
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — the heat-shock side of the stress response
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — sauna as a daily anti-entropy stress dose
`,
  references: [
    { label: 'Clearlight Infrared Saunas — official site', url: 'https://infraredsauna.com/' },
  ],
  relatedSlugs: ['sunlighten-mpulse', 'sun-home-equinox', 'saunaspace-faraday'],
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default clearlightSanctuary2
