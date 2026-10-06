/**
 * Localized copy for /measurements (en/ru/es). The signal table's `kind` keys
 * (measured/derived/estimated) stay stable for styling; their labels + all prose
 * localize. computeBox uses the richText {{link}} syntax. Honesty rules from
 * MeasurementsPage apply to every translation (coherence is derived, stress/
 * energy are estimates, ONDA is not a medical device).
 */
export type MKind = 'measured' | 'derived' | 'estimated'
export interface MSignal {
  signal: string
  source: string
  kind: MKind
  meaning: string
}
export interface MCopy {
  metaTitle: string
  metaDescription: string
  kicker: string
  h1: string
  heroLead: string
  kindLabels: Record<MKind, string>
  tableHeaders: { signal: string; source: string; type: string; meaning: string }
  signals: MSignal[]
  notMeasuredPre: string
  notMeasuredNot: string
  notMeasuredPost: string
  notMeasuredIntro: string
  notMeasured: string[]
  computeBox: string
  faqHeading: string
  faq: { q: string; a: string }[]
  links: Record<string, { path: string; label: string }>
}

export const MEASUREMENTS_I18N: Record<'en' | 'ru' | 'es', MCopy> = {
  en: {
    metaTitle: 'What ONDA Measures — HRV, Coherence & What’s Estimated | ONDA Life',
    metaDescription:
      'Exactly what ONDA reads (heart rate, HRV from Apple Health), what it derives (coherence, your nightly baseline), how often it notifies you — and what it does not measure.',
    kicker: '[ WHAT ONDA MEASURES ]',
    h1: 'What ONDA actually measures.',
    heroLead:
      'Words like HRV, coherence and your resting trend sit side by side in the app — but they are not the same kind of number. Some are measured directly from your heart and some are derived. Here is exactly which is which, so you (and any system citing us) never have to guess.',
    kindLabels: { measured: 'Directly measured', derived: 'Derived', estimated: 'Estimated' },
    tableHeaders: { signal: 'Signal', source: 'Source', type: 'Type', meaning: 'What it means' },
    signals: [
      {
        signal: 'Heart rate',
        source: 'Apple Watch optical sensor, or iPhone camera pulse (PPG)',
        kind: 'measured',
        meaning: 'Beats per minute, read live during a session and at rest.',
      },
      {
        signal: 'HRV (SDNN)',
        source: 'Read ready-made from Apple Health, where an Apple Watch (or another device) records it. ONDA does not compute HRV itself; the iPhone camera measures pulse only, not HRV',
        kind: 'measured',
        meaning: 'Heart-rate variability — the variation between heartbeats, the core recovery/autonomic signal.',
      },
      {
        signal: 'Coherence',
        source: 'Heart rhythm + breathing during a practice (Apple Watch only)',
        kind: 'derived',
        meaning:
          'A synchronization score: how smoothly and rhythmically your heart rhythm oscillates with your breath. A feedback metric, not a clinical biomarker.',
      },
      {
        signal: 'Resting heart rate, breathing rate',
        source: 'Read from Apple Health (nightly values recorded by an Apple Watch)',
        kind: 'measured',
        meaning: 'Two of the three nightly signals in your baseline, alongside HRV.',
      },
      {
        signal: 'VO₂max, walking heart rate, 1-minute heart-rate recovery',
        source: 'Read from Apple Health (recorded by an Apple Watch)',
        kind: 'measured',
        meaning: 'Fitness context shown around your baseline; ONDA does not compute these values itself.',
      },
      {
        signal: 'Personal baseline',
        source: 'Nightly HRV, resting heart rate and breathing rate from Apple Health over the last 14 days',
        kind: 'derived',
        meaning:
          'Your own corridor — the average of your recent nights plus or minus one standard deviation. ONDA flags a night only when it is at least 1.5 standard deviations outside and has changed by a minimum amount.',
      },
    ],
    notMeasuredPre: 'What ONDA does ',
    notMeasuredNot: 'not',
    notMeasuredPost: ' measure.',
    notMeasuredIntro:
      'Just as important as what we track. ONDA is a heart-signal app — it does not read the following, and does not claim to:',
    notMeasured: [
      'Blood glucose, cortisol, BDNF or any blood/hormone biomarker',
      'Brain activity (EEG), brain waves or "gamma coherence"',
      'Sleep stages or a readiness score — ONDA’s Life Rhythm shows sleep regularity, timing and duration from Apple Watch, not stage-by-stage sleep tracking',
      'Steps, calories or workouts — ONDA does not read them (from fitness data it reads only VO₂max, walking heart rate and 1-minute heart-rate recovery)',
      'Any diagnostic or medical output — ONDA is not a medical device',
    ],
    computeBox:
      'For the method behind each number — where HRV comes from, and how the coherence score is built — see {{howLink}}. For the evidence these signals rest on, see {{researchLink}}, and to read your own HRV against population norms, the {{hrvLink}}.',
    faqHeading: 'Questions',
    faq: [
      {
        q: 'What does ONDA actually measure?',
        a: 'ONDA measures heart rate via an Apple Watch, Apple Health or the iPhone camera (PPG) at rest, and reads heart-rate variability (HRV, SDNN) ready-made from Apple Health — written there by an Apple Watch or by another device that syncs heart data to Apple Health; ONDA does not compute HRV itself. It also reads resting heart rate, breathing rate, VO₂max, walking heart rate and 1-minute heart-rate recovery from Apple Health. From nightly values it builds your personal baseline and, with an Apple Watch, shows a live coherence score. It does not measure blood biomarkers, brain activity or sleep stages.',
      },
      {
        q: 'Is ONDA’s coherence score a medical or clinical measurement?',
        a: 'No. Coherence is a derived synchronization metric — how rhythmically your heart rhythm oscillates with your breathing during a session. It is real-time biofeedback, not a clinical biomarker or diagnosis.',
      },
      {
        q: 'Do ONDA’s signals mean something is medically wrong?',
        a: 'No. ONDA’s signals are descriptive comparisons with your own baseline — interpretations to guide practice, not measurements of stress and not a medical assessment.',
      },
      {
        q: 'Can ONDA measure HRV without an Apple Watch?',
        a: 'Not yet — the iPhone camera measures your pulse (heart rate) only, not individual beats or HRV; HRV appears once an Apple Watch (or another tracker writing HRV to Apple Health) is connected.',
      },
      {
        q: 'How often does ONDA send notifications?',
        a: 'Rarely. ONDA sends at most one signal every two days. With watch data, it sends a calm check-in every four steady nights. Without watch data, a calm check-in comes about every three days, and is skipped if you practised or measured in the last 24 hours. There is at most one calm message a day, and never on a day with a signal.',
      },
      {
        q: 'Is ONDA a medical device?',
        a: 'No. ONDA is an HRV biofeedback and guided-breathing app for training and self-regulation. It does not diagnose, treat or monitor any medical condition and is not a substitute for medical care.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'how ONDA works' },
      researchLink: { path: '/research', label: 'the science behind ONDA' },
      hrvLink: { path: '/tools/hrv', label: 'HRV interpreter' },
    },
  },

  ru: {
    metaTitle: 'Что измеряет ONDA — HRV, когерентность и что оценивается | ONDA Life',
    metaDescription:
      'Что именно ONDA считывает (пульс, HRV из Apple Health), что выводит (когерентность, ночной базовый уровень), как часто присылает уведомления — и чего не измеряет.',
    kicker: '[ ЧТО ИЗМЕРЯЕТ ONDA ]',
    h1: 'Что ONDA на самом деле измеряет.',
    heroLead:
      'Слова вроде HRV, когерентности и тренда в покое стоят в приложении рядом — но это числа разного рода. Что-то измеряется напрямую с сердца, а что-то выводится. Вот что именно есть что, чтобы вам (и любой системе, которая нас цитирует) не приходилось гадать.',
    kindLabels: { measured: 'Измеряется напрямую', derived: 'Выводится', estimated: 'Оценивается' },
    tableHeaders: { signal: 'Сигнал', source: 'Источник', type: 'Тип', meaning: 'Что означает' },
    signals: [
      {
        signal: 'Пульс',
        source: 'Оптический датчик Apple Watch или пульс с камеры iPhone (PPG)',
        kind: 'measured',
        meaning: 'Удары в минуту, считываются вживую во время сессии и в покое.',
      },
      {
        signal: 'HRV (SDNN)',
        source: 'Берётся готовым из Apple Health, куда его записывают Apple Watch (или другое устройство). ONDA не вычисляет HRV сама; камера iPhone измеряет только пульс, не HRV',
        kind: 'measured',
        meaning: 'Вариабельность сердечного ритма — вариация между ударами, ключевой сигнал восстановления/вегетатики.',
      },
      {
        signal: 'Когерентность',
        source: 'Сердечный ритм + дыхание во время практики (только с Apple Watch)',
        kind: 'derived',
        meaning:
          'Показатель синхронизации: насколько гладко и ритмично ритм сердца колеблется вместе с дыханием. Метрика обратной связи, а не клинический биомаркер.',
      },
      {
        signal: 'Пульс в покое, частота дыхания',
        source: 'Считываются из Apple Health (ночные значения, записанные Apple Watch)',
        kind: 'measured',
        meaning: 'Два из трёх ночных сигналов вашего базового уровня, вместе с HRV.',
      },
      {
        signal: 'VO₂max, пульс при ходьбе, восстановление пульса за 1 минуту',
        source: 'Считываются из Apple Health (записаны Apple Watch)',
        kind: 'measured',
        meaning: 'Фитнес-контекст вокруг вашего базового уровня; ONDA не вычисляет эти значения сама.',
      },
      {
        signal: 'Персональный базовый уровень',
        source: 'Ночные HRV, пульс в покое и частота дыхания из Apple Health за последние 14 дней',
        kind: 'derived',
        meaning:
          'Ваш собственный коридор — среднее за последние ночи плюс-минус одно стандартное отклонение. ONDA отмечает ночь, только если та выходит за него не менее чем на 1,5 стандартного отклонения и изменилась на минимальную величину.',
      },
    ],
    notMeasuredPre: 'Чего ONDA ',
    notMeasuredNot: 'не',
    notMeasuredPost: ' измеряет.',
    notMeasuredIntro:
      'Не менее важно, чем то, что мы отслеживаем. ONDA — приложение сигналов сердца, оно не считывает нижеперечисленное и не претендует на это:',
    notMeasured: [
      'Глюкозу крови, кортизол, BDNF или любой кровяной/гормональный биомаркер',
      'Активность мозга (ЭЭГ), мозговые волны или «гамма-когерентность»',
      'Стадии сна или показатель готовности — Life Rhythm в ONDA показывает регулярность, время и длительность сна с Apple Watch, но не отслеживает сон по стадиям',
      'Шаги, калории или тренировки — ONDA их не читает (из фитнес-данных она читает только VO₂max, пульс при ходьбе и восстановление пульса за 1 минуту)',
      'Любой диагностический или медицинский вывод — ONDA не медицинский прибор',
    ],
    computeBox:
      'О методе за каждым числом — откуда берётся HRV и как строится показатель когерентности — смотрите, {{howLink}}. О доказательствах, на которых стоят эти сигналы, смотрите {{researchLink}}, а чтобы прочитать свой HRV на фоне популяционных норм — {{hrvLink}}.',
    faqHeading: 'Вопросы',
    faq: [
      {
        q: 'Что ONDA на самом деле измеряет?',
        a: 'ONDA измеряет пульс через Apple Watch, Apple Health или камерой iPhone (PPG) в покое, а вариабельность сердечного ритма (HRV, SDNN) берёт готовой из Apple Health — туда её записывают Apple Watch или другое устройство, которое синхронизирует данные о сердце с Apple Health; сама ONDA HRV не вычисляет. Ещё она читает из Apple Health пульс в покое, частоту дыхания, VO₂max, пульс при ходьбе и восстановление пульса за 1 минуту. По ночным значениям она строит ваш персональный базовый уровень, а при подключённых Apple Watch показывает живой показатель когерентности. Она не измеряет кровяные биомаркеры, активность мозга или стадии сна.',
      },
      {
        q: 'Показатель когерентности ONDA — это медицинское или клиническое измерение?',
        a: 'Нет. Когерентность — производная метрика синхронизации: насколько ритмично ритм сердца колеблется с дыханием во время сессии. Это биофидбек в реальном времени, а не клинический биомаркер или диагноз.',
      },
      {
        q: 'Сигналы ONDA означают, что со мной что-то не так медицински?',
        a: 'Нет. Сигналы ONDA — описательное сравнение с вашим собственным базовым уровнем: интерпретации для практики, а не измерения стресса и не медицинская оценка.',
      },
      {
        q: 'Может ли ONDA измерять HRV без Apple Watch?',
        a: 'Пока нет — камера iPhone измеряет только пульс, без отдельных ударов и без HRV; HRV появляется после подключения Apple Watch (или другого трекера, записывающего HRV в Apple Health).',
      },
      {
        q: 'Как часто ONDA присылает уведомления?',
        a: 'Редко. ONDA присылает не чаще одного сигнала раз в два дня. С данными часов — спокойное сообщение каждые четыре ровные ночи. Без данных часов спокойное сообщение приходит примерно раз в три дня и пропускается, если за последние 24 часа вы делали практику или замер. Спокойных сообщений не больше одного в день, и никогда — в день сигнала.',
      },
      {
        q: 'ONDA — это медицинский прибор?',
        a: 'Нет. ONDA — приложение HRV-биофидбека и направляемого дыхания для тренировки и саморегуляции. Оно не диагностирует, не лечит и не мониторит какое-либо заболевание и не заменяет медицинскую помощь.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'как работает ONDA' },
      researchLink: { path: '/research', label: 'науку за ONDA' },
      hrvLink: { path: '/tools/hrv', label: 'интерпретатор HRV' },
    },
  },

  es: {
    metaTitle: 'Qué mide ONDA — HRV, coherencia y qué se estima | ONDA Life',
    metaDescription:
      'Qué lee ONDA exactamente (frecuencia cardíaca, HRV de Apple Salud), qué deriva (coherencia, tu línea base nocturna), con qué frecuencia te avisa — y lo que no mide.',
    kicker: '[ QUÉ MIDE ONDA ]',
    h1: 'Qué mide realmente ONDA.',
    heroLead:
      'Palabras como HRV, coherencia y tu tendencia en reposo conviven en la app — pero no son el mismo tipo de número. Algunos se miden directamente de tu corazón y otros se derivan. Aquí tienes exactamente cuál es cuál, para que tú (y cualquier sistema que nos cite) nunca tengas que adivinar.',
    kindLabels: { measured: 'Medido directamente', derived: 'Derivado', estimated: 'Estimado' },
    tableHeaders: { signal: 'Señal', source: 'Fuente', type: 'Tipo', meaning: 'Qué significa' },
    signals: [
      {
        signal: 'Frecuencia cardíaca',
        source: 'Sensor óptico del Apple Watch, o pulso por cámara del iPhone (PPG)',
        kind: 'measured',
        meaning: 'Latidos por minuto, leídos en vivo durante una sesión y en reposo.',
      },
      {
        signal: 'HRV (SDNN)',
        source: 'Se lee ya calculada de Apple Salud, donde la registra un Apple Watch (u otro dispositivo). ONDA no calcula la HRV por sí misma; la cámara del iPhone solo mide el pulso, no la HRV',
        kind: 'measured',
        meaning: 'Variabilidad de la frecuencia cardíaca — la variación entre latidos, la señal central de recuperación/autonómica.',
      },
      {
        signal: 'Coherencia',
        source: 'Ritmo cardíaco + respiración durante una práctica (solo con Apple Watch)',
        kind: 'derived',
        meaning:
          'Una puntuación de sincronización: con qué suavidad y ritmo tu ritmo cardíaco oscila con tu respiración. Una métrica de feedback, no un biomarcador clínico.',
      },
      {
        signal: 'Frecuencia cardíaca en reposo, frecuencia respiratoria',
        source: 'Se leen de Apple Salud (valores nocturnos registrados por un Apple Watch)',
        kind: 'measured',
        meaning: 'Dos de las tres señales nocturnas de tu línea base, junto con la HRV.',
      },
      {
        signal: 'VO₂máx, frecuencia cardíaca al caminar, recuperación de la frecuencia cardíaca en 1 minuto',
        source: 'Se leen de Apple Salud (registrados por un Apple Watch)',
        kind: 'measured',
        meaning: 'Contexto de forma física alrededor de tu línea base; ONDA no calcula estos valores por sí misma.',
      },
      {
        signal: 'Línea base personal',
        source: 'HRV, frecuencia cardíaca en reposo y frecuencia respiratoria nocturnas de Apple Salud de los últimos 14 días',
        kind: 'derived',
        meaning:
          'Tu propio corredor: la media de tus noches recientes más o menos una desviación estándar. ONDA marca una noche solo cuando queda al menos 1,5 desviaciones estándar fuera y ha cambiado en una cantidad mínima.',
      },
    ],
    notMeasuredPre: 'Qué ',
    notMeasuredNot: 'no',
    notMeasuredPost: ' mide ONDA.',
    notMeasuredIntro:
      'Tan importante como lo que seguimos. ONDA es una app de señales del corazón — no lee lo siguiente, ni pretende hacerlo:',
    notMeasured: [
      'Glucosa en sangre, cortisol, BDNF o cualquier biomarcador de sangre/hormona',
      'Actividad cerebral (EEG), ondas cerebrales o «coherencia gamma»',
      'Fases del sueño o una puntuación de preparación — Life Rhythm de ONDA muestra la regularidad, el horario y la duración del sueño desde el Apple Watch, no un seguimiento por fases',
      'Pasos, calorías o entrenamientos — ONDA no los lee (de los datos de forma física solo lee el VO₂máx, la frecuencia cardíaca al caminar y la recuperación de la frecuencia cardíaca en 1 minuto)',
      'Cualquier salida diagnóstica o médica — ONDA no es un dispositivo médico',
    ],
    computeBox:
      'Para el método tras cada número — de dónde sale la HRV y cómo se construye la puntuación de coherencia — mira {{howLink}}. Para la evidencia sobre la que se apoyan estas señales, mira {{researchLink}}, y para leer tu propia HRV frente a las normas poblacionales, el {{hrvLink}}.',
    faqHeading: 'Preguntas',
    faq: [
      {
        q: '¿Qué mide realmente ONDA?',
        a: 'ONDA mide la frecuencia cardíaca vía Apple Watch, Apple Salud o la cámara del iPhone (PPG) en reposo, y lee la variabilidad de la frecuencia cardíaca (HRV, SDNN) ya calculada de Apple Salud, donde la escribe un Apple Watch u otro dispositivo que sincroniza datos del corazón con Apple Salud; ONDA no calcula la HRV por sí misma. También lee de Apple Salud la frecuencia cardíaca en reposo, la frecuencia respiratoria, el VO₂máx, la frecuencia cardíaca al caminar y la recuperación de la frecuencia cardíaca en 1 minuto. Con los valores nocturnos construye tu línea base personal y, con un Apple Watch, muestra una puntuación de coherencia en vivo. No mide biomarcadores en sangre, actividad cerebral ni fases del sueño.',
      },
      {
        q: '¿La puntuación de coherencia de ONDA es una medición médica o clínica?',
        a: 'No. La coherencia es una métrica de sincronización derivada — con qué ritmo tu ritmo cardíaco oscila con tu respiración durante una sesión. Es biofeedback en tiempo real, no un biomarcador clínico ni un diagnóstico.',
      },
      {
        q: '¿Las señales de ONDA significan que algo va mal médicamente?',
        a: 'No. Las señales de ONDA son comparaciones descriptivas con tu propia línea base — interpretaciones para guiar la práctica, no mediciones del estrés ni una evaluación médica.',
      },
      {
        q: '¿Puede ONDA medir la HRV sin un Apple Watch?',
        a: 'Todavía no — la cámara del iPhone solo mide tu pulso (frecuencia cardíaca), no latidos individuales ni la HRV; la HRV aparece al conectar un Apple Watch (u otro dispositivo que escriba HRV en Apple Salud).',
      },
      {
        q: '¿Con qué frecuencia envía notificaciones ONDA?',
        a: 'Pocas veces. ONDA envía como máximo una señal cada dos días. Con datos del reloj, envía un mensaje tranquilo cada cuatro noches estables. Sin datos del reloj, el mensaje tranquilo llega aproximadamente cada tres días y se omite si practicaste o te mediste en las últimas 24 horas. Hay como máximo un mensaje tranquilo al día, y nunca un día con señal.',
      },
      {
        q: '¿ONDA es un dispositivo médico?',
        a: 'No. ONDA es una app de biofeedback de HRV y respiración guiada para el entrenamiento y la autorregulación. No diagnostica, trata ni monitoriza ninguna condición médica y no sustituye la atención médica.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'cómo funciona ONDA' },
      researchLink: { path: '/research', label: 'la ciencia detrás de ONDA' },
      hrvLink: { path: '/tools/hrv', label: 'intérprete de HRV' },
    },
  },
}
