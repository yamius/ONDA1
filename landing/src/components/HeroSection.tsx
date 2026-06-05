import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { langFromPath, langHref } from '../i18n'

// ── Pixel reveal ──────────────────────────────────────────────────────────────
const COLS      = 10
const BASE_DELAY = 80   // ms per unit of distance from centre
const FADE_MS   = 350   // opacity transition duration per cell

// Tiny 20px LQIP (104 bytes) — inline base64, zero HTTP requests
const LQIP = 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASoUAA0APzmEuVOvKKWisAgB4CcJagCdACFQZJxfdN20QAD+6M6W8D8/SN2cxp6R5Z+EOWdg+v16rxDfqHnRcBUBhR4CndNK85+3BpZ+IAA='

// Client-only: cells are 10vw × 10vw (true squares).
// Rows are computed from actual viewport so the grid covers the full screen.
// Returns null on SSR — the footer is already hidden via CSS animation in index.html.
function PixelReveal() {
  const [grid, setGrid] = useState<{ delays: number[]; total: number; covering: boolean } | null>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const cellPx   = window.innerWidth / COLS
    const rows      = Math.ceil(window.innerHeight / cellPx) + 1  // +1 buffer row
    const centerCol = (COLS - 1) / 2
    const centerRow = (rows  - 1) / 2

    const delays = Array.from({ length: rows * COLS }, (_, i) => {
      const col  = i % COLS
      const row  = Math.floor(i / COLS)
      const dist = Math.sqrt((col - centerCol) ** 2 + (row - centerRow) ** 2)
      return Math.round(dist * BASE_DELAY)
    })

    const total = Math.max(...delays) + FADE_MS + 50
    setGrid({ delays, total, covering: true })

    // Start fading on next paint (covering → false triggers CSS transitions)
    const raf   = requestAnimationFrame(() =>
      setGrid(g => g && { ...g, covering: false })
    )
    const timer = setTimeout(() => setGone(true), total)

    return () => { cancelAnimationFrame(raf); clearTimeout(timer) }
  }, [])

  if (!grid || gone) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 10vw)`,
        gridAutoRows: '10vw',
      }}
    >
      {grid.delays.map((delay, i) => (
        <div
          key={i}
          style={{
            backgroundColor: '#050a0f',
            opacity: grid.covering ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-out ${delay}ms`,
          }}
        />
      ))}
    </div>
  )
}

// ── HeroSection ───────────────────────────────────────────────────────────────
// Parallax speeds: image moves slower than scroll → depth illusion
const PARALLAX_DESKTOP = 0.35  // 35% of scroll speed on desktop
const PARALLAX_MOBILE  = 0.30  // 30% — parallax on touch

export function HeroSection() {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const { t } = useTranslation('home')
  const lang = langFromPath(useLocation().pathname)

  useEffect(() => {
    // Ref-based direct DOM update — zero React re-renders, GPU-accelerated
    const handleScroll = () => {
      if (!imgRef.current) return
      const speed  = window.innerWidth >= 768 ? PARALLAX_DESKTOP : PARALLAX_MOBILE
      const offset = window.scrollY * speed
      imgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-8 md:pt-4 mt-[-24px]">

      {/* LQIP — 104-byte base64 thumbnail, blurred, visible immediately while full-res downloads */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${LQIP})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          filter: 'blur(12px)',
          transform: 'scale(1.06)',
        }}
      />

      {/* LCP hero — full-res, loads on top of LQIP, fetchpriority=high, parallax desktop-only */}
      <picture>
        <source
          type="image/webp"
          srcSet="/onda-life-hrv-consciousness-hero-480w.webp 480w, /onda-life-hrv-consciousness-hero-768w.webp 768w, /onda-life-hrv-consciousness-hero.webp 1024w"
          sizes="100vw"
        />
        <img
          ref={imgRef}
          src="/onda-life-hrv-consciousness-hero.webp"
          alt="ONDA Life mobile app interface showing HRV tracking and biocomputer optimization"
          title="ONDA Life: HRV tracking, consciousness OS, biocomputer interface"
          fetchPriority="high"
          loading="eager"
          width="1024"
          height="682"
          className="absolute inset-0 h-full w-full object-cover opacity-40 [object-position:50%_-15px] md:[object-position:50%_-30px]"
          style={{ willChange: 'transform' }}
        />
      </picture>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

      {/* Pixel reveal — square 10vw×10vw cells, wave from screen centre */}
      <PixelReveal />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* [ SYSTEM INITIALIZED ] badge */}
        <div className="mb-6 inline-block rounded-full border border-cyan-500/50 bg-cyan-500/10 px-3 py-1.5 md:mb-8 md:px-4 md:py-2">
          <span className="font-mono text-xs text-cyan-400 md:text-sm">
            {t('hero.badge')}
          </span>
        </div>

        {/* Main heading */}
        <h1 className="mb-4 font-mono text-3xl font-bold leading-tight sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">
          <span className="block text-cyan-400">{t('hero.titleLine1')}</span>
          <span className="block text-green-400">{t('hero.titleLine2')}</span>
          {t('hero.titleLine3') && <span className="block text-white">{t('hero.titleLine3')}</span>}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base md:mb-10 md:text-xl">
          {t('hero.subtitle')}
        </p>

        {/* CTA buttons */}
        <div className="mb-3 flex flex-col items-center justify-center gap-3 sm:flex-row md:gap-4">
          <a
            href="#download"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-6 py-2.5 text-sm font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600 sm:w-auto"
            aria-label={t('hero.ctaDownloadAria')}
          >
            <DownloadIcon />
            <span>{t('hero.ctaDownload')}</span>
            <span>&rarr;</span>
          </a>
          <Link
            to={langHref('/about', lang)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/50 px-6 py-2.5 text-sm text-cyan-400 transition-all hover:bg-cyan-500/10 sm:w-auto"
          >
            <span>{t('hero.ctaLearn')}</span>
          </Link>
        </div>

        {/* Friction-reducer microcopy — the single best line on the site */}
        <p className="mb-10 font-mono text-xs text-white/45 md:mb-16">
          {t('hero.ctaMicrocopy')}
        </p>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-4 md:pb-8">
          <button
            type="button"
            aria-label={t('hero.scrollAria')}
            onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })}
            className="animate-bounce text-cyan-400/60 transition-colors hover:text-cyan-400 cursor-pointer bg-transparent border-0 p-0"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
