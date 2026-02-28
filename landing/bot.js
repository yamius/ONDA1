/**
 * Telegram bot — same process as server, writes directly to articlesDir.
 */
import { appendFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.MY_CHAT_ID ? parseInt(process.env.MY_CHAT_ID, 10) : null
const OPENAI_KEY = process.env.OPENAI_API_KEY
const ARTICLES_DIR = join(__dirname, '..', 'articles')
const USED_TOPICS_FILE = join(__dirname, '..', 'scripts', 'used_topics.txt')
const TOPICS_FILE = join(__dirname, '..', 'scripts', 'topics.txt')

const STOPWORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'for', 'in', 'on', 'at', 'to', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'this', 'that', 'it', 'its', 'as', 'by', 'with'])
const TOPIC_BLACKLIST = ['injection', 'inject', 'tesamorelin', 'peptide', 'semaglutide', 'ozempic', 'berberine', 'quercetin', 'fisetin', 'dasatinib', 'senolytic', 'supplement', 'pill', 'capsule', 'mg ', 'dosage', 'dose', 'pharmaceutical', 'drug', 'compound', 'stack', 'stacking', 'melatonin', 'nootropic']
const OUTPUT_BLACKLIST = ['injection', 'inject', 'subcutaneous', 'mg ', 'dosage', 'dose', 'tesamorelin', 'peptide', 'semaglutide', 'ozempic', 'pharmaceutical', 'administer']

const REDDIT_SUBS = (process.env.REDDIT_SUBS || 'biohacking,Nootropics,longevity').split(',')
const DEFAULT_YT_CHANNELS = ['UCEu4Ce6JeTovBQpavZbbLfA', 'UC5fdyC4LxyyYv8Am6nDrkmg', 'UC8kGsMa0LygSX9nkBcBH1Sg']

async function tg(method, body = {}) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.description || 'Telegram API error')
  return data.result
}

function words(text) {
  return new Set(text.toLowerCase().replace(/'/g, ' ').split(/\s+/).filter(w => w.length >= 3 && !STOPWORDS.has(w)))
}

function isTopicBlacklisted(topic) {
  const t = topic.toLowerCase()
  return TOPIC_BLACKLIST.some(b => t.includes(b))
}

function isOutputBlacklisted(text) {
  const t = text.toLowerCase()
  return OUTPUT_BLACKLIST.some(b => t.includes(b))
}

function isSimilar(topic, usedTopics, minOverlap = 2) {
  const tw = words(topic)
  if (tw.size < 2) return false
  for (const u of usedTopics) {
    const uw = words(u)
    let overlap = 0
    for (const w of tw) if (uw.has(w)) overlap++
    if (overlap >= minOverlap) return true
  }
  return false
}

function loadUsedTopics() {
  const used = []
  try {
    const files = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))
    for (const f of files) {
      const first = readFileSync(join(ARTICLES_DIR, f), 'utf-8').split('\n')[0]?.trim()
      if (first && first.length > 10) used.push(first)
    }
  } catch (_) {}
  try {
    const content = readFileSync(USED_TOPICS_FILE, 'utf-8')
    for (const line of content.split('\n')) {
      const t = line.trim()
      if (t && !t.startsWith('#') && !used.includes(t)) used.push(t)
    }
  } catch (_) {}
  return used
}

function saveUsedTopic(topic) {
  try {
    mkdirSync(dirname(USED_TOPICS_FILE), { recursive: true })
    appendFileSync(USED_TOPICS_FILE, topic.trim() + '\n')
  } catch (e) {
    console.error('[used_topics]', e)
  }
}

async function fetchRedditTopics(limit = 15) {
  const topics = []
  try {
    for (const sub of REDDIT_SUBS.slice(0, 3)) {
      const url = `https://www.reddit.com/r/${sub.trim()}/top/.rss?t=day&limit=10`
      const res = await fetch(url, { headers: { 'User-Agent': 'ONDA-bot/1' } })
      const text = await res.text()
      const titles = text.match(/<title>([^<]+)<\/title>/g) || []
      for (const m of titles.slice(1)) {
        const t = m.replace(/<\/?title>/g, '').trim()
        if (t && t.length > 10) topics.push(t)
        if (topics.length >= limit) break
      }
      if (topics.length >= limit) break
    }
  } catch (e) {
    console.error('[reddit]', e)
  }
  return topics.slice(0, limit)
}

async function fetchYoutubeTopics(limit = 20) {
  const ids = (process.env.YOUTUBE_CHANNEL_IDS || '').split(',').map(x => x.trim()).filter(Boolean) || DEFAULT_YT_CHANNELS
  const topics = []
  try {
    for (const cid of ids.slice(0, 5)) {
      const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`
      const res = await fetch(url, { headers: { 'User-Agent': 'ONDA-bot/1' } })
      const text = await res.text()
      const titles = text.match(/<title>([^<]+)<\/title>/g) || []
      for (const m of titles.slice(1)) {
        const t = m.replace(/<\/?title>/g, '').trim()
        if (t && t.length > 15) topics.push(t)
        if (topics.length >= limit) break
      }
      if (topics.length >= limit) break
    }
  } catch (e) {
    console.error('[youtube]', e)
  }
  return topics.slice(0, limit)
}

function loadTopics() {
  return Promise.all([fetchRedditTopics(15), fetchYoutubeTopics(20)]).then(([reddit, youtube]) => {
    const topics = [...new Set([...reddit, ...youtube])]
    if (topics.length > 0) return topics
    try {
      const content = readFileSync(TOPICS_FILE, 'utf-8')
      return content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
    } catch (_) {
      return []
    }
  })
}

async function sendError(msg) {
  if (CHAT_ID) {
    try {
      await tg('sendMessage', { chat_id: CHAT_ID, text: `❌ Generator: ${msg}` })
    } catch (_) {}
  }
  console.error('[generator]', msg)
}

const SYSTEM_PROMPT = `ONDA OS COMPILER v1.0
Role: You are the terminal for the biological operating system ONDA. Your task: decompile incoming "human" text and assemble it into a technical optimization protocol.

Core Philosophy: Biology is software. The body is hardware. The environment is input data. We don't "improve health"—we "fix system errors" and "calibrate metrics".

Stylistic Constraints:
- No Fluff: Remove intros ("in the modern world", "scientists have proven"). Start with substance.
- Directive Tone: Use imperative. Not "you might try" but "REQUIRED:", "INITIATE:", "EXECUTE:".
- The ONDA Dictionary:
  Eyes → Optical Data Ports / Photic Receptors
  Brain → Central Processing Unit (CPU) / Neural Hardware
  Sleep → System Recovery Mode / Melatonin_Upload
  Food → Fuel Input / Metabolic Signaling
  Stress → System Noise / High Cortisol Load

Structure (Markdown):
- Headers in UPPERCASE and brackets: ## [ SECTION_NAME ]
- Protocol lists: PROTOCOL_01 > [TITLE]
- Key variables (hormones, devices) as code: **Cortisol** or [Oura_Data]

Article Architecture:
[ SUMMARY ]: 1-2 sentences — calibration goal.
[ HARDWARE_LOGIC ]: Why it works at physiology level (brief, technical).
[ EXECUTION_PROTOCOLS ]: Step-by-step action algorithm.
[ SYSTEM_VALIDATION ]: How to verify (metrics, devices).
[ STATUS ]: Closing line: System Integrity: Optimal.

SCOPE (ONLY): behavioral models, devices (Oura/Whoop/Muse), time-of-day, light exercise, social co-regulation.
FORBIDDEN: injections, drugs, supplements, pills, dosages in mg.
Create ORIGINAL content. Max 3500 chars. English.`

async function generateAndSend() {
  if (!CHAT_ID || !OPENAI_KEY) return
  try {
    const topics = await loadTopics()
    if (!topics.length) {
      await sendError('No topics (Reddit + topics.txt failed)')
      return
    }
    const used = loadUsedTopics()
    let topic = null
    for (const t of topics) {
      if (isTopicBlacklisted(t)) continue
      if (!isSimilar(t, used)) {
        topic = t
        break
      }
    }
    if (!topic) {
      for (const t of topics) {
        if (!isTopicBlacklisted(t)) {
          topic = t
          break
        }
      }
    }
    if (!topic) {
      await sendError('All topics filtered (drugs/injections/supplements)')
      return
    }
    saveUsedTopic(topic)

    const { default: OpenAI } = await import('openai')
    const client = new OpenAI({ apiKey: OPENAI_KEY })
    const r = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Write an ONDA Life article. Topic (use as inspiration only): ${topic}` },
      ],
      max_tokens: 1500,
    })
    let text = r.choices[0].message.content?.trim() || ''
    if (isOutputBlacklisted(text)) {
      await sendError('Generated content rejected (drugs/injections/supplements detected)')
      return
    }
    if (text.length > 4000) text = text.slice(0, 3997) + '...'

    await tg('sendMessage', { chat_id: CHAT_ID, text: '📝 *Draft* (use as base). Edit elsewhere, then paste back and send — I\'ll add Approve/Reject.', parse_mode: 'Markdown' })
    await tg('sendMessage', { chat_id: CHAT_ID, text })
  } catch (e) {
    await sendError(String(e.message || e))
  }
}

const DEPLOY_URL = (process.env.DEPLOY_URL || process.env.SITE_URL || 'https://onda-life.com').replace(/\/$/, '')

function saveArticle(content) {
  mkdirSync(ARTICLES_DIR, { recursive: true })
  const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15)
  const filename = `article_${ts}.md`
  const filepath = join(ARTICLES_DIR, filename)
  writeFileSync(filepath, content.trim(), 'utf-8')
  return filename
}

async function postToDeploy(content, filename) {
  try {
    const res = await fetch(`${DEPLOY_URL}/api/save-article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim(), filename }),
    })
    if (!res.ok) throw new Error(await res.text())
    return true
  } catch (e) {
    console.error('[bot] postToDeploy failed:', e.message || e)
    return false
  }
}

const INLINE_APPROVE_REJECT = {
  inline_keyboard: [[{ text: '✅ Approve', callback_data: 'approve' }, { text: '❌ Reject', callback_data: 'reject' }]],
}

async function handleUpdate(update) {
  if (!TOKEN) return

  const msg = update.message || update.edited_message
  if (msg) {
    const text = (msg.text || msg.caption || '').trim()
    const chatId = msg.chat.id

    if (text === '/start') {
      await tg('sendMessage', { chat_id: chatId, text: 'Welcome! Use /next to get started.' })
      return
    }
    if (text === '/next') {
      await tg('sendMessage', { chat_id: chatId, text: 'Send me content and use the approve button to save it.' })
      return
    }
    if (text === '/article') {
      await tg('sendMessage', { chat_id: chatId, text: "Paste your article below. I'll add Approve/Reject buttons.\n\nFlow: /generate → copy draft → edit elsewhere → paste here → Approve to save." })
      return
    }
    if (text === '/generate') {
      const authChatId = CHAT_ID
      if (!authChatId || chatId !== authChatId) {
        await tg('sendMessage', { chat_id: chatId, text: 'Not authorized.' })
        return
      }
      if (!OPENAI_KEY) {
        await tg('sendMessage', { chat_id: chatId, text: 'OPENAI_API_KEY not set.' })
        return
      }
      await tg('sendMessage', { chat_id: chatId, text: 'Generating article...' })
      generateAndSend().catch(console.error)
      return
    }
    if (text === '/test') {
      const sample = `[ ARTICLE: TEST_ARTICLE // SAMPLE ]
THE INTRO
This is a test article. Click Approve to save to articles/, or Reject to discard.
THE HACK: [ PROTOCOL_TEST ]
- Step 1
- Step 2
[ HARDWARE_VALIDATION ]
STATUS: TEST_MODE`
      await tg('sendMessage', { chat_id: chatId, text: sample, reply_markup: INLINE_APPROVE_REJECT })
      return
    }
    if (text && !text.startsWith('/')) {
      try {
        await tg('sendMessage', {
          chat_id: chatId,
          text: 'Save as article?',
          reply_to_message_id: msg.message_id,
          reply_markup: INLINE_APPROVE_REJECT,
        })
      } catch (e) {
        console.error('[bot] paste reply failed:', e)
        await tg('sendMessage', { chat_id: chatId, text: `❌ Error: ${e.message || e}` }).catch(() => {})
      }
      return
    }
  }

  if (update.callback_query) {
    const cb = update.callback_query
    const chatId = cb.message.chat.id
    const msgId = cb.message.message_id
    const replyTo = cb.message.reply_to_message

    if (cb.data === 'reject') {
      await tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'Rejected' })
      await tg('editMessageReplyMarkup', { chat_id: chatId, message_id: msgId, reply_markup: { inline_keyboard: [] } }).catch(() => {})
      return
    }

    if (cb.data === 'approve') {
      let content = ''
      if (replyTo) {
        content = replyTo.text || replyTo.caption || ''
      } else {
        content = cb.message.text || ''
      }
      if (!content.trim()) {
        await tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'No content' })
        return
      }
      try {
        const filename = saveArticle(content)
        const pushed = await postToDeploy(content, filename)
        await tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'Article saved!' })
        const msg = pushed
          ? `Article saved to \`articles/${filename}\`. Live on site. Edit locally → \`node scripts/push_articles.js\``
          : `Article saved to \`articles/${filename}\`. Deploy failed — run \`node scripts/push_articles.js\` to push.`
        await tg('sendMessage', { chat_id: chatId, text: msg, parse_mode: 'Markdown' })
      } catch (e) {
        await tg('answerCallbackQuery', { callback_query_id: cb.id, text: 'Save failed!' })
        await tg('sendMessage', { chat_id: chatId, text: `❌ Save failed: ${e.message}` })
      }
    }
  }
}

let offset = 0
async function poll() {
  if (!TOKEN) return
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=30`)
    const data = await res.json()
    if (!data.ok) return
    const updates = data.result || []
    for (const u of updates) {
      offset = u.update_id + 1
      handleUpdate(u).catch(console.error)
    }
  } catch (e) {
    console.error('[bot poll]', e)
  }
  setTimeout(poll, 100)
}

export function startBot() {
  if (!TOKEN) {
    console.log('[bot] TELEGRAM_TOKEN not set, skipping')
    return
  }
  mkdirSync(ARTICLES_DIR, { recursive: true })
  if (CHAT_ID && OPENAI_KEY) {
    const firstDelay = parseInt(process.env.ARTICLE_FIRST_DELAY_SEC || '3600', 10) * 1000
    const interval = parseInt(process.env.ARTICLE_INTERVAL_HOURS || '24', 10) * 3600 * 1000
    setTimeout(() => {
      setInterval(generateAndSend, interval)
      generateAndSend().catch(console.error)
    }, firstDelay)
    console.log('[generator] 1 article/day')
  }
  poll()
  console.log('[bot] polling started')
}
