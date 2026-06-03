/**
 * Jet-lag light-timing planner.
 *
 * Light is the strongest zeitgeber for the circadian clock. The direction of
 * the shift depends on timing relative to your core-body-temperature minimum
 * (CBTmin), which sits roughly 2 hours before your habitual wake time:
 *   • Light AFTER CBTmin  → phase ADVANCE (clock earlier) — needed flying EAST
 *   • Light BEFORE CBTmin → phase DELAY  (clock later)   — needed flying WEST
 *
 * The clock advances ~1 h/day and delays ~1.5 h/day, so westward adaptation
 * is faster. For large eastward trips (>8 zones) the body often delays "the
 * long way round" instead; we flag that case.
 *
 * Educational planning aid, not medical advice. Pair with sensible sleep
 * timing; melatonin and meal timing also help but are out of scope here.
 */

export type Direction = 'east' | 'west'

export interface JetlagInput {
  usualWake: number // minutes since midnight, home time
  zones: number // time zones crossed (1–14)
  direction: Direction
}

export interface JetlagResult {
  shiftType: 'advance' | 'delay'
  adaptationDays: number
  cbtMin: string // HH:MM (home clock)
  /** Light-seek and light-avoid windows expressed on the HOME clock for day 1. */
  seekLight: string
  avoidLight: string
  longWayRound: boolean
}

function fmt(totalMin: number): string {
  const m = ((Math.round(totalMin) % 1440) + 1440) % 1440
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

export function computeJetlag(input: JetlagInput): JetlagResult {
  const cbtMinMin = input.usualWake - 120 // ~2 h before wake
  // East = advance unless the trip is so big the body delays the long way.
  const longWayRound = input.direction === 'east' && input.zones > 8
  const shiftType: 'advance' | 'delay' =
    input.direction === 'west' || longWayRound ? 'delay' : 'advance'

  const ratePerDay = shiftType === 'advance' ? 1.0 : 1.5
  const effectiveZones = longWayRound ? 24 - input.zones : input.zones
  const adaptationDays = Math.max(1, Math.ceil(effectiveZones / ratePerDay))

  // A ~4 h light window placed on the correct side of CBTmin.
  let seekFrom: number
  let avoidFrom: number
  if (shiftType === 'advance') {
    // Seek light just AFTER CBTmin (early morning); avoid the 4 h BEFORE it.
    seekFrom = cbtMinMin
    avoidFrom = cbtMinMin - 240
  } else {
    // Seek light BEFORE CBTmin (evening); avoid the 4 h AFTER it (early morning).
    seekFrom = cbtMinMin - 300 // ~5 h before CBTmin = evening
    avoidFrom = cbtMinMin
  }

  return {
    shiftType,
    adaptationDays,
    cbtMin: fmt(cbtMinMin),
    seekLight: `${fmt(seekFrom)}–${fmt(seekFrom + 240)}`,
    avoidLight: `${fmt(avoidFrom)}–${fmt(avoidFrom + 240)}`,
    longWayRound,
  }
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

export const JETLAG_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How does light help with jet lag?',
    a: 'Light is the most powerful signal for resetting your body clock. Getting bright light at the right time — and crucially, avoiding it at the wrong time — shifts your circadian rhythm toward the destination time zone. Mistimed light pushes the clock the wrong way and makes jet lag worse, which is why timing matters more than simply "getting sunlight".',
  },
  {
    q: 'Why is flying east worse than flying west?',
    a: 'Flying east requires advancing your clock (going to sleep and waking earlier), but the human clock runs slightly longer than 24 hours, so it naturally prefers to delay. Advancing is harder and slower — about 1 hour per day — while delaying (flying west) goes at roughly 1.5 hours per day. That is why westward trips usually feel easier to recover from.',
  },
  {
    q: 'What is CBTmin and why does it matter?',
    a: 'CBTmin is your core-body-temperature minimum — the coldest point of your daily cycle, which falls roughly 2 hours before your usual wake time. It is the pivot for light timing: light in the hours after CBTmin advances your clock, while light in the hours before it delays your clock. The planner uses your wake time to estimate it.',
  },
  {
    q: 'How many days does it take to get over jet lag?',
    a: 'A common rule of thumb is about one day per time zone crossed when flying east, and a bit faster flying west. Well-timed light (and avoiding wrong-time light) can speed this up; doing nothing, or getting light at the wrong time, slows it down. For very long eastward trips the body sometimes adjusts by delaying "the long way round" instead.',
  },
  {
    q: 'Does this replace melatonin or sleep medication?',
    a: 'No. This is a light-timing planner — light is the strongest lever, but correctly timed melatonin, strategic napping, meal timing and good sleep hygiene all help too. It is an educational aid, not medical advice; if you fly frequently or have a sleep disorder, talk to a clinician about a tailored protocol.',
  },
]
