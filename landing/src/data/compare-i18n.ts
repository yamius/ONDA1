/**
 * Localized copy for /compare. Pilot languages: ru, es (uk/zh follow later).
 *
 * Localized: framing prose (header, matrix headings/legend/caption, section
 * headings, "How we compare" body) and the 9 capability-axis row labels of the
 * matrix (a big readability win for the flagship table). NOT localized:
 * competitor names, category labels, round-up/head-to-head titles + verdicts —
 * they are the same content as the English-only /compare/<slug> detail pages
 * the cards link to, so they stay EN (mirrors /tools and /topics). Cross-links
 * resolve through langHref (localized where a route exists, EN otherwise).
 *
 * axisLabels is keyed by the exact CAPABILITIES strings in onda-vs.ts.
 */
export interface CompareCopy {
  metaTitle: string
  metaDescription: string
  kicker: string
  h1: string
  intro: string
  matrixHeading: string
  matrixIntro: string
  yesWord: string
  limitedWord: string
  noWord: string
  capabilityColHeader: string
  matrixFootPre: string
  measuresLink: string
  matrixFootPost: string
  axisLabels: Record<string, string>
  topPicksHeading: string
  headToHeadHeading: string
  howHeading: string
  howP1: string
  howP2a: string
  compareLinkText: string
  howP2b: string
  reviewsLink: string
  howP2c: string
  rubricLink: string
  howP2d: string
  howP2e: string
  evidenceLink: string
  howP2f: string
}

export const COMPARE_I18N: Record<'ru' | 'es', CompareCopy> = {
  ru: {
    metaTitle: 'ONDA против Oura, WHOOP, Headspace, Calm и других — сравнение | ONDA Life',
    metaDescription:
      'Как HRV-биофидбек ONDA Life сравнивается с Oura, WHOOP, Headspace, Calm, Breathwrk и Elite HRV — объективные таблицы возможностей и кому что подходит.',
    kicker: '[ СРАВНЕНИЕ ]',
    h1: 'ONDA против альтернатив.',
    intro:
      'Как HRV-биофидбек ONDA в реальном времени соотносится с приложениями и носимыми устройствами, которые люди сопоставляют. Это собственные сравнения ONDA, но по-честному — одни и те же строки возможностей для всех — с честным «кому подходит» с каждой стороны.',
    matrixHeading: 'Возможности с первого взгляда',
    matrixIntro: 'ONDA и приложения, которые люди сопоставляют, по одним осям.',
    yesWord: 'да',
    limitedWord: 'ограниченно',
    noWord: 'нет',
    capabilityColHeader: 'Возможность',
    matrixFootPre:
      'Это собственное сравнение ONDA. Нажмите на любого конкурента для полного разбора и смотрите ',
    measuresLink: 'что измеряет ONDA',
    matrixFootPost: '.',
    axisLabels: {
      'Real-time HRV biofeedback (live feedback as you breathe)':
        'HRV-биофидбек в реальном времени (живая обратная связь во время дыхания)',
      'Live coherence score': 'Живой показатель когерентности',
      'Guided / paced breathing': 'Направляемое / размеренное дыхание',
      'Works with no wearable or chest strap (iPhone camera)':
        'Работает без носимого и нагрудного датчика (камера iPhone)',
      'Apple Watch support': 'Поддержка Apple Watch',
      'Resting-HRV trend over time': 'Тренд HRV в покое со временем',
      'Sleep / overnight readiness tracking': 'Трекинг сна / ночной готовности',
      'Large meditation / sleep content library': 'Большая библиотека медитаций / контента для сна',
      'Structured, progressive program': 'Структурированная прогрессивная программа',
    },
    topPicksHeading: 'Лучшие по категориям',
    headToHeadHeading: 'Один на один',
    howHeading: 'Как мы сравниваем',
    howP1:
      'Это собственные сравнения ONDA, поэтому мы держим их к более строгому правилу, чем типичная страница «vs»: каждый конкурент оценивается по одним и тем же строкам возможностей — по публичной информации и личному использованию, — и в каждом разборе есть честное «кому подходит» с обеих сторон, включая случаи, где соперник — лучший выбор. ONDA — это приложение HRV-биофидбека и направляемого дыхания в реальном времени; когда вам на самом деле нужен пассивный ночной трекинг с кольца или браслета, мы так и говорим.',
    howP2a:
      'Поскольку мы не можем быть нейтральны к собственному продукту, мы держим свои сравнения здесь, на ',
    compareLinkText: '/compare',
    howP2b: ', и вне независимых ',
    reviewsLink: 'обзоров',
    howP2c: ', которые оцениваются по ',
    rubricLink: 'публичной методике',
    howP2d: ', из которой ONDA намеренно исключена. За деталями смотрите ',
    howP2e: ' и ',
    evidenceLink: 'доказательства',
    howP2f: ', на которых она построена.',
  },
  es: {
    metaTitle: 'ONDA frente a Oura, WHOOP, Headspace, Calm y más — comparación | ONDA Life',
    metaDescription:
      'Cómo se compara el biofeedback de VFC de ONDA Life con Oura, WHOOP, Headspace, Calm, Breathwrk y Elite HRV — tablas objetivas de capacidades y para quién es mejor cada uno.',
    kicker: '[ COMPARAR ]',
    h1: 'ONDA frente a las alternativas.',
    intro:
      'Cómo se sitúa el biofeedback de VFC en tiempo real de ONDA frente a las apps y wearables que la gente contrasta. Son las propias comparaciones de ONDA, pero mantenidas objetivas — las mismas filas de capacidades para todos — con un honesto «mejor para» en cada lado.',
    matrixHeading: 'Capacidades de un vistazo',
    matrixIntro: 'ONDA y las apps que la gente contrasta, en los mismos ejes.',
    yesWord: 'sí',
    limitedWord: 'limitado',
    noWord: 'no',
    capabilityColHeader: 'Capacidad',
    matrixFootPre:
      'Esta es la propia comparación de ONDA. Toca cualquier competidor para el análisis completo y mira ',
    measuresLink: 'qué mide ONDA',
    matrixFootPost: '.',
    axisLabels: {
      'Real-time HRV biofeedback (live feedback as you breathe)':
        'Biofeedback de VFC en tiempo real (feedback en vivo mientras respiras)',
      'Live coherence score': 'Puntuación de coherencia en vivo',
      'Guided / paced breathing': 'Respiración guiada / pautada',
      'Works with no wearable or chest strap (iPhone camera)':
        'Funciona sin wearable ni banda de pecho (cámara del iPhone)',
      'Apple Watch support': 'Compatibilidad con Apple Watch',
      'Resting-HRV trend over time': 'Tendencia de VFC en reposo en el tiempo',
      'Sleep / overnight readiness tracking': 'Seguimiento de sueño / preparación nocturna',
      'Large meditation / sleep content library': 'Amplia biblioteca de meditación / contenido para dormir',
      'Structured, progressive program': 'Programa estructurado y progresivo',
    },
    topPicksHeading: 'Mejores por categoría',
    headToHeadHeading: 'Cara a cara',
    howHeading: 'Cómo comparamos',
    howP1:
      'Son las comparaciones propias de ONDA, así que las sometemos a una regla más estricta que una página «vs» típica: cada competidor se puntúa con las mismas filas de capacidades — a partir de información pública y uso de primera mano —, y cada cara a cara lleva un honesto «mejor para» en ambos lados, incluidos los casos en que un rival es la mejor elección. ONDA es una app de biofeedback de VFC y respiración guiada en tiempo real; cuando lo que de verdad quieres es un seguimiento nocturno pasivo de un anillo o una banda, lo decimos.',
    howP2a:
      'Como no podemos ser neutrales sobre nuestro propio producto, mantenemos nuestras comparaciones aquí, en ',
    compareLinkText: '/compare',
    howP2b: ', y fuera de las ',
    reviewsLink: 'reseñas',
    howP2c: ' independientes, que se puntúan con una ',
    rubricLink: 'rúbrica pública',
    howP2d: ' de la que ONDA queda deliberadamente fuera. Para el detalle de fondo, mira ',
    howP2e: ' y ',
    evidenceLink: 'la evidencia',
    howP2f: ' sobre la que se construye.',
  },
}
