/**
 * Shared listing logic for the ONDA Library topic hubs (/articles/topic/<topic>).
 * Used by the hub page, meta-inject (CollectionPage/ItemList) and the sitemap
 * (hub <lastmod>) so the visible list, the structured data and the sitemap
 * always agree. Only articles that exist in the registry are listed.
 */
import { articles, type Article } from './articles'
import { ARTICLE_DATES } from './article-dates.generated'
import { LOCALIZED_COVERAGE } from './localized-coverage.generated'
import {
  MIN_LOCALIZED_HUB,
  ARTICLE_PRIMARY_TOPIC,
  ARTICLE_TOPIC_HUBS,
  ARTICLE_WORLD,
  WORLD_COUNTRIES,
  getArticleTopicHub,
  slugsForTopic,
  type ArticleTopicSlug,
  type WorldCountry,
} from './article-topics'

const bySlug = new Map(articles.map((a) => [a.slug, a]))

/** ISO last-modified timestamp for an article ('' if unknown). */
export function articleModified(slug: string): string {
  const d = ARTICLE_DATES[slug]
  return d ? d.modified || d.published : ''
}

/** Newest first; slug as a stable tie-breaker. */
function byModifiedDesc(a: Article, b: Article): number {
  const d = articleModified(b.slug).localeCompare(articleModified(a.slug))
  return d !== 0 ? d : a.slug.localeCompare(b.slug)
}

/** All live articles in a hub, newest first. */
export function liveArticlesForTopic(topic: ArticleTopicSlug): Article[] {
  return slugsForTopic(topic)
    .map((s) => bySlug.get(s))
    .filter((a): a is Article => !!a)
    .sort(byModifiedDesc)
}

export interface HubListing {
  startHere?: Article
  /** Everything except the Start-here article, newest first. */
  rest: Article[]
}

export function hubListing(topic: ArticleTopicSlug): HubListing {
  const hub = getArticleTopicHub(topic)
  const all = liveArticlesForTopic(topic)
  const startHere = hub ? bySlug.get(hub.startHere) : undefined
  return { startHere, rest: all.filter((a) => a.slug !== startHere?.slug) }
}

export interface WorldGroup {
  country: WorldCountry
  articles: Article[]
}

/** World hub, grouped by country (fixed order), newest first within a country. Excludes Start here. */
export function worldGroups(): WorldGroup[] {
  const { startHere, rest } = hubListing('world')
  void startHere
  return WORLD_COUNTRIES.map((country) => ({
    country,
    articles: rest.filter((a) => ARTICLE_WORLD[a.slug] === country),
  })).filter((g) => g.articles.length > 0)
}

/** Ordered article slugs for the hub's ItemList: Start here first, then the list as rendered. */
export function hubItemSlugs(topic: ArticleTopicSlug): string[] {
  const { startHere, rest } = hubListing(topic)
  const ordered = topic === 'world' ? worldGroups().flatMap((g) => g.articles) : rest
  return [...(startHere ? [startHere.slug] : []), ...ordered.map((a) => a.slug)]
}

/** Live article count shown on the tile. */
export function liveCountForTopic(topic: ArticleTopicSlug): number {
  return liveArticlesForTopic(topic).length
}

/** Hub dateModified = most recent article in it (YYYY-MM-DD), or null. */
export function hubLastModified(topic: ArticleTopicSlug): string | null {
  const newest = liveArticlesForTopic(topic)[0]
  const d = newest ? articleModified(newest.slug) : ''
  return d ? d.slice(0, 10) : null
}

// ── Localized hubs (/<lang>/articles/topic/<topic>) ─────────────────────────
// A localized hub lists only articles that have a prerendered page in that
// language, and exists only when it has at least MIN_LOCALIZED_HUB of them
// (thinner topics are listed flat on /<lang>/articles instead).
export { MIN_LOCALIZED_HUB }
const HUB_LANGS = ['en', 'es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt'] as const

function covered(lang: string, slug: string): boolean {
  return lang === 'en' || !!LOCALIZED_COVERAGE[lang]?.articles.has(slug)
}

export function localizedArticlesForTopic(topic: ArticleTopicSlug, lang: string): Article[] {
  return liveArticlesForTopic(topic).filter((a) => covered(lang, a.slug))
}

export function hubAvailable(topic: ArticleTopicSlug, lang: string): boolean {
  return lang === 'en' || localizedArticlesForTopic(topic, lang).length >= MIN_LOCALIZED_HUB
}

/** Languages in which a hub page exists (hreflang cluster + prerender). */
export function hubLangs(topic: ArticleTopicSlug): string[] {
  return HUB_LANGS.filter((l) => hubAvailable(topic, l))
}

/** Start here = the EN pick when translated, else the newest translated article. */
export function localizedHubListing(topic: ArticleTopicSlug, lang: string): HubListing {
  if (lang === 'en') return hubListing(topic)
  const hub = getArticleTopicHub(topic)
  const all = localizedArticlesForTopic(topic, lang)
  const startHere = all.find((a) => a.slug === hub?.startHere) ?? all[0]
  return { startHere, rest: all.filter((a) => a.slug !== startHere?.slug) }
}

export function localizedWorldGroups(lang: string): WorldGroup[] {
  const { rest } = localizedHubListing('world', lang)
  return WORLD_COUNTRIES.map((country) => ({
    country,
    articles: rest.filter((a) => ARTICLE_WORLD[a.slug] === country),
  })).filter((g) => g.articles.length > 0)
}

export function localizedHubItemSlugs(topic: ArticleTopicSlug, lang: string): string[] {
  const { startHere, rest } = localizedHubListing(topic, lang)
  const ordered = topic === 'world' ? localizedWorldGroups(lang).flatMap((g) => g.articles) : rest
  return [...(startHere ? [startHere.slug] : []), ...ordered.map((a) => a.slug)]
}

export function localizedHubLastModified(topic: ArticleTopicSlug, lang: string): string | null {
  const newest = localizedArticlesForTopic(topic, lang)[0]
  const d = newest ? articleModified(newest.slug) : ''
  return d ? d.slice(0, 10) : null
}

/** Translated articles whose primary topic has no hub in this language, newest first. */
export function unhubbedLocalizedArticles(lang: string): Article[] {
  if (lang === 'en') return []
  const open = new Set(ARTICLE_TOPIC_HUBS.filter((h) => hubAvailable(h.slug, lang)).map((h) => h.slug))
  return [...bySlug.values()]
    .filter((a) => covered(lang, a.slug) && ARTICLE_PRIMARY_TOPIC[a.slug] && !open.has(ARTICLE_PRIMARY_TOPIC[a.slug]))
    .sort(byModifiedDesc)
}
