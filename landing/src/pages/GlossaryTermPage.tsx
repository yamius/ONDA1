import { useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NotFoundPage } from './NotFoundPage'
import Markdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import { getTermBySlug, glossaryTerms } from '../data/glossary'
import { injectGlossaryLinks } from '../utils/glossaryLinks'
import { syncOgLocale } from '../utils/ogLocale'
import { ARTICLE_DATES } from '../data/article-dates.generated'
import { articlesMeta } from '../data/articles/articles-meta.generated'
import { termArticleSlugs } from '../data/articles/term-articles.generated'

function getArticlesForTerm(termSlug: string) {
  const slugs = termArticleSlugs[termSlug] ?? []
  return slugs
    .map((s) => articlesMeta.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => a != null)
}
import { langFromPath } from '../i18n'

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

export function GlossaryTermPage() {
  const { slug } = useParams<{ slug: string }>()
  const term = slug ? getTermBySlug(slug) : undefined
  const { t: tGloss } = useTranslation('glossary')
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  const tField = (termSlug: string, key: string, fallback: string): string =>
    tGloss(`bodies.${termSlug}.${key}`, { defaultValue: fallback }) as string

  const tTitle = term ? tField(term.slug, 'title', term.title) : ''
  const tShortDescription = term ? tField(term.slug, 'shortDescription', term.shortDescription) : ''
  const tContent = term ? tField(term.slug, 'content', term.content) : ''

  useEffect(() => {
    if (!term) return
    const title = `${tTitle} | ONDA Life Glossary`
    const url = `${SITE_URL}${langPrefix}/glossary/${term.slug}`
    const ogDesc = `${tTitle} in the ONDA system: ${tShortDescription} Learn how this element affects your biocomputer.`
    document.title = title
    setMeta('description', ogDesc)
    setMeta('og:title', title, true)
    setMeta('og:description', ogDesc, true)
    setMeta('og:url', url, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('og:type', 'article', true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', ogDesc, true)
    setMeta('twitter:image', OG_IMAGE, true)
    syncOgLocale(lang)

    // --- JSON-LD: DefinedTerm + BreadcrumbList ---
    const setLd = (id: string, payload: object) => {
      let el = document.querySelector<HTMLScriptElement>(`script[data-ld="${id}"]`)
      if (!el) {
        el = document.createElement('script')
        el.setAttribute('type', 'application/ld+json')
        el.setAttribute('data-ld', id)
        document.head.appendChild(el)
      }
      el.textContent = JSON.stringify(payload)
    }
    const removeLd = (id: string) =>
      document.querySelector(`script[data-ld="${id}"]`)?.remove()

    const glossaryDates = ARTICLE_DATES.__glossary
    const definedTermLd = {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: tTitle,
      description: tShortDescription,
      url,
      inLanguage: lang,
      ...(glossaryDates
        ? {
            datePublished: glossaryDates.published,
            dateModified: glossaryDates.modified,
          }
        : {}),
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'ONDA Life Glossary',
        url: `${SITE_URL}${langPrefix}/glossary`,
      },
    }
    setLd('term', definedTermLd)
    setMeta('author', 'ONDA Life')
    if (glossaryDates) {
      setMeta('article:published_time', glossaryDates.published, true)
      setMeta('article:modified_time', glossaryDates.modified, true)
    }

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: tGloss('breadcrumb.home', { defaultValue: 'Home' }),
          item: lang === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${lang}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: tGloss('breadcrumb.current', { defaultValue: 'Glossary' }),
          item: `${SITE_URL}${langPrefix}/glossary`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tTitle,
          item: url,
        },
      ],
    }
    setLd('breadcrumb', breadcrumbLd)

    return () => {
      document.title = 'ONDA Life — Biohacking App & Systematic Consciousness OS'
      setMeta('description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.')
      setMeta('og:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('og:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('og:type', 'website', true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('twitter:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('twitter:image', OG_IMAGE, true)
      removeLd('term')
      removeLd('breadcrumb')
    }
  }, [term, tTitle, tShortDescription, lang, langPrefix, tGloss])

  if (!term) {
    return <NotFoundPage />
  }

  const relatedArticles = getArticlesForTerm(term.slug)

  const relatedTerms = term.relatedSlugs
    ? term.relatedSlugs
        .map((s) => glossaryTerms.find((t) => t.slug === s))
        .filter((t): t is NonNullable<typeof t> => t != null)
        .slice(0, 5)
    : (() => {
        const sameCategory = glossaryTerms.filter(
          (t) => t.slug !== term.slug && t.category === term.category
        )
        if (sameCategory.length >= 5) return sameCategory.slice(0, 5)
        const others = glossaryTerms.filter(
          (t) => t.slug !== term.slug && t.category !== term.category
        )
        return [...sameCategory, ...others].slice(0, 5)
      })()

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to={lang === 'en' ? '/' : `/${lang}`} className="transition-colors hover:text-white/50">
          {tGloss('breadcrumb.home')}
        </Link>
        <span>/</span>
        <Link to={`${langPrefix}/glossary`} className="transition-colors hover:text-white/50">
          {tGloss('breadcrumb.current')}
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">{tTitle}</span>
      </nav>

      {/* Category badge */}
      <div className="mb-4">
        <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-3 py-1 font-mono text-[10px] tracking-wider text-terminal-green">
          {term.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {tTitle}
      </h1>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/50">
        {tShortDescription}
      </p>

      {/* Markdown content */}
      <article className="prose-onda">
        <Markdown
          rehypePlugins={[rehypeSlug]}
          components={{
            h2: ({ children, id, ...props }) => (
              <h2 id={id} className="mb-4 mt-10 text-2xl font-bold tracking-tight first:mt-0 scroll-mt-24" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, id, ...props }) => (
              <h3 id={id} className="mb-3 mt-8 text-lg font-semibold text-white/90 scroll-mt-24" {...props}>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 font-mono text-sm leading-relaxed text-white/50">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-4 space-y-2 pl-4">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 space-y-2 pl-4 list-decimal">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="font-mono text-sm leading-relaxed text-white/50">
                <span className="text-terminal-green/40 mr-1">•</span>
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-white/80">{children}</strong>
            ),
            table: ({ children }) => (
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="border-b border-white/10">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 text-left font-semibold text-white/60">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-t border-white/5 px-3 py-2 text-white/40">
                {children}
              </td>
            ),
            code: ({ children }) => (
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-terminal-green">
                {children}
              </code>
            ),
            a: ({ href, children }) => {
              const isExternal = href?.startsWith('http')
              const className =
                'text-terminal-cyan underline decoration-terminal-cyan/30 underline-offset-2 transition-colors hover:text-terminal-cyan/80 hover:decoration-terminal-cyan/50'
              if (href && !isExternal && href.startsWith('/')) {
                const needsPrefix =
                  langPrefix &&
                  (href.startsWith('/articles/') ||
                    href.startsWith('/glossary/') ||
                    href === '/articles' ||
                    href === '/glossary')
                const to = needsPrefix ? `${langPrefix}${href}` : href
                return (
                  <Link to={to} className={className}>
                    {children}
                  </Link>
                )
              }
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={className}
                >
                  {children}
                </a>
              )
            },
          }}
        >
          {injectGlossaryLinks(tContent, term.slug, langPrefix)}
        </Markdown>
      </article>

      {/* Related Deep Dives */}
      {relatedArticles.length > 0 && (
        <div className="mt-16 border-t border-white/5 pt-10">
          <h3 className="mb-6 font-mono text-xs tracking-widest text-white/30">
            {tGloss('term.relatedDeepDives')}
          </h3>
          <div className="grid gap-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                to={`${langPrefix}/articles/${article.slug}`}
                className="glass-card group flex items-start gap-4 rounded-lg p-5 transition-all hover:border-cyan-500/20"
              >
                <span className="text-2xl" aria-hidden="true">
                  📖
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 font-semibold transition-colors group-hover:text-terminal-green">
                    {article.title}
                  </h4>
                  <p className="font-mono text-xs text-white/40">
                    {tGloss('term.upgradeKnowledge', { term: tTitle })}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related terms */}
      {relatedTerms.length > 0 && (
        <div className="mt-16 border-t border-white/5 pt-10">
          <h3 className="mb-6 font-mono text-xs tracking-widest text-white/30">
            {tGloss('term.relatedTerms')}
          </h3>
          <div className="grid gap-3">
            {relatedTerms.map((related) => (
              <Link
                key={related.slug}
                to={`${langPrefix}/glossary/${related.slug}`}
                className="glass-card group flex items-center justify-between rounded-lg p-4 transition-all hover:border-terminal-green/10"
              >
                <div>
                  <h4 className="font-semibold transition-colors group-hover:text-terminal-green">
                    {tField(related.slug, 'title', related.title)}
                  </h4>
                  <p className="mt-1 font-mono text-xs text-white/30">
                    {tField(related.slug, 'shortDescription', related.shortDescription).slice(0, 80)}...
                  </p>
                </div>
                <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to glossary */}
      <div className="mt-12">
        <Link
          to={`${langPrefix}/glossary`}
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          {tGloss('term.backToGlossary')}
        </Link>
      </div>

      {/* Explore more — always present for SEO link equity */}
      <div className="mt-16 border-t border-white/5 pt-10">
        <h3 className="mb-6 font-mono text-xs tracking-widest text-white/30">{tGloss('term.exploreMore')}</h3>
        <div className="flex flex-wrap gap-3">
          <Link to={`${langPrefix}/glossary`} className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-colors hover:border-terminal-green/30 hover:text-terminal-green/70">
            {tGloss('term.links.fullGlossary')}
          </Link>
          <Link to={`${langPrefix}/articles`} className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-colors hover:border-terminal-green/30 hover:text-terminal-green/70">
            {tGloss('term.links.allArticles')}
          </Link>
          <Link to={`${langPrefix}/bio`} className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-colors hover:border-terminal-green/30 hover:text-terminal-green/70">
            {tGloss('term.links.bioOs')}
          </Link>
          <Link to={`${langPrefix}/the-stack`} className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-colors hover:border-terminal-green/30 hover:text-terminal-green/70">
            {tGloss('term.links.theStack')}
          </Link>
          <Link to={lang === 'en' ? '/' : `/${lang}`} className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-colors hover:border-terminal-green/30 hover:text-terminal-green/70">
            {tGloss('term.links.home')}
          </Link>
        </div>
      </div>
    </div>
  )
}
