/**
 * Cookie-consent banner copy (task 105). All site languages; missing keys fall back to EN.
 */
export interface ConsentCopy {
  text: string
  privacy: string
  accept: string
  reject: string
  settings: string
}

export const CONSENT_COPY: Partial<Record<string, ConsentCopy>> & { en: ConsentCopy } = {
  en: {
    text: 'We use cookies for analytics (Google Analytics, PostHog) and to measure our ads (Meta, Reddit). They run only if you accept. You can change your choice anytime via "Cookie settings" at the bottom of the page.',
    privacy: 'Privacy Policy',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Cookie settings',
  },
  ru: {
    text: 'Мы используем файлы cookie для аналитики (Google Analytics, PostHog) и для измерения эффективности рекламы (Meta, Reddit). Они работают, только если вы их примете. Вы можете изменить свой выбор в любое время через «Настройки cookie» внизу страницы.',
    privacy: 'Политика конфиденциальности',
    accept: 'Принять',
    reject: 'Отклонить',
    settings: 'Настройки cookie',
  },
  uk: {
    text: 'Ми використовуємо файли cookie для аналітики (Google Analytics, PostHog) і для вимірювання ефективності реклами (Meta, Reddit). Вони працюють, лише якщо ви їх приймете. Ви можете будь-коли змінити свій вибір через «Налаштування cookie» внизу сторінки.',
    privacy: 'Політика конфіденційності',
    accept: 'Прийняти',
    reject: 'Відхилити',
    settings: 'Налаштування cookie',
  },
  de: {
    text: 'Wir verwenden Cookies für Analysen (Google Analytics, PostHog) und zur Messung unserer Werbung (Meta, Reddit). Sie werden nur aktiv, wenn du zustimmst. Du kannst deine Auswahl jederzeit über „Cookie-Einstellungen“ unten auf der Seite ändern.',
    privacy: 'Datenschutzerklärung',
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
    settings: 'Cookie-Einstellungen',
  },
  fr: {
    text: 'Nous utilisons des cookies pour l’analyse (Google Analytics, PostHog) et pour mesurer nos publicités (Meta, Reddit). Ils ne sont activés que si vous acceptez. Vous pouvez modifier votre choix à tout moment via « Paramètres des cookies » en bas de la page.',
    privacy: 'Politique de confidentialité',
    accept: 'Accepter',
    reject: 'Refuser',
    settings: 'Paramètres des cookies',
  },
  es: {
    text: 'Usamos cookies para analítica (Google Analytics, PostHog) y para medir nuestros anuncios (Meta, Reddit). Solo se activan si las aceptas. Puedes cambiar tu elección en cualquier momento en «Configuración de cookies», al pie de la página.',
    privacy: 'Política de privacidad',
    accept: 'Aceptar',
    reject: 'Rechazar',
    settings: 'Configuración de cookies',
  },
  it: {
    text: 'Usiamo cookie per l’analisi (Google Analytics, PostHog) e per misurare i nostri annunci (Meta, Reddit). Si attivano solo se accetti. Puoi cambiare la tua scelta in qualsiasi momento da «Impostazioni cookie» in fondo alla pagina.',
    privacy: 'Informativa sulla privacy',
    accept: 'Accetta',
    reject: 'Rifiuta',
    settings: 'Impostazioni cookie',
  },
  pt: {
    text: 'Usamos cookies para análise (Google Analytics, PostHog) e para medir os nossos anúncios (Meta, Reddit). Só funcionam se aceitar. Pode alterar a sua escolha a qualquer momento em «Definições de cookies», no fundo da página.',
    privacy: 'Política de Privacidade',
    accept: 'Aceitar',
    reject: 'Rejeitar',
    settings: 'Definições de cookies',
  },
  nl: {
    text: 'We gebruiken cookies voor analyse (Google Analytics, PostHog) en om onze advertenties te meten (Meta, Reddit). Ze werken alleen als je ze accepteert. Je kunt je keuze altijd wijzigen via „Cookie-instellingen” onderaan de pagina.',
    privacy: 'Privacybeleid',
    accept: 'Accepteren',
    reject: 'Weigeren',
    settings: 'Cookie-instellingen',
  },
  pl: {
    text: 'Używamy plików cookie do analityki (Google Analytics, PostHog) i do pomiaru naszych reklam (Meta, Reddit). Działają tylko, jeśli je zaakceptujesz. Swój wybór możesz zmienić w każdej chwili w „Ustawieniach cookie” na dole strony.',
    privacy: 'Polityka prywatności',
    accept: 'Akceptuj',
    reject: 'Odrzuć',
    settings: 'Ustawienia cookie',
  },
  ja: {
    text: '当サイトでは、分析（Google Analytics、PostHog）および広告効果の測定（Meta、Reddit）のためにCookieを使用します。これらは同意いただいた場合にのみ動作します。選択はページ下部の「Cookie設定」からいつでも変更できます。',
    privacy: 'プライバシーポリシー',
    accept: '同意する',
    reject: '拒否する',
    settings: 'Cookie設定',
  },
  zh: {
    text: '我们使用 Cookie 进行分析（Google Analytics、PostHog）并衡量广告效果（Meta、Reddit）。仅在您接受后才会启用。您可随时通过页面底部的“Cookie 设置”更改选择。',
    privacy: '隐私政策',
    accept: '接受',
    reject: '拒绝',
    settings: 'Cookie 设置',
  },
}

export function consentCopy(lang: string): ConsentCopy {
  return CONSENT_COPY[lang] ?? CONSENT_COPY.en
}
