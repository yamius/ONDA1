import type { ToolReview } from './types'

const sunlightenMpulse: ToolReview = {
  slug: 'sunlighten-mpulse',
  name: 'Sunlighten mPulse 3-in-1',
  brand: 'Sunlighten',
  category: 'sauna',
  productType: 'Premium 3-in-1 IR cabin sauna (near, mid, far)',
  description:
    'ONDA review of the Sunlighten mPulse — the premium 3-in-1 infrared sauna delivering near, mid and far IR wavelengths separately. Scored on heat source, build, EMF and value.',
  verdict:
    'The premium category-leading IR sauna — true 3-wavelength delivery, premium cedar build, independently-measured low EMF.',
  summary:
    'Sunlighten mPulse 3-in-1 is the IR cabin sauna that defined the premium tier. Unlike most "full-spectrum" labels, mPulse actually delivers near, mid and far IR through three independent emitter systems — and you can program which wavelengths run per session. Cedar build, ultra-low EMF (verified by third-party measurement), 7-year warranty.',
  overallScore: 8.6,
  scores: [
    { criterionId: 'heat-source', score: 9.5, note: 'True 3-wavelength IR delivery — near (LED), mid and far (heating panels) run independently. Most-rigorous wavelength implementation in the consumer market.' },
    { criterionId: 'build', score: 9.0, note: 'Premium cedar cabin, 1–4-person configurations, 7-year warranty. Multi-decade reliability track record.' },
    { criterionId: 'emf', score: 9.0, note: 'Independently-measured ultra-low EMF at seated position (typically <1 mG). Sunlighten publishes the numbers.' },
    { criterionId: 'form-factor', score: 7.5, note: 'Cabin requires dedicated space (1-person from 4×4 ft; 4-person from 6×7 ft). 110V or 220V depending on size.' },
    { criterionId: 'evidence', score: 7.5, note: 'Substantial published research on Sunlighten units in particular. FDA Class II registered. Honest marketing language vs typical IR-sauna overclaiming.' },
    { criterionId: 'value', score: 6.5, note: '$5,000–$10,000+ depending on configuration. Premium pricing matched by build and verified specs.' },
  ],
  pros: [
    'True 3-wavelength IR (near + mid + far) with programmable control',
    'Independently-measured ultra-low EMF (<1 mG at seated position)',
    'Premium cedar build with 7-year warranty',
    'Substantial published research using Sunlighten units',
  ],
  cons: [
    '$5,000–$10,000+ pricing — premium tier',
    'Dedicated install space required (4×4 ft minimum)',
    'Larger configurations need 220V electrical',
    'Lead times can stretch during peak demand',
  ],
  bestFor: 'Best for serious daily-use IR sauna buyers who want true 3-wavelength delivery and verified low EMF.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Sunlighten product documentation, the published infrared sauna research literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 6000, note: '1-person from $5K; 4-person from $10K', asOf: '2026-05-25' },
  link: 'https://www.sunlighten.com/',
  linkType: 'official',
  content: `## Where it leads

Sunlighten mPulse 3-in-1 is the IR sauna that sets the standard for what "full-spectrum" should mean. Most competitors put a far-IR emitter behind the panel and call it full-spectrum; mPulse delivers near, mid and far IR through three independent emitter systems, programmable per session. Combined with cedar build, third-party-verified EMF and FDA Class II registration, this is the premium-tier reference.

## Where it falls short

Price and footprint. $5,000+ for the smallest configuration, dedicated install space required, lead times during peak demand.

## Who it is for

Choose Sunlighten mPulse if true 3-wavelength IR and verified low-EMF discipline are the deciding criteria, and you want the premium-tier build that has been the category reference for over a decade. For budget cabin IR, JNH or Therasage. For portable, HigherDose Blanket. For near-IR-only, SaunaSpace.

---

## Background reading

The biology of why infrared sauna works at the mitochondrial level.

- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why heat stress drives mitochondrial density
- [Longevity hardware and cellular cleanup](/articles/longevity-hardware-cellular-cleanup) — how sauna fits the broader autophagy/mitophagy stack
- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where sauna slots into a reset routine`,
  references: [
    { label: 'Sunlighten — official site', url: 'https://www.sunlighten.com/' },
    { label: 'Sunlighten research and clinical-grade IR documentation', url: 'https://www.sunlighten.com/research/' },
  ],
  relatedSlugs: ['clearlight-sanctuary-2', 'saunaspace-faraday', 'sun-home-equinox'],
  publishOn: '2026-06-04',
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default sunlightenMpulse
