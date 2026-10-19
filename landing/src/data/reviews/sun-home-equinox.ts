import type { ToolReviewInput } from './types'

const sunHomeEquinox: ToolReviewInput = {
  slug: 'sun-home-equinox',
  name: 'Sun Home Equinox',
  brand: 'Sun Home Saunas',
  category: 'sauna',
  productType: 'Mid-premium full-spectrum IR cabin sauna',
  description:
    'Sun Home Equinox review: a full-spectrum infrared sauna with chromotherapy and sound bundled in, rated to 165°F (maker spec) and priced under Clearlight.',
  verdict:
    'A capable newer entrant — full-spectrum IR with bundled chromotherapy and sound, price-disciplined relative to category leaders.',
  summary:
    'Sun Home Equinox is the newer mid-premium IR sauna brand competing with Sunlighten and Clearlight by bundling more features. Full-spectrum IR via separate near and far emitters, a 165°F max temperature (maker spec), chromotherapy lighting, Bluetooth sound system, cedar cabin. Solid execution from a newer brand, multi-year reliability track record still being built.',
  scores: [
    { criterionId: 'heat-source', score: 8.0, note: 'Full-spectrum IR with separate near and far emitter panels. More wavelength rigour than mid-tier; less granular than Sunlighten mPulse.' },
    { criterionId: 'build', score: 8.0, note: 'Cedar cabin construction with bundled chromotherapy and Bluetooth audio. 7-year warranty (maker).' },
    { criterionId: 'emf', score: 8.0, note: 'Documented low EMF; third-party-verified. Comparable to Clearlight at seated position.' },
    { criterionId: 'form-factor', score: 7.5, note: '1–4-person cabin configurations. Standard 110V or 220V depending on size.' },
    { criterionId: 'evidence', score: 7.0, note: 'No peer-reviewed trial of the Equinox found, so it cannot score above ONDA’s ceiling for products without trials of their own. Honest marketing about being newer to market. Sun Home presents its evidence honestly: its research page says its products “have not been used in published clinical-outcome trials”.' },
    { criterionId: 'value', score: 7.5, note: '$4,500–$8,000 depending on configuration. Bundled features (chromotherapy, audio); the 2-person model lists at $6,799 ($6,099 on sale, official store, 2026-10-18), below Clearlight Sanctuary 2. Sunlighten publishes no online prices.' },
  ],
  pros: [
    'Full-spectrum IR with separate near and far emitters',
    'Bundled chromotherapy lighting and Bluetooth audio',
    'Cedar cabin with 7-year warranty (maker)',
    'Mid-premium pricing below the Clearlight Sanctuary 2',
  ],
  cons: [
    'Newer brand — multi-year reliability data still being built',
    'Less rigorous wavelength control than Sunlighten mPulse',
    'No peer-reviewed trial of the Equinox itself',
    'Bundled features may not be reasons users actually buy a sauna',
  ],
  bestFor: 'Best for users wanting full-spectrum IR with separate near/far emitters at a mid-premium price with bundled extras.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Sun Home Saunas product documentation and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 6000, note: '2-person Equinox starting configuration', asOf: '2026-05-25' },
  link: 'https://sunhomesaunas.com/',
  linkType: 'official',
  content: `## Where it leads

Sun Home Equinox is the newer mid-premium IR sauna brand that bundles chromotherapy and audio to differentiate from Sunlighten / Clearlight, priced below the Clearlight Sanctuary 2. Full-spectrum delivery via separate near and far emitters, cedar build, 7-year warranty (maker). Solid execution from a credible newer entrant.

## What are the downsides of Sun Home Equinox?

Newer brand presence means less multi-year reliability data than Sunlighten or Clearlight. The bundled features are competently implemented but unlikely to be the reason most users buy a sauna.

## Who should buy Sun Home Equinox?

Choose Sun Home Equinox if you want full-spectrum IR with separate near/far emitters, a mid-premium price and bundled extras. For longest-established brand pedigree, Sunlighten or Clearlight remain the safer picks.

---

## Background reading

Background reading on the ideas behind heat exposure — mostly hypotheses, not effects shown in people.

- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where sauna slots into a reset routine
- [HPA-axis control and cortisol regulation](/articles/hpa-axis-control-cortisol-aggression) — the heat-shock side of the stress response
- [Anti-entropy neural architecture](/articles/anti-entropy-neural-architecture) — sauna as a daily heat-stress dose
`,
  references: [
    { label: 'Sun Home Saunas — official site', url: 'https://sunhomesaunas.com/' },
  ],
  relatedSlugs: ['sunlighten-mpulse', 'clearlight-sanctuary-2', 'therasage-thera-sauna-personal'],
  publishOn: '2026-06-04',
  faq: [
    { q: "Is the Sun Home Equinox worth it?", a: "The Sun Home Equinox is worth it if you want full-spectrum IR with separate near/far emitters at a mid-premium price. It has separate near and far emitters, chromotherapy, Bluetooth audio and a cedar cabin with 7-year warranty (maker). It is a newer brand with less rigorous wavelength control than Sunlighten mPulse." },
    { q: "How much does the Sun Home Equinox cost?", a: "The Sun Home Equinox 2-person configuration lists at $6,799 on the official store ($6,099 on sale as of October 2026). That sits in mid-premium territory, below the Clearlight Sanctuary 2 ($7,299); Sunlighten does not publish prices online. It includes chromotherapy lighting and Bluetooth audio." },
    { q: "Sun Home Equinox vs Sunlighten mPulse: which is better?", a: "Sunlighten mPulse is the stronger pick for rigorous wavelength control. Sun Home Equinox offers full-spectrum IR with bundled extras at mid-premium pricing; Sunlighten does not publish prices online, so get a quote to compare. Choose Equinox for value, mPulse for finer wavelength control." },
  ],
  datePublished: '2026-05-25',
  dateModified: '2026-10-10',
}

export default sunHomeEquinox
