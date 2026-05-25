import type { ToolReview } from './types'

const autosleep: ToolReview = {
  slug: 'autosleep',
  name: 'AutoSleep',
  brand: 'Tantsissa',
  category: 'sleep-app',
  productType: 'Sleep tracking app',
  description:
    'ONDA review of AutoSleep — the purist Apple Watch sleep tracker, a one-time purchase with no subscription. Scored on tracking, insights and value.',
  verdict:
    'The purist Apple Watch sleep tracker — accurate, automatic and subscription-free — but it only measures sleep, it does not help you get it.',
  summary:
    'AutoSleep is the purist Apple Watch sleep tracker. It tracks automatically and accurately, it is detailed, and it is a rare one-time purchase with no subscription. The trade-off is total focus: it measures sleep and does nothing else — no wind-down content at all.',
  overallScore: 6.5,
  scores: [
    { criterionId: 'tracking-accuracy', score: 8.5, note: 'Automatic, detailed Apple Watch tracking — accurate, with a devoted following among watch owners.' },
    { criterionId: 'wind-down-content', score: 3.0, note: 'None at all — no sounds, no stories; AutoSleep does not try to help you fall asleep.' },
    { criterionId: 'sleep-science', score: 6.5, note: 'Sound metrics and a "sleep bank" concept, without a distinctive research method.' },
    { criterionId: 'insights', score: 8.0, note: 'Detailed analysis and trends — readiness, debt and consistency — for those who want the data.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Powerful but dense — it rewards setup more than the polished mainstream apps.' },
    { criterionId: 'free-tier', score: 4.0, note: 'No real free tier — but it is a cheap one-time purchase, not a subscription.' },
    { criterionId: 'value', score: 9.0, note: 'A few dollars, once, with no subscription — exceptional value in a category full of recurring fees.' },
  ],
  pros: [
    'Accurate, automatic Apple Watch tracking',
    'A one-time purchase — no subscription',
    'Detailed analysis and trends',
    'No buttons — it just tracks',
  ],
  cons: [
    'No wind-down content whatsoever',
    'iOS and Apple Watch only',
    'A dense interface that rewards setup',
    'Measures sleep but does nothing to improve it',
  ],
  bestFor: 'Best for Apple Watch owners who want accurate sleep data and no subscription.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 6, note: 'one-time; no subscription; iOS and Apple Watch only', asOf: '2026-05-16' },
  link: 'https://www.tantsissa.com',
  linkType: 'official',
  content: `## Where it leads

AutoSleep is the purist's Apple Watch sleep tracker. It tracks automatically — no buttons, no "I'm going to bed" — and it is detailed and accurate, with a devoted following among Apple Watch owners. Best of all, it is a one-time purchase: a few dollars, once, with no subscription at all, which in a category full of recurring fees is rare.

## Where it falls short

It is tracking and nothing else. There is no wind-down content whatsoever — no sounds, no stories — so it does nothing to help you fall asleep, only to measure once you do. It is iOS and Apple Watch only, the interface is dense, and there is no real free tier.

## Who it is for

Choose AutoSleep if you own an Apple Watch, you only want data, and you are tired of subscriptions. If you want help getting to sleep, or you are on Android, it is the wrong app.

---

## Background reading

The sleep biology behind what these apps measure and the protocols they support.

- [Circadian reset: mastering light](/articles/circadian-reset-mastering-light) — why light timing dominates sleep quality more than anything else
- [Circadian lighting and dark therapy](/articles/circadian-lighting-dark-therapy) — the protocol layer that compounds with tracking
- [Ancestral sync and circadian anchors](/articles/ancestral-sync-circadian-anchors) — the inputs that keep circadian timing stable across travel and shift work
`,
  references: [
    { label: 'AutoSleep (Tantsissa) — developer site', url: 'https://www.tantsissa.com' },
    { label: 'Sleep tracking app validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sleep+tracking+app+validation' },
  ],
  relatedSlugs: ['pillow', 'sleep-cycle', 'sleep-as-android'],
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
}

export default autosleep
