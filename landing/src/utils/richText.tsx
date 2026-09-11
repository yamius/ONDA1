/**
 * Tiny rich-text renderer for localized prose that must keep inline links,
 * bold and emphasis — without an HTML/markdown dependency and without letting
 * translators hand-write JSX.
 *
 * Syntax in the source string:
 *   **bold**        → <strong class="text-white">
 *   *emphasis*      → <em>
 *   {{linkKey}}     → <Link to={links[linkKey].to}>{links[linkKey].label}</Link>
 *
 * Translators move the {{linkKey}} token naturally within the sentence; the
 * anchor text (label) and target (to) come from the links map, so the wording
 * localizes while the destination stays correct.
 */
import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface RichLink {
  to: string
  label: string
}

export function renderRich(
  text: string,
  links: Record<string, RichLink> = {},
  keyBase = 'r',
): ReactNode[] {
  const nodes: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\{\{(\w+)\}\}/g
  let last = 0
  let i = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] !== undefined) {
      nodes.push(
        <strong key={`${keyBase}${i}`} className="text-white">
          {m[1]}
        </strong>,
      )
    } else if (m[2] !== undefined) {
      nodes.push(<em key={`${keyBase}${i}`}>{m[2]}</em>)
    } else if (m[3] !== undefined) {
      const l = links[m[3]]
      nodes.push(
        l ? (
          <Link key={`${keyBase}${i}`} to={l.to} className="text-terminal-green hover:underline">
            {l.label}
          </Link>
        ) : (
          m[0]
        ),
      )
    }
    last = re.lastIndex
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}
