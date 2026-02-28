#!/usr/bin/env node
/**
 * Sync articles from live API to local articles/ folder.
 * Run in Replit Shell: node scripts/sync_articles.js
 * Then edit files in articles/ and commit.
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.API_BASE || 'https://onda-life.com'
const articlesDir = join(__dirname, '..', 'articles')

async function sync() {
  const url = `${BASE}/api/md-articles`
  console.log('Fetching', url)
  const res = await fetch(url)
  if (!res.ok) {
    console.error('Failed:', res.status, res.statusText)
    process.exit(1)
  }
  const list = await res.json()
  mkdirSync(articlesDir, { recursive: true })
  for (const a of list) {
    const path = join(articlesDir, a.filename)
    writeFileSync(path, a.content, 'utf-8')
    console.log('Saved', a.filename)
  }
  console.log('Done. Edit files in articles/ then commit.')
}

sync().catch((e) => {
  console.error(e)
  process.exit(1)
})
