import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath, langHref } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  HR_ZONE_FAQ,
  HR_ZONE_SOURCES,
  HR_ZONE_METHODOLOGY,
  estimateMaxHr,
  computeZones,
  type MaxHrMethod,
  type ZoneRange,
} from '../data/hr-zones'
import { SourcesSection } from '../components/SourcesSection'

const ZONE_COLOR = ['', 'text-white/50', 'text-terminal-green', 'text-terminal-cyan', 'text-amber-400', 'text-red-400']

export function Zone2CalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [age, setAge] = useState('35')
  const [restHr, setRestHr] = useState('')
  const [method, setMethod] = useState<MaxHrMethod>('tanaka')

  useEffect(() => {
    document.title = 'Zone 2 Heart Rate Calculator — Find Your Aerobic Zone | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const data = useMemo(() => {
    const a = parseInt(age, 10)
    if (!a || a < 14 || a > 100) return null
    const maxHr = estimateMaxHr(a, method)
    const rest = parseInt(restHr, 10) || 0
    const zones: ZoneRange[] = computeZones(maxHr, rest)
    return { maxHr, rest, zones, useKarvonen: rest > 0 && rest < maxHr }
  }, [age, restHr, method])

  const zone2 = data?.zones.find((z) => z.z === 2)

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Zone 2 Heart Rate</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Zone 2 Heart Rate Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Find your Zone 2 aerobic-base heart rate — the conversational, fat-burning,
        mitochondria-building zone — plus all five training zones for your age.
      </p>

      <img
        src="/images/tools/zone-2.png"
        alt="Zone 2 Heart Rate Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Age</span>
            <input
              type="number" inputMode="numeric" min={14} max={100} value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">Resting HR (optional, bpm)</span>
            <input
              type="number" inputMode="numeric" min={30} max={120} placeholder="for Karvonen"
              value={restHr} onChange={(e) => setRestHr(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
        </div>

        <div className="mb-2">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Max-HR formula</span>
          <div className="flex gap-2">
            {([['tanaka', 'Tanaka (recommended)'], ['fox', '220 − age']] as Array<[MaxHrMethod, string]>).map(([id, label]) => (
              <button
                key={id} onClick={() => setMethod(id)}
                className={`flex-1 rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                  method === id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/50 hover:border-white/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {data && zone2 && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Your Zone 2 target</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">{zone2.low}–{zone2.high} <span className="text-xl text-white/40">bpm</span></div>
            <p className="mb-5 font-mono text-xs text-white/50">
              Est. max HR {data.maxHr} bpm · {data.useKarvonen ? `Karvonen %HRR (rest ${data.rest})` : '%HRmax'}
            </p>

            <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/40">All training zones</div>
            <div className="divide-y divide-white/5 rounded-lg border border-white/10">
              {data.zones.map((z) => (
                <div key={z.z} className={`flex items-center gap-3 px-3 py-2 ${z.z === 2 ? 'bg-terminal-green/5' : ''}`}>
                  <span className={`font-mono text-sm font-bold ${ZONE_COLOR[z.z]}`}>Z{z.z}</span>
                  <span className="flex-1 font-mono text-xs text-white/70">{z.name}</span>
                  <span className="font-mono text-sm text-white/90">{z.low}–{z.high}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!data && <p className="mt-4 font-mono text-xs text-white/40">Enter a valid age (14–100).</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical advice. Formula max-HR can sit ±10–12 bpm from
        your true max — pair these zones with the "talk test" (full sentences = Zone 2).
        For precise zones use a lab or field test.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Stay in Zone 2 — automatically</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life pairs with your HR monitor and tracks time-in-zone and recovery — so
          your aerobic base actually compounds instead of drifting into Zone 3.
        </p>
        <a
          href={appStoreUrl('tool_zone2')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={HR_ZONE_METHODOLOGY} sources={HR_ZONE_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {HR_ZONE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/zone-2-training-aerobic-base`} className="text-terminal-green hover:underline">Zone 2 training explained</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/tools/hrv`} className="text-terminal-green hover:underline">HRV interpreter</Link>
        {' · '}
        <Link to={langHref(`/reviews/hrv-trackers`, lang)} className="text-terminal-green hover:underline">Best HRV trackers (2026)</Link>
      </div>
    </main>
  )
}
