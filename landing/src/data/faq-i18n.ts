/**
 * Localized copy for /faq. Pilot languages: ru, es (uk/zh follow later).
 * Groups + items mirror ONDA_FAQ (onda-faq.ts) in exact order; the page zips
 * by index and falls back to the English source if counts ever diverge.
 * Links and FAQPage JSON-LD structure stay single-source in onda-faq.ts.
 *
 * Translations preserve the honest claims exactly (not a medical device,
 * iOS-only, estimates vs measurements).
 */
export interface FaqLocaleItem {
  q: string
  a: string
}
export interface FaqLocaleGroup {
  category: string
  items: FaqLocaleItem[]
}
export interface FaqLocale {
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  crossPre: string
  crossLinks: { measures: string; how: string; research: string; compare: string }
  groups: FaqLocaleGroup[]
}

export const FAQ_I18N: Record<'ru' | 'es', FaqLocale> = {
  ru: {
    metaTitle: 'ONDA Life FAQ — HRV-биофидбек, дыхание и приложение | ONDA Life',
    metaDescription:
      'Прямые ответы про HRV-биофидбек, резонансное дыхание, науку об HRV и приложение ONDA: что оно измеряет, нужен ли Apple Watch, как сравнивается и другое.',
    h1: 'Вопросы и ответы',
    intro:
      'Прямые ответы про HRV-биофидбек, дыхание, науку и то, как работает ONDA — каждый написан так, чтобы читаться отдельно.',
    crossPre: 'Глубже: ',
    crossLinks: {
      measures: 'что измеряет ONDA',
      how: 'как это работает',
      research: 'доказательства',
      compare: 'как ONDA сравнивается',
    },
    groups: [
      {
        category: 'Основы HRV-биофидбека',
        items: [
          {
            q: 'Что такое HRV-биофидбек?',
            a: 'HRV-биофидбек — это техника, при которой вы видите вариабельность сердечного ритма в реальном времени и в ответ подстраиваете дыхание или внимание. Живая обратная связь замыкает петлю: вы наблюдаете, как ритм сердца сглаживается при медленном дыхании, — это тренирует вегетативную нервную систему, а не просто измеряет её.',
          },
          {
            q: 'Повышает ли дыхание HRV?',
            a: 'Да — медленное размеренное дыхание около вашей резонансной частоты (примерно шесть вдохов в минуту) надёжно повышает вариабельность сердечного ритма во время сессии и включает парасимпатическую ветвь «отдыха и восстановления». Насколько сдвигается ваш базовый уровень в покое со временем — индивидуально.',
          },
          {
            q: 'Что такое резонансное (когерентное) дыхание?',
            a: 'Резонансное дыхание — это медленное ровное дыхание на темпе, где ритм сердца сильнее всего колеблется в такт дыханию — у большинства людей это около 5,5–6 вдохов в минуту (цикл ~10 секунд). Это темп дыхания в основе HRV-биофидбека.',
          },
          {
            q: 'Что такое когерентность в HRV?',
            a: 'Когерентность описывает, насколько гладким и ритмичным становится колебание частоты сердца при дыхании. Высокий показатель когерентности значит, что ритм сердца поднимается и опускается чистой ровной волной, синхронизированной с дыханием. Это сигнал для практики в реальном времени, а не клинический биомаркер.',
          },
          {
            q: 'В чём разница между трекингом HRV и HRV-биофидбеком?',
            a: 'Трекинг HRV пассивно записывает вашу HRV (часто ночью), чтобы вы видели тренды, — это делают кольца и браслеты. HRV-биофидбек активен: вы получаете живую обратную связь во время дыхания и тренируете ритм сердца в моменте. Трекинг говорит, как вы восстановились; биофидбек даёт то, что с этим сделать.',
          },
          {
            q: 'Можно ли тренировать блуждающий нерв?',
            a: 'Вы можете влиять на вагальную (парасимпатическую) активность. Медленное дыхание, длинные выдохи и HRV-биофидбек повышают вагальный тонус в моменте, а при регулярной практике облегчают достижение спокойного состояния. Эффект реальный, но умеренный — «перезагрузки вагуса», обещающие вылечить болезни, преувеличивают его.',
          },
          {
            q: 'HRV-биофидбек действительно работает?',
            a: 'Острый эффект хорошо установлен: размеренное дыхание повышает HRV во время сессии и включает парасимпатическую систему. Долгосрочная польза для стресса и саморегуляции подтверждается, но варьируется у разных людей. Это одна из самых доказательно обоснованных и низкорисковых техник саморегуляции.',
          },
          {
            q: 'Сколько нужно практиковать резонансное дыхание?',
            a: 'Обычная сессия — около 10–20 минут дыхания в резонансном темпе, но даже несколько минут меняют ваше состояние. Регулярность важнее длительности — короткие ежедневные сессии обычно помогают базовому уровню больше, чем редкие долгие.',
          },
        ],
      },
      {
        category: 'Использование ONDA',
        items: [
          {
            q: 'Что такое ONDA Life?',
            a: 'ONDA Life — приложение HRV-биофидбека и дыхания с подсказками для iPhone, iPad и Apple Watch. Оно даёт живую обратную связь по ритму сердца во время размеренного дыхания, показывает показатель когерентности и отслеживает тренд HRV в покое на 8-уровневом пути практики. Бесплатно начать, аккаунт не нужен.',
          },
          {
            q: 'ONDA — это медитационное приложение?',
            a: 'Не в обычном смысле. ONDA — тренажёр HRV-биофидбека, а не библиотека медитаций с подсказками. Вместо только аудио оно показывает, как ритм сердца отвечает на ваше дыхание. С медитацией оно пересекается в успокоении, но управляется измерениями и уже по фокусу.',
          },
          {
            q: 'Работает ли ONDA без Apple Watch?',
            a: 'Да. ONDA может измерять пульс камерой iPhone (фотоплетизмография), так что вы получаете измерение HRV в покое одним телефоном. Apple Watch добавляет непрерывные данные сердца и живую обратную связь, но для старта не обязателен.',
          },
          {
            q: 'Использует ли ONDA камеру iPhone для измерения пульса?',
            a: 'Да. Приложив палец к камере, ONDA считывает крошечные изменения цвета кожи при каждом ударе сердца (PPG), чтобы измерить пульс и вычислить HRV в покое — носимый не нужен.',
          },
          {
            q: 'Что означает показатель стресса в ONDA?',
            a: 'Показатель стресса — это оценка ONDA вашего текущего физиологического состояния по паттернам пульса и HRV. Это интерпретация для практики, а не измерение «стресса» и не медицинская оценка.',
          },
          {
            q: 'Что означает показатель энергии в ONDA?',
            a: 'Показатель энергии — это оценка готовности или активации от ONDA, выведенная из тех же сигналов пульса и HRV. Как и показатель стресса, это контекстная оценка, а не напрямую измеренная величина.',
          },
          {
            q: 'ONDA бесплатна?',
            a: 'ONDA бесплатна для старта без аккаунта — первое измерение можно сделать примерно за 90 секунд. Есть опциональная подписка для полного доступа к пути практики и функциям.',
          },
          {
            q: 'Нужен ли аккаунт, чтобы пользоваться ONDA?',
            a: 'Нет. Можно начать практиковать и сделать измерение без создания аккаунта.',
          },
          {
            q: 'Есть ли Android-приложение ONDA?',
            a: 'Пока нет. Сейчас ONDA только на iOS (iPhone, iPad и Apple Watch). Версия для Android в разработке — можно записаться в лист ожидания, чтобы узнать о запуске.',
          },
        ],
      },
      {
        category: 'Устройства и данные',
        items: [
          {
            q: 'Может ли Apple Watch измерять HRV в реальном времени?',
            a: 'Apple Watch непрерывно измеряет пульс и записывает HRV, и ONDA использует эти данные сердца для живой обратной связи во время сессии. Собственное приложение Health показывает HRV как периодические измерения, а не непрерывное число; ONDA добавляет слой биофидбека в реальном времени поверх.',
          },
          {
            q: 'Насколько точен HRV по камере (PPG)?',
            a: 'Камерный PPG работает лучше всего в покое с неподвижным пальцем и хорошим контактом. В таких условиях он даёт пригодное измерение HRV; движение или плохой контакт добавляют шум, поэтому ONDA просит переснять измерение, которому нельзя доверять. Для непрерывных данных на весь день лучше носимое устройство.',
          },
          {
            q: 'Нужен ли нагрудный датчик для ONDA?',
            a: 'Нет. ONDA рассчитана на работу с камерой iPhone или Apple Watch. Нагрудный датчик даёт самую точную HRV среди потребительских сенсоров, но ONDA его не требует.',
          },
          {
            q: 'Хранит ли ONDA мои данные HealthKit?',
            a: 'ONDA читает данные сердца через Apple HealthKit, и ваши медданные остаются на устройстве. ONDA не фитнес-трекер — она не читает ваши шаги, калории или тренировки.',
          },
          {
            q: 'Какие устройства работают с ONDA?',
            a: 'iPhone и iPad (используя камеру для пульса) и Apple Watch (для непрерывных данных сердца и живой обратной связи). Отдельного носимого устройства ONDA нет, и оно не требуется.',
          },
        ],
      },
      {
        category: 'Понимание HRV',
        items: [
          {
            q: 'Какая HRV хорошая для моего возраста?',
            a: 'HRV снижается с возрастом и сильно варьируется у разных людей, поэтому единого «хорошего» числа нет — ваш собственный тренд важнее любого порога. Грубо: выше обычно лучше в пределах одного человека, но сравнивать вашу абсолютную HRV с чужой малоосмысленно.',
          },
          {
            q: 'HRV — это то же, что вагальный тонус?',
            a: 'Они тесно связаны, но не тождественны. Краткосрочная HRV (особенно RMSSD) — широко используемый показатель парасимпатической (вагальной) активности, поэтому более высокий RMSSD обычно отражает более сильный вагальный тонус. Но на HRV влияют и другие факторы, так что это индикатор вагального тонуса, а не его прямое измерение.',
          },
          {
            q: 'Может ли HRV диагностировать стресс?',
            a: 'Нет. HRV обычно ниже при стрессе и выше при восстановлении, так что это полезный индикатор, но не диагностический тест. На HRV влияет многое — сон, болезнь, алкоголь, гидратация, поза, — поэтому одно измерение не может диагностировать стресс или любое состояние.',
          },
          {
            q: 'В чём разница между RMSSD и SDNN?',
            a: 'Оба обобщают вариабельность между ударами. RMSSD отражает краткосрочные изменения от удара к удару и сильнее всего связан с вагальной (парасимпатической) активностью — это основной показатель для коротких измерений. SDNN отражает общую вариабельность за более длинное окно и подвержен большему числу факторов.',
          },
          {
            q: 'Когда лучше всего измерять HRV?',
            a: 'Для сопоставимого тренда измеряйте в постоянное время и состояние — часто это сразу после пробуждения, в покое, до кофеина. Важнее всего постоянство: одно время, одна поза, чтобы дневные изменения отражали ваше тело, а не условия.',
          },
          {
            q: 'Сколько времени нужно HRV-биофидбеку, чтобы сработать?',
            a: 'Острый эффект вы чувствуете сразу — HRV повышается в пределах одной сессии. Изменения базового уровня в покое, где они происходят, обычно проявляются за недели регулярной практики, а не за дни, и величина изменения варьируется у разных людей.',
          },
          {
            q: 'Всегда ли более высокая HRV лучше?',
            a: 'Обычно в пределах одного человека, но не всегда. Более высокая HRV обычно отражает лучшее восстановление и парасимпатическую активность, но контекст важен — необычно высокое значение может сопровождать и болезнь или перетренированность. Тренды и контекст важнее погони за одним высоким числом.',
          },
        ],
      },
      {
        category: 'Доказательства и доверие',
        items: [
          {
            q: 'ONDA основана на доказательствах?',
            a: 'ONDA построена на механизмах с реальной доказательной базой — размеренное дыхание повышает HRV, HRV-биофидбек, интероцепция и HRV в покое как сигнал восстановления — каждый со ссылками на странице research с источниками и их ограничениями. Более амбициозные идеи чётко помечены как направления исследований, а не текущие заявления.',
          },
          {
            q: 'ONDA — медицинский прибор?',
            a: 'Нет. ONDA — приложение HRV-биофидбека и дыхания с подсказками для тренировки и саморегуляции. Оно не диагностирует, не лечит и не мониторит какое-либо заболевание и не заменяет медицинскую помощь.',
          },
          {
            q: 'ONDA научно валидирована?',
            a: 'Механизмы, которые использует ONDA, подтверждены опубликованными исследованиями, на которые открыто ссылаются. ONDA не заявляет о собственном клиническом испытании или что лечит состояния — она применяет установленные техники (HRV-биофидбек, резонансное дыхание) и прозрачна в том, что доказано, а что нет.',
          },
          {
            q: 'Может ли ONDA заменить терапию или лекарства?',
            a: 'Нет. ONDA — инструмент практики саморегуляции, а не лечение. Она не заменяет психотерапию, медицинскую помощь или назначенные лекарства. Если у вас проблема со здоровьем, обратитесь к квалифицированному специалисту.',
          },
          {
            q: 'Делает ли ONDA медицинские заявления?',
            a: 'Нет. ONDA описывает, что измеряет и какие техники использует, и отделяет это от своей более широкой опытной философии. Она не заявляет о диагностике или лечении болезней и помечает идеи стадии исследований как таковые, а не выдаёт их за результаты.',
          },
        ],
      },
      {
        category: 'ONDA против альтернатив',
        items: [
          {
            q: 'Какое приложение для HRV-биофидбека лучшее?',
            a: 'Основные приложения HRV-биофидбека — ONDA, Elite HRV и (в премиум-тарифе) Breathwrk. ONDA работает с камерой iPhone или Apple Watch внутри направляемой прогрессивной практики; Elite HRV больше сфокусирован на измерении и точнее всего с нагрудным датчиком. Лучшее зависит от того, хотите ли вы направляемую практику или самое точное измерение.',
          },
          {
            q: 'ONDA или Oura — что выбрать?',
            a: 'Они делают разное. Oura — кольцо, которое пассивно отслеживает сон, готовность и ночную HRV. ONDA активно тренирует нервную систему через HRV-биофидбек в реальном времени и не требует носимого. Многие используют оба — Oura для измерения восстановления, ONDA для его тренировки.',
          },
          {
            q: 'ONDA или WHOOP для HRV?',
            a: 'WHOOP непрерывно измеряет HRV, оценивая восстановление и нагрузку; ONDA использует HRV как живой биофидбек, против которого вы тренируетесь во время дыхания. Для пассивных данных восстановления — WHOOP; для активной тренировки HRV без браслета и подписки на железо — ONDA.',
          },
          {
            q: 'ONDA похожа на Calm или Headspace?',
            a: 'Они пересекаются в успокоении, но работают по-разному. Calm и Headspace — библиотеки медитаций и контента для сна. ONDA — тренажёр HRV-биофидбека, который измеряет ритм сердца и даёт живую обратную связь во время дыхания — уже по фокусу и больше про измерения.',
          },
        ],
      },
    ],
  },
  es: {
    metaTitle: 'FAQ de ONDA Life — Biofeedback de VFC, respiración y la app | ONDA Life',
    metaDescription:
      'Respuestas claras sobre biofeedback de VFC, respiración de resonancia, la ciencia de la VFC y la app ONDA: qué mide, si necesita Apple Watch, cómo se compara y más.',
    h1: 'Preguntas y respuestas',
    intro:
      'Respuestas claras sobre biofeedback de VFC, respiración, la ciencia y cómo funciona ONDA — cada una escrita para leerse por sí sola.',
    crossPre: 'Más a fondo: ',
    crossLinks: {
      measures: 'qué mide ONDA',
      how: 'cómo funciona',
      research: 'la evidencia',
      compare: 'cómo se compara ONDA',
    },
    groups: [
      {
        category: 'Fundamentos del biofeedback de VFC',
        items: [
          {
            q: '¿Qué es el biofeedback de VFC?',
            a: 'El biofeedback de VFC es una técnica en la que ves tu variabilidad de la frecuencia cardíaca en tiempo real y ajustas la respiración o la atención en respuesta. El feedback en vivo cierra un bucle: puedes ver cómo tu ritmo cardíaco se suaviza al respirar despacio, lo que entrena el sistema nervioso autónomo en lugar de solo medirlo.',
          },
          {
            q: '¿Respirar aumenta la VFC?',
            a: 'Sí — la respiración lenta y pausada cerca de tu frecuencia de resonancia (unas seis respiraciones por minuto) eleva de forma fiable la variabilidad de la frecuencia cardíaca durante la sesión y activa la rama parasimpática de «descanso y digestión». Cuánto cambia tu base en reposo con el tiempo varía de una persona a otra.',
          },
          {
            q: '¿Qué es la respiración de resonancia (coherente)?',
            a: 'La respiración de resonancia es respirar despacio y de forma pareja al ritmo en que tu corazón oscila con más fuerza con la respiración — para la mayoría, unas 5,5–6 respiraciones por minuto (un ciclo de ~10 segundos). Es el ritmo de respiración en el centro del biofeedback de VFC.',
          },
          {
            q: '¿Qué es la coherencia en la VFC?',
            a: 'La coherencia describe lo suave y rítmica que es la oscilación de tu frecuencia cardíaca al respirar. Una puntuación alta de coherencia significa que tu ritmo cardíaco sube y baja en una onda limpia y regular sincronizada con tu respiración. Es una señal de práctica en tiempo real, no un biomarcador clínico.',
          },
          {
            q: '¿Cuál es la diferencia entre seguimiento de VFC y biofeedback de VFC?',
            a: 'El seguimiento de VFC registra tu VFC de forma pasiva (a menudo de noche) para que veas tendencias — eso hacen los anillos y las pulseras. El biofeedback de VFC es activo: recibes feedback en vivo mientras respiras y entrenas tu ritmo cardíaco en el momento. El seguimiento te dice cómo te recuperaste; el biofeedback te da algo que hacer al respecto.',
          },
          {
            q: '¿Puedo entrenar mi nervio vago?',
            a: 'Puedes influir en la actividad vagal (parasimpática). La respiración lenta, las exhalaciones largas y el biofeedback de VFC elevan el tono vagal en el momento, y con práctica regular hacen más fácil alcanzar un estado de calma. El efecto es real pero modesto — los «reinicios del vago» que prometen curar enfermedades lo exageran.',
          },
          {
            q: '¿El biofeedback de VFC realmente funciona?',
            a: 'El efecto agudo está bien establecido: la respiración pausada eleva la VFC durante una sesión y activa el sistema parasimpático. Los beneficios a largo plazo para el estrés y la autorregulación tienen respaldo pero varían según la persona. Es una de las técnicas de autorregulación mejor fundamentadas y de bajo riesgo que existen.',
          },
          {
            q: '¿Cuánto tiempo debo hacer respiración de resonancia?',
            a: 'Una sesión típica es de unos 10–20 minutos respirando a tu ritmo de resonancia, pero incluso unos minutos cambian tu estado. La constancia importa más que la duración — sesiones cortas diarias suelen ayudar a tu base más que largas ocasionales.',
          },
        ],
      },
      {
        category: 'Usar ONDA',
        items: [
          {
            q: '¿Qué es ONDA Life?',
            a: 'ONDA Life es una app de biofeedback de VFC y respiración guiada para iPhone, iPad y Apple Watch. Da feedback en vivo del ritmo cardíaco durante la respiración pausada, muestra una puntuación de coherencia y sigue tu tendencia de VFC en reposo a lo largo de un camino de práctica de 8 niveles. Es gratis para empezar, sin necesidad de cuenta.',
          },
          {
            q: '¿ONDA es una app de meditación?',
            a: 'No en el sentido habitual. ONDA es un entrenador de biofeedback de VFC, no una biblioteca de meditaciones guiadas. En vez de solo audio, muestra cómo responde tu ritmo cardíaco mientras respiras. Se solapa con la meditación en calmarse, pero está guiada por la medición y es más específica.',
          },
          {
            q: '¿Funciona ONDA sin un Apple Watch?',
            a: 'Sí. ONDA puede medir tu pulso con la cámara del iPhone (fotopletismografía), así que obtienes una lectura de VFC en reposo solo con tu teléfono. Un Apple Watch añade datos cardíacos continuos y feedback en vivo, pero no es necesario para empezar.',
          },
          {
            q: '¿ONDA usa la cámara del iPhone para medir el pulso?',
            a: 'Sí. Al poner un dedo sobre la cámara, ONDA lee los pequeños cambios de color de tu piel con cada latido (PPG) para medir la frecuencia cardíaca y calcular la VFC en reposo — sin wearable.',
          },
          {
            q: '¿Qué significa la puntuación de estrés de ONDA?',
            a: 'La puntuación de estrés es la estimación de ONDA de tu estado fisiológico actual a partir de tus patrones de frecuencia cardíaca y VFC. Es una interpretación para guiar la práctica, no una medición del «estrés» ni una evaluación médica.',
          },
          {
            q: '¿Qué significa la puntuación de energía de ONDA?',
            a: 'La puntuación de energía es la estimación de ONDA de tu preparación o activación, derivada de las mismas señales de frecuencia cardíaca y VFC. Como la de estrés, es una estimación contextual, no una cantidad medida directamente.',
          },
          {
            q: '¿ONDA es gratis?',
            a: 'ONDA es gratis para empezar sin cuenta — puedes hacer tu primera lectura en unos 90 segundos. Hay una suscripción opcional para acceso completo al camino de práctica y las funciones.',
          },
          {
            q: '¿Necesito una cuenta para usar ONDA?',
            a: 'No. Puedes empezar a practicar y hacer una lectura sin crear una cuenta.',
          },
          {
            q: '¿Hay una app de ONDA para Android?',
            a: 'Aún no. Por ahora ONDA es solo para iOS (iPhone, iPad y Apple Watch). Hay una versión de Android en desarrollo — puedes unirte a la lista de espera para saber cuándo se lance.',
          },
        ],
      },
      {
        category: 'Dispositivos y datos',
        items: [
          {
            q: '¿Puede un Apple Watch medir la VFC en tiempo real?',
            a: 'El Apple Watch mide la frecuencia cardíaca de forma continua y registra la VFC, y ONDA usa esos datos cardíacos para dar feedback en vivo durante una sesión. La propia app Salud muestra la VFC como lecturas periódicas, no como un número continuo; ONDA añade encima la capa de biofeedback en tiempo real.',
          },
          {
            q: '¿Qué tan precisa es la VFC por cámara (PPG)?',
            a: 'El PPG por cámara funciona mejor en reposo, con un dedo firme y buen contacto. En esas condiciones da una lectura de VFC útil; el movimiento o el mal contacto añaden ruido, por eso ONDA te pide repetir una lectura en la que no puede confiar. Para datos continuos todo el día, un wearable es mejor.',
          },
          {
            q: '¿Necesito una banda de pecho para ONDA?',
            a: 'No. ONDA está diseñada para funcionar con la cámara del iPhone o un Apple Watch. Una banda de pecho da la VFC más precisa de cualquier sensor de consumo, pero ONDA no la requiere.',
          },
          {
            q: '¿ONDA guarda mis datos de HealthKit?',
            a: 'ONDA lee datos cardíacos a través de Apple HealthKit, y tus datos de salud quedan en tu dispositivo. ONDA no es un tracker de fitness — no lee tus pasos, calorías ni entrenamientos.',
          },
          {
            q: '¿Qué dispositivos funcionan con ONDA?',
            a: 'iPhone y iPad (usando la cámara para el pulso) y Apple Watch (para datos cardíacos continuos y feedback en vivo). No existe ni se requiere un wearable propio de ONDA.',
          },
        ],
      },
      {
        category: 'Entender la VFC',
        items: [
          {
            q: '¿Qué VFC es buena para mi edad?',
            a: 'La VFC baja con la edad y varía mucho entre personas, así que no hay un único número «bueno» — tu propia tendencia importa más que cualquier umbral. Como guía aproximada, más alta suele ser mejor dentro de una persona, pero comparar tu VFC absoluta con la de otra persona no es muy significativo.',
          },
          {
            q: '¿La VFC es lo mismo que el tono vagal?',
            a: 'Están muy relacionados pero no son idénticos. La VFC a corto plazo (sobre todo RMSSD) es un indicador muy usado de la actividad parasimpática (vagal), así que un RMSSD más alto suele reflejar un tono vagal más fuerte. Pero la VFC también está influida por otros factores, así que es un indicador del tono vagal, no una medición directa de él.',
          },
          {
            q: '¿Puede la VFC diagnosticar el estrés?',
            a: 'No. La VFC tiende a ser más baja bajo estrés y más alta al recuperarse, así que es un indicador útil, pero no una prueba diagnóstica. Muchas cosas mueven la VFC — sueño, enfermedad, alcohol, hidratación, postura —, así que una sola lectura no puede diagnosticar el estrés ni ninguna condición.',
          },
          {
            q: '¿Cuál es la diferencia entre RMSSD y SDNN?',
            a: 'Ambos resumen la variabilidad entre latidos. RMSSD refleja los cambios latido a latido a corto plazo y es la medida más ligada a la actividad vagal (parasimpática) — es la de referencia para lecturas cortas. SDNN capta la variabilidad global en una ventana más larga y está influida por más factores.',
          },
          {
            q: '¿Cuál es el mejor momento para medir la VFC?',
            a: 'Para una tendencia comparable, mide a una hora y estado constantes — es común nada más despertar, en reposo, antes de la cafeína. Lo que más importa es la constancia: misma hora, misma postura, para que los cambios diarios reflejen tu cuerpo y no las condiciones.',
          },
          {
            q: '¿Cuánto tarda en funcionar el biofeedback de VFC?',
            a: 'El efecto agudo lo sientes de inmediato — la VFC sube dentro de una sola sesión. Los cambios en tu base en reposo, donde ocurren, suelen aparecer tras semanas de práctica constante más que días, y el tamaño del cambio varía entre personas.',
          },
          {
            q: '¿Una VFC más alta siempre es mejor?',
            a: 'Normalmente dentro de una persona, pero no universalmente. Una VFC más alta suele reflejar mejor recuperación y actividad parasimpática, pero el contexto importa — una lectura inusualmente alta también puede acompañar enfermedad o sobreentrenamiento. Las tendencias y el contexto valen más que perseguir un solo número alto.',
          },
        ],
      },
      {
        category: 'Evidencia y confianza',
        items: [
          {
            q: '¿ONDA está basada en evidencia?',
            a: 'ONDA se construye sobre mecanismos con una base de evidencia real — la respiración pausada que eleva la VFC, el biofeedback de VFC, la interocepción y la VFC en reposo como señal de recuperación — cada uno citado en la página de investigación con las fuentes y sus límites. Las ideas más ambiciosas se etiquetan claramente como líneas de investigación, no afirmaciones actuales.',
          },
          {
            q: '¿ONDA es un dispositivo médico?',
            a: 'No. ONDA es una app de biofeedback de VFC y respiración guiada para el entrenamiento y la autorregulación. No diagnostica, trata ni monitoriza ninguna condición médica y no sustituye la atención médica.',
          },
          {
            q: '¿ONDA está validada científicamente?',
            a: 'Los mecanismos que usa ONDA tienen respaldo en investigación publicada, que se cita abiertamente. ONDA no afirma tener su propio ensayo clínico ni que trate condiciones — aplica técnicas establecidas (biofeedback de VFC, respiración de resonancia) y es transparente sobre lo que está probado y lo que no.',
          },
          {
            q: '¿Puede ONDA reemplazar la terapia o la medicación?',
            a: 'No. ONDA es una herramienta de práctica de autorregulación, no un tratamiento. No sustituye la psicoterapia, la atención médica ni la medicación prescrita. Si tienes una condición de salud, habla con un profesional cualificado.',
          },
          {
            q: '¿ONDA hace afirmaciones médicas?',
            a: 'No. ONDA describe lo que mide y las técnicas que usa, y lo separa de su filosofía experiencial más amplia. No afirma diagnosticar ni tratar enfermedades, y marca las ideas en fase de investigación como tales en lugar de presentarlas como resultados.',
          },
        ],
      },
      {
        category: 'ONDA frente a alternativas',
        items: [
          {
            q: '¿Cuál es la mejor app de biofeedback de VFC?',
            a: 'Las principales apps de biofeedback de VFC son ONDA, Elite HRV y (en su nivel premium) Breathwrk. ONDA funciona con la cámara del iPhone o un Apple Watch dentro de una práctica guiada y progresiva; Elite HRV está más centrada en la medición y es más precisa con una banda de pecho. La mejor depende de si quieres una práctica guiada o la medición más precisa.',
          },
          {
            q: '¿ONDA u Oura — cuál elegir?',
            a: 'Hacen trabajos distintos. Oura es un anillo que sigue de forma pasiva el sueño, la preparación y la VFC nocturna. ONDA entrena activamente tu sistema nervioso con biofeedback de VFC en tiempo real y no necesita wearable. Mucha gente usa ambos — Oura para medir la recuperación, ONDA para entrenarla.',
          },
          {
            q: '¿ONDA o WHOOP para la VFC?',
            a: 'WHOOP mide la VFC de forma continua para puntuar recuperación y esfuerzo; ONDA usa la VFC como biofeedback en vivo contra el que entrenas al respirar. Para datos de recuperación pasivos, WHOOP; para entrenamiento activo de la VFC sin banda ni suscripción de hardware, ONDA.',
          },
          {
            q: '¿ONDA es como Calm o Headspace?',
            a: 'Se solapan en calmarse pero funcionan distinto. Calm y Headspace son bibliotecas de meditación y contenido para dormir. ONDA es un entrenador de biofeedback de VFC que mide tu ritmo cardíaco y da feedback en vivo mientras respiras — más específica y más centrada en la medición.',
          },
        ],
      },
    ],
  },
}
