/**
 * Single source of truth for the interactive tools / calculators catalogue.
 *
 * Consumed by:
 *   - src/pages/ToolsPage.tsx  (the /tools hub grid)
 *   - scripts/generate-tool-cards.ts  (branded OG card per tool)
 *
 * Each tool also has a branded share card at /images/tools/<slug>.png,
 * generated at build time (SVG → PNG via sharp) and wired as og:image /
 * twitter:image in scripts/meta-inject.ts. `category` and `badge` only drive
 * the card art; `blurb` is shared by the hub and (loosely) the card tagline.
 */

export interface ToolEntry {
  slug: string
  name: string
  blurb: string
  live: boolean
  /** Eyebrow category on the share card (e.g. RECOVERY, SLEEP, NUTRITION, FITNESS). */
  category: string
  /** Short unit/glyph shown in the card badge (kept ASCII-safe for the SVG mono fallback). */
  badge: string
}

export const TOOLS: ToolEntry[] = [
  {
    slug: 'hrv',
    name: 'HRV Interpreter',
    blurb: 'Enter your age and resting HRV (RMSSD) to see where it lands against population norms — and what moves it.',
    live: true,
    category: 'RECOVERY',
    badge: 'ms',
  },
  {
    slug: 'caffeine',
    name: 'Caffeine Cut-Off Calculator',
    blurb: 'Find the latest you can have your last coffee before bed without leaving sleep-disrupting caffeine in your system.',
    live: true,
    category: 'SLEEP',
    badge: 'mg',
  },
  {
    slug: 'sleep-debt',
    name: 'Sleep Debt Calculator',
    blurb: 'Add up your last 7 nights to see your accumulated sleep deficit against your age-based need — and how to repay it.',
    live: true,
    category: 'SLEEP',
    badge: 'hrs',
  },
  {
    slug: 'zone-2',
    name: 'Zone 2 Heart Rate Calculator',
    blurb: 'Find your aerobic-base (Zone 2) heart rate and all 5 training zones from your age — using the accurate Tanaka formula.',
    live: true,
    category: 'FITNESS',
    badge: 'bpm',
  },
  {
    slug: 'chronotype',
    name: 'Chronotype Quiz',
    blurb: 'Six questions to find your body-clock type — morning, intermediate or evening — with a personalised daily-timing protocol.',
    live: true,
    category: 'SLEEP',
    badge: 'AM/PM',
  },
  {
    slug: 'protein',
    name: 'Protein Intake Calculator',
    blurb: 'Get your daily protein target in grams from your bodyweight and goal — based on ISSN/ACSM guidelines — plus a per-meal split.',
    live: true,
    category: 'NUTRITION',
    badge: 'g/d',
  },
  {
    slug: 'vo2max',
    name: 'VO₂max Estimator',
    blurb: 'Estimate your cardiorespiratory fitness from your resting and max heart rate, and see where it ranks against age- and sex-based norms.',
    live: true,
    category: 'FITNESS',
    badge: 'VO2',
  },
  {
    slug: 'tdee',
    name: 'TDEE Calculator',
    blurb: 'Find your total daily calorie burn with the Mifflin–St Jeor equation, plus a calorie target and macro split for your goal.',
    live: true,
    category: 'NUTRITION',
    badge: 'kcal',
  },
  {
    slug: 'water',
    name: 'Water Intake Calculator',
    blurb: 'Estimate your daily water target from bodyweight, with adjustments for exercise, hot weather and high caffeine or alcohol intake.',
    live: true,
    category: 'NUTRITION',
    badge: 'L/d',
  },
  {
    slug: 'alcohol',
    name: 'Alcohol Clearance Calculator',
    blurb: 'Estimate your blood-alcohol level and how long until it clears, with the Widmark equation — and why drinks cost you a night of recovery.',
    live: true,
    category: 'RECOVERY',
    badge: 'BAC',
  },
  {
    slug: 'fasting',
    name: 'Intermittent Fasting Calculator',
    blurb: 'Pick a protocol (16:8, 18:6, 20:4, OMAD) and first-meal time to get your eating and fasting windows, plus a metabolic-phase timeline.',
    live: true,
    category: 'NUTRITION',
    badge: '16:8',
  },
  {
    slug: 'jet-lag',
    name: 'Jet Lag Light-Timing Planner',
    blurb: 'Enter your trip to see which way your body clock must shift and exactly when to seek and avoid bright light to beat jet lag faster.',
    live: true,
    category: 'SLEEP',
    badge: 'TZ',
  },
  {
    slug: 'one-rep-max',
    name: 'One-Rep Max Calculator',
    blurb: 'Estimate your 1RM from a hard set with the Epley and Brzycki equations, plus a training-load table for every percentage of your max.',
    live: true,
    category: 'FITNESS',
    badge: '1RM',
  },
  {
    slug: 'body-fat',
    name: 'Body Fat Calculator',
    blurb: 'Estimate your body-fat percentage with just a tape measure using the U.S. Navy circumference method, and see your fitness band.',
    live: true,
    category: 'FITNESS',
    badge: '%BF',
  },
  {
    slug: 'sleep-cycle',
    name: 'Sleep Cycle Calculator',
    blurb: 'Find the best bedtime or wake time by aligning your alarm with ~90-minute sleep cycles, so you wake in lighter sleep and less groggy.',
    live: true,
    category: 'SLEEP',
    badge: '90m',
  },
]
