/**
 * Apple Health export.xml → small daily aggregates (task 082 B2).
 *
 * Pure and dependency-free so it runs in the Web Worker and in Node tests alike. It never keeps a
 * record after it has been folded into a day: memory is O(days × sources), not O(file).
 *
 * Only three record types are read:
 *   HKQuantityTypeIdentifierHeartRateVariabilitySDNN  (ms, daytime Apple Watch samples)
 *   HKQuantityTypeIdentifierRestingHeartRate          (count/min)
 *   HKCategoryTypeIdentifierSleepAnalysis              (iOS 16+ stages and the older InBed/Asleep)
 * Everything else in the file is skipped at the attribute check.
 */

export const T_HRV = 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN'
export const T_RHR = 'HKQuantityTypeIdentifierRestingHeartRate'
export const T_SLEEP = 'HKCategoryTypeIdentifierSleepAnalysis'

/** Sleep values that count as "asleep". InBed and Awake do not. */
const ASLEEP = new Set([
  'HKCategoryValueSleepAnalysisAsleep', // before iOS 16
  'HKCategoryValueSleepAnalysisAsleepUnspecified',
  'HKCategoryValueSleepAnalysisAsleepCore',
  'HKCategoryValueSleepAnalysisAsleepDeep',
  'HKCategoryValueSleepAnalysisAsleepREM',
])
const IN_BED = 'HKCategoryValueSleepAnalysisInBed'

export interface DayAgg {
  hrvSum: number
  hrvN: number
  rhrSum: number
  rhrN: number
}

interface SourceAcc {
  watch: boolean
  days: Map<string, DayAgg>
  /** [startMs, endMs, wakeDay] for asleep segments; InBed kept apart as a fallback. */
  asleep: Array<[number, number, string]>
  inBed: Array<[number, number, string]>
}

export interface SeriesDay {
  day: string // YYYY-MM-DD as written in the file (the phone's local date)
  hrv?: number // daily mean SDNN, ms
  hrvN?: number
  rhr?: number // daily mean resting HR, bpm
  sleepH?: number // hours asleep for the night that ENDED on this day
  sleepFromInBed?: boolean
}

export interface SourceSeries {
  key: string // 'watch' or the source name
  label: string
  watch: boolean
  days: SeriesDay[]
}

export interface AnalysisResult {
  watch: SourceSeries | null
  others: SourceSeries[]
  counts: { hrv: number; rhr: number; sleep: number }
}

const WATCH_DEVICE = /model:Watch/i
const WATCH_NAME = /watch/i

/** "2026-10-10 03:12:40 +0300" → epoch ms. NaN when malformed. */
export function parseAppleDate(s: string): number {
  if (!s || s.length < 19) return NaN
  const tz = s.slice(20).trim() // +0300
  const iso = `${s.slice(0, 10)}T${s.slice(11, 19)}${tz.length === 5 ? `${tz.slice(0, 3)}:${tz.slice(3)}` : 'Z'}`
  return Date.parse(iso)
}

export class Aggregator {
  private sources = new Map<string, SourceAcc>()
  counts = { hrv: 0, rhr: 0, sleep: 0 }

  private acc(name: string): SourceAcc {
    let a = this.sources.get(name)
    if (!a) {
      a = { watch: false, days: new Map(), asleep: [], inBed: [] }
      this.sources.set(name, a)
    }
    return a
  }

  private day(a: SourceAcc, d: string): DayAgg {
    let x = a.days.get(d)
    if (!x) {
      x = { hrvSum: 0, hrvN: 0, rhrSum: 0, rhrN: 0 }
      a.days.set(d, x)
    }
    return x
  }

  /** Feed one <Record> element's attributes. Unknown types are ignored. */
  record(attr: Record<string, string>): void {
    const type = attr.type
    if (type !== T_HRV && type !== T_RHR && type !== T_SLEEP) return
    const src = attr.sourceName || 'Unknown source'
    const a = this.acc(src)
    if (!a.watch && ((attr.device && WATCH_DEVICE.test(attr.device)) || WATCH_NAME.test(src))) a.watch = true
    const start = attr.startDate || ''
    if (type === T_SLEEP) {
      const v = attr.value
      const isAsleep = ASLEEP.has(v)
      if (!isAsleep && v !== IN_BED) return
      const s = parseAppleDate(start)
      const e = parseAppleDate(attr.endDate || '')
      if (!(e > s) || e - s > 24 * 3600e3) return
      const wakeDay = (attr.endDate || '').slice(0, 10)
      ;(isAsleep ? a.asleep : a.inBed).push([s, e, wakeDay])
      this.counts.sleep++
      return
    }
    const val = Number(attr.value)
    if (!Number.isFinite(val) || val <= 0) return
    const d = start.slice(0, 10)
    if (d.length !== 10) return
    const x = this.day(a, d)
    if (type === T_HRV) {
      if (val > 400) return
      x.hrvSum += val
      x.hrvN++
      this.counts.hrv++
    } else {
      if (val > 250) return
      x.rhrSum += val
      x.rhrN++
      this.counts.rhr++
    }
  }

  result(): AnalysisResult {
    const watchAccs: SourceAcc[] = []
    const others: SourceSeries[] = []
    for (const [name, a] of this.sources) {
      if (a.watch) watchAccs.push(a)
      else {
        const s = toSeries([a], name, name, false)
        if (s.days.length) others.push(s)
      }
    }
    const watch = watchAccs.length ? toSeries(watchAccs, 'watch', 'Apple Watch', true) : null
    others.sort((x, y) => y.days.length - x.days.length)
    return { watch: watch && watch.days.length ? watch : null, others, counts: { ...this.counts } }
  }
}

/** Total length of the union of intervals (so overlapping stage records never double-count). */
function unionMs(list: Array<[number, number, string]>): number {
  if (!list.length) return 0
  const s = [...list].sort((a, b) => a[0] - b[0])
  let total = 0
  let [cs, ce] = s[0]
  for (let i = 1; i < s.length; i++) {
    const [a, b] = s[i]
    if (a <= ce) ce = Math.max(ce, b)
    else {
      total += ce - cs
      cs = a
      ce = b
    }
  }
  return total + (ce - cs)
}

function byDay(list: Array<[number, number, string]>): Map<string, Array<[number, number, string]>> {
  const m = new Map<string, Array<[number, number, string]>>()
  for (const it of list) {
    const k = it[2]
    const arr = m.get(k)
    if (arr) arr.push(it)
    else m.set(k, [it])
  }
  return m
}

function toSeries(accs: SourceAcc[], key: string, label: string, watch: boolean): SourceSeries {
  const days = new Map<string, SeriesDay>()
  const get = (d: string) => {
    let x = days.get(d)
    if (!x) {
      x = { day: d }
      days.set(d, x)
    }
    return x
  }
  const merged = new Map<string, DayAgg>()
  for (const a of accs) {
    for (const [d, v] of a.days) {
      const m = merged.get(d) ?? { hrvSum: 0, hrvN: 0, rhrSum: 0, rhrN: 0 }
      m.hrvSum += v.hrvSum
      m.hrvN += v.hrvN
      m.rhrSum += v.rhrSum
      m.rhrN += v.rhrN
      merged.set(d, m)
    }
  }
  for (const [d, v] of merged) {
    if (v.hrvN) {
      get(d).hrv = v.hrvSum / v.hrvN
      get(d).hrvN = v.hrvN
    }
    if (v.rhrN) get(d).rhr = v.rhrSum / v.rhrN
  }
  const asleep = byDay(accs.flatMap((a) => a.asleep))
  const inBed = byDay(accs.flatMap((a) => a.inBed))
  for (const [d, list] of asleep) {
    const h = unionMs(list) / 3600e3
    if (h > 0) get(d).sleepH = h
  }
  // Old nights with only InBed (no Asleep record at all) — shown, but marked as time in bed.
  for (const [d, list] of inBed) {
    if (asleep.has(d)) continue
    const h = unionMs(list) / 3600e3
    if (h > 0) {
      get(d).sleepH = h
      get(d).sleepFromInBed = true
    }
  }
  return { key, label, watch, days: [...days.values()].sort((a, b) => (a.day < b.day ? -1 : 1)) }
}

// ── Personal range (runs on the main thread, on the aggregates only) ────────────────────────────

export const NORM = { recentDays: 7, refDays: 60, minRefDays: 14 } as const

export interface PersonalNorm {
  ok: boolean
  refN: number
  low?: number
  high?: number
  mean?: number
  recentMean?: number
  refFrom?: string
  refTo?: string
  recentFrom?: string
  recentTo?: string
}

const dayMs = 86400e3
const toMs = (d: string) => Date.parse(`${d}T00:00:00Z`)
const fromMs = (ms: number) => new Date(ms).toISOString().slice(0, 10)

/**
 * Usual range = mean ± 1 SD of the daily averages in the 60 days that END where the last 7 days
 * begin (so "now" is never compared with itself). Needs ≥14 days with readings, otherwise no range.
 */
export function personalNorm(days: SeriesDay[], pick: (d: SeriesDay) => number | undefined): PersonalNorm {
  const withVal = days.filter((d) => pick(d) !== undefined)
  if (!withVal.length) return { ok: false, refN: 0 }
  const last = toMs(withVal[withVal.length - 1].day)
  const recentFromMs = last - (NORM.recentDays - 1) * dayMs
  const refFromMs = recentFromMs - NORM.refDays * dayMs
  const recent = withVal.filter((d) => toMs(d.day) >= recentFromMs).map((d) => pick(d)!)
  const ref = withVal.filter((d) => toMs(d.day) < recentFromMs && toMs(d.day) >= refFromMs).map((d) => pick(d)!)
  const recentMean = recent.length ? recent.reduce((s, v) => s + v, 0) / recent.length : undefined
  const base = {
    refN: ref.length,
    recentMean,
    refFrom: fromMs(refFromMs),
    refTo: fromMs(recentFromMs - dayMs),
    recentFrom: fromMs(recentFromMs),
    recentTo: fromMs(last),
  }
  if (ref.length < NORM.minRefDays) return { ok: false, ...base }
  const mean = ref.reduce((s, v) => s + v, 0) / ref.length
  const sd = Math.sqrt(ref.reduce((s, v) => s + (v - mean) ** 2, 0) / (ref.length - 1))
  return { ok: true, ...base, mean, low: mean - sd, high: mean + sd }
}

/** Rolling mean over the previous `w` calendar days (inclusive) for each day that has a value. */
export function rolling(days: SeriesDay[], pick: (d: SeriesDay) => number | undefined, w = 7): Array<[string, number]> {
  const pts = days.filter((d) => pick(d) !== undefined).map((d) => [toMs(d.day), pick(d)!] as const)
  const out: Array<[string, number]> = []
  let j = 0
  let sum = 0
  for (let i = 0; i < pts.length; i++) {
    sum += pts[i][1]
    while (pts[j][0] < pts[i][0] - (w - 1) * dayMs) sum -= pts[j++][1]
    out.push([fromMs(pts[i][0]), sum / (i - j + 1)])
  }
  return out
}
