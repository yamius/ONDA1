/**
 * Convert PNG/JPG to WebP for smaller file sizes.
 * Run: node scripts/optimize-images.mjs
 * Creates .webp alongside originals. OptimizedImage component uses them.
 * Auto-reduces quality if output > 100KB.
 */
import sharp from 'sharp'
import { readdir, stat, writeFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const SKIP = new Set(['favicon.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'onda-logo-source.png'])
const MAX_KB = 99

async function findImages(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      await findImages(full, files)
    } else if (/\.(png|jpg|jpeg)$/i.test(e.name) && !SKIP.has(e.name)) {
      files.push(full)
    }
  }
  return files
}

async function convertToWebP(src) {
  const origSize = (await stat(src)).size
  const qualities = [82, 72, 60, 48, 38]

  for (const q of qualities) {
    const buf = await sharp(src).webp({ quality: q, effort: 6 }).toBuffer()
    if (buf.length <= MAX_KB * 1024) {
      return { buf, origSize, quality: q }
    }
  }

  // Fallback: resize to 85% and compress
  const buf = await sharp(src)
    .resize({ width: Math.round((await sharp(src).metadata()).width * 0.85) })
    .webp({ quality: 42, effort: 6 })
    .toBuffer()
  return { buf, origSize, quality: 'resize85' }
}

async function main() {
  const images = await findImages(publicDir)
  let converted = 0
  let skipped = 0
  for (const src of images) {
    const webpPath = src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    try {
      await stat(webpPath)
      skipped++
      continue
    } catch {}
    const { buf, origSize, quality } = await convertToWebP(src)
    await writeFile(webpPath, buf)
    const newSize = buf.length
    const pct = (((origSize - newSize) / origSize) * 100).toFixed(0)
    const qNote = typeof quality === 'string' ? ` (${quality})` : quality < 82 ? ` (q${quality})` : ''
    console.log(`${src.replace(publicDir, '')}: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (-${pct}%)${qNote}`)
    converted++
  }
  console.log(`\nDone. ${converted} converted, ${skipped} skipped (webp exists).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
