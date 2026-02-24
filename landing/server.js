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
  '.webp': 'image/webp',
}

const loadingHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>ONDA Life</title>
<style>body{background:#050a0f;color:#22d3ee;font-family:'Roboto Mono',monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.c{text-align:center}.s{animation:spin 1s linear infinite;display:inline-block;width:32px;height:32px;border:3px solid #22d3ee33;border-top-color:#22d3ee;border-radius:50%}
p{margin-top:16px;font-size:14px;opacity:.7}
@keyframes spin{to{transform:rotate(360deg)}}</style>
<meta http-equiv="refresh" content="5"></head>
<body><div class="c"><div class="s"></div><p>> initializing system...</p></div></body></html>`

let ready = false
let indexHtml = ''

const server = createServer((req, res) => {
  if (!ready) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(loadingHtml)
    return
  }

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
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`)

  if (existsSync(join(distDir, 'index.html'))) {
    indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8')
    ready = true
    console.log('dist/ found — serving landing')
  } else {
    console.error('dist/ not found — run "npm run build" in the build phase')
    indexHtml = '<!DOCTYPE html><html><body><h1>Build required</h1><p>dist/ not found. Ensure build phase completed.</p></body></html>'
    ready = true
  }
})
