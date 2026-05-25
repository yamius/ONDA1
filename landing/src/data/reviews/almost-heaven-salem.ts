import type { ToolReview } from './types'

const almostHeavenSalem: ToolReview = {
  slug: 'almost-heaven-salem',
  name: 'Almost Heaven Salem Barrel Sauna',
  brand: 'Almost Heaven Saunas',
  category: 'sauna',
  productType: 'Traditional outdoor barrel sauna (convection)',
  description:
    'ONDA review of the Almost Heaven Salem Barrel Sauna — traditional Finnish-style outdoor cedar barrel sauna with wood-burning or electric heater options.',
  verdict:
    'The classic outdoor barrel sauna — traditional convection heat, no IR, premium cedar build.',
  summary:
    'Almost Heaven Salem is the traditional cedar barrel sauna for outdoor use. Not IR — uses a traditional convection heater (electric or wood-burning) to deliver dry / wet Finnish-style sauna heat. American-made western red cedar, multi-decade brand reliability. The right shape for users who want traditional Finnish sauna experience rather than IR.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'heat-source', score: 8.0, note: 'Traditional convection heater (3 kW–6 kW electric, or wood-burning option). Delivers full Finnish-sauna heat (80–95°C) with optional steam (löyly).' },
    { criterionId: 'build', score: 9.0, note: 'Premium western red cedar barrel construction, American-built. 5-year structural warranty.' },
    { criterionId: 'emf', score: 9.5, note: 'Traditional sauna — no electronics in the heat-delivery system. EMF is non-issue.' },
    { criterionId: 'form-factor', score: 7.0, note: 'Outdoor installation only. Barrel form factor with 4–6 person capacity. Requires level surface and electrical or wood supply.' },
    { criterionId: 'evidence', score: 8.0, note: 'Traditional Finnish sauna has the deepest sauna-research literature — Finnish cohort studies on cardiovascular health, cognition, all-cause mortality.' },
    { criterionId: 'value', score: 7.0, note: '$4,500–$8,000 depending on heater configuration. Solid value for premium cedar outdoor build.' },
  ],
  pros: [
    'Traditional Finnish sauna experience — convection heat with löyly steam',
    'Premium American-built western red cedar construction',
    'Deepest sauna-research evidence base (Finnish cohort studies)',
    'No electronics in heat-delivery — EMF non-issue',
  ],
  cons: [
    'Not IR — different mechanism and effect from IR cabin saunas',
    'Outdoor-only installation',
    'Wood-burning option requires fire safety planning',
    'Premium pricing for what is fundamentally simple convection heat',
  ],
  bestFor: 'Best for users wanting traditional Finnish sauna experience outdoors with premium cedar build.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Almost Heaven product documentation, the Finnish sauna research literature and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 5500, note: 'electric heater config; wood-burning adds ~$500', asOf: '2026-05-25' },
  link: 'https://almostheaven.net/',
  linkType: 'official',
  content: `## Where it leads

Almost Heaven Salem is the traditional Finnish-style outdoor barrel sauna. Not IR — convection heat with optional löyly steam, 80–95°C operating temperature, the format the Finnish cardiovascular and cognitive cohort studies were actually run on. For users who want traditional sauna over IR, this is the right shape.

## Where it falls short

It is not IR. Different mechanism, different effect profile, different evidence base. Outdoor-only installation. Wood-burning configuration requires fire safety planning. Footprint is large.

## Who it is for

Choose Almost Heaven Salem if you want traditional Finnish sauna experience with premium cedar build, outdoor installation, and the deepest sauna-research literature behind your mechanism. For IR cabin sauna, Sunlighten or Clearlight.

---

## Background reading

The biology of why heat exposure works — and the protocols that compound with the hardware.

- [Mitochondrial biogenesis: the cellular power grid](/articles/mitochondrial-biogenesis-cellular-power-grid) — why heat stress drives mitochondrial density up
- [Mitochondrial DNA and red light](/articles/mitochondrial-dna-red-light) — how near-IR photons reach mitochondria — the mechanism IR saunas borrow
- [Longevity hardware and cellular cleanup](/articles/longevity-hardware-cellular-cleanup) — how sauna fits the broader autophagy / mitophagy stack
`,
  references: [
    { label: 'Almost Heaven Saunas — official site', url: 'https://almostheaven.net/' },
    { label: 'Finnish sauna and cardiovascular mortality (JAMA Internal Medicine)', url: 'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2130724' },
  ],
  relatedSlugs: ['finnleo-hallmark', 'sunlighten-mpulse', 'jnh-lifestyles-joyous'],
  datePublished: '2026-05-25',
  dateModified: '2026-05-25',
}

export default almostHeavenSalem
