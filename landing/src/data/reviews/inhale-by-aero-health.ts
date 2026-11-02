import type { ToolReviewInput } from './types'

const inhale: ToolReviewInput = {
  slug: 'inhale-by-aero-health',
  name: 'Inhale by Aero Health',
  brand: 'Aero Health',
  category: 'breathwork-app',
  productType: 'HRV-driven biofeedback breathwork app',
  description:
    'ONDA review of Inhale by Aero Health, a breathwork app that uses Apple Watch HRV to pick sessions. Scored on library, techniques, biofeedback and value.',
  verdict:
    'An HRV-driven breathwork app — measures Apple Watch HRV pre/post session and adapts recommendations. Narrow library but closes the biofeedback loop.',
  summary:
    'Inhale by Aero Health is a breathwork app that closes the biofeedback loop with HRV measurement — pre-session Apple Watch HRV reading, guided breath protocol, post-session HRV reading, app adapts recommendations based on response. Library is narrower than Breathwrk but the HRV-driven personalisation is its focus. Best fit for HRV-obsessed biohackers.',
  scores: [
    { criterionId: 'session-library', score: 6.0, note: 'Modest library of structured protocols. Smaller than Othership’s or Breathwrk’s; designed around HRV-response measurement rather than content breadth.' },
    { criterionId: 'technique-coverage', score: 6.5, note: 'Core HRV-responsive techniques (coherent breathing, box, 4-7-8, cyclic sighing). Less holotropic / ceremony coverage.' },
    { criterionId: 'evidence-grounding', score: 7.5, note: 'Builds on HRV-biofeedback research (Lehrer, Vaschillo) and the resonant-breathing literature.' },
    { criterionId: 'app-experience', score: 7.0, note: 'Apple Watch native, clean session UI. HRV reading integration is the differentiator.' },
    { criterionId: 'biofeedback', score: 9.0, note: 'Apple Watch HRV pre/post measurement with adaptive recommendations.' },
    { criterionId: 'value', score: 6.0, note: '$60/year — accessible mid-tier. Reasonable for the HRV-driven approach.' },
  ],
  pros: [
    'Breathwork app that closes the loop with Apple Watch HRV measurement',
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

Inhale by Aero Health is a breathwork app that closes the biofeedback loop with Apple Watch HRV measurement — pre-session reading, guided protocol, post-session reading, adaptive recommendation. Aligns with the published Lehrer/Vaschillo HRV-biofeedback research.

## What are the downsides of Inhale by Aero Health?

Library size and Apple Watch dependence. Inhale's structured library is smaller than Breathwrk or Othership, and the biofeedback differentiator requires you to wear Apple Watch consistently. For users without a watch, much of the value evaporates.

## Who should buy Inhale by Aero Health?

Choose Inhale by Aero Health if you wear Apple Watch and want HRV-driven adaptive breathwork. For largest structured library, Breathwrk. For cinematic music sessions, Othership. For free entry without biofeedback, iBreathe.

---

## Background reading

- [Coherent breathing guide](/articles/coherent-breathing-guide) — the slow-breathing protocol HRV biofeedback builds on
- [Heart rate variability](/glossary/heart-rate-variability) — what HRV measures
`,
  references: [
    { label: 'Aero Health — official site', url: 'https://aerohealth.com/' },
  ],
  relatedSlugs: ['breathwrk', 'wim-hof-method-app', 'prana-breath'],
  publishOn: '2026-06-29',
  faq: [
    { q: "What makes Inhale by Aero Health different?", a: "Inhale by Aero Health is a breathwork app that closes the biofeedback loop with HRV, taking an Apple Watch HRV reading before a session and after, then adapting recommendations to your response. It scores {{score:inhale-by-aero-health.biofeedback}}/10 on biofeedback, its highest criterion score, for an overall ONDA score of {{score:inhale-by-aero-health}}/10." },
    { q: "How much does Inhale by Aero Health cost?", a: "Inhale by Aero Health costs $60 per year, an accessible mid-tier subscription that scores {{score:inhale-by-aero-health.value}}/10 on value. An Apple Watch is required to unlock the HRV biofeedback differentiator; without a watch, much of the app's value evaporates." },
    { q: "Who is Inhale by Aero Health best for?", a: "Inhale by Aero Health is best for HRV-obsessed biohackers who already wear an Apple Watch and want breathwork sessions measured and adapted by HRV response. Its library is smaller than Breathwrk or Othership, and it aligns with published HRV-biofeedback research from Lehrer and Vaschillo." },
  ],

  datePublished: '2026-06-29',
  dateModified: '2026-10-11',
}

export default inhale
