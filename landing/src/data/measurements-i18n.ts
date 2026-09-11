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
      'Exactly what ONDA measures directly (heart rate, HRV), what it derives (coherence, resting-HRV trend) and what it estimates (stress, energy) — plus what it does not measure. Honest, machine-verifiable.',
    kicker: '[ WHAT ONDA MEASURES ]',
    h1: 'What ONDA actually measures.',
    heroLead:
      'Words like HRV, coherence, stress and energy sit side by side in the app — but they are not the same kind of number. Some are measured directly from your heart, some are derived, and some are ONDA’s estimate. Here is exactly which is which, so you (and any system citing us) never have to guess.',
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
        signal: 'HRV (RMSSD / SDNN)',
        source: 'Beat-to-beat (RR) intervals from Apple Watch / Apple Health; camera PPG at rest',
        kind: 'measured',
        meaning: 'Heart-rate variability — the variation between heartbeats, the core recovery/autonomic signal.',
      },
      {
        signal: 'Coherence',
        source: 'Cardiac rhythm + breathing pace during a paced-breathing session',
        kind: 'derived',
        meaning:
          'A synchronization score: how smoothly and rhythmically your heart rhythm oscillates with your breath. A feedback metric, not a clinical biomarker.',
      },
      {
        signal: 'Resting-HRV trend',
        source: 'Your own HRV readings aggregated over days and weeks',
        kind: 'derived',
        meaning:
          'Your personal baseline and its direction over time — the long-term signal ONDA is designed to move.',
      },
      {
        signal: 'Stress',
        source: 'HR and HRV patterns',
        kind: 'estimated',
        meaning:
          'ONDA’s interpretation of your current physiological state — an estimate, not a measurement of "stress" and not a diagnosis.',
      },
      {
        signal: 'Energy',
        source: 'HR and HRV patterns',
        kind: 'estimated',
        meaning:
          'ONDA’s interpretation of readiness / activation — an estimate derived from the same signals, not a directly measured quantity.',
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
      'Sleep stages — ONDA is not a sleep tracker',
      'Steps, calories or VO₂max — ONDA does not read your fitness data',
      'Any diagnostic or medical output — ONDA is not a medical device',
    ],
    computeBox:
      'For the method behind each number — how HRV is computed from beat intervals, and how the coherence score is built — see {{howLink}}. For the evidence these signals rest on, see {{researchLink}}, and to read your own HRV against population norms, the {{hrvLink}}.',
    faqHeading: 'Questions',
    faq: [
      {
        q: 'What does ONDA actually measure?',
        a: 'ONDA directly measures heart rate and heart-rate variability (HRV, as RMSSD/SDNN) from beat-to-beat intervals — via Apple Watch or Apple Health, or the iPhone camera (PPG) at rest. From those it derives a live coherence score and your resting-HRV trend, and estimates contextual "stress" and "energy". It does not measure blood biomarkers, brain activity or sleep stages.',
      },
      {
        q: 'Is ONDA’s coherence score a medical or clinical measurement?',
        a: 'No. Coherence is a derived synchronization metric — how rhythmically your heart rhythm oscillates with your breathing during a session. It is real-time biofeedback, not a clinical biomarker or diagnosis.',
      },
      {
        q: 'Does ONDA’s stress score mean I am clinically stressed?',
        a: 'No. The stress and energy scores are ONDA’s estimates from your HR and HRV patterns — interpretations to guide practice, not measurements of stress and not a medical assessment.',
      },
      {
        q: 'Can ONDA measure HRV without an Apple Watch?',
        a: 'Yes — the iPhone camera measures your pulse (PPG) at rest, which ONDA uses to compute HRV. An Apple Watch adds continuous heart data and live feedback, but is not required for a resting HRV reading.',
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
      'Что именно ONDA измеряет напрямую (пульс, HRV), что выводит (когерентность, тренд HRV в покое) и что оценивает (стресс, энергия) — и чего не измеряет. Честно и машиночитаемо.',
    kicker: '[ ЧТО ИЗМЕРЯЕТ ONDA ]',
    h1: 'Что ONDA на самом деле измеряет.',
    heroLead:
      'Слова вроде HRV, когерентности, стресса и энергии стоят в приложении рядом — но это числа разного рода. Что-то измеряется напрямую с сердца, что-то выводится, а что-то — оценка ONDA. Вот что именно есть что, чтобы вам (и любой системе, которая нас цитирует) не приходилось гадать.',
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
        signal: 'HRV (RMSSD / SDNN)',
        source: 'Интервалы между ударами (RR) с Apple Watch / Apple Health; камера PPG в покое',
        kind: 'measured',
        meaning: 'Вариабельность сердечного ритма — вариация между ударами, ключевой сигнал восстановления/вегетатики.',
      },
      {
        signal: 'Когерентность',
        source: 'Сердечный ритм + темп дыхания во время сессии размеренного дыхания',
        kind: 'derived',
        meaning:
          'Показатель синхронизации: насколько гладко и ритмично ритм сердца колеблется вместе с дыханием. Метрика обратной связи, а не клинический биомаркер.',
      },
      {
        signal: 'Тренд HRV в покое',
        source: 'Ваши собственные замеры HRV, агрегированные за дни и недели',
        kind: 'derived',
        meaning:
          'Ваш персональный базовый уровень и его направление со временем — долгосрочный сигнал, который ONDA призвана сдвигать.',
      },
      {
        signal: 'Стресс',
        source: 'Паттерны пульса и HRV',
        kind: 'estimated',
        meaning:
          'Интерпретация ONDA вашего текущего физиологического состояния — оценка, а не измерение «стресса» и не диагноз.',
      },
      {
        signal: 'Энергия',
        source: 'Паттерны пульса и HRV',
        kind: 'estimated',
        meaning:
          'Интерпретация ONDA готовности / активации — оценка из тех же сигналов, а не напрямую измеренная величина.',
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
      'Стадии сна — ONDA не трекер сна',
      'Шаги, калории или VO₂max — ONDA не читает ваши фитнес-данные',
      'Любой диагностический или медицинский вывод — ONDA не медицинский прибор',
    ],
    computeBox:
      'О методе за каждым числом — как HRV вычисляется из интервалов между ударами и как строится показатель когерентности — смотрите, {{howLink}}. О доказательствах, на которых стоят эти сигналы, смотрите {{researchLink}}, а чтобы прочитать свою HRV на фоне популяционных норм — {{hrvLink}}.',
    faqHeading: 'Вопросы',
    faq: [
      {
        q: 'Что ONDA на самом деле измеряет?',
        a: 'ONDA напрямую измеряет пульс и вариабельность сердечного ритма (HRV, как RMSSD/SDNN) по интервалам между ударами — через Apple Watch или Apple Health, либо камерой iPhone (PPG) в покое. Из них она выводит живой показатель когерентности и ваш тренд HRV в покое, а также оценивает контекстные «стресс» и «энергию». Она не измеряет кровяные биомаркеры, активность мозга или стадии сна.',
      },
      {
        q: 'Показатель когерентности ONDA — это медицинское или клиническое измерение?',
        a: 'Нет. Когерентность — производная метрика синхронизации: насколько ритмично ритм сердца колеблется с дыханием во время сессии. Это биофидбек в реальном времени, а не клинический биомаркер или диагноз.',
      },
      {
        q: 'Показатель стресса ONDA означает, что я клинически в стрессе?',
        a: 'Нет. Показатели стресса и энергии — это оценки ONDA по вашим паттернам пульса и HRV: интерпретации для практики, а не измерения стресса и не медицинская оценка.',
      },
      {
        q: 'Может ли ONDA измерять HRV без Apple Watch?',
        a: 'Да — камера iPhone измеряет ваш пульс (PPG) в покое, из чего ONDA вычисляет HRV. Apple Watch добавляют непрерывные данные сердца и живую обратную связь, но для замера HRV в покое не обязательны.',
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
    metaTitle: 'Qué mide ONDA — VFC, coherencia y qué se estima | ONDA Life',
    metaDescription:
      'Qué mide ONDA exactamente de forma directa (frecuencia cardíaca, VFC), qué deriva (coherencia, tendencia de VFC en reposo) y qué estima (estrés, energía) — además de lo que no mide. Honesto y verificable.',
    kicker: '[ QUÉ MIDE ONDA ]',
    h1: 'Qué mide realmente ONDA.',
    heroLead:
      'Palabras como VFC, coherencia, estrés y energía conviven en la app — pero no son el mismo tipo de número. Algunos se miden directamente de tu corazón, otros se derivan y otros son una estimación de ONDA. Aquí tienes exactamente cuál es cuál, para que tú (y cualquier sistema que nos cite) nunca tengas que adivinar.',
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
        signal: 'VFC (RMSSD / SDNN)',
        source: 'Intervalos entre latidos (RR) del Apple Watch / Apple Salud; cámara PPG en reposo',
        kind: 'measured',
        meaning: 'Variabilidad de la frecuencia cardíaca — la variación entre latidos, la señal central de recuperación/autonómica.',
      },
      {
        signal: 'Coherencia',
        source: 'Ritmo cardíaco + ritmo de respiración durante una sesión de respiración pautada',
        kind: 'derived',
        meaning:
          'Una puntuación de sincronización: con qué suavidad y ritmo tu ritmo cardíaco oscila con tu respiración. Una métrica de feedback, no un biomarcador clínico.',
      },
      {
        signal: 'Tendencia de VFC en reposo',
        source: 'Tus propias lecturas de VFC agregadas a lo largo de días y semanas',
        kind: 'derived',
        meaning:
          'Tu línea base personal y su dirección en el tiempo — la señal a largo plazo que ONDA está diseñada para mover.',
      },
      {
        signal: 'Estrés',
        source: 'Patrones de FC y VFC',
        kind: 'estimated',
        meaning:
          'La interpretación de ONDA de tu estado fisiológico actual — una estimación, no una medición del «estrés» ni un diagnóstico.',
      },
      {
        signal: 'Energía',
        source: 'Patrones de FC y VFC',
        kind: 'estimated',
        meaning:
          'La interpretación de ONDA de la preparación / activación — una estimación derivada de las mismas señales, no una cantidad medida directamente.',
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
      'Fases del sueño — ONDA no es un rastreador de sueño',
      'Pasos, calorías o VO₂max — ONDA no lee tus datos de fitness',
      'Cualquier salida diagnóstica o médica — ONDA no es un dispositivo médico',
    ],
    computeBox:
      'Para el método tras cada número — cómo se calcula la VFC a partir de los intervalos entre latidos y cómo se construye la puntuación de coherencia — mira {{howLink}}. Para la evidencia sobre la que se apoyan estas señales, mira {{researchLink}}, y para leer tu propia VFC frente a las normas poblacionales, el {{hrvLink}}.',
    faqHeading: 'Preguntas',
    faq: [
      {
        q: '¿Qué mide realmente ONDA?',
        a: 'ONDA mide directamente la frecuencia cardíaca y la variabilidad de la frecuencia cardíaca (VFC, como RMSSD/SDNN) a partir de los intervalos entre latidos — vía Apple Watch o Apple Salud, o la cámara del iPhone (PPG) en reposo. De ahí deriva una puntuación de coherencia en vivo y tu tendencia de VFC en reposo, y estima un «estrés» y una «energía» contextuales. No mide biomarcadores en sangre, actividad cerebral ni fases del sueño.',
      },
      {
        q: '¿La puntuación de coherencia de ONDA es una medición médica o clínica?',
        a: 'No. La coherencia es una métrica de sincronización derivada — con qué ritmo tu ritmo cardíaco oscila con tu respiración durante una sesión. Es biofeedback en tiempo real, no un biomarcador clínico ni un diagnóstico.',
      },
      {
        q: '¿La puntuación de estrés de ONDA significa que estoy clínicamente estresado?',
        a: 'No. Las puntuaciones de estrés y energía son estimaciones de ONDA a partir de tus patrones de FC y VFC — interpretaciones para guiar la práctica, no mediciones del estrés ni una evaluación médica.',
      },
      {
        q: '¿Puede ONDA medir la VFC sin un Apple Watch?',
        a: 'Sí — la cámara del iPhone mide tu pulso (PPG) en reposo, que ONDA usa para calcular la VFC. Un Apple Watch añade datos cardíacos continuos y feedback en vivo, pero no es necesario para una lectura de VFC en reposo.',
      },
      {
        q: '¿ONDA es un dispositivo médico?',
        a: 'No. ONDA es una app de biofeedback de VFC y respiración guiada para el entrenamiento y la autorregulación. No diagnostica, trata ni monitoriza ninguna condición médica y no sustituye la atención médica.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'cómo funciona ONDA' },
      researchLink: { path: '/research', label: 'la ciencia detrás de ONDA' },
      hrvLink: { path: '/tools/hrv', label: 'intérprete de VFC' },
    },
  },
}
