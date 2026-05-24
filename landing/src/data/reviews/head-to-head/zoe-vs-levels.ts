import type { HeadToHead } from '../types'

const zoeVsLevels: HeadToHead = {
  slug: 'zoe-vs-levels',
  productASlug: 'zoe',
  productBSlug: 'levels',
  title: 'Zoe vs Levels (2026)',
  description:
    'Zoe vs Levels — side-by-side ONDA comparison of two personalised-nutrition programmes. Multi-biomarker science fusion versus continuous biohacker-grade glucose.',
  intro:
    'Zoe and Levels are the two consumer programmes most often weighed against each other when nutrition is the goal rather than glucose alone. They occupy adjacent shelves: Zoe runs a two-week CGM phase alongside a gut-microbiome test and a blood biomarker panel, then keeps you on personalised food rankings; Levels runs continuous CGM with the deepest meal-impact analysis on the market. The decision is between a multi-biomarker reset and ongoing glucose tracking.',
  winnerSlug: null,
  verdict:
    'They are different products. Zoe for a science-backed nutrition reset combining CGM + microbiome + blood biomarkers. Levels for ongoing glucose insight on the best CGM hardware.',
  bestForA:
    'Choose Zoe if you want personalised nutrition grounded in real science — Tim Spector’s PREDICT studies — fusing CGM, gut microbiome and blood biomarkers into a single food-ranking model.',
  bestForB:
    'Choose Levels if you want continuous CGM as a self-experimentation instrument — the deepest meal-impact engine on Dexcom G7, the most accurate consumer sensor.',
  axes: [
    { name: 'Continuous CGM use', winner: 'b', note: 'Levels runs continuous CGM for as long as you subscribe. Zoe runs CGM for two weeks only — the data feeds the initial ranking model and then ends.' },
    { name: 'Sensor accuracy', winner: 'b', note: 'Levels: Dexcom G7 (MARD ~8.2%). Zoe: Abbott Libre (MARD ~9–11%, older sensor variant). Levels has the more accurate sensor.' },
    { name: 'Multi-biomarker view', winner: 'a', note: 'Zoe is the only programme combining CGM with gut-microbiome stool sampling and blood biomarker panels. Levels is glucose-only.' },
    { name: 'Scientific lineage', winner: 'a', note: 'Zoe runs on the published PREDICT-1/PREDICT-2 studies from King’s College London (Tim Spector). Levels has a credible medical advisory board but no equivalent published trial series.' },
    { name: 'Personalised food rankings', winner: 'a', note: 'Zoe’s personalised food scores are the centrepiece of the programme. Levels surfaces meal impact but does not rank foods against your own physiology long-term.' },
    { name: 'Meal-impact analysis depth', winner: 'b', note: 'Levels has the deeper per-meal analytics — AUC decomposition, food-by-food history, time-in-range. Zoe’s glucose analysis is lighter and ends after two weeks.' },
    { name: 'Raw glucose data export', winner: 'b', note: 'Levels supports raw data export on request. Zoe does not export raw glucose at all.' },
    { name: 'Price (year 1)', winner: 'tie', note: 'Zoe: £300 setup + £60/mo × 12 = ~$1,250/year. Levels: $199/mo × 12 = ~$2,388/year. Zoe is cheaper year 1 but the CGM phase is shorter.' },
  ],
  faq: [
    {
      q: 'Should I pick Zoe or Levels?',
      a: 'They solve different problems. Zoe is a 2-week multi-biomarker nutrition reset that turns into a personalised food-ranking subscription. Levels is ongoing CGM as a self-experimentation instrument. Pick on whether you want a one-time nutrition reset or continuous glucose data.',
    },
    {
      q: 'Is Zoe just a CGM programme?',
      a: 'No — that is the most common misconception. The CGM phase lasts two weeks; the programme is the multi-biomarker model fusing CGM + microbiome + blood biomarkers into personalised food rankings, which you keep through the subscription. If continuous CGM is what you want, Zoe is the wrong shape.',
    },
    {
      q: 'Which has more scientific backing?',
      a: 'Zoe, by a meaningful margin. The PREDICT-1 and PREDICT-2 studies from Tim Spector’s King’s College London group are published in Nature Medicine. Levels has a credible medical advisory board but no equivalent published trial series specific to the programme.',
    },
    {
      q: 'Can I do both Zoe and Levels?',
      a: 'Some users do — Zoe for the initial multi-biomarker reset, Levels for ongoing CGM after. The cost is the trade. For most users one programme is enough; pick on which job is the deciding one.',
    },
  ],
  content: `## The short version

Zoe is a nutrition programme that uses CGM as one input among three; Levels is a CGM programme. The decision is whether you want a one-time multi-biomarker reset or continuous glucose data.

## When Zoe is the right pick

If you want personalised nutrition grounded in real published science — and the two-week CGM phase is enough — Zoe is the right shape. The PREDICT studies and the multi-biomarker model are the reason most users land here. The annual £60/month subscription buys you the food rankings, not new glucose data.

## When Levels is the right pick

If you want CGM as an ongoing instrument — running meal experiments, tracking time-in-range as a daily metric, iterating on glucose curves week by week — Levels is the right shape. The deeper insight engine and the more accurate sensor justify the premium pricing for users who treat the device as a serious tool.`,
  relatedComparisonSlug: 'best-cgm-for-biohackers-2026',
  datePublished: '2026-05-22',
  dateModified: '2026-05-22',
}

export default zoeVsLevels
