/**
 * /research — "The Science Behind ONDA".
 *
 * Honest by construction. Two registers, never blurred:
 *   1. WHAT WE BUILD ON — present tense, cited, real PubMed links. The
 *      mechanisms the app actually uses today (resonance/paced breathing,
 *      HRV biofeedback, interoception, vagal tone, resting-HRV trend).
 *   2. WHAT WE'RE BUILDING TOWARD — future / hypothesis tense, explicitly
 *      labelled "research vision, under validation — not current product
 *      capabilities". The frontier (longitudinal adaptation, CAR, BDNF,
 *      gamma-coherence, multi-biomarker integration).
 *
 * Never write "ONDA does X" for anything in register 2. Never describe a
 * biomarker the app doesn't measure (cortisol, BDNF, EEG/gamma) as
 * "tracked by ONDA" in the present tense. No fabricated citations or DOIs —
 * every reference below resolves to a real, vetted PubMed link reused from
 * the level pages.
 *
 * This page is the destination for the deep science removed from the
 * homepage and level pages during the honesty reframe: ambition is allowed
 * to live here, clearly marked as ambition.
 *
 * EN-only by design — the evidence-literate / grant-evaluator audience
 * reads English; localising would dilute the register and is not on the
 * roadmap.
 */
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  EVIDENCE_REFERENCES,
  EVIDENCE_CLAIMS,
  type EvidenceReference,
} from '../data/evidence'

const SITE_URL = 'https://onda-life.com'
const RESEARCH_URL = `${SITE_URL}/research`
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`

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

/* Evidence base lives in src/data/evidence.ts — every reference verified
   (authors, year, journal, DOI, PMID), every claim carries its honest
   boundary. This page renders that dataset. */

export function ResearchPage() {
  const location = useLocation()

  useEffect(() => {
    void location // unused but kept for parity with sister pages
    const title = 'The Science Behind ONDA — HRV Biofeedback, Evidence & Research Roadmap'
    const desc =
      "The evidence ONDA is built on — resonance breathing and HRV biofeedback, cited in plain sight — and the research frontier we're working to validate."
    document.title = title
    setMeta('description', desc)
    setMeta('og:title', title, true)
    setMeta('og:description', desc, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', RESEARCH_URL, true)
    setMeta('og:image', OG_IMAGE, true)
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:title', title, true)
    setMeta('twitter:description', desc, true)
    setMeta('twitter:image', OG_IMAGE, true)

    // Plain WebPage schema. NOT MedicalWebPage (avoids implying medical
    // claims) and NOT ResearchProject (avoids implying a funded, active
    // research programme). Honest by construction.
    setOrCreateScript('ld-research-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${RESEARCH_URL}#webpage`,
      url: RESEARCH_URL,
      name: title,
      description: desc,
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        name: 'ONDA Life',
        url: SITE_URL,
      },
      about: {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'ONDA Life',
        url: SITE_URL,
      },
    })

    // Machine-readable citations — each verified reference as a
    // ScholarlyArticle the page cites. Gives AI systems a structured,
    // DOI/PMID-anchored evidence graph rather than prose links.
    setOrCreateScript('ld-research-citations', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${RESEARCH_URL}#evidence`,
      url: RESEARCH_URL,
      citation: EVIDENCE_REFERENCES.map((r) => ({
        '@type': 'ScholarlyArticle',
        name: r.title,
        author: r.authors.split(', ').map((name) => ({ '@type': 'Person', name })),
        datePublished: String(r.year),
        isPartOf: { '@type': 'Periodical', name: r.journal },
        sameAs: [
          `https://doi.org/${r.doi}`,
          ...(r.pmid ? [`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`] : []),
        ],
      })),
    })

    return () => {
      const el = document.getElementById('ld-research-webpage')
      if (el) el.remove()
      const c = document.getElementById('ld-research-citations')
      if (c) c.remove()
    }
  }, [location])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      {/* ───────────── A · HERO ───────────── */}
      <header className="border-b border-white/10 pt-6 pb-12">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">
          [ THE SCIENCE ]
        </div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
          What ONDA is built on — and what we&rsquo;re building toward.
        </h1>
        <p className="font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Most wellness apps blur two very different things: the science behind
          what they actually do, and the science they&rsquo;d <em>like</em> to be
          associated with. We keep them separate. Below is both — the established
          evidence the app rests on today, cited in plain sight, and the research
          frontier we&rsquo;re working to validate with partners. We&rsquo;d
          rather under-claim than oversell.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs">
          <a
            href="#build-on"
            className="rounded border border-terminal-green/40 px-3 py-1.5 text-terminal-green hover:bg-terminal-green/10"
          >
            What we build on
          </a>
          <a
            href="#frontier"
            className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5"
          >
            Where we&rsquo;re going
          </a>
          <Link
            to="/measurements"
            className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5"
          >
            What ONDA measures
          </Link>
          <Link
            to="/how-it-works"
            className="rounded border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white/5"
          >
            How it works
          </Link>
        </div>
      </header>

      {/* ───────────── B · EVIDENCE CENTER ───────────── */}
      <section id="build-on" className="mt-14 scroll-mt-20">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">
          [ EVIDENCE CENTER — WHAT WE BUILD ON ]
        </div>
        <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
          The evidence behind what the app does today
        </h2>
        <p className="mb-8 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Everything in the ONDA app right now rests on mechanisms with a real
          evidence base. For each claim we show the sources, exactly what ONDA
          does with the mechanism, and — just as important — what the evidence
          does <em>not</em> prove.
        </p>

        <div className="space-y-4">
          {EVIDENCE_CLAIMS.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>

        {/* Coherence-vs-HRV integrity note */}
        <div className="mt-8 rounded-lg border border-white/15 bg-white/[0.02] p-5">
          <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/70">
            A NOTE ON WHAT WE MEASURE (AND DON&rsquo;T)
          </div>
          <p className="font-mono text-xs leading-relaxed text-white/70 md:text-sm">
            During practice, ONDA shows a live <strong>coherence</strong> score —
            a real-time signal of how smooth and rhythmic your heart rhythm is as
            you breathe. Your longer-term <strong>resting-HRV trend</strong> is
            read from your device via Apple Health. We&rsquo;re precise about this
            on purpose: coherence is the in-the-moment guide; the resting-HRV
            trend is the outcome to watch over weeks.
          </p>
        </div>
      </section>

      {/* ───────────── C · OUR APPROACH ───────────── */}
      <section id="approach" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">
          [ OUR APPROACH ]
        </div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
          Closed-loop, structured, and built on a method
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          Two things make ONDA different from a meditation library or a passive
          tracker.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
            <h3 className="mb-2 text-base font-bold text-white md:text-lg">A real feedback loop</h3>
            <p className="font-mono text-xs leading-relaxed text-white/70 md:text-sm">
              You breathe, you watch your own heart rhythm respond in real time,
              and the practice adapts. Most apps score you <em>after</em>. ONDA
              shows you <em>during</em> — which is what makes a practice you can
              actually feel working, and stick with.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
            <h3 className="mb-2 text-base font-bold text-white md:text-lg">Structure, not a buffet</h3>
            <p className="font-mono text-xs leading-relaxed text-white/70 md:text-sm">
              ONDA is a sequential path — each level builds on the last — rather
              than a shuffle of unrelated sessions. The structure is the point: it
              removes the &ldquo;what do I do today?&rdquo; decision and gives the
              practice a direction.
            </p>
          </div>
        </div>

        <h3 className="mt-8 mb-4 text-lg font-bold text-white">Who&rsquo;s behind it</h3>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          ONDA was built method-first, by a two-person founding team — the
          science held to account on one side, the engineering owned end-to-end
          on the other.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <TeamCard
            name="Valentin"
            role="Co-founder & Scientific Advisor"
            badge="PH.D. PHYSICS & NEUROSCIENCE"
            points={[
              'Expertise in biometric feedback loops and neural-optimization mechanisms.',
              'Oversees scientific methodology and study design.',
              'Bridges fundamental research and digital-health application.',
            ]}
          />
          <TeamCard
            name="Yakiv"
            role="Founder & CEO"
            badge="FULL-STACK EXECUTION"
            points={[
              "Lead developer responsible for ONDA's high-fidelity data pipeline.",
              '1,871+ commits on the core codebase (iOS, Android, Supabase).',
              'Building an open pipeline for academic data export.',
            ]}
          />
        </div>
      </section>

      {/* ───────────── D · THE RESEARCH FRONTIER ───────────── */}
      <section id="frontier" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">
          [ WHERE WE&rsquo;RE GOING ]
        </div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
          The research frontier
        </h2>

        {/* Non-negotiable "vision, under validation" banner */}
        <div className="mb-8 rounded-lg border border-terminal-amber/40 bg-terminal-amber/5 p-5">
          <div className="mb-2 font-mono text-xs tracking-widest text-terminal-amber">
            ▲ RESEARCH VISION — UNDER VALIDATION, NOT CURRENT CAPABILITIES
          </div>
          <p className="font-mono text-xs leading-relaxed text-white/75 md:text-sm">
            Everything in this section describes directions we&rsquo;re actively
            exploring and hypotheses we want to validate with scientific partners.
            It is <strong>not</strong> a description of outcomes the app delivers
            or biomarkers it measures today. We&rsquo;re putting it here, openly,
            because we think the ambition is worth being honest about.
          </p>
        </div>

        <div className="space-y-4">
          <FrontierCard
            n="1"
            title="Longitudinal autonomic adaptation"
            body="Whether consistent biofeedback practice produces durable shifts in resting HRV and autonomic balance over months — and how to measure that honestly at the individual level."
          />
          <FrontierCard
            n="2"
            title="Cortisol awakening response (CAR)"
            body="CAR as a stress-recovery marker, and whether daily practice correlates with healthier CAR patterns."
            note="Vision — ONDA does not measure cortisol today."
          />
          <FrontierCard
            n="3"
            title="Neuroplasticity correlates (BDNF)"
            body="The literature linking contemplative and aerobic practices to neuroplasticity markers such as BDNF, and whether structured breath practice contributes. Early, largely indirect evidence — background reading only."
            note="Vision — not a measured app outcome."
          />
          <FrontierCard
            n="4"
            title="Gamma-band coherence in advanced practitioners"
            body="EEG signatures described in long-term meditators, and what a consumer practice can and cannot say about them honestly."
            note="Frontier / experiential — explicitly the “edge of the map,” consistent with the Level 8 copy."
          />
          <FrontierCard
            n="5"
            title="Multi-biomarker, multi-device integration"
            body="Extending beyond HRV — combining signals from the wearables people already own into a fuller, still-honest picture of nervous-system state."
          />
        </div>

        <p className="mt-6 font-mono text-xs leading-relaxed text-white/55 md:text-sm">
          Each of these is a direction, not a deliverable. As evidence and our own
          data mature, anything that proves out moves up into the
          &ldquo;what we build on&rdquo; section above — with citations. Until
          then, it stays here, clearly marked as what it is.
        </p>
      </section>

      {/* ───────────── E · OUR STANDARD ───────────── */}
      <section id="standard" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">
          [ OUR STANDARD ]
        </div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
          How we decide what we&rsquo;re allowed to say
        </h2>
        <p className="mb-5 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          A few commitments that govern this whole site:
        </p>
        <div className="space-y-4 font-mono text-sm leading-relaxed text-white/70">
          <p>
            <span className="text-terminal-green">▸ We measure what the device can measure</span> — HRV
            from your wearable, via Apple Health — and we don&rsquo;t dress
            surrogate signals up as clinical ones.
          </p>
          <p>
            <span className="text-terminal-green">▸ The trend beats the number.</span> We won&rsquo;t
            gamify a single bad morning reading into anxiety.
          </p>
          <p>
            <span className="text-terminal-green">▸ A claim earns its place by citation.</span> If a
            mechanism is in the app, its evidence is on this page. If the evidence
            isn&rsquo;t there yet, the claim lives in &ldquo;where we&rsquo;re
            going,&rdquo; not in the product.
          </p>
          <p>
            <span className="text-terminal-green">▸ We&rsquo;d rather show real reviews than fake ones,</span> and
            real evidence than borrowed authority.
          </p>
        </div>
      </section>

      {/* ───────────── F · COLLABORATION INVITE ───────────── */}
      <section id="collaborate" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">
          [ WORK WITH US ]
        </div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">
          Researchers and partners
        </h2>
        <p className="mb-6 font-mono text-sm leading-relaxed text-white/70 md:text-base">
          We&rsquo;re building ONDA with people who hold us to the evidence. If you
          work in autonomic physiology, contemplative neuroscience, digital
          biomarkers, or HRV research — or you run a study that needs a structured,
          instrumented breath-practice tool — we&rsquo;d like to talk.
        </p>
        <Link
          to="/contact?topic=research"
          className="inline-block rounded border border-terminal-green/40 px-4 py-2 font-mono text-sm text-terminal-green transition-colors hover:bg-terminal-green/10"
        >
          Get in touch &rarr;
        </Link>
      </section>

      {/* ───────────── G · REFERENCES ───────────── */}
      <section id="references" className="mt-16 scroll-mt-20 border-t border-white/5 pt-10">
        <div className="mb-2 font-mono text-xs tracking-widest text-terminal-green/60">
          [ REFERENCES ]
        </div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">Sources</h2>

        <p className="mb-6 font-mono text-xs leading-relaxed text-white/50">
          These are the mechanisms the app rests on today. The research-frontier
          directions above are described in hypothesis tense and, where the
          evidence is still early, left deliberately uncited rather than dressed
          in a citation.
        </p>
        <ol className="space-y-4 font-mono text-xs leading-relaxed text-white/60">
          {EVIDENCE_REFERENCES.map((r) => (
            <ReferenceItem key={r.id} r={r} />
          ))}
        </ol>

        <p className="mt-10 font-mono text-xs leading-relaxed text-white/40">
          Ready to start?{' '}
          <Link to="/level/1" className="text-terminal-green hover:underline">
            Begin with Level 1 &rarr;
          </Link>
        </p>
      </section>
    </main>
  )
}

/* ────────────────────── Sub-components ────────────────────── */

function ReferenceItem({ r }: { r: EvidenceReference }) {
  return (
    <li id={`ref-${r.id}`} className="scroll-mt-20">
      <span className="text-terminal-green/70">[{r.id}]</span>{' '}
      <span className="text-white/75">{r.authors}</span> ({r.year}).{' '}
      <span className="italic text-white/70">{r.title}</span>.{' '}
      <span className="text-white/60">{r.journal}</span>.
      <span className="ml-2 rounded border border-white/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white/45">
        {r.studyType}
      </span>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
        <a
          href={`https://doi.org/${r.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-cyan hover:text-terminal-green break-all"
        >
          DOI: {r.doi}
        </a>
        {r.pmid && (
          <a
            href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-cyan hover:text-terminal-green"
          >
            PMID: {r.pmid}
          </a>
        )}
      </div>
    </li>
  )
}

function RefMarkers({ refs }: { refs: string[] }) {
  return (
    <>
      {refs.map((id, i) => (
        <span key={id}>
          <a
            href={`#ref-${id}`}
            className="align-super text-[10px] text-terminal-cyan hover:text-terminal-green"
          >
            [{id}]
          </a>
          {i < refs.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}

function ClaimCard({ claim }: { claim: (typeof EVIDENCE_CLAIMS)[number] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <h3 className="mb-3 text-base font-bold text-white md:text-lg">
        {claim.statement} <RefMarkers refs={claim.refIds} />
      </h3>
      <div className="space-y-3">
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-green/70">
            What ONDA does
          </div>
          <p className="font-mono text-xs leading-relaxed text-white/70 md:text-sm">
            {claim.whatOndaDoes}
          </p>
        </div>
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-terminal-amber/80">
            What this does not prove
          </div>
          <p className="font-mono text-xs leading-relaxed text-white/55 md:text-sm">
            {claim.whatIsNotProven}
          </p>
        </div>
      </div>
    </div>
  )
}

function FrontierCard({
  n,
  title,
  body,
  note,
}: {
  n: string
  title: string
  body: string
  note?: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-2 flex items-baseline gap-3">
        <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-white/60">{n}</span>
        <h3 className="text-base font-bold text-white md:text-lg">{title}</h3>
      </div>
      <p className="font-mono text-xs leading-relaxed text-white/70 md:text-sm">{body}</p>
      {note ? (
        <p className="mt-2 font-mono text-[11px] italic text-terminal-amber/70">{note}</p>
      ) : null}
    </div>
  )
}

function TeamCard({
  name,
  role,
  badge,
  points,
}: {
  name: string
  role: string
  badge: string
  points: string[]
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
      <h4 className="text-xl font-bold text-white">{name}</h4>
      <div className="mt-0.5 font-mono text-sm text-terminal-green/80">{role}</div>
      <div className="mt-3 inline-block rounded border border-terminal-green/30 bg-terminal-green/5 px-2 py-1 font-mono text-[10px] tracking-widest text-terminal-green/80">
        {badge}
      </div>
      <ul className="mt-4 space-y-2 font-mono text-xs leading-relaxed text-white/65">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-terminal-green/50">▸</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
