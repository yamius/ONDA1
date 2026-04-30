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
  parseMetricRoute,
  type Lang,
} from '../src/i18n'
import { getPrerenderRoutes, LOCALIZED_ROUTE_SET, LOCALIZED_METRIC_ROUTE_SET } from './prerender-routes'
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

console.log('[prerender] Using renderToString + JSDOM (no Puppeteer) —', routes.length, 'routes')

for (const route of routes) {
  try {
    const isLocalized = LOCALIZED_ROUTE_SET.has(route)
    const isMetricLocalized = LOCALIZED_METRIC_ROUTE_SET.has(route)
    const metricInfo = isMetricLocalized ? parseMetricRoute(route) : null
    const lang: Lang = isLocalized
      ? langFromPath(route)
      : metricInfo ? metricInfo.lang : 'en'
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
