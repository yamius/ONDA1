#!/usr/bin/env node
/**
 * Sync local articles/ with the live site:
 * - Push/update local .md files
 * - Delete from site any articles that were removed locally
 * Run in Replit Shell: node scripts/push_articles.js
 */
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.API_BASE || 'https://onda-life.com'
const articlesDir = join(__dirname, '..', 'articles')

async function push() {
  const localFiles = new Set(
    existsSync(articlesDir)
      ? readdirSync(articlesDir).filter((f) => f.endsWith('.md'))
      : []
  )

  // 1. Fetch live articles and delete any that are no longer local
  try {
    const res = await fetch(`${BASE}/api/md-articles`)
    if (res.ok) {
      const live = await res.json()
      for (const a of live) {
        const filename = a.filename || a.name
        if (filename && !localFiles.has(filename)) {
          const delRes = await fetch(`${BASE}/api/article/${encodeURIComponent(filename)}`, {
            method: 'DELETE',
          })
          if (delRes.ok) {
            console.log('Deleted from site:', filename)
          } else {
            console.error('Delete failed', filename, delRes.status)
          }
        }
      }
    }
  } catch (e) {
    console.warn('Could not fetch live articles (delete sync skipped):', e.message)
  }

  // 2. Push local files
  if (localFiles.size === 0) {
    console.log('No .md files in articles/')
    return
  }
  for (const filename of localFiles) {
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
