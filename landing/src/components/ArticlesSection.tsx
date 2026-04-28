import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/articles'
import { OptimizedImage } from './OptimizedImage'

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function ArticlesSection() {
  const { t } = useTranslation('home')
  const [displayArticles, setDisplayArticles] = useState(() => articles.slice(0, 3))

  useEffect(() => {
    setDisplayArticles(shuffle(articles).slice(0, 3))
  }, [])

  return (
    <section className="relative px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
          {t('articles.tag')}
        </h2>
        <h3 className="mb-4 text-2xl font-bold tracking-tight md:mb-6 md:text-4xl">
          {t('articles.titlePrefix')}{' '}
          <span className="bg-gradient-to-r from-terminal-cyan to-terminal-green bg-clip-text text-transparent">
            {t('articles.titleHighlight')}
          </span>
        </h3>
        <p className="mb-12 max-w-2xl font-mono text-sm text-white/40">
          {t('articles.subtitle')}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/articles/${article.slug}`}
              className="glass-card group flex flex-col overflow-hidden rounded-xl transition-all hover:border-terminal-green/10"
            >
              {article.image && (
                <div className="relative h-24 overflow-hidden rounded-t-xl">
                  <OptimizedImage
                    src={article.image}
                    alt={article.imageAlt ?? article.title}
                    title={article.imageTitle}
                    loading="lazy"
                    width={384}
                    height={96}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
              <span className="mb-2 block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/30 w-fit">
                {article.category}
              </span>
              <h3 className="mb-2 text-base font-semibold leading-tight transition-colors group-hover:text-terminal-green">
                {article.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-white/40 line-clamp-2">
                {article.description}
              </p>
              <span className="mt-2 block font-mono text-xs text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                →
              </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-lg border border-terminal-green/20 bg-terminal-green/5 px-5 py-2.5 font-mono text-sm text-terminal-green transition-all hover:border-terminal-green/40 hover:bg-terminal-green/10"
          >
            {t('articles.viewAll', { count: articles.length })}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
