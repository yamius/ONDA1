import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { langFromPath } from '../i18n'

interface LevelTranslated {
  name: string
  description: string
  parts: string[]
}

interface LevelStyle {
  number: number
  emoji: string
  partSlugs: (string | null)[]
  color: string
  borderColor: string
  accentColor: string
}

// Visual config — stable across languages. Text comes from i18n, slugs from here.
const levelStyles: LevelStyle[] = [
  {
    number: 1,
    emoji: '🌍',
    partSlugs: ['i-am', 'i-move', 'i-adapt'],
    color: 'from-purple-500/20 to-purple-900/10',
    borderColor: 'border-purple-500/20',
    accentColor: 'text-purple-400',
  },
  {
    number: 2,
    emoji: '💧',
    partSlugs: ['i-maneuver', 'i-guard-territory', 'i-am-part-of-the-pack'],
    color: 'from-cyan-500/20 to-cyan-900/10',
    borderColor: 'border-cyan-500/20',
    accentColor: 'text-cyan-400',
  },
  {
    number: 3,
    emoji: '🌬️',
    partSlugs: ['i-distinguish', 'i-focus', 'i-shape-the-vision'],
    color: 'from-sky-500/20 to-sky-900/10',
    borderColor: 'border-sky-500/20',
    accentColor: 'text-sky-400',
  },
  {
    number: 4,
    emoji: '🔥',
    partSlugs: ['i-express', 'i-interact', 'i-co-create'],
    color: 'from-amber-500/20 to-amber-900/10',
    borderColor: 'border-amber-500/20',
    accentColor: 'text-amber-400',
  },
  {
    number: 5,
    emoji: '🧘',
    partSlugs: ['i-sense', 'i-channel', 'i-attune'],
    color: 'from-rose-500/20 to-rose-900/10',
    borderColor: 'border-rose-500/20',
    accentColor: 'text-rose-400',
  },
  {
    number: 6,
    emoji: '🧠',
    partSlugs: ['i-witness', 'i-integrate', 'i-synchronize'],
    color: 'from-indigo-500/20 to-indigo-900/10',
    borderColor: 'border-indigo-500/20',
    accentColor: 'text-indigo-400',
  },
  {
    number: 7,
    emoji: '🧬',
    partSlugs: ['i-remember', 'i-restore', 'i-synthesize'],
    color: 'from-emerald-500/20 to-emerald-900/10',
    borderColor: 'border-emerald-500/20',
    accentColor: 'text-emerald-400',
  },
  {
    number: 8,
    emoji: '🌌',
    partSlugs: ['i-am-vibration', 'i-am-wholeness', 'i-am-the-source'],
    color: 'from-violet-500/20 via-amber-500/10 to-white/5',
    borderColor: 'border-violet-500/30',
    accentColor: 'text-amber-300',
  },
]

export function LevelsSection() {
  const { t } = useTranslation('home')
  const items = t('levels.items', { returnObjects: true }) as LevelTranslated[]

  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('levels.tag')}
        </h2>
        <h3 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
          <span className="text-terminal-green">{t('levels.titleLeft')}</span>{' '}
          <span className="text-terminal-cyan">{t('levels.titleRight')}</span>
        </h3>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/40 md:mb-16">
          {t('levels.subtitle')}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {levelStyles.map((style, i) => (
            <LevelCard key={style.number} style={style} data={items[i]} />
          ))}
        </div>
      </div>
    </section>
  )
}

const levelsWithPages = [1, 2, 3, 4, 5, 6, 7, 8]

function LevelCard({ style, data }: { style: LevelStyle; data: LevelTranslated }) {
  const { t } = useTranslation('home')
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const hasLevelPage = levelsWithPages.includes(style.number)
  return (
    <div
      className={`glass-card rounded-xl border ${style.borderColor} bg-gradient-to-br ${style.color} p-4 transition-all hover:scale-[1.02] md:p-6`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`font-mono text-xs font-semibold ${style.accentColor}`}>
          {hasLevelPage ? (
            <Link to={`${langPrefix}/level/${style.number}`} className="transition-colors hover:opacity-80">
              {t('levels.levelLabel', { n: style.number })} →
            </Link>
          ) : (
            t('levels.levelLabel', { n: style.number })
          )}
        </span>
        <span className="text-2xl">{style.emoji}</span>
      </div>
      <h3 className="mb-2 font-mono text-xl font-bold tracking-wide text-white md:text-2xl">
        {data.name}
      </h3>
      {data.description && (
        <p className="mb-3 font-mono text-[11px] leading-relaxed text-white/40">
          {data.description}
        </p>
      )}
      <div className="flex flex-col gap-0.5 font-mono text-[11px] leading-relaxed text-white/40">
        {data.parts.map((label, idx) => {
          const slug = style.partSlugs[idx]
          return slug ? (
            <Link
              key={idx}
              to={`${langPrefix}/part/${slug}`}
              className={`rounded px-1 py-0.5 transition-colors hover:bg-white/5 hover:text-white/70 ${style.accentColor}`}
            >
              {label} →
            </Link>
          ) : (
            <span key={idx} className={`px-1 py-0.5 ${style.accentColor}`}>{label}</span>
          )
        })}
      </div>
    </div>
  )
}
