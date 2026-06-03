/**
 * Daily water intake estimate.
 *
 * Baseline from bodyweight (~35 ml/kg for adults — a common clinical
 * rule of thumb that lands close to EFSA/IOM total-water adequacy once
 * food water is accounted for), then additive adjustments for exercise,
 * hot climate and high caffeine/alcohol intake. Total water includes
 * fluid from food (~20%), so the drinking target is ~80% of total.
 *
 * Educational estimate, not medical advice. Thirst and urine colour remain
 * the best day-to-day guides; some conditions require fluid restriction.
 */

export interface WaterInput {
  kg: number
  exerciseMin: number // minutes of exercise today
  hotClimate: boolean
  highCaffeine: boolean // > ~3 caffeinated/alcoholic drinks
}

export interface WaterResult {
  totalMl: number // total water need
  drinkMl: number // target from drinks (≈80% of total)
  glasses: number // 250 ml glasses
  baselineMl: number
  exerciseMl: number
  climateMl: number
}

const ML_PER_KG = 35
const EXERCISE_ML_PER_30MIN = 350
const CLIMATE_ML = 500
const CAFFEINE_ML = 300
const FOOD_WATER_FRACTION = 0.2
const GLASS_ML = 250

export function computeWater(input: WaterInput): WaterResult {
  const baselineMl = Math.round(input.kg * ML_PER_KG)
  const exerciseMl = Math.round((Math.max(0, input.exerciseMin) / 30) * EXERCISE_ML_PER_30MIN)
  const climateMl = (input.hotClimate ? CLIMATE_ML : 0) + (input.highCaffeine ? CAFFEINE_ML : 0)
  const totalMl = baselineMl + exerciseMl + climateMl
  const drinkMl = Math.round((totalMl * (1 - FOOD_WATER_FRACTION)) / 50) * 50
  const glasses = Math.round(drinkMl / GLASS_ML)
  return { totalMl, drinkMl, glasses, baselineMl, exerciseMl, climateMl }
}

export const WATER_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How much water should I drink a day?',
    a: 'A practical baseline is about 35 ml per kg of bodyweight — roughly 2.4 litres for a 70 kg adult — then add more for exercise, heat and high caffeine or alcohol intake. Because about 20% of your water comes from food, the target from drinks is a little lower than your total water need. The “8 glasses a day” rule is a reasonable average but ignores your size and activity.',
  },
  {
    q: 'Does coffee and tea count toward hydration?',
    a: 'Yes. The mild diuretic effect of normal coffee or tea intake is more than offset by the water they contain, so they count toward your daily fluid. This tool adds a small extra allowance only when intake is high (several caffeinated or alcoholic drinks), since alcohol in particular is genuinely dehydrating.',
  },
  {
    q: 'How do I know if I am properly hydrated?',
    a: 'Urine colour is the simplest real-time gauge: pale straw means well hydrated, dark yellow means drink more. Thirst is also a reliable signal for healthy adults. Persistent dark urine, headaches or fatigue can indicate under-hydration; very frequent clear urine can mean you are overdoing it.',
  },
  {
    q: 'Can you drink too much water?',
    a: 'Yes, though it is uncommon. Drinking very large volumes in a short time — especially during endurance events — can dilute blood sodium (hyponatraemia), which is dangerous. Spread intake across the day, and during long or hot training sessions include electrolytes rather than water alone.',
  },
  {
    q: 'How much extra water do I need when exercising?',
    a: 'Roughly 350–700 ml per hour of exercise, more in heat or for heavy sweaters. This tool adds about 350 ml per 30 minutes of activity. For sessions over an hour, or anything in the heat, pair the water with sodium and other electrolytes to replace what you lose in sweat.',
  },
]
