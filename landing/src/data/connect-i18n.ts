/**
 * Task 073 step 2 — localized /<lang>/connect hub + header/menu label.
 * Device pages stay EN-only; the localized hub links to them with an
 * "(in English)" note. EN hub text lives in connect-devices.ts; only the nav
 * labels and the top-of-hub line are used for EN from here.
 */
import type { ConnectStatus } from './connect-devices'

export interface ConnectI18n {
  title: string
  description: string
  h1: string
  eyebrow: string
  intro: string
  pick: string
  thDevice: string
  thHrv: string
  thStatus: string
  inEnglish: string
  status: Record<ConnectStatus, string>
  /** EN hrvType string → localized */
  hrv: Record<string, string>
}

const H_NIGHT = 'Night-time average (during sleep)'
const H_WHOOP = 'RMSSD, in milliseconds (in Recovery)'
const H_POLAR = 'Night-time, first ~4 h of sleep (formula not confirmed)'
const H_GARMIN = 'Night-time, vs your personal range (formula not confirmed)'
const H_NCO = 'Not confirmed from official pages'
const H_NC = 'Not confirmed'
const H_APPLE = 'SDNN (Apple Health)'

const hrv = (a: string, b: string, c: string, d: string, e: string, f: string, g: string) => ({
  [H_NIGHT]: a, [H_WHOOP]: b, [H_POLAR]: c, [H_GARMIN]: d, [H_NCO]: e, [H_NC]: f, [H_APPLE]: g,
})

export const CONNECT_I18N: Record<string, ConnectI18n> = {
  en: {
    title: '', description: '', h1: '', eyebrow: 'YOUR DEVICE',
    intro: 'Your device already measures a lot. We help you read it honestly — your own baseline, not someone else’s average.',
    pick: '', thDevice: 'Device', thHrv: 'HRV shown', thStatus: 'Connection to ONDA', inEnglish: '',
    status: { app: 'Works with the ONDA app now', planned: 'Direct connection planned', reviewing: 'Under review', closed: 'Developer access closed', 'no-api': 'No public web API' },
    hrv: hrv(H_NIGHT, H_WHOOP, H_POLAR, H_GARMIN, H_NCO, H_NC, H_APPLE),
  },
  ru: {
    title: 'Как читать HRV вашего устройства | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit и Apple Watch: какой HRV показывает каждое устройство и можно ли подключить его к ONDA.',
    h1: 'Как читать HRV вашего устройства', eyebrow: 'ВАШЕ УСТРОЙСТВО',
    intro: 'Ваше устройство уже многое измеряет. Мы помогаем читать эти данные честно — относительно вашей собственной нормы, а не чужого среднего.',
    pick: 'Выберите устройство: какой HRV (вариабельность сердечного ритма) оно показывает и можно ли подключить его к ONDA. Страницы устройств пока на английском.',
    thDevice: 'Устройство', thHrv: 'Какой HRV', thStatus: 'Подключение к ONDA', inEnglish: '(на английском)',
    status: { app: 'Уже работает с приложением ONDA', planned: 'Прямое подключение в планах', reviewing: 'На проверке', closed: 'Доступ для разработчиков закрыт', 'no-api': 'Нет публичного веб-API' },
    hrv: hrv('Среднее за ночь (во сне)', 'RMSSD, в миллисекундах (в Recovery)', 'Ночью, первые ~4 ч сна (формула не подтверждена)', 'Ночью, относительно вашего диапазона (формула не подтверждена)', 'Не подтверждено официальными страницами', 'Не подтверждено', 'SDNN (Apple Health)'),
  },
  uk: {
    title: 'Як читати HRV вашого пристрою | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit і Apple Watch: який HRV показує кожен пристрій і чи можна підключити його до ONDA.',
    h1: 'Як читати HRV вашого пристрою', eyebrow: 'ВАШ ПРИСТРІЙ',
    intro: 'Ваш пристрій уже багато що вимірює. Ми допомагаємо читати ці дані чесно — відносно вашої власної норми, а не чужого середнього.',
    pick: 'Оберіть пристрій: який HRV (варіабельність серцевого ритму) він показує і чи можна підключити його до ONDA. Сторінки пристроїв поки англійською.',
    thDevice: 'Пристрій', thHrv: 'Який HRV', thStatus: 'Підключення до ONDA', inEnglish: '(англійською)',
    status: { app: 'Вже працює з застосунком ONDA', planned: 'Пряме підключення в планах', reviewing: 'На перевірці', closed: 'Доступ для розробників закрито', 'no-api': 'Немає публічного веб-API' },
    hrv: hrv('Середнє за ніч (уві сні)', 'RMSSD, у мілісекундах (у Recovery)', 'Вночі, перші ~4 год сну (формула не підтверджена)', 'Вночі, відносно вашого діапазону (формула не підтверджена)', 'Не підтверджено офіційними сторінками', 'Не підтверджено', 'SDNN (Apple Health)'),
  },
  es: {
    title: 'Cómo leer la HRV de tu dispositivo | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit y Apple Watch: qué HRV muestra cada uno y si puede conectarse a ONDA.',
    h1: 'Cómo leer la HRV de tu dispositivo', eyebrow: 'TU DISPOSITIVO',
    intro: 'Tu dispositivo ya mide mucho. Te ayudamos a leerlo con honestidad: con tu propia línea base, no con el promedio de otra persona.',
    pick: 'Elige tu dispositivo para ver qué HRV (variabilidad de la frecuencia cardíaca, VFC) muestra y si puede conectarse a ONDA. Las páginas de cada dispositivo están en inglés.',
    thDevice: 'Dispositivo', thHrv: 'HRV que muestra', thStatus: 'Conexión con ONDA', inEnglish: '(en inglés)',
    status: { app: 'Ya funciona con la app ONDA', planned: 'Conexión directa prevista', reviewing: 'En revisión', closed: 'Acceso para desarrolladores cerrado', 'no-api': 'Sin API web pública' },
    hrv: hrv('Promedio nocturno (durante el sueño)', 'RMSSD, en milisegundos (en Recovery)', 'Nocturna, primeras ~4 h de sueño (fórmula no confirmada)', 'Nocturna, frente a tu rango personal (fórmula no confirmada)', 'No confirmado en páginas oficiales', 'No confirmado', 'SDNN (Apple Health)'),
  },
  pt: {
    title: 'Como ler a HRV do seu dispositivo | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit e Apple Watch: qual HRV cada um mostra e se pode se conectar ao ONDA.',
    h1: 'Como ler a HRV do seu dispositivo', eyebrow: 'SEU DISPOSITIVO',
    intro: 'Seu dispositivo já mede muita coisa. Ajudamos você a lê-lo com honestidade — com a sua própria linha de base, não com a média de outra pessoa.',
    pick: 'Escolha seu dispositivo para ver qual HRV (variabilidade da frequência cardíaca, VFC) ele mostra e se pode se conectar ao ONDA. As páginas dos dispositivos estão em inglês.',
    thDevice: 'Dispositivo', thHrv: 'HRV exibida', thStatus: 'Conexão com o ONDA', inEnglish: '(em inglês)',
    status: { app: 'Já funciona com o app ONDA', planned: 'Conexão direta planejada', reviewing: 'Em análise', closed: 'Acesso para desenvolvedores fechado', 'no-api': 'Sem API web pública' },
    hrv: hrv('Média noturna (durante o sono)', 'RMSSD, em milissegundos (no Recovery)', 'Noturna, primeiras ~4 h de sono (fórmula não confirmada)', 'Noturna, em relação à sua faixa pessoal (fórmula não confirmada)', 'Não confirmado em páginas oficiais', 'Não confirmado', 'SDNN (Apple Health)'),
  },
  fr: {
    title: 'Lire la HRV de votre appareil | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit et Apple Watch : quelle HRV chaque appareil affiche et s’il peut se connecter à ONDA.',
    h1: 'Comment lire la HRV de votre appareil', eyebrow: 'VOTRE APPAREIL',
    intro: 'Votre appareil mesure déjà beaucoup de choses. Nous vous aidons à le lire honnêtement — par rapport à votre propre référence, pas à la moyenne de quelqu’un d’autre.',
    pick: 'Choisissez votre appareil pour voir quelle HRV (variabilité de la fréquence cardiaque, VFC) il affiche et s’il peut se connecter à ONDA. Les pages des appareils sont en anglais.',
    thDevice: 'Appareil', thHrv: 'HRV affichée', thStatus: 'Connexion à ONDA', inEnglish: '(en anglais)',
    status: { app: 'Fonctionne déjà avec l’app ONDA', planned: 'Connexion directe prévue', reviewing: 'En cours d’examen', closed: 'Accès développeurs fermé', 'no-api': 'Pas d’API web publique' },
    hrv: hrv('Moyenne nocturne (pendant le sommeil)', 'RMSSD, en millisecondes (dans Recovery)', 'Nocturne, ~4 premières h de sommeil (formule non confirmée)', 'Nocturne, par rapport à votre plage personnelle (formule non confirmée)', 'Non confirmé par les pages officielles', 'Non confirmé', 'SDNN (Apple Health)'),
  },
  de: {
    title: 'So liest du die HRV deines Geräts | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit und Apple Watch: welche HRV jedes Gerät zeigt und ob es sich mit ONDA verbinden lässt.',
    h1: 'So liest du die HRV deines Geräts', eyebrow: 'DEIN GERÄT',
    intro: 'Dein Gerät misst bereits eine Menge. Wir helfen dir, es ehrlich zu lesen — mit deiner eigenen Baseline, nicht mit dem Durchschnitt anderer.',
    pick: 'Wähle dein Gerät, um zu sehen, welche HRV (Herzratenvariabilität) es zeigt und ob es sich mit ONDA verbinden lässt. Die Geräteseiten sind auf Englisch.',
    thDevice: 'Gerät', thHrv: 'Angezeigte HRV', thStatus: 'Verbindung mit ONDA', inEnglish: '(auf Englisch)',
    status: { app: 'Funktioniert schon mit der ONDA-App', planned: 'Direkte Verbindung geplant', reviewing: 'In Prüfung', closed: 'Entwicklerzugang geschlossen', 'no-api': 'Keine öffentliche Web-API' },
    hrv: hrv('Nachtdurchschnitt (im Schlaf)', 'RMSSD, in Millisekunden (in Recovery)', 'Nachts, erste ~4 Std. Schlaf (Formel nicht bestätigt)', 'Nachts, im Vergleich zu deinem persönlichen Bereich (Formel nicht bestätigt)', 'Auf offiziellen Seiten nicht bestätigt', 'Nicht bestätigt', 'SDNN (Apple Health)'),
  },
  it: {
    title: 'Come leggere l’HRV del tuo dispositivo | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit e Apple Watch: quale HRV mostra ciascuno e se può collegarsi a ONDA.',
    h1: 'Come leggere l’HRV del tuo dispositivo', eyebrow: 'IL TUO DISPOSITIVO',
    intro: 'Il tuo dispositivo misura già molto. Ti aiutiamo a leggerlo con onestà: con la tua baseline personale, non con la media di qualcun altro.',
    pick: 'Scegli il tuo dispositivo per vedere quale HRV (variabilità della frequenza cardiaca) mostra e se può collegarsi a ONDA. Le pagine dei dispositivi sono in inglese.',
    thDevice: 'Dispositivo', thHrv: 'HRV mostrata', thStatus: 'Collegamento a ONDA', inEnglish: '(in inglese)',
    status: { app: 'Funziona già con l’app ONDA', planned: 'Collegamento diretto previsto', reviewing: 'In verifica', closed: 'Accesso sviluppatori chiuso', 'no-api': 'Nessuna API web pubblica' },
    hrv: hrv('Media notturna (durante il sonno)', 'RMSSD, in millisecondi (in Recovery)', 'Notturna, prime ~4 h di sonno (formula non confermata)', 'Notturna, rispetto al tuo intervallo personale (formula non confermata)', 'Non confermato dalle pagine ufficiali', 'Non confermato', 'SDNN (Apple Health)'),
  },
  nl: {
    title: 'Zo lees je de HRV van je apparaat | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit en Apple Watch: welke HRV elk apparaat toont en of het met ONDA kan koppelen.',
    h1: 'Zo lees je de HRV van je apparaat', eyebrow: 'JOUW APPARAAT',
    intro: 'Je apparaat meet al veel. Wij helpen je het eerlijk te lezen — met je eigen baseline, niet met het gemiddelde van iemand anders.',
    pick: 'Kies je apparaat om te zien welke HRV (hartslagvariabiliteit) het toont en of het met ONDA kan koppelen. De apparaatpagina’s zijn in het Engels.',
    thDevice: 'Apparaat', thHrv: 'Getoonde HRV', thStatus: 'Koppeling met ONDA', inEnglish: '(in het Engels)',
    status: { app: 'Werkt nu al met de ONDA-app', planned: 'Directe koppeling gepland', reviewing: 'Wordt beoordeeld', closed: 'Ontwikkelaarstoegang gesloten', 'no-api': 'Geen openbare web-API' },
    hrv: hrv('Nachtgemiddelde (tijdens de slaap)', 'RMSSD, in milliseconden (in Recovery)', 'ʼs Nachts, eerste ~4 uur slaap (formule niet bevestigd)', 'ʼs Nachts, ten opzichte van je persoonlijke bereik (formule niet bevestigd)', 'Niet bevestigd op officiële pagina’s', 'Niet bevestigd', 'SDNN (Apple Health)'),
  },
  pl: {
    title: 'Jak czytać HRV z Twojego urządzenia | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit i Apple Watch: jakie HRV pokazuje każde urządzenie i czy można je połączyć z ONDA.',
    h1: 'Jak czytać HRV z Twojego urządzenia', eyebrow: 'TWOJE URZĄDZENIE',
    intro: 'Twoje urządzenie już dużo mierzy. Pomagamy czytać te dane uczciwie — względem Twojej własnej normy, a nie cudzej średniej.',
    pick: 'Wybierz urządzenie, aby zobaczyć, jakie HRV (zmienność rytmu serca) pokazuje i czy można je połączyć z ONDA. Strony urządzeń są po angielsku.',
    thDevice: 'Urządzenie', thHrv: 'Pokazywane HRV', thStatus: 'Połączenie z ONDA', inEnglish: '(po angielsku)',
    status: { app: 'Już działa z aplikacją ONDA', planned: 'Bezpośrednie połączenie w planach', reviewing: 'W trakcie weryfikacji', closed: 'Dostęp dla deweloperów zamknięty', 'no-api': 'Brak publicznego web API' },
    hrv: hrv('Średnia nocna (podczas snu)', 'RMSSD, w milisekundach (w Recovery)', 'Nocą, pierwsze ~4 h snu (wzór niepotwierdzony)', 'Nocą, względem Twojego zakresu (wzór niepotwierdzony)', 'Niepotwierdzone na oficjalnych stronach', 'Niepotwierdzone', 'SDNN (Apple Health)'),
  },
  ja: {
    title: 'デバイスのHRVの読み方 | ONDA Life',
    description: 'Oura、WHOOP、Polar、Garmin、Fitbit、Samsung、Withings、Ultrahuman、RingConn、Amazfit、Apple Watch：各デバイスが表示するHRVの種類と、ONDAに接続できるかどうか。',
    h1: 'あなたのデバイスのHRVの読み方', eyebrow: 'あなたのデバイス',
    intro: 'あなたのデバイスはすでに多くを測っています。私たちはそれを正直に読む手助けをします——他人の平均ではなく、あなた自身のベースラインで。',
    pick: 'デバイスを選ぶと、表示されるHRV（心拍変動）の種類とONDAに接続できるかがわかります。各デバイスのページは英語です。',
    thDevice: 'デバイス', thHrv: '表示されるHRV', thStatus: 'ONDAとの接続', inEnglish: '（英語）',
    status: { app: 'ONDAアプリで利用可能', planned: '直接接続を予定', reviewing: '確認中', closed: '開発者アクセスは停止中', 'no-api': '公開Web APIなし' },
    hrv: hrv('夜間平均（睡眠中）', 'RMSSD、ミリ秒（Recovery内）', '夜間、睡眠の最初の約4時間（計算式は未確認）', '夜間、あなたの個人範囲との比較（計算式は未確認）', '公式ページでは未確認', '未確認', 'SDNN（Apple Health）'),
  },
  zh: {
    title: '如何读懂你设备的HRV | ONDA Life',
    description: 'Oura、WHOOP、Polar、Garmin、Fitbit、Samsung、Withings、Ultrahuman、RingConn、Amazfit 和 Apple Watch：每款设备显示哪种HRV，以及能否连接 ONDA。',
    h1: '如何读懂你设备的HRV', eyebrow: '你的设备',
    intro: '你的设备已经在测量很多数据。我们帮你诚实地解读它——对照你自己的基线，而不是别人的平均值。',
    pick: '选择你的设备，查看它显示哪种HRV（心率变异性）以及能否连接 ONDA。各设备页面为英文。',
    thDevice: '设备', thHrv: '显示的HRV', thStatus: '与 ONDA 的连接', inEnglish: '（英文）',
    status: { app: '已可用于 ONDA 应用', planned: '计划直接连接', reviewing: '审核中', closed: '开发者通道已关闭', 'no-api': '无公开 Web API' },
    hrv: hrv('夜间平均值（睡眠期间）', 'RMSSD，单位毫秒（Recovery 中）', '夜间，睡眠前约4小时（公式未确认）', '夜间，与你的个人范围比较（公式未确认）', '官方页面未确认', '未确认', 'SDNN（Apple Health）'),
  },
}

export function connectI18n(lang: string): ConnectI18n {
  return CONNECT_I18N[lang] ?? CONNECT_I18N.en
}
