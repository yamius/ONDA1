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
  {
    slug: 'cognitive-shuffle',
    name: 'Cognitive Shuffle',
    blurb: 'A drug-free way to fall asleep faster: picture a stream of random neutral words (serial diverse imagining) to crowd out bedtime worry-loops.',
    live: true,
    category: 'SLEEP',
    badge: 'ZZZ',
  },
  {
    slug: 'breathing',
    name: 'Breathing Pacer',
    blurb: 'Follow the circle through box, 4-7-8, coherent or extended-exhale breathing to calm your nervous system — the paced-breathing mechanic ONDA trains against live HRV.',
    live: true,
    category: 'NERVOUS SYSTEM',
    badge: '4-7-8',
  },
  {
    slug: 'resonance-breathing',
    name: 'Resonance Breathing Rate Finder',
    blurb: 'Find the slow breathing rate (~4.5–6.5/min) where your HRV peaks — your personal resonance frequency — with a height estimate and a paced circle.',
    live: true,
    category: 'NERVOUS SYSTEM',
    badge: '5.5',
  },
  {
    slug: 'dopamine-detox',
    name: 'Dopamine Reset Planner',
    blurb: 'Build a structured "dopamine detox" — really stimulus control — to cut the cheap-reward loops hijacking your focus and rebuild drive for what matters.',
    live: true,
    category: 'DOPAMINE',
    badge: 'RESET',
  },
  {
    slug: 'biological-age',
    name: 'Biological Age Calculator',
    blurb: 'Estimate your "fitness age" from resting heart rate, activity, sleep and smoking — a calm, motivational mirror of your habits, not a medical verdict.',
    live: true,
    category: 'LONGEVITY',
    badge: 'AGE',
  },
  {
    slug: 'digital-detox',
    name: 'Digital Detox Planner',
    blurb: 'Build a realistic screen-reset plan — evidence-based swaps and a phone-setup checklist to reclaim your attention and sleep, without a purity test.',
    live: true,
    category: 'FOCUS',
    badge: 'OFF',
  },
  {
    slug: 'burnout',
    name: 'Burnout Self-Assessment',
    blurb: 'An 8-question stress-load check across exhaustion, detachment and efficacy — with a recovery-focused next step. Educational, not a diagnosis.',
    live: true,
    category: 'NERVOUS SYSTEM',
    badge: 'BURN',
  },
  {
    slug: 'nervous-system',
    name: 'Nervous System State Quiz',
    blurb: 'Are you in fight-or-flight, shutdown or regulated? Read your current autonomic state and get the right vagal-tone protocol to shift it.',
    live: true,
    category: 'NERVOUS SYSTEM',
    badge: 'ANS',
  },
  {
    slug: 'wim-hof',
    name: 'Wim Hof Timer & Cold Guide',
    blurb: 'A guided Wim Hof breathing timer plus a safety-first cold-exposure protocol — stress-resilience training, honestly framed with the real risks.',
    live: true,
    category: 'NERVOUS SYSTEM',
    badge: 'WHM',
  },
  {
    slug: 'brain-fog',
    name: 'Brain Fog Quiz',
    blurb: 'Pinpoint which factors — sleep, stress, overstimulation or lifestyle — are clouding your focus, with a targeted fix and tools for each.',
    live: true,
    category: 'FOCUS',
    badge: 'FOG',
  },
  {
    slug: 'resting-heart-rate',
    name: 'Resting Heart Rate by Age',
    blurb: 'See whether your resting pulse is normal against fitness-based ranges for your age — and what actually lowers it. Pairs with HRV.',
    live: true,
    category: 'RECOVERY',
    badge: 'bpm',
  },
  {
    slug: 'recovery-score',
    name: 'Recovery Score Explained',
    blurb: 'What Whoop, Oura and Garmin recovery scores really measure (HRV, resting HR, sleep) — plus a quick readiness estimate and what to do today.',
    live: true,
    category: 'RECOVERY',
    badge: '%',
  },
  {
    slug: 'camera-heart-rate',
    name: 'Camera Heart Rate',
    blurb: 'Measure your pulse with just your phone camera — fingertip on the lens, heartbeat in real time. A live taste of how ONDA reads your body, no wearable needed.',
    live: true,
    category: 'RECOVERY',
    badge: 'PPG',
  },
]
