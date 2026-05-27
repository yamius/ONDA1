import type { ToolReview } from './types'

const breathwrk: ToolReview = {
  slug: 'breathwrk',
  name: 'Breathwrk',
  brand: 'Breathwrk',
  category: 'breathwork-app',
  productType: 'Guided breathwork app with structured library',
  description:
    'ONDA review of Breathwrk — the largest structured breathwork library on the consumer market with science-grounded exercises across calm, energy, sleep and performance. Scored on library, technique coverage, evidence and value.',
  verdict:
    'Best breathwork library overall — biggest session catalogue, science-grounded copy, full technique coverage. The category reference for structured daily practice.',
  summary:
    'Breathwrk is the structured breathwork reference — hundreds of guided sessions across calm, energy, sleep, focus and performance, science-grounded copy citing published research, and the broadest technique coverage in the category (box, 4-7-8, Wim Hof rounds, Tummo, cyclic sighing, coherent breathing, Buteyko). Apple Watch support. Sub-$70/year. The biggest, most defensible app in the breathwork category.',
  overallScore: 8.4,
  scores: [
    { criterionId: 'session-library', score: 9.0, note: 'Largest structured breathwork library — hundreds of guided sessions organised by goal (calm, sleep, energy, focus, performance) and technique. New content adds monthly.' },
    { criterionId: 'technique-coverage', score: 9.0, note: 'Full coverage — box breathing, 4-7-8, Wim Hof rounds, Tummo, cyclic sighing (Stanford-validated), coherent breathing, Buteyko, alternate-nostril. Almost no documented technique missing.' },
    { criterionId: 'evidence-grounding', score: 8.5, note: 'Science-grounded copy citing Stanford cyclic-sighing research, polyvagal theory, Andrew Huberman protocols. Founders engage credibly with the published literature.' },
    { criterionId: 'app-experience', score: 8.5, note: 'Clean UI with animated breath guides, audio coaching and Apple Watch native support. Session-start friction low.' },
    { criterionId: 'biofeedback', score: 6.5, note: 'Apple Health integration, Apple Watch breath rate, basic streak tracking. No HRV-driven session adaptation — guided rather than measurement-driven.' },
    { criterionId: 'value', score: 8.5, note: '$70/year subscription with usable free tier. Best value in premium breathwork — cheaper than Othership, far deeper library than free apps.' },
  ],
  pros: [
    'Largest structured breathwork library in the category',
    'Full technique coverage — box, 4-7-8, Wim Hof, Tummo, cyclic sighing, Buteyko',
    'Science-grounded copy with Stanford and Huberman protocol citations',
    'Apple Watch native support with clean UI',
  ],
  cons: [
    'No HRV-driven session adaptation (guided rather than biofeedback-driven)',
    'No community / live-session layer (vs Othership)',
    'Subscription-required for the deep library',
    'Less holotropic / emotional-release focus than Pause or SOMA',
  ],
  bestFor: 'Best for users wanting the largest structured breathwork library with science-grounded copy and full technique coverage — the rational default for daily practice.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Breathwrk app documentation, App Store listing, founder public communications and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 70, note: 'annual subscription; free tier available', asOf: '2026-05-28' },
  link: 'https://www.breathwrk.com/',
  linkType: 'official',
  content: `## Where it leads

Breathwrk is the structured breathwork reference — biggest library, broadest technique coverage, most science-grounded copy. The Stanford cyclic-sighing research, polyvagal theory and Huberman lab protocols all show up cited honestly. The library size and Apple Watch native support make it the rational default for daily breathwork practice.

## Where it falls short

No community or live-session layer (Othership's differentiator), no HRV-driven session adaptation (Inhale's differentiator), and less holotropic / emotional-release focus than Pause or SOMA. Breathwrk is excellent for structured daily practice; it's not the right shape for deep emotional-release sessions or for community-driven breathwork culture.

## Who it is for

Choose Breathwrk if you want the largest structured library and science-grounded copy at the best premium-tier price. For community + music-driven sessions, Othership. For HRV biofeedback, Inhale. For emotional release, Pause Breathwork. For free entry, iBreathe or Breathe2Relax.

---

## Background reading

- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep) — breathwork pairs with audio entrainment for sleep onset
- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing) — vagal tone and parasympathetic activation
- [Nightly flush: the glymphatic system](/articles/nightly-flush-glymphatic-neural-cache) — why parasympathetic recovery drives sleep depth
`,
  references: [
    { label: 'Breathwrk — official site', url: 'https://www.breathwrk.com/' },
  ],
  relatedSlugs: ['othership', 'soma-breath', 'wim-hof-method-app'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default breathwrk
