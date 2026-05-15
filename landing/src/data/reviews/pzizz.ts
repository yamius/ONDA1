import type { ToolReview } from './types'

const pzizz: ToolReview = {
  slug: 'pzizz',
  name: 'Pzizz',
  brand: 'Pzizz',
  category: 'sleep-app',
  productType: 'Sleep audio app',
  description:
    'ONDA review of Pzizz — a focused sleep and nap audio app whose algorithm generates a fresh soundscape every session. Scored on wind-down content and value.',
  verdict:
    'A focused sleep-audio app — its algorithm builds a fresh soundscape every night so it never gets stale — but it does one thing only and does not track.',
  summary:
    'Pzizz does one thing: it plays you to sleep. Its "dreamscape" algorithm generates a unique mix of music, voice and effects each session, so the audio never becomes too familiar to work. It does not track sleep and has no analytics — it is a pure fall-asleep aid.',
  overallScore: 6.6,
  scores: [
    { criterionId: 'tracking-accuracy', score: 2.0, note: 'No tracking at all — Pzizz plays audio, it does not measure your night.' },
    { criterionId: 'wind-down-content', score: 8.5, note: 'Its whole point — an algorithm that generates a fresh sleep or nap soundscape every session.' },
    { criterionId: 'sleep-science', score: 6.5, note: 'Built on noise, music and voice research; modules for sleep, naps and focus.' },
    { criterionId: 'insights', score: 2.5, note: 'None — there is nothing to analyse, by design.' },
    { criterionId: 'app-experience', score: 8.0, note: 'Simple and uncluttered — pick a module, set a timer, sleep.' },
    { criterionId: 'free-tier', score: 5.5, note: 'A limited free version; the full module set needs the subscription.' },
    { criterionId: 'value', score: 7.0, note: 'Around 70 USD a year, or a one-time unlock — reasonable for a tool you use nightly.' },
  ],
  pros: [
    'A fresh, non-repeating soundscape every session',
    'Dedicated nap and focus modules, not just sleep',
    'Simple, uncluttered and quick to start',
    'A one-time unlock option exists',
  ],
  cons: [
    'No sleep tracking whatsoever',
    'No insights or analytics — by design',
    'Does one thing only',
    'Full module set needs a subscription',
  ],
  bestFor: 'Best for anyone who just wants to be played to sleep, with no tracking.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 70, note: 'per year, or a one-time unlock; a limited free version', asOf: '2026-05-16' },
  link: 'https://pzizz.com',
  linkType: 'official',
  content: `## Where it leads

Pzizz does one thing and does it well: it plays you to sleep. Its "dreamscape" algorithm builds a unique mix of music, voiceover and sound effects every session, so the audio never gets familiar enough to stop working — the usual failure mode of a fixed playlist. Dedicated nap and focus modules extend the same idea to daytime. The app is refreshingly simple: pick a module, set a timer, sleep.

## Where it falls short

It is a fall-asleep aid and nothing else. There is no tracking, no analytics, no insight into your night — by design, but it means Pzizz cannot tell you whether anything is improving. The full module set needs a subscription.

## Who it is for

Choose Pzizz if you simply want to be played to sleep and have no interest in tracking. If you want to measure your night, or want a broader relaxation library, a tracker or BetterSleep is the better fit.`,
  references: [
    { label: 'Pzizz — official site', url: 'https://pzizz.com' },
    { label: 'Sleep tracking app validation studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=sleep+tracking+app+validation' },
  ],
  relatedSlugs: ['endel', 'bettersleep', 'sleepio'],
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
}

export default pzizz
