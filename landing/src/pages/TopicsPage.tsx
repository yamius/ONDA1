import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TOPICS, getLocalizedTopic } from '../data/topics'
import { articles } from '../data/articles'
import { langFromPath, homePathFor } from '../i18n'
import { syncOgLocale } from '../utils/ogLocale'

const SITE_URL = 'https://onda-life.com'

function articleCount(slugs: string[]): number {
  const have = new Set(articles.map((a) => a.slug))
  return slugs.filter((s) => have.has(s)).length
}

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.name = name
    document.head.appendChild(el)
  }
  el.content = content
}

export function TopicsPage() {
  const { t } = useTranslation('topics')
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  useEffect(() => {
    document.title = t('meta.title')
    setMeta('description', t('meta.description'))
    syncOgLocale(lang)
  }, [t, lang])

  return (
    <main className="min-h-screen bg-[#050a0f] text-white" data-testid="page-topics">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <nav className="text-xs uppercase tracking-widest text-cyan-400/70 mb-4" aria-label="Breadcrumb">
          <Link to={homePathFor(lang)} className="hover:text-cyan-300" data-testid="link-breadcrumb-home">
            {t('ui.breadcrumbHome')}
          </Link>
          <span className="mx-2 text-white/30">/</span>
          <span>{t('ui.breadcrumbCurrent')}</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" data-testid="text-page-title">
          {t('ui.h1')}
        </h1>
        <p className="text-lg text-white/70 mb-12 max-w-3xl">{t('ui.intro')}</p>

        <ul className="grid gap-6 sm:grid-cols-2">
          {TOPICS.map((topic) => {
            const copy = getLocalizedTopic(topic, lang)
            const count = articleCount(topic.articleSlugs)
            return (
              <li key={topic.slug}>
                <Link
                  to={`${langPrefix}/topics/${topic.slug}`}
                  className="block h-full rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:bg-white/[0.04] hover:border-cyan-400/40"
                  data-testid={`link-topic-${topic.slug}`}
                >
                  <h2 className="text-xl font-semibold text-cyan-200 mb-2" data-testid={`text-topic-title-${topic.slug}`}>
                    {copy.title}
                  </h2>
                  <p className="text-sm text-white/60 mb-3 leading-relaxed">{copy.description}</p>
                  <span className="text-xs text-cyan-400/80" data-testid={`text-topic-count-${topic.slug}`}>
                    {t('ui.articleCount', { count, defaultValue: `${count} articles` })}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        <p className="mt-16 text-xs text-white/40">
          {t('ui.sourceOfTruth')} <code className="text-white/60">src/data/topics.ts</code>.{' '}
          {t('ui.machineReadable')}{' '}
          <a href={`${SITE_URL}/llms.txt`} className="underline hover:text-white/80">/llms.txt</a>.
        </p>
      </div>
    </main>
  )
}
