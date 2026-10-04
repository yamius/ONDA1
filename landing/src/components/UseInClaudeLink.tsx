/**
 * Small secondary link to the ONDA Life connector in the Claude Connectors Directory.
 * Sits next to / under the App Store CTA (never instead of it). Fires the GA4 event
 * `ai_connector_click` { platform: 'claude', page_path } through GTM.
 * ChatGPT gets its own link once the app is out of review.
 */
import { useLocation } from 'react-router-dom'
import type { Lang } from '../i18n'
import { gtmAiConnectorClick } from '../lib/gtm'

export const CLAUDE_DIRECTORY_URL = 'https://claude.ai/directory/connectors/onda-life'

type Variant = 'general' | 'hrv'

const COPY: Record<Variant, Partial<Record<Lang, string>> & { en: string }> = {
  general: {
    en: 'Use ONDA in Claude →',
    es: 'Usa ONDA en Claude →',
    ru: 'ONDA в Claude →',
    uk: 'ONDA у Claude →',
    zh: '在 Claude 中使用 ONDA →',
    de: 'ONDA in Claude nutzen →',
    fr: 'Utiliser ONDA dans Claude →',
    it: 'Usa ONDA in Claude →',
    nl: 'Gebruik ONDA in Claude →',
    ja: 'Claude で ONDA を使う →',
    pl: 'Używaj ONDA w Claude →',
    pt: 'Use o ONDA no Claude →',
  },
  hrv: {
    en: 'Check your HRV right in Claude →',
    es: 'Consulta tu VFC directamente en Claude →',
    ru: 'Проверьте ВСР прямо в Claude →',
    uk: 'Перевірте ВСР просто в Claude →',
    zh: '直接在 Claude 中查看你的 HRV →',
    de: 'Prüfe deine HRV direkt in Claude →',
    fr: 'Vérifiez votre VFC directement dans Claude →',
    it: 'Controlla la tua HRV direttamente in Claude →',
    nl: 'Check je HRV direct in Claude →',
    ja: 'Claude で HRV をそのままチェック →',
    pl: 'Sprawdź swoje HRV bezpośrednio w Claude →',
    pt: 'Confira sua VFC direto no Claude →',
  },
}

export function UseInClaudeLink({ lang, variant = 'general', className = '' }: { lang: Lang; variant?: Variant; className?: string }) {
  const { pathname } = useLocation()
  const text = COPY[variant][lang] ?? COPY[variant].en
  return (
    <a
      href={CLAUDE_DIRECTORY_URL}
      target="_blank"
      rel="noopener"
      onClick={() => gtmAiConnectorClick(pathname, 'claude')}
      className={`inline-block font-mono text-xs text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-terminal-green ${className}`}
    >
      {text}
    </a>
  )
}
