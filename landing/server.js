/**
 * Production server for SSG landing.
 * Serves prerendered HTML from dist/ for each route — crawlers see full content.
 */
import express from 'express'
import { join } from 'path'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = join(__dirname, 'dist')
const articlesDir = join(__dirname, '..', 'articles')
const port = parseInt(process.env.PORT || '5000', 10)

const app = express()

// API: list markdown articles saved by Telegram bot
app.get('/api/md-articles', (req, res) => {
  if (!existsSync(articlesDir)) return res.json([])
  const files = readdirSync(articlesDir).filter(f => f.endsWith('.md'))
  const result = files.map(filename => {
    const content = readFileSync(join(articlesDir, filename), 'utf-8').trim()
    const firstLine = content.split('\n')[0].replace(/[\[\]#*]/g, '').trim()
    const slug = filename.replace('.md', '')
    return { slug, filename, title: firstLine || filename, content }
  }).reverse()
  res.json(result)
})

// 1. Static assets (js, css, images) — HTML served via route below
app.use(
  express.static(distDir, {
    maxAge: '1y',
    immutable: true,
    index: false, // disable default index.html so we control SSG routing
  }),
)

// 2. SSG routing — serve prerendered index.html for each path (GET only)
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  const cleanPath = (req.path.replace(/\/$/, '') || '/').replace(/^\//, '')
  const filePath = cleanPath
    ? join(distDir, cleanPath, 'index.html')
    : join(distDir, 'index.html')

  if (existsSync(filePath)) {
    res.setHeader('Cache-Control', 'no-cache')
    res.sendFile(filePath)
  } else {
    const indexHtml = join(distDir, 'index.html')
    if (existsSync(indexHtml)) {
      res.setHeader('Cache-Control', 'no-cache')
      // Telegram articles are dynamic — serve SPA with 200 so React can handle routing
      const isTelegramArticle = /^articles\/telegram\/[^/]+$/.test(cleanPath)
      // Invalid glossary or static article slug: no prerendered file → return 404
      const isInvalidGlossarySlug = /^glossary\/[^/]+$/.test(cleanPath)
      const isInvalidArticleSlug = /^articles\/[^/]+$/.test(cleanPath) && !isTelegramArticle
      if (isInvalidGlossarySlug || isInvalidArticleSlug) {
        res.status(404).sendFile(indexHtml)
      } else {
        res.sendFile(indexHtml)
      }
    } else {
      res.status(404).send('Not found. Run: npm run build')
    }
  }
})

// Start server; build dist if missing (Replit Autoscale)
function start() {
  if (!existsSync(join(distDir, 'index.html'))) {
    console.log('dist/ not found — running build...')
    try {
      execSync('npm run build', { cwd: __dirname, stdio: 'inherit' })
    } catch (err) {
      console.error('Build failed:', err.message)
      process.exit(1)
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`)
  })
}

start()
