import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { levelsData } from '../data/levels'
import { GlossaryTooltip } from '../components/GlossaryTooltip'

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const DEFAULT_DESCRIPTION =
  'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.'

export function LevelPage() {
  const { number } = useParams<{ number: string }>()
  const levelNum = number ? parseInt(number, 10) : 0
  const level = levelNum > 0 ? levelsData[levelNum] : undefined

  useEffect(() => {
    if (level) {
      const title = `Level ${level.number}: ${level.name} | ONDA Life`
      const url = `${SITE_URL}/level/${level.number}`
      document.title = title
      setMeta('description', level.metaDescription ?? level.subtitle)
      setMeta('og:title', title, true)
      setMeta('og:description', level.metaDescription ?? level.subtitle, true)
      setMeta('og:url', url, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('og:type', 'article', true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', title, true)
      setMeta('twitter:description', level.metaDescription ?? level.subtitle, true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
    return () => {
      document.title = 'ONDA Life — Biohacking App & Systematic Consciousness OS'
      setMeta('description', DEFAULT_DESCRIPTION)
      setMeta('og:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('og:description', DEFAULT_DESCRIPTION, true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('og:type', 'website', true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('twitter:description', DEFAULT_DESCRIPTION, true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
  }, [level])

  if (!level) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">
          Home
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          Level {level.number}: {level.name}
        </span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
        Level {level.number} {level.name}
      </h1>
      <h2 className="mb-10 text-lg font-semibold text-white/60 md:text-xl">
        {level.subtitle}
      </h2>

      {/* Intro */}
      {level.intro.split('\n\n').map((paragraph, i) => (
        <p key={i} className="mb-6 font-mono text-sm leading-relaxed text-white/60 md:text-base">
          {paragraph}
        </p>
      ))}

      <div className="mb-16" />

      {/* System Architecture */}
      <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ {level.architecture.title.toUpperCase()} ]
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {level.architecture.intro}
      </p>
      <div className="mb-12 space-y-8">
        {level.architecture.parts.map((part) => (
          <div
            key={part.slug}
            className={`rounded-lg border p-4 md:p-6 ${level.theme?.borderColor ?? 'border-purple-500/20'} ${level.theme?.borderColor?.replace('border-', 'bg-').replace('/20', '/5') ?? 'bg-purple-500/5'}`}
          >
            <div className={`mb-2 font-mono text-xs ${level.theme?.accentColor ?? 'text-purple-400'}`}>
              {part.number}. {part.label} — {part.protocol}
            </div>
            <p className="mb-2 font-mono text-sm font-semibold text-white/80">
              {part.goal}
            </p>
            <p className="mb-4 font-mono text-sm leading-relaxed text-white/50">
              {part.work}
            </p>
            <Link
              to={`/part/${part.slug}`}
              className="font-mono text-xs text-terminal-cyan transition-colors hover:text-terminal-cyan/80"
              aria-label={`Open ${part.label} protocol`}
              title={`Open ${part.label} protocol — ${part.protocol}`}
            >
              → Open {part.label} protocol
            </Link>
          </div>
        ))}
      </div>

      {/* Biological Protocol */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        Biological Protocol
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {level.biologicalProtocol.intro}
      </p>
      <div className="mb-16 space-y-4">
        {level.biologicalProtocol.items.map((item) => (
          <div key={item.name}>
            <h3 className="mb-1 font-mono text-sm font-bold text-white/80">
              {item.name}
            </h3>
            <p className="font-mono text-sm leading-relaxed text-white/50">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Target Systems */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        Target Systems
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {level.targetSystems.intro}
      </p>
      <ul className="mb-16 space-y-3 pl-1">
        {level.targetSystems.items.map((t) => (
          <li key={t.name} className="font-mono text-sm leading-relaxed text-white/50">
            <span className="mr-2 text-terminal-green/40">•</span>
            <span className="font-bold text-white/70">{t.name}:</span> {t.text}
          </li>
        ))}
      </ul>

      {/* Results & Benefits */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        Results & Benefits
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {level.results.intro}
      </p>
      <ul className="mb-16 space-y-2 pl-1">
        {level.results.items.map((r, i) => (
          <li key={i} className="font-mono text-sm leading-relaxed text-white/50">
            <span className="mr-2 text-terminal-green/40">•</span>
            {r}
          </li>
        ))}
      </ul>

      {/* Video */}
      {level.videoUrl && (
        <div className="mb-16 overflow-hidden rounded-xl border border-white/10">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={level.videoUrl}
              title={`Level ${level.number}: ${level.name} — ONDA Life`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}

      {/* Research Basis */}
      <div className="border-t border-white/5 pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
          Research Basis
        </h2>
        <div className="mb-10 flex flex-wrap gap-2">
          {level.researchLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-terminal-cyan/20 bg-terminal-cyan/5 px-3 py-1.5 font-mono text-xs text-terminal-cyan transition-all hover:border-terminal-cyan/40 hover:bg-terminal-cyan/10"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Related Terms */}
      <div className="border-t border-white/5 pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
          Related Terms
        </h2>
        <div className="flex flex-wrap gap-2">
          {level.glossaryLinks.map((link) => (
            <GlossaryTooltip
              key={link.slug}
              label={link.label}
              slug={link.slug}
              className="rounded-lg border border-terminal-cyan/20 bg-terminal-cyan/5 px-3 py-1.5 font-mono text-xs text-terminal-cyan transition-all hover:border-terminal-cyan/40 hover:bg-terminal-cyan/10"
            />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Link
          to="/"
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
