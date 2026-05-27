import type { ToolReview } from './types'

const somaBreath: ToolReview = {
  slug: 'soma-breath',
  name: 'SOMA Breath',
  brand: 'SOMA Breath',
  category: 'breathwork-app',
  productType: 'Rhythmic music breathwork app with practitioner certifications',
  description:
    'ONDA review of SOMA Breath — rhythmic music breathwork app from Niraj Naik with global practitioner certification network. Scored on library, technique coverage, evidence and value.',
  verdict:
    'Best for music-paced rhythmic breathwork with global certification community. Less science-grounded than Breathwrk, deeper ceremony framing than Othership.',
  summary:
    'SOMA Breath is the rhythmic music breathwork reference — Niraj Naik’s method paces breath to beat-driven tracks, often layered with Wim Hof rounds and pranayama elements. Distinguished by the global practitioner certification network (hundreds of SOMA-certified facilitators worldwide). Strong ceremony framing, moderate evidence grounding, mid-tier subscription pricing.',
  overallScore: 7.9,
  scores: [
    { criterionId: 'session-library', score: 8.0, note: 'Solid library of rhythmic music-paced sessions across awakening, healing, calm and ceremony. Smaller than Breathwrk but deeper per-session production.' },
    { criterionId: 'technique-coverage', score: 7.5, note: 'Wim Hof rounds, pranayama, breath retentions, rhythmic-music pacing. Less Buteyko / clinical-modality coverage than Breathwrk; deeper into rhythmic crossover.' },
    { criterionId: 'evidence-grounding', score: 6.5, note: 'Cites general breath physiology and Wim Hof research; ceremony framing dominates the marketing. Less peer-reviewed citation depth than Breathwrk.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Clean app experience, music-paced visual cues. Beat-driven sessions feel different from voice-guided counterparts.' },
    { criterionId: 'biofeedback', score: 5.5, note: 'No HRV integration. Apple Health basic logging only.' },
    { criterionId: 'value', score: 7.5, note: '$99/year — mid-premium tier. Reasonable for the production value and practitioner network access.' },
  ],
  pros: [
    'Rhythmic music breathwork — unique pacing approach in the category',
    'Global practitioner certification network',
    'Strong ceremony / journey production',
    'Wim Hof crossover with pranayama elements',
  ],
  cons: [
    'Less science-grounded than Breathwrk',
    'No HRV biofeedback',
    'Smaller library than Breathwrk',
    'Ceremony framing may not suit users seeking pure clinical breathwork',
  ],
  bestFor: 'Best for users wanting rhythmic music-paced breathwork with ceremony framing and access to a global certified-facilitator community.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from SOMA Breath app documentation, App Store listing and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 99, note: 'annual subscription; free trial available', asOf: '2026-05-28' },
  link: 'https://www.somabreath.com/',
  linkType: 'official',
  content: `## Where it leads

SOMA Breath is the rhythmic music breathwork reference — beat-paced sessions, Wim Hof crossover, pranayama elements and a global practitioner certification network. Strong ceremony production and a unique pacing approach distinct from voice-guided alternatives.

## Where it falls short

Evidence depth and library size vs Breathwrk. SOMA leans heavier on ceremony framing than peer-reviewed citations, and the library is smaller than the structured-default Breathwrk. No HRV biofeedback.

## Who it is for

Choose SOMA Breath for rhythmic music-paced breathwork with ceremony framing and certification community access. For largest structured library, Breathwrk. For cinematic music + live classes, Othership. For free entry, iBreathe.

---

## Background reading

- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors)
`,
  references: [
    { label: 'SOMA Breath — official site', url: 'https://www.somabreath.com/' },
  ],
  relatedSlugs: ['breathwrk', 'othership', 'wim-hof-method-app'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default somaBreath
