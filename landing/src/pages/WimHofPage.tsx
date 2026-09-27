import { Fragment, useEffect, useRef, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import {
  WHM_DEFAULTS,
  WHM_ROUND_OPTIONS,
  WHM_BREATH_OPTIONS,
  WHM_HALF_MS,
  WHM_SOURCES,
} from '../data/wim-hof'
import { whmToolCopy, fill } from '../data/whm-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

type Phase = 'idle' | 'breathing' | 'hold' | 'recovery' | 'done'
const FULL = 1
const EMPTY = 0.5

/** Render inline markdown links ([text](/path)) as router links. */
function Rich({ text, lang }: { text: string; lang: Lang }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!m) return <Fragment key={i}>{p}</Fragment>
        return (
          <Link key={i} to={langHref(m[2], lang)} className="text-terminal-green hover:underline">
            {m[1]}
          </Link>
        )
      })}
    </>
  )
}

export function WimHofPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c = whmToolCopy(lang)
  const hub = (['ru', 'es'] as Lang[]).includes(lang) ? `/${lang}/tools` : '/tools'

  const [rounds, setRounds] = useState<number>(WHM_DEFAULTS.rounds)
  const [breaths, setBreaths] = useState<number>(WHM_DEFAULTS.breaths)
  const [phase, setPhase] = useState<Phase>('idle')
  const [round, setRound] = useState(0)
  const [breathNo, setBreathNo] = useState(0)
  const [label, setLabel] = useState<'press' | 'in' | 'out' | 'hold' | 'recovery' | 'done'>('press')
  const [scale, setScale] = useState(EMPTY)
  const [transMs, setTransMs] = useState(500)
  const [holdSec, setHoldSec] = useState(0)
  const [recoveryLeft, setRecoveryLeft] = useState(0)
  const [holds, setHolds] = useState<number[]>([])

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)
  const cfg = useRef({ rounds, breaths })
  cfg.current = { rounds, breaths }

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const clearAll = () => {
    if (timer.current) clearTimeout(timer.current)
    if (interval.current) clearInterval(interval.current)
    timer.current = null
    interval.current = null
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // --- breathing phase: toggle in/out for `breaths` full breaths ---
  const breatheToggle = (rnd: number, toggle: number) => {
    const total = cfg.current.breaths * 2
    if (toggle >= total) {
      startHold(rnd)
      return
    }
    const inhale = toggle % 2 === 0
    setScale(inhale ? FULL : EMPTY)
    setTransMs(WHM_HALF_MS)
    setLabel(inhale ? 'in' : 'out')
    if (inhale) setBreathNo(Math.floor(toggle / 2) + 1)
    timer.current = setTimeout(() => breatheToggle(rnd, toggle + 1), WHM_HALF_MS)
  }

  const startBreathing = (rnd: number) => {
    setPhase('breathing')
    setRound(rnd)
    setBreathNo(0)
    breatheToggle(rnd, 0)
  }

  // --- hold phase: exhale and hold empty, count up ---
  const startHold = (rnd: number) => {
    setPhase('hold')
    setRound(rnd)
    setScale(EMPTY)
    setTransMs(1500)
    setLabel('hold')
    let s = 0
    setHoldSec(0)
    interval.current = setInterval(() => {
      s += 1
      setHoldSec(s)
    }, 1000)
  }

  const endHold = () => {
    if (interval.current) clearInterval(interval.current)
    setHolds((h) => [...h, holdSec])
    startRecovery()
  }

  // --- recovery phase: big breath in, hold ~15s ---
  const startRecovery = () => {
    setPhase('recovery')
    setScale(FULL)
    setTransMs(1500)
    setLabel('recovery')
    let left = WHM_DEFAULTS.recoverySec
    setRecoveryLeft(left)
    interval.current = setInterval(() => {
      left -= 1
      setRecoveryLeft(left)
      if (left <= 0) {
        if (interval.current) clearInterval(interval.current)
        nextRound()
      }
    }, 1000)
  }

  const nextRound = () => {
    const current = round
    if (current >= cfg.current.rounds) {
      setPhase('done')
      setLabel('done')
      setScale(EMPTY)
      return
    }
    startBreathing(current + 1)
  }

  const start = () => {
    clearAll()
    setHolds([])
    startBreathing(1)
  }
  const stop = () => {
    clearAll()
    setPhase('idle')
    setLabel('press')
    setScale(EMPTY)
    setRound(0)
    setBreathNo(0)
    setHoldSec(0)
  }

  useEffect(() => () => clearAll(), [])

  const running = phase !== 'idle' && phase !== 'done'

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="hover:text-terminal-green">{c.breadcrumb.home}</Link>
        <span>/</span>
        <Link to={hub} className="hover:text-terminal-green">{c.breadcrumb.tools}</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">{c.breadcrumb.current}</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{c.h1}</h1>
      <p className="mb-8 text-base leading-relaxed text-white/70">{c.capsule}</p>

      <img
        src="/images/tools/wim-hof.png"
        alt={c.imageAlt}
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/5 p-4">
        <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-red-300/90">{c.safetyTitle}</p>
        <ul className="space-y-1.5">
          {c.safety.map((s) => (
            <li key={s} className="font-mono text-[11px] leading-relaxed text-red-200/80">— {s}</li>
          ))}
        </ul>
      </div>

      {/* WHM timer */}
      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-8">
        {!running && phase !== 'done' && (
          <div className="mb-6 flex flex-wrap items-end justify-center gap-5">
            <div>
              <span className="mb-1 block text-center font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.rounds}</span>
              <div className="flex gap-1">
                {WHM_ROUND_OPTIONS.map((r) => (
                  <button key={r} onClick={() => setRounds(r)}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${rounds === r ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>{r}</button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-1 block text-center font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.breaths}</span>
              <div className="flex gap-1">
                {WHM_BREATH_OPTIONS.map((b) => (
                  <button key={b} onClick={() => setBreaths(b)}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${breaths === b ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'}`}>{b}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Circle */}
        <div className="relative mx-auto mb-5 flex h-60 w-60 items-center justify-center">
          <div className="absolute inset-0 m-auto h-60 w-60 rounded-full border border-terminal-cyan/30 bg-gradient-to-br from-terminal-cyan/10 to-terminal-green/10"
            style={{ transform: `scale(${scale})`, transitionProperty: 'transform', transitionDuration: `${transMs}ms`, transitionTimingFunction: 'ease-in-out' }} />
          <div className="relative z-10 text-center">
            <div className={`font-mono text-base font-semibold ${running ? 'text-terminal-green' : 'text-white/50'}`}>{c.ui[label]}</div>
            {phase === 'breathing' && <div className="mt-1 text-3xl font-bold text-white/80">{breathNo}</div>}
            {phase === 'hold' && <div className="mt-1 text-3xl font-bold text-white/80">{fmt(holdSec)}</div>}
            {phase === 'recovery' && <div className="mt-1 text-3xl font-bold text-white/80">{recoveryLeft}</div>}
            {running && <div className="mt-1 font-mono text-[11px] text-white/40">{fill(c.ui.round, { r: round, n: rounds })}</div>}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {phase === 'idle' && (
            <button onClick={start} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-terminal-green/20">{c.ui.start}</button>
          )}
          {phase === 'hold' && (
            <button onClick={endHold} className="rounded-lg border border-terminal-cyan/50 bg-terminal-cyan/10 px-8 py-3 font-mono text-sm font-semibold text-terminal-cyan transition-colors hover:bg-terminal-cyan/20">{c.ui.release}</button>
          )}
          {running && phase !== 'hold' && (
            <button onClick={stop} className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-mono text-sm font-semibold text-white/80 transition-colors hover:bg-white/10">{c.ui.stop}</button>
          )}
          {phase === 'done' && (
            <div className="text-center">
              <p className="mb-2 font-mono text-sm text-terminal-green">{fill(c.ui.complete, { n: holds.length })}</p>
              {holds.length > 0 && <p className="mb-3 font-mono text-xs text-white/50">{fill(c.ui.holds, { list: holds.map(fmt).join(' · ') })}</p>}
              <button onClick={stop} className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-6 py-2 font-mono text-xs text-terminal-green hover:bg-terminal-green/20">{c.ui.restart}</button>
            </div>
          )}
        </div>
        <p className="mt-4 text-center font-mono text-[11px] text-white/30">{c.ui.note}</p>
      </div>

      {/* Cold protocol */}
      <h2 className="mb-3 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">{c.coldTitle}</h2>
      <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
        {c.protocol.map((pc) => (
          <div key={pc.label} className="bg-[#0a1018] px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{pc.label}</div>
            <div className="font-mono text-sm text-white/80">{pc.value}</div>
          </div>
        ))}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'wimhof', lang)} variant="tool" lang={lang} />

      {c.sections.map((sec) => (
        <section key={sec.h2} className="mb-10">
          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{sec.h2}</h2>
          <p className="text-sm leading-relaxed text-white/70">
            <Rich text={sec.body} lang={lang} />
          </p>
        </section>
      ))}

      {/* FAQ — mirrors the FAQPage JSON-LD injected at build */}
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{c.faqTitle}</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {c.faq.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <SourcesSection
        heading={c.sourcesTitle}
        methodology={c.methodology}
        sources={WHM_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/tools/breathing', lang)} className="text-terminal-green hover:underline">{c.related.timer}</Link>
        {' · '}
        <Link to={langHref('/tools/nervous-system', lang)} className="text-terminal-green hover:underline">{c.related.nervous}</Link>
        {' · '}
        <Link to={langHref('/articles/wim-hof-breathing-inflammation', lang)} className="text-terminal-green hover:underline">{c.related.article}</Link>
      </div>
    </main>
  )
}
