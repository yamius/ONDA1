#!/usr/bin/env node
/**
 * Push local articles/ to the live site (after editing).
 * Run in Replit Shell: node scripts/push_articles.js
 */
import { readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.API_BASE || 'https://onda-life.com'
const articlesDir = join(__dirname, '..', 'articles')

async function push() {
  const files = readdirSync(articlesDir).filter((f) => f.endsWith('.md'))
  if (files.length === 0) {
    console.log('No .md files in articles/')
    return
  }
  for (const filename of files) {
    const path = join(articlesDir, filename)
    const content = readFileSync(path, 'utf-8')
    const url = `${BASE}/api/article/${encodeURIComponent(filename)}`
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (res.ok) {
      console.log('Pushed', filename)
    } else {
      console.error('Failed', filename, res.status, await res.text())
    }
  }
  console.log('Done. Refresh the site.')
}

push().catch((e) => {
  console.error(e)
  process.exit(1)
})
