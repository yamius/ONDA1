import type { ToolReview } from './types'

const inhale: ToolReview = {
  slug: 'inhale-by-aero-health',
  name: 'Inhale by Aero Health',
  brand: 'Aero Health',
  category: 'breathwork-app',
  productType: 'HRV-driven biofeedback breathwork app',
  description:
    'ONDA review of Inhale by Aero Health — biofeedback breathwork app using Apple Watch HRV to drive session selection. Scored on library, technique coverage, biofeedback integration and value.',
  verdict:
    'Best HRV-driven breathwork app — measures Apple Watch HRV pre/post session and adapts recommendations. Narrow library but unique biofeedback closure.',
  summary:
    'Inhale by Aero Health is the only breathwork app that closes the biofeedback loop with HRV measurement — pre-session Apple Watch HRV reading, guided breath protocol, post-session HRV reading, app adapts recommendations based on response. Library is narrower than Breathwrk but the HRV-driven personalisation is unique. Best fit for HRV-obsessed biohackers.',
  overallScore: 6.7,
  scores: [
    { criterionId: 'session-library', score: 6.0, note: 'Modest library of structured protocols. Smaller than Breathwrk or Othership; designed around HRV-response measurement rather than content breadth.' },
    { criterionId: 'technique-coverage', score: 6.5, note: 'Core HRV-responsive techniques (coherent breathing, box, 4-7-8, cyclic sighing). Less holotropic / ceremony coverage.' },
    { criterionId: 'evidence-grounding', score: 7.5, note: 'Builds on HRV-biofeedback research (Lehrer, Vaschillo) and the resonant-breathing literature. Closer alignment with published HRV-protocol research than most apps.' },
    { criterionId: 'app-experience', score: 7.0, note: 'Apple Watch native, clean session UI. HRV reading integration is the differentiator.' },
    { criterionId: 'biofeedback', score: 9.0, note: 'Best biofeedback integration in breathwork apps — Apple Watch HRV pre/post measurement, adaptive recommendations. Unique in category.' },
    { criterionId: 'value', score: 6.0, note: '$60/year — accessible mid-tier. Reasonable for the HRV-driven approach.' },
  ],
  pros: [
    'Only breathwork app that closes the loop with Apple Watch HRV measurement',
    'Adaptive recommendations based on pre/post HRV response',
    'Aligns with published HRV-biofeedback research (Lehrer, Vaschillo)',
    'Accessible $60/year pricing',
  ],
  cons: [
    'Smaller library than Breathwrk or Othership',
    'Requires Apple Watch for the biofeedback differentiator',
    'No ceremony / music-driven content',
    'Less brand recognition than category leaders',
  ],
  bestFor: 'Best for HRV-obsessed biohackers who already wear Apple Watch and want breathwork sessions measured and adapted by HRV response.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Inhale by Aero Health app documentation, App Store listing and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 60, note: 'annual subscription; requires Apple Watch for biofeedback', asOf: '2026-05-28' },
  link: 'https://aerohealth.com/',
  linkType: 'official',
  content: `## Where it leads

Inhale by Aero Health is the only breathwork app closing the biofeedback loop with Apple Watch HRV measurement — pre-session reading, guided protocol, post-session reading, adaptive recommendation. Aligns with the published Lehrer/Vaschillo HRV-biofeedback research.

## Where it falls short

Library size and Apple Watch dependence. Inhale's structured library is smaller than Breathwrk or Othership, and the biofeedback differentiator requires you to wear Apple Watch consistently. For users without a watch, much of the value evaporates.

## Who it is for

Choose Inhale by Aero Health if you wear Apple Watch and want HRV-driven adaptive breathwork. For largest structured library, Breathwrk. For cinematic music sessions, Othership. For free entry without biofeedback, iBreathe.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing) — vagal tone and HRV physiology
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep)
`,
  references: [
    { label: 'Aero Health — official site', url: 'https://aerohealth.com/' },
  ],
  relatedSlugs: ['breathwrk', 'wim-hof-method-app', 'prana-breath'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default inhale
