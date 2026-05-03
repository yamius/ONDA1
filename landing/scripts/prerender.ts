/**
 * Post-build prerender using renderToString + JSDOM (no Puppeteer).
 * Works in Replit and any Node environment — no Chrome/system libs required.
 * Meta tags (title, description, og:*) are injected at build time for SEO.
 * Output: dist/index.html for /, dist/route/index.html for each route (Express-friendly).
 */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createApp } from '../src/entry-server'
import { trimDescription } from './meta-inject'
import {
  SUPPORTED_LANGS,
  LOCALIZED_PAGES,
  langFromPath,
  stripLangPrefix,
  localizedPathFor,
  metricPathFor,
  levelPathFor,
  topicPathFor,
  parseMetricRoute,
  parseLevelRoute,
  parsePartRoute,
  parseTopicRoute,
  type Lang,
} from '../src/i18n'
import { getPrerenderRoutes, LOCALIZED_ROUTE_SET, LOCALIZED_METRIC_ROUTE_SET, LOCALIZED_LEVEL_ROUTE_SET, LOCALIZED_PART_ROUTE_SET, LOCALIZED_TOPIC_ROUTE_SET } from './prerender-routes'
import { getTopicBySlug, getLocalizedTopic } from '../src/data/topics'
import { getMetaForRoute, injectMetaIntoHtml } from './meta-inject'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')

const routes = getPrerenderRoutes()
const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

// Pre-split the template once around the empty <div id="root"></div> placeholder
// so per-route work is just two string concats (no HTML parser, no DOM serialize).
// Falls back to a JSDOM-style replacement if the exact marker isn't found
// (safety net for future Vite changes that might inject attributes).
const ROOT_MARKER = '<div id="root"></div>'
const rootIdx = template.indexOf(ROOT_MARKER)
if (rootIdx === -1) {
  throw new Error(`[prerender] cannot find "${ROOT_MARKER}" in dist/index.html`)
}
const TEMPLATE_HEAD = template.slice(0, rootIdx)
const TEMPLATE_TAIL = template.slice(rootIdx + ROOT_MARKER.length)

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
  const desc = escAttr(trimDescription(m.description))
  const ogAlt = escAttr(m.ogImageAlt)
  const url = pageUrlFor(basePath, lang)
  const escUrl = escAttr(url)

  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${desc}">`)
  out = out.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${title}">`)
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:title" content="${title}">`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:description" content="${desc}">`)
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:image:alt" content="${ogAlt}">`)
  out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/gi, '')
  out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:title" content="${title}">`)
  out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:description" content="${desc}">`)
  out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:url" content="${escUrl}">`)

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
  const escDesc = escAttr(trimDescription(desc))
  const escUrl = escAttr(url)

  let out = html
  out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`)
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escTitle}</title>`)
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escDesc}">`)
  out = out.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${escTitle}">`)
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/gi, '')

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
  const escDesc = escAttr(trimDescription(desc))
  const escUrl = escAttr(url)

  let out = html
  out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`)
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escTitle}</title>`)
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escDesc}">`)
  out = out.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${escTitle}">`)
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/gi, '')

  const hreflang = buildHreflangLinksForLevel(levelNum)
  const ogLocale = `<meta property="og:locale" content="${OG_LOCALE_MAP[lang]}">`
  out = out.replace('</head>', `  ${hreflang}\n  ${ogLocale}\n</head>`)

  return out
}

function topicUrlFor(slug: string, lang: Lang): string {
  return `${SITE_URL}${topicPathFor(slug, lang)}`
}

function buildHreflangLinksForTopic(slug: string): string {
  const tags: string[] = []
  for (const lang of SUPPORTED_LANGS) {
    tags.push(`<link rel="alternate" hreflang="${lang}" href="${topicUrlFor(slug, lang)}">`)
  }
  tags.push(`<link rel="alternate" hreflang="x-default" href="${topicUrlFor(slug, 'en')}">`)
  return tags.join('\n  ')
}

/**
 * Per-language meta for /topics/:slug — title/description come from
 * topics.ts i18n field via getLocalizedTopic.
 */
function applyTopicLocalizedMeta(html: string, slug: string, lang: Lang): string {
  const topic = getTopicBySlug(slug)
  if (!topic) return html
  const copy = getLocalizedTopic(topic, lang)
  const title = `${copy.title} | ONDA Life`
  const desc = copy.description
  const url = topicUrlFor(slug, lang)
  const escTitle = escAttr(title)
  const escDesc = escAttr(trimDescription(desc))
  const escUrl = escAttr(url)

  let out = html
  out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`)
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escTitle}</title>`)
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escDesc}">`)
  out = out.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${escTitle}">`)
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:title" content="${escTitle}">`)
  out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:description" content="${escDesc}">`)
  out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/gi, '')

  const hreflang = buildHreflangLinksForTopic(slug)
  const ogLocale = `<meta property="og:locale" content="${OG_LOCALE_MAP[lang]}">`
  out = out.replace('</head>', `  ${hreflang}\n  ${ogLocale}\n</head>`)

  return out
}

console.log(`[prerender] start — ${routes.length} routes, renderToString + batched async I/O`)
const startTs = Date.now()

let done = 0
let failed = 0
const HEARTBEAT_EVERY = 100

// Phase 1.4: batched parallel I/O. renderToString is CPU-sync (single
// thread), so we keep that in a tight loop, but writeFile + mkdir are I/O
// and DO benefit from concurrency. We accumulate up to BATCH_SIZE
// (route, content) tuples, flush via Promise.all, then continue. Memory
// bounded at ~3MB per batch (16 × ~180KB avg).
const BATCH_SIZE = 16
type PendingWrite = { dir: string; path: string; content: string; route: string }
let pending: PendingWrite[] = []

async function flush() {
  if (pending.length === 0) return
  const batch = pending
  pending = []
  // mkdir + writeFile in parallel — recursive mkdir is idempotent so dup
  // dirs in the batch don't conflict.
  await Promise.all(batch.map(async (w) => {
    try {
      await mkdir(w.dir, { recursive: true })
      await writeFile(w.path, w.content)
      done++
      if (done % HEARTBEAT_EVERY === 0) {
        console.log(`[prerender] ... ${done}/${routes.length}`)
      }
    } catch (err) {
      failed++
      console.error('[prerender] FAIL', w.route, '—', (err as Error).message)
    }
  }))
}

for (const route of routes) {
  try {
    const isLocalized = LOCALIZED_ROUTE_SET.has(route)
    const isMetricLocalized = LOCALIZED_METRIC_ROUTE_SET.has(route)
    const isLevelLocalized = LOCALIZED_LEVEL_ROUTE_SET.has(route)
    const isPartLocalized = LOCALIZED_PART_ROUTE_SET.has(route)
    const isTopicLocalized = LOCALIZED_TOPIC_ROUTE_SET.has(route)
    const metricInfo = isMetricLocalized ? parseMetricRoute(route) : null
    const levelInfo = isLevelLocalized ? parseLevelRoute(route) : null
    const partInfo = isPartLocalized ? parsePartRoute(route) : null
    const topicInfo = isTopicLocalized ? parseTopicRoute(route) : null
    const lang: Lang = isLocalized
      ? langFromPath(route)
      : metricInfo ? metricInfo.lang
      : levelInfo ? levelInfo.lang
      : partInfo ? partInfo.lang
      : topicInfo ? topicInfo.lang
      : 'en'
    const basePath = isLocalized ? stripLangPrefix(route) : route

    const html = renderToString(createApp(route, lang))
    // Direct string assembly — ~50x faster than JSDOM parse+serialize per route.
    let out = `${TEMPLATE_HEAD}<div id="root">${html}</div>${TEMPLATE_TAIL}`
    // GTM only on EN main page (/index.html); strip from prerendered subpages.
    if (route !== '/') {
      out = out.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\s*/g, '')
      out = out.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/g, '')
    }
    const meta = getMetaForRoute(route)
    out = injectMetaIntoHtml(out, meta)

    if (isLocalized) {
      out = applyLocalizedMeta(out, basePath, lang)
    } else if (metricInfo) {
      out = applyMetricLocalizedMeta(out, metricInfo.metric, metricInfo.lang)
    } else if (levelInfo) {
      out = applyLevelLocalizedMeta(out, levelInfo.levelNum, levelInfo.lang)
    } else if (topicInfo) {
      out = applyTopicLocalizedMeta(out, topicInfo.slug, topicInfo.lang)
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
        const escDesc = escAttr(trimDescription(desc))
        const escUrl = escAttr(url)
        out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escUrl}">`)
        if (subtitle) {
          const title = `${subtitle} | ONDA Life`
          const escTitle = escAttr(title)
          out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escTitle}</title>`)
          out = out.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${escTitle}">`)
          out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:title" content="${escTitle}">`)
          out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:title" content="${escTitle}">`)
        }
        if (desc) {
          out = out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escDesc}">`)
          out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:description" content="${escDesc}">`)
          out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:description" content="${escDesc}">`)
        }
        out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="og:url" content="${escUrl}">`)
        out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/gi, `<meta property="twitter:url" content="${escUrl}">`)
        out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/gi, '')
        const hreflang = buildHreflangLinksForPart(partInfo.slug, translatedLangs)
        const ogLocale = `<meta property="og:locale" content="${OG_LOCALE_MAP[partInfo.lang]}">`
        out = out.replace('</head>', `  ${hreflang}\n  ${ogLocale}\n</head>`)
      } else if (partInfo.lang !== 'en') {
        // No translation yet — canonical points to EN to avoid duplicate-content.
        const enUrl = partUrlFor(partInfo.slug, 'en')
        out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${enUrl}">`)
      } else if (translatedLangs.length > 1) {
        // EN URL with siblings translated — emit hreflang cluster from EN side too.
        const hreflang = buildHreflangLinksForPart(partInfo.slug, translatedLangs)
        out = out.replace('</head>', `  ${hreflang}\n</head>`)
      }
    }

    // Self-referencing hreflang fallback for EN-only pages (glossary,
    // articles, topics, license, privacy, terms, contact, the-stack — pages
    // without translation siblings). Google recommends emitting at least a
    // self-hreflang + x-default even for single-language pages so crawlers
    // understand the page is intentionally available only in EN. Localized
    // pages already got their cluster from applyLocalizedMeta etc., so we
    // only inject when no hreflang link exists yet. Idempotent across
    // rebuilds because we gate on presence.
    if (!out.includes('hreflang=')) {
      const selfUrl = (SITE_URL + (route === '/' ? '' : route)).replace(/\/+$/, '') || SITE_URL
      const tags =
        `<link rel="alternate" hreflang="en" href="${selfUrl}">\n` +
        `  <link rel="alternate" hreflang="x-default" href="${selfUrl}">`
      out = out.replace('</head>', `  ${tags}\n</head>`)
    }

    // Build fingerprint for deployment verification (view page source, search "onda-build")
    const buildStamp = `<!-- onda-build: ${new Date().toISOString()} -->`
    out = out.replace('</head>', `  ${buildStamp}\n</head>`)

    const outDir = route === '/' ? distDir : join(distDir, route.slice(1))
    const outPath = join(outDir, 'index.html')
    pending.push({ dir: outDir, path: outPath, content: out, route })
    if (pending.length >= BATCH_SIZE) {
      await flush()
    }
  } catch (err) {
    failed++
    console.error('[prerender] FAIL', route, '— (render)', (err as Error).message)
  }
}
// Drain remaining writes.
await flush()

const elapsed = ((Date.now() - startTs) / 1000).toFixed(1)
console.log(`[prerender] done — ${done} rendered, ${failed} failed (of ${routes.length}) in ${elapsed}s`)

const { execSync } = await import('child_process')
console.log('[build] sitemap')
execSync('tsx scripts/sitemap.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// RSS + Atom feeds for aggregators (Bing News, Inoreader, Feedly).
console.log('[build] feed')
execSync('tsx scripts/feed.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// llms.txt + llms-full.txt for AI search (Perplexity, ChatGPT, Claude).
console.log('[build] llms-txt')
execSync('tsx scripts/llms-txt.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// Google News sitemap (last-48h) — must run AFTER sitemap.ts and after
// llms-txt so dates and URLs match the rest of the build artifacts.
console.log('[build] sitemap-news')
try {
  execSync('tsx scripts/sitemap-news.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch (err) {
  if (process.env.SEO_STRICT === '1') throw err
  console.warn('[build] sitemap-news failed (non-fatal)')
}
// Image sitemap — one <url> per page with <image:image> children + license.
console.log('[build] sitemap-images')
try {
  execSync('tsx scripts/sitemap-images.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch (err) {
  if (process.env.SEO_STRICT === '1') throw err
  console.warn('[build] sitemap-images failed (non-fatal)')
}
// RAG-friendly JSONL corpus + manifest + .gz variant.
console.log('[build] build-corpus')
try {
  execSync('tsx scripts/build-corpus.mjs', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch (err) {
  if (process.env.SEO_STRICT === '1') throw err
  console.warn('[build] build-corpus failed (non-fatal)')
}
// IndexNow ping (Bing/Yandex/Seznam/Naver). Skipped automatically when
// INDEXNOW_DISABLED=1 or when nothing changed since last submission.
console.log('[build] indexnow')
try {
  execSync('tsx scripts/indexnow.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch {
  // Non-fatal: never let IndexNow break the build.
  console.warn('[build] indexnow step failed (non-fatal)')
}
// Static-content validators — run AFTER prerender so we can inspect the
// final dist/. Heading + alt validators are content audits (don't fail the
// build by default, just report); set SEO_STRICT=1 in CI to make them fatal.
console.log('[build] validate-headings')
try {
  execSync('tsx scripts/validate-headings.mjs', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch (err) {
  if (process.env.SEO_STRICT === '1') throw err
  console.warn('[build] validate-headings reported issues (non-fatal — set SEO_STRICT=1 to fail)')
}
console.log('[build] validate-alt-text')
try {
  execSync('tsx scripts/validate-alt-text.mjs', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch (err) {
  if (process.env.SEO_STRICT === '1') throw err
  console.warn('[build] validate-alt-text reported issues (non-fatal — set SEO_STRICT=1 to fail)')
}
// Walks dist/ and emits dist/seo-audit/baseline.{json,md} (or whatever label
// is in SEO_AUDIT_LABEL). Always runs — it's an audit, not a gate.
console.log('[build] seo-crawl')
try {
  execSync('node scripts/seo-crawl.mjs', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch {
  console.warn('[build] seo-crawl failed (non-fatal)')
}
// OG-card generator — fills hero-image-less articles with branded share
// cards. Runs after prerender so dist/ exists. Idempotent.
console.log('[build] og-image-generator')
try {
  execSync('node scripts/og-image-generator.mjs', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch {
  console.warn('[build] og-image-generator failed (non-fatal)')
}
// GEO content audits — flagged non-fatal so a single content gap never breaks
// the build. Set SEO_STRICT=1 in CI to make any of these fatal.
const geoAudits: { label: string; cmd: string }[] = [
  { label: 'research-citation-audit', cmd: 'node scripts/research-citation-audit.mjs' },
  { label: 'audit-faq-coverage', cmd: 'tsx scripts/audit-faq-coverage.mjs' },
  { label: 'validate-glossary-definition', cmd: 'tsx scripts/validate-glossary-definition.mjs' },
  { label: 'validate-keyword-position', cmd: 'node scripts/validate-keyword-position.mjs' },
  { label: 'validate-brand-reinforcement', cmd: 'node scripts/validate-brand-reinforcement.mjs' },
  { label: 'validate-hreflang', cmd: 'node scripts/validate-hreflang.mjs' },
  { label: 'validate-jsonld', cmd: 'node scripts/validate-jsonld.mjs' },
]
for (const audit of geoAudits) {
  console.log(`[build] ${audit.label}`)
  try {
    execSync(audit.cmd, { cwd: join(__dirname, '..'), stdio: 'inherit' })
  } catch (err) {
    if (process.env.SEO_STRICT === '1') throw err
    console.warn(`[build] ${audit.label} reported issues (non-fatal — set SEO_STRICT=1 to fail)`)
  }
}
console.log('[build] all stages complete')
