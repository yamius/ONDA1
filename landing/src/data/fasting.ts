/**
 * Intermittent-fasting window calculator.
 *
 * Given a protocol (fasting:eating split) and the time you open your eating
 * window, compute when the window closes and when the next fast ends, plus
 * a rough timeline of the metabolic phases that unfold across a fast.
 *
 * Phase timings are approximate and vary with the person, the last meal and
 * activity. Educational only — fasting is not appropriate for everyone
 * (pregnancy, history of disordered eating, some medications/conditions).
 */

export interface FastingProtocol {
  id: string
  label: string
  fastHours: number
  eatHours: number
  note: string
}

export const FASTING_PROTOCOLS: FastingProtocol[] = [
  { id: '14-10', label: '14:10', fastHours: 14, eatHours: 10, note: 'Gentle entry point — 14 h fast, 10 h eating' },
  { id: '16-8', label: '16:8 (Leangains)', fastHours: 16, eatHours: 8, note: 'The most popular split — 16 h fast, 8 h eating' },
  { id: '18-6', label: '18:6', fastHours: 18, eatHours: 6, note: 'Tighter window for more time in the fasted state' },
  { id: '20-4', label: '20:4 (Warrior)', fastHours: 20, eatHours: 4, note: 'One large meal plus a small snack' },
  { id: 'omad', label: 'OMAD (23:1)', fastHours: 23, eatHours: 1, note: 'One meal a day — advanced, hard to hit nutrient needs' },
]

export interface FastingResult {
  eatStart: string // HH:MM
  eatEnd: string // HH:MM (window closes)
  nextFastEnd: string // = eatStart next day
}

/** Parse "HH:MM" → minutes since midnight, or null. */
export function parseTime(value: string): number | null {
  const m = value.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (h < 0 || h > 23 || min < 0 || min > 59) return null
  return h * 60 + min
}

function fmt(totalMin: number): string {
  const m = ((totalMin % 1440) + 1440) % 1440
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

export function computeFasting(eatStartMin: number, protocol: FastingProtocol): FastingResult {
  const eatEnd = eatStartMin + protocol.eatHours * 60
  return {
    eatStart: fmt(eatStartMin),
    eatEnd: fmt(eatEnd),
    nextFastEnd: fmt(eatStartMin),
  }
}

export interface FastPhase {
  fromH: number
  label: string
  detail: string
}

/** Metabolic timeline measured from the last meal (start of the fast). */
export const FAST_PHASES: FastPhase[] = [
  { fromH: 0, label: 'Fed / digesting', detail: 'Blood glucose and insulin rise as the last meal is absorbed.' },
  { fromH: 4, label: 'Post-absorptive', detail: 'Insulin falls; the body starts drawing on stored glycogen for fuel.' },
  { fromH: 12, label: 'Fat-burning begins', detail: 'Glycogen runs low; lipolysis ramps up and ketone production starts.' },
  { fromH: 16, label: 'Ketosis & autophagy', detail: 'Ketones become a major fuel; cellular clean-up (autophagy) increases.' },
  { fromH: 24, label: 'Deeper ketosis', detail: 'Growth-hormone rises; autophagy and fat oxidation continue to climb.' },
]

export const FASTING_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is 16:8 intermittent fasting?',
    a: '16:8 means you fast for 16 hours and eat all your food within an 8-hour window — for example, eating between noon and 8 pm, then fasting until noon the next day. It is the most popular protocol because it fits naturally around sleep and a skipped breakfast, and is easy to sustain.',
  },
  {
    q: 'When does fat burning and ketosis start during a fast?',
    a: 'Insulin starts falling a few hours after your last meal, and the body shifts toward burning fat once liver glycogen runs low — typically around 12 hours in. Meaningful ketosis and increased autophagy generally build from roughly 16 hours onward, though the exact timing depends on your last meal, activity and metabolism.',
  },
  {
    q: 'Can I drink anything while fasting?',
    a: 'Yes — water, black coffee, plain tea and other zero-calorie drinks are fine and do not break a fast. Anything with calories (milk, sugar, juice, most "diet" additions beyond trace amounts) raises insulin and ends the fasted state. Staying hydrated and getting electrolytes helps with energy and headaches.',
  },
  {
    q: 'Which fasting window is best for beginners?',
    a: 'Start with 14:10 or 16:8. They deliver most of the metabolic benefit while being easy to live with — usually just delaying breakfast and not snacking after dinner. Tighter windows like 20:4 or OMAD push more time in the fasted state but make it harder to eat enough protein and micronutrients, so progress to them gradually if at all.',
  },
  {
    q: 'Is intermittent fasting safe for everyone?',
    a: 'No. Fasting is not recommended during pregnancy or breastfeeding, for people with a history of disordered eating, for type 1 diabetics or those on glucose-lowering medication without medical supervision, and for some other conditions. If you take regular medication or have a health condition, check with your clinician before starting.',
  },
]
