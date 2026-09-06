import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { langFromPath, localizedPathFor } from '../i18n'
import { syncOgLocale } from '../utils/ogLocale'
import { useLocation } from 'react-router-dom'

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

export function AboutPage() {
  const { t } = useTranslation('about')
  const { t: tHome } = useTranslation('home')
  const location = useLocation()
  const lang = langFromPath(location.pathname)

  useEffect(() => {
    const title = t('meta.title')
    const desc = t('meta.description')
    const url = `${SITE_URL}${localizedPathFor('/about', lang)}`
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', url, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)
    syncOgLocale(lang)
    return () => {
      // On SPA nav away, restore home defaults in current language so the next
      // page (which may not set meta) doesn't show stale About copy.
      const homeTitle = tHome('meta.title')
      const homeDesc = tHome('meta.description')
      document.title = homeTitle
      setMeta('description', homeDesc)
      setMeta('og:title', homeTitle, true)
      setMeta('og:description', homeDesc, true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('twitter:title', homeTitle, true)
      setMeta('twitter:description', homeDesc, true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
  }, [t, tHome, lang])

  const introList = t('introList', { returnObjects: true }) as string[]
  const howList = t('howList', { returnObjects: true }) as string[]
  const rewardsList = t('rewardsList', { returnObjects: true }) as string[]

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        {t('tag')}
      </div>

      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
        {t('title1')}
      </h1>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        {t('intro1')}
      </p>
      <ul className="mb-8 space-y-2 pl-1">
        {introList.map((item, i) => (
          <li key={i} className="font-mono text-sm leading-relaxed text-white/50">
            <span className="mr-2 text-terminal-green/40">•</span>{item}
          </li>
        ))}
      </ul>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        {t('intro2')}
      </p>
      <p className="mb-16 rounded-lg border border-white/10 bg-white/[0.02] p-4 font-mono text-xs leading-relaxed text-white/45">
        {t('disclaimer', {
          defaultValue:
            'The evidence-backed part of ONDA is HRV biofeedback and paced (resonance) breathing — see the science behind ONDA and what ONDA measures. The ONDA Path — its levels and higher-state language — is an experiential framework, not a hierarchy of clinically validated biological states.',
        })}
      </p>

      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {t('title2')}
      </h2>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        {t('how1')}
      </p>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60">
        {t('howLead')}
      </p>
      <ul className="mb-6 space-y-2 pl-1">
        {howList.map((item, i) => (
          <li key={i} className="font-mono text-sm leading-relaxed text-white/50">
            <span className="mr-2 text-terminal-green/40">•</span>{item}
          </li>
        ))}
      </ul>
      <p className="mb-16 font-mono text-sm leading-relaxed text-white/60">
        {t('how2')}
      </p>

      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {t('title3')}
      </h2>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        {t('rewards1')}
      </p>
      <ul className="mb-6 space-y-2 pl-1">
        {rewardsList.map((item, i) => (
          <li key={i} className="font-mono text-sm leading-relaxed text-white/50">
            <span className="mr-2 text-terminal-green/40">•</span>{item}
          </li>
        ))}
      </ul>
      <p className="mb-16 font-mono text-sm leading-relaxed text-white/60">
        {t('rewards2')}
      </p>

      <div className="space-y-6 border-t border-white/5 pt-10">
        <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
          {t('details.heading')}
        </h2>
        <p className="font-mono text-sm leading-relaxed text-white/60">{t('details.p1')}</p>
        <p className="font-mono text-sm leading-relaxed text-white/60">{t('details.p2')}</p>
        <p className="font-mono text-sm leading-relaxed text-white/60">{t('details.p3')}</p>
        <p className="font-mono text-sm leading-relaxed text-white/60">{t('details.p4')}</p>
        <p className="font-mono text-sm leading-relaxed text-white/60">{t('details.p5')}</p>
        <p className="font-mono text-sm leading-relaxed text-white/50">{t('details.p6')}</p>
        <p className="mt-8 font-mono text-base font-semibold text-terminal-green">
          {t('details.goodLuck')}
        </p>
      </div>

      <section className="mt-12 space-y-4 border-t border-white/5 pt-10">
        <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
          {t('author.heading')}
        </h2>
        <p className="font-mono text-sm font-semibold leading-relaxed text-white/80 md:text-base">
          {t('author.lead')}
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/60">{t('author.p1')}</p>
        <p className="font-mono text-sm leading-relaxed text-white/60">{t('author.p2')}</p>
        <p className="font-mono text-sm leading-relaxed text-white/50">{t('author.p3')}</p>
        <a
          href="https://www.linkedin.com/in/yamius"
          target="_blank"
          rel="me noopener noreferrer"
          className="inline-block font-mono text-xs text-terminal-green/70 transition-colors hover:text-terminal-green"
        >
          {t('author.linkedin')}
        </a>
      </section>

      <div className="mt-12">
        <Link
          to={localizedPathFor('/', lang)}
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          {t('back')}
        </Link>
      </div>
    </div>
  )
}
