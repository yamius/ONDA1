import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import { ALCOHOL_FAQ, ALCOHOL_SOURCES, ALCOHOL_METHODOLOGY, computeAlcohol, formatHours, type Sex, type AlcoholResult } from '../data/alcohol-clearance'
import { SourcesSection } from '../components/SourcesSection'

export function AlcoholClearanceCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [weight, setWeight] = useState('75')
  const [sex, setSex] = useState<Sex>('male')
  const [drinks, setDrinks] = useState('3')
  const [hoursSince, setHoursSince] = useState('1')

  useEffect(() => {
    document.title = 'Alcohol Clearance Calculator — Time to Sober Up | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: AlcoholResult | null = useMemo(() => {
    const w = parseFloat(weight)
    const d = parseFloat(drinks)
    if (!w || w <= 0 || isNaN(d) || d < 0) return null
    const kg = unit === 'kg' ? w : w * 0.453592
    if (kg < 30 || kg > 250 || d > 40) return null
    return computeAlcohol({ kg, sex, drinks: d, hoursSince: parseFloat(hoursSince) || 0 })
  }, [weight, unit, sex, drinks, hoursSince])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Alcohol Clearance</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Alcohol Clearance Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Estimate your blood-alcohol level and how long until it returns to zero, using the Widmark
        equation — and see why those drinks cost you a night of recovery.
      </p>

      <img
        src="/images/tools/alcohol.png"
        alt="Alcohol Clearance Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-6 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ Educational estimate only, with large individual variation. This is <strong>not</strong> a
          tool for deciding whether it is safe or legal to drive. If you have been drinking, do not drive.
        </p>
      </div>

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
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Sex</span>
            <div className="flex overflow-hidden rounded-lg border border-white/15">
              {(['male', 'female'] as const).map((s) => (
                <button
                  key={s} onClick={() => setSex(s)}
                  className={`flex-1 px-3 py-3 font-mono text-sm capitalize transition-colors ${sex === s ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Standard drinks</span>
            <input
              type="number" inputMode="decimal" min={0} max={40} step={0.5} value={drinks}
              onChange={(e) => setDrinks(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Hours since first drink</span>
            <input
              type="number" inputMode="decimal" min={0} max={24} step={0.5} value={hoursSince}
              onChange={(e) => setHoursSince(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Estimated BAC now</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">{result.currentBac.toFixed(3)}<span className="text-xl text-white/40">%</span></div>
            <p className="mb-4 font-mono text-xs text-white/50">Peak BAC ≈ {result.peakBac.toFixed(3)}%</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-center">
                <div className="text-lg font-bold text-terminal-cyan">{formatHours(result.hoursToSober)}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">until ~0.00% (sober)</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-center">
                <div className="text-lg font-bold text-terminal-cyan">{formatHours(result.hoursToLegal)}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">until under 0.05%</div>
              </div>
            </div>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter a valid bodyweight and number of drinks.</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        One standard drink = 14 g pure alcohol (≈ 350 ml beer at 5%, 150 ml wine at 12%, or 45 ml
        spirits at 40%). Elimination is assumed at 0.015% per hour. Real clearance varies with
        genetics, food, medication and liver health. The 0.05% line is a common — not universal —
        legal limit; many places are lower or zero. Never drive after drinking.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">See the recovery cost in your data</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          Alcohol suppresses REM and tanks overnight HRV. ONDA Life tracks how your sleep and
          recovery respond to drinking — so you can see the real trade-off, not just the hangover.
        </p>
        <a
          href={appStoreUrl('tool_alcohol')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={ALCOHOL_METHODOLOGY} sources={ALCOHOL_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {ALCOHOL_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/sleep-debt`} className="text-terminal-green hover:underline">Sleep debt</Link>
      </div>
    </main>
  )
}
