import type { ToolReview } from './types'

const bonCharge: ToolReview = {
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
  overallScore: 7.4,
  scores: [
    { criterionId: 'irradiance', score: 7.5, note: 'Manufacturer-claimed ~100 mW/cm² at 0" / ~45 mW/cm² at 6". Less independently re-verified than biohacker-targeted brands; claims are reasonable for the LED count.' },
    { criterionId: 'wavelengths', score: 7.5, note: 'Two-wavelength coverage (660 + 850 nm) — standard biohacker default, no exotic additions like PlatinumLED or GembaRed.' },
    { criterionId: 'build-emf-flicker', score: 7.5, note: 'Solid aluminium build with glass front. EMF figures less prominently published than Joovv or PlatinumLED; multi-year warranty.' },
    { criterionId: 'coverage', score: 8.0, note: 'Half-body coverage in the main panel; multiple sizes available. Stand and door-mount hardware included.' },
    { criterionId: 'evidence', score: 7.0, note: 'No FDA Class II registration. Bon Charge positions the panel as wellness device; references the underlying photobiomodulation literature.' },
    { criterionId: 'value', score: 7.0, note: '$899 for the mid-size panel. Mid-tier pricing — cheaper than Joovv, comparable to BioLight; brand premium baked in.' },
  ],
  pros: [
    'Strong EU/AU consumer brand presence',
    'Half-body coverage at mid-tier pricing',
    'Stand and door-mount hardware included',
    'Multi-year warranty and consistent build quality',
  ],
  cons: [
    'Less technical disclosure than biohacker-targeted brands',
    'Two-wavelength coverage only — no exotic additions',
    'No FDA Class II registration',
    'Brand-premium pricing without standout differentiator',
  ],
  bestFor: 'Best for EU/AU buyers who want a wellness-positioned panel from an established consumer brand.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Bon Charge product documentation and the underlying photobiomodulation literature. Less independent third-party testing available than biohacker-targeted brands. Not hands-on tested by ONDA.',
  price: { usd: 899, note: 'one-time; stand/mount included', asOf: '2026-05-23' },
  link: 'https://boncharge.com/products/red-light-therapy-device',
  linkType: 'official',
  content: `## Where it leads

Bon Charge is the wellness-positioned red-light brand for buyers who already live in the Bon Charge ecosystem (blue-blocker glasses, grounding products) and want a panel from the same brand. Build quality is solid, the stand and door-mount hardware come included, and the EU/AU distribution is well-established.

## Where it falls short

Technical disclosure. Bon Charge publishes less detail on independent EMF testing and flicker rates than biohacker-targeted brands. Two-wavelength coverage is conservative compared to MitoPRO’s four or PlatinumLED’s six. No standout differentiator on hardware that justifies the brand premium beyond consumer-recognition.

## Who it is for

Choose Bon Charge if you are in an EU/AU market and want a panel from an established wellness brand with consistent build quality. For maximum spec disclosure, Joovv or PlatinumLED. For value at the half-body tier, BioLight or Hooga.`,
  references: [
    { label: 'Bon Charge Red Light Therapy Panel — official', url: 'https://boncharge.com/products/red-light-therapy-device' },
    { label: 'Photobiomodulation in chronic conditions (Lasers in Surgery and Medicine)', url: 'https://onlinelibrary.wiley.com/journal/10969101' },
  ],
  relatedSlugs: ['biolight-pro-900', 'platinumled-biomax-600', 'hooga-hg500'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default bonCharge
