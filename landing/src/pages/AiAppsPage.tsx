/**
 * /ai-apps — public documentation for the ONDA app inside ChatGPT and Claude
 * (one MCP server: https://onda-life.com/mcp — a site rewrite to onda-chatgpt.vercel.app/mcp; source in /chatgpt-app).
 * Required by both directories: what the connector does, its tools, example
 * prompts, privacy and support. EN-only (the directories review in English).
 * Facts must match chatgpt-app/lib/tools.js and privacy §9.
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CLAUDE_DIRECTORY_URL } from '../components/UseInClaudeLink'
import { gtmAiConnectorClick } from '../lib/gtm'

const SITE_URL = 'https://onda-life.com'
const PAGE_URL = `${SITE_URL}/ai-apps`
const OG_IMAGE = `${SITE_URL}/onda-life-hrv-consciousness-hero.png`
export const AI_APPS_TITLE = 'ONDA for ChatGPT & Claude: HRV and Breathing'
export const AI_APPS_DESC =
  'Use ONDA inside ChatGPT and Claude: compare HRV with Fitbit users your age, breathe with a live guide, find a free 6-minute practice, compare wearables. No account.'
const MCP_URL = 'https://onda-life.com/mcp'
const SUPPORT = 'info@onda-life.com'
const DATE_MODIFIED = '2026-10-09'

const TOOLS: { name: string; title: string; what: string; prompts: string[] }[] = [
  {
    name: 'check_hrv',
    title: 'Compare HRV with Fitbit users your age',
    what: 'Compares one HRV (RMSSD) value from Oura, Whoop, Garmin, Fitbit or Polar with a published distribution from one wearable’s users (Natarajan 2020, about 8 million Fitbit users, morning RMSSD), using the nearest age group in the data (20–61; ages 18–19 are compared with 20–21 and 62–64 with 60–61; above 64 no comparison is made and the 60–61 figures are shown for information only) and, if you share it, your sex. It says whether the value is lower than most, within the middle half or higher than most — no percentile. Without sex it shows both women and men. Apple Watch reports SDNN, a different measure, so it is not compared. The distribution comes from Fitbit wrist data; other devices compute HRV differently, so the comparison is approximate. This is a comparison with users of one device, not a medical norm. Your own trend matters more.',
    prompts: ['I’m 42 and my Apple Watch says my HRV is 38. Is that normal?', 'My Oura shows an HRV of 55 at age 30 — is that good?'],
  },
  {
    name: 'breathe_now',
    title: 'Breathe now',
    what: 'Shows a live animated breathing guide with a timer: slow even breathing, 4-7-8, box breathing, the physiological sigh or a longer exhale. Techniques with breath holds come with a caution.',
    prompts: ['I can’t fall asleep, my mind is racing. Can you help me breathe?', 'Show me 4-7-8 breathing'],
  },
  {
    name: 'find_practice',
    title: 'Find an ONDA practice',
    what: 'Suggests 1–3 of ONDA’s free 6-minute guided practices for calm, sleep, focus or energy, matched to your experience and whether you are sitting, lying or moving. Each one can be played free in the browser at onda-life.com/emoton.',
    prompts: ['I want to start meditating, I have 10 minutes, I’m a beginner.', 'Something short for sleep — I’m already lying in bed.'],
  },
  {
    name: 'compare',
    title: 'Compare devices or apps',
    what: 'Puts 2–3 wearables or wellness apps side by side using ONDA’s editorial reviews: price, subscription, which HRV metric they report, score, verdict and a link to the full review. Reviews are evidence-based, not hands-on tests. ONDA itself is never scored against others.',
    prompts: ['Oura Ring 4 or Whoop 5.0 for tracking HRV?', 'Calm or Insight Timer?'],
  },
]

const FAQ: { q: string; a: string }[] = [
  { q: 'Do I need an ONDA account?', a: 'No. The tools work without an account or sign-in.' },
  {
    q: 'What data does ONDA receive?',
    a: 'Only the parameters a tool needs to answer — for example your age and an HRV value, or the names of two products. The server computes the answer and does not store them. ONDA does not receive your conversation history.',
  },
  { q: 'Is this medical advice?', a: 'No. ONDA is a wellness tool, not a medical device. For chest pain, fainting or severe breathlessness, contact emergency services or a doctor.' },
  { q: 'Does it cost anything?', a: 'The tools are free. Links in the cards lead to onda-life.com and to the ONDA app in the App Store.' },
]

export function aiAppsJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: AI_APPS_TITLE,
      description: AI_APPS_DESC,
      inLanguage: 'en',
      dateModified: DATE_MODIFIED,
      isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL },
      about: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
}

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

const H2 = 'mb-4 mt-12 text-xl font-bold md:text-2xl'
const P = 'font-mono text-sm leading-relaxed text-white/70'

export function AiAppsPage() {
  useEffect(() => {
    document.title = `${AI_APPS_TITLE} | ONDA Life`
    setMeta('description', AI_APPS_DESC)
    setMeta('og:title', AI_APPS_TITLE, true)
    setMeta('og:description', AI_APPS_DESC, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', PAGE_URL, true)
    setMeta('og:image', OG_IMAGE, true)
  }, [])

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <header className="border-b border-white/10 pt-6 pb-10">
        <div className="mb-4 font-mono text-xs tracking-widest text-terminal-green/70">[ AI APPS ]</div>
        <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">ONDA in ChatGPT and Claude</h1>
        <p className="mb-4 font-mono text-xs text-white/40">Updated October 4, 2026</p>
        <p className={P}>
          ONDA Life is available as a connector in Claude, and the ChatGPT app is coming soon. Ask about your HRV, a breathing
          exercise, a short practice or which wearable to buy, and the answer comes with an interactive card right in the
          conversation. No account needed. ONDA is a wellness tool, not a medical device.
        </p>
      </header>

      <section>
        <h2 className={H2}>How to connect</h2>
        <ul className={`${P} list-disc space-y-2 pl-5`}>
          <li>
            <strong className="text-white/85">Claude:</strong> available in the Claude Connectors Directory.
            <div className="my-3">
              <a
                href={CLAUDE_DIRECTORY_URL}
                target="_blank"
                rel="noopener"
                onClick={() => gtmAiConnectorClick('/ai-apps', 'claude')}
                className="inline-flex items-center rounded border border-terminal-green/50 px-4 py-2 text-terminal-green hover:bg-terminal-green/10"
              >
                Add ONDA to Claude →
              </a>
            </div>
            Alternatively, add it as a custom connector (Customize → Connectors → Add custom connector) with the URL{' '}
            <code className="text-terminal-green">{MCP_URL}</code> and no authentication.
          </li>
          <li>
            <strong className="text-white/85">ChatGPT:</strong> coming soon — currently in review for the ChatGPT apps directory.
          </li>
          <li>Then just ask a question; the assistant calls the right ONDA tool on its own. You can also mention ONDA Life by name.</li>
        </ul>
      </section>

      <section>
        <h2 className={H2}>What it can do</h2>
        <div className="space-y-6">
          {TOOLS.map((t) => (
            <div key={t.name} className="rounded border border-white/10 p-5">
              <h3 className="mb-1 text-lg font-semibold">{t.title}</h3>
              <div className="mb-3 font-mono text-xs text-white/40">{t.name}</div>
              <p className={P}>{t.what}</p>
              <div className="mt-3 font-mono text-xs text-white/50">Try:</div>
              <ul className="mt-1 list-disc space-y-1 pl-5 font-mono text-sm text-terminal-green/90">
                {t.prompts.map((p) => (
                  <li key={p}>“{p}”</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className={`${P} mt-6`}>
          Safety: if you mention acute symptoms such as chest pain, fainting or severe breathlessness, ONDA does not interpret
          numbers and points you to urgent medical help instead.
        </p>
      </section>

      <section>
        <h2 className={H2}>Privacy</h2>
        <p className={P}>
          The server receives only the parameters a tool needs, computes the answer and does not store them. It does not
          receive your conversation history, and the cards contain no analytics, cookies or third-party scripts. Details are
          in section 9 of our <Link to="/privacy" className="text-terminal-green underline">privacy policy</Link>. Your use of
          ChatGPT is governed by OpenAI’s policies and your use of Claude by Anthropic’s.
        </p>
      </section>

      <section>
        <h2 className={H2}>Questions</h2>
        <dl className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-white/85">{f.q}</dt>
              <dd className={P}>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className={H2}>Support</h2>
        <p className={P}>
          Questions, problems or feedback: <a href={`mailto:${SUPPORT}`} className="text-terminal-green underline">{SUPPORT}</a>{' '}
          or the <Link to="/contact" className="text-terminal-green underline">contact page</Link>.
        </p>
      </section>
    </main>
  )
}
