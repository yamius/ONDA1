import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { WATER_FAQ, computeWater, type WaterResult } from '../data/water-intake'

export function WaterIntakeCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [weight, setWeight] = useState('75')
  const [exerciseMin, setExerciseMin] = useState('30')
  const [hotClimate, setHotClimate] = useState(false)
  const [highCaffeine, setHighCaffeine] = useState(false)

  useEffect(() => {
    document.title = 'Water Intake Calculator — How Much Water a Day? | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: WaterResult | null = useMemo(() => {
    const w = parseFloat(weight)
    if (!w || w <= 0) return null
    const kg = unit === 'kg' ? w : w * 0.453592
    if (kg < 30 || kg > 250) return null
    return computeWater({
      kg,
      exerciseMin: parseInt(exerciseMin, 10) || 0,
      hotClimate,
      highCaffeine,
    })
  }, [weight, unit, exerciseMin, hotClimate, highCaffeine])

  const litres = result ? (result.drinkMl / 1000).toFixed(1) : '0'

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Water Intake</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Water Intake Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Estimate how much water to drink per day from your bodyweight, with adjustments for
        exercise, hot weather and high caffeine or alcohol intake.
      </p>

      <img
        src="/images/tools/water.png"
        alt="Water Intake Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Bodyweight</span>
            <div className="flex gap-2">
              <input
                type="number" inputMode="decimal" min={30} max={550} value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
              />
              <div className="flex overflow-hidden rounded-lg border border-white/15">
                {(['kg', 'lb'] as const).map((u) => (
                  <button
                    key={u} onClick={() => setUnit(u)}
                    className={`px-3 font-mono text-sm transition-colors ${unit === u ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Exercise today (min)</span>
            <input
              type="number" inputMode="numeric" min={0} max={360} value={exerciseMin}
              onChange={(e) => setExerciseMin(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          <button
            onClick={() => setHotClimate((v) => !v)}
            className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${hotClimate ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
          >
            {hotClimate ? '✓ ' : ''}Hot climate / sweating
          </button>
          <button
            onClick={() => setHighCaffeine((v) => !v)}
            className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${highCaffeine ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
          >
            {highCaffeine ? '✓ ' : ''}High caffeine / alcohol
          </button>
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Target from drinks</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">{litres} <span className="text-xl text-white/40">litres/day</span></div>
            <p className="mb-4 font-mono text-xs text-white/50">
              ≈ {result.glasses} glasses (250 ml) · total water need incl. food ≈ {(result.totalMl / 1000).toFixed(1)} L
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Baseline', result.baselineMl],
                ['Exercise', result.exerciseMl],
                ['Climate +', result.climateMl],
              ].map(([label, ml]) => (
                <div key={label as string} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-center">
                  <div className="text-lg font-bold text-terminal-cyan">{(Number(ml) / 1000).toFixed(2)} L</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter a valid bodyweight (30–250 kg / 66–550 lb).</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical advice. Thirst and pale-straw urine remain the best
        day-to-day guides. For long or hot training sessions, pair water with electrolytes; some
        medical conditions require fluid restriction — follow your clinician’s guidance.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Hydration is a habit, not a one-off</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life builds targets like this into daily protocols and connects them to how your
          energy, sleep and recovery actually respond — so the habit sticks.
        </p>
        <a
          href={appStoreUrl('tool_water')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {WATER_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/how-much-water-should-you-drink`} className="text-terminal-green hover:underline">How much water you should drink</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/tdee`} className="text-terminal-green hover:underline">TDEE calculator</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/caffeine`} className="text-terminal-green hover:underline">Caffeine cut-off</Link>
      </div>
    </main>
  )
}
