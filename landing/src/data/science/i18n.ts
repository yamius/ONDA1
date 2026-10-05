/**
 * ONDA Science — languages and interface strings.
 *
 * SCIENCE_LIVE_LANGS: languages whose /<lang>/science section is published. A language goes live only when
 * every published EN page has a reviewed translation in content/science-i18n/<lang>/ (owner decision: one
 * language at a time, native-quality translations). The generator refuses to publish a live language with a
 * missing or outdated page translation.
 *
 * SCIENCE_UI: page chrome per language. Page texts themselves live in content/science-i18n/<lang>/<kind>/<slug>.md.
 */
export const SCIENCE_LIVE_LANGS: readonly string[] = []

export type ScienceUiKind = 'concepts' | 'measurements' | 'mechanisms' | 'evidence'

export interface ScienceUi {
  hubTitle: string
  hubMetaTitle: string
  hubDescription: string
  hubIntro: string
  hubResearch: [string, string, string] // before link, link text, after link
  science: string // breadcrumb label
  home: string
  kinds: Record<ScienceUiKind, { label: string; desc: string }>
  kindMetaTitle: string // "{label} — ONDA Science"
  kindMetaDescription: string // "ONDA Science {label}: {desc}"
  classes: Record<'established' | 'guideline' | 'context-dependent' | 'emerging' | 'debated' | 'unknown', string>
  editor: string // "{name} — editor"
  reviewedBy: string // "Reviewed by {name}"
  reviewedOn: string // " on {date}"
  updated: string // "Updated {date}"
  shortAnswer: string
  keyPoints: string
  evidenceAtAGlance: string
  claim: string
  evidence: string
  limitation: string
  sources: string
  officialDocumentation: string
  related: string
  relatedTypes: { Science: string; Glossary: string; Article: string; Tool: string }
  howMade: string
  translationNote: string // shown on translated pages: quotes and sources stay in the original language
  dateLocale: string
}

export const SCIENCE_UI: Record<string, ScienceUi> = {
  en: {
    hubTitle: 'ONDA Science',
    hubMetaTitle: 'ONDA Science: HRV, Breathing and the Nervous System',
    hubDescription:
      'Evidence-first reference pages on heart rate variability, breathing and the autonomic nervous system — what each measure is, what the research shows and its limits.',
    hubIntro:
      'Reference pages on heart rate variability, breathing and the autonomic nervous system. Each page starts with a short answer, separates what is established from what depends on context or is still debated, says what a measure does not tell you, and lists its sources. Every number comes from one checked list of facts. Educational information, not medical advice.',
    hubResearch: ['Looking for how ONDA itself is built and validated? See ', 'the research behind ONDA', '.'],
    science: 'Science',
    home: 'Home',
    kinds: {
      concepts: { label: 'Concepts', desc: 'What the core terms mean — definitions, what they reflect and what they do not.' },
      measurements: { label: 'Measurements', desc: 'How these signals are measured, by which methods, and how far to trust them.' },
      mechanisms: { label: 'Mechanisms', desc: 'How breathing, the heart and the nervous system interact.' },
      evidence: { label: 'Evidence', desc: 'What the research shows for specific methods, by strength of evidence.' },
    },
    kindMetaTitle: '{label} — ONDA Science',
    kindMetaDescription: 'ONDA Science {label}: {desc}',
    classes: {
      established: 'Established',
      guideline: 'Guideline / expert consensus',
      'context-dependent': 'Context-dependent',
      emerging: 'Emerging',
      debated: 'Debated',
      unknown: 'Unknown',
    },
    editor: '{name} — editor',
    reviewedBy: 'Reviewed by {name}',
    reviewedOn: ' on {date}',
    updated: 'Updated {date}',
    shortAnswer: 'Short answer',
    keyPoints: 'Key points',
    evidenceAtAGlance: 'Evidence at a glance',
    claim: 'Claim',
    evidence: 'Evidence',
    limitation: 'Limitation',
    sources: 'Sources',
    officialDocumentation: 'official documentation',
    related: 'Related',
    relatedTypes: { Science: 'Science', Glossary: 'Glossary', Article: 'Article', Tool: 'Tool' },
    howMade:
      'How ONDA Science pages are made: every number comes from one checked list of facts, every claim is mapped to its sources and graded by strength of evidence, and sources need a DOI or PMID (manufacturer documentation is used only for device facts).',
    translationNote: '',
    dateLocale: 'en-US',
  },
  ru: {
    hubTitle: 'ONDA Science',
    hubMetaTitle: 'ONDA Science: HRV, дыхание и нервная система',
    hubDescription:
      'Справочные страницы о вариабельности сердечного ритма, дыхании и вегетативной нервной системе: что измеряет каждый показатель, что показывают исследования и где их пределы.',
    hubIntro:
      'Справочные страницы о вариабельности сердечного ритма (HRV), дыхании и вегетативной нервной системе. Каждая страница начинается с короткого ответа, отделяет установленное от того, что зависит от условий или остаётся спорным, объясняет, чего показатель не говорит, и перечисляет источники. Все числа берутся из одного проверенного списка фактов. Это образовательная информация, а не медицинская рекомендация.',
    hubResearch: ['Хотите узнать, как устроен и проверяется сам ONDA? Смотрите ', 'исследования, на которых основан ONDA', '.'],
    science: 'Наука',
    home: 'Главная',
    kinds: {
      concepts: { label: 'Понятия', desc: 'Что означают основные термины: определения, что они отражают и чего не отражают.' },
      measurements: { label: 'Измерения', desc: 'Как измеряются эти сигналы, какими методами и насколько им можно доверять.' },
      mechanisms: { label: 'Механизмы', desc: 'Как взаимодействуют дыхание, сердце и нервная система.' },
      evidence: { label: 'Доказательства', desc: 'Что показывают исследования конкретных методов — с учётом силы доказательств.' },
    },
    kindMetaTitle: '{label} — ONDA Science',
    kindMetaDescription: 'ONDA Science, раздел «{label}»: {desc}',
    classes: {
      established: 'Установлено',
      guideline: 'Рекомендации / консенсус экспертов',
      'context-dependent': 'Зависит от условий',
      emerging: 'Предварительные данные',
      debated: 'Спорно',
      unknown: 'Неизвестно',
    },
    editor: 'Редактор: {name}',
    reviewedBy: 'Проверил: {name}',
    reviewedOn: ', {date}',
    updated: 'Обновлено {date}',
    shortAnswer: 'Короткий ответ',
    keyPoints: 'Главное',
    evidenceAtAGlance: 'Доказательства кратко',
    claim: 'Утверждение',
    evidence: 'Доказательства',
    limitation: 'Ограничение',
    sources: 'Источники',
    officialDocumentation: 'официальная документация',
    related: 'Смотрите также',
    relatedTypes: { Science: 'Наука', Glossary: 'Глоссарий', Article: 'Статья', Tool: 'Инструмент' },
    howMade:
      'Как делаются страницы ONDA Science: все числа берутся из одного проверенного списка фактов, каждое утверждение связано с источниками и оценено по силе доказательств, а у источников должен быть DOI или PMID (документация производителей используется только для фактов об устройствах).',
    translationNote: 'Названия работ и журналов приведены на языке оригинала.',
    dateLocale: 'ru-RU',
  },
  uk: {
    hubTitle: 'ONDA Science',
    hubMetaTitle: 'ONDA Science: HRV, дихання і нервова система',
    hubDescription:
      'Довідкові сторінки про варіабельність серцевого ритму, дихання та вегетативну нервову систему: що вимірює кожен показник, що показують дослідження і де їхні межі.',
    hubIntro:
      'Довідкові сторінки про варіабельність серцевого ритму (HRV), дихання та вегетативну нервову систему. Кожна сторінка починається з короткої відповіді, відокремлює встановлене від того, що залежить від умов або досі дискусійне, пояснює, чого показник не говорить, і наводить джерела. Усі числа беруться з одного перевіреного списку фактів. Це освітня інформація, а не медична порада.',
    hubResearch: ['Хочете дізнатися, як улаштований і перевіряється сам ONDA? Дивіться ', 'дослідження, на яких ґрунтується ONDA', '.'],
    science: 'Наука',
    home: 'Головна',
    kinds: {
      concepts: { label: 'Поняття', desc: 'Що означають основні терміни: визначення, що вони відображають і чого не відображають.' },
      measurements: { label: 'Вимірювання', desc: 'Як вимірюють ці сигнали, якими методами і наскільки їм можна довіряти.' },
      mechanisms: { label: 'Механізми', desc: 'Як взаємодіють дихання, серце і нервова система.' },
      evidence: { label: 'Докази', desc: 'Що показують дослідження конкретних методів — з урахуванням сили доказів.' },
    },
    kindMetaTitle: '{label} — ONDA Science',
    kindMetaDescription: 'ONDA Science, розділ «{label}»: {desc}',
    classes: {
      established: 'Встановлено',
      guideline: 'Рекомендації / консенсус експертів',
      'context-dependent': 'Залежить від умов',
      emerging: 'Попередні дані',
      debated: 'Дискусійно',
      unknown: 'Невідомо',
    },
    editor: 'Редактор: {name}',
    reviewedBy: 'Перевірив: {name}',
    reviewedOn: ', {date}',
    updated: 'Оновлено {date}',
    shortAnswer: 'Коротка відповідь',
    keyPoints: 'Головне',
    evidenceAtAGlance: 'Докази коротко',
    claim: 'Твердження',
    evidence: 'Докази',
    limitation: 'Обмеження',
    sources: 'Джерела',
    officialDocumentation: 'офіційна документація',
    related: 'Дивіться також',
    relatedTypes: { Science: 'Наука', Glossary: 'Глосарій', Article: 'Стаття', Tool: 'Інструмент' },
    howMade:
      'Як створюються сторінки ONDA Science: усі числа беруться з одного перевіреного списку фактів, кожне твердження пов’язане з джерелами й оцінене за силою доказів, а джерела мають мати DOI або PMID (документацію виробників використовуємо лише для фактів про пристрої).',
    translationNote: 'Назви праць і журналів наведено мовою оригіналу.',
    dateLocale: 'uk-UA',
  },
  es: {
    hubTitle: 'ONDA Science',
    hubMetaTitle: 'ONDA Science: HRV, respiración y sistema nervioso',
    hubDescription:
      'Páginas de referencia sobre la variabilidad de la frecuencia cardíaca, la respiración y el sistema nervioso autónomo: qué mide cada indicador, qué muestra la investigación y sus límites.',
    hubIntro:
      'Páginas de referencia sobre la variabilidad de la frecuencia cardíaca (HRV o VFC), la respiración y el sistema nervioso autónomo. Cada página empieza con una respuesta breve, separa lo establecido de lo que depende del contexto o sigue en debate, explica lo que un indicador no te dice y enumera sus fuentes. Todas las cifras salen de una única lista de datos verificados. Información educativa, no consejo médico.',
    hubResearch: ['¿Quieres saber cómo se construye y se valida ONDA? Consulta ', 'la investigación detrás de ONDA', '.'],
    science: 'Ciencia',
    home: 'Inicio',
    kinds: {
      concepts: { label: 'Conceptos', desc: 'Qué significan los términos clave: definiciones, qué reflejan y qué no.' },
      measurements: { label: 'Mediciones', desc: 'Cómo se miden estas señales, con qué métodos y hasta qué punto fiarse de ellas.' },
      mechanisms: { label: 'Mecanismos', desc: 'Cómo interactúan la respiración, el corazón y el sistema nervioso.' },
      evidence: { label: 'Evidencia', desc: 'Qué muestra la investigación sobre métodos concretos, según la solidez de la evidencia.' },
    },
    kindMetaTitle: '{label} — ONDA Science',
    kindMetaDescription: 'ONDA Science, sección «{label}»: {desc}',
    classes: {
      established: 'Establecido',
      guideline: 'Guía / consenso de expertos',
      'context-dependent': 'Depende del contexto',
      emerging: 'Emergente',
      debated: 'En debate',
      unknown: 'Desconocido',
    },
    editor: 'Editor: {name}',
    reviewedBy: 'Revisado por {name}',
    reviewedOn: ' el {date}',
    updated: 'Actualizado el {date}',
    shortAnswer: 'Respuesta breve',
    keyPoints: 'Puntos clave',
    evidenceAtAGlance: 'La evidencia de un vistazo',
    claim: 'Afirmación',
    evidence: 'Evidencia',
    limitation: 'Limitación',
    sources: 'Fuentes',
    officialDocumentation: 'documentación oficial',
    related: 'Relacionado',
    relatedTypes: { Science: 'Ciencia', Glossary: 'Glosario', Article: 'Artículo', Tool: 'Herramienta' },
    howMade:
      'Cómo se elaboran las páginas de ONDA Science: cada cifra sale de una única lista de datos verificados, cada afirmación se vincula con sus fuentes y se clasifica según la solidez de la evidencia, y las fuentes necesitan un DOI o PMID (la documentación de fabricantes solo se usa para datos sobre dispositivos).',
    translationNote: 'Los títulos de los trabajos y de las revistas se citan en su idioma original.',
    dateLocale: 'es-ES',
  },
  de: {
    hubTitle: 'ONDA Science',
    hubMetaTitle: 'ONDA Science: HRV, Atmung und Nervensystem',
    hubDescription:
      'Evidenzbasierte Referenzseiten zu Herzfrequenzvariabilität, Atmung und autonomem Nervensystem: was jede Messgröße erfasst, was die Forschung zeigt und wo ihre Grenzen liegen.',
    hubIntro:
      'Referenzseiten zu Herzfrequenzvariabilität (HRV), Atmung und autonomem Nervensystem. Jede Seite beginnt mit einer kurzen Antwort, trennt Gesichertes von dem, was vom Kontext abhängt oder noch umstritten ist, sagt, was eine Messgröße nicht verrät, und nennt ihre Quellen. Jede Zahl stammt aus einer einzigen geprüften Faktenliste. Bildungsinformation, keine medizinische Beratung.',
    hubResearch: ['Du willst wissen, wie ONDA selbst gebaut und geprüft wird? Sieh dir ', 'die Forschung hinter ONDA', ' an.'],
    science: 'Wissenschaft',
    home: 'Startseite',
    kinds: {
      concepts: { label: 'Begriffe', desc: 'Was die zentralen Begriffe bedeuten: Definitionen, was sie abbilden und was nicht.' },
      measurements: { label: 'Messung', desc: 'Wie diese Signale gemessen werden, mit welchen Methoden und wie weit man ihnen trauen kann.' },
      mechanisms: { label: 'Mechanismen', desc: 'Wie Atmung, Herz und Nervensystem zusammenwirken.' },
      evidence: { label: 'Evidenz', desc: 'Was die Forschung zu einzelnen Methoden zeigt – nach Stärke der Evidenz.' },
    },
    kindMetaTitle: '{label} — ONDA Science',
    kindMetaDescription: 'ONDA Science, Bereich „{label}“: {desc}',
    classes: {
      established: 'Gesichert',
      guideline: 'Leitlinie / Expertenkonsens',
      'context-dependent': 'Kontextabhängig',
      emerging: 'Vorläufig',
      debated: 'Umstritten',
      unknown: 'Unbekannt',
    },
    editor: 'Redaktion: {name}',
    reviewedBy: 'Geprüft von {name}',
    reviewedOn: ' am {date}',
    updated: 'Aktualisiert am {date}',
    shortAnswer: 'Kurze Antwort',
    keyPoints: 'Das Wichtigste',
    evidenceAtAGlance: 'Evidenz auf einen Blick',
    claim: 'Aussage',
    evidence: 'Evidenz',
    limitation: 'Einschränkung',
    sources: 'Quellen',
    officialDocumentation: 'offizielle Dokumentation',
    related: 'Verwandte Seiten',
    relatedTypes: { Science: 'Wissenschaft', Glossary: 'Glossar', Article: 'Artikel', Tool: 'Tool' },
    howMade:
      'So entstehen die Seiten von ONDA Science: Jede Zahl stammt aus einer einzigen geprüften Faktenliste, jede Aussage ist ihren Quellen zugeordnet und nach Stärke der Evidenz eingestuft, und Quellen brauchen eine DOI oder PMID (Herstellerdokumentation nur für Gerätefakten).',
    translationNote: 'Titel von Arbeiten und Zeitschriften stehen in der Originalsprache.',
    dateLocale: 'de-DE',
  },
  fr: {
    hubTitle: 'ONDA Science',
    hubMetaTitle: 'ONDA Science : HRV, respiration et système nerveux',
    hubDescription:
      'Des pages de référence sur la variabilité de la fréquence cardiaque, la respiration et le système nerveux autonome : ce que mesure chaque indicateur, ce que montre la recherche et ses limites.',
    hubIntro:
      'Des pages de référence sur la variabilité de la fréquence cardiaque (HRV, ou VFC), la respiration et le système nerveux autonome. Chaque page commence par une réponse courte, distingue ce qui est établi de ce qui dépend du contexte ou reste débattu, dit ce qu’un indicateur ne vous apprend pas et cite ses sources. Chaque chiffre provient d’une seule liste de faits vérifiés. Information éducative, pas un avis médical.',
    hubResearch: ['Vous voulez savoir comment ONDA est conçu et validé ? Consultez ', 'la recherche derrière ONDA', '.'],
    science: 'Science',
    home: 'Accueil',
    kinds: {
      concepts: { label: 'Concepts', desc: 'Ce que signifient les termes clés : définitions, ce qu’ils reflètent et ce qu’ils ne reflètent pas.' },
      measurements: { label: 'Mesures', desc: 'Comment ces signaux sont mesurés, par quelles méthodes, et jusqu’où leur faire confiance.' },
      mechanisms: { label: 'Mécanismes', desc: 'Comment la respiration, le cœur et le système nerveux interagissent.' },
      evidence: { label: 'Données probantes', desc: 'Ce que montre la recherche sur des méthodes précises, selon la solidité des preuves.' },
    },
    kindMetaTitle: '{label} — ONDA Science',
    kindMetaDescription: 'ONDA Science, rubrique « {label} » : {desc}',
    classes: {
      established: 'Établi',
      guideline: 'Recommandations / consensus d’experts',
      'context-dependent': 'Dépend du contexte',
      emerging: 'Émergent',
      debated: 'Débattu',
      unknown: 'Inconnu',
    },
    editor: 'Rédaction : {name}',
    reviewedBy: 'Relu par {name}',
    reviewedOn: ' le {date}',
    updated: 'Mis à jour le {date}',
    shortAnswer: 'Réponse courte',
    keyPoints: 'Points clés',
    evidenceAtAGlance: 'Les preuves en un coup d’œil',
    claim: 'Affirmation',
    evidence: 'Niveau de preuve',
    limitation: 'Limite',
    sources: 'Sources',
    officialDocumentation: 'documentation officielle',
    related: 'Voir aussi',
    relatedTypes: { Science: 'Science', Glossary: 'Glossaire', Article: 'Article', Tool: 'Outil' },
    howMade:
      'Comment sont faites les pages ONDA Science : chaque chiffre provient d’une seule liste de faits vérifiés, chaque affirmation est reliée à ses sources et classée selon la solidité des preuves, et les sources doivent avoir un DOI ou un PMID (la documentation des fabricants ne sert qu’aux faits sur les appareils).',
    translationNote: 'Les titres des travaux et des revues sont cités dans leur langue d’origine.',
    dateLocale: 'fr-FR',
  },
  it: {
    hubTitle: 'ONDA Science',
    hubMetaTitle: 'ONDA Science: HRV, respirazione e sistema nervoso',
    hubDescription:
      'Pagine di riferimento sulla variabilità della frequenza cardiaca, la respirazione e il sistema nervoso autonomo: cosa misura ogni indicatore, cosa mostra la ricerca e quali sono i suoi limiti.',
    hubIntro:
      'Pagine di riferimento sulla variabilità della frequenza cardiaca (HRV), la respirazione e il sistema nervoso autonomo. Ogni pagina inizia con una risposta breve, separa ciò che è accertato da ciò che dipende dal contesto o è ancora dibattuto, spiega cosa un indicatore non ti dice ed elenca le fonti. Ogni numero proviene da un unico elenco di dati verificati. Informazioni a scopo educativo, non consigli medici.',
    hubResearch: ['Vuoi sapere come ONDA è costruito e verificato? Leggi ', 'la ricerca dietro ONDA', '.'],
    science: 'Scienza',
    home: 'Home',
    kinds: {
      concepts: { label: 'Concetti', desc: 'Cosa significano i termini chiave: definizioni, cosa riflettono e cosa no.' },
      measurements: { label: 'Misurazioni', desc: 'Come si misurano questi segnali, con quali metodi e quanto fidarsene.' },
      mechanisms: { label: 'Meccanismi', desc: 'Come interagiscono respirazione, cuore e sistema nervoso.' },
      evidence: { label: 'Evidenze', desc: 'Cosa mostra la ricerca su metodi specifici, in base alla solidità delle prove.' },
    },
    kindMetaTitle: '{label} — ONDA Science',
    kindMetaDescription: 'ONDA Science, sezione «{label}»: {desc}',
    classes: {
      established: 'Accertato',
      guideline: 'Linee guida / consenso di esperti',
      'context-dependent': 'Dipende dal contesto',
      emerging: 'Emergente',
      debated: 'Dibattuto',
      unknown: 'Sconosciuto',
    },
    editor: 'Redazione: {name}',
    reviewedBy: 'Revisione di {name}',
    reviewedOn: ' il {date}',
    updated: 'Aggiornato il {date}',
    shortAnswer: 'Risposta breve',
    keyPoints: 'Punti chiave',
    evidenceAtAGlance: 'Le evidenze in sintesi',
    claim: 'Affermazione',
    evidence: 'Evidenza',
    limitation: 'Limite',
    sources: 'Fonti',
    officialDocumentation: 'documentazione ufficiale',
    related: 'Vedi anche',
    relatedTypes: { Science: 'Scienza', Glossary: 'Glossario', Article: 'Articolo', Tool: 'Strumento' },
    howMade:
      'Come nascono le pagine di ONDA Science: ogni numero proviene da un unico elenco di dati verificati, ogni affermazione è collegata alle sue fonti e classificata in base alla solidità delle prove, e le fonti devono avere un DOI o un PMID (la documentazione dei produttori si usa solo per i dati sui dispositivi).',
    translationNote: 'I titoli degli studi e delle riviste sono riportati nella lingua originale.',
    dateLocale: 'it-IT',
  },
}

export const scienceUi = (lang: string): ScienceUi => SCIENCE_UI[lang] ?? SCIENCE_UI.en
export const fillUi = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? '')
