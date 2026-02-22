import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const distDir = join(__dirname, 'dist')
const port = parseInt(process.env.PORT || '5000', 10)

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8')

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`)
  const filePath = join(distDir, url.pathname)
  const ext = extname(filePath)

  if (ext && existsSync(filePath)) {
    const mime = mimeTypes[ext] || 'application/octet-stream'
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    res.end(readFileSync(filePath))
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' })
    res.end(indexHtml)
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`ONDA Landing running on http://0.0.0.0:${port}`)
})
