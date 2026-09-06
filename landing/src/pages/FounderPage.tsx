/**
 * /people/yakiv-bilenko — the founder's canonical person page.
 *
 * Emits a ProfilePage whose mainEntity is the site's canonical Person
 * (@id "<site>/#author", the same entity referenced by every article),
 * enriched with real education and an explicit scope boundary.
 *
 * Honesty (the point of the page): Yakiv's expertise is architecture,
 * psychology and Gestalt therapy plus product engineering — NOT clinical
 * neuroscience. The physiology/neuroscience authority belongs to ONDA's
 * scientific advisor. Never imply the founder is the scientific authority.
 * Only facts the founder provided are used; nothing invented.
 *
 * EN-only. Self-contained meta + ProfilePage/Person JSON-LD.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/people/yakiv-bilenko`
const AUTHOR_ID = `${SITE_URL}/#author`
const SAME_AS = ['https://www.linkedin.com/in/yamius', 'https://wateremotions.tilda.ws/kukoom']

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

function setOrCreateScript(id: string, json: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(json)
}

export function FounderPage() {
  const location = useLocation()

  useEffect(() => {
    void location
    const title = 'Yakiv Bilenko — Founder & CEO of ONDA Life'
    const desc =
      'Yakiv Bilenko, founder & CEO of ONDA Life — architect (KNUCA, 2006) and Gestalt therapist (MIGIS, 2018) who builds the product. ONDA’s physiology and neuroscience are led by its scientific advisor.'
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'profile', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('twitter:card', 'summary', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)

    setOrCreateScript('ld-founder-profile', {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${PAGE_URL}#profile`,
      url: PAGE_URL,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL },
      mainEntity: {
        '@type': 'Person',
        '@id': AUTHOR_ID,
        name: 'Yakiv Bilenko',
        url: PAGE_URL,
        sameAs: SAME_AS,
        jobTitle: 'Founder & CEO, ONDA Life',
        description: desc,
        knowsAbout: [
          'architecture',
          'architecture and human psychological states',
          'Gestalt therapy',
          'systemic family therapy',
          'psychology',
          'breathwork',
          'heart rate variability',
          'physiological self-regulation',
        ],
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'Kyiv National University of Construction and Architecture (KNUCA)' },
          { '@type': 'EducationalOrganization', name: 'MIGIS institute (Gestalt therapy)' },
        ],
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Architect (urban planning), KNUCA, 2006' },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'Gestalt & systemic-family therapist, MIGIS, 2018' },
        ],
        worksFor: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      },
    })

    return () => {
      const el = document.getElementById('ld-founder-profile')
      if (el) el.remove()
    }
  }, [location])

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 md:px-6">
      {/* Breadcrumb */}
      <nav className="mt-6 mb-8 flex items-center gap-2 font-mono text-xs text-white/30" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-white/50">Home</Link>
        <span>/</span>
        <Link to="/about" className="transition-colors hover:text-white/50">About</Link>
        <span>/</span>
        <span className="text-terminal-green/60" aria-current="page">Yakiv Bilenko</span>
      </nav>

      <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ FOUNDER ]</div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-5xl">Yakiv Bilenko</h1>
      <p className="mb-8 font-mono text-sm text-white/50">Founder &amp; CEO, ONDA Life</p>

      {/* Bio */}
      <section className="space-y-4 font-mono text-sm leading-relaxed text-white/70 md:text-base">
        <p>
          Yakiv Bilenko is the founder and CEO of ONDA Life. He works across two disciplines that
          rarely meet: architecture and psychology.
        </p>
        <p>
          As an <strong className="text-white">architect</strong> — trained at the Kyiv National
          University of Construction and Architecture (KNUCA, 2006), as an architect-urbanist — he
          studies and designs structured forms (domes, spheres, pyramids, zomes) and how they exert a
          structured influence on a person&rsquo;s mental, physical and psychological state.
        </p>
        <p>
          As a <strong className="text-white">Gestalt and systemic-family therapist</strong> —
          trained at the MIGIS institute (2018), where he also leads groups — he developed a program
          for comprehensive psychological development of the person, applying modern methods of
          analysing a person&rsquo;s state.
        </p>
        <p>
          ONDA Life grew out of that intersection: the idea that your external and internal
          environments continuously shape one another, and that a person can learn to read and steer
          their own physiological state. Yakiv leads ONDA&rsquo;s product and engineering end-to-end —
          the app, the data pipeline (iOS, Android, Supabase), and the open pipeline for academic
          data export.
        </p>
      </section>

      {/* Scope boundary — the honest E-E-A-T note */}
      <section className="mt-10 rounded-lg border border-white/10 bg-white/[0.02] p-5">
        <h2 className="mb-2 font-mono text-xs tracking-widest text-terminal-amber/80">
          FOUNDER — NOT THE SCIENTIFIC AUTHORITY
        </h2>
        <p className="font-mono text-xs leading-relaxed text-white/60 md:text-sm">
          Yakiv&rsquo;s expertise is architecture, psychology and Gestalt therapy, plus full-stack
          engineering — not clinical neuroscience or physiology. ONDA&rsquo;s scientific methodology
          and validation are overseen by its scientific advisor. We keep that line explicit on
          purpose: the product is built method-first, with the science held to account by someone
          whose field it is. See{' '}
          <Link to="/research" className="text-terminal-green hover:underline">the science behind ONDA</Link>{' '}
          for the evidence base and the advisor&rsquo;s role.
        </p>
      </section>

      {/* Links */}
      <section className="mt-10">
        <h2 className="mb-3 font-mono text-xs tracking-widest text-terminal-green/60">[ ELSEWHERE ]</h2>
        <ul className="space-y-2 font-mono text-sm">
          <li>
            <a href="https://www.linkedin.com/in/yamius" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green">
              LinkedIn — linkedin.com/in/yamius
            </a>
          </li>
          <li>
            <a href="https://wateremotions.tilda.ws/kukoom" target="_blank" rel="noopener noreferrer" className="text-terminal-cyan hover:text-terminal-green">
              KUKOOM — architectural forms project
            </a>
          </li>
        </ul>
      </section>

      <p className="mt-10 font-mono text-xs leading-relaxed text-white/40">
        More:{' '}
        <Link to="/about" className="text-terminal-green hover:underline">About ONDA</Link>,{' '}
        <Link to="/product" className="text-terminal-green hover:underline">Product</Link>,{' '}
        <Link to="/research" className="text-terminal-green hover:underline">The science</Link>.
      </p>
    </main>
  )
}
