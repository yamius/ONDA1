/**
 * Wim Hof breathing timer + cold-exposure protocol guide.
 *
 * SAFETY-CRITICAL TOOL. Wim Hof / cyclic-hyperventilation breathing causes
 * transient hypocapnia and can trigger fainting — it has caused drownings and
 * injuries when done in or near water. Cold exposure stresses the heart. This
 * tool ships with prominent, non-negotiable safety rules and an honest, not
 * hyped, read of the evidence. Educational only, not medical advice.
 */

import type { ScienceSource } from './sources'

export interface WhmConfig {
  rounds: number
  breaths: number
  recoverySec: number
}

export const WHM_DEFAULTS: WhmConfig = { rounds: 3, breaths: 30, recoverySec: 15 }
export const WHM_ROUND_OPTIONS = [2, 3, 4] as const
export const WHM_BREATH_OPTIONS = [25, 30, 35, 40] as const
/** Per half-breath (inhale OR exhale) animation duration, ms. */
export const WHM_HALF_MS = 1400

export const COLD_SAFETY: string[] = [
  'NEVER do the breathing in or near water, in a bath, or while standing — fainting is a real risk. Always sit or lie down on a safe surface.',
  'Never combine the breathing with cold water, driving, or any situation where blacking out is dangerous. Do the breathing first, fully recovered, on dry land.',
  'Skip cold exposure and this breathing if you are pregnant, have a heart condition, high blood pressure, epilepsy, or a history of fainting — check with a doctor first.',
  'Cold water triggers a cold-shock gasp and spikes heart rate and blood pressure; enter gradually, keep it short, and never plunge alone in open water.',
  'Stop immediately if you feel chest pain, severe dizziness, or numbness. Warm up actively afterward.',
]

export interface ColdStep {
  label: string
  value: string
}

export const COLD_PROTOCOL: ColdStep[] = [
  { label: 'Weekly dose', value: '~11 minutes of deliberate cold per week, split across 2–4 short sessions (not one long one).' },
  { label: 'Per session', value: '1–3 minutes is plenty. More is not better; the goal is a hormetic stress, not an endurance feat.' },
  { label: 'Temperature', value: '"Uncomfortably cold but you could stay in" — for many that’s ~10–15°C water. Let cold feel, not a number, guide you.' },
  { label: 'How to start', value: 'End your normal shower with 30 seconds cold; add ~15 s a week. A cold shower is a safe on-ramp before any plunge.' },
  { label: 'Timing', value: 'Avoid right after strength training if hypertrophy is the goal (cold can blunt muscle adaptation). Morning cold is fine.' },
]

export const WHM_SOURCES: ScienceSource[] = [
  {
    authors: 'Kox M, van Eijk LT, Zwaag J, et al.',
    year: 2014,
    title: 'Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans',
    journal: 'PNAS, 111(20):7379–7384',
    contributes: 'The core Wim Hof Method study — the trained group voluntarily raised adrenaline and damped an inflammatory response.',
    url: 'https://doi.org/10.1073/pnas.1322174111',
  },
  {
    authors: 'Buijze GA, Sierevelt IN, van der Heijden BCJM, et al.',
    year: 2016,
    title: 'The effect of cold showering on health and work: a randomized controlled trial',
    journal: 'PLOS ONE, 11(9):e0161749',
    contributes: 'RCT (n≈3000): ending showers cold for 30–90 s cut self-reported sick-leave by ~29%.',
    url: 'https://doi.org/10.1371/journal.pone.0161749',
  },
  {
    authors: 'Tipton MJ, Collier N, Corbett J, et al.',
    year: 2017,
    title: 'Cold water immersion: kill or cure?',
    journal: 'Experimental Physiology, 102(11):1335–1355',
    contributes: 'The honest safety picture — cold-shock response, cardiac risk, and why caution and gradual exposure matter.',
    url: 'https://doi.org/10.1113/EP086283',
  },
]

export const WHM_METHODOLOGY =
  'The Wim Hof Method combines cyclic over-breathing with breath holds and cold exposure. The headline study (Kox 2014) showed trained practitioners could voluntarily raise adrenaline and blunt an inflammatory response — a real, if small and specific, finding that has been widely over-extrapolated. Cold exposure has its own modest evidence: ending showers cold cut self-reported sick days in a large trial (Buijze 2016), and deliberate cold is linked to mood and metabolic effects, though much of the popular claims outrun the data. Crucially, the same review literature flags real danger: the breathing causes hypocapnia and can make you faint, and cold water triggers a cold-shock response and cardiac strain (Tipton 2017) — which is why this must never be done in water and why people with heart conditions or during pregnancy should not do it without medical clearance. This is an educational guide and timer, not medical advice; respect the safety rules above all.'

export const WHM_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is the Wim Hof breathing method?',
    a: 'It’s a cycle of 30–40 deep, slightly forceful breaths (mild over-breathing), followed by exhaling and holding your breath as long as is comfortable, then a recovery breath held for ~15 seconds — repeated for a few rounds. The timer here paces those rounds for you. It’s typically paired with cold exposure and a calm, focused mindset.',
  },
  {
    q: 'Is Wim Hof breathing safe?',
    a: 'Done correctly — sitting or lying down, on dry land — it’s safe for most healthy people. Done wrong it’s genuinely dangerous: the breathing lowers CO₂ and can make you faint, so it has caused drownings and injuries when people did it in water, baths or pools. NEVER do it in or near water or while driving, and avoid it entirely if you’re pregnant or have a heart condition, high blood pressure, epilepsy or fainting history without medical advice.',
  },
  {
    q: 'Does the Wim Hof Method actually work?',
    a: 'Partly, with honest caveats. A controlled study (Kox 2014) showed trained practitioners could voluntarily activate their sympathetic nervous system and dampen an inflammatory response — a real result. But many popular claims (curing diseases, dramatic immunity) go far beyond the evidence. Treat it as a potentially useful stress-resilience and focus practice, not a medical treatment.',
  },
  {
    q: 'How much cold exposure do I actually need?',
    a: 'Less than the internet implies. Roughly 11 minutes of deliberate cold per week, split across 2–4 short sessions of 1–3 minutes, is a commonly cited target — and more is not better. A cold shower (ending 30–90 seconds cold) is a safe, evidence-backed on-ramp; one trial found it cut sick days by about 29% (Buijze 2016).',
  },
  {
    q: 'Cold shower or ice bath — which should I do?',
    a: 'Start with cold showers; they carry far less risk and still deliver benefits. An ice bath or open-water plunge adds a stronger cold-shock stress and real cardiac and drowning risks (Tipton 2017), so progress slowly, keep sessions short, never plunge alone in open water, and get medical clearance first if you have any cardiovascular condition.',
  },
]
