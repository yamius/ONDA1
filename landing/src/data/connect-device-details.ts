/**
 * /connect/<device> — maker definitions, composite-score inputs and independent accuracy checks
 * (task 071 step 2c, source: onda-evidence digest 072 R7-A, snapshot 2026-10-11; P269, P270, B8).
 *
 * Rules:
 *  - `quote` strings are VERBATIM from the maker's page (English in every language).
 *  - Numbers only via {{fact:<id>}} (src/data/science/facts.ts). A paragraph/item that references a
 *    fact that is not `approved` (or has no translation in the page language) is NOT rendered —
 *    the same publish gate as science pages (see `connectTextReady`).
 *  - Weights of composite scores: never invented — "not disclosed" unless the maker publishes them.
 *  - Independent studies and maker-funded / affiliated studies are separate lists.
 *  - Devices not covered by digest 072 (RingConn, Amazfit) have no entry.
 */
import { FACTS, factText, resolveFacts, type FactLang } from './science/facts'
import type { SourceLink } from './connect-devices'

export const CONNECT_ACCESSED = '2026-10-11'

export interface ConnectQuote {
  quote: string
  source: SourceLink
}

export interface AccuracyItem {
  text: string
  /** Label "single study" next to the item. */
  single?: boolean
  cite: SourceLink
}

export interface ConnectDeviceDetail {
  /** Metric + window in our words (no numbers outside {{fact:}}). */
  hrvSummary: string
  hrvQuotes: ConnectQuote[]
  /** Name of the maker's composite score; omitted when the maker has none. */
  compositeName?: string
  composite: string
  compositeQuotes: ConnectQuote[]
  independent: AccuracyItem[]
  /** Shown when no independent HRV validation was found. */
  independentNone?: string
  affiliated: AccuracyItem[]
}

const DIAL: SourceLink = { label: 'Dial 2025, Physiological Reports', url: 'https://doi.org/10.14814/phy2.70527' }
const CAO: SourceLink = { label: 'Cao 2022, Journal of Medical Internet Research', url: 'https://doi.org/10.2196/27487' }
const BELLENGER21: SourceLink = { label: 'Bellenger 2021, Sensors', url: 'https://doi.org/10.3390/s21103571' }
const BELLENGER22: SourceLink = { label: 'Bellenger 2022, Sensors', url: 'https://doi.org/10.3390/s22186723' }
const NASR: SourceLink = { label: 'Nasr 2025, Digital Health', url: 'https://doi.org/10.1177/20552076251394960' }
const LAMBE: SourceLink = { label: 'Lambe 2026, PLOS One', url: 'https://doi.org/10.1371/journal.pone.0356808' }
const NATARAJAN: SourceLink = { label: 'Natarajan 2020, Lancet Digital Health', url: 'https://doi.org/10.1016/S2589-7500(20)30246-6' }
const SARHADDI: SourceLink = { label: 'Sarhaddi 2022, PLOS One', url: 'https://doi.org/10.1371/journal.pone.0268361' }
const BONNEVAL: SourceLink = { label: 'Bonneval 2025, Sensors', url: 'https://doi.org/10.3390/s25082380' }

const OURA_HRV: SourceLink = { label: 'Oura Help: Heart Rate Variability', url: 'https://support.ouraring.com/hc/en-us/articles/360025441974-Heart-Rate-Variability' }
const OURA_READINESS: SourceLink = { label: 'Oura Help: Readiness Contributors', url: 'https://support.ouraring.com/hc/en-us/articles/360057791533-Readiness-Contributors' }
const WHOOP_HRV: SourceLink = { label: 'WHOOP: Heart rate variability (The Locker)', url: 'https://www.whoop.com/us/en/thelocker/heart-rate-variability-hrv/' }
const WHOOP_RECOVERY: SourceLink = { label: 'WHOOP: How does Recovery work (The Locker)', url: 'https://www.whoop.com/us/en/thelocker/how-does-whoop-recovery-work-101/' }
const POLAR_MANUAL: SourceLink = { label: 'Polar Vantage V3 user manual: Nightly Recharge', url: 'https://support.polar.com/e_manuals/vantage-v3' }
const POLAR_HELP: SourceLink = { label: 'Polar Support: Nightly Recharge', url: 'https://support.polar.com/en/nightly-recharge-recovery-measurement' }
const GARMIN_HRV: SourceLink = { label: 'Garmin: HRV Status', url: 'https://www.garmin.com/en-US/garmin-technology/health-science/hrv-status/' }
const GARMIN_BB: SourceLink = { label: 'Garmin: Body Battery', url: 'https://www.garmin.com/en-US/garmin-technology/health-science/body-battery/' }
const GOOGLE_METRICS: SourceLink = { label: 'Google Health Help: health metrics', url: 'https://support.google.com/googlehealth/answer/14237107' }
const GOOGLE_READINESS: SourceLink = { label: 'Google Health Help: Readiness', url: 'https://support.google.com/googlehealth/answer/14236710' }
const SAMSUNG_STRESS: SourceLink = { label: 'Samsung Support: measuring stress', url: 'https://www.samsung.com/us/support/answer/ANS10001394/' }
const SAMSUNG_RING: SourceLink = { label: 'Samsung Support: Galaxy Ring sleep tracking', url: 'https://www.samsung.com/us/support/answer/ANS10003282/' }
const WITHINGS_HRV: SourceLink = { label: 'Withings Help: Nighttime HRV (Sleep Analyzer)', url: 'https://support.withings.com/hc/en-us/articles/35729517908881' }
const ULTRAHUMAN_HOW: SourceLink = { label: 'Ultrahuman: How it works (product page)', url: 'https://www.ultrahuman.com/us/how-it-works/' }
const APPLE_SDNN: SourceLink = { label: 'Apple Developer: heartRateVariabilitySDNN', url: 'https://developer.apple.com/documentation/healthkit/hkquantitytypeidentifier/heartratevariabilitysdnn' }
const APPLE_RECOVERY: SourceLink = { label: 'Apple Support: Monitor your heart rate with Apple Watch (HRV)', url: 'https://support.apple.com/en-us/120277' }

const DIAL_RANK = (who: string) =>
  `In a comparison of five wearables against an ECG reference during sleep ({{fact:study.dial2025.participants}}, {{fact:study.dial2025.nights}}), ${who}`

export const CONNECT_DEVICE_DETAILS: Record<string, ConnectDeviceDetail> = {
  oura: {
    hrvSummary:
      'Oura measures HRV only during sleep and samples it across the whole night. Its help page does not name the formula (RMSSD or another), so we record the metric as not disclosed.',
    hrvQuotes: [
      { quote: 'Oura measures HRV only during sleep to ensure the most reliable and interpretable data.', source: OURA_HRV },
      { quote: 'Oura takes {{fact:connect.oura.samples}}.', source: OURA_HRV },
    ],
    compositeName: 'Readiness',
    composite:
      'Oura names the contributors to Readiness: Resting Heart Rate, HRV Balance, Body Temperature, Recovery Index, Sleep, Sleep Balance, Sleep Regularity, Previous Day Activity and Activity Balance. Oura does not publish how much each contributor weighs.',
    compositeQuotes: [
      { quote: 'HRV Balance {{fact:connect.oura.hrvBalance}}.', source: OURA_READINESS },
    ],
    independent: [
      {
        text: 'Against an ECG at home overnight, the Oura Ring measured night-time heart rate and RMSSD accurately; the frequency-domain measures LF and LF:HF had high errors. The paper does not name the ring generation, and it predates Ring 4.',
        single: true,
        cite: CAO,
      },
      { text: 'The same study included {{fact:study.cao2022.participants}}.', single: true, cite: CAO },
      { text: `${DIAL_RANK('Oura Gen 3 and Gen 4 had the highest agreement with ECG for night-time HRV of the five devices.')}`, single: true, cite: DIAL },
      { text: 'Agreement of Oura Gen 3 and Gen 4 with ECG for night-time HRV in that comparison (concordance correlation coefficient): {{fact:study.dial2025.hrvCcc.oura}}.', single: true, cite: DIAL },
    ],
    affiliated: [],
  },
  whoop: {
    hrvSummary:
      'WHOOP names its HRV metric: RMSSD, in milliseconds. It is not measured across the whole night but during your deepest sleep.',
    hrvQuotes: [
      { quote: 'WHOOP calculates HRV using RMSSD, the root mean square of successive differences between heartbeats.', source: WHOOP_HRV },
      { quote: 'Rather than measuring HRV continuously, WHOOP calculates it during your deepest sleep each night — when your body is in its most stable state.', source: WHOOP_HRV },
    ],
    compositeName: 'Recovery',
    composite:
      'WHOOP lists the inputs of Recovery: HRV, resting heart rate, sleep and respiratory rate, plus blood oxygen and skin temperature. WHOOP does not publish how much each input weighs.',
    compositeQuotes: [
      { quote: 'HRV, Resting heart rate, Sleep & Respiratory Rate are all Factored into your daily recovery.', source: WHOOP_RECOVERY },
      { quote: 'Blood oxygen level and skin temperature are included in your recovery as well and can help provide a better understanding of when you may be ill.', source: WHOOP_RECOVERY },
    ],
    independent: [
      {
        text: 'Against an ECG, WHOOP heart rate showed acceptable agreement. For log-transformed RMSSD, the bias and limits of agreement approached or exceeded the metric’s own smallest worthwhile change, so the authors advise reading it against its own level of precision. The study used an older WHOOP generation, not WHOOP 4.0 or MG.',
        single: true,
        cite: BELLENGER21,
      },
      { text: `${DIAL_RANK('WHOOP 4.0 had high agreement with ECG for night-time HRV, below Oura Gen 3 and Gen 4.')}`, single: true, cite: DIAL },
      { text: 'Agreement of WHOOP 4.0 with ECG for night-time HRV in that comparison (concordance correlation coefficient): {{fact:study.dial2025.hrvCcc.whoop}}.', single: true, cite: DIAL },
    ],
    affiliated: [
      {
        text: 'A study of day-to-day variability of WHOOP-derived HRV in athletes (reliability, not accuracy against ECG), from a research group supported by WHOOP.',
        cite: BELLENGER22,
      },
    ],
  },
  polar: {
    hrvSummary:
      'Polar shows night-time HRV through the ANS charge part of Nightly Recharge, built from HRV and breathing rate and compared with your own usual level. Per Polar’s help, HRV is RMSSD, measured over roughly the first hours of sleep; the HRV field in Polar’s developer API is not explicitly named RMSSD. Polar does not publish population values.',
    hrvQuotes: [
      { quote: 'is measured with a parameter called RMSSD', source: POLAR_HELP },
      { quote: 'measured during roughly the first four hours of your sleep', source: POLAR_HELP },
      { quote: 'Both components are formed by comparing your last night to your usual levels from {{fact:connect.polar.baselineWindow}}.', source: POLAR_MANUAL },
    ],
    compositeName: 'Nightly Recharge',
    composite:
      'Polar names the two parts of Nightly Recharge: sleep charge (your sleep compared with your usual) and ANS charge (HRV and breathing rate compared with your usual). Polar does not publish the exact formula or weights.',
    compositeQuotes: [],
    independent: [
      { text: `${DIAL_RANK('the Polar Grit X Pro watch had the lowest agreement with ECG for night-time HRV of the five devices.')}`, single: true, cite: DIAL },
      { text: 'Agreement of the Polar Grit X Pro with ECG for night-time HRV in that comparison (concordance correlation coefficient): {{fact:study.dial2025.hrvCcc.polar}}.', single: true, cite: DIAL },
    ],
    independentNone:
      'We found no independent study that checks HRV from a Polar watch against an ECG on its own. Polar’s chest straps are a different device and are not covered here.',
    affiliated: [],
  },
  garmin: {
    hrvSummary:
      'Garmin names its HRV metric: RMSSD. HRV Status is measured automatically while you sleep and is read against a personal baseline range built from your own measurement history.',
    hrvQuotes: [
      { quote: 'RMSSD is a standard statistical measure of HRV. It represents the root mean square of successive differences between normal heartbeats for a given set of heartbeat data.', source: GARMIN_HRV },
      { quote: 'Simply wear your device to bed and the analysis automatically occurs.', source: GARMIN_HRV },
    ],
    compositeName: 'Body Battery',
    composite:
      'Garmin describes Body Battery only in categories: physical activity, stress, rest and sleep. Whether HRV feeds into it directly, and how much each part weighs, is not disclosed.',
    compositeQuotes: [
      { quote: 'Body Battery energy monitoring makes the combined influences of physical activity, stress, rest and the restorative power of sleep visible in a powerful way.', source: GARMIN_BB },
    ],
    independent: [
      { text: `${DIAL_RANK('a Garmin Fenix 6 had lower agreement with ECG for night-time HRV than Oura and WHOOP.')}`, single: true, cite: DIAL },
      { text: 'Agreement of the Garmin Fenix 6 with ECG for night-time HRV in that comparison (concordance correlation coefficient): {{fact:study.dial2025.hrvCcc.garmin}}.', single: true, cite: DIAL },
    ],
    independentNone: 'We found no independent study that checks Garmin HRV Status itself against an ECG.',
    affiliated: [],
  },
  fitbit: {
    hrvSummary:
      'Google’s help page lists HRV among the night-time health metrics in the Google Health app, but does not name the formula, so we record the metric as not disclosed.',
    hrvQuotes: [
      { quote: 'In certain regions, you can track health metrics like breathing rate, heart-rate variability, and resting heart rate in the Google Health app.', source: GOOGLE_METRICS },
    ],
    compositeName: 'Readiness',
    composite:
      'Google names three inputs of Readiness: HRV, recent sleep and resting heart rate. It does not publish how much each weighs.',
    compositeQuotes: [
      { quote: 'It combines insights from your heart rate variability (HRV), recent sleep, and resting heart rate (RHR).', source: GOOGLE_READINESS },
    ],
    independent: [
      {
        text: 'In a small pilot study, night-time HRV from the Fitbit Versa 4 showed strong correlation and acceptable agreement with an ECG-based reference.',
        single: true,
        cite: NASR,
      },
      { text: 'It was a pilot study with {{fact:study.nasr2025.participants}}.', single: true, cite: NASR },
    ],
    affiliated: [
      { text: 'A Google-funded study of the Pixel Watch 3 checked heart rate, not HRV.', cite: LAMBE },
      { text: 'Fitbit-funded population data on HRV by age (a description of Fitbit users, not a check of accuracy).', cite: NATARAJAN },
    ],
  },
  samsung: {
    hrvSummary:
      'Samsung’s help pages do not name the HRV metric or the time window. The Galaxy Ring sleep page lists heart rate, blood oxygen and skin temperature, without HRV.',
    hrvQuotes: [
      { quote: 'you can measure your stress levels by checking your heart rate and some other factors', source: SAMSUNG_STRESS },
      { quote: "The Galaxy Ring can track your sleep patterns by measuring your heart rate, blood oxygen, and skin temperature while you're sleeping.", source: SAMSUNG_RING },
    ],
    compositeName: 'Energy Score',
    composite:
      'Samsung describes Energy Score only in a newsroom article, not on a help page, and only in categories (sleep, activity and similar). Whether HRV is an input, and the weights, are not disclosed.',
    compositeQuotes: [],
    independent: [
      {
        text: 'Over a full day and night of free living against an ECG, an older Samsung smartwatch (Gear Sport) gave acceptable heart rate and time-domain HRV during sleep; while awake, most HRV measures had high errors. Current Galaxy Watch and Galaxy Ring models were not tested.',
        single: true,
        cite: SARHADDI,
      },
    ],
    affiliated: [],
  },
  withings: {
    hrvSummary:
      'Withings says HRV is measured during sleep and given in milliseconds, but its help page does not name the formula, so we record the metric as not disclosed.',
    hrvQuotes: [
      { quote: 'HRV is measured in milliseconds (ms)', source: WITHINGS_HRV },
    ],
    composite:
      'We found no Withings composite readiness score on its help pages: the Withings app shows the individual measurements.',
    compositeQuotes: [],
    independent: [],
    independentNone: 'We found no independent study that checks Withings HRV against an ECG.',
    affiliated: [],
  },
  ultrahuman: {
    hrvSummary:
      'Ultrahuman says the ring reads HRV overnight and compares each night with your own range. It does not name the formula, so we record the metric as not disclosed. These quotes come from a product page, not a help page.',
    hrvQuotes: [
      { quote: 'The Ring reads it overnight, when conditions are most repeatable, and compares each night against the range it has learned from your own.', source: ULTRAHUMAN_HOW },
    ],
    compositeName: 'Dynamic Recovery',
    composite:
      'Ultrahuman lists the inputs of Recovery: heart rate, HRV, temperature and the last night’s sleep, each against your own baseline. It does not publish how much each weighs.',
    compositeQuotes: [
      { quote: "Recovery dips and you see exactly which one moved: heart rate, HRV, temperature or last night's sleep. Each one is measured against your own baseline, not a population average.", source: ULTRAHUMAN_HOW },
    ],
    independent: [],
    independentNone: 'We found no independent study that checks Ultrahuman ring HRV against an ECG.',
    affiliated: [],
  },
  'apple-watch': {
    hrvSummary:
      'Apple Health stores HRV as SDNN. Apple Watch takes HRV readings (SDNN) in the background at various times of day and night; it is not a dedicated overnight measurement. Newer models also show Recovery HRV.',
    hrvQuotes: [
      { quote: 'While there are multiple ways of computing HRV, HealthKit uses SDNN heart rate variability, which uses the standard deviation of the inter-beat (RR) intervals between normal heartbeats (typically measured in milliseconds). The system automatically records samples on Apple Watch.', source: APPLE_SDNN },
      { quote: "HRV is sampled while you're still, so the number of measurements you see will vary according to your activity level.", source: APPLE_RECOVERY },
    ],
    composite: 'Apple Watch has no single readiness-style score built from HRV, so there are no weights to disclose.',
    compositeQuotes: [],
    independent: [
      {
        text: 'Against a laboratory ECG at rest, an Apple Watch Series 6 showed moderate agreement for the intervals between heartbeats used to compute HRV. Recovery HRV on newer models has not been checked independently.',
        single: true,
        cite: BONNEVAL,
      },
      { text: 'For the Apple Watch Series 6 at rest, in the lab ({{fact:study.bonneval2025.participants}}), the mean absolute percentage error for those intervals was {{fact:study.bonneval2025.mapeRest}}.', single: true, cite: BONNEVAL },
    ],
    affiliated: [],
  },
}

const FACT_ID = /\{\{fact:([a-zA-Z0-9.\-]+)(\|short)?\}\}/g

/** True when every {{fact:}} in text is approved and has a text in `lang` — otherwise the item is not published. */
export function connectTextReady(text: string, lang: FactLang = 'en'): boolean {
  for (const m of text.matchAll(FACT_ID)) {
    const f = FACTS[m[1]]
    if (!f || f.status !== 'approved') return false
    try {
      factText(m[1], lang, m[2] ? 'short' : 'display')
    } catch {
      return false
    }
  }
  return true
}

/** Resolve facts for a text that passed connectTextReady. */
export function connectText(text: string, lang: FactLang = 'en', where = 'connect'): string {
  return resolveFacts(text, where, lang)
}

/** Fact ids referenced by the device details (for the report / checks). */
export function connectDetailFactIds(): string[] {
  const ids = new Set<string>()
  const scan = (s: string) => { for (const m of s.matchAll(FACT_ID)) ids.add(m[1]) }
  for (const d of Object.values(CONNECT_DEVICE_DETAILS)) {
    scan(d.hrvSummary); scan(d.composite)
    for (const q of [...d.hrvQuotes, ...d.compositeQuotes]) scan(q.quote)
    for (const a of [...d.independent, ...d.affiliated]) scan(a.text)
  }
  return [...ids]
}

/**
 * B8 (owner 2026-10-11, option 2): "measurement window / metric per vendor docs" column on /connect
 * and the localized hubs. Data: digest 072 (snapshot 2026-10-11). Localized texts: connect-i18n `window`.
 */
export const CONNECT_WINDOW_METRIC: Record<string, { text: string; source?: SourceLink }> = {
  oura: { text: 'During sleep, sampled through the night; metric not named', source: OURA_HRV },
  whoop: { text: 'RMSSD, during deepest sleep', source: WHOOP_HRV },
  polar: { text: 'RMSSD, roughly the first hours of sleep, vs your usual level', source: POLAR_HELP },
  garmin: { text: 'RMSSD, overnight, vs your personal baseline', source: GARMIN_HRV },
  fitbit: { text: 'Night-time; metric not named', source: GOOGLE_METRICS },
  samsung: { text: 'Not disclosed on Samsung help pages' },
  withings: { text: 'During sleep, in ms; metric not named', source: WITHINGS_HRV },
  ultrahuman: { text: 'Overnight, vs your own range; metric not named (product page)', source: ULTRAHUMAN_HOW },
  ringconn: { text: 'Not reviewed yet' },
  amazfit: { text: 'Not reviewed yet' },
  'apple-watch': { text: 'SDNN, background readings at various times of day and night; not a dedicated overnight measurement', source: APPLE_RECOVERY },
}
