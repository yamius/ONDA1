import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  FASTING_PROTOCOLS,
  FAST_PHASES,
  FASTING_FAQ,
  computeFasting,
  parseTime,
  type FastingResult,
} from '../data/fasting'

export function FastingCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [protocolId, setProtocolId] = useState('16-8')
  const [eatStart, setEatStart] = useState('12:00')

  useEffect(() => {
    document.title = 'Intermittent Fasting Calculator — Eating Window | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const protocol = FASTING_PROTOCOLS.find((p) => p.id === protocolId) ?? FASTING_PROTOCOLS[1]

  const result: FastingResult | null = useMemo(() => {
    const min = parseTime(eatStart)
    if (min === null) return null
    return computeFasting(min, protocol)
  }, [eatStart, protocol])

  // Phases relevant within this protocol's fast length (highlight reached ones).
  const reachablePhases = FAST_PHASES.filter((p) => p.fromH <= protocol.fastHours + 1)

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Fasting</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Intermittent Fasting Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Pick a fasting protocol and your first-meal time to see exactly when your eating window
        opens and closes — plus a timeline of the metabolic phases across your fast.
      </p>

      <img
        src="/images/tools/fasting.png"
        alt="Intermittent Fasting Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">Protocol</span>
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {FASTING_PROTOCOLS.map((p) => (
            <button
              key={p.id} onClick={() => setProtocolId(p.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${
                protocolId === p.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'
              }`}
            >
              <span className="font-semibold">{p.label}</span>
              <span className="block text-[11px] text-white/40">{p.note}</span>
            </button>
          ))}
        </div>

        <label className="block max-w-[220px]">
          <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">First meal (window opens)</span>
          <input
            type="time" value={eatStart}
            onChange={(e) => setEatStart(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
          />
        </label>

        {result && (
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-terminal-green/30 bg-terminal-green/10 px-3 py-3 text-center">
                <div className="text-2xl font-bold text-terminal-green">{result.eatStart}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">eat — window opens</div>
              </div>
              <div className="rounded-lg border border-terminal-green/30 bg-terminal-green/10 px-3 py-3 text-center">
                <div className="text-2xl font-bold text-terminal-green">{result.eatEnd}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">stop — window closes</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-center">
                <div className="text-2xl font-bold text-terminal-cyan">{result.nextFastEnd}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">fast ends (next day)</div>
              </div>
            </div>
            <p className="mt-3 font-mono text-xs text-white/50">
              {protocol.eatHours} h eating · {protocol.fastHours} h fasting
            </p>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter a valid first-meal time (HH:MM).</p>}
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">What happens during your {protocol.fastHours} h fast</h2>
      <div className="mb-10 space-y-2">
        {reachablePhases.map((p) => (
          <div key={p.fromH} className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="w-12 shrink-0 text-right font-mono text-sm font-bold text-terminal-green">{p.fromH}h</div>
            <div>
              <div className="font-semibold text-white/90">{p.label}</div>
              <p className="font-mono text-xs leading-relaxed text-white/50">{p.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Phase timings are approximate and vary with your last meal, activity and metabolism.
        Educational only — fasting is not appropriate for everyone (pregnancy, breastfeeding, a
        history of disordered eating, type 1 diabetes or glucose-lowering medication). Check with a
        clinician if you have a health condition.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Make fasting work with your body</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life tracks how your eating window affects sleep, energy and recovery — so you can
          find the fasting pattern your body actually responds to, not just the trendy one.
        </p>
        <a
          href={appStoreUrl('tool_fasting')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {FASTING_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/tdee`} className="text-terminal-green hover:underline">TDEE calculator</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/caffeine`} className="text-terminal-green hover:underline">Caffeine cut-off</Link>
      </div>
    </main>
  )
}
