// One-shot: align array lengths across EN/RU/ES/UK/ZH where mismatched.
// Targets:
//   - guiding_texts.p2_1..p2_12  → expand EN to RU's full step list (12 langs LANG=12)
//   - guiding_texts.p4_2         → expand RU/UK/ZH to EN/ES's full 12-step list
//   - eliza.fallback             → keep {{fragment}} line, add RU lines 5-10 to all langs
const fs = require('fs');

const langs = ['en','es','ru','uk','zh'];
const data = {};
for (const l of langs) data[l] = JSON.parse(fs.readFileSync('public/locales/' + l + '/translation.json','utf8'));

// ─── p2_* — EN expansion (translated from RU) ──────────────────────────
const EN_P2 = {
  p2_1: [
    'Sit or stand freely; shoulders and jaw soft.',
    'Feel the "current" around your body — as if water touches your skin.',
    'Inhale — chest rises slightly, the wave meets you.',
    'Exhale — let the body yield gently into the flow (a 1–2° micro-movement).',
    'Breathe smoothly: inhale and exhale roughly equal; if resistance appears — lengthen the exhale.',
    'Explore three directions: forward/back, right/left, up/down — go where it\'s easier.',
    'Let knees and elbows be springy; the spine — a flexible rod.',
    'Don\'t steer the current. Listen to it with skin, back, belly — and answer just slightly.',
    'On the inhale, gather toward center; on the exhale, glide with the wave.',
    'Keep the gaze soft, as if underwater; movements — almost invisible.',
    'When the rhythm is found, reduce amplitude to "almost still", keeping the sense of current within.',
    'Hold the phrase: "I breathe — and follow the wave."',
  ],
  p2_2: [
    'Stand or sit freely; the gaze soft, as if underwater.',
    'Feel the "current" around — a barely perceptible pull toward one side.',
    'On the inhale, gather the axis (crown up, base down).',
    'On the exhale, allow the body to yield slightly toward the path of least resistance.',
    'Make a "compass scan": left ↔ right, forward ↔ back, slightly up ↔ down.',
    'Where breath becomes freer and the exhale longer — hold for a moment.',
    'Check three anchors: feet firm in their support, belly warm, neck soft.',
    'If doubt arises — return to center on the inhale and listen to the exhale again.',
    'The mind doesn\'t choose — the body chooses: follow the sense of ease and warmth.',
    'Reduce amplitude to "almost still", keeping the vector within — like a quiet compass needle.',
    'Anchor the direction with breath: inhale gathers into a line, exhale confirms the course.',
  ],
  p2_3: [
    'Stand softly: knees spring, spine — a flexible axis, shoulders and jaw relaxed.',
    'Choose a barely visible continuous movement — micro-rocking or a "figure-eight" with the torso.',
    'Breathe evenly: inhale = exhale (e.g. 4–4). If tension appears — lengthen the exhale by 1–2 counts.',
    'On the inhale the body gathers into a line and rises slightly; on the exhale it lets go and glides along an arc.',
    'Keep the amplitude at 5–10% — the movement is almost invisible, yet felt from within.',
    'Look with "soft eyes", as underwater; the head moves last and least.',
    'Let the movement travel from the belly center along the spine to the shoulders and pelvis.',
    'Find your tempo: 2–2 → 3–3 → 4–4 — wherever breath feels easiest, that\'s right.',
    'Notice the tiny pause at the turning point — it\'s the breath of form.',
    'If the rhythm slips — return to the exhale, and the movement will tune itself.',
    'Simplify everything extra — leave only "inhale-line / exhale-wave".',
    'Keep the sense that water carries you, and you only tune in.',
  ],
  p2_4: [
    'Place your feet hip-width apart; find the "foot triangle": heel — base of the big toe — base of the little toe.',
    'Knees soft, pelvis neutral, crown reaches upward — like a flexible axis.',
    'Inhale — slightly lengthen the spine; exhale — release weight into the feet.',
    'Begin a barely perceptible swaying, as if on water: 5–10% amplitude.',
    'Check four vectors: forward/back, left/right — where breath is more even, that\'s the true center.',
    'Keep the gaze soft on the "horizon" line or on a single calm point.',
    'If balance slips — reduce amplitude and lengthen the exhale (4–6).',
    'Let the shoulders drop heavily, the jaw — relax, the belly — become warm.',
    'Feel the center of gravity float over the middle of the foot, not into the toes or heels.',
    'Imagine a thread: crown ↔ heels. Breath makes the thread alive, and the support — reliable.',
    'Keep the rhythm: inhale gathers the axis; exhale widens the contact with the ground.',
    'Gradually reduce movement to "almost still", keeping the sense of wave within.',
  ],
  p2_5: [
    'Stand freely: knees soft, pelvis neutral, crown reaching upward.',
    'Take a slow inhale — find the center in the belly; exhale — let go of shoulders and jaw.',
    'Begin a barely visible gliding motion of the torso — as if underwater (5–10% amplitude).',
    'Connect movement with breath: inhale — light rising/gathering, exhale — gentle settling/widening.',
    'Imagine warm fluid inside the joints: it lubricates knees, pelvis, shoulders, neck.',
    'Remove "angled" trajectories — turn them into arcs and figure-eights.',
    'Move from the center: belly and pelvis first, then chest and shoulders, last — the hands and gaze.',
    'If you sense a "brake" somewhere — pause on the exhale and melt that spot with attention.',
    'Keep the breath even (4–4); for more softness — lengthen the exhale (4–6).',
    'Sustain continuity: each movement births the next, like wave after wave.',
    'Gradually reduce amplitude to "almost still", keeping the sense of fluidity within.',
    'Remember the quality: not faster — softer; not stronger — smoother.',
  ],
  p2_6: [
    'Sit or stand freely; shoulders and jaw soft, belly warm.',
    'Feel the side ribs and back — breathe "wide", not only forward.',
    'On the inhale the ribcage spreads to the sides and back — the wave rolls in.',
    'On the exhale everything settles smoothly — the wave returns to shore.',
    'Hold rhythm 4–4; if you need more calm — 4–6, lengthening the exhale.',
    'Make the exhale a whispered "ha" or through the nose — choose what\'s softer.',
    'Imagine the horizon line inside the chest: don\'t rush to the crest, don\'t fear the pause at shore.',
    'If attention drifts — return to the side ribs: their widening is the sign of a true wave.',
    'Reduce the effort to "almost no movement" — leave only smoothness.',
    'Let the breath become a continuous tide and ebb — without sharp edges.',
    'Notice how the exhale takes away excess tension and returns clarity.',
    'Trust the water within — it knows its own rhythm.',
  ],
  p2_7: [
    'Stand softly: knees — springs, spine — a flexible axis, shoulders and jaw relaxed.',
    'Make a 360° circle of attention: left, right, forward, back, up, down — where is the breath easier?',
    'A sign of the true vector — a longer exhale, more warmth, the body itself "goes" there.',
    'Allow micro-yielding: on the exhale let the torso shift slightly toward ease (1–2°).',
    'Keep contact with the feet; let the support remain wide and warm.',
    'If doubt appears — return to center on the inhale, listen to the exhale again.',
    'Note the zones of "resistance" — there is less air, more cold, the movement "breaks". Don\'t insist.',
    'Follow the sensations: ease, warmth, smoothness — that\'s the language of water within you.',
    'Reduce amplitude: leave the sense of the vector within, like a quiet compass needle.',
    'Drop the goal; find the right rhythm: inhale gathers, exhale confirms direction.',
    'Keep the gaze soft and the neck free — intuition flows along the axis.',
    'Anchor the sense with the phrase: "Where it\'s easier — that\'s the way."',
  ],
  p2_8: [
    'Set your gaze on a calm point at eye level; let it be soft, the periphery — open.',
    'Find a light continuous micro-movement — torso swaying or a figure-eight (5–10% amplitude).',
    'Breathe evenly: inhale and exhale equal (4–4); if attention frays — lengthen the exhale (4–6).',
    'Bind attention to breath: on the inhale say silently "here", on the exhale — "now".',
    'Keep an "attention thread" from the chest center to the chosen point — thin, but steady.',
    'Let shoulders and jaw be free; the neck — long, the crown — toward the sky.',
    'If thoughts pull you away — return to the gaze point, to the soles, and to the long exhale.',
    'Scan three supports: feet warm → belly soft → heart quiet.',
    'Keep the movement continuous, but ever less visible — attention stays, amplitude fades.',
    'Let the outer wave flow, while the inner center remains still.',
    'Repeat the tuning phrase: "I move — and remain here."',
  ],
  p2_9: [
    'Stand stably: feet hip-width, knees soft, axis — long.',
    'Begin with a smooth micro-movement forward-back or a light "figure-eight" of the torso.',
    'Note the center — a warm belly. It stays calm with any change of vector.',
    'On the inhale gather into the axis; on the exhale change direction by 5–10° — barely visible.',
    'Listen to quality: if a "jerk" appears — reduce amplitude and lengthen the exhale.',
    'Explore changes: left ↔ right, forward ↔ back, up ↔ down — wherever breath is easier, that\'s right.',
    'Carry weight through the "middle of the foot", don\'t fall into toes/heels.',
    'Shoulders and jaw relaxed; gaze soft, periphery open.',
    'Make a series of "micro-turns": inhale — gather, exhale — turn the trajectory and immediately stabilize.',
    'Keep continuity: a new vector is born from the previous exhale.',
    'If you lose balance — return to center on the inhale and to the contact of feet with the ground.',
    'Simplify to "almost still" — keeping the sense within that the trajectory changes easily on demand.',
  ],
  p2_10: [
    'Sit or stand comfortably; choose the simplest stable posture.',
    'Allow the micro-movement that was there before to gradually melt away.',
    'Breathe softly: inhale — chest widens barely; exhale — everything settles and quiets.',
    'Lengthen the exhale (4–6), notice the brief natural pause after it.',
    'Imagine a smooth lake within the chest: each inhale — a light ripple, each exhale — a mirror.',
    'Soften the gaze and forehead, drop the shoulders, relax the tongue; let the jaw become heavy and free.',
    'Hold attention in three supports: feet/sit-bones → warm belly → quiet heart.',
    'If a thought raises a "wave" — note it and return to the pause after the exhale.',
    'Reduce amplitude to "almost still", leaving only the breath as a fine ripple beneath the surface.',
    'Feel how, within the stillness, life keeps softly pulsing — without effort, naturally.',
    'Stay in this quality for a few more breaths, until silence becomes tangible — like weight.',
  ],
  p2_11: [
    'Close your eyes or soften the gaze; let surface movements almost disappear.',
    'Place attention in the lower belly and in the back — there the deep current begins.',
    'On the inhale feel a quiet force rise within; on the exhale — it flows down to the feet.',
    'Imagine an "underwater river" beneath the chest: it\'s slow, heavy, reliable.',
    'Breathe through the lower body — widen the sides and lower back; the upper body stays free and light.',
    'Release shoulders and jaw; let weight gently flow down into the support.',
    'If the mind drifts to the surface (thoughts, noise), return to the low warm current in the belly.',
    'Match the step of the current with inhale/exhale — it\'s the riverbed moving into depth.',
    'Check the axis: crown up, sacrum down; the current flows along the spine.',
    'Reduce all visible movement to "almost zero", leaving only the sense of a deep undercurrent.',
    'Let this current "carry" attention — without effort, but surely.',
    'Keep contact with the feet: the depth always finds its way to the earth.',
  ],
  p2_12: [
    'Sit or lie comfortably; soften shoulders, jaw, gaze.',
    'Imagine a distant horizon: breath travels toward it and returns.',
    'On the inhale — a quiet "call" of the body to space; on the exhale — a soft "answer" of space within the chest.',
    'Listen for the echo in ribs and back: where it sounds warmer and wider — there is your center.',
    'Let the exhale be longer; notice the pause — within it, hearing is keenest.',
    'If thoughts raise "noise", return to the touch of air at the nostrils and to the response in the chest.',
    'Open hearing to 360°: distant sounds — like the sea, near sounds — like the shore of the heart.',
    'Breathe without effort; let the answer find its own way through the body — from chest to belly, to pelvis, to feet.',
    'Reduce outer movements to "almost still", leaving only the wave of the answer within.',
    'Sustain the sense of dialogue: the inhale asks, the exhale understands.',
    'End with several warm exhales, attention in the chest center — the echo turns into light.',
  ],
};
for (const k of Object.keys(EN_P2)) data.en.guiding_texts[k] = EN_P2[k];

// ─── p4_2 — RU/UK/ZH expansion to EN's 12 lines ────────────────────────
// Lines 6-12 in EN already exist. Translate them to RU/UK/ZH.
const EXTRA_P4_2 = {
  ru: [
    'Прислушайся, как в этот момент внутри устанавливается тишина: мозг занят анализом среды.',
    'Этот «нюх» обрывает нить тревожного диалога, возвращая тебя в «здесь и сейчас».',
    'Почувствуй, как зрачки становятся острее, а слух — чутче.',
    'Ты больше не жертва своих чувств; ты — активный наблюдатель, изучающий мир.',
    'Отметь три запаха или просто ощущение свежести вокруг.',
    'Пусть этот импульс любопытства вытеснит остатки эмоционального тумана.',
    'Дыши теперь спокойно, но сохрани этот острый край внимания.',
  ],
  uk: [
    'Прислухайся, як у цю мить усередині встановлюється тиша: мозок зайнятий аналізом середовища.',
    'Цей «нюх» обриває нитку тривожного діалогу, повертаючи тебе у «тут і зараз».',
    'Відчуй, як зіниці стають гострішими, а слух — чутливішим.',
    'Ти більше не жертва своїх почуттів; ти — активний спостерігач, що вивчає світ.',
    'Зауваж три запахи або просто відчуття свіжості довкола.',
    'Нехай цей імпульс цікавості витіснить рештки емоційного туману.',
    'Дихай тепер спокійно, але збережи цей гострий край уваги.',
  ],
  zh: [
    '聆听此刻内里如何归于寂静:你的大脑正忙于分析环境。',
    '这一「嗅」斩断焦虑对话之线,把你带回「此时此地」。',
    '感受瞳孔变得更锐利,听觉变得更敏锐。',
    '你不再是自身感受的受害者;你是主动的观察者,正在研究世界。',
    '留意三种气味,或仅仅是周遭那份清新之感。',
    '让这股好奇的冲动,把情绪雾霭的残余排开。',
    '此刻平静地呼吸,但守住这份锐利的注意力之锋。',
  ],
};
for (const l of ['ru','uk','zh']) {
  data[l].guiding_texts.p4_2 = data[l].guiding_texts.p4_2.concat(EXTRA_P4_2[l]);
}

// ─── eliza.fallback — add {{fragment}} line to RU at position 5, ───────
// then expand all langs to RU's 11-line structure.
// New RU structure (11): 1-4 same, 5 = {{fragment}}, 6-11 = old RU 5-10.
const NEW_RU_FALLBACK = [
  'Расскажи мне об этом подробнее.',
  'Как ты себя чувствуешь по этому поводу?',
  'Что это значит для тебя?',
  'Можешь рассказать больше?',
  'Как выглядело бы, если бы стало хотя бы на 5% легче с «{{fragment}}»?',
  'Что ещё приходит на ум, когда ты думаешь об этом?',
  'Это важно для тебя. Продолжай.',
  'Я слушаю. Что ещё ты хочешь сказать?',
  'Понимаю. А что ты чувствуешь по этому поводу?',
  'Интересно. Как это влияет на твою повседневную жизнь?',
  'Как давно ты об этом думаешь?',
];
data.ru.eliza.fallback = NEW_RU_FALLBACK;

// EN/ES/UK/ZH: lines 1-5 already exist (4 generic + {{fragment}}). Append 6 new lines.
const APPEND_FALLBACK = {
  en: [
    'What else comes to mind when you think about this?',
    'This matters to you. Go on.',
    'I\'m listening. What else would you like to say?',
    'I understand. And how do you feel about it?',
    'Interesting. How does this affect your daily life?',
    'How long have you been thinking about this?',
  ],
  es: [
    '¿Qué más te viene a la mente cuando piensas en esto?',
    'Esto te importa. Continúa.',
    'Te escucho. ¿Qué más quieres decir?',
    'Entiendo. ¿Y cómo te sientes al respecto?',
    'Interesante. ¿Cómo afecta esto a tu vida diaria?',
    '¿Cuánto tiempo llevas pensando en esto?',
  ],
  uk: [
    'Що ще спадає тобі на думку, коли ти думаєш про це?',
    'Це важливо для тебе. Продовжуй.',
    'Я слухаю. Що ще ти хочеш сказати?',
    'Розумію. А що ти відчуваєш із цього приводу?',
    'Цікаво. Як це впливає на твоє повсякденне життя?',
    'Як давно ти про це думаєш?',
  ],
  zh: [
    '当你想到这件事时,还有什么浮现在脑海?',
    '这对你很重要。继续说。',
    '我在听。你还想说些什么?',
    '我明白。那么,你对此有何感受?',
    '有意思。这件事如何影响你的日常生活?',
    '你思考此事有多久了?',
  ],
};
for (const l of ['en','es','uk','zh']) {
  data[l].eliza.fallback = data[l].eliza.fallback.concat(APPEND_FALLBACK[l]);
}

// Write back
for (const l of langs) {
  fs.writeFileSync('public/locales/' + l + '/translation.json', JSON.stringify(data[l], null, 2) + '\n');
}
console.log('Done. Lengths:');
for (const l of langs) console.log('  ' + l + ': p2_1=' + data[l].guiding_texts.p2_1.length + '  p4_2=' + data[l].guiding_texts.p4_2.length + '  eliza.fallback=' + data[l].eliza.fallback.length);
