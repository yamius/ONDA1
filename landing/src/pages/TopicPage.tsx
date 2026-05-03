import { Link, useParams, useLocation } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getTopicBySlug, getLocalizedTopic, TOPICS } from '../data/topics'
import { articles } from '../data/articles'
import { glossaryTerms } from '../data/glossary'
import { langFromPath, homePathFor } from '../i18n'
import { syncOgLocale } from '../utils/ogLocale'

const SITE_URL = 'https://onda-life.com'

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.name = name
    document.head.appendChild(el)
  }
  el.content = content
}

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const { t } = useTranslation('topics')

  const topic = slug ? getTopicBySlug(slug) : undefined
  const copy = topic ? getLocalizedTopic(topic, lang) : undefined

  const articleList = useMemo(() => {
    if (!topic) return []
    const map = new Map(articles.map((a) => [a.slug, a]))
    return topic.articleSlugs.map((s) => map.get(s)).filter((a): a is (typeof articles)[number] => Boolean(a))
  }, [topic])

  const glossaryList = useMemo(() => {
    if (!topic) return []
    const map = new Map(glossaryTerms.map((t) => [t.slug, t]))
    return topic.glossarySlugs
      .map((s) => map.get(s))
      .filter((t): t is (typeof glossaryTerms)[number] => Boolean(t))
  }, [topic])

  useEffect(() => {
    if (!topic || !copy) return
    document.title = `${copy.title} | ONDA Life`
    setMeta('description', copy.description)
    setMeta('keywords', copy.keywords.join(', '))
    syncOgLocale(lang)
  }, [topic, copy, lang])

  if (!topic || !copy) {
    return (
      <main className="min-h-screen bg-[#050a0f] text-white" data-testid="page-topic-notfound">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <h1 className="text-3xl font-bold mb-4">{t('detail.notFoundTitle')}</h1>
          <p className="text-white/60 mb-6">{t('detail.notFoundBody')}</p>
          <Link to={`${langPrefix}/topics`} className="text-cyan-300 hover:underline" data-testid="link-back-topics">
            {t('detail.backToTopics')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050a0f] text-white" data-testid={`page-topic-${topic.slug}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <nav className="text-xs uppercase tracking-widest text-cyan-400/70 mb-4" aria-label="Breadcrumb">
          <Link to={homePathFor(lang)} className="hover:text-cyan-300" data-testid="link-breadcrumb-home">
            {t('ui.breadcrumbHome')}
          </Link>
          <span className="mx-2 text-white/30">/</span>
          <Link to={`${langPrefix}/topics`} className="hover:text-cyan-300" data-testid="link-breadcrumb-topics">
            {t('detail.breadcrumbTopics')}
          </Link>
          <span className="mx-2 text-white/30">/</span>
          <span>{copy.title}</span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6" data-testid="text-topic-title">
          {copy.title}
        </h1>

        <p className="text-lg text-white/80 leading-relaxed mb-10" data-testid="text-topic-overview">
          {copy.overview}
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-cyan-200 mb-5" data-testid="heading-topic-articles">
            {t('detail.articlesInHub', { count: articleList.length })}
          </h2>
          {articleList.length === 0 ? (
            <p className="text-white/50">{t('detail.noArticlesYet')}</p>
          ) : (
            <ul className="space-y-4">
              {articleList.map((a) => (
                <li key={a.slug} className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
                  <Link
                    to={`/articles/${a.slug}`}
                    className="block group"
                    data-testid={`link-topic-article-${a.slug}`}
                  >
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-200 mb-1">
                      {a.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">{a.description}</p>
                    <span className="mt-2 inline-block text-xs uppercase tracking-wide text-cyan-400/70">
                      {a.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {glossaryList.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-cyan-200 mb-5" data-testid="heading-topic-glossary">
              {t('detail.glossaryTerms', { count: glossaryList.length })}
            </h2>
            <ul className="space-y-3">
              {glossaryList.map((g) => (
                <li key={g.slug}>
                  <Link
                    to={`/glossary/${g.slug}`}
                    className="text-cyan-200 hover:text-cyan-100 underline-offset-4 hover:underline"
                    data-testid={`link-topic-term-${g.slug}`}
                  >
                    {g.title}
                  </Link>
                  <span className="text-white/50"> — {g.shortDescription}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-cyan-200 mb-3">{t('detail.relatedHubs')}</h2>
          <ul className="flex flex-wrap gap-3">
            {TOPICS.filter((x) => x.slug !== topic.slug)
              .slice(0, 6)
              .map((x) => {
                const xCopy = getLocalizedTopic(x, lang)
                return (
                  <li key={x.slug}>
                    <Link
                      to={`${langPrefix}/topics/${x.slug}`}
                      className="inline-block text-sm rounded-full border border-white/10 px-3 py-1 text-white/70 hover:text-cyan-200 hover:border-cyan-400/40"
                      data-testid={`link-topic-related-${x.slug}`}
                    >
                      {xCopy.title}
                    </Link>
                  </li>
                )
              })}
          </ul>
        </section>

        <footer className="border-t border-white/10 pt-6 text-xs text-white/40">
          {t('detail.citePrefix')} ONDA Life. &ldquo;{copy.title}&rdquo;. {SITE_URL}{langPrefix}/topics/{topic.slug}.{' '}
          {t('detail.licenseLabel')}{' '}
          <Link to="/license" className="underline hover:text-white/70" data-testid="link-license">
            CC-BY-4.0
          </Link>
          .
        </footer>
      </div>
    </main>
  )
}
