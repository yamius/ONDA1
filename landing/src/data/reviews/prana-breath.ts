import type { ToolReview } from './types'

const pranaBreath: ToolReview = {
  slug: 'prana-breath',
  name: 'Prana Breath',
  brand: 'OlekStudio',
  category: 'breathwork-app',
  productType: 'Customisable pattern-based breathwork app',
  description:
    'Prana Breath review: the most customisable pattern-based breathwork app — deep parameter control, Android-first, mostly free. UX feels dated vs premium apps.',
  verdict:
    'Best customisable pattern-based breathwork — deep parameter exposure, Android-first, mostly-free model. UX feels dated vs premium apps.',
  summary:
    'Prana Breath is the long-running Android-first breathwork app — deep parameter exposure (inhale, hold, exhale, hold timings fully customisable per pattern), broad library of pre-built patterns and a mostly-free model. UX feels dated compared to Breathwrk or Othership; the parameter depth is the differentiator.',
  overallScore: 6.3,
  scores: [
    { criterionId: 'session-library', score: 7.0, note: 'Solid library of pre-built patterns (box, 4-7-8, Wim Hof, pranayama, custom). Less curated journey content than Breathwrk; more raw patterns.' },
    { criterionId: 'technique-coverage', score: 8.0, note: 'Broad technique coverage via the customisable pattern engine — any timing combination users want.' },
    { criterionId: 'evidence-grounding', score: 5.5, note: 'Pattern engine is neutral — research grounding depends on the user knowing which patterns are validated. Less curated science copy than Breathwrk.' },
    { criterionId: 'app-experience', score: 5.5, note: 'Functional Android-first UI; iOS port exists but feels secondary. Dated vs premium 2026 apps.' },
    { criterionId: 'biofeedback', score: 5.0, note: 'No HRV integration. Basic streak tracking.' },
    { criterionId: 'value', score: 8.0, note: 'Mostly free model with one-time premium unlock ~$10. Strongest value entry in customisable breathwork.' },
  ],
  pros: [
    'Best parameter customisation — full control over breath-pattern timings',
    'Long-running app with multi-year reliability',
    'Mostly-free model with cheap one-time premium unlock',
    'Android-first — best option for non-iOS users',
  ],
  cons: [
    'UX feels dated vs premium 2026 apps',
    'Less curated content / journey arcs',
    'No HRV biofeedback or evidence-curated copy',
    'Pattern engine assumes user knows which timings to use',
  ],
  bestFor: 'Best for users wanting deep breath-pattern customisation at near-free pricing — and Android-first users without premium-app polish requirements.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Prana Breath app documentation, Google Play / App Store listings and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 10, note: 'one-time premium unlock; free tier substantial', asOf: '2026-05-28' },
  link: 'https://prana-breath.info/',
  linkType: 'official',
  content: `## Where it leads

Prana Breath is the customisable-pattern breathwork reference — deep parameter exposure, long-running Android-first app, mostly-free model with a $10 one-time premium unlock. The pattern engine lets users build any breath timing they want.

## Where it falls short

UX polish and curated content. Prana Breath feels dated next to Breathwrk or Othership; there's no cinematic production, no journey arcs, no curated science copy. The pattern engine is powerful but assumes the user already knows which timings to use.

## Who it is for

Choose Prana Breath for cheap, customisable breath-pattern practice — especially on Android, where premium options are weaker. For curated structured library, Breathwrk. For free entry on iOS, iBreathe. For HRV biofeedback, Inhale.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Prana Breath — official site', url: 'https://prana-breath.info/' },
  ],
  relatedSlugs: ['breathwrk', 'ibreathe', 'breathe-to-relax'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default pranaBreath
