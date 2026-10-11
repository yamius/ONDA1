/**
 * /connect/apple-health/file — analyse an Apple Health export IN THE BROWSER (task 082 B2). EN only.
 *
 * Load-bearing, do not soften:
 *  1. NO third-party script. The route renders outside Layout (no Reddit route tracker, no
 *     app_store_click listener), prerender.ts strips GTM/Reddit from its HTML (SCRIPT_FREE_ROUTES) and
 *     vercel.json sends a strict CSP for this path: connect-src 'none', script-src 'self',
 *     worker-src 'self'. The browser itself refuses any network request from this page.
 *  2. The file is read in chunks by a Web Worker (src/workers/appleHealth.worker.ts) and never leaves
 *     the device. Only daily aggregates come back. Nothing is written to localStorage /
 *     sessionStorage / IndexedDB — reload and it is gone.
 *  3. No event, no error reporting. An error is shown to the person as a code + byte offset only.
 *  4. No peer comparison, no verdict, no manufacturer score, no medical claim. HRV is labelled
 *     exactly "HRV (SDNN), Apple Watch background readings" — never "nightly" or "daytime".
 *  5. Links out are plain <a href> (full page load): a client-side hop would carry this document's
 *     state into a page that has GTM, or bring GTM's document into this one.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import {
  NORM,
  SLEEP_WIDE_RANGE_H,
  sleepRangeIsWide,
  personalNorm,
  rolling,
  type AnalysisResult,
  type PersonalNorm,
  type SeriesDay,
  type SourceSeries,
} from '../lib/apple-health/aggregate'
import type { ErrorCode, WorkerOut } from '../workers/appleHealth.worker'
import { APPLE_HEALTH_FILE_META } from '../data/apple-health-file'


const HRV_LABEL = 'HRV (SDNN), Apple Watch background readings'
const WHY_LOW = '/science/questions/why-is-my-hrv-low'
const CHART_DAYS = 180

const ERROR_TEXT: Record<ErrorCode, string> = {
  E_TYPE: 'This does not look like an Apple Health export. Choose export.zip or export.xml.',
  E_ZIP: 'The ZIP archive could not be unpacked. Try exporting again, or unzip it and choose export.xml.',
  E_NO_XML: 'No export.xml was found inside this ZIP.',
  E_XML: 'The XML could not be read.',
  E_NOT_HEALTH: 'This XML file is not an Apple Health export (no HealthData).',
  E_READ: 'The file could not be read.',
}

type Phase =
  | { k: 'idle' }
  | { k: 'run'; read: number; total: number }
  | { k: 'done'; result: AnalysisResult; ms: number }
  | { k: 'error'; code: ErrorCode; offset: number }

const mb = (b: number) => `${(b / 1048576).toFixed(b < 10 * 1048576 ? 1 : 0)} MB`
const r0 = (v: number) => Math.round(v)
const r1 = (v: number) => (Math.round(v * 10) / 10).toFixed(1)

const spawn = () => new Worker(new URL('../workers/appleHealth.worker.ts', import.meta.url), { type: 'module' })

export function AppleHealthFilePage() {
  const [phase, setPhase] = useState<Phase>({ k: 'idle' })
  const [others, setOthers] = useState(false)
  const worker = useRef<Worker | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const running = useRef<Worker | null>(null)

  useEffect(() => {
    document.title = APPLE_HEALTH_FILE_META.title
    // Arrived by a client-side hop from a page that had GTM? Reload so this document is clean.
    if ((window as unknown as { google_tag_manager?: unknown }).google_tag_manager) window.location.reload()
    // Spawn the worker up front, so choosing a file triggers no request at all (not even for the
    // worker's own script).
    worker.current = spawn()
    return () => {
      worker.current?.terminate()
      running.current?.terminate()
    }
  }, [])

  const start = (file: File | undefined) => {
    if (!file) return
    const w = worker.current ?? spawn()
    worker.current = null
    running.current = w
    setPhase({ k: 'run', read: 0, total: file.size })
    w.onmessage = (ev: MessageEvent<WorkerOut>) => {
      const m = ev.data
      if (m.type === 'progress') setPhase({ k: 'run', read: m.read, total: m.total })
      else if (m.type === 'done') {
        setPhase({ k: 'done', result: m.result, ms: m.ms })
        keep(w)
      } else {
        setPhase({ k: 'error', code: m.code, offset: m.offset })
        keep(w)
      }
    }
    w.onerror = () => {
      setPhase({ k: 'error', code: 'E_READ', offset: 0 })
      recycle(w)
    }
    w.postMessage({ type: 'start', file })
  }

  /** A worker that finished is reused for the next file (its aggregates are per message), so a second
   *  analysis needs no request either. */
  const keep = (w: Worker) => {
    running.current = null
    worker.current = w
  }

  /** A cancelled or crashed worker is dropped (its memory goes with it) and a fresh one is ready. */
  const recycle = (w: Worker | null) => {
    w?.terminate()
    worker.current?.terminate()
    worker.current = spawn()
  }

  const cancel = () => {
    recycle(running.current)
    if (input.current) input.current.value = ''
    setPhase({ k: 'idle' })
  }

  return (
    <div className="min-h-screen bg-[#050a0f] text-white">
      <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
        <nav className="pt-6 font-mono text-xs text-white/50" aria-label="Breadcrumb">
          <a href="/" className="hover:underline">ONDA</a> / <a href="/connect" className="hover:underline">Devices</a> /{' '}
          <a href="/connect/apple-watch" className="hover:underline">Apple Watch</a> / Apple Health file
        </nav>
        <header className="border-b border-white/10 pt-4 pb-8">
          <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">READ ON YOUR DEVICE</div>
          <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">{APPLE_HEALTH_FILE_META.h1}</h1>
          <p className="font-mono text-sm leading-relaxed text-white/80 md:text-base">
            Choose your Apple Health export and see your HRV, resting heart rate and sleep against your own usual range.
            The file is read inside this browser tab. <strong className="text-white">It never leaves your device</strong>:
            nothing is uploaded, and nothing is saved.
          </p>
        </header>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-bold">How to get the file</h2>
          <ol className="list-decimal space-y-2 pl-5 font-mono text-sm leading-relaxed text-white/75">
            <li>On your iPhone, open the <strong className="text-white">Health</strong> app.</li>
            <li>Tap your <strong className="text-white">profile picture</strong> (top right).</li>
            <li>Tap <strong className="text-white">Export All Health Data</strong>, then Export. A long history can take a few minutes.</li>
            <li>Save <code>export.zip</code> to Files (or AirDrop it to your computer).</li>
            <li>Choose it below. The ZIP or the unpacked <code>export.xml</code> both work.</li>
          </ol>
        </section>

        <section className="mt-8 rounded-xl border border-terminal-green/25 bg-terminal-green/[0.04] p-5">
          {phase.k === 'run' ? (
            <div aria-live="polite">
              <div className="mb-2 font-mono text-sm text-white/80">
                Reading… {mb(phase.read)} of {mb(phase.total)}
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-white/10">
                <div className="h-full bg-terminal-green transition-[width]" style={{ width: `${phase.total ? (100 * phase.read) / phase.total : 0}%` }} />
              </div>
              <button type="button" onClick={cancel} className="mt-4 rounded-lg border border-white/30 px-4 py-2 font-mono text-sm hover:bg-white/10">
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <label className="inline-block cursor-pointer rounded-lg bg-terminal-green px-5 py-3 font-mono text-sm font-semibold text-[#080c16] hover:opacity-90">
                Choose file
                <input
                  ref={input}
                  type="file"
                  accept=".zip,.xml,application/zip,text/xml,application/xml"
                  className="sr-only"
                  onChange={(e) => start(e.target.files?.[0])}
                />
              </label>
              <p className="mt-3 font-mono text-xs leading-relaxed text-white/55">
                export.zip or export.xml. Read in small pieces by your browser; this page is not allowed to make any network
                request. Reload the page and the results are gone.
              </p>
              {phase.k === 'error' && (
                <p className="mt-3 font-mono text-sm text-amber-300" role="alert">
                  {ERROR_TEXT[phase.code]} <span className="text-white/50">(code {phase.code}, at byte {phase.offset})</span>
                </p>
              )}
            </div>
          )}
        </section>

        {phase.k === 'done' && <Results result={phase.result} ms={phase.ms} others={others} setOthers={setOthers} />}

        <section className="mt-12">
          <h2 className="mb-3 text-xl font-bold">How the usual range is worked out</h2>
          <div className="space-y-3 font-mono text-sm leading-relaxed text-white/70">
            <p>
              For each day we average that day’s readings. “Last {NORM.recentDays} days” is the average of the most recent{' '}
              {NORM.recentDays} days in the file. Your usual range is the average ± one standard deviation of the{' '}
              {NORM.refDays} days before them, so the recent days are never compared with themselves. With fewer than{' '}
              {NORM.minRefDays} days of readings in that window we show no range. “Days outside your usual range” looks only
              at those last {NORM.recentDays} days, never at the days the range was built from. For sleep, if the range is
              wider than {SLEEP_WIDE_RANGE_H} hours we say so: it then tells you little about any one night.
            </p>
            <p>
              The range is yours alone: no comparison with other people, and no medical meaning. Apple Watch takes HRV
              readings (SDNN) in the background at various times of day and night; it is not a dedicated overnight measurement.
              Sleep is the time Apple Health marks as asleep (core, deep, REM or the older “asleep”) for the night that
              ended on that day; overlapping records are counted once.
            </p>
            <p>Only Apple Watch records are used unless you turn on other sources. Each source is shown on its own, never mixed.</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-3 text-2xl font-bold">Every day, and with breathing practices — in the ONDA app</h2>
        </section>
        <AppStoreCTA ct={storeCt('connect', 'file_apple')} variant="tool" lang="en" className="!mt-4" />

        <p className="mt-8 font-mono text-xs leading-relaxed text-white/40">
          Not a medical device and not medical advice. Apple Health and Apple Watch are trademarks of Apple Inc.; ONDA is
          not affiliated with or endorsed by Apple. <a href="/privacy" className="hover:underline">Privacy</a>
        </p>
      </main>
    </div>
  )
}

function Results({ result, ms, others, setOthers }: { result: AnalysisResult; ms: number; others: boolean; setOthers: (v: boolean) => void }) {
  const w = result.watch
  return (
    <section className="mt-10" aria-label="Results">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono text-xs text-white/55">
        <span>Source: Apple Watch · read in {(ms / 1000).toFixed(1)} s on this device</span>
        <label className="flex cursor-pointer items-center gap-2 text-white/80">
          <input type="checkbox" checked={others} onChange={(e) => setOthers(e.target.checked)} />
          Show other sources too
        </label>
      </div>
      {w ? (
        <SourceBlock s={w} />
      ) : (
        <p className="font-mono text-sm text-white/70">
          No Apple Watch HRV, resting heart rate or sleep records were found in this file.
        </p>
      )}
      {others &&
        (result.others.length ? (
          result.others.map((s) => <SourceBlock key={s.key} s={s} />)
        ) : (
          <p className="mt-6 font-mono text-sm text-white/60">No other sources wrote these records.</p>
        ))}
    </section>
  )
}

function SourceBlock({ s }: { s: SourceSeries }) {
  const hasHrv = s.days.some((d) => d.hrv !== undefined)
  const hasRhr = s.days.some((d) => d.rhr !== undefined)
  const hasSleep = s.days.some((d) => d.sleepH !== undefined)
  return (
    <div className={s.watch ? '' : 'mt-12 border-t border-white/10 pt-8'}>
      {!s.watch && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">{s.label}</h2>
          <p className="mt-1 font-mono text-xs leading-relaxed text-white/55">
            Records that {s.label} wrote into Apple Health. Its measuring method and timing are its own, so do not compare
            these numbers with Apple Watch.
          </p>
        </div>
      )}
      {hasHrv && (
        <Metric
          days={s.days}
          pick={(d) => d.hrv}
          title={s.watch ? HRV_LABEL : `HRV as written by ${s.label} (Apple Health SDNN field)`}
          unit="ms"
          fmt={r0}
          note={s.watch ? 'Each point is the average of that day’s Apple Watch HRV readings.' : undefined}
          outsideLink
        />
      )}
      {hasRhr && <Metric days={s.days} pick={(d) => d.rhr} title={s.watch ? 'Resting heart rate, Apple Watch' : `Resting heart rate as written by ${s.label}`} unit="bpm" fmt={r0} />}
      {hasSleep && <Sleep days={s.days} />}
    </div>
  )
}

function lastDays(days: SeriesDay[], n: number): SeriesDay[] {
  if (!days.length) return []
  const last = Date.parse(`${days[days.length - 1].day}T00:00:00Z`)
  const from = last - (n - 1) * 86400e3
  return days.filter((d) => Date.parse(`${d.day}T00:00:00Z`) >= from)
}

function Metric({
  days,
  pick,
  title,
  unit,
  fmt,
  note,
  outsideLink,
}: {
  days: SeriesDay[]
  pick: (d: SeriesDay) => number | undefined
  title: string
  unit: string
  fmt: (v: number) => number | string
  note?: string
  outsideLink?: boolean
}) {
  const norm = useMemo(() => personalNorm(days, pick), [days, pick])
  const recentWindow = lastDays(days, NORM.recentDays).filter((d) => pick(d) !== undefined)
  const below = norm.ok ? recentWindow.filter((d) => pick(d)! < norm.low!) : []
  const above = norm.ok ? recentWindow.filter((d) => pick(d)! > norm.high!) : []
  const where =
    norm.ok && norm.recentMean !== undefined
      ? norm.recentMean < norm.low!
        ? 'below your usual range'
        : norm.recentMean > norm.high!
          ? 'above your usual range'
          : 'inside your usual range'
      : null
  return (
    <div className="mb-10">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="mb-3 font-mono text-sm leading-relaxed text-white/75">
        {norm.recentMean !== undefined && (
          <p>
            Last {NORM.recentDays} days ({norm.recentFrom} – {norm.recentTo}):{' '}
            <strong className="text-white">
              {fmt(norm.recentMean)} {unit}
            </strong>
            {where && <> — {where}</>}.
          </p>
        )}
        {norm.ok ? (
          <p>
            Your usual range: {fmt(norm.low!)}–{fmt(norm.high!)} {unit} (average {fmt(norm.mean!)} {unit}, {norm.refN} days,{' '}
            {norm.refFrom} – {norm.refTo}).
          </p>
        ) : (
          <p className="text-white/55">
            Not enough history for a usual range yet ({norm.refN} of {NORM.minRefDays} days needed in the {NORM.refDays} days
            before the last week).
          </p>
        )}
        {note && <p className="text-xs text-white/50">{note}</p>}
      </div>
      <Chart days={days} pick={pick} norm={norm} unit={unit} />
      {norm.ok && (
        <p className="mt-2 font-mono text-xs leading-relaxed text-white/60">
          Last {NORM.recentDays} days outside your usual range: {below.length} below, {above.length} above
          {below.length > 0 && <> ({below.map((d) => d.day.slice(5)).join(', ')} below)</>}.
          {outsideLink && below.length > 0 && (
            <>
              {' '}
              <a href={WHY_LOW} className="text-terminal-green hover:underline">
                Why can HRV be lower than usual? →
              </a>
            </>
          )}
        </p>
      )}
    </div>
  )
}

function Sleep({ days }: { days: SeriesDay[] }) {
  const pick = (d: SeriesDay) => d.sleepH
  const recent = lastDays(days, NORM.recentDays).filter((d) => d.sleepH !== undefined)
  const avg = recent.length ? recent.reduce((s, d) => s + d.sleepH!, 0) / recent.length : undefined
  const inBedOnly = days.some((d) => d.sleepFromInBed)
  const norm = useMemo(() => personalNorm(days, pick), [days])
  return (
    <div className="mb-10">
      <h3 className="mb-2 text-lg font-semibold">Sleep</h3>
      <div className="mb-3 font-mono text-sm leading-relaxed text-white/75">
        {avg !== undefined && (
          <p>
            Last {NORM.recentDays} nights: <strong className="text-white">{r1(avg)} h</strong> asleep on average.
          </p>
        )}
        {norm.ok && (
          <p>
            Your usual range: {r1(norm.low!)}–{r1(norm.high!)} h ({norm.refN} nights).
          </p>
        )}
        {sleepRangeIsWide(norm) && <p>Your sleep varies a lot from night to night, so the range is wide.</p>}
        {inBedOnly && <p className="text-xs text-white/50">Some older nights have only “in bed” time, not “asleep”; those are shown as time in bed.</p>}
      </div>
      <Chart days={days} pick={pick} norm={norm} unit="h" />
    </div>
  )
}

/** Plain SVG: daily dots, 7-day rolling line, usual-range band. No chart library, no external fonts. */
function Chart({ days, pick, norm, unit }: { days: SeriesDay[]; pick: (d: SeriesDay) => number | undefined; norm: PersonalNorm; unit: string }) {
  const view = lastDays(days, CHART_DAYS).filter((d) => pick(d) !== undefined)
  if (view.length < 2) return null
  const W = 640
  const H = 180
  const P = { l: 34, r: 8, t: 8, b: 20 }
  const t0 = Date.parse(`${view[0].day}T00:00:00Z`)
  const t1 = Date.parse(`${view[view.length - 1].day}T00:00:00Z`)
  const vals = view.map((d) => pick(d)!)
  let lo = Math.min(...vals, norm.ok ? norm.low! : Infinity)
  let hi = Math.max(...vals, norm.ok ? norm.high! : -Infinity)
  const pad = (hi - lo) * 0.08 || 1
  lo -= pad
  hi += pad
  const x = (day: string) => P.l + ((Date.parse(`${day}T00:00:00Z`) - t0) / Math.max(1, t1 - t0)) * (W - P.l - P.r)
  const y = (v: number) => P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b)
  const roll = rolling(view, pick, 7)
  const path = roll.map(([d, v], i) => `${i ? 'L' : 'M'}${x(d).toFixed(1)},${y(v).toFixed(1)}`).join('')
  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Daily values and 7-day average, ${unit}`}>
        {norm.ok && (
          <rect x={P.l} width={W - P.l - P.r} y={y(norm.high!)} height={Math.max(1, y(norm.low!) - y(norm.high!))} fill="rgba(74,222,128,0.10)" />
        )}
        {[lo + pad, (lo + hi) / 2, hi - pad].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.07)" />
            <text x={P.l - 4} y={y(v) + 3} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.45)">
              {unit === 'h' ? r1(v) : r0(v)}
            </text>
          </g>
        ))}
        {view.map((d) => (
          <circle key={d.day} cx={x(d.day)} cy={y(pick(d)!)} r="1.8" fill="rgba(255,255,255,0.45)" />
        ))}
        <path d={path} fill="none" stroke="#4ade80" strokeWidth="2" />
        <text x={P.l} y={H - 4} fontSize="10" fill="rgba(255,255,255,0.45)">{view[0].day}</text>
        <text x={W - P.r} y={H - 4} fontSize="10" textAnchor="end" fill="rgba(255,255,255,0.45)">{view[view.length - 1].day}</text>
      </svg>
      <figcaption className="font-mono text-[11px] text-white/45">
        Dots: daily values ({unit}). Line: 7-day average.{norm.ok ? ' Shaded: your usual range.' : ''} Last {CHART_DAYS} days in the file.
      </figcaption>
    </figure>
  )
}
