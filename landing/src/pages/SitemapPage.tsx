import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/articles'
import { glossaryTerms } from '../data/glossary'
import { parts } from './PartPage'
import { levelsData } from '../data/levels'
import { METRIC_DETAILS } from '../data/bioMetrics'
import { useEffect } from 'react'
import { langFromPath, langHref } from '../i18n'

const SITE_URL = 'https://onda-life.com'

export function SitemapPage() {
  const { t } = useTranslation('sitemap')
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`

  useEffect(() => {
    const title = t('meta.title')
    const desc = t('meta.description')
    document.title = title
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.content = content
    }
    const setOg = (prop: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
      el.content = content
    }
    setMeta('description', desc)
    setMeta('robots', 'index, follow')
    setOg('og:title', title)
    setOg('og:description', desc)
    setOg('og:url', `${SITE_URL}${langPrefix}/sitemap`)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = `${SITE_URL}${langPrefix}/sitemap`
  }, [t, langPrefix])

  const mainLinks = [
    { to: lang === 'en' ? '/' : `/${lang}`, label: t('main.home') },
    { to: lang === 'en' ? '/about' : `/${lang}/about`, label: t('main.about') },
    { to: lang === 'en' ? '/inner-spectrum' : `/${lang}/inner-spectrum`, label: t('main.philosophy') },
    { to: langHref('/articles', lang), label: t('main.articles') },
    { to: langHref('/glossary', lang), label: t('main.glossary') },
    { to: langHref('/the-stack', lang), label: t('main.stack') },
    { to: langHref('/contact', lang), label: t('main.contact') },
    { to: lang === 'en' ? '/bio' : `/${lang}/bio`, label: t('main.bio') },
  ]

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-6 md:py-24">
      <h1 className="mb-2 font-mono text-2xl font-bold text-cyan-400 md:text-3xl">{t('title')}</h1>
      <p className="mb-12 text-sm text-white/40">{t('subtitle')}</p>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

        {/* Column 1: Main + Glossary below */}
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">{t('sections.main')}</h2>
            <ul className="space-y-2">
              {mainLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">{t('sections.glossary')}</h2>
            <ul className="space-y-2">
              {glossaryTerms.map((term) => (
                <li key={term.slug}>
                  <Link to={langHref(`/glossary/${term.slug}`, lang)} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                    {t(`bodies.${term.slug}.title`, { ns: 'glossary', defaultValue: term.title }) as string}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Column 2: Articles */}
        <section>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">{t('sections.articles')}</h2>
          <ul className="space-y-2">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link to={langHref(`/articles/${a.slug}`, lang)} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                  {t(`bodies.${a.slug}.title`, { ns: 'articles', defaultValue: a.title }) as string}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Column 3: Levels & Parts */}
        <section>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">{t('sections.levelsParts')}</h2>
          <ul className="space-y-2">
            {Object.entries(levelsData).map(([num, level]) => (
              <li key={num}>
                <Link to={`${langPrefix}/level/${num}`} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                  {t('levelLabel', { n: num, name: t(`levels.${num}.name`, { ns: 'level', defaultValue: level.name }) as string })}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-2">
            {Object.entries(parts).map(([slug, part]) => (
              <li key={slug}>
                <Link to={`${langPrefix}/part/${slug}`} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                  {part.title} {part.titleHighlight}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Column 4: Bio OS */}
        <section>
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white/30">{t('sections.bio')}</h2>
          <ul className="space-y-2">
            <li>
              <Link to={lang === 'en' ? '/bio' : `/${lang}/bio`} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                {t('bioRoot')}
              </Link>
            </li>
            {Object.values(METRIC_DETAILS).map((m) => (
              <li key={m.key}>
                <Link to={lang === 'en' ? `/bio/${m.key}` : `/${lang}/bio/${m.key}`} className="text-sm text-white/50 transition-colors hover:text-cyan-400">
                  {t(`metrics.${m.key}.shortTitle`, { ns: 'bio-metric', defaultValue: m.shortTitle }) as string}
                </Link>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  )
}
