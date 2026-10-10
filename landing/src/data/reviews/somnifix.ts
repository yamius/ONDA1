import type { ToolReviewInput } from './types'

const somnifix: ToolReviewInput = {
  slug: 'somnifix',
  name: 'Somnifix',
  brand: 'Somnifix',
  category: 'breathing-aid',
  productType: 'FDA-registered porous mouth tape strips',
  description:
    'ONDA review of Somnifix — original FDA-registered mouth tape with porous design and central breathing port. Scored on adhesion, mechanism, evidence and value.',
  verdict:
    'The original mouth tape — FDA-registered porous strip with central breathing port. Decade-long track record; less beard-friendly than Hostage Tape.',
  summary:
    'Somnifix is the category-original mouth tape — FDA-registered porous adhesive strip with a central breathing port that leaves part of the lips uncovered (not tested as a safety feature). Hypoallergenic adhesive. Multi-year track record predating the 2025–2026 biohacker boom. Less aggressive marketing than Hostage Tape; FDA-registered (a listing, not clearance or approval).',
  scores: [
    { criterionId: 'adhesion-comfort', score: 7.5, note: 'Solid adhesion on clean skin. Less beard-friendly than Hostage Tape — adhesive engineered for skin contact, not stubble.' },
    { criterionId: 'breathing-mechanism', score: 7.5, note: 'Porous design with central breathing port — leaves part of the lips uncovered and allows partial mouth exhale. This has not been tested as a safety feature, so the design earns no extra credit: the same nasal-breathing mechanism as other mouth tapes. If sleep apnea is possible, see a doctor first.' },
    { criterionId: 'evidence-grounding', score: 6.5, note: 'FDA registration is a listing and is scored as neutral. No trials of the tape itself, and mouth taping overall has only a few small studies with mixed results and safety warnings (see our nasal-breathing evidence page) — so mouth tapes score at most 6.5 here, below the 7.0 for products backed by a consistent independent evidence base.' },
    { criterionId: 'form-factor', score: 7.5, note: 'Single-piece strip with central porous section. Easy to apply. Less generous coverage than Hostage Tape full strip.' },
    { criterionId: 'material-safety', score: 8.5, note: 'Hypoallergenic adhesive. Latex-free. Skin-reaction reports rare across multi-year user base.' },
    { criterionId: 'value', score: 7.5, note: '~$25 for 28 strips = ~$0.90/night. More expensive per night than Hostage Tape subscription; no subscription required.' },
  ],
  editorialAdjustment: { value: -0.3, reason: 'Marketing honesty — the product page says SomniFix is “the only mouth tape product specifically validated in a Harvard Medical School clinical study”, and the homepage says “Clinically Proven!”, but the study is the maker’s own sponsored 2017 study and we found no publication of it (checked October 2026). This is scored here, not under evidence.' },
  pros: [
    'FDA-registered (a listing, not clearance or approval)',
    'Porous central breathing port — a less complete seal than full-coverage tape',
    'Multi-year track record predating the 2025 biohacker boom',
    'No subscription required',
  ],
  cons: [
    'Less beard-friendly than Hostage Tape',
    '~$0.90/night — more expensive per night than Hostage Tape',
    'Smaller coverage than Hostage Tape full strip',
    'Less aggressive consumer marketing — lower brand recognition than Hostage Tape',
  ],
  bestFor: 'Best for users wanting FDA-registered (a listing, not clearance or approval) mouth tape with a porous design over biohacker brand marketing.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Somnifix product documentation, FDA registration records and multi-year user reviews. Not hands-on tested by ONDA.',
  price: { usd: 25, note: '28-strip pack; ~$0.90/night', asOf: '2026-05-28' },
  link: 'https://somnifix.com/',
  linkType: 'official',
  content: `## Where it leads

Somnifix is the category-original mouth tape — FDA-registered porous strip with central breathing port, multi-year track record predating the 2025–2026 biohacker boom. A porous option for users uncertain about full-seal mechanisms.

## What are the downsides of Somnifix?

Beard adhesion and brand recognition. Somnifix adhesive is engineered for clean skin and doesn\'t grip beard stubble as well as Hostage Tape. Consumer brand recognition lower than the viral 2026 newcomers.

## Who should buy Somnifix?

Choose Somnifix if you want FDA-registered (a listing, not clearance or approval) mouth tape with a porous design. For beard-friendly biohacker brand, Hostage Tape. For premium silicone, Dream Recovery. For DIY medical tape, Nexcare Surgical Tape.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
- [Does sleep really clean your brain? The glymphatic evidence](/articles/nightly-flush-glymphatic-neural-cache) — what is shown in people, and what is still disputed
`,
  references: [
    { label: 'Somnifix — official site', url: 'https://somnifix.com/' },
  ],
  relatedSlugs: ['hostage-tape', 'dream-recovery-mouth-tape', 'breathe-right-original'],
  publishOn: '2026-07-13',
  faq: [
    { q: "Is Somnifix worth it?", a: "Somnifix is worth it if you want FDA-registered mouth tape. It is FDA-registered (a listing, not clearance or approval) with a porous central breathing port (not tested as a safety feature) and a multi-year track record. If sleep apnea is possible, see a doctor first. It costs more per night than Hostage Tape." },
    { q: "How much does Somnifix cost?", a: "Somnifix costs about $25 for a 28-strip pack, roughly $0.90 per night. That is more per night than Hostage Tape. No subscription is required, so you buy packs only as you need them." },
    { q: "Somnifix vs Hostage Tape: which is better?", a: "Somnifix wins on regulatory standing as FDA-registered (a listing, not clearance or approval), and has a porous breathing port. Hostage Tape is cheaper per night, more beard-friendly and offers larger coverage. Choose Somnifix for the porous design." },
    { q: "What are the downsides of Somnifix?", a: "Somnifix is less beard-friendly than Hostage Tape, costs more per night at about $0.90, and offers smaller coverage than Hostage Tape's full strip. It also has lower brand recognition due to less aggressive marketing." },
  ],
  datePublished: '2026-07-13',
  dateModified: '2026-10-10',
}

export default somnifix
