import type { Article } from './types'

/**
 * TDEE / maintenance calories — companion guide for /tools/tdee.
 * Targets "how to calculate maintenance calories / TDEE". Reuses verified sources.
 */
const article: Article = {
  slug: 'how-to-calculate-maintenance-calories',
  title: 'How to Calculate Your Maintenance Calories (TDEE)',
  seoTitle: 'How to Calculate Maintenance Calories (TDEE) | ONDA Life',
  description:
    'How to find your maintenance calories: the Mifflin–St Jeor equation, the activity multiplier, and why your real number is the 2–3 week weight trend.',
  category: 'ONDA Protocol',
  relatedSlugs: ['metabolism', 'metabolic-flexibility', 'insulin-sensitivity', 'mitochondria', 'homeostasis'],
  introStyle: 'rose',
  image: '/images/tools/tdee.png',
  imageAlt:
    'How to calculate maintenance calories: Mifflin–St Jeor BMR times an activity multiplier gives TDEE, then verify against your real weight trend.',
  imageTitle: '[ENERGY_BUDGET]: BMR × activity = maintenance — then calibrate to the scale.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Get your maintenance calories and a macro split in one step.',
    link: '/tools/tdee',
    linkText: 'TDEE Calculator →',
  },
  howToSteps: [
    { name: 'Estimate BMR (Mifflin–St Jeor)', text: 'BMR = 10·kg + 6.25·cm − 5·age + 5 (men) or − 161 (women) — the calories you burn at rest.', protocolId: 'tdee-bmr' },
    { name: 'Multiply by your activity level', text: 'BMR × 1.2 (sedentary) to 1.9 (extra active) gives your TDEE — your maintenance calories.', protocolId: 'tdee-activity' },
    { name: 'Set a goal offset', text: 'Eat ~15–20% below TDEE to lose, ~10% above to lean-bulk. Keep protein high either way.', protocolId: 'tdee-goal' },
    { name: 'Calibrate to the scale', text: 'Track weight for 2–3 weeks; if it’s not moving as expected, your true maintenance is the number that holds it steady.', protocolId: 'tdee-calibrate' },
  ],
  content: `
## [ COMPUTING THE ENERGY BUDGET ]

> "Maintenance calories — your Total Daily Energy Expenditure (TDEE) — is the number of calories that keeps your weight exactly where it is. It’s the anchor for every nutrition goal: eat below it to lose fat, above it to gain. In the ONDA Biocomputer model, it’s your daily energy budget — and like any budget, the printed estimate is a starting point you reconcile against reality."

---

## Section 1: The two-step calculation

**Step 1 — BMR.** Your basal metabolic rate is what you’d burn lying in bed all day. The Mifflin–St Jeor equation is the most accurate common predictor (Frankenfield 2005):
- Men: BMR = 10·weight(kg) + 6.25·height(cm) − 5·age + 5
- Women: same, but − 161 instead of + 5

**Step 2 — activity multiplier.** Multiply BMR by a physical-activity level (PAL), from 1.2 (sedentary desk job) to 1.9 (physical job or twice-daily training), per the FAO/WHO/UNU energy-requirement bands. The result is your TDEE.

The [TDEE Calculator](/tools/tdee) does both and adds a macro split — but the equations matter less than what you do with the number.

---

## Section 2: Why the formula is only a starting point

Predictive equations are accurate to roughly **±10%** for most people (Frankenfield 2005) — but real metabolism varies with body composition, genetics, and especially non-exercise activity (NEAT: fidgeting, walking, standing), which can swing daily burn by hundreds of calories. So treat your calculated TDEE as a hypothesis, not a fact.

The real test: eat at your estimated maintenance for 2–3 weeks and watch the trend. If weight is stable, that’s your true maintenance. If it’s drifting, adjust by ~100–150 calories and re-check. The scale is the calibration instrument; the formula just gets you close.

### PROTOCOL: Set, Hold, Adjust

> **The Hack:** Calculate TDEE, eat there (or at your goal offset) consistently for 2–3 weeks, then adjust based on the weekly average weight — not a single day.

**The Logic:** Daily weight swings are mostly water and gut contents. The multi-week average reveals the real energy balance and turns a population estimate into your personal number.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Food log + weekly average weight
> METRIC: Weight stable at maintenance, or trending at the target rate
> STATUS: ENERGY_BUDGET_CALIBRATED

---

Educational estimate, not dietetic or medical advice. Very low intakes, medical conditions or eating-disorder history warrant professional guidance.
`,
}

export default [article]
