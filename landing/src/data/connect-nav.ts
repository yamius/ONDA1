/** Header/menu labels for the /connect hub (task 073 step 2). Kept tiny: imported by Layout (entry chunk). */
export const CONNECT_NAV: Record<string, [string, string]> = {
  en: ['Connect your device', 'Your device'],
  ru: ['Подключить устройство', 'Ваше устройство'],
  uk: ['Підключити пристрій', 'Ваш пристрій'],
  es: ['Conecta tu dispositivo', 'Tu dispositivo'],
  pt: ['Conectar dispositivo', 'Seu dispositivo'],
  fr: ['Connecter un appareil', 'Votre appareil'],
  de: ['Gerät verbinden', 'Dein Gerät'],
  it: ['Collega il dispositivo', 'Il tuo dispositivo'],
  nl: ['Apparaat koppelen', 'Jouw apparaat'],
  pl: ['Połącz urządzenie', 'Twoje urządzenie'],
  ja: ['デバイスを接続', 'あなたのデバイス'],
  zh: ['连接设备', '你的设备'],
}

export function connectNav(lang: string): { nav: string; short: string } {
  const [nav, short] = CONNECT_NAV[lang] ?? CONNECT_NAV.en
  return { nav, short }
}
