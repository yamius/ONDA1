import type { ToolReviewInput } from './types'

const bonCharge: ToolReviewInput = {
  slug: 'bon-charge-red-light-panel',
  name: 'Bon Charge Red Light Therapy Panel',
  brand: 'Bon Charge',
  category: 'red-light',
  productType: 'Wellness-positioned red + NIR LED panel (EU/AU)',
  description:
    'ONDA review of the Bon Charge Red Light Therapy Panel — the wellness-positioned EU/AU brand with broad consumer reach. Scored on build, EMF and value.',
  verdict:
    'Wellness-positioned panel with broad consumer reach in EU/AU markets. Competent build, premium pricing, fewer technical specs disclosed than biohacker-focused brands.',
  summary:
    'Bon Charge is the wellness-positioned red-light brand most prominent in EU and Australian markets — sold alongside the company’s blue-blocker glasses and grounding sheets. The Red Light Therapy Panel range covers half-body sizes with two-wavelength coverage (660 + 850 nm). Build quality is solid; the technical disclosure (independent EMF testing, flicker rates) is less detailed than biohacker-targeted brands like Joovv or PlatinumLED. Strong consumer brand, less technical depth.',
  scores: [
    { criterionId: 'irradiance', score: 7.5, note: 'For the current half-body Max panel (400 LEDs), Bon Charge states over 142 mW/cm² without giving a distance. Less independently re-verified than biohacker-targeted brands.' },
    { criterionId: 'wavelengths', score: 7.5, note: 'Two-wavelength coverage (660 + 850 nm) — standard biohacker default, no exotic additions like PlatinumLED or GembaRed.' },
    { criterionId: 'build-emf-flicker', score: 7.5, note: 'Solid aluminium build with glass front. Bon Charge now publishes EMF (0.05–0.1 µT) and zero-flicker claims for the Max; warranty is 1 year.' },
    { criterionId: 'coverage', score: 8.0, note: 'Half-body coverage in the main panel; multiple sizes available. Stand and door-mount hardware included.' },
    { criterionId: 'evidence', score: 7.0, note: 'Bon Charge lists the Max as FDA Class II registered (registration, not approval). Positioned as a wellness device; references the underlying photobiomodulation literature.' },
    { criterionId: 'value', score: 7.0, note: '$999 for the half-body Max (the smaller Demi is $699). Mid-tier pricing — cheaper than Joovv, comparable to BioLight; brand premium baked in.' },
  ],
  pros: [
    'Strong EU/AU consumer brand presence',
    'Half-body coverage at mid-tier pricing',
    'Stand and door-mount hardware included',
    'Consistent build quality and published low-EMF, zero-flicker figures',
  ],
  cons: [
    'Less technical disclosure than biohacker-targeted brands',
    'Two-wavelength coverage only — no exotic additions',
    'Only a 1-year warranty (Hooga and Infraredi give 3)',
    'Brand-premium pricing without standout differentiator',
  ],
  bestFor: 'Best for EU/AU buyers who want a wellness-positioned panel from an established consumer brand.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Bon Charge product documentation and the underlying photobiomodulation literature. Less independent third-party testing available than biohacker-targeted brands. Not hands-on tested by ONDA.',
  price: { usd: 999, note: 'Max (half-body, 400 LEDs) on boncharge.com; door mount included, no free-standing stand; 1-year warranty. Smaller Demi: $699', asOf: '2026-10-01' },
  link: 'https://boncharge.com/products/max-red-light-device',
  linkType: 'official',
  content: `## Where it leads

Bon Charge is the wellness-positioned red-light brand for buyers who already live in the Bon Charge ecosystem (blue-blocker glasses, grounding products) and want a panel from the same brand. Its current half-body panel is sold as the Max ($999; 400 LEDs at 660 + 850 nm), with a smaller Demi at $699. Build quality is solid, a door mount comes included (no free-standing stand), and the EU/AU distribution is well-established.

## What are the downsides of Bon Charge Red Light Therapy Panel?

Technical disclosure. Bon Charge publishes less detail on independent EMF testing and flicker rates than biohacker-targeted brands. Two-wavelength coverage is conservative compared to the MitoPRO 1500X’s six or PlatinumLED’s seven. No standout differentiator on hardware that justifies the brand premium beyond consumer-recognition.

## Who should buy Bon Charge Red Light Therapy Panel?

Choose Bon Charge if you are in an EU/AU market and want a panel from an established wellness brand with consistent build quality. For maximum spec disclosure, Joovv or PlatinumLED. For value at the half-body tier, BioLight or Hooga.

---

## Background reading

The photobiomodulation mechanism behind why red light therapy works.

- [Longevity protocol: biological clock reset](/articles/longevity-protocol-biological-clock-reset) — where photobiomodulation slots into a reset routine
- [Mitochondrial DNA and red light](/articles/mitochondrial-dna-red-light) — how 660/850 nm photons reach the mitochondria and what they do there
- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why photobiomodulation drives mitochondrial density up
`,
  references: [
    { label: 'Bon Charge Red Light Therapy Panel — official', url: 'https://boncharge.com/products/red-light-therapy-device' },
  ],
  relatedSlugs: ['biolight-pro-900', 'platinumled-biomax-600', 'hooga-hg500'],
  faq: [
    { q: "Is the Bon Charge Red Light Therapy Panel worth it?", a: "It is worth it mainly for EU and Australian buyers who want an established consumer brand. The panel offers solid build, half-body coverage, an included door mount and published low-EMF figures, but only a 1-year warranty. Its technical disclosure is thinner than biohacker brands, and the pricing carries a brand premium without a standout differentiator." },
    { q: "How much does the Bon Charge Red Light Therapy Panel cost?", a: "The Bon Charge Red Light Therapy Panel is now sold as the Max at $999 (checked 2026-10-01), with a door mount included. That covers a half-body, 400-LED panel with two wavelengths, 660 and 850 nm, and a 1-year warranty. The smaller Demi costs $699." },
    { q: "What are the downsides of the Bon Charge Red Light Therapy Panel?", a: "Bon Charge discloses fewer technical details, such as independent EMF testing and flicker rates, than biohacker-targeted brands. It offers only two wavelengths, a 1-year warranty, and charges brand-premium pricing without a standout differentiator." },
    { q: "Who is the Bon Charge Red Light Therapy Panel best for?", a: "The Bon Charge panel is best for EU and Australian buyers who want a wellness-positioned red light panel from an established consumer brand. It suits those who prefer consistent build quality and brand presence over detailed technical specs." },
  ],
  datePublished: '2026-05-23',
  dateModified: '2026-10-01',
}

export default bonCharge
