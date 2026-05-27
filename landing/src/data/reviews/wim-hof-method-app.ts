import type { ToolReview } from './types'

const wimHofMethodApp: ToolReview = {
  slug: 'wim-hof-method-app',
  name: 'Wim Hof Method',
  brand: 'Innerfire (Wim Hof)',
  category: 'breathwork-app',
  productType: 'Official Wim Hof Method breathwork and cold-exposure app',
  description:
    'ONDA review of the Wim Hof Method app — official Innerfire app with structured Wim Hof breath rounds, cold-exposure protocols and certified-instructor courses. Scored on library, evidence, app experience and value.',
  verdict:
    'Best for the Wim Hof Method specifically — official rounds, structured progression, cold-exposure integration. Narrow scope vs Breathwrk’s breadth.',
  summary:
    'Wim Hof Method app is the official Innerfire app delivering structured Wim Hof breath rounds, cold-exposure protocols and certified-instructor video courses. Strong brand recognition and the most rigorous training in this single method specifically. Library breadth and technique coverage are narrower than Breathwrk — this app is the Wim Hof reference, not the breathwork reference.',
  overallScore: 7.7,
  scores: [
    { criterionId: 'session-library', score: 7.0, note: 'Structured Wim Hof breath rounds at varying levels, plus cold-exposure protocols and certified-instructor course modules. Library narrow by design — this is the Wim Hof reference.' },
    { criterionId: 'technique-coverage', score: 5.5, note: 'Single-method focus — Wim Hof rounds dominate. Some adjunct content (yoga, meditation, cold protocols) but no Buteyko / 4-7-8 / cyclic sighing depth.' },
    { criterionId: 'evidence-grounding', score: 8.0, note: 'Cites the Radboud University Wim Hof published studies (immune-response, autonomic-system modulation) and engages credibly with the peer-reviewed evidence on this specific method.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Clean UI, structured progression through levels. Course-style content with Wim Hof video. Less polished than Othership; more functional than budget apps.' },
    { criterionId: 'biofeedback', score: 6.0, note: 'Breath-hold timer with personal-record tracking. Apple Health basic. No HRV-driven session adaptation.' },
    { criterionId: 'value', score: 7.5, note: '$70/year — fair for the official method and instructor courses. Cheaper than Othership; comparable to Breathwrk.' },
  ],
  pros: [
    'Official Wim Hof Method app — the definitive reference for the method',
    'Cites the published Radboud University immune-response and autonomic studies',
    'Structured level-based progression with certified-instructor courses',
    'Cold-exposure protocols integrated alongside breath rounds',
  ],
  cons: [
    'Single-method focus — no Buteyko, 4-7-8, cyclic sighing depth',
    'Less polished UX than Othership',
    'Narrow scope vs Breathwrk\'s breadth library',
    'Cold-exposure integration assumes you have access to cold immersion',
  ],
  bestFor: 'Best for users committed to the Wim Hof Method specifically — official rounds, structured progression, cold-exposure integration. Pair with Breathwrk for technique breadth.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from official Wim Hof Method app documentation, App Store listing and the published Radboud University WHM research. Not hands-on tested by ONDA.',
  price: { usd: 70, note: 'annual subscription; free tier available', asOf: '2026-05-28' },
  link: 'https://www.wimhofmethod.com/',
  linkType: 'official',
  content: `## Where it leads

Wim Hof Method app is the official reference for the Wim Hof breath protocol — structured rounds at varying levels, cold-exposure protocols, certified-instructor video courses, and credible citation of the Radboud University immune-response and autonomic-system studies that put the method on the scientific map.

## Where it falls short

Single-method focus. The app is excellent for Wim Hof Method specifically; it does not cover Buteyko, 4-7-8, cyclic sighing or the broader breathwork landscape with the depth Breathwrk does. Cold-exposure integration assumes you have access to cold immersion hardware.

## Who it is for

Choose Wim Hof Method app if you're committed to the WHM specifically. For broad technique coverage, Breathwrk. For cinematic music breathwork, Othership. For rhythmic music breathwork with certifications, SOMA Breath.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing) — autonomic-system modulation via voluntary breath
- [Mitochondrial recovery protocols](/articles/mitochondrial-recovery-protocols) — Wim Hof crossover with cold exposure
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Wim Hof Method — official site', url: 'https://www.wimhofmethod.com/' },
  ],
  relatedSlugs: ['breathwrk', 'othership', 'soma-breath'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default wimHofMethodApp
