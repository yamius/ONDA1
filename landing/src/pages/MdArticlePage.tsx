import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'

const SITE_URL = 'https://ondalife.replit.app'

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

/**
 * Converts plain-text Telegram article format to markdown.
 * Handles:
 *   - [ SECTION: NAME ] → ## [ SECTION: NAME ]
 *   - ALL CAPS short lines → ### LINE
 *   - Lines starting with PROTOCOL_ → blockquote
 */
function toMarkdown(raw: string): string {
  const lines = raw.split('\n')
  const out: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      out.push('')
      continue
    }

    // Full-line bracket header: [ SOME TEXT ] or [ SOME: TEXT ]
    if (/^\[.+\]$/.test(trimmed)) {
      out.push(`## ${trimmed.toUpperCase()}`)
      continue
    }

    // THE HACK: [ ... ] pattern
    if (/^THE HACK[:\s]/i.test(trimmed)) {
      out.push(`## ${trimmed.toUpperCase()}`)
      continue
    }

    // PROTOCOL_ line
    if (/^PROTOCOL[_\s]/i.test(trimmed)) {
      out.push(`> → ${trimmed}`)
      continue
    }

    // Short ALL CAPS line (section label like "THE INTRO", "THE LOGIC")
    if (trimmed === trimmed.toUpperCase() && trimmed.length < 60 && /^[A-Z\s_:[\]()]+$/.test(trimmed)) {
      out.push(`### ${trimmed}`)
      continue
    }

    // Normal paragraph line
    out.push(trimmed)
  }

  return out.join('\n')
}

const mdComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-6 mt-10 font-mono text-lg font-bold tracking-widest text-[#00FF41] [text-shadow:0_0_10px_rgba(0,255,65,0.5)] uppercase first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-4 mt-10 font-mono text-sm font-bold tracking-widest text-[#00FF41] [text-shadow:0_0_10px_rgba(0,255,65,0.4)] uppercase first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-3 mt-8 font-mono text-xs font-bold tracking-widest text-[#00FF41]/70 uppercase">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 font-mono text-sm leading-relaxed text-white/60">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-mono font-bold text-[#00FF41]">
      {children}
    </strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="font-mono not-italic text-white/80">
      {children}
    </em>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-6 border-l-2 border-[#00FF41]/40 bg-[#00FF41]/5 py-4 pl-6 pr-4 font-mono text-sm leading-relaxed text-[#00FF41]/80">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-black/60 px-2 py-0.5 font-mono text-xs text-[#00FF41]">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-4 overflow-x-auto rounded border border-[#00FF41]/20 bg-black p-4 font-mono text-xs text-[#00FF41]">
      {children}
    </pre>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 space-y-2 pl-4">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 list-decimal space-y-2 pl-4">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="font-mono text-sm leading-relaxed text-white/60">
      <span className="mr-1 text-[#00FF41]/50">→</span>
      {children}
    </li>
  ),
  hr: () => (
    <hr className="my-8 border-[#00FF41]/10" />
  ),
}

export function MdArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<MdArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch('/api/md-articles')
      .then(r => r.json())
      .then((list: MdArticle[]) => {
        const found = list.find(a => a.slug === slug)
        if (found) {
          setArticle(found)
        } else {
          setNotFound(true)
        }
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

  const markdownContent = toMarkdown(article.content)

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
      <h1 className="mb-10 text-2xl font-bold tracking-tight md:text-4xl">
        {article.title}
      </h1>

      {/* Content */}
      <article className="prose-onda">
        <Markdown components={mdComponents}>
          {markdownContent}
        </Markdown>
      </article>

      <div className="my-16 border-t border-white/5" />

      {/* Footer CTA */}
      <div className="rounded-xl border border-[#00FF41]/30 bg-gradient-to-br from-[#00FF41]/10 to-black p-8 text-center">
        <p className="mb-6 font-mono text-base font-semibold text-white/90">
          System Calibration Ready. Download ONDA Life to track your nervous system in real-time.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/#download"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition-all hover:border-[#00FF41]/50 hover:bg-white/15 sm:w-auto"
            aria-label="Download ONDA Life on App Store"
          >
            <AppleIcon />
            <span>App Store</span>
          </a>
          <a
            href="/#download"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold transition-all hover:border-[#00FF41]/50 hover:bg-white/15 sm:w-auto"
            aria-label="Download ONDA Life on Google Play"
          >
            <PlayIcon />
            <span>Google Play</span>
          </a>
        </div>
      </div>
    </div>
  )
}
