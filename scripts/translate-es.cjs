// Spanish translations for the 638 keys missing in es/translation.json.
//
// Style notes (matching the existing ES already in the file):
//   - tú (informal you), imperative mood for guiding lines
//   - Common UI verbs: Guardar, Cancelar, Cerrar, Activar
//   - Wellness terminology: respira / inhala / exhala, presencia, atención
//   - Brand strings, Latin element names (TERRA/AQUA/AER/IGNIS) are kept
//     identical to EN per the i18n-audit allowlist — they are NOT translated.
//
// Quality caveat: this is solid working Spanish from a careful one-pass
// translation, NOT professionally proofread. Native review recommended for
// the long narrative sections (philosophy, science_info, guiding_texts,
// terra_speaks, terra_final, flows, level_goal) before any major launch.

const fs = require('fs');
const path = require('path');

const TRANS = {};

// ─── quote_level_4..12 (9) ────────────────────────────────────────────────
TRANS['quote_level_4'] = 'La emoción es una corriente—<br/>nos enseña a movernos por el espacio invisible';
TRANS['quote_level_5'] = 'La presencia es más poderosa que cualquier movimiento';
TRANS['quote_level_6'] = 'La conexión nace<br/>cuando sientes a los demás sin perderte a ti mismo';
TRANS['quote_level_7'] = 'La claridad comienza<br/>cuando ves la diferencia';
TRANS['quote_level_8'] = 'El poder de la atención nace<br/>cuando eliges una sola cosa';
TRANS['quote_level_9'] = 'La imagen es el puente entre el pensamiento y la materia,<br/>la luz que ilumina el camino antes de que lo construyas';
TRANS['quote_level_10'] = 'La expresión es el momento<br/>en que lo interno toma forma en el mundo';
TRANS['quote_level_11'] = 'La interacción es una danza<br/>donde dos llamas se vuelven un solo hogar sin perder su color';
TRANS['quote_level_12'] = 'La cocreación comienza donde<br/>el resultado importa más que la autoría';

// ─── practices (3) ────────────────────────────────────────────────────────
TRANS['practices.elemental'] = 'Elemental';
TRANS['practices.practice_time'] = 'Tiempo de práctica';
TRANS['practices.bonus'] = 'Bono';

// ─── ranks (5) ────────────────────────────────────────────────────────────
TRANS['ranks.novice'] = 'Novato';
TRANS['ranks.student'] = 'Estudiante';
TRANS['ranks.practitioner'] = 'Practicante';
TRANS['ranks.master'] = 'Maestro';
TRANS['ranks.guru'] = 'Gurú';

// ─── circuits (30) ────────────────────────────────────────────────────────
TRANS['circuits.circuit_2_desc'] = 'Conciencia del movimiento y la dirección a través del flujo.<br/>Ni una ruta ni una meta — solo la sensación de "yo nado".<br/>Punto del primer impulso, la primera ola del movimiento.';
TRANS['circuits.circuit_3_desc'] = 'Dominio de dos mundos: la fluidez del agua + el apoyo de la tierra.<br/>Ni lucha ni huida — adaptar la forma a las condiciones.<br/>Punto de equilibrio: el primer paso estable y la respiración entre dos mundos.';
TRANS['circuits.circuit_6_name'] = 'Soy Parte de la Manada';
TRANS['circuits.circuit_6_title'] = 'Soy Parte de la Manada';
TRANS['circuits.circuit_6_subtitle'] = 'Primate / Conexión y Resonancia Social';
TRANS['circuits.circuit_6_desc'] = 'Conciencia de la conexión y la presencia entre los demás.<br/>Ni disolución ni dominación — la capacidad de estar en el campo.<br/>Punto de equilibrio social, donde las emociones se convierten en lenguaje.';
TRANS['circuits.circuit_7_name'] = 'Distingo';
TRANS['circuits.circuit_7_title'] = 'Distingo';
TRANS['circuits.circuit_7_subtitle'] = 'El Humano que Observa / Claridad y Discernimiento';
TRANS['circuits.circuit_7_desc'] = 'Conciencia de las diferencias y las formas.<br/>Ni evaluación ni análisis — la capacidad de ver qué es qué.<br/>El punto de nacimiento de la mente, donde el mundo deja de ser un flujo continuo.';
TRANS['circuits.circuit_8_name'] = 'Me Concentro';
TRANS['circuits.circuit_8_title'] = 'Me Concentro';
TRANS['circuits.circuit_8_subtitle'] = 'El Humano que Recoge / Atención y Concentración';
TRANS['circuits.circuit_8_desc'] = 'Conciencia de la dirección de la atención.<br/>Ni tensión ni control — la capacidad de sostener lo elegido.<br/>El punto de la concentración, donde el pensamiento deja de dispersarse.';
TRANS['circuits.circuit_9_name'] = 'Doy Forma a la Visión';
TRANS['circuits.circuit_9_title'] = 'Doy Forma a la Visión';
TRANS['circuits.circuit_9_subtitle'] = 'El Humano Creador / Arquitecto de Proyecciones Internas';
TRANS['circuits.circuit_9_desc'] = 'Conciencia del poder de la imaginación y la síntesis.<br/>No solo el procesamiento de datos — la capacidad de ver el todo en el espacio vacío.<br/>El punto del avance cognitivo, donde la mente aprende a diseñar el futuro.';
TRANS['circuits.circuit_10_name'] = 'Me Expreso';
TRANS['circuits.circuit_10_title'] = 'Me Expreso';
TRANS['circuits.circuit_10_subtitle'] = 'El Humano Social / Maestro de la Manifestación';
TRANS['circuits.circuit_10_desc'] = 'Conciencia de tu rol y valor en la sociedad.<br/>No solo transmitir sonidos — sino llevar tu imagen interna hacia afuera.<br/>El punto del nacimiento social, donde anuncias al mundo tu presencia.';
TRANS['circuits.circuit_11_name'] = 'Interactúo';
TRANS['circuits.circuit_11_title'] = 'Interactúo';
TRANS['circuits.circuit_11_subtitle'] = 'El Humano Social / Maestro de la Resonancia';
TRANS['circuits.circuit_11_desc'] = 'Conciencia del valor del intercambio y la asociación.<br/>No solo el contacto — sino la capacidad de oír el impulso de respuesta del mundo.<br/>El punto del equilibrio social, donde tu "Quiero" se encuentra con el "Quiero" del otro.';
TRANS['circuits.circuit_12_name'] = 'Co-Creo';
TRANS['circuits.circuit_12_title'] = 'Co-Creo';
TRANS['circuits.circuit_12_subtitle'] = 'El Humano Cultural / Maestro de la Sinergia';
TRANS['circuits.circuit_12_desc'] = 'Conciencia del poder de la creación colectiva.<br/>No solo trabajar juntos — sino la alquimia de los significados y metas compartidos.<br/>El punto más alto de la madurez social, donde te conviertes en arquitecto del futuro común.';

// ─── final_phrases (24) — included from the broader ES needs analysis ───
// Note: these are loaded only if EN has the key. The script's setKey skips
// non-existent EN keys silently.

// ─── artifacts (21) ───────────────────────────────────────────────────────
TRANS['artifacts.listen_heart'] = 'Escucha el Corazón';
TRANS['artifacts.echo_of_joy'] = 'Eco de Alegría';
TRANS['artifacts.echo_of_joy_desc'] = 'Completa 3 prácticas de la parte 4 con calidad del 100 %';
TRANS['artifacts.echo_of_joy_alert'] = 'Completa 3 prácticas de la parte 4 con calidad del 100 % para desbloquear este artefacto';
TRANS['artifacts.territory_pulse'] = 'Pulso del Territorio';
TRANS['artifacts.territorys_pulse'] = 'Pulso del Territorio';
TRANS['artifacts.calm_power'] = 'Poder Tranquilo';
TRANS['artifacts.calm_power_desc'] = 'Completa 6 prácticas de la parte 5 con calidad del 100 %';
TRANS['artifacts.calm_power_alert'] = 'Completa 6 prácticas de la parte 5 con calidad del 100 % para desbloquear este artefacto';
TRANS['artifacts.echo_of_power'] = 'Eco del Poder';
TRANS['artifacts.echo_of_power_desc'] = 'Completa 12 prácticas de la parte 5 con calidad del 100 %';
TRANS['artifacts.echo_of_power_alert'] = 'Completa 12 prácticas de la parte 5 con calidad del 100 % para desbloquear este artefacto';
TRANS['artifacts.voice_of_pack'] = 'Voz de la Manada';
TRANS['artifacts.voice_of_pack_desc'] = 'Completa todas las prácticas de la parte 6';
TRANS['artifacts.voice_of_pack_alert'] = 'Completa todas las prácticas de la parte 6 para desbloquear este artefacto';
TRANS['artifacts.body_language'] = 'Lenguaje Corporal';
TRANS['artifacts.body_language_desc'] = 'Completa 6 prácticas de la parte 6 con calidad del 100 %';
TRANS['artifacts.body_language_alert'] = 'Completa 6 prácticas de la parte 6 con calidad del 100 % para desbloquear este artefacto';
TRANS['artifacts.silent_understanding'] = 'Entendimiento Silencioso';
TRANS['artifacts.silent_understanding_desc'] = 'Completa todas las prácticas de la parte 6 con calidad del 100 %';
TRANS['artifacts.silent_understanding_alert'] = 'Completa todas las prácticas de la parte 6 con calidad del 100 % para desbloquear este artefacto';

// ─── practice_messages (61) — short imperatives spoken during practices ───
TRANS['practice_messages.still_message'] = 'Siente la respiración como movimiento dentro de la quietud.';
TRANS['practice_messages.flow_rhythm_message'] = 'Entra en el ritmo del agua: inhala — encuentra la ola, exhala — síguela.';
TRANS['practice_messages.directional_sense_message'] = 'Encuentra la línea fácil del movimiento: donde el cuerpo se siente más ligero — esa es la dirección correcta.';
TRANS['practice_messages.rhythm_movement_message'] = 'Conecta respiración y ola: inhala — recógete, exhala — desliza.';
TRANS['practice_messages.water_balance_message'] = 'Permanece de pie con suavidad. Las rodillas resortean. Inhala — eje, exhala — apoyo.';
TRANS['practice_messages.fluid_motion_message'] = 'Conviértete en agua: redondea tus movimientos, suaviza los ángulos, respira con fluidez.';
TRANS['practice_messages.wave_breath_message'] = 'Inhala — la ola sube, exhala — retroceso suave. Escucha el océano dentro de tu pecho.';
TRANS['practice_messages.sense_of_flow_message'] = 'Deja la mente en silencio. Permite que el cuerpo mismo indique la dirección de la facilidad.';
TRANS['practice_messages.flow_focus_message'] = 'Elige un punto de mirada. Muévete con suavidad — quédate aquí.';
TRANS['practice_messages.flow_adapt_message'] = 'Mantén el centro. Permite que el cuerpo ajuste suavemente la trayectoria.';
TRANS['practice_messages.still_water_message'] = 'Reduce el movimiento casi a cero. Escucha el silencio bajo la ola de la respiración.';
TRANS['practice_messages.deep_current_message'] = 'No escuches las olas, sino la corriente baja submarina — guía desde dentro.';
TRANS['practice_messages.echo_ocean_message'] = 'Inhala — llamada, exhala — respuesta. Hazte más callado para oír el océano dentro de ti.';
TRANS['practice_messages.breath_of_transition_message'] = 'Inhala — agua, exhala — tierra. Respira los dos mundos.';
TRANS['practice_messages.balance_point_message'] = 'Inhala — recoge el eje, exhala — ancla el apoyo. Centro — sobre el medio del pie.';
TRANS['practice_messages.adaptive_flow_message'] = 'El centro permanece — la forma cambia. Sé agua en arcilla.';
TRANS['practice_messages.ground_air_breath_message'] = 'Inhala — al cielo, exhala — a la tierra. El centro permanece tranquilo.';
TRANS['practice_messages.step_of_stability_message'] = 'Mantén el eje. El peso — en el apoyo. El paso nace del exhalar.';
TRANS['practice_messages.wave_of_breath_message'] = 'Inhala — la ola sube por la columna, exhala — desciende a los pies.';
TRANS['practice_messages.breath_bridge_message'] = 'Inhala — recógete (agua), exhala — enraíza (tierra). Entre ellos — el puente.';
TRANS['practice_messages.center_of_gravity_message'] = 'Pon la atención en el bajo vientre. Respira de modo que el peso se asiente en el medio del pie.';
TRANS['practice_messages.shape_shift_message'] = 'El centro — en su lugar, la forma — para la tarea. Respira y cámbiate con suavidad.';
TRANS['practice_messages.resonant_stillness_message'] = 'Quédate firme. La respiración — silenciosa, el exhalar un poco más largo. Escucha el silencio bajo la respiración.';
TRANS['practice_messages.pulse_of_earth_message'] = 'Escucha el ritmo bajo bajo los pies: inhala — recoge, exhala — entra en la profundidad.';
TRANS['practice_messages.breath_of_adaptation_message'] = 'Inhala — acepta las condiciones, exhala — refuerza el apoyo. Encuentra tu ritmo de trabajo.';
TRANS['practice_messages.soft_gaze_message'] = 'Permite que tus ojos miren no a un punto — sino al espacio. Deja que el mundo se despliegue ante ti.';
TRANS['practice_messages.orienting_inhale_message'] = 'Inhala con fuerza y sensibilidad, como si intentaras captar un aroma sutil de cambio. Que esta inhalación te devuelva del laberinto de los pensamientos al mundo real.';
TRANS['practice_messages.audio_scan_message'] = 'Hazte oído. Permite que los sonidos del mundo te atraviesen sin tocar tus sentimientos — como si estuvieras afinando un instrumento sensible a la frecuencia del silencio.';
TRANS['practice_messages.mammalian_neck_message'] = 'Permite que tu cabeza se mueva con suavidad y libertad, como un animal sensible en un bosque tranquilo. Deja que la tensión se aleje, abriendo el camino a tu claridad.';
TRANS['practice_messages.tail_reset_message'] = 'Siente tu columna no como una varilla rígida, sino como un tallo vivo y fluido. Permite que la ola de relajación suba desde las raíces mismas de tu cuerpo.';
TRANS['practice_messages.lymphatic_drift_message'] = 'Hazte fluido e ingrávido. Permite que una suave ola de vibración lave de cada célula los restos de fatiga y tensión.';
TRANS['practice_messages.deep_in_quick_out_message'] = 'Suelta el peso del momento congelado. Deja entrar el aire en lo más profundo de ti y exhala determinación, abriendo espacio al nuevo movimiento.';
TRANS['practice_messages.distance_barrier_message'] = 'El mundo termina donde tú comienzas. Siente la esfera transparente pero firme de tu presencia y deja que se convierta en tu fortaleza personal.';
TRANS['practice_messages.trajectory_detection_message'] = 'Deja de ver caras y detalles. Comienza a ver vectores, velocidades y direcciones. Conviértete en un punto de quietud por el que pasa el flujo de las trayectorias.';
TRANS['practice_messages.shadow_maneuvering_message'] = 'Imagina que el aire a tu alrededor está lleno de cuerdas invisibles. Desliza entre ellas, manteniendo la sensibilidad y ligereza de cada movimiento.';
TRANS['practice_messages.sensory_bypass_message'] = 'Entrega el control al cuerpo. Que tus pies encuentren el camino solos, mientras la mente permanece clara y libre de cálculos.';
TRANS['practice_messages.tonic_fluidity_message'] = 'Hazte maestro de tus estados. Aprende a cambiar tu poder interior con un solo impulso de voluntad, sin dejar inercia a las viejas emociones.';
TRANS['practice_messages.mass_center_message'] = 'Siente tu gravedad interior. Cuando tienes peso, el mundo deja de balancearte — te conviertes en el punto de referencia.';
TRANS['practice_messages.vagal_brake_message'] = 'Pulsa pausa. Calma tu pulso y vuelve al punto de calma absoluta, usando palancas directas de control sobre tu biología.';
TRANS['practice_messages.lymphatic_lock_message'] = 'Rompe el estancamiento dentro de ti. Que la presión profunda del diafragma se convierta en una bomba que lava la ansiedad y devuelve al cuerpo pureza y ligereza.';
TRANS['practice_messages.gravity_grounding_message'] = 'Deja de resistir la gravedad — permite que se convierta en tu fuerza. Hazte pesado, parte de la tierra, alguien a quien no se puede mover.';
TRANS['practice_messages.testosterone_vertical_message'] = 'Estira tu poder en una línea. Conviértete en un puente entre la tierra y el cielo, transformando tu postura en un manifiesto innegable de poder tranquilo.';
TRANS['practice_messages.protected_heart_message'] = 'Encuentra tu punto de apoyo. Deja que el calor de tu mano cree una zona de paz absoluta donde nacen tus sentimientos y tu fuerza.';
TRANS['practice_messages.silent_roar_message'] = 'Da voz a tu fuerza. Que la vibración baja de tu cuerpo llene el espacio, asegurando tu derecho al territorio y al silencio.';
TRANS['practice_messages.territorial_gaze_message'] = 'No mires al mundo, sino a través de él. Tu mirada no es la búsqueda de amenazas, es el inventario de tus dominios.';
TRANS['practice_messages.heart_coherence_message'] = 'Sintoniza tu frecuencia interior. Cuando tu corazón late en el ritmo de la armonía, el caos ajeno es impotente ante tu calma.';
TRANS['practice_messages.solid_aura_message'] = 'Siente dónde termina el mundo y comienzas tú. Densifica el espacio alrededor de tu corazón y centro, creando una zona de inviolabilidad absoluta.';
TRANS['practice_messages.tigers_path_message'] = 'No camines sobre la superficie — apóyate en ella. Cada paso que das es un sello que confirma tu poder sobre el espacio.';
TRANS['practice_messages.bears_circle_message'] = 'Traza tu mundo. Dentro de este círculo eres la ley suprema y el punto de paz. Que cada paso selle los límites de tu influencia innegable.';
TRANS['practice_messages.social_breathing_message'] = 'Suelta los ajustes de la separación. Encuentra un ritmo común donde "Yo" y "Tú" desaparecen y nace un campo unificado de interacción segura.';
TRANS['practice_messages.expanded_vision_message'] = 'Deja de "apuntar" tu mirada al otro. Abre tu atención como un radar, cubriendo todo el espacio y a todos los participantes a la vez.';
TRANS['practice_messages.goodwill_message'] = 'Quítate la armadura. Tu fuerza verdadera no está en la coraza, sino en la capacidad de estar abierto sin perder la calma.';
TRANS['practice_messages.chest_warmth_message'] = 'Sé fuente, no consumidor. Calienta el espacio dentro de ti para que comience a calentar a quienes te rodean.';
TRANS['practice_messages.gesture_inclusion_message'] = 'Muestra las manos. Que tus palmas se vuelvan un código visual de seguridad que desactiva la sospecha ajena y abre las puertas al diálogo.';
TRANS['practice_messages.attention_sensing_message'] = 'Deja de ser un punto, hazte espacio. Siente los hilos invisibles de la atención que atraviesan la manada y encuentra tu lugar en este tejido.';
TRANS['practice_messages.body_listening_message'] = 'Las palabras pueden mentir, la biología nunca. Deja de escuchar con los oídos y comienza a escuchar con todo el volumen de tu cuerpo, captando la verdad ajena en el ritmo de la respiración y las pausas.';
TRANS['practice_messages.distance_balance_message'] = 'Encuentra tu punto de equilibrio. El espacio entre tú y la manada no es vacío, sino un regulador de tu tensión interior y de tu fuerza.';
TRANS['practice_messages.social_exhale_message'] = 'Sé quien marca el ritmo del silencio. Tu exhalación es una ola invisible que apaga la ansiedad ajena y devuelve la claridad a la manada.';
TRANS['practice_messages.oxytocin_wave_message'] = 'Hazte fuente de seguridad. Transmite un calor que no se puede fingir y observa cómo el frío social se transforma en confianza.';
TRANS['practice_messages.somatic_containment_message'] = 'Vuelve a tu casa. Siente la densidad de tu piel y los límites de tu cuerpo, para mantenerte en contacto sin perderte en el caos ajeno.';
TRANS['practice_messages.social_spheres_message'] = 'Hazte arquitecto de tu espacio. Divide el mundo en capas y sé el centro de tu universo.';

// ─── practice_items (51) — name + desc pairs for the same practices ───
TRANS['practice_items.duration_8min'] = '8 min';
TRANS['practice_items.duration_9min'] = '9 min';
TRANS['practice_items.duration_11min'] = '11 min';
TRANS['practice_items.mass_center'] = 'Masa del Centro';
TRANS['practice_items.mass_center_desc'] = 'Cambia la bioquímica de la sangre de "ansiosa" a "dominante" mediante la masa y la respiración';
TRANS['practice_items.vagal_brake'] = 'Freno Vagal';
TRANS['practice_items.vagal_brake_desc'] = 'Detén instantáneamente el pico emocional y recupera el control sobre tu estado';
TRANS['practice_items.lymphatic_lock'] = 'Cerradura Linfática';
TRANS['practice_items.lymphatic_lock_desc'] = 'Desbloquea el flujo linfático y limpia el cuerpo de la bioquímica del estrés a través del trabajo del diafragma.';
TRANS['practice_items.gravity_grounding'] = 'Anclaje Gravitatorio';
TRANS['practice_items.gravity_grounding_desc'] = 'Gana estabilidad inquebrantable y apaga la ansiedad de fondo a través de la conexión con el apoyo.';
TRANS['practice_items.testosterone_vertical'] = 'Vertical de Testosterona';
TRANS['practice_items.testosterone_vertical_desc'] = 'Forma un núcleo físico de dominancia y activa las hormonas de la confianza.';
TRANS['practice_items.protected_heart'] = 'Pecho Protegido';
TRANS['practice_items.protected_heart_desc'] = 'Refuerza el centro interior de seguridad y activa la protección neuroinmune.';
TRANS['practice_items.silent_roar'] = 'Rugido Silencioso';
TRANS['practice_items.silent_roar_desc'] = 'Expresa la fuerza interior y estabiliza definitivamente el sistema nervioso a través de la resonancia sonora.';
TRANS['practice_items.territorial_gaze'] = 'Mirada Territorial';
TRANS['practice_items.territorial_gaze_desc'] = 'Estabiliza la percepción visual y afirma tu dominancia en el espacio.';
TRANS['practice_items.heart_coherence'] = 'Coherencia Cardíaca';
TRANS['practice_items.heart_coherence_desc'] = 'Crea un campo electromagnético coherente y protege tu sistema del ruido emocional externo.';
TRANS['practice_items.solid_aura'] = 'Aura Sólida';
TRANS['practice_items.solid_aura_desc'] = 'Crea una barrera físicamente perceptible del espacio personal y activa el centro corporal del "Yo".';
TRANS['practice_items.tigers_path'] = 'Sendero del Tigre';
TRANS['practice_items.tigers_path_desc'] = 'Cambia el patrón de marcha a "dominante" y refuerza la sensación de confianza en el movimiento.';
TRANS['practice_items.bears_circle'] = 'Círculo del Oso';
TRANS['practice_items.bears_circle_desc'] = 'Fija los límites de tu territorio y lleva el estado de "dominancia tranquila" al absoluto.';
TRANS['practice_items.social_breathing'] = 'Respiración Social';
TRANS['practice_items.social_breathing_desc'] = 'Sincroniza tu sistema nervioso con el de un compañero o grupo para eliminar barreras.';
TRANS['practice_items.expanded_vision'] = 'Visión Expandida';
TRANS['practice_items.expanded_vision_desc'] = 'Elimina la tensión en la comunicación y aprende a leer el campo común del grupo a través de la atención panorámica.';
TRANS['practice_items.goodwill'] = 'Buena Voluntad';
TRANS['practice_items.goodwill_desc'] = 'Transmite una señal de seguridad y apertura, evocando confianza instintiva en los demás.';
TRANS['practice_items.chest_warmth'] = 'Calor del Pecho';
TRANS['practice_items.chest_warmth_desc'] = 'Crea un campo "cálido" de presencia y activa el sistema de confort social.';
TRANS['practice_items.gesture_inclusion'] = 'Gesto de Inclusión';
TRANS['practice_items.gesture_inclusion_desc'] = 'Quita las barreras protectoras de los demás y lleva la comunicación a un modo de cooperación de confianza.';
TRANS['practice_items.attention_sensing'] = 'Sensación de la Atención';
TRANS['practice_items.attention_sensing_desc'] = 'Desarrolla la sensibilidad al campo social y siente tu inclusión en la "red" de interacciones.';
TRANS['practice_items.body_listening'] = 'Escucha Corporal';
TRANS['practice_items.body_listening_desc'] = 'Activa la comprensión profunda del interlocutor leyendo sus ritmos fisiológicos.';
TRANS['practice_items.distance_balance'] = 'Distancia de Equilibrio';
TRANS['practice_items.distance_balance_desc'] = 'Encuentra la distancia óptima para mantener la claridad de pensamiento y el contacto social.';
TRANS['practice_items.social_exhale'] = 'Exhalación Social';
TRANS['practice_items.social_exhale_desc'] = 'Conviértete en un punto de estabilización para los demás y reduce el nivel de tensión de fondo en un grupo.';
TRANS['practice_items.oxytocin_wave'] = 'Ola de Oxitocina';
TRANS['practice_items.oxytocin_wave_desc'] = 'Reduce el estrés social y activa el modo de cohesión grupal a través de la emoción dirigida.';
TRANS['practice_items.somatic_containment'] = 'Contención Somática';
TRANS['practice_items.somatic_containment_desc'] = 'Restaura la sensación de los límites personales y previene la disolución emocional en un grupo.';
TRANS['practice_items.social_spheres'] = 'Navegación por Esferas Sociales';
TRANS['practice_items.social_spheres_desc'] = 'Sintoniza la distancia de la atención y gana estabilidad en cualquier grupo.';

// ─── final_phrases (24) ──────────────────────────────────────────────────
TRANS['final_phrases.p5_1'] = 'Cuando tu centro gana masa, tus límites se vuelven una armadura invisible. Dominas no por la fuerza, sino por la inevitabilidad de tu presencia.';
TRANS['final_phrases.p5_2'] = 'Cuando dominas el freno vagal, te vuelves invulnerable a las provocaciones. Tu pulso es tu elección, y tu calma es tu privilegio principal.';
TRANS['final_phrases.p5_3'] = 'Cuando tu diafragma está libre, respiras con todo el poder de tu ser. El flujo libre de la linfa es tu invulnerabilidad y tu pureza interior inagotable.';
TRANS['final_phrases.p5_4'] = 'Cuando estás anclado por la gravedad, el mundo deja de ser tormenta y se vuelve solo paisaje en torno a tu monolito. Tu estabilidad es tu naturaleza verdadera.';
TRANS['final_phrases.p5_5'] = 'Cuando tu vertical está construida, el estrés no puede doblarte. Tu postura es tu verdad biológica, en la que no hay lugar para la duda.';
TRANS['final_phrases.p5_6'] = 'Cuando tu centro está protegido desde dentro, las tormentas externas pierden su poder. Tu pecho es un escudo siempre contigo y la fuente de tu confianza inquebrantable.';
TRANS['final_phrases.p5_7'] = 'Tu voz es la proyección de tu voluntad. Cuando suenas desde el centro de tu poder, el mundo se silencia para oírte. Tu presencia ahora es innegable.';
TRANS['final_phrases.p5_8'] = 'Donde alcanza tu mirada, termina la influencia ajena. Lo ves todo, y esta visión te vuelve invulnerable.';
TRANS['final_phrases.p5_9'] = 'Quien posee su ritmo posee la situación. Tu corazón coherente es una brújula que siempre apunta a tu poder personal y a tu seguridad.';
TRANS['final_phrases.p5_10'] = 'Cuando tus límites se sienten a nivel biológico, no necesitas demostrarlos. Tu densidad habla por sí misma, haciendo que el mundo respete tu espacio.';
TRANS['final_phrases.p5_11'] = 'Cuando tu andar gana peso, el mundo comienza a ajustarse a tu ritmo. Tu "sendero del tigre" es una orden invisible para que el espacio te pertenezca.';
TRANS['final_phrases.p5_12'] = 'Cuando sabes trazar tus círculos, el mundo empieza a respetar tus reglas. Eres el dueño de tu territorio, y tu fuerza ahora forma parte de tu biología.';
TRANS['final_phrases.p6_1'] = 'Cuando respiras al unísono, las máscaras sociales desaparecen. Tu sincronía es la llave de cualquier cooperación y la base de una verdadera manada.';
TRANS['final_phrases.p6_2'] = 'Quien ve todo el campo siempre posee la iniciativa. Tu mirada amplia es tu libertad y tu intuición social más alta.';
TRANS['final_phrases.p6_3'] = 'Un corazón abierto es el privilegio de los fuertes. Cuando tus hombros están relajados, invitas al mundo al diálogo en tus términos, creando espacio para una resonancia profunda.';
TRANS['final_phrases.p6_4'] = 'Quien sabe calentar el espacio nunca está solo. Tu calidez es la forma más silenciosa y más convincente de liderazgo.';
TRANS['final_phrases.p6_5'] = 'Una mano suave gobierna el mundo más eficazmente que un puño cerrado. Tu "gesto de inclusión" es la llave a los corazones y mentes con quienes construyes un futuro común.';
TRANS['final_phrases.p6_6'] = 'La atención es la energía de la conexión. Cuando aprendes a escanear sus flujos, dejas de ser un transeúnte casual y te conviertes en participante pleno del proceso vivo de la manada.';
TRANS['final_phrases.p6_7'] = 'Cuando escuchas con tu cuerpo, te vuelves invisible a la manipulación. Tu empatía interoceptiva ve la esencia de las cosas, haciéndote el aliado más atento y temible de la manada.';
TRANS['final_phrases.p6_8'] = 'Tu distancia es tu libertad. Cuando has encontrado tu punto de equilibrio, puedes ser parte de la manada permaneciendo dueño de tu estado.';
TRANS['final_phrases.p6_9'] = 'Un líder no es quien grita más fuerte, sino quien respira más profundo. Tu exhalación social es el poder silencioso sobre la atmósfera de cualquier espacio.';
TRANS['final_phrases.p6_10'] = 'Tu capacidad de generar calor es la forma más alta de inteligencia social. Cuando transmites la ola de oxitocina, cambias las reglas del juego, convirtiendo a una multitud en manada y a desconocidos en compañeros.';
TRANS['final_phrases.p6_11'] = 'Tu autonomía es la garantía de tu valor para la manada. Solo quien sabe regresar a sí mismo a tiempo puede guiar a otros sin perder el rumbo.';
TRANS['final_phrases.p6_12'] = 'El dominio de las zonas es tu libertad. Entra en cualquier manada, manda en cualquier campo, pero permanece siempre en el punto de tu paz verdadera.';

// ─── philosophy (60) ─────────────────────────────────────────────────────
TRANS['philosophy.text_1'] = 'No tienes que hacer nada para ser.';
TRANS['philosophy.text_2'] = 'Ya eres.';
TRANS['philosophy.text_3'] = 'El ser ya es movimiento. Escucha cómo respira la Tierra en ti.';
TRANS['philosophy.text_4'] = 'Con cada exhalación, la Tierra te acepta.';
TRANS['philosophy.text_5'] = 'Tu respiración conecta el cielo y las raíces.';
TRANS['philosophy.text_6'] = 'Cuanto más profundo es tu cimiento — más alto se eleva la luz.';
TRANS['philosophy.level_4.text_1'] = 'Tu cuerpo se vuelve rápido y atento.';
TRANS['philosophy.level_4.text_2'] = 'Los músculos no se tensan — están listos.';
TRANS['philosophy.level_4.text_3'] = 'El espacio se siente como una red de posibilidades.';
TRANS['philosophy.level_4.text_4'] = 'Aprendes a desplazarte, esquivar, cambiar de dirección.';
TRANS['philosophy.level_4.text_5'] = 'No con un tirón — sino al instante y con suavidad.';
TRANS['philosophy.level_4.text_6'] = 'No huyendo — sino encontrando un lugar más preciso.';
TRANS['philosophy.level_5.text_1'] = 'El cuerpo se vuelve más denso y más pesado.';
TRANS['philosophy.level_5.text_2'] = 'Los músculos se reúnen en disposición.';
TRANS['philosophy.level_5.text_3'] = 'La Tierra se siente como cimiento, y el espacio — como una extensión de ti.';
TRANS['philosophy.level_5.text_4'] = 'Aprendes a estar de pie y a sostener tu lugar.';
TRANS['philosophy.level_5.text_5'] = 'Sin encogerte, sin inflarte.';
TRANS['philosophy.level_5.text_6'] = 'Simplemente — ser y sostener.';
TRANS['philosophy.level_6.text_1'] = 'El cuerpo se vuelve atento y vivo.';
TRANS['philosophy.level_6.text_2'] = 'La mirada — móvil. El gesto — preciso.';
TRANS['philosophy.level_6.text_3'] = 'Comienzas a sentir a los demás con el cuerpo: por la respiración, por la pausa, por la dirección de la atención.';
TRANS['philosophy.level_6.text_4'] = 'El espacio se llena de señales.';
TRANS['philosophy.level_6.text_5'] = 'Aprendes a estar cerca. Sin fundirte, sin cerrarte.';
TRANS['philosophy.level_6.text_6'] = 'Simplemente — estar en un ritmo común.';
TRANS['philosophy.level_7.text_1'] = 'La atención se vuelve más nítida.';
TRANS['philosophy.level_7.text_2'] = 'Las sensaciones se separan unas de otras. Los contornos del mundo emergen.';
TRANS['philosophy.level_7.text_3'] = 'Comienzas a discernir: forma y fondo, señal y ruido, lo importante y lo secundario.';
TRANS['philosophy.level_7.text_4'] = 'Aprendes a notar los detalles.';
TRANS['philosophy.level_7.text_5'] = 'Sin atraparlos con la mente, sino permitiéndoles volverse visibles.';
TRANS['philosophy.level_7.text_6'] = 'En esta claridad nace la orientación.';
TRANS['philosophy.level_8.text_1'] = 'El mundo ya no te tira en todas direcciones.';
TRANS['philosophy.level_8.text_2'] = 'La atención se reúne. El ruido retrocede.';
TRANS['philosophy.level_8.text_3'] = 'Sientes cómo tu mirada se vuelve estable.';
TRANS['philosophy.level_8.text_4'] = 'Cómo el cuerpo apoya al pensamiento. Cómo la respiración te ayuda a permanecer aquí.';
TRANS['philosophy.level_8.text_5'] = 'Aprendes a sostener el foco. Sin apretar la mente,';
TRANS['philosophy.level_8.text_6'] = 'sino permitiéndole ser clara y dirigida.';
TRANS['philosophy.level_9.text_1'] = 'La atención se vuelve ligera, pero absolutamente precisa.';
TRANS['philosophy.level_9.text_2'] = 'Dentro de ti se enciende una pantalla donde las ideas adquieren color, densidad y volumen.';
TRANS['philosophy.level_9.text_3'] = 'Aprendes a "ver" el resultado no con los ojos, sino con todo tu ser.';
TRANS['philosophy.level_9.text_4'] = 'El espacio alrededor se convierte en un campo para la creatividad.';
TRANS['philosophy.level_9.text_5'] = 'Sin copiar la realidad — sino añadiéndole significado.';
TRANS['philosophy.level_9.text_6'] = 'Sin vagar en fantasías — sino creando un boceto funcional de la vida.';
TRANS['philosophy.level_10.text_1'] = 'La atención se mueve desde la cabeza al centro del pecho y a la garganta.';
TRANS['philosophy.level_10.text_2'] = 'Sientes una oleada de calor: la energía de la imagen busca salida.';
TRANS['philosophy.level_10.text_3'] = 'El espacio alrededor se siente como un entorno resonante, listo para recibir tu impulso.';
TRANS['philosophy.level_10.text_4'] = 'Aprendes a hablar para ser escuchado y a actuar para ser visto.';
TRANS['philosophy.level_10.text_5'] = 'Sin forzar — sino cautivando.';
TRANS['philosophy.level_10.text_6'] = 'Sin esconderte tras máscaras — sino expresando tu esencia a través de ellas.';
TRANS['philosophy.level_11.text_1'] = 'La atención se expande, abarcando el espacio entre tú y el otro.';
TRANS['philosophy.level_11.text_2'] = 'Empiezas a sentir la "piel social" — el límite invisible y los puntos de contacto.';
TRANS['philosophy.level_11.text_3'] = 'El mundo de las personas se siente como un campo vivo de conexiones, donde cada gesto evoca una respuesta.';
TRANS['philosophy.level_11.text_4'] = 'Aprendes no solo a transmitir, sino también a recibir, creando el ritmo de la comunicación.';
TRANS['philosophy.level_11.text_5'] = 'Sin dominar — sino sintonizando.';
TRANS['philosophy.level_11.text_6'] = 'Sin adaptarte — sino encontrando una frecuencia común.';
TRANS['philosophy.level_12.text_1'] = 'La atención se vuelve distribuida y fluida.';
TRANS['philosophy.level_12.text_2'] = 'Sientes el ritmo común del grupo como tu propio pulso.';
TRANS['philosophy.level_12.text_3'] = 'El espacio alrededor vibra con ideas que se amplifican mutuamente, resonando en todos.';
TRANS['philosophy.level_12.text_4'] = 'Aprendes a entretejer tus habilidades en el tejido común del proceso sin perderte.';
TRANS['philosophy.level_12.text_5'] = 'Sin competir — sino complementando.';
TRANS['philosophy.level_12.text_6'] = 'Sin someterte — sino co-actuando.';

// ─── science_info (36) — arrays of 3-7 scientific bullet points each ─────
TRANS['science_info.p4_1'] = [
  'Biología: Expandir el campo visual reduce la actividad de la amígdala.',
  'Por qué: Es un patrón motor de monitoreo del entorno en pequeños mamíferos, que cancela la visión de túnel de la "presa".',
  'Efecto: Reducción del nivel de ansiedad de fondo.',
];
TRANS['science_info.p4_2'] = [
  'Biología: Imitación del reflejo de orientación (conducta exploratoria).',
  'Por qué: Una inhalación brusca por la nariz envía una señal a la corteza cerebral, desplazando forzosamente el foco de las emociones internas a los estímulos externos.',
  'Efecto: "Sobriedad" instantánea de la atención y ruptura del ciclo de ansiedades obsesivas.',
  'Bio-marcador: Activación de los sistemas colinérgicos responsables de la atención selectiva.',
];
TRANS['science_info.p4_3'] = [
  'Biología: Imitación del reflejo de orientación a través del canal auditivo.',
  'Por qué: Entrenamiento del filtrado de señales en la formación reticular del tronco encefálico.',
  'Efecto: Mayor selectividad cognitiva — la capacidad de cortar al instante lo innecesario y mantener el foco.',
  'Bio-marcador: Desplazamiento de la dominancia hacia los ritmos theta manteniendo alta alerta.',
];
TRANS['science_info.p4_4'] = [
  'Biología: Reducción del tono de los músculos suboccipitales profundos.',
  'Bio-marcador: Optimización de la función de los tractos vestíbulo-espinales.',
  'Efecto: Mejora del riego sanguíneo de la corteza prefrontal.',
];
TRANS['science_info.p4_5'] = [
  'Biología: Activación de la respuesta parasimpática mediante la estimulación del plexo sacro.',
  'Por qué: En los mamíferos, los micro-movimientos de la cola son un mecanismo evolutivo de liberación de la tensión "congelada" tras un estrés vivido.',
  'Efecto: Profunda relajación muscular y eliminación del bloqueo estático del eje del cuerpo.',
  'Bio-marcador: Reducción del tono en la región lumbosacra y normalización del ritmo respiratorio.',
];
TRANS['science_info.p4_6'] = [
  'Biología: Estimulación del sistema linfático mediante contracciones musculares rítmicas.',
  'Por qué: El sistema linfático carece de bomba propia (corazón); su movimiento depende totalmente del movimiento muscular. La vibración es el modo más eficaz de iniciar este proceso.',
  'Efecto: Eliminación acelerada de los productos del metabolismo del estrés (cortisol, adrenalina) y reducción del edema.',
  'Bio-marcador: Reducción de la concentración de lactato y cortisol en el líquido intercelular.',
];
TRANS['science_info.p4_7'] = [
  'Biología: Cambio del sistema nervioso simpático del modo "congelación" al modo "maniobra".',
  'Por qué: Una exhalación brusca pero controlada interrumpe el ciclo de congelación, activando recursos para una respuesta activa al desafío.',
  'Efecto: Estabilización emocional rápida y salida del estado de "niebla mental".',
  'Bio-marcador: Cambio de movilización en la variabilidad de la frecuencia cardíaca.',
];
TRANS['science_info.p4_8'] = [
  'Biología: Calibración del espacio peripersonal en la corteza parietal del cerebro.',
  'Por qué: El control de la distancia es un mecanismo evolutivo de los mamíferos que, con clara conciencia de los límites, activa el sistema parasimpático (relajación).',
  'Efecto: Fortalecimiento de los límites psicológicos, reducción de la ansiedad social y la sensación de vulnerabilidad.',
  'Bio-marcador: Reducción del nivel de cortisol manteniendo alta resistencia al estrés.',
];
TRANS['science_info.p4_9'] = [
  'Acción: Encuentra un espacio seguro en un lugar concurrido (café, estación, calle transitada). Se puede practicar sentado o de pie.',
  'Biología: Activación de la vía dorsal del sistema visual (la vía del "¿Dónde?" y "¿Cómo?" a través de la corteza parietal).',
  'Por qué: Cambiar la atención de los objetos ("¿Qué es esto?") a los vectores de movimiento desactiva la evaluación emocional y permite el cálculo puro del entorno.',
  'Efecto: Aceleración de la velocidad de reacción a cualquier cambio y mayor maniobrabilidad entre multitudes o flujos de información.',
];
TRANS['science_info.p4_10'] = [
  'Biología: Modulación dinámica del tono muscular a través de los ganglios basales.',
  'Por qué: El entrenamiento del cerebelo y los ganglios basales permite al cuerpo adaptarse instantáneamente a los cambios sin gastar recursos en tensiones innecesarias.',
  'Efecto: Mayor plasticidad del movimiento, mejora de la coordinación y del sentido del equilibrio.',
  'Bio-marcador: Optimización de las señales de los propioceptores (sensores de posición del cuerpo en el espacio).',
];
TRANS['science_info.p4_11'] = [
  'Acción: Camina por el espacio evitando conscientemente ciertas zonas (líneas de baldosas, bordes de la alfombra, sombras o puntos imaginarios).',
  'Biología: Estimulación de los colículos superiores y el cerebelo para la corrección automática instantánea del movimiento.',
  'Por qué: Usar la visión periférica para la navegación desactiva la planificación lenta "consciente" y activa circuitos neuronales antiguos y ultrarrápidos.',
  'Efecto: Optimización de la propiocepción y la coordinación bajo presión de tiempo; alivio de la sobrecarga cognitiva.',
];
TRANS['science_info.p4_12'] = [
  'Biología: Entrenamiento de la flexibilidad autónoma (Tono Vagal).',
  'Por qué: La capacidad de cambiar rápidamente entre las ramas del sistema nervioso autónomo previene el agotamiento y el estrés crónico.',
  'Efecto: Mayor adaptabilidad, control sobre las reacciones y la capacidad de "encenderse" para el trabajo sin un calentamiento largo.',
  'Bio-marcador: Aumento de la variabilidad de la frecuencia cardíaca (HRV) y del índice de tono vagal.',
];
TRANS['science_info.p5_1'] = [
  'Acción: Adopta una "pose de poder": espalda recta, hombros abiertos, pies firmemente apoyados.',
  'Biología: Supresión del eje hipotálamo-hipófisis-suprarrenal (HPA). La investigación confirma que esta exposición reduce el cortisol un 25 % y aumenta la testosterona un 20 %.',
  'Bio-marcador: Estimulación del Vago Ventral. La exhalación prolongada es una señal directa al cerebro de seguridad, que estabiliza la variabilidad de la frecuencia cardíaca (HRV).',
  'Efecto: Surge la sensación de "peso interior" — la base biológica de la dominancia tranquila.',
];
TRANS['science_info.p5_2'] = [
  'Acción: Presiona suavemente con las yemas de los dedos los párpados cerrados durante 10-20 segundos o masajea con suavidad la zona cálida detrás de las orejas (en la base del cráneo).',
  'Biología: Activación del tono parasimpático mediante los nervios craneales (reflejo de Aschner-Dagnini).',
  'Bio-marcador: Reducción de la frecuencia cardíaca y normalización de la variabilidad de la frecuencia cardíaca (HRV).',
  'Efecto: Enfriamiento instantáneo del "motor emocional", transición del modo de ansiedad al modo de cálculo frío.',
];
TRANS['science_info.p5_3'] = [
  'Biología: Masaje mecánico directo de la cisterna del quilo (colector linfático principal) mediante los pilares del diafragma.',
  'Por qué: El estrés crónico hace que el diafragma se contracture, "encerrando" literalmente la linfa en la cavidad abdominal. Este ejercicio restaura el drenaje.',
  'Efecto: Desaparece la sensación física de "nudo en el estómago", mejora el metabolismo y se produce la desintoxicación del sistema.',
];
TRANS['science_info.p5_4'] = [
  'Acción: Siéntate en una silla, coloca los pies paralelos. Siente los puntos de contacto de tu cuerpo con el asiento y el suelo.',
  'Biología: Activación de propioceptores y vías vestíbulo-espinales que transmiten señales del oído interno a los músculos que mantienen la postura.',
  'Por qué: Cuando el cerebro recibe una señal clara de estabilidad física ("Estoy de pie/sentado firmemente"), el sistema límbico (centro del miedo) reduce automáticamente su reactividad.',
  'Efecto: Desaparece la inquietud en los movimientos, la voz se vuelve más profunda, la mirada — más tranquila.',
];
TRANS['science_info.p5_5'] = [
  'Biología: Activación de las vías propioceptivas que conducen a la formación reticular del tronco encefálico — el centro de la vigilia y la disposición.',
  'Bio-marcador: Equilibrio de los niveles de somatotropina (hormona del crecimiento y la recuperación) y supresión de la prolactina (hormona del estrés, sumisión y derrota).',
  'Efecto: Formación de una poderosa señal no verbal "Estoy aquí, soy fuerte". Los demás leen este código como signo de alto estatus y fiabilidad.',
];
TRANS['science_info.p5_6'] = [
  'Fisiología: Estimulación del área del timo (glándula tímica) y de los receptores sensoriales esternales. Esto mejora la regulación neuroinmune, señalando al cerebro la integridad física.',
  'Por qué: En los momentos de amenaza social, instintivamente comprimimos el pecho. Este ejercicio cambia forzosamente la bioquímica de "compresión" a "expansión protegida".',
  'Efecto: Aparece una sensación profunda de "mi zona está tranquilamente protegida", disminuye la vulnerabilidad emocional.',
];
TRANS['science_info.p5_7'] = [
  'Acción: Permanece en posición enraizada (ANCLAJE GRAVITATORIO). Inhala profundamente al vientre. Al exhalar, emite un sonido bajo y denso "OOOMM" o "RRRRR" desde lo más profundo del vientre.',
  'Biomecánica: Activación del diafragma y las cuerdas vocales, que están directamente conectados al nervio vago.',
  'Bio-marcador: Reducción del nivel de cortisol y estimulación de la liberación de oxitocina mediante la vibración rítmica del pecho.',
  'Efecto: Expresión de la fuerza de manera socialmente aceptable. Liberación de bloqueos en garganta y pecho, obtención de una voz "imperativa" que se escucha sin objeciones.',
];
TRANS['science_info.p5_8'] = [
  'Acción: Elige un objeto frente a ti (a 1-2 metros), enfócate en él durante 5-8 segundos. Luego desplaza suavemente la mirada al punto más lejano más allá y mantén el foco otros 5-8 segundos. Repite el ciclo 3 veces.',
  'Fisiología: Entrenamiento de la acomodación y el trabajo alterno del músculo ciliar. Esto estabiliza el sistema visual y reduce la actividad de la amígdala.',
  'Bio-marcador: Transición de la "visión de túnel" (signo de estrés) a la visión panorámica.',
  'Efecto: Reducción de la presión emocional del entorno. Empiezas a percibir el espacio no como hostil, sino como propio.',
];
TRANS['science_info.p5_9'] = [
  'Biología: Formación de un campo electromagnético ordenado (según investigaciones del HeartMath Institute). El corazón es el generador de campo EM más potente del cuerpo.',
  'Bio-marcador: Sincronización de los ritmos cerebrales (ondas alfa) con la variabilidad de la frecuencia cardíaca.',
  'Efecto: Estado de "invulnerabilidad". Tu sistema funciona en su propia frecuencia, así que la ira, el pánico o la presión de los demás no pueden resonar contigo ni "infectarte".',
];
TRANS['science_info.p5_10'] = [
  'Fisiología: La visualización táctil activa la corteza insular (ínsula) — un nodo cerebral clave responsable de la interocepción (percibir los procesos dentro del cuerpo) y de formar el esquema de los límites corporales.',
  'Bio-marcador: Refuerzo de los ritmos alfa que señalan un estado de descanso protegido.',
  'Efecto: Los límites de la personalidad empiezan a sentirse físicamente, haciendo tu presencia "densa" y natural para los demás.',
];
TRANS['science_info.p5_11'] = [
  'Biología: Aumentar el tiempo de contacto pie-suelo activa al máximo los propioceptores de la planta. Esto envía al cerebro una señal de superestabilidad, que automáticamente inhibe la actividad de la amígdala (centro de la ansiedad).',
  'Bio-marcador: Cambio del patrón neuromotor de marcha: reducción de la frecuencia del paso con aumento de "densidad". Esto se correlaciona con un aumento del nivel de testosterona y reducción de la ansiedad social.',
  'Efecto: Aparece una sensación física de "tu territorio". Ya no eres un huésped en este espacio — eres su dueño.',
];
TRANS['science_info.p5_12'] = [
  'Acción: Marca un círculo en el suelo (imaginario o real — con cinta, alfombra). Camina lentamente su perímetro con el "sendero del tigre". Detente en cuatro puntos clave (puntos cardinales).',
  'Biomecánica: Marcado del territorio mediante confirmación propioceptiva y visual de los límites.',
  'Bio-marcador: Reducción máxima de la actividad de la amígdala y estabilización del eje HPA (equilibrio cortisol-testosterona).',
  'Efecto: Refuerzo del sentido de territorialidad, reducción total de la ansiedad social y formación de una presencia "impenetrable".',
];
TRANS['science_info.p6_1'] = [
  'Acción: Siéntate o ponte de pie frente a otra persona (o imagínala).',
  'Fisiología: La sincronización de la frecuencia respiratoria conduce a la coherencia de la variabilidad de la frecuencia cardíaca (HRV) en ambos participantes. Esto activa el vago ventral en ambos simultáneamente.',
  'Bio-marcador: Reducción del nivel de cortisol e inicio de la producción de oxitocina, señalando que la persona cercana es "uno de los nuestros".',
  'Efecto: Desaparece la tensión social, surge una sensación física de "estamos en el mismo ritmo" junto con la disposición a la acción conjunta.',
];
TRANS['science_info.p6_2'] = [
  'Acción: Mirando a la otra persona, "diluye" conscientemente tu foco. Mantén la atención no en su rostro, sino en el espacio a sus lados — izquierda y derecha simultáneamente.',
  'Fisiología: Activación del colículo superior y la corteza insular. La visión periférica está directamente conectada al sistema parasimpático.',
  'Por qué: La "visión de túnel" es señal de ataque o huida. Una mirada expandida le dice al cerebro: "Estoy a salvo, controlo todo el perímetro".',
  'Efecto: Dejas de ser blanco de la presión ajena. Percibes la manada como un único organismo vivo manteniendo la autonomía interior.',
];
TRANS['science_info.p6_3'] = [
  'Acción: Los brazos deben colgar a lo largo del cuerpo con suavidad, sin tensión en las muñecas. Siente cómo la línea frontal de tu torso (plexo solar, pecho, garganta) queda disponible para el contacto, sostenida por tu núcleo interior.',
  'Fisiología: La Postura Abierta reduce la actividad del sistema nervioso simpático. El cerebro recibe la señal: "Sin amenaza, puede pasar a la interacción social".',
  'Bio-marcador: Aumento de la producción de oxitocina y reducción del cortisol de fondo. La relajación de los músculos trapecios libera el paso de las señales por el nervio vago.',
  'Efecto: Te vuelves "legible" para la manada. Los demás leen tu falta de defensa como signo de liderazgo y amistad, lo que elimina su contraagresión.',
];
TRANS['science_info.p6_4'] = [
  'Acción: Coloca la palma en el centro del pecho. Espera la sensación de calor físico de tu mano, luego extendiéndose más allá de la piel. Respira con suavidad, transmitiendo este calor al espacio que te rodea.',
  'Fisiología: La activación de los termorreceptores en la zona del esternón envía señales al hipotálamo, que desencadena la liberación de oxitocina. En la evolución de los mamíferos, el calor físico está inseparablemente ligado a la cercanía social y a la seguridad.',
  'Bio-marcador: Expansión de los vasos periféricos y estabilización de la frecuencia cardíaca.',
  'Efecto: Tu presencia se vuelve "cálida" y atractiva. Las personas instintivamente quieren estar en tu campo, ya que su sistema límbico te lee como un objeto seguro y con recursos.',
];
TRANS['science_info.p6_5'] = [
  'Acción: Durante la comunicación, usa palmas abiertas (girándolas hacia arriba o hacia el otro) y gestos suaves y redondeados.',
  'Fisiología: Una señal de seguridad para el sistema límbico ajeno. Evolutivamente, las palmas vacías y relajadas son un marcador de "sin arma" y sin intención de atacar.',
  'Bio-marcador: Las manos tensas se leen subconscientemente como disposición a golpear o agarrar, lo que dispara instantáneamente una reacción defensiva en el otro (incluso si no se da cuenta).',
  'Efecto: El otro se relaja instintivamente. Disminuye el nivel de formalidad, desaparece la necesidad de "mantener la defensa" y la comunicación se vuelve más sincera y productiva.',
];
TRANS['science_info.p6_6'] = [
  'Acción: Estando en un lugar concurrido, desenfoca la mirada.',
  'Biología: El trabajo del colículo superior y la corteza parietal, responsables de la atención espacial y del "esquema corporal" en el entorno externo.',
  'Bio-marcador: Entrenamiento de la vigilancia tónica (disposición del sistema para la percepción sin tensión) y mejora de la orientación espacial.',
  'Efecto: Desaparece la sensación de aislamiento social y alienación. Surge una sensación profunda, casi física, de inclusión en una "red social" unificada de la manada.',
];
TRANS['science_info.p6_7'] = [
  'Acción: Durante una conversación o al observar a alguien, desplaza el foco del significado de las palabras a la física del proceso.',
  'Fisiología: Activación de los circuitos interoceptivos de la corteza insular (ínsula). El cerebro compara las microseñales observadas del otro con tus propios archivos corporales.',
  'Bio-marcador: Parpadeo sincrónico y micro-tensión de los músculos faciales (efecto de las neuronas espejo).',
  'Efecto: Empiezas a comprender el estado y las intenciones verdaderas de las personas antes de que terminen su frase. Surge la sensación de "saber directo".',
];
TRANS['science_info.p6_8'] = [
  'Acción: Encuentra un espacio social seguro (o imagina un interlocutor). Da pasos lentos hacia adelante y hacia atrás, estudiando tu estado a medida que cambia la distancia.',
  'Fisiología: Regulación de la proxémica (conducta espacial). La distancia óptima previene la hiperestimulación de la amígdala, permitiendo a la corteza prefrontal mantener el control sobre la situación.',
  'Bio-marcador: Reducción de la microtensión en los músculos oculares y de la mandíbula al encontrar tu punto.',
  'Efecto: Dejas de "caer" en el campo ajeno y no te aíslas. Sientes el límite y mantienes un contacto vivo.',
];
TRANS['science_info.p6_9'] = [
  'Acción: Estando en compañía o en una reunión, periódicamente realiza una exhalación suave y prolongada. Debe ser silenciosa y natural.',
  'Fisiología: Una exhalación prolongada activa el sistema parasimpático mediante el nervio vago. La calma del dominante se transmite por la ausencia de signos de falta de aire y tensión.',
  'Bio-marcador: Aumento de la variabilidad de la frecuencia cardíaca (HRV) en ti y desaceleración sincrónica del pulso en quienes están a 2-3 metros.',
  'Efecto: Te conviertes en el "centro de gravedad" y en una isla de seguridad. Los conflictos se apagan en tu presencia, y la gente comienza inconscientemente a buscar tu mirada o aprobación.',
];
TRANS['science_info.p6_10'] = [
  'Biología: Activación consciente de la síntesis de oxitocina en los núcleos paraventriculares del hipotálamo. La oxitocina es un antagonista biológico directo del cortisol (hormona del estrés).',
  'Por qué: Niveles altos de oxitocina bloquean en la amígdala las señales de miedo al rechazo social. Esto hace tu presencia "magnética" y segura para el sistema límbico de los demás.',
  'Efecto: Aumento brusco del carisma personal. El grupo comienza a percibirte como un líder que une en lugar de dividir.',
];
TRANS['science_info.p6_11'] = [
  'Biología: Confirmación somatosensorial de la autonomía. La activación de la corteza parietal responsable del esquema corporal ayuda al cerebro a trazar una línea clara entre "Yo" y "No-Yo".',
  'Bio-marcador: Reducción de la reactividad del sistema simpático. Estabilización de la interocepción (sentido corporal interno), que bloquea la imitación excesiva del estrés ajeno.',
  'Efecto: Mantienes la capacidad de estar "junto" sin fundirte con la multitud. Esta es la mejor prevención del agotamiento emocional y de la "resaca social".',
];
TRANS['science_info.p6_12'] = [
  'Fisiología: Entrenamiento de la corteza parietal. Sintonización de la navegación social y del sentido de los límites.',
  'Efecto: Eres parte de la estructura, pero eres autónomo.',
];

// ─── terra_speaks (36) — short quotes from Terra ─────────────────────────
TRANS['terra_speaks.level_4.quote_1'] = 'Quien sabe desplazarse rara vez choca de frente.';
TRANS['terra_speaks.level_4.quote_2'] = 'La agilidad es la sabiduría del cuerpo.';
TRANS['terra_speaks.level_4.quote_3'] = 'La flexibilidad salva donde la fuerza se rompe.';
TRANS['terra_speaks.level_4.quote_4'] = 'El espacio ayuda a quienes lo sienten.';
TRANS['terra_speaks.level_5.quote_1'] = 'La fuerza no grita — se siente.';
TRANS['terra_speaks.level_5.quote_2'] = 'Los límites son una forma de respeto a ti mismo y al mundo.';
TRANS['terra_speaks.level_5.quote_3'] = 'Quien está de pie con confianza no necesita pelear.';
TRANS['terra_speaks.level_5.quote_4'] = 'Tu densidad es tu lenguaje.';
TRANS['terra_speaks.level_6.quote_1'] = 'La conexión comienza con la sensibilidad.';
TRANS['terra_speaks.level_6.quote_2'] = 'Quien oye el campo rara vez queda solo.';
TRANS['terra_speaks.level_6.quote_3'] = 'La popularidad es la capacidad de estar en el ritmo.';
TRANS['terra_speaks.level_6.quote_4'] = 'La manada se mantiene unida no por la fuerza, sino por la atención.';
TRANS['terra_speaks.level_7.quote_1'] = 'El discernimiento es la respiración de la mente.';
TRANS['terra_speaks.level_7.quote_2'] = 'Donde aparece la claridad, desaparece la prisa.';
TRANS['terra_speaks.level_7.quote_3'] = 'Ver la diferencia es respetar la forma.';
TRANS['terra_speaks.level_7.quote_4'] = 'El pensamiento comienza con la atención.';
TRANS['terra_speaks.level_8.quote_1'] = 'La atención es una forma de poder.';
TRANS['terra_speaks.level_8.quote_2'] = 'Donde está la atención, allí estás tú.';
TRANS['terra_speaks.level_8.quote_3'] = 'La concentración engendra estabilidad.';
TRANS['terra_speaks.level_8.quote_4'] = 'El foco libera energía.';
TRANS['terra_speaks.level_9.quote_1'] = 'Lo que puedes imaginar ya existe en tu campo de posibilidades.';
TRANS['terra_speaks.level_9.quote_2'] = 'El pensamiento se vuelve cosa cuando toma forma en tu corazón.';
TRANS['terra_speaks.level_9.quote_3'] = 'Tu imaginación es un laboratorio donde se crea tu mañana.';
TRANS['terra_speaks.level_9.quote_4'] = 'La claridad de la imagen interior determina la facilidad del paso exterior.';
TRANS['terra_speaks.level_10.quote_1'] = 'Tu silencio puede ser profundo, pero solo tu palabra construye ciudades.';
TRANS['terra_speaks.level_10.quote_2'] = 'La sinceridad es fuego que no quema, sino ilumina el camino.';
TRANS['terra_speaks.level_10.quote_3'] = 'Quien teme sonar permanece rehén de sus fantasías.';
TRANS['terra_speaks.level_10.quote_4'] = 'El mundo aprende sobre ti exactamente lo que eliges mostrarle.';
TRANS['terra_speaks.level_11.quote_1'] = 'La fuerza verdadera se conoce no en la lucha, sino en la capacidad de negociar.';
TRANS['terra_speaks.level_11.quote_2'] = 'Tu llama brilla más cuando se refleja en los ojos del otro.';
TRANS['terra_speaks.level_11.quote_3'] = 'La interacción es un puente que construyes desde ambos lados a la vez.';
TRANS['terra_speaks.level_11.quote_4'] = 'Oír lo no dicho — la forma más alta de agilidad social.';
TRANS['terra_speaks.level_12.quote_1'] = 'Las grandes obras nunca se realizan a solas.';
TRANS['terra_speaks.level_12.quote_2'] = 'La cocreación es cuando tu éxito se vuelve alegría para todos.';
TRANS['terra_speaks.level_12.quote_3'] = 'El instrumento más complejo es otra persona, pero juntos podéis tocar una sinfonía.';
TRANS['terra_speaks.level_12.quote_4'] = 'Eres tan rico como puedes crear junto a otros.';

// ─── terra_final (36) — closing lines per level ─────────────────────────
TRANS['terra_final.level_4.line_1'] = 'Ahora sabes cambiar de trayectoria sin perderte a ti mismo.';
TRANS['terra_final.level_4.line_2'] = 'Tu movilidad se ha vuelto consciente y tus reacciones — precisas.';
TRANS['terra_final.level_4.line_3'] = 'Estás listo para ir más allá — hacia la fuerza y los límites, hacia el peso y el estatus, hacia la presencia tranquila.';
TRANS['terra_final.level_5.line_1'] = 'Ahora sabes sostener el espacio y mantener tu centro bajo presión.';
TRANS['terra_final.level_5.line_2'] = 'Tu fuerza se ha vuelto tranquila y tus límites — claros.';
TRANS['terra_final.level_5.line_3'] = 'Estás listo para ir más allá — hacia el encuentro con los demás, hacia el lenguaje de la manada, hacia el ritmo de la conexión.';
TRANS['terra_final.level_6.line_1'] = 'Ahora sabes estar entre los demás sin perder tu centro.';
TRANS['terra_final.level_6.line_2'] = 'Tu sensibilidad se ha vuelto conexión y las emociones — un lenguaje de contacto.';
TRANS['terra_final.level_6.line_3'] = 'Has completado el camino de AQUA — el camino de las emociones, la fuerza y la conexión.';
TRANS['terra_final.level_6.line_4'] = 'Adelante — el aire y el pensamiento. Adelante — el discernimiento y la elección.';
TRANS['terra_final.level_6.line_5'] = 'Estás listo para la transición a AER.';
TRANS['terra_final.level_7.line_1'] = 'Ahora sabes ver las diferencias y las formas.';
TRANS['terra_final.level_7.line_2'] = 'Tu claridad se ha convertido en cimiento del pensar.';
TRANS['terra_final.level_7.line_3'] = 'Adelante — sostener la atención.';
TRANS['terra_final.level_7.line_4'] = 'Adelante — el foco y la dirección.';
TRANS['terra_final.level_8.line_1'] = 'Ahora sabes sostener la atención y devolverla a lo elegido.';
TRANS['terra_final.level_8.line_2'] = 'Tu claridad se ha vuelto dirigida. Tu mente — firme.';
TRANS['terra_final.level_8.line_3'] = 'Adelante — un paso al tiempo.';
TRANS['terra_final.level_8.line_4'] = 'Adelante — la intención y la ruta, la imagen y el futuro.';
TRANS['terra_final.level_9.line_1'] = 'Ahora sabes ver lo invisible y dar forma a tus intenciones.';
TRANS['terra_final.level_9.line_2'] = 'Tu mente se ha convertido en un instrumento luminoso de creación.';
TRANS['terra_final.level_9.line_3'] = 'Has completado el camino de AER — el camino del discernimiento, el foco y el diseño.';
TRANS['terra_final.level_9.line_4'] = 'Adelante — el fuego de la interacción. Adelante — el habla, el intercambio y la acción conjunta.';
TRANS['terra_final.level_9.line_5'] = 'Estás listo para la transición a IGNIS.';
TRANS['terra_final.level_10.line_1'] = 'Ahora sabes traer tus imágenes a la luz y darles voz.';
TRANS['terra_final.level_10.line_2'] = 'Tu presencia se ha vuelto tangible y tu autoexpresión — un regalo consciente al mundo.';
TRANS['terra_final.level_10.line_3'] = 'Estás listo para ir más allá — a la interacción profunda, a la danza de los intereses y al intercambio de poder.';
TRANS['terra_final.level_10.line_4'] = 'A la cocreación, donde el "Yo" se vuelve parte del gran "NOSOTROS".';
TRANS['terra_final.level_11.line_1'] = 'Ahora sabes no solo manifestarte, sino entrar en resonancia profunda con el mundo de las personas.';
TRANS['terra_final.level_11.line_2'] = 'Tus relaciones se han vuelto un campo para el crecimiento, y cada contacto — un intercambio consciente.';
TRANS['terra_final.level_11.line_3'] = 'Estás listo para ir más allá — a la cima del nivel social, a la magia de la acción conjunta.';
TRANS['terra_final.level_11.line_4'] = 'Al estado "YO CO-CREO", donde el dominio personal se vuelve un milagro compartido.';
TRANS['terra_final.level_12.line_1'] = 'Ahora has dominado el arte de ser parte del gran "NOSOTROS" sin perder tu "YO".';
TRANS['terra_final.level_12.line_2'] = 'Tu camino social está completo — has aprendido a brillar, interactuar y crear en el mundo de las personas.';
TRANS['terra_final.level_12.line_3'] = 'Pero más allá del límite del reino social, se abre algo más.';
TRANS['terra_final.level_12.line_4'] = 'Estás listo para volver la atención hacia adentro — a la conciencia del CUERPO mismo. TERRA II te espera.';

// ─── flows (94) — chatbot dialogue scenarios ────────────────────────────
TRANS['flows.common.end_thanks'] = 'Gracias por compartir. Recuerda que siempre puedes volver para hablar cuando lo necesites.';

TRANS['flows.anxiety_basic.title'] = 'Trabajar con la ansiedad';
TRANS['flows.anxiety_basic.intro'] = 'Me gustaría ayudarte a trabajar con algunos sentimientos de ansiedad. ¿Quieres probar un ejercicio rápido?';
TRANS['flows.anxiety_basic.situation'] = '¿Qué situación o pensamiento te está provocando ansiedad ahora mismo?';
TRANS['flows.anxiety_basic.thought'] = '¿Cuál es el pensamiento principal que pasa por tu mente sobre esto?';
TRANS['flows.anxiety_basic.feeling'] = 'En una escala del 1 al 10, ¿qué tan intensa es tu ansiedad ahora mismo?';
TRANS['flows.anxiety_basic.distortion'] = 'A veces nuestros pensamientos pueden distorsionarse un poco. ¿Cuál de estos patrones podría aplicar?';
TRANS['flows.anxiety_basic.alternative_thought'] = '¿Cuál sería una manera más equilibrada de ver esta situación?';
TRANS['flows.anxiety_basic.plan'] = '¿Qué pequeño paso podría ayudarte a sentirte mejor ahora mismo?';
TRANS['flows.anxiety_basic.plan.tiny_action'] = 'Realizar una pequeña acción';
TRANS['flows.anxiety_basic.plan.write_down'] = 'Escribir mis pensamientos';
TRANS['flows.anxiety_basic.plan.self_care'] = 'Hacer algo amable conmigo mismo';
TRANS['flows.anxiety_basic.plan.do_nothing'] = 'Solo reconocer la sensación';
TRANS['flows.anxiety_basic.summary'] = 'Has hecho un gran trabajo explorando tu ansiedad. Recuerda: {{situation}} desencadenó el pensamiento "{{thought}}", pero encontraste una perspectiva más equilibrada. Tu nivel de ansiedad fue {{anxiety_level}}/10. Cuídate.';
TRANS['flows.anxiety_basic.end_normalize'] = 'Eso está totalmente bien. A veces no estamos listos para profundizar, y está bien. Estoy aquí cuando quieras hablar.';

TRANS['flows.panic_grounding.title'] = 'Anclaje para el pánico';
TRANS['flows.panic_grounding.intro'] = 'Trabajemos esto juntos. ¿Estás teniendo un ataque de pánico ahora mismo, o lo tuviste hace poco?';
TRANS['flows.panic_grounding.intro.now'] = 'Estoy en pánico ahora';
TRANS['flows.panic_grounding.intro.recent'] = 'Fue hace poco';
TRANS['flows.panic_grounding.recent_panic'] = '¿Puedes describir brevemente qué pasó?';
TRANS['flows.panic_grounding.body_symptoms'] = '¿Qué sensaciones físicas notas en tu cuerpo?';
TRANS['flows.panic_grounding.fear_thoughts'] = '¿Qué pensamientos o miedos están surgiendo en ti?';
TRANS['flows.panic_grounding.reality_check'] = 'A menudo el pánico nos hace temer algo concreto. ¿Cuál es el miedo principal?';
TRANS['flows.panic_grounding.reality_check.health'] = 'Miedo por mi salud';
TRANS['flows.panic_grounding.reality_check.control'] = 'Miedo a perder el control';
TRANS['flows.panic_grounding.grounding'] = 'Probemos una técnica de anclaje. ¿Cuál sientes que es la adecuada para ti?';
TRANS['flows.panic_grounding.grounding.5senses'] = 'Ejercicio de los 5 sentidos';
TRANS['flows.panic_grounding.grounding.breathing'] = 'Respiración lenta';
TRANS['flows.panic_grounding.grounding.body'] = 'Conciencia corporal';
TRANS['flows.panic_grounding.safety_plan'] = '¿Qué es una cosa que puedes hacer ahora mismo para sentirte un poco más seguro?';
TRANS['flows.panic_grounding.summary'] = 'Has trabajado este momento de pánico. Notaste {{panic_body}} en tu cuerpo y temiste {{panic_fear_thoughts}}. Elegiste {{grounding_choice}} como anclaje. Recuerda: el pánico pasa. Estás a salvo.';

TRANS['flows.body_scan.title'] = 'Conciencia corporal';
TRANS['flows.body_scan.intro'] = 'Sintonicemos con tu cuerpo. ¿Estás listo para dedicar unos minutos a notar las sensaciones físicas?';
TRANS['flows.body_scan.intro.ready'] = 'Sí, estoy listo';
TRANS['flows.body_scan.intro.not_ready'] = 'Ahora no';
TRANS['flows.body_scan.location'] = '¿En qué parte de tu cuerpo notas la sensación más fuerte ahora mismo?';
TRANS['flows.body_scan.sensation_quality'] = '¿Cómo describirías esta sensación? (apretada, cálida, pesada, hormigueo…)';
TRANS['flows.body_scan.intensity'] = 'En una escala del 1 al 10, ¿qué tan intensa es esta sensación?';
TRANS['flows.body_scan.associated_thought'] = '¿Hay algún pensamiento o emoción conectado a esta sensación corporal?';
TRANS['flows.body_scan.need'] = '¿Qué necesita esta parte de tu cuerpo ahora mismo?';
TRANS['flows.body_scan.need.rest'] = 'Descanso';
TRANS['flows.body_scan.need.movement'] = 'Movimiento';
TRANS['flows.body_scan.need.warmth'] = 'Calor';
TRANS['flows.body_scan.need.care'] = 'Cuidado suave';
TRANS['flows.body_scan.micro_action'] = '¿Qué pequeña cosa podrías hacer para responder a esta necesidad?';
TRANS['flows.body_scan.summary'] = 'Notaste en {{body_location}} una sensación {{body_quality}} con intensidad {{body_intensity}}/10. Esto se conecta con: {{body_thought}}. Tu cuerpo necesita {{body_need}}. Escúchalo.';
TRANS['flows.body_scan.end_normalize'] = 'Está bien. A veces necesitamos espacio. Estoy aquí cuando estés listo.';

TRANS['flows.fear_basic.title'] = 'Trabajar con el miedo';
TRANS['flows.fear_basic.intro'] = '¿Qué miedo o preocupación te gustaría explorar hoy?';
TRANS['flows.fear_basic.situation'] = '¿En qué situaciones aparece más este miedo?';
TRANS['flows.fear_basic.worst_case'] = '¿Cuál es lo peor que imaginas que podría pasar?';
TRANS['flows.fear_basic.probability'] = 'Realistamente, ¿qué probabilidad (0-100 %) hay de que esto suceda?';
TRANS['flows.fear_basic.resources'] = '¿Qué recursos o apoyo tendrías si pasara algo difícil?';
TRANS['flows.fear_basic.small_step'] = '¿Qué pequeño paso podrías dar para enfrentar este miedo con suavidad?';
TRANS['flows.fear_basic.summary'] = 'Exploraste tu miedo a {{fear_topic}}. El peor caso ({{fear_worst_case}}) tiene aproximadamente {{fear_probability}} % de probabilidad. Tienes recursos: {{fear_resources}}. Tu pequeño paso: {{fear_small_step}}.';

TRANS['flows.pain_reflection.title'] = 'Reflexionar sobre el dolor';
TRANS['flows.pain_reflection.intro'] = '¿Qué tipo de dolor estás experimentando?';
TRANS['flows.pain_reflection.intro.emotional'] = 'Dolor emocional';
TRANS['flows.pain_reflection.intro.physical'] = 'Dolor físico';
TRANS['flows.pain_reflection.intro.both'] = 'Ambos';
TRANS['flows.pain_reflection.description'] = '¿Puedes describir cómo se siente este dolor?';
TRANS['flows.pain_reflection.intensity'] = 'En una escala del 1 al 10, ¿qué tan intenso es este dolor?';
TRANS['flows.pain_reflection.triggers'] = '¿Qué parece desencadenar o empeorar este dolor?';
TRANS['flows.pain_reflection.relief'] = '¿Qué te alivia, aunque sea un poco?';
TRANS['flows.pain_reflection.support'] = '¿Quién o qué podría apoyarte con este dolor?';
TRANS['flows.pain_reflection.summary'] = 'Compartiste sobre tu dolor {{pain_type}}: {{pain_description}} con intensidad {{pain_intensity}}/10. Detonadores: {{pain_triggers}}. Lo que ayuda: {{pain_relief}}. Apoyo: {{pain_support}}.';

TRANS['flows.loneliness_connection.title'] = 'Encontrar conexión';
TRANS['flows.loneliness_connection.intro'] = '¿Puedes contarme un poco cómo se siente la soledad para ti ahora mismo?';
TRANS['flows.loneliness_connection.hardest_moment'] = '¿Cuándo es más difícil la soledad?';
TRANS['flows.loneliness_connection.needs'] = '¿Qué tipo de conexión anhelas más?';
TRANS['flows.loneliness_connection.needs.being_seen'] = 'Ser visto de verdad';
TRANS['flows.loneliness_connection.needs.support'] = 'Tener apoyo';
TRANS['flows.loneliness_connection.needs.shared_activity'] = 'Compartir actividades';
TRANS['flows.loneliness_connection.person_option'] = '¿Hay alguien, aunque sea una conexión pequeña, a quien podrías acercarte?';
TRANS['flows.loneliness_connection.small_reach_out_step'] = '¿Cuál es un pequeño paso hacia la conexión que podrías dar?';
TRANS['flows.loneliness_connection.self_compassion'] = '¿Qué palabras amables le dirías a un amigo que se siente así?';
TRANS['flows.loneliness_connection.summary'] = 'Estás experimentando soledad, especialmente {{lonely_moment}}. Anhelas {{lonely_need}}. Podrías acercarte a {{lonely_person}} mediante {{lonely_action}}. Auto-compasión: {{lonely_self_compassion}}.';

TRANS['flows.anger_boundaries.title'] = 'Ira y límites';
TRANS['flows.anger_boundaries.intro'] = '¿Qué te está haciendo sentir enojado o frustrado ahora mismo?';
TRANS['flows.anger_boundaries.trigger'] = '¿Qué fue lo que específicamente desencadenó este sentimiento?';
TRANS['flows.anger_boundaries.expression_style'] = '¿Cómo sueles manejar la ira?';
TRANS['flows.anger_boundaries.expression_style.express'] = 'La expreso abiertamente';
TRANS['flows.anger_boundaries.expression_style.suppress'] = 'La contengo';
TRANS['flows.anger_boundaries.expression_style.both'] = 'Depende';
TRANS['flows.anger_boundaries.need_underneath'] = 'A menudo la ira protege una necesidad. ¿Qué podría haber debajo de tu ira?';
TRANS['flows.anger_boundaries.need_underneath.respect'] = 'Necesidad de respeto';
TRANS['flows.anger_boundaries.need_underneath.fairness'] = 'Necesidad de justicia';
TRANS['flows.anger_boundaries.need_underneath.space'] = 'Necesidad de espacio';
TRANS['flows.anger_boundaries.need_underneath.being_heard'] = 'Necesidad de ser escuchado';
TRANS['flows.anger_boundaries.constructive_action'] = '¿Cuál es una manera constructiva de abordar esta situación?';
TRANS['flows.anger_boundaries.summary'] = 'Tu ira por {{anger_topic}} fue desencadenada por {{anger_trigger}}. Debajo hay una necesidad de {{anger_need}}. Tu acción constructiva: {{anger_action}}.';

TRANS['flows.distortions.catastrophizing'] = 'Catastrofizar';
TRANS['flows.distortions.mind_reading'] = 'Lectura mental';
TRANS['flows.distortions.all_or_nothing'] = 'Pensamiento todo o nada';

// ─── level_goal (136) ───────────────────────────────────────────────────
TRANS['level_goal.title'] = 'OBJETIVOS y TAREAS';

// level_4
TRANS['level_goal.level_4.intro'] = 'Aprende a maniobrar — siente la distancia con tu cuerpo. Mantén el centro incluso cuando la forma cambie. Elige el movimiento sin perder el equilibrio.';
TRANS['level_goal.level_4.game_task'] = 'Tarea de juego y energética — activación del campo de la Agilidad (movilidad AQUA).';
TRANS['level_goal.level_4.principle_1'] = 'No empujas — rodeas.';
TRANS['level_goal.level_4.principle_2'] = 'No resistes — te deslizas.';
TRANS['level_goal.level_4.principle_3'] = 'La flexibilidad es una forma de supervivencia.';
TRANS['level_goal.level_4.story_1'] = 'El mundo se abre como un campo de trayectorias.';
TRANS['level_goal.level_4.story_2'] = 'Sabes cuándo acercarte. Sabes cuándo desplazarte.';
TRANS['level_goal.level_4.story_3'] = 'Y sabes que a veces un paso al lado es el paso más preciso hacia adelante.';
TRANS['level_goal.level_4.identity_1'] = 'Eres el Pequeño Mamífero, una forma de agilidad en la tierra.';
TRANS['level_goal.level_4.identity_2'] = 'La respiración se vuelve rápida y silenciosa.';
TRANS['level_goal.level_4.identity_3'] = 'La inhalación recoge la atención. La exhalación te permite cambiar de dirección.';
TRANS['level_goal.level_4.wisdom_1'] = 'No hace falta empujar. No hace falta congelarse.';
TRANS['level_goal.level_4.wisdom_2'] = 'Basta con ser móvil y atento.';
TRANS['level_goal.level_4.wisdom_3'] = 'En esta movilidad nace la seguridad. En esta flexibilidad — la estabilidad.';
TRANS['level_goal.level_4.wisdom_4'] = 'En esta elección — la vida.';

// level_5
TRANS['level_goal.level_5.intro'] = 'Aprende a sostener el territorio — siente los límites con tu cuerpo. Estabiliza el centro de poder, soporta la presión y mantén la dignidad sin agresión.';
TRANS['level_goal.level_5.game_task'] = 'Tarea de juego y energética — activación del campo del Poder (presencia AQUA).';
TRANS['level_goal.level_5.principle_1'] = 'La fuerza ya no es un destello — es fondo, densidad, presencia.';
TRANS['level_goal.level_5.principle_2'] = 'Las emociones se vuelven guías: dónde está el límite, dónde el contacto, dónde retroceder.';
TRANS['level_goal.level_5.principle_3'] = 'La masa no es una carga — es estabilidad.';
TRANS['level_goal.level_5.story_1'] = 'El mundo ya no parece caótico.';
TRANS['level_goal.level_5.story_2'] = 'Se divide en zonas de cercanía y distancia, calidez y tensión.';
TRANS['level_goal.level_5.story_3'] = 'Sientes el peso de tu cuerpo y comprendes: la masa es estabilidad.';
TRANS['level_goal.level_5.identity_1'] = 'Eres el Gran Mamífero, una forma de poder en la tierra.';
TRANS['level_goal.level_5.identity_2'] = 'La respiración se vuelve más baja. La inhalación recoge la fuerza en el centro.';
TRANS['level_goal.level_5.identity_3'] = 'La exhalación marca tranquilamente los límites.';
TRANS['level_goal.level_5.wisdom_1'] = 'No hace falta probar. No hace falta atacar.';
TRANS['level_goal.level_5.wisdom_2'] = 'Basta con estar de pie y sentir la tierra bajo ti.';
TRANS['level_goal.level_5.wisdom_3'] = 'En esta calma nace el estatus. En este peso — la confianza.';
TRANS['level_goal.level_5.wisdom_4'] = 'En este silencio — el poder.';

// level_6
TRANS['level_goal.level_6.intro'] = 'Aprende a estar en la manada — lee el campo. Siente dónde se te necesita. Dónde retroceder. Y dónde — fortalecer la presencia.';
TRANS['level_goal.level_6.game_task'] = 'Tarea de juego y energética — activación del campo de la Conexión (resonancia AQUA).';
TRANS['level_goal.level_6.principle_1'] = 'La conexión no son palabras. Es una sintonía sutil.';
TRANS['level_goal.level_6.principle_2'] = 'Las emociones dejan de ser destellos personales — se convierten en medios de contacto.';
TRANS['level_goal.level_6.principle_3'] = 'El mundo se vuelve una red viva donde cada respuesta cambia el movimiento colectivo.';
TRANS['level_goal.level_6.story_1'] = 'El mundo deja de ser un conjunto de figuras separadas.';
TRANS['level_goal.level_6.story_2'] = 'Sientes: te ven. Tú ves.';
TRANS['level_goal.level_6.story_3'] = 'Y entre esto, surge la confianza.';
TRANS['level_goal.level_6.identity_1'] = 'Eres el Primate, una forma de conexión en la tierra.';
TRANS['level_goal.level_6.identity_2'] = 'La respiración se sincroniza. La inhalación expande el campo de atención.';
TRANS['level_goal.level_6.identity_3'] = 'La exhalación te sintoniza con los demás.';
TRANS['level_goal.level_6.wisdom_1'] = 'No hace falta atraer hacia ti. No hace falta desaparecer.';
TRANS['level_goal.level_6.wisdom_2'] = 'Basta con estar en resonancia.';
TRANS['level_goal.level_6.wisdom_3'] = 'En esta conexión nace la seguridad. En esta sintonía — la pertenencia.';
TRANS['level_goal.level_6.wisdom_4'] = 'En este campo — la vida.';

// level_7
TRANS['level_goal.level_7.intro'] = 'Aprende a discernir — ver sin prisa. Notar los límites sin destruir la totalidad. Separar uno de otro permaneciendo en contacto con el todo.';
TRANS['level_goal.level_7.game_task'] = 'Tarea de juego y energética — activación del campo de la Claridad (discernimiento AER).';
TRANS['level_goal.level_7.principle_1'] = 'El discernimiento no es división. Es clarificación.';
TRANS['level_goal.level_7.principle_2'] = 'El mundo se despliega como una multitud de elementos, cada uno con su lugar y significado.';
TRANS['level_goal.level_7.principle_3'] = 'La claridad es el primer paso hacia la elección.';
TRANS['level_goal.level_7.story_1'] = 'Sientes cómo el pensamiento se vuelve preciso.';
TRANS['level_goal.level_7.story_2'] = 'Cómo la atención deja de difuminarse.';
TRANS['level_goal.level_7.story_3'] = 'Cómo la claridad trae calma.';
TRANS['level_goal.level_7.identity_1'] = 'Eres la Mente que Clarifica, una forma de discernimiento.';
TRANS['level_goal.level_7.identity_2'] = 'La respiración se vuelve ligera. La inhalación expande el campo de la percepción.';
TRANS['level_goal.level_7.identity_3'] = 'La exhalación destaca lo que importa.';
TRANS['level_goal.level_7.wisdom_1'] = 'No hace falta entender todo. Basta con ver las diferencias.';
TRANS['level_goal.level_7.wisdom_2'] = 'En esta claridad nace la orientación.';
TRANS['level_goal.level_7.wisdom_3'] = 'En este discernimiento — el cimiento del pensar.';
TRANS['level_goal.level_7.wisdom_4'] = 'En esta mirada — la libertad del caos.';

// level_8
TRANS['level_goal.level_8.intro'] = 'Aprende a enfocarte — sostener la atención en el tiempo. Volver a lo elegido una y otra vez. No regañándote por la distracción, sino reuniéndote con suavidad.';
TRANS['level_goal.level_8.game_task'] = 'Tarea de juego y energética — activación del campo del Foco (concentración AER).';
TRANS['level_goal.level_8.principle_1'] = 'El foco no es rigidez. Es elección.';
TRANS['level_goal.level_8.principle_2'] = 'De muchas señales conservas una — porque sabes adónde mirar.';
TRANS['level_goal.level_8.principle_3'] = 'La atención es un recurso. Se cansa y se recupera.';
TRANS['level_goal.level_8.story_1'] = 'Notas: cuanto más limpio el foco, menos esfuerzo se requiere.';
TRANS['level_goal.level_8.story_2'] = 'El foco nace de la calma.';
TRANS['level_goal.level_8.story_3'] = 'En este foco aparece el poder.';
TRANS['level_goal.level_8.identity_1'] = 'Eres la Mente que Reúne, una forma de concentración.';
TRANS['level_goal.level_8.identity_2'] = 'La respiración se vuelve uniforme. La inhalación apoya la presencia.';
TRANS['level_goal.level_8.identity_3'] = 'La exhalación elimina lo excesivo.';
TRANS['level_goal.level_8.wisdom_1'] = 'No hace falta sostenerlo todo. Basta con sostener lo que importa.';
TRANS['level_goal.level_8.wisdom_2'] = 'En esta concentración — la efectividad.';
TRANS['level_goal.level_8.wisdom_3'] = 'En esta elección — la dirección.';
TRANS['level_goal.level_8.wisdom_4'] = 'En este foco — el poder.';

// level_9
TRANS['level_goal.level_9.intro'] = 'Aprende a crear imagen — deja de actuar "a ciegas". Mantén la inspiración incluso en la rutina, viendo la meta final. Elige el movimiento basándote en un boceto interior de belleza.';
TRANS['level_goal.level_9.game_task'] = 'Tarea de juego y energética — activación del campo de la Imagen (visualización AER).';
TRANS['level_goal.level_9.principle_1'] = 'Crear una imagen no es huir de la realidad. Es programarla.';
TRANS['level_goal.level_9.principle_2'] = 'Los símbolos se vuelven tu lenguaje: un pensamiento claro cambia el estado del cuerpo.';
TRANS['level_goal.level_9.principle_3'] = 'Una imagen clara es la distancia más corta entre el sueño y el hecho.';
TRANS['level_goal.level_9.story_1'] = 'El mundo se despliega como un lienzo.';
TRANS['level_goal.level_9.story_2'] = 'Ya no eres rehén de las circunstancias — eres el autor de tu percepción.';
TRANS['level_goal.level_9.story_3'] = 'No solo un observador — sino el director de tus estados internos.';
TRANS['level_goal.level_9.identity_1'] = 'Eres el Humano Creador, dueño del espacio mental.';
TRANS['level_goal.level_9.identity_2'] = 'La respiración se vuelve profunda y rítmica. La inhalación llena la imagen de luz.';
TRANS['level_goal.level_9.identity_3'] = 'La exhalación permite que la imagen ocupe su lugar en la realidad.';
TRANS['level_goal.level_9.wisdom_1'] = 'No hace falta apresurarse. No hace falta luchar.';
TRANS['level_goal.level_9.wisdom_2'] = 'Basta con ver — y permitir que sea.';
TRANS['level_goal.level_9.wisdom_3'] = 'En esta visión — tu poder verdadero.';
TRANS['level_goal.level_9.wisdom_4'] = 'En esta imagen — tu libertad.';

// level_10
TRANS['level_goal.level_10.intro'] = 'Aprende a expresarte — supera el miedo al juicio y permite que tu yo interior se vuelva visible. Mantén la dignidad cuando te observen. Elige la sinceridad como estrategia.';
TRANS['level_goal.level_10.game_task'] = 'Tarea de juego y energética — activación del campo de la Expresión (manifestación IGNIS).';
TRANS['level_goal.level_10.principle_1'] = 'La expresión no es ruido. Es la precisión de tu presencia.';
TRANS['level_goal.level_10.principle_2'] = 'Tu voz, tus gestos y tus actos se convierten en tu firma en el mundo de las personas.';
TRANS['level_goal.level_10.principle_3'] = 'Expresarse significa dejar que la vida ocurra a través de ti.';
TRANS['level_goal.level_10.story_1'] = 'El mundo se despliega como un gran escenario.';
TRANS['level_goal.level_10.story_2'] = 'Ya no eres una sombra — eres un participante activo.';
TRANS['level_goal.level_10.story_3'] = 'No solo un oyente — sino alguien cuya opinión tiene peso.';
TRANS['level_goal.level_10.identity_1'] = 'Eres el Humano Social, dueño de la manifestación en el fuego de las conexiones humanas.';
TRANS['level_goal.level_10.identity_2'] = 'La respiración se vuelve poderosa y abierta. La inhalación recoge la fuerza de la intención.';
TRANS['level_goal.level_10.identity_3'] = 'La exhalación lleva tu voz y voluntad al mundo.';
TRANS['level_goal.level_10.wisdom_1'] = 'No hace falta gritar. No hace falta probar.';
TRANS['level_goal.level_10.wisdom_2'] = 'Basta con sonar claro y abierto.';
TRANS['level_goal.level_10.wisdom_3'] = 'En este sonido nace el reconocimiento.';
TRANS['level_goal.level_10.wisdom_4'] = 'En esta expresión — la vida.';

// level_11
TRANS['level_goal.level_11.intro'] = 'Aprende a interactuar — ver en el otro no un obstáculo ni un medio, sino un espejo vivo. Mantén el interés por la otredad del otro, convirtiendo las diferencias en oportunidades.';
TRANS['level_goal.level_11.game_task'] = 'Tarea de juego y energética — activación del campo de la Interacción (resonancia IGNIS).';
TRANS['level_goal.level_11.principle_1'] = 'La interacción no es compromiso. Es el arte de la amplificación mutua.';
TRANS['level_goal.level_11.principle_2'] = 'Tus límites se vuelven flexibles: sabes dónde dejar entrar al otro y dónde dejar espacio para ti.';
TRANS['level_goal.level_11.principle_3'] = 'La apertura es el camino más corto al entendimiento.';
TRANS['level_goal.level_11.story_1'] = 'El mundo se despliega como una red de diálogos.';
TRANS['level_goal.level_11.story_2'] = 'Ya no eres una isla solitaria — eres parte de un archipiélago.';
TRANS['level_goal.level_11.story_3'] = 'No solo una unidad — sino un multiplicador de fuerza en la asociación.';
TRANS['level_goal.level_11.identity_1'] = 'Eres el Humano Social, dueño de la sintonía fina en el fuego de las relaciones.';
TRANS['level_goal.level_11.identity_2'] = 'La respiración se vuelve sincrónica y tranquila. La inhalación absorbe la atención del compañero.';
TRANS['level_goal.level_11.identity_3'] = 'La exhalación dirige tu impulso hacia él.';
TRANS['level_goal.level_11.wisdom_1'] = 'No hace falta defender. No hace falta manipular.';
TRANS['level_goal.level_11.wisdom_2'] = 'Basta con ser sincero y atento a la respuesta.';
TRANS['level_goal.level_11.wisdom_3'] = 'En este intercambio nace la confianza.';
TRANS['level_goal.level_11.wisdom_4'] = 'En este encuentro — la vida.';

// level_12
TRANS['level_goal.level_12.intro'] = 'Aprende a co-crear — confía en el talento del otro tanto como en el tuyo. Mantén la inspiración en el flujo común, convirtiendo la voluntad colectiva en forma tangible.';
TRANS['level_goal.level_12.game_task'] = 'Tarea de juego y energética — activación del campo de la Cocreación (sinergia IGNIS).';
TRANS['level_goal.level_12.principle_1'] = 'La cocreación no es solo trabajo en equipo. Es un estado donde uno más uno equivale al infinito.';
TRANS['level_goal.level_12.principle_2'] = 'Tu ego retrocede, dejando espacio para un resultado compartido mayor que la suma de sus partes.';
TRANS['level_goal.level_12.principle_3'] = 'La creación es la forma más alta de expresar el potencial humano.';
TRANS['level_goal.level_12.story_1'] = 'El mundo se despliega como un gran proyecto colaborativo.';
TRANS['level_goal.level_12.story_2'] = 'Ya no estás solo en el vacío — eres co-autor de la realidad.';
TRANS['level_goal.level_12.story_3'] = 'No solo desempeñas un rol — sino que creas nuevos códigos culturales.';
TRANS['level_goal.level_12.identity_1'] = 'Eres el Humano Cultural, dueño de la sinergia en el fuego del propósito común.';
TRANS['level_goal.level_12.identity_2'] = 'La respiración se vuelve amplia y libre. La inhalación absorbe la energía compartida del grupo.';
TRANS['level_goal.level_12.identity_3'] = 'La exhalación la transforma en acción y resultado.';
TRANS['level_goal.level_12.wisdom_1'] = 'No hace falta acaparar el escenario. No hace falta temer perderse.';
TRANS['level_goal.level_12.wisdom_2'] = 'Basta con ser parte de un flujo vivo y creador.';
TRANS['level_goal.level_12.wisdom_3'] = 'En esta unidad nacen los milagros.';
TRANS['level_goal.level_12.wisdom_4'] = 'En este legado — la vida.';

// ─── More sections appended in subsequent edits ──────────────────────────

// ─── Apply ────────────────────────────────────────────────────────────────
const esPath = path.join(__dirname, '..', 'public', 'locales', 'es', 'translation.json');
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'locales', 'en', 'translation.json'), 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? prefix + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, p));
    else out[p] = v;
  }
  return out;
}
const fEn = flatten(en);

// Structure-aware setKey. The EN file mixes two styles:
//   - Truly nested objects (chapters.chapter_1_element → en.chapters.chapter_1_element)
//   - Flat keys with literal dots in the name
//     (flows.anxiety_basic.plan.tiny_action → en.flows.anxiety_basic["plan.tiny_action"])
// A naïve split-and-nest creates the wrong structure for the flat-with-dots
// case and breaks i18next lookup. Instead, walk EN to find where the key
// actually lives, then set the same path on the target.
function setKey(target, en, fullKey, value) {
  const parts = fullKey.split('.');
  // Try every possible split: first i parts as nested, rest as flat key name.
  // Take the LONGEST nested prefix that matches an actual leaf in EN.
  for (let i = parts.length; i >= 1; i--) {
    const nestedKeys = parts.slice(0, i - 1);
    const leafKey = parts.slice(i - 1).join('.');
    let curEn = en;
    let ok = true;
    for (const p of nestedKeys) {
      if (curEn && typeof curEn === 'object' && p in curEn) curEn = curEn[p];
      else { ok = false; break; }
    }
    if (ok && curEn && typeof curEn === 'object' && leafKey in curEn) {
      // Found the leaf in EN at this nesting. Mirror to target.
      let tgt = target;
      for (const p of nestedKeys) {
        if (typeof tgt[p] !== 'object' || tgt[p] === null) tgt[p] = {};
        tgt = tgt[p];
      }
      tgt[leafKey] = value;
      return true;
    }
  }
  return false; // not found in EN — script will warn
}

let added = 0, skipped = 0;
for (const [key, value] of Object.entries(TRANS)) {
  if (!(key in fEn)) {
    console.warn(`SKIP (not in EN): ${key}`);
    skipped++;
    continue;
  }
  if (!setKey(es, en, key, value)) {
    console.warn(`SKIP (structure mismatch with EN): ${key}`);
    skipped++;
    continue;
  }
  added++;
}

fs.writeFileSync(esPath, JSON.stringify(es, null, 2) + '\n');
console.log(`Added ${added} ES translations (${skipped} skipped — not in EN base)`);
