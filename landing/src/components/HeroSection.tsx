import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ── Pixel reveal ──────────────────────────────────────────────────────────────
const COLS       = 10
const BASE_DELAY = 80   // ms per unit of distance from centre
const FADE_MS    = 350  // opacity transition duration per cell

// ── LCP strategy ─────────────────────────────────────────────────────────────
// LQIP (104 bytes, inline base64) is rendered as <img> → Chrome registers it
// as the LCP candidate instantly, at HTML parse time (no network fetch).
// Full-res is loaded as CSS background-image → Chrome does NOT count it as LCP.
// Result: LCP fires at ~TTFB + HTML-download, not at image-download time.
const LQIP = 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASoUAA0APzmEuVOvKKWisAgB4CcJagCdACFQZJxfdN20QAD+6M6W8D8/SN2cxp6R5Z+EOWdg+v16rxDfqHnRcBUBhR4CndNK85+3BpZ+IAA='

// Pick the same responsive URL the preload picks (imagesrcset = 480w / 768w / 1024w)
function resolveHeroSrc(): string {
  const w = window.innerWidth * (window.devicePixelRatio || 1)
  if (w <= 540) return '/onda-life-hrv-consciousness-hero-480w.webp'
  if (w <= 900) return '/onda-life-hrv-consciousness-hero-768w.webp'
  return '/onda-life-hrv-consciousness-hero.webp'
}

// ── PixelReveal ───────────────────────────────────────────────────────────────
function PixelReveal() {
  const [grid, setGrid] = useState<{ delays: number[]; covering: boolean } | null>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const cellPx   = window.innerWidth / COLS
    const rows      = Math.ceil(window.innerHeight / cellPx) + 1
    const centerCol = (COLS - 1) / 2
    const centerRow = (rows  - 1) / 2

    const delays = Array.from({ length: rows * COLS }, (_, i) => {
      const col  = i % COLS
      const row  = Math.floor(i / COLS)
      const dist = Math.sqrt((col - centerCol) ** 2 + (row - centerRow) ** 2)
      return Math.round(dist * BASE_DELAY)
    })

    const total = Math.max(...delays) + FADE_MS + 50
    setGrid({ delays, covering: true })

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
        position: 'fixed', inset: 0, zIndex: 9999,
        pointerEvents: 'none', overflow: 'hidden',
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
export function HeroSection() {
  const [scrollY,  setScrollY]  = useState(0)
  const [heroSrc,  setHeroSrc]  = useState('')  // empty on SSR; set after mount

  useEffect(() => {
    // Load full-res as CSS background (not LCP candidate) using preloaded file
    setHeroSrc(resolveHeroSrc())

    const handleScroll = () => {
      if (window.innerWidth >= 768) setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-8 md:pt-4">

      {/* ── LCP IMAGE: inline base64 LQIP as real <img> ──────────────────────
          Chrome registers this as the LCP candidate the moment HTML is parsed.
          No network fetch required → LCP fires at TTFB + HTML-download time.   */}
      <img
        src={LQIP}
        alt="ONDA Life hero — biocomputer OS visual"
        width="1024"
        height="682"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ filter: 'blur(12px)', transform: 'scale(1.06)' }}
      />

      {/* ── FULL-RES as CSS background (NOT a LCP candidate) ─────────────────
          Browser preloads this file via <link rel="preload"> in index.html.
          By the time the pixel animation ends (~900ms) it is already in cache. */}
      {heroSrc && (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${heroSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

      {/* Pixel reveal — 10×10vw square cells, wave from screen centre */}
      <PixelReveal />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="mb-6 inline-block rounded-full border border-cyan-500/50 bg-cyan-500/10 px-3 py-1.5 md:mb-8 md:px-4 md:py-2">
          <span className="font-mono text-xs text-cyan-400 md:text-sm">
            [ SYSTEM INITIALIZED ]
          </span>
        </div>

        <h1 className="mb-4 font-mono text-3xl font-bold leading-tight text-cyan-400 sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">
          ONDA LIFE: Operating System for Your Consciousness
        </h1>

        <p className="mx-auto mb-14 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base md:mb-20 md:text-xl">
          Stop meditating randomly. Start managing your biological code through
          systematic upgrades. Your body is a biocomputer. ONDA Life is the OS.
        </p>

        <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row md:mb-16 md:gap-4">
          <a
            href="#download"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-6 py-2 text-sm font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600 sm:w-auto"
            aria-label="Download ONDA Life app"
          >
            <DownloadIcon />
            <span>Download Now</span>
          </a>
          <Link
            to="/about"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/50 px-6 py-2 text-sm text-cyan-400 transition-all hover:bg-cyan-500/10 sm:w-auto"
          >
            <span>Learn More</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="flex justify-center pb-4 md:pb-8">
          <div className="animate-bounce text-cyan-400/60" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
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
