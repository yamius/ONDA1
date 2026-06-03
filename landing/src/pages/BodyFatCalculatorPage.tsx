import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { langFromPath } from '../i18n'
import { appStoreUrl } from '../config/appStore'
import {
  BODY_FAT_FAQ,
  BODY_FAT_SOURCES,
  BODY_FAT_METHODOLOGY,
  computeBodyFat,
  type Sex,
  type BodyFatResult,
} from '../data/body-fat'
import { SourcesSection } from '../components/SourcesSection'

const IN_TO_CM = 2.54

export function BodyFatCalculatorPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  const [sex, setSex] = useState<Sex>('male')
  const [unit, setUnit] = useState<'cm' | 'in'>('cm')
  const [height, setHeight] = useState('178')
  const [neck, setNeck] = useState('38')
  const [waist, setWaist] = useState('85')
  const [hip, setHip] = useState('95')

  useEffect(() => {
    document.title = 'Body Fat Calculator — U.S. Navy Tape Method | ONDA Life'
    window.scrollTo({ top: 0 })
  }, [])

  const result: BodyFatResult | null = useMemo(() => {
    const toCm = (v: string) => {
      const n = parseFloat(v)
      if (!n || n <= 0) return 0
      return unit === 'cm' ? n : n * IN_TO_CM
    }
    return computeBodyFat({
      sex,
      heightCm: toCm(height),
      neckCm: toCm(neck),
      waistCm: toCm(waist),
      hipCm: sex === 'female' ? toCm(hip) : undefined,
    })
  }, [sex, unit, height, neck, waist, hip])

  const field = (label: string, value: string, set: (v: string) => void) => (
    <label className="block">
      <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-white/50">{label} ({unit})</span>
      <input
        type="number" inputMode="decimal" min={1} value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-lg text-white outline-none focus:border-terminal-green/60"
      />
    </label>
  )

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40">
        <Link to={`${langPrefix}/`} className="hover:text-terminal-green">Home</Link>
        <span>/</span>
        <Link to={`${langPrefix}/tools`} className="hover:text-terminal-green">Tools</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">Body Fat</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Body Fat Calculator</h1>
      <p className="mb-8 font-mono text-sm leading-relaxed text-white/60">
        Estimate your body-fat percentage with just a tape measure, using the U.S. Navy
        circumference method (Hodgdon–Beckett) — and see which fitness band you land in.
      </p>

      <img
        src="/images/tools/body-fat.png"
        alt="Body Fat Calculator — free interactive calculator from ONDA Life"
        width={1200}
        height={630}
        className="mb-8 w-full rounded-xl border border-white/10"
      />

      <div className="mb-6 rounded-xl border border-terminal-green/20 bg-terminal-green/5 p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex overflow-hidden rounded-lg border border-white/15">
            {(['male', 'female'] as const).map((s) => (
              <button
                key={s} onClick={() => setSex(s)}
                className={`px-4 py-2 font-mono text-sm capitalize transition-colors ${sex === s ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex overflow-hidden rounded-lg border border-white/15">
            {(['cm', 'in'] as const).map((u) => (
              <button
                key={u} onClick={() => setUnit(u)}
                className={`px-4 py-2 font-mono text-sm transition-colors ${unit === u ? 'bg-terminal-green/15 text-terminal-green' : 'text-white/50 hover:text-white/80'}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {field('Height', height, setHeight)}
          {field('Neck', neck, setNeck)}
          {field('Waist', waist, setWaist)}
          {sex === 'female' && field('Hip', hip, setHip)}
        </div>

        {result && (
          <div className="mt-6">
            <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">Estimated body fat</div>
            <div className="mb-1 text-4xl font-bold text-terminal-green">{result.percent}<span className="text-xl text-white/40">%</span></div>
            <div className="mb-3 font-mono text-sm font-semibold text-terminal-cyan">{result.categoryLabel}</div>
            <p className="font-mono text-xs leading-relaxed text-white/60">{result.summary}</p>
          </div>
        )}
        {!result && <p className="mt-4 font-mono text-xs text-white/40">Enter your measurements. Waist must exceed neck (and waist+hip exceed neck for women).</p>}
      </div>

      <p className="mb-12 font-mono text-[11px] leading-relaxed text-white/30">
        Educational estimate, not medical advice. The Navy method’s standard error is ~3–4% body fat
        vs hydrostatic weighing — great for tracking a trend, not a precise clinical value. Measure
        relaxed at the end of a normal breath, same conditions each time. DEXA or a Bod Pod are more
        accurate if you need an exact figure.
      </p>

      <div className="mb-12 rounded-xl border border-terminal-cyan/20 bg-terminal-cyan/5 p-5">
        <p className="mb-1 font-semibold text-white/90">Track the trend, not the noise</p>
        <p className="mb-4 font-mono text-xs leading-relaxed text-white/50">
          ONDA Life logs measurements like this over time and ties them to your training, sleep and
          recovery — so you can see whether your plan is actually working.
        </p>
        <a
          href={appStoreUrl('tool_bodyfat')}
          rel="nofollow noopener noreferrer"
          className="inline-block rounded-lg border border-terminal-cyan/40 px-5 py-2 font-mono text-xs text-terminal-cyan transition-colors hover:bg-terminal-cyan/10"
        >
          Download ONDA Life on the App Store →
        </a>
      </div>

      <SourcesSection methodology={BODY_FAT_METHODOLOGY} sources={BODY_FAT_SOURCES} />

      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-terminal-cyan/80">Common questions</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {BODY_FAT_FAQ.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-white/40">
        Related: <Link to={`${langPrefix}/tools/tdee`} className="text-terminal-green hover:underline">TDEE calculator</Link>
        {' · '}
        <Link to={`${langPrefix}/tools/protein`} className="text-terminal-green hover:underline">Protein target</Link>
      </div>
    </main>
  )
}
