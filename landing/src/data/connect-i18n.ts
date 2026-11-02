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
  /** B8 column header + per-device text (071 2c) */
  thWindow: string
  window: Record<string, string>
  inEnglish: string
  status: Record<ConnectStatus, string>
  /** EN hrvType string → localized */
  hrv: Record<string, string>
}

const H_NIGHT = 'Night-time average (during sleep)'
const H_WHOOP = 'RMSSD, in milliseconds (in Recovery)'
const H_POLAR = 'RMSSD, first ~4 h of sleep (per Polar Help)'
const H_GARMIN = 'RMSSD, night-time, vs your personal range'
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
    thWindow: 'Window / metric per maker docs', window: {},
    status: { app: 'Works with the ONDA app now', planned: 'Possible in the future', reviewing: 'Under review', closed: 'Developer access closed', 'no-api': 'No public web API' },
    hrv: hrv(H_NIGHT, H_WHOOP, H_POLAR, H_GARMIN, H_NCO, H_NC, H_APPLE),
  },
  ru: {
    title: 'Как читать HRV вашего устройства | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit и Apple Watch: какой HRV показывает каждое устройство и можно ли подключить его к ONDA.',
    h1: 'Как читать HRV вашего устройства', eyebrow: 'ВАШЕ УСТРОЙСТВО',
    intro: 'Ваше устройство уже многое измеряет. Мы помогаем читать эти данные честно — относительно вашей собственной нормы, а не чужого среднего.',
    pick: 'Выберите устройство: какой HRV (вариабельность сердечного ритма) оно показывает и можно ли подключить его к ONDA.',
    thDevice: 'Устройство', thHrv: 'Какой HRV', thStatus: 'Подключение к ONDA', inEnglish: '(на английском)',
    status: { app: 'Уже работает с приложением ONDA', planned: 'Возможно в будущем', reviewing: 'На проверке', closed: 'Доступ для разработчиков закрыт', 'no-api': 'Нет публичного веб-API' },
    thWindow: 'Окно / показатель по документации производителя',
    window: { 'oura': 'Во время сна, замеры в течение ночи; показатель не назван', 'whoop': 'RMSSD, во время самого глубокого сна', 'polar': 'RMSSD, примерно первые часы сна, в сравнении с вашим обычным уровнем', 'garmin': 'RMSSD, за ночь, в сравнении с вашим личным базовым уровнем', 'fitbit': 'Ночью; показатель не назван', 'samsung': 'Не раскрыто на страницах справки Samsung', 'withings': 'Во время сна, в мс; показатель не назван', 'ultrahuman': 'За ночь, в сравнении с вашим собственным диапазоном; показатель не назван (страница продукта)', 'ringconn': 'Ещё не проверено', 'amazfit': 'Ещё не проверено', 'apple-watch': 'SDNN, фоновые замеры в разное время дня и ночи; не специальное ночное измерение' },
    hrv: hrv('Среднее за ночь (во сне)', 'RMSSD, в миллисекундах (в Recovery)', 'RMSSD, первые ~4 h сна (по справке Polar)', 'RMSSD, ночью, относительно вашего диапазона', 'Не подтверждено официальными страницами', 'Не подтверждено', 'SDNN (Apple Health)'),
  },
  uk: {
    title: 'Як читати HRV вашого пристрою | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit і Apple Watch: який HRV показує кожен пристрій і чи можна підключити його до ONDA.',
    h1: 'Як читати HRV вашого пристрою', eyebrow: 'ВАШ ПРИСТРІЙ',
    intro: 'Ваш пристрій уже багато що вимірює. Ми допомагаємо читати ці дані чесно — відносно вашої власної норми, а не чужого середнього.',
    pick: 'Оберіть пристрій: який HRV (варіабельність серцевого ритму) він показує і чи можна підключити його до ONDA.',
    thDevice: 'Пристрій', thHrv: 'Який HRV', thStatus: 'Підключення до ONDA', inEnglish: '(англійською)',
    status: { app: 'Вже працює з застосунком ONDA', planned: 'Можливо в майбутньому', reviewing: 'На перевірці', closed: 'Доступ для розробників закрито', 'no-api': 'Немає публічного веб-API' },
    thWindow: 'Вікно / метрика за документацією виробника',
    window: { 'oura': 'Під час сну, вимірювання протягом ночі; метрику не названо', 'whoop': 'RMSSD, під час найглибшого сну', 'polar': 'RMSSD, приблизно перші години сну, порівняно з вашим звичним рівнем', 'garmin': 'RMSSD, за ніч, порівняно з вашим особистим базовим рівнем', 'fitbit': 'Уночі; метрику не названо', 'samsung': 'Не розкрито на сторінках довідки Samsung', 'withings': 'Під час сну, у мс; метрику не названо', 'ultrahuman': 'За ніч, порівняно з вашим власним діапазоном; метрику не названо (сторінка продукту)', 'ringconn': 'Ще не перевірено', 'amazfit': 'Ще не перевірено', 'apple-watch': 'SDNN, фонові вимірювання в різний час дня і ночі; не спеціальне нічне вимірювання' },
    hrv: hrv('Середнє за ніч (уві сні)', 'RMSSD, у мілісекундах (у Recovery)', 'RMSSD, перші ~4 h сну (за довідкою Polar)', 'RMSSD, вночі, відносно вашого діапазону', 'Не підтверджено офіційними сторінками', 'Не підтверджено', 'SDNN (Apple Health)'),
  },
  es: {
    title: 'Cómo leer la HRV de tu dispositivo | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit y Apple Watch: qué HRV muestra cada uno y si puede conectarse a ONDA.',
    h1: 'Cómo leer la HRV de tu dispositivo', eyebrow: 'TU DISPOSITIVO',
    intro: 'Tu dispositivo ya mide mucho. Te ayudamos a leerlo con honestidad: con tu propia línea base, no con el promedio de otra persona.',
    pick: 'Elige tu dispositivo para ver qué HRV (variabilidad de la frecuencia cardíaca, VFC) muestra y si puede conectarse a ONDA.',
    thDevice: 'Dispositivo', thHrv: 'HRV que muestra', thStatus: 'Conexión con ONDA', inEnglish: '(en inglés)',
    status: { app: 'Ya funciona con la app ONDA', planned: 'Posible en el futuro', reviewing: 'En revisión', closed: 'Acceso para desarrolladores cerrado', 'no-api': 'Sin API web pública' },
    thWindow: 'Ventana / métrica según la documentación del fabricante',
    window: { 'oura': 'Durante el sueño, muestreada a lo largo de la noche; métrica no especificada', 'whoop': 'RMSSD, durante el sueño más profundo', 'polar': 'RMSSD, aproximadamente las primeras horas de sueño, frente a tu nivel habitual', 'garmin': 'RMSSD, durante la noche, frente a tu referencia personal', 'fitbit': 'Nocturna; métrica no especificada', 'samsung': 'No indicada en las páginas de ayuda de Samsung', 'withings': 'Durante el sueño, en ms; métrica no especificada', 'ultrahuman': 'Durante la noche, frente a tu propio rango; métrica no especificada (página del producto)', 'ringconn': 'Aún no revisado', 'amazfit': 'Aún no revisado', 'apple-watch': 'SDNN, lecturas en segundo plano en distintos momentos del día y de la noche; no es una medición nocturna dedicada' },
    hrv: hrv('Promedio nocturno (durante el sueño)', 'RMSSD, en milisegundos (en Recovery)', 'RMSSD, primeras ~4 h de sueño (según la ayuda de Polar)', 'RMSSD, nocturna, frente a tu rango personal', 'No confirmado en páginas oficiales', 'No confirmado', 'SDNN (Apple Health)'),
  },
  pt: {
    title: 'Como ler a HRV do seu dispositivo | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit e Apple Watch: qual HRV cada um mostra e se pode se conectar ao ONDA.',
    h1: 'Como ler a HRV do seu dispositivo', eyebrow: 'SEU DISPOSITIVO',
    intro: 'Seu dispositivo já mede muita coisa. Ajudamos você a lê-lo com honestidade — com a sua própria linha de base, não com a média de outra pessoa.',
    pick: 'Escolha seu dispositivo para ver qual HRV (variabilidade da frequência cardíaca, VFC) ele mostra e se pode se conectar ao ONDA.',
    thDevice: 'Dispositivo', thHrv: 'HRV exibida', thStatus: 'Conexão com o ONDA', inEnglish: '(em inglês)',
    status: { app: 'Já funciona com o app ONDA', planned: 'Possível no futuro', reviewing: 'Em análise', closed: 'Acesso para desenvolvedores fechado', 'no-api': 'Sem API web pública' },
    thWindow: 'Janela / métrica segundo a documentação do fabricante',
    window: { 'oura': 'Durante o sono, amostrada ao longo da noite; métrica não especificada', 'whoop': 'RMSSD, durante o sono mais profundo', 'polar': 'RMSSD, aproximadamente as primeiras horas de sono, em relação ao seu nível habitual', 'garmin': 'RMSSD, durante a noite, em relação à sua linha de base pessoal', 'fitbit': 'Noturna; métrica não especificada', 'samsung': 'Não informada nas páginas de ajuda da Samsung', 'withings': 'Durante o sono, em ms; métrica não especificada', 'ultrahuman': 'Durante a noite, em relação à sua própria faixa; métrica não especificada (página do produto)', 'ringconn': 'Ainda não analisado', 'amazfit': 'Ainda não analisado', 'apple-watch': 'SDNN, leituras em segundo plano em diferentes momentos do dia e da noite; não é uma medição noturna dedicada' },
    hrv: hrv('Média noturna (durante o sono)', 'RMSSD, em milissegundos (no Recovery)', 'RMSSD, primeiras ~4 h de sono (segundo a ajuda do Polar)', 'RMSSD, noturna, em relação à sua faixa pessoal', 'Não confirmado em páginas oficiais', 'Não confirmado', 'SDNN (Apple Health)'),
  },
  fr: {
    title: 'Lire la HRV de votre appareil | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit et Apple Watch : quelle HRV chaque appareil affiche et s’il peut se connecter à ONDA.',
    h1: 'Comment lire la HRV de votre appareil', eyebrow: 'VOTRE APPAREIL',
    intro: 'Votre appareil mesure déjà beaucoup de choses. Nous vous aidons à le lire honnêtement — par rapport à votre propre référence, pas à la moyenne de quelqu’un d’autre.',
    pick: 'Choisissez votre appareil pour voir quelle HRV (variabilité de la fréquence cardiaque, VFC) il affiche et s’il peut se connecter à ONDA.',
    thDevice: 'Appareil', thHrv: 'HRV affichée', thStatus: 'Connexion à ONDA', inEnglish: '(en anglais)',
    status: { app: 'Fonctionne déjà avec l’app ONDA', planned: 'Possible à l’avenir', reviewing: 'En cours d’examen', closed: 'Accès développeurs fermé', 'no-api': 'Pas d’API web publique' },
    thWindow: 'Fenêtre / mesure selon la documentation du fabricant',
    window: { 'oura': 'Pendant le sommeil, échantillonnée tout au long de la nuit ; mesure non précisée', 'whoop': 'RMSSD, pendant le sommeil le plus profond', 'polar': 'RMSSD, environ les premières heures de sommeil, par rapport à votre niveau habituel', 'garmin': 'RMSSD, pendant la nuit, par rapport à votre référence personnelle', 'fitbit': 'Nocturne ; mesure non précisée', 'samsung': 'Non indiqué sur les pages d’aide de Samsung', 'withings': 'Pendant le sommeil, en ms ; mesure non précisée', 'ultrahuman': 'Pendant la nuit, par rapport à votre propre plage ; mesure non précisée (page produit)', 'ringconn': 'Pas encore examiné', 'amazfit': 'Pas encore examiné', 'apple-watch': 'SDNN, mesures en arrière-plan à différents moments du jour et de la nuit ; pas une mesure nocturne dédiée' },
    hrv: hrv('Moyenne nocturne (pendant le sommeil)', 'RMSSD, en millisecondes (dans Recovery)', 'RMSSD, ~4 premières h de sommeil (d’après l’aide Polar)', 'RMSSD, nocturne, par rapport à votre plage personnelle', 'Non confirmé par les pages officielles', 'Non confirmé', 'SDNN (Apple Health)'),
  },
  de: {
    title: 'So liest du die HRV deines Geräts | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit und Apple Watch: welche HRV jedes Gerät zeigt und ob es sich mit ONDA verbinden lässt.',
    h1: 'So liest du die HRV deines Geräts', eyebrow: 'DEIN GERÄT',
    intro: 'Dein Gerät misst bereits eine Menge. Wir helfen dir, es ehrlich zu lesen — mit deiner eigenen Baseline, nicht mit dem Durchschnitt anderer.',
    pick: 'Wähle dein Gerät, um zu sehen, welche HRV (Herzratenvariabilität) es zeigt und ob es sich mit ONDA verbinden lässt.',
    thDevice: 'Gerät', thHrv: 'Angezeigte HRV', thStatus: 'Verbindung mit ONDA', inEnglish: '(auf Englisch)',
    status: { app: 'Funktioniert schon mit der ONDA-App', planned: 'In Zukunft möglich', reviewing: 'In Prüfung', closed: 'Entwicklerzugang geschlossen', 'no-api': 'Keine öffentliche Web-API' },
    thWindow: 'Zeitfenster / Messgröße laut Herstellerdokumentation',
    window: { 'oura': 'Im Schlaf, über die Nacht erfasst; Messgröße nicht genannt', 'whoop': 'RMSSD, während des tiefsten Schlafs', 'polar': 'RMSSD, ungefähr die ersten Stunden des Schlafs, verglichen mit deinem üblichen Niveau', 'garmin': 'RMSSD, über Nacht, verglichen mit deiner persönlichen Baseline', 'fitbit': 'Nachts; Messgröße nicht genannt', 'samsung': 'Auf Samsungs Hilfeseiten nicht angegeben', 'withings': 'Im Schlaf, in ms; Messgröße nicht genannt', 'ultrahuman': 'Über Nacht, verglichen mit deinem eigenen Bereich; Messgröße nicht genannt (Produktseite)', 'ringconn': 'Noch nicht geprüft', 'amazfit': 'Noch nicht geprüft', 'apple-watch': 'SDNN, Hintergrundmessungen zu verschiedenen Tages- und Nachtzeiten; keine eigene nächtliche Messung' },
    hrv: hrv('Nachtdurchschnitt (im Schlaf)', 'RMSSD, in Millisekunden (in Recovery)', 'RMSSD, erste ~4 h des Schlafs (laut Polars Hilfeseiten)', 'RMSSD, nachts, im Vergleich zu deinem persönlichen Bereich', 'Auf offiziellen Seiten nicht bestätigt', 'Nicht bestätigt', 'SDNN (Apple Health)'),
  },
  it: {
    title: 'Come leggere l’HRV del tuo dispositivo | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit e Apple Watch: quale HRV mostra ciascuno e se può collegarsi a ONDA.',
    h1: 'Come leggere l’HRV del tuo dispositivo', eyebrow: 'IL TUO DISPOSITIVO',
    intro: 'Il tuo dispositivo misura già molto. Ti aiutiamo a leggerlo con onestà: con la tua baseline personale, non con la media di qualcun altro.',
    pick: 'Scegli il tuo dispositivo per vedere quale HRV (variabilità della frequenza cardiaca) mostra e se può collegarsi a ONDA.',
    thDevice: 'Dispositivo', thHrv: 'HRV mostrata', thStatus: 'Collegamento a ONDA', inEnglish: '(in inglese)',
    status: { app: 'Funziona già con l’app ONDA', planned: 'Possibile in futuro', reviewing: 'In verifica', closed: 'Accesso sviluppatori chiuso', 'no-api': 'Nessuna API web pubblica' },
    thWindow: 'Finestra / metrica secondo la documentazione del produttore',
    window: { 'oura': 'Durante il sonno, rilevata nel corso della notte; metrica non indicata', 'whoop': 'RMSSD, durante il sonno più profondo', 'polar': 'RMSSD, all\'incirca le prime ore di sonno, rispetto al tuo livello abituale', 'garmin': 'RMSSD, durante la notte, rispetto alla tua baseline personale', 'fitbit': 'Notturna; metrica non indicata', 'samsung': 'Non indicata nelle pagine di aiuto di Samsung', 'withings': 'Durante il sonno, in ms; metrica non indicata', 'ultrahuman': 'Durante la notte, rispetto al tuo intervallo personale; metrica non indicata (pagina prodotto)', 'ringconn': 'Non ancora esaminato', 'amazfit': 'Non ancora esaminato', 'apple-watch': 'SDNN, rilevazioni in background in vari momenti del giorno e della notte; non una misurazione notturna dedicata' },
    hrv: hrv('Media notturna (durante il sonno)', 'RMSSD, in millisecondi (in Recovery)', 'RMSSD, prime ~4 h di sonno (secondo le pagine di aiuto di Polar)', 'RMSSD, notturna, rispetto al tuo intervallo personale', 'Non confermato dalle pagine ufficiali', 'Non confermato', 'SDNN (Apple Health)'),
  },
  nl: {
    title: 'Zo lees je de HRV van je apparaat | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit en Apple Watch: welke HRV elk apparaat toont en of het met ONDA kan koppelen.',
    h1: 'Zo lees je de HRV van je apparaat', eyebrow: 'JOUW APPARAAT',
    intro: 'Je apparaat meet al veel. Wij helpen je het eerlijk te lezen — met je eigen baseline, niet met het gemiddelde van iemand anders.',
    pick: 'Kies je apparaat om te zien welke HRV (hartslagvariabiliteit) het toont en of het met ONDA kan koppelen.',
    thDevice: 'Apparaat', thHrv: 'Getoonde HRV', thStatus: 'Koppeling met ONDA', inEnglish: '(in het Engels)',
    status: { app: 'Werkt nu al met de ONDA-app', planned: 'Mogelijk in de toekomst', reviewing: 'Wordt beoordeeld', closed: 'Ontwikkelaarstoegang gesloten', 'no-api': 'Geen openbare web-API' },
    thWindow: 'Venster / maat volgens fabrikantdocumentatie',
    window: { 'oura': 'Tijdens de slaap, door de nacht heen gemeten; maat niet genoemd', 'whoop': 'RMSSD, tijdens de diepste slaap', 'polar': 'RMSSD, ongeveer de eerste uren slaap, vergeleken met je gebruikelijke niveau', 'garmin': 'RMSSD, \'s nachts, vergeleken met je persoonlijke baseline', 'fitbit': '\'s Nachts; maat niet genoemd', 'samsung': 'Niet vermeld op de hulppagina\'s van Samsung', 'withings': 'Tijdens de slaap, in ms; maat niet genoemd', 'ultrahuman': '\'s Nachts, vergeleken met je eigen bereik; maat niet genoemd (productpagina)', 'ringconn': 'Nog niet beoordeeld', 'amazfit': 'Nog niet beoordeeld', 'apple-watch': 'SDNN, achtergrondmetingen op verschillende momenten van dag en nacht; geen speciale nachtmeting' },
    hrv: hrv('Nachtgemiddelde (tijdens de slaap)', 'RMSSD, in milliseconden (in Recovery)', 'RMSSD, eerste ~4 h slaap (volgens de hulppagina\'s van Polar)', 'RMSSD, ʼs nachts, ten opzichte van je persoonlijke bereik', 'Niet bevestigd op officiële pagina’s', 'Niet bevestigd', 'SDNN (Apple Health)'),
  },
  pl: {
    title: 'Jak czytać HRV z Twojego urządzenia | ONDA Life',
    description: 'Oura, WHOOP, Polar, Garmin, Fitbit, Samsung, Withings, Ultrahuman, RingConn, Amazfit i Apple Watch: jakie HRV pokazuje każde urządzenie i czy można je połączyć z ONDA.',
    h1: 'Jak czytać HRV z Twojego urządzenia', eyebrow: 'TWOJE URZĄDZENIE',
    intro: 'Twoje urządzenie już dużo mierzy. Pomagamy czytać te dane uczciwie — względem Twojej własnej normy, a nie cudzej średniej.',
    pick: 'Wybierz urządzenie, aby zobaczyć, jakie HRV (zmienność rytmu serca) pokazuje i czy można je połączyć z ONDA.',
    thDevice: 'Urządzenie', thHrv: 'Pokazywane HRV', thStatus: 'Połączenie z ONDA', inEnglish: '(po angielsku)',
    status: { app: 'Już działa z aplikacją ONDA', planned: 'Możliwe w przyszłości', reviewing: 'W trakcie weryfikacji', closed: 'Dostęp dla deweloperów zamknięty', 'no-api': 'Brak publicznego web API' },
    thWindow: 'Okno / metryka według dokumentacji producenta',
    window: { 'oura': 'Podczas snu, próbkowane przez całą noc; metryka nienazwana', 'whoop': 'RMSSD, podczas najgłębszego snu', 'polar': 'RMSSD, mniej więcej pierwsze godziny snu, względem Twojego zwykłego poziomu', 'garmin': 'RMSSD, przez noc, względem Twojej osobistej linii bazowej', 'fitbit': 'Nocą; metryka nienazwana', 'samsung': 'Nieujawnione na stronach pomocy Samsung', 'withings': 'Podczas snu, w ms; metryka nienazwana', 'ultrahuman': 'Przez noc, względem Twojego własnego zakresu; metryka nienazwana (strona produktu)', 'ringconn': 'Jeszcze nie sprawdzone', 'amazfit': 'Jeszcze nie sprawdzone', 'apple-watch': 'SDNN, odczyty w tle o różnych porach dnia i nocy; nie dedykowany pomiar nocny' },
    hrv: hrv('Średnia nocna (podczas snu)', 'RMSSD, w milisekundach (w Recovery)', 'RMSSD, pierwsze ~4 h snu (według pomocy Polar)', 'RMSSD, nocą, względem Twojego zakresu', 'Niepotwierdzone na oficjalnych stronach', 'Niepotwierdzone', 'SDNN (Apple Health)'),
  },
  ja: {
    title: 'デバイスのHRVの読み方 | ONDA Life',
    description: 'Oura、WHOOP、Polar、Garmin、Fitbit、Samsung、Withings、Ultrahuman、RingConn、Amazfit、Apple Watch：各デバイスが表示するHRVの種類と、ONDAに接続できるかどうか。',
    h1: 'あなたのデバイスのHRVの読み方', eyebrow: 'あなたのデバイス',
    intro: 'あなたのデバイスはすでに多くを測っています。私たちはそれを正直に読む手助けをします——他人の平均ではなく、あなた自身のベースラインで。',
    pick: 'デバイスを選ぶと、表示されるHRV（心拍変動）の種類とONDAに接続できるかがわかります。',
    thDevice: 'デバイス', thHrv: '表示されるHRV', thStatus: 'ONDAとの接続', inEnglish: '（英語）',
    status: { app: 'ONDAアプリで利用可能', planned: '将来可能になるかもしれません', reviewing: '確認中', closed: '開発者アクセスは停止中', 'no-api': '公開Web APIなし' },
    thWindow: '測定タイミング／指標（メーカー資料による）',
    window: { 'oura': '睡眠中、夜通しサンプリング。指標名は非公開', 'whoop': 'RMSSD、最も深い睡眠中', 'polar': 'RMSSD、睡眠の最初のおよそ数時間、いつもの水準と比較', 'garmin': 'RMSSD、夜間、個人のベースラインと比較', 'fitbit': '夜間。指標名は非公開', 'samsung': 'Samsung のヘルプページでは非公開', 'withings': '睡眠中、ms 単位。指標名は非公開', 'ultrahuman': '夜間、ご自身の範囲と比較。指標名は非公開（製品ページ）', 'ringconn': '未確認', 'amazfit': '未確認', 'apple-watch': 'SDNN、昼夜のさまざまな時間にバックグラウンドで測定。夜間専用の測定ではない' },
    hrv: hrv('夜間平均（睡眠中）', 'RMSSD、ミリ秒（Recovery内）', 'RMSSD、睡眠の最初の約 ~4 h（Polar のヘルプページによる）', 'RMSSD、夜間、あなたの個人範囲との比較', '公式ページでは未確認', '未確認', 'SDNN（Apple Health）'),
  },
  zh: {
    title: '如何读懂你设备的HRV | ONDA Life',
    description: 'Oura、WHOOP、Polar、Garmin、Fitbit、Samsung、Withings、Ultrahuman、RingConn、Amazfit 和 Apple Watch：每款设备显示哪种HRV，以及能否连接 ONDA。',
    h1: '如何读懂你设备的HRV', eyebrow: '你的设备',
    intro: '你的设备已经在测量很多数据。我们帮你诚实地解读它——对照你自己的基线，而不是别人的平均值。',
    pick: '选择你的设备，查看它显示哪种HRV（心率变异性）以及能否连接 ONDA。',
    thDevice: '设备', thHrv: '显示的HRV', thStatus: '与 ONDA 的连接', inEnglish: '（英文）',
    status: { app: '已可用于 ONDA 应用', planned: '未来可能支持', reviewing: '审核中', closed: '开发者通道已关闭', 'no-api': '无公开 Web API' },
    thWindow: '时段 / 指标（依据厂商文档）',
    window: { 'oura': '睡眠期间，整夜采样；未说明指标', 'whoop': 'RMSSD，最深睡眠期间', 'polar': 'RMSSD，约为入睡后前几个小时，与你的平常水平比较', 'garmin': 'RMSSD，整夜，与你的个人基线比较', 'fitbit': '夜间；未说明指标', 'samsung': 'Samsung 帮助页面未披露', 'withings': '睡眠期间，单位 ms；未说明指标', 'ultrahuman': '整夜，与你自己的范围比较；未说明指标（产品页面）', 'ringconn': '尚未审核', 'amazfit': '尚未审核', 'apple-watch': 'SDNN，白天和夜间不同时间的后台读数；并非专门的夜间测量' },
    hrv: hrv('夜间平均值（睡眠期间）', 'RMSSD，单位毫秒（Recovery 中）', 'RMSSD，入睡后前 ~4 h（依据 Polar 帮助页面）', 'RMSSD，夜间，与你的个人范围比较', '官方页面未确认', '未确认', 'SDNN（Apple Health）'),
  },
}

export function connectI18n(lang: string): ConnectI18n {
  return CONNECT_I18N[lang] ?? CONNECT_I18N.en
}
