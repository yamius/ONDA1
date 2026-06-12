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
          // Ad pixels (Meta + Reddit) — loaded on /go and the Reddit base
          // PageVisit site-wide.
          'https://connect.facebook.net',
          'https://www.redditstatic.com',
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
          // Pixel beacons fire as GET images.
          'https://www.facebook.com',
          'https://alb.reddit.com',
        ],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'connect-src': [
          "'self'",
          'https://www.googletagmanager.com',
          'https://*.google-analytics.com',
          'https://*.analytics.google.com',
          'https://*.googletagmanager.com',
          'https://www.google.com',
          // Pixel config/event endpoints.
          'https://pixel-config.reddit.com',
          'https://www.facebook.com',
          'https://connect.facebook.net',
          // Emoton: fetch adaptive-practice audio + HDR backdrops from the
          // public Supabase Storage buckets (audio-practices, hdr).
          'https://*.supabase.co',
        ],
        // Emoton: the practice audio plays from a blob: URL (downloaded and
        // cached by useAudioCache); allow blob media + the Supabase host.
        'media-src': ["'self'", 'blob:', 'https://*.supabase.co'],
        'frame-src': [
          'https://www.googletagmanager.com',
          'https://www.youtube.com',
          'https://www.youtube-nocookie.com',
        ],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
      },
    },
  })
)

// Allow /embed/* pages to be framed cross-origin (embeddable widgets).
// Helmet sets X-Frame-Options: SAMEORIGIN by default, which blocks third-party
// embedding; override it (and the CSP) only for the embed routes.
app.use((req, res, next) => {
  if (req.path.startsWith('/embed/')) {
    res.removeHeader('X-Frame-Options')
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data:; frame-ancestors *",
    )
  }
  next()
})

// Log all incoming requests (to see Replit healthcheck path)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Health check — MUST be first: Replit checks this before marking app live
app.get('/health', (req, res) => res.status(200).send('OK'))
app.head('/health', (req, res) => res.status(200).end())

// WWW → non-WWW redirect (301). Fixes duplicate content: www.onda-life.com → onda-life.com
app.use((req, res, next) => {
  if (req.hostname && req.hostname.startsWith('www.')) {
    const nonWww = req.hostname.slice(4)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https'
    return res.redirect(301, `${protocol}://${nonWww}${req.originalUrl}`)
  }
  next()
})

// Replit preview hostnames → canonical onda-life.com (301).
// Surfaced in GSC 2026-04-29: Google was indexing ondalife.replit.app
// alongside onda-life.com and choosing the Replit URL as canonical for
// /glossary/microbiome (and likely other pages). Without redirect all
// SEO juice accrues to the *.replit.app subdomain instead of the brand.
//
// Skipped for healthcheck pings (UA-based) so Replit's own monitoring
// keeps getting 200 on / and never sees a 301.
const REPLIT_HOST_RE = /\.(replit\.(app|dev)|repl\.co)$/i
app.use((req, res, next) => {
  if (req.hostname && REPLIT_HOST_RE.test(req.hostname) && !isHealthcheckRequest(req)) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https'
    return res.redirect(301, `${protocol}://onda-life.com${req.originalUrl}`)
  }
  next()
})

// Root / — fast path: healthcheck UA → instant OK, cached HTML → no disk read
app.get('/', (req, res, next) => {
  const ua = req.get('User-Agent') || '(empty)'
  if (isHealthcheckRequest(req)) {
    console.log(`[root] healthcheck → OK, UA: ${ua.slice(0, 80)}`)
    return res.status(200).setHeader('Content-Type', 'text/html').send(HEALTHCHECK_HTML)
  }
  if (cachedRootHtml) {
    const t0 = Date.now()
    // 103 Early Hints — browser starts fetching hero image before full HTML arrives.
    // Works over HTTP/2; silently ignored on HTTP/1.1. Wrap in try/catch for safety.
    try {
      res.writeEarlyHints({
        link: '</onda-life-hrv-consciousness-hero.webp>; rel=preload; as=image; imagesrcset="/onda-life-hrv-consciousness-hero-480w.webp 480w, /onda-life-hrv-consciousness-hero-768w.webp 768w, /onda-life-hrv-consciousness-hero.webp 1024w"; imagesizes="100vw"',
      })
    } catch (_) {}
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

// sitemap.xml — served from the build artifact (scripts/sitemap.ts), which
// emits hreflang <xhtml:link> alternates + <image:image> blocks and derives
// <lastmod> from real article dates. An explicit route (rather than letting
// express.static serve it) keeps a short, crawl-friendly Cache-Control —
// express.static would otherwise stamp it 1-year immutable.
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = join(distDir, 'sitemap.xml')
  if (!existsSync(sitemapPath)) {
    return res
      .status(404)
      .type('application/xml')
      .send('<?xml version="1.0"?><error>Sitemap not built yet</error>')
  }
  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.sendFile(resolve(sitemapPath))
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
    setHeaders: (res, filePath) => {
      // Vite assets under /assets/ are content-hashed — new content always
      // means a new filename, so immutable-1y is correct and ideal.
      // Everything else (images/reviews/*.png cards, images/articles/*,
      // og-preview, fonts, etc.) keeps a STABLE filename, so immutable-1y
      // would pin a stale copy in browsers/CDN forever when the content
      // changes at the same URL (this is what made redesigned review cards
      // keep showing the old banded gradient after redeploy). Give those a
      // revalidating cache: 1h fresh, then a cheap ETag/Last-Modified 304
      // re-check, so content updates propagate within the hour.
      if (!/[\\/]assets[\\/]/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate')
      }
    },
  }),
)

// Stale asset fallback: old hash after rebuild → redirect to root so browser/crawler gets fresh HTML
app.use('/assets', (req, res) => {
  res.redirect(302, '/')
})

// Branded short links for investor/partner pitch decks.
// Pattern: onda-life.com/p/<campaign> → 302 to the real PDF under /decks/.
// Adding a new campaign = add one line below; no template/HTML changes.
// 302 (not 301) so we can repoint a slug at a new PDF version without
// browsers caching the old target indefinitely.
const DECK_SHORT_LINKS = {
  mundi: '/decks/onda-pitch-mundi-x9k4.pdf',
  info: '/decks/onda-eurostar-framework-r3p8.pdf',
  radboud: '/decks/onda-radboud-donders-m4t7.pdf',
  tno: '/decks/onda-tno-eurostars-h2v6.pdf',
}
app.get('/p/:slug', (req, res, next) => {
  const target = DECK_SHORT_LINKS[req.params.slug]
  if (!target) return next()
  res.set('X-Robots-Tag', 'noindex, nofollow')
  return res.redirect(302, target)
})

// ---------------------------------------------------------------------------
// App-download landing page: onda-life.com/get  (aliases /app, /download)
//
// Purpose: share-safe App Store link for platforms (Reddit, some Discords)
// that ban raw apps.apple.com URLs but allow onda-life.com. This is a REAL
// branded content page — not a bare redirect — so:
//   - Reddit/Discord/Slack link-preview crawlers read static OG tags and
//     render an ONDA card (they do not execute JS, never see the store URL).
//   - A bare 302 to the store would risk the redirector domain getting
//     flagged too, and looks like cloaking. A content page does not.
//   - Real users get a one-tap "Download on the App Store" button with
//     App Store Connect campaign tracking (?c=<source> → ASC Sources).
//
// Mirrors src/config/appStore.ts (kept in sync by hand — both are tiny).
// ---------------------------------------------------------------------------
const APP_STORE_ID = '6755912529'
const APP_STORE_PROVIDER = '128331898'
function appStoreUrlFor(campaign) {
  const ct = String(campaign || 'site_get').replace(/[^a-z0-9_]/gi, '').slice(0, 40) || 'site_get'
  return `https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=${APP_STORE_PROVIDER}&ct=${encodeURIComponent(ct)}&mt=8`
}
function buildGetPageHtml(campaign) {
  const storeUrl = appStoreUrlFor(campaign)
  const title = 'Get ONDA Life — Biohacking OS for iPhone'
  const desc = 'Your body is a biological computer. ONDA Life is the iOS app that upgrades it — HRV biofeedback, 8 levels of structured consciousness development, and neural protocols. Free on the App Store.'
  const ogImg = `${SITE_URL}/og-preview.png`
  const canonical = `${SITE_URL}/get`
  // Apple logo glyph (inline SVG, CSP-safe — not an external image).
  const appleLogo = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M17.05 12.04c-.03-2.74 2.24-4.05 2.34-4.12-1.28-1.87-3.27-2.12-3.97-2.15-1.69-.17-3.3 1-4.15 1-.86 0-2.18-.98-3.59-.95-1.84.03-3.55 1.07-4.5 2.72-1.92 3.33-.49 8.26 1.38 10.96.91 1.32 2 2.8 3.42 2.75 1.37-.06 1.89-.89 3.55-.89 1.65 0 2.12.89 3.57.86 1.47-.03 2.41-1.34 3.31-2.67 1.04-1.53 1.47-3.01 1.49-3.09-.03-.01-2.86-1.1-2.89-4.37zM14.38 4.13c.76-.92 1.27-2.2 1.13-3.47-1.09.04-2.41.73-3.19 1.65-.7.81-1.31 2.11-1.15 3.36 1.21.09 2.45-.62 3.21-1.54z"/></svg>'
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#0a1018">
<link rel="icon" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ONDA Life">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${ogImg}">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    background:#0a1018;color:#e8eef5;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    display:flex;align-items:center;justify-content:center;
    min-height:100vh;padding:24px;line-height:1.5;
    background-image:radial-gradient(ellipse at 50% 0%,rgba(0,212,255,.08),transparent 60%),radial-gradient(ellipse at 50% 100%,rgba(74,222,128,.06),transparent 60%);
  }
  .card{max-width:440px;width:100%;text-align:center}
  .wordmark{font-weight:800;letter-spacing:.18em;font-size:15px;margin-bottom:28px}
  .wordmark .o{color:#4ade80}
  .wordmark .l{color:#00d4ff}
  .wordmark .dot{color:#e8eef5;opacity:.4;margin:0 .35em}
  h1{font-size:30px;font-weight:800;line-height:1.15;margin-bottom:14px;letter-spacing:-.01em}
  h1 .accent{background:linear-gradient(135deg,#4ade80,#00d4ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
  p.sub{color:#9fb0c3;font-size:16px;margin-bottom:8px}
  p.feat{color:#6b7d92;font-size:13px;margin-bottom:32px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  a.store{
    display:inline-flex;align-items:center;gap:12px;
    background:#fff;color:#000;text-decoration:none;
    padding:14px 26px;border-radius:14px;font-weight:600;
    transition:transform .15s ease,box-shadow .15s ease;
    box-shadow:0 8px 30px rgba(0,212,255,.15);
  }
  a.store:hover{transform:translateY(-2px);box-shadow:0 12px 38px rgba(0,212,255,.28)}
  a.store .txt{text-align:left;line-height:1.1}
  a.store .txt small{display:block;font-size:11px;font-weight:500;opacity:.7}
  a.store .txt span{display:block;font-size:18px;font-weight:700;letter-spacing:-.01em}
  .note{color:#6b7d92;font-size:12px;margin-top:18px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  .home{display:inline-block;margin-top:34px;color:#6b7d92;font-size:13px;text-decoration:none;border-bottom:1px solid rgba(159,176,195,.2)}
  .home:hover{color:#9fb0c3}
</style>
</head>
<body>
<main class="card">
  <div class="wordmark"><span class="o">ONDA</span><span class="dot">·</span><span class="l">LIFE</span></div>
  <h1>Your nervous system,<br><span class="accent">quantified.</span></h1>
  <p class="sub">The biohacking OS for your body — HRV biofeedback, 8 levels of consciousness development, neural protocols.</p>
  <p class="feat">[ iPhone · iOS 16+ · free download ]</p>
  <a class="store" href="${storeUrl}" rel="noopener">
    ${appleLogo}
    <span class="txt"><small>Download on the</small><span>App Store</span></span>
  </a>
  <p class="note">Scan or tap on your iPhone to install.</p>
  <a class="home" href="${SITE_URL}/">← onda-life.com</a>
</main>
</body>
</html>`
}
app.get(['/get', '/app', '/download'], (req, res) => {
  const html = buildGetPageHtml(req.query.c)
  res.set('Content-Type', 'text/html; charset=utf-8')
  // Short cache so we can repoint / re-copy the App Store URL quickly.
  res.set('Cache-Control', 'public, max-age=300, s-maxage=900')
  return res.status(200).send(html)
})

// Redirect legacy part slug (i-resonate → i-am-vibration)
app.get('/part/i-resonate', (req, res) => res.redirect(301, '/part/i-am-vibration'))

// Redirect dead article URL (Google indexed an unmerged preview of the same content
// that ships at /articles/cognitive-architecture-neural-throughput).
app.get('/articles/system-analysis-cognitive-architecture',
  (req, res) => res.redirect(301, '/articles/cognitive-architecture-neural-throughput'))

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
