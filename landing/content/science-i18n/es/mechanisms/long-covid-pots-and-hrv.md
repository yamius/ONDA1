---
sourceHash: 68efe2df22d2
title: "COVID persistente, POTS y HRV: qué muestra la evidencia"
metaTitle: "COVID persistente, POTS y HRV"
metaDescription: "Cómo se relacionan el COVID persistente y el POTS con la variabilidad de la frecuencia cardiaca, por qué los datos combinados son inciertos y por qué la HRV no diagnostica el COVID persistente."
shortAnswer: >
  Los estudios combinados muestran solo una tendencia a una variabilidad de la
  frecuencia cardiaca (HRV, o VFC) más baja en personas con COVID persistente,
  y la mayoría de esos estudios tienen un alto riesgo de sesgo. Algunos
  estudios aislados encuentran una HRV más baja en reposo o en la vida diaria,
  pero los grupos con COVID persistente difieren, y las personas con POTS
  muestran un patrón distinto del de quienes tienen otros síntomas. En un
  pequeño estudio con wearable, la HRV del día a día no siguió a los síntomas.
  La HRV no puede diagnosticar el COVID persistente ni el POTS.
keyPoints:
  - "Un metaanálisis halló solo una tendencia a una HRV más baja en el COVID persistente, con alta heterogeneidad y alto riesgo de sesgo en la mayoría de los estudios."
  - "En un estudio, la HRV en reposo fue más baja en el COVID persistente, pero la respuesta al ponerse de pie fue normal, así que los resultados dependen de la prueba."
  - "Los subgrupos de COVID persistente, incluidas las personas con POTS, no comparten un mismo patrón de cambios autonómicos."
  - "En un estudio con wearables, la HRV fue más baja en el COVID persistente en la vida diaria y el sueño, y siguió más baja un día después de ejercicio más intenso."
  - "En un pequeño estudio con wearable, la HRV nocturna no siguió los síntomas de un día a otro, pero difirió entre personas con más y menos síntomas."
  - "Los modelos que usan datos de pulso de wearables para detectar el COVID persistente son herramientas de investigación, no pruebas diagnósticas."
imageAlt: "Una fina línea turquesa de ritmo cardiaco que sube en un escalón corto y empinado y luego se estabiliza, junto a una tenue flecha hacia arriba, sobre fondo blanco."
evidenceMap:
  - claim: "En el conjunto de estudios, las personas con condición post-COVID mostraron solo una tendencia a una HRV más baja que los controles."
    limitation: "Las diferencias combinadas no fueron estadísticamente significativas; alta heterogeneidad; la mayoría de los estudios incluidos tenían alto riesgo de sesgo."
  - claim: "En COVID persistente con síntomas ortostáticos, la HRV en reposo fue más baja que en los controles, pero la respuesta de la HRV al ponerse de pie activamente fue similar."
    limitation: "Pequeño estudio transversal, mucho tiempo después de la infección; los resultados dependen de si la HRV se mide tumbado o de pie."
  - claim: "Los subgrupos de COVID persistente, como personas con hipotensión ortostática inicial, con POTS o sin alteración ortostática, mostraron patrones autonómicos distintos."
    limitation: "Un estudio transversal con subgrupos pequeños; sobre todo mujeres; medidas autonómicas indirectas."
  - claim: "En un estudio con wearables, la HRV fue más baja en el COVID persistente que en los controles durante las actividades diarias y el sueño, y siguió más baja un día después de ejercicio en torno al primer umbral ventilatorio y por encima."
    limitation: "Observacional; grupo control pequeño; el vínculo con el malestar post-esfuerzo es una interpretación de los autores, no una regla probada."
  - claim: "En un pequeño estudio con wearable, la HRV nocturna no mostró asociaciones significativas de un día a otro con los síntomas dentro de la misma persona, aunque difirió entre personas con más y menos carga de síntomas."
    limitation: "Catorce personas; exploratorio; un solo dispositivo de consumo."
  - claim: "Un modelo de aprendizaje automático que añadió a los síntomas rasgos del pulso de wearables detectó el COVID persistente mejor que los síntomas solos en un conjunto de datos de investigación."
    limitation: "Modelo de investigación en un solo conjunto de datos; usa rasgos de frecuencia cardiaca, no es una prueba diagnóstica validada; no se ha demostrado su uso real."
  - claim: "La duración del registro, el entorno, la respiración y el método de análisis afectan a los valores de HRV, así que los estudios con métodos distintos son difíciles de comparar."
    limitation: "Guía metodológica (consenso de expertos) para registros de investigación."
  - claim: "Una sola lectura baja de HRV no significa por sí misma que una persona esté estresada o mal; la HRV no es un marcador específico de un estado (dato claim.hrvNotStress)."
    limitation: "Guía metodológica (consenso de expertos), no un estudio sobre el COVID persistente."
  - claim: "ONDA construye una línea base personal con los valores de Apple Health y compara los nuevos valores con el corredor propio del usuario (datos baseline.window, baseline.compare)."
    limitation: "Solo describe cómo funciona la app; no es evidencia de ninguna afirmación de salud."
---

## ¿Qué relación hay entre el COVID persistente, el POTS y la HRV?

La [variabilidad de la frecuencia cardiaca](/glossary/heart-rate-variability) (HRV, o VFC) es la variación natural del tiempo entre latidos. El COVID persistente son síntomas que duran meses tras una infección por coronavirus, a menudo cansancio, niebla mental y dificultad al ponerse de pie. El POTS (síndrome de taquicardia postural ortostática) es un patrón que aparece en algunas personas: la frecuencia cardiaca sube bruscamente al ponerse de pie. Como estos problemas afectan al sistema nervioso autónomo, se ha estudiado la HRV. En resumen: los resultados combinados muestran solo una tendencia a una HRV más baja, y los estudios discrepan en los detalles [S1].

Esta página describe lo que han encontrado los estudios. No es una guía de diagnóstico ni de tratamiento, y no da consejos sobre dosificar la actividad o el ejercicio.

## ¿Cómo funciona?

El sistema nervioso autónomo ajusta a cada momento la frecuencia cardiaca y los vasos sanguíneos, por ejemplo al ponerte de pie. Medidas de HRV como [RMSSD](/science/concepts/rmssd) se interpretan como reflejo de cambios de la frecuencia cardiaca mediados por el nervio vago. Si una infección altera este control, la HRV podría cambiar.

El panorama es mixto. En un estudio, las personas con COVID persistente y mareo al ponerse de pie tenían una HRV más baja tumbadas, pero su respuesta de HRV al levantarse fue normal [S2]. Otro estudio halló que los subgrupos de COVID persistente difieren: las personas con POTS, las personas cuya presión baja al ponerse de pie y las que no tienen ese problema mostraron patrones autonómicos distintos [S3]. Por eso el «COVID persistente» no es una única condición autonómica.

## ¿Cómo se mide?

Algunos estudios registran la HRV en consulta, tumbado y luego de pie [S2, S3]. Otros usan wearables durante días o semanas en la vida diaria y el sueño [S4, S5]. Miden cosas distintas, y los resultados dependen de la prueba. La duración del registro, el entorno, la respiración y el análisis afectan a los valores de HRV, lo que dificulta comparar los estudios [S7].

## ¿Qué influye?

El cansancio, el mal sueño, la menor actividad, la forma física perdida durante la enfermedad, la medicación y la respiración cambian la HRV, y todos son frecuentes en el COVID persistente [S4, S5, S7]. Por eso es difícil saber qué parte de una HRV más baja se debe a la condición en sí. Los cambios durante y después de una infección se explican en [Enfermedad y HRV](/science/mechanisms/illness-and-hrv).

## ¿Qué muestra la evidencia?

**Estudios combinados: depende del contexto, solo una tendencia.** Un metaanálisis de estudios que compararon a personas con condición post-COVID y controles sanos halló una tendencia a una HRV más baja que no fue estadísticamente significativa, con alta heterogeneidad y alto riesgo de sesgo en la mayoría de los estudios [S1]. Los autores hablan de una posible asociación.

**Estudios aislados: depende del contexto.** En un grupo con COVID persistente, la HRV en reposo fue más baja, pero la respuesta al ponerse de pie fue normal [S2]. En otro estudio, los subgrupos de COVID persistente, incluidas las personas con POTS, mostraron patrones distintos [S3].

**Vida diaria y ejercicio: emergente.** En un estudio con wearables, la HRV fue más baja en el COVID persistente que en los controles durante las actividades diarias y el sueño, y siguió más baja un día después de ejercicio en torno al primer umbral ventilatorio y por encima, la intensidad a la que la respiración empieza a acelerarse más deprisa [S4]. Los autores lo relacionan con el malestar post-esfuerzo, pero es su interpretación.

**Seguimiento día a día: emergente.** En un pequeño estudio con wearable, la HRV nocturna no siguió a los síntomas de un día a otro dentro de la misma persona; sobre todo difirió entre personas con más y menos carga de síntomas [S5].

**Modelos de detección: fase de investigación.** Un modelo de aprendizaje automático que añadió a los síntomas rasgos del pulso de wearables detectó el COVID persistente mejor que los síntomas solos en un conjunto de datos de investigación [S6]. No es una prueba diagnóstica validada.

**Desconocido.** Si la HRV puede diagnosticar el COVID persistente o el POTS, orientar el tratamiento o predecir quién se recupera.

## Lo que no te dice

- **No es un diagnóstico.** Ningún valor de HRV indica si alguien tiene COVID persistente o POTS; el POTS lo diagnostica un profesional con una prueba de bipedestación [S1, S3].
- **No es un medidor diario de síntomas.** En un pequeño estudio, la HRV nocturna no siguió los síntomas de un día a otro [S5].
- **No es una pauta de ejercicio.** Los datos sobre la HRV tras ejercicio más intenso son observacionales y no son una regla probada para dosificar la actividad [S4].
- **No habla de una sola noche.** {{fact:claim.hrvNotStress}} [S7].
- **Cuándo pedir ayuda.** Si los síntomas duran semanas tras una infección, o al ponerte de pie notas sensación de desmayo, dolor en el pecho o el corazón muy acelerado, consulta a un médico.

## En ONDA

ONDA construye una línea base personal con los valores guardados en Apple Health [S8]. La ventana es de {{fact:baseline.window}}, y {{fact:baseline.compare}}. Un valor fuera de tu corredor describe un cambio en tus propios datos, no su causa. ONDA no diagnostica el COVID persistente ni el POTS y no sustituye a un médico.

> Información educativa, no un diagnóstico ni un tratamiento médico.
