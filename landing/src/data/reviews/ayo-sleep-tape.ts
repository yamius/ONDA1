import type { ToolReview } from './types'

const ayoSleepTape: ToolReview = {
  slug: 'ayo-sleep-tape',
  name: 'AYO Sleep Tape',
  brand: 'AYO',
  category: 'breathing-aid',
  productType: 'Korean hypoallergenic single-piece mouth tape',
  description:
    'ONDA review of AYO Sleep Tape — Korean K-beauty hypoallergenic single-piece mouth tape with skin-friendly adhesive. Scored on adhesion, mechanism, safety and value.',
  verdict:
    'Best K-beauty hypoallergenic mouth tape — skin-friendly Korean adhesive engineering, accessible price. Limited Western distribution.',
  summary:
    'AYO Sleep Tape is the Korean K-beauty entry — single-piece mouth tape with hypoallergenic adhesive engineered specifically for sensitive Asian-skin sensitivity standards. Accessible pricing, growing Western distribution via Amazon. Skin-tolerance reports excellent; brand newer in Western market than Hostage Tape or Somnifix.',
  overallScore: 6.5,
  scores: [
    { criterionId: 'adhesion-comfort', score: 7.5, note: 'Korean K-beauty hypoallergenic adhesive — gentle, low irritation. Less aggressive grip than Hostage Tape; struggles with beards.' },
    { criterionId: 'breathing-mechanism', score: 7.0, note: 'Full-seal single-piece. No porous variant.' },
    { criterionId: 'evidence-grounding', score: 5.5, note: 'K-beauty market credibility; limited Western FDA registration or peer-reviewed validation.' },
    { criterionId: 'form-factor', score: 7.0, note: 'Single-piece strip, easy to apply. Multiple shape variants available.' },
    { criterionId: 'material-safety', score: 8.5, note: 'Korean K-beauty hypoallergenic certification — among the gentlest in category. Best for sensitive skin.' },
    { criterionId: 'value', score: 7.5, note: '~$15 for 30 strips = ~$0.50/night. Mid-tier pricing with K-beauty skin tolerance.' },
  ],
  pros: [
    'K-beauty hypoallergenic adhesive — gentle for sensitive skin',
    'Accessible $0.50/night pricing',
    'Multiple shape variants available',
    'Growing Western distribution via Amazon',
  ],
  cons: [
    'Limited Western FDA registration / peer-reviewed validation',
    'Less beard-friendly than Hostage Tape',
    'Smaller brand recognition than Western category leaders',
    'No subscription convenience model',
  ],
  bestFor: 'Best for sensitive-skin users wanting K-beauty hypoallergenic mouth tape at mid-tier pricing — gentle adhesion over Western brand polish.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from AYO product documentation and 2026 Western consumer reviews via Amazon. Not hands-on tested by ONDA.',
  price: { usd: 15, note: '30-strip pack; ~$0.50/night', asOf: '2026-05-28' },
  link: 'https://ayosleeptape.com/',
  linkType: 'official',
  content: `## Where it leads

AYO Sleep Tape is the K-beauty hypoallergenic mouth-tape entry — Korean adhesive engineering for sensitive Asian-skin sensitivity standards, accessible pricing, growing Western distribution.

## Where it falls short

Western validation and brand recognition. AYO has K-beauty market credibility but limited Western FDA registration or peer-reviewed validation. Brand recognition lower than Hostage Tape or Somnifix.

## Who it is for

Choose AYO Sleep Tape for sensitive-skin K-beauty hypoallergenic mouth tape at mid-tier pricing. For Western biohacker brand, Hostage Tape. For FDA-registered porous safety, Somnifix. For premium silicone, Dream Recovery.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'AYO Sleep Tape — official site', url: 'https://ayosleeptape.com/' },
  ],
  relatedSlugs: ['dream-recovery-mouth-tape', 'somnifix', 'hostage-tape'],
  publishOn: '2026-07-13',
  datePublished: '2026-07-13',
  dateModified: '2026-07-13',
}

export default ayoSleepTape
