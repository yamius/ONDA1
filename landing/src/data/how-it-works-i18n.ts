/**
 * Localized copy for /how-it-works (en/ru/es). Prose paragraphs use the richText
 * mini-syntax (**bold**, *em*, {{link}}). Honesty rules hold: coherence is a
 * practice metric not a biomarker; ONDA is not a medical device.
 */
export interface HiwCopy {
  metaTitle: string
  metaDescription: string
  kicker: string
  h1: string
  heroLead: string
  loopHeading: string
  loop: { n: string; title: string; body: string }[]
  hrvHeading: string
  hrvParas: string[]
  coherenceHeading: string
  coherenceParas: string[]
  boundariesHeading: string
  boundaries: string[]
  boundariesMore: string
  links: Record<string, { path: string; label: string }>
}

export const HOW_IT_WORKS_I18N: Record<'en' | 'ru' | 'es', HiwCopy> = {
  en: {
    metaTitle: 'How ONDA Works — HRV, Coherence & the Biofeedback Loop | ONDA Life',
    metaDescription:
      'How ONDA works: from Apple Watch or iPhone-camera pulse to beat intervals, HRV (RMSSD/SDNN), a live coherence score and paced resonance breathing — explained with its limits.',
    kicker: '[ HOW ONDA WORKS ]',
    h1: 'How ONDA works.',
    heroLead:
      'ONDA turns your heartbeat into a live signal you can train against. Here is the loop — from raw pulse to HRV to the coherence score you see on screen — and, just as importantly, what each number is and is not.',
    loopHeading: 'The biofeedback loop',
    loop: [
      { n: '1', title: 'Signal in', body: 'ONDA reads your heartbeat — from the Apple Watch optical sensor (or Apple Health), or from the iPhone camera measuring the colour change in your fingertip (photoplethysmography, PPG).' },
      { n: '2', title: 'Beat intervals', body: 'From that signal ONDA extracts the time between consecutive heartbeats — the beat-to-beat (RR) intervals. This series is the raw material for every heart-rhythm number.' },
      { n: '3', title: 'HRV + rhythm', body: 'ONDA computes HRV from the variation in those intervals, and tracks the shape of the heart-rhythm wave in real time as you breathe.' },
      { n: '4', title: 'Live feedback', body: 'The current rhythm and a coherence score are shown live, so you can see your body respond to each breath — the biofeedback loop that makes ONDA an active trainer, not a passive tracker.' },
      { n: '5', title: 'Paced breathing', body: 'A visual pacer guides you toward slow, even breaths near your resonance frequency (roughly 5–6 breaths per minute), the pace that most strongly organizes the heart rhythm.' },
      { n: '6', title: 'Trend over time', body: 'Session by session, ONDA records your resting-HRV baseline and its direction — the long-term signal the practice is designed to move.' },
    ],
    hrvHeading: 'How ONDA computes HRV',
    hrvParas: [
      'Heart-rate variability is the variation in the time between heartbeats. ONDA computes it from the beat-to-beat (RR) interval series — primarily as **RMSSD** (the root mean square of successive differences), the short-term measure most closely tied to parasympathetic (vagal) activity, and reports **SDNN** where a broader window applies. On Apple Watch, ONDA can use the HRV that Apple Health already derives; from the iPhone camera, it computes HRV from the pulse waveform at rest.',
      'A clean reading needs a stable signal and a short quiet window. Motion, a poor camera contact or an irregular rhythm add noise, so readings are most reliable at rest; when the signal is too poor to trust, ONDA asks you to retake it rather than showing a number it cannot stand behind.',
    ],
    coherenceHeading: 'How ONDA computes coherence',
    coherenceParas: [
      'When you breathe slowly and evenly, your heart rate rises and falls in a smooth wave that tracks your breath (respiratory sinus arrhythmia). ONDA’s **coherence score** reflects how smooth, regular and large that oscillation is over a rolling window — in other words, how well your heart rhythm is organized by your breathing right now. Higher, steadier breathing near your resonance frequency tends to raise it.',
      'What it is *not*: coherence is a real-time practice metric, not a clinical biomarker, not a measure of “how healthy” you are, and not comparable across different people as a score of merit. It is a mirror for your practice in the moment.',
    ],
    boundariesHeading: 'The boundaries',
    boundaries: [
      'HRV is not a direct measure of “stress”; a higher HRV is not automatically better in every context.',
      'The coherence score is not a clinical or diagnostic biomarker.',
      'ONDA is not a medical device and does not diagnose, treat or monitor any condition.',
    ],
    boundariesMore:
      'For exactly which numbers are measured, derived or estimated, see {{measuresLink}}; for the evidence behind the method, see {{researchLink}}.',
    links: {
      measuresLink: { path: '/measurements', label: 'what ONDA measures' },
      researchLink: { path: '/research', label: 'the science behind ONDA' },
    },
  },

  ru: {
    metaTitle: 'Как работает ONDA — HRV, когерентность и петля биофидбека | ONDA Life',
    metaDescription:
      'Как работает ONDA: от пульса с Apple Watch или камеры iPhone к интервалам между ударами, HRV (RMSSD/SDNN), живому показателю когерентности и размеренному резонансному дыханию — с оговорками о пределах.',
    kicker: '[ КАК РАБОТАЕТ ONDA ]',
    h1: 'Как работает ONDA.',
    heroLead:
      'ONDA превращает ваше сердцебиение в живой сигнал, против которого можно тренироваться. Вот петля — от сырого пульса к HRV и к показателю когерентности на экране — и, что не менее важно, что каждое число означает, а что нет.',
    loopHeading: 'Петля биофидбека',
    loop: [
      { n: '1', title: 'Сигнал на входе', body: 'ONDA считывает сердцебиение — с оптического датчика Apple Watch (или из Apple Health), либо с камеры iPhone, измеряющей изменение цвета кончика пальца (фотоплетизмография, PPG).' },
      { n: '2', title: 'Интервалы между ударами', body: 'Из этого сигнала ONDA извлекает время между последовательными ударами — интервалы от удара к удару (RR). Этот ряд — сырьё для каждого числа о ритме сердца.' },
      { n: '3', title: 'HRV + ритм', body: 'ONDA вычисляет HRV из вариации этих интервалов и отслеживает форму волны ритма сердца в реальном времени во время дыхания.' },
      { n: '4', title: 'Живая обратная связь', body: 'Текущий ритм и показатель когерентности показываются вживую, так что вы видите, как тело отвечает на каждый вдох, — та самая петля биофидбека, что делает ONDA активным тренажёром, а не пассивным трекером.' },
      { n: '5', title: 'Размеренное дыхание', body: 'Визуальный пейсер ведёт к медленным ровным вдохам около вашей резонансной частоты (примерно 5–6 вдохов в минуту) — темпа, который сильнее всего организует ритм сердца.' },
      { n: '6', title: 'Тренд со временем', body: 'От сессии к сессии ONDA записывает ваш базовый уровень HRV в покое и его направление — долгосрочный сигнал, который призвана сдвигать практика.' },
    ],
    hrvHeading: 'Как ONDA вычисляет HRV',
    hrvParas: [
      'Вариабельность сердечного ритма — это вариация во времени между ударами сердца. ONDA вычисляет её из ряда интервалов между ударами (RR) — прежде всего как **RMSSD** (среднеквадратичное последовательных разностей), краткосрочную меру, теснее всего связанную с парасимпатической (вагальной) активностью, и приводит **SDNN**, где применимо более широкое окно. На Apple Watch ONDA может использовать HRV, которую Apple Health уже выводит; с камеры iPhone она вычисляет HRV из формы пульсовой волны в покое.',
      'Чистому замеру нужен стабильный сигнал и короткое спокойное окно. Движение, плохой контакт с камерой или нерегулярный ритм добавляют шум, поэтому замеры надёжнее всего в покое; когда сигнал слишком плох, чтобы ему доверять, ONDA просит переснять, а не показывает число, за которое не может отвечать.',
    ],
    coherenceHeading: 'Как ONDA вычисляет когерентность',
    coherenceParas: [
      'Когда вы дышите медленно и ровно, частота сердца поднимается и опускается гладкой волной, следующей за дыханием (дыхательная синусовая аритмия). **Показатель когерентности** ONDA отражает, насколько это колебание гладкое, регулярное и большое за скользящее окно — иными словами, насколько хорошо ритм сердца организован вашим дыханием прямо сейчас. Более высокое и ровное дыхание около резонансной частоты обычно его повышает.',
      'Чем он *не* является: когерентность — метрика для практики в реальном времени, а не клинический биомаркер, не мера того, «насколько вы здоровы», и не сравнима между разными людьми как оценка заслуг. Это зеркало вашей практики в моменте.',
    ],
    boundariesHeading: 'Пределы',
    boundaries: [
      'HRV — не прямая мера «стресса»; более высокая HRV не автоматически лучше в любом контексте.',
      'Показатель когерентности — не клинический и не диагностический биомаркер.',
      'ONDA не медицинский прибор и не диагностирует, не лечит и не мониторит какое-либо состояние.',
    ],
    boundariesMore:
      'Что именно измеряется, выводится или оценивается — смотрите, {{measuresLink}}; о доказательствах за методом — смотрите {{researchLink}}.',
    links: {
      measuresLink: { path: '/measurements', label: 'что измеряет ONDA' },
      researchLink: { path: '/research', label: 'науку за ONDA' },
    },
  },

  es: {
    metaTitle: 'Cómo funciona ONDA — VFC, coherencia y el bucle de biofeedback | ONDA Life',
    metaDescription:
      'Cómo funciona ONDA: del pulso del Apple Watch o la cámara del iPhone a los intervalos entre latidos, la VFC (RMSSD/SDNN), una puntuación de coherencia en vivo y la respiración de resonancia pautada — con sus límites.',
    kicker: '[ CÓMO FUNCIONA ONDA ]',
    h1: 'Cómo funciona ONDA.',
    heroLead:
      'ONDA convierte tu latido en una señal en vivo contra la que puedes entrenar. Aquí está el bucle — del pulso bruto a la VFC y a la puntuación de coherencia que ves en pantalla — y, igual de importante, qué es y qué no es cada número.',
    loopHeading: 'El bucle de biofeedback',
    loop: [
      { n: '1', title: 'Señal de entrada', body: 'ONDA lee tu latido — desde el sensor óptico del Apple Watch (o Apple Salud), o desde la cámara del iPhone que mide el cambio de color en tu dedo (fotopletismografía, PPG).' },
      { n: '2', title: 'Intervalos entre latidos', body: 'De esa señal ONDA extrae el tiempo entre latidos consecutivos — los intervalos latido a latido (RR). Esta serie es la materia prima de cada número del ritmo cardíaco.' },
      { n: '3', title: 'VFC + ritmo', body: 'ONDA calcula la VFC a partir de la variación de esos intervalos, y sigue la forma de la onda del ritmo cardíaco en tiempo real mientras respiras.' },
      { n: '4', title: 'Feedback en vivo', body: 'El ritmo actual y una puntuación de coherencia se muestran en vivo, para que veas cómo tu cuerpo responde a cada respiración — el bucle de biofeedback que hace de ONDA un entrenador activo, no un rastreador pasivo.' },
      { n: '5', title: 'Respiración pautada', body: 'Un marcapasos visual te guía hacia respiraciones lentas y parejas cerca de tu frecuencia de resonancia (unas 5–6 por minuto), el ritmo que más organiza el ritmo cardíaco.' },
      { n: '6', title: 'Tendencia en el tiempo', body: 'Sesión a sesión, ONDA registra tu línea base de VFC en reposo y su dirección — la señal a largo plazo que la práctica está diseñada para mover.' },
    ],
    hrvHeading: 'Cómo calcula ONDA la VFC',
    hrvParas: [
      'La variabilidad de la frecuencia cardíaca es la variación en el tiempo entre latidos. ONDA la calcula a partir de la serie de intervalos latido a latido (RR) — principalmente como **RMSSD** (la raíz cuadrática media de las diferencias sucesivas), la medida a corto plazo más ligada a la actividad parasimpática (vagal), y reporta **SDNN** donde aplica una ventana más amplia. En Apple Watch, ONDA puede usar la VFC que Apple Salud ya deriva; desde la cámara del iPhone, calcula la VFC a partir de la forma de onda del pulso en reposo.',
      'Una lectura limpia necesita una señal estable y una ventana corta en calma. El movimiento, un mal contacto con la cámara o un ritmo irregular añaden ruido, así que las lecturas son más fiables en reposo; cuando la señal es demasiado pobre para fiarse, ONDA te pide repetirla en lugar de mostrar un número que no puede respaldar.',
    ],
    coherenceHeading: 'Cómo calcula ONDA la coherencia',
    coherenceParas: [
      'Cuando respiras despacio y de forma pareja, tu frecuencia cardíaca sube y baja en una onda suave que sigue a tu respiración (arritmia sinusal respiratoria). La **puntuación de coherencia** de ONDA refleja lo suave, regular y amplia que es esa oscilación en una ventana móvil — en otras palabras, lo bien organizado que está tu ritmo cardíaco por tu respiración ahora mismo. Una respiración más alta y estable cerca de tu frecuencia de resonancia tiende a subirla.',
      'Lo que *no* es: la coherencia es una métrica de práctica en tiempo real, no un biomarcador clínico, ni una medida de «cuán sano» estás, ni comparable entre personas como una puntuación de mérito. Es un espejo de tu práctica en el momento.',
    ],
    boundariesHeading: 'Los límites',
    boundaries: [
      'La VFC no es una medida directa del «estrés»; una VFC más alta no es automáticamente mejor en todo contexto.',
      'La puntuación de coherencia no es un biomarcador clínico ni diagnóstico.',
      'ONDA no es un dispositivo médico y no diagnostica, trata ni monitoriza ninguna condición.',
    ],
    boundariesMore:
      'Para saber exactamente qué números se miden, derivan o estiman, mira {{measuresLink}}; para la evidencia tras el método, mira {{researchLink}}.',
    links: {
      measuresLink: { path: '/measurements', label: 'qué mide ONDA' },
      researchLink: { path: '/research', label: 'la ciencia detrás de ONDA' },
    },
  },
}
