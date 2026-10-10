import type { ToolReviewInput } from './types'

const nexcareSurgical: ToolReviewInput = {
  slug: 'nexcare-surgical-tape',
  name: '3M Nexcare Sensitive Skin Surgical Tape',
  brand: '3M Nexcare',
  category: 'breathing-aid',
  productType: 'DIY medical paper tape for mouth taping',
  description:
    'ONDA review of 3M Nexcare Sensitive Skin Surgical Tape — drugstore medical paper tape used as DIY mouth-tape alternative at fraction of biohacker-brand cost. Scored on adhesion, mechanism, safety and value.',
  verdict:
    'Best DIY mouth-tape option — 3M medical paper tape at fraction of biohacker-brand cost. No brand polish; 3M medical adhesive at $0.05/night.',
  summary:
    'The DIY biohacker secret — 3M Nexcare Sensitive Skin Surgical Tape, cut into 2-inch strips, serves as a mouth-tape alternative at fraction of the cost of Hostage Tape or Somnifix. 3M medical adhesive is the same chemistry used in hospital wound dressings. Effectively unbeatable on per-night cost; zero brand polish or convenience.',
  scores: [
    { criterionId: 'adhesion-comfort', score: 7.5, note: '3M medical adhesive (the kind used on wound dressings) — gentle on skin, painless removal. Less beard-friendly than Hostage Tape. Sensitive-skin variant is the right pick.' },
    { criterionId: 'breathing-mechanism', score: 7.0, note: 'User cuts strip to size — can do full seal, partial seal or cross design. Maximum flexibility.' },
    { criterionId: 'evidence-grounding', score: 6.5, note: 'FDA-cleared medical paper tape (a clearance for surgical use, scored as neutral) with decades of hospital use. As a mouth tape it has no trials of its own, and mouth taping overall has only a few small studies with mixed results — so mouth tapes score at most 6.5 here.' },
    { criterionId: 'form-factor', score: 5.5, note: 'Roll form requires cutting per use. No pre-cut strips. Higher friction per night than dedicated mouth-tape brands.' },
    { criterionId: 'material-safety', score: 8.5, note: 'Hypoallergenic 3M medical adhesive. Latex-free. Sensitive Skin variant minimises reactions; multi-decade hospital track record.' },
    { criterionId: 'value', score: 9.5, note: '~$5 for a roll lasting 3+ months = ~$0.05/night. Unbeatable per-night cost in mouth-tape category.' },
  ],
  pros: [
    'Unbeatable per-night cost (~$0.05/night)',
    '3M medical adhesive (the kind used on wound dressings)',
    'Maximum form-factor flexibility — user cuts to preferred size',
    'Drugstore availability',
  ],
  cons: [
    'Requires cutting per use — higher daily friction',
    'No brand polish or pre-cut convenience',
    'Less beard-friendly than Hostage Tape',
    'No marketing support or biohacker community',
  ],
  bestFor: 'Best for cost-conscious biohackers willing to trade brand convenience for DIY mouth tape made from 3M medical paper tape at fraction of subscription-brand cost.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from 3M Nexcare product documentation, FDA-cleared medical-tape literature and biohacker DIY community reports. Not hands-on tested by ONDA.',
  price: { usd: 5, note: '~3 months per roll; ~$0.05/night', asOf: '2026-05-28' },
  link: 'https://www.3m.com/3M/en_US/p/d/v100126263/',
  linkType: 'official',
  content: `## Where it leads

3M Nexcare Sensitive Skin Surgical Tape is the DIY biohacker secret — 3M medical paper tape at $0.05/night vs $0.43/night for Hostage Tape. Same 3M medical adhesive used in hospital wound dressings. Unbeatable on cost.

## What are the downsides of 3M Nexcare Sensitive Skin Surgical Tape?

Friction and brand polish. Requires cutting per use, no pre-cut strips, no subscription convenience. Less beard-friendly than Hostage Tape acrylic adhesive engineered specifically for stubble.

## Who should buy 3M Nexcare Sensitive Skin Surgical Tape?

Choose 3M Nexcare for cost-conscious DIY mouth tape — clinical adhesive at lowest possible price. For convenience + beard-friendly brand, Hostage Tape. For FDA-registered porous safety, Somnifix. For premium silicone, Dream Recovery.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: '3M Nexcare — official site', url: 'https://www.3m.com/3M/en_US/p/d/v100126263/' },
  ],
  relatedSlugs: ['hostage-tape', 'somnifix', 'somnifit-sleep-strips'],
  publishOn: '2026-07-13',
  faq: [
    { q: "Is 3M Nexcare Sensitive Skin Surgical Tape worth it for mouth taping?", a: "Yes, for cost-conscious users. Nexcare costs about $0.05 per night and uses 3M medical adhesive, the same kind used on hospital wound dressings. You trade away brand polish and pre-cut convenience, since you cut it to size each time." },
    { q: "How much does Nexcare surgical tape cost for mouth taping?", a: "A roll is listed at about $5 and lasts roughly three months, which works out to around $0.05 per night. It is also available at drugstores, so there is no subscription or special order involved." },
    { q: "What are the downsides of Nexcare tape for mouth taping?", a: "You must cut it for every use, which adds daily friction, and there is no brand polish or pre-cut convenience. It is less beard-friendly than Hostage Tape and has no marketing support or biohacker community around it." },
    { q: "Nexcare vs Hostage Tape: which is better?", a: "Nexcare wins on cost, at about $0.05 per night, and lets you cut any size you prefer. Hostage Tape is more beard-friendly and offers brand convenience. Choose Nexcare for DIY value, Hostage Tape if a beard or pre-cut ease matters more." },
  ],
  datePublished: '2026-07-13',
  dateModified: '2026-10-10',
}

export default nexcareSurgical
