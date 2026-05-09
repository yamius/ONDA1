/**
 * Post-build prerender using renderToString + JSDOM (no Puppeteer).
 * Works in Replit and any Node environment — no Chrome/system libs required.
 * Meta tags (title, description, og:*) are injected at build time for SEO.
 * Output: dist/index.html for /, dist/route/index.html for each route (Express-friendly).
 */
import React from 'react'
import { JSDOM } from 'jsdom'
import { renderToString } from 'react-dom/server'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createApp } from '../src/entry-server'
import {
  SUPPORTED_LANGS,
  LOCALIZED_PAGES,
  langFromPath,
  stripLangPrefix,
  localizedPathFor,
  metricPathFor,
  levelPathFor,
  parseMetricRoute,
  parseLevelRoute,
  parsePartRoute,
  type Lang,
} from '../src/i18n'
import { getPrerenderRoutes, LOCALIZED_ROUTE_SET, LOCALIZED_METRIC_ROUTE_SET, LOCALIZED_LEVEL_ROUTE_SET, LOCALIZED_PART_ROUTE_SET, LOCALIZED_ARTICLE_ROUTE_SET, articleLocalizedLangs } from './prerender-routes'
import { getMetaForRoute, injectMetaIntoHtml, truncateForBudget, TITLE_MAX, DESC_MAX } from './meta-inject'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')

const routes = getPrerenderRoutes()
const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

;(globalThis as Record<string, unknown>).React = React

const SITE_URL = 'https://onda-life.com'

interface PageMeta { title: string; description: string; ogImageAlt: string }
interface BioMetricFile {
  ui: { metaDescriptionTpl: string }
  metrics: Record<string, { title: string; shortTitle: string }>
}

// Load every localized namespace for every language so prerender can swap meta
// per (page, language) without doing async i18n during render.
const localesDir = join(projectRoot, 'public', 'locales')
const localizedMeta: Record<string, Record<Lang, PageMeta>> = {}
for (const [, ns] of Object.entries(LOCALIZED_PAGES)) {
  const byLang: Record<Lang, PageMeta> = {} as Record<Lang, PageMeta>
  for (const lang of SUPPORTED_LANGS) {
    const file = JSON.parse(readFileSync(join(localesDir, lang, `${ns}.json`), 'utf-8')) as { meta: PageMeta }
    byLang[lang] = file.meta
  }
  localizedMeta[ns] = byLang
}

// Bio metric translations per language (for /bio/:metric pages).
const bioMetricByLang: Record<Lang, BioMetricFile> = {} as Record<Lang, BioMetricFile>
for (const lang of SUPPORTED_LANGS) {
  bioMetricByLang[lang] = JSON.parse(readFileSync(join(localesDir, lang, 'bio-metric.json'), 'utf-8')) as BioMetricFile
}

interface LevelFile {
  ui: { metaTitleTpl: string }
  levels: Record<string, { name: string; metaDescription?: string; subtitle?: string }>
}
// Level translations per language (for /level/:n pages).
const levelByLang: Record<Lang, LevelFile> = {} as Record<Lang, LevelFile>
for (const lang of SUPPORTED_LANGS) {
  levelByLang[lang] = JSON.parse(readFileSync(join(localesDir, lang, 'level.json'), 'utf-8')) as LevelFile
}

interface PartFile {
  parts?: Record<string, { metaDescription?: string; subtitle?: string }>
}

/**
 * Subset of the per-locale articles.json shape we read at prerender time.
 * Keys are article slugs; values carry the localised title + description
 * we splice into <title>, og:title and meta description when prerendering
 * the localised /<lang>/articles/<slug> URL.
 */
interface ArticlesFile {
  bodies?: Record<string, { title?: string; description?: string }>
}
const articlesByLang: Record<Lang, ArticlesFile> = {} as Record<Lang, ArticlesFile>
for (const lang of SUPPORTED_LANGS) {
  articlesByLang[lang] = JSON.parse(readFileSync(join(localesDir, lang, 'articles.json'), 'utf-8')) as ArticlesFile
}

/** Parse /<lang>/articles/<slug> or /articles/<slug> into {lang, slug}. */
function parseArticleRoute(route: string): { lang: Lang; slug: string } | null {
  const m = route.match(/^(?:\/(en|es|ru|uk|zh))?\/articles\/([^/]+)$/)
  if (!m) return null
  return { lang: ((m[1] as Lang) ?? 'en'), slug: m[2] }
}

function articleUrlFor(slug: string, lang: Lang): string {
  return lang === 'en' ? `${SITE_URL}/articles/${slug}` : `${SITE_URL}/${lang}/articles/${slug}`
}

/** Hreflang cluster for an article — only includes languages with a localised URL. */
function buildHreflangLinksForArticle(slug: string, langs: readonly string[]): string {
  const tags: string[] = []
  for (const lang of langs) {
    tags.push(`<link rel="alternate" hreflang="${lang}" href="${articleUrlFor(slug, lang as Lang)}">`)
  }
  tags.push(`<link rel="alternate" hreflang="x-default" href="${articleUrlFor(slug, 'en')}">`)
  return tags.join('\n  ')
}
// Part translations per language. The `parts` block is empty for languages
// whose body content hasn't been translated yet — we use this presence check
// to decide whether to apply localized meta + hreflang or fall back to EN.
const partByLang: Record<Lang, PartFile> = {} as Record<Lang, PartFile>
for (const lang of SUPPORTED_LANGS) {
  partByLang[lang] = JSON.parse(readFileSync(join(localesDir, lang, 'part.json'), 'utf-8')) as PartFile
}

/** Languages (incl. EN) for which a part has fully translated body content. */
function partLangsWithTranslation(slug: string): Lang[] {
  const out: Lang[] = ['en']
  for (const lang of SUPPORTED_LANGS) {
    if (lang === 'en') continue
    if (partByLang[lang].parts && partByLang[lang].parts![slug]) out.push(lang)
  }
  return out
}

function pageUrlFor(basePath: string, lang: Lang): string {
  return `${SITE_URL}${localizedPathFor(basePath, lang)}`.replace(/\/+$/, '') || SITE_URL
}

/** Build hreflang alternate <link> tags for one localized page group. */
function buildHreflangLinksFor(basePath: string): string {
  const tags: string[] = []
  for (const lang of SUPPORTED_LANGS) {
    tags.push(`<link rel="alternate" hreflang="${lang}" href="${pageUrlFor(basePath, lang)}">`)
  }
  // x-default → EN version of this page (Google's recommended fallback).
  tags.push(`<link rel="alternate" hreflang="x-default" href="${pageUrlFor(basePath, 'en')}">`)
  return tags.join('\n  ')
}

function metricUrlFor(metric: string, lang: Lang): string {
  return `${SITE_URL}${metricPathFor(metric, lang)}`
}

function buildHreflangLinksForMetric(metric: string): string {
  const tags: string[] = []
  for (const lang of SUPPORTED_LANGS) {
    tags.push(`<link rel="alternate" hreflang="${lang}" href="${metricUrlFor(metric, lang)}">`)
  }
  tags.push(`<link rel="alternate" hreflang="x-default" href="${metricUrlFor(metric, 'en')}">`)
  return tags.join('\n  ')
}

function levelUrlFor(levelNum: number, lang: Lang): string {
  return `${SITE_URL}${levelPathFor(levelNum, lang)}`
}

function buildHreflangLinksForLevel(levelNum: number): string {
  const tags: string[] = []
  for (const lang of SUPPORTED_LANGS) {
    tags.push(`<link rel="alternate" hreflang="${lang}" href="${levelUrlFor(levelNum, lang)}">`)
  }
  tags.push(`<link rel="alternate" hreflang="x-default" href="${levelUrlFor(levelNum, 'en')}">`)
  return tags.join('\n  ')
}

function partUrlFor(slug: string, lang: Lang): string {
  return `${SITE_URL}${lang === 'en' ? `/part/${slug}` : `/${lang}/part/${slug}`}`
}

/** Hreflang cluster for a part — only includes languages that have a body translation. */
function buildHreflangLinksForPart(slug: string, langs: Lang[]): string {
  const tags: string[] = []
  for (const lang of langs) {
    tags.push(`<link rel="alternate" hreflang="${lang}" href="${partUrlFor(slug, lang)}">`)
  }
  tags.push(`<link rel="alternate" hreflang="x-default" href="${partUrlFor(slug, 'en')}">`)
  return tags.join('\n  ')
}

const OG_LOCALE_MAP: Record<Lang, string> = {
  en: 'en_US',
  es: 'es_ES',
  ru: 'ru_RU',
  uk: 'uk_UA',
  zh: 'zh_CN',
}

function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Replace title/description/og:* with locale-specific values, set <html lang>,
 * inject hreflang alternates + og:locale. Used for every page in LOCALIZED_PAGES.
 */
function applyLocalizedMeta(html: string, basePath: string, lang: Lang): string {
  const ns = LOCALIZED_PAGES[basePath]
  if (!ns) return html
  const m = localizedMeta[ns][lang]
  let out = html

  out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`)

  const title = escAttr(m.title)
  const desc = escAttr(m.description)
  const ogAlt = escAttr(m.ogImageAlt)
  const url = pageUrlFor(basePath, lang)
  const escUrl = escAttr(url)

  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*">/i, `<meta name="description" content="${desc}">`)
  out = out.replace(/<meta\s+name="title"\s+content="[^"]*">/i, `<meta name="title" content="${title}">`)
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, `<link rel="canonical" href="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${title}">`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${desc}">`)
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:image:alt"\s+content="[^"]*">/gi, `<meta property="og:image:alt" content="${ogAlt}">`)
  out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*">/gi, '')
  out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${title}">`)
  out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${desc}">`)
  out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escUrl}">`)

  const hreflang = buildHreflangLinksFor(basePath)
  const ogLocale = `<meta property="og:locale" content="${OG_LOCALE_MAP[lang]}">`
  out = out.replace('</head>', `  ${hreflang}\n  ${ogLocale}\n</head>`)

  return out
}

/**
 * Same idea as applyLocalizedMeta but for /bio/:metric pages — title and
 * description come from bio-metric.json instead of a flat page meta block.
 */
function applyMetricLocalizedMeta(html: string, metric: string, lang: Lang): string {
  const file = bioMetricByLang[lang]
  const m = file.metrics[metric]
  if (!m) return html

  const title = `${m.title} | ONDA Life Bio OS`
  const desc = file.ui.metaDescriptionTpl.replace('{{title}}', m.title)
  const url = metricUrlFor(metric, lang)
  const escTitle = escAttr(title)
  const escDesc = escAttr(desc)
  const escUrl = escAttr(url)

  let out = html
  out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`)
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escTitle}</title>`)
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*">/i, `<meta name="description" content="${escDesc}">`)
  out = out.replace(/<meta\s+name="title"\s+content="[^"]*">/i, `<meta name="title" content="${escTitle}">`)
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, `<link rel="canonical" href="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*">/gi, '')

  const hreflang = buildHreflangLinksForMetric(metric)
  const ogLocale = `<meta property="og:locale" content="${OG_LOCALE_MAP[lang]}">`
  out = out.replace('</head>', `  ${hreflang}\n  ${ogLocale}\n</head>`)

  return out
}

/**
 * Same idea as applyMetricLocalizedMeta but for /level/:n pages — title and
 * description come from level.json keyed by level number.
 */
function applyLevelLocalizedMeta(html: string, levelNum: number, lang: Lang): string {
  const file = levelByLang[lang]
  const lvl = file.levels[String(levelNum)]
  if (!lvl) return html

  const title = file.ui.metaTitleTpl.replace('{{number}}', String(levelNum)).replace('{{name}}', lvl.name)
  const desc = lvl.metaDescription ?? lvl.subtitle ?? ''
  const url = levelUrlFor(levelNum, lang)
  const escTitle = escAttr(title)
  const escDesc = escAttr(desc)
  const escUrl = escAttr(url)

  let out = html
  out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`)
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escTitle}</title>`)
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*">/i, `<meta name="description" content="${escDesc}">`)
  out = out.replace(/<meta\s+name="title"\s+content="[^"]*">/i, `<meta name="title" content="${escTitle}">`)
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, `<link rel="canonical" href="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*">/gi, '')

  const hreflang = buildHreflangLinksForLevel(levelNum)
  const ogLocale = `<meta property="og:locale" content="${OG_LOCALE_MAP[lang]}">`
  out = out.replace('</head>', `  ${hreflang}\n  ${ogLocale}\n</head>`)

  return out
}

console.log(`[prerender] start — ${routes.length} routes, renderToString + JSDOM`)

let done = 0
let failed = 0
const HEARTBEAT_EVERY = 100
for (const route of routes) {
  try {
    const isLocalized = LOCALIZED_ROUTE_SET.has(route)
    const isMetricLocalized = LOCALIZED_METRIC_ROUTE_SET.has(route)
    const isLevelLocalized = LOCALIZED_LEVEL_ROUTE_SET.has(route)
    const isPartLocalized = LOCALIZED_PART_ROUTE_SET.has(route)
    const isArticleLocalized = LOCALIZED_ARTICLE_ROUTE_SET.has(route)
    const metricInfo = isMetricLocalized ? parseMetricRoute(route) : null
    const levelInfo = isLevelLocalized ? parseLevelRoute(route) : null
    const partInfo = isPartLocalized ? parsePartRoute(route) : null
    // articleInfo also fires for the EN /articles/<slug> route — used to
    // emit a hreflang cluster on the EN side when the slug has a
    // localised sibling. parseArticleRoute returns lang='en' for the EN URL.
    const articleInfo = parseArticleRoute(route)
    const lang: Lang = isLocalized
      ? langFromPath(route)
      : metricInfo ? metricInfo.lang
      : levelInfo ? levelInfo.lang
      : partInfo ? partInfo.lang
      : isArticleLocalized && articleInfo ? articleInfo.lang
      : 'en'
    const basePath = isLocalized ? stripLangPrefix(route) : route

    const html = renderToString(createApp(route, lang))
    const dom = new JSDOM(template)
    const doc = dom.window.document
    const root = doc.getElementById('root')
    if (root) root.innerHTML = html

    let out = dom.serialize()
    // GTM only on EN main page (/index.html); strip from prerendered subpages.
    if (route !== '/') {
      out = out.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\s*/g, '')
      out = out.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/g, '')
    }
    // For /<lang>/articles/<slug>, ask getMetaForRoute about the EN
    // equivalent so injectMetaIntoHtml emits the proper TechArticle
    // JSON-LD, FAQPage, HowTo, breadcrumbs etc. Localised strings are
    // patched in the article branch below.
    const metaRoute = isArticleLocalized && articleInfo ? `/articles/${articleInfo.slug}` : route
    const meta = getMetaForRoute(metaRoute)
    out = injectMetaIntoHtml(out, meta)

    if (isLocalized) {
      out = applyLocalizedMeta(out, basePath, lang)
    } else if (metricInfo) {
      out = applyMetricLocalizedMeta(out, metricInfo.metric, metricInfo.lang)
    } else if (levelInfo) {
      out = applyLevelLocalizedMeta(out, levelInfo.levelNum, levelInfo.lang)
    } else if (partInfo) {
      const translatedLangs = partLangsWithTranslation(partInfo.slug)
      const hasTranslation = translatedLangs.includes(partInfo.lang)
      out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${partInfo.lang}"`)

      if (hasTranslation && partInfo.lang !== 'en') {
        // Translated body — apply localized meta and hreflang cluster (only
        // includes languages that actually have translations so far).
        const partFile = partByLang[partInfo.lang]
        const partData = partFile.parts?.[partInfo.slug]
        const desc = partData?.metaDescription ?? ''
        const subtitle = partData?.subtitle ?? ''
        const url = partUrlFor(partInfo.slug, partInfo.lang)
        const escDesc = escAttr(desc)
        const escUrl = escAttr(url)
        out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, `<link rel="canonical" href="${escUrl}">`)
        if (subtitle) {
          const title = `${subtitle} | ONDA Life`
          const escTitle = escAttr(title)
          out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escTitle}</title>`)
          out = out.replace(/<meta\s+name="title"\s+content="[^"]*">/i, `<meta name="title" content="${escTitle}">`)
          out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${escTitle}">`)
          out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${escTitle}">`)
        }
        if (desc) {
          out = out.replace(/<meta\s+name="description"\s+content="[^"]*">/i, `<meta name="description" content="${escDesc}">`)
          out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${escDesc}">`)
          out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${escDesc}">`)
        }
        out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escUrl}">`)
        out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escUrl}">`)
        out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*">/gi, '')
        const hreflang = buildHreflangLinksForPart(partInfo.slug, translatedLangs)
        const ogLocale = `<meta property="og:locale" content="${OG_LOCALE_MAP[partInfo.lang]}">`
        out = out.replace('</head>', `  ${hreflang}\n  ${ogLocale}\n</head>`)
      } else if (partInfo.lang !== 'en') {
        // No translation yet — canonical points to EN to avoid duplicate-content.
        const enUrl = partUrlFor(partInfo.slug, 'en')
        out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, `<link rel="canonical" href="${enUrl}">`)
      } else if (translatedLangs.length > 1) {
        // EN URL with siblings translated — emit hreflang cluster from EN side too.
        const hreflang = buildHreflangLinksForPart(partInfo.slug, translatedLangs)
        out = out.replace('</head>', `  ${hreflang}\n</head>`)
      }
    } else if (articleInfo) {
      // Article route — either /articles/<slug> (EN) or /<lang>/articles/<slug>
      // (currently only ES, gated by ES_PILOT_ARTICLE_SLUGS in prerender-routes.ts).
      const articleLangs = articleLocalizedLangs(articleInfo.slug)
      const hasLocalizedSibling = articleLangs.length > 1
      out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${articleInfo.lang}"`)

      if (articleInfo.lang !== 'en') {
        // Localised article URL — patch title, description, canonical,
        // og:url, og:locale to the localised values, then emit the cluster.
        const body = articlesByLang[articleInfo.lang].bodies?.[articleInfo.slug]
        const subtitle = body?.title ?? ''
        const desc = body?.description ?? ''
        const url = articleUrlFor(articleInfo.slug, articleInfo.lang)
        const escUrl = escAttr(url)
        out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, `<link rel="canonical" href="${escUrl}">`)
        if (subtitle) {
          const title = `${subtitle} — ONDA Life`
          const escTitle = escAttr(title)
          out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escTitle}</title>`)
          out = out.replace(/<meta\s+name="title"\s+content="[^"]*">/i, `<meta name="title" content="${escTitle}">`)
          out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${escTitle}">`)
          out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${escTitle}">`)
        }
        if (desc) {
          const escDesc = escAttr(desc)
          out = out.replace(/<meta\s+name="description"\s+content="[^"]*">/i, `<meta name="description" content="${escDesc}">`)
          out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${escDesc}">`)
          out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${escDesc}">`)
        }
        out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escUrl}">`)
        out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escUrl}">`)
        out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*">/gi, '')
        const hreflang = buildHreflangLinksForArticle(articleInfo.slug, articleLangs)
        const ogLocale = `<meta property="og:locale" content="${OG_LOCALE_MAP[articleInfo.lang]}">`
        out = out.replace('</head>', `  ${hreflang}\n  ${ogLocale}\n</head>`)
      } else if (hasLocalizedSibling) {
        // EN URL whose slug has a localised sibling — emit cluster from EN side
        // so Google/Bing find the alt-language URLs from the EN page too.
        const hreflang = buildHreflangLinksForArticle(articleInfo.slug, articleLangs)
        out = out.replace('</head>', `  ${hreflang}\n</head>`)
      }
    }

    // Final-pass title + description truncate. Catches localized branches
    // (applyLocalizedMeta, metric, level, part) that write <title> and
    // <meta description> directly without going through injectMetaIntoHtml.
    // Idempotent: a value already within budget is returned unchanged.
    out = out.replace(/<title>([^<]*)<\/title>/i, (_m, t: string) => `<title>${truncateForBudget(t, TITLE_MAX)}</title>`)
    out = out.replace(/<meta\s+name="description"\s+content="([^"]*)">/i, (_m, d: string) => `<meta name="description" content="${truncateForBudget(d, DESC_MAX)}">`)
    out = out.replace(/<meta\s+property="og:title"\s+content="([^"]*)">/gi, (_m, t: string) => `<meta property="og:title" content="${truncateForBudget(t, TITLE_MAX)}">`)
    out = out.replace(/<meta\s+property="og:description"\s+content="([^"]*)">/gi, (_m, d: string) => `<meta property="og:description" content="${truncateForBudget(d, DESC_MAX)}">`)
    out = out.replace(/<meta\s+property="twitter:title"\s+content="([^"]*)">/gi, (_m, t: string) => `<meta property="twitter:title" content="${truncateForBudget(t, TITLE_MAX)}">`)
    out = out.replace(/<meta\s+property="twitter:description"\s+content="([^"]*)">/gi, (_m, d: string) => `<meta property="twitter:description" content="${truncateForBudget(d, DESC_MAX)}">`)

    // Self-referencing hreflang fallback for pages that didn't get a localized
    // cluster from the branches above (EN-only pages: glossary terms, articles,
    // license, privacy, terms, contact, etc). Reads the canonical URL injected
    // by injectMetaIntoHtml and emits hreflang="en" + hreflang="x-default"
    // pointing to the same canonical. Idempotent — gated on the absence of any
    // existing hreflang= attribute.
    if (!/hreflang=/.test(out)) {
      const canonMatch = out.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)
      if (canonMatch) {
        const canonUrl = canonMatch[1]
        const selfHreflang = [
          `<link rel="alternate" hreflang="en" href="${canonUrl}">`,
          `<link rel="alternate" hreflang="x-default" href="${canonUrl}">`,
        ].join('\n  ')
        out = out.replace('</head>', `  ${selfHreflang}\n</head>`)
      }
    }

    // Build fingerprint for deployment verification (view page source, search "onda-build")
    const buildStamp = `<!-- onda-build: ${new Date().toISOString()} -->`
    out = out.replace('</head>', `  ${buildStamp}\n</head>`)

    const outDir = route === '/' ? distDir : join(distDir, route.slice(1))
    mkdirSync(outDir, { recursive: true })
    const outPath = join(outDir, 'index.html')
    writeFileSync(outPath, out)
    done++
    if (done % HEARTBEAT_EVERY === 0) {
      console.log(`[prerender] ... ${done}/${routes.length}`)
    }
  } catch (err) {
    failed++
    console.error('[prerender] FAIL', route, '—', (err as Error).message)
  }
}

console.log(`[prerender] done — ${done} rendered, ${failed} failed (of ${routes.length})`)

const { execSync } = await import('child_process')
console.log('[build] sitemap')
execSync('tsx scripts/sitemap.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// RSS + Atom feeds for aggregators (Bing News, Inoreader, Feedly).
console.log('[build] feed')
execSync('tsx scripts/feed.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// llms.txt + llms-full.txt for AI search (Perplexity, ChatGPT, Claude).
console.log('[build] llms-txt')
execSync('tsx scripts/llms-txt.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// Single-fetch RAG corpus (JSONL + .gz) for AI ingestion pipelines.
console.log('[build] rag-corpus')
execSync('tsx scripts/rag-corpus.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// IndexNow ping (Bing/Yandex/Seznam/Naver). Skipped automatically when
// INDEXNOW_DISABLED=1 or when nothing changed since last submission.
console.log('[build] indexnow')
try {
  execSync('tsx scripts/indexnow.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch {
  // Non-fatal: never let IndexNow break the build.
  console.warn('[build] indexnow step failed (non-fatal)')
}
console.log('[build] all stages complete')
