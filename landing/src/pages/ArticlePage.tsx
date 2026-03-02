import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import { NotFoundPage } from './NotFoundPage'
import { getArticleBySlug } from '../data/articles'
import { glossaryTerms } from '../data/glossary'
import { injectArticleGlossaryLinks } from '../utils/glossaryLinks'

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/og-preview.png`

/** Maps article slug to TheStack section id (for /the-stack#section-id anchor) */
const ARTICLE_SLUG_TO_STACK_SECTION: Record<string, string> = {
  'vagus-nerve-master-key': 'nervous-system',
  'breathwork-command-line-interface': 'nervous-system',
  'hrv-training-nervous-system-latency': 'nervous-system',
  'dopamine-architecture-mastering-desire': 'reward-logic',
  'digital-dementia-attentional-control': 'reward-logic',
  'circadian-reset-mastering-light': 'energy-grid',
  'circadian-lighting-dark-therapy': 'energy-grid',
  'metabolic-flexibility-dual-fuel-system': 'energy-grid',
  'glp1-biology-muscle-preservation': 'energy-grid',
  'mitochondrial-biogenesis-cellular-power-grid': 'power-grid',
  'mitochondrial-dna-red-light': 'power-grid',
  'senolytic-high-dosing-longevity': 'power-grid',
  'ai-biomarker-tracking-predictive': 'system-forecasting',
  'phase-locked-acoustic-sleep': 'os-states',
  'neural-entrainment-meditation-2': 'neural-hardware',
  'longevity-hardware-cellular-cleanup': 'power-grid',
  'neuroplasticity-flow-overclocking': 'cognitive-engine',
  'cognitive-architecture-nootropic-stacks': 'cognitive-engine',
  'gut-brain-axis-data-link': 'gut-brain-link',
}

const ARTICLE_SYNC_TIMES: Record<string, string> = {
  'vagus-nerve-master-key': '4 min 20 sec',
  'dopamine-architecture-mastering-desire': '5 min 15 sec',
  'circadian-reset-mastering-light': '3 min 45 sec',
  'metabolic-flexibility-dual-fuel-system': '6 min 10 sec',
  'neuroplasticity-flow-overclocking': '5 min 30 sec',
  'gut-brain-axis-data-link': '4 min 50 sec',
  'breathwork-command-line-interface': '2 min 30 sec',
  'hrv-training-nervous-system-latency': '3 min 50 sec',
  'digital-dementia-attentional-control': '4 min 10 sec',
  'longevity-hardware-cellular-cleanup': '7 min 05 sec',
  'cognitive-architecture-nootropic-stacks': '5 min 40 sec',
  'mitochondrial-biogenesis-cellular-power-grid': '6 min 15 sec',
  'circadian-lighting-dark-therapy': '5 min 20 sec',
  'glp1-biology-muscle-preservation': '5 min 45 sec',
  'mitochondrial-dna-red-light': '5 min 30 sec',
  'senolytic-high-dosing-longevity': '6 min 00 sec',
  'ai-biomarker-tracking-predictive': '5 min 45 sec',
  'phase-locked-acoustic-sleep': '6 min 15 sec',
  'neural-entrainment-meditation-2': '5 min 50 sec',
}

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

import { PROTOCOL_STORAGE_PREFIX, ARTICLE_STORAGE_PREFIX } from '../data/protocol-ids'
import { ArticleReactions, ArticleValidationArrows } from '../components/ArticleReactions'

const STORAGE_KEY_PREFIX = ARTICLE_STORAGE_PREFIX

function TerminologyAccordion({
  items,
}: {
  items: { term: string; definition: string }[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="my-8 rounded-lg border border-slate-700 bg-slate-900/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 font-mono text-xs tracking-wider text-white/70 transition-colors hover:text-white/90"
      >
        [ DECODING_TERMINOLOGY ]
        <span className="font-mono text-white/40">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="border-t border-slate-700 px-4 py-4">
          <dl className="space-y-4">
            {items.map(({ term, definition }) => (
              <div key={term}>
                <dt className="font-mono text-xs font-semibold text-terminal-green/80">
                  {term}
                </dt>
                <dd className="mt-1 font-mono text-sm leading-relaxed text-white/50">
                  {definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}

function ProtocolDoneButton({
  protocolId,
  onToggle,
}: {
  protocolId: string
  onToggle: () => void
}) {
  const isActive =
    typeof window !== 'undefined' &&
    localStorage.getItem(PROTOCOL_STORAGE_PREFIX + protocolId) === 'active'

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window === 'undefined') return
        if (isActive) {
          localStorage.removeItem(PROTOCOL_STORAGE_PREFIX + protocolId)
        } else {
          localStorage.setItem(PROTOCOL_STORAGE_PREFIX + protocolId, 'active')
        }
        onToggle()
      }}
      className={`ml-2 inline-block rounded font-mono text-xs transition-colors ${
        isActive
          ? 'text-terminal-green'
          : 'text-white/20 hover:text-white/35'
      }`}
      aria-pressed={isActive}
    >
      {isActive ? '[ ACTIVE ]' : '[ DONE ]'}
    </button>
  )
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { hash } = useLocation()
  const article = slug ? getArticleBySlug(slug) : undefined
  const [isCompleted, setIsCompleted] = useState(false)
  const [protocolRefresh, setProtocolRefresh] = useState(0)

  useEffect(() => {
    const id = hash?.slice(1)
    if (!id) return
    const scrollToProtocol = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
    scrollToProtocol()
    const t = setTimeout(scrollToProtocol, 100)
    return () => clearTimeout(t)
  }, [hash, article?.slug])

  useEffect(() => {
    if (!article?.slug) return
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + article.slug)
    setIsCompleted(stored === 'true')
  }, [article?.slug])

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

  /** Match "The Hack" blockquote content to howToSteps (for [ DONE ] button placement) */
  function getProtocolIdFromHackBlock(blockquoteContent: string): string | undefined {
    if (!article?.howToSteps?.length) return undefined
    const hackText = blockquoteContent.replace(/.*The Hack:\s*/s, '').trim()
    const step = article.howToSteps.find(
      (s) =>
        blockquoteContent.includes(s.text) ||
        s.text.includes(hackText) ||
        hackText.includes(s.text)
    )
    return step?.protocolId
  }

  const relatedTerms = article.relatedSlugs
    .map((s) => glossaryTerms.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => t != null)
    .slice(0, 5)

  const markdownComponents = {
    h2: ({ children }: { children?: React.ReactNode }) => {
      const text = typeof children === 'string' ? children : String(children)
      const isSystemStatus = text.includes('System Status') && article.slug === 'gut-brain-axis-data-link'
      const isCLIStatus = text.includes('CLI Active') && article.slug === 'breathwork-command-line-interface'
      const isHRVStatus = text.includes('SCANNING HRV') && article.slug === 'hrv-training-nervous-system-latency'
      const isFirewallStatus = text.includes('FIREWALL: ACTIVE') && article.slug === 'digital-dementia-attentional-control'
      const isLongevityStatus = text.includes('SYSTEM LIFESPAN: EXTENDED') && article.slug === 'longevity-hardware-cellular-cleanup'
      const isStatusBlock = isSystemStatus || isCLIStatus || isHRVStatus || isFirewallStatus || isLongevityStatus
      const isTechIntro = /^\[.*\]$/.test(text.trim()) && !isStatusBlock
      return (
        <h2
          className={`mb-4 mt-10 text-xl font-bold tracking-tight md:text-2xl first:mt-0 ${
            isStatusBlock ? 'font-mono tracking-wider text-terminal-green/90 text-[13.9px] [text-shadow:0_0_12px_rgba(74,222,128,0.76)]' : ''
          } ${
            isTechIntro ? 'font-mono tracking-wider text-terminal-green/90 text-[13.9px] [text-shadow:0_0_12px_rgba(74,222,128,0.76)]' : ''
          }`}
        >
          {children}
        </h2>
      )
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
      const text = typeof children === 'string' ? children : String(children)
      const isProtocol = text.startsWith('PROTOCOL ') || text.startsWith('PROTOCOL_')
      const isGutBrainProtocol = isProtocol && article.slug === 'gut-brain-axis-data-link'
      const isBreathworkProtocol = isProtocol && article.slug === 'breathwork-command-line-interface'
      const isHRVProtocol = isProtocol && article.slug === 'hrv-training-nervous-system-latency'
      const isDigitalDementiaProtocol = isProtocol && article.slug === 'digital-dementia-attentional-control'
      const isDopamineProtocol = isProtocol && article.slug === 'dopamine-architecture-mastering-desire'
      const isLongevityProtocol = isProtocol && article.slug === 'longevity-hardware-cellular-cleanup'
      const isCognitiveProtocol = isProtocol && article.slug === 'cognitive-architecture-nootropic-stacks'
      const isMitochondrialProtocol = isProtocol && article.slug === 'mitochondrial-biogenesis-cellular-power-grid'
      const isCircadianLightingProtocol = isProtocol && article.slug === 'circadian-lighting-dark-therapy'
      return (
        <h3 className={`mb-3 mt-8 text-lg font-semibold text-white/90 ${isProtocol ? 'font-mono text-sm tracking-wider' : ''} ${isGutBrainProtocol ? 'text-orange-400' : ''} ${isBreathworkProtocol ? 'text-cyan-400' : ''} ${isHRVProtocol ? 'text-rose-400' : ''} ${isDigitalDementiaProtocol ? 'text-indigo-400' : ''} ${isDopamineProtocol ? 'text-purple-400' : ''} ${isLongevityProtocol ? 'text-amber-400' : ''} ${isCognitiveProtocol || isMitochondrialProtocol || isCircadianLightingProtocol ? 'text-slate-400' : ''}`}>
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
      const isHardwareValidation = content.includes('[ HARDWARE_VALIDATION ]')
      const isHackBlock = content.includes('The Hack:')
      const isPurpleIntro = article.introStyle === 'purple' && content.includes('Prediction Error')
      const isAmberIntro = article.introStyle === 'amber' && content.includes('light code')
      const isEmeraldIntro = article.introStyle === 'emerald' && content.includes('hybrid engine')
      const isBlueIntro = article.introStyle === 'blue' && content.includes('wetware')
      const isOrangeIntro = article.introStyle === 'orange' && content.includes('second brain')
      const isCyanIntro = article.introStyle === 'cyan' && content.includes('Command Line Interface')
      const isRoseIntro = article.introStyle === 'rose' && content.includes('diagnostic report')
      const isIndigoIntro = article.introStyle === 'indigo' && content.includes('Attention Leeches')
      const isGoldIntro = article.introStyle === 'gold' && content.includes('Zombie Cells')
      const isSlateIntro =
        article.introStyle === 'slate' &&
        (content.includes('pharmacological patches') || content.includes('cellular power plants'))
      const isLongevityProtocol =
        isHackBlock &&
        (content.includes('36-to-72 hour') ||
          content.includes('water-only fast') ||
          content.includes('Quercetin') ||
          content.includes('Fisetin') ||
          content.includes('Sauna-Cold') ||
          content.includes('sauna') ||
          content.includes('cold exposure'))
      const isDigitalDementiaProtocol =
        isHackBlock &&
        (content.includes('60 minutes after waking') ||
          content.includes('Forest') ||
          content.includes('90 minutes of one') ||
          content.includes('zero digital devices') ||
          content.includes('analog activities'))
      const isRoseProtocol =
        isHackBlock &&
        (content.includes('Morning Baseline Scan') ||
          content.includes('Biofeedback Resync') ||
          content.includes('Cold Exposure Spike'))
      const isCyanProtocol =
        isHackBlock &&
        (content.includes('Box Breathing') ||
          content.includes('Physiological Sigh') ||
          content.includes('Nitric Oxide') ||
          content.includes('Nasal Only'))
      const isOrangeProtocol =
        isHackBlock &&
        (content.includes('Microbiome Patch') ||
          content.includes('Polyphenol Boost') ||
          content.includes('Cold Restart'))
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
      const isCognitiveProtocol =
        isHackBlock &&
        ((content.includes('Caffeine') && content.includes('L-Theanine')) ||
          content.includes('Alpha-GPC') ||
          content.includes('Bacopa Monnieri') ||
          content.includes('Magnesium L-Threonate'))
      const isMitochondrialProtocol =
        isHackBlock &&
        (content.includes('sauna') ||
          content.includes('80°C') ||
          content.includes('660nm') ||
          content.includes('850nm') ||
          content.includes('Red Light') ||
          content.includes('NAD+') ||
          content.includes('HIIT'))
      const isMorningProtocol =
        isHackBlock &&
        !isCognitiveProtocol &&
        !isMitochondrialProtocol &&
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
      } else if (isOrangeProtocol) {
        blockquoteClass = 'border-l-2 border-orange-500 bg-orange-500/5 pl-6 pr-4'
      } else if (isCyanProtocol) {
        blockquoteClass = 'border-l-2 border-cyan-400 bg-cyan-500/5 pl-6 pr-4'
      } else if (isRoseProtocol) {
        blockquoteClass = 'border-l-2 border-rose-500 bg-rose-500/5 pl-6 pr-4'
      } else if (isDigitalDementiaProtocol) {
        blockquoteClass = 'border-l-2 border-indigo-500 bg-indigo-500/5 pl-6 pr-4'
      } else if (isLongevityProtocol) {
        blockquoteClass = 'border-l-2 border-amber-500 bg-amber-500/5 pl-6 pr-4'
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
      } else if (isOrangeIntro) {
        blockquoteClass = 'border-l-2 border-orange-500 bg-orange-500/5 pl-6 pr-4 rounded-r-lg'
      } else if (isCyanIntro) {
        blockquoteClass = 'border-l-2 border-cyan-400 bg-cyan-500/5 pl-6 pr-4 rounded-r-lg'
      } else if (isRoseIntro) {
        blockquoteClass = 'border-l-2 border-rose-500 bg-rose-500/5 pl-6 pr-4 rounded-r-lg'
      } else if (isIndigoIntro) {
        blockquoteClass = 'border-l-2 border-indigo-500 bg-indigo-500/5 pl-6 pr-4 rounded-r-lg'
      } else if (isGoldIntro) {
        blockquoteClass = 'border-l-2 border-amber-500 bg-amber-500/5 pl-6 pr-4 rounded-r-lg'
      } else if (isSlateIntro) {
        blockquoteClass = 'border border-slate-800 bg-slate-900/80 pl-6 pr-4 rounded-r-lg'
      } else if (isCognitiveProtocol || isMitochondrialProtocol) {
        blockquoteClass = 'border border-slate-800 bg-slate-900/50 pl-6 pr-4 rounded-r-lg'
      }
      const protocolId = isHackBlock ? getProtocolIdFromHackBlock(content) : undefined
      if (isHardwareValidation) {
        const lines = content
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
        const isPredictiveArticle = article.slug === 'ai-biomarker-tracking-predictive'
        return (
          <blockquote className="my-6 space-y-1 border border-slate-800 bg-slate-900/30 px-5 py-4 font-mono text-xs leading-relaxed">
            {lines.map((line, i) => {
              const isHeader = line.includes('[ HARDWARE_VALIDATION ]')
              const isStatus = line.startsWith('STATUS:')
              const accentClass = isPredictiveArticle && (isHeader || isStatus)
                ? 'text-blue-400'
                : isHeader
                  ? 'text-emerald-500'
                  : 'text-white/60'
              return (
                <div key={i} className={accentClass}>
                  {line}
                </div>
              )
            })}
          </blockquote>
        )
      }
      return (
        <blockquote
          id={protocolId}
          className={`my-6 py-4 font-mono text-sm leading-relaxed text-white/70 scroll-mt-24 ${blockquoteClass}`}
        >
          {children}
          {protocolId && (
            <div className="mt-3 flex justify-end">
              <ProtocolDoneButton
                protocolId={protocolId}
                onToggle={() => setProtocolRefresh((n) => n + 1)}
              />
            </div>
          )}
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
    <div className="mx-auto max-w-4xl px-4 pb-16 md:px-6">
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
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/50">
        {article.description}
      </p>
      <p className="mb-10 text-right font-mono text-xs text-cyan-500/50">
        [{ARTICLE_SYNC_TIMES[article.slug] ?? '—'}]
      </p>

      <article className="prose-onda">
        <Markdown components={markdownComponents} key={protocolRefresh}>
          {injectArticleGlossaryLinks(article.content)}
        </Markdown>
      </article>

      {article.terminologyBlock && article.terminologyBlock.length > 0 && (
        <TerminologyAccordion items={article.terminologyBlock} />
      )}

      {/* Control block: MARK_COMPLETED + OPEN_SYSTEM_STACK */}
      <div className="mb-8 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <button
          type="button"
          className="w-[200px] border border-slate-700 px-4 py-2 text-center font-mono text-xs transition-colors hover:border-emerald-500"
          onClick={() => {
            const next = !isCompleted
            setIsCompleted(next)
            localStorage.setItem(STORAGE_KEY_PREFIX + article.slug, String(next))
          }}
        >
          {isCompleted ? '[ STATUS: OPTIMIZED ]' : '[ FINALIZE_ARTICLE ]'}
        </button>
        {ARTICLE_SLUG_TO_STACK_SECTION[article.slug] && (
          <a
            href={`/the-stack#${ARTICLE_SLUG_TO_STACK_SECTION[article.slug]}`}
            className="w-[200px] border border-slate-700 bg-slate-900 px-4 py-2 text-center font-mono text-xs transition-colors hover:border-emerald-500"
          >
            [ OPEN_SYSTEM_STACK ]
          </a>
        )}
      </div>

      {/* CTA: Download ONDA Life */}
      <div className="mt-16">
        <div className="mb-4 flex justify-end">
          <ArticleValidationArrows articleSlug={article.slug} />
        </div>
        <div className="p-8 text-center">
        <p className="mb-6 font-mono text-base font-semibold text-white/90 md:text-lg">
          {article.slug === 'dopamine-architecture-mastering-desire'
            ? 'System Calibration Ready. Download ONDA Life to optimize your Dopamine baseline and track motivation windows.'
            : article.slug === 'circadian-reset-mastering-light'
              ? 'System Calibration Ready. Download ONDA Life to sync your Circadian Rhythm and track light exposure.'
              : article.slug === 'metabolic-flexibility-dual-fuel-system'
                ? 'System Calibration Ready. Download ONDA Life to optimize your Metabolic Flexibility and track fuel switching.'
                : article.slug === 'neuroplasticity-flow-overclocking'
                  ? 'System Calibration Ready. Download ONDA Life to track Flow State and optimize Neuroplasticity.'
                  : article.slug === 'gut-brain-axis-data-link'
                    ? 'System Calibration Ready. Download ONDA Life to optimize your Gut-Brain Data Link and Vagus Nerve tone.'
                    : article.slug === 'breathwork-command-line-interface'
                      ? 'System Calibration Ready. Download ONDA Life to master the CLI of your breathing and gain Root Access.'
                      : article.slug === 'hrv-training-nervous-system-latency'
                        ? 'System Calibration Ready. Download ONDA Life to track HRV and optimize your nervous system latency.'
                        : article.slug === 'digital-dementia-attentional-control'
                          ? 'System Calibration Ready. Download ONDA Life to protect your attention and install the firewall.'
                          : article.slug === 'longevity-hardware-cellular-cleanup'
                            ? 'System Calibration Ready. Download ONDA Life to track your cellular health and longevity metrics.'
                            : article.slug === 'senolytic-high-dosing-longevity'
                              ? 'System Calibration Ready. Download ONDA Life to track epigenetic aging and optimize your Hit and Run protocol.'
                              : article.slug === 'ai-biomarker-tracking-predictive'
                                ? 'Future of the OS. Download ONDA Life to access predictive biomarker analytics and forecast system stability before symptoms appear.'
                                : article.slug === 'phase-locked-acoustic-sleep'
                                  ? 'System Calibration Ready. Download ONDA Life to optimize deep sleep and amplify Delta wave recovery.'
                                  : article.slug === 'neural-entrainment-meditation-2'
                                    ? 'System Calibration Ready. Download ONDA Life to tune your brain frequency with EEG-driven neural entrainment.'
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
      </div>

      {/* Reactions & Comments */}
      <ArticleReactions articleSlug={article.slug} />

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
