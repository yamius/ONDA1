import { useState, useEffect, useCallback } from 'react'

const STORAGE_VALIDATE = 'onda_article_validate_'
const STORAGE_INVALIDATE = 'onda_article_invalidate_'
const STORAGE_VOTE = 'onda_article_vote_'
const STORAGE_COMMENTS = 'onda_article_comments_'

export function ArticleValidationArrows({ articleSlug }: { articleSlug: string }) {
  const [validateCount, setValidateCount] = useState(0)
  const [invalidateCount, setInvalidateCount] = useState(0)
  const [vote, setVote] = useState<'validate' | 'invalidate' | null>(null)

  const loadCounts = useCallback(() => {
    if (!articleSlug) return
    try {
      const v = parseInt(localStorage.getItem(STORAGE_VALIDATE + articleSlug) || '0', 10)
      const i = parseInt(localStorage.getItem(STORAGE_INVALIDATE + articleSlug) || '0', 10)
      setValidateCount(v)
      setInvalidateCount(i)
      const voted = localStorage.getItem(STORAGE_VOTE + articleSlug) as 'validate' | 'invalidate' | null
      if (voted === 'validate' || voted === 'invalidate') setVote(voted)
    } catch (_) {}
  }, [articleSlug])

  useEffect(() => {
    loadCounts()
  }, [loadCounts])

  function handleValidate() {
    if (!articleSlug || vote === 'validate') return
    const newValidate = validateCount + 1
    const newInvalidate = vote === 'invalidate' ? Math.max(0, invalidateCount - 1) : invalidateCount
    setValidateCount(newValidate)
    setInvalidateCount(newInvalidate)
    setVote('validate')
    localStorage.setItem(STORAGE_VALIDATE + articleSlug, String(newValidate))
    localStorage.setItem(STORAGE_INVALIDATE + articleSlug, String(newInvalidate))
    localStorage.setItem(STORAGE_VOTE + articleSlug, 'validate')
  }

  function handleInvalidate() {
    if (!articleSlug || vote === 'invalidate') return
    const newInvalidate = invalidateCount + 1
    const newValidate = vote === 'validate' ? Math.max(0, validateCount - 1) : validateCount
    setInvalidateCount(newInvalidate)
    setValidateCount(newValidate)
    setVote('invalidate')
    localStorage.setItem(STORAGE_INVALIDATE + articleSlug, String(newInvalidate))
    localStorage.setItem(STORAGE_VALIDATE + articleSlug, String(newValidate))
    localStorage.setItem(STORAGE_VOTE + articleSlug, 'invalidate')
  }

  if (!articleSlug) return null

  return (
    <div className="font-terminal flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={handleValidate}
        title="Validate"
        className={`terminal-button flex items-center justify-center gap-1.5 rounded-none border px-2 py-1 font-mono text-xs leading-none transition-all ${
          vote === 'validate'
            ? 'border-terminal-green bg-terminal-green/10 text-terminal-green shadow-[0_0_12px_rgba(74,222,128,0.3)]'
            : 'border-terminal-cyan/50 text-terminal-cyan/90 hover:border-terminal-cyan hover:text-terminal-green hover:shadow-[0_0_8px_rgba(0,212,255,0.2)]'
        }`}
      >
        <span className="grid size-4 shrink-0 place-items-center text-[10px] translate-y-0.5" aria-hidden>˄</span>
        <span className="flex items-center text-[10px] text-white/50">{validateCount}</span>
      </button>
      <button
        type="button"
        onClick={handleInvalidate}
        title="Invalidate"
        className={`terminal-button flex items-center justify-center gap-1.5 rounded-none border px-2 py-1 font-mono text-xs leading-none transition-all ${
          vote === 'invalidate'
            ? 'border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan shadow-[0_0_12px_rgba(0,212,255,0.3)]'
            : 'border-terminal-cyan/50 text-terminal-cyan/90 hover:border-terminal-cyan hover:text-terminal-cyan hover:shadow-[0_0_8px_rgba(0,212,255,0.2)]'
        }`}
      >
        <span className="grid size-4 shrink-0 place-items-center text-[10px] translate-y-0.5" aria-hidden>˅</span>
        <span className="flex items-center text-[10px] text-white/50">{invalidateCount}</span>
      </button>
    </div>
  )
}

interface Comment {
  id: string
  timestamp: string
  text: string
}

function formatTimestamp(): string {
  const d = new Date()
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

function shortId(): string {
  return Math.random().toString(16).slice(2, 8).toUpperCase()
}

export function ArticleReactions({ articleSlug }: { articleSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [inputValue, setInputValue] = useState('')

  const loadComments = useCallback(() => {
    if (!articleSlug) return
    try {
      const raw = localStorage.getItem(STORAGE_COMMENTS + articleSlug)
      if (raw) setComments(JSON.parse(raw))
    } catch (_) {}
  }, [articleSlug])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!articleSlug || !inputValue.trim()) return
    const id = shortId()
    const comment: Comment = {
      id,
      timestamp: formatTimestamp(),
      text: inputValue.trim(),
    }
    const next = [comment, ...comments]
    setComments(next)
    setInputValue('')
    localStorage.setItem(STORAGE_COMMENTS + articleSlug, JSON.stringify(next))
  }

  if (!articleSlug) return null

  return (
    <div className="font-terminal mx-auto my-12 max-w-2xl">
      {/* User System Logs */}
      <div className="border-t border-white/10 pt-10">
        <h2 className="mb-6 font-mono text-sm font-bold uppercase tracking-widest text-terminal-green/90">
          [ USER_SYSTEM_LOGS ]
        </h2>

        <form onSubmit={handleSubmitComment} className="mb-6">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-terminal-cyan/60">
            COMMAND_INPUT &gt;
          </label>
          <div className="flex border-b border-terminal-cyan/30 bg-transparent font-mono text-sm">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder=""
              className="min-w-0 flex-1 border-0 bg-transparent py-2 pl-0 pr-2 font-mono text-xs uppercase text-white placeholder-white/20 outline-none"
            />
            <span className="animate-blink py-2 font-mono text-terminal-green">_</span>
          </div>
          <button
            type="submit"
            className="terminal-button mt-3 rounded-none border border-terminal-cyan/30 px-3 py-1 font-mono text-[10px] uppercase text-terminal-cyan/80 transition-colors hover:border-terminal-green/50 hover:text-terminal-green"
          >
            EXECUTE
          </button>
        </form>

        <div className="space-y-2">
          {comments.length === 0 && (
            <p className="font-mono text-[10px] uppercase text-white/30">
              [ NO_LOGS ]
            </p>
          )}
          {comments.map((c) => (
            <div
              key={c.id}
              className="font-mono text-[10px] leading-relaxed text-white/60"
            >
              <span className="text-terminal-cyan/70">[USER_0x{c.id}]</span>{' '}
              <span className="text-terminal-amber/60">[{c.timestamp}]</span>:{' '}
              &quot;{c.text}&quot;
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
