import { Fragment, useEffect, useMemo, useState } from 'react'
import AppStoreCTA from '../components/AppStoreCTA'
import { storeCt } from '../lib/storeCt'
import { Link, useLocation } from 'react-router-dom'
import { homePathFor, langFromPath, langHref, type Lang } from '../i18n'
import { CHRONOTYPE_QUESTIONS, CHRONOTYPE_SOURCES, scoreToChronotype } from '../data/chronotype-quiz'
import { chronoToolCopy, fill, type ChronoToolCopy } from '../data/chrono-tool-i18n'
import { SourcesSection } from '../components/SourcesSection'

/** Render inline markdown links ([text](/path)) as router links. */
function Rich({ text, lang }: { text: string; lang: Lang }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!m) return <Fragment key={i}>{p}</Fragment>
        return (
          <Link key={i} to={langHref(m[2], lang)} className="text-terminal-green hover:underline">
            {m[1]}
          </Link>
        )
      })}
    </>
  )
}

export function ChronotypeQuizPage() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  const c: ChronoToolCopy = chronoToolCopy(lang)

  // answers[questionId] = index of the chosen option
  const [answers, setAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    document.title = c.meta.title
    window.scrollTo({ top: 0 })
  }, [c])

  const answeredCount = Object.keys(answers).length
  const complete = answeredCount === CHRONOTYPE_QUESTIONS.length

  const type = useMemo(() => {
    if (!complete) return null
    const total = CHRONOTYPE_QUESTIONS.reduce((sum, q) => sum + q.options[answers[q.id]].points, 0)
    return scoreToChronotype(total)
  }, [answers, complete])
  const profile = type ? c.profiles[type] : null

  const hub = (['ru', 'es'] as Lang[]).includes(lang) ? `/${lang}/tools` : '/tools'

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
      <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-white/40" aria-label="Breadcrumb">
        <Link to={homePathFor(lang)} className="hover:text-terminal-green">{c.breadcrumb.home}</Link>
        <span>/</span>
        <Link to={hub} className="hover:text-terminal-green">{c.breadcrumb.tools}</Link>
        <span>/</span>
        <span className="text-terminal-green/70" aria-current="page">{c.breadcrumb.current}</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{c.h1}</h1>
      <p className="mb-8 text-base leading-relaxed text-white/70">{c.capsule}</p>

      <div className="mb-2 font-mono text-[11px] text-white/40">{fill(c.ui.progress, { a: answeredCount, n: CHRONOTYPE_QUESTIONS.length })}</div>
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-terminal-green/70 transition-all" style={{ width: `${(answeredCount / CHRONOTYPE_QUESTIONS.length) * 100}%` }} />
      </div>

      <div className="mb-8 space-y-6">
        {CHRONOTYPE_QUESTIONS.map((question, qi) => (
          <fieldset key={question.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <legend className="px-1 text-sm font-semibold text-white/90">
              <span className="text-terminal-green">{qi + 1}.</span> {c.questions[qi].q}
            </legend>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
              {question.options.map((_, oi) => {
                const selected = answers[question.id] === oi
                return (
                  <button
                    key={oi} type="button" role="radio" aria-checked={selected}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: oi }))}
                    className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-colors ${
                      selected ? 'border-terminal-green/60 bg-terminal-green/10 text-terminal-green' : 'border-white/15 text-white/60 hover:border-white/30'
                    }`}
                  >
                    {c.questions[qi].options[oi]}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {profile && (
        <div className="mb-8 rounded-xl border border-terminal-green/30 bg-terminal-green/5 p-5 md:p-6" aria-live="polite">
          <div className="mb-1 font-mono text-xs uppercase tracking-widest text-white/50">{c.ui.resultTitle}</div>
          <div className="mb-1 text-3xl font-bold text-terminal-green">{profile.name}</div>
          <p className="mb-3 font-mono text-xs text-terminal-cyan">{profile.tagline}</p>
          <p className="mb-5 text-sm leading-relaxed text-white/70">{profile.description}</p>
          <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-white/50">{c.ui.planTitle}</div>
          <div className="grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
            {profile.protocol.map((p) => (
              <div key={p.label} className="bg-[#0a1018] px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{p.label}</div>
                <div className="font-mono text-sm text-white/85">{p.value}</div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => { setAnswers({}); window.scrollTo({ top: 0 }) }}
            className="mt-5 rounded-lg border border-white/20 px-4 py-2 font-mono text-xs text-white/70 hover:bg-white/5">
            ↻ {c.ui.retake}
          </button>
        </div>
      )}

      <p className="mb-10 font-mono text-[11px] leading-relaxed text-white/30">{c.disclaimer}</p>

      <AppStoreCTA ct={storeCt('tool', 'chronotype', lang)} variant="tool" lang={lang} />

      {c.sections.map((sec) => (
        <section key={sec.h2} className="mb-10">
          <h2 className="mb-3 text-xl font-bold tracking-tight md:text-2xl">{sec.h2}</h2>
          <p className="text-sm leading-relaxed text-white/70">
            <Rich text={sec.body} lang={lang} />
          </p>
        </section>
      ))}

      {/* FAQ — mirrors the FAQPage JSON-LD injected at build */}
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">{c.faqTitle}</h2>
      <div className="mb-10 divide-y divide-white/5 border-y border-white/5">
        {c.faq.map((f) => (
          <div key={f.q} className="py-4">
            <h3 className="mb-1 font-semibold text-white/90">{f.q}</h3>
            <p className="font-mono text-xs leading-relaxed text-white/50">{f.a}</p>
          </div>
        ))}
      </div>

      <SourcesSection
        heading={c.sourcesTitle}
        methodology={c.methodology}
        sources={CHRONOTYPE_SOURCES.map((src, i) => ({ ...src, contributes: c.sourcesContributes[i] ?? src.contributes }))}
      />

      <div className="font-mono text-xs text-white/40">
        {c.related.label}:{' '}
        <Link to={langHref('/tools/sleep-cycle', lang)} className="text-terminal-green hover:underline">{c.related.sleep}</Link>
        {' · '}
        <Link to={langHref('/tools/caffeine', lang)} className="text-terminal-green hover:underline">{c.related.caffeine}</Link>
        {' · '}
        <Link to={langHref('/articles/what-is-my-chronotype', lang)} className="text-terminal-green hover:underline">{c.related.article}</Link>
        {' · '}
        <Link to={langHref('/tools/jet-lag', lang)} className="text-terminal-green hover:underline">{c.related.jetlag}</Link>
      </div>
    </main>
  )
}
