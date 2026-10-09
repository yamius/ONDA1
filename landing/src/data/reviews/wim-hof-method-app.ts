import type { ToolReviewInput } from './types'

const wimHofMethodApp: ToolReviewInput = {
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
  scores: [
    { criterionId: 'session-library', score: 7.0, note: 'Structured Wim Hof breath rounds at varying levels, plus cold-exposure protocols and certified-instructor course modules. Library narrow by design — this is the Wim Hof reference.' },
    { criterionId: 'technique-coverage', score: 5.5, note: 'Single-method focus — Wim Hof rounds dominate. Some adjunct content (yoga, meditation, cold protocols) but no Buteyko / 4-7-8 / cyclic sighing depth.' },
    { criterionId: 'evidence-grounding', score: 7.5, note: 'Cites the Radboud University Wim Hof published studies (immune-response, autonomic-system modulation) on this specific method — small laboratory studies, mostly in healthy young men, not evidence of a treatment.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Clean UI, structured progression through levels. Course-style content with Wim Hof video. Less polished than Othership; more functional than budget apps.' },
    { criterionId: 'biofeedback', score: 6.0, note: 'Breath-hold timer with personal-record tracking. Apple Health basic. No HRV-driven session adaptation.' },
    { criterionId: 'value', score: 7.5, note: '$42.99/year (Supporter Yearly) or $5.99/month — the cheapest of the big breathwork subscriptions; paid courses such as the 30-day audio challenge are extra.' },
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
  price: { usd: 42.99, note: 'Supporter Yearly ($5.99/month monthly; 7-day trial); app free to download with basic features; courses sold separately', asOf: '2026-10-03' },
  link: 'https://www.wimhofmethod.com/',
  linkType: 'official',
  content: `## Where it leads

Wim Hof Method app is the official reference for the Wim Hof breath protocol — structured rounds at varying levels, cold-exposure protocols, certified-instructor video courses, and citation of the Radboud University immune-response and autonomic-system studies that put the method on the scientific map — small laboratory studies in healthy volunteers, not proof of a treatment.

## What are the downsides of Wim Hof Method?

Single-method focus. The app is excellent for Wim Hof Method specifically; it does not cover Buteyko, 4-7-8, cyclic sighing or the broader breathwork landscape with the depth Breathwrk does. Cold-exposure integration assumes you have access to cold immersion hardware.

## Who should buy Wim Hof Method?

Choose Wim Hof Method app if you're committed to the WHM specifically. For broad technique coverage, Breathwrk. For cinematic music breathwork, Othership. For rhythmic music breathwork with certifications, SOMA Breath.

---

## Background reading

- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — autonomic-system modulation via voluntary breath
- [Mitochondrial biogenesis](/articles/mitochondrial-biogenesis-cellular-power-grid) — Wim Hof crossover with cold exposure
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Wim Hof Method — official site', url: 'https://www.wimhofmethod.com/' },
  ],
  relatedSlugs: ['breathwrk', 'othership', 'soma-breath'],
  publishOn: '2026-06-29',
  faq: [
    { q: "Is the Wim Hof Method app worth it?", a: "The Wim Hof Method app is worth it if you are committed to that method. It is the official reference, with structured level-based progression, certified-instructor courses and integrated cold-exposure protocols. It covers only one method, so pair it with Breathwrk for technique breadth." },
    { q: "How much does the Wim Hof Method app cost?", a: "The Wim Hof Method app is free to download; the Supporter subscription costs $42.99 a year or $5.99 a month in the US App Store, and courses are sold separately. The subscription unlocks structured level-based progression and certified-instructor courses." },
    { q: "Wim Hof Method app vs Breathwrk: which is better?", a: "Choose the Wim Hof Method app for the official method, structured progression and cold-exposure integration. Choose Breathwrk for breadth across techniques like Buteyko, 4-7-8 and cyclic sighing. The review suggests pairing them." },
    { q: "What are the downsides of the Wim Hof Method app?", a: "The app focuses on a single method with no Buteyko, 4-7-8 or cyclic sighing depth. Its UX is less polished than Othership, its scope is narrower than Breathwrk, and cold protocols assume access to cold immersion." },
  ],
  datePublished: '2026-06-29',
  dateModified: '2026-10-10',
}

export default wimHofMethodApp
