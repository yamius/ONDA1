import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { NotFoundPage } from './NotFoundPage'
import { getArticleBySlug } from '../data/articles'
import { glossaryTerms } from '../data/glossary'
import { injectArticleGlossaryLinks } from '../utils/glossaryLinks'

const SITE_URL = 'https://ondalife.replit.app'
const OG_IMAGE = `${SITE_URL}/og-preview.png`

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return props?.children ? extractText(props.children) : ''
  }
  if (Array.isArray(node)) return node.map(extractText).join('')
  return ''
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

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined

  useEffect(() => {
    if (!article) return
    const title = `${article.title} | ONDA Life`
    const url = `${SITE_URL}/articles/${article.slug}`
    document.title = title
    setMeta('description', article.description)
    setMeta('og:title', title, true)
    setMeta('og:description', article.description, true)
    setMeta('og:url', url, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('og:type', 'article', true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', article.description, true)
    setMeta('twitter:image', OG_IMAGE, true)
    return () => {
      document.title = 'ONDA Life — Biohacking App & Systematic Consciousness OS'
      setMeta('description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.')
      setMeta('og:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('og:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('og:type', 'website', true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('twitter:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
  }, [article])

  if (!article) {
    return <NotFoundPage />
  }

  const relatedTerms = article.relatedSlugs
    .map((s) => glossaryTerms.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => t != null)
    .slice(0, 5)

  const markdownComponents = {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => {
      const text = typeof children === 'string' ? children : String(children)
      const isProtocol = text.startsWith('PROTOCOL ')
      const isNeuroplasticityProtocol = isProtocol && article.slug === 'neuroplasticity-flow-overclocking'
      return (
        <h3 className={`mb-3 mt-8 text-lg font-semibold text-white/90 ${isProtocol ? 'font-mono text-sm tracking-wider' : ''}`}>
          {isNeuroplasticityProtocol && <span className="mr-2" aria-hidden="true">🧠 </span>}
          {children}
        </h3>
      )
    },
    p: ({ children }: { children?: React.ReactNode }) => {
      const text = extractText(children)
      const isCalibrating = text.includes('Calibrating')
      return (
        <p className={`mb-4 font-mono text-sm leading-relaxed ${isCalibrating ? 'text-terminal-green/90 animate-pulse' : 'text-white/50'}`}>
          {children}
        </p>
      )
    },
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 space-y-2 pl-4">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 space-y-2 pl-4 list-decimal">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="font-mono text-sm leading-relaxed text-white/50">
        <span className="text-terminal-green/40 mr-1">•</span>
        {children}
      </li>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-white/80">{children}</strong>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => {
      const content = extractText(children)
      const isHackBlock = content.includes('The Hack:')
      const isPurpleIntro = article.introStyle === 'purple' && content.includes('Prediction Error')
      const isAmberIntro = article.introStyle === 'amber' && content.includes('light code')
      const isEmeraldIntro = article.introStyle === 'emerald' && content.includes('hybrid engine')
      const isBlueIntro = article.introStyle === 'blue' && content.includes('wetware')
      const isBlueProtocol =
        isHackBlock &&
        (content.includes('Deep Work') ||
          content.includes('Binaural Beats') ||
          content.includes('BDNF Trigger') ||
          content.includes('NSDR') ||
          content.includes('Yoga Nidra'))
      const isEmeraldProtocol =
        isHackBlock &&
        (content.includes('Fasted Window') ||
          content.includes('Intermittent Fasting') ||
          content.includes('Glucose Buffer') ||
          content.includes('Post-Meal Movement') ||
          content.includes('Zone 2'))
      const isMorningProtocol =
        isHackBlock &&
        (content.includes('First Photon') ||
          content.includes('Morning Light') ||
          content.includes('within 30 minutes of waking'))
      const isEveningProtocol =
        isHackBlock &&
        (content.includes('Blue Light') ||
          content.includes('after sunset') ||
          content.includes('90 minutes before bed') ||
          content.includes('Temperature Down'))
      let blockquoteClass = 'pl-0 pr-0'
      if (isMorningProtocol) {
        blockquoteClass = 'border-l-4 border-amber-500/60 bg-amber-500/5 pl-6 pr-4 rounded-r-lg'
      } else if (isEveningProtocol) {
        blockquoteClass = 'border-l-4 border-indigo-500/60 bg-indigo-500/5 pl-6 pr-4 rounded-r-lg'
      } else if (isEmeraldProtocol) {
        blockquoteClass = 'border-l-2 border-emerald-500 bg-emerald-500/5 pl-6 pr-4'
      } else if (isBlueProtocol) {
        blockquoteClass = 'border-l-2 border-blue-500 bg-blue-500/5 pl-6 pr-4'
      } else if (isHackBlock) {
        blockquoteClass = 'border-l-2 border-cyan-500/50 bg-cyan-500/5 pl-6 pr-4'
      } else if (isPurpleIntro) {
        blockquoteClass = 'border-l-4 border-purple-500 bg-black/40 pl-6 pr-4 rounded-r-lg'
      } else if (isAmberIntro) {
        blockquoteClass = 'border-l-4 border-amber-500 bg-black/40 pl-6 pr-4 rounded-r-lg'
      } else if (isEmeraldIntro) {
        blockquoteClass = 'border-l-2 border-emerald-500 bg-emerald-500/5 pl-6 pr-4 rounded-r-lg'
      } else if (isBlueIntro) {
        blockquoteClass = 'border-l-2 border-blue-500 bg-blue-500/5 pl-6 pr-4 rounded-r-lg'
      }
      const protocolIcon = isMorningProtocol ? '☀️ ' : isEveningProtocol ? '🌙 ' : isBlueProtocol ? '🧠 ' : ''
      return (
        <blockquote className={`my-6 py-4 font-mono text-sm leading-relaxed text-white/70 ${blockquoteClass}`}>
          {protocolIcon && <span className="mr-2" aria-hidden="true">{protocolIcon}</span>}
          {children}
        </blockquote>
      )
    },
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      const isExternal = href?.startsWith('http')
      const className =
        'text-terminal-cyan underline decoration-terminal-cyan/30 underline-offset-2 transition-colors hover:text-terminal-cyan/80 hover:decoration-terminal-cyan/50'
      if (href && !isExternal && href.startsWith('/')) {
        return (
          <Link to={href} className={className}>
            {children}
          </Link>
        )
      }
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className={className}
        >
          {children}
        </a>
      )
    },
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pt-20 pb-16 md:px-6">
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">
          Home
        </Link>
        <span>/</span>
        <Link to="/articles" className="transition-colors hover:text-white/50">
          Articles
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          {article.title}
        </span>
      </nav>

      <div className="mb-4">
        <span className="rounded-md border border-terminal-green/20 bg-terminal-green/5 px-3 py-1 font-mono text-[10px] tracking-wider text-terminal-green">
          {article.category}
        </span>
      </div>

      <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        {article.title}
      </h1>
      <p className="mb-10 font-mono text-sm leading-relaxed text-white/50">
        {article.description}
      </p>

      <article className="prose-onda">
        <Markdown components={markdownComponents}>
          {injectArticleGlossaryLinks(article.content)}
        </Markdown>
      </article>

      {/* CTA: Download ONDA Life */}
      <div className="mt-16 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-terminal-green/5 p-8 text-center">
        <p className="mb-6 font-mono text-base font-semibold text-white/90 md:text-lg">
          {article.slug === 'dopamine-architecture-mastering-desire'
            ? 'System Calibration Ready. Download ONDA Life to optimize your Dopamine baseline and track motivation windows.'
            : article.slug === 'circadian-reset-mastering-light'
              ? 'System Calibration Ready. Download ONDA Life to sync your Circadian Rhythm and track light exposure.'
              : article.slug === 'metabolic-flexibility-dual-fuel-system'
                ? 'System Calibration Ready. Download ONDA Life to optimize your Metabolic Flexibility and track fuel switching.'
                : article.slug === 'neuroplasticity-flow-overclocking'
                  ? 'System Calibration Ready. Download ONDA Life to track Flow State and optimize Neuroplasticity.'
                  : 'System Calibration Ready. Download ONDA Life to track your Vagus Nerve tone in real-time.'}
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

      {article.neuralSuggestion && (
        <div className="mt-12 rounded-xl border border-purple-500/30 bg-purple-500/5 p-6">
          <p className="mb-3 font-mono text-sm text-white/70">
            {article.neuralSuggestion.text}
          </p>
          <Link
            to={article.neuralSuggestion.link}
            className="font-mono text-sm font-semibold text-purple-400 underline decoration-purple-400/30 underline-offset-2 transition-colors hover:text-purple-300 hover:decoration-purple-300/50"
          >
            → {article.neuralSuggestion.linkText}
          </Link>
        </div>
      )}

      {relatedTerms.length > 0 && (
        <div className="mt-16 border-t border-white/5 pt-10">
          <h3 className="mb-6 font-mono text-xs tracking-widest text-white/30">
            RELATED GLOSSARY TERMS
          </h3>
          <div className="grid gap-3">
            {relatedTerms.map((related) => (
              <Link
                key={related.slug}
                to={`/glossary/${related.slug}`}
                className="glass-card group flex items-center justify-between rounded-lg p-4 transition-all hover:border-terminal-green/10"
              >
                <div>
                  <h4 className="font-semibold transition-colors group-hover:text-terminal-green">
                    {related.title}
                  </h4>
                  <p className="mt-1 font-mono text-xs text-white/30">
                    {related.shortDescription.slice(0, 80)}...
                  </p>
                </div>
                <span className="font-mono text-sm text-terminal-green/0 transition-all group-hover:text-terminal-green/60">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <Link
          to="/articles"
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← Back to Articles
        </Link>
      </div>
    </div>
  )
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/80" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/80" aria-hidden="true">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  )
}
