import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { langFromPath, localizedPathFor, langHref } from '../i18n'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import type { ReactNode } from 'react'
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

  type Item = { t: string; d: string }
  const whatItems = t('what.items', { returnObjects: true }) as Item[]
  const infoItems = t('info.items', { returnObjects: true }) as Item[]
  const privacyItems = t('privacy.items', { returnObjects: true }) as string[]

  // Copy carries internal links as [label](/path); every path goes through
  // langHref so /<lang>/… is used only where that page is actually built.
  const rich = (text: string): ReactNode[] => {
    const out: ReactNode[] = []
    const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index))
      out.push(
        <Link key={m.index} to={langHref(m[2], lang)} className="text-terminal-green/80 underline underline-offset-2 hover:text-terminal-green">
          {m[1]}
        </Link>,
      )
      last = m.index + m[0].length
    }
    if (last < text.length) out.push(text.slice(last))
    return out
  }

  const P = 'font-mono text-sm leading-relaxed text-white/60 md:text-base'
  const H2 = 'mb-4 text-2xl font-bold tracking-tight md:text-3xl'

  const itemList = (items: Item[]) => (
    <ul className="mb-12 space-y-3 pl-1">
      {items.map((it, i) => (
        <li key={i} className="font-mono text-sm leading-relaxed text-white/60">
          <span className="mr-2 text-terminal-green/40">•</span>
          <strong className="font-semibold text-white/85">{it.t}</strong> {rich(it.d)}
        </li>
      ))}
    </ul>
  )

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">{t('tag')}</div>

      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">{t('title')}</h1>
      <p className={`mb-4 ${P}`}>{t('lead')}</p>
      <p className="mb-12 font-mono text-sm font-semibold leading-relaxed text-terminal-green/80 md:text-base">{t('principle')}</p>

      <h2 className={H2}>{t('what.heading')}</h2>
      {itemList(whatItems)}

      <h2 className={H2}>{t('basis.heading')}</h2>
      <p className={`mb-4 ${P}`}>{rich(t('basis.p1'))}</p>
      <p className={`mb-12 ${P}`}>{rich(t('basis.p2'))}</p>

      <h2 className={H2}>{t('info.heading')}</h2>
      {itemList(infoItems)}

      <h2 className={H2}>{t('privacy.heading')}</h2>
      <ul className="mb-12 space-y-2 pl-1">
        {privacyItems.map((item, i) => (
          <li key={i} className="font-mono text-sm leading-relaxed text-white/60">
            <span className="mr-2 text-terminal-green/40">•</span>{item}
          </li>
        ))}
      </ul>

      <section className="mb-12 space-y-4 border-t border-white/5 pt-10">
        <h2 className={H2}>{t('person.heading')}</h2>
        <p className="font-mono text-sm font-semibold leading-relaxed text-white/80 md:text-base">{t('person.p1')}</p>
        <p className={P}>{t('person.p2')}</p>
        <p className={P}>{t('person.p3')}</p>
        <a
          href="https://www.linkedin.com/in/yamius"
          target="_blank"
          rel="me noopener noreferrer"
          className="inline-block font-mono text-xs text-terminal-green/70 transition-colors hover:text-terminal-green"
        >
          {t('person.linkedin')}
        </a>
      </section>

      <section className="mb-12 space-y-4 border-t border-white/5 pt-10">
        <h2 className={H2}>{t('company.heading')}</h2>
        <p className={P}>{t('company.p1')}</p>
        <p className={P}>{t('company.p2')}</p>
        <p className="rounded-lg border border-white/10 bg-white/[0.02] p-4 font-mono text-xs leading-relaxed text-white/55">
          {t('company.emergency')}
        </p>
      </section>

      <AppStoreCTA ct={storeCt('about', 'page', lang)} variant="general" lang={lang} />

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
