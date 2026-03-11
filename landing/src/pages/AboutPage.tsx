import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const SITE_URL = 'https://onda-life.com'
const OG_IMAGE = `${SITE_URL}/og-preview.png`

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

const ABOUT_TITLE = 'About ONDA Life | Operating System for Your Consciousness & Biohacking'
const ABOUT_DESC =
  'Discover how ONDA Life upgrades your biological firmware through systematic HRV tracking, neural hardware optimization, and 8 levels of consciousness development.'

export function AboutPage() {
  useEffect(() => {
    document.title = ABOUT_TITLE
    setMeta('description', ABOUT_DESC)
    setMeta('og:title', ABOUT_TITLE, true)
    setMeta('og:description', ABOUT_DESC, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', `${SITE_URL}/about`, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', ABOUT_TITLE, true)
    setMeta('twitter:description', ABOUT_DESC, true)
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

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/60">
        [ ABOUT ]
      </div>

      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">
        What is ONDA Life
      </h1>
      <p className="mb-6 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        ONDA Life — a system of mindfulness and self-development practices for real life.
      </p>
      <ul className="mb-8 space-y-2 pl-1">
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>breathing, body, and meditation steps;
        </li>
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>levels: from body support to higher states of consciousness;
        </li>
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>short formats 1–12 minutes;
        </li>
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>internal currency OND for practices and missions.
        </li>
      </ul>
      <p className="mb-16 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        Path: from body sensation — to clarity, inspiration, and strength.
      </p>

      {/* How it works */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        How it works
      </h2>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        ONDA Life — routes (waves and levels) of simple daily steps.
      </p>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60">
        You learn to:
      </p>
      <ul className="mb-6 space-y-2 pl-1">
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>rely on body as a source of energy;
        </li>
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>experience emotions as a language of connection;
        </li>
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>use the mind for precise action;
        </li>
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>kindle the soul by supporting others.
        </li>
      </ul>
      <p className="mb-16 font-mono text-sm leading-relaxed text-white/60">
        Each practice — short breathing, attention to body, micro-movements, or contemplation.
      </p>

      {/* Resources */}
      <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-4xl">
        Resources, rewards, results
      </h2>
      <p className="mb-4 font-mono text-sm leading-relaxed text-white/60 md:text-base">
        We provide routes, tips, and support. For practices and missions you earn OND — game currency:
      </p>
      <ul className="mb-6 space-y-2 pl-1">
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>OND accumulates for regularity;
        </li>
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>from level 3, it can be converted to real money;
        </li>
        <li className="font-mono text-sm leading-relaxed text-white/50">
          <span className="mr-2 text-terminal-green/40">•</span>early level skills — foundation for further growth.
        </li>
      </ul>
      <p className="mb-16 font-mono text-sm leading-relaxed text-white/60">
        Result: stable presence, calm, clarity, and inner support in life.
      </p>

      {/* Details */}
      <div className="space-y-6 border-t border-white/5 pt-10">
        <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-4xl">
          ONDA Life is a practice of self-awareness and body awareness
        </h2>
        <p className="font-mono text-sm leading-relaxed text-white/60">
          Connect your fitness tracker or smartwatch in settings and watch your vitals change in real time during your practice.
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/60">
          The more successful you are — measured by time in practice and improvements in your state — the more OND you earn. Connecting a tracker or smartwatch will boost your earnings for completing practices.
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/60">
          Once you complete all practices in a part with over 40% success, you'll unlock the next level.
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/60">
          At the start of each part, you'll find general guidance before the Main Practices. At the end, there's a more detailed attunement to help you assess your current state.
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/60">
          In the Emotional Check window, you can discover your current emotional state and can complete an Adaptive practice.
        </p>
        <p className="font-mono text-sm leading-relaxed text-white/50">
          Remember: the ONDA level system is a journey of realizations — experiencing yourself as an amoeba, fish, animal, primate, human, brain cell, DNA, and finally, an atom. Give each stage the attention it deserves, and your path will be effortless and fulfilling.
        </p>
        <p className="mt-8 font-mono text-base font-semibold text-terminal-green">
          Good luck on your journey!
        </p>
      </div>

      {/* Back */}
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
