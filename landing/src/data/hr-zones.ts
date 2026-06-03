/**
 * Heart-rate training zones, with a Zone-2 focus.
 *
 * Two max-HR estimators:
 *   - Tanaka (2001): 208 − 0.7·age  — better across adult ages than the old
 *     220−age, which over-estimates for the young and under-estimates older.
 *   - 220 − age (Fox): the classic, kept as a familiar comparison.
 *
 * Zones are computed two ways:
 *   - %HRmax (simple): zone bounds as a fraction of estimated max HR.
 *   - Karvonen %HRR (heart-rate reserve): uses resting HR for a more
 *     personalised target — (HRmax − HRrest)·intensity + HRrest. Preferred
 *     when the user knows their resting HR.
 *
 * Zone 2 ≈ 60–70% HRmax (or HRR) — the conversational, fat-oxidising,
 * mitochondrial-building aerobic base zone popularised by Iñigo San-Millán /
 * Peter Attia. Educational, not medical advice.
 */

import type { ScienceSource } from './sources'

export interface HrZone {
  z: number
  name: string
  loPct: number
  hiPct: number
  blurb: string
}

/** %HRmax zone model (Coggan-style 5-zone, simplified). */
export const HR_ZONES: HrZone[] = [
  { z: 1, name: 'Recovery', loPct: 0.5, hiPct: 0.6, blurb: 'Very easy — warm-up, cooldown, active recovery.' },
  { z: 2, name: 'Aerobic base (Zone 2)', loPct: 0.6, hiPct: 0.7, blurb: 'Conversational. Fat oxidation + mitochondrial density. The endurance base.' },
  { z: 3, name: 'Tempo', loPct: 0.7, hiPct: 0.8, blurb: '"Comfortably hard" — aerobic but talking gets choppy.' },
  { z: 4, name: 'Threshold', loPct: 0.8, hiPct: 0.9, blurb: 'Lactate threshold — sustainable ~hard effort, raises your ceiling.' },
  { z: 5, name: 'VO₂max', loPct: 0.9, hiPct: 1.0, blurb: 'Maximal intervals — top-end power and oxygen uptake.' },
]

export type MaxHrMethod = 'tanaka' | 'fox'

export function estimateMaxHr(age: number, method: MaxHrMethod): number {
  return method === 'tanaka' ? Math.round(208 - 0.7 * age) : Math.round(220 - age)
}

export interface ZoneRange {
  z: number
  name: string
  low: number
  high: number
  blurb: string
}

/**
 * Compute bpm ranges for every zone.
 * @param maxHr estimated max HR
 * @param restHr resting HR; if > 0, use Karvonen %HRR, else %HRmax.
 */
export function computeZones(maxHr: number, restHr: number): ZoneRange[] {
  const useKarvonen = restHr > 0 && restHr < maxHr
  const bpmAt = (pct: number) =>
    useKarvonen ? Math.round((maxHr - restHr) * pct + restHr) : Math.round(maxHr * pct)
  return HR_ZONES.map((zone) => ({
    z: zone.z,
    name: zone.name,
    low: bpmAt(zone.loPct),
    high: bpmAt(zone.hiPct),
    blurb: zone.blurb,
  }))
}

export const HR_ZONE_SOURCES: ScienceSource[] = [
  {
    authors: 'Tanaka H, Monahan KD, Seals DR',
    year: 2001,
    title: 'Age-predicted maximal heart rate revisited',
    journal: 'Journal of the American College of Cardiology, 37(1):153–156',
    contributes: 'The HRmax = 208 − 0.7 × age equation used here — more accurate across adult ages than the older 220 − age.',
    url: 'https://doi.org/10.1016/S0735-1097(00)01054-8',
  },
  {
    authors: 'Karvonen MJ, Kentala E, Mustala O',
    year: 1957,
    title: 'The effects of training on heart rate: a longitudinal study',
    journal: 'Annales Medicinae Experimentalis et Biologiae Fenniae, 35(3):307–315',
    contributes: 'Origin of the heart-rate-reserve (Karvonen) method used when you enter a resting HR.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/13470504/',
  },
  {
    authors: 'Seiler S, Kjerland GØ',
    year: 2006,
    title: 'Quantifying training intensity distribution in elite endurance athletes: is there evidence for an "optimal" distribution?',
    journal: 'Scandinavian Journal of Medicine & Science in Sports, 16(1):49–56',
    contributes: 'Evidence that the bulk of endurance training should sit in the easy, aerobic (Zone 2) band below the first threshold.',
    url: 'https://doi.org/10.1111/j.1600-0838.2004.00418.x',
  },
]

export const HR_ZONE_METHODOLOGY =
  'Max heart rate is estimated with the Tanaka equation (208 − 0.7 × age), which the original study found more accurate across adult ages than the familiar 220 − age. Zones are then taken as percentages of max HR, or — if you enter a resting HR — by the Karvonen heart-rate-reserve method, which personalises the zones to your fitness. Zone 2 is the easy, conversational aerobic band that endurance research (Seiler) shows should make up most training volume. These are population formulas: an individual’s true max HR can differ by ±10–12 bpm, so a lab or maximal field test is more precise than any age formula.'

export const HR_ZONE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Where do these heart-rate zones come from?',
    a: 'Max HR uses the Tanaka 2001 equation (208 − 0.7 × age), validated as more accurate than 220 − age. With a resting HR entered, zones use the Karvonen (1957) heart-rate-reserve method. The emphasis on a large Zone 2 base reflects endurance-training research such as Seiler & Kjerland (2006). Full citations are in the Sources section on this page. Note age formulas estimate max HR to within roughly ±10–12 bpm.',
  },
  {
    q: 'What is Zone 2 heart rate?',
    a: 'Zone 2 is the aerobic "base" zone — roughly 60–70% of your maximum heart rate, the pace at which you can still hold a conversation. It is where the body preferentially burns fat and builds mitochondrial density, which is why endurance athletes spend the bulk of their training there.',
  },
  {
    q: 'How do I calculate my Zone 2?',
    a: 'Estimate your max HR (this tool uses the Tanaka formula, 208 − 0.7·age, more accurate than the old 220 − age), then take 60–70% of it. If you know your resting heart rate, the Karvonen method — (maxHR − restHR)·intensity + restHR — personalises the range further.',
  },
  {
    q: 'How accurate are formula-based max-HR estimates?',
    a: 'They are population averages with a real spread — individual max HR can sit ±10–12 bpm from any formula. For precise zones, a lab test or an all-out field test beats a formula. For most people, the Tanaka estimate plus the "talk test" (you can speak in full sentences in Zone 2) is close enough.',
  },
  {
    q: 'How much Zone 2 should I do?',
    a: 'A common target is 150–180+ minutes per week, often as 3–4 sessions of 45–60 minutes, kept strictly easy. The discipline is staying IN the zone — most people drift into Zone 3, which blunts the aerobic-base adaptation. A heart-rate monitor (chest strap is most accurate) keeps you honest.',
  },
  {
    q: 'Why use Tanaka instead of 220 minus age?',
    a: '220 − age is simple but systematically over-estimates max HR in younger adults and under-estimates it in older adults. The Tanaka 2001 formula (208 − 0.7·age), derived from a large meta-analysis, tracks the real age decline better. This tool shows both so you can compare.',
  },
]
