import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  DETOX_DURATIONS,
  DETOX_HABITS,
  DETOX_FAQ,
  DETOX_SOURCES,
  DETOX_METHODOLOGY,
  buildDetoxPlan,
} from '../data/digital-detox'
import { SourcesSection } from '../components/SourcesSection'

export function DigitalDetoxPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [durationId, setDurationId] = useState('daily')
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    document.title = 'Digital Detox: Build a Screen-Reset Plan | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const plan = useMemo(() => buildDetoxPlan(durationId, selected), [durationId, selected])

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Digital Detox</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Digital Detox Planner</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Build a realistic screen-reset plan — not a purity test. Pick the digital habits draining your
        attention and sleep, and get specific, evidence-based swaps plus a phone-setup checklist.
      </p>

      <img
        src="/images/tools/digital-detox.png"
        alt="Digital detox planner — an evidence-based screen-reset plan for attention, sleep and calm, from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">1 · Choose your window</span>
        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DETOX_DURATIONS.map((d) => (
            <button
              key={d.id} onClick={() => setDurationId(d.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${durationId === d.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">2 · Habits to reset <span className="text-white/30">(none = all)</span></span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DETOX_HABITS.map((h) => (
            <button
              key={h.id} onClick={() => toggle(h.id)}
              className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${selected.includes(h.id) ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}
            >
              {selected.includes(h.id) ? '✓ ' : ''}{h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generated plan */}
      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-black/20 p-5 md:p-6">
        <h2 className="mb-1 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Your screen-reset plan</h2>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">{plan.duration.guidance}</p>

        <div className="mb-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-white/50">🎯 Tactics</div>
          <ul className="space-y-2">
            {plan.tactics.map((t) => (
              <li key={t.label} className="font-mono text-xs text-white/70">
                <span className="text-terminal-green">— {t.label}</span>
                <span className="block pl-3 text-[11px] leading-relaxed text-white/45">{t.tactic}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-white/50">📱 Phone-setup checklist</div>
          <ul className="space-y-1.5">
            {plan.phoneSetup.map((p) => (
              <li key={p} className="font-mono text-[11px] leading-relaxed text-white/60">— {p}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational behaviour-change tool, not medical advice. The evidence on dramatic total detoxes
        is mixed; the durable wins are the small, permanent defaults. The goal is a phone that serves
        you — not a purity contest or another thing to feel guilty about.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Reclaim attention, calmly</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life builds resets like this into daily protocols and tracks how cutting the noise moves
          your sleep, focus and stress — so the change holds instead of fading after a week.
        </p>
        <a
          href={appStoreUrl('tool_digitaldetox')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={DETOX_METHODOLOGY} sources={DETOX_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {DETOX_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/dopamine-detox`} className="text-terminal-green hover:underline">Dopamine reset</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/breathing`} className="text-terminal-green hover:underline">Breathing pacer</Link>
      </div>
    </main>
  )
}
