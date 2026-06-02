/**
 * Branded review/round-up card image generator (roadmap 6.5, Variant C).
 *
 * Review and round-up pages shipped with ZERO images — no <img>, no
 * Product.image in schema, no per-page og:image. Real product photos are a
 * licensing project (affiliate feeds / press kits — see roadmap 6.5 notes);
 * this is the zero-risk, zero-dependency interim: a programmatic branded
 * "score card" per review and per round-up, rendered SVG → PNG via sharp
 * (already a dependency — no AI, no new package, 100% our own asset).
 *
 * Each card gives the page:
 *   - a real Product.image (schema rich-result eligibility)
 *   - a unique og:image / twitter:image (proper social + Reddit cards)
 *   - a visible hero <img> (kills the "page has no images" signal)
 *
 * Output: dist/images/reviews/<slug>.png (1200×630, OG ratio).
 * Generated at BUILD time into dist so it always matches what's currently
 * live (date-gated reviews get a card automatically the build after they go
 * live) — no committed binaries, no manual re-runs. A review that later gets
 * a real photo just sets `image:` in its data file, which overrides the card
 * everywhere (meta-inject + page both fall back to the card only when
 * `image` is absent).
 *
 * Font: sharp's SVG renderer falls back to a monospace face here, which suits
 * ONDA's terminal aesthetic. We use generic families only (no embedded font),
 * verified to render on both local Windows and the Replit Linux container.
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { reviews, comparisons, CATEGORY_LABELS } from '../src/data/reviews'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'dist', 'images', 'reviews')

const W = 1200
const H = 630
const BG = '#0a1018'
const GREEN = '#4ade80'
const CYAN = '#00d4ff'
const INK = '#e8eef5'
const MUTE = '#6b7d92'

/** XML-escape text for safe inclusion in SVG. */
function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Pick a product-name font size that keeps long names on one or two lines.
 *  Crude width estimate at ~0.6em per char for the mono fallback. */
function nameFontSize(name: string): number {
  const len = name.length
  if (len <= 14) return 84
  if (len <= 22) return 64
  if (len <= 32) return 50
  if (len <= 44) return 40
  return 34
}

/** Greedy word-wrap into at most `maxLines` lines for a given font size,
 *  constrained to `maxWidth` px (so review names clear the score badge). */
function wrap(name: string, fontSize: number, maxLines = 2, maxWidth = W - 160): string[] {
  const maxCharsPerLine = Math.floor(maxWidth / (fontSize * 0.6))
  const words = name.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length > maxCharsPerLine && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = next
    }
  }
  if (cur) lines.push(cur)
  if (lines.length > maxLines) {
    // Collapse overflow into the last allowed line with an ellipsis.
    const kept = lines.slice(0, maxLines - 1)
    kept.push(lines.slice(maxLines - 1).join(' '))
    return kept
  }
  return lines
}

// Flat background — no large radial gradient. Subtle dark gradients over a
// wide area band on 6-bit / FRC desktop panels no matter how we dither
// (enough dither to mask 6-bit steps shows as visible grain on good 8-bit
// phone/OLED panels — an unwinnable trade). A flat fill is banding-proof on
// every display. Visual interest comes from the bordered score badge and a
// thin top accent rule, not a gradient wash. (Banding fix, 6.5.)
const sharedDefs = `
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="0" width="${W}" height="4" fill="${GREEN}" fill-opacity="0.5"/>
  <rect x="0" y="0" width="${W * 0.5}" height="4" fill="${CYAN}" fill-opacity="0.6"/>
  <text x="80" y="90" font-family="monospace" font-size="26" font-weight="700" letter-spacing="6">
    <tspan fill="${GREEN}">ONDA</tspan><tspan fill="${MUTE}"> · </tspan><tspan fill="${CYAN}">LIFE</tspan>
  </text>`

const footer = `
  <text x="80" y="${H - 56}" font-family="monospace" font-size="22" fill="${MUTE}">onda-life.com/reviews</text>
  <line x1="80" y1="${H - 100}" x2="${W - 80}" y2="${H - 100}" stroke="${MUTE}" stroke-opacity="0.15" stroke-width="1"/>`

function reviewSvg(name: string, brand: string, category: string, score: number): string {
  const fs = nameFontSize(name)
  // Cap the name column at x≈760 so it never runs under the score badge
  // (badge left edge is x = W-360 = 840).
  const lines = wrap(name, fs, 2, 680)
  const startY = 300 - (lines.length - 1) * (fs * 0.55)
  const lastBaseline = startY + (lines.length - 1) * fs * 1.1
  const nameTspans = lines
    .map((ln, i) => `<tspan x="80" dy="${i === 0 ? 0 : fs * 1.1}">${esc(ln)}</tspan>`)
    .join('')
  const catLabel = (CATEGORY_LABELS[category] ?? category).toUpperCase()
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${sharedDefs}
  <text x="80" y="180" font-family="monospace" font-size="24" font-weight="600" letter-spacing="3" fill="${CYAN}">${esc(catLabel)} · REVIEW</text>
  <text y="${startY}" font-family="sans-serif" font-size="${fs}" font-weight="800" fill="${INK}">${nameTspans}</text>
  <text x="80" y="${lastBaseline + fs * 0.55 + 14}" font-family="monospace" font-size="28" fill="${MUTE}">${esc(brand)}</text>
  <g>
    <rect x="${W - 360}" y="200" width="280" height="180" rx="20" fill="${GREEN}" fill-opacity="0.10" stroke="${GREEN}" stroke-opacity="0.4" stroke-width="2"/>
    <text x="${W - 220}" y="312" font-family="sans-serif" font-size="92" font-weight="800" fill="${GREEN}" text-anchor="middle">${score.toFixed(1)}</text>
    <text x="${W - 220}" y="352" font-family="monospace" font-size="24" fill="${MUTE}" text-anchor="middle">/ 10 · ONDA SCORE</text>
  </g>
  ${footer}
</svg>`
}

function comparisonSvg(title: string, category: string, count: number): string {
  const fs = nameFontSize(title)
  const lines = wrap(title, fs) // full width — no badge on round-up cards
  const startY = 300 - (lines.length - 1) * (fs * 0.55)
  const lastBaseline = startY + (lines.length - 1) * fs * 1.1
  const titleTspans = lines
    .map((ln, i) => `<tspan x="80" dy="${i === 0 ? 0 : fs * 1.1}">${esc(ln)}</tspan>`)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${sharedDefs}
  <text x="80" y="180" font-family="monospace" font-size="24" font-weight="600" letter-spacing="3" fill="${CYAN}">RANKED ROUND-UP · ${count} PICKS</text>
  <text y="${startY}" font-family="sans-serif" font-size="${fs}" font-weight="800" fill="${INK}">${titleTspans}</text>
  <text x="80" y="${lastBaseline + fs * 0.55 + 14}" font-family="monospace" font-size="28" fill="${GREEN}">ONDA editorial ranking</text>
  ${footer}
</svg>`
}

async function main() {
  mkdirSync(outDir, { recursive: true })
  let n = 0
  for (const r of reviews) {
    const svg = reviewSvg(r.name, r.brand, r.category, r.overallScore)
    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer()
    writeFileSync(join(outDir, `${r.slug}.png`), png)
    n++
  }
  for (const c of comparisons) {
    const svg = comparisonSvg(c.title, c.category, c.picks.length)
    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer()
    writeFileSync(join(outDir, `${c.slug}.png`), png)
    n++
  }
  console.log(`[review-cards] generated ${n} cards → dist/images/reviews/`)
}

main().catch((e) => {
  console.error('[review-cards] FAILED:', e.message)
  process.exit(1)
})
