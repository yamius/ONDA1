/**
 * Production server for SSG landing.
 * Serves prerendered HTML from dist/ for each route — crawlers see full content.
 */
import express from 'express'
import { join, resolve } from 'path'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'

import matter from 'gray-matter'
import { extractProtocolsFromContent } from './protocol-name-mapping.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = join(__dirname, 'dist')
const articlesDir = join(__dirname, '..', 'articles')
const port = parseInt(process.env.PORT || '5000', 10)
const SITE_URL = 'https://onda-life.com'

// Ensure dist/ directory exists so express.static doesn't throw
if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true })

const app = express()
app.use(express.json({ limit: '1mb' }))

// Health check: Replit expects fast response (<5s) before marking app live
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

// Canonical URLs: no trailing slash. Redirect /articles/ -> /articles (301)
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  const path = req.path
  if (path.length > 1 && path.endsWith('/')) {
    const canonical = path.slice(0, -1) || '/'
    return res.redirect(301, canonical + (req.url.slice(req.path.length) || ''))
  }
  next()
})

// Debug: where articles are stored (for Replit Files visibility)
app.get('/api/articles-path', (req, res) => {
  res.json({ path: resolve(articlesDir), exists: existsSync(articlesDir) })
})

// API: save article from Telegram bot (writes to same articlesDir as md-articles)
// Auto-adds YAML frontmatter with protocolIds when PROTOCOL_XX blocks are detected
app.post('/api/save-article', (req, res) => {
  const content = req.body?.content
  if (typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Missing content' })
  }
  try {
    let body = content.trim()
    let parsed = matter(body)
    const firstLine = body.split('\n')[0]?.replace(/[\[\]#*]/g, '').trim() || ''
    const slug = titleToSlug(firstLine) || `article-${Date.now().toString(36)}`
    const protocolIds = extractProtocolsFromContent(parsed.content || body, slug)
    let finalContent = body
    if (protocolIds.length > 0) {
      const frontmatter = matter.stringify(parsed.content || body, {
        ...parsed.data,
        protocolIds,
      })
      finalContent = frontmatter
    }
    const filename =
      req.body?.filename && /^article_[a-zA-Z0-9_]+\.md$/.test(req.body.filename)
        ? req.body.filename
        : `article_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}.md`
    const filepath = join(articlesDir, filename)
    mkdirSync(articlesDir, { recursive: true })
    writeFileSync(filepath, finalContent, 'utf-8')
    res.json({ ok: true, filename, protocolIds: protocolIds.length > 0 ? protocolIds : undefined })
  } catch (err) {
    console.error('[save-article]', err)
    res.status(500).json({ error: String(err.message) })
  }
})

// Dynamic sitemap: static routes from dist/ + Telegram articles from articles/
app.get('/sitemap.xml', (req, res) => {
  try {
    const routes = []

    // 1. Scan dist/ for prerendered index.html
    if (existsSync(distDir)) {
      try {
        const entries = readdirSync(distDir, { recursive: true })
        for (const rel of entries) {
          if (typeof rel === 'string' && rel.endsWith('index.html')) {
            const path = rel === 'index.html' ? '/' : '/' + rel.replace(/\/index\.html$/, '').replace(/\\/g, '/')
            routes.push({ path, filePath: join(distDir, rel) })
          }
        }
      } catch (_) { /* ignore */ }
    }

    // 2. Add md (Telegram) articles — same path as static articles
    const mdArticles = loadMdArticles()
    for (const a of mdArticles) {
      routes.push({
        path: `/articles/${a.slug}`,
        filePath: join(articlesDir, a.filename),
      })
    }

    const buildDate = new Date().toISOString().split('T')[0]
    function buildLoc(path) {
      const base = SITE_URL.replace(/\/+$/, '')
      const cleanPath = (path || '/').replace(/\/+$/, '') || '/'
      return cleanPath === '/' ? base : `${base}${cleanPath}`
    }
    function getPriority(path) {
      if (path === '/') return '1.0'
      if (path === '/glossary') return '0.9'
      if (path === '/articles') return '0.9'
      if (path.startsWith('/level/')) return '0.8'
      if (path.startsWith('/glossary/')) return '0.7'
      if (path.startsWith('/articles/')) return '0.8'
      return '0.8'
    }
    function getLastmod(filePath) {
      try {
        if (existsSync(filePath)) return statSync(filePath).mtime.toISOString().split('T')[0]
      } catch (_) {}
      return buildDate
    }

    const urls = routes.map(({ path, filePath }) => {
      const loc = buildLoc(path)
      const lastmod = getLastmod(filePath)
      const priority = getPriority(path)
      const changefreq = path === '/' ? 'weekly' : 'monthly'
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=300')
    res.send(sitemap)
  } catch (err) {
    console.error('[sitemap]', err.message, err.stack)
    res.status(500).send('<?xml version="1.0"?><error>Sitemap temporarily unavailable</error>')
  }
})

// API: raw list of all .md files (for debugging duplicates)
app.get('/api/articles-list', (req, res) => {
  try {
    if (!existsSync(articlesDir)) return res.json([])
    const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'))
    const list = files.map((filename) => {
      const content = readFileSync(join(articlesDir, filename), 'utf-8').trim()
      const firstLine = content.split('\n')[0].replace(/[\[\]#*]/g, '').trim()
      return { filename, title: firstLine || filename }
    })
    res.json(list)
  } catch (err) {
    console.error('[api/articles-list]', err.message, err.stack)
    res.status(500).json({ error: String(err.message) })
  }
})

function titleToSlug(title) {
  if (!title || typeof title !== 'string') return ''
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function loadMdArticles() {
  try {
    if (!existsSync(articlesDir)) return []
    const stat = statSync(articlesDir)
    if (!stat.isDirectory()) return []
    const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'))
    const seen = new Map()
    const usedSlugs = new Set()
    const result = []
    for (const filename of files.sort().reverse()) {
      try {
        const raw = readFileSync(join(articlesDir, filename), 'utf-8').trim()
        const parsed = matter(raw)
        const content = parsed.content || raw
        const hash = content.replace(/\s+/g, ' ').slice(0, 500)
        if (seen.has(hash)) continue
        seen.set(hash, true)
        const firstLine = content.split('\n')[0]?.replace(/[\[\]#*]/g, '').trim() || ''
        const title = firstLine || filename
        const baseSlug = titleToSlug(title) || filename.replace('.md', '')
        let slug = baseSlug
        let n = 1
        while (usedSlugs.has(slug)) {
          slug = `${baseSlug}-${++n}`
        }
        usedSlugs.add(slug)
        const protocolIds = parsed.data?.protocolIds
        result.push({ slug, filename, title, content, protocolIds: Array.isArray(protocolIds) ? protocolIds : undefined })
      } catch (fileErr) {
        console.error('[loadMdArticles] Skip file', filename, fileErr.message)
      }
    }
    return result
  } catch (err) {
    console.error('[loadMdArticles]', err.message, err.stack)
    return []
  }
}

// API: list markdown articles (dedup by content hash — keeps newest). slug = human-readable from title.
app.get('/api/md-articles', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.json(loadMdArticles())
})

// API: get single md article by slug (or by legacy filename)
app.get('/api/md-article/:slugOrFilename', (req, res) => {
  const slugOrFilename = req.params.slugOrFilename
  if (!slugOrFilename) return res.status(400).json({ error: 'Missing slug' })
  const list = loadMdArticles()
  const legacySlug = slugOrFilename.replace(/\.md$/, '')
  const found = list.find(
    (a) => a.slug === slugOrFilename || a.slug === legacySlug || a.filename.replace('.md', '') === legacySlug
  )
  if (!found) return res.status(404).json({ error: 'Not found' })
  res.json(found)
})

// API: update article (push local edits to deployment)
app.put('/api/article/:filename', (req, res) => {
  const filename = req.params.filename
  if (!filename.endsWith('.md') || filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' })
  }
  const content = req.body?.content
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'Missing content' })
  }
  const filepath = join(articlesDir, filename)
  try {
    mkdirSync(articlesDir, { recursive: true })
    writeFileSync(filepath, content.trim(), 'utf-8')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: String(err.message) })
  }
})

// API: delete article by filename (to remove duplicates)
app.delete('/api/article/:filename', (req, res) => {
  const filename = req.params.filename
  if (!filename.endsWith('.md') || filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' })
  }
  const filepath = join(articlesDir, filename)
  if (!existsSync(filepath)) return res.status(404).json({ error: 'Not found' })
  try {
    unlinkSync(filepath)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: String(err.message) })
  }
})

// 1. Static assets (js, css, images) — HTML served via route below
app.use(
  express.static(distDir, {
    maxAge: '1y',
    immutable: true,
    index: false, // disable default index.html so we control SSG routing
    redirect: false, // no trailing-slash redirect: /articles stays /articles (canonical)
  }),
)

// Redirect legacy part slug (i-resonate → i-am-vibration)
app.get('/part/i-resonate', (req, res) => res.redirect(301, '/part/i-am-vibration'))

// Redirect legacy /articles/telegram/:slug to /articles/:slug
app.get('/articles/telegram/:slug', (req, res, next) => {
  try {
    const list = loadMdArticles()
    const legacySlug = req.params.slug.replace(/\.md$/, '')
    const found = list.find(
      (a) => a.slug === req.params.slug || a.filename.replace('.md', '') === legacySlug
    )
    if (found) {
      return res.redirect(301, `/articles/${found.slug}`)
    }
    next()
  } catch (err) {
    console.error('[articles/telegram]', err.message, err.stack)
    next(err)
  }
})

const FALLBACK_HTML = '<!doctype html><html><head><meta charset="UTF-8"><title>ONDA Life</title><meta http-equiv="refresh" content="10"></head><body style="background:#050a0f;color:#fff;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><p>Loading... please wait.</p></body></html>'
const BUILDING_HTML = '<!doctype html><html><head><meta charset="UTF-8"><title>ONDA Life</title><meta http-equiv="refresh" content="10"></head><body style="background:#050a0f;color:#fff;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><p>Building... please wait.</p></body></html>'

// 2. SSG routing — serve prerendered index.html for each path (GET only)
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()

  try {
    const cleanPath = (req.path.replace(/\/$/, '') || '/').replace(/^\//, '')
    const filePath = cleanPath
      ? join(distDir, cleanPath, 'index.html')
      : join(distDir, 'index.html')
    const indexHtml = join(distDir, 'index.html')

    if (existsSync(filePath)) {
      res.setHeader('Cache-Control', 'no-cache')
      const absPath = resolve(filePath)
      res.sendFile(absPath, (err) => {
        if (err) {
          console.error('[server] sendFile error:', err.message, 'path:', filePath, err.stack)
          if (!res.headersSent) res.status(200).send(FALLBACK_HTML)
        }
      })
      return
    }

    if (existsSync(indexHtml)) {
      res.setHeader('Cache-Control', 'no-cache')
      const isInvalidGlossarySlug = /^glossary\/[^/]+$/.test(cleanPath)
      const status = isInvalidGlossarySlug ? 404 : 200
      res.status(status)
      const absIndex = resolve(indexHtml)
      res.sendFile(absIndex, (err) => {
        if (err) {
          console.error('[server] sendFile error:', err.message, 'path:', indexHtml, err.stack)
          if (!res.headersSent) res.status(200).send(FALLBACK_HTML)
        }
      })
      return
    }

    res.status(200).send(BUILDING_HTML)
  } catch (err) {
    console.error('[server] SSG router error:', err.message, err.stack)
    if (!res.headersSent) res.status(200).send(FALLBACK_HTML)
    next(err)
  }
})

// Global error handler — log full error, avoid "headers already sent"
app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err.message || err)
  console.error('[server] Stack:', err.stack)
  if (!res.headersSent) {
    res.status(200).send(FALLBACK_HTML)
  }
})

// Start server FIRST (healthcheck!), then build dist if missing (Replit Autoscale)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)

  if (!existsSync(join(distDir, 'index.html'))) {
    console.log('dist/ not found — running build in background...')
    import('child_process').then(({ exec }) => {
      exec('npm run build', { cwd: __dirname }, (err, stdout, stderr) => {
        if (err) console.error('Build failed:', err.message, stderr)
        else console.log('Background build complete — dist/ ready')
      })
    })
  }

  import('./bot.js').then(({ startBot }) => startBot())
})
