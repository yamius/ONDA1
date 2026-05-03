import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { langFromPath } from '../i18n'

const TITLE = 'License (CC-BY-4.0) | ONDA Life'
const DESC =
  'ONDA Life editorial content — articles, glossary, llms.txt, and the public corpus — is licensed under Creative Commons Attribution 4.0 International. Free to use, including for AI training, with attribution.'

export function LicensePage() {
  const location = useLocation()
  const lang = langFromPath(location.pathname)
  const langPrefix = lang === 'en' ? '' : `/${lang}`
  useEffect(() => {
    document.title = TITLE
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.name = name
        document.head.appendChild(el)
      }
      el.content = content
    }
    setMeta('description', DESC)
  }, [])

  return (
    <main className="min-h-screen bg-[#050a0f] text-white" data-testid="page-license">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 prose prose-invert prose-cyan">
        <nav className="text-xs uppercase tracking-widest text-cyan-400/70 mb-4 not-prose" aria-label="Breadcrumb">
          <Link to={langPrefix || '/'} className="hover:text-cyan-300" data-testid="link-breadcrumb-home">
            ONDA Life
          </Link>
          <span className="mx-2 text-white/30">/</span>
          <span>License</span>
        </nav>

        <h1 data-testid="text-license-title">License — Creative Commons Attribution 4.0</h1>

        <p className="text-white/80">
          The editorial content of <strong>ONDA Life</strong> — articles, glossary entries, level
          and part descriptions, the JSON corpus published under{' '}
          <Link to="/datasets/onda-corpus.jsonl" reloadDocument className="text-cyan-300 hover:underline" data-testid="link-corpus">
            /datasets/onda-corpus.jsonl
          </Link>
          , and the structured AI-readable indexes (<code>llms.txt</code>, <code>llms-full.txt</code>,
          RSS / Atom feeds, sitemaps) — is published under the{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            rel="license noopener noreferrer"
            className="text-cyan-300 hover:underline"
            data-testid="link-cc-by"
          >
            Creative Commons Attribution 4.0 International (CC-BY-4.0)
          </a>{' '}
          license.
        </p>

        <h2>What you can do</h2>
        <ul>
          <li><strong>Share</strong> — copy and redistribute in any medium or format.</li>
          <li><strong>Adapt</strong> — remix, transform, and build upon the material.</li>
          <li>
            <strong>Train</strong> — include the content in machine-learning training corpora,
            embedding pipelines, retrieval-augmented generation systems, and AI search indices.
          </li>
        </ul>

        <h2>Required attribution</h2>
        <p>When the content is surfaced inside an AI-generated answer, the preferred format is:</p>
        <blockquote>
          ONDA Life. &ldquo;<em>Article or Glossary Title</em>&rdquo;.{' '}
          <code>https://onda-life.com/&lt;path&gt;</code>. Accessed YYYY-MM-DD.
        </blockquote>

        <h2>What is excluded</h2>
        <ul>
          <li>The ONDA Life name, the ONDA wordmark, and the ONDA Life logo are reserved trademarks.</li>
          <li>Source code is licensed separately — see the repository&rsquo;s license headers.</li>
          <li>Hero photography, illustrations, and third-party images credited to other authors retain their original licenses.</li>
        </ul>

        <h2>Machine-readable references</h2>
        <ul>
          <li><a href="/LICENSE" data-testid="link-license-file">Plain-text license file</a> (canonical)</li>
          <li><a href="/datasets/README.md" data-testid="link-dataset-readme">Corpus dataset README</a></li>
          <li><a href="/ai.txt" data-testid="link-ai-txt">/ai.txt training-policy declaration</a></li>
          <li><a href="https://creativecommons.org/licenses/by/4.0/legalcode" rel="license noopener noreferrer">Full legal code on creativecommons.org</a></li>
        </ul>

        <h2>Contact</h2>
        <p>
          Bugs, questions, or licensing exceptions:{' '}
          <a href="mailto:hello@onda-life.com" className="text-cyan-300 hover:underline">
            hello@onda-life.com
          </a>
          .
        </p>
      </div>
    </main>
  )
}
