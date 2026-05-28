import type { ToolReview } from './types'

const nexcareSurgical: ToolReview = {
  slug: 'nexcare-surgical-tape',
  name: '3M Nexcare Sensitive Skin Surgical Tape',
  brand: '3M Nexcare',
  category: 'breathing-aid',
  productType: 'DIY medical paper tape for mouth taping',
  description:
    'ONDA review of 3M Nexcare Sensitive Skin Surgical Tape — drugstore medical paper tape used as DIY mouth-tape alternative at fraction of biohacker-brand cost. Scored on adhesion, mechanism, safety and value.',
  verdict:
    'Best DIY mouth-tape option — 3M medical paper tape at fraction of biohacker-brand cost. No brand polish; clinical-grade adhesive at $0.05/night.',
  summary:
    'The DIY biohacker secret — 3M Nexcare Sensitive Skin Surgical Tape, cut into 2-inch strips, serves as a clinical-grade mouth-tape alternative at fraction of the cost of Hostage Tape or Somnifix. 3M medical adhesive is the same chemistry used in hospital wound dressings. Effectively unbeatable on per-night cost; zero brand polish or convenience.',
  overallScore: 6.5,
  scores: [
    { criterionId: 'adhesion-comfort', score: 7.5, note: 'Clinical-grade 3M medical adhesive — gentle on skin, painless removal. Less beard-friendly than Hostage Tape. Sensitive-skin variant is the right pick.' },
    { criterionId: 'breathing-mechanism', score: 7.0, note: 'User cuts strip to size — can do full seal, partial seal or cross design. Maximum flexibility.' },
    { criterionId: 'evidence-grounding', score: 7.0, note: 'FDA-cleared medical paper tape. Clinical-context literature on adhesive safety. Decades of hospital use.' },
    { criterionId: 'form-factor', score: 5.5, note: 'Roll form requires cutting per use. No pre-cut strips. Higher friction per night than dedicated mouth-tape brands.' },
    { criterionId: 'material-safety', score: 8.5, note: 'Hypoallergenic medical-grade adhesive. Latex-free. Sensitive Skin variant minimises reactions; multi-decade hospital track record.' },
    { criterionId: 'value', score: 9.5, note: '~$5 for a roll lasting 3+ months = ~$0.05/night. Unbeatable per-night cost in mouth-tape category.' },
  ],
  pros: [
    'Unbeatable per-night cost (~$0.05/night)',
    'Clinical-grade 3M medical adhesive — same as hospital wound dressings',
    'Maximum form-factor flexibility — user cuts to preferred size',
    'Drugstore availability',
  ],
  cons: [
    'Requires cutting per use — higher daily friction',
    'No brand polish or pre-cut convenience',
    'Less beard-friendly than Hostage Tape',
    'No marketing support or biohacker community',
  ],
  bestFor: 'Best for cost-conscious biohackers willing to trade brand convenience for clinical-grade DIY mouth tape at fraction of subscription-brand cost.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from 3M Nexcare product documentation, FDA-cleared medical-tape literature and biohacker DIY community reports. Not hands-on tested by ONDA.',
  price: { usd: 5, note: '~3 months per roll; ~$0.05/night', asOf: '2026-05-28' },
  link: 'https://www.3m.com/3M/en_US/p/d/v100126263/',
  linkType: 'official',
  content: `## Where it leads

3M Nexcare Sensitive Skin Surgical Tape is the DIY biohacker secret — clinical-grade medical paper tape at $0.05/night vs $0.43/night for Hostage Tape. Same 3M medical adhesive used in hospital wound dressings. Unbeatable on cost.

## Where it falls short

Friction and brand polish. Requires cutting per use, no pre-cut strips, no subscription convenience. Less beard-friendly than Hostage Tape acrylic adhesive engineered specifically for stubble.

## Who it is for

Choose 3M Nexcare for cost-conscious DIY mouth tape — clinical adhesive at lowest possible price. For convenience + beard-friendly brand, Hostage Tape. For FDA-registered porous safety, Somnifix. For premium silicone, Dream Recovery.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: '3M Nexcare — official site', url: 'https://www.3m.com/3M/en_US/p/d/v100126263/' },
  ],
  relatedSlugs: ['hostage-tape', 'somnifix', 'somnifit-sleep-strips'],
  publishOn: '2026-07-13',
  datePublished: '2026-07-13',
  dateModified: '2026-07-13',
}

export default nexcareSurgical
