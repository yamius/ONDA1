export function CtaSection() {
  return (
    <section id="download" className="relative px-6 py-32">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-terminal-green/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-block rounded-full border border-terminal-green/25 bg-black/40 px-5 py-1.5 font-mono text-[11px] tracking-[0.2em] text-terminal-green">
          [ READY TO UPGRADE? ]
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          Initialize Your System
        </h2>
        <p className="mb-10 text-sm text-white/40">
          You found ONDA... and ONDA found you.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="group flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-8 py-4 text-sm transition-all hover:border-white/20 hover:bg-white/10 sm:w-auto"
          >
            <AppleIcon />
            <div className="text-left">
              <div className="text-[10px] text-white/40">Download on the</div>
              <div className="font-semibold">App Store</div>
            </div>
          </a>
          <a
            href="#"
            className="group flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-8 py-4 text-sm transition-all hover:border-white/20 hover:bg-white/10 sm:w-auto"
          >
            <PlayIcon />
            <div className="text-left">
              <div className="text-[10px] text-white/40">Get it on</div>
              <div className="font-semibold">Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

function AppleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white/80">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  )
}
