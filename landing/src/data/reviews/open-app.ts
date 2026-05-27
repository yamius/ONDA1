import type { ToolReview } from './types'

const openApp: ToolReview = {
  slug: 'open-app',
  name: 'Open',
  brand: 'Open',
  category: 'breathwork-app',
  productType: 'Hybrid meditation + breathwork + movement app',
  description:
    'ONDA review of the Open app — premium hybrid app blending breathwork, meditation and movement into structured daily sessions. Scored on library, technique coverage, evidence and value.',
  verdict:
    'Best hybrid breathwork + meditation + movement experience — premium UX, blended modalities, live classes. Less pure-breathwork depth than Breathwrk.',
  summary:
    'Open is the premium hybrid app blending breathwork with meditation and movement into structured daily sessions. Backed by named instructors (Manoj Dias, Cory Muscara, others) and a polished UX. Live class layer similar to Othership. The hybrid model is the differentiator — Open is not a pure breathwork app, it’s breath + meditation + movement positioned as a daily practice platform.',
  overallScore: 7.4,
  scores: [
    { criterionId: 'session-library', score: 7.5, note: 'Solid library across breathwork, meditation and movement. Per-modality library smaller than category specialists (Breathwrk for breath, Calm for meditation) but stacks broader.' },
    { criterionId: 'technique-coverage', score: 7.0, note: 'Box, 4-7-8, Wim Hof rounds, coherent breathing on the breath side. Meditation and movement extend the coverage beyond pure breathwork.' },
    { criterionId: 'evidence-grounding', score: 7.0, note: 'Cites general breathwork and meditation research. Named instructor credentials are real (Manoj Dias, Cory Muscara). Less specific peer-reviewed citation than Breathwrk.' },
    { criterionId: 'app-experience', score: 8.5, note: 'Premium UX with cinematic visuals, named-instructor video, live classes. Among the most polished apps in the breathwork space.' },
    { criterionId: 'biofeedback', score: 6.0, note: 'Apple Health integration, Apple Watch session tracking. No HRV-driven session adaptation.' },
    { criterionId: 'value', score: 6.5, note: '$120/year — premium tier. Justified by hybrid modality coverage and named-instructor production.' },
  ],
  pros: [
    'Best hybrid breathwork + meditation + movement coverage in one app',
    'Premium UX with named-instructor production',
    'Live class layer similar to Othership',
    'Apple Watch native support',
  ],
  cons: [
    'Per-modality library smaller than specialists (Breathwrk for breath, Calm for meditation)',
    '$120/year — premium pricing',
    'Hybrid focus dilutes pure-breathwork depth',
    'Less Buteyko / clinical-modality breadth than Breathwrk',
  ],
  bestFor: 'Best for users wanting a single premium app covering breathwork + meditation + movement rather than stacking three separate specialist apps.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Open app documentation, App Store listing and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 120, note: 'annual subscription; free trial available', asOf: '2026-05-28' },
  link: 'https://www.open.app/',
  linkType: 'official',
  content: `## Where it leads

Open is the premium hybrid app — breathwork + meditation + movement in one polished daily-practice platform. Named-instructor production (Manoj Dias, Cory Muscara), cinematic UX, live class layer. The hybrid thesis is the differentiator: one app instead of stacking three specialists.

## Where it falls short

Pure-breathwork depth. Open's per-modality library is smaller than specialist apps — Breathwrk has more breath sessions, Calm has more meditation content. The hybrid serves users who value modality stacking over depth in any one.

## Who it is for

Choose Open if you want one premium app for breath + meditation + movement rather than three specialist apps. For pure breathwork depth, Breathwrk. For cinematic music breathwork, Othership. For meditation depth, Calm or Headspace.

---

## Background reading

- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors)
`,
  references: [
    { label: 'Open — official site', url: 'https://www.open.app/' },
  ],
  relatedSlugs: ['breathwrk', 'othership', 'soma-breath'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default openApp
