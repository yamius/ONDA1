#!/usr/bin/env node
/**
 * Per-article OG card generator.
 *
 * For every article that has no `image` field, renders a 1200×630 PNG card
 * to dist/og-images/<slug>.png composed of:
 *   - Dark gradient background (matches ONDA visual canon)
 *   - Cyan accent corner mark
 *   - Article title (centered, wrapped, max 4 lines)
 *   - "[ ONDA LIFE ]" wordmark bottom-left
 *   - Category tag bottom-right
 *
 * Articles that DO have a hero image keep using it (ArticlePage already
 * emits absolute og:image for those). The generator only fills the gap
 * for image-less articles so every share card is brand-consistent.
 *
 * Idempotent: skips files that already exist with mtime > corresponding
 * article TS file mtime.
 */
import { readFileSync, writeFileSync, statSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist')
const ogDir = join(distDir, 'og-images')
const articlesDir = join(projectRoot, 'src', 'data', 'articles')

if (!existsSync(distDir)) {
  console.warn('[og-image-generator] dist/ not found — skipping')
  process.exit(0)
}

mkdirSync(ogDir, { recursive: true })

/** Light TS-source parsing — we don't import the modules to avoid TS/ESM
 *  loader hassle in a build script. We just read the file and extract
 *  slug, title, category, and presence of `image:` to decide whether to
 *  generate a card. This mirrors the strategy in schedule-articles.mjs. */
function readArticleMeta(file) {
  const src = readFileSync(file, 'utf-8')
  const slug = src.match(/slug:\s*['"]([^'"]+)['"]/)?.[1]
  const title = src.match(/title:\s*(?:`|['"])([^`'"]+)/)?.[1]
  const category = src.match(/category:\s*['"]([^'"]+)['"]/)?.[1]
  const hasImage = /\n\s*image:\s*['"`]/.test(src)
  return slug && title && category ? { slug, title, category, hasImage } : null
}

const files = readdirSync(articlesDir)
  .filter((n) => n.endsWith('.ts') && !n.startsWith('index') && !n.startsWith('types') && !n.startsWith('articles-meta'))
  .map((n) => join(articlesDir, n))

const articles = files.map((f) => {
  const meta = readArticleMeta(f)
  return meta ? { ...meta, file: f, mtime: statSync(f).mtimeMs } : null
}).filter(Boolean)

console.log(`[og-image-generator] ${articles.length} article(s) parsed`)

/** XML-escape title text for safe SVG embedding. */
function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

/** Word-wrap a title into ≤4 lines that fit within ~1000px at 64px font. */
function wrapTitle(title, maxCharsPerLine = 32, maxLines = 4) {
  const words = title.split(/\s+/)
  const lines = []
  let current = ''
  for (const w of words) {
    const next = current ? `${current} ${w}` : w
    if (next.length > maxCharsPerLine && current) {
      lines.push(current)
      current = w
      if (lines.length === maxLines - 1) {
        // Last allowed line — pack the rest with ellipsis if needed.
        const rest = words.slice(words.indexOf(w)).join(' ')
        lines.push(rest.length > maxCharsPerLine ? `${rest.slice(0, maxCharsPerLine - 1)}…` : rest)
        return lines
      }
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Build the SVG that sharp will rasterize. 1200x630 = canonical OG ratio. */
function buildSvg({ title, category }) {
  const lines = wrapTitle(title)
  const lineHeight = 84
  const totalHeight = lines.length * lineHeight
  const startY = (630 - totalHeight) / 2 + lineHeight * 0.7
  const titleSvg = lines.map((line, i) => {
    const safe = xmlEscape(line)
    return `<text x="600" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="700" fill="#e6f6ff">${safe}</text>`
  }).join('\n  ')
  const safeCategory = xmlEscape(`[ ${category.toUpperCase()} ]`)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#020617"/>
      <stop offset="0.5" stop-color="#0a1426"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="cyan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#22d3ee" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#1e3a5f" stroke-width="2"/>
  <line x1="40" y1="120" x2="1160" y2="120" stroke="url(#cyan)" stroke-width="1"/>
  <line x1="40" y1="510" x2="1160" y2="510" stroke="url(#cyan)" stroke-width="1"/>
  <text x="80" y="100" font-family="JetBrains Mono, monospace" font-size="20" fill="#22d3ee" letter-spacing="3">[ ONDA_LIFE / BIOCOMPUTER_OS ]</text>
  ${titleSvg}
  <text x="80" y="560" font-family="JetBrains Mono, monospace" font-size="22" font-weight="700" fill="#e6f6ff" letter-spacing="2">ONDA LIFE</text>
  <text x="1120" y="560" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="18" fill="#22d3ee" letter-spacing="2">${safeCategory}</text>
</svg>`
}

let generated = 0
let skipped = 0
const manifest = []

for (const article of articles) {
  if (article.hasImage) {
    skipped++
    continue
  }
  const out = join(ogDir, `${article.slug}.png`)
  const fresh = existsSync(out) && statSync(out).mtimeMs >= article.mtime
  if (fresh) {
    manifest.push({ slug: article.slug, path: `/og-images/${article.slug}.png`, generated: false })
    skipped++
    continue
  }

  const svg = buildSvg({ title: article.title, category: article.category })
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out)
  manifest.push({ slug: article.slug, path: `/og-images/${article.slug}.png`, generated: true })
  generated++
}

writeFileSync(join(ogDir, 'manifest.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  totalArticles: articles.length,
  withHeroImage: articles.length - manifest.length,
  generatedNow: generated,
  cached: skipped - (articles.length - manifest.length),
  cards: manifest,
}, null, 2))

console.log(`[og-image-generator] generated ${generated}, cached ${skipped - (articles.length - manifest.length)}, hero-image ${articles.length - manifest.length}`)
