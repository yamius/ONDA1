/**
 * TDEE (Total Daily Energy Expenditure) + calorie targets.
 *
 * BMR via the Mifflin–St Jeor equation (1990) — the most accurate of the
 * common predictive formulas for the general population:
 *   men:   BMR = 10·kg + 6.25·cm − 5·age + 5
 *   women: BMR = 10·kg + 6.25·cm − 5·age − 161
 * TDEE = BMR × activity multiplier. Goal targets shift TDEE by a sensible
 * deficit/surplus. Educational estimate, not medical or dietetic advice.
 */

export type Sex = 'male' | 'female'

export interface ActivityLevel {
  id: string
  label: string
  multiplier: number
  note: string
}

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { id: 'sedentary', label: 'Sedentary', multiplier: 1.2, note: 'desk job, little or no exercise' },
  { id: 'light', label: 'Lightly active', multiplier: 1.375, note: 'light exercise 1–3 days/week' },
  { id: 'moderate', label: 'Moderately active', multiplier: 1.55, note: 'moderate exercise 3–5 days/week' },
  { id: 'very', label: 'Very active', multiplier: 1.725, note: 'hard exercise 6–7 days/week' },
  { id: 'extra', label: 'Extra active', multiplier: 1.9, note: 'physical job or 2× daily training' },
]

export interface CalorieGoal {
  id: string
  label: string
  /** Multiplier applied to TDEE. */
  factor: number
  note: string
}

export const CALORIE_GOALS: CalorieGoal[] = [
  { id: 'lose-fast', label: 'Lose weight (~0.75 kg/wk)', factor: 0.79, note: '≈ 20% deficit' },
  { id: 'lose', label: 'Lose weight (~0.5 kg/wk)', factor: 0.85, note: '≈ 15% deficit' },
  { id: 'maintain', label: 'Maintain weight', factor: 1.0, note: 'energy balance' },
  { id: 'gain', label: 'Lean bulk (~0.25 kg/wk)', factor: 1.1, note: '≈ 10% surplus' },
  { id: 'gain-fast', label: 'Gain weight (~0.5 kg/wk)', factor: 1.2, note: '≈ 20% surplus' },
]

export interface TdeeResult {
  bmr: number
  tdee: number
  goalCalories: number
  proteinG: number
  fatG: number
  carbG: number
}

/** Mifflin–St Jeor BMR in kcal/day. */
export function computeBmr(kg: number, cm: number, age: number, sex: Sex): number {
  const base = 10 * kg + 6.25 * cm - 5 * age
  return Math.round(sex === 'male' ? base + 5 : base - 161)
}

export function computeTdee(
  kg: number,
  cm: number,
  age: number,
  sex: Sex,
  activity: ActivityLevel,
  goal: CalorieGoal,
): TdeeResult {
  const bmr = computeBmr(kg, cm, age, sex)
  const tdee = Math.round(bmr * activity.multiplier)
  const goalCalories = Math.round((tdee * goal.factor) / 10) * 10

  // A balanced macro split: protein 1.8 g/kg, fat 25% of calories, rest carbs.
  const proteinG = Math.round(1.8 * kg)
  const fatG = Math.round((goalCalories * 0.25) / 9)
  const carbCals = goalCalories - proteinG * 4 - fatG * 9
  const carbG = Math.max(0, Math.round(carbCals / 4))

  return { bmr, tdee, goalCalories, proteinG, fatG, carbG }
}

export const TDEE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is TDEE?',
    a: 'TDEE — Total Daily Energy Expenditure — is the total number of calories you burn in a day, including your resting metabolism (BMR), the energy used to digest food, and all movement and exercise. It is the number you eat at to maintain your current weight.',
  },
  {
    q: 'How is TDEE calculated?',
    a: 'This tool first estimates your BMR with the Mifflin–St Jeor equation (the most accurate predictive formula for most people), using your weight, height, age and sex. It then multiplies BMR by an activity factor from 1.2 (sedentary) to 1.9 (extra active) to get your TDEE.',
  },
  {
    q: 'How many calories should I eat to lose weight?',
    a: 'A moderate deficit of 15–20% below your TDEE loses roughly 0.5–0.75 kg per week while protecting muscle and energy. Larger deficits work faster but are harder to sustain and risk muscle loss. The tool calculates each target for you — pick the rate you can actually stick to.',
  },
  {
    q: 'How accurate is the calorie estimate?',
    a: 'Predictive formulas are accurate to within roughly ±10% for most people, but real metabolism varies with body composition, genetics and non-exercise activity (NEAT). Treat the number as a starting point: track your weight for 2–3 weeks and adjust intake up or down based on the actual trend.',
  },
  {
    q: 'Why does the tool also show macros?',
    a: 'Calories drive weight change, but macronutrients drive body composition and how you feel. The split shown sets protein at ~1.8 g/kg (to preserve or build muscle), fat at 25% of calories (for hormones), and the rest as carbs (for training fuel). Adjust to your preferences while keeping protein high.',
  },
]
