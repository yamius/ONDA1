// src/bot/eliza.ts
// ELIZA-style conversational module with i18n support.
// IMPORTANT: Not a real therapist or emergency service.

export type TFunction = (key: string, options?: Record<string, unknown>) => string;

const REFLECTIONS_EN: Record<string, string> = {
  "i": "you",
  "me": "you",
  "my": "your",
  "mine": "yours",
  "am": "are",
  "myself": "yourself",
  "you": "I",
  "your": "my",
  "yours": "mine",
  "yourself": "myself",
  "we": "you",
  "us": "you",
  "our": "your",
  "ours": "yours"
};

const REFLECTIONS_RU: Record<string, string> = {
  "я": "ты",
  "меня": "тебя",
  "мне": "тебе",
  "мной": "тобой",
  "мою": "твою",
  "моя": "твоя",
  "моё": "твоё",
  "мои": "твои",
  "ты": "я",
  "тебя": "меня",
  "тебе": "мне",
  "тобой": "мной",
  "твоя": "моя",
  "твой": "мой",
  "твоё": "моё",
  "твои": "мои"
};

type PatternType = 'empty' | 'greeting' | 'thanks' | 'feelings' | 'thinking' | 'fallback';

interface PatternRule {
  pattern: RegExp;
  type: PatternType;
}

const PATTERNS: PatternRule[] = [
  { pattern: /^\s*$/u, type: 'empty' },
  { pattern: /^(привет|здравствуй|добрый|hi|hello|hey|good\s+(morning|afternoon|evening|night))[\s.!?]*$/iu, type: 'greeting' },
  { pattern: /^(спасибо|благодарю|thanks|thank you|thx)[\s.!?]*$/iu, type: 'thanks' },
  { pattern: /(чувств|feel|ощуща|переживаю|feeling)(.*)/iu, type: 'feelings' },
  { pattern: /(думаю|think|мысл|thought|размышля)(.*)/iu, type: 'thinking' },
  { pattern: /(.*)/u, type: 'fallback' }
];

function reflect(fragment: string, lang: string): string {
  const trimmed = fragment.trim();
  if (!trimmed) return "";

  const reflections = lang === 'ru' ? REFLECTIONS_RU : REFLECTIONS_EN;
  const words = trimmed.split(/\s+/);
  const result: string[] = [];

  for (const w of words) {
    const lower = w.toLowerCase();
    const replacement = reflections[lower];

    if (replacement) {
      const withCase =
        w[0] === w[0].toUpperCase()
          ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
          : replacement;
      result.push(withCase);
    } else {
      result.push(w);
    }
  }

  return result.join(" ");
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class Eliza {
  private t: TFunction;
  private lang: string;

  constructor(t: TFunction, lang: string = 'en') {
    this.t = t;
    this.lang = lang;
  }

  respond(input: string): string {
    const text = (input ?? "").trim();

    for (const rule of PATTERNS) {
      const match = rule.pattern.exec(text);
      if (match) {
        const rawFragment = match[2] ?? match[1] ?? "";
        const reflected = reflect(rawFragment, this.lang);
        
        const responses = this.t(`eliza.${rule.type}`, { returnObjects: true }) as unknown as string[];
        
        if (Array.isArray(responses) && responses.length > 0) {
          const template = pickRandom(responses);
          return template.replace(/\{\{fragment\}\}/g, reflected.trim());
        }
        
        return this.getDefaultResponse(rule.type, reflected);
      }
    }

    return this.lang === 'ru' 
      ? "Я слушаю. Расскажи мне больше о том, что у тебя на уме."
      : "I'm listening. Tell me a bit more about what's on your mind.";
  }

  private getDefaultResponse(type: PatternType, fragment: string): string {
    const defaults: Record<string, Record<PatternType, string>> = {
      en: {
        empty: "I'm here and listening. What's on your mind?",
        greeting: "Hello. What would you like to talk about today?",
        thanks: "You're welcome. Is there anything else you'd like to explore?",
        feelings: `What does it feel like when you experience ${fragment}?`,
        thinking: "What's the main thought running through your mind?",
        fallback: "Tell me more about that."
      },
      ru: {
        empty: "Я здесь и слушаю. О чём ты думаешь?",
        greeting: "Привет. О чём бы ты хотел поговорить сегодня?",
        thanks: "Пожалуйста. Есть ли ещё что-то, что хочешь обсудить?",
        feelings: `Что ты чувствуешь, когда переживаешь ${fragment}?`,
        thinking: "Какая главная мысль крутится у тебя в голове?",
        fallback: "Расскажи мне об этом подробнее."
      }
    };
    
    return defaults[this.lang]?.[type] ?? defaults.en[type];
  }
}
