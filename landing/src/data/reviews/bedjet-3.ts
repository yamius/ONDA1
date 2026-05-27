import type { ToolReview } from './types'

const bedjet3: ToolReview = {
  slug: 'bedjet-3',
  name: 'BedJet 3',
  brand: 'BedJet',
  category: 'sleep-climate',
  productType: 'Air-flow climate system (under-sheet)',
  description:
    'ONDA review of the BedJet 3 — the air-flow sleep-climate system using ducted air under the sheet instead of water.',
  verdict:
    'The air-flow alternative to water-cooled systems — no water management, more affordable, less rigorous temperature control.',
  summary:
    'BedJet 3 is the air-flow alternative to water-cooled sleep climate. A fan unit pushes heated or cooled air through a duct under the sheet. No water-tank maintenance, cheaper than Eight Sleep or Sleepme premium tiers, and easier to install — but less rigorous temperature control and less effective in heavy ambient heat.',
  overallScore: 7.0,
  scores: [
    { criterionId: 'climate-range', score: 7.0, note: 'Air-flow climate — effective for warming, less aggressive cooling than water systems. Best for mild-to-moderate climate intervention rather than peak summer.' },
    { criterionId: 'build', score: 8.0, note: 'Fan unit + air duct. No water tank, no pad. Multi-year BedJet brand reliability solid. 2-year warranty.' },
    { criterionId: 'app-tracking', score: 6.5, note: 'BedJet app for temperature schedules; no sleep or HRV tracking. Apple Watch integration limited.' },
    { criterionId: 'form-factor', score: 8.5, note: 'No water tank, no pad — fan unit sits under bed, ducts air through bed-foot port. Easiest install in the category. Dual-zone optional with two units.' },
    { criterionId: 'subscription', score: 9.5, note: 'No subscription required.' },
    { criterionId: 'value', score: 8.0, note: '$500-700 hardware. Most affordable serious sleep-climate option.' },
  ],
  pros: [
    'No water management — easiest install in the category',
    'Cheapest serious sleep-climate option',
    'Effective heating (faster warm-up than water systems)',
    'No subscription required',
  ],
  cons: [
    'Less aggressive cooling than water systems in peak heat',
    'No sleep tracking or HRV',
    'Fan noise audible (~40 dB at moderate intensity)',
    'Single-zone unless you buy two units',
  ],
  bestFor: 'Best for users wanting affordable sleep climate without water-tank maintenance — and for whom mild climate intervention is enough.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — scored from BedJet product documentation and independent 2026 reviews. Not hands-on tested by ONDA.',
  price: { usd: 600, note: 'single unit; dual-zone with two units', asOf: '2026-05-25' },
  link: 'https://bedjet.com/',
  linkType: 'official',
  content: `## Where it leads

BedJet 3 is the air-flow alternative in a category dominated by water-cooled systems. The fan unit pushes heated or cooled air through a duct that runs under the sheet — no water tank to refill, no pad to install, no subscription. At $500-700 it is the most affordable serious sleep-climate option.

## Where it falls short

Air-flow cools less aggressively than water-cooled systems. In peak summer heat with high humidity, BedJet noticeably lags Eight Sleep and ChiliPad. Fan noise is audible. Single-zone in base configuration.

## Who it is for

Choose BedJet 3 if you want affordable sleep climate without water management — and your climate needs are moderate. For aggressive cooling in peak heat, water-cooled (ChiliPad, Eight Sleep). For tracking, Eight Sleep.

---

## Background reading

The biology of why bed-temperature regulation drives sleep depth and recovery.

- [Phase-locked acoustic sleep](/articles/phase-locked-acoustic-sleep) — cooling pairs with audio entrainment for faster sleep onset
- [Nightly flush: the glymphatic system](/articles/nightly-flush-glymphatic-neural-cache) — why deeper sleep stages from cooling drive brain cleanup
- [Glymphatic flush: clearing the neural cache](/articles/glymphatic-flush-clearing-neural-cache) — the metabolic-window benefit cooler sleep amplifies
`,
  references: [
    { label: 'BedJet — official site', url: 'https://bedjet.com/' },
  ],
  relatedSlugs: ['chilipad-cube', 'ooler-sleep-system', 'eight-sleep-pod-cover-pro'],
  publishOn: '2026-06-15',
  datePublished: '2026-06-15',
  dateModified: '2026-06-15',
}

export default bedjet3
