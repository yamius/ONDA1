// src/bot/crisisDetection.ts
//
// Minimal, on-device crisis / self-harm detection for the Liza support chat.
// Liza is an ELIZA-style + scripted-flow companion (NOT a therapist, NOT an
// emergency service). When a user expresses self-harm or suicidal intent we must
// stop the reflective small-talk and surface a real resource instead.
//
// No network, no logging of the message — detection is a pure substring match
// over a union of keywords across all supported languages (en/es/ru/uk/zh), so
// it fires regardless of which language the user typed in. Erring toward
// catching is intentional: a rare false positive just shows a help message.

const CRISIS_KEYWORDS: string[] = [
  // English
  'kill myself', 'killing myself', 'kill me', 'want to die', 'wanna die',
  'end my life', 'end it all', 'take my own life', 'suicide', 'suicidal',
  'self harm', 'self-harm', 'hurt myself', 'harm myself', 'cut myself',
  "don't want to live", 'dont want to live', 'no reason to live', 'better off dead',
  // Spanish
  'suicid', 'quiero morir', 'quitarme la vida', 'matarme', 'hacerme daño',
  'no quiero vivir', 'acabar con mi vida',
  // Russian
  'покончить с собой', 'покончу с собой', 'покончить жизнь', 'не хочу жить',
  'не хочется жить', 'убить себя', 'убью себя', 'суицид',
  'свести счёты с жизнью', 'свести счеты с жизнью', 'хочу умереть',
  'причинить себе вред', 'покончу с жизнью',
  // Ukrainian
  'покінчити з собою', 'не хочу жити', 'вбити себе', 'суїцид', 'хочу померти',
  'заподіяти собі',
  // Chinese
  '自杀', '想死', '不想活', '结束生命', '结束自己', '伤害自己', '活不下去',
];

/** True if the text looks like a self-harm / suicidal expression. */
export function detectCrisis(text: string | undefined | null): boolean {
  if (!text) return false;
  const s = text.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => s.includes(k));
}

type Lang = 'en' | 'es' | 'ru' | 'uk' | 'zh';

// Localized crisis responses. Every locale leads with findahelpline.com (an
// international directory that routes to the correct local line) + the local
// emergency number, plus a well-known national line where we're confident of it.
// Kept here (not in translation.json) so the safety copy is co-located, reviewed
// as one unit, and can't be broken by an unrelated locale-file edit.
const CRISIS_MESSAGES: Record<Lang, string> = {
  en:
    "It sounds like you may be in real pain right now. I'm a simple support " +
    "companion — not a crisis service — so please reach out to someone who can " +
    "help right now:\n\n" +
    "• US: call or text 988 (Suicide & Crisis Lifeline)\n" +
    "• Anywhere: findahelpline.com\n" +
    "• If you're in immediate danger, call your local emergency number.\n\n" +
    "You deserve real support, and you don't have to go through this alone.",
  es:
    "Parece que estás pasando por un dolor muy real. Soy solo un acompañante de " +
    "apoyo, no un servicio de crisis, así que por favor contacta con alguien que " +
    "pueda ayudarte ahora mismo:\n\n" +
    "• España: 024 (línea de atención a la conducta suicida)\n" +
    "• En cualquier país: findahelpline.com\n" +
    "• Si hay peligro inmediato, llama a tu número de emergencias local.\n\n" +
    "Mereces apoyo real y no tienes que pasar por esto en soledad.",
  ru:
    "Похоже, тебе сейчас по-настоящему тяжело. Я — простой собеседник для " +
    "поддержки, а не кризисная служба, поэтому, пожалуйста, обратись к тем, кто " +
    "может помочь прямо сейчас:\n\n" +
    "• Россия: 8-800-2000-122 (бесплатно, круглосуточно)\n" +
    "• В любой стране: findahelpline.com\n" +
    "• Если есть угроза жизни — позвони в скорую (112).\n\n" +
    "Ты заслуживаешь настоящей поддержки, и ты не один.",
  uk:
    "Схоже, тобі зараз по-справжньому боляче. Я — простий співрозмовник для " +
    "підтримки, а не кризова служба, тож, будь ласка, звернися до тих, хто може " +
    "допомогти просто зараз:\n\n" +
    "• Україна: 7333 (Lifeline Ukraine, безкоштовно, цілодобово)\n" +
    "• У будь-якій країні: findahelpline.com\n" +
    "• Якщо є загроза життю — телефонуй 112.\n\n" +
    "Ти заслуговуєш на справжню підтримку, і ти не сам.",
  zh:
    "听起来你现在可能非常痛苦。我只是一个简单的陪伴助手，不是危机服务，所以请联系" +
    "能够立刻帮助你的人：\n\n" +
    "• 任何地区：findahelpline.com（查找当地求助热线）\n" +
    "• 如果有立即危险，请拨打当地紧急电话。\n\n" +
    "你值得获得真正的支持，你并不孤单。",
};

/** Localized crisis message for the given UI language (falls back to English). */
export function crisisMessage(lang: string | undefined): string {
  const key = (lang ?? 'en').substring(0, 2) as Lang;
  return CRISIS_MESSAGES[key] ?? CRISIS_MESSAGES.en;
}
