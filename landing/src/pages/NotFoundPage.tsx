import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found | ONDA Life'
    setMeta('robots', 'noindex, nofollow')
  }, [])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="mb-2 font-mono text-4xl font-bold text-white/90">404</h1>
      <p className="mb-8 font-mono text-sm text-white/50">
        System Error: The neural path you&apos;re looking for doesn&apos;t exist. Let&apos;s recalibrate.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-lg border border-cyan-500/50 px-6 py-2 font-mono text-sm text-cyan-400 transition-colors hover:bg-cyan-500/10"
        >
          ← Back to Home
        </Link>
        <Link
          to="/glossary"
          className="rounded-lg border border-terminal-green/50 bg-terminal-green/10 px-6 py-2 font-mono text-sm text-terminal-green transition-colors hover:bg-terminal-green/20"
        >
          Explore Glossary →
        </Link>
      </div>
    </div>
  )
}
