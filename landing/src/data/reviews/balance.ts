import type { ToolReview } from './types'

const balance: ToolReview = {
  slug: 'balance',
  name: 'Balance',
  brand: 'Balance',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of Balance — the meditation app that builds an adaptive, personalised plan. Scored on personalisation, library, free tier and value.',
  verdict:
    'A meditation app that adapts to you — a genuinely personalised plan, with a full year free to try and a few rough edges.',
  summary:
    'Balance is the personalisation pick. It builds an adaptive plan around your level, goals and feedback rather than handing you a fixed library, and it gives a full year free to try it. The adaptation is not flawless, and the Android app has had reliability complaints.',
  overallScore: 7.5,
  scores: [
    { criterionId: 'content-library', score: 7.5, note: 'A solid plan-based library — built around guided programs rather than a sprawling catalogue.' },
    { criterionId: 'teaching', score: 7.5, note: 'Clear, course-style teaching that builds fundamental skills.' },
    { criterionId: 'personalization', score: 8.5, note: 'The standout — an adaptive plan tuned to your level, frequency and feedback, though it does not always pick the right level.' },
    { criterionId: 'app-experience', score: 6.5, note: 'Clean on iOS, but the Android app has drawn reliability complaints — audio cutting out, subscription glitches.' },
    { criterionId: 'free-tier', score: 8.0, note: 'An unusually generous 12-month free trial — effectively a full year of practice before paying.' },
    { criterionId: 'value', score: 7.5, note: 'Around 70 USD a year after the trial — fair for a personalised plan.' },
    { criterionId: 'evidence', score: 6.0, note: 'Some grounding, but evidence is not the focus.' },
  ],
  pros: [
    'Genuinely adaptive, personalised plans',
    'A full 12-month free trial',
    'Clear, course-style teaching',
    'Reasonable price after the trial',
  ],
  cons: [
    'Personalisation does not always pick the right level',
    'Android app has drawn reliability complaints',
    'Smaller library than Calm or Insight Timer',
    'Needs a subscription after the trial year',
  ],
  bestFor: 'Best for a meditation plan that adapts to your level and goals.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 70, note: 'per year, after a 12-month free trial', asOf: '2026-05-15' },
  link: 'https://balanceapp.com',
  linkType: 'official',
  content: `## Where it leads

Balance is the personalisation pick of this group. Rather than dropping you into a vast catalogue, it builds an adaptive plan — tuned to your experience level, how often you practise and the feedback you give after sessions — and adjusts as you go. It also has the most generous on-ramp here: a full 12-month free trial, so you can run a real practice for a year before deciding to pay.

## Where it falls short

The adaptation is good, not perfect — independent reviews note it does not always pick the right course level. The bigger issue is reliability on Android, where users have reported audio cutting out mid-session and subscription glitches. And the library, while well-built, is smaller than the sprawling catalogues of Calm or Insight Timer.

## Who it is for

Choose Balance if you want a plan that meets you where you are and adapts over time, and the year-long free trial appeals. If you want the largest library, or you are on Android and reliability worries you, Insight Timer or Headspace are safer picks.

---

## Background reading

The science of what meditation actually does at the nervous-system level.

- [Neural entrainment through meditation](/articles/neural-entrainment-meditation-2) — why structured practice rewires baseline cortical states
- [Quiet-mode alpha and the cortisol buffer](/articles/quiet-mode-alpha-cortisol-buffer) — the stress-regulation mechanism meditation engages
- [Rhythmic entrainment and system frequencies](/articles/rhythmic-entrainment-system-frequencies) — why paced audio and breath protocols compound with practice
`,
  references: [
    { label: 'Balance — official site', url: 'https://balanceapp.com' },
    { label: 'Meditation app clinical research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=meditation+app+randomized+controlled+trial' },
  ],
  relatedSlugs: ['headspace', 'calm', 'insight-timer'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default balance
