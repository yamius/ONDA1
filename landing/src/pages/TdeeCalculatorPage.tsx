import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  ACTIVITY_LEVELS,
  CALORIE_GOALS,
  TDEE_FAQ,
  TDEE_SOURCES,
  TDEE_METHODOLOGY,
  computeTdee,
  type Sex,
  type TdeeResult,
} from '../data/tdee'
import { SourcesSection } from '../components/SourcesSection'

export function TdeeCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [sex, setSex] = useState<Sex>('male')
  const [age, setAge] = useState('35')
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState('75') // kg or lb
  const [height, setHeight] = useState('178') // cm or in
  const [activityId, setActivityId] = useState('moderate')
  const [goalId, setGoalId] = useState('maintain')

  useEffect(() => {
    document.title = 'TDEE Calculator — Daily Calorie & Macro Needs | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const activity = ACTIVITY_LEVELS.find((a) => a.id === activityId) ?? ACTIVITY_LEVELS[2]
  const goal = CALORIE_GOALS.find((g) => g.id === goalId) ?? CALORIE_GOALS[2]

  const result: TdeeResult | null = useMemo(() => {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseInt(age, 10)
    if (!w || !h || !a) return null
    const kg = unit === 'metric' ? w : w * 0.453592
    const cm = unit === 'metric' ? h : h * 2.54
    if (kg < 30 || kg > 250 || cm < 120 || cm > 230 || a < 14 || a > 100) return null
    return computeTdee(kg, cm, a, sex, activity, goal)
  }, [weight, height, age, unit, sex, activity, goal])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">TDEE</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">TDEE Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Find your Total Daily Energy Expenditure — the calories you burn per day — using the
        Mifflin–St Jeor equation, plus a calorie target and macro split for your goal.
      </p>

      <img
        src="/images/tools/tdee.png"
        alt="TDEE Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-white/50">Units</span>
          <div className="flex overflow-hidden rounded-lg border border-white/15">
            {([
              ['metric', 'kg / cm'],
              ['imperial', 'lb / in'],
            ] as const).map(([u, lbl]) => (
              <button
                key={u} onClick={() => setUnit(u)}
                className={`px-3 py-1.5 font-mono text-xs transition-colors ${unit === u ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Sex</span>
            <div className="flex overflow-hidden rounded-lg border border-white/15">
              {(['male', 'female'] as const).map((s) => (
                <button
                  key={s} onClick={() => setSex(s)}
                  className={`flex-1 px-2 py-3 font-mono text-xs capitalize transition-colors ${sex === s ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
                >
                  {s === 'male' ? 'M' : 'F'}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Age</span>
            <input
              type="number" inputMode="numeric" min={14} max={100} value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{unit === 'metric' ? 'Weight (kg)' : 'Weight (lb)'}</span>
            <input
              type="number" inputMode="decimal" value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{unit === 'metric' ? 'Height (cm)' : 'Height (in)'}</span>
            <input
              type="number" inputMode="decimal" value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Activity level</span>
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ACTIVITY_LEVELS.map((a) => (
            <button
              key={a.id} onClick={() => setActivityId(a.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${
                activityId === a.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              <span className="font-semibold">{a.label}</span>
              <span className="block text-[11px] text-white/40">{a.note}</span>
            </button>
          ))}
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Goal</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CALORIE_GOALS.map((g) => (
            <button
              key={g.id} onClick={() => setGoalId(g.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${
                goalId === g.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Your daily target ({goal.note})</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">{result.goalCalories.toLocaleString()} <span className="text-xl text-white/40">kcal/day</span></div>
            <p className="mb-4 font-mono text-xs text-white/50">
              BMR {result.bmr.toLocaleString()} · maintenance (TDEE) {result.tdee.toLocaleString()} kcal
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Protein', result.proteinG],
                ['Carbs', result.carbG],
                ['Fat', result.fatG],
              ].map(([label, g]) => (
                <div key={label as string} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-center">
                  <div className="text-lg font-bold text-terminal-cyan">{g} g</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter valid age (14–100), weight and height.</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical or dietetic advice. Predictive formulas are accurate to
        roughly ±10%; use the number as a starting point and adjust based on your actual 2–3 week
        weight trend. The macro split sets protein at ~1.8 g/kg, fat at 25% of calories, the rest carbs.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Make the numbers stick</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life turns targets like these into daily protocols and tracks how nutrition moves
          your weight, recovery and energy — so you can adjust from real data, not guesswork.
        </p>
        <a
          href={appStoreUrl('tool_tdee')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Activity multipliers</h2>
      <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-3 py-2 text-left">Level</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-right">× BMR</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY_LEVELS.map((a) => (
              <tr key={a.id} className="border-b border-white/5 text-white/70">
                <td className="px-3 py-2 text-left font-semibold text-white/90">{a.label}</td>
                <td className="px-3 py-2 text-left text-white/50">{a.note}</td>
                <td className="px-3 py-2 text-right text-terminal-green">{a.multiplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SourcesSection methodology={TDEE_METHODOLOGY} sources={TDEE_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {TDEE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/how-to-calculate-maintenance-calories`} className="text-terminal-green hover:underline">How to calculate maintenance calories</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/protein`} className="text-terminal-green hover:underline">Protein target</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/vo2max`} className="text-terminal-green hover:underline">VO₂max estimator</Link>
      </div>
    </main>
  )
}
