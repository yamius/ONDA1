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
import { SUPPORTED_LANGS, langFromPath, type Lang } from '../src/i18n'
import { getPrerenderRoutes, HOME_LANG_PATHS } from './prerender-routes'
import { getMetaForRoute, injectMetaIntoHtml } from './meta-inject'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')

const routes = getPrerenderRoutes()
const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

;(globalThis as Record<string, unknown>).React = React

const SITE_URL = 'https://onda-life.com'

// Load all locale JSON once for SEO metadata + hreflang generation
const localesDir = join(projectRoot, 'public', 'locales')
const homeLocales = Object.fromEntries(
  SUPPORTED_LANGS.map(l => [
    l,
    JSON.parse(readFileSync(join(localesDir, l, 'home.json'), 'utf-8')) as Record<string, unknown>,
  ]),
) as Record<Lang, { meta: { title: string; description: string; ogImageAlt: string } }>

function homeUrlFor(lang: Lang): string {
  return lang === 'en' ? SITE_URL : `${SITE_URL}/${lang}`
}

/** Build hreflang alternate <link> tags for the localized home pages. */
function buildHreflangLinks(): string {
  const tags: string[] = []
  for (const lang of SUPPORTED_LANGS) {
    tags.push(`<link rel="alternate" hreflang="${lang}" href="${homeUrlFor(lang)}">`)
  }
  // x-default points to EN root — Google's recommended fallback for unmatched locales.
  tags.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}">`)
  return tags.join('\n  ')
}

const HREFLANG_BLOCK = buildHreflangLinks()

function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * For localized home pages, replace <html lang>, swap title/description/og:* with
 * locale-specific values, and inject hreflang alternates. Other pages are unchanged.
 */
function applyLocalizedHomeMeta(html: string, lang: Lang): string {
  const t = homeLocales[lang].meta
  let out = html

  // <html lang="..">
  out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`)

  const title = escAttr(t.title)
  const desc = escAttr(t.description)
  const ogAlt = escAttr(t.ogImageAlt)
  const url = homeUrlFor(lang)
  const escUrl = escAttr(url)

  // Replace <title>
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
  // Replace meta name=description / name=title
  out = out.replace(/<meta\s+name="description"\s+content="[^"]*">/i, `<meta name="description" content="${desc}">`)
  out = out.replace(/<meta\s+name="title"\s+content="[^"]*">/i, `<meta name="title" content="${title}">`)
  // Replace canonical to localized URL
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, `<link rel="canonical" href="${escUrl}">`)
  // og + twitter
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${title}">`)
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${desc}">`)
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escUrl}">`)
  out = out.replace(/<meta\s+property="og:image:alt"\s+content="[^"]*">/gi, `<meta property="og:image:alt" content="${ogAlt}">`)
  out = out.replace(/<meta\s+property="og:locale"\s+content="[^"]*">/gi, '')
  out = out.replace(/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${title}">`)
  out = out.replace(/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${desc}">`)
  out = out.replace(/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escUrl}">`)

  // Inject hreflang alternates + og:locale before </head> (only once)
  const ogLocaleMap: Record<Lang, string> = {
    en: 'en_US',
    es: 'es_ES',
    ru: 'ru_RU',
    uk: 'uk_UA',
    zh: 'zh_CN',
  }
  const ogLocale = `<meta property="og:locale" content="${ogLocaleMap[lang]}">`
  out = out.replace('</head>', `  ${HREFLANG_BLOCK}\n  ${ogLocale}\n</head>`)

  return out
}

console.log('[prerender] Using renderToString + JSDOM (no Puppeteer) —', routes.length, 'routes')

const homeLangSet = new Set(HOME_LANG_PATHS)

for (const route of routes) {
  try {
    const isLocalizedHome = homeLangSet.has(route)
    const lang: Lang = isLocalizedHome ? langFromPath(route) : 'en'

    const html = renderToString(createApp(route, lang))
    const dom = new JSDOM(template)
    const doc = dom.window.document
    const root = doc.getElementById('root')
    if (root) root.innerHTML = html

    let out = dom.serialize()
    // GTM only on EN main page (/index.html); strip from prerendered subpages and other lang homes.
    if (route !== '/') {
      out = out.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\s*/g, '')
      out = out.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/g, '')
    }
    const meta = getMetaForRoute(route)
    out = injectMetaIntoHtml(out, meta)

    // For localized home pages, override meta with locale-specific copy + hreflang.
    if (isLocalizedHome) {
      out = applyLocalizedHomeMeta(out, lang)
    }

    // Build fingerprint for deployment verification (view page source, search "onda-build")
    const buildStamp = `<!-- onda-build: ${new Date().toISOString()} -->`
    out = out.replace('</head>', `  ${buildStamp}\n</head>`)

    // Main page -> dist/index.html; others -> dist/route/index.html (Express static lookup)
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
