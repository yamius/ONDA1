---
sourceHash: "fed00e9a1b1b"
title: "Cómo mide e interpreta ONDA las señales de tu cuerpo"
metaTitle: "Cómo mide e interpreta ONDA las señales de tu cuerpo"
metaDescription: "De dónde saca ONDA sus datos, cómo construye tu línea base y tus señales, qué se queda en tu teléfono y los límites de cada número que muestra."
shortAnswer: >
  ONDA lee la variabilidad de la frecuencia cardíaca, la frecuencia cardíaca en
  reposo y la frecuencia respiratoria desde Apple Health, y puede tomar el pulso
  en la yema del dedo con la cámara del iPhone. Con tus propias noches construye
  un corredor personal y señala las noches que quedan claramente fuera de él.
  Son comparaciones descriptivas, no un diagnóstico. ONDA no ha hecho ningún
  estudio propio de precisión ni de eficacia, y sus números solo son tan buenos
  como el dispositivo que los registró.
keyPoints:
  - "ONDA lee desde Apple Health la variabilidad de la frecuencia cardíaca como SDNN, la frecuencia cardíaca en reposo y la frecuencia respiratoria, escritas allí por el Apple Watch u otro dispositivo que sincronice con Apple Health; solo lee, nunca escribe."
  - "La cámara del iPhone da una lectura del pulso y una estimación de la respiración, no la variabilidad de la frecuencia cardíaca, y la puntuación de coherencia en directo no funciona con la cámara."
  - "Tu línea base y tus señales te comparan con tus propias noches recientes, nunca con una norma poblacional, y no dicen nada hasta que hay suficientes noches."
  - "Una señal exige un cambio grande, medido según tu propia dispersión, y un cambio mínimo absoluto o relativo, así que las pequeñas oscilaciones se ignoran."
  - "La línea base, las señales y los informes se calculan en tu teléfono. A partir de la versión 1.9.3, el progreso de las prácticas se queda en el dispositivo sin cuenta y solo se sincroniza cuando inicias sesión, y el diario se guarda solo en el dispositivo."
  - "ONDA no es un dispositivo médico, no tiene ningún estudio propio publicado sobre su precisión ni sobre sus beneficios, y no diagnostica nada."
imageAlt: "Tres líneas de entrada —una onda, una fila de marcas y una fila de puntos— se funden dentro de un marco redondeado en una sola línea que recorre una franja verde pálida con puntos marcados y lleva a un pequeño cuadrado."
evidenceMap:
  - claim: "ONDA lee la variabilidad de la frecuencia cardíaca (SDNN) desde Apple Health, donde la escribe el Apple Watch u otro dispositivo que sincroniza allí los datos cardíacos."
    limitation: "Describe solo el comportamiento de la app; ONDA no calcula el SDNN por sí misma y no puede comprobar cómo lo hizo el dispositivo que registró los datos."
  - claim: "La cámara del iPhone da el pulso en reposo y una estimación de la respiración; la variabilidad de la frecuencia cardíaca solo aparece con un reloj u otro dispositivo que la escriba en Apple Health."
    limitation: "Describe solo el comportamiento de la app; no es una validación de la lectura de la cámara."
  - claim: "ONDA construye una línea base personal, compara las noches con un corredor personal, espera a tener suficientes noches y exige unos cambios mínimos; el semáforo usa un corredor más largo."
    limitation: "Documentación del producto; los umbrales son decisiones de diseño de ONDA, no puntos de corte validados clínicamente."
  - claim: "ONDA no es un dispositivo médico y no diagnostica ni vigila ninguna afección."
    limitation: "Declaración de posicionamiento; no es una clasificación regulatoria de ninguna autoridad."
  - claim: "La variabilidad de la señal del pulso (PPG) concuerda con el ECG sobre todo en reposo y en condiciones controladas, y no debe tratarse como intercambiable con el ECG."
    limitation: "Diez estudios en la síntesis cuantitativa, adultos sanos, sobre todo en reposo; no es específico de la cámara del iPhone."
  - claim: "La frecuencia respiratoria puede estimarse a partir del ECG o de la señal del pulso con muchos algoritmos distintos."
    limitation: "Una revisión de métodos; no valida ningún dispositivo de consumo ni la estimación de ONDA."
  - claim: "ONDA limita las señales de desviación y envía mensajes tranquilos con una frecuencia fija."
    limitation: "Documentación del producto; las frecuencias son decisiones de diseño de ONDA, no recomendaciones clínicas."
---

## ¿Cuál es el método de ONDA?

ONDA es una app de respiración y biofeedback. Lee señales que otros dispositivos ya han registrado, las compara con tu propio historial y te muestra dónde se sitúa cada noche. Esta página describe ese método tal como está escrito en la app, incluidos sus límites. Es la descripción de un producto, no un hallazgo científico, y cada regla de las que siguen es una decisión de diseño, no un umbral clínico validado.

## ¿De dónde proceden los datos?

**Apple Health.** Con tu permiso, ONDA lee desde Apple Health la variabilidad de la frecuencia cardíaca (HRV o VFC), la frecuencia cardíaca en reposo y la frecuencia respiratoria. La HRV llega como SDNN, la forma en que la guarda Apple Health, y ONDA no la recalcula a partir de los intervalos entre latidos. Los valores los escribe el Apple Watch u otro dispositivo cuya app sincronice los datos cardíacos con Apple Health [S1]. ONDA solo lee: nunca escribe nada en Apple Health. También lee los horarios de sueño para su vista de regularidad del sueño y, cuando Apple Health los tiene, algunos valores sueltos en torno a la línea base, como la frecuencia cardíaca al caminar y un valor estimado de la forma aeróbica.

**La cámara del iPhone.** Con la yema del dedo sobre la cámara trasera, ONDA estima tu pulso a partir de los cambios de color de la piel, y la respiración a partir del ritmo de ese pulso. La cámara da el pulso, no la HRV: hasta que un reloj u otro dispositivo escriba la HRV en Apple Health, esa parte de la línea base sigue vacía [S1]. La puntuación de coherencia en directo tampoco está disponible con la cámara; solo aparece con un Apple Watch.

**Lo que ONDA no mide.** No registra un ECG, la presión arterial, el oxígeno en sangre, la temperatura, la actividad cerebral, las hormonas ni marcadores sanguíneos, y no puntúa las fases del sueño ni da una única cifra de preparación. Consulta [qué mide ONDA](/measurements) para ver el registro completo.

## ¿Cómo se construye tu línea base?

La línea base es el rango en el que suele moverse tu propio cuerpo. ONDA la construye a lo largo de {{fact:baseline.window}} con los valores nocturnos de Apple Health [S1, S4]. A partir de la versión 1.9.3, el gráfico de HRV muestra toda esa ventana en cuanto concedes el acceso a Apple Health, en lugar de irse llenando noche a noche. Las noches con demasiado pocas muestras se descartan antes de cualquier cálculo, y la HRV se toma solo de las muestras nocturnas.

Para las señales, {{fact:baseline.compare}} [S1]. ONDA no dice nada hasta que tiene al menos {{fact:baseline.minNights}}, así que las primeras semanas muestran una línea base que todavía se está construyendo, no un juicio. Los cambios mínimos que exige son: {{fact:baseline.floors}}.

En el modo simple, la misma regla mueve un semáforo. Su corredor abarca {{fact:baseline.corridor}}, de modo que unas pocas noches inusuales apenas lo desplazan. Verde significa que todas las señales están dentro de tu corredor; amarillo, una noche fuera; rojo, dos o más noches seguidas fuera. Estos colores describen la distancia respecto a tu propio historial. No califican tu salud. Para saber cómo leer estas comparaciones, consulta [tu línea base de HRV](/science/concepts/hrv-baseline) e [interpretar la HRV](/science/concepts/interpreting-hrv).

## ¿Cuándo muestra ONDA una señal?

Aparece una señal cuando, la noche anterior, la frecuencia cardíaca en reposo subió, la HRV bajó o la frecuencia respiratoria subió más allá tanto del umbral de dispersión como del cambio mínimo descritos más arriba. Si se movieron varias señales, ONDA muestra solo la mayor. ONDA envía {{fact:onda.signal.cadence}}, y la notificación no lleva números; los números están en la app.

Cuando tus noches se mantienen dentro del corredor, ONDA envía en su lugar {{fact:onda.checkin.steadyCadence}} —{{fact:onda.checkin.dailyCap}}—. Sin datos del reloj, estos mensajes llegan {{fact:onda.checkin.noWatchCadence}}. Los mensajes tranquilos se pueden desactivar en Ajustes.

Los valores nocturnos se mueven por motivos corrientes, como el alcohol, una cena tardía, el entrenamiento, un viaje o una noche corta; por eso una sola noche nunca se lee como un veredicto. Consulta [por qué la HRV cambia de un día a otro](/science/mechanisms/hrv-day-to-day).

## ¿Qué ves durante una práctica?

{{fact:onda.practice.livePulse}}. Con un reloj, ONDA muestra además una puntuación de coherencia: con qué fuerza sube y baja tu frecuencia cardíaca al ritmo de tu respiración en una ventana móvil. Es una métrica de retroalimentación para la práctica, no un biomarcador clínico, y no es comparable entre personas. El valor de la respiración en directo es una estimación a partir del ritmo del pulso. La onda en directo no es HRV en el sentido de RMSSD o SDNN.

## ¿Qué se guarda y dónde?

La línea base, las señales, el semáforo y los mensajes tranquilos se calculan en tu teléfono. Las imágenes de la cámara que se usan para el pulso se procesan en memoria y no se guardan ni se envían. A partir de la versión 1.9.3, el progreso de tus prácticas se guarda en el dispositivo aunque no tengas cuenta; si inicias sesión, también se sincroniza con tu cuenta para que sobreviva a una reinstalación. A partir de la versión 1.9.3, el diario, incluidas las notas de voz y las comprobaciones del pulso con la cámara guardadas en él, se queda solo en el dispositivo y no se sincroniza. Un informe en PDF o HTML se genera en el teléfono y solo sale de él si lo compartes tú.

## Lo que no te dice

ONDA no ha publicado ningún estudio propio sobre la precisión de sus lecturas ni sobre si sus prácticas cambian los resultados de salud. Lo que ONDA sabe sobre la precisión procede de estudios de las tecnologías en las que se basa, no de ONDA.

La precisión depende del dispositivo que registró los datos y de las condiciones. La variabilidad basada en el pulso concuerda con el ECG sobre todo en reposo y en condiciones controladas, y la evidencia no respalda tratar ambas como intercambiables [S2]. La frecuencia respiratoria puede estimarse a partir de la señal del pulso, pero con muchos algoritmos distintos y de rendimiento desigual [S3]. Una lectura con la cámara en la yema del dedo es más sensible al movimiento, la presión y la luz que un ECG de pecho, así que tómala como una estimación. Sobre las diferencias entre dispositivos, consulta [la HRV como medición](/science/measurements/heart-rate-variability), [frecuencia cardíaca en reposo](/science/measurements/resting-heart-rate) y [frecuencia respiratoria](/science/measurements/respiratory-rate).

La línea base y las señales son comparaciones estadísticas con tu propio pasado. No son un diagnóstico, y ONDA no es un dispositivo médico: no diagnostica, trata ni vigila ninguna afección [S1]. Una luz verde no significa que estés bien, y una roja no significa que estés enfermo. Si te encuentras mal, tienes dolor en el pecho, desmayos o una falta de aire intensa, busca atención médica muestre lo que muestre la app.

## ¿Cómo trata ONDA la evidencia?

La sección [ONDA Science](/science) explica la fisiología que hay detrás de estas señales. Sus páginas citan fuentes comprobadas en PubMed o Crossref, usan una redacción aprobada para los números y para las afirmaciones sobre ONDA, y separan los hallazgos establecidos de los emergentes o en debate. Las páginas las edita [Yakiv Bilenko](/people/yakiv-bilenko).

> Información educativa, no un diagnóstico ni un tratamiento médico.
