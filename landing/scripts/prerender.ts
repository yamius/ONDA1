/**
 * Post-build prerender: visits each route with Puppeteer and saves static HTML.
 * Meta tags (title, description, og:*) are injected at build time for SEO.
 * Run after: npm run build
 * Все маршруты подхватываются автоматически из src/config/routes.ts
 */
import { createServer } from 'http'
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import { getPrerenderRoutes } from '../src/config/routes'
import { getMetaForRoute, injectMetaIntoHtml } from './meta-inject'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const port = 37542

const routes = getPrerenderRoutes()

let originalIndexHtml = ''

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`)
  const pathname = url.pathname
  const base = pathname.split('?')[0]
  const ext = base.includes('.') ? base.split('.').pop() : ''
  const isAsset = ['js', 'css', 'svg', 'png', 'ico', 'woff', 'woff2', 'json'].includes(ext ?? '')
  const fullPath = join(distDir, base.replace(/^\//, ''))

  if (isAsset && existsSync(fullPath)) {
    if (pathname.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript')
    else if (pathname.endsWith('.css')) res.setHeader('Content-Type', 'text/css')
    createReadStream(fullPath).on('error', () => { res.writeHead(404); res.end() }).pipe(res)
  } else {
    res.setHeader('Content-Type', 'text/html')
    res.end(originalIndexHtml)
  }
})

server.listen(port, async () => {
  originalIndexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8')
  console.log('[prerender] Server on port', port)
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  for (const route of routes) {
    try {
      const url = `http://localhost:${port}${route}`
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
      await new Promise((r) => setTimeout(r, 800))
      let html = await page.content()
      const meta = getMetaForRoute(route)
      html = injectMetaIntoHtml(html, meta)
      const outPath = route === '/' ? join(distDir, 'index.html') : join(distDir, route.slice(1), 'index.html')
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, html)
      console.log('[prerender]', route, '->', outPath)
    } catch (err) {
      console.error('[prerender] Failed', route, (err as Error).message)
    }
  }

  await browser.close()
  server.close()
  console.log('[prerender] Done')

  const { execSync } = await import('child_process')
  execSync('tsx scripts/sitemap.ts', { cwd: join(__dirname, '..'), stdio: 'inherit' })
})
