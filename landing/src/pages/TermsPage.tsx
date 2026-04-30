import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { langFromPath } from '../i18n'

const SITE_URL = 'https://onda-life.com'

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

export function TermsPage() {
  const { t } = useTranslation('terms')
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  useEffect(() => {
    const title = t('meta.title')
    const desc = t('meta.description')
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:url', `${SITE_URL}${langPrefix}/terms`, true)
    setMeta('og:type', 'website', true)
    window.scrollTo({ top: 0 })
  }, [t, langPrefix])

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-24">
      <article className="prose prose-invert prose-sm md:prose-base max-w-none
        prose-headings:text-white/90 prose-headings:font-mono
        prose-h1:text-2xl prose-h1:mb-8
        prose-h2:text-base prose-h2:mt-10 prose-h2:mb-3
        prose-p:text-white/50 prose-p:leading-relaxed
        prose-li:text-white/50
        prose-strong:text-white/70
        prose-a:text-cyan-400 hover:prose-a:text-cyan-300
      ">
        <h1>{t('h1')}</h1>
        <div className="flex flex-col gap-1 mb-10">
          <p className="text-white/30 text-xs font-mono m-0"><strong className="text-white/40">{t('applicationLabel')}</strong> {t('applicationValue')}</p>
          <p className="text-white/30 text-xs font-mono m-0"><strong className="text-white/40">{t('lastUpdatedLabel')}</strong> {t('lastUpdatedValue')}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: t('html') }} />
      </article>
    </main>
  )
}
