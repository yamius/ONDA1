import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  SLEEP_CYCLE_FAQ,
  SLEEP_CYCLE_SOURCES,
  SLEEP_CYCLE_METHODOLOGY,
  bedtimesForWake,
  wakesForBedtime,
  parseTime,
  type CycleOption,
} from '../data/sleep-cycle'
import { SourcesSection } from '../components/SourcesSection'

type Mode = 'wake' | 'bed'

export function SleepCycleCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [mode, setMode] = useState<Mode>('wake')
  const [wake, setWake] = useState('07:00')
  const [bed, setBed] = useState('23:00')

  useEffect(() => {
    document.title = 'Sleep Cycle Calculator — Best Bedtime & Wake Time | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const options: CycleOption[] | null = useMemo(() => {
    if (mode === 'wake') {
      const m = parseTime(wake)
      return m === null ? null : bedtimesForWake(m)
    }
    const m = parseTime(bed)
    return m === null ? null : wakesForBedtime(m)
  }, [mode, wake, bed])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Sleep Cycle</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Sleep Cycle Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Find the best time to go to bed — or wake up — by aligning your alarm with the end of a
        ~90-minute sleep cycle, so you wake in lighter sleep and feel less groggy.
      </p>

      <img
        src="/images/tools/sleep-cycle.png"
        alt="Sleep Cycle Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 flex overflow-hidden rounded-lg border border-white/15">
          {([
            ['wake', 'I know my wake time'],
            ['bed', 'I know my bedtime'],
          ] as const).map(([m, lbl]) => (
            <button
              key={m} onClick={() => setMode(m)}
              className={`flex-1 px-3 py-2 font-mono text-xs transition-colors ${mode === m ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
            >
              {lbl}
            </button>
          ))}
        </div>

        <label className="block max-w-[240px]">
          <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">
            {mode === 'wake' ? 'Wake-up time' : 'Bedtime'}
          </span>
          <input
            type="time" value={mode === 'wake' ? wake : bed}
            onChange={(e) => (mode === 'wake' ? setWake(e.target.value) : setBed(e.target.value))}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
          />
        </label>

        {options && (
          <div className="mt-6">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-white/50">
              {mode === 'wake' ? 'Go to bed at one of these times' : 'Set your alarm for one of these times'}
              <span className="ml-1 text-white/30">(best first)</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {options.map((o, i) => (
                <div
                  key={o.cycles}
                  className={`rounded-lg border px-3 py-3 text-center ${i < 2 ? 'border-terminal-green/40 bg-terminal-green/10' : 'border-white/10 bg-black/20'}`}
                >
                  <div className={`text-lg font-bold ${i < 2 ? 'text-terminal-green' : 'text-white/80'}`}>{o.time}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                    {o.cycles} cycles · {o.totalSleepH} h
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] text-white/40">
              Includes ~15 min to fall asleep. 5–6 cycles (7.5–9 h) suits most adults.
            </p>
          </div>
        )}
        {!options && <p className="mt-4 font-mono text-xs text-white/40">Enter a valid time (HH:MM).</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        The 90-minute cycle is an average — real cycles run ~70–120 min and the first is often
        shorter — so treat these as a guide, not a guarantee. Total sleep duration and consistent
        timing matter more than hitting an exact cycle. Educational only, not medical advice.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Wake up to your real sleep, not an average</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life works from your actual sleep stages, HRV and timing — so your wake-up and wind-down
          fit your body’s real rhythm, not a one-size-fits-all 90 minutes.
        </p>
        <a
          href={appStoreUrl('tool_sleepcycle')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={SLEEP_CYCLE_METHODOLOGY} sources={SLEEP_CYCLE_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {SLEEP_CYCLE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/sleep-debt`} className="text-terminal-green hover:underline">Sleep debt</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/chronotype`} className="text-terminal-green hover:underline">Chronotype quiz</Link>
      </div>
    </main>
  )
}
