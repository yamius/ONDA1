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
import { getPrerenderRoutes } from './prerender-routes'
import { getMetaForRoute, injectMetaIntoHtml } from './meta-inject'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')

const routes = getPrerenderRoutes()
const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

;(globalThis as Record<string, unknown>).React = React

console.log('[prerender] Using renderToString + JSDOM (no Puppeteer) —', routes.length, 'routes')

for (const route of routes) {
  try {
    const html = renderToString(createApp(route))
    const dom = new JSDOM(template)
    const doc = dom.window.document
    const root = doc.getElementById('root')
    if (root) root.innerHTML = html

    let out = dom.serialize()
    // GTM only on main page (index.html); strip from prerendered subpages
    if (route !== '/') {
      out = out.replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\s*/g, '')
      out = out.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/g, '')
    }
    const meta = getMetaForRoute(route)
    out = injectMetaIntoHtml(out, meta)
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
