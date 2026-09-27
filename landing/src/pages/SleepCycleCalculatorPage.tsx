import { Fragment, useEffect, useMemo, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import {
  SLEEP_CYCLE_SOURCES,
  bedtimesForWake,
  wakesForBedtime,
  parseTime,
  fmtTime,
  type CycleOption,
} from '../data/sleep-cycle'
import { sleepToolCopy, fill, type SleepToolCopy } from '../data/sleep-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

type Mode = 'wake' | 'bed'

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

export function SleepCycleCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: SleepToolCopy = sleepToolCopy(lang)

  const [mode, setMode] = useState<Mode>('wake')
  const [wake, setWake] = useState('07:00')
  const [bed, setBed] = useState('23:00')

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const options: CycleOption[] | null = useMemo(() => {
    const m = parseTime(mode === 'wake' ? wake : bed)
    if (m === null) return null
    return mode === 'wake' ? bedtimesForWake(m) : wakesForBedtime(m)
  }, [mode, wake, bed])

  const goingToBedNow = () => {
    const d = new Date()
    setBed(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)
    setMode('bed')
  }

  const hub = (['ru', 'es'] as Lang[]).includes(lang) ? `/${lang}/tools` : '/tools'
  const hours = (h: number) => h.toLocaleString(lang, { maximumFractionDigits: 1 })

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

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 flex overflow-hidden rounded-lg border border-white/15" role="radiogroup">
          {([
            ['wake', c.ui.modeWake],
            ['bed', c.ui.modeBed],
          ] as const).map(([m, lbl]) => (
            <button
              key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)}
              className={`flex-1 px-3 py-2 font-mono text-xs transition-colors ${mode === m ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
            >
              {lbl}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="block w-[200px]">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">
              {mode === 'wake' ? c.ui.wake : c.ui.bed}
            </span>
            <input
              type="time" value={mode === 'wake' ? wake : bed}
              onChange={(e) => (mode === 'wake' ? setWake(e.target.value) : setBed(e.target.value))}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <button
            type="button" onClick={goingToBedNow}
            className="rounded-lg border border-terminal-cyan/40 px-4 py-3 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
          >
            ☾ {c.ui.now}
          </button>
        </div>

        {options ? (
          <div className="mt-6" aria-live="polite">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-white/50">
              {mode === 'wake' ? c.ui.resultWake : c.ui.resultBed}
              <span className="ml-1 text-white/30">{c.ui.best}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {options.map((o, i) => (
                <div
                  key={o.cycles}
                  className={`rounded-lg border px-3 py-3 text-center ${i < 2 ? 'border-terminal-green/40 bg-terminal-green/10' : 'border-white/10 bg-black/20'}`}
                >
                  <div className={`text-lg font-bold ${i < 2 ? 'text-terminal-green' : 'text-white/80'}`}>{fmtTime(o.minutes, lang)}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                    {fill(c.ui.cycles, { n: o.cycles, h: hours(o.totalSleepH) })}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[11px] text-white/40">{c.ui.note}</p>
          </div>
        ) : (
          <p className="mt-4 font-mono text-xs text-white/40">{c.ui.invalid}</p>
        )}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'sleepcycle', lang)} variant="tool" lang={lang} />

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
        sources={SLEEP_CYCLE_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/tools/sleep-debt', lang)} className="text-terminal-green hover:underline">{c.related.debt}</Link>
        {' · '}
        <Link to={langHref('/tools/chronotype', lang)} className="text-terminal-green hover:underline">{c.related.chronotype}</Link>
        {' · '}
        <Link to={langHref('/tools/caffeine', lang)} className="text-terminal-green hover:underline">{c.related.caffeine}</Link>
        {' · '}
        <Link to={langHref('/tools/breathing', lang)} className="text-terminal-green hover:underline">{c.related.breathing}</Link>
      </div>
    </main>
  )
}
