import type { Article } from './types'

/**
 * One-rep max — companion guide for /tools/one-rep-max.
 * Targets "how to calculate one rep max / 1RM". Reuses verified sources.
 */
const article: Article = {
  slug: 'how-to-calculate-one-rep-max',
  title: 'How to Calculate Your One-Rep Max (1RM)',
  seoTitle: 'How to Calculate Your One-Rep Max (1RM) | ONDA Life',
  description:
    'How to estimate your one-rep max without testing it: the Epley and Brzycki formulas, why a heavy set of ≤6 reps is most accurate, and how to program from it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['metabolism', 'metabolic-flexibility', 'mitochondria', 'atp'],
  introStyle: 'gold',
  image: '/images/tools/one-rep-max.png',
  imageAlt:
    'How to calculate your one-rep max: the Epley and Brzycki equations from a sub-maximal set, most accurate at 6 reps or fewer, plus a %1RM training table.',
  imageTitle: '[STRENGTH_CEILING]: Estimating 1RM from a hard set, without a max attempt.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Plug in a hard set and get your 1RM plus a full training-load table.',
    link: '/tools/one-rep-max',
    linkText: 'One-Rep Max Calculator →',
  },
  howToSteps: [
    { name: 'Pick a hard set of ≤6 reps', text: 'Use a recent set where the last rep was close to failure with good form — 2–6 reps is the accurate range.', protocolId: '1rm-set' },
    { name: 'Apply a formula', text: 'Epley: 1RM = weight × (1 + reps/30). Brzycki: 1RM = weight × 36/(37 − reps). Average the two.', protocolId: '1rm-formula' },
    { name: 'Build your training loads', text: 'Strength ≈ 85–95% for low reps; hypertrophy ≈ 67–80% for moderate reps; scale off your estimated 1RM.', protocolId: '1rm-loads' },
    { name: 'Autoregulate with RPE/RIR', text: 'Readiness varies day to day — use reps-in-reserve to adjust rather than chasing the exact percentage.', protocolId: '1rm-rpe' },
  ],
  content: `
## [ ESTIMATING THE STRENGTH CEILING ]

> "Your one-rep max (1RM) is the most you can lift once — the reference point all training percentages are built on. You don’t have to (and usually shouldn’t) test it directly: a hard set of a few reps predicts it well. In the ONDA Biocomputer model, 1RM is the rated ceiling of the system; estimating it lets you program load precisely without redlining the hardware every week."

---

## Section 1: The formulas

Two long-standing equations estimate 1RM from a sub-maximal set:

- **Epley:** 1RM = weight × (1 + reps / 30)
- **Brzycki (1993):** 1RM = weight × 36 / (37 − reps)

They agree closely at low reps and diverge as reps climb, so reporting both (and their average) is sensible. Example: 100 kg × 5 reps → Epley ≈ 117 kg, Brzycki ≈ 113 kg. The [One-Rep Max Calculator](/tools/one-rep-max) runs both and builds a full %1RM load table.

---

## Section 2: Why a heavy set of ≤6 reps is best

A validation study found these equations correlate strongly with measured 1RM (r > 0.95) but are **most accurate at roughly six reps or fewer**, drifting as reps rise because endurance and technique start to dominate the result (LeSuer 1997). A genuinely hard triple predicts your max far better than a light set of fifteen. So: use a recent, close-to-failure set in the 2–6 rep range, with clean form.

---

## Section 3: Programming from it

> **The Hack:** Set training loads as a percentage of your estimated 1RM — ~85–95% for low-rep strength work, ~67–80% for moderate-rep hypertrophy — and round to the nearest plate.

**The Logic:** Percentages let you progress systematically. But real readiness fluctuates with sleep, stress and fatigue, so autoregulate with RPE/RIR (reps in reserve) rather than treating the percentage as sacred. Re-estimate every few weeks as you get stronger.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Training log
> METRIC: Estimated 1RM trending up across mesocycles
> STATUS: STRENGTH_CEILING_RISING

---

Educational estimate, not coaching or medical advice. Testing a true 1RM carries injury and fatigue risk — warm up thoroughly and use a spotter/safeties if you do.
`,
}

export default [article]
