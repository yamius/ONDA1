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
import { getPrerenderRoutes, LOCALIZED_ROUTE_SET, LOCALIZED_METRIC_ROUTE_SET, LOCALIZED_LEVEL_ROUTE_SET, LOCALIZED_PART_ROUTE_SET } from './prerender-routes'
import { getMetaForRoute, injectMetaIntoHtml } from './meta-inject'

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

console.log('[prerender] Using renderToString + JSDOM (no Puppeteer) —', routes.length, 'routes')

for (const route of routes) {
  try {
    const isLocalized = LOCALIZED_ROUTE_SET.has(route)
    const isMetricLocalized = LOCALIZED_METRIC_ROUTE_SET.has(route)
    const isLevelLocalized = LOCALIZED_LEVEL_ROUTE_SET.has(route)
    const isPartLocalized = LOCALIZED_PART_ROUTE_SET.has(route)
    const metricInfo = isMetricLocalized ? parseMetricRoute(route) : null
    const levelInfo = isLevelLocalized ? parseLevelRoute(route) : null
    const partInfo = isPartLocalized ? parsePartRoute(route) : null
    const lang: Lang = isLocalized
      ? langFromPath(route)
      : metricInfo ? metricInfo.lang
      : levelInfo ? levelInfo.lang
      : partInfo ? partInfo.lang
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
    const meta = getMetaForRoute(route)
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
    }

    // Build fingerprint for deployment verification (view page source, search "onda-build")
    const buildStamp = `<!-- onda-build: ${new Date().toISOString()} -->`
    out = out.replace('</head>', `  ${buildStamp}\n</head>`)

    const outDir = route === '/' ? distDir : join(distDir, route.slice(1))
    mkdirSync(outDir, { recursive: true })
    const outPath = join(outDir, 'index.html')
    writeFileSync(outPath, out)
    console.log('[prerender]', route, '->', outPath)
  } catch (err) {
    console.error('[prerender] Failed', route, (err as Error).message)
  }
}

console.log('[prerender] Done')

const { execSync } = await import('child_process')
execSync('tsx scripts/sitemap.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// llms.txt + llms-full.txt for AI search (Perplexity, ChatGPT, Claude).
execSync('tsx scripts/llms-txt.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
// IndexNow ping (Bing/Yandex/Seznam/Naver). Skipped automatically when
// INDEXNOW_DISABLED=1 or when nothing changed since last submission.
try {
  execSync('tsx scripts/indexnow.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
} catch {
  // Non-fatal: never let IndexNow break the build.
  console.warn('[prerender] indexnow step failed (non-fatal)')
}
