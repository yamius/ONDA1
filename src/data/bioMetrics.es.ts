import type { MetricDetail } from './bioMetrics'

const SOURCE_NOTE =
  'Todo lo que ves en esta pantalla se calcula a partir de muestras de frecuencia cardíaca (latidos por minuto), aproximadamente una por segundo, de tu Apple Watch / Apple Health o de una banda de frecuencia cardíaca Bluetooth. La app no recibe los intervalos entre latidos (RR), así que trabaja con las subidas y bajadas de tu frecuencia cardíaca durante los últimos ~45 segundos.'

const HEALTH_NOTE =
  'Esta es una herramienta de bienestar, no un dispositivo médico. Si notas un pulso irregular, palpitaciones inusuales o una frecuencia cardíaca en reposo que a menudo es muy alta o muy baja, consulta a un médico.'

const HEURISTIC_NOTE =
  'Es una puntuación heurística experimental, no una medida científica validada, y no detecta emociones. Solo combina cómo se comparan tu frecuencia cardíaca actual y tu respiración estimada con tus propios valores recientes. "Estabilidad de la respiración" significa cuán poco ha variado tu frecuencia respiratoria estimada durante los últimos ~30 segundos (su dispersión respecto a su promedio). Úsala como una señal orientativa y compárala con cómo te sientes realmente.'

export const METRIC_DETAILS_ES: Record<string, MetricDetail> = {
  flow: {
    key: 'flow',
    title: 'Flujo (experimental)',
    shortTitle: '🌊 Flujo',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una puntuación de 0 a 100 que sube cuando tu frecuencia cardíaca está un poco por encima de tu nivel habitual (ni demasiado baja ni demasiado alta), tu respiración estimada es estable y la puntuación de Estrés es baja. Es una aproximación a un estado de "calma pero implicación", no una medición del estado psicológico de flujo.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'La app sitúa tu frecuencia cardíaca actual en una escala de 0 a 1 respecto a tu promedio personal en curso. La mitad de la puntuación premia estar cerca de la parte media-alta de esa escala (con un pico alrededor de 0,55); el 30 % proviene de la estabilidad de la respiración; el 20 %, de una puntuación de Estrés baja. El resultado se escala de 0 a 100 y se actualiza cada 2 segundos.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Más alto', text: 'Frecuencia cardíaca moderada, respiración estable y Estrés bajo: condiciones que suelen acompañar un trabajo tranquilo y concentrado.' },
          { label: 'Más bajo', text: 'Frecuencia cardíaca claramente por encima o por debajo de tu nivel habitual, o una puntuación de Estrés alta.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: HEURISTIC_NOTE + ' Como premia una frecuencia cardíaca "intermedia", tanto los estados muy relajados como los muy activos obtienen una puntuación más baja.',
      },
      {
        highlight: 'Toma el Flujo como una pista, no como un veredicto. Si la puntuación y tu experiencia no coinciden, confía en tu experiencia.',
      },
    ],
  },
  fatigue: {
    key: 'fatigue',
    title: 'Fatiga (experimental)',
    shortTitle: '🪫 Fatiga',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una puntuación de 0 a 100 que sube cuando tu frecuencia cardíaca y tu frecuencia respiratoria estimada están por encima de tu nivel habitual y la puntuación de Energía es baja. No mide directamente el cansancio, la falta de sueño ni la recuperación.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'El 50 % depende de cuánto supera tu frecuencia cardíaca actual a tu promedio personal en curso, el 20 % de cuánto supera tu frecuencia respiratoria estimada a su promedio y el 30 % de una puntuación de Energía baja. Se escala de 0 a 100 y se actualiza cada 2 segundos.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Más alto', text: 'Frecuencia cardíaca y respiración por encima de tu nivel habitual con Energía baja. Puede deberse al cansancio, pero también a la cafeína, el calor, ponerte de pie, hablar o haberte movido hace poco.' },
          { label: 'Más bajo', text: 'Frecuencia cardíaca y respiración en tu nivel habitual o por debajo.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: HEURISTIC_NOTE + ' La fatiga real se valora mejor a lo largo de varios días: el sueño, cómo te sientes y tendencias como la frecuencia cardíaca en reposo en Apple Health.',
      },
      {
        highlight: 'Si te sientes agotado, descansar es buena idea, diga lo que diga este número.',
      },
    ],
  },
  excitement: {
    key: 'excitement',
    title: 'Emoción (experimental)',
    shortTitle: '✨ Emoción',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una puntuación de 0 a 100 que reacciona sobre todo a la subida de tu frecuencia cardíaca en este momento. Te indica que tu pulso está subiendo, no si eso se siente como emoción, ansiedad o simplemente subir unas escaleras.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'El 60 % depende de lo rápido que sube ahora tu frecuencia cardíaca (un cambio suavizado sobre las últimas muestras; una subida de unos 0,5 bpm por segundo o más cuenta como máxima), el 30 % de cuánto supera tu frecuencia cardíaca a tu promedio personal y el 10 % de cuánto sube tu frecuencia respiratoria estimada. Se escala de 0 a 100 y se actualiza cada 2 segundos.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Más alto', text: 'Tu frecuencia cardíaca está subiendo y está por encima de tu nivel habitual.' },
          { label: 'Cerca de cero', text: 'Tu frecuencia cardíaca está estable o bajando.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: HEURISTIC_NOTE + ' Cualquier movimiento, hablar o ponerte de pie la harán subir.',
      },
      {
        highlight: 'El cuerpo reacciona de forma parecida a la emoción y a la ansiedad. Solo tú puedes saber cuál es.',
      },
    ],
  },
  focus: {
    key: 'focus',
    title: 'Enfoque / Concentración (experimental)',
    shortTitle: '🎯 Enfoque / Concentración',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una puntuación de 0 a 100 que sube cuando tu frecuencia cardíaca está moderadamente por encima de tu nivel habitual, no oscila mucho y la respiración parece estable. Es una aproximación basada solo en la frecuencia cardíaca: no puede medir la atención.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'El 50 % premia una frecuencia cardíaca cerca de la parte media-alta de tu rango personal (pico alrededor de 0,55 en una escala de 0 a 1 basada en tu promedio en curso); el 30 % premia una dispersión pequeña de la frecuencia cardíaca en la ventana actual (cuanto más bajo el número "HRV (estimación)", más puntos; con unos 6 bpm o más no suma nada); el 20 % proviene de la estabilidad de la respiración. Se escala de 0 a 100 y se actualiza cada 2 segundos.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Más alto', text: 'Frecuencia cardíaca moderada y estable: un patrón que puede acompañar una actividad tranquila y concentrada.' },
          { label: 'Más bajo', text: 'Frecuencia cardíaca muy por encima o por debajo de tu nivel habitual, o con muchas oscilaciones.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: HEURISTIC_NOTE,
      },
      {
        highlight: 'Úsalo para notar patrones con el tiempo, no para calificar un momento concreto.',
      },
    ],
  },
  relaxation: {
    key: 'relaxation',
    title: 'Relajación / Calma (experimental)',
    shortTitle: '🌿 Relajación / Calma',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una puntuación de 0 a 100 que sube cuando tu frecuencia cardíaca está por debajo de tu nivel habitual, la respiración parece estable y la puntuación de Estrés es baja.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'El 50 % depende de cuánto está tu frecuencia cardíaca actual por debajo de tu promedio personal en curso, el 30 % de la estabilidad de la respiración y el 20 % de una puntuación de Estrés baja. Se escala de 0 a 100 y se actualiza cada 2 segundos.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Subiendo', text: 'Tu frecuencia cardíaca se está asentando por debajo de tu promedio reciente: algo habitual al respirar lenta y relajadamente o al estar quieto.' },
          { label: 'Bajando', text: 'Tu frecuencia cardíaca está subiendo por encima de tu promedio reciente.' },
        ],
      },
      {
        heading: 'Qué influye',
        body: 'La postura, el movimiento, hablar, la cafeína, la temperatura y el tiempo que llevas quieto. Unos minutos sentado en calma con una respiración lenta y cómoda suelen hacerla subir.',
      },
      {
        heading: 'Limitaciones',
        body: HEURISTIC_NOTE,
      },
      {
        highlight: 'Observa la dirección durante una práctica: una puntuación que sube mientras respiras despacio es la señal útil.',
      },
    ],
  },
  alarm: {
    key: 'alarm',
    title: 'Alarma / Activación (experimental)',
    shortTitle: '🚨 Alarma / Ansiedad',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una puntuación de activación de 0 a 100: sube cuando tu frecuencia cardíaca y tu frecuencia respiratoria estimada están por encima de tu nivel habitual y la frecuencia cardíaca va en aumento. Muestra activación física, no ansiedad. No puede distinguir el miedo del ejercicio, el café o una conversación animada.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'El 50 % depende de cuánto supera tu frecuencia cardíaca actual a tu promedio personal en curso, el 30 % de cuánto supera tu frecuencia respiratoria estimada a su promedio y el 20 % de lo rápido que sube ahora tu frecuencia cardíaca. Se escala de 0 a 100 y se actualiza cada 2 segundos.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Más alto', text: 'Tu cuerpo está más activado de lo habitual.' },
          { label: 'Más bajo', text: 'Frecuencia cardíaca y respiración en tu nivel habitual o por debajo.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: HEURISTIC_NOTE,
      },
      {
        highlight: 'Si el número es alto y además te sientes tenso, prueba algo sencillo: unas cuantas respiraciones lentas con una exhalación más larga.',
      },
    ],
  },
  acceleration: {
    key: 'acceleration',
    title: 'Aceleración de FC',
    shortTitle: '⚡ Aceleración de FC',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Si el cambio de tu frecuencia cardíaca se está acelerando o frenando en este momento. Positivo significa que la subida se vuelve más pronunciada (o que la bajada se suaviza); negativo, que la subida se suaviza (o que la bajada se vuelve más pronunciada). Cerca de 0 significa que el cambio es constante.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'Toma las tres últimas muestras de frecuencia cardíaca y calcula una segunda diferencia: (más reciente − 2 × intermedia + más antigua) dividido por el cuadrado del intervalo de tiempo. La unidad es latidos por minuto por segundo al cuadrado. Las muestras llegan aproximadamente una vez por segundo, así que los valores típicos son pequeños, casi siempre entre −2 y +2, y se muestran con dos decimales.',
      },
      {
        heading: 'Limitaciones',
        body: 'Como usa solo tres muestras, es muy inestable y reacciona a cada pequeña oscilación o a una sola lectura con ruido. Conviene verlo como un indicador en vivo de "nerviosismo" del pulso, no como algo que seguir a lo largo del tiempo. ' + SOURCE_NOTE,
      },
      {
        highlight: 'Mira la Pendiente de tendencia de FC para la dirección general; la Aceleración solo muestra cambios momentáneos.',
      },
    ],
  },
  slope: {
    key: 'slope',
    title: 'Pendiente de tendencia de FC',
    shortTitle: '📈 Pendiente de tendencia de FC',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Hacia dónde va tu frecuencia cardíaca durante los últimos ~45 segundos. Negativo = tendencia a la baja, positivo = tendencia al alza, alrededor de 0 = estable.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'La app divide la ventana de ~45 segundos en dos mitades, resta el promedio de frecuencia cardíaca de la primera mitad al de la segunda y divide esa diferencia entre la mitad del número de muestras. Con aproximadamente una muestra por segundo, el resultado es más o menos el cambio en bpm por segundo. Los valores típicos son pequeños, por ejemplo de −0,10 a +0,10, y se muestran con dos decimales.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Negativo', text: 'Tu frecuencia cardíaca está bajando poco a poco: algo habitual al estar quieto o al respirar lenta y relajadamente.' },
          { label: 'Positivo', text: 'Tu frecuencia cardíaca está subiendo poco a poco: movimiento, hablar, ponerte de pie o un pensamiento estresante.' },
          { label: 'Cerca de 0', text: 'Tu frecuencia cardíaca está estable.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: 'Es una comparación simple entre dos mitades, no una regresión completa, así que un solo movimiento puede inclinarla. ' + SOURCE_NOTE,
      },
      {
        highlight: 'Durante una práctica para calmarte, una pendiente que se vuelve negativa y se mantiene así es buena señal de que tu frecuencia cardíaca se está asentando.',
      },
    ],
  },
  recovery: {
    key: 'recovery',
    title: 'Velocidad de recuperación',
    shortTitle: '🔄 Velocidad de recuperación',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Lo rápido que cambia tu frecuencia cardíaca ahora mismo, durante los últimos ~10 segundos. Negativo significa que tu frecuencia cardíaca está bajando; positivo, que está subiendo. No es un porcentaje de recuperación ni la "recuperación de la frecuencia cardíaca" clínica tras el ejercicio.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'Toma las últimas 10 muestras de frecuencia cardíaca, resta la más antigua a la más reciente y lo divide por el tiempo transcurrido entre ellas, lo que da latidos por minuto por segundo (por ejemplo, −0,3 significa que tu frecuencia cardíaca bajó unos 0,3 bpm cada segundo). La pantalla lo muestra con signo, por ejemplo −0,3 bpm/s; en reposo suele mantenerse dentro de unos ±1 bpm/s.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Negativo', text: 'La frecuencia cardíaca está bajando, por ejemplo después de dejar de moverte o durante una exhalación lenta.' },
          { label: 'Positivo', text: 'La frecuencia cardíaca está subiendo.' },
          { label: 'Alrededor de 0%', text: 'La frecuencia cardíaca está estable.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: 'Diez segundos es poco, así que el número oscila con cada respiración (la frecuencia cardíaca sube de forma natural al inhalar y baja al exhalar). ' + SOURCE_NOTE,
      },
      {
        highlight: 'Después de un esfuerzo, busca un valor claramente negativo: muestra que tu frecuencia cardíaca vuelve a bajar.',
      },
    ],
  },
  csi: {
    key: 'csi',
    title: 'CSI: Índice de estabilidad cardíaca',
    shortTitle: '🎯 Índice de estabilidad cardíaca (CSI)',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Lo estable que ha sido tu frecuencia cardíaca durante los últimos ~45 segundos, en relación con su promedio. Más alto = más estable. Normalmente verás valores entre aproximadamente 0,90 y 1,00.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'CSI = 1 − (desviación estándar de la frecuencia cardíaca ÷ frecuencia cardíaca media) en la ventana, mostrado con dos decimales. Por ejemplo, un promedio de 70 bpm con una dispersión de 2,1 bpm da 1 − 0,03 = 0,97.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Cerca de 1,00', text: 'La frecuencia cardíaca apenas cambió durante la ventana.' },
          { label: 'Más bajo (p. ej., 0,90 o menos)', text: 'La frecuencia cardíaca cambió mucho, normalmente por movimiento, hablar, un cambio de postura o una lectura con ruido.' },
        ],
      },
      {
        heading: 'Qué influye',
        body: 'El movimiento y los cambios de actividad lo bajan. La respiración lenta y profunda también puede bajarlo un poco, porque hace que la frecuencia cardíaca suba y baje más con cada respiración, así que un CSI más bajo no es automáticamente "malo".',
      },
      {
        heading: 'Limitaciones',
        body: 'El CSI es un número propio de ONDA, no una medida clínica estándar. ' + SOURCE_NOTE,
      },
      {
        highlight: HEALTH_NOTE,
      },
    ],
  },
  hrv: {
    key: 'hrv',
    title: 'HRV (estimación): dispersión de la frecuencia cardíaca',
    shortTitle: '📊 HRV (estimación)',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Cuánto subió y bajó tu frecuencia cardíaca durante los últimos ~45 segundos, en latidos por minuto. Por ejemplo, 2,3 significa que tu frecuencia cardíaca varió normalmente unos 2,3 bpm alrededor de su promedio. En reposo son habituales valores de aproximadamente 1 a 5; el movimiento lo eleva.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'Es la desviación estándar de tus muestras de frecuencia cardíaca (bpm) en la ventana, mostrada con un decimal. Es un sustituto aproximado de la variabilidad de la frecuencia cardíaca, por eso el recuadro dice "estimación".',
      },
      {
        heading: 'En qué se diferencia de la HRV clínica',
        body: 'Las medidas clínicas de HRV, como RMSSD y SDNN, se calculan a partir del tiempo exacto entre latidos individuales y se expresan en milisegundos. Aquí la app no recibe los intervalos entre latidos, así que este número no es RMSSD ni SDNN y no se puede comparar con valores en ms de otras apps o estudios. El gráfico de HRV de 7 días en la pantalla de Inicio es distinto: usa la HRV de Apple Health (SDNN, en ms) registrada por tu Apple Watch.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Más alto', text: 'Más movimiento de la frecuencia cardíaca. La respiración lenta y profunda suele elevarlo, porque la frecuencia cardíaca sube en cada inhalación y baja en cada exhalación. Moverte o hablar también lo elevan.' },
          { label: 'Más bajo', text: 'La frecuencia cardíaca se mantuvo plana. Puede significar que estás muy quieto o que respiras rápido y superficialmente.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: 'Mezcla los cambios relacionados con la respiración con cualquier otro cambio (movimiento, ruido), así que compáralo solo en condiciones similares: la misma postura y la misma hora del día. ' + SOURCE_NOTE,
      },
      {
        highlight: 'Para las tendencias diarias de HRV, usa el gráfico de Apple Health en la pantalla de Inicio. Usa este número para ver cómo responde tu frecuencia cardíaca mientras respiras.',
      },
    ],
  },
  energy: {
    key: 'energy',
    title: 'Energía % (experimental)',
    shortTitle: '🔋 Energía %',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una puntuación de 0 a 100 % que sube cuando tu frecuencia cardíaca y tu actividad están en tu nivel habitual o por debajo y el ritmo respiratorio en la frecuencia cardíaca es claro. Es más o menos la imagen inversa de Estrés %. No mide calorías, forma física ni una "batería".',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'El 60 % depende de cuánto está tu frecuencia cardíaca actual por debajo de tu promedio personal en curso (una curva en S suave, así que cerca del promedio da aproximadamente la mitad), el 30 % de lo baja que es tu actividad actual frente a su promedio y el 10 % de lo claro que es el ritmo respiratorio en tu frecuencia cardíaca. Se actualiza cada 2 segundos.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Más alto', text: 'Frecuencia cardíaca y actividad en tu nivel habitual o por debajo.' },
          { label: 'Más bajo', text: 'Frecuencia cardíaca y actividad por encima de tu nivel habitual, por ejemplo después de moverte, de un café o en momentos de tensión.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: HEURISTIC_NOTE + ' Tu "nivel habitual" se aprende mientras la app está en uso, así que los primeros minutos tras abrirla son menos fiables.',
      },
      {
        highlight: 'Energía % refleja este momento, no todo tu día. Cómo has dormido y cómo te sientes importan más.',
      },
    ],
  },
  stress: {
    key: 'stress',
    title: 'Estrés % (experimental)',
    shortTitle: '⚡ Estrés %',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una puntuación de 0 a 100 % que sube cuando tu frecuencia cardíaca y tu actividad están por encima de tu nivel habitual y el ritmo respiratorio en la frecuencia cardíaca es débil. Refleja activación física, no estrés psicológico.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'El 60 % depende de cuánto supera tu frecuencia cardíaca actual a tu promedio personal en curso (una curva en S suave, así que cerca del promedio da aproximadamente la mitad), el 30 % de lo alta que es tu actividad actual frente a su promedio y el 10 % de lo débil que es el ritmo respiratorio en tu frecuencia cardíaca. Se actualiza cada 2 segundos.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Más alto', text: 'Frecuencia cardíaca y actividad por encima de tu nivel habitual. Puede ser estrés, o caminar, hablar, la cafeína o el calor.' },
          { label: 'Más bajo', text: 'Frecuencia cardíaca y actividad en tu nivel habitual o por debajo.' },
        ],
      },
      {
        heading: 'Qué influye',
        body: 'Todo lo que eleva la frecuencia cardíaca: movimiento, postura, cafeína, alcohol, enfermedad, temperatura y emociones. Estar quieto y respirar de forma lenta y cómoda suele bajarlo.',
      },
      {
        heading: 'Limitaciones',
        body: HEURISTIC_NOTE + ' Tu "nivel habitual" se aprende mientras la app está en uso, así que los primeros minutos tras abrirla son menos fiables.',
      },
      {
        highlight: 'Durante una práctica, observa la dirección más que el número exacto.',
      },
    ],
  },
  br: {
    key: 'br',
    title: 'Frecuencia respiratoria (estimación)',
    shortTitle: '🌬️ /min — Frecuencia respiratoria',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Una estimación de cuántas respiraciones haces por minuto, mostrada con un decimal (por ejemplo, 12,4 /min). La app muestra valores entre 6 y 30 respiraciones por minuto.',
      },
      {
        heading: 'Cómo lo calcula la app',
        body: 'Tu frecuencia cardíaca se acelera un poco de forma natural al inhalar y se frena al exhalar (arritmia sinusal respiratoria). La app analiza los últimos ~45 segundos de frecuencia cardíaca y busca el ritmo más marcado entre 6 y 30 ciclos por minuto; ese ritmo se toma como tu frecuencia respiratoria. El valor mostrado se suaviza durante unos 10 segundos para que no parpadee. No se usa el micrófono ni ningún sensor en el pecho.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'Típico en reposo', text: 'Los adultos suelen respirar unas 12–20 veces por minuto en reposo.' },
          { label: 'Respiración lenta', text: 'Durante una práctica de respiración lenta, la estimación debería bajar, a menudo hacia 6–10 /min.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: 'Como se deduce de la frecuencia cardíaca, necesita que estés bastante quieto, tarda unos segundos en ajustarse cuando cambias de ritmo y puede fallar cuando el efecto de la respiración sobre tu frecuencia cardíaca es débil (respiración rápida y superficial, movimiento o pocas muestras de frecuencia cardíaca). ' + SOURCE_NOTE,
      },
      {
        highlight: 'La respiración es la única parte de este sistema que puedes cambiar a propósito. Hazla más lenta y observa cómo responden los demás números.',
      },
    ],
  },
  bpm: {
    key: 'bpm',
    title: 'BPM: ritmo cardíaco',
    shortTitle: '❤️ BPM — Ritmo cardíaco',
    sections: [
      {
        heading: 'Qué muestra este número',
        body: 'Tu frecuencia cardíaca actual en latidos por minuto, según la lectura más reciente de tu Apple Watch / Apple Health o de una banda de frecuencia cardíaca Bluetooth conectada.',
      },
      {
        heading: 'Cómo lo obtiene la app',
        body: 'La app no calcula la frecuencia cardíaca por sí misma: muestra el valor más reciente de tu dispositivo y lo registra aproximadamente una vez por segundo. Todos los demás números de esta pantalla se calculan a partir de estas lecturas.',
      },
      {
        heading: 'Cómo interpretarlo',
        bullets: [
          { label: 'En reposo', text: 'Para la mayoría de los adultos, una frecuencia cardíaca en reposo de aproximadamente 60 a 100 bpm se considera normal; las personas en buena forma física suelen tenerla más baja.' },
          { label: 'Cambios', text: 'La frecuencia cardíaca sube con el movimiento, al ponerte de pie, al hablar, con la cafeína, el calor y el estrés, y baja cuando estás quieto y respiras despacio.' },
        ],
      },
      {
        heading: 'Limitaciones',
        body: 'La precisión depende del dispositivo y de cómo se ajusta: una correa de reloj floja o el movimiento pueden dar lecturas erróneas. El Apple Watch puede actualizarse con menos frecuencia cuando no hay ningún entrenamiento ni práctica en curso.',
      },
      {
        highlight: HEALTH_NOTE,
      },
    ],
  },
}
