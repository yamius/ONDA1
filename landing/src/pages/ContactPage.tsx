import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`
const CONTACT_EMAIL = 'hello@onda-life.com'

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

const CONTACT_TITLE = 'Contact ONDA Life | Support & Community'
const CONTACT_DESC =
  'Need technical support for your biological upgrade? Connect with the ONDA Core Team. Email, Telegram, Discord — we respond.'

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    document.title = CONTACT_TITLE
    setMeta('description', CONTACT_DESC)
    setMeta('og:title', CONTACT_TITLE, true)
    setMeta('og:description', CONTACT_DESC, true)
    setMeta('og:url', `${SITE_URL}/contact`, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', CONTACT_TITLE, true)
    setMeta('twitter:description', CONTACT_DESC, true)
    setMeta('twitter:image', OG_IMAGE, true)
    return () => {
      document.title = 'ONDA Life — Biohacking App & Systematic Consciousness OS'
      setMeta('description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.')
      setMeta('og:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('og:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('og:url', SITE_URL, true)
      setMeta('og:image', OG_IMAGE, true)
      setMeta('twitter:card', 'summary_large_image', true)
      setMeta('twitter:title', 'ONDA Life — Biohacking App & Systematic Consciousness OS', true)
      setMeta('twitter:description', 'Manage your body as a biocomputer. 24 stages of deep consciousness firmware based on neuroscience. Download the update protocol now.', true)
      setMeta('twitter:image', OG_IMAGE, true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=ONDA Life Contact: ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`From: ${formData.email}\n\n${formData.message}`)}`
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 md:px-6">
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">
          Home
        </Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">
          Contact
        </span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ NEURAL UPLINK ]
      </div>

      <h1 className="mb-3 text-2xl font-bold tracking-tight font-mono md:text-4xl">
        Initialize Direct Contact
      </h1>
      <p className="mb-12 font-mono text-sm leading-relaxed text-white/50">
        Need technical support for your biological upgrade? Connect with the ONDA Core Team.
      </p>

      {/* Email & Community */}
      <h2 className="mb-6 font-mono text-xs tracking-widest text-terminal-green/60">
        CONTACT CHANNELS
      </h2>
      <div className="mb-16 space-y-6">
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-6">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-wider text-cyan-400">
            <EmailIcon />
            <span>EMAIL</span>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono text-sm text-white/90 transition-colors hover:text-cyan-400"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="rounded-lg border border-terminal-green/20 bg-terminal-green/5 p-6">
          <div className="mb-4 font-mono text-xs tracking-wider text-terminal-green">
            COMMUNITY
          </div>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-2 font-mono text-sm text-white/40">
              <TelegramIcon />
              Telegram
            </span>
            <span className="flex items-center gap-2 font-mono text-sm text-white/40">
              <DiscordIcon />
              Discord
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-xs text-white/40">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-cyan-500/50"
            placeholder="Your identifier"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-mono text-xs text-white/40">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-cyan-500/50"
            placeholder="contact@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block font-mono text-xs text-white/40">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-cyan-500/50"
            placeholder="Transmit your query..."
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg border border-cyan-500/50 bg-cyan-500/10 py-3 font-mono text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 hover:border-cyan-500/70"
        >
          [ SEND DATA PACKET ]
        </button>
      </form>

      <div className="mt-12">
        <Link
          to="/"
          className="font-mono text-xs text-white/30 transition-colors hover:text-terminal-green/60"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}
