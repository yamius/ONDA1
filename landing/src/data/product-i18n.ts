/**
 * Localized copy for /product. Pilot languages: ru, es (uk/zh follow later).
 * The page uses EN as the built-in default and overlays a locale here when the
 * URL carries /ru or /es. Kept as structured data (not i18n JSON) so this
 * ru+es pilot doesn't require the all-5-language files LOCALIZED_PAGES needs.
 *
 * Translations preserve the honest product claims exactly (iOS-only, no invented
 * price, not a medical device).
 */
export interface ProductCopy {
  metaTitle: string
  metaDescription: string
  heroPara: string
  cta: string
  factsHeading: string
  facts: { label: string; value: string }[]
  appStoreLabel: string
  doesHeading: string
  does: string[]
  doesFootnotePre: string // "For exactly which numbers are measured…, see "
  measuresLink: string
  doesFootnoteMid: string // "; for the method, "
  howLink: string
  whyHeading: string
  whyDesc: string
  whyColTracker: string
  whyColMeditation: string
  whyRows: string[] // localized labels for the 4 WHY_ROWS, in order
  forHeading: string
  forItems: string[]
  notForHeading: string
  notForItems: string[]
  crossPre: string
  compareLink: string
  crossMid: string
  researchLink: string
}

export const PRODUCT_I18N: Record<'ru' | 'es', ProductCopy> = {
  ru: {
    metaTitle: 'ONDA Life — приложение HRV-биофидбека и дыхания с подсказками | Продукт',
    metaDescription:
      'ONDA Life — приложение HRV-биофидбека и дыхания с подсказками для iPhone, iPad и Apple Watch: живая обратная связь по ритму сердца, показатель когерентности, резонансное дыхание и тренды HRV в покое. Бесплатно начать, без аккаунта.',
    heroPara:
      'ONDA Life — приложение HRV-биофидбека и дыхания с подсказками для физиологической саморегуляции в реальном времени и тренировки нервной системы. Оно даёт живую обратную связь по ритму сердца во время размеренного (резонансного) дыхания — через Apple Watch или камеру iPhone — и отслеживает ваш тренд HRV в покое на 8-уровневом пути практики.',
    cta: 'Скачать ONDA в App Store →',
    factsHeading: 'Факты о продукте',
    facts: [
      { label: 'Название', value: 'ONDA Life' },
      { label: 'Категория', value: 'Здоровье и фитнес (HRV-биофидбек и дыхание с подсказками)' },
      { label: 'Платформы', value: 'iPhone, iPad, Apple Watch (iOS / watchOS)' },
      { label: 'Android', value: 'Пока недоступно — только лист ожидания' },
      { label: 'Цена', value: 'Бесплатно начать, без аккаунта. Опциональная подписка для полного доступа.' },
      { label: 'Сенсоры', value: 'Пульс через камеру iPhone (PPG) и данные сердца Apple Watch — отдельный носимый не нужен' },
      { label: 'Данные и приватность', value: 'Данные сердца читаются через Apple HealthKit; медданные остаются на устройстве' },
      { label: 'Первое измерение', value: 'Около 90 секунд, без регистрации' },
    ],
    appStoreLabel: 'App Store',
    doesHeading: 'Что оно делает',
    does: [
      'HRV-биофидбек в реальном времени — видно, как ритм сердца отвечает на дыхание',
      'Живой показатель когерентности в каждой сессии размеренного дыхания',
      'Резонансное дыхание с подсказками (около шести вдохов в минуту)',
      'Отслеживание тренда HRV в покое по дням и неделям',
      'Структурированный 8-уровневый путь практики для нервной системы',
      'Работает с камерой iPhone или Apple Watch, который у вас уже есть',
    ],
    doesFootnotePre: 'Что именно измеряется, выводится или оценивается — см. ',
    measuresLink: 'что измеряет ONDA',
    doesFootnoteMid: '; о методе — ',
    howLink: 'как это работает',
    whyHeading: 'Почему ONDA',
    whyDesc: 'Что отличает ONDA от пассивного трекера и медитационного приложения.',
    whyColTracker: 'Трекер (Oura)',
    whyColMeditation: 'Медитация (Headspace)',
    whyRows: [
      'HRV-биофидбек в реальном времени',
      'Живой показатель когерентности',
      'Работает без носимого (камера iPhone)',
      'Структурированная программа',
    ],
    forHeading: 'ONDA подойдёт',
    forItems: [
      'Тем, кто хочет активно тренировать нервную систему, а не только отслеживать',
      'Владельцам Apple Watch и всем, кто хочет HRV-биофидбек без лишнего носимого',
      'Тем, кто хочет физиологическую обратную связь во время дыхания — чувствовать, что работает',
      'Тем, кому не нравятся пассивные баллы готовности и хочется практики',
    ],
    notForHeading: 'ONDA не подойдёт',
    notForItems: [
      'Для диагностики или лечения какого-либо заболевания — ONDA не медицинский прибор',
      'Как замена психотерапии или медицинской помощи',
      'Для трекинга сна — ONDA не сон-трекер',
      'Как большая библиотека медитаций или историй для сна',
    ],
    crossPre: 'Как ONDA сравнивается с другими приложениями и носимыми — на ',
    compareLink: 'странице сравнений',
    crossMid: ', а доказательства, на которых она стоит, — в ',
    researchLink: 'науке за ONDA',
  },
  es: {
    metaTitle: 'ONDA Life — App de biofeedback de VFC y respiración guiada | Producto',
    metaDescription:
      'ONDA Life es una app de biofeedback de VFC y respiración guiada para iPhone, iPad y Apple Watch: feedback en vivo del ritmo cardíaco, puntuación de coherencia, respiración de resonancia y tendencias de VFC en reposo. Gratis para empezar, sin cuenta.',
    heroPara:
      'ONDA Life es una app de biofeedback de VFC y respiración guiada para la autorregulación fisiológica en tiempo real y el entrenamiento del sistema nervioso. Da feedback en vivo del ritmo cardíaco durante la respiración pausada (de resonancia) —con tu Apple Watch o la cámara del iPhone— y sigue tu tendencia de VFC en reposo a lo largo de un camino de práctica de 8 niveles.',
    cta: 'Consigue ONDA en la App Store →',
    factsHeading: 'Datos del producto',
    facts: [
      { label: 'Nombre', value: 'ONDA Life' },
      { label: 'Categoría', value: 'Salud y forma física (biofeedback de VFC y respiración guiada)' },
      { label: 'Plataformas', value: 'iPhone, iPad, Apple Watch (iOS / watchOS)' },
      { label: 'Android', value: 'Aún no disponible — solo lista de espera' },
      { label: 'Precio', value: 'Gratis para empezar, sin cuenta. Suscripción opcional para acceso completo.' },
      { label: 'Sensores', value: 'Pulso por la cámara del iPhone (PPG) y datos cardíacos del Apple Watch — sin wearable extra' },
      { label: 'Datos y privacidad', value: 'Los datos cardíacos se leen vía Apple HealthKit; los datos de salud quedan en tu dispositivo' },
      { label: 'Primera lectura', value: 'Unos 90 segundos, sin registro' },
    ],
    appStoreLabel: 'App Store',
    doesHeading: 'Qué hace',
    does: [
      'Biofeedback de VFC en tiempo real — ve cómo tu ritmo cardíaco responde mientras respiras',
      'Puntuación de coherencia en vivo en cada sesión de respiración pausada',
      'Respiración de resonancia guiada (unas seis respiraciones por minuto)',
      'Seguimiento de la tendencia de VFC en reposo por días y semanas',
      'Un camino de práctica estructurado de 8 niveles para el sistema nervioso',
      'Funciona con la cámara del iPhone o un Apple Watch que ya tengas',
    ],
    doesFootnotePre: 'Para saber exactamente qué se mide, deriva o estima, consulta ',
    measuresLink: 'qué mide ONDA',
    doesFootnoteMid: '; para el método, ',
    howLink: 'cómo funciona',
    whyHeading: 'Por qué ONDA',
    whyDesc: 'Lo que distingue a ONDA de un tracker pasivo y de una app de meditación.',
    whyColTracker: 'Un tracker (Oura)',
    whyColMeditation: 'App de meditación (Headspace)',
    whyRows: [
      'Biofeedback de VFC en tiempo real',
      'Puntuación de coherencia en vivo',
      'Funciona sin wearable (cámara del iPhone)',
      'Programa estructurado',
    ],
    forHeading: 'ONDA es para',
    forItems: [
      'Quienes quieren entrenar activamente su sistema nervioso, no solo medirlo',
      'Usuarios de Apple Watch y quien quiera biofeedback de VFC sin wearable extra',
      'Quienes quieren feedback fisiológico durante la respiración — sentir que funciona',
      'Quienes no quieren puntuaciones pasivas de preparación y prefieren una práctica',
    ],
    notForHeading: 'ONDA no es para',
    notForItems: [
      'Diagnóstico ni tratamiento de ninguna condición médica — ONDA no es un dispositivo médico',
      'Sustituir la psicoterapia o la atención médica',
      'Seguimiento del sueño — ONDA no es un tracker de sueño',
      'Una gran biblioteca de meditación o cuentos para dormir',
    ],
    crossPre: 'Cómo se compara ONDA con otras apps y wearables, en el ',
    compareLink: 'hub de comparación',
    crossMid: ', y la evidencia en la que se basa, en ',
    researchLink: 'la ciencia detrás de ONDA',
  },
}
