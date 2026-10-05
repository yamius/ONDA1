---
sourceHash: "f848794fbee9"
title: "SDNN: qué mide esta métrica de HRV y qué no"
metaTitle: "SDNN: definición, significado y Apple"
metaDescription: "El SDNN es la métrica de HRV que guarda Apple Health. Qué mide, en qué se diferencia del RMSSD y por qué los dos números no se pueden comparar."
shortAnswer: >
  El SDNN es una métrica de la variabilidad de la frecuencia cardíaca: la
  desviación estándar de los intervalos entre latidos normales. Se usa para
  resumir la dispersión global del ritmo cardíaco a lo largo de un registro y
  crece con la duración del registro, así que los valores de distintos
  dispositivos, apps y regímenes de registro no son directamente comparables.
  Es la métrica que guarda Apple Health. Por sí solo no demuestra estrés,
  estado de salud ni equilibrio autónomo.
keyPoints:
  - "El SDNN resume la dispersión global de los intervalos entre latidos normales dentro de un registro."
  - "Refleja la variabilidad total: contribuyen a él las dos ramas del sistema nervioso autónomo y los ritmos más lentos."
  - "El SDNN depende de la duración del registro, así que las lecturas breves de laboratorio, los valores de Holter de todo el día y los números nocturnos de un reloj no son intercambiables."
  - "Apple Health guarda la HRV como SDNN; por eso los números del Apple Watch no pueden compararse directamente con los números de RMSSD de otros wearables."
  - "Los wearables estiman el SDNN a partir de la señal del pulso, y su concordancia con el ECG depende del dispositivo y de las condiciones."
  - "Un solo valor de SDNN no es un diagnóstico ni una lectura de estrés; tu propia tendencia en condiciones comparables es más informativa."
imageAlt: "Una fila de intervalos entre latidos de distinta duración sobre una distribución de puntos de esos intervalos, con un corchete turquesa que marca su dispersión alrededor del promedio: la idea que resume el SDNN."
evidenceMap:
  - claim: "El SDNN es la desviación estándar de los intervalos entre latidos normales a lo largo de un registro."
    limitation: "Un estándar de definición y metodológico; por sí solo no dice nada sobre el estado de salud."
  - claim: "«Normal» significa que los latidos anómalos y ectópicos se eliminan antes de calcular el estadístico."
    limitation: "Describe la limpieza de datos; el rigor con que se filtran los latidos difiere entre algoritmos y dispositivos."
  - claim: "El SDNN refleja todos los componentes cíclicos responsables de la variabilidad durante el registro; resume la variabilidad total, no una sola rama del sistema nervioso autónomo."
    limitation: "Una propiedad del estadístico; la mezcla de ritmos cambia con la duración y las condiciones del registro."
  - claim: "El SDNN depende de la duración del registro: los registros más largos incorporan ritmos más lentos y producen valores mayores, así que no se pueden comparar valores de SDNN de registros de distinta duración."
    limitation: "Una propiedad metodológica de la métrica; afecta a cualquier comparación entre apps, estudios y protocolos."
  - claim: "Los valores normativos de HRV de todo el día, de corta duración y de ultracorta duración no son intercambiables."
    limitation: "Se refiere a valores normativos en poblaciones sanas y clínicas; los valores nocturnos de consumo son otro contexto distinto."
  - claim: "Las dos ramas del sistema nervioso autónomo contribuyen al SDNN, que está estrechamente relacionado con las bandas de frecuencia más lentas y con la potencia total."
    limitation: "Razonamiento fisiológico a nivel poblacional; el reparto de las contribuciones cambia con las condiciones del registro."
  - claim: "Los registros más largos incorporan ritmos más lentos —cambios de carga, condicionamiento y procesos circadianos— y cada uno aumenta la dispersión."
    limitation: "Explica por qué importa la duración de la ventana, no lo que una ventana concreta dice de una persona."
  - claim: "El RMSSD está más influido por la rama parasimpática que el SDNN; por eso las dos métricas pueden moverse de forma distinta."
    limitation: "Una comparación relativa entre métricas, no una medida de la actividad parasimpática en ninguna de ellas."
  - claim: "El tono vagal no puede medirse directamente, y la HRV no es un marcador específico de la actividad simpática ni del equilibrio simpático-vagal."
    limitation: "Una cautela metodológica de guías y revisiones; los valores de SDNN no se traducen en lecturas del sistema nervioso autónomo."
  - claim: "En cardiología clínica, el SDNN calculado a partir de registros de ECG de todo el día es una medida de estratificación del riesgo en poblaciones de pacientes."
    limitation: "Poblaciones clínicas con ECG hospitalario continuo; no se traslada a los valores de un reloj de consumo."
  - claim: "En registros breves en reposo, la fuente dominante de la variación del SDNN es la oscilación de la frecuencia cardíaca ligada a la respiración."
    limitation: "Se aplica a la ventana de registro; es una observación de medición, no una prueba de un cambio duradero."
  - claim: "Las estimaciones de HRV de los wearables basadas en PPG coinciden con los valores derivados del ECG en algunas condiciones y se apartan en otras; las estimaciones agrupadas no prueban que sean intercambiables."
    limitation: "La concordancia depende de la métrica, el dispositivo y las condiciones; esta página no da cifras de precisión."
  - claim: "En condiciones controladas de reposo, la PPG de muñeca puede reproducir de cerca los índices de HRV derivados del ECG, mientras que la validación en la vida real sigue siendo limitada."
    limitation: "Validación de un solo dispositivo en adultos en reposo con ritmo sinusal; no es una afirmación general sobre la precisión de los relojes de consumo."
  - claim: "Apple Health registra la HRV como SDNN, calculado como la desviación estándar de los intervalos entre latidos normales y registrado automáticamente por el Apple Watch."
    limitation: "Documentación oficial; describe lo que registra el sistema, no lo que los valores significan para la salud; limitado al ecosistema de Apple."
  - claim: "Los modelos recientes de Apple Watch con watchOS muestran dos variantes de HRV —Recovery HRV y Overall HRV— y miden la HRV con una frecuencia de hasta cada cinco minutos."
    limitation: "Anuncio del fabricante; limitado a hardware y versiones del sistema concretos; Apple no ha explicado cómo se calcula Recovery HRV."
  - claim: "iOS y watchOS añaden un tipo de dato RMSSD a Apple Health."
    limitation: "Documentación oficial; disponibilidad limitada a versiones concretas del sistema; lo que cada app registra con este tipo depende de la app."
  - claim: "En promedio, la variabilidad de la frecuencia cardíaca disminuye con la edad en adultos sanos, mientras que entre personas varía mucho."
    limitation: "Promedios poblacionales transversales; gran variación individual a cualquier edad; esta página no incluye tablas por edad."
  - claim: "La duración del registro, el entorno, la respiración y el método de análisis moldean el valor y el rigor de su interpretación."
    limitation: "Consenso de expertos sobre métodos; la magnitud de cada efecto depende de las condiciones y de la persona."
  - claim: "Una lectura aislada requiere una interpretación prudente y en contexto."
    limitation: "Consenso de expertos sobre la práctica de interpretación, no datos experimentales directos; comparar con tu propia tendencia en condiciones comparables es su extensión práctica."
  - claim: "Los latidos anómalos y el ruido pueden hacerse pasar por variabilidad e inflar el valor."
    limitation: "Una advertencia sobre la calidad de los datos; el tratamiento de artefactos difiere entre dispositivos y algoritmos."
---

## ¿Qué es el SDNN?

El SDNN es una de las medidas estándar de la [variabilidad de la frecuencia cardíaca](/glossary/heart-rate-variability) (HRV o VFC), la variación natural del tiempo entre latidos consecutivos. Los estándares de medición del campo lo definen con precisión. {{fact:hrv.sdnn.definition}} [S1]. Las letras «NN» del nombre significan «de normal a normal»: solo cuentan los intervalos entre latidos normales, y los latidos anómalos se eliminan antes de calcular el estadístico [S2].

Dicho de forma sencilla: reúne todos los intervalos entre latidos normales adyacentes de un registro, mira cuánto se dispersan alrededor de su promedio y expresa esa dispersión en un único valor en milisegundos. Un valor mayor significa que, en conjunto, el ritmo varió más dentro de esa ventana.

Lo más habitual es compararlo con una segunda métrica del dominio del tiempo. {{fact:hrv.rmssd.definition}} [S1]. Las dos responden a preguntas distintas: el RMSSD aísla los cambios entre latidos adyacentes, mientras que el SDNN resume la dispersión de todo el registro. Esa diferencia es la razón por la que los números de SDNN y de RMSSD no se pueden comparar directamente, y también la razón por la que existen ambas métricas. La [página del RMSSD](/science/concepts/rmssd) trata la parte latido a latido de la pareja; esta página trata de la dispersión.

## ¿Cómo funciona el SDNN?

El SDNN es un estadístico de ventana: todo lo que mueve el ritmo cardíaco durante el registro contribuye a él. En un registro breve en reposo, la contribución dominante es la subida y bajada de la frecuencia cardíaca ligada a la respiración —la arritmia sinusal respiratoria—, así que una respiración lenta y tranquila durante la medición eleva visiblemente el valor [S2]. En registros más largos se suman ritmos más lentos: los cambios de carga, las respuestas condicionadas y el ciclo de sueño y vigilia añaden cada uno su propia contribución a la dispersión [S2].

Como tantas influencias se juntan en un solo número, el SDNN no separa las dos ramas del sistema nervioso autónomo: contribuyen ambas [S2]. Por eso tampoco puede leerse como una medida directa de ninguna de ellas. El encuadre importa. {{fact:claim.vagalTone}} [S2, S7]. El RMSSD, al construirse a partir de diferencias entre latidos adyacentes, depende más que el SDNN de la vía parasimpática rápida [S2], una de las razones por las que las dos métricas pueden contar historias distintas sobre el mismo registro.

La versión larga de la métrica tiene un historial clínico: calculado sobre registros de ECG hospitalario de todo el día en pacientes cardiológicos, el SDNN es una medida de estratificación del riesgo [S2]. Esa evidencia pertenece a un régimen de medición —ECG clínico continuo en poblaciones de pacientes— que un reloj de consumo no reproduce, así que no debe proyectarse sobre un valor nocturno del reloj.

## ¿Cómo se mide el SDNN?

El cálculo es sencillo: se toman los intervalos entre latidos normales dentro de la ventana de registro y se calcula su desviación estándar [S1, S2]. Todo lo que sabe el SDNN depende de la precisión de esos intervalos; por eso el método de registro importa más que la aritmética.

El método de referencia es el ECG, que detecta la huella eléctrica de cada latido. Los wearables, en cambio, estiman los intervalos a partir de la señal del pulso en la piel (fotopletismografía, PPG); el resultado suele llamarse variabilidad del pulso (PRV). La concordancia entre ambos depende de la métrica y de las condiciones —en general es mayor en reposo y con buena señal, y menor con movimiento o mal contacto— [S5, S6], y la evidencia agrupada disponible hasta ahora no se extiende al sueño ni a la vida cotidiana [S5].

La duración del registro forma parte del significado del valor. Un registro breve de laboratorio, un ECG Holter de todo el día y las muestras que guarda un reloj son tres regímenes de medición distintos: el SDNN crece con la duración del registro, y los valores de esos regímenes no son intercambiables [S2]. Por la misma razón, las normas publicadas para registros de todo el día, de corta y de ultracorta duración se tratan como mundos separados [S2].

Aquí es donde entra Apple. Una consecuencia práctica para quienes usan Apple Watch: {{fact:applewatch.hrv.healthkit}} [S8]. Es una decisión de diseño, no un veredicto científico sobre qué métrica es mejor: el SDNN es el cálculo que HealthKit ha usado siempre, descrito en la documentación como la desviación estándar de los intervalos entre latidos normales, registrado automáticamente por el reloj [S8]. En el hardware reciente, {{fact:applewatch.hrv.variants2026}} [S9]. Apple no ha explicado cómo se calcula Recovery HRV. Por otra parte, {{fact:applewatch.hrv.rmssdType}} [S10], lo que permite a las apps leer en su lugar un valor de tipo RMSSD desde Apple Health: un paso hacia comparaciones más limpias entre dispositivos, aunque los valores ya recopilados siguen siendo SDNN.

Para ubicarlo en la práctica: la [calculadora de HRV](/tools/hrv) tiene un modo SDNN pensado para los números del Apple Watch; la explicación cotidiana de por qué los dispositivos no coinciden está en [por qué tu HRV es distinta en cada dispositivo](/articles/hrv-different-every-device); y para que tus propias lecturas sean comparables, consulta [cómo medir la HRV en condiciones comparables](/articles/how-to-measure-hrv-consistently).

## ¿Qué influye en el SDNN?

- La duración del registro. Es el factor determinante de esta métrica: las ventanas más largas acumulan ritmos más lentos y valores mayores, así que una lectura breve y un registro de todo el día describen mundos distintos [S2].
- Las condiciones del registro. La duración del registro, el entorno —laboratorio o vida real—, la respiración y el método de análisis moldean el valor y el rigor de cualquier comparación [S7].
- La edad. En promedio, la variabilidad de la frecuencia cardíaca disminuye con la edad en adultos sanos [S4]; entre personas varía mucho, y los promedios poblacionales no son objetivos personales. Las tablas por grupos de edad están en la [calculadora de HRV](/tools/hrv) para los valores de SDNN del Apple Watch y en el artículo [HRV normal por edad](/articles/normal-hrv-by-age) para el RMSSD nocturno.
- La respiración. La frecuencia y la profundidad de la respiración durante el registro cambian el valor, a través de la oscilación ligada a la respiración que dejan escrita en el ritmo [S2].
- La calidad de la señal. Los latidos omitidos o falsos distorsionan el valor, y los latidos anómalos pueden hacerse pasar por variabilidad [S2].
- Las condiciones cotidianas. Como ocurre con otras métricas de HRV, una sola lectura puede desviarse por motivos corrientes; trata esos cambios como observaciones, no como veredictos.

## ¿Qué muestra la evidencia?

Establecido. La definición, el cálculo y el papel del SDNN como medida de la variabilidad global proceden de los estándares de medición del campo [S1] y de revisiones metodológicas [S2, S3]. Su dependencia de la duración del registro es una propiedad metodológica central, no un matiz [S2]. En cardiología clínica, el SDNN de todo el día obtenido con ECG continuo es una medida establecida de estratificación del riesgo en poblaciones de pacientes [S2]. En promedio, los valores disminuyen con la edad en adultos sanos, con una gran variación individual [S4].

Depende del contexto. Estimaciones de los wearables: los valores derivados de la PPG pueden seguir de cerca a la HRV derivada del ECG en condiciones controladas de reposo, pero la concordancia se debilita con el movimiento y una señal pobre, y las estimaciones agrupadas no se generalizan al sueño ni a la vida cotidiana [S5, S6]. El ecosistema de Apple guarda la HRV como SDNN: un dato del dispositivo con su propio alcance, no una afirmación de salud [S8, S9, S10].

Guía / consenso de expertos. Las guías actuales recomiendan condiciones de registro constantes y una interpretación prudente y contextualizada de los valores aislados, también los de los wearables [S7]. Es consenso de expertos sobre cómo medir e interpretar, no datos experimentales directos sobre el SDNN en sí.

Lo que sigue sin estar claro: todavía se está estudiando hasta qué punto los valores nocturnos de tipo SDNN de los dispositivos de consumo siguen al SDNN derivado del ECG en las condiciones cotidianas —movimiento, tono de piel, ajuste del sensor, fases del sueño— [S5, S6]. Y sigue abierta la cuestión de cuánto de la evidencia clínica de todo el día, construida con ECG continuo en pacientes, se traslada a los valores nocturnos de un reloj en usuarios sanos [S7].

## Lo que el SDNN no te dice

- No es intercambiable con el RMSSD. Las dos métricas resumen propiedades distintas del mismo registro, y sus valores pertenecen a regímenes de registro distintos; el SDNN de un reloj y el RMSSD de un anillo no son dos dialectos del mismo número [S2, S5].
- No es un medidor del tono vagal. {{fact:claim.vagalTone}} [S2, S7]. El SDNN depende todavía menos que el RMSSD de la vía parasimpática rápida [S2].
- No es un diagnóstico ni una lectura de estrés. {{fact:claim.hrvNotStress}} [S1].
- Más alto no es automáticamente mejor. Una dispersión mayor puede deberse a un ritmo más marcado, o a latidos anómalos y ruido, que se hacen pasar por variabilidad e inflan el número [S2].
- Los valores no son intercambiables entre dispositivos, apps y regímenes de medición [S5, S7].
- Un solo valor dice poco. Las guías metodológicas consideran que las lecturas aisladas dependen del contexto y recomiendan una interpretación prudente y contextualizada [S7]; tus propias lecturas recientes en condiciones comparables son la comparación más informativa.

## En ONDA

Las tablas de HRV por edad de ONDA son tablas de RMSSD nocturno, pero la [calculadora de HRV](/tools/hrv) tiene un modo SDNN aparte para los números del Apple Watch, con rangos procedentes de estudios de ECG breves en reposo en adultos sanos. La línea base personal nocturna de la propia app se construye con los valores de HRV guardados en Apple Health, ya sea desde el Apple Watch o desde otro dispositivo que sincronice allí los datos cardíacos. La documentación lo dice con claridad. {{fact:applewatch.hrv.healthkit}} [S8], así que esa señal de base se apoya en el SDNN y no en el RMSSD. La lectura en directo que se muestra durante una práctica es un sustituto calculado a partir de la desviación estándar de la frecuencia cardíaca, no SDNN ni RMSSD, y la cámara del teléfono da el pulso, no la HRV. ONDA describe y compara tus propios números; no diagnostica nada. Consulta [qué mide ONDA](/measurements).

> Información educativa, no un diagnóstico ni un tratamiento médico.
