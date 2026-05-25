import type { ToolReview } from './types'

const rise: ToolReview = {
  slug: 'rise',
  name: 'RISE',
  brand: 'Rise Science',
  category: 'sleep-app',
  productType: 'Sleep and energy app',
  description:
    'ONDA review of RISE — a sleep app built around sleep debt and circadian rhythm, focused on daytime energy rather than nightly stats. Scored on science and insights.',
  verdict:
    'A sleep app that reframes the goal as daytime energy — it tracks sleep debt and your circadian rhythm and tells you when to do things, not just how you slept.',
  summary:
    'RISE takes a different angle from the trackers here. Instead of grading last night, it tracks two things — your accumulated sleep debt and your circadian rhythm — and turns them into a daily energy schedule: when you will peak, when you will dip, when to wind down. The focus is what to do with your day.',
  overallScore: 6.8,
  scores: [
    { criterionId: 'tracking-accuracy', score: 6.5, note: 'Tracks sleep times via phone or wearable data — solid, but sleep debt is an estimate.' },
    { criterionId: 'wind-down-content', score: 4.5, note: 'Light — some relaxation tools, but content is not the focus.' },
    { criterionId: 'sleep-science', score: 8.0, note: 'Built on two real concepts — sleep debt and circadian rhythm — applied consistently.' },
    { criterionId: 'insights', score: 8.0, note: 'Its standout — a daily energy schedule with peaks, dips and an optimal wind-down window.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Clear and focused, organised around the energy timeline.' },
    { criterionId: 'free-tier', score: 5.0, note: 'A short trial then a subscription — little usable for free.' },
    { criterionId: 'value', score: 6.5, note: 'Around 60 USD a year for a distinctive but single-angle app.' },
  ],
  pros: [
    'Reframes sleep around daytime energy, not just stats',
    'Tracks sleep debt and circadian rhythm consistently',
    'A genuinely useful daily energy schedule',
    'Clear, focused interface',
  ],
  cons: [
    'Sleep debt is a model, not a measurement',
    'Light on wind-down content',
    'Thin free tier',
    'A single-angle app — it does one thing',
  ],
  bestFor: 'Best for anyone who cares about daytime energy and timing, not nightly scores.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 60, note: 'per year; a short trial only', asOf: '2026-05-16' },
  link: 'https://www.risescience.com',
  linkType: 'official',
  content: `## Where it leads

RISE asks a different question from the rest of the field. Not "how did you sleep?" but "what should you do with today?" It tracks two things — your accumulated sleep debt and your circadian rhythm — and turns them into a daily energy schedule: when you will peak, when you will hit an afternoon dip, when your optimal wind-down window opens. For anyone who cares about energy and timing rather than a nightly grade, that framing is genuinely useful.

## Where it falls short

Sleep debt is a model, not a direct measurement, so treat the numbers as a well-reasoned estimate. Wind-down content is light, the free tier is a short trial, and RISE does one thing — if you want a sound library or a smart alarm, it is not that app.

## Who it is for

Choose RISE if you want to manage daytime energy and time your day around your rhythm. If you mainly want nightly tracking stats or help falling asleep, a tracker or a relaxation app fits better.

---

## Background reading

The sleep biology behind what these apps measure and the protocols they support.

- [Neural hydraulics: CSF flow](/articles/neural-hydraulics-csf-flow) — CSF circulation during sleep as the substrate of glymphatic clearance
- [Circadian reset: mastering light](/articles/circadian-reset-mastering-light) — why light timing dominates sleep quality more than anything else
- [Circadian lighting and dark therapy](/articles/circadian-lighting-dark-therapy) — the protocol layer that compounds with tracking
`,
  references: [
    { label: 'RISE (Rise Science) — official site', url: 'https://www.risescience.com' },
    { label: 'Sleep and circadian rhythm research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sleep+debt+circadian+rhythm' },
  ],
  relatedSlugs: ['sleep-cycle', 'sleepio', 'sleepscore'],
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
}

export default rise
