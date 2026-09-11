/**
 * Localized copy for /hrv-vs-coherence (en/ru/es). richText mini-syntax.
 * Sections carry `paras` and/or a comparison `table` (rows of [label, hrv, coherence]).
 */
export interface HvcSection {
  id: string
  kicker: string
  title: string
  paras?: string[]
  table?: { rows: [string, string, string][] }
}
export interface HvcCopy {
  metaTitle: string
  metaDescription: string
  articleHeadline: string
  kicker: string
  h1: string
  heroLead: string
  toc: { id: string; label: string }[]
  sections: HvcSection[]
  faqHeading: string
  faq: { q: string; a: string }[]
  links: Record<string, { path: string; label: string }>
}

export const HRV_VS_COHERENCE_I18N: Record<'en' | 'ru' | 'es', HvcCopy> = {
  en: {
    metaTitle: 'HRV vs Coherence: What’s the Difference? | ONDA Life',
    metaDescription:
      'HRV vs coherence explained: HRV is the raw variation between heartbeats; coherence is how smooth and rhythmic that variation is as you breathe. Which to watch, and how ONDA uses each.',
    articleHeadline: 'HRV vs Coherence: What’s the Difference?',
    kicker: '[ HRV VS COHERENCE ]',
    h1: 'HRV vs Coherence: What’s the Difference?',
    heroLead:
      '**HRV (heart-rate variability) is the raw variation in time between your heartbeats. Coherence is how smooth, regular and rhythmic that variation is** — how cleanly your heart rhythm rises and falls with your breath. HRV is the measured signal; coherence is a measure of the pattern’s quality in the moment. They’re often confused, but they answer different questions.',
    toc: [
      { id: 'hrv', label: 'What HRV is' },
      { id: 'coherence', label: 'What coherence is' },
      { id: 'difference', label: 'The difference' },
      { id: 'which', label: 'Which to watch' },
      { id: 'onda', label: 'How ONDA uses each' },
      { id: 'faq', label: 'FAQ' },
    ],
    sections: [
      {
        id: 'hrv',
        kicker: '[ HRV ]',
        title: 'What HRV is',
        paras: [
          'Heart-rate variability is the variation in the time between consecutive heartbeats. It’s a measured physiological quantity, reported as numbers like **RMSSD** (the short-term, beat-to-beat measure most tied to vagal activity) or **SDNN** (overall variability). Higher short-term HRV generally reflects stronger parasympathetic activity and better recovery — within a person.',
        ],
      },
      {
        id: 'coherence',
        kicker: '[ COHERENCE ]',
        title: 'What coherence is',
        paras: [
          'Coherence isn’t a different measurement — it’s a description of the *shape* of your heart-rhythm variation. When you breathe slowly and evenly at your resonance frequency, the heart-rate oscillation becomes large, smooth and regular, synchronised with your breath. A coherence score summarises how clean and organised that oscillation is over a rolling window.',
        ],
      },
      {
        id: 'difference',
        kicker: '[ THE DIFFERENCE ]',
        title: 'HRV vs coherence, side by side',
        table: {
          rows: [
            ['What it is', 'HRV: raw variation between beats', 'Coherence: quality/smoothness of that variation'],
            ['Type', 'Measured (RMSSD/SDNN)', 'Derived practice metric'],
            ['Best for', 'Long-term recovery trend', 'In-the-moment breathing feedback'],
            ['Standardised?', 'Yes — defined metrics', 'No — varies by app'],
          ],
        },
        paras: [
          'The key nuance: HRV can be high in a *noisy*, irregular way, but coherence specifically rewards a clean, organised oscillation. High coherence usually comes with a rise in HRV; high HRV doesn’t always mean high coherence.',
        ],
      },
      {
        id: 'which',
        kicker: '[ WHICH TO WATCH ]',
        title: 'Which one should you watch?',
        paras: [
          'Both — for different jobs. During a breathing session, **coherence** is the useful live guide: it tells you whether you’re organising your heart rhythm right now. For progress over time, your **resting-HRV trend** across weeks is the honest signal of recovery and adaptation. Chasing a single coherence number outside practice, or a single day’s HRV reading, is a mistake.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ HOW ONDA USES EACH ]',
        title: 'How ONDA uses HRV and coherence',
        paras: [
          'ONDA measures HRV from your heartbeat (iPhone camera or Apple Watch) and shows a **live coherence score** during practice, so you can see your rhythm organise as you breathe — the in-the-moment guide. Over time it tracks your **resting-HRV trend** as the measure of progress. See exactly {{measuresLink}}, {{howLink}}, and {{hrvLink}} overall.',
        ],
      },
    ],
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'What is the difference between HRV and coherence?',
        a: 'HRV (heart-rate variability) is the raw variation in time between heartbeats — a measured signal. Coherence describes how smooth, regular and rhythmic that variation is, especially as it lines up with your breathing. HRV is the number; coherence is a measure of the pattern’s quality in the moment.',
      },
      {
        q: 'Is a high coherence score the same as high HRV?',
        a: 'They’re related but not identical. When you breathe at your resonance frequency, HRV rises and the heart rhythm becomes smooth and wave-like — high coherence. But HRV can be high in a noisy, irregular way too (e.g. from arrhythmia). Coherence specifically rewards a clean, organised oscillation, not just raw variability.',
      },
      {
        q: 'Which should I pay attention to?',
        a: 'For in-the-moment breathing practice, coherence is the useful live guide — it shows whether you’re organising your heart rhythm right now. For long-term recovery and adaptation, your resting-HRV trend over weeks is the signal to watch. They answer different questions.',
      },
      {
        q: 'Is coherence a medical or scientific measurement?',
        a: 'No. HRV is a well-defined physiological measure (e.g. RMSSD, SDNN). A coherence score is a derived practice metric — useful real-time feedback, but not a clinical biomarker and not standardised across apps.',
      },
      {
        q: 'How does ONDA use HRV and coherence?',
        a: 'ONDA measures HRV from your heartbeat (iPhone camera or Apple Watch) and shows a live coherence score during practice so you can see your rhythm organise as you breathe. Over time it tracks your resting-HRV trend. Coherence guides the session; the HRV trend tracks progress.',
      },
    ],
    links: {
      measuresLink: { path: '/measurements', label: 'what ONDA measures' },
      howLink: { path: '/how-it-works', label: 'how it computes coherence' },
      hrvLink: { path: '/hrv-biofeedback', label: 'HRV biofeedback' },
    },
  },

  ru: {
    metaTitle: 'HRV против когерентности: в чём разница? | ONDA Life',
    metaDescription:
      'HRV против когерентности простыми словами: HRV — это сырая вариация между ударами сердца; когерентность — насколько эта вариация гладкая и ритмичная при дыхании. За чем следить и как ONDA использует каждое.',
    articleHeadline: 'HRV против когерентности: в чём разница?',
    kicker: '[ HRV ПРОТИВ КОГЕРЕНТНОСТИ ]',
    h1: 'HRV против когерентности: в чём разница?',
    heroLead:
      '**HRV (вариабельность сердечного ритма) — это сырая вариация во времени между ударами сердца. Когерентность — насколько эта вариация гладкая, регулярная и ритмичная** — насколько чисто ритм сердца поднимается и опускается вместе с дыханием. HRV — измеряемый сигнал; когерентность — мера качества этого паттерна в моменте. Их часто путают, но они отвечают на разные вопросы.',
    toc: [
      { id: 'hrv', label: 'Что такое HRV' },
      { id: 'coherence', label: 'Что такое когерентность' },
      { id: 'difference', label: 'Разница' },
      { id: 'which', label: 'За чем следить' },
      { id: 'onda', label: 'Как использует ONDA' },
      { id: 'faq', label: 'Вопросы' },
    ],
    sections: [
      {
        id: 'hrv',
        kicker: '[ HRV ]',
        title: 'Что такое HRV',
        paras: [
          'Вариабельность сердечного ритма — это вариация во времени между последовательными ударами сердца. Это измеряемая физиологическая величина, выражаемая числами вроде **RMSSD** (краткосрочная мера от удара к удару, сильнее всего связанная с вагальной активностью) или **SDNN** (общая вариабельность). Более высокая краткосрочная HRV обычно отражает более сильную парасимпатическую активность и лучшее восстановление — в пределах одного человека.',
        ],
      },
      {
        id: 'coherence',
        kicker: '[ КОГЕРЕНТНОСТЬ ]',
        title: 'Что такое когерентность',
        paras: [
          'Когерентность — не отдельное измерение, а описание *формы* вариации вашего сердечного ритма. Когда вы дышите медленно и ровно на своей резонансной частоте, колебание частоты сердца становится большим, гладким и регулярным, синхронизированным с дыханием. Показатель когерентности обобщает, насколько чистым и организованным было это колебание за скользящее окно.',
        ],
      },
      {
        id: 'difference',
        kicker: '[ РАЗНИЦА ]',
        title: 'HRV и когерентность бок о бок',
        table: {
          rows: [
            ['Что это', 'HRV: сырая вариация между ударами', 'Когерентность: качество/гладкость этой вариации'],
            ['Тип', 'Измеряемое (RMSSD/SDNN)', 'Производная метрика для практики'],
            ['Лучше для', 'Долгосрочного тренда восстановления', 'Обратной связи по дыханию в моменте'],
            ['Стандартизировано?', 'Да — определённые метрики', 'Нет — зависит от приложения'],
          ],
        },
        paras: [
          'Ключевой нюанс: HRV может быть высокой *шумным*, нерегулярным образом, а когерентность вознаграждает именно чистое, организованное колебание. Высокая когерентность обычно сопровождается ростом HRV; высокая HRV не всегда означает высокую когерентность.',
        ],
      },
      {
        id: 'which',
        kicker: '[ ЗА ЧЕМ СЛЕДИТЬ ]',
        title: 'За чем именно следить?',
        paras: [
          'За обоими — для разных задач. Во время дыхательной сессии полезный живой ориентир — **когерентность**: она говорит, организуете ли вы ритм сердца прямо сейчас. Для прогресса со временем честный сигнал восстановления и адаптации — ваш **тренд HRV в покое** за недели. Гнаться за одним числом когерентности вне практики или за HRV одного дня — ошибка.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ КАК ИСПОЛЬЗУЕТ ONDA ]',
        title: 'Как ONDA использует HRV и когерентность',
        paras: [
          'ONDA измеряет HRV по вашему пульсу (камера iPhone или Apple Watch) и показывает **живой показатель когерентности** во время практики, чтобы вы видели, как ритм организуется при дыхании, — ориентир в моменте. Со временем она отслеживает ваш **тренд HRV в покое** как меру прогресса. Смотрите точно, {{measuresLink}}, {{howLink}} и {{hrvLink}} в целом.',
        ],
      },
    ],
    faqHeading: 'Частые вопросы',
    faq: [
      {
        q: 'В чём разница между HRV и когерентностью?',
        a: 'HRV (вариабельность сердечного ритма) — это сырая вариация во времени между ударами сердца, измеряемый сигнал. Когерентность описывает, насколько эта вариация гладкая, регулярная и ритмичная, особенно как она совпадает с дыханием. HRV — это число; когерентность — мера качества паттерна в моменте.',
      },
      {
        q: 'Высокий показатель когерентности — это то же, что высокая HRV?',
        a: 'Они связаны, но не тождественны. Когда вы дышите на резонансной частоте, HRV растёт, а ритм сердца становится гладким и волнообразным — высокая когерентность. Но HRV может быть высокой и шумным, нерегулярным образом (например, при аритмии). Когерентность вознаграждает именно чистое организованное колебание, а не просто сырую вариабельность.',
      },
      {
        q: 'На что мне обращать внимание?',
        a: 'Для дыхательной практики в моменте полезный живой ориентир — когерентность: она показывает, организуете ли вы ритм сердца прямо сейчас. Для долгосрочного восстановления и адаптации следить стоит за трендом HRV в покое за недели. Они отвечают на разные вопросы.',
      },
      {
        q: 'Когерентность — это медицинское или научное измерение?',
        a: 'Нет. HRV — чётко определённая физиологическая мера (например, RMSSD, SDNN). Показатель когерентности — производная метрика для практики: полезная обратная связь в реальном времени, но не клинический биомаркер и не стандартизирован между приложениями.',
      },
      {
        q: 'Как ONDA использует HRV и когерентность?',
        a: 'ONDA измеряет HRV по вашему пульсу (камера iPhone или Apple Watch) и показывает живой показатель когерентности во время практики, чтобы вы видели, как ритм организуется при дыхании. Со временем она отслеживает ваш тренд HRV в покое. Когерентность ведёт сессию; тренд HRV отслеживает прогресс.',
      },
    ],
    links: {
      measuresLink: { path: '/measurements', label: 'что измеряет ONDA' },
      howLink: { path: '/how-it-works', label: 'как она вычисляет когерентность' },
      hrvLink: { path: '/hrv-biofeedback', label: 'HRV-биофидбек' },
    },
  },

  es: {
    metaTitle: 'VFC vs coherencia: ¿cuál es la diferencia? | ONDA Life',
    metaDescription:
      'VFC vs coherencia explicado: la VFC es la variación bruta entre latidos; la coherencia es lo suave y rítmica que es esa variación al respirar. Cuál vigilar y cómo usa cada una ONDA.',
    articleHeadline: 'VFC vs coherencia: ¿cuál es la diferencia?',
    kicker: '[ VFC VS COHERENCIA ]',
    h1: 'VFC vs coherencia: ¿cuál es la diferencia?',
    heroLead:
      '**La VFC (variabilidad de la frecuencia cardíaca) es la variación bruta en el tiempo entre tus latidos. La coherencia es lo suave, regular y rítmica que es esa variación** — con qué limpieza tu ritmo cardíaco sube y baja con tu respiración. La VFC es la señal medida; la coherencia es una medida de la calidad del patrón en el momento. Se confunden a menudo, pero responden preguntas distintas.',
    toc: [
      { id: 'hrv', label: 'Qué es la VFC' },
      { id: 'coherence', label: 'Qué es la coherencia' },
      { id: 'difference', label: 'La diferencia' },
      { id: 'which', label: 'Cuál vigilar' },
      { id: 'onda', label: 'Cómo usa cada una ONDA' },
      { id: 'faq', label: 'FAQ' },
    ],
    sections: [
      {
        id: 'hrv',
        kicker: '[ VFC ]',
        title: 'Qué es la VFC',
        paras: [
          'La variabilidad de la frecuencia cardíaca es la variación en el tiempo entre latidos consecutivos. Es una cantidad fisiológica medida, expresada en números como **RMSSD** (la medida a corto plazo, latido a latido, más ligada a la actividad vagal) o **SDNN** (variabilidad global). Una VFC a corto plazo más alta suele reflejar mayor actividad parasimpática y mejor recuperación — dentro de una misma persona.',
        ],
      },
      {
        id: 'coherence',
        kicker: '[ COHERENCIA ]',
        title: 'Qué es la coherencia',
        paras: [
          'La coherencia no es una medición distinta — es una descripción de la *forma* de la variación de tu ritmo cardíaco. Cuando respiras despacio y de forma pareja a tu frecuencia de resonancia, la oscilación de la frecuencia cardíaca se vuelve amplia, suave y regular, sincronizada con tu respiración. Una puntuación de coherencia resume lo limpia y organizada que fue esa oscilación en una ventana móvil.',
        ],
      },
      {
        id: 'difference',
        kicker: '[ LA DIFERENCIA ]',
        title: 'VFC vs coherencia, lado a lado',
        table: {
          rows: [
            ['Qué es', 'VFC: variación bruta entre latidos', 'Coherencia: calidad/suavidad de esa variación'],
            ['Tipo', 'Medida (RMSSD/SDNN)', 'Métrica de práctica derivada'],
            ['Mejor para', 'Tendencia de recuperación a largo plazo', 'Feedback de respiración en el momento'],
            ['¿Estandarizada?', 'Sí — métricas definidas', 'No — varía según la app'],
          ],
        },
        paras: [
          'El matiz clave: la VFC puede ser alta de forma *ruidosa* e irregular, pero la coherencia premia específicamente una oscilación limpia y organizada. Una coherencia alta suele venir con una subida de la VFC; una VFC alta no siempre significa coherencia alta.',
        ],
      },
      {
        id: 'which',
        kicker: '[ CUÁL VIGILAR ]',
        title: '¿Cuál deberías vigilar?',
        paras: [
          'Ambas — para trabajos distintos. Durante una sesión de respiración, la **coherencia** es la guía en vivo útil: te dice si estás organizando tu ritmo cardíaco ahora mismo. Para el progreso a lo largo del tiempo, tu **tendencia de VFC en reposo** durante semanas es la señal honesta de recuperación y adaptación. Perseguir un solo número de coherencia fuera de la práctica, o la VFC de un solo día, es un error.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ CÓMO USA CADA UNA ONDA ]',
        title: 'Cómo usa ONDA la VFC y la coherencia',
        paras: [
          'ONDA mide la VFC a partir de tu latido (cámara del iPhone o Apple Watch) y muestra una **puntuación de coherencia en vivo** durante la práctica, para que veas cómo tu ritmo se organiza mientras respiras — la guía del momento. Con el tiempo sigue tu **tendencia de VFC en reposo** como medida del progreso. Mira exactamente {{measuresLink}}, {{howLink}} y {{hrvLink}} en general.',
        ],
      },
    ],
    faqHeading: 'Preguntas frecuentes',
    faq: [
      {
        q: '¿Cuál es la diferencia entre VFC y coherencia?',
        a: 'La VFC (variabilidad de la frecuencia cardíaca) es la variación bruta en el tiempo entre latidos — una señal medida. La coherencia describe lo suave, regular y rítmica que es esa variación, sobre todo al alinearse con tu respiración. La VFC es el número; la coherencia es una medida de la calidad del patrón en el momento.',
      },
      {
        q: '¿Una puntuación de coherencia alta es lo mismo que una VFC alta?',
        a: 'Están relacionadas pero no son idénticas. Cuando respiras a tu frecuencia de resonancia, la VFC sube y el ritmo cardíaco se vuelve suave y ondulado — coherencia alta. Pero la VFC también puede ser alta de forma ruidosa e irregular (p. ej. por arritmia). La coherencia premia específicamente una oscilación limpia y organizada, no solo la variabilidad bruta.',
      },
      {
        q: '¿A cuál debo prestar atención?',
        a: 'Para la práctica de respiración en el momento, la coherencia es la guía en vivo útil — muestra si estás organizando tu ritmo cardíaco ahora mismo. Para la recuperación y adaptación a largo plazo, tu tendencia de VFC en reposo a lo largo de semanas es la señal a vigilar. Responden preguntas distintas.',
      },
      {
        q: '¿La coherencia es una medición médica o científica?',
        a: 'No. La VFC es una medida fisiológica bien definida (p. ej. RMSSD, SDNN). Una puntuación de coherencia es una métrica de práctica derivada — feedback útil en tiempo real, pero no un biomarcador clínico y no está estandarizada entre apps.',
      },
      {
        q: '¿Cómo usa ONDA la VFC y la coherencia?',
        a: 'ONDA mide la VFC a partir de tu latido (cámara del iPhone o Apple Watch) y muestra una puntuación de coherencia en vivo durante la práctica para que veas cómo tu ritmo se organiza mientras respiras. Con el tiempo sigue tu tendencia de VFC en reposo. La coherencia guía la sesión; la tendencia de VFC sigue el progreso.',
      },
    ],
    links: {
      measuresLink: { path: '/measurements', label: 'qué mide ONDA' },
      howLink: { path: '/how-it-works', label: 'cómo calcula la coherencia' },
      hrvLink: { path: '/hrv-biofeedback', label: 'biofeedback de VFC' },
    },
  },
}
