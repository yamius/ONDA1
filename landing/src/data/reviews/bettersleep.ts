import type { ToolReview } from './types'

const bettersleep: ToolReview = {
  slug: 'bettersleep',
  name: 'BetterSleep',
  brand: 'BetterSleep',
  category: 'sleep-app',
  productType: 'Sleep tracking app',
  description:
    'ONDA review of BetterSleep — the deepest wind-down content library of any sleep app, with soundscapes, SleepTales and tracking. Scored on content and value.',
  verdict:
    'The richest wind-down library of any sleep app — soundscapes, stories and meditations — with light tracking bolted on; a relaxation app first, a tracker second.',
  summary:
    'BetterSleep leads on the thing most sleep apps treat as an afterthought: getting you to sleep. Its content library — mixable soundscapes, SleepTales, meditations and breathing — is the deepest here. It also tracks your night, but tracking is the lighter half of the app.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'tracking-accuracy', score: 5.5, note: 'Phone-based sound and movement tracking — present, but a secondary feature, not the focus.' },
    { criterionId: 'wind-down-content', score: 9.0, note: 'The deepest wind-down library here — mixable soundscapes, SleepTales, meditations and breathing.' },
    { criterionId: 'sleep-science', score: 6.5, note: 'Sound sleep-hygiene content and routines, without a distinctive clinical method.' },
    { criterionId: 'insights', score: 6.0, note: 'Basic nightly stats — adequate, not the reason to choose it.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Polished and pleasant, though the sheer volume of content can overwhelm.' },
    { criterionId: 'free-tier', score: 6.0, note: 'A free tier exists; the full library and tracking need the subscription.' },
    { criterionId: 'value', score: 7.0, note: 'Around 60 USD a year — fair for a library this large.' },
  ],
  pros: [
    'The deepest wind-down content library here',
    'Mixable soundscapes you can tune to taste',
    'SleepTales, meditations and breathing in one app',
    'Polished and pleasant to use',
  ],
  cons: [
    'Tracking is light — not a serious measurement tool',
    'The volume of content can overwhelm',
    'Full library needs a subscription',
    'No distinctive clinical sleep method',
  ],
  bestFor: 'Best for anyone whose main problem is falling asleep, not measuring it.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 60, note: 'per year (Premium); a free tier available', asOf: '2026-05-16' },
  link: 'https://www.bettersleep.com',
  linkType: 'official',
  content: `## Where it leads

BetterSleep is built around the part of the night most trackers ignore — winding down. Its content library is the deepest of any sleep app here: mixable soundscapes you tune yourself, SleepTales, guided meditations and breathing exercises. If your problem is lying awake rather than not knowing your sleep stats, this is the app that addresses it directly.

## Where it falls short

Tracking exists but is the lighter half of the app — phone-based, basic, not a serious measurement tool. The volume of content can be overwhelming, and the full library sits behind a subscription. There is no distinctive clinical method, just well-made relaxation content.

## Who it is for

Choose BetterSleep if you mainly need help falling asleep and want the richest possible library of sounds and stories to do it. If you want accurate tracking or a clinical program, a dedicated tracker or Sleepio will serve you better.`,
  references: [
    { label: 'BetterSleep — official site', url: 'https://www.bettersleep.com' },
    { label: 'Sleep tracking app validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sleep+tracking+app+validation' },
  ],
  relatedSlugs: ['pzizz', 'endel', 'sleep-cycle'],
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
}

export default bettersleep
