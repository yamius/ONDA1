import { useEffect, useState } from 'react'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background image with parallax (moves at 50% scroll speed) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* [ SYSTEM INITIALIZED ] badge */}
        <div className="mb-8 inline-block rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-2">
          <span className="font-mono text-sm text-cyan-400">
            [ SYSTEM INITIALIZED ]
          </span>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 font-mono text-6xl font-bold leading-tight md:text-7xl">
          <span className="text-cyan-400">ONDA LIFE:</span>
          <br />
          <span className="text-green-400">Operating System</span>
          <br />
          <span className="text-white">for Your Consciousness</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-gray-300">
          Stop meditating randomly. Start managing your biological code through
          systematic upgrades. Your body is a biocomputer. ONDA Life is the OS.
        </p>

        {/* CTA buttons */}
        <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#download"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 px-6 py-2 text-sm font-bold text-black transition-all hover:from-cyan-600 hover:to-green-600"
          >
            <DownloadIcon />
            <span>Download Now</span>
          </a>
          <a
            href="#concept"
            className="flex items-center gap-2 rounded-lg border border-cyan-500/50 px-6 py-2 text-sm text-cyan-400 transition-all hover:bg-cyan-500/10"
          >
            <span>Learn More</span>
            <span>&rarr;</span>
          </a>
        </div>

        {/* Store badges */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-xs text-white/50 transition-all hover:border-white/30 hover:text-white/70"
          >
            <AppleIcon />
            <span>Available on App Store</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-xs text-white/50 transition-all hover:border-white/30 hover:text-white/70"
          >
            <PlayIcon />
            <span>Available on Google Play</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-8">
          <div className="animate-bounce text-cyan-400/60">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  )
}
