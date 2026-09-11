/**
 * Localized copy for /resonance-breathing (en/ru/es). Same richText mini-syntax
 * as hrv-biofeedback-i18n. Sections carry either `paras` (prose) or `items`
 * (bullets). Drives the page render and the localized Article + FAQPage JSON-LD.
 */
export interface RbSection {
  id: string
  kicker: string
  title: string
  paras?: string[]
  items?: string[]
}
export interface RbCopy {
  metaTitle: string
  metaDescription: string
  articleHeadline: string
  kicker: string
  h1: string
  heroLead: string
  heroCta: { label: string; path: string }
  toc: { id: string; label: string }[]
  sections: RbSection[]
  faqHeading: string
  faq: { q: string; a: string }[]
  links: Record<string, { path: string; label: string }>
}

export const RESONANCE_BREATHING_I18N: Record<'en' | 'ru' | 'es', RbCopy> = {
  en: {
    metaTitle: 'Resonance Breathing: Slow Breathing & HRV | ONDA Life',
    metaDescription:
      'Resonance breathing explained: what it is, why ~6 breaths a minute maximises HRV, how to find your resonance frequency, the evidence, how to practise, and how ONDA guides it.',
    articleHeadline: 'Resonance Breathing: The Science Behind Slow Breathing and HRV',
    kicker: '[ RESONANCE BREATHING ]',
    h1: 'Resonance Breathing: The Science Behind Slow Breathing and HRV',
    heroLead:
      '**Resonance breathing is slow, even breathing at the pace where your heart-rate oscillation is largest** — for most people around 5.5–6 breaths a minute (roughly a 10-second cycle). At that pace your heart rhythm and breathing synchronise, the baroreflex is strongly engaged, and heart-rate variability rises. It’s the breathing at the core of HRV biofeedback.',
    heroCta: { label: 'Try the resonance breathing pacer →', path: '/tools/resonance-breathing' },
    toc: [
      { id: 'science', label: 'The science' },
      { id: 'frequency', label: 'Find your frequency' },
      { id: 'evidence', label: 'The evidence' },
      { id: 'practise', label: 'How to practise' },
      { id: 'onda', label: 'How ONDA guides it' },
      { id: 'faq', label: 'FAQ' },
    ],
    sections: [
      {
        id: 'science',
        kicker: '[ THE SCIENCE ]',
        title: 'Why ~6 breaths a minute is special',
        paras: [
          'Your heart rate naturally rises as you inhale and falls as you exhale — respiratory sinus arrhythmia. There’s also a slower loop: the baroreflex, which regulates blood pressure, oscillates at roughly 0.1 Hz — about one cycle every 10 seconds. When you breathe at that same ~0.1 Hz pace, the two rhythms line up and reinforce each other, and the heart-rate oscillation grows to its largest, smoothest amplitude. That’s resonance.',
          'The visible result is a clean, wave-like heart rhythm and a sharp rise in HRV — the signal a coherence score is built on. See {{howLink}}.',
        ],
      },
      {
        id: 'frequency',
        kicker: '[ YOUR FREQUENCY ]',
        title: 'Finding your resonance frequency',
        paras: [
          'Everyone’s resonance frequency is slightly different — usually between about 4.5 and 7 breaths a minute, most commonly near 6. To find yours, breathe smoothly at a few paces in that range and notice where it feels most effortless. With a biofeedback app you can go further: the pace where your HRV or coherence peaks is your resonance frequency.',
          'A simple starting point is a 5.5-second inhale and 5.5-second exhale (about 5.5 breaths a minute), then adjust from there.',
        ],
      },
      {
        id: 'evidence',
        kicker: '[ THE EVIDENCE ]',
        title: 'What the evidence says',
        paras: [
          'Breathing at resonance frequency reliably raises HRV during the session and engages the parasympathetic branch — the most-supported mechanism behind HRV biofeedback (Lehrer & Gevirtz, 2014). Slow, resonant breathing is also linked in the wider literature to lower arousal and better stress resilience with regular practice (Thayer et al., 2009; Porges, 2007).',
          'As always, the acute effect is robust; the size and durability of long-term change vary between people. Full detail and limits on {{researchLink}}.',
        ],
      },
      {
        id: 'practise',
        kicker: '[ HOW TO PRACTISE ]',
        title: 'How to practise resonance breathing',
        items: [
          'Sit comfortably and breathe through the nose, into the belly.',
          'Aim for a smooth ~5.5–6 breaths a minute (e.g. 5.5s in, 5.5s out) — no holds.',
          'Keep it effortless; resonance is about smoothness, not deep or forced breaths.',
          'Practise 10–20 minutes where you can, but a few minutes still helps.',
          'Consistency beats duration — short daily sessions move your baseline more than rare long ones.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ HOW ONDA GUIDES IT ]',
        title: 'How ONDA guides resonance breathing',
        paras: [
          'ONDA pairs a resonance-breathing pacer with live HRV feedback and a coherence score, using the iPhone camera or an Apple Watch — so you don’t just breathe at the right pace, you see your heart rhythm organise in response. That closed loop is what turns slow breathing into training. It’s free to start; see the full {{productLink}} and {{hrvLink}}.',
        ],
      },
    ],
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'What is resonance breathing?',
        a: 'Resonance breathing (also called coherent breathing) is slow, even breathing at the pace where your heart-rate oscillation is largest — for most people around 5.5–6 breaths a minute, roughly a 10-second cycle. At that pace the heart rhythm and breathing synchronise and HRV rises.',
      },
      {
        q: 'What is my resonance frequency?',
        a: 'Most people’s resonance frequency sits between about 4.5 and 7 breaths a minute, commonly near 6. You can find yours by trying paces in that range and noticing where your breathing feels smoothest and, with a biofeedback app, where HRV peaks.',
      },
      {
        q: 'Does slow breathing really raise HRV?',
        a: 'Yes — breathing near your resonance frequency reliably increases heart-rate variability during the session and engages the parasympathetic branch. It is the core mechanism behind HRV biofeedback. How much your resting baseline changes over time varies between people.',
      },
      {
        q: 'How long should I practise resonance breathing?',
        a: 'A typical session is about 10–20 minutes, but even a few minutes shifts your state. Consistency matters more than length — short daily sessions tend to help more than occasional long ones.',
      },
      {
        q: 'Is resonance breathing the same as box breathing?',
        a: 'No. Box breathing uses equal counts with holds (e.g. 4-4-4-4). Resonance breathing is smooth, continuous breathing without holds at a specific slow pace (~6/min) chosen to maximise heart-rate oscillation. Both calm you; resonance breathing is the one tied to HRV.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'how ONDA computes coherence' },
      researchLink: { path: '/research', label: 'the evidence page' },
      productLink: { path: '/product', label: 'product facts' },
      hrvLink: { path: '/hrv-biofeedback', label: 'HRV biofeedback' },
    },
  },

  ru: {
    metaTitle: 'Резонансное дыхание: медленное дыхание и HRV | ONDA Life',
    metaDescription:
      'Резонансное дыхание простыми словами: что это, почему ~6 вдохов в минуту максимизируют HRV, как найти свою резонансную частоту, доказательства, как практиковать и как это ведёт ONDA.',
    articleHeadline: 'Резонансное дыхание: наука медленного дыхания и HRV',
    kicker: '[ РЕЗОНАНСНОЕ ДЫХАНИЕ ]',
    h1: 'Резонансное дыхание: наука медленного дыхания и HRV',
    heroLead:
      '**Резонансное дыхание — это медленное ровное дыхание на темпе, где колебание частоты сердца наибольшее** — у большинства людей около 5,5–6 вдохов в минуту (цикл примерно 10 секунд). На этом темпе ритм сердца и дыхание синхронизируются, сильно вовлекается барорефлекс, и вариабельность сердечного ритма растёт. Это дыхание в основе HRV-биофидбека.',
    heroCta: { label: 'Попробовать пейсер резонансного дыхания →', path: '/tools/resonance-breathing' },
    toc: [
      { id: 'science', label: 'Наука' },
      { id: 'frequency', label: 'Найти частоту' },
      { id: 'evidence', label: 'Доказательства' },
      { id: 'practise', label: 'Как практиковать' },
      { id: 'onda', label: 'Как ведёт ONDA' },
      { id: 'faq', label: 'Вопросы' },
    ],
    sections: [
      {
        id: 'science',
        kicker: '[ НАУКА ]',
        title: 'Чем особенны ~6 вдохов в минуту',
        paras: [
          'Частота сердца естественно растёт на вдохе и падает на выдохе — дыхательная синусовая аритмия. Есть и более медленная петля: барорефлекс, регулирующий давление, колеблется примерно на 0,1 Гц — около одного цикла каждые 10 секунд. Когда вы дышите на этом же темпе ~0,1 Гц, два ритма выстраиваются и усиливают друг друга, и колебание частоты сердца достигает наибольшей, самой гладкой амплитуды. Это и есть резонанс.',
          'Видимый результат — чистый волнообразный ритм сердца и резкий рост HRV, сигнал, на котором строится показатель когерентности. Смотрите, {{howLink}}.',
        ],
      },
      {
        id: 'frequency',
        kicker: '[ ВАША ЧАСТОТА ]',
        title: 'Как найти свою резонансную частоту',
        paras: [
          'Резонансная частота у каждого немного своя — обычно между примерно 4,5 и 7 вдохами в минуту, чаще всего около 6. Чтобы найти свою, ровно подышите на нескольких темпах в этом диапазоне и заметьте, где дышится легче всего. С приложением биофидбека можно точнее: темп, где ваша HRV или когерентность максимальны, и есть ваша резонансная частота.',
          'Простая отправная точка — вдох 5,5 секунды и выдох 5,5 секунды (около 5,5 вдохов в минуту), дальше подстраивайте.',
        ],
      },
      {
        id: 'evidence',
        kicker: '[ ДОКАЗАТЕЛЬСТВА ]',
        title: 'Что говорят исследования',
        paras: [
          'Дыхание на резонансной частоте надёжно повышает HRV во время сессии и включает парасимпатическую ветвь — самый подтверждённый механизм за HRV-биофидбеком (Lehrer & Gevirtz, 2014). Медленное резонансное дыхание в более широкой литературе также связывают с более низким возбуждением и лучшей стрессоустойчивостью при регулярной практике (Thayer et al., 2009; Porges, 2007).',
          'Как всегда, острый эффект устойчив; величина и стойкость долгосрочных изменений варьируются у разных людей. Полные детали и пределы — на {{researchLink}}.',
        ],
      },
      {
        id: 'practise',
        kicker: '[ КАК ПРАКТИКОВАТЬ ]',
        title: 'Как практиковать резонансное дыхание',
        items: [
          'Сядьте удобно и дышите носом, в живот.',
          'Держите ровные ~5,5–6 вдохов в минуту (например, 5,5 с вдох, 5,5 с выдох) — без задержек.',
          'Пусть будет легко; резонанс — про гладкость, а не про глубокие или форсированные вдохи.',
          'Практикуйте 10–20 минут, где можете, но и несколько минут уже помогают.',
          'Регулярность важнее длительности — короткие ежедневные сессии сдвигают базовый уровень сильнее, чем редкие долгие.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ КАК ВЕДЁТ ONDA ]',
        title: 'Как ONDA ведёт резонансное дыхание',
        paras: [
          'ONDA соединяет пейсер резонансного дыхания с живой обратной связью по HRV и показателем когерентности, используя камеру iPhone или Apple Watch, — так вы не просто дышите в нужном темпе, а видите, как ритм сердца организуется в ответ. Эта замкнутая петля и превращает медленное дыхание в тренировку. Начать бесплатно; смотрите полные {{productLink}} и {{hrvLink}}.',
        ],
      },
    ],
    faqHeading: 'Частые вопросы',
    faq: [
      {
        q: 'Что такое резонансное дыхание?',
        a: 'Резонансное дыхание (его также называют когерентным) — это медленное ровное дыхание на темпе, где колебание частоты сердца наибольшее, — у большинства около 5,5–6 вдохов в минуту, цикл примерно 10 секунд. На этом темпе ритм сердца и дыхание синхронизируются, и HRV растёт.',
      },
      {
        q: 'Какая моя резонансная частота?',
        a: 'У большинства резонансная частота лежит между примерно 4,5 и 7 вдохами в минуту, чаще около 6. Найти свою можно, пробуя темпы в этом диапазоне и замечая, где дышится глаже всего, а с приложением биофидбека — где HRV максимальна.',
      },
      {
        q: 'Медленное дыхание действительно повышает HRV?',
        a: 'Да — дыхание около резонансной частоты надёжно повышает вариабельность сердечного ритма во время сессии и включает парасимпатическую ветвь. Это основной механизм за HRV-биофидбеком. Насколько меняется ваш базовый уровень со временем — варьируется у разных людей.',
      },
      {
        q: 'Сколько нужно практиковать резонансное дыхание?',
        a: 'Обычная сессия — около 10–20 минут, но даже несколько минут меняют состояние. Регулярность важнее длительности — короткие ежедневные сессии обычно помогают больше, чем редкие долгие.',
      },
      {
        q: 'Резонансное дыхание — это то же, что «дыхание квадратом»?',
        a: 'Нет. «Дыхание квадратом» использует равные счёты с задержками (например, 4-4-4-4). Резонансное дыхание — гладкое, непрерывное, без задержек, на конкретном медленном темпе (~6/мин), выбранном для максимизации колебания частоты сердца. Успокаивают оба; с HRV связано именно резонансное.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'как ONDA вычисляет когерентность' },
      researchLink: { path: '/research', label: 'странице о доказательствах' },
      productLink: { path: '/product', label: 'факты о продукте' },
      hrvLink: { path: '/hrv-biofeedback', label: 'HRV-биофидбек' },
    },
  },

  es: {
    metaTitle: 'Respiración de resonancia: respiración lenta y VFC | ONDA Life',
    metaDescription:
      'La respiración de resonancia explicada: qué es, por qué ~6 respiraciones por minuto maximizan la VFC, cómo encontrar tu frecuencia de resonancia, la evidencia, cómo practicarla y cómo la guía ONDA.',
    articleHeadline: 'Respiración de resonancia: la ciencia de la respiración lenta y la VFC',
    kicker: '[ RESPIRACIÓN DE RESONANCIA ]',
    h1: 'Respiración de resonancia: la ciencia de la respiración lenta y la VFC',
    heroLead:
      '**La respiración de resonancia es respirar despacio y de forma pareja al ritmo en que la oscilación de tu frecuencia cardíaca es mayor** — para la mayoría, unas 5,5–6 respiraciones por minuto (un ciclo de ~10 segundos). A ese ritmo tu ritmo cardíaco y tu respiración se sincronizan, el barorreflejo se activa con fuerza y la variabilidad de la frecuencia cardíaca sube. Es la respiración en el centro del biofeedback de VFC.',
    heroCta: { label: 'Prueba el marcapasos de respiración de resonancia →', path: '/tools/resonance-breathing' },
    toc: [
      { id: 'science', label: 'La ciencia' },
      { id: 'frequency', label: 'Tu frecuencia' },
      { id: 'evidence', label: 'La evidencia' },
      { id: 'practise', label: 'Cómo practicar' },
      { id: 'onda', label: 'Cómo la guía ONDA' },
      { id: 'faq', label: 'FAQ' },
    ],
    sections: [
      {
        id: 'science',
        kicker: '[ LA CIENCIA ]',
        title: 'Por qué ~6 respiraciones por minuto es especial',
        paras: [
          'Tu frecuencia cardíaca sube naturalmente al inhalar y baja al exhalar — arritmia sinusal respiratoria. Hay también un bucle más lento: el barorreflejo, que regula la presión arterial, oscila a unos 0,1 Hz — cerca de un ciclo cada 10 segundos. Cuando respiras a ese mismo ritmo de ~0,1 Hz, los dos ritmos se alinean y se refuerzan, y la oscilación de la frecuencia cardíaca alcanza su amplitud mayor y más suave. Eso es la resonancia.',
          'El resultado visible es un ritmo cardíaco limpio en forma de onda y una fuerte subida de la VFC — la señal sobre la que se construye una puntuación de coherencia. Mira {{howLink}}.',
        ],
      },
      {
        id: 'frequency',
        kicker: '[ TU FRECUENCIA ]',
        title: 'Encontrar tu frecuencia de resonancia',
        paras: [
          'La frecuencia de resonancia de cada persona es algo distinta — normalmente entre unas 4,5 y 7 respiraciones por minuto, lo más común cerca de 6. Para encontrar la tuya, respira de forma suave a varios ritmos en ese rango y fíjate dónde se siente más sin esfuerzo. Con una app de biofeedback puedes ir más allá: el ritmo donde tu VFC o coherencia alcanza su pico es tu frecuencia de resonancia.',
          'Un punto de partida sencillo es una inhalación de 5,5 segundos y una exhalación de 5,5 segundos (unas 5,5 respiraciones por minuto), y ajustar desde ahí.',
        ],
      },
      {
        id: 'evidence',
        kicker: '[ LA EVIDENCIA ]',
        title: 'Qué dice la evidencia',
        paras: [
          'Respirar a la frecuencia de resonancia eleva de forma fiable la VFC durante la sesión y activa la rama parasimpática — el mecanismo más respaldado tras el biofeedback de VFC (Lehrer & Gevirtz, 2014). La respiración lenta y resonante también se vincula en la literatura más amplia con menor activación y mejor resiliencia al estrés con la práctica regular (Thayer et al., 2009; Porges, 2007).',
          'Como siempre, el efecto agudo es robusto; el tamaño y la durabilidad del cambio a largo plazo varían entre personas. Todo el detalle y los límites en la {{researchLink}}.',
        ],
      },
      {
        id: 'practise',
        kicker: '[ CÓMO PRACTICAR ]',
        title: 'Cómo practicar la respiración de resonancia',
        items: [
          'Siéntate cómodamente y respira por la nariz, hacia el vientre.',
          'Busca unas ~5,5–6 respiraciones por minuto suaves (p. ej. 5,5 s de inhalación, 5,5 s de exhalación) — sin retenciones.',
          'Mantenlo sin esfuerzo; la resonancia va de suavidad, no de respiraciones profundas o forzadas.',
          'Practica 10–20 minutos cuando puedas, pero incluso unos minutos ayudan.',
          'La constancia gana a la duración — sesiones cortas diarias mueven tu línea base más que largas ocasionales.',
        ],
      },
      {
        id: 'onda',
        kicker: '[ CÓMO LA GUÍA ONDA ]',
        title: 'Cómo guía ONDA la respiración de resonancia',
        paras: [
          'ONDA combina un marcapasos de respiración de resonancia con feedback de VFC en vivo y una puntuación de coherencia, usando la cámara del iPhone o un Apple Watch — así no solo respiras al ritmo correcto, sino que ves cómo tu ritmo cardíaco se organiza en respuesta. Ese bucle cerrado es lo que convierte la respiración lenta en entrenamiento. Es gratis para empezar; mira los {{productLink}} completos y el {{hrvLink}}.',
        ],
      },
    ],
    faqHeading: 'Preguntas frecuentes',
    faq: [
      {
        q: '¿Qué es la respiración de resonancia?',
        a: 'La respiración de resonancia (también llamada respiración coherente) es respirar despacio y de forma pareja al ritmo en que la oscilación de tu frecuencia cardíaca es mayor — para la mayoría, unas 5,5–6 respiraciones por minuto, un ciclo de ~10 segundos. A ese ritmo el ritmo cardíaco y la respiración se sincronizan y la VFC sube.',
      },
      {
        q: '¿Cuál es mi frecuencia de resonancia?',
        a: 'La frecuencia de resonancia de la mayoría está entre unas 4,5 y 7 respiraciones por minuto, comúnmente cerca de 6. Puedes encontrar la tuya probando ritmos en ese rango y notando dónde tu respiración se siente más suave y, con una app de biofeedback, dónde la VFC alcanza su pico.',
      },
      {
        q: '¿Respirar despacio sube de verdad la VFC?',
        a: 'Sí — respirar cerca de tu frecuencia de resonancia aumenta de forma fiable la variabilidad de la frecuencia cardíaca durante la sesión y activa la rama parasimpática. Es el mecanismo central del biofeedback de VFC. Cuánto cambia tu línea base con el tiempo varía entre personas.',
      },
      {
        q: '¿Cuánto debo practicar la respiración de resonancia?',
        a: 'Una sesión típica es de unos 10–20 minutos, pero incluso unos minutos cambian tu estado. La constancia importa más que la duración — sesiones cortas diarias suelen ayudar más que largas ocasionales.',
      },
      {
        q: '¿La respiración de resonancia es lo mismo que la respiración en caja?',
        a: 'No. La respiración en caja usa cuentas iguales con retenciones (p. ej. 4-4-4-4). La respiración de resonancia es suave y continua, sin retenciones, a un ritmo lento concreto (~6/min) elegido para maximizar la oscilación de la frecuencia cardíaca. Ambas calman; la ligada a la VFC es la de resonancia.',
      },
    ],
    links: {
      howLink: { path: '/how-it-works', label: 'cómo calcula ONDA la coherencia' },
      researchLink: { path: '/research', label: 'página de evidencia' },
      productLink: { path: '/product', label: 'datos del producto' },
      hrvLink: { path: '/hrv-biofeedback', label: 'biofeedback de VFC' },
    },
  },
}
