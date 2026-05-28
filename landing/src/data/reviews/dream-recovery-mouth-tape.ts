import type { ToolReview } from './types'

const dreamRecovery: ToolReview = {
  slug: 'dream-recovery-mouth-tape',
  name: 'Dream Recovery Mouth Tape',
  brand: 'Dream Recovery',
  category: 'breathing-aid',
  productType: 'Premium silicone-gel mouth tape',
  description:
    'ONDA review of Dream Recovery Mouth Tape — premium silicone-gel mouth tape with reusable design and biohacker positioning. Scored on adhesion, mechanism, evidence and value.',
  verdict:
    'Best silicone-gel premium mouth tape — reusable, gentler skin contact, premium positioning. Subscription-style pricing without subscription lock-in.',
  summary:
    'Dream Recovery Mouth Tape is the premium silicone-gel entry — reusable silicone strip with gentler skin contact than acrylic-adhesive alternatives. Hypoallergenic, latex-free, multi-use per strip. Mid-premium pricing without subscription lock-in. Best fit for users with sensitive skin who reject Hostage Tape acrylic adhesive but want a premium brand experience.',
  overallScore: 7.7,
  scores: [
    { criterionId: 'adhesion-comfort', score: 8.0, note: 'Silicone-gel adhesive is gentler on skin than acrylic; good adhesion on clean skin. Less beard-grip than Hostage Tape — silicone gel doesn\'t hold stubble.' },
    { criterionId: 'breathing-mechanism', score: 7.5, note: 'Full-seal design. No porous center port. Designed for users committed to nasal-only breathing.' },
    { criterionId: 'evidence-grounding', score: 6.5, note: 'Brand-funded research and biohacker testimonials. No FDA registration. Less regulatory standing than Somnifix.' },
    { criterionId: 'form-factor', score: 8.0, note: 'Single-piece strip with reusable silicone-gel construction — 2–3 uses per strip in practice. Reduces per-night cost meaningfully.' },
    { criterionId: 'material-safety', score: 9.0, note: 'Silicone-gel adhesive — among the gentlest in category. Hypoallergenic, latex-free, low skin-reaction reports. Best fit for sensitive skin.' },
    { criterionId: 'value', score: 7.0, note: '~$30 for 10 strips × ~3 uses = ~$1/night effective. Premium pricing offset by reusability.' },
  ],
  pros: [
    'Silicone-gel adhesive — gentlest on sensitive skin',
    'Reusable design — 2-3 uses per strip',
    'No subscription lock-in',
    'Premium brand positioning',
  ],
  cons: [
    'No FDA registration — light regulatory standing',
    'Less beard-friendly than Hostage Tape acrylic adhesive',
    'Full-seal only — no porous safety variant',
    'Brand newer than Somnifix without multi-year track record',
  ],
  bestFor: 'Best for users with sensitive skin wanting premium silicone-gel mouth tape — gentle adhesion + reusability over brand marketing.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Dream Recovery product documentation and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 30, note: '10-strip pack; ~3 uses per strip', asOf: '2026-05-28' },
  link: 'https://dreamrecovery.io/',
  linkType: 'official',
  content: `## Where it leads

Dream Recovery Mouth Tape is the premium silicone-gel reference — gentle adhesion, reusable design, premium positioning. Best fit for users with sensitive skin who reject acrylic adhesives.

## Where it falls short

Beard-grip and regulatory standing. Silicone-gel doesn\'t hold beard stubble as well as Hostage Tape acrylic. No FDA registration vs Somnifix.

## Who it is for

Choose Dream Recovery for sensitive skin + premium silicone-gel mouth tape. For beard-friendly biohacker brand, Hostage Tape. For FDA-registered porous safety, Somnifix. For DIY budget, Nexcare Surgical Tape.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Dream Recovery — official site', url: 'https://dreamrecovery.io/' },
  ],
  relatedSlugs: ['hostage-tape', 'somnifix', 'ayo-sleep-tape'],
  publishOn: '2026-07-13',
  datePublished: '2026-07-13',
  dateModified: '2026-07-13',
}

export default dreamRecovery
