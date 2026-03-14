import { useState } from 'react'

export function CtaSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [platform, setPlatform] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform: platform || null }),
      })
      if (res.status === 409) {
        setError('This email is already registered.')
        return
      }
      if (!res.ok) {
        setError('Something went wrong. Please try again later.')
        return
      }
      setIsSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setPlatform('')
    setError(null)
  }

  return (
    <section id="download" className="relative overflow-hidden px-4 py-20 md:px-6 md:py-32">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-terminal-green/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-block rounded-full border border-terminal-green/25 bg-black/40 px-5 py-1.5 font-mono text-[11px] tracking-[0.2em] text-terminal-green">
          [ READY TO UPGRADE? ]
        </div>
        <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-5xl">
          <span className="text-terminal-green">Initialize</span>{' '}
          <span className="text-white">Your System</span>
        </h2>
        <a
          href="/inner-spectrum"
          className="mb-10 block cursor-pointer text-sm text-white/40 transition-colors hover:text-white/70"
        >
          The world around you becomes how you see it inside yourself.
        </a>

        <div className="mx-auto flex max-w-[200px] flex-col items-center justify-center gap-2 sm:max-w-none sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={() => {
              window.lastPlatform = 'ios'
              setPlatform('ios')
              setIsOpen(true)
            }}
            className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs transition-all hover:border-white/20 hover:bg-white/10 sm:w-auto sm:px-5 sm:py-2.5"
            aria-label="Download ONDA Life on App Store"
            data-button="apple"
            data-platform="ios"
          >
            <AppleIcon />
            <div className="text-left">
              <div className="text-[9px] text-white/40">Download on the</div>
              <div className="text-sm font-semibold">App Store</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              window.lastPlatform = 'android'
              setPlatform('android')
              setIsOpen(true)
            }}
            className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs transition-all hover:border-white/20 hover:bg-white/10 sm:w-auto sm:px-5 sm:py-2.5"
            aria-label="Download ONDA Life on Google Play"
            data-button="android"
            data-platform="android"
          >
            <PlayIcon />
            <div className="text-left">
              <div className="text-[9px] text-white/40">Get it on</div>
              <div className="text-sm font-semibold">Google Play</div>
            </div>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-modal-title"
        >
          <div
            className="relative mx-4 max-w-md w-full rounded-2xl border border-terminal-green/20 bg-[#1a1b26] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-lg p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="h-[270px] flex flex-col shrink-0">
              {!isSubmitted ? (
                <form id="waitlist-form" onSubmit={handleFormSubmit} className="flex flex-col flex-1">
                  <h2 id="waitlist-modal-title" className="mb-4 text-2xl font-bold text-white">
                    Join ONDA Life
                  </h2>
                  <p className="mb-6 text-sm text-white/60">
                    We are putting the finishing touches! Leave your email and we will send you early access.
                  </p>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your email"
                    disabled={isLoading}
                    className="mb-4 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-terminal-cyan/50 focus:ring-1 focus:ring-terminal-cyan/30 disabled:opacity-50"
                  />
                  {error && (
                    <p className="mb-4 text-sm text-rose-400" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-auto w-full rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 py-3 font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting...' : 'Get Early Access'}
                  </button>
                </form>
              ) : (
                <div id="thank-you-message" className="flex flex-col flex-1">
                  <h2 className="mb-4 text-2xl font-bold text-terminal-green">Thank you!</h2>
                  <p className="mb-6 text-sm text-white/60">
                    We will contact you as soon as the app is ready to launch.
                  </p>
                  <div className="flex-1 min-h-0" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-green-500 py-3 font-bold text-black transition-opacity hover:opacity-90"
                  >
                    OK
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/80" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/80" aria-hidden="true">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  )
}
