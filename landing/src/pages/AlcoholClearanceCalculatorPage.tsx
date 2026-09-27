import { Fragment, useEffect, useMemo, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import {
  ALCOHOL_SOURCES,
  DRINK_PRESETS,
  computeAlcohol,
  gramsOf,
  type AlcoholResult,
  type DrinkKey,
  type Sex,
} from '../data/alcohol-clearance'
import { alcToolCopy, fill, type AlcToolCopy } from '../data/alc-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

/** Languages with a localized /tools hub; others link to the EN hub. */
const TOOLS_HUB_LANGS: readonly Lang[] = ['ru', 'es']

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

/** Number formatted with the page language's decimal separator. */
function num(v: number, lang: Lang, digits: number): string {
  return v.toLocaleString(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function formatHours(h: number, c: AlcToolCopy): string {
  if (h <= 0) return c.time.now
  const whole = Math.floor(h)
  const mins = Math.round((h - whole) * 60)
  if (whole === 0) return `${mins} ${c.time.m}`
  if (mins === 0) return `${whole} ${c.time.h}`
  return `${whole} ${c.time.h} ${mins} ${c.time.m}`
}

interface Custom { ml: string; abv: string; count: number }

export function AlcoholClearanceCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: AlcToolCopy = alcToolCopy(lang)

  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [weight, setWeight] = useState('75')
  const [sex, setSex] = useState<Sex>('male')
  const [counts, setCounts] = useState<Record<DrinkKey, number>>({ beer: 2, beerSmall: 0, wine: 0, spirits: 0 })
  const [custom, setCustom] = useState<Custom>({ ml: '', abv: '', count: 0 })
  const [hoursSince, setHoursSince] = useState('1')

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const grams = useMemo(() => {
    let g = DRINK_PRESETS.reduce((sum, d) => sum + counts[d.key] * gramsOf(d.ml, d.abv), 0)
    const ml = parseFloat(custom.ml.replace(',', '.'))
    const abv = parseFloat(custom.abv.replace(',', '.'))
    if (custom.count > 0 && ml > 0 && abv > 0 && abv <= 100) g += custom.count * gramsOf(ml, abv)
    return g
  }, [counts, custom])

  const result: AlcoholResult | null = useMemo(() => {
    const w = parseFloat(weight.replace(',', '.'))
    if (!w || w <= 0 || grams <= 0) return null
    const kg = unit === 'kg' ? w : w * 0.453592
    if (kg < 30 || kg > 250) return null
    return computeAlcohol({ kg, sex, grams, hoursSince: parseFloat(hoursSince.replace(',', '.')) || 0 })
  }, [weight, unit, sex, grams, hoursSince])

  const bump = (k: DrinkKey, d: number) => setCounts((s) => ({ ...s, [k]: Math.max(0, Math.min(30, s[k] + d)) }))
  const permilleFirst = c.primaryUnit === 'permille'
  const hub = TOOLS_HUB_LANGS.includes(lang) ? `/${lang}/tools` : '/tools'

  const Stepper = ({ value, onDec, onInc }: { value: number; onDec: () => void; onInc: () => void }) => (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onDec} aria-label={c.form.remove}
        className="h-8 w-8 rounded-md border border-white/15 font-mono text-white/70 hover:border-white/30">−</button>
      <span className="w-6 text-center font-mono text-white">{value}</span>
      <button type="button" onClick={onInc} aria-label={c.form.add}
        className="h-8 w-8 rounded-md border border-terminal-green/40 font-mono text-terminal-green hover:bg-terminal-green/10">+</button>
    </div>
  )

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
        src="/images/tools/alcohol.png"
        alt={c.imageAlt}
        width={1200}
        height={630}
        className="mb-6 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4" role="note">
        <p className="font-mono text-[11px] leading-relaxed text-amber-200/80">⚠ {c.warning}</p>
      </div>

      {/* Calculator */}
      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.form.weight}</span>
            <div className="flex gap-2">
              <input
                type="text" inputMode="decimal" value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
              />
              <div className="flex overflow-hidden rounded-lg border border-white/15">
                {(['kg', 'lb'] as const).map((u) => (
                  <button
                    key={u} type="button" onClick={() => setUnit(u)} aria-pressed={unit === u}
                    className={`px-3 font-mono text-sm transition-colors ${unit === u ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </label>
          <div className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.form.sex}</span>
            <div className="flex overflow-hidden rounded-lg border border-white/15" role="radiogroup">
              {(['male', 'female'] as const).map((s) => (
                <button
                  key={s} type="button" role="radio" aria-checked={sex === s} onClick={() => setSex(s)}
                  className={`flex-1 px-3 py-3 font-mono text-sm transition-colors ${sex === s ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
                >
                  {s === 'male' ? c.form.male : c.form.female}
                </button>
              ))}
            </div>
          </div>
        </div>

        <fieldset className="mb-5">
          <legend className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">{c.form.drinks}</legend>
          <div className="space-y-2">
            {DRINK_PRESETS.map((d) => (
              <div key={d.key} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <span className="font-mono text-xs text-white/75">{c.drinks[d.key]}</span>
                <Stepper value={counts[d.key]} onDec={() => bump(d.key, -1)} onInc={() => bump(d.key, 1)} />
              </div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <span className="font-mono text-xs text-white/75">{c.form.custom}</span>
              <div className="flex items-center gap-2">
                <input
                  type="text" inputMode="decimal" placeholder="250" aria-label={c.form.ml} value={custom.ml}
                  onChange={(e) => setCustom((s) => ({ ...s, ml: e.target.value }))}
                  className="w-16 rounded-md border border-white/15 bg-black/30 px-2 py-1 font-mono text-sm text-white outline-none"
                />
                <span className="font-mono text-[11px] text-white/40">{c.form.ml}</span>
                <input
                  type="text" inputMode="decimal" placeholder="8" aria-label={c.form.abv} value={custom.abv}
                  onChange={(e) => setCustom((s) => ({ ...s, abv: e.target.value }))}
                  className="w-14 rounded-md border border-white/15 bg-black/30 px-2 py-1 font-mono text-sm text-white outline-none"
                />
                <span className="font-mono text-[11px] text-white/40">{c.form.abv}</span>
                <Stepper
                  value={custom.count}
                  onDec={() => setCustom((s) => ({ ...s, count: Math.max(0, s.count - 1) }))}
                  onInc={() => setCustom((s) => ({ ...s, count: Math.min(30, s.count + 1) }))}
                />
              </div>
            </div>
          </div>
          <p className="mt-2 font-mono text-[11px] text-white/45">{fill(c.form.total, { g: num(grams, lang, 0) })}</p>
        </fieldset>

        <label className="block sm:w-1/2">
          <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{c.form.hours}</span>
          <input
            type="text" inputMode="decimal" value={hoursSince}
            onChange={(e) => setHoursSince(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
          />
        </label>

        {result && (
          <div className="mt-6" aria-live="polite">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">{c.result.now}</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">
              {permilleFirst ? (
                <>{num(result.currentPermille, lang, 2)}<span className="text-xl text-white/40">‰</span>
                  <span className="ml-3 text-lg text-white/40">{num(result.currentBac, lang, 3)}%</span></>
              ) : (
                <>{num(result.currentBac, lang, 3)}<span className="text-xl text-white/40">%</span>
                  <span className="ml-3 text-lg text-white/40">{num(result.currentPermille, lang, 2)}‰</span></>
              )}
            </div>
            <p className="mb-4 font-mono text-xs text-white/50">
              {fill(c.result.peak, { permille: num(result.peakPermille, lang, 2), pct: num(result.peakBac, lang, 3) })}
            </p>
            <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-center sm:w-1/2">
              <div className="text-lg font-bold text-terminal-cyan">{formatHours(result.hoursToSober, c)}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{c.result.sober}</div>
            </div>
            <p className="mt-3 font-mono text-[10px] text-white/35">{c.result.units}</p>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">{grams <= 0 ? c.form.empty : c.invalid}</p>}
      </div>

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'alcohol', lang)} variant="tool" lang={lang} />

      {c.sections.map((s) => (
        <section key={s.h2} className="mb-10">
          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{s.h2}</h2>
          <p className="text-sm leading-relaxed text-white/70">
            <Rich text={s.body} lang={lang} />
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
        sources={ALCOHOL_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/articles/how-long-does-alcohol-stay-in-your-system', lang)} className="text-terminal-green hover:underline">{c.related.article}</Link>
        {' · '}
        <Link to={langHref('/articles/how-much-alcohol-lowers-hrv', lang)} className="text-terminal-green hover:underline">{c.related.hrvArticle}</Link>
        {' · '}
        <Link to={langHref('/tools/hrv', lang)} className="text-terminal-green hover:underline">{c.related.hrv}</Link>
        {' · '}
        <Link to={langHref('/tools/sleep-debt', lang)} className="text-terminal-green hover:underline">{c.related.sleep}</Link>
      </div>
    </main>
  )
}
