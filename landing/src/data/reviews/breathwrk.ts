import type { ToolReviewInput } from './types'

const breathwrk: ToolReviewInput = {
  slug: 'breathwrk',
  name: 'Breathwrk',
  brand: 'Breathwrk',
  category: 'breathwork-app',
  productType: 'Guided breathing-exercise app with classes and programs',
  description:
    'ONDA review of Breathwrk, the Peloton-owned guided breathing app: 50+ exercises (100+ on Pro), daily classes and programs, free tier. Scored on library, technique coverage, evidence and value.',
  verdict:
    'A well-priced guided breathing library — exercises, daily classes and programs with a free tier and Peloton inclusion — but no heart-rate or HRV feedback, and its benefit claims go uncited.',
  summary:
    'Breathwrk (part of Peloton since its acquisition) is a guided breathing app: 50+ exercises on the free plan and 100+ on Pro, daily video classes and multi-day programs, on iOS, Android, the web, Mac and Vision. Official technique examples include box breathing, 4-7-8, humming and long-exhale patterns, plus breath-hold “lung score” tests. It logs Mindfulness Minutes to Apple Health but has no Apple Watch app and measures no heart rate or HRV. Pro costs $9/month or about $49/year after a 7-day trial, and is included for Peloton All-Access, Guide and App+ members.',
  scores: [
    { criterionId: 'session-library', score: 8.0, note: '50+ exercises on the free plan and 100+ on Pro, plus daily video classes and multi-day programs (official site and App Store, accessed 2026-10-11). Substantial, but smaller than Othership’s catalogue, so not the largest in the category.' },
    { criterionId: 'technique-coverage', score: 7.5, note: 'Officially named techniques include box breathing, 4-7-8, humming and long-exhale patterns, plus breath-hold tests. A fuller technique list is not documented in official materials, so we do not credit techniques we cannot confirm.' },
    { criterionId: 'evidence-grounding', score: 6.5, note: 'The App Store listing says the exercises improve HRV and lower heart rate and blood pressure, but cites no studies for those claims (accessed 2026-10-11). Slow breathing does have research support in general; the app’s own claims are uncited.' },
    { criterionId: 'app-experience', score: 8.0, note: 'Clean UI with animated breath guides, audio coaching and video classes, on iOS, Android, web, Mac and Vision. No Apple Watch app (App Store compatibility list, accessed 2026-10-11).' },
    { criterionId: 'biofeedback', score: 4.5, note: 'Logs Mindfulness Minutes to Apple Health and offers breath-hold “lung score” tests, but measures no heart rate or HRV and has no sensor integration (official site and App Store, accessed 2026-10-11).' },
    { criterionId: 'value', score: 8.5, note: '$49/year (or $9/month) with a usable free tier, and included for Peloton All-Access, Guide and App+ members. Best value in premium breathwork — cheaper than Othership, with a 7-day trial and a usable free plan.' },
  ],
  pros: [
    '50+ guided exercises (100+ on Pro), daily classes and multi-day programs',
    'Free plan; Pro about $49/year with a 7-day trial, included with some Peloton memberships',
    'Runs on iOS, Android, web, Mac and Vision',
    'Clean UI with animated breath guides and audio coaching',
  ],
  cons: [
    'No heart-rate or HRV measurement and no Apple Watch app',
    'Benefit claims (HRV, heart rate, blood pressure) are not cited',
    'No community / live-session layer (vs Othership)',
    'Subscription required for the full library',
    'Less holotropic / emotional-release focus than Pause or SOMA',
  ],
  bestFor: 'Best for people who want an affordable guided breathing routine — exercises, daily classes and programs — and do not need to see their heart rate or HRV respond.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from Breathwrk app documentation, App Store listing, founder public communications and 2026 user reviews. Not hands-on tested by ONDA.',
  price: { usd: 49, note: 'Breathwrk Pro annual ($9/month monthly); 7-day free trial; free plan available; included with Peloton All-Access, Guide and App+ (Breathwrk is now part of Peloton)', asOf: '2026-10-11' },
  link: 'https://www.breathwrk.com/',
  linkType: 'official',
  content: `## Where it leads

Breathwrk is an affordable guided breathing library. The official site lists 50+ exercises on the free plan and 100+ on Pro, with daily video classes and multi-day programs; named techniques include box breathing, 4-7-8, humming and long-exhale patterns. It runs on iOS, Android, the web, Mac and Vision, and Pro is included for Peloton All-Access, Guide and App+ members (official site and App Store, accessed 2026-10-11).

## What are the downsides of Breathwrk?

It measures no heart rate or HRV and has no Apple Watch app, so it cannot show how your body responds (Inhale's differentiator). Its App Store copy says the exercises improve HRV, heart rate and blood pressure without citing studies. There is no community or live-session layer (Othership's differentiator), and less holotropic / emotional-release focus than Pause or SOMA. Breathwrk is excellent for structured daily practice; it's not the right shape for deep emotional-release sessions or for community-driven breathwork culture.

## Who should buy Breathwrk?

Choose Breathwrk if you want an affordable guided routine — exercises, daily classes and programs — with a free plan to start. For community + music-driven sessions, Othership. For HRV biofeedback, Inhale. For emotional release, Pause Breathwork. For free entry, iBreathe or Breathe2Relax.

---

## Background reading

- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep) — breathwork pairs with audio entrainment for sleep onset
- [Electric medicine and neuromodulation](/articles/electric-medicine-neuromodulation) — vagal tone and parasympathetic activation
- [Does sleep really clean your brain? The glymphatic evidence](/articles/nightly-flush-glymphatic-neural-cache) — what is shown in people, and what is still disputed
`,
  references: [
    { label: 'Breathwrk — official site', url: 'https://www.breathwrk.com/' },
    { label: 'Breathwrk — App Store listing', url: 'https://apps.apple.com/us/app/breathwrk-breathing-exercises/id1481804500' },
  ],
  relatedSlugs: ['othership', 'soma-breath', 'wim-hof-method-app'],
  publishOn: '2026-06-29',
  faq: [
    { q: "Is Breathwrk worth it?", a: "For an affordable guided routine, yes: 50+ exercises free and 100+ on Pro, daily classes and programs for about $49 a year, with a 7-day trial. It does not measure heart rate or HRV, and its claims that the exercises improve HRV, heart rate and blood pressure are not cited." },
    { q: "How much does Breathwrk cost?", a: "Breathwrk Pro costs about $49 per year or $9 per month after a 7-day free trial, and a free plan is available. Breathwrk is now part of Peloton, and Pro is included for Peloton All-Access, Guide and App+ members." },
    { q: "Does Breathwrk measure heart rate or HRV?", a: "No. Its official site and App Store listing (accessed 2026-10-11) describe guided exercises, classes, programs and breath-hold tests, and Apple Health logging of Mindfulness Minutes, but no heart-rate or HRV measurement and no Apple Watch app." },
    { q: "Who is Breathwrk best for?", a: "People who want an affordable, guided daily breathing routine with box breathing, 4-7-8, humming and long-exhale exercises, and who do not need biofeedback. For music-led sessions choose Othership; for HRV biofeedback, Inhale." },
  ],
  datePublished: '2026-06-29',
  dateModified: '2026-10-11',
}

export default breathwrk
