/**
 * Localized copy for /topics. Pilot languages: ru, es (uk/zh follow later).
 *
 * Only the hub-index framing prose is localized — intro, the "How the hubs are
 * organised" body and its cross-links. The topic cards' names + taglines stay
 * English because the pillar pages at /topics/<slug> are English-only; the hub
 * links keep EN paths, mirroring /tools and /product. Cross-links are resolved
 * through langHref (localized where a localized route exists, EN otherwise).
 */
export interface TopicsCopy {
  metaTitle: string
  metaDescription: string
  breadcrumbTopics: string
  h1: string
  intro1: string
  intro2: string
  pillarInReview: string
  orgHeading: string
  orgP1: string
  orgP2Pre: string
  researchLink: string
  orgP2Post: string
  orgP3Pre: string
  measuresLink: string
  orgP3Mid1: string
  hrvLink: string
  orgP3Mid2: string
  articlesLink: string
  orgP3And: string
  glossaryLink: string
  orgP3Post: string
}

export const TOPICS_I18N: Record<'ru' | 'es', TopicsCopy> = {
  ru: {
    metaTitle: 'Тематические хабы | ONDA Life — статьи по кластерам',
    metaDescription:
      'Статьи и термины глоссария, сгруппированные по смысловым кластерам: HRV, циркадные ритмы, дофамин, метаболизм, дыхание, нейропластичность, когниция, спинной мозг, гормоны и долголетие — каждый кластер с наукой за ним.',
    breadcrumbTopics: 'Темы',
    h1: 'Тематические хабы',
    intro1:
      'Статьи и термины глоссария, организованные по смысловым кластерам. Каждый хаб — это кураторский пиллар одной области «биокомпьютера»: наука, практика и словарь в одном месте, а не разбросанные по отдельным постам.',
    intro2:
      'Начните с хаба, который отвечает тому, над чем вы работаете, и идите по ссылкам внутрь; каждая статья и определённый термин ссылаются на соседние, так что один кластер открывает следующий.',
    pillarInReview: '[ пиллар на проверке — скоро ]',
    orgHeading: 'Как устроены хабы',
    orgP1:
      'База знаний ONDA сгруппирована в тематические хабы, а не в плоскую ленту блога. Каждый хаб — это пиллар: развёрнутый обзор одной системы тела, рассматриваемой как часть «биокомпьютера», под которым кластеризованы его статьи и термины глоссария. Кластеры соответствуют областям, которые реально управляют вашим самочувствием и работоспособностью: вариабельность сердечного ритма и вегетативная нервная система, циркадный ритм, дофамин и мотивация, метаболизм, дыхание, нейропластичность, когниция, спинально-моторная система, гормоны и долголетие.',
    orgP2Pre:
      'Смысл кластеризации — контекст. Одна статья отвечает на один вопрос; хаб показывает, как этот ответ встроен в целую систему — чтобы вы видели, например, что HRV, время сна и дыхание — это три взгляда на одно и то же состояние нервной системы, а не три несвязанных совета. Где заявление хорошо подтверждено, мы его цитируем и ссылаемся на ',
    researchLink: 'доказательства',
    orgP2Post:
      '; где идея — это рамка или метафора, мы это говорим и держим отдельно от измеряемой науки.',
    orgP3Pre:
      'Хабы, которые ещё на проверке, помечены и не попадают в поиск, пока их пиллар не дописан и не выверен — недописанная страница не входит в индекс. Чтобы углубиться в измеряемую сторону, смотрите ',
    measuresLink: 'что измеряет ONDA',
    orgP3Mid1: ', разбор ',
    hrvLink: 'HRV-биофидбека',
    orgP3Mid2: ', или полные ',
    articlesLink: 'статьи',
    orgP3And: ' и ',
    glossaryLink: 'глоссарий',
    orgP3Post: '.',
  },
  es: {
    metaTitle: 'Centros temáticos | ONDA Life — artículos por clúster',
    metaDescription:
      'Artículos y términos del glosario agrupados por clúster semántico: VFC, ritmo circadiano, dopamina, metabolismo, respiración, neuroplasticidad, cognición, médula espinal, hormonas y longevidad — cada clúster con la ciencia detrás.',
    breadcrumbTopics: 'Temas',
    h1: 'Centros temáticos',
    intro1:
      'Artículos y términos del glosario organizados por clúster semántico. Cada centro es un pilar curado de un dominio del «biocomputador»: la ciencia, la práctica y el vocabulario en un solo lugar, en vez de repartidos en posts sueltos.',
    intro2:
      'Empieza por el centro que encaje con lo que estás trabajando y sigue los enlaces hacia dentro; cada artículo y término definido remite a los vecinos, así que un clúster abre el siguiente.',
    pillarInReview: '[ pilar en revisión — próximamente ]',
    orgHeading: 'Cómo están organizados los centros',
    orgP1:
      'La base de conocimiento de ONDA está agrupada en centros temáticos, no en un feed de blog plano. Cada centro es un pilar: una visión de conjunto extensa de un sistema del cuerpo tratado como parte de un «biocomputador», con sus artículos y términos del glosario agrupados debajo. Los clústeres corresponden a los dominios que realmente gobiernan cómo te sientes y rindes: variabilidad de la frecuencia cardíaca y sistema nervioso autónomo, ritmo circadiano, dopamina y motivación, metabolismo, respiración, neuroplasticidad, cognición, el sistema espinal/motor, hormonas y longevidad.',
    orgP2Pre:
      'El sentido de agrupar es el contexto. Un solo artículo responde una pregunta; un centro muestra cómo esa respuesta encaja dentro de un sistema entero — para que veas, por ejemplo, que la VFC, el horario del sueño y la respiración son tres vistas del mismo estado del sistema nervioso, no tres consejos inconexos. Donde una afirmación está bien respaldada la citamos y enlazamos a la ',
    researchLink: 'evidencia',
    orgP2Post:
      '; donde una idea es un marco o una metáfora, lo decimos y la mantenemos separada de la ciencia medida.',
    orgP3Pre:
      'Los centros aún en revisión están marcados como tales y quedan fuera de la búsqueda hasta que su pilar esté terminado y verificado — una página a medio escribir nunca entra en el índice. Para profundizar en la parte medible, mira ',
    measuresLink: 'qué mide ONDA',
    orgP3Mid1: ', el explicativo de ',
    hrvLink: 'biofeedback de VFC',
    orgP3Mid2: ', o los ',
    articlesLink: 'artículos',
    orgP3And: ' y el ',
    glossaryLink: 'glosario',
    orgP3Post: ' completos.',
  },
}
