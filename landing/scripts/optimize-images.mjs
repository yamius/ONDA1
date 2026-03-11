/**
 * Convert PNG/JPG to WebP for smaller file sizes.
 * Run: node scripts/optimize-images.mjs
 * Creates .webp alongside originals. OptimizedImage component uses them.
 */
import sharp from 'sharp'
import { readdir, stat, writeFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const SKIP = new Set(['favicon.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'onda-logo-source.png'])

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

async function main() {
  const images = await findImages(publicDir)
  let totalSaved = 0
  for (const src of images) {
    const ext = extname(src).toLowerCase()
    const webpPath = src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
    const origSize = (await stat(src)).size
    const buf = await sharp(src)
      .webp({ quality: 82, effort: 6 })
      .toBuffer()
    await writeFile(webpPath, buf)
    const newSize = buf.length
    const saved = origSize - newSize
    totalSaved += saved
    const pct = ((saved / origSize) * 100).toFixed(0)
    console.log(`${src.replace(publicDir, '')}: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (-${pct}%)`)
  }
  console.log(`\nDone. ${images.length} images. Total saved: ${(totalSaved / 1024).toFixed(0)} KB`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
