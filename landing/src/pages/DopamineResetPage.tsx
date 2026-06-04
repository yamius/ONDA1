import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  RESET_DURATIONS,
  HIGH_STIM_INPUTS,
  DOPAMINE_FAQ,
  DOPAMINE_SOURCES,
  DOPAMINE_METHODOLOGY,
  buildResetPlan,
} from '../data/dopamine-reset'
import { SourcesSection } from '../components/SourcesSection'

export function DopamineResetPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [durationId, setDurationId] = useState('morning')
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    document.title = 'Dopamine Detox: Build Your Reset Plan | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const plan = useMemo(() => buildResetPlan(durationId, selected), [durationId, selected])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Dopamine Reset</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Dopamine Reset Planner</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Build a structured "dopamine detox" — really a behavioural reset using stimulus control —
        to cut the cheap-reward loops hijacking your focus and rebuild drive for what matters.
      </p>

      <img
        src="/images/tools/dopamine-detox.png"
        alt="Dopamine reset planner — a stimulus-control behavioural reset to recalibrate focus and motivation, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">
          ⚠ Reality check: you can’t literally "detox" dopamine and screens don’t deplete it. What
          works is <strong>stimulus control</strong> — a CBT technique. This is an educational
          behaviour-change tool, not therapy or treatment for addiction.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">1 · Choose your window</span>
        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {RESET_DURATIONS.map((d) => (
            <button
              key={d.id} onClick={() => setDurationId(d.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${durationId === d.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">2 · What to cut <span className="text-white/30">(none = all)</span></span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {HIGH_STIM_INPUTS.map((i) => (
            <button
              key={i.id} onClick={() => toggle(i.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${selected.includes(i.id) ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {selected.includes(i.id) ? '✓ ' : ''}{i.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generated plan */}
      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-black/20 p-5 md:p-6">
        <h2 className="mb-1 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Your reset plan</h2>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">{plan.duration.guidance}</p>

        <div className="mb-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-white/50">⛔ Cut for the window</div>
          <ul className="space-y-1">
            {plan.cut.map((c) => (
              <li key={c} className="font-mono text-xs text-white/70">— {c}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-white/50">✅ Replace with</div>
          <ul className="space-y-1.5">
            {plan.replace.map((r) => (
              <li key={r.label} className="font-mono text-xs text-white/70">
                <span className="text-terminal-green">— {r.label}</span>
                <span className="block pl-3 text-[11px] text-white/40">{r.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-white/50">⚙ Rules that make it stick</div>
          <ul className="space-y-1.5">
            {plan.rules.map((rule) => (
              <li key={rule} className="font-mono text-[11px] leading-relaxed text-white/60">— {rule}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Turn one reset into a habit</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          A single detox fades. ONDA Life builds the reset into daily protocols and tracks how cutting
          the loops changes your focus, sleep and stress — so the recalibration actually holds.
        </p>
        <a
          href={appStoreUrl('tool_dopamine')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={DOPAMINE_METHODOLOGY} sources={DOPAMINE_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {DOPAMINE_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Read the guide: <Link to={`${langPrefix}/articles/does-dopamine-detox-work`} className="text-terminal-green hover:underline">Does a dopamine detox work?</Link>
        {' · '}
        Related: <Link to={`${langPrefix}/articles/dopamine-architecture-mastering-desire`} className="text-terminal-green hover:underline">Dopamine architecture</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/breathing`} className="text-terminal-green hover:underline">Breathing pacer</Link>
      </div>
    </main>
  )
}
