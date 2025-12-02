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

type PatternType = 
  | 'empty' 
  | 'greeting' 
  | 'thanks' 
  | 'feelings' 
  | 'thinking' 
  | 'tired'
  | 'work'
  | 'want'
  | 'need'
  | 'stress'
  | 'anxiety'
  | 'sad'
  | 'angry'
  | 'fear'
  | 'lonely'
  | 'difficult'
  | 'cant'
  | 'why'
  | 'how'
  | 'fallback';

interface PatternRule {
  pattern: RegExp;
  type: PatternType;
}

const PATTERNS: PatternRule[] = [
  { pattern: /^\s*$/u, type: 'empty' },
  { pattern: /^(привет|здравствуй|добрый|hi|hello|hey|good\s+(morning|afternoon|evening|night))[\s.!?]*$/iu, type: 'greeting' },
  { pattern: /^(спасибо|благодарю|thanks|thank you|thx)[\s.!?]*$/iu, type: 'thanks' },
  
  { pattern: /(устал|exhausted|tired|выматыва|измотан|вымотал|утомил|нет сил|без сил)(.*)/iu, type: 'tired' },
  { pattern: /(работ|job|work|офис|office|начальник|boss|коллег|colleague|дедлайн|deadline)(.*)/iu, type: 'work' },
  { pattern: /(хочу|want|желаю|мечтаю|хотел бы|хотелось)(.*)/iu, type: 'want' },
  { pattern: /(надо|должен|должна|must|have to|need to|обязан|приходится|заставляют)(.*)/iu, type: 'need' },
  { pattern: /(стресс|stress|напряжен|напряжён|давит|давление|pressure|перегруз)(.*)/iu, type: 'stress' },
  { pattern: /(тревог|тревож|anxiety|anxious|беспоко|волну|nervous|паник)(.*)/iu, type: 'anxiety' },
  { pattern: /(грустн|грущу|sad|sadness|печаль|тоск|уныл|подавлен|депресс)(.*)/iu, type: 'sad' },
  { pattern: /(злюсь|злость|злит|anger|angry|бесит|раздраж|ярость|fury|furious|взбеш)(.*)/iu, type: 'angry' },
  { pattern: /(боюсь|страх|страшно|fear|afraid|scared|пугает|ужас)(.*)/iu, type: 'fear' },
  { pattern: /(одинок|lonely|loneliness|никому не нужен|никто не понимает|изолир)(.*)/iu, type: 'lonely' },
  { pattern: /(сложно|трудно|тяжело|difficult|hard|непросто|не справля)(.*)/iu, type: 'difficult' },
  { pattern: /(не могу|не получается|can't|cannot|не выходит|не удаётся|не в состоянии)(.*)/iu, type: 'cant' },
  { pattern: /^(почему|why|зачем|отчего)(.*)/iu, type: 'why' },
  { pattern: /^(как|how)(.*)/iu, type: 'how' },
  
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

function pickRandom<T>(arr: T[], exclude?: T): T {
  if (arr.length === 1) return arr[0];
  const filtered = exclude ? arr.filter(item => item !== exclude) : arr;
  return filtered[Math.floor(Math.random() * filtered.length)] || arr[0];
}

export class Eliza {
  private t: TFunction;
  private lang: string;
  private lastResponses: Map<PatternType, string> = new Map();

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
          const lastUsed = this.lastResponses.get(rule.type);
          const template = pickRandom(responses, lastUsed);
          const response = template.replace(/\{\{fragment\}\}/g, reflected.trim());
          this.lastResponses.set(rule.type, template);
          return response;
        }
        
        return this.getDefaultResponse(rule.type, reflected);
      }
    }

    return this.lang === 'ru' 
      ? "Я слушаю. Расскажи мне больше о том, что у тебя на уме."
      : "I'm listening. Tell me a bit more about what's on your mind.";
  }

  private getDefaultResponse(type: PatternType, fragment: string): string {
    const defaults: Record<string, Record<PatternType, string[]>> = {
      en: {
        empty: ["I'm here and listening. What's on your mind?"],
        greeting: ["Hello. What would you like to talk about today?"],
        thanks: ["You're welcome. Is there anything else you'd like to explore?"],
        feelings: [`What does it feel like when you experience ${fragment}?`],
        thinking: ["What's the main thought running through your mind?"],
        tired: ["Exhaustion can weigh heavily. What's been draining your energy?", "It sounds like you need some rest. What's been demanding so much from you?"],
        work: ["Work can be challenging. What aspect is affecting you most?", "How is this work situation impacting your wellbeing?"],
        want: ["What's stopping you from pursuing what you want?", "That desire seems important to you. Tell me more about it."],
        need: ["That sounds like a lot of pressure. Where is this obligation coming from?", "Must be tiring to carry all these responsibilities. How does that make you feel?"],
        stress: ["Stress can be overwhelming. What's the main source right now?", "Let's take a moment to breathe. What's creating this pressure?"],
        anxiety: ["Anxiety can feel all-consuming. What triggers these feelings for you?", "When did you first notice this anxiety?"],
        sad: ["I hear sadness in your words. What's weighing on your heart?", "Sadness is a valid feeling. What brought this on?"],
        angry: ["Anger often signals something important. What's behind this feeling?", "It's okay to feel angry. What triggered this?"],
        fear: ["Fear can be protective but also limiting. What are you afraid might happen?", "Tell me more about this fear. When does it appear?"],
        lonely: ["Loneliness is painful. What kind of connection do you miss most?", "Feeling isolated is hard. When did this loneliness start?"],
        difficult: ["That does sound challenging. What makes it particularly hard?", "When things feel difficult, small steps can help. What's the hardest part?"],
        cant: ["What would change if you could?", "Sometimes 'can't' means we need a different approach. What have you tried?"],
        why: ["That's a thoughtful question. What do you think the reason might be?"],
        how: ["That's worth exploring. What ideas come to mind?"],
        fallback: ["Tell me more about that.", "How does that make you feel?", "What else comes up when you think about this?"]
      },
      ru: {
        empty: ["Я здесь и слушаю. О чём ты думаешь?"],
        greeting: ["Привет. О чём бы ты хотел поговорить сегодня?"],
        thanks: ["Пожалуйста. Есть ли ещё что-то, что хочешь обсудить?"],
        feelings: [`Что ты чувствуешь, когда переживаешь ${fragment}?`],
        thinking: ["Какая главная мысль крутится у тебя в голове?"],
        tired: [
          "Усталость забирает много сил. Что именно тебя так выматывает?",
          "Похоже, тебе нужен отдых. Что требует от тебя столько энергии?",
          "Когда последний раз ты чувствовал себя отдохнувшим?"
        ],
        work: [
          "Работа может сильно влиять на состояние. Что конкретно тебя беспокоит?",
          "Как эта рабочая ситуация отражается на твоём самочувствии?",
          "Что бы ты хотел изменить в рабочей ситуации?"
        ],
        want: [
          "Что мешает тебе получить то, чего ты хочешь?",
          "Это желание кажется важным для тебя. Расскажи подробнее.",
          "Как давно ты этого хочешь?"
        ],
        need: [
          "Это звучит как большое давление. Откуда идёт это обязательство?",
          "Нести всё это на себе, наверное, утомительно. Как ты себя при этом чувствуешь?",
          "Что произойдёт, если ты не сделаешь то, что 'надо'?"
        ],
        stress: [
          "Стресс может быть очень тяжёлым. Что является главным источником прямо сейчас?",
          "Давай сделаем паузу и подышим. Что создаёт это напряжение?",
          "Как твоё тело реагирует на этот стресс?"
        ],
        anxiety: [
          "Тревога может поглощать полностью. Что запускает эти чувства у тебя?",
          "Когда ты впервые заметил эту тревогу?",
          "Что помогает тебе успокоиться, когда накатывает тревога?"
        ],
        sad: [
          "Я слышу грусть в твоих словах. Что лежит на сердце?",
          "Грусть — это важное чувство. Что её вызвало?",
          "Когда ты чувствуешь эту грусть сильнее всего?"
        ],
        angry: [
          "Злость часто сигнализирует о чём-то важном. Что стоит за этим чувством?",
          "Злиться — нормально. Что стало триггером?",
          "Как ты обычно справляешься со злостью?"
        ],
        fear: [
          "Страх может защищать, но и ограничивать. Чего ты боишься, что может произойти?",
          "Расскажи больше об этом страхе. Когда он появляется?",
          "Что бы ты сделал, если бы не боялся?"
        ],
        lonely: [
          "Одиночество болезненно. Какого общения тебе не хватает больше всего?",
          "Чувствовать себя изолированным тяжело. Когда началось это одиночество?",
          "С кем бы ты хотел быть рядом прямо сейчас?"
        ],
        difficult: [
          "Это действительно звучит непросто. Что делает ситуацию особенно сложной?",
          "Когда всё кажется трудным, маленькие шаги могут помочь. Что самое сложное?",
          "Ты справлялся со сложными ситуациями раньше. Что помогало тогда?"
        ],
        cant: [
          "Что бы изменилось, если бы ты мог?",
          "Иногда 'не могу' означает, что нужен другой подход. Что ты уже пробовал?",
          "Что мешает тебе больше всего?"
        ],
        why: [
          "Это вдумчивый вопрос. Как ты сам думаешь, в чём причина?",
          "Интересный вопрос. Что подсказывает тебе интуиция?"
        ],
        how: [
          "Это стоит исследовать. Какие идеи приходят на ум?",
          "Хороший вопрос. Что ты уже рассматривал?"
        ],
        fallback: [
          "Расскажи мне об этом подробнее.",
          "Как ты себя при этом чувствуешь?",
          "Что ещё приходит на ум, когда ты думаешь об этом?",
          "Это важно для тебя. Продолжай.",
          "Я слушаю. Что ещё ты хочешь сказать?",
          "Понимаю. А что ты чувствуешь по этому поводу?",
          "Интересно. Можешь рассказать больше?",
          "Как это влияет на твою повседневную жизнь?"
        ]
      }
    };
    
    const responses = defaults[this.lang]?.[type] ?? defaults.en[type] ?? ["Tell me more."];
    const lastUsed = this.lastResponses.get(type);
    const response = pickRandom(responses, lastUsed);
    this.lastResponses.set(type, response);
    return response;
  }
}
