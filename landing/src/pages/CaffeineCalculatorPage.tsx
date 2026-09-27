import { Fragment, useEffect, useMemo, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import {
  CAFFEINE_DRINKS,
  CAFFEINE_SOURCES,
  caffeineCutoff,
  parseTime,
  DEFAULT_HALF_LIFE_H,
  type CaffeineResult,
} from '../data/caffeine-norms'
import { fmtTime } from '../data/sleep-cycle'
import { caffToolCopy, fill, type CaffToolCopy } from '../data/caff-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

const METABOLISM = [
  { id: 'fast', hl: 4 },
  { id: 'normal', hl: DEFAULT_HALF_LIFE_H },
  { id: 'slow', hl: 8.5 },
] as const
type DrinkId = keyof CaffToolCopy['drinks']

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

export function CaffeineCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: CaffToolCopy = caffToolCopy(lang)

  const [bedtime, setBedtime] = useState('23:00')
  const [drinkId, setDrinkId] = useState<DrinkId>('coffee')
  const [metab, setMetab] = useState<'fast' | 'normal' | 'slow'>('normal')

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const drink = CAFFEINE_DRINKS.find((d) => d.id === drinkId) ?? CAFFEINE_DRINKS[1]
  const halfLife = METABOLISM.find((m) => m.id === metab)!.hl

  const result: CaffeineResult | null = useMemo(() => {
    const bed = parseTime(bedtime)
    if (bed === null) return null
    return caffeineCutoff(drink.mg, bed, halfLife)
  }, [bedtime, drink.mg, halfLife])

  const maxMg = result ? result.curve[0].mg : 1
  const hub = lang === 'en' ? '/tools' : `/${lang}/tools`
  const dn = (id: string) => c.drinks[id as DrinkId]

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.bedtime}</span>
            <input
              type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.drink}</span>
            <select
              value={drinkId} onChange={(e) => setDrinkId(e.target.value as DrinkId)}
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white outline-none focus:border-terminal-green/60"
            >
              {CAFFEINE_DRINKS.map((d) => (
                <option key={d.id} value={d.id}>{dn(d.id).name} — {d.mg} mg</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.metabolism}</span>
          <div className="flex gap-2" role="radiogroup">
            {METABOLISM.map((m) => (
              <button
                key={m.id} type="button" role="radio" aria-checked={metab === m.id}
                onClick={() => setMetab(m.id)}
                className={`flex-1 rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                  metab === m.id ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/50 hover:border-white/30'
                }`}
              >
                {c.ui[m.id]}
              </button>
            ))}
          </div>
        </div>

        {result ? (
          <div className="mt-6" aria-live="polite">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.result}</div>
            <div className="mb-4 text-4xl font-bold text-terminal-green">{fmtTime(result.cutoffMin, lang)}</div>
            <p className="mb-4 font-mono text-xs leading-relaxed text-white/60">
              {result.hoursBeforeBed < 0.25
                ? fill(c.ui.below, { mg: drink.mg })
                : fill(c.ui.gap, { h: result.hoursBeforeBed.toLocaleString(lang, { maximumFractionDigits: 1 }) })}
            </p>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-widest text-white/40">{c.ui.curve}</div>
            <div className="flex items-end gap-1" style={{ height: 90 }} aria-hidden="true">
              {result.curve.map((p) => (
                <div key={p.h} className="flex flex-1 flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-terminal-cyan/40 to-terminal-green/70"
                    style={{ height: `${Math.max(2, (p.mg / maxMg) * 70)}px` }}
                    title={`${p.h}${c.ui.hShort}: ${p.mg} mg`}
                  />
                  <span className="mt-1 font-mono text-[9px] text-white/30">{p.h}{c.ui.hShort}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 font-mono text-xs text-white/40">{c.ui.invalid}</p>
        )}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'caffeine', lang)} variant="tool" lang={lang} />

      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{c.ui.tableTitle}</h2>
      <div className="mb-10 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-white/50">
              <th scope="col" className="px-3 py-2 text-left">{c.ui.colDrink}</th>
              <th scope="col" className="px-3 py-2 text-left">{c.ui.colServing}</th>
              <th scope="col" className="px-3 py-2 text-right">{c.ui.colCaffeine}</th>
            </tr>
          </thead>
          <tbody>
            {CAFFEINE_DRINKS.map((d) => (
              <tr key={d.id} className="border-b border-white/5 text-white/70">
                <th scope="row" className="px-3 py-2 text-left font-semibold text-white/90">{dn(d.id).name}</th>
                <td className="px-3 py-2 text-left text-white/40">{dn(d.id).note}</td>
                <td className="px-3 py-2 text-right text-terminal-green">{d.mg} mg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        sources={CAFFEINE_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/articles/caffeine-half-life-sleep-pressure', lang)} className="text-terminal-green hover:underline">{c.related.article}</Link>
        {' · '}
        <Link to={langHref('/tools/sleep-cycle', lang)} className="text-terminal-green hover:underline">{c.related.sleep}</Link>
        {' · '}
        <Link to={langHref('/tools/chronotype', lang)} className="text-terminal-green hover:underline">{c.related.chronotype}</Link>
        {' · '}
        <Link to={langHref('/tools/hrv', lang)} className="text-terminal-green hover:underline">{c.related.hrv}</Link>
      </div>
    </main>
  )
}
