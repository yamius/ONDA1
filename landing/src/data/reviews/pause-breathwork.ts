import type { ToolReview } from './types'

const pauseBreathwork: ToolReview = {
  slug: 'pause-breathwork',
  name: 'Pause Breathwork',
  brand: 'Pause Breathwork (Samantha Skelly)',
  category: 'breathwork-app',
  productType: 'Somatic / emotional-release breathwork app',
  description:
    'ONDA review of Pause Breathwork — somatic and emotional-release-focused breathwork app from Samantha Skelly. Scored on library, technique coverage, evidence and value.',
  verdict:
    'Best somatic / emotional-release breathwork app — longer journey sessions, trauma-informed framing. Narrow scope vs structured-library defaults.',
  summary:
    'Pause Breathwork is Samantha Skelly’s somatic / emotional-release-focused app — longer journey-style sessions (20–60 min) with trauma-informed framing, intentional emotional-release language and a strong female-founded community. The differentiator is somatic depth, not structured-protocol breadth. Best for users buying breathwork as emotional / somatic-release tool, not as nervous-system protocol.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'session-library', score: 7.0, note: 'Solid library of longer journey-style sessions (20–60 min). Smaller than Breathwrk in count; deeper in per-session length and emotional arc.' },
    { criterionId: 'technique-coverage', score: 5.5, note: 'Somatic / holotropic-style breathwork dominates. Less coverage of box, 4-7-8, Buteyko or clinical-protocol techniques.' },
    { criterionId: 'evidence-grounding', score: 6.5, note: 'Trauma-informed framing draws on somatic-experiencing literature (Peter Levine, Bessel van der Kolk). Less peer-reviewed citation than Breathwrk; deeper somatic-therapy grounding.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Clean, calm UX. Longer session format means less daily-snackable use; deeper journey arcs.' },
    { criterionId: 'biofeedback', score: 5.0, note: 'No HRV. Apple Health basic.' },
    { criterionId: 'value', score: 7.0, note: '$90/year — fair for the somatic-niche depth. Cheaper than Othership; comparable to SOMA Breath.' },
  ],
  pros: [
    'Best somatic / emotional-release-focused breathwork app',
    'Trauma-informed framing drawing on somatic-experiencing literature',
    'Longer journey-style sessions for deeper emotional arcs',
    'Strong female-founded community layer',
  ],
  cons: [
    'Narrow technique scope — somatic/holotropic-dominant',
    'Less suited for daily structured breath practice',
    'No HRV biofeedback',
    'Longer sessions don\'t fit short daily windows',
  ],
  bestFor: 'Best for users buying breathwork as emotional / somatic-release tool with trauma-informed framing — not as a daily structured nervous-system protocol.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Pause Breathwork app documentation, App Store listing and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 90, note: 'annual subscription; free trial available', asOf: '2026-05-28' },
  link: 'https://www.pausebreathwork.com/',
  linkType: 'official',
  content: `## Where it leads

Pause Breathwork is the somatic / emotional-release-focused breathwork reference — Samantha Skelly's app delivering longer journey-style sessions with trauma-informed framing drawing on Peter Levine and Bessel van der Kolk's somatic-therapy literature. Best execution of breathwork-as-emotional-tool.

## Where it falls short

Narrow technique scope and longer session format. Pause is not the right shape for daily 5-minute box-breathing practice — it's built for 20–60 minute emotional-release journeys. No HRV biofeedback, less clinical-protocol coverage than Breathwrk.

## Who it is for

Choose Pause Breathwork if you're buying breathwork for somatic / emotional release work. For daily structured nervous-system practice, Breathwrk. For cinematic music journeys, Othership. For Wim Hof specifically, the Wim Hof Method app.

---

## Background reading

- [Bioelectric architecture of healing](/articles/bioelectric-architecture-healing)
- [Nightly flush: the glymphatic system](/articles/nightly-flush-glymphatic-neural-cache)
`,
  references: [
    { label: 'Pause Breathwork — official site', url: 'https://www.pausebreathwork.com/' },
  ],
  relatedSlugs: ['breathwrk', 'othership', 'soma-breath'],
  publishOn: '2026-06-29',
  datePublished: '2026-06-29',
  dateModified: '2026-06-29',
}

export default pauseBreathwork
