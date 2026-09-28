import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation, useParams } from 'react-router-dom'
import type { Article } from '../data/articles'
import { getArticleTopicHub, type ArticleTopicSlug } from '../data/article-topics'
import { hubAvailable, localizedHubListing, localizedWorldGroups } from '../data/article-topic-listing'
import { libraryCopy, fillLib } from '../data/library-i18n'
import { hubFaqFor } from '../data/topic-hub-faq'
import { OptimizedImage } from '../components/OptimizedImage'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import { NotFoundPage } from './NotFoundPage'

/**
 * ONDA Library topic hub — /articles/topic/<topic> and /<lang>/articles/topic/<topic>.
 * Template: breadcrumbs → H1 → intro → Start here (large card) → the rest of the
 * topic's articles (newest first; World hub grouped by country) → adjacent topics.
 * A localized hub lists only articles translated into that language and exists only
 * when hubAvailable() (see article-topic-listing). Everything renders from static
 * data, so the prerendered HTML carries the full list for crawlers. Head meta/JSON-LD
 * come from scripts/meta-inject.ts.
 */
export function ArticleTopicHubPage() {
  const { topic = '' } = useParams<{ topic: string }>()
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const { t } = useTranslation('articles')
  const hub = getArticleTopicHub(topic)
  const copy = libraryCopy(lang)
  const ui = copy.ui
  const hc = hub ? copy.hubs[hub.slug] : undefined
  const name = hc?.name ?? hub?.name ?? ''

  useEffect(() => {
    if (!hub) return
    document.title = `${name} | ${ui.hubTitleSuffix}`
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', hc?.tile ?? hub.tile)
  }, [hub, name, hc, ui.hubTitleSuffix])

  if (!hub || !hubAvailable(hub.slug as ArticleTopicSlug, lang)) return <NotFoundPage />

  const { startHere, rest } = localizedHubListing(hub.slug as ArticleTopicSlug, lang)
  const groups = hub.slug === 'world' ? localizedWorldGroups(lang) : null
  const neighbors = hub.neighbors
    .filter((s) => hubAvailable(s, lang))
    .map((s) => getArticleTopicHub(s))
    .filter((h): h is NonNullable<typeof h> => !!h)
  const faq = hubFaqFor(hub.slug as ArticleTopicSlug, lang)
  const titleOf = (a: Article) => t(`bodies.${a.slug}.title`, { defaultValue: a.title }) as string
  const descOf = (a: Article) => t(`bodies.${a.slug}.description`, { defaultValue: a.description }) as string

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="transition-colors hover:text-white/50">{ui.home}</Link>
        <span>/</span>
        <Link to={langHref('/articles', lang)} className="transition-colors hover:text-white/50">{ui.library}</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{name}</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">{ui.badge}</div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">{name}</h1>
      <p className="mb-6 max-w-3xl text-base leading-relaxed text-white/60">{hc?.intro ?? hub.intro}</p>
      <AppStoreCTA layout="line" ct={storeCt('hub', hub.slug)} variant={hub.slug === 'meditation' ? 'meditation' : 'general'} className="mb-12" />

      {startHere && (
        <section className="mb-14" aria-labelledby="start-here">
          <h2 id="start-here" className="mb-4 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">
            {ui.startHere}
          </h2>
          <Link
            to={langHref(`/articles/${startHere.slug}`, lang)}
            className="glass-card group grid overflow-hidden rounded-xl transition-all hover:border-terminal-green/20 md:grid-cols-2"
          >
            {startHere.image && (
              <div className="aspect-video w-full overflow-hidden border-b border-white/5 md:border-b-0 md:border-r">
                <OptimizedImage
                  src={startHere.image}
                  alt={lang === 'en' ? startHere.imageAlt ?? startHere.title : titleOf(startHere)}
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col justify-center p-6 md:p-8">
              <h3 className="mb-3 text-xl font-semibold transition-colors group-hover:text-terminal-green md:text-2xl">
                {titleOf(startHere)}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-white/50">{descOf(startHere)}</p>
              <span className="mt-4 font-mono text-xs text-terminal-green/70">{ui.readGuide}</span>
            </div>
          </Link>
        </section>
      )}

      {groups ? (
        groups.map((g) => (
          <section key={g.country} className="mb-12" aria-labelledby={`country-${g.country}`}>
            <h2 id={`country-${g.country}`} className="mb-5 text-lg font-semibold tracking-tight text-white/80">
              {copy.countries[g.country] ?? g.country} <span className="font-mono text-xs text-white/30">({g.articles.length})</span>
            </h2>
            <ArticleGrid items={g.articles} lang={lang} titleOf={titleOf} descOf={descOf} />
          </section>
        ))
      ) : (
        <section className="mb-12" aria-labelledby="all-articles">
          <h2 id="all-articles" className="mb-5 font-mono text-xs uppercase tracking-widest text-terminal-cyan/70">
            {fillLib(ui.allGuides, { topic: name, n: rest.length + (startHere ? 1 : 0) })}
          </h2>
          <ArticleGrid items={rest} lang={lang} titleOf={titleOf} descOf={descOf} />
        </section>
      )}

      {faq && (
        <section className="mt-16 border-t border-white/10 pt-10" aria-labelledby="hub-faq">
          <h2 id="hub-faq" className="mb-6 text-xl font-bold tracking-tight md:text-2xl">
            {fillLib(faq.heading, { topic: name })}
          </h2>
          <div className="space-y-8">
            {faq.items.map((f) => (
              <div key={f.q}>
                <h3 className="mb-2 text-base font-semibold text-white/90">{f.q}</h3>
                <p className="mb-2 max-w-3xl text-sm leading-relaxed text-white/60">{f.a}</p>
                <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
                  {f.links.map((l) => (
                    <Link key={l.href} to={langHref(l.href, lang)} className="text-terminal-green/80 hover:text-terminal-green hover:underline">
                      {l.label} →
                    </Link>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <nav className="mt-16 border-t border-white/10 pt-8" aria-label="Related topics">
        {neighbors.length > 0 && (
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-white/40">{ui.relatedTopics}</h2>
        )}
        <div className="flex flex-wrap gap-3">
          {neighbors.map((n) => (
            <Link
              key={n.slug}
              to={langHref(`/articles/topic/${n.slug}`, lang)}
              className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/60 transition-all hover:border-terminal-green/30 hover:text-terminal-green"
            >
              {copy.hubs[n.slug]?.name ?? n.name} →
            </Link>
          ))}
          <Link
            to={langHref('/articles', lang)}
            className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-all hover:border-white/20 hover:text-white/60"
          >
            {ui.allTopics}
          </Link>
        </div>
      </nav>
    </div>
  )
}

function ArticleGrid({
  items,
  lang,
  titleOf,
  descOf,
}: {
  items: Article[]
  lang: Lang
  titleOf: (a: Article) => string
  descOf: (a: Article) => string
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((a) => (
        <Link
          key={a.slug}
          to={langHref(`/articles/${a.slug}`, lang)}
          className="glass-card group overflow-hidden rounded-xl transition-all hover:border-terminal-green/10"
        >
          {a.image && (
            <div className="aspect-video w-full overflow-hidden border-b border-white/5">
              <OptimizedImage
                src={a.image}
                alt={lang === 'en' ? a.imageAlt ?? a.title : titleOf(a)}
                loading="lazy"
                width={640}
                height={360}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-terminal-green">{titleOf(a)}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/40">{descOf(a)}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
