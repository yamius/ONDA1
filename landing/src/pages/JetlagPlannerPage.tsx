import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { JETLAG_FAQ, computeJetlag, parseTime, type Direction, type JetlagResult } from '../data/jetlag'

export function JetlagPlannerPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [usualWake, setUsualWake] = useState('07:00')
  const [zones, setZones] = useState('6')
  const [direction, setDirection] = useState<Direction>('east')

  useEffect(() => {
    document.title = 'Jet Lag Calculator — Light-Timing Planner | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: JetlagResult | null = useMemo(() => {
    const wake = parseTime(usualWake)
    const z = parseInt(zones, 10)
    if (wake === null || !z || z < 1 || z > 14) return null
    return computeJetlag({ usualWake: wake, zones: z, direction })
  }, [usualWake, zones, direction])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Jet Lag</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Jet Lag Light-Timing Planner</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Beat jet lag with the strongest circadian lever there is: light. Enter your trip to see
        which way your clock needs to shift, and when to seek and avoid bright light.
      </p>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Usual wake time</span>
            <input
              type="time" value={usualWake}
              onChange={(e) => setUsualWake(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Time zones crossed</span>
            <input
              type="number" inputMode="numeric" min={1} max={14} value={zones}
              onChange={(e) => setZones(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Direction</span>
            <div className="flex overflow-hidden rounded-lg border border-white/15">
              {([
                ['east', 'East ↦'],
                ['west', '↤ West'],
              ] as const).map(([d, lbl]) => (
                <button
                  key={d} onClick={() => setDirection(d)}
                  className={`flex-1 px-2 py-3 font-mono text-sm transition-colors ${direction === d ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </label>
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-white/50">Your clock needs to</span>
              <span className="text-2xl font-bold text-terminal-green">{result.shiftType === 'advance' ? 'ADVANCE (earlier)' : 'DELAY (later)'}</span>
              <span className="font-mono text-xs text-white/50">· ~{result.adaptationDays} day{result.adaptationDays > 1 ? 's' : ''} to adapt</span>
            </div>

            {result.longWayRound && (
              <p className="mb-4 rounded-lg border border-amber-400/25 bg-amber-400/5 p-3 font-mono text-[11px] leading-relaxed text-amber-200/80">
                This trip crosses more than 8 zones eastward — your body will likely adapt faster by
                <strong> delaying "the long way round"</strong> rather than advancing. The light timing below reflects that.
              </p>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-terminal-green/30 bg-terminal-green/10 px-4 py-3">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-green/70">☀ Seek bright light</div>
                <div className="text-xl font-bold text-terminal-green">{result.seekLight}</div>
                <div className="font-mono text-[11px] text-white/40">home clock, day 1 — shift later as you adapt</div>
              </div>
              <div className="rounded-lg border border-white/15 bg-black/30 px-4 py-3">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/50">🌑 Avoid bright light</div>
                <div className="text-xl font-bold text-white/80">{result.avoidLight}</div>
                <div className="font-mono text-[11px] text-white/40">dim screens / sunglasses in this window</div>
              </div>
            </div>
            <p className="mt-3 font-mono text-xs text-white/50">
              Estimated CBTmin (clock pivot) ≈ {result.cbtMin}. Each day, nudge the windows ~1 h in your shift direction.
            </p>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter your wake time and 1–14 time zones crossed.</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Light windows are anchored to your estimated CBTmin (≈ 2 h before wake) and shown on your
        home clock for the first day; advance them about 1 h/day (eastward) or delay ~1.5 h/day
        (westward) as you adapt. Educational planning aid, not medical advice — melatonin, meal
        timing and sleep scheduling also help.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Land already adjusting</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life tracks how travel hits your sleep, HRV and recovery — and turns light, melatonin
          and meal timing into a day-by-day plan so you arrive closer to local time.
        </p>
        <a
          href={appStoreUrl('tool_jetlag')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {JETLAG_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/chronotype`} className="text-terminal-green hover:underline">Chronotype quiz</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/sleep-debt`} className="text-terminal-green hover:underline">Sleep debt</Link>
      </div>
    </main>
  )
}
