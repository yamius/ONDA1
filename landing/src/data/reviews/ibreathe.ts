import type { ToolReview } from './types'

const ibreathe: ToolReview = {
  slug: 'ibreathe',
  name: 'iBreathe',
  brand: 'iBreathe',
  category: 'breathwork-app',
  productType: 'Free minimalist breathwork app (box, 4-7-8, custom)',
  description:
    'ONDA review of iBreathe — free minimalist breathwork app covering box breathing, 4-7-8 and custom patterns. Scored on library, technique coverage, app experience and value.',
  verdict:
    'Best free minimalist breathwork app — clean visual breath guide, core techniques, no subscription. Narrow scope but unbeatable at the price.',
  summary:
    'iBreathe is the minimalist free breathwork reference — clean visual breath guide, core techniques (box, 4-7-8, custom timings), Apple Watch support, no subscription. The right app for users who want a simple breath timer without a content library or community.',
  overallScore: 5.8,
  scores: [
    { criterionId: 'session-library', score: 4.0, note: 'No curated session library — just breath-pattern timer. Users provide their own structure.' },
    { criterionId: 'technique-coverage', score: 6.0, note: 'Core techniques (box, 4-7-8) plus custom timing. No Wim Hof rounds, no holotropic, no curated coverage.' },
    { criterionId: 'evidence-grounding', score: 5.5, note: 'Minimal copy. Techniques are well-documented but no curated science citation.' },
    { criterionId: 'app-experience', score: 8.0, note: 'Clean minimalist UI, visual breath guide, Apple Watch native. Best execution of the simple-timer thesis.' },
    { criterionId: 'biofeedback', score: 4.0, note: 'No HRV. Basic Apple Health logging.' },
    { criterionId: 'value', score: 9.5, note: 'Free with optional $5 premium for ad removal. Unbeatable at the price.' },
  ],
  pros: [
    'Completely free for the core experience',
    'Clean minimalist UI with visual breath guide',
    'Apple Watch native support',
    'No subscription pressure',
  ],
  cons: [
    'No curated session library or content',
    'Narrow technique coverage (box, 4-7-8, custom only)',
    'No HRV or biofeedback',
    'No evidence-curated copy or instructor content',
  ],
  bestFor: 'Best free entry point to breathwork — for users who already know which techniques they want and just need a clean timer with visual guide.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from iBreathe App Store listing and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 0, note: 'free; optional $5 premium for ad removal', asOf: '2026-05-28' },
  link: 'https://ibreathe.app/',
  linkType: 'official',
  content: `## Where it leads

iBreathe is the free minimalist breathwork reference — clean visual breath guide, core techniques (box, 4-7-8, custom), Apple Watch native, no subscription. Best execution of the simple-timer thesis at the unbeatable price of zero.

## Where it falls short

No curated content, no instructor library, no evidence copy, no biofeedback. iBreathe is a breath timer with a clean UI — not a breathwork content platform.

## Who it is for

Choose iBreathe if you already know which technique you want and just need a clean visual timer at zero cost. For curated library, Breathwrk. For free with somatic depth, Breathe2Relax. For Android customisation at near-free price, Prana Breath.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
`,
  references: [
    { label: 'iBreathe — official site', url: 'https://ibreathe.app/' },
  ],
  relatedSlugs: ['breathwrk', 'prana-breath', 'breathe-to-relax'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default ibreathe
