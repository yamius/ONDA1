import type { ToolReview } from './types'

const sleepscore: ToolReview = {
  slug: 'sleepscore',
  name: 'SleepScore',
  brand: 'SleepScore Labs',
  category: 'sleep-app',
  productType: 'Sleep tracking app',
  description:
    'ONDA review of SleepScore — a research-led, contact-free sleep tracker that turns data into recommendations. Scored on tracking, science and insights.',
  verdict:
    'A research-led, contact-free tracker — the strongest here at turning your sleep data into something to actually act on.',
  summary:
    'SleepScore comes from a research-oriented company and it shows. It tracks without contact, breaks the night into dozens of parameters, and turns that into personalised recommendations rather than just a number — the strongest mainstream tracker for telling you what to change.',
  overallScore: 7.1,
  scores: [
    { criterionId: 'tracking-accuracy', score: 8.0, note: 'Contact-free sonar tracking through the phone speaker and microphone — a clever, well-regarded approach.' },
    { criterionId: 'wind-down-content', score: 5.5, note: 'Light — some content, but the focus is measurement and advice.' },
    { criterionId: 'sleep-science', score: 8.0, note: 'Built by a research-oriented company; the night is broken into dozens of measured parameters.' },
    { criterionId: 'insights', score: 8.5, note: 'Its standout — personalised, science-led recommendations, not just a score.' },
    { criterionId: 'app-experience', score: 7.0, note: 'Clear enough, if less polished than Sleep Cycle.' },
    { criterionId: 'free-tier', score: 6.0, note: 'A free tier exists, but the useful analysis and history need Premium.' },
    { criterionId: 'value', score: 6.5, note: 'Around 50 USD a year for the full experience.' },
  ],
  pros: [
    'Contact-free tracking — nothing to wear or charge',
    'The strongest, most actionable recommendations here',
    'Research-led, with dozens of measured parameters',
    'Solid tracking accuracy for a phone-based app',
  ],
  cons: [
    'Phone-based sonar is still an estimate, not wearable-grade',
    'Wind-down content is light',
    'The useful analysis sits behind Premium',
    'Less polished than Sleep Cycle',
  ],
  bestFor: 'Best for a tracker that turns sleep data into concrete, science-led recommendations.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 50, note: 'per year (Premium); a free tier available', asOf: '2026-05-16' },
  link: 'https://www.sleepscore.com',
  linkType: 'official',
  content: `## Where it leads

SleepScore comes from a research-oriented company, and it shows. It tracks without contact — using sonar through the phone speaker and microphone — breaks the night into dozens of parameters, and, crucially, turns that into personalised recommendations rather than just a number. Of the mainstream trackers here, it is the strongest at telling you what to actually change.

## Where it falls short

The contact-free sonar approach is clever but still a phone-based estimate, not wearable-grade. Wind-down content is light, and the genuinely useful analysis and history sit behind the paid plan.

## Who it is for

Choose SleepScore if you want a tracker that does something with the data — concrete, science-led recommendations — and you would rather not wear anything to bed. If you want the deepest raw tracking, a wearable-paired app like Pillow or AutoSleep goes further.

---

## Background reading

The sleep biology behind what these apps measure and the protocols they support.

- [Protocol: the circadian hard reset](/articles/protocol-circadian-hard-reset) — how to actually shift the rhythm when you have to
- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep) — why audio-paired sleep onset works
- [Nightly flush: the glymphatic system](/articles/nightly-flush-glymphatic-neural-cache) — why deep sleep is the metabolic window of the brain
`,
  references: [
    { label: 'SleepScore — official site', url: 'https://www.sleepscore.com' },
    { label: 'Sleep tracking app validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sleep+tracking+app+validation' },
  ],
  relatedSlugs: ['sleep-cycle', 'pillow', 'sleep-as-android'],
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
}

export default sleepscore
