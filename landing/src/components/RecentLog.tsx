/**
 * Homepage timeline strip — `[ RECENT_LOG ]`. Surfaces the N most-recently
 * published/modified articles so fresh URLs sit on the highest-PageRank
 * surface of the site. Concrete benefit:
 *   - Googlebot crawls the homepage frequently; any URL linked from it
 *     enters the discovery pipeline within the next crawl cycle.
 *   - Internal link equity flows from / into each fresh article URL.
 *
 * Sorted by max(published, modified) so a re-edited older article also
 * surfaces — matches the `B (published OR modified)` policy chosen at
 * design time.
 *
 * Glossary is intentionally excluded for now — every term lives in a
 * single registry file (glossary.ts), so all 215 terms share one git
 * mtime; we cannot derive per-term dates without restructuring the data.
 * Once glossary terms acquire their own dates this component picks them
 * up via the same helper.
 */
import { Link, useLocation } from 'react-router-dom'
import { articles } from '../data/articles'
import { ARTICLE_DATES } from '../data/article-dates.generated'
import { langFromPath, langHref } from '../i18n'

interface LogItem {
  slug: string
  title: string
  description: string
  date: Date
  type: 'ARTICLE'
}

const ITEMS_LIMIT = 5

function recentItems(limit: number): LogItem[] {
  const items: LogItem[] = []
  for (const a of articles) {
    const d = ARTICLE_DATES[a.slug]
    if (!d) continue
    const publishedMs = new Date(d.published).getTime()
    const modifiedMs = new Date(d.modified).getTime()
    const ms = Math.max(
      Number.isFinite(publishedMs) ? publishedMs : 0,
      Number.isFinite(modifiedMs) ? modifiedMs : 0,
    )
    if (!ms) continue
    items.push({
      slug: a.slug,
      title: a.title,
      description: a.description,
      date: new Date(ms),
      type: 'ARTICLE',
    })
  }
  items.sort((a, b) => b.date.getTime() - a.date.getTime())
  return items.slice(0, limit)
}

const MONTH_ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function fmtDate(d: Date): string {
  const m = MONTH_ABBR[d.getUTCMonth()]
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${m} ${day}`
}

export function RecentLog() {
  const items = recentItems(ITEMS_LIMIT)
  const lang = langFromPath(useLocation().pathname)
  if (items.length === 0) return null

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-terminal-green/80">
          [ RECENT_LOG ]
        </h2>
        <Link
          to={langHref('/articles', lang)}
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          latest →
        </Link>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            to={langHref(`/articles/${item.slug}`, lang)}
            className="group block border-l-2 border-white/10 pl-4 transition-colors hover:border-terminal-green/40"
          >
            <div className="mb-1 flex items-center gap-3 font-mono text-[10px] tracking-wider text-white/40">
              <span>{fmtDate(item.date)}</span>
              <span className="text-terminal-cyan/50">·</span>
              <span className="text-terminal-cyan/60">{item.type}</span>
            </div>
            <h3 className="font-semibold transition-colors group-hover:text-terminal-green">
              {item.title}
            </h3>
            <p className="mt-1 line-clamp-1 font-mono text-xs text-white/40">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
