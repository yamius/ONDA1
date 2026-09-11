/**
 * Localized copy for /people/yakiv-bilenko (en/ru/es). The visible bio + meta
 * localize; the canonical Person entity (JSON-LD, @id <site>/#author) stays
 * language-neutral so the author graph is one node across the site — only the
 * ProfilePage wrapper carries inLanguage. richText syntax for bold + {{link}}.
 */
export interface PeopleCopy {
  metaTitle: string
  metaDescription: string
  breadcrumbAbout: string
  kicker: string
  role: string
  bioParas: string[]
  scopeHeading: string
  scopeBody: string
  elsewhereHeading: string
  linkedinLabel: string
  kukoomLabel: string
  morePre: string
  links: Record<string, { path: string; label: string }>
}

export const PEOPLE_I18N: Record<'en' | 'ru' | 'es', PeopleCopy> = {
  en: {
    metaTitle: 'Yakiv Bilenko — Founder & CEO of ONDA Life',
    metaDescription:
      'Yakiv Bilenko, founder & CEO of ONDA Life — architect (KNUCA, 2006) and Gestalt therapist (MIGIS, 2018) who builds the product. ONDA’s physiology and neuroscience are led by its scientific advisor.',
    breadcrumbAbout: 'About',
    kicker: '[ FOUNDER ]',
    role: 'Founder & CEO, ONDA Life',
    bioParas: [
      'Yakiv Bilenko is the founder and CEO of ONDA Life. He works across two disciplines that rarely meet: architecture and psychology.',
      'As an **architect** — trained at the Kyiv National University of Construction and Architecture (KNUCA, 2006), as an architect-urbanist — he studies and designs structured forms (domes, spheres, pyramids, zomes) and how they exert a structured influence on a person’s mental, physical and psychological state.',
      'As a **Gestalt and systemic-family therapist** — trained at the MIGIS institute (2018), where he also leads groups — he developed a program for comprehensive psychological development of the person, applying modern methods of analysing a person’s state.',
      'ONDA Life grew out of that intersection: the idea that your external and internal environments continuously shape one another, and that a person can learn to read and steer their own physiological state. Yakiv leads ONDA’s product and engineering end-to-end — the app, the data pipeline (iOS, Android, Supabase), and the open pipeline for academic data export.',
    ],
    scopeHeading: 'FOUNDER — NOT THE SCIENTIFIC AUTHORITY',
    scopeBody:
      'Yakiv’s expertise is architecture, psychology and Gestalt therapy, plus full-stack engineering — not clinical neuroscience or physiology. ONDA’s scientific methodology and validation are overseen by its scientific advisor. We keep that line explicit on purpose: the product is built method-first, with the science held to account by someone whose field it is. See {{researchLink}} for the evidence base and the advisor’s role.',
    elsewhereHeading: '[ ELSEWHERE ]',
    linkedinLabel: 'LinkedIn — linkedin.com/in/yamius',
    kukoomLabel: 'KUKOOM — architectural forms project',
    morePre: 'More: ',
    links: {
      researchLink: { path: '/research', label: 'the science behind ONDA' },
      aboutLink: { path: '/about', label: 'About ONDA' },
      productLink: { path: '/product', label: 'Product' },
      scienceLink: { path: '/research', label: 'The science' },
    },
  },

  ru: {
    metaTitle: 'Яков Биленко — основатель и CEO ONDA Life',
    metaDescription:
      'Яков Биленко, основатель и CEO ONDA Life — архитектор (КНУБА, 2006) и гештальт-терапевт (МИГИС, 2018), который строит продукт. Физиологию и нейронауку ONDA ведёт научный советник.',
    breadcrumbAbout: 'О проекте',
    kicker: '[ ОСНОВАТЕЛЬ ]',
    role: 'Основатель и CEO, ONDA Life',
    bioParas: [
      'Яков Биленко — основатель и CEO ONDA Life. Он работает на стыке двух редко пересекающихся дисциплин: архитектуры и психологии.',
      'Как **архитектор** — с образованием Киевского национального университета строительства и архитектуры (КНУБА, 2006), архитектор-урбанист — он изучает и проектирует структурные формы (купола, сферы, пирамиды, зомы) и то, как они оказывают структурное влияние на ментальное, физическое и психологическое состояние человека.',
      'Как **гештальт- и системный семейный терапевт** — с обучением в институте МИГИС (2018), где он также ведёт группы — он разработал программу комплексного психологического развития личности, применяя современные методы анализа состояния человека.',
      'ONDA Life выросла из этого пересечения: из идеи, что внешняя и внутренняя среда непрерывно формируют друг друга и что человек может научиться читать и направлять собственное физиологическое состояние. Яков ведёт продукт и инженерию ONDA от и до — приложение, конвейер данных (iOS, Android, Supabase) и открытый конвейер экспорта данных для науки.',
    ],
    scopeHeading: 'ОСНОВАТЕЛЬ — НЕ НАУЧНЫЙ АВТОРИТЕТ',
    scopeBody:
      'Экспертиза Якова — архитектура, психология и гештальт-терапия плюс full-stack инженерия, а не клиническая нейронаука или физиология. Научную методологию и валидацию ONDA курирует её научный советник. Мы намеренно держим эту границу явной: продукт строится «метод прежде всего», а за науку отвечает тот, чья это область. Смотрите {{researchLink}} — доказательная база и роль советника.',
    elsewhereHeading: '[ ГДЕ ЕЩЁ ]',
    linkedinLabel: 'LinkedIn — linkedin.com/in/yamius',
    kukoomLabel: 'KUKOOM — проект архитектурных форм',
    morePre: 'Ещё: ',
    links: {
      researchLink: { path: '/research', label: 'науку за ONDA' },
      aboutLink: { path: '/about', label: 'О проекте ONDA' },
      productLink: { path: '/product', label: 'Продукт' },
      scienceLink: { path: '/research', label: 'Наука' },
    },
  },

  es: {
    metaTitle: 'Yakiv Bilenko — Fundador y CEO de ONDA Life',
    metaDescription:
      'Yakiv Bilenko, fundador y CEO de ONDA Life — arquitecto (KNUCA, 2006) y terapeuta Gestalt (MIGIS, 2018) que construye el producto. La fisiología y neurociencia de ONDA las lidera su asesor científico.',
    breadcrumbAbout: 'Acerca de',
    kicker: '[ FUNDADOR ]',
    role: 'Fundador y CEO, ONDA Life',
    bioParas: [
      'Yakiv Bilenko es el fundador y CEO de ONDA Life. Trabaja en el cruce de dos disciplinas que rara vez se encuentran: la arquitectura y la psicología.',
      'Como **arquitecto** — formado en la Universidad Nacional de Construcción y Arquitectura de Kiev (KNUCA, 2006), como arquitecto-urbanista — estudia y diseña formas estructuradas (cúpulas, esferas, pirámides, zomes) y cómo ejercen una influencia estructurada sobre el estado mental, físico y psicológico de una persona.',
      'Como **terapeuta Gestalt y sistémico-familiar** — formado en el instituto MIGIS (2018), donde también dirige grupos — desarrolló un programa de desarrollo psicológico integral de la persona, aplicando métodos modernos de análisis del estado de una persona.',
      'ONDA Life surgió de ese cruce: la idea de que tus entornos externo e interno se moldean continuamente entre sí, y de que una persona puede aprender a leer y dirigir su propio estado fisiológico. Yakiv lidera el producto y la ingeniería de ONDA de principio a fin — la app, el pipeline de datos (iOS, Android, Supabase) y el pipeline abierto de exportación de datos para uso académico.',
    ],
    scopeHeading: 'FUNDADOR — NO LA AUTORIDAD CIENTÍFICA',
    scopeBody:
      'La experiencia de Yakiv es la arquitectura, la psicología y la terapia Gestalt, más la ingeniería full-stack — no la neurociencia clínica ni la fisiología. La metodología científica y la validación de ONDA las supervisa su asesor científico. Mantenemos esa línea explícita a propósito: el producto se construye con el método primero, y la ciencia rinde cuentas ante alguien de cuyo campo se trata. Mira {{researchLink}} para la base de evidencia y el papel del asesor.',
    elsewhereHeading: '[ EN OTROS SITIOS ]',
    linkedinLabel: 'LinkedIn — linkedin.com/in/yamius',
    kukoomLabel: 'KUKOOM — proyecto de formas arquitectónicas',
    morePre: 'Más: ',
    links: {
      researchLink: { path: '/research', label: 'la ciencia detrás de ONDA' },
      aboutLink: { path: '/about', label: 'Acerca de ONDA' },
      productLink: { path: '/product', label: 'Producto' },
      scienceLink: { path: '/research', label: 'La ciencia' },
    },
  },
}
