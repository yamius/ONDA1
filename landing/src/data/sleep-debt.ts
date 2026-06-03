/**
 * Sleep-debt model for the calculator.
 *
 * Sleep debt = cumulative shortfall between the sleep you NEED and the sleep
 * you actually GET, summed over a rolling window (we use the last 7 nights —
 * the window most consumer trackers and the sleep-science literature treat as
 * the practically "repayable" recent debt; older debt is largely unrecoverable
 * and the body partially resets).
 *
 * Sleep need is age-banded, from the National Sleep Foundation / AASM
 * consensus recommendations. We use the midpoint of each band as the default
 * "need", which the user can override.
 *
 * Educational, not medical advice. Individual need varies; consistent timing
 * matters as much as total hours.
 */

export interface SleepNeedBand {
  minAge: number
  maxAge: number
  label: string
  /** Recommended nightly sleep range (hours). */
  low: number
  high: number
}

export const SLEEP_NEED_BANDS: SleepNeedBand[] = [
  { minAge: 14, maxAge: 17, label: '14–17', low: 8, high: 10 },
  { minAge: 18, maxAge: 25, label: '18–25', low: 7, high: 9 },
  { minAge: 26, maxAge: 64, label: '26–64', low: 7, high: 9 },
  { minAge: 65, maxAge: Infinity, label: '65+', low: 7, high: 8 },
]

export function sleepNeedForAge(age: number): SleepNeedBand {
  return SLEEP_NEED_BANDS.find((b) => age >= b.minAge && age <= b.maxAge) ?? SLEEP_NEED_BANDS[2]
}

export type DebtTier = 'none' | 'mild' | 'moderate' | 'high'

export interface SleepDebtResult {
  /** Total debt over the window, hours (>=0). */
  debtHours: number
  /** Average nightly shortfall, hours. */
  avgShortfall: number
  tier: DebtTier
  tierLabel: string
  summary: string
  /** Suggested recovery: extra hours/night and how many nights. */
  recoveryNightsAt1h: number
}

const TIERS: Array<{ maxDebt: number; tier: DebtTier; label: string }> = [
  { maxDebt: 1, tier: 'none', label: 'No meaningful debt' },
  { maxDebt: 5, tier: 'mild', label: 'Mild sleep debt' },
  { maxDebt: 10, tier: 'moderate', label: 'Moderate sleep debt' },
  { maxDebt: Infinity, tier: 'high', label: 'High sleep debt' },
]

/**
 * @param need   nightly sleep need, hours
 * @param nights array of actual hours slept per night (last 7)
 */
export function computeSleepDebt(need: number, nights: number[]): SleepDebtResult {
  const valid = nights.filter((n) => n >= 0 && n <= 16)
  const debtHours = valid.reduce((sum, got) => sum + Math.max(0, need - got), 0)
  const avgShortfall = valid.length ? debtHours / valid.length : 0
  const t = TIERS.find((x) => debtHours <= x.maxDebt) ?? TIERS[1]

  const summaryByTier: Record<DebtTier, string> = {
    none: `You're broadly meeting your ~${need} h need across the week — no meaningful debt to repay. Protect it with consistent sleep and wake times.`,
    mild: `About ${debtHours.toFixed(1)} h of debt built up this week (~${avgShortfall.toFixed(1)} h short per night). Repayable with a couple of slightly longer nights — most easily by going to bed earlier, not sleeping in late.`,
    moderate: `Around ${debtHours.toFixed(1)} h of accumulated shortfall. At this level focus, mood and reaction time measurably degrade. Bank an extra 1–1.5 h/night over the next several nights and prioritise an early, consistent bedtime.`,
    high: `Roughly ${debtHours.toFixed(1)} h — a large recent deficit. Beyond ~10 h, a single weekend lie-in won't fully recover it: rebuild gradually with earlier bedtimes over 1–2 weeks. Persistent high debt is worth taking seriously.`,
  }
  return {
    debtHours,
    avgShortfall,
    tier: t.tier,
    tierLabel: t.label,
    summary: summaryByTier[t.tier],
    recoveryNightsAt1h: Math.ceil(debtHours / 1),
  }
}

export const SLEEP_DEBT_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is sleep debt?',
    a: 'Sleep debt is the running total of the gap between how much sleep you need and how much you actually get. Lose an hour a night for five nights and you carry roughly five hours of debt — which degrades focus, mood, glucose control and reaction time even if you feel "used to it".',
  },
  {
    q: 'Can you catch up on sleep?',
    a: 'Partly. Recent debt (the last week or so) is largely repayable with a few longer nights — ideally by going to bed earlier rather than sleeping in, which shifts your body clock. Chronic, months-long deprivation is not fully reversible in a weekend; it rebuilds gradually with consistent adequate sleep.',
  },
  {
    q: 'How much sleep do I actually need?',
    a: 'For most adults 18–64, the consensus recommendation is 7–9 hours; 7–8 hours at 65+. Teens need 8–10. Genuine "short sleepers" who thrive on under 6 hours are rare (<1% of people) — most who think they are one are simply adapted to chronic debt.',
  },
  {
    q: 'Why does this only count the last 7 nights?',
    a: 'Recent debt is the part you can practically repay and that most affects how you feel and perform right now. The body does not keep an infinite ledger — older deficits partially reset, so a rolling weekly window is the useful, honest number to act on.',
  },
  {
    q: 'Is sleeping in on weekends a good fix?',
    a: 'It helps with acute debt but has a cost: large weekend lie-ins create "social jet lag", shifting your clock so Monday feels worse. Better to repay debt with consistent, slightly earlier bedtimes through the week and cap weekend catch-up to ~1 hour later than usual.',
  },
]
