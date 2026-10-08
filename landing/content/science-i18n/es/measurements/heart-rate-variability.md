---
sourceHash: "20e5cd0bc337"
title: "¿Puedes fiarte de la HRV de un reloj o un anillo inteligente?"
metaTitle: "HRV en wearables: ¿puedes fiarte de un reloj o anillo?"
metaDescription: "La HRV de un reloj o anillo inteligente se estima a partir del pulso, no es un ECG. Dónde coincide, dónde difiere y cómo leer tus números."
shortAnswer: >
  La HRV de un wearable puede ser útil, pero no es automáticamente la medición
  que daría un ECG. La mayoría de los relojes y anillos inteligentes estiman la
  variabilidad latido a latido a partir de una señal óptica del pulso. La
  evidencia muestra una buena concordancia con el ECG para algunas medidas en
  condiciones controladas de reposo, y límites claros con el movimiento, entre
  métricas y entre dispositivos. El uso más sólido es una tendencia personal
  constante, no un número intercambiable universalmente.
keyPoints:
  - "El ECG y la PPG miden señales distintas: el ECG registra la actividad eléctrica del corazón, mientras que la PPG estima el momento de cada latido a partir de las ondas del pulso en la piel."
  - "La variabilidad del pulso derivada de la PPG puede coincidir bien con la HRV derivada del ECG para algunas métricas en condiciones controladas de reposo; la concordancia es condicional, no universal."
  - "El movimiento, el contacto del sensor, la perfusión periférica, la ventana de registro, la métrica elegida y el procesamiento propietario moldean los números de HRV de un wearable."
  - "Dos dispositivos pueden mostrar legítimamente valores de HRV distintos sin que ninguno se equivoque; puede que no informen de la misma métrica ni de ventanas comparables."
  - "RMSSD y SDNN resumen propiedades distintas de un registro, y sus números no son intercambiables."
  - "Tu propia tendencia, medida de forma constante con el mismo dispositivo y el mismo método, suele ser más informativa que comparar valores absolutos entre dispositivos."
  - "La HRV es una medición fisiológica, no un diagnóstico; una sola lectura baja o alta no demuestra nada por sí misma."
imageAlt: "Un trazado de ECG sobre una onda de pulso más suave, con líneas discontinuas que emparejan cada latido; un tramo borroso y ruidoso de la onda de pulso muestra dónde la estimación óptica pierde el rastro."
evidenceMap:
  - claim: "El método de referencia para medir los intervalos de la HRV es el ECG, que cronometra los picos R eléctricos del corazón."
    limitation: "Una convención metodológica para la medición de intervalos; no significa que el seguimiento cotidiano requiera un ECG clínico."
  - claim: "Los wearables estiman la variabilidad latido a latido a partir de la señal del pulso periférico: la PPG deduce el momento de los pulsos en la piel a partir de los cambios del volumen sanguíneo, en lugar de registrar la actividad eléctrica del corazón."
    limitation: "Describe la cadena de señal común a los sensores de muñeca y de anillo; no dice nada sobre la precisión de ningún producto."
  - claim: "La HRV derivada del ECG y la PRV derivada de la PPG están relacionadas, pero no son fisiológicamente idénticas: el tiempo de tránsito del pulso, el tono vascular, la circulación periférica, los artefactos de movimiento, el contacto del sensor, las propiedades ópticas de la piel y los algoritmos de procesamiento pueden alejar un valor basado en el pulso de su equivalente eléctrico."
    limitation: "Una distinción fisiológica y metodológica; el tamaño de la diferencia depende de la persona, del lugar de medición y de las condiciones."
  - claim: "Una revisión sistemática con metaanálisis comparó la PRV derivada de la PPG con la HRV derivada del ECG en poblaciones no clínicas sanas o aparentemente sanas, centrándose en RMSSD y SDNN."
    limitation: "Define el alcance de la evidencia agrupada: poblaciones no clínicas; las poblaciones clínicas quedan fuera."
  - claim: "Donde los datos pudieron agruparse, el metaanálisis encontró errores estandarizados relativamente pequeños tanto para RMSSD como para SDNN."
    limitation: "Una medida estadística de concordancia, no un porcentaje de precisión de ningún producto; los datos agrupados procedían sobre todo de condiciones de reposo o controladas."
  - claim: "La solidez de los resultados agrupados difirió según la métrica: los análisis de sensibilidad respaldaron los resultados de RMSSD, mientras que las estimaciones de SDNN fueron estables en su dirección pero menos sólidas estadísticamente."
    limitation: "Se refiere a estimaciones agrupadas, no a dispositivos concretos; pocos estudios contribuyeron al conjunto de cada métrica."
  - claim: "Las estimaciones agrupadas de concordancia se apoyan en una base cuantitativa pequeña, procedente sobre todo de condiciones de reposo o controladas, y no deben generalizarse al sueño, el ejercicio, el estrés o la vida cotidiana, ni interpretarse como prueba de que sean intercambiables."
    limitation: "Un límite trazado por los propios autores de la revisión sobre las estimaciones agrupadas; no descarta un buen rendimiento de un dispositivo concreto en un entorno concreto."
  - claim: "En condiciones controladas de reposo, la PPG de muñeca reprodujo los índices de HRV derivados del ECG con la suficiente aproximación como para que los autores respaldaran parámetros seleccionados para la evaluación a corto plazo."
    limitation: "Un solo dispositivo de muñeca en adultos en reposo con ritmo sinusal; tres de los doce coautores están afiliados al fabricante del dispositivo (el artículo declara no tener conflictos de intereses); los propios autores piden más validación en condiciones reales."
  - claim: "La concordancia con el ECG depende de la métrica: en la validación controlada, las métricas de variabilidad a corto plazo y de entropía coincidieron peor que las medidas basadas en intervalos."
    limitation: "Un solo estudio, un solo dispositivo; qué métricas coinciden mejor depende del dispositivo y de las condiciones."
  - claim: "La calidad de la señal condiciona la medición: en la validación controlada, los pares de registros con mala calidad de ECG o de PPG —baja perfusión o artefactos de movimiento— se excluyeron del análisis."
    limitation: "Filtrado propio de una validación; los dispositivos de consumo aplican sus propios filtros de calidad, en su mayoría no documentados, durante el uso cotidiano."
  - claim: "La señal de entrada, la duración del registro, el entorno, la respiración y el enfoque analítico influyen en el rigor, la fiabilidad y la interpretación de una medición de HRV."
    limitation: "Consenso de expertos sobre métodos; la magnitud de cada efecto depende de las condiciones y de la persona."
  - claim: "Los resultados de la HRV de wearables, también en investigación, deben interpretarse y contextualizarse dentro de las limitaciones del método."
    limitation: "Una guía de interpretación, no datos de resultados; su extensión cotidiana es comparar lo comparable: el mismo dispositivo, la misma métrica, condiciones similares."
  - claim: "Numerosos factores experimentales, demográficos y ambientales influyen en la evaluación, la interpretación y la fiabilidad de la HRV; una de las razones por las que una diferencia entre dispositivos no es automáticamente un error."
    limitation: "Consenso de expertos sobre las muchas piezas móviles de una medición; la combinación concreta de causas difiere para cada par de dispositivos y condiciones."
  - claim: "RMSSD y SDNN resumen propiedades distintas de un registro —los cambios latido a latido frente a la dispersión global—, y el RMSSD depende más de la modulación parasimpática que el SDNN."
    limitation: "Una comparación relativa entre las dos métricas; la duración del registro añade otra razón por la que sus valores divergen."
  - claim: "La duración del registro cambia lo que significa un valor: los registros más largos acumulan ritmos más lentos y valores de tipo SDNN mayores, así que los valores de ventanas distintas no son comparables."
    limitation: "Una propiedad de la métrica; se aplica por igual a las comparaciones entre apps, estudios y rutinas nocturnas."
  - claim: "Apple Health registra la HRV como SDNN, calculado como la desviación estándar de los intervalos entre latidos normales y registrado automáticamente por el Apple Watch."
    limitation: "Documentación oficial; describe lo que registra el sistema, no lo que los valores significan para la salud; limitado al ecosistema de Apple."
  - claim: "Los modelos recientes de Apple Watch con watchOS muestran dos variantes de HRV —Recovery HRV y Overall HRV— y miden la HRV con una frecuencia de hasta cada cinco minutos."
    limitation: "Anuncio del fabricante limitado a hardware y versiones del sistema concretos; Apple no ha explicado cómo se calcula Recovery HRV."
  - claim: "iOS y watchOS añaden un tipo de dato RMSSD a Apple Health."
    limitation: "Documentación oficial; la disponibilidad se limita a versiones concretas del sistema, y lo que cada app registra con este tipo depende de la app."
  - claim: "La HRV no es una lectura directa del tono vagal ni del equilibrio simpático-parasimpático."
    limitation: "Cautela metodológica de la literatura de estándares y guías; la HRV refleja cambios de la frecuencia cardíaca mediados por el vago, no la actividad del propio nervio."
  - claim: "Un solo valor bajo o alto no demuestra por sí mismo estrés, enfermedad ni estado de salud."
    limitation: "Se refiere a la interpretación, no a la precisión de la medición; los cambios persistentes con síntomas preocupantes son asunto de un profesional sanitario."
---

## ¿Qué es la HRV de un wearable?

Cuando un reloj o un anillo inteligente muestra un número de HRV, está mostrando una estimación de la [variabilidad de la frecuencia cardíaca](/glossary/heart-rate-variability) (HRV o VFC), la variación natural del tiempo entre latidos consecutivos. La estimación suele construirse a partir de una señal óptica del pulso y no de la actividad eléctrica del corazón, y ese único hecho está detrás de la mayor parte de la confusión, de la mayor parte del marketing y de la mayoría de las preguntas honestas sobre lo que significa el número.

Esta página responde a la pregunta de método que hay debajo de las cotidianas. Por qué dos dispositivos no coinciden es una historia práctica que se cuenta en [por qué tu HRV es distinta en cada dispositivo](/articles/hrv-different-every-device); qué son las dos variantes del reloj de Apple se explica en [Recovery HRV frente a Overall HRV en el Apple Watch](/articles/apple-watch-recovery-hrv-vs-overall-hrv); qué hacer ante una lectura baja corresponde a [por qué la HRV de mi Apple Watch es baja](/articles/why-is-my-apple-watch-hrv-low); y mantener comparables tus propias lecturas es tarea de [cómo medir la HRV en condiciones comparables](/articles/how-to-measure-hrv-consistently). Aquí la pregunta es: ¿hasta qué punto puede un sensor en la muñeca o en el dedo reproducir lo que mediría un ECG clínico, y qué implica la respuesta para cómo lees tus números?

En esta página hay que mantener separados tres términos, porque mezclarlos es donde empieza la mayor parte de las exageraciones. Un valor de HRV derivado del ECG, un valor de variabilidad del pulso derivado de la PPG y una puntuación propietaria de un wearable calculada a partir de la HRV y de otras señales son mediciones relacionadas, no una sola medición [S3]. Pueden seguirse de cerca, pero la señal, el procesamiento y el significado difieren en cada paso.

La respuesta breve: la HRV de un wearable puede ser útil, pero su utilidad es condicional: depende de la métrica, de las condiciones y de con qué la compares.

## ¿Cómo funciona la HRV de un wearable?

Dos cadenas de medición parten de dos señales distintas.

La cadena de referencia es eléctrica. Un ECG registra la actividad eléctrica del corazón, y el pico R, nítido, de cada latido ofrece una referencia temporal precisa; la HRV se calcula a partir de los intervalos entre latidos normales sucesivos [S1, S4]. La cadena del wearable es óptica. Un sensor de fotopletismografía (PPG) proyecta luz en la piel y sigue los pequeños cambios del volumen sanguíneo que cada latido envía por la circulación periférica; el software localiza los picos repetidos del pulso y estima el tiempo entre ellos [S3]. La variabilidad calculada a partir de esos intervalos del pulso suele llamarse variabilidad del pulso (PRV).

En resumen: ECG → picos eléctricos → intervalos entre latidos → HRV. Y: PPG → picos del pulso en la piel → intervalos entre pulsos → PRV.

Cada latido acaba produciendo una onda de pulso, así que las dos cadenas están estrechamente relacionadas. Pero el pulso tiene que viajar hasta el lugar de medición, y lo que ocurre por el camino —el tiempo de tránsito del pulso, el tono vascular, la circulación periférica—, junto con los artefactos de movimiento, el contacto del sensor, las propiedades ópticas de la piel y el procesamiento de la señal del dispositivo, puede alejar un valor basado en el pulso de su equivalente eléctrico [S3]. Por tanto, un sensor de muñeca o de anillo no es un electrodo de ECG más pequeño. Observa una señal relacionada y hace una estimación a partir de ella, y la calidad de esa estimación depende de las condiciones.

Por eso también la pregunta «¿es preciso este sensor?» está incompleta. La versión basada en la evidencia pregunta: ¿preciso para qué métrica, en qué persona, en qué condiciones y con qué procesamiento? Las secciones siguientes abordan esas piezas una a una.

## ¿Cómo se mide la HRV de un wearable?

Cada valor de HRV de un wearable es el resultado final de una cadena de decisiones, y dos números solo son comparables en la medida en que esas decisiones coinciden. Cinco preguntas permiten descifrar cualquier número de HRV que veas:

- **¿Qué señal se midió?** Un ECG clínico, una banda de pecho que detecta la actividad eléctrica o un sensor óptico de PPG en la muñeca o en el dedo: la señal determina de qué es estimación el valor [S1, S4].
- **¿Qué métrica se calculó?** Un dispositivo puede usar una métrica y otro, otra. {{fact:hrv.rmssd.definition}} [S1]. {{fact:hrv.sdnn.definition}} [S1]. Las dos resumen propiedades distintas del mismo registro —el RMSSD aísla los cambios entre latidos adyacentes; el SDNN, la dispersión global— y dependen en distinta medida de la modulación parasimpática, así que sus números no son intercambiables [S2]. Algunas apps van más allá y muestran una puntuación propietaria de recuperación o de preparación derivada de la HRV y de otras señales; una puntuación no es una métrica, y su cálculo no suele publicarse. Las páginas de concepto de [RMSSD](/science/concepts/rmssd) y [SDNN](/science/concepts/sdnn) analizan cada métrica en detalle.
- **¿Cuándo y cómo se midió?** Una comprobación puntual breve, un registro controlado en reposo y una ventana nocturna son regímenes de medición distintos, y la duración del registro llega a cambiar lo que significa un valor, porque las ventanas más largas acumulan ritmos más lentos y valores de tipo SDNN mayores [S2].
- **¿Qué calidad tenía la señal?** El movimiento, un ajuste flojo y una perfusión periférica débil degradan primero la estimación óptica, y los estudios de validación filtran esos registros antes de calcular nada [S4].
- **¿Miras una tendencia o reaccionas a un número?** Un solo valor es una observación; una serie de valores recogidos de la misma manera es una señal [S5].

El ecosistema de Apple es un ejemplo vivo de la cuestión de la métrica. {{fact:applewatch.hrv.healthkit}} [S6], así que los valores de HRV de Apple Health han sido siempre de tipo SDNN, registrados automáticamente por el Apple Watch. En los modelos recientes, {{fact:applewatch.hrv.variants2026}} [S7]; Apple no ha explicado cómo se calcula Recovery HRV. Por otra parte, {{fact:applewatch.hrv.rmssdType}} [S8]: un cambio de plataforma que permite a las apps escribir un valor de tipo RMSSD en Apple Health, lo que importa cada vez que se compara un número del Apple Watch con un anillo que informa del RMSSD.

Una forma compacta de tenerlo todo presente:

| Situación | Cómo leerla |
|---|---|
| Un dispositivo, una métrica, condiciones similares cada vez | Una base sólida para una tendencia personal |
| Dos dispositivos, dos métricas o ventanas distintas | Los números no son automáticamente comparables |
| Una lectura tomada en movimiento | Cabe esperar que la estimación se degrade; tómala con cautela |
| Un valor inusualmente bajo o alto | Una observación, no un veredicto |
| Un cambio persistente acompañado de síntomas preocupantes | Un cuadro para comentar con un profesional sanitario |

La regla práctica se desprende de la tabla: el mismo dispositivo, la misma métrica, condiciones similares y mediciones repetidas, antes de comparar números absolutos entre dispositivos. Dónde se sitúan tus números respecto a los grupos de edad de la población es otra cuestión, que responden la [calculadora de HRV](/tools/hrv) y el artículo [HRV normal por edad](/articles/normal-hrv-by-age), y que no se repite aquí.

## ¿Qué influye en la HRV de un wearable?

- **El movimiento y el ejercicio.** El movimiento distorsiona la señal óptica, y el ejercicio cambia a la vez la fisiología y el entorno de medición; por eso los estudios en reposo controlado parecen más limpios que los datos de la vida cotidiana [S4].
- **El ajuste del sensor y la perfusión.** Una correa floja o una piel fría y mal perfundida debilitan la señal del pulso de la que depende el algoritmo [S4].
- **La ventana de registro y la hora del día.** Una muestra diurna breve y un promedio nocturno describen regímenes distintos; sus valores no son intercambiables [S2, S5].
- **La métrica y el procesamiento.** RMSSD y SDNN responden a preguntas distintas sobre el mismo registro [S2], y el filtrado, la interpolación y el tratamiento de artefactos de cada fabricante moldean el número final [S3].
- **La respiración y la postura.** La frecuencia y la profundidad de la respiración durante la ventana quedan escritas en el valor [S5].
- **El cambio de dispositivo.** Pasar de un dispositivo a otro también puede mover la línea base personal: es un cambio de régimen de medición, no de fisiología [S3].

## ¿Qué muestra la evidencia?

**Establecido.** El ECG es el método de referencia para medir los intervalos latido a latido [S1, S4], y las cadenas de señal se conocen bien: la PPG estima el momento de los latidos a partir de las ondas del pulso periférico [S3], y la PRV está relacionada con la HRV derivada del ECG, pero no es fisiológicamente idéntica a ella [S3]. Las propiedades de las propias métricas están igual de asentadas: RMSSD y SDNN resumen aspectos distintos de un registro [S2], y la duración del registro cambia lo que significa un valor [S2].

**Depende del contexto.** La evidencia más reciente aborda directamente la pregunta del consumidor. Una revisión sistemática con metaanálisis (Xu et al., 2026) comparó la PRV derivada de la PPG con la HRV derivada del ECG en poblaciones no clínicas sanas o aparentemente sanas [S3]. Su síntesis cualitativa abarcó {{fact:study.xu2026.studiesQualitative}}, pero solo {{fact:study.xu2026.studiesPooled}} aportaron datos suficientemente comparables para agruparlos cuantitativamente. Donde los datos pudieron agruparse, los errores estandarizados para RMSSD y SDNN fueron relativamente pequeños, aunque los análisis de sensibilidad respaldaron con más fuerza los resultados de RMSSD que las estimaciones de SDNN [S3]. El límite que trazan los propios autores importa más que las cifras agrupadas: la síntesis cuantitativa se apoyó en pocos estudios, realizados sobre todo en condiciones de reposo o controladas, y las estimaciones agrupadas no deben generalizarse al sueño, el ejercicio, el estrés o la vida cotidiana, ni interpretarse como prueba de que sean intercambiables [S3].

Un estudio de validación controlado (Zuern et al., 2026) registró a {{fact:study.zuern2026.participants}} con ritmo sinusal, con un ECG clínico y un sensor de PPG de muñeca funcionando a la vez [S4]. En condiciones controladas de reposo, la PPG de muñeca reprodujo los índices derivados del ECG con la suficiente aproximación como para que los autores respaldaran parámetros seleccionados para la evaluación a corto plazo, aunque pidieron más validación en condiciones reales [S4]. La concordancia dependió de la métrica: fue más débil para las métricas de variabilidad a corto plazo y de entropía que para las medidas basadas en intervalos [S4], y los registros con mala calidad de señal —baja perfusión, artefactos de movimiento— se excluyeron antes del análisis [S4]. Ese mismo filtrado es justo aquello con lo que no se puede contar en el uso cotidiano.

Los datos del ecosistema de Apple tienen su sitio aquí como datos del dispositivo: Apple Health guarda la HRV como SDNN [S6], los modelos recientes del reloj ofrecen dos variantes de HRV [S7], y la plataforma ahora también admite un valor de tipo RMSSD [S8]; son afirmaciones acotadas sobre lo que se registra, no sobre la salud.

**Guía / consenso de expertos.** Las guías actuales afirman que la señal de entrada, la duración del registro, el entorno, la respiración y el enfoque analítico influyen en el rigor y la fiabilidad [S5], y que los resultados de la HRV de wearables, también en investigación, deben interpretarse y contextualizarse dentro de esas limitaciones [S5]. Su extensión cotidiana es comparar lo comparable.

**Desconocido.** Hasta qué punto estos métodos se generalizan a la variedad de dispositivos de consumo y algoritmos propietarios; cómo funcionan con el movimiento libre del día a día y en ventanas nocturnas que cada dispositivo define de forma distinta; cómo se comportan en personas con arritmias o con determinadas afecciones; y cuándo un cambio detectado por un wearable pasa a ser clínicamente relevante. Nada de esto está resuelto, y es un motivo para entender la medición, no para descartar los datos.

## Lo que la HRV de un wearable no te dice

- **No es una lectura de ECG.** Un valor basado en la PPG es una estimación a partir de una señal relacionada, y la concordancia agrupada no se extiende a todos los entornos ni equivale a que sean intercambiables [S3].
- **No es un número universal.** RMSSD, SDNN y las puntuaciones propietarias describen cosas distintas; un valor sin su métrica y su ventana es información incompleta [S2, S3].
- **No es un diagnóstico ni un veredicto sobre el estrés.** {{fact:claim.hrvNotStress}} [S1, S5], y la misma cautela se aplica a los valores inusualmente altos.
- **No es el tono vagal.** El encuadre importa. {{fact:claim.vagalTone}} [S1, S5].
- **No es una clasificación de dispositivos.** La concordancia depende de la métrica, las condiciones, la calidad de la señal y el procesamiento [S3, S4]; qué dispositivo te conviene es asunto de las reseñas de productos, y esta página no nombra a propósito ningún monitor como «el más preciso».
- **Un solo valor dice poco.** Las guías metodológicas piden una interpretación contextualizada [S5]; tus propias lecturas recientes en condiciones comparables son la comparación más informativa.

## En ONDA

ONDA se sitúa en el lado de los dispositivos de consumo de esta evidencia, y su documentación explica con claridad de dónde sale cada número. La línea base personal nocturna se construye con los valores de HRV que se escriben en Apple Health —desde el Apple Watch o desde cualquier otro dispositivo cuya app sincronice allí los datos cardíacos—, y esos valores son de tipo SDNN. {{fact:applewatch.hrv.healthkit}} [S6]. La lectura en directo que se muestra durante una práctica es un sustituto calculado a partir de la desviación estándar de la frecuencia cardíaca, no RMSSD ni SDNN; la cámara del teléfono da el pulso, no la HRV; y la puntuación de coherencia disponible con el Apple Watch es una puntuación propietaria de retroalimentación, no una medición clínica de la HRV. ONDA usa la señal para biofeedback: la pregunta no es solo cuál es el número, sino qué le ocurre mientras practicas. Compara cada noche con tu propio corredor reciente y no diagnostica nada. Consulta [qué mide ONDA](/measurements).

> Información educativa, no un diagnóstico ni un tratamiento médico.
