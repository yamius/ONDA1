/**
 * Localized copy for /tools. Pilot languages: ru, es (uk/zh follow later).
 *
 * Only the hub's own framing prose is localized — intro, Bio OS card, the
 * "About these tools" SEO body, the 5 domain blurbs, the honesty note and the
 * closing CTA. The individual tool cards (name + blurb) stay English because
 * the tool pages at /tools/<slug> are English-only; internal Links keep EN
 * paths, mirroring /product and /faq. `domains` is index-aligned with
 * TOOL_DOMAINS in ToolsPage.tsx.
 */
export interface ToolsDomainCopy {
  title: string
  body: string
}
export interface ToolsCopy {
  metaTitle: string
  metaDescription: string
  breadcrumbTools: string
  h1: string
  intro1: string
  intro2Pre: string
  ondaLink: string
  intro2Post: string
  bioOsTitle: string
  bioOsBadge: string
  bioOsDesc: string
  liveLabel: string
  aboutHeading: string
  aboutP1: string
  aboutP2Pre: string
  measuresLink: string
  aboutP2Mid: string
  researchLink: string
  aboutP2Post: string
  domains: ToolsDomainCopy[]
  readHeading: string
  readBody: string
  ctaPre: string
  seeLink: string
  ctaMid: string
  compareLink: string
  ctaPost: string
}

export const TOOLS_I18N: Record<'ru' | 'es', ToolsCopy> = {
  ru: {
    metaTitle: 'Инструменты для биохакинга и калькуляторы — бесплатно и по науке | ONDA Life',
    metaDescription:
      'Бесплатные интерактивные калькуляторы: HRV, недосып, время последнего кофе, пульсовые зоны, белок и другое — каждый сверяется с опубликованными данными, без регистрации, затем отслеживается в ONDA Life.',
    breadcrumbTools: 'Инструменты',
    h1: 'Инструменты для биохакинга',
    intro1:
      'Бесплатные интерактивные калькуляторы для показателей, которые важны — HRV, сон, пульсовые зоны, время кофе, белок и другое. Каждый инструмент сверяет ваше число с опубликованными данными, а не с округлённым правилом на глаз, и говорит, что реально на него влияет.',
    intro2Pre:
      'Без регистрации, без аккаунта, ничего не нужно устанавливать — всё работает прямо в браузере. Когда захотите, чтобы те же числа отслеживались автоматически, а не вводились один раз, — это и делает ',
    ondaLink: 'ONDA Life',
    intro2Post: ' на вашем iPhone и Apple Watch.',
    bioOsTitle: 'Bio OS — живая биометрическая панель',
    bioOsBadge: 'вживую · камера',
    bioOsDesc:
      'Пульс, дыхание и состояние нервной системы по камере — ваше тело в реальном времени, прямо в браузере.',
    liveLabel: 'вживую',
    aboutHeading: 'Об этих инструментах',
    aboutP1:
      'Это те небольшие узкие калькуляторы, к которым постоянно возвращается мир quantified-self и биохакинга — вариабельность сердечного ритма, недосып, период полувыведения кофеина, тренировочные зоны, потребность в белке — собранные в одном месте и, где это важно, привязанные к науке, а не оставленные голым числом. Смысл не в самом числе, а в том, чтобы прочитать его в контексте: что нормально для вашего возраста, что на самом деле означает изменение и какой рычаг им двигает.',
    aboutP2Pre:
      'Везде, где инструмент касается нервной системы — HRV, пульс в покое, стрессовая нагрузка — он ведёт к ',
    measuresLink: 'тому, что измеряет ONDA',
    aboutP2Mid: ', и к ',
    researchLink: 'доказательствам за этим',
    aboutP2Post:
      ', чтобы вы видели оговорки, а не только результат. Нам важнее, чтобы калькулятор сделал вас чуть более скептичным и лучше информированным, чем выдал ложно-точную оценку.',
    domains: [
      {
        title: 'Нервная система и восстановление',
        body: 'Калькуляторы вариабельности сердечного ритма, пульса в покое и стрессовой нагрузки, читающие ваше вегетативное состояние — баланс между симпатической ветвью «бей или беги» и парасимпатической «отдыхай и восстанавливайся». Это показатели, вокруг которых построена ONDA Life, поэтому каждый ведёт к тому, что число реально означает и что его надёжно двигает.',
      },
      {
        title: 'Сон',
        body: 'Инструменты недосыпа, времени последнего кофе и хронотипа, превращающие сон из размытой цели в конкретное расписание. Сон — самый большой рычаг на HRV и восстановление следующего дня, так что правильное время кофеина, света и отбоя окупается везде.',
      },
      {
        title: 'Фитнес и тренировки',
        body: 'Калькуляторы пульсовых зон и тренировочной нагрузки — включая оценку аэробной базы (Зона 2) по точной возрастной формуле Танаки — чтобы тренироваться на той интенсивности, что вы задумали, а не наугад.',
      },
      {
        title: 'Питание',
        body: 'Калькуляторы белка, гидратации и потребления на основе опубликованных рекомендаций (ISSN/ACSM), дающие обоснованную дневную норму и разбивку по приёмам вместо округлённого правила.',
      },
      {
        title: 'Фокус, дофамин и долголетие',
        body: 'Инструменты внимания, баланса вознаграждения и здорового долголетия для длинной игры — привычки и ритмы, что накапливаются месяцами, а не показатель, который вы смотрите каждое утро.',
      },
    ],
    readHeading: 'Как честно читать свои числа',
    readBody:
      'Одно измерение — это снимок, а снимки шумны: одна лишь HRV колеблется от сна, гидратации, алкоголя, болезни и даже от того, как вы сели. Ваш собственный тренд за дни и недели куда важнее одного числа, а сравнивать свою абсолютную величину с чужой почти бесполезно. Эти инструменты — для ориентира и самостоятельного эксперимента, а не для диагностики; они не заменяют врача. При таком подходе это быстрый и честный способ превратить показатель, о котором вы слышали, в то, с чем можно реально что-то сделать.',
    ctaPre: 'Хотите, чтобы сторона нервной системы отслеживалась непрерывно, а не вводилась вручную? ',
    seeLink: 'Посмотрите, что делает ONDA Life',
    ctaMid: ', или ',
    compareLink: 'как она сравнивается',
    ctaPost: ' с носимыми устройствами и приложениями, которые люди сопоставляют.',
  },
  es: {
    metaTitle: 'Herramientas de biohacking y calculadoras — gratis y con base científica | ONDA Life',
    metaDescription:
      'Calculadoras interactivas gratuitas de VFC, deuda de sueño, hora del café, zonas de frecuencia cardíaca, proteína y más — cada una contrastada con la evidencia publicada, sin registro, y luego seguible en ONDA Life.',
    breadcrumbTools: 'Herramientas',
    h1: 'Herramientas de biohacking',
    intro1:
      'Calculadoras interactivas gratuitas para las métricas que importan — VFC, sueño, zonas de frecuencia cardíaca, hora del café, proteína y más. Cada herramienta contrasta tu número con la evidencia publicada, no con una regla redondeada, y te dice qué lo mueve de verdad.',
    intro2Pre:
      'Sin registro, sin cuenta, nada que instalar — funcionan directamente en tu navegador. Cuando quieras que esos mismos números se sigan automáticamente en vez de escribirlos una vez, eso es lo que hace ',
    ondaLink: 'ONDA Life',
    intro2Post: ' en tu iPhone y Apple Watch.',
    bioOsTitle: 'Bio OS — panel biométrico en vivo',
    bioOsBadge: 'en vivo · cámara',
    bioOsDesc:
      'Pulso, respiración y estado del sistema nervioso por cámara — tu cuerpo en tiempo real, directamente en el navegador.',
    liveLabel: 'en vivo',
    aboutHeading: 'Sobre estas herramientas',
    aboutP1:
      'Son las pequeñas calculadoras específicas a las que el mundo del quantified-self y el biohacking vuelve una y otra vez — variabilidad de la frecuencia cardíaca, deuda de sueño, vida media de la cafeína, zonas de entrenamiento, necesidad de proteína — reunidas en un solo lugar y, donde importa, atadas a la ciencia en lugar de dejarlas como un número pelado. Lo importante no es el número en sí, sino leerlo en contexto: qué es normal para tu edad, qué señala de verdad un cambio y qué palanca lo mueve.',
    aboutP2Pre:
      'Siempre que una herramienta toca tu sistema nervioso — VFC, frecuencia cardíaca en reposo, carga de estrés — enlaza con ',
    measuresLink: 'lo que mide ONDA',
    aboutP2Mid: ' y con ',
    researchLink: 'la evidencia detrás',
    aboutP2Post:
      ', para que veas las salvedades, no solo el resultado. Preferimos que una calculadora te vuelva un poco más escéptico y mejor informado a darte una puntuación de falsa precisión.',
    domains: [
      {
        title: 'Sistema nervioso y recuperación',
        body: 'Calculadoras de variabilidad de la frecuencia cardíaca, frecuencia cardíaca en reposo y carga de estrés que leen tu estado autónomo — el equilibrio entre la rama simpática de «lucha o huida» y la parasimpática de «descanso y digestión». Son las métricas en torno a las que se construye ONDA Life, así que cada una enlaza con lo que el número significa de verdad y con lo que lo mueve de forma fiable.',
      },
      {
        title: 'Sueño',
        body: 'Herramientas de deuda de sueño, hora límite del café y cronotipo que convierten el sueño de un objetivo vago en un horario concreto. El sueño es la mayor palanca sobre la VFC y la recuperación del día siguiente, así que acertar con el momento de la cafeína, la luz y la hora de dormir se paga en todo lo demás.',
      },
      {
        title: 'Fitness y entrenamiento',
        body: 'Calculadoras de zonas de frecuencia cardíaca y carga de entrenamiento — incluida una estimación de base aeróbica (Zona 2) con la precisa fórmula de edad de Tanaka — para entrenar a la intensidad que realmente pretendes en lugar de adivinar.',
      },
      {
        title: 'Nutrición',
        body: 'Calculadoras de proteína, hidratación e ingesta basadas en guías publicadas (ISSN/ACSM), que te dan un objetivo diario defendible y un reparto por comida en vez de una regla redondeada.',
      },
      {
        title: 'Foco, dopamina y longevidad',
        body: 'Herramientas de atención, equilibrio de recompensa y healthspan para el juego largo — los hábitos y ritmos que se acumulan durante meses, no la métrica que miras cada mañana.',
      },
    ],
    readHeading: 'Cómo leer tus números con honestidad',
    readBody:
      'Una sola lectura es una foto fija, y las fotos fijas tienen ruido: la VFC por sí sola oscila con el sueño, la hidratación, el alcohol, la enfermedad e incluso con cómo te sentaste. Tu propia tendencia a lo largo de días y semanas vale mucho más que una cifra, y comparar tu número absoluto con el de otra persona rara vez es útil. Estas herramientas son para orientarte y experimentar contigo, no para diagnosticar; no sustituyen a un profesional. Usadas así, son una forma rápida y honesta de convertir una métrica de la que has oído hablar en algo sobre lo que puedes actuar.',
    ctaPre: '¿Quieres que la parte del sistema nervioso se siga de forma continua en vez de escribirla? ',
    seeLink: 'Mira lo que hace ONDA Life',
    ctaMid: ', o ',
    compareLink: 'cómo se compara',
    ctaPost: ' con los wearables y las apps que la gente contrasta.',
  },
}
