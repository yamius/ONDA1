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

const PAGE_TITLE = 'The Inner Spectrum | ONDA Life'
const PAGE_DESC =
  'Beyond the Binary: The Art of Letting Go. Where control ends, true connection with reality begins.'

export function InnerSpectrumPage() {
  useEffect(() => {
    document.title = PAGE_TITLE
    setMeta('description', PAGE_DESC)
    setMeta('og:title', PAGE_TITLE, true)
    setMeta('og:description', PAGE_DESC, true)
    setMeta('og:type', 'article', true)
    setMeta('og:url', `${SITE_URL}/inner-spectrum`, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', PAGE_TITLE, true)
    setMeta('twitter:description', PAGE_DESC, true)
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
    <div className="mx-auto max-w-2xl px-4 pb-32 pt-8 md:px-6">

      {/* Section label */}
      <div className="mb-8 font-mono text-xs tracking-widest text-terminal-green/60">
        [ THE INNER SPECTRUM ]
      </div>

      {/* Header */}
      <h1 className="mb-12 font-serif text-3xl font-bold leading-snug text-white md:text-5xl">
        Beyond the Binary: The Art of Letting Go
      </h1>

      {/* Main body */}
      <div className="space-y-7 text-base leading-relaxed text-white/65 md:text-lg">
        <p>
          Most of our lives are spent with our hands gripping the wheel, trying to steer through a
          world of rigid choices. We are taught to see only two directions: left or right, success
          or failure, action or rest. But true connection with reality begins where control ends.
        </p>
        <p>
          There comes a moment when you must take your hands off the steering wheel and surrender to
          the emanation of your own feelings. In that instant, the world stops being a route to
          manage and becomes a flow to inhabit.
        </p>
      </div>

      {/* Multitude block */}
      <div className="my-14 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-8 py-10">
        <p className="mb-6 text-sm leading-relaxed text-white/50 md:text-base">
          Where there was once only the dry logic of choice, an infinite number of variations is
          born. This is a realm of countless shades and vibrations that cannot be calculated, only
          lived:
        </p>
        <ul className="space-y-5">
          {[
            'Silence that holds a thousand undertones.',
            'Joy vibrating at a dozen different frequencies.',
            'A peace that shifts seamlessly from deep indigo to radiant gold.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-4 text-white/70">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-terminal-green/70" />
              <span className="text-base leading-relaxed md:text-lg">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Powerful Close — breathing glow behind */}
      <div className="relative my-16 overflow-hidden rounded-2xl px-6 py-20 text-center md:px-12">
        <style>{`
          @keyframes is-breathe {
            0%, 100% { transform: scale(1); opacity: 0.55; }
            50%       { transform: scale(1.18); opacity: 1; }
          }
        `}</style>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,255,170,0.09) 0%, transparent 70%)',
            animation: 'is-breathe 7s ease-in-out infinite',
          }}
        />
        <p className="relative font-serif text-xl leading-relaxed text-white/90 md:text-2xl md:leading-relaxed">
          The world outside obediently takes the shape of this inner spectrum. It becomes as
          multifaceted, deep, and alive as you allow yourself to be within.
        </p>
      </div>

      {/* ─── Section divider ─── */}
      <div className="my-20 border-t border-white/[0.06]" />

      {/* Section label */}
      <div className="mb-8 font-mono text-xs tracking-widest text-terminal-green/60">
        [ THE LENS OF PERCEPTION ]
      </div>

      {/* Header */}
      <h2 className="mb-12 font-serif text-3xl font-bold leading-snug text-white md:text-5xl">
        Recalibrate Your Inner Vision
      </h2>

      {/* Main body */}
      <div className="space-y-7 text-base leading-relaxed text-white/65 md:text-lg">
        <p>
          Your perception is the filter through which reality is rendered. When that filter is
          clouded by stress, fatigue, or the constant hum of daily noise, the world appears
          limited—a rigid map of obstacles and binary choices.
        </p>
        <p>
          ONDA Life serves as a precision tool to clear that lens. By aligning your physiological
          rhythms with your conscious intent, we help you shift from reactive survival to a state of
          creative presence.
        </p>
      </div>

      {/* Insight block */}
      <div className="my-14 rounded-2xl border border-terminal-green/20 bg-terminal-green/[0.04] px-8 py-10">
        <p className="mb-6 font-serif text-xl leading-relaxed text-white/90 md:text-2xl">
          You do not simply observe the world; you broadcast it.
        </p>
        <p className="text-base leading-relaxed text-white/55 md:text-lg">
          Through biofeedback and deep awareness, you begin to detect the "glitches" in your
          internal architecture. As you smooth out these inner frequencies, the world outside
          responds in kind—opening doors where there were once walls and revealing brilliance where
          there was only gray.
        </p>
      </div>

      {/* Final Chord */}
      <div className="relative my-16 overflow-hidden rounded-2xl px-6 py-20 text-center md:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,255,170,0.09) 0%, transparent 70%)',
            animation: 'is-breathe 7s ease-in-out infinite',
          }}
        />
        <p className="relative font-serif text-xl leading-relaxed text-white/90 md:text-2xl md:leading-relaxed">
          ONDA Life helps you clear the noise so your inner vision can finally render the world you
          deserve.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/#download"
          className="inline-block font-mono text-sm text-terminal-green/50 transition-colors hover:text-terminal-green"
        >
          ← Initialize Your System
        </Link>
      </div>
    </div>
  )
}
