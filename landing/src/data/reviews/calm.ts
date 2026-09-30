import type { ToolReview } from './types'

const calm: ToolReview = {
  slug: 'calm',
  name: 'Calm',
  brand: 'Calm',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of Calm — the most polished sleep-and-relaxation app, with a vast library. Scored on content, teaching, app experience and value.',
  verdict:
    'The most polished sleep-and-relaxation app — a huge, beautifully made library, undercut by a thin free tier.',
  summary:
    'Calm is the most polished app in this category and the one to beat for sleep and relaxation — Sleep Stories, soundscapes and a vast library, all wrapped in a near-flawless interface. What it asks in return is a subscription: the free tier is thin.',
  overallScore: 7.7,
  scores: [
    { criterionId: 'content-library', score: 9.0, note: 'A vast library spanning meditations, Sleep Stories, soundscapes, music and masterclasses.' },
    { criterionId: 'teaching', score: 7.5, note: 'Broad and well-produced, but tilted toward relaxation rather than rigorous instruction.' },
    { criterionId: 'personalization', score: 7.0, note: 'The Daily Calm and recommendations guide you, though it is lighter on structured courses.' },
    { criterionId: 'app-experience', score: 9.0, note: 'A near-flawless, beautifully designed interface — the most polished in this comparison.' },
    { criterionId: 'free-tier', score: 5.0, note: 'The free tier is mostly the Daily Calm — useful but limited; the library needs Premium.' },
    { criterionId: 'value', score: 7.0, note: 'Around 70 USD a year for the library — fair, if you will use the sleep content.' },
    { criterionId: 'evidence', score: 6.0, note: 'Some research backing, but evidence is not a focus of the product.' },
  ],
  pros: [
    'The most polished interface in the category',
    'A vast library, strong on sleep and relaxation',
    'Celebrity-narrated Sleep Stories and soundscapes',
    'Reliable daily guidance via the Daily Calm',
  ],
  cons: [
    'Thin free tier — the library needs a subscription',
    'More relaxation than rigorous meditation instruction',
    'Lighter on structured, progressive courses',
    'Premium is required to get real value',
  ],
  bestFor: 'Best for sleep and relaxation — Sleep Stories, soundscapes and wind-down content.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 70, note: 'per year (Calm Premium)', asOf: '2026-05-15' },
  link: 'https://www.calm.com',
  linkType: 'official',
  content: `## Where it leads

Calm is the most polished app in this comparison. The interface is close to flawless, and the library is enormous — guided meditations, celebrity-narrated Sleep Stories, soundscapes, music and masterclasses. If your reason for installing a meditation app is to fall asleep more easily or to wind down, Calm is the strongest pick here: sleep and relaxation are clearly where its energy goes.

## What are the downsides of Calm?

The free tier is thin. The Daily Calm is genuinely useful, but the library proper sits behind Premium, so without a subscription the app is closer to a sample than a practice. And while the content is broad and beautifully produced, it leans toward relaxation rather than the structured, progressive instruction that Headspace and Waking Up build their courses around.

## Who should buy Calm?

Choose Calm if sleep and relaxation are your priority and a polished, soothing experience matters to you — and you are happy to pay for the full library. If you want to genuinely learn to meditate, or to practise for free, look at Headspace or Insight Timer.

---

## Background reading

The science of what meditation actually does at the nervous-system level.

- [Alpha brain waves: calm, creativity and flow](/articles/neural-bridge-alpha-flow-gateway) — what the alpha rhythm does, and what alpha headsets, apps and music can and cannot change
- [Rhythmic entrainment and system frequencies](/articles/rhythmic-entrainment-system-frequencies) — why paced audio and breath protocols compound with practice
- [Physiological concentration: flow-state hardwiring](/articles/physiological-concentration-flow-state-hardwired) — what neurochemistry the flow state actually requires
`,
  references: [
    { label: 'Calm — official site', url: 'https://www.calm.com' },
    { label: 'Meditation app clinical research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=meditation+app+randomized+controlled+trial' },
  ],
  relatedSlugs: ['headspace', 'insight-timer', 'waking-up'],
  faq: [
    { q: "Is Calm worth it?", a: "Yes, for sleep and relaxation, if you pay for Premium. Calm has the most polished interface in the category and a vast library with celebrity-narrated Sleep Stories and soundscapes. Its free tier is thin, and it is lighter on rigorous, structured meditation courses." },
    { q: "How much does Calm cost?", a: "Calm Premium costs about $70 per year. Premium is required to get real value, because the free tier is thin and most of the library, including Sleep Stories and soundscapes, sits behind the subscription. Its interface is the most polished in the category." },
    { q: "What are the downsides of Calm?", a: "Calm's free tier is thin, so Premium is required to get real value. It focuses more on relaxation than rigorous meditation instruction and is lighter on structured, progressive courses than teaching-focused apps. Its strength is sleep and relaxation content." },
    { q: "Calm vs Balance: which is better?", a: "Calm is better for sleep and relaxation; Balance is better for an adaptive meditation plan. Calm offers Sleep Stories, soundscapes and a larger library, while Balance personalises a course-style plan and offers a 12-month free trial." },
  ],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default calm
