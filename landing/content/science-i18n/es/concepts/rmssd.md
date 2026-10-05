---
sourceHash: "7b68393346e3"
title: "RMSSD: qué refleja esta métrica de HRV y qué no"
metaTitle: "RMSSD: definición, significado y medición"
metaDescription: "El RMSSD es una métrica de HRV que refleja cambios de la frecuencia cardíaca mediados por el vago. Qué mide, cómo lo estiman los wearables y qué no puede decirte."
shortAnswer: >
  El RMSSD es una métrica de la variabilidad de la frecuencia cardíaca: la raíz
  cuadrada media de las diferencias entre latidos sucesivos. Se usa para
  resumir la variación latido a latido en registros breves y refleja cambios de
  la frecuencia cardíaca mediados por el vago. Influyen en él la edad, la
  respiración, la postura, la hora del día y el método de registro. Por sí solo
  no demuestra estrés, estado de salud ni tono vagal.
keyPoints:
  - "El RMSSD resume cuánto cambia el intervalo entre latidos de un latido al siguiente."
  - "Refleja cambios de la frecuencia cardíaca mediados por el vago, lo que lo convierte en una métrica estándar a corto plazo en la investigación sobre la HRV."
  - "El tono vagal no puede medirse directamente; el RMSSD es un indicador indirecto, y los productos que afirman lo contrario simplifican."
  - "Los wearables estiman el RMSSD a partir de la señal del pulso, y su concordancia con el ECG depende del dispositivo y de las condiciones."
  - "Los valores dependen del contexto: importan el método de registro, la duración, la postura, la respiración y la hora del día."
  - "Un solo valor de RMSSD no es un diagnóstico ni una lectura de estrés; las tendencias respecto a tu propia línea base personal suelen ser más informativas."
imageAlt: "Un fino trazo turquesa del ritmo cardíaco sobre fondo blanco, con una separación entre latidos que varía ligeramente: una imagen de la variabilidad de la frecuencia cardíaca latido a latido."
evidenceMap:
  - claim: "El RMSSD es la raíz cuadrada media de las diferencias sucesivas entre latidos adyacentes; es la métrica preferida para registros breves."
    limitation: "Un estándar de definición y metodológico; por sí solo no dice nada sobre el estado de salud."
  - claim: "El SDNN describe la dispersión global de los intervalos de un registro, mientras que el RMSSD aísla las diferencias entre latidos adyacentes."
    limitation: "Definiciones; la comparabilidad exige igualar la duración y las condiciones del registro."
  - claim: "El RMSSD refleja cambios de la frecuencia cardíaca mediados por el vago; el tono vagal no puede medirse directamente."
    limitation: "Un indicador indirecto en las condiciones de medición, no una medida directa de la actividad parasimpática."
  - claim: "La respiración queda escrita en los intervalos entre latidos a través de la arritmia sinusal respiratoria, así que la frecuencia y la profundidad de la respiración durante el registro influyen mucho en el RMSSD."
    limitation: "El efecto está presente durante el registro; los cambios sostenidos tras la práctica son otra cuestión."
  - claim: "El RMSSD depende del contexto de medición: método de registro, duración, postura, respiración y hora del día."
    limitation: "La magnitud y la dirección de los efectos del contexto varían según la métrica, la condición y la persona; respaldado por datos agrupados de valores normales y por guías metodológicas."
  - claim: "La mayoría de los valores de referencia publicados proceden de registros diurnos breves, mientras que los wearables de consumo informan sobre todo valores nocturnos."
    limitation: "Las poblaciones y los protocolos de referencia difieren entre estudios; no es una norma personal."
  - claim: "El RMSSD agrupado en reposo de registros diurnos breves es un promedio diurno agrupado, no un valor nocturno ni una norma por edad."
    limitation: "Agrupado a partir de protocolos de corta duración heterogéneos en adultos sanos; gran variación individual."
  - claim: "Las estimaciones de HRV de los wearables basadas en PPG coinciden con los valores derivados del ECG en algunas condiciones y se apartan de ellos en otras."
    limitation: "La concordancia depende de la métrica, el dispositivo y las condiciones; esta página no da cifras de precisión."
  - claim: "En promedio, el RMSSD disminuye con la edad en adultos sanos, mientras que entre personas varía mucho."
    limitation: "Promedios poblacionales transversales; gran variación individual a cualquier edad."
  - claim: "El RMSSD difiere entre mujeres y hombres, y la dirección y la magnitud de la diferencia dependen de la edad y de la población."
    limitation: "Datos observacionales en muestras sanas; promedios de grupo, no expectativas individuales."
  - claim: "Las condiciones de cada día pueden desplazar una sola lectura; por eso se recomiendan mediciones repetidas en condiciones comparables."
    limitation: "Las respuestas individuales varían; el tamaño de los efectos depende de la persona y de la dosis y aquí no se cuantifica."
  - claim: "Un RMSSD más alto se asocia en general con una mejor recuperación, pero no siempre; algunas alteraciones del ritmo cambian el propio patrón latido a latido."
    limitation: "Asociaciones a nivel poblacional; no un veredicto personal."
  - claim: "Las tendencias respecto a la propia línea base personal, medidas en condiciones comparables, son más informativas que una sola lectura."
    limitation: "Guía metodológica (consenso de expertos), no datos experimentales directos; una recomendación sobre la práctica de interpretación, no un hallazgo clínico."
  - claim: "Apple Health registra la HRV como SDNN, el tipo de dato de HealthKit de larga trayectoria que el Apple Watch registra automáticamente."
    limitation: "Documentación oficial; describe lo que registra el dispositivo, no lo que los valores significan para la salud; limitado al ecosistema de Apple."
  - claim: "Los modelos recientes de Apple Watch con watchOS muestran dos variantes de HRV —Recovery HRV y Overall HRV— y miden la HRV con una frecuencia de hasta cada cinco minutos."
    limitation: "Anuncio del fabricante; limitado a hardware y versiones del sistema concretos; Apple no ha explicado cómo se calcula Recovery HRV."
  - claim: "iOS y watchOS añaden un tipo de dato RMSSD a Apple Health."
    limitation: "Documentación oficial; disponibilidad limitada a versiones concretas del sistema; lo que cada app registra con este tipo depende de la app."
---

## ¿Qué es el RMSSD?

El RMSSD es una de las medidas estándar de la [variabilidad de la frecuencia cardíaca](/glossary/heart-rate-variability) (HRV o VFC), la variación natural del tiempo entre latidos consecutivos. Los estándares de medición del campo lo definen con precisión. {{fact:hrv.rmssd.definition}} [S1].

Dicho de forma sencilla: toma los intervalos entre latidos adyacentes, mira cuánto difiere cada uno del siguiente y resume esas diferencias en un único valor en milisegundos. Un valor mayor significa que el ritmo cambia más de un latido a otro.

Suele acompañarse de una segunda métrica del dominio del tiempo. {{fact:hrv.sdnn.definition}} [S1]. Las dos responden a preguntas distintas: el SDNN describe la dispersión global de los intervalos de un registro, mientras que el RMSSD aísla los cambios latido a latido. Por ese enfoque, el RMSSD es la métrica preferida cuando el registro es breve [S1, S2].

## ¿Cómo funciona el RMSSD?

El corazón no es un metrónomo. El sistema nervioso autónomo ajusta constantemente el intervalo entre dos latidos, y el más rápido de esos ajustes —la influencia vagal (parasimpática) sobre el corazón— actúa de un latido al siguiente [S2, S3]. El RMSSD capta justo esa escala de tiempo: cuánto cambia el ritmo entre latidos adyacentes.

Por eso el RMSSD se interpreta como una ventana a los cambios de la frecuencia cardíaca mediados por el vago. El encuadre importa. {{fact:claim.vagalTone}} [S2, S3].

La respiración deja una huella marcada en esa misma ventana. Con cada inhalación el corazón se acelera ligeramente; con cada exhalación se ralentiza: es la llamada arritmia sinusal respiratoria (RSA) [S2, S3]. Una respiración lenta y tranquila hace más profunda esta onda, y una lectura tomada durante esa práctica suele ser más alta que una tomada con una frecuencia respiratoria rápida. Es una observación de medición sobre aquello a lo que responde el valor, no una prueba de que se haya entrenado algo de forma permanente.

## ¿Cómo se mide el RMSSD?

El cálculo es sencillo. A partir de una serie de intervalos entre latidos: se toma la diferencia entre cada par de intervalos adyacentes, se elevan las diferencias al cuadrado, se promedian y se saca la raíz cuadrada [S1]. Todo lo que sabe el RMSSD depende de la precisión de esos intervalos; por eso el método de registro importa más que la aritmética.

El método de referencia es el ECG, que detecta la huella eléctrica de cada latido. Los wearables, en cambio, estiman los intervalos a partir de la señal del pulso en la piel (fotopletismografía, PPG); el resultado suele llamarse variabilidad del pulso (PRV). La concordancia entre ambos depende de la métrica y de las condiciones: en general es mayor en reposo y con buena señal, y menor con movimiento o mal contacto [S6, S7]. Un detalle práctico para quienes usan Apple Watch: {{fact:applewatch.hrv.healthkit}} [S9]. En el hardware reciente, {{fact:applewatch.hrv.variants2026}} [S10]. Apple no ha explicado cómo se calcula Recovery HRV. Por otra parte, {{fact:applewatch.hrv.rmssdType}} [S11], lo que permite a las apps leer un valor de tipo RMSSD desde Apple Health.

El contexto forma parte de la medición. El RMSSD depende de la postura, la respiración, la hora del día y la duración del registro [S5, S8]. La mayoría de los valores de referencia publicados se obtuvieron con registros diurnos breves en condiciones controladas [S5], mientras que los wearables de consumo informan sobre todo de promedios nocturnos: contextos distintos cuyos valores no son directamente intercambiables. Como orden de magnitud, el RMSSD agrupado en reposo de registros diurnos breves es de {{fact:hrv.pooled.daytime}} [S5], un promedio diurno agrupado, no un valor nocturno ni una norma por edad. Las tablas por grupos de edad que publica ONDA son tablas de RMSSD nocturno y están en el artículo [HRV normal por edad](/articles/normal-hrv-by-age). Para una rutina de medición personal constante, el lado práctico corresponde a la guía [cómo medir la HRV de forma constante](/articles/how-to-measure-hrv-consistently).

## ¿Qué influye en el RMSSD?

- La edad. En general, {{fact:hrv.age.trend}} [S4, S5]. Entre personas varía mucho a cualquier edad; las medianas poblacionales no son objetivos personales. Las tablas completas están en el artículo [HRV normal por edad](/articles/normal-hrv-by-age).
- El sexo. Los estudios describen diferencias entre mujeres y hombres, cuya dirección y magnitud dependen de la edad y de la población [S4].
- La respiración. Es el factor dominante a corto plazo, a través de la arritmia sinusal respiratoria: la frecuencia y la profundidad de la respiración durante el registro cambian el valor [S2, S3].
- Las condiciones. La postura, la hora del día y el sueño frente a la vigilia cambian lo que hace el mismo corazón durante la medición [S5, S8].
- Las condiciones de cada día. Una sola lectura puede variar de un día o una noche a otra; por eso se recomiendan mediciones repetidas en condiciones comparables [S2, S8].

## ¿Qué muestra la evidencia?

Establecido. La definición, el cálculo y el papel del RMSSD como métrica de HRV a corto plazo proceden de los estándares de medición del campo [S1]. Su interpretación como reflejo de los cambios de la frecuencia cardíaca mediados por el vago —sin que el tono vagal en sí pueda medirse directamente— es la interpretación estándar en las revisiones metodológicas [S2, S3]. El contexto de medición es un factor de primer orden, no una nota al pie: el método, la duración, la postura, la respiración y la hora del día moldean el valor [S5, S8]. En promedio, el RMSSD disminuye con la edad en adultos sanos [S4, S5].

Depende del contexto. Estimaciones de los wearables: los valores derivados de la PPG pueden seguir a la HRV derivada del ECG en condiciones favorables, y ambos se separan con movimiento, mal contacto o señal débil [S6, S7]. Valores de referencia: la mayoría de los rangos clásicos proceden de registros diurnos breves, no de los valores nocturnos que muestran los dispositivos de consumo [S5].

Guía / consenso de expertos. Las guías actuales para una investigación rigurosa sobre la HRV recomiendan condiciones de registro estandarizadas y repetibles, y una interpretación prudente de los valores aislados [S8]. Es consenso de expertos sobre cómo medir e interpretar, no datos experimentales directos sobre el RMSSD en sí.

Lo que sigue sin estar claro: todavía se está estudiando hasta qué punto los valores de tipo RMSSD de los dispositivos de consumo siguen al RMSSD derivado del ECG en las condiciones cotidianas —movimiento, tono de piel, ajuste del sensor, fases del sueño— [S6, S7]. Y sigue abierta la cuestión de cuánto del panorama de la investigación a largo plazo, construido sobre todo con ECG en entornos controlados, se traslada a los valores nocturnos de consumo en usuarios sanos [S8].

## Lo que el RMSSD no te dice

- No es un medidor del tono vagal. {{fact:claim.vagalTone}} [S2, S3].
- No es un diagnóstico ni una lectura de estrés. {{fact:claim.hrvNotStress}} [S1].
- Más alto no es automáticamente mejor. Un RMSSD más alto se asocia en general con una mejor recuperación, pero algunas alteraciones del ritmo cambian el propio patrón latido a latido, y en esa situación un valor alto tiene otro significado [S2].
- Los valores no son intercambiables entre dispositivos, apps y condiciones de medición [S6, S8].
- Un solo valor dice poco. Las guías metodológicas recomiendan comparar las lecturas con tu propia línea base personal, medida en condiciones comparables, en lugar de buscar significado en un valor aislado [S8].

## En ONDA

ONDA usa el RMSSD nocturno como métrica de referencia en sus tablas de normas de HRV y en la [calculadora de HRV](/tools/hrv). Sin embargo, la línea base personal nocturna de la propia app lee los valores de HRV guardados en Apple Health, y {{fact:applewatch.hrv.healthkit}} [S9], así que esa señal de base se apoya en el SDNN y no en el RMSSD. La lectura en directo que se muestra durante una práctica es un sustituto calculado a partir de la desviación estándar de la frecuencia cardíaca, no RMSSD ni SDNN, y la cámara del teléfono da el pulso, no la HRV. ONDA describe y compara tus propios números; no diagnostica nada. Consulta [qué mide ONDA](/measurements).

> Información educativa, no un diagnóstico ni un tratamiento médico.
