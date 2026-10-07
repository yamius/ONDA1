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

## What are the downsides of SOMA Breath?

Evidence depth and library size vs Breathwrk. SOMA leans heavier on ceremony framing than peer-reviewed citations, and the library is smaller than the structured-default Breathwrk. No HRV biofeedback.

Safety: Wim Hof-style rounds combine hyperventilation with breath-holds, which can cause fainting without warning — never practise them in or near water (including baths and cold plunges) or while driving, and talk to a doctor first if you have epilepsy, heart disease or high blood pressure, or are pregnant. See [fast breathing: what the evidence shows](/science/evidence/fast-breathing).

## Who should buy SOMA Breath?

Choose SOMA Breath for rhythmic music-paced breathwork with ceremony framing and certification community access. For largest structured library, Breathwrk. For cinematic music + live classes, Othership. For free entry, iBreathe.

---

## Background reading

- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation)
- [Ancestral sync — circadian anchors](/articles/ancestral-sync-circadian-anchors)
`,
  references: [
    { label: 'SOMA Breath — official site', url: 'https://www.somabreath.com/' },
  ],
  relatedSlugs: ['breathwrk', 'othership', 'wim-hof-method-app'],
  publishOn: '2026-06-29',
  faq: [
    { q: "Is SOMA Breath worth it?", a: "SOMA Breath is worth it if you want rhythmic, music-paced breathwork with ceremony framing and a global certified-facilitator community. It is less science-grounded than Breathwrk, has a smaller library and offers no HRV biofeedback, so clinically minded users may prefer alternatives." },
    { q: "How much does SOMA Breath cost?", a: "SOMA Breath costs about $99 as an annual subscription, and a free trial is available. The subscription covers its rhythmic music breathwork sessions and ceremony-style journeys, which blend Wim Hof crossover with pranayama elements." },
    { q: "SOMA Breath vs Breathwrk: which is better?", a: "Breathwrk is more science-grounded and has a larger library. SOMA Breath stands out for rhythmic music-paced breathing, ceremony production and a global practitioner network. Choose Breathwrk for clinical breadth, SOMA for ritual and community." },
    { q: "What are the downsides of SOMA Breath?", a: "SOMA Breath is less science-grounded than Breathwrk, has a smaller library and offers no HRV biofeedback. Its ceremony framing may also not suit users seeking pure clinical breathwork without the journey-style production." },
  ],
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default somaBreath
