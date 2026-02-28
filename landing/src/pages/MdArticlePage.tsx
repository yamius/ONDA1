import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'

const SITE_URL = 'https://ondalife.replit.app'
const DONE_PREFIX = 'md_done_'
const FINALIZE_PREFIX = 'md_final_'

interface MdArticle {
  slug: string
  title: string
  content: string
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
    </svg>
  )
}

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  const seconds = Math.round((words % 200) / 200 * 60)
  return `${minutes} min ${seconds.toString().padStart(2, '0')} sec`
}

type Block =
  | { type: 'header'; text: string }
  | { type: 'subheader'; text: string }
  | { type: 'quote'; lines: string[] }
  | { type: 'protocol'; id: string; name: string; lines: string[] }
  | { type: 'text'; lines: string[] }

function parseContent(raw: string): Block[] {
  const lines = raw.split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) { i++; continue }

    // [ BRACKET HEADER ]
    if (/^\[.+\]$/.test(trimmed)) {
      blocks.push({ type: 'header', text: trimmed.replace(/^\[|\]$/g, '').trim().toUpperCase() })
      i++
      continue
    }

    // THE HACK: [ ... ] — treat as header
    if (/^THE HACK[:\s]/i.test(trimmed)) {
      blocks.push({ type: 'header', text: trimmed.toUpperCase() })
      i++
      continue
    }

    // PROTOCOL_XX > Name or PROTOCOL XX: Name
    if (/^PROTOCOL[_\s\d]/i.test(trimmed)) {
      const id = `protocol-${blocks.filter(b => b.type === 'protocol').length}`
      const protoLines: string[] = [trimmed]
      i++
      while (i < lines.length && lines[i].trim() && !/^\[/.test(lines[i].trim()) && !/^PROTOCOL[_\s\d]/i.test(lines[i].trim())) {
        protoLines.push(lines[i].trim())
        i++
      }
      blocks.push({ type: 'protocol', id, name: trimmed, lines: protoLines })
      continue
    }

    // Short ALL-CAPS line = sub-label
    if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length < 60 &&
      /^[A-Z\s_:[\]()/]+$/.test(trimmed) &&
      trimmed.length > 2
    ) {
      blocks.push({ type: 'subheader', text: trimmed })
      i++
      continue
    }

    // Quoted text block (starts with ")
    if (trimmed.startsWith('"')) {
      const quoteLines: string[] = []
      while (i < lines.length) {
        const t = lines[i].trim()
        if (!t) { i++; if (quoteLines.length) break; continue }
        quoteLines.push(t)
        i++
        if (t.endsWith('"') && quoteLines.length > 0) break
      }
      blocks.push({ type: 'quote', lines: quoteLines })
      continue
    }

    // Normal text — collect into a block
    const textLines: string[] = []
    while (i < lines.length) {
      const t = lines[i].trim()
      if (!t) { i++; if (textLines.length) break; continue }
      if (
        /^\[.+\]$/.test(t) ||
        /^THE HACK[:\s]/i.test(t) ||
        /^PROTOCOL[_\s\d]/i.test(t) ||
        (t === t.toUpperCase() && t.length < 60 && /^[A-Z\s_:[\]()/]+$/.test(t) && t.length > 2)
      ) break
      textLines.push(t)
      i++
    }
    if (textLines.length) blocks.push({ type: 'text', lines: textLines })
  }

  return blocks
}

function DoneButton({ id }: { id: string }) {
  const storageKey = DONE_PREFIX + id
  const [done, setDone] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem(storageKey) === 'true'
  )

  function toggle() {
    const next = !done
    setDone(next)
    localStorage.setItem(storageKey, String(next))
  }

  return (
    <div className="mt-3 flex justify-end">
      <button
        type="button"
        onClick={toggle}
        className={`font-mono text-xs transition-colors ${done ? 'text-[#00FF41]' : 'text-white/20 hover:text-white/40'}`}
      >
        {done ? '[ ACTIVE ]' : '[ DONE ]'}
      </button>
    </div>
  )
}

function renderBlock(block: Block, idx: number) {
  switch (block.type) {
    case 'header':
      return (
        <h2 key={idx} className="mb-4 mt-10 font-mono text-sm font-bold tracking-widest text-[#00FF41]/90 [text-shadow:0_0_12px_rgba(0,255,65,0.4)] uppercase first:mt-0">
          [ {block.text} ]
        </h2>
      )

    case 'subheader':
      return (
        <h3 key={idx} className="mb-3 mt-8 font-mono text-xs font-bold tracking-widest text-[#00FF41]/60 uppercase">
          {block.text}
        </h3>
      )

    case 'quote':
      return (
        <blockquote key={idx} className="my-6 border-l-4 border-[#00FF41]/40 bg-[#00FF41]/5 py-4 pl-6 pr-4 font-mono text-sm leading-relaxed text-white/70">
          {block.lines.map((l, i) => <p key={i} className="mb-2 last:mb-0">{l}</p>)}
        </blockquote>
      )

    case 'protocol': {
      const [first, ...rest] = block.lines
      return (
        <div key={idx} className="my-6 border-l-2 border-cyan-500/50 bg-cyan-500/5 py-4 pl-6 pr-4">
          <p className="mb-3 font-mono text-sm font-semibold tracking-wide text-white/90">
            {first}
          </p>
          <div className="space-y-2">
            {rest.map((line, i) => {
              if (/^The Hack[:\s]/i.test(line)) {
                return (
                  <p key={i} className="font-mono text-sm leading-relaxed text-white/70">
                    <span className="font-semibold text-white/90">The Hack:</span>{' '}
                    {line.replace(/^The Hack[:\s]*/i, '')}
                  </p>
                )
              }
              if (/^The Logic[:\s]/i.test(line)) {
                return (
                  <p key={i} className="font-mono text-sm leading-relaxed text-white/70">
                    <span className="font-semibold text-white/90">The Logic:</span>{' '}
                    {line.replace(/^The Logic[:\s]*/i, '')}
                  </p>
                )
              }
              return (
                <p key={i} className="font-mono text-sm leading-relaxed text-white/60">{line}</p>
              )
            })}
          </div>
          <DoneButton id={block.id} />
        </div>
      )
    }

    case 'text':
      return (
        <div key={idx} className="mb-4">
          {block.lines.map((line, i) => (
            <p key={i} className="mb-2 font-mono text-sm leading-relaxed text-white/60">
              <Markdown
                components={{
                  p: ({ children }) => <>{children}</>,
                  strong: ({ children }) => (
                    <strong className="font-mono font-bold text-[#00FF41]">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="not-italic text-white/80">{children}</em>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-[#00FF41] underline">{children}</a>
                  ),
                }}
              >
                {line}
              </Markdown>
            </p>
          ))}
        </div>
      )

    default:
      return null
  }
}

export function MdArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<MdArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [finalized, setFinalized] = useState(false)

  useEffect(() => {
    if (!slug) return
    const key = FINALIZE_PREFIX + slug
    setFinalized(localStorage.getItem(key) === 'true')
    fetch('/api/md-articles')
      .then(r => r.json())
      .then((list: MdArticle[]) => {
        const found = list.find(a => a.slug === slug)
        if (found) setArticle(found)
        else setNotFound(true)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  useEffect(() => {
    if (!article) return
    const title = `${article.title} | ONDA Life`
    document.title = title
    setMeta('og:title', title, true)
    setMeta('og:url', `${SITE_URL}/articles/telegram/${article.slug}`, true)
    return () => {
      document.title = 'ONDA Life — Biohacking App & Systematic Consciousness OS'
    }
  }, [article])

  function toggleFinalize() {
    if (!slug) return
    const next = !finalized
    setFinalized(next)
    localStorage.setItem(FINALIZE_PREFIX + slug, String(next))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-20 pb-16 md:px-6">
        <p className="animate-pulse font-mono text-sm text-[#00FF41]/60">[ LOADING... ]</p>
      </div>
    )
  }

  if (notFound || !article) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-20 pb-16 md:px-6">
        <p className="font-mono text-sm text-white/40">[ 404: ARTICLE NOT FOUND ]</p>
        <Link to="/articles" className="mt-4 inline-block font-mono text-xs text-[#00FF41] underline">
          ← Back to Articles
        </Link>
      </div>
    )
  }

  const blocks = parseContent(article.content)
  const readTime = estimateReadTime(article.content)

  return (
    <div className="mx-auto max-w-4xl px-4 pt-20 pb-16 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/articles" className="transition-colors hover:text-white/50">Articles</Link>
        <span>/</span>
        <span className="text-[#00FF41]/60" aria-current="page">{article.title}</span>
      </nav>

      {/* Badge */}
      <div className="mb-4">
        <span className="rounded-md border border-[#00FF41]/20 bg-[#00FF41]/5 px-3 py-1 font-mono text-[10px] tracking-wider text-[#00FF41]">
          TELEGRAM
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {article.title}
      </h1>

      {/* Read time */}
      <p className="mb-10 text-right font-mono text-xs text-cyan-500/50">
        [{readTime}]
      </p>

      {/* Content */}
      <article>
        {blocks.map((block, i) => renderBlock(block, i))}
      </article>

      {/* Action buttons */}
      <div className="mb-8 mt-10 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <button
          type="button"
          onClick={toggleFinalize}
          className="w-[200px] border border-slate-700 px-4 py-2 text-center font-mono text-xs transition-colors hover:border-emerald-500"
          data-testid="button-finalize-article"
        >
          {finalized ? '[ STATUS: OPTIMIZED ]' : '[ FINALIZE_ARTICLE ]'}
        </button>
        <a
          href="/the-stack"
          className="w-[200px] border border-slate-700 bg-slate-900 px-4 py-2 text-center font-mono text-xs transition-colors hover:border-emerald-500"
        >
          [ OPEN_SYSTEM_STACK ]
        </a>
      </div>

      <div className="my-8 border-t border-white/5" />

      {/* Footer CTA */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-[#00FF41]/5 p-8 text-center">
        <p className="mb-6 font-mono text-base font-semibold text-white/90">
          System Calibration Ready. Download ONDA Life to track your nervous system in real-time.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/#download"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition-all hover:border-cyan-500/50 hover:bg-white/15 sm:w-auto"
            aria-label="Download ONDA Life on App Store"
          >
            <AppleIcon />
            <span>App Store</span>
          </a>
          <a
            href="/#download"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition-all hover:border-cyan-500/50 hover:bg-white/15 sm:w-auto"
            aria-label="Download ONDA Life on Google Play"
          >
            <PlayIcon />
            <span>Google Play</span>
          </a>
        </div>
      </div>

      {/* Related Glossary Terms placeholder */}
      <div className="mt-16 border-t border-white/5 pt-10">
        <h3 className="mb-6 font-mono text-xs tracking-widest text-white/30">
          RELATED GLOSSARY TERMS
        </h3>
        <Link
          to="/glossary"
          className="font-mono text-xs text-[#00FF41]/60 underline decoration-[#00FF41]/20 underline-offset-2 transition-colors hover:text-[#00FF41]"
        >
          → Browse full Glossary
        </Link>
      </div>

      {/* Back to Articles */}
      <div className="mt-12">
        <Link
          to="/articles"
          className="font-mono text-xs text-white/30 transition-colors hover:text-white/60"
        >
          ← Back to Articles
        </Link>
      </div>
    </div>
  )
}
