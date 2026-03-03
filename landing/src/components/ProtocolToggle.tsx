import { useState } from 'react'
import { PROTOCOL_STORAGE_PREFIX } from '../data/protocol-ids'

/**
 * Shared protocol toggle (DONE/ACTIVE) — syncs with The Stack via localStorage.
 * Use in ArticlePage and MdArticlePage for protocols registered in protocol-ids.
 */
export function ProtocolToggle({ protocolId, onToggle }: { protocolId: string; onToggle?: () => void }) {
  const [, setRefresh] = useState(0)
  const isActive =
    typeof window !== 'undefined' &&
    localStorage.getItem(PROTOCOL_STORAGE_PREFIX + protocolId) === 'active'

  function toggle() {
    if (typeof window === 'undefined') return
    if (isActive) {
      localStorage.removeItem(PROTOCOL_STORAGE_PREFIX + protocolId)
    } else {
      localStorage.setItem(PROTOCOL_STORAGE_PREFIX + protocolId, 'active')
    }
    setRefresh((r) => r + 1)
    onToggle?.()
  }

  return (
    <div className="mt-3 flex justify-end">
      <button
        type="button"
        onClick={toggle}
        className={`font-mono text-xs transition-colors ${isActive ? 'text-terminal-green' : 'text-white/20 hover:text-white/40'}`}
        aria-pressed={isActive}
      >
        {isActive ? '[ ACTIVE ]' : '[ DONE ]'}
      </button>
    </div>
  )
}
