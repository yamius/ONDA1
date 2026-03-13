/**
 * Production server for SSG landing.
 * Serves prerendered HTML from dist/ for each route — crawlers see full content.
 */
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import { join, resolve } from 'path'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'

import matter from 'gray-matter'
import { extractProtocolsFromContent } from './protocol-name-mapping.js'
import { createClient } from '@supabase/supabase-js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = join(__dirname, 'dist')
const articlesDir = join(__dirname, '..', 'articles')
const port = parseInt(process.env.PORT || '5000', 10)
const SITE_URL = 'https://onda-life.com'

// HTML Cache-Control: browser caches 60s, CDN (Cloudflare) caches 1h,
// stale-while-revalidate lets browser/CDN serve stale immediately while refreshing in background.
// Result: repeat visitors get near-zero TTFB; new deploys propagate within ~60s on browsers,
// ~1h on CDN (add Cache-Control purge to Cloudflare on deploy if needed).
const HTML_CACHE = 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
const supa = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null
if (supa) console.log('[server] Supabase client ready')
else console.warn('[server] Supabase env vars missing — /api/votes, /api/comments, /api/waitlist will return 503')

// Ensure dist/ directory exists so express.static doesn't throw
if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true })

// Cache root HTML for instant / response (no disk read per request)
let cachedRootHtml = null
const indexPath = join(distDir, 'index.html')
if (existsSync(indexPath)) {
  try {
    cachedRootHtml = readFileSync(indexPath, 'utf-8')
    console.log('[server] Cached root HTML for fast / response')
  } catch (e) {
    console.error('[server] Failed to cache root:', e.message)
  }
}

function isHealthcheckRequest(req) {
  const ua = (req.get('User-Agent') || '').toLowerCase()
  return req.query.health === '1' || /replit|healthcheck|health-check|uptime|ping|^curl\b|^wget\b|headless|googlecloud/i.test(ua)
}

const HEALTHCHECK_HTML = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>OK</title></head><body>OK</body></html>'

const app = express()

app.use(compression())

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'https://www.googletagmanager.com',
          'https://tagmanager.google.com',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://tagmanager.google.com',
        ],
        'img-src': [
          "'self'",
          'data:',
          'https://www.googletagmanager.com',
          'https://*.google-analytics.com',
          'https://*.googletagmanager.com',
          'https://*.midjourney.com',
          'https://cdn.midjourney.com',
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'connect-src': [
          "'self'",
          'https://www.googletagmanager.com',
          'https://*.google-analytics.com',
          'https://*.analytics.google.com',
          'https://*.googletagmanager.com',
          'https://www.google.com',
        ],
        'frame-src': ['https://www.googletagmanager.com'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
      },
    },
  })
)

// Log all incoming requests (to see Replit healthcheck path)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Health check — MUST be first: Replit checks this before marking app live
app.get('/health', (req, res) => res.status(200).send('OK'))
app.head('/health', (req, res) => res.status(200).end())

// Root / — fast path: healthcheck UA → instant OK, cached HTML → no disk read
app.get('/', (req, res, next) => {
  const ua = req.get('User-Agent') || '(empty)'
  if (isHealthcheckRequest(req)) {
    console.log(`[root] healthcheck → OK, UA: ${ua.slice(0, 80)}`)
    return res.status(200).setHeader('Content-Type', 'text/html').send(HEALTHCHECK_HTML)
  }
  if (cachedRootHtml) {
    const t0 = Date.now()
    res.setHeader('Cache-Control', HTML_CACHE)
    res.send(cachedRootHtml)
    console.log(`[root] cached in ${Date.now() - t0}ms`)
    return
  }
  console.log(`[root] no cache, passing to SSG, UA: ${ua.slice(0, 80)}`)
  next()
})

app.use(express.json({ limit: '1mb' }))

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

// ---- Supabase proxy API routes ----

// GET /api/votes/:slug?fp=<fingerprint>
app.get('/api/votes/:slug', async (req, res) => {
  if (!supa) return res.status(503).json({ error: 'Votes service unavailable' })
  const { slug } = req.params
  const fp = (req.query.fp || '').toString()
  try {
    const { data, error } = await supa
      .from('article_votes')
      .select('vote_type,fingerprint')
      .eq('article_slug', slug)
    if (error) return res.status(500).json({ error: error.message })
    const validate = data.filter((r) => r.vote_type === 'validate').length
    const invalidate = data.filter((r) => r.vote_type === 'invalidate').length
    const myRow = fp ? data.find((r) => r.fingerprint === fp) : null
    res.json({ validate, invalidate, myVote: myRow?.vote_type ?? null })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/votes  { slug, voteType, fingerprint }
app.post('/api/votes', async (req, res) => {
  if (!supa) return res.status(503).json({ error: 'Votes service unavailable' })
  const { slug, voteType, fingerprint } = req.body || {}
  if (!slug || !voteType || !fingerprint) return res.status(400).json({ error: 'Missing fields' })
  if (voteType !== 'validate' && voteType !== 'invalidate') return res.status(400).json({ error: 'Invalid voteType' })
  try {
    const { error } = await supa
      .from('article_votes')
      .upsert({ article_slug: slug, vote_type: voteType, fingerprint }, { onConflict: 'article_slug,fingerprint' })
    if (error) return res.status(500).json({ error: error.message })
    const { data } = await supa.from('article_votes').select('vote_type,fingerprint').eq('article_slug', slug)
    const validate = (data || []).filter((r) => r.vote_type === 'validate').length
    const invalidate = (data || []).filter((r) => r.vote_type === 'invalidate').length
    const myRow = (data || []).find((r) => r.fingerprint === fingerprint)
    res.json({ ok: true, validate, invalidate, myVote: myRow?.vote_type ?? null })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/comments/:slug
app.get('/api/comments/:slug', async (req, res) => {
  if (!supa) return res.status(503).json({ error: 'Comments service unavailable' })
  const { slug } = req.params
  try {
    const { data, error } = await supa
      .from('article_comments')
      .select('id, text, created_at')
      .eq('article_slug', slug)
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    res.json({ comments: data ?? [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/comments  { slug, text, fingerprint }
app.post('/api/comments', async (req, res) => {
  if (!supa) return res.status(503).json({ error: 'Comments service unavailable' })
  const { slug, text, fingerprint } = req.body || {}
  if (!slug || !text || !fingerprint) return res.status(400).json({ error: 'Missing fields' })
  try {
    const { data, error } = await supa
      .from('article_comments')
      .insert({ article_slug: slug, text, fingerprint })
      .select('id, created_at')
      .single()
    if (error) return res.status(500).json({ error: error.message })
    res.json({ ok: true, comment: data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/waitlist  { email, platform }
app.post('/api/waitlist', async (req, res) => {
  if (!supa) return res.status(503).json({ error: 'Waitlist service unavailable' })
  const { email, platform } = req.body || {}
  if (!email) return res.status(400).json({ error: 'Missing email' })
  try {
    const { error } = await supa.from('waitlist').insert({ email, platform: platform || null })
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'duplicate' })
      return res.status(500).json({ error: error.message })
    }
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Service Worker — must never be cached (browser checks for updates on every load)
app.get('/sw.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Content-Type', 'text/javascript')
  res.sendFile(join(distDir, 'sw.js'))
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
      res.setHeader('Cache-Control', HTML_CACHE)
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
      res.status(404)
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

// 404 — unknown routes: return 404 + SPA index.html (client router shows NotFoundPage)
app.use((req, res) => {
  const indexPath = join(distDir, 'index.html')
  if (existsSync(indexPath)) {
    res.status(404).sendFile(resolve(indexPath))
  } else {
    res.status(404).send(BUILDING_HTML)
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
        else {
          try {
            cachedRootHtml = readFileSync(join(distDir, 'index.html'), 'utf-8')
            console.log('Background build complete — root cache refreshed')
          } catch (e) {
            console.log('Background build complete — dist/ ready')
          }
        }
      })
    })
  }

  import('./bot.js').then(({ startBot }) => startBot())
})
