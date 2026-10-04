/**
 * ONDA single source of truth for health numbers and fixed wording.
 *
 * Science pages, articles, glossary, translations and tools reference these
 * entries instead of typing numbers by hand: `{{fact:<id>}}` in markdown is
 * replaced with `display` at build time (unknown id → build error).
 *
 * Norm TABLES are not copied here: they stay in hrv-norms.ts / resting-hr.ts
 * (the calculators and the ChatGPT/Claude server already read them) and are
 * exposed below as generated table facts (`hrv.rmssd.median.40-49` …), so a
 * value can only ever exist once.
 *
 * Status: 'proposed' entries await the owner's approval (docs/science-audit.md §4);
 * only 'approved' entries may be used in new science pages.
 * Keep this module tiny — it is imported by browser code (no prose bodies).
 */
import { HRV_AGE_BANDS, SDNN_AGE_BANDS, type HrvAgeBand } from '../hrv-norms'
import { RHR_BANDS } from '../resting-hr'

export interface FactSource {
  label: string
  doi?: string
  pmid?: string
  url?: string
}

export interface Fact {
  id: string
  /** Text inserted for {{fact:id}} (English). Numbers only in the site’s EN format. */
  display: string
  kind: 'number' | 'range' | 'claim'
  /** What the number applies to — population, method, time of day. Shown in reviews, not inserted. */
  scope: string
  sources: FactSource[]
  status: 'proposed' | 'approved'
  reviewed: string
  note?: string
}

const CDC_NHSR41: FactSource = { label: 'Ostchega 2011, NHSR No. 41 (NHANES 1999–2008)', url: 'https://www.cdc.gov/nchs/data/nhsr/nhsr041.pdf' }
const NANCHEN_2018: FactSource = { label: 'Nanchen 2018, Heart', doi: '10.1136/heartjnl-2017-312731' }
const VOSS_2015: FactSource = { label: 'Voss 2015, PLOS ONE', doi: '10.1371/journal.pone.0118308' }
const NUNAN_2010: FactSource = { label: 'Nunan 2010, Pacing Clin Electrophysiol', doi: '10.1111/j.1540-8159.2010.02841.x' }
const LEHRER_2003: FactSource = { label: 'Lehrer 2003, Psychosomatic Medicine', doi: '10.1097/01.psy.0000089200.81962.19' }
const SHAFFER_2020: FactSource = { label: 'Shaffer & Meehan 2020, Front Neurosci', doi: '10.3389/fnins.2020.570400' }
const BALBAN_2023: FactSource = { label: 'Balban 2023, Cell Reports Medicine', doi: '10.1016/j.xcrm.2022.100895' }
const APPLE_NEWSROOM_2026: FactSource = { label: 'Apple Newsroom, 9 Sep 2026', url: 'https://www.apple.com/newsroom/2026/09/apple-advances-health-and-fitness-capabilities-using-apple-intelligence/' }
const HEALTHKIT_SDNN: FactSource = { label: 'Apple HealthKit: heartRateVariabilitySDNN', url: 'https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn' }
const HEALTHKIT_RMSSD: FactSource = { label: 'Apple HealthKit: heartRateVariabilityRMSSD (iOS/watchOS 27)', url: 'https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilityrmssd' }
const TASK_FORCE_1996: FactSource = { label: 'Task Force ESC/NASPE 1996, Circulation', doi: '10.1161/01.CIR.93.5.1043' }
const ONDA_APP: FactSource = { label: 'ONDA app logic: src/lib/baseline.ts (BASELINE_WINDOW_DAYS = 14), src/lib/anomaly.ts (corridor mean ± SD, MIN_NIGHTS 7, SD_GATE 1.5, floors; 90-day traffic-light corridor)', url: 'https://onda-life.com/measurements' }
const XU_2026: FactSource = { label: 'Xu 2026, Sensors (systematic review and meta-analysis)', doi: '10.3390/s26165192', pmid: '42655500' }
const ZUERN_2026: FactSource = { label: 'Zuern 2026, Scientific Reports', doi: '10.1038/s41598-026-52700-7', pmid: '42151374' }
const TAN_2023: FactSource = { label: 'Tan 2023, J Affect Disord (taVNS in depression, meta-analysis)', doi: '10.1016/j.jad.2023.05.048', pmid: '37230264' }
const ALA_RR: FactSource = { label: 'American Lung Association — respiratory rate', url: 'https://www.lung.org/blog/respiratory-rate-vital-signs' }

const R = '2026-10-04'

/** Hand-written facts. */
const FACTS_LIST: Fact[] = [
  // ── Resting heart rate ──────────────────────────────────────────────
  { id: 'rhr.adult.normal', display: '60–100 bpm', kind: 'range', scope: 'Adults at rest; the standard clinical definition of a normal resting heart rate.', sources: [NANCHEN_2018], status: 'approved', reviewed: R, note: 'Owner decision 2026-10-04: 60–100 as the main range, always with the trained-people and 50–90 caveats below.' },
  { id: 'rhr.adult.normal.caveat', display: 'Fit people often sit lower, and some research links roughly 50–90 bpm with better long-term health', kind: 'claim', scope: 'Caveat that accompanies rhr.adult.normal.', sources: [NANCHEN_2018], status: 'approved', reviewed: R },
  { id: 'rhr.trained', display: 'often 40–60 bpm', kind: 'range', scope: 'Well-trained endurance athletes at rest.', sources: [NANCHEN_2018], status: 'approved', reviewed: R },

  // ── HRV general ─────────────────────────────────────────────────────
  { id: 'hrv.pooled.daytime', display: 'about 42 ms', kind: 'number', scope: 'Pooled resting RMSSD from short daytime recordings across 44 studies — not a night-time value and not an age norm.', sources: [NUNAN_2010], status: 'approved', reviewed: R, note: 'Approved by Yakiv 2026-10-04.' },
  { id: 'hrv.rmssd.definition', display: 'RMSSD — the root mean square of successive differences between heartbeats', kind: 'claim', scope: 'Definition.', sources: [TASK_FORCE_1996], status: 'approved', reviewed: R },
  { id: 'hrv.sdnn.definition', display: 'SDNN — the standard deviation of the intervals between normal heartbeats', kind: 'claim', scope: 'Definition.', sources: [TASK_FORCE_1996], status: 'approved', reviewed: R },

  // ── Apple Watch (official Apple sources only) ───────────────────────
  { id: 'applewatch.hrv.healthkit', display: 'Apple Health records HRV as SDNN', kind: 'claim', scope: 'The long-standing HealthKit HRV type, recorded automatically by Apple Watch.', sources: [HEALTHKIT_SDNN], status: 'approved', reviewed: R },
  { id: 'applewatch.hrv.variants2026', display: 'Apple Watch Series 12 and Ultra 4 on watchOS 27 show two HRV variants — Recovery HRV and Overall HRV — and measure HRV as often as every five minutes', kind: 'claim', scope: 'Per Apple Newsroom, 9 Sep 2026. Older models: SDNN only.', sources: [APPLE_NEWSROOM_2026], status: 'approved', reviewed: R },
  { id: 'applewatch.hrv.rmssdType', display: 'iOS and watchOS 27 add an RMSSD data type to Apple Health', kind: 'claim', scope: 'HealthKit heartRateVariabilityRMSSD, available from iOS/watchOS 27.', sources: [HEALTHKIT_RMSSD], status: 'approved', reviewed: R, note: 'Apple does NOT officially state that Recovery HRV = RMSSD. Do not write that mapping as fact (owner rule 2026-10-04).' },

  // ── Breathing ───────────────────────────────────────────────────────
  { id: 'breath.adult.normal', display: '12–20 breaths per minute', kind: 'range', scope: 'Typical resting breathing rate in adults.', sources: [ALA_RR], status: 'approved', reviewed: R },
  { id: 'breath.resonance.typical', display: 'about 5.5–6 breaths per minute (around 0.1 Hz)', kind: 'range', scope: 'Typical resonance breathing rate in adults; the individual rate varies.', sources: [LEHRER_2003], status: 'approved', reviewed: R, note: 'Replaces “6/min = 5 s in / 5 s out” vs “5.5 s / 5.5 s” wording.' },
  { id: 'breath.resonance.pacer', display: '5.5 seconds in, 5.5 seconds out', kind: 'number', scope: 'Default slow-breathing pacer on onda-life.com tools (about 5.5 breaths per minute).', sources: [LEHRER_2003], status: 'approved', reviewed: R },
  { id: 'breath.resonance.individualRange', display: 'about 4.5–7 breaths per minute', kind: 'range', scope: 'Range of individual resonance frequencies in adults.', sources: [LEHRER_2003, SHAFFER_2020], status: 'approved', reviewed: R, note: 'Replaces 4.5–6.5 / 5–6 / 5–7 variants.' },
  { id: 'breath.cyclicSigh.dose', display: '5 minutes a day', kind: 'number', scope: 'Daily dose of exhale-focused breathing (cyclic sighing) in the Balban 2023 trial.', sources: [BALBAN_2023], status: 'approved', reviewed: R },

  // ── Baseline (ONDA definitions) ─────────────────────────────────────
  { id: 'baseline.window', display: '14 days', kind: 'number', scope: 'ONDA personal baseline window for HRV, resting heart rate and breathing rate.', sources: [ONDA_APP], status: 'approved', reviewed: R },
  { id: 'baseline.compare', display: 'ONDA compares each night with your own corridor — the average of your recent nights plus or minus one standard deviation — and flags a night only when it is at least 1.5 standard deviations outside and has changed by a minimum amount', kind: 'claim', scope: 'How the ONDA app reads a night against your personal baseline (src/lib/anomaly.ts). Not a general scientific method.', sources: [ONDA_APP], status: 'approved', reviewed: R },
  { id: 'baseline.minNights', display: '7 nights', kind: 'number', scope: 'Minimum valid nights before ONDA reads any signal (MIN_NIGHTS).', sources: [ONDA_APP], status: 'approved', reviewed: R },
  { id: 'baseline.floors', display: 'resting heart rate up at least 5 bpm, HRV down at least 15%, breathing rate up at least 2 breaths per minute', kind: 'claim', scope: 'Minimum change ONDA requires on top of the 1.5 SD gate (RULES in src/lib/anomaly.ts).', sources: [ONDA_APP], status: 'approved', reviewed: R },
  { id: 'baseline.corridor', display: '90 days', kind: 'number', scope: 'Window of the ONDA traffic-light corridor (Simple mode).', sources: [ONDA_APP], status: 'approved', reviewed: R },

  // ── Study facts (approved by Yakiv 2026-10-05, from measurements/heart-rate-variability proposals P1–P3) ──
  { id: 'study.xu2026.studiesQualitative', display: '43 studies', kind: 'number', scope: 'Studies in the qualitative synthesis of the PPG-PRV vs ECG-HRV systematic review (Xu 2026); healthy or apparently healthy non-clinical populations.', sources: [XU_2026], status: 'approved', reviewed: '2026-10-05', note: 'Quote: “Forty-three studies were included in the qualitative synthesis; 33 were summarized narratively, and 10 unique studies provided sufficient data for quantitative synthesis.”' },
  { id: 'study.xu2026.studiesPooled', display: '10 unique studies', kind: 'number', scope: 'Studies with enough comparable data for the quantitative (RMSSD/SDNN) pooling in Xu 2026.', sources: [XU_2026], status: 'approved', reviewed: '2026-10-05', note: 'Same quote as study.xu2026.studiesQualitative.' },
  { id: 'study.zuern2026.participants', display: '66 participants', kind: 'number', scope: 'Adults in sinus rhythm with simultaneous 12-lead ECG and wrist PPG (5 min 30 s) in a single-centre validation (Zuern 2026).', sources: [ZUERN_2026], status: 'approved', reviewed: '2026-10-05', note: 'Quote: “66 participants in sinus rhythm underwent simultaneous high-resolution 12-lead ECG and wrist-based PPG recording”.' },

  { id: 'study.tan2023.depressionTrials', display: '12 randomized controlled trials (838 participants)', kind: 'number', scope: 'Randomized controlled trials and participants pooled in the meta-analysis of transcutaneous auricular VNS for depressive disorder (Tan 2023).', sources: [TAN_2023], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/transcutaneous-vagus-nerve-stimulation P1). Quote: “Totally, 12 studies of 838 participants were included.”' },

  // ── Fixed wording (claims) ──────────────────────────────────────────
  { id: 'claim.vagalTone', display: 'Vagal tone cannot be measured directly; HRV measures such as RMSSD reflect vagally mediated changes in heart rate', kind: 'claim', scope: 'Use instead of “HRV measures vagal tone” or “X trains your vagal tone”.', sources: [TASK_FORCE_1996], status: 'approved', reviewed: R },
  { id: 'claim.slowExhale', display: 'slow breathing with a longer exhale is associated with higher vagally mediated HRV while you practise', kind: 'claim', scope: 'Use instead of “a long exhale stimulates/activates the vagus nerve”.', sources: [LEHRER_2003, BALBAN_2023], status: 'approved', reviewed: R },
  { id: 'claim.hrvNotStress', display: 'a single low HRV reading does not by itself mean you are stressed or unwell', kind: 'claim', scope: 'Use instead of “low HRV means stressed”.', sources: [TASK_FORCE_1996], status: 'approved', reviewed: R },
]

const ageKey = (b: HrvAgeBand) => b.label.replace('–', '-').replace('+', 'plus')

/** Table facts generated from the canonical norm tables (never edit values here). */
function tableFacts(): Fact[] {
  const out: Fact[] = []
  for (const [metric, bands, src, scope] of [
    ['rmssd', HRV_AGE_BANDS, [VOSS_2015, NUNAN_2010], 'Night-time RMSSD, healthy adults (ONDA norm table, hrv-norms.ts).'],
    ['sdnn', SDNN_AGE_BANDS, [VOSS_2015], 'SDNN from 5-minute resting ECG, healthy adults (Voss 2015; used for Apple Watch).'],
  ] as const) {
    for (const b of bands) {
      const k = ageKey(b)
      out.push({ id: `hrv.${metric}.median.${k}`, display: `${b.p50} ms`, kind: 'number', scope: `${scope} Age ${b.label}, median.`, sources: [...src], status: 'approved', reviewed: R })
      out.push({ id: `hrv.${metric}.typical.${k}`, display: `${b.p25}–${b.p75} ms`, kind: 'range', scope: `${scope} Age ${b.label}, 25th–75th percentile.`, sources: [...src], status: 'approved', reviewed: R })
    }
  }
  for (const sex of ['female', 'male'] as const) {
    for (const b of RHR_BANDS[sex]) {
      const k = b.label.replace('–', '-').replace('+', 'plus')
      out.push({ id: `rhr.${sex}.median.${k}`, display: `${b.p50} bpm`, kind: 'number', scope: `Seated resting pulse, US adults (NHANES), ${sex}, age ${b.label}, median.`, sources: [CDC_NHSR41], status: 'approved', reviewed: R })
      out.push({ id: `rhr.${sex}.typical.${k}`, display: `${b.p25}–${b.p75} bpm`, kind: 'range', scope: `Seated resting pulse, US adults (NHANES), ${sex}, age ${b.label}, 25th–75th percentile.`, sources: [CDC_NHSR41], status: 'approved', reviewed: R })
    }
  }
  return out
}

/** Derived from the RMSSD table — never typed by hand, so it cannot drift from hrv-norms.ts. */
function derivedFacts(): Fact[] {
  const steps = HRV_AGE_BANDS.slice(1).map((b, i) => HRV_AGE_BANDS[i].p50 - b.p50)
  const lo = Math.min(...steps), hi = Math.max(...steps)
  return [{
    id: 'hrv.age.trend',
    display: `HRV tends to fall with age — in our night-time RMSSD table the median drops by about ${lo === hi ? lo : `${lo}–${hi}`} ms from one age band to the next`,
    kind: 'claim',
    scope: `Computed from HRV_AGE_BANDS medians (steps: ${steps.join(', ')} ms). Individuals vary widely.`,
    sources: [VOSS_2015, NUNAN_2010],
    status: 'approved',
    reviewed: R,
  }]
}

export const FACTS: Record<string, Fact> = Object.fromEntries([...FACTS_LIST, ...tableFacts(), ...derivedFacts()].map((f) => [f.id, f]))

/** Replace every {{fact:id}} in text. Throws on an unknown id so builds fail loudly. */
export function resolveFacts(text: string, where = 'text'): string {
  return text.replace(/\{\{fact:([a-zA-Z0-9.\-]+)\}\}/g, (_m, id: string) => {
    const f = FACTS[id]
    if (!f) throw new Error(`[facts] unknown fact "${id}" in ${where}`)
    return f.display
  })
}
