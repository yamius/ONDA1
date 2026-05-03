import type { Lang } from '../i18n'

export interface LocalizedTopicCopy {
  title: string
  description: string
  overview: string
  keywords: string[]
}

export interface Topic {
  slug: string
  title: string
  description: string
  overview: string
  articleSlugs: string[]
  glossarySlugs: string[]
  partSlug?: string
  keywords: string[]
  i18n?: Partial<Record<Exclude<Lang, 'en'>, LocalizedTopicCopy>>
}

export const TOPICS: Topic[] = [
  {
    slug: 'hrv',
    title: 'Heart Rate Variability (HRV) Training',
    description:
      'Engineering protocols for HRV expansion: vagal-tone amplification, baroreflex resonance at 0.1 Hz, and nervous-system latency reduction.',
    overview:
      'HRV is the millisecond-scale variation between heartbeats and the most reliable single readout of autonomic-nervous-system flexibility. The ONDA Life HRV cluster covers the full engineering loop — measurement, interpretation, and the protocols that durably expand the resonant bandwidth of your nervous system.',
    articleSlugs: [
      'hrv-training-nervous-system-latency',
      'fault-tolerant-human-hrv-buffer',
      'baroreflex-01hz-shift',
      'resonant-frequency-system-coherence',
      'nervous-system-ping-latency',
      'biological-latency-optimizing-system-ping',
      'system-feedback-biometric-loop',
    ],
    glossarySlugs: [],
    keywords: [
      'HRV training',
      'heart rate variability',
      'vagal tone',
      'baroreflex 0.1 Hz',
      'autonomic flexibility',
      'resonant frequency breathing',
      'parasympathetic activation',
    ],
    i18n: {
      es: {
        title: 'Entrenamiento de Variabilidad de la Frecuencia Cardíaca (HRV)',
        description:
          'Protocolos de ingeniería para expandir la HRV: amplificación del tono vagal, resonancia barorrefleja a 0.1 Hz y reducción de la latencia del sistema nervioso.',
        overview:
          'La HRV es la variación en milisegundos entre latidos y la lectura más fiable de la flexibilidad del sistema nervioso autónomo. El cluster HRV de ONDA Life cubre el bucle completo de ingeniería — medición, interpretación y los protocolos que expanden de forma duradera el ancho de banda resonante de tu sistema nervioso.',
        keywords: [
          'entrenamiento HRV',
          'variabilidad de la frecuencia cardíaca',
          'tono vagal',
          'barorreflejo 0.1 Hz',
          'flexibilidad autónoma',
          'respiración de frecuencia resonante',
          'activación parasimpática',
        ],
      },
      ru: {
        title: 'Тренировка вариабельности сердечного ритма (HRV)',
        description:
          'Инженерные протоколы расширения HRV: усиление вагального тонуса, барорефлекторный резонанс на 0,1 Гц и снижение задержки нервной системы.',
        overview:
          'HRV — это миллисекундная вариация между ударами сердца и самый надёжный показатель гибкости вегетативной нервной системы. Кластер HRV в ONDA Life охватывает полный инженерный цикл — измерение, интерпретацию и протоколы, которые устойчиво расширяют резонансный диапазон вашей нервной системы.',
        keywords: [
          'тренировка HRV',
          'вариабельность сердечного ритма',
          'вагальный тонус',
          'барорефлекс 0,1 Гц',
          'автономная гибкость',
          'дыхание на резонансной частоте',
          'активация парасимпатики',
        ],
      },
      uk: {
        title: 'Тренування варіабельності серцевого ритму (HRV)',
        description:
          'Інженерні протоколи для розширення HRV: підсилення вагального тонусу, барорефлекторний резонанс на 0,1 Гц і зниження затримки нервової системи.',
        overview:
          'HRV — це мілісекундна варіація між ударами серця і найнадійніший показник гнучкості вегетативної нервової системи. Кластер HRV в ONDA Life охоплює повний інженерний цикл — вимірювання, інтерпретацію та протоколи, які стабільно розширюють резонансний діапазон вашої нервової системи.',
        keywords: [
          'тренування HRV',
          'варіабельність серцевого ритму',
          'вагальний тонус',
          'барорефлекс 0,1 Гц',
          'автономна гнучкість',
          'дихання на резонансній частоті',
          'активація парасимпатики',
        ],
      },
      zh: {
        title: '心率变异性 (HRV) 训练',
        description:
          'HRV 扩展的工程协议：迷走神经张力放大、0.1 Hz 压力反射共振，以及神经系统延迟降低。',
        overview:
          'HRV 是心跳之间毫秒级的变化，也是自主神经系统灵活性最可靠的单一读数。ONDA Life 的 HRV 集群涵盖完整的工程闭环——测量、解读，以及能够持久扩展神经系统共振带宽的协议。',
        keywords: [
          'HRV 训练',
          '心率变异性',
          '迷走神经张力',
          '压力反射 0.1 Hz',
          '自主神经灵活性',
          '共振频率呼吸',
          '副交感神经激活',
        ],
      },
    },
  },
  {
    slug: 'vagus-nerve',
    title: 'Vagus Nerve Stimulation & Vagal Tone',
    description:
      'Vagus-nerve protocols — humming, cold exposure, electrical neuromodulation, fascial release — for measurable parasympathetic uplift.',
    overview:
      'The vagus nerve is the master autonomic cable connecting brainstem to viscera. ONDA treats it as the highest-leverage intervention surface in the body: small inputs (humming, cold, exhale extension, transcutaneous stimulation) cause large, measurable shifts in HRV, gut motility, mood, and cognitive recovery.',
    articleSlugs: [
      'vagus-nerve-master-key',
      'electric-medicine-neuromodulation',
      'fascial-tensegrity-protocol-myofascial-noise',
      'gut-brain-axis-data-link',
    ],
    glossarySlugs: [],
    keywords: [
      'vagus nerve',
      'vagal tone',
      'transcutaneous vagus nerve stimulation',
      'tVNS',
      'cold exposure vagus',
      'humming vagus activation',
      'parasympathetic nervous system',
    ],
    i18n: {
      es: {
        title: 'Estimulación del Nervio Vago y Tono Vagal',
        description:
          'Protocolos del nervio vago — tarareo, exposición al frío, neuromodulación eléctrica, liberación fascial — para una elevación parasimpática medible.',
        overview:
          'El nervio vago es el cable autónomo maestro que conecta el tronco encefálico con las vísceras. ONDA lo trata como la superficie de intervención de mayor apalancamiento del cuerpo: pequeñas entradas (tarareo, frío, exhalación prolongada, estimulación transcutánea) producen cambios grandes y medibles en HRV, motilidad intestinal, estado de ánimo y recuperación cognitiva.',
        keywords: [
          'nervio vago',
          'tono vagal',
          'estimulación transcutánea del nervio vago',
          'tVNS',
          'exposición al frío vago',
          'activación vagal por tarareo',
          'sistema nervioso parasimpático',
        ],
      },
      ru: {
        title: 'Стимуляция блуждающего нерва и вагальный тонус',
        description:
          'Протоколы блуждающего нерва — гудение, холодовое воздействие, электрическая нейромодуляция, фасциальное расслабление — для измеримого парасимпатического отклика.',
        overview:
          'Блуждающий нерв — главный автономный кабель, соединяющий ствол мозга с внутренними органами. ONDA рассматривает его как точку максимального рычага в теле: малые входы (гудение, холод, удлинённый выдох, транскутанная стимуляция) дают крупные измеримые сдвиги HRV, моторики ЖКТ, настроения и когнитивного восстановления.',
        keywords: [
          'блуждающий нерв',
          'вагальный тонус',
          'транскутанная стимуляция блуждающего нерва',
          'tVNS',
          'холод и блуждающий нерв',
          'гудение и активация вагуса',
          'парасимпатическая нервная система',
        ],
      },
      uk: {
        title: 'Стимуляція блукаючого нерва і вагальний тонус',
        description:
          'Протоколи блукаючого нерва — гудіння, холодова експозиція, електрична нейромодуляція, фасціальне розслаблення — для вимірюваного парасимпатичного відгуку.',
        overview:
          'Блукаючий нерв — головний автономний кабель, що з\'єднує стовбур мозку з внутрішніми органами. ONDA розглядає його як точку найбільшого важеля в тілі: малі впливи (гудіння, холод, подовжений видих, транскутанна стимуляція) дають великі вимірювані зрушення HRV, моторики ШКТ, настрою і когнітивного відновлення.',
        keywords: [
          'блукаючий нерв',
          'вагальний тонус',
          'транскутанна стимуляція блукаючого нерва',
          'tVNS',
          'холод і блукаючий нерв',
          'гудіння і активація вагуса',
          'парасимпатична нервова система',
        ],
      },
      zh: {
        title: '迷走神经刺激与迷走神经张力',
        description:
          '迷走神经协议——哼唱、冷暴露、电神经调控、筋膜松解——实现可测量的副交感神经提升。',
        overview:
          '迷走神经是连接脑干与内脏的主自主神经线。ONDA 将其视为体内杠杆率最高的干预表面：微小的输入（哼唱、冷暴露、延长呼气、经皮刺激）会在 HRV、肠道蠕动、情绪和认知恢复方面引发巨大且可测量的变化。',
        keywords: [
          '迷走神经',
          '迷走神经张力',
          '经皮迷走神经刺激',
          'tVNS',
          '冷暴露迷走神经',
          '哼唱迷走激活',
          '副交感神经系统',
        ],
      },
    },
  },
  {
    slug: 'circadian-rhythm',
    title: 'Circadian Rhythm Engineering',
    description:
      'Light, temperature, and timing protocols for resetting and stabilizing the master circadian clock — including jet lag and shift work recovery.',
    overview:
      'Every cell carries a 24-hour clock. The ONDA circadian cluster is the operations manual for keeping that clock entrained: morning light dosage, dark therapy, food/exercise timing, and the multi-day reset protocol used to clear jet lag, recover from shift work, or restore broken sleep architecture.',
    articleSlugs: [
      'circadian-reset-mastering-light',
      'circadian-lighting-dark-therapy',
      'ancestral-sync-circadian-anchors',
      'protocol-circadian-hard-reset',
      'longevity-protocol-biological-clock-reset',
      'phase-locked-acoustic-sleep',
    ],
    glossarySlugs: [],
    keywords: [
      'circadian rhythm',
      'circadian reset protocol',
      'morning light therapy',
      'jet lag recovery',
      'zeitgeber',
      'dark therapy',
      'sleep architecture',
    ],
    i18n: {
      es: {
        title: 'Ingeniería del Ritmo Circadiano',
        description:
          'Protocolos de luz, temperatura y temporización para reiniciar y estabilizar el reloj circadiano maestro — incluido jet lag y trabajo por turnos.',
        overview:
          'Cada célula lleva un reloj de 24 horas. El cluster circadiano de ONDA es el manual operativo para mantener ese reloj sincronizado: dosis de luz matinal, terapia de oscuridad, temporización de comidas y ejercicio, y el protocolo de reinicio multi-día usado para superar el jet lag, recuperarse del trabajo por turnos o restaurar una arquitectura del sueño rota.',
        keywords: [
          'ritmo circadiano',
          'protocolo de reinicio circadiano',
          'terapia de luz matinal',
          'recuperación de jet lag',
          'zeitgeber',
          'terapia de oscuridad',
          'arquitectura del sueño',
        ],
      },
      ru: {
        title: 'Инженерия циркадного ритма',
        description:
          'Протоколы света, температуры и тайминга для перезагрузки и стабилизации главных циркадных часов — включая джетлаг и сменную работу.',
        overview:
          'Каждая клетка несёт собственные 24-часовые часы. Циркадный кластер ONDA — это операционное руководство по их синхронизации: утренняя доза света, тёмная терапия, тайминг еды и тренировок, многодневный протокол сброса для устранения джетлага, восстановления после сменной работы или починки сломанной архитектуры сна.',
        keywords: [
          'циркадный ритм',
          'протокол сброса циркадных часов',
          'утренняя световая терапия',
          'восстановление при джетлаге',
          'цайтгебер',
          'тёмная терапия',
          'архитектура сна',
        ],
      },
      uk: {
        title: 'Інженерія циркадного ритму',
        description:
          'Протоколи світла, температури і таймінгу для перезавантаження і стабілізації головного циркадного годинника — джетлаг і змінна робота.',
        overview:
          'Кожна клітина має власний 24-годинний годинник. Циркадний кластер ONDA — це операційне керівництво з його синхронізації: ранкова доза світла, темна терапія, таймінг їжі і тренувань, багатоденний протокол скиду для подолання джетлагу, відновлення після змінної роботи або відновлення зламаної архітектури сну.',
        keywords: [
          'циркадний ритм',
          'протокол скиду циркадного ритму',
          'ранкова світлова терапія',
          'відновлення при джетлазі',
          'цайтгебер',
          'темна терапія',
          'архітектура сну',
        ],
      },
      zh: {
        title: '昼夜节律工程',
        description:
          '光照、温度与时机的协议，用于重置并稳定主昼夜节律时钟——包括时差和倒班恢复。',
        overview:
          '每个细胞都自带一个 24 小时的时钟。ONDA 昼夜节律集群是保持该时钟同步的操作手册：晨光剂量、黑暗疗法、饮食与运动时机，以及用于消除时差、从倒班中恢复或修复破碎睡眠结构的多日重置协议。',
        keywords: [
          '昼夜节律',
          '昼夜节律重置协议',
          '晨光疗法',
          '时差恢复',
          '授时因子',
          '黑暗疗法',
          '睡眠结构',
        ],
      },
    },
  },
  {
    slug: 'dopamine',
    title: 'Dopamine Architecture & Motivation',
    description:
      'Mesolimbic-circuit protocols for restoring baseline dopamine, preventing dopaminergic burnout, and engineering durable motivation.',
    overview:
      'Dopamine is the prediction-error signal — the neuromodulator that decides what is worth pursuing next. The ONDA dopamine cluster is the engineering manual for the mesolimbic system: how baseline tone collapses, why most "dopamine detox" advice fails, and the receptor-sensitivity protocols that durably restore motivational drive.',
    articleSlugs: [
      'dopamine-architecture-mastering-desire',
      'dopamine-stacking-preventing-circuit-overload',
      'ventral-tegmental-core-motivational-salience',
    ],
    glossarySlugs: [],
    keywords: [
      'dopamine baseline',
      'dopamine detox',
      'dopamine stacking',
      'ventral tegmental area',
      'mesolimbic circuit',
      'receptor sensitivity reset',
      'motivational salience',
    ],
    i18n: {
      es: {
        title: 'Arquitectura de la Dopamina y Motivación',
        description:
          'Protocolos del circuito mesolímbico para restaurar la dopamina basal, prevenir el burnout dopaminérgico e ingenierizar motivación duradera.',
        overview:
          'La dopamina es la señal de error de predicción — el neuromodulador que decide qué vale la pena perseguir a continuación. El cluster de dopamina de ONDA es el manual de ingeniería del sistema mesolímbico: cómo se colapsa el tono basal, por qué fracasa la mayoría de consejos sobre "detox de dopamina" y los protocolos de sensibilidad de receptores que restauran el impulso motivacional de forma duradera.',
        keywords: [
          'dopamina basal',
          'detox de dopamina',
          'apilamiento de dopamina',
          'área tegmental ventral',
          'circuito mesolímbico',
          'reinicio de sensibilidad de receptores',
          'saliencia motivacional',
        ],
      },
      ru: {
        title: 'Архитектура дофамина и мотивация',
        description:
          'Протоколы мезолимбической цепи для восстановления базового дофамина, предотвращения дофаминового выгорания и инженерии устойчивой мотивации.',
        overview:
          'Дофамин — это сигнал ошибки предсказания, нейромодулятор, который решает, что стоит преследовать дальше. Дофаминовый кластер ONDA — это инженерное руководство по мезолимбической системе: как обрушивается базовый тонус, почему большинство советов про «детокс дофамина» не работают, и протоколы чувствительности рецепторов, устойчиво восстанавливающие мотивационный драйв.',
        keywords: [
          'базовый дофамин',
          'дофаминовый детокс',
          'стэкинг дофамина',
          'вентральная тегментальная область',
          'мезолимбическая цепь',
          'сброс чувствительности рецепторов',
          'мотивационная значимость',
        ],
      },
      uk: {
        title: 'Архітектура дофаміну і мотивація',
        description:
          'Протоколи мезолімбічного кола для відновлення базового дофаміну, запобігання дофаміновому вигоранню та інженерії стійкої мотивації.',
        overview:
          'Дофамін — це сигнал помилки передбачення, нейромодулятор, що вирішує, за чим варто гнатися далі. Дофаміновий кластер ONDA — це інженерне керівництво з мезолімбічної системи: як обвалюється базовий тонус, чому більшість порад про «детокс дофаміну» не працюють, і протоколи чутливості рецепторів, що стійко відновлюють мотиваційний драйв.',
        keywords: [
          'базовий дофамін',
          'дофаміновий детокс',
          'стекінг дофаміну',
          'вентральна тегментальна ділянка',
          'мезолімбічне коло',
          'скид чутливості рецепторів',
          'мотиваційна значущість',
        ],
      },
      zh: {
        title: '多巴胺架构与动机',
        description:
          '中脑边缘回路协议——恢复基线多巴胺，防止多巴胺耗竭，并工程化持久的动机。',
        overview:
          '多巴胺是预测误差信号——决定下一步值得追求什么的神经调质。ONDA 多巴胺集群是中脑边缘系统的工程手册：基线张力如何崩溃，为什么大多数"多巴胺戒断"建议会失败，以及能够持久恢复动机驱力的受体敏感性协议。',
        keywords: [
          '多巴胺基线',
          '多巴胺戒断',
          '多巴胺叠加',
          '腹侧被盖区',
          '中脑边缘回路',
          '受体敏感性重置',
          '动机显著性',
        ],
      },
    },
  },
  {
    slug: 'breathwork',
    title: 'Breathwork Protocols (Box, Resonant, CO2 Tolerance)',
    description:
      'Engineering-grade breathwork: 0.1 Hz resonant breathing, box, physiological sigh, CO2-tolerance training, and the Bohr-effect chemistry behind oxygen delivery.',
    overview:
      'Breathwork is the only autonomic input under voluntary control, which makes it the single fastest lever on the entire nervous system. The ONDA breathwork cluster covers the four protocols with the strongest evidence base — resonant frequency, box, physiological sigh, and CO2-tolerance training — plus the underlying Bohr-effect physiology that explains why CO2, not O2, is the rate-limiting variable.',
    articleSlugs: [
      'breathwork-command-line-interface',
      'co2-tolerance-expanding-oxygen-limit',
      'bohr-effect-oxygen-telemetry',
      'quiet-mode-alpha-cortisol-buffer',
      'resonant-frequency-system-coherence',
    ],
    glossarySlugs: [],
    keywords: [
      'box breathing',
      'resonant frequency breathing 0.1 Hz',
      'physiological sigh',
      'CO2 tolerance training',
      'BOLT score',
      'Bohr effect',
      'pranayama protocol',
    ],
    i18n: {
      es: {
        title: 'Protocolos de Respiración (Box, Resonante, Tolerancia al CO2)',
        description:
          'Respiración de grado ingenieril: 0.1 Hz resonante, box, suspiro fisiológico, entrenamiento de tolerancia al CO2 y la química del efecto Bohr detrás del aporte de oxígeno.',
        overview:
          'La respiración es la única entrada autónoma bajo control voluntario, lo que la convierte en la palanca más rápida sobre todo el sistema nervioso. El cluster de respiración de ONDA cubre los cuatro protocolos con la base de evidencia más fuerte — frecuencia resonante, box, suspiro fisiológico y entrenamiento de tolerancia al CO2 — más la fisiología del efecto Bohr que explica por qué el CO2, no el O2, es la variable limitante.',
        keywords: [
          'box breathing',
          'respiración resonante 0.1 Hz',
          'suspiro fisiológico',
          'entrenamiento tolerancia CO2',
          'BOLT score',
          'efecto Bohr',
          'protocolo pranayama',
        ],
      },
      ru: {
        title: 'Протоколы дыхания (Box, резонансное, толерантность к CO2)',
        description:
          'Дыхание инженерного уровня: резонансное на 0,1 Гц, box, физиологический вздох, тренировка толерантности к CO2 и химия эффекта Бора за доставкой кислорода.',
        overview:
          'Дыхание — единственный автономный вход под произвольным контролем, что делает его самым быстрым рычагом всей нервной системы. Дыхательный кластер ONDA охватывает четыре протокола с самой сильной доказательной базой — резонансная частота, box, физиологический вздох и тренировка толерантности к CO2 — плюс физиология эффекта Бора, объясняющая, почему скорость-лимитирующая переменная это CO2, а не O2.',
        keywords: [
          'box breathing',
          'резонансное дыхание 0,1 Гц',
          'физиологический вздох',
          'тренировка толерантности к CO2',
          'BOLT score',
          'эффект Бора',
          'протокол пранаямы',
        ],
      },
      uk: {
        title: 'Протоколи дихання (Box, резонансне, толерантність до CO2)',
        description:
          'Дихання інженерного рівня: резонансне на 0,1 Гц, box, фізіологічне зітхання, тренування толерантності до CO2 і хімія ефекту Бора за доставкою кисню.',
        overview:
          'Дихання — єдиний автономний вхід під довільним контролем, що робить його найшвидшим важелем усієї нервової системи. Дихальний кластер ONDA охоплює чотири протоколи з найсильнішою доказовою базою — резонансна частота, box, фізіологічне зітхання і тренування толерантності до CO2 — плюс фізіологія ефекту Бора, що пояснює, чому швидкість-лімітуюча змінна це CO2, а не O2.',
        keywords: [
          'box breathing',
          'резонансне дихання 0,1 Гц',
          'фізіологічне зітхання',
          'тренування толерантності до CO2',
          'BOLT score',
          'ефект Бора',
          'протокол пранаями',
        ],
      },
      zh: {
        title: '呼吸协议（Box、共振、CO2 耐受）',
        description:
          '工程级呼吸：0.1 Hz 共振、Box、生理性叹息、CO2 耐受训练，以及氧输送背后的玻尔效应化学。',
        overview:
          '呼吸是唯一可自主控制的自主神经输入，因此它是整个神经系统最快的杠杆。ONDA 呼吸集群涵盖证据基础最强的四种协议——共振频率、Box、生理性叹息、CO2 耐受训练——以及解释为何 CO2（而非 O2）才是速率限制变量的玻尔效应生理学。',
        keywords: [
          'box 呼吸',
          '共振频率呼吸 0.1 Hz',
          '生理性叹息',
          'CO2 耐受训练',
          'BOLT 分数',
          '玻尔效应',
          '调息协议',
        ],
      },
    },
  },
  {
    slug: 'metabolic-flexibility',
    title: 'Metabolic Flexibility & Dual-Fuel Switching',
    description:
      'Restore the ability to switch between glucose and ketones on demand — the foundation of energy stability, insulin sensitivity, and longevity.',
    overview:
      'Metabolic flexibility is the cellular ability to switch fuel sources between glucose and fatty acids/ketones without producing fatigue, brain fog, or insulin spikes. The ONDA metabolic cluster covers the four engineering levers — fasting, exercise, food composition, and circadian alignment — plus the leptin/TSH/GLP-1 endocrine axes that govern how the switch is calibrated.',
    articleSlugs: [
      'metabolic-flexibility-dual-fuel-system',
      'metabolic-redundancy-hybrid-power-architecture',
      'glp1-biology-muscle-preservation',
      'energy-sensor-leptin',
      'energy-governor-tsh',
      'muscle-metabolic-marker',
    ],
    glossarySlugs: [],
    keywords: [
      'metabolic flexibility',
      'fat adaptation',
      'GLP-1 natural activation',
      'leptin sensitivity',
      'TSH thyroid governor',
      'zone 2 cardio mitochondria',
      'insulin sensitivity',
    ],
    i18n: {
      es: {
        title: 'Flexibilidad Metabólica y Cambio de Combustible Dual',
        description:
          'Restaurar la capacidad de cambiar entre glucosa y cetonas a demanda — la base de la estabilidad energética, sensibilidad a la insulina y longevidad.',
        overview:
          'La flexibilidad metabólica es la capacidad celular de cambiar fuentes de combustible entre glucosa y ácidos grasos/cetonas sin generar fatiga, niebla mental o picos de insulina. El cluster metabólico de ONDA cubre las cuatro palancas de ingeniería — ayuno, ejercicio, composición de los alimentos y alineación circadiana — más los ejes endocrinos leptina/TSH/GLP-1 que gobiernan cómo se calibra el cambio.',
        keywords: [
          'flexibilidad metabólica',
          'adaptación a la grasa',
          'activación natural de GLP-1',
          'sensibilidad a la leptina',
          'gobernador tiroideo TSH',
          'cardio zona 2 mitocondria',
          'sensibilidad a la insulina',
        ],
      },
      ru: {
        title: 'Метаболическая гибкость и переключение двух видов топлива',
        description:
          'Восстановите способность переключаться между глюкозой и кетонами по требованию — фундамент энергетической стабильности, чувствительности к инсулину и долголетия.',
        overview:
          'Метаболическая гибкость — это клеточная способность переключать источники топлива между глюкозой и жирными кислотами/кетонами без усталости, тумана в голове и инсулиновых скачков. Метаболический кластер ONDA охватывает четыре инженерных рычага — голодание, нагрузку, композицию пищи и циркадную синхронизацию — плюс эндокринные оси лептин/ТТГ/GLP-1, управляющие калибровкой переключателя.',
        keywords: [
          'метаболическая гибкость',
          'жировая адаптация',
          'естественная активация GLP-1',
          'чувствительность к лептину',
          'ТТГ как метаболический губернатор',
          'зона 2 митохондрии',
          'чувствительность к инсулину',
        ],
      },
      uk: {
        title: 'Метаболічна гнучкість і перемикання двох видів палива',
        description:
          'Відновіть здатність перемикатися між глюкозою і кетонами за потреби — фундамент енергетичної стабільності, чутливості до інсуліну та довголіття.',
        overview:
          'Метаболічна гнучкість — це клітинна здатність перемикати джерела палива між глюкозою і жирними кислотами/кетонами без втоми, туману в голові та інсулінових сплесків. Метаболічний кластер ONDA охоплює чотири інженерних важелі — голодування, навантаження, композиція їжі і циркадна синхронізація — плюс ендокринні осі лептин/ТТГ/GLP-1, що керують калібруванням перемикача.',
        keywords: [
          'метаболічна гнучкість',
          'жирова адаптація',
          'природна активація GLP-1',
          'чутливість до лептину',
          'ТТГ як метаболічний регулятор',
          'зона 2 мітохондрії',
          'чутливість до інсуліну',
        ],
      },
      zh: {
        title: '代谢灵活性与双燃料切换',
        description:
          '恢复按需在葡萄糖与酮体之间切换的能力——能量稳定、胰岛素敏感性与长寿的基础。',
        overview:
          '代谢灵活性是细胞在葡萄糖与脂肪酸/酮体之间切换燃料源的能力，且不会产生疲劳、脑雾或胰岛素峰值。ONDA 代谢集群涵盖四个工程杠杆——禁食、运动、食物构成、昼夜节律对齐——以及决定切换如何被校准的瘦素/TSH/GLP-1 内分泌轴。',
        keywords: [
          '代谢灵活性',
          '脂肪适应',
          '天然 GLP-1 激活',
          '瘦素敏感性',
          'TSH 甲状腺调控',
          '区间 2 心肺线粒体',
          '胰岛素敏感性',
        ],
      },
    },
  },
  {
    slug: 'glymphatic-clearance',
    title: 'Glymphatic Clearance & Cerebral Hydraulics',
    description:
      'Sleep-position, lateralization, and CSF-flow protocols that maximize the brain\'s nightly waste-clearance system.',
    overview:
      'The glymphatic system is the brain\'s overnight waste-clearance pipeline — only fully active during deep NREM sleep and only at maximal flow when CSF dynamics are unobstructed. The ONDA cluster covers the engineering controls: sleep position, head/neck angle, fluid viscosity, vascular tensegrity, and the protocol stack that converts a normal night into a full neural-cache flush.',
    articleSlugs: [
      'glymphatic-flush-clearing-neural-cache',
      'nightly-flush-glymphatic-neural-cache',
      'neural-hydraulics-csf-flow',
      'vascular-tensegrity-microvascular-mechanics',
      'hydraulic-viscosity-onda-transport-bus',
    ],
    glossarySlugs: [],
    keywords: [
      'glymphatic system',
      'cerebrospinal fluid clearance',
      'NREM deep sleep flush',
      'beta amyloid clearance',
      'cerebral hydraulics',
      'side sleep position glymphatic',
      'CSF flow optimization',
    ],
    i18n: {
      es: {
        title: 'Aclaramiento Glinfático e Hidráulica Cerebral',
        description:
          'Protocolos de posición de sueño, lateralización y flujo de LCR que maximizan el sistema nocturno de aclaramiento de residuos del cerebro.',
        overview:
          'El sistema glinfático es la tubería nocturna de aclaramiento de residuos del cerebro — solo plenamente activo durante el sueño NREM profundo y solo a flujo máximo cuando la dinámica del LCR no está obstruida. El cluster ONDA cubre los controles de ingeniería: posición de sueño, ángulo cabeza/cuello, viscosidad del fluido, tensegridad vascular y la pila de protocolos que convierte una noche normal en un vaciado completo de la caché neural.',
        keywords: [
          'sistema glinfático',
          'aclaramiento del líquido cefalorraquídeo',
          'vaciado NREM sueño profundo',
          'aclaramiento beta amiloide',
          'hidráulica cerebral',
          'posición lateral glinfática',
          'optimización flujo LCR',
        ],
      },
      ru: {
        title: 'Глимфатическое очищение и церебральная гидравлика',
        description:
          'Протоколы позы сна, латерализации и потока ЦСЖ, максимизирующие ночную систему мозга по выводу метаболитов.',
        overview:
          'Глимфатическая система — это ночной трубопровод мозга для удаления метаболитов, полностью активный только во время глубокого NREM-сна и работающий на максимальном потоке только при беспрепятственной динамике ЦСЖ. Кластер ONDA охватывает инженерные контроли: позу сна, угол головы и шеи, вязкость жидкости, васкулярную тенсегрити и стек протоколов, превращающих обычную ночь в полный сброс нейронного кэша.',
        keywords: [
          'глимфатическая система',
          'клиренс цереброспинальной жидкости',
          'NREM глубокий сон промывка',
          'клиренс бета-амилоида',
          'церебральная гидравлика',
          'боковая поза сна и глимфатика',
          'оптимизация потока ЦСЖ',
        ],
      },
      uk: {
        title: 'Глімфатичне очищення і церебральна гідравліка',
        description:
          'Протоколи пози сну, латералізації і потоку ЦСР, що максимізують нічну систему мозку для виведення метаболітів.',
        overview:
          'Глімфатична система — це нічний трубопровід мозку для видалення метаболітів, повністю активний лише під час глибокого NREM-сну і працюючий на максимальному потоці лише при безперешкодній динаміці ЦСР. Кластер ONDA охоплює інженерні контролі: позу сну, кут голови і шиї, в\'язкість рідини, васкулярну тенсегриті і стек протоколів, що перетворюють звичайну ніч на повний скид нейронного кешу.',
        keywords: [
          'глімфатична система',
          'кліренс цереброспінальної рідини',
          'NREM глибокий сон промивка',
          'кліренс бета-амілоїду',
          'церебральна гідравліка',
          'бокова поза сну та глімфатика',
          'оптимізація потоку ЦСР',
        ],
      },
      zh: {
        title: '类淋巴清除与脑液动力学',
        description:
          '睡姿、侧位和脑脊液流动协议，最大化大脑夜间废物清除系统。',
        overview:
          '类淋巴系统是大脑夜间的废物清除管道——仅在深度 NREM 睡眠期间完全激活，且仅在脑脊液动力学畅通时才达到最大流量。ONDA 集群涵盖工程控制：睡姿、头颈角度、流体粘度、血管张拉整体性，以及将一个普通夜晚转化为完整神经缓存刷新的协议堆栈。',
        keywords: [
          '类淋巴系统',
          '脑脊液清除',
          'NREM 深度睡眠冲洗',
          'β 淀粉样蛋白清除',
          '脑液动力学',
          '侧卧睡姿类淋巴',
          '脑脊液流动优化',
        ],
      },
    },
  },
  {
    slug: 'neuroplasticity',
    title: 'Neuroplasticity, Flow, and Cognitive Architecture',
    description:
      'Protocols for inducing flow states, opening neuroplasticity windows, and engineering distraction-resilient cognitive architecture.',
    overview:
      'Neuroplasticity is the brain\'s rewire-on-demand capability — gated by acetylcholine, BDNF, dopamine, and a precise sleep-and-novelty stack. The ONDA neuroplasticity cluster covers the full pipeline: how to enter flow reliably, how to consolidate the rewire overnight, and the cognitive-control protocols (ACC calibration, alpha-theta gateway, monotasking discipline) that make the new wiring stick.</p>',
    articleSlugs: [
      'neuroplasticity-flow-overclocking',
      'anti-entropy-neural-architecture',
      'cognitive-architecture-neural-throughput',
      'cognitive-architecture-nootropic-stacks',
      'neural-bridge-alpha-flow-gateway',
      'neural-entrainment-meditation-2',
      'idle-state-alpha-rhythms',
      'physiological-concentration-flow-state-hardwired',
      'anterior-cingulate-core-coherence-monitoring',
      'acc-calibration-protocol-cognitive-control',
      'digital-dementia-attentional-control',
      'neural-signal-to-noise-cleaning-system-channel',
    ],
    glossarySlugs: [],
    keywords: [
      'neuroplasticity',
      'flow state',
      'BDNF',
      'acetylcholine attention',
      'cross-frequency coupling',
      'ACC calibration protocol',
      'cognitive control training',
    ],
    i18n: {
      es: {
        title: 'Neuroplasticidad, Flow y Arquitectura Cognitiva',
        description:
          'Protocolos para inducir estados de flow, abrir ventanas de neuroplasticidad e ingenierizar arquitectura cognitiva resistente a la distracción.',
        overview:
          'La neuroplasticidad es la capacidad cerebral de reescribir bajo demanda — controlada por acetilcolina, BDNF, dopamina y un stack preciso de sueño y novedad. El cluster de neuroplasticidad de ONDA cubre el pipeline completo: cómo entrar en flow de forma fiable, cómo consolidar el rewire durante la noche y los protocolos de control cognitivo (calibración del CCA, puerta alfa-theta, disciplina de monotarea) que hacen que el nuevo cableado se mantenga.',
        keywords: [
          'neuroplasticidad',
          'estado de flow',
          'BDNF',
          'acetilcolina atención',
          'acoplamiento de frecuencias cruzadas',
          'protocolo calibración CCA',
          'entrenamiento control cognitivo',
        ],
      },
      ru: {
        title: 'Нейропластичность, поток и когнитивная архитектура',
        description:
          'Протоколы для вхождения в поток, открытия окон нейропластичности и инженерии когнитивной архитектуры, устойчивой к отвлечениям.',
        overview:
          'Нейропластичность — это способность мозга перестраиваться по требованию, управляемая ацетилхолином, BDNF, дофамином и точным стеком сна и новизны. Кластер нейропластичности ONDA охватывает полный конвейер: как надёжно входить в поток, как консолидировать перестройку за ночь, и протоколы когнитивного контроля (калибровка ППК, альфа-тета-шлюз, дисциплина монозадачности), которые закрепляют новую разводку.',
        keywords: [
          'нейропластичность',
          'состояние потока',
          'BDNF',
          'ацетилхолин и внимание',
          'кросс-частотное связывание',
          'протокол калибровки ППК',
          'тренировка когнитивного контроля',
        ],
      },
      uk: {
        title: 'Нейропластичність, потік і когнітивна архітектура',
        description:
          'Протоколи для входу в потік, відкриття вікон нейропластичності та інженерії когнітивної архітектури, стійкої до відволікань.',
        overview:
          'Нейропластичність — це здатність мозку перебудовуватися на вимогу, керована ацетилхоліном, BDNF, дофаміном і точним стеком сну і новизни. Кластер нейропластичності ONDA охоплює повний конвеєр: як надійно входити в потік, як консолідувати перебудову за ніч, і протоколи когнітивного контролю (калібрування ПЛК, альфа-тета шлюз, дисципліна монозадачності), що закріплюють нову розводку.',
        keywords: [
          'нейропластичність',
          'стан потоку',
          'BDNF',
          'ацетилхолін і увага',
          'крос-частотне зв\'язування',
          'протокол калібрування ПЛК',
          'тренування когнітивного контролю',
        ],
      },
      zh: {
        title: '神经可塑性、心流与认知架构',
        description:
          '诱导心流状态、打开神经可塑性窗口、工程化抗干扰认知架构的协议。',
        overview:
          '神经可塑性是大脑按需重新布线的能力——受乙酰胆碱、BDNF、多巴胺以及精确的睡眠与新奇性堆栈调控。ONDA 神经可塑性集群涵盖完整流程：如何可靠进入心流，如何在夜间巩固重新布线，以及让新布线持久的认知控制协议（前扣带回校准、α-θ 通道、单任务纪律）。',
        keywords: [
          '神经可塑性',
          '心流状态',
          'BDNF',
          '乙酰胆碱注意力',
          '跨频耦合',
          'ACC 校准协议',
          '认知控制训练',
        ],
      },
    },
  },
  {
    slug: 'mitochondria',
    title: 'Mitochondria, Photobiomodulation & Cellular Power',
    description:
      'PGC-1α biogenesis, red-light therapy wavelengths, senolytics, and the autophagy stack — the engineering of the cellular power grid.',
    overview:
      'Mitochondria convert food and oxygen into ATP and reactive-oxygen-species signaling. The ONDA mitochondria cluster covers the protocols that durably increase mitochondrial density (zone-2 cardio, cold/heat exposure), repair existing organelles (PGC-1α, autophagy), and reach inside them with red-light photobiomodulation at the 660–850 nm cytochrome-c-oxidase peaks.',
    articleSlugs: [
      'mitochondrial-biogenesis-cellular-power-grid',
      'mitochondrial-dna-red-light',
      'longevity-hardware-cellular-cleanup',
      'senolytic-high-dosing-longevity',
      'cacao-stem-cells',
    ],
    glossarySlugs: [],
    keywords: [
      'mitochondrial biogenesis',
      'PGC-1 alpha',
      'red light therapy 660nm 850nm',
      'photobiomodulation',
      'autophagy protocol',
      'senolytics quercetin fisetin',
      'cytochrome c oxidase',
    ],
    i18n: {
      es: {
        title: 'Mitocondrias, Fotobiomodulación y Energía Celular',
        description:
          'Biogénesis PGC-1α, longitudes de onda de luz roja, senolíticos y el stack de autofagia — la ingeniería de la red eléctrica celular.',
        overview:
          'Las mitocondrias convierten alimento y oxígeno en ATP y señalización por especies reactivas de oxígeno. El cluster de mitocondrias de ONDA cubre los protocolos que aumentan de forma duradera la densidad mitocondrial (cardio zona 2, exposición al frío/calor), reparan los orgánulos existentes (PGC-1α, autofagia) y alcanzan su interior con fotobiomodulación de luz roja en los picos de citocromo c oxidasa de 660–850 nm.',
        keywords: [
          'biogénesis mitocondrial',
          'PGC-1 alfa',
          'terapia de luz roja 660nm 850nm',
          'fotobiomodulación',
          'protocolo de autofagia',
          'senolíticos quercetina fisetina',
          'citocromo c oxidasa',
        ],
      },
      ru: {
        title: 'Митохондрии, фотобиомодуляция и клеточная энергия',
        description:
          'Биогенез PGC-1α, длины волн красного света, сенолитики и стек аутофагии — инженерия клеточной электросети.',
        overview:
          'Митохондрии превращают пищу и кислород в АТФ и сигнализацию активных форм кислорода. Митохондриальный кластер ONDA охватывает протоколы, устойчиво повышающие плотность митохондрий (зона 2, холод и тепло), восстанавливающие существующие органеллы (PGC-1α, аутофагия) и проникающие внутрь них фотобиомодуляцией красным светом на пиках цитохром-c-оксидазы 660–850 нм.',
        keywords: [
          'биогенез митохондрий',
          'PGC-1 альфа',
          'красный свет 660нм 850нм',
          'фотобиомодуляция',
          'протокол аутофагии',
          'сенолитики кверцетин фисетин',
          'цитохром c оксидаза',
        ],
      },
      uk: {
        title: 'Мітохондрії, фотобіомодуляція і клітинна енергія',
        description:
          'Біогенез PGC-1α, довжини хвиль червоного світла, сенолітики і стек аутофагії — інженерія клітинної електромережі.',
        overview:
          'Мітохондрії перетворюють їжу і кисень на АТФ і сигналізацію активних форм кисню. Мітохондріальний кластер ONDA охоплює протоколи, що стійко підвищують щільність мітохондрій (зона 2, холод і тепло), відновлюють існуючі органели (PGC-1α, аутофагія) і проникають усередину них фотобіомодуляцією червоним світлом на піках цитохром-c-оксидази 660–850 нм.',
        keywords: [
          'біогенез мітохондрій',
          'PGC-1 альфа',
          'червоне світло 660нм 850нм',
          'фотобіомодуляція',
          'протокол аутофагії',
          'сенолітики кверцетин фізетин',
          'цитохром c оксидаза',
        ],
      },
      zh: {
        title: '线粒体、光生物调节与细胞能量',
        description:
          'PGC-1α 生物发生、红光波长、衰老细胞清除剂、自噬堆栈——细胞电网的工程化。',
        overview:
          '线粒体将食物和氧气转化为 ATP 和活性氧信号。ONDA 线粒体集群涵盖能持久提升线粒体密度的协议（区间 2 心肺、冷/热暴露），修复现有细胞器的协议（PGC-1α、自噬），以及通过 660–850 nm 细胞色素 c 氧化酶峰值的红光光生物调节深入其内部的方法。',
        keywords: [
          '线粒体生物发生',
          'PGC-1 α',
          '红光疗法 660nm 850nm',
          '光生物调节',
          '自噬协议',
          '衰老细胞清除剂槲皮素漆黄素',
          '细胞色素 c 氧化酶',
        ],
      },
    },
  },
  {
    slug: 'cold-exposure',
    title: 'Cold Exposure, Adrenal Governor & Hormesis',
    description:
      'Cold-plunge dosing, range-fractionation training, and HPA-axis recovery — the hormetic stack for adrenal resilience.',
    overview:
      'Cold exposure is hormetic stress: small, well-dosed challenges that train the adrenal governor, expand brown-adipose thermogenesis, and durably raise dopamine baseline. The ONDA cold cluster covers the dose-response curve, the HPA-axis recovery protocol, and the range-fractionation training that prevents cold from becoming chronic stress.',
    articleSlugs: [
      'adaptation-hack-range-fractionation',
      'adrenal-governor-thermal-runaway',
      'hpa-axis-control-cortisol-aggression',
    ],
    glossarySlugs: [],
    keywords: [
      'cold exposure protocol',
      'cold plunge dosing',
      'HPA axis recovery',
      'adrenal resilience',
      'hormesis',
      'brown adipose thermogenesis',
      'cortisol regulation',
    ],
    i18n: {
      es: {
        title: 'Exposición al Frío, Gobernador Adrenal y Hormesis',
        description:
          'Dosificación de cold plunge, entrenamiento de fraccionamiento de rango y recuperación del eje HPA — el stack hormético para la resiliencia adrenal.',
        overview:
          'La exposición al frío es estrés hormético: desafíos pequeños y bien dosificados que entrenan el gobernador adrenal, expanden la termogénesis del tejido adiposo marrón y elevan de forma duradera la dopamina basal. El cluster de frío de ONDA cubre la curva dosis-respuesta, el protocolo de recuperación del eje HPA y el entrenamiento de fraccionamiento de rango que evita que el frío se convierta en estrés crónico.',
        keywords: [
          'protocolo exposición al frío',
          'dosificación cold plunge',
          'recuperación eje HPA',
          'resiliencia adrenal',
          'hormesis',
          'termogénesis tejido adiposo marrón',
          'regulación cortisol',
        ],
      },
      ru: {
        title: 'Холодовое воздействие, надпочечниковый регулятор и гормезис',
        description:
          'Дозирование холодного погружения, тренировка фракционирования диапазона и восстановление оси HPA — гормезис-стек для надпочечниковой устойчивости.',
        overview:
          'Холодовое воздействие — это гормезисный стресс: малые, точно дозированные вызовы, тренирующие надпочечниковый регулятор, расширяющие термогенез бурой жировой ткани и устойчиво поднимающие базовый дофамин. Холодовой кластер ONDA охватывает кривую доза-эффект, протокол восстановления оси HPA и тренировку фракционирования диапазона, не дающую холоду превратиться в хронический стресс.',
        keywords: [
          'протокол холодового воздействия',
          'дозирование cold plunge',
          'восстановление оси HPA',
          'надпочечниковая устойчивость',
          'гормезис',
          'термогенез бурой жировой ткани',
          'регуляция кортизола',
        ],
      },
      uk: {
        title: 'Холодова експозиція, наднирковий регулятор і гормезис',
        description:
          'Дозування cold plunge, тренування фракціонування діапазону і відновлення осі HPA — гормезисний стек для надниркової стійкості.',
        overview:
          'Холодова експозиція — це гормезисний стрес: малі, точно дозовані виклики, що тренують надниркового регулятора, розширюють термогенез бурої жирової тканини і стійко підвищують базовий дофамін. Холодовий кластер ONDA охоплює криву доза-ефект, протокол відновлення осі HPA і тренування фракціонування діапазону, що не дає холоду перетворитися на хронічний стрес.',
        keywords: [
          'протокол холодової експозиції',
          'дозування cold plunge',
          'відновлення осі HPA',
          'надниркова стійкість',
          'гормезис',
          'термогенез бурої жирової тканини',
          'регуляція кортизолу',
        ],
      },
      zh: {
        title: '冷暴露、肾上腺调节器与毒物兴奋效应',
        description:
          '冷水浸泡剂量、范围分馏训练、HPA 轴恢复——肾上腺韧性的毒物兴奋堆栈。',
        overview:
          '冷暴露是毒物兴奋性压力：经过良好剂量化的小挑战，训练肾上腺调节器、扩展棕色脂肪组织产热，并持久提升基线多巴胺。ONDA 冷暴露集群涵盖剂量-反应曲线、HPA 轴恢复协议，以及防止冷暴露变成慢性压力的范围分馏训练。',
        keywords: [
          '冷暴露协议',
          '冷水浸泡剂量',
          'HPA 轴恢复',
          '肾上腺韧性',
          '毒物兴奋效应',
          '棕色脂肪产热',
          '皮质醇调节',
        ],
      },
    },
  },
]

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}

export function getLocalizedTopic(topic: Topic, lang: Lang): LocalizedTopicCopy {
  if (lang !== 'en' && topic.i18n?.[lang]) {
    return topic.i18n[lang]!
  }
  return {
    title: topic.title,
    description: topic.description,
    overview: topic.overview,
    keywords: topic.keywords,
  }
}
