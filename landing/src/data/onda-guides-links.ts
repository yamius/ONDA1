/**
 * Short inbound links to ONDA's own guides (/compare/<slug>) from always-localized pages
 * (/<lang>/tools), so a localized guide is never an orphan. Titles mirror
 * public/locales/<lang>/onda-guides.json#roundups.<slug>.title — keep in sync.
 * The link is shown only where langHref() resolves to a prerendered page.
 */
export const ONDA_GUIDE_LINKS: { slug: string; title: Record<string, string> }[] = [
  {
    slug: 'apps-combining-breathing-hrv-realtime-feedback',
    title: {
      "en": "Best Apps That Combine Breathing, HRV & Real-Time Feedback",
      "es": "Mejores apps de respiración, HRV y feedback en directo",
      "ru": "Приложения: дыхание, HRV и обратная связь",
      "uk": "Застосунки: дихання, HRV і зворотний зв’язок",
      "zh": "结合呼吸、HRV 与实时反馈的最佳应用",
      "de": "Apps für Atmung, HRV & Echtzeit-Feedback",
      "fr": "Meilleures applis respiration, HRV et retour en direct",
      "it": "Migliori app per respirazione, HRV e feedback dal vivo",
      "nl": "Beste apps voor ademhaling, HRV en live feedback",
      "ja": "呼吸・HRV・リアルタイムフィードバックを統合したアプリ",
      "pl": "Aplikacje łączące oddech, HRV i feedback na żywo",
      "pt": "Melhores apps de respiração, HRV e feedback ao vivo"
    },
  },
]
