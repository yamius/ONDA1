import type { ToolReview } from './types'

const kineonMovePlus: ToolReview = {
  slug: 'kineon-move-plus',
  name: 'Kineon Move+',
  brand: 'Kineon',
  category: 'red-light',
  productType: 'Wrap-around laser-and-LED joint therapy device',
  description:
    'ONDA review of the Kineon Move+ — wrap-around laser-and-LED red light device for targeted joint photobiomodulation. Scored on dose, form factor and value.',
  verdict:
    'The targeted-joint specialist — laser + LED in a wrap, designed for knees and elbows rather than full-body. Different problem from panels.',
  summary:
    'The Kineon Move+ is the only device in this list that is not a full panel. It is a wrap-around stack of medical-grade 808 nm laser modules combined with 650/850 nm LEDs, designed to deliver targeted photobiomodulation dose to a joint (knee, elbow, shoulder) rather than to skin. The laser delivery is the meaningful difference: deeper tissue penetration than LED-only panels, smaller treatment area, FDA-registered for the joint indication. Different problem from full-body panels; included here because users compare them.',
  overallScore: 7.3,
  scores: [
    { criterionId: 'irradiance', score: 8.5, note: 'Laser delivery — significantly higher peak irradiance at the joint than any LED panel. Manufacturer-stated 14W total laser output across 9 diodes plus the LED matrix. The dose-per-square-centimeter at depth is the highest in this list.' },
    { criterionId: 'wavelengths', score: 8.0, note: '808 nm laser (deep tissue) + 650 nm + 850 nm LED (surface + intermediate depth). Mixed laser-and-LED stack is unusual.' },
    { criterionId: 'build-emf-flicker', score: 8.0, note: 'Solid build with cooling fans (lasers run hot). EMF tested; flicker not relevant for laser output. Standard biohacker-tier hardware.' },
    { criterionId: 'coverage', score: 4.5, note: 'Joint-only — knee, elbow, shoulder via the wrap. Not a panel, not for full-body. Coverage score reflects the different problem, not failure.' },
    { criterionId: 'evidence', score: 8.0, note: 'FDA-registered Class II device for joint photobiomodulation. Published trial backing for joint-specific indications.' },
    { criterionId: 'value', score: 7.5, note: '$799 — premium pricing for the joint-targeted device. Reasonable for laser delivery hardware; expensive if treated as a panel substitute.' },
  ],
  pros: [
    'Laser delivery — deeper tissue penetration than LED-only panels',
    'FDA Class II registered for joint photobiomodulation',
    'Wrap form factor — knees and elbows treated easily, hands-free',
    'Real published evidence for joint-specific indications',
  ],
  cons: [
    'Not a full-body panel — joint-only coverage',
    'Cannot replace a panel for skin or general photobiomodulation',
    'Premium price for narrow indication',
    'Requires charging — battery-powered, not plug-in',
  ],
  bestFor: 'Best for users with specific joint pain who want laser-grade dose delivery — not a panel substitute.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Kineon product documentation, the FDA-registered Class II clearance summary, published trials on laser photobiomodulation for joint pain and independent reviews. Not hands-on tested by ONDA.',
  price: { usd: 799, note: 'one-time; battery powered, USB-C charged', asOf: '2026-05-23' },
  link: 'https://kineon.io/move-plus',
  linkType: 'official',
  content: `## Where it leads

Kineon Move+ is the joint-pain specialist of the red-light category. The wrap holds a stack of medical-grade 808 nm laser diodes alongside 650/850 nm LEDs around a joint, delivering meaningfully higher dose at depth than any LED-only panel can. FDA Class II registration for joint photobiomodulation gives it a regulatory tier the panels do not have for that indication.

## Where it falls short

It is not a panel and cannot replace one. The wrap covers a single joint per session; full-body or skin photobiomodulation is the wrong job. Premium pricing for a narrow indication means the value calculus only works when joint pain is the specific use case.

## Who it is for

Choose Kineon Move+ if you have a specific joint-pain indication (knee, elbow, shoulder) and want laser-grade dose with FDA backing. For general red-light therapy, full-body photobiomodulation, or skin indications — choose a panel (Joovv, Mito Red, PlatinumLED). Not substitutes; different jobs.`,
  references: [
    { label: 'Kineon Move+ — official product page', url: 'https://kineon.io/move-plus' },
    { label: 'Laser photobiomodulation for knee osteoarthritis — systematic review', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8421064/' },
  ],
  relatedSlugs: ['joovv-solo-3', 'mito-red-mitopro-1500', 'hooga-hg500'],
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
}

export default kineonMovePlus
