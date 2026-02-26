/**
 * Post-build prerender using renderToString + JSDOM (no Puppeteer).
 * Works in Replit and any Node environment — no Chrome/system libs required.
 * Meta tags (title, description, og:*) are injected at build time for SEO.
 */
import React from 'react'
import { JSDOM } from 'jsdom'
import { renderToString } from 'react-dom/server'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createApp } from '../src/entry-server'
import { getPrerenderRoutes } from '../src/config/routes'
import { getMetaForRoute, injectMetaIntoHtml } from './meta-inject'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

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
    const meta = getMetaForRoute(route)
    out = injectMetaIntoHtml(out, meta)

    const outPath =
      route === '/'
        ? join(distDir, 'index.html')
        : join(distDir, route.slice(1), 'index.html')
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, out)
    console.log('[prerender]', route, '->', outPath)
  } catch (err) {
    console.error('[prerender] Failed', route, (err as Error).message)
  }
}

console.log('[prerender] Done')

const { execSync } = await import('child_process')
execSync('tsx scripts/sitemap.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
