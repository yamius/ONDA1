/**
 * Maps protocol names (from PROTOCOL_XX > Name) to base IDs for The Stack.
 * Add new entries when publishing articles with new protocols.
 * Match is case-insensitive; first match wins.
 */
export const PROTOCOL_NAME_TO_ID = [
  // Cacao & Stem Cells
  { pattern: /cellular ignition|decaf cacao|cacao matrix/i, id: 'cellular-ignition' },
  { pattern: /micro.circulation|zone 1|low.intensity movement/i, id: 'micro-circulation-loop' },
  { pattern: /recovery firewall|red light|660nm|mitochondria.*atp/i, id: 'recovery-firewall' },
  // Cognitive / Circadian
  { pattern: /neural circuit|digital sunset|blue light.*block/i, id: 'blue-firewall' },
  { pattern: /photic anchor|10.?000.*lux|morning.*light/i, id: 'photonic-anchor' },
  { pattern: /lipid fuel|omega.?3|structural antioxidant/i, id: 'glucose-buffer' },
  { pattern: /neural co.?regulation|social calibration|in.?person/i, id: 'analog-morning' },
  // Add more as needed
]

export function matchProtocolToId(nameAndContext) {
  const text = String(nameAndContext || '').toLowerCase()
  for (const { pattern, id } of PROTOCOL_NAME_TO_ID) {
    if (pattern.test(text)) return id
  }
  return null
}

/** Article slug -> short prefix for protocol IDs (must match protocol-ids.ts) */
export const SLUG_TO_SHORT = {
  'cacao-stem-cells': 'cacao',
  'vagus-nerve-master-key': 'vagus',
  'breathwork-command-line-interface': 'breathwork',
  'cognitive-architecture': 'cognitive',
  // Add more as needed; fallback: first segment of slug
}

function slugToShort(slug) {
  return SLUG_TO_SHORT[slug] || (slug && slug.split('-')[0]) || 'md'
}

export function extractProtocolsFromContent(content, articleSlug) {
  const baseIds = []
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^PROTOCOL[_\s]\d+/i.test(line.trim())) {
      const match = line.match(/PROTOCOL[_\s]\d+\s*[>:]\s*(.+)/i)
      const name = match ? match[1].trim() : line
      const nextLines = lines.slice(i + 1, i + 8).join(' ')
      const baseId = matchProtocolToId(name + ' ' + nextLines)
      if (baseId) baseIds.push(baseId)
    }
  }
  const short = slugToShort(articleSlug)
  return baseIds.map((baseId) => `${short}-${baseId}`)
}
