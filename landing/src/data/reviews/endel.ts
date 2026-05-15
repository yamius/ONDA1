import type { ToolReview } from './types'

const endel: ToolReview = {
  slug: 'endel',
  name: 'Endel',
  brand: 'Endel',
  category: 'sleep-app',
  productType: 'Sleep audio app',
  description:
    'ONDA review of Endel — an AI app that generates adaptive soundscapes for sleep, focus and relaxation in real time. Scored on wind-down content and value.',
  verdict:
    'An AI soundscape app that adapts its audio to time of day and inputs in real time — beautiful and distinctive, but it plays sound, it does not track sleep.',
  summary:
    'Endel generates soundscapes with an AI engine that adapts in real time to inputs like time of day, weather and — paired with a wearable — heart rate. The result is ambient audio for sleep, focus and relaxation that is genuinely distinctive. It is an audio app, though; it does not track your night.',
  overallScore: 6.4,
  scores: [
    { criterionId: 'tracking-accuracy', score: 2.5, note: 'No real sleep tracking — Endel reads inputs to shape audio, it does not measure your sleep.' },
    { criterionId: 'wind-down-content', score: 8.0, note: 'Adaptive, generative soundscapes for sleep and relaxation — distinctive and well-made.' },
    { criterionId: 'sleep-science', score: 6.5, note: 'Grounded in sound and circadian research; soundscapes shift with time of day.' },
    { criterionId: 'insights', score: 2.5, note: 'None — Endel produces audio, not analysis.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Beautifully designed and calm, if light on options.' },
    { criterionId: 'free-tier', score: 5.0, note: 'A short trial then a subscription — little usable for free.' },
    { criterionId: 'value', score: 6.5, note: 'Around 60 USD a year for a single-purpose audio app.' },
  ],
  pros: [
    'Adaptive AI soundscapes unlike a fixed playlist',
    'Audio shifts with time of day and other inputs',
    'Beautifully and calmly designed',
    'Covers focus and relaxation as well as sleep',
  ],
  cons: [
    'No sleep tracking',
    'No insights or analytics',
    'Thin free tier',
    'A subscription for a single-purpose app',
  ],
  bestFor: 'Best for anyone who wants distinctive, adaptive ambient audio to sleep to.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 60, note: 'per year; a short trial only', asOf: '2026-05-16' },
  link: 'https://endel.io',
  linkType: 'official',
  content: `## Where it leads

Endel generates its soundscapes rather than playing fixed tracks. An AI engine adapts the audio in real time to inputs — time of day, weather, and, paired with a wearable, heart rate — so a sleep soundscape at midnight is not the same as one at dusk. It is distinctive, beautifully designed, and covers focus and relaxation as well as sleep.

## Where it falls short

It is an audio app, full stop. Endel reads inputs to shape sound; it does not track or measure your sleep, and there are no insights to review. The free tier is a short trial, so the experience effectively requires a subscription.

## Who it is for

Choose Endel if you want adaptive, generative ambient audio and the aesthetics matter to you. If you want to know how you actually slept, pair it with a tracker — or choose one instead.`,
  references: [
    { label: 'Endel — official site', url: 'https://endel.io' },
    { label: 'Sleep tracking app validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sleep+tracking+app+validation' },
  ],
  relatedSlugs: ['pzizz', 'bettersleep', 'sleep-cycle'],
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
}

export default endel
