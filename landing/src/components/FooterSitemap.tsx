/**
 * HTML Sitemap for crawlers: lists all important pages as direct <a> links.
 * Collapsed by default — content stays in DOM for indexing, users can expand if needed.
 */
import { Link } from 'react-router-dom'
import { articles } from '../data/articles'
import { glossaryTerms } from '../data/glossary'
import { parts } from '../pages/PartPage'
import { levelsData } from '../data/levels'

const MAIN_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/articles', label: 'Articles' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/contact', label: 'Contact' },
  { to: '/the-stack', label: 'The Stack' },
]

export function FooterSitemap() {
  return (
    <details className="group mt-8 w-full" aria-label="Full site map for search engines">
      <summary className="flex cursor-pointer list-none justify-center font-mono text-[10px] text-white/20 transition-colors hover:text-white/30 [&::-webkit-details-marker]:hidden">
        <span className="inline-block border-b border-dotted border-white/10 pb-0.5">Site map</span>
      </summary>
      <nav
        className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 border-t border-white/5 pt-4 font-mono text-[10px] text-white/25 md:grid-cols-4"
        aria-label="All pages"
      >
        <div>
          <span className="block mb-1.5 font-semibold text-white/30">Main</span>
          {MAIN_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="block py-0.5 hover:text-white/50">
              {label}
            </Link>
          ))}
        </div>
        <div>
          <span className="block mb-1.5 font-semibold text-white/30">Articles</span>
          {articles.map((a) => (
            <Link
              key={a.slug}
              to={`/articles/${a.slug}`}
              className="block truncate py-0.5 hover:text-white/50"
            >
              {a.title}
            </Link>
          ))}
        </div>
        <div>
          <span className="block mb-1.5 font-semibold text-white/30">Levels & Parts</span>
          {Object.entries(levelsData).map(([num]) => (
            <Link key={num} to={`/level/${num}`} className="block py-0.5 hover:text-white/50">
              Level {num}
            </Link>
          ))}
          {Object.keys(parts).map((slug) => (
            <Link key={slug} to={`/part/${slug}`} className="block truncate py-0.5 hover:text-white/50">
              {parts[slug].title} {parts[slug].titleHighlight}
            </Link>
          ))}
        </div>
        <div>
          <span className="block mb-1.5 font-semibold text-white/30">Glossary</span>
          {glossaryTerms.map((t) => (
            <Link
              key={t.slug}
              to={`/glossary/${t.slug}`}
              className="block truncate py-0.5 hover:text-white/50"
            >
              {t.title}
            </Link>
          ))}
        </div>
      </nav>
    </details>
  )
}
