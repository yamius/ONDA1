/**
 * Localized copy for the /hrv-biofeedback cornerstone. en (source of truth) +
 * ru + es. Prose uses the richText mini-syntax: **bold**, *emphasis*, and
 * {{linkKey}} tokens resolved against `links` (EN path + localized label,
 * langHref applied at render). Drives both the page render and the localized
 * Article + FAQPage JSON-LD (single source, no drift).
 */
export interface CornerstoneSection {
  id: string
  kicker: string
  title: string
  paras: string[]
  box?: { label: string; text: string }
}
export interface CornerstoneCopy {
  metaTitle: string
  metaDescription: string
  articleHeadline: string
  kicker: string
  h1: string
  heroLead: string
  toc: { id: string; label: string }[]
  sections: CornerstoneSection[]
  limits: { id: string; kicker: string; title: string; items: string[] }
  research: { id: string; kicker: string; title: string; intro: string; more: string }
  faqHeading: string
  faq: { q: string; a: string }[]
  /** linkKey → { path (EN internal path, langHref'd at render), localized label }. */
  links: Record<string, { path: string; label: string }>
}

const TOC_IDS = ['how', 'evidence', 'what-hrv-tells', 'vs-tracking', 'onda', 'limits', 'research', 'faq'] as const

export const HRV_BIOFEEDBACK_I18N: Record<'en' | 'ru' | 'es', CornerstoneCopy> = {
  en: {
    metaTitle: 'HRV Biofeedback: How It Works & the Evidence | ONDA Life',
    metaDescription:
      'HRV biofeedback explained: what it is, how the real-time feedback loop works, what the evidence supports, how it differs from HRV tracking, and how ONDA implements it. Honest and cited.',
    articleHeadline: 'HRV Biofeedback: What It Is, How It Works, and How ONDA Uses It',
    kicker: '[ HRV BIOFEEDBACK ]',
    h1: 'HRV Biofeedback: What It Is, How It Works, and How ONDA Uses It',
    heroLead:
      '**HRV biofeedback is a technique in which you see your heart-rate variability in real time and adjust your breathing in response** — typically breathing slowly at your resonance frequency (about six breaths a minute). The live feedback closes a loop: you can watch your heart rhythm smooth into a clean wave as you breathe, which trains the autonomic nervous system rather than just measuring it.',
    toc: [
      { id: 'how', label: 'How it works' },
      { id: 'evidence', label: 'The evidence' },
      { id: 'what-hrv-tells', label: 'What HRV tells you' },
      { id: 'vs-tracking', label: 'vs HRV tracking' },
      { id: 'onda', label: 'How ONDA does it' },
      { id: 'limits', label: 'Limitations' },
      { id: 'research', label: 'Research' },
      { id: 'faq', label: 'FAQ' },
    ],
    sections: [
      {
        id: 'how',
        kicker: '[ HOW IT WORKS ]',
        title: 'How HRV biofeedback works',
        paras: [
          'Your heart doesn’t beat like a metronome. The time between beats speeds up slightly as you inhale and slows as you exhale — a rhythm called respiratory sinus arrhythmia. HRV biofeedback uses that link: when you breathe slowly and evenly at your resonance frequency, the heart-rate oscillation grows large and smooth, and the baroreflex (the body’s blood-pressure feedback loop) is strongly engaged.',
          'A biofeedback app measures your heartbeat, computes HRV or a coherence score from the beat-to-beat intervals, and shows it back to you live. You adjust your breathing to make the signal smoother — and the feedback loop teaches your nervous system a state it can learn to reach on its own. See {{howLink}}.',
        ],
      },
      {
        id: 'evidence',
        kicker: '[ THE EVIDENCE ]',
        title: 'What the evidence says',
        paras: [
          'The core mechanism is well supported. Paced breathing near resonance frequency reliably increases HRV during a session and engages the parasympathetic (“rest and digest”) branch, and HRV biofeedback is an established technique for improving vagal tone and stress resilience — not just measuring it (Lehrer & Gevirtz, 2014; Thayer et al., 2009).',
          'What’s *less* certain is the size and durability of long-term change: how much a given person’s resting baseline shifts, and how that translates to specific health outcomes, varies and is still an active research question. We keep those two registers separate on the {{researchLink}}.',
        ],
      },
      {
        id: 'what-hrv-tells',
        kicker: '[ THE SIGNAL ]',
        title: 'What HRV does — and doesn’t — tell you',
        paras: [
          'HRV is a useful window on the autonomic nervous system: higher short-term HRV (RMSSD) generally reflects stronger parasympathetic activity and better recovery *within a person*. It tends to fall under stress, illness, poor sleep or alcohol, and rise when you’re recovered.',
          'But HRV is not a diagnosis, not a measure of “stress” by itself, and not very meaningful compared between different people — it’s influenced by age, genetics, measurement method and position. Your own trend, read consistently, is what matters. See exactly {{measuresLink}}.',
        ],
      },
      {
        id: 'vs-tracking',
        kicker: '[ TRACKING VS TRAINING ]',
        title: 'HRV tracking vs HRV biofeedback',
        paras: [
          'These get confused constantly. **HRV tracking** is passive — a ring or band records your HRV, usually overnight, so you can watch trends. It tells you how you recovered. **HRV biofeedback** is active — you get live feedback while you breathe and train your heart rhythm in the moment. It gives you something to *do* about your state.',
          'They’re complementary: many people track with a wearable and train with a biofeedback app. See the {{compareActiveLink}}.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ HOW ONDA DOES IT ]',
        title: 'How ONDA implements HRV biofeedback',
        paras: [
          'ONDA is an HRV biofeedback and guided-breathing app. It reads your heartbeat from the iPhone camera (photoplethysmography) or an Apple Watch, computes HRV and a live coherence score, and shows your heart rhythm responding as you breathe at your resonance pace — inside a guided, progressive 8-level practice. You see your body organise in real time; that’s the loop that makes it a trainer, not a passive tracker.',
          'It’s free to start, with no account. See the full {{productLink}}, or how ONDA compares in the {{compareBestLink}}.',
        ],
        box: {
          label: 'Devices:',
          text: ' iPhone (camera pulse / PPG), iPad, and Apple Watch. No chest strap or dedicated wearable required. Android is on a waitlist.',
        },
      },
    ],
    limits: {
      id: 'limits',
      kicker: '[ LIMITATIONS ]',
      title: 'Limitations and honest caveats',
      items: [
        'HRV biofeedback trains self-regulation; it is not a treatment for any medical condition.',
        'A live coherence score is a practice metric, not a clinical biomarker.',
        'Camera-based HRV is best at rest; motion and poor signal reduce accuracy.',
        'Long-term baseline change varies between people and is not guaranteed.',
        'ONDA is not a medical device and does not diagnose, treat or monitor any condition.',
      ],
    },
    research: {
      id: 'research',
      kicker: '[ RESEARCH ]',
      title: 'Research',
      intro: 'The mechanisms above rest on published work. Each reference is verified.',
      more: 'More on the evidence and its limits: {{researchMoreLink}}.',
    },
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'What is HRV biofeedback?',
        a: 'HRV biofeedback is a technique in which you see your heart-rate variability in real time and adjust your breathing in response — usually breathing slowly at your resonance frequency. The live feedback closes a loop that trains the autonomic nervous system, rather than just recording it.',
      },
      {
        q: 'Does HRV biofeedback actually work?',
        a: 'The acute effect is well established: paced breathing at resonance frequency raises HRV during the session and engages the parasympathetic system. Longer-term benefits for stress and self-regulation are supported but vary between people. It is one of the most evidence-grounded, low-risk self-regulation techniques available.',
      },
      {
        q: 'What is the difference between HRV biofeedback and HRV tracking?',
        a: 'HRV tracking passively records your HRV (often overnight) so you can watch trends — what rings and bands do. HRV biofeedback is active: you get live feedback while you breathe and train your heart rhythm in the moment. Tracking tells you how you recovered; biofeedback gives you something to do about it.',
      },
      {
        q: 'Do I need a chest strap for HRV biofeedback?',
        a: 'Not always. A chest strap gives the most accurate signal, but apps like ONDA use the iPhone camera (photoplethysmography) or an Apple Watch to give usable real-time feedback with no extra hardware.',
      },
      {
        q: 'How long does HRV biofeedback take to work?',
        a: 'You feel the acute effect immediately — HRV rises within a single session. Changes in your resting baseline, where they happen, tend to show over weeks of consistent practice rather than days, and the size of the change varies between people.',
      },
      {
        q: 'Is ONDA HRV biofeedback?',
        a: 'Yes. ONDA is an HRV biofeedback and guided-breathing app: it shows a live coherence score and your heart-rhythm response as you breathe, using the iPhone camera or an Apple Watch, inside a guided practice. It is not a medical device.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'how ONDA computes it' },
      researchLink: { path: '/research', label: 'evidence page' },
      measuresLink: { path: '/measurements', label: 'what ONDA measures' },
      compareActiveLink: { path: '/compare/best-active-hrv-training-apps', label: 'best active HRV training apps' },
      productLink: { path: '/product', label: 'product facts' },
      compareBestLink: { path: '/compare/best-hrv-biofeedback-apps', label: 'best HRV biofeedback apps' },
      researchMoreLink: { path: '/research', label: 'the science behind ONDA' },
    },
  },

  ru: {
    metaTitle: 'HRV-биофидбек: как работает и что говорят исследования | ONDA Life',
    metaDescription:
      'HRV-биофидбек простыми словами: что это, как работает петля обратной связи в реальном времени, что подтверждают исследования, чем отличается от трекинга HRV и как это реализует ONDA. Честно и со ссылками.',
    articleHeadline: 'HRV-биофидбек: что это, как работает и как его использует ONDA',
    kicker: '[ HRV-БИОФИДБЕК ]',
    h1: 'HRV-биофидбек: что это, как работает и как его использует ONDA',
    heroLead:
      '**HRV-биофидбек — это техника, в которой вы видите свою вариабельность сердечного ритма в реальном времени и в ответ подстраиваете дыхание** — обычно дышите медленно на своей резонансной частоте (около шести вдохов в минуту). Живая обратная связь замыкает петлю: вы наблюдаете, как ритм сердца сглаживается в чистую волну при дыхании, — и это тренирует вегетативную нервную систему, а не просто её измеряет.',
    toc: [
      { id: 'how', label: 'Как работает' },
      { id: 'evidence', label: 'Доказательства' },
      { id: 'what-hrv-tells', label: 'Что показывает HRV' },
      { id: 'vs-tracking', label: 'против трекинга HRV' },
      { id: 'onda', label: 'Как делает ONDA' },
      { id: 'limits', label: 'Ограничения' },
      { id: 'research', label: 'Исследования' },
      { id: 'faq', label: 'Вопросы' },
    ],
    sections: [
      {
        id: 'how',
        kicker: '[ КАК РАБОТАЕТ ]',
        title: 'Как работает HRV-биофидбек',
        paras: [
          'Сердце бьётся не как метроном. Время между ударами чуть ускоряется на вдохе и замедляется на выдохе — этот ритм называют дыхательной синусовой аритмией. HRV-биофидбек использует эту связь: когда вы дышите медленно и ровно на своей резонансной частоте, колебание частоты сердца становится большим и гладким, и сильно вовлекается барорефлекс (петля обратной связи по артериальному давлению).',
          'Приложение биофидбека измеряет ваш пульс, вычисляет HRV или показатель когерентности по интервалам между ударами и показывает это вам вживую. Вы подстраиваете дыхание, чтобы сигнал стал глаже, — и петля обратной связи учит нервную систему состоянию, к которому она затем может приходить сама. Смотрите, {{howLink}}.',
        ],
      },
      {
        id: 'evidence',
        kicker: '[ ДОКАЗАТЕЛЬСТВА ]',
        title: 'Что говорят исследования',
        paras: [
          'Основной механизм хорошо подтверждён. Размеренное дыхание около резонансной частоты надёжно повышает HRV во время сессии и включает парасимпатическую («отдыхай и восстанавливайся») ветвь, а HRV-биофидбек — устоявшаяся техника улучшения вагального тонуса и стрессоустойчивости, а не только их измерения (Lehrer & Gevirtz, 2014; Thayer et al., 2009).',
          '*Менее* определённы величина и стойкость долгосрочных изменений: насколько сдвигается базовый уровень конкретного человека в покое и как это переходит в конкретные показатели здоровья — варьируется и остаётся активным исследовательским вопросом. Эти два регистра мы держим раздельно на {{researchLink}}.',
        ],
      },
      {
        id: 'what-hrv-tells',
        kicker: '[ СИГНАЛ ]',
        title: 'Что HRV показывает — а что нет',
        paras: [
          'HRV — полезное окно в вегетативную нервную систему: более высокая краткосрочная HRV (RMSSD) обычно отражает более сильную парасимпатическую активность и лучшее восстановление *в пределах одного человека*. Она склонна падать при стрессе, болезни, плохом сне или алкоголе и расти, когда вы восстановились.',
          'Но HRV — это не диагноз, не мера «стресса» сама по себе и мало осмысленна при сравнении разных людей: на неё влияют возраст, генетика, метод и поза при измерении. Важен ваш собственный тренд, считанный единообразно. Смотрите точно, {{measuresLink}}.',
        ],
      },
      {
        id: 'vs-tracking',
        kicker: '[ ТРЕКИНГ ПРОТИВ ТРЕНИРОВКИ ]',
        title: 'Трекинг HRV против HRV-биофидбека',
        paras: [
          'Их постоянно путают. **Трекинг HRV** пассивен — кольцо или браслет записывает вашу HRV, обычно ночью, чтобы вы смотрели тренды. Он говорит, как вы восстановились. **HRV-биофидбек** активен — вы получаете живую обратную связь во время дыхания и тренируете ритм сердца в моменте. Он даёт то, что можно *сделать* со своим состоянием.',
          'Они дополняют друг друга: многие отслеживают носимым устройством и тренируются в приложении биофидбека. Смотрите {{compareActiveLink}}.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ КАК ДЕЛАЕТ ONDA ]',
        title: 'Как ONDA реализует HRV-биофидбек',
        paras: [
          'ONDA — приложение HRV-биофидбека и направляемого дыхания. Оно считывает пульс с камеры iPhone (фотоплетизмография) или с Apple Watch, вычисляет HRV и живой показатель когерентности и показывает, как ритм сердца отвечает на дыхание в резонансном темпе, — внутри направляемой прогрессивной практики из 8 уровней. Вы видите, как тело организуется в реальном времени; это и есть петля, делающая ONDA тренажёром, а не пассивным трекером.',
          'Начать бесплатно, без аккаунта. Смотрите полные {{productLink}} или как ONDA сравнивается в {{compareBestLink}}.',
        ],
        box: {
          label: 'Устройства:',
          text: ' iPhone (пульс по камере / PPG), iPad и Apple Watch. Нагрудный датчик или отдельный носимый не нужны. Android — в листе ожидания.',
        },
      },
    ],
    limits: {
      id: 'limits',
      kicker: '[ ОГРАНИЧЕНИЯ ]',
      title: 'Ограничения и честные оговорки',
      items: [
        'HRV-биофидбек тренирует саморегуляцию; это не лечение какого-либо заболевания.',
        'Живой показатель когерентности — метрика для практики, а не клинический биомаркер.',
        'HRV по камере лучше всего работает в покое; движение и плохой сигнал снижают точность.',
        'Долгосрочное изменение базового уровня варьируется у разных людей и не гарантировано.',
        'ONDA не является медицинским прибором и не диагностирует, не лечит и не мониторит какое-либо состояние.',
      ],
    },
    research: {
      id: 'research',
      kicker: '[ ИССЛЕДОВАНИЯ ]',
      title: 'Исследования',
      intro: 'Механизмы выше опираются на опубликованные работы. Каждая ссылка проверена.',
      more: 'Подробнее о доказательствах и их пределах: {{researchMoreLink}}.',
    },
    faqHeading: 'Частые вопросы',
    faq: [
      {
        q: 'Что такое HRV-биофидбек?',
        a: 'HRV-биофидбек — это техника, в которой вы видите вариабельность сердечного ритма в реальном времени и в ответ подстраиваете дыхание — обычно дышите медленно на своей резонансной частоте. Живая обратная связь замыкает петлю, которая тренирует вегетативную нервную систему, а не просто её записывает.',
      },
      {
        q: 'HRV-биофидбек действительно работает?',
        a: 'Острый эффект хорошо установлен: размеренное дыхание на резонансной частоте повышает HRV во время сессии и включает парасимпатическую систему. Долгосрочная польза для стресса и саморегуляции подтверждается, но варьируется у разных людей. Это одна из самых доказательно обоснованных и низкорисковых техник саморегуляции.',
      },
      {
        q: 'В чём разница между HRV-биофидбеком и трекингом HRV?',
        a: 'Трекинг HRV пассивно записывает вашу HRV (часто ночью), чтобы вы видели тренды, — это делают кольца и браслеты. HRV-биофидбек активен: вы получаете живую обратную связь во время дыхания и тренируете ритм сердца в моменте. Трекинг говорит, как вы восстановились; биофидбек даёт то, что с этим сделать.',
      },
      {
        q: 'Нужен ли нагрудный датчик для HRV-биофидбека?',
        a: 'Не всегда. Нагрудный датчик даёт самый точный сигнал, но приложения вроде ONDA используют камеру iPhone (фотоплетизмография) или Apple Watch, давая пригодную обратную связь в реальном времени без дополнительного оборудования.',
      },
      {
        q: 'Сколько нужно времени, чтобы HRV-биофидбек сработал?',
        a: 'Острый эффект вы чувствуете сразу — HRV повышается в пределах одной сессии. Изменения базового уровня в покое, где они происходят, обычно проявляются за недели регулярной практики, а не за дни, и величина изменения варьируется у разных людей.',
      },
      {
        q: 'ONDA — это HRV-биофидбек?',
        a: 'Да. ONDA — приложение HRV-биофидбека и направляемого дыхания: оно показывает живой показатель когерентности и отклик ритма сердца на ваше дыхание, используя камеру iPhone или Apple Watch, внутри направляемой практики. Это не медицинский прибор.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'как ONDA это вычисляет' },
      researchLink: { path: '/research', label: 'странице о доказательствах' },
      measuresLink: { path: '/measurements', label: 'что измеряет ONDA' },
      compareActiveLink: { path: '/compare/best-active-hrv-training-apps', label: 'лучшие приложения для активной тренировки HRV' },
      productLink: { path: '/product', label: 'факты о продукте' },
      compareBestLink: { path: '/compare/best-hrv-biofeedback-apps', label: 'лучших приложениях HRV-биофидбека' },
      researchMoreLink: { path: '/research', label: 'науке за ONDA' },
    },
  },

  es: {
    metaTitle: 'Biofeedback de VFC: cómo funciona y qué dice la evidencia | ONDA Life',
    metaDescription:
      'El biofeedback de VFC explicado: qué es, cómo funciona el bucle de feedback en tiempo real, qué respalda la evidencia, en qué se diferencia del seguimiento de VFC y cómo lo implementa ONDA. Honesto y citado.',
    articleHeadline: 'Biofeedback de VFC: qué es, cómo funciona y cómo lo usa ONDA',
    kicker: '[ BIOFEEDBACK DE VFC ]',
    h1: 'Biofeedback de VFC: qué es, cómo funciona y cómo lo usa ONDA',
    heroLead:
      '**El biofeedback de VFC es una técnica en la que ves tu variabilidad de la frecuencia cardíaca en tiempo real y ajustas la respiración en respuesta** — normalmente respirando despacio a tu frecuencia de resonancia (unas seis respiraciones por minuto). El feedback en vivo cierra un bucle: puedes ver cómo tu ritmo cardíaco se suaviza en una onda limpia mientras respiras, lo que entrena el sistema nervioso autónomo en lugar de solo medirlo.',
    toc: [
      { id: 'how', label: 'Cómo funciona' },
      { id: 'evidence', label: 'La evidencia' },
      { id: 'what-hrv-tells', label: 'Qué dice la VFC' },
      { id: 'vs-tracking', label: 'vs seguimiento de VFC' },
      { id: 'onda', label: 'Cómo lo hace ONDA' },
      { id: 'limits', label: 'Limitaciones' },
      { id: 'research', label: 'Investigación' },
      { id: 'faq', label: 'FAQ' },
    ],
    sections: [
      {
        id: 'how',
        kicker: '[ CÓMO FUNCIONA ]',
        title: 'Cómo funciona el biofeedback de VFC',
        paras: [
          'Tu corazón no late como un metrónomo. El tiempo entre latidos se acelera ligeramente al inhalar y se ralentiza al exhalar — un ritmo llamado arritmia sinusal respiratoria. El biofeedback de VFC usa ese vínculo: cuando respiras despacio y de forma pareja a tu frecuencia de resonancia, la oscilación de la frecuencia cardíaca se vuelve amplia y suave, y el barorreflejo (el bucle de retroalimentación de la presión arterial del cuerpo) se activa con fuerza.',
          'Una app de biofeedback mide tu latido, calcula la VFC o una puntuación de coherencia a partir de los intervalos entre latidos y te la muestra en vivo. Ajustas la respiración para suavizar la señal — y el bucle de feedback enseña a tu sistema nervioso un estado al que luego puede llegar por sí solo. Mira {{howLink}}.',
        ],
      },
      {
        id: 'evidence',
        kicker: '[ LA EVIDENCIA ]',
        title: 'Qué dice la evidencia',
        paras: [
          'El mecanismo central está bien respaldado. La respiración pautada cerca de la frecuencia de resonancia aumenta de forma fiable la VFC durante una sesión y activa la rama parasimpática («descanso y digestión»), y el biofeedback de VFC es una técnica establecida para mejorar el tono vagal y la resiliencia al estrés — no solo para medirlos (Lehrer & Gevirtz, 2014; Thayer et al., 2009).',
          'Lo *menos* seguro es el tamaño y la durabilidad del cambio a largo plazo: cuánto se desplaza la línea base en reposo de una persona, y cómo se traduce en resultados de salud concretos, varía y sigue siendo una pregunta de investigación abierta. Mantenemos esos dos registros separados en la {{researchLink}}.',
        ],
      },
      {
        id: 'what-hrv-tells',
        kicker: '[ LA SEÑAL ]',
        title: 'Qué dice — y qué no — la VFC',
        paras: [
          'La VFC es una ventana útil al sistema nervioso autónomo: una VFC a corto plazo más alta (RMSSD) suele reflejar mayor actividad parasimpática y mejor recuperación *dentro de una misma persona*. Tiende a bajar con el estrés, la enfermedad, el mal sueño o el alcohol, y a subir cuando estás recuperado.',
          'Pero la VFC no es un diagnóstico, no es una medida del «estrés» por sí sola y tiene poco sentido comparada entre personas distintas — influyen la edad, la genética, el método y la postura de medición. Lo que importa es tu propia tendencia, leída de forma constante. Mira exactamente {{measuresLink}}.',
        ],
      },
      {
        id: 'vs-tracking',
        kicker: '[ SEGUIMIENTO VS ENTRENAMIENTO ]',
        title: 'Seguimiento de VFC vs biofeedback de VFC',
        paras: [
          'Se confunden constantemente. El **seguimiento de VFC** es pasivo — un anillo o una banda registra tu VFC, normalmente de noche, para que veas tendencias. Te dice cómo te recuperaste. El **biofeedback de VFC** es activo — recibes feedback en vivo mientras respiras y entrenas tu ritmo cardíaco en el momento. Te da algo que *hacer* con tu estado.',
          'Son complementarios: mucha gente hace seguimiento con un wearable y entrena con una app de biofeedback. Mira las {{compareActiveLink}}.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ CÓMO LO HACE ONDA ]',
        title: 'Cómo implementa ONDA el biofeedback de VFC',
        paras: [
          'ONDA es una app de biofeedback de VFC y respiración guiada. Lee tu latido desde la cámara del iPhone (fotopletismografía) o un Apple Watch, calcula la VFC y una puntuación de coherencia en vivo, y muestra cómo tu ritmo cardíaco responde mientras respiras a tu ritmo de resonancia — dentro de una práctica guiada y progresiva de 8 niveles. Ves cómo tu cuerpo se organiza en tiempo real; ese es el bucle que la convierte en un entrenador, no en un rastreador pasivo.',
          'Es gratis para empezar, sin cuenta. Mira los {{productLink}} completos, o cómo se compara ONDA en las {{compareBestLink}}.',
        ],
        box: {
          label: 'Dispositivos:',
          text: ' iPhone (pulso por cámara / PPG), iPad y Apple Watch. No hace falta banda de pecho ni wearable dedicado. Android está en lista de espera.',
        },
      },
    ],
    limits: {
      id: 'limits',
      kicker: '[ LIMITACIONES ]',
      title: 'Limitaciones y salvedades honestas',
      items: [
        'El biofeedback de VFC entrena la autorregulación; no es un tratamiento para ninguna condición médica.',
        'Una puntuación de coherencia en vivo es una métrica de práctica, no un biomarcador clínico.',
        'La VFC por cámara funciona mejor en reposo; el movimiento y una señal pobre reducen la precisión.',
        'El cambio de la línea base a largo plazo varía entre personas y no está garantizado.',
        'ONDA no es un dispositivo médico y no diagnostica, trata ni monitoriza ninguna condición.',
      ],
    },
    research: {
      id: 'research',
      kicker: '[ INVESTIGACIÓN ]',
      title: 'Investigación',
      intro: 'Los mecanismos anteriores se apoyan en trabajo publicado. Cada referencia está verificada.',
      more: 'Más sobre la evidencia y sus límites: {{researchMoreLink}}.',
    },
    faqHeading: 'Preguntas frecuentes',
    faq: [
      {
        q: '¿Qué es el biofeedback de VFC?',
        a: 'El biofeedback de VFC es una técnica en la que ves tu variabilidad de la frecuencia cardíaca en tiempo real y ajustas la respiración en respuesta — normalmente respirando despacio a tu frecuencia de resonancia. El feedback en vivo cierra un bucle que entrena el sistema nervioso autónomo, en lugar de solo registrarlo.',
      },
      {
        q: '¿El biofeedback de VFC funciona de verdad?',
        a: 'El efecto agudo está bien establecido: la respiración pautada a la frecuencia de resonancia eleva la VFC durante la sesión y activa el sistema parasimpático. Los beneficios a largo plazo para el estrés y la autorregulación tienen respaldo pero varían entre personas. Es una de las técnicas de autorregulación mejor fundamentadas y de bajo riesgo que existen.',
      },
      {
        q: '¿Cuál es la diferencia entre biofeedback de VFC y seguimiento de VFC?',
        a: 'El seguimiento de VFC registra tu VFC de forma pasiva (a menudo de noche) para que veas tendencias — lo que hacen los anillos y las bandas. El biofeedback de VFC es activo: recibes feedback en vivo mientras respiras y entrenas tu ritmo cardíaco en el momento. El seguimiento te dice cómo te recuperaste; el biofeedback te da algo que hacer al respecto.',
      },
      {
        q: '¿Necesito una banda de pecho para el biofeedback de VFC?',
        a: 'No siempre. Una banda de pecho da la señal más precisa, pero apps como ONDA usan la cámara del iPhone (fotopletismografía) o un Apple Watch para dar feedback en tiempo real utilizable sin hardware extra.',
      },
      {
        q: '¿Cuánto tarda en funcionar el biofeedback de VFC?',
        a: 'El efecto agudo lo sientes de inmediato — la VFC sube dentro de una sola sesión. Los cambios en tu línea base en reposo, cuando ocurren, suelen aparecer tras semanas de práctica constante más que días, y el tamaño del cambio varía entre personas.',
      },
      {
        q: '¿ONDA es biofeedback de VFC?',
        a: 'Sí. ONDA es una app de biofeedback de VFC y respiración guiada: muestra una puntuación de coherencia en vivo y la respuesta de tu ritmo cardíaco mientras respiras, usando la cámara del iPhone o un Apple Watch, dentro de una práctica guiada. No es un dispositivo médico.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'cómo lo calcula ONDA' },
      researchLink: { path: '/research', label: 'página de evidencia' },
      measuresLink: { path: '/measurements', label: 'qué mide ONDA' },
      compareActiveLink: { path: '/compare/best-active-hrv-training-apps', label: 'mejores apps de entrenamiento activo de VFC' },
      productLink: { path: '/product', label: 'datos del producto' },
      compareBestLink: { path: '/compare/best-hrv-biofeedback-apps', label: 'mejores apps de biofeedback de VFC' },
      researchMoreLink: { path: '/research', label: 'la ciencia detrás de ONDA' },
    },
  },
}

void TOC_IDS
