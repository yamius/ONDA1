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
  /** Optional short form, inserted for {{fact:id|short}}. Translations live in facts-i18n.ts. */
  short?: string
  /** Values for {name} placeholders in translations (computed facts). */
  vars?: Record<string, string>
  kind: 'number' | 'range' | 'claim'
  /** What the number applies to — population, method, time of day. Shown in reviews, not inserted. */
  scope: string
  sources: FactSource[]
  status: 'proposed' | 'approved'
  reviewed: string
  note?: string
}

const CDC_NHSR41: FactSource = { label: 'Ostchega 2011, NHSR No. 41 (NHANES 1999–2008)', url: 'https://www.cdc.gov/nchs/data/nhsr/nhsr041.pdf' }
const HENNING_2023: FactSource = { label: 'Henning & Krawiec, Sinus Tachycardia, StatPearls (NBK553128, Last Update 2023-03-05)', pmid: '31985921', url: 'https://www.ncbi.nlm.nih.gov/books/NBK553128/' }
const SIDHU_2020: FactSource = { label: 'Sidhu & Marine 2020, Trends Cardiovasc Med (bradycardia, review)', doi: '10.1016/j.tcm.2019.07.001', pmid: '31311698' }
const ZHANG_2016: FactSource = { label: 'Zhang 2016, CMAJ (resting heart rate and mortality, meta-analysis)', doi: '10.1503/cmaj.150535', pmid: '26598376' }
const FOX_2007: FactSource = { label: 'Fox 2007, JACC (resting heart rate in cardiovascular disease, review)', doi: '10.1016/j.jacc.2007.04.079', pmid: '17719466' }
const DAMBROSIO_2026: FactSource = { label: "D'Ambrosio 2026, Circulation (bradycardia in athletes, observational)", doi: '10.1161/CIRCULATIONAHA.125.076170', pmid: '41410046' }
const LOERUP_2019: FactSource = { label: 'Loerup 2019, BMC Med (blood pressure and heart rate in pregnancy, meta-analysis)', doi: '10.1186/s12916-019-1399-1', pmid: '31506067' }
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
const GOESSL_2017: FactSource = { label: 'Goessl 2017, Psychol Med (HRV biofeedback for stress and anxiety, meta-analysis)', doi: '10.1017/S0033291717001003', pmid: '28478782' }
const PIZZOLI_2021: FactSource = { label: 'Pizzoli 2021, Sci Rep (HRV biofeedback and depressive symptoms, meta-analysis)', doi: '10.1038/s41598-021-86149-7', pmid: '33758260' }
const LEHRER_2020: FactSource = { label: 'Lehrer 2020, Appl Psychophysiol Biofeedback (HRV biofeedback, systematic review and meta-analysis)', doi: '10.1007/s10484-020-09466-z', pmid: '32385728' }
const KANEKO_2026: FactSource = { label: 'Kaneko 2026, Appl Psychophysiol Biofeedback (HRV biofeedback in cardiovascular disease, meta-analysis)', doi: '10.1007/s10484-025-09765-3', pmid: '41501316' }
const LABORDE_2022: FactSource = { label: 'Laborde 2022, Neurosci Biobehav Rev (voluntary slow breathing and HRV, meta-analysis)', doi: '10.1016/j.neubiorev.2022.104711', pmid: '35623448' }
const CHADDHA_2019: FactSource = { label: 'Chaddha 2019, Complement Ther Med (slow breathing and blood pressure, meta-analysis)', doi: '10.1016/j.ctim.2019.03.005', pmid: '31331557' }
const MAHTANI_2012: FactSource = { label: 'Mahtani 2012, J Hypertens (device-guided breathing, meta-analysis)', doi: '10.1097/HJH.0b013e3283520077', pmid: '22495126' }
const FINCHAM_2023: FactSource = { label: 'Fincham 2023, Sci Rep (breathwork and stress, meta-analysis)', doi: '10.1038/s41598-022-27247-y', pmid: '36624160' }
const EIDE_2026: FactSource = { label: 'Eide 2026, Sleep Med Rev (slow breathing before bedtime, systematic review)', doi: '10.1016/j.smrv.2026.102284', pmid: '41886931' }
const BONAZ_2018: FactSource = { label: 'Bonaz 2018, Front Neurosci (vagus nerve and the microbiota–gut–brain axis, review)', doi: '10.3389/fnins.2018.00049', pmid: '29467611' }
const ALA_RR: FactSource = { label: 'American Lung Association — respiratory rate', url: 'https://www.lung.org/blog/respiratory-rate-vital-signs' }

const R = '2026-10-04'

/** Hand-written facts. */
const FACTS_LIST: Fact[] = [
  // ── Resting heart rate ──────────────────────────────────────────────
  { id: 'rhr.adult.normal', display: '60–100 bpm', kind: 'range', scope: 'Adults at rest; the standard clinical definition of a normal resting heart rate.', sources: [HENNING_2023], status: 'approved', reviewed: '2026-10-05', note: 'Owner decision 2026-10-04: 60–100 as the main range, always with the trained-people and lower-mortality caveats below. Source Nanchen 2018 → StatPearls (Henning & Krawiec), approved by Yakiv 2026-10-05.' },
  { id: 'rhr.adult.normal.caveat', display: 'Fit people often sit lower, and in population studies a lower resting heart rate is associated with lower long-term mortality', kind: 'claim', scope: 'Caveat that accompanies rhr.adult.normal. Population association, not an individual prediction.', sources: [SIDHU_2020, ZHANG_2016, FOX_2007], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05: reworded (the old 50–90 bpm clause had no verified source).' },
  { id: 'rhr.trained', display: 'often below 60 bpm, and many elite endurance athletes reach 40 bpm or less at their lowest point of the day', kind: 'claim', scope: "Well-trained people at rest (Sidhu 2020); the 40 bpm part is the minimum Holter heart rate, including sleep, in elite endurance athletes (D'Ambrosio 2026), not a daytime resting reading.", sources: [SIDHU_2020, DAMBROSIO_2026], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (measurements/resting-heart-rate P14; replaces "often 40–60 bpm"). Quote: “Resting bradycardia (HR ≤40 bpm) and pauses of 2 to 3 s are present in a significant proportion of endurance athletes and are well tolerated.”' },
  { id: 'rhr.mortality.per10', display: 'each 10 bpm higher was associated with about a 9% higher relative risk of death from any cause', kind: 'claim', scope: 'Population meta-analysis of prospective cohorts (Zhang 2016): pooled relative risk per 10 bpm of resting heart rate; association, not causal, not an individual prediction.', sources: [ZHANG_2016], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (measurements/resting-heart-rate P7). Quote: “The relative risk with 10 beats/min increment of resting heart rate was 1.09 (95% CI 1.07-1.12) for all-cause mortality and 1.08 (95% CI 1.06-1.10) for cardiovascular mortality.”' },
  { id: 'rhr.pregnancy.rise', display: 'about 8 bpm on average, from about 79 bpm at 10 weeks to about 87 bpm at 40 weeks', kind: 'number', scope: 'Mean heart-rate rise across a healthy pregnancy, pooled (Loerup 2019, systematic review and meta-analysis; high heterogeneity); not a reference range for one person.', sources: [LOERUP_2019], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (measurements/resting-heart-rate P8). Quote: “Mean (95% CI) heart rate rose from 79.3 (75.5, 83.1) beats/min at 10 weeks to 86.9 (82.2, 91.6) beats/min at 40 weeks gestation, mean (95% CI) change 7.6 (1.8, 13.4) beats/min.”' },

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

  { id: 'study.tan2023.depressionTrials', display: '12 randomized controlled trials (838 participants)', kind: 'number', scope: 'Randomized controlled trials and participants pooled in the meta-analysis of transcutaneous auricular VNS for depressive disorder (Tan 2023).', sources: [TAN_2023], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/vagus-nerve-stimulation P1). Quote: “Totally, 12 studies of 838 participants were included.”' },
  { id: 'study.goessl2017.studies', display: '24 studies with 484 participants', kind: 'number', scope: 'Studies of HRV biofeedback training for stress and anxiety pooled in Goessl 2017 (meta-analysis).', sources: [GOESSL_2017], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/hrv-biofeedback P1). Quote: “The search identified 24 studies totaling 484 participants who received HRV biofeedback training for stress and anxiety.”' },
  { id: 'study.pizzoli2021.trials', display: '14 randomized controlled trials with 794 participants', kind: 'number', scope: 'Randomized controlled trials of HRV biofeedback on depressive symptoms in adults pooled in Pizzoli 2021 (meta-analysis).', sources: [PIZZOLI_2021], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/hrv-biofeedback P2). Quote: “Overall, we analysed 14 RCTs with a total of 794 participants.”' },
  { id: 'study.lehrer2020.studies', display: '58 randomized controlled studies', kind: 'number', scope: 'Randomized controlled studies of HRV biofeedback across all outcomes included in Lehrer 2020 (systematic review and meta-analysis).', sources: [LEHRER_2020], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/hrv-biofeedback P3). Quote: “Our initial review yielded 1868 papers, from which 58 met inclusion criteria.”' },
  { id: 'study.kaneko2026.trials', display: '13 randomized controlled trials with 965 participants', kind: 'number', scope: 'Randomized controlled trials of HRV biofeedback in patients with cardiovascular disease included in Kaneko 2026 (meta-analysis).', sources: [KANEKO_2026], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/hrv-biofeedback P4). Year = online-first 2026; check volume/year when the issue is published. Quote: “From 2402 records, 13 RCTs (965 participants; 795 analyzed) were included.”' },
  { id: 'study.laborde2022.studies', display: '223 studies', kind: 'number', scope: 'Studies of voluntary slow breathing included in Laborde 2022 (systematic review and meta-analysis of heart rate and HRV).', sources: [LABORDE_2022], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/slow-breathing P1). Quote: “From the 1842 selected abstracts, 223 studies were suitable for inclusion”' },
  { id: 'study.chaddha2019.studies', display: '17 studies', kind: 'number', scope: 'Randomized studies of slow breathing (device-guided and unguided) on blood pressure pooled in Chaddha 2019 (meta-analysis).', sources: [CHADDHA_2019], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/slow-breathing P2). Quote: “17 studies were included in the meta-analysis.”' },
  { id: 'study.mahtani2012.trials', display: 'eight trials with 494 adults, five of them sponsored by or involving the manufacturer', kind: 'number', scope: 'Trials of the RESPeRATE device-guided breathing device pooled in Mahtani 2012 (meta-analysis).', sources: [MAHTANI_2012], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/slow-breathing P3). Quote: “We included eight trials of the Resperate device (InterCure Ltd, Lod, Israel), consisting of 494 adult patients.”' },
  { id: 'study.fincham2023.trials', display: '12 randomized controlled trials with 785 adults', kind: 'number', scope: 'Randomized controlled trials of breathwork on self-reported stress pooled in Fincham 2023 (meta-analysis).', sources: [FINCHAM_2023], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/slow-breathing P4). Quote: “12 randomised-controlled trials (k = 12) with a total of 785 adult participants.”' },
  { id: 'study.eide2026.studies', display: 'nine studies with 457 participants', kind: 'number', scope: 'Studies of slow breathing practised before bedtime included in Eide 2026 (systematic review).', sources: [EIDE_2026], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (evidence/slow-breathing P5). Quote: “Nine studies met the inclusion criteria (≤10 breaths/min, practiced before bedtime), encompassing 457 participants.”' },
  { id: 'vagus.fibres', display: 'about 80% of its fibres carry signals from the organs to the brain, and about 20% carry signals from the brain to the organs', kind: 'number', scope: 'Fibre composition of the vagus nerve (afferent vs efferent), as summarised in Bonaz 2018 (review).', sources: [BONAZ_2018], status: 'approved', reviewed: '2026-10-05', note: 'Approved by Yakiv 2026-10-05 (concepts/vagus-nerve P1). Quote: “a mixed nerve composed of 80% afferent and 20% efferent fibers.”' },

  // ── Fixed wording (claims) ──────────────────────────────────────────
  { id: 'claim.vagalTone', display: 'Vagal tone cannot be measured directly; HRV measures such as RMSSD reflect vagally mediated changes in heart rate', short: 'Vagal tone cannot be measured directly', kind: 'claim', scope: 'Use instead of “HRV measures vagal tone” or “X trains your vagal tone”.', sources: [TASK_FORCE_1996], status: 'approved', reviewed: R },
  { id: 'claim.slowExhale', display: 'Slow breathing is associated with higher vagally mediated HRV; whether a longer exhale adds anything beyond slowing the breath is still debated', short: 'Slow breathing is associated with higher vagally mediated HRV', kind: 'claim', scope: 'Use instead of “a long exhale stimulates/activates the vagus nerve”. Reworded 2026-10-05 (Yakiv): the exhale ratio is debated (Shaffer & Meehan 2020). Starts with a capital and has its own clause — use it as a full sentence.', sources: [LEHRER_2003, BALBAN_2023], status: 'approved', reviewed: R },
  { id: 'claim.hrvNotStress', display: 'A single low HRV reading does not by itself mean you are stressed or unwell', kind: 'claim', scope: 'Use instead of “low HRV means stressed”.', sources: [TASK_FORCE_1996], status: 'approved', reviewed: R },
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
    vars: { range: lo === hi ? String(lo) : `${lo}–${hi}` },
    kind: 'claim',
    scope: `Computed from HRV_AGE_BANDS medians (steps: ${steps.join(', ')} ms). Individuals vary widely.`,
    sources: [VOSS_2015, NUNAN_2010],
    status: 'approved',
    reviewed: R,
  }]
}

export const FACTS: Record<string, Fact> = Object.fromEntries([...FACTS_LIST, ...tableFacts(), ...derivedFacts()].map((f) => [f.id, f]))

export const FACT_LANGS = ['en', 'ru', 'uk', 'es', 'de', 'fr', 'it', 'pt', 'nl', 'pl', 'ja', 'zh'] as const
export type FactLang = (typeof FACT_LANGS)[number]

/** Units of the generated table facts, per language (ranges keep the en dash). */
const UNITS: Record<'ms' | 'bpm', Record<FactLang, string>> = {
  ms: { en: 'ms', ru: 'мс', uk: 'мс', es: 'ms', de: 'ms', fr: 'ms', it: 'ms', pt: 'ms', nl: 'ms', pl: 'ms', ja: 'ミリ秒', zh: '毫秒' },
  bpm: { en: 'bpm', ru: 'уд/мин', uk: 'уд/хв', es: 'lpm', de: 'S/min', fr: 'bpm', it: 'bpm', pt: 'bpm', nl: 'spm', pl: 'ud./min', ja: '拍/分', zh: '次/分' },
}
const DECIMAL_COMMA = new Set<FactLang>(['ru', 'uk', 'es', 'de', 'fr', 'it', 'pt', 'nl', 'pl'])
const TABLE_FACT = /^(hrv\.(rmssd|sdnn)|rhr\.(male|female))\.(median|typical)\./

/** Locale form of a generated table fact (“34 ms” → “34 мс”, “1.5” → “1,5”). */
function tableDisplay(f: Fact, lang: FactLang): string {
  const unit = /bpm$/.test(f.display) ? 'bpm' : 'ms'
  let v = f.display.replace(/\s*(ms|bpm)$/, '')
  if (DECIMAL_COMMA.has(lang)) v = v.replace(/(\d)\.(\d)/g, '$1,$2')
  return `${v} ${UNITS[unit][lang]}`
}

/** Translations of the hand-written facts (approved wording; reviewed by Yakiv for ru/uk). Loaded lazily by callers that need them. */
import { FACT_I18N } from './facts-i18n'

/** Text of one fact in one language. Throws (build error) on an unknown id, a missing short form or a missing translation. */
export function factText(id: string, lang: FactLang = 'en', form: 'display' | 'short' = 'display', where = 'text'): string {
  const f = FACTS[id]
  if (!f) throw new Error(`[facts] unknown fact "${id}" in ${where}`)
  if (form === 'short' && !f.short) throw new Error(`[facts] fact "${id}" has no short form (used as {{fact:${id}|short}} in ${where})`)
  if (lang === 'en') return form === 'short' ? f.short! : f.display
  if (TABLE_FACT.test(id)) return tableDisplay(f, lang)
  const t = FACT_I18N[lang]?.[id]
  const text = form === 'short' ? t?.short : t?.display
  if (!text) throw new Error(`[facts] no ${lang} translation${form === 'short' ? ' (short form)' : ''} for fact "${id}" in ${where} — add it to src/data/science/facts-i18n.ts`)
  return f.vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => f.vars![k] ?? m) : text
}

const FACT_RE = /\{\{fact:([a-zA-Z0-9.\-]+)(\|short)?\}\}/g

/** Replace every {{fact:id}} / {{fact:id|short}} in text. Unknown id, unapproved fact or missing translation → throws, so builds fail loudly. */
export function resolveFacts(text: string, where = 'text', lang: FactLang = 'en'): string {
  if (!text || text.indexOf('{{fact:') < 0) return text
  return text.replace(FACT_RE, (_m, id: string, short?: string) => {
    const f = FACTS[id]
    if (f && f.status !== 'approved') throw new Error(`[facts] fact "${id}" is not approved (used in ${where})`)
    return factText(id, lang, short ? 'short' : 'display', where)
  })
}

/** Resolve facts in every string of a JSON-like value (articles, FAQs, glossary terms, locale files). */
export function resolveFactsDeep<T>(value: T, where: string, lang: FactLang = 'en'): T {
  if (typeof value === 'string') return resolveFacts(value, where, lang) as unknown as T
  if (Array.isArray(value)) return value.map((v, i) => resolveFactsDeep(v, `${where}[${i}]`, lang)) as unknown as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = resolveFactsDeep(v, `${where}.${k}`, lang)
    return out as T
  }
  return value
}
