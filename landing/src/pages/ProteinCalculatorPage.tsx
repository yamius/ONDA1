import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { PROTEIN_GOALS, PROTEIN_FAQ, computeProtein, type ProteinResult } from '../data/protein-target'

export function ProteinCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [weight, setWeight] = useState('75')
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [goalId, setGoalId] = useState('active')
  const [meals, setMeals] = useState('4')

  useEffect(() => {
    document.title = 'Protein Intake Calculator — How Much Protein Per Day? | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const goal = PROTEIN_GOALS.find((g) => g.id === goalId) ?? PROTEIN_GOALS[1]

  const result: ProteinResult | null = useMemo(() => {
    const w = parseFloat(weight)
    if (!w || w <= 0) return null
    const kg = unit === 'kg' ? w : w * 0.453592
    if (kg < 30 || kg > 250) return null
    return computeProtein(kg, goal, parseInt(meals, 10) || 4)
  }, [weight, unit, goal, meals])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Protein Target</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Protein Intake Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Find your daily protein target for your bodyweight and goal — based on the ISSN and
        ACSM sports-nutrition position stands — plus a suggested per-meal amount.
      </p>

      <img
        src="/images/tools/protein.png"
        alt="Protein Intake Calculator — free interactive calculator from ONDA Life"
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
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Meals per day</span>
            <input
              type="number" inputMode="numeric" min={1} max={8} value={meals}
              onChange={(e) => setMeals(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Goal</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PROTEIN_GOALS.map((g) => (
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
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Daily protein target</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">{result.gLow}–{result.gHigh} <span className="text-xl text-white/40">g/day</span></div>
            <p className="mb-4 font-mono text-xs text-white/50">
              ≈ {result.perMeal} g across {meals} meals · {goal.note}
            </p>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter a valid bodyweight (30–250 kg / 66–550 lb).</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical or dietetic advice. Targets use total bodyweight
        (the basis of the position stands); for high body fat, lean-mass targets are lower.
        Spread intake across meals (~0.4 g/kg each) for best muscle-protein synthesis.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Hit your target consistently</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life turns targets like this into daily protocols and tracks how they move
          your recovery, sleep and HRV — so nutrition connects to how you actually feel.
        </p>
        <a
          href={appStoreUrl('tool_protein')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Protein targets by goal (g/kg/day)</h2>
      <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th className="px-3 py-2 text-left">Goal</th>
              <th className="px-3 py-2 text-right">g / kg / day</th>
            </tr>
          </thead>
          <tbody>
            {PROTEIN_GOALS.map((g) => (
              <tr key={g.id} className="border-b border-white/5 text-white/70">
                <td className="px-3 py-2 text-left font-semibold text-white/90">{g.label}</td>
                <td className="px-3 py-2 text-right text-terminal-green">{g.loPerKg}–{g.hiPerKg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {PROTEIN_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/zone-2`} className="text-terminal-green hover:underline">Zone 2 heart rate</Link>
        {' · '}
        <Link to={`${langPrefix}/articles/glp1-biology-muscle-preservation`} className="text-terminal-green hover:underline">Muscle preservation</Link>
      </div>
    </main>
  )
}
