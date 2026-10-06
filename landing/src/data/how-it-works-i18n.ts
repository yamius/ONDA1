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
      'How ONDA works: pulse from an Apple Watch or the iPhone camera, HRV (SDNN) read from Apple Health, a live coherence score (Apple Watch) and a nightly personal baseline — explained with its limits.',
    kicker: '[ HOW ONDA WORKS ]',
    h1: 'How ONDA works.',
    heroLead:
      'ONDA turns your heartbeat into a live signal you can train against. Here is the loop — from your pulse to HRV, the coherence score you see on screen and your nightly baseline — and, just as importantly, what each number is and is not.',
    loopHeading: 'The biofeedback loop',
    loop: [
      { n: '1', title: 'Signal in', body: 'ONDA reads your heartbeat — from the Apple Watch optical sensor (or Apple Health), or from the iPhone camera measuring the colour change in your fingertip (photoplethysmography, PPG).' },
      { n: '2', title: 'Pulse, not single beats', body: 'The iPhone camera estimates your pulse rate (heart rate) — it does not detect individual heartbeats and cannot measure HRV. With an Apple Watch, ONDA receives heart-rate readings from the watch.' },
      { n: '3', title: 'HRV from Apple Health', body: 'ONDA does not compute HRV itself. It reads HRV ready-made from Apple Health as SDNN — the value an Apple Watch (or another device that writes to Apple Health) records there.' },
      { n: '4', title: 'Live feedback', body: 'The current rhythm is shown live — plus a coherence score with an Apple Watch — so you can see your body respond to each breath, the biofeedback loop that makes ONDA an active trainer, not a passive tracker.' },
      { n: '5', title: 'Your nightly baseline', body: 'From nightly Apple Health values — HRV, resting heart rate and breathing rate — ONDA builds your personal baseline over the last 14 days. It compares each night with your own corridor — the average of your recent nights plus or minus one standard deviation — and flags a night only when it is at least 1.5 standard deviations outside and has changed by a minimum amount.' },
    ],
    hrvHeading: 'Where ONDA’s HRV comes from',
    hrvParas: [
      'Heart-rate variability is the variation in the time between heartbeats. ONDA does not calculate it from your heartbeats: it reads HRV ready-made from Apple Health as **SDNN**, the value an Apple Watch (or another device that writes to Apple Health) records there. The live in-practice variability tile is a simpler heart-rate-variation estimate, not a clinical HRV value. The iPhone camera gives your pulse (heart rate) only; HRV appears once an Apple Watch is connected.',
      'A clean reading needs a stable signal and a short quiet window. Motion, a poor camera contact or an irregular rhythm add noise, so readings are most reliable at rest; when the signal is too poor to trust, ONDA asks you to retake it rather than showing a number it cannot stand behind.',
    ],
    coherenceHeading: 'How ONDA computes coherence',
    coherenceParas: [
      'When you breathe slowly and evenly, your heart rate rises and falls in a smooth wave that tracks your breath (respiratory sinus arrhythmia). ONDA’s **coherence score** reflects how smooth, regular and large that oscillation is over a rolling window — in other words, how well your heart rhythm is organized by your breathing right now. Slow, even breathing tends to raise it. The coherence score needs an Apple Watch.',
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
      'Как работает ONDA: пульс с Apple Watch или камеры iPhone, HRV (SDNN) из Apple Health, живой показатель когерентности (Apple Watch) и ночной персональный базовый уровень — с оговорками о пределах.',
    kicker: '[ КАК РАБОТАЕТ ONDA ]',
    h1: 'Как работает ONDA.',
    heroLead:
      'ONDA превращает ваше сердцебиение в живой сигнал, против которого можно тренироваться. Вот петля — от пульса к HRV, показателю когерентности на экране и ночному базовому уровню — и, что не менее важно, что каждое число означает, а что нет.',
    loopHeading: 'Петля биофидбека',
    loop: [
      { n: '1', title: 'Сигнал на входе', body: 'ONDA считывает сердцебиение — с оптического датчика Apple Watch (или из Apple Health), либо с камеры iPhone, измеряющей изменение цвета кончика пальца (фотоплетизмография, PPG).' },
      { n: '2', title: 'Пульс, а не отдельные удары', body: 'Камера iPhone оценивает частоту пульса — отдельные удары сердца она не различает и HRV измерить не может. С Apple Watch ONDA получает значения пульса с часов.' },
      { n: '3', title: 'HRV из Apple Health', body: 'ONDA не вычисляет HRV сама. Она берёт готовый HRV из Apple Health в виде SDNN — значение, которое туда записывают Apple Watch (или другое устройство, пишущее в Apple Health).' },
      { n: '4', title: 'Живая обратная связь', body: 'Текущий ритм показывается вживую — а с Apple Watch ещё и показатель когерентности, — так что вы видите, как тело отвечает на каждый вдох, — та самая петля биофидбека, что делает ONDA активным тренажёром, а не пассивным трекером.' },
      { n: '5', title: 'Ночной базовый уровень', body: 'По ночным значениям из Apple Health — HRV, пульсу в покое и частоте дыхания — ONDA строит ваш персональный базовый уровень за последние 14 дней. Каждую ночь она сравнивает с вашим собственным коридором — средним за последние ночи плюс-минус одно стандартное отклонение — и отмечает ночь, только если та выходит за него не менее чем на 1,5 стандартного отклонения и изменилась на минимальную величину.' },
    ],
    hrvHeading: 'Откуда ONDA берёт HRV',
    hrvParas: [
      'Вариабельность сердечного ритма — это вариация во времени между ударами сердца. ONDA не рассчитывает её по вашим ударам сердца: она берёт готовый HRV из Apple Health в виде **SDNN** — значение, которое туда записывают Apple Watch (или другое устройство, пишущее в Apple Health). Живой показатель вариабельности во время практики — упрощённая оценка колебаний пульса, а не клиническое значение HRV. Камера iPhone даёт только пульс; HRV появляется после подключения Apple Watch.',
      'Чистому замеру нужен стабильный сигнал и короткое спокойное окно. Движение, плохой контакт с камерой или нерегулярный ритм добавляют шум, поэтому замеры надёжнее всего в покое; когда сигнал слишком плох, чтобы ему доверять, ONDA просит переснять, а не показывает число, за которое не может отвечать.',
    ],
    coherenceHeading: 'Как ONDA вычисляет когерентность',
    coherenceParas: [
      'Когда вы дышите медленно и ровно, частота сердца поднимается и опускается гладкой волной, следующей за дыханием (дыхательная синусовая аритмия). **Показатель когерентности** ONDA отражает, насколько это колебание гладкое, регулярное и большое за скользящее окно — иными словами, насколько хорошо ритм сердца организован вашим дыханием прямо сейчас. Медленное ровное дыхание обычно его повышает. Для показателя когерентности нужны Apple Watch.',
      'Чем он *не* является: когерентность — метрика для практики в реальном времени, а не клинический биомаркер, не мера того, «насколько вы здоровы», и не сравнима между разными людьми как оценка заслуг. Это зеркало вашей практики в моменте.',
    ],
    boundariesHeading: 'Пределы',
    boundaries: [
      'HRV — не прямая мера «стресса»; более высокий HRV не автоматически лучше в любом контексте.',
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
    metaTitle: 'Cómo funciona ONDA — HRV, coherencia y el bucle de biofeedback | ONDA Life',
    metaDescription:
      'Cómo funciona ONDA: el pulso del Apple Watch o de la cámara del iPhone, la HRV (SDNN) leída de Apple Salud, una puntuación de coherencia en vivo (Apple Watch) y una línea base personal nocturna — con sus límites.',
    kicker: '[ CÓMO FUNCIONA ONDA ]',
    h1: 'Cómo funciona ONDA.',
    heroLead:
      'ONDA convierte tu latido en una señal en vivo contra la que puedes entrenar. Aquí está el bucle — de tu pulso a la HRV, la puntuación de coherencia que ves en pantalla y tu línea base nocturna — y, igual de importante, qué es y qué no es cada número.',
    loopHeading: 'El bucle de biofeedback',
    loop: [
      { n: '1', title: 'Señal de entrada', body: 'ONDA lee tu latido — desde el sensor óptico del Apple Watch (o Apple Salud), o desde la cámara del iPhone que mide el cambio de color en tu dedo (fotopletismografía, PPG).' },
      { n: '2', title: 'Pulso, no latidos sueltos', body: 'La cámara del iPhone estima tu pulso (frecuencia cardíaca): no detecta latidos individuales y no puede medir la HRV. Con un Apple Watch, ONDA recibe las lecturas de frecuencia cardíaca del reloj.' },
      { n: '3', title: 'HRV desde Apple Salud', body: 'ONDA no calcula la HRV por sí misma. La lee ya calculada de Apple Salud como SDNN, el valor que registra allí un Apple Watch (u otro dispositivo que escribe en Apple Salud).' },
      { n: '4', title: 'Feedback en vivo', body: 'El ritmo actual se muestra en vivo — y, con un Apple Watch, una puntuación de coherencia — para que veas cómo tu cuerpo responde a cada respiración: el bucle de biofeedback que hace de ONDA un entrenador activo, no un rastreador pasivo.' },
      { n: '5', title: 'Tu línea base nocturna', body: 'Con los valores nocturnos de Apple Salud — HRV, frecuencia cardíaca en reposo y frecuencia respiratoria — ONDA construye tu línea base personal de los últimos 14 días. Compara cada noche con tu propio corredor — la media de tus noches recientes más o menos una desviación estándar — y marca una noche solo cuando queda al menos 1,5 desviaciones estándar fuera y ha cambiado en una cantidad mínima.' },
    ],
    hrvHeading: 'De dónde saca ONDA la HRV',
    hrvParas: [
      'La variabilidad de la frecuencia cardíaca es la variación en el tiempo entre latidos. ONDA no la calcula a partir de tus latidos: lee la HRV ya calculada de Apple Salud como **SDNN**, el valor que registra allí un Apple Watch (u otro dispositivo que escribe en Apple Salud). El indicador de variabilidad en vivo durante la práctica es una estimación más simple de la variación del pulso, no un valor clínico de HRV. La cámara del iPhone solo da tu pulso; la HRV aparece al conectar un Apple Watch.',
      'Una lectura limpia necesita una señal estable y una ventana corta en calma. El movimiento, un mal contacto con la cámara o un ritmo irregular añaden ruido, así que las lecturas son más fiables en reposo; cuando la señal es demasiado pobre para fiarse, ONDA te pide repetirla en lugar de mostrar un número que no puede respaldar.',
    ],
    coherenceHeading: 'Cómo calcula ONDA la coherencia',
    coherenceParas: [
      'Cuando respiras despacio y de forma pareja, tu frecuencia cardíaca sube y baja en una onda suave que sigue a tu respiración (arritmia sinusal respiratoria). La **puntuación de coherencia** de ONDA refleja lo suave, regular y amplia que es esa oscilación en una ventana móvil — en otras palabras, lo bien organizado que está tu ritmo cardíaco por tu respiración ahora mismo. Una respiración lenta y pareja tiende a subirla. La puntuación de coherencia necesita un Apple Watch.',
      'Lo que *no* es: la coherencia es una métrica de práctica en tiempo real, no un biomarcador clínico, ni una medida de «cuán sano» estás, ni comparable entre personas como una puntuación de mérito. Es un espejo de tu práctica en el momento.',
    ],
    boundariesHeading: 'Los límites',
    boundaries: [
      'La HRV no es una medida directa del «estrés»; una HRV más alta no es automáticamente mejor en todo contexto.',
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
