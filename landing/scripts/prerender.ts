/**
 * Post-build prerender: visits each route with Puppeteer and saves static HTML.
 * Run after: npm run build
 * Все маршруты подхватываются автоматически из src/config/routes.ts
 */
import { createServer } from 'http'
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import { getPrerenderRoutes } from '../src/config/routes'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const port = 37542

const routes = getPrerenderRoutes()

function serveFile(pathname: string) {
  const base = pathname.split('?')[0]
  const ext = base.includes('.') ? base.split('.').pop() : ''
  const isAsset = ['js', 'css', 'svg', 'png', 'ico', 'woff', 'woff2', 'json'].includes(ext ?? '')
  const fullPath = join(distDir, base.replace(/^\//, ''))
  if (isAsset && existsSync(fullPath)) {
    return createReadStream(fullPath)
  }
  return createReadStream(join(distDir, 'index.html'))
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`)
  const pathname = url.pathname
  const stream = serveFile(pathname)
  stream.on('error', () => {
    res.writeHead(404)
    res.end()
  })
  if (pathname.endsWith('.js') || pathname.endsWith('.css')) {
    res.setHeader('Content-Type', pathname.endsWith('.js') ? 'application/javascript' : 'text/css')
  }
  stream.pipe(res)
})

server.listen(port, async () => {
  console.log('[prerender] Server on port', port)
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  for (const route of routes) {
    try {
      const url = `http://localhost:${port}${route}`
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
      await new Promise((r) => setTimeout(r, 500))
      const html = await page.content()
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
})
