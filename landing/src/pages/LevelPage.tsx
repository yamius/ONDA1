import { useEffect } from 'react'
import { useParams, Link, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { levelsData } from '../data/levels'
import { GlossaryTooltip } from '../components/GlossaryTooltip'
import { langFromPath, localizedPathFor, levelPathFor } from '../i18n'
import { syncOgLocale } from '../utils/ogLocale'
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

interface TranslatedPart { label: string; protocol: string; goal: string; work: string }
interface TranslatedItem { name: string; text: string }

export function LevelPage() {
  const { number } = useParams<{ number: string }>()
  const levelNum = number ? parseInt(number, 10) : 0
  const level = levelNum > 0 ? levelsData[levelNum] : undefined
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const { t } = useTranslation('level')
  const { t: tHome } = useTranslation('home')

  // Translated content with EN fallback to keep the page working when a
  // translation key is missing.
  const tName = (t(`levels.${levelNum}.name`, { defaultValue: level?.name ?? '' }) as string)
  const tSubtitle = (t(`levels.${levelNum}.subtitle`, { defaultValue: level?.subtitle ?? '' }) as string)
  const tIntro = (t(`levels.${levelNum}.intro`, { defaultValue: level?.intro ?? '' }) as string)
  const tMetaDesc = (t(`levels.${levelNum}.metaDescription`, { defaultValue: level?.metaDescription ?? level?.subtitle ?? '' }) as string)
  const tArchIntro = (t(`levels.${levelNum}.architecture.intro`, { defaultValue: level?.architecture.intro ?? '' }) as string)
  const tArchParts = (t(`levels.${levelNum}.architecture.parts`, { returnObjects: true, defaultValue: [] as unknown }) as TranslatedPart[]) ?? []
  const tBioIntro = (t(`levels.${levelNum}.biologicalProtocol.intro`, { defaultValue: level?.biologicalProtocol.intro ?? '' }) as string)
  const tBioItems = (t(`levels.${levelNum}.biologicalProtocol.items`, { returnObjects: true, defaultValue: [] as unknown }) as TranslatedItem[]) ?? []
  const tTargetIntro = (t(`levels.${levelNum}.targetSystems.intro`, { defaultValue: level?.targetSystems.intro ?? '' }) as string)
  const tTargetItems = (t(`levels.${levelNum}.targetSystems.items`, { returnObjects: true, defaultValue: [] as unknown }) as TranslatedItem[]) ?? []
  const tResultsIntro = (t(`levels.${levelNum}.results.intro`, { defaultValue: level?.results.intro ?? '' }) as string)
  const tResultsItems = (t(`levels.${levelNum}.results.items`, { returnObjects: true, defaultValue: [] as unknown }) as string[]) ?? []

  useEffect(() => {
    if (level) {
      const title = t('ui.metaTitleTpl', { number: level.number, name: tName })
      const url = `${SITE_URL}${levelPathFor(level.number, lang)}`
      document.title = title
      setMeta('description', tMetaDesc)
      setMeta('og:title', title, true)
      setMeta('og:description', tMetaDesc, true)
      setMeta('og:url', url, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('og:type', 'article', true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', title, true)
      setMeta('twitter:description', tMetaDesc, true)
      setMeta('twitter:image', OG_IMAGE, true)
    syncOgLocale(lang)
    }
    return () => {
      const homeTitle = tHome('meta.title')
      const homeDesc = tHome('meta.description')
      document.title = homeTitle
      setMeta('description', homeDesc)
      setMeta('og:title', homeTitle, true)
      setMeta('og:description', homeDesc, true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('og:type', 'website', true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', homeTitle, true)
      setMeta('twitter:description', homeDesc, true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
  }, [level, tName, tMetaDesc, lang, t, tHome])

  if (!level) {
    return <Navigate to={localizedPathFor('/', lang)} replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to={localizedPathFor('/', lang)} className="transition-colors hover:text-white/50">
          {t('ui.breadcrumbHome')}
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          {t('ui.metaTitleTpl', { number: level.number, name: tName }).replace(' | ONDA Life', '')}
        </span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
        {t('ui.metaTitleTpl', { number: level.number, name: tName }).replace(' | ONDA Life', '').replace(`${level.number}: `, `${level.number} `)}
      </h1>
      <h2 className="mb-10 text-lg font-semibold text-white/60 md:text-xl">
        {tSubtitle}
      </h2>

      {/* Intro */}
      {tIntro.split('\n\n').map((paragraph, i) => (
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
        {tArchIntro}
      </p>
      <div className="mb-12 space-y-8">
        {level.architecture.parts.map((part, i) => {
          const tPart = tArchParts[i] ?? part
          return (
            <div
              key={part.slug}
              className={`rounded-lg border p-4 md:p-6 ${level.theme?.borderColor ?? 'border-purple-500/20'} ${level.theme?.borderColor?.replace('border-', 'bg-').replace('/20', '/5') ?? 'bg-purple-500/5'}`}
            >
              <div className={`mb-2 font-mono text-xs ${level.theme?.accentColor ?? 'text-purple-400'}`}>
                {part.number}. {tPart.label} — {tPart.protocol}
              </div>
              <p className="mb-2 font-mono text-sm font-semibold text-white/80">
                {tPart.goal}
              </p>
              <p className="mb-4 font-mono text-sm leading-relaxed text-white/50">
                {tPart.work}
              </p>
              <Link
                to={`${lang === 'en' ? '' : '/' + lang}/part/${part.slug}`}
                className="font-mono text-xs text-terminal-cyan transition-colors hover:text-terminal-cyan/80"
                aria-label={t('ui.openProtocolAria', { label: tPart.label })}
                title={t('ui.openProtocolTitle', { label: tPart.label, protocol: tPart.protocol })}
              >
                {t('ui.openProtocolPrefix')}{tPart.label}{t('ui.openProtocolSuffix')}
              </Link>
            </div>
          )
        })}
      </div>

      {/* Biological Protocol */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {t('ui.biologicalProtocol')}
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {tBioIntro}
      </p>
      <div className="mb-16 space-y-4">
        {level.biologicalProtocol.items.map((item, i) => {
          const tItem = tBioItems[i] ?? item
          return (
            <div key={item.name}>
              <h3 className="mb-1 font-mono text-sm font-bold text-white/80">
                {tItem.name}
              </h3>
              <p className="font-mono text-sm leading-relaxed text-white/50">
                {tItem.text}
              </p>
            </div>
          )
        })}
      </div>

      {/* Target Systems */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {t('ui.targetSystems')}
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {tTargetIntro}
      </p>
      <ul className="mb-16 space-y-3 pl-1">
        {level.targetSystems.items.map((sys, i) => {
          const tSys = tTargetItems[i] ?? sys
          return (
            <li key={sys.name} className="font-mono text-sm leading-relaxed text-white/50">
              <span className="mr-2 text-terminal-green/40">•</span>
              <span className="font-bold text-white/70">{tSys.name}:</span> {tSys.text}
            </li>
          )
        })}
      </ul>

      {/* Results & Benefits */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {t('ui.resultsBenefits')}
      </h2>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60">
        {tResultsIntro}
      </p>
      <ul className="mb-16 space-y-2 pl-1">
        {level.results.items.map((r, i) => (
          <li key={i} className="font-mono text-sm leading-relaxed text-white/50">
            <span className="mr-2 text-terminal-green/40">•</span>
            {tResultsItems[i] ?? r}
          </li>
        ))}
      </ul>

      {/* Video */}
      {level.videoUrl && (
        <div className="mb-16 overflow-hidden rounded-xl border border-white/10">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={level.videoUrl}
              title={t('ui.videoTitleTpl', { number: level.number, name: tName })}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      )}

      {/* Research Basis — hidden when there are no citations (e.g. Level 8,
          which is experiential, not measured). */}
      {level.researchLinks.length > 0 && (
      <div className="border-t border-white/5 pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
          {t('ui.researchBasis')}
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
      )}

      {/* Related Terms */}
      <div className="border-t border-white/5 pt-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
          {t('ui.relatedTerms')}
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
          to={localizedPathFor('/', lang)}
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          {t('ui.back')}
        </Link>
      </div>
    </div>
  )
}
