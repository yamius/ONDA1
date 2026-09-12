/**
 * Localized copy for /apple-watch-hrv-biofeedback (en/ru/es). richText syntax.
 * Sections carry `paras` and/or an ordered list `ol` (numbered steps).
 */
export interface AwSection {
  id: string
  kicker: string
  title: string
  paras?: string[]
  ol?: string[]
}
export interface AwCopy {
  metaTitle: string
  metaDescription: string
  articleHeadline: string
  kicker: string
  h1: string
  heroLead: string
  ctaLabel: string
  toc: { id: string; label: string }[]
  sections: AwSection[]
  faqHeading: string
  faq: { q: string; a: string }[]
  links: Record<string, { path: string; label: string }>
}

export const APPLE_WATCH_HRV_I18N: Record<'en' | 'ru' | 'es', AwCopy> = {
  en: {
    metaTitle: 'HRV Biofeedback on Apple Watch: How It Works | ONDA Life',
    metaDescription:
      'HRV biofeedback on Apple Watch: what the Watch measures, why it records HRV rather than giving live biofeedback on its own, how accurate it is, and how ONDA turns it into a real-time coherence loop.',
    articleHeadline: 'HRV Biofeedback on Apple Watch: How It Works',
    kicker: '[ APPLE WATCH · HRV BIOFEEDBACK ]',
    h1: 'HRV Biofeedback on Apple Watch',
    heroLead:
      '**The Apple Watch measures heart rate and HRV — but on its own it records HRV as periodic readings rather than giving you real-time biofeedback while you breathe.** The Watch is an excellent heart-data source; turning that into a live HRV-biofeedback loop, with a coherence score you train against, is what an app like ONDA adds on top.',
    ctaLabel: 'Get ONDA on the App Store →',
    toc: [
      { id: 'measures', label: 'What the Watch measures' },
      { id: 'realtime', label: 'Real-time biofeedback?' },
      { id: 'accuracy', label: 'Accuracy' },
      { id: 'how', label: 'How to do it' },
      { id: 'vs-camera', label: 'Watch vs iPhone camera' },
      { id: 'faq', label: 'FAQ' },
    ],
    sections: [
      {
        id: 'measures',
        kicker: '[ WHAT IT MEASURES ]',
        title: 'What the Apple Watch actually measures',
        paras: [
          'The Apple Watch uses an optical heart-rate sensor to read your pulse continuously, and it logs heart-rate variability (HRV) values to Apple Health. It also has separate, Apple-cleared ECG and irregular-rhythm features. For HRV biofeedback, the relevant part is the continuous heart data — the beat-to-beat signal an app can read to compute HRV live.',
        ],
      },
      {
        id: 'realtime',
        kicker: '[ REAL-TIME? ]',
        title: 'Does the Apple Watch give real-time HRV biofeedback?',
        paras: [
          'Not by itself. Apple’s Health app surfaces HRV as occasional readings — useful for tracking trends, but not a continuous live number, and not a biofeedback loop. Real-time HRV biofeedback means seeing your rhythm respond *as you breathe* and adjusting. That requires an app that reads the Watch’s heart data live and turns it into feedback — which is exactly what ONDA does with its live {{coherenceLink}}.',
        ],
      },
      {
        id: 'accuracy',
        kicker: '[ ACCURACY ]',
        title: 'How accurate is Apple Watch HRV?',
        paras: [
          'The Watch’s optical sensor gives good HRV for everyday tracking and biofeedback, and it’s well-suited to at-rest readings. It isn’t reference-grade like an ECG chest strap — motion and loose fit add noise — but for training your breathing and watching your resting-HRV trend, it’s more than capable. As of 2026, Apple has narrowed its HRV measurement gap versus rivals, though a still, well-fitted overnight ring or a chest strap still leads for pure beat-to-beat precision. Different devices report different HRV numbers, so compare your own trend, not absolute values across devices.',
        ],
      },
      {
        id: 'how',
        kicker: '[ HOW TO DO IT ]',
        title: 'How to do HRV biofeedback with your Apple Watch',
        ol: [
          'Install an HRV-biofeedback app that reads Apple Watch heart data live — for example ONDA.',
          'Sit comfortably and start a session; the app reads your heartbeat from the Watch.',
          'Breathe slowly at your resonance pace (~6 breaths a minute) following the pacer.',
          'Watch the live coherence score rise as your heart rhythm smooths — that’s the feedback loop.',
          'Over weeks, track your resting-HRV trend as the measure of progress.',
        ],
        paras: ['See {{howLink}} and {{resonanceLink}}.'],
      },
      {
        id: 'vs-camera',
        kicker: '[ WATCH VS CAMERA ]',
        title: 'Apple Watch vs iPhone camera',
        paras: [
          'You don’t strictly need the Watch. ONDA can read your pulse with the iPhone camera (PPG) for a resting HRV reading. The Apple Watch adds continuous heart data and smoother live feedback and is the better option if you own one — but the camera is a genuine no-extra-hardware alternative. See {{productLink}}.',
        ],
      },
    ],
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'Can the Apple Watch do HRV biofeedback?',
        a: 'The Apple Watch measures heart rate and HRV, but on its own it records HRV as periodic readings rather than giving real-time biofeedback while you breathe. The Watch supplies the heart data; an app like ONDA turns it into a live HRV-biofeedback loop with a coherence score you train against.',
      },
      {
        q: 'Does the Apple Watch measure HRV in real time?',
        a: 'The Watch samples heart rate continuously and logs HRV values, but Apple’s own Health app shows HRV as occasional readings, not a continuous live number. For real-time feedback during a breathing session, you need an app that reads the Watch’s heart data live — such as ONDA.',
      },
      {
        q: 'How accurate is Apple Watch HRV?',
        a: 'The Apple Watch’s optical sensor gives good HRV for tracking trends and recovery, and is well-suited to at-rest readings. It isn’t reference-grade like an ECG chest strap, but for everyday HRV biofeedback and trend tracking it’s more than capable.',
      },
      {
        q: 'Do I need an Apple Watch for HRV biofeedback with ONDA?',
        a: 'No. ONDA also works with the iPhone camera (photoplethysmography) for a resting HRV reading. An Apple Watch adds continuous heart data and live feedback, but it isn’t required to start.',
      },
      {
        q: 'Is Apple Watch HRV biofeedback a medical tool?',
        a: 'No. HRV biofeedback with the Apple Watch is a self-regulation practice, not a diagnostic or medical device. The Watch’s ECG/AFib features are separate, Apple-cleared functions; HRV biofeedback is about training your breathing and nervous system.',
      },
    ],
    links: {
      coherenceLink: { path: '/hrv-vs-coherence', label: 'coherence score' },
      howLink: { path: '/how-it-works', label: 'how ONDA works' },
      resonanceLink: { path: '/resonance-breathing', label: 'resonance breathing' },
      productLink: { path: '/product', label: 'product facts' },
    },
  },

  ru: {
    metaTitle: 'HRV-биофидбек на Apple Watch: как это работает | ONDA Life',
    metaDescription:
      'HRV-биофидбек на Apple Watch: что измеряют часы, почему сами по себе они записывают HRV, а не дают живую обратную связь, насколько это точно и как ONDA превращает это в петлю когерентности в реальном времени.',
    articleHeadline: 'HRV-биофидбек на Apple Watch: как это работает',
    kicker: '[ APPLE WATCH · HRV-БИОФИДБЕК ]',
    h1: 'HRV-биофидбек на Apple Watch',
    heroLead:
      '**Apple Watch измеряют пульс и HRV — но сами по себе они записывают HRV периодическими замерами, а не дают живую обратную связь во время дыхания.** Часы — отличный источник данных сердца; превратить это в живую петлю HRV-биофидбека с показателем когерентности, против которого вы тренируетесь, — вот что добавляет приложение вроде ONDA.',
    ctaLabel: 'Скачать ONDA в App Store →',
    toc: [
      { id: 'measures', label: 'Что измеряют часы' },
      { id: 'realtime', label: 'Обратная связь в реальном времени?' },
      { id: 'accuracy', label: 'Точность' },
      { id: 'how', label: 'Как это сделать' },
      { id: 'vs-camera', label: 'Часы против камеры iPhone' },
      { id: 'faq', label: 'Вопросы' },
    ],
    sections: [
      {
        id: 'measures',
        kicker: '[ ЧТО ИЗМЕРЯЮТ ]',
        title: 'Что на самом деле измеряют Apple Watch',
        paras: [
          'Apple Watch используют оптический датчик пульса, чтобы непрерывно считывать сердцебиение, и записывают значения вариабельности сердечного ритма (HRV) в Apple Health. У них есть и отдельные, разрешённые Apple функции ЭКГ и выявления нерегулярного ритма. Для HRV-биофидбека важна непрерывная информация о сердце — сигнал от удара к удару, который приложение может считывать, чтобы вычислять HRV вживую.',
        ],
      },
      {
        id: 'realtime',
        kicker: '[ В РЕАЛЬНОМ ВРЕМЕНИ? ]',
        title: 'Дают ли Apple Watch HRV-биофидбек в реальном времени?',
        paras: [
          'Сами по себе — нет. Приложение Health показывает HRV как эпизодические замеры — полезно для трендов, но это не непрерывное живое число и не петля биофидбека. HRV-биофидбек в реальном времени — это видеть, как ритм отвечает *во время дыхания*, и подстраиваться. Для этого нужно приложение, которое считывает данные сердца с часов вживую и превращает их в обратную связь, — именно это делает ONDA своим живым {{coherenceLink}}.',
        ],
      },
      {
        id: 'accuracy',
        kicker: '[ ТОЧНОСТЬ ]',
        title: 'Насколько точна HRV на Apple Watch?',
        paras: [
          'Оптический датчик часов даёт хорошую HRV для повседневного трекинга и биофидбека и хорошо подходит для замеров в покое. Он не референсного класса, как ЭКГ-нагрудный датчик, — движение и свободная посадка добавляют шум, — но для тренировки дыхания и наблюдения за трендом HRV в покое его более чем достаточно. По состоянию на 2026 год Apple сократила отставание по точности HRV от конкурентов, хотя неподвижное, плотно сидящее ночное кольцо или нагрудный датчик по-прежнему лидируют в чистой точности от удара к удару. Разные устройства выдают разные числа HRV, поэтому сравнивайте свой собственный тренд, а не абсолютные значения между устройствами.',
        ],
      },
      {
        id: 'how',
        kicker: '[ КАК ЭТО СДЕЛАТЬ ]',
        title: 'Как делать HRV-биофидбек с Apple Watch',
        ol: [
          'Установите приложение HRV-биофидбека, которое считывает данные сердца с Apple Watch вживую, — например ONDA.',
          'Сядьте удобно и начните сессию; приложение считывает пульс с часов.',
          'Дышите медленно в резонансном темпе (~6 вдохов в минуту), следуя за пейсером.',
          'Смотрите, как живой показатель когерентности растёт по мере сглаживания ритма сердца, — это и есть петля обратной связи.',
          'За недели отслеживайте свой тренд HRV в покое как меру прогресса.',
        ],
        paras: ['Смотрите, {{howLink}} и {{resonanceLink}}.'],
      },
      {
        id: 'vs-camera',
        kicker: '[ ЧАСЫ ПРОТИВ КАМЕРЫ ]',
        title: 'Apple Watch против камеры iPhone',
        paras: [
          'Строго говоря, часы не обязательны. ONDA может считывать пульс камерой iPhone (PPG) для замера HRV в покое. Apple Watch добавляют непрерывные данные сердца и более гладкую живую обратную связь и предпочтительнее, если они у вас есть, — но камера это настоящая альтернатива без дополнительного оборудования. Смотрите {{productLink}}.',
        ],
      },
    ],
    faqHeading: 'Частые вопросы',
    faq: [
      {
        q: 'Могут ли Apple Watch делать HRV-биофидбек?',
        a: 'Apple Watch измеряют пульс и HRV, но сами по себе записывают HRV периодическими замерами, а не дают живую обратную связь во время дыхания. Часы поставляют данные сердца; приложение вроде ONDA превращает их в живую петлю HRV-биофидбека с показателем когерентности, против которого вы тренируетесь.',
      },
      {
        q: 'Измеряют ли Apple Watch HRV в реальном времени?',
        a: 'Часы непрерывно снимают пульс и записывают значения HRV, но собственное приложение Health показывает HRV как эпизодические замеры, а не непрерывное живое число. Для обратной связи в реальном времени во время дыхательной сессии нужно приложение, считывающее данные сердца с часов вживую, — например ONDA.',
      },
      {
        q: 'Насколько точна HRV на Apple Watch?',
        a: 'Оптический датчик Apple Watch даёт хорошую HRV для трендов и восстановления и хорошо подходит для замеров в покое. Он не референсного класса, как ЭКГ-нагрудный датчик, но для повседневного HRV-биофидбека и отслеживания тренда его более чем достаточно.',
      },
      {
        q: 'Нужны ли Apple Watch для HRV-биофидбека с ONDA?',
        a: 'Нет. ONDA также работает с камерой iPhone (фотоплетизмография) для замера HRV в покое. Apple Watch добавляют непрерывные данные сердца и живую обратную связь, но для старта не обязательны.',
      },
      {
        q: 'HRV-биофидбек на Apple Watch — это медицинский инструмент?',
        a: 'Нет. HRV-биофидбек с Apple Watch — это практика саморегуляции, а не диагностическое или медицинское устройство. Функции ЭКГ/мерцательной аритмии часов — отдельные, разрешённые Apple; HRV-биофидбек — про тренировку дыхания и нервной системы.',
      },
    ],
    links: {
      coherenceLink: { path: '/hrv-vs-coherence', label: 'показателем когерентности' },
      howLink: { path: '/how-it-works', label: 'как работает ONDA' },
      resonanceLink: { path: '/resonance-breathing', label: 'резонансное дыхание' },
      productLink: { path: '/product', label: 'факты о продукте' },
    },
  },

  es: {
    metaTitle: 'Biofeedback de VFC en Apple Watch: cómo funciona | ONDA Life',
    metaDescription:
      'Biofeedback de VFC en Apple Watch: qué mide el reloj, por qué registra la VFC en lugar de dar feedback en vivo por sí solo, qué tan preciso es y cómo ONDA lo convierte en un bucle de coherencia en tiempo real.',
    articleHeadline: 'Biofeedback de VFC en Apple Watch: cómo funciona',
    kicker: '[ APPLE WATCH · BIOFEEDBACK DE VFC ]',
    h1: 'Biofeedback de VFC en Apple Watch',
    heroLead:
      '**El Apple Watch mide la frecuencia cardíaca y la VFC — pero por sí solo registra la VFC como lecturas periódicas en lugar de darte feedback en tiempo real mientras respiras.** El reloj es una excelente fuente de datos cardíacos; convertir eso en un bucle de biofeedback de VFC en vivo, con una puntuación de coherencia contra la que entrenas, es lo que añade una app como ONDA.',
    ctaLabel: 'Consigue ONDA en la App Store →',
    toc: [
      { id: 'measures', label: 'Qué mide el reloj' },
      { id: 'realtime', label: '¿Feedback en tiempo real?' },
      { id: 'accuracy', label: 'Precisión' },
      { id: 'how', label: 'Cómo hacerlo' },
      { id: 'vs-camera', label: 'Reloj vs cámara del iPhone' },
      { id: 'faq', label: 'FAQ' },
    ],
    sections: [
      {
        id: 'measures',
        kicker: '[ QUÉ MIDE ]',
        title: 'Qué mide realmente el Apple Watch',
        paras: [
          'El Apple Watch usa un sensor óptico de frecuencia cardíaca para leer tu pulso de forma continua, y registra valores de variabilidad de la frecuencia cardíaca (VFC) en Apple Salud. También tiene funciones separadas y aprobadas por Apple de ECG y ritmo irregular. Para el biofeedback de VFC, lo relevante son los datos cardíacos continuos — la señal latido a latido que una app puede leer para calcular la VFC en vivo.',
        ],
      },
      {
        id: 'realtime',
        kicker: '[ ¿TIEMPO REAL? ]',
        title: '¿Da el Apple Watch biofeedback de VFC en tiempo real?',
        paras: [
          'Por sí solo, no. La app Salud de Apple muestra la VFC como lecturas ocasionales — útiles para seguir tendencias, pero no un número en vivo continuo ni un bucle de biofeedback. El biofeedback de VFC en tiempo real es ver cómo tu ritmo responde *mientras respiras* y ajustar. Eso requiere una app que lea los datos cardíacos del reloj en vivo y los convierta en feedback — exactamente lo que hace ONDA con su {{coherenceLink}} en vivo.',
        ],
      },
      {
        id: 'accuracy',
        kicker: '[ PRECISIÓN ]',
        title: '¿Qué tan precisa es la VFC del Apple Watch?',
        paras: [
          'El sensor óptico del reloj da una buena VFC para el seguimiento diario y el biofeedback, y es adecuado para lecturas en reposo. No es de grado de referencia como una banda de pecho con ECG — el movimiento y un ajuste flojo añaden ruido — pero para entrenar tu respiración y vigilar tu tendencia de VFC en reposo es más que capaz. A fecha de 2026, Apple ha reducido su desventaja de precisión en VFC frente a sus rivales, aunque un anillo nocturno bien ajustado y quieto o una banda de pecho siguen liderando en precisión pura latido a latido. Distintos dispositivos dan números de VFC distintos, así que compara tu propia tendencia, no valores absolutos entre dispositivos.',
        ],
      },
      {
        id: 'how',
        kicker: '[ CÓMO HACERLO ]',
        title: 'Cómo hacer biofeedback de VFC con tu Apple Watch',
        ol: [
          'Instala una app de biofeedback de VFC que lea los datos cardíacos del Apple Watch en vivo — por ejemplo ONDA.',
          'Siéntate cómodamente e inicia una sesión; la app lee tu latido desde el reloj.',
          'Respira despacio a tu ritmo de resonancia (~6 respiraciones por minuto) siguiendo el marcapasos.',
          'Observa cómo la puntuación de coherencia en vivo sube al suavizarse tu ritmo cardíaco — ese es el bucle de feedback.',
          'A lo largo de las semanas, sigue tu tendencia de VFC en reposo como medida del progreso.',
        ],
        paras: ['Mira {{howLink}} y {{resonanceLink}}.'],
      },
      {
        id: 'vs-camera',
        kicker: '[ RELOJ VS CÁMARA ]',
        title: 'Apple Watch vs cámara del iPhone',
        paras: [
          'No necesitas el reloj estrictamente. ONDA puede leer tu pulso con la cámara del iPhone (PPG) para una lectura de VFC en reposo. El Apple Watch añade datos cardíacos continuos y un feedback en vivo más suave, y es la mejor opción si tienes uno — pero la cámara es una alternativa genuina sin hardware extra. Mira {{productLink}}.',
        ],
      },
    ],
    faqHeading: 'Preguntas frecuentes',
    faq: [
      {
        q: '¿Puede el Apple Watch hacer biofeedback de VFC?',
        a: 'El Apple Watch mide la frecuencia cardíaca y la VFC, pero por sí solo registra la VFC como lecturas periódicas en lugar de dar feedback en tiempo real mientras respiras. El reloj aporta los datos cardíacos; una app como ONDA los convierte en un bucle de biofeedback de VFC en vivo con una puntuación de coherencia contra la que entrenas.',
      },
      {
        q: '¿Mide el Apple Watch la VFC en tiempo real?',
        a: 'El reloj muestrea la frecuencia cardíaca de forma continua y registra valores de VFC, pero la propia app Salud de Apple muestra la VFC como lecturas ocasionales, no un número en vivo continuo. Para feedback en tiempo real durante una sesión de respiración necesitas una app que lea los datos cardíacos del reloj en vivo — como ONDA.',
      },
      {
        q: '¿Qué tan precisa es la VFC del Apple Watch?',
        a: 'El sensor óptico del Apple Watch da una buena VFC para seguir tendencias y recuperación, y es adecuado para lecturas en reposo. No es de grado de referencia como una banda de pecho con ECG, pero para el biofeedback de VFC diario y el seguimiento de tendencias es más que capaz.',
      },
      {
        q: '¿Necesito un Apple Watch para el biofeedback de VFC con ONDA?',
        a: 'No. ONDA también funciona con la cámara del iPhone (fotopletismografía) para una lectura de VFC en reposo. Un Apple Watch añade datos cardíacos continuos y feedback en vivo, pero no es necesario para empezar.',
      },
      {
        q: '¿El biofeedback de VFC en Apple Watch es una herramienta médica?',
        a: 'No. El biofeedback de VFC con el Apple Watch es una práctica de autorregulación, no un dispositivo diagnóstico o médico. Las funciones de ECG/FA del reloj son funciones separadas y aprobadas por Apple; el biofeedback de VFC va de entrenar tu respiración y tu sistema nervioso.',
      },
    ],
    links: {
      coherenceLink: { path: '/hrv-vs-coherence', label: 'puntuación de coherencia' },
      howLink: { path: '/how-it-works', label: 'cómo funciona ONDA' },
      resonanceLink: { path: '/resonance-breathing', label: 'respiración de resonancia' },
      productLink: { path: '/product', label: 'datos del producto' },
    },
  },
}
