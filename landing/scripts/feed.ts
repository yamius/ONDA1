/**
 * Generates dist/feed.xml (RSS 2.0) and dist/atom.xml (Atom 1.0) from the
 * articles registry. Both standards are emitted because aggregators are
 * picky: Bing News and most news readers prefer RSS, while modern PWA-style
 * aggregators (Inoreader, NetNewsWire) prefer Atom.
 *
 * Per-locale variants live at /:lang/feed.xml + /:lang/atom.xml. Each lists
 * localized titles and descriptions from articles.json.bodies, falling back
 * to EN when no translation exists. Atom variants include
 * <link rel="alternate" hreflang="..."> so feed readers can hop between
 * translations of the same article. RSS variants include <media:content> for
 * the hero image so Inoreader / NetNewsWire render it large.
 *
 * Article ordering: source order in src/data/articles/index.ts is treated as
 * reverse-chronological — newest first.
 *
 * Updates feed: separate /feed-updates.xml lists the 50 most recently
 * modified articles (mtime), useful for readers who want content refreshes
 * not just new publications.
 *
 * Run order: prerender.ts -> sitemap.ts -> feed.ts -> llms-txt.ts -> indexnow.ts
 */
import { writeFileSync, readFileSync, mkdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'
import { SUPPORTED_LANGS, type Lang } from '../src/i18n'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')
const localesDir = join(projectRoot, 'public', 'locales')
const SITE_URL = 'https://onda-life.com'
const MAX_ITEMS = 50
const buildDate = new Date()

const FEED_TITLE_BY_LANG: Record<Lang, string> = {
  en: 'ONDA Life — Biohacking & Consciousness Engineering',
  es: 'ONDA Life — Biohacking e ingeniería de la consciencia',
  ru: 'ONDA Life — Биохакинг и инженерия сознания',
  uk: 'ONDA Life — Біохакінг та інженерія свідомості',
  zh: 'ONDA Life — 生物黑客与意识工程',
}
const FEED_DESC_BY_LANG: Record<Lang, string> = {
  en: 'Long-form articles on HRV training, vagal tone, neuroplasticity, circadian alignment, metabolic flexibility and consciousness firmware. New protocols and deep-dives, treating the body as a biocomputer.',
  es: 'Artículos extensos sobre entrenamiento de HRV, tono vagal, neuroplasticidad, alineación circadiana, flexibilidad metabólica y firmware de la consciencia. Protocolos nuevos y análisis profundos, tratando el cuerpo como un biocomputador.',
  ru: 'Длинные статьи об HRV-тренировке, вагусном тонусе, нейропластичности, циркадной синхронизации, метаболической гибкости и прошивке сознания. Новые протоколы и глубокие разборы, рассматривающие тело как биокомпьютер.',
  uk: 'Довгі статті про HRV-тренування, вагусний тонус, нейропластичність, циркадну синхронізацію, метаболічну гнучкість та прошивку свідомості. Нові протоколи та глибокі розбори, що розглядають тіло як біокомп\u2019ютер.',
  zh: '关于 HRV 训练、迷走神经张力、神经可塑性、昼夜节律对齐、代谢灵活性以及意识固件的长篇文章。将身体视为生物计算机的新协议与深度解析。',
}
const FEED_LANG_CODE: Record<Lang, string> = {
  en: 'en-US',
  es: 'es-ES',
  ru: 'ru-RU',
  uk: 'uk-UA',
  zh: 'zh-CN',
}

interface ArticlesLocaleFile {
  bodies?: Record<string, { title?: string; description?: string }>
}
const articlesByLang: Record<Lang, ArticlesLocaleFile> = {} as Record<Lang, ArticlesLocaleFile>
for (const lang of SUPPORTED_LANGS) {
  try {
    articlesByLang[lang] = JSON.parse(readFileSync(join(localesDir, lang, 'articles.json'), 'utf-8')) as ArticlesLocaleFile
  } catch { articlesByLang[lang] = {} }
}

function xml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function articleSourceMtime(slug: string): Date {
  const candidates = [join(__dirname, '..', 'src', 'data', 'articles', `${slug}.ts`)]
  for (const p of candidates) {
    if (existsSync(p)) {
      try { return statSync(p).mtime } catch { /* ignore */ }
    }
  }
  return buildDate
}

function rfc822(d: Date): string { return d.toUTCString() }
function iso(d: Date): string { return d.toISOString() }

interface FeedItem {
  slug: string
  title: string
  description: string
  category: string
  url: string
  date: Date
  imageUrl: string | undefined
  imageAlt: string | undefined
  /** Other languages that have a body for this article — used for Atom alternates. */
  alternates: { lang: Lang; href: string }[]
}

function buildItems(lang: Lang, items: typeof articles): FeedItem[] {
  return items.map((a) => {
    const local = articlesByLang[lang]?.bodies?.[a.slug]
    const title = local?.title ?? a.title
    const description = local?.description ?? a.description
    const alternates: FeedItem['alternates'] = []
    for (const altLang of SUPPORTED_LANGS) {
      if (altLang === lang) continue
      const has = altLang === 'en' || !!articlesByLang[altLang]?.bodies?.[a.slug]
      if (has) {
        alternates.push({ lang: altLang, href: `${SITE_URL}/articles/${a.slug}` })
      }
    }
    return {
      slug: a.slug,
      title,
      description,
      category: a.category,
      url: `${SITE_URL}/articles/${a.slug}`,
      date: articleSourceMtime(a.slug),
      imageUrl: a.image ? `${SITE_URL}${a.image}` : undefined,
      imageAlt: a.imageAlt,
      alternates,
    }
  })
}

function buildRss(lang: Lang, items: FeedItem[], selfHref: string): string {
  const title = FEED_TITLE_BY_LANG[lang]
  const desc = FEED_DESC_BY_LANG[lang]
  const langCode = FEED_LANG_CODE[lang]
  const rssItems = items
    .map((it) => {
      const enclosure = it.imageUrl
        ? `      <enclosure url="${xml(it.imageUrl)}" type="image/webp" />\n      <media:content url="${xml(it.imageUrl)}" medium="image" type="image/webp"${it.imageAlt ? ` ><media:description>${xml(it.imageAlt)}</media:description></media:content>` : ' />'}`
        : ''
      return `    <item>
      <title>${xml(it.title)}</title>
      <link>${xml(it.url)}</link>
      <guid isPermaLink="true">${xml(it.url)}</guid>
      <description>${xml(it.description)}</description>
      <category>${xml(it.category)}</category>
      <pubDate>${rfc822(it.date)}</pubDate>
${enclosure}
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xml(title)}</title>
    <link>${SITE_URL}</link>
    <description>${xml(desc)}</description>
    <language>${langCode}</language>
    <lastBuildDate>${rfc822(buildDate)}</lastBuildDate>
    <atom:link href="${selfHref}" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`
}

function buildAtom(lang: Lang, items: FeedItem[], selfHref: string): string {
  const title = FEED_TITLE_BY_LANG[lang]
  const desc = FEED_DESC_BY_LANG[lang]
  const langCode = FEED_LANG_CODE[lang]
  const entries = items
    .map((it) => {
      const altLinks = it.alternates
        .map((a) => `    <link rel="alternate" hreflang="${a.lang}" href="${xml(a.href)}" />`)
        .join('\n')
      return `  <entry>
    <title>${xml(it.title)}</title>
    <link href="${xml(it.url)}" />
    <link rel="alternate" hreflang="${lang}" href="${xml(it.url)}" />
${altLinks}
    <id>${xml(it.url)}</id>
    <updated>${iso(it.date)}</updated>
    <published>${iso(it.date)}</published>
    <category term="${xml(it.category)}" />
    <summary>${xml(it.description)}</summary>
  </entry>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${langCode}">
  <title>${xml(title)}</title>
  <subtitle>${xml(desc)}</subtitle>
  <id>${SITE_URL}/</id>
  <link href="${SITE_URL}/" />
  <link href="${selfHref}" rel="self" type="application/atom+xml" />
  <updated>${iso(buildDate)}</updated>
  <author>
    <name>ONDA Life</name>
    <uri>${SITE_URL}</uri>
  </author>
${entries}
</feed>
`
}

mkdirSync(distDir, { recursive: true })

// ---- Per-locale feeds ----
const recent = articles.slice(0, MAX_ITEMS)
const feedSizes: string[] = []
for (const lang of SUPPORTED_LANGS) {
  const items = buildItems(lang, recent)
  const isEn = lang === 'en'
  const dir = isEn ? distDir : join(distDir, lang)
  mkdirSync(dir, { recursive: true })
  const rssSelf = isEn ? `${SITE_URL}/feed.xml` : `${SITE_URL}/${lang}/feed.xml`
  const atomSelf = isEn ? `${SITE_URL}/atom.xml` : `${SITE_URL}/${lang}/atom.xml`
  const rss = buildRss(lang, items, rssSelf)
  const atom = buildAtom(lang, items, atomSelf)
  writeFileSync(join(dir, 'feed.xml'), rss)
  writeFileSync(join(dir, 'atom.xml'), atom)
  feedSizes.push(`${lang}=${(rss.length / 1024).toFixed(0)}/${(atom.length / 1024).toFixed(0)}`)
}

// ---- "Latest updates" feed (sorted by mtime, EN only) ----
const updateItems = [...articles]
  .map((a) => ({ a, mtime: articleSourceMtime(a.slug) }))
  .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
  .slice(0, MAX_ITEMS)
  .map(({ a }) => a)
const updatesItems = buildItems('en', updateItems)
writeFileSync(
  join(distDir, 'feed-updates.xml'),
  buildRss('en', updatesItems, `${SITE_URL}/feed-updates.xml`).replace(
    '<title>',
    '<title>[Updates] ',
  ),
)

console.log(
  `[feed] ${SUPPORTED_LANGS.length} locales (rss/atom KB): ${feedSizes.join(', ')} + feed-updates.xml`,
)
