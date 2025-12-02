// src/bot/eliza.ts
// Extended ELIZA-style conversational module (English only).
// IMPORTANT: Not a real therapist or emergency service.

export type Rule = {
  pattern: RegExp;
  responses: string[];
};

const REFLECTIONS: Record<string, string> = {
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

const RULES: Rule[] = [
  // 1) Empty message
  {
    pattern: /^\s*$/u,
    responses: [
      "I'm here and listening. You can start wherever feels easiest.",
      "Sometimes beginning is the hardest part. What's on your mind right now?",
      "Take your time. When you're ready, tell me a little bit about what's going on.",
      "There’s no rush. Even a single sentence about how you are can be a good place to start.",
      "You don’t have to say it perfectly. What’s one small thing you feel ready to share?",
      "We can unpack things step by step. What feels closest to the surface for you right now?"
    ]
  },

  // 2) Greetings
  {
    pattern: /^(hi|hello|hey|good (morning|afternoon|evening|night))[\s.!?]*$/iu,
    responses: [
      "Hello. What would you like to talk about today?",
      "Hi. If you had to pick one thing that's weighing on you most right now, what would it be?",
      "Hey. How are you feeling lately — even if the answer is complicated?",
      "Hi. Is there anything that has been staying in your mind more than it should?",
      "Hello. What has your week been like emotionally?",
      "Hey. If you could get a bit of support with one area of your life, which one would you choose?"
    ]
  },

  // 3) Thanks
  {
    pattern: /^(thanks|thank you|thanks a lot|thx)[\s.!?]*$/iu,
    responses: [
      "You're welcome. Is there anything else you’d like to explore?",
      "I'm glad if this feels even a little helpful. What are you thinking about now?",
      "Any time. If you want, we can keep looking at what's coming up for you.",
      "You’re welcome. Sometimes even putting things into words is already a big step.",
      "I’m here for more if you’d like to keep talking. What’s the next thought that shows up?",
      "I’m glad you said that. Is there another part of this story you’d like to look at together?"
    ]
  },

  // 4) Crisis / very strong distress
  {
    pattern: /(suicide|kill myself|kill my self|end my life|end it all|i want to die|i wish i was dead|i don['’]?t want to live|can['’]?t go on|no reason to live)/iu,
    responses: [
      "I'm really glad you reached out and put this into words. I’m not able to keep you safe or respond in an emergency, but you deserve support. If you’re in immediate danger, please contact your local emergency number or a crisis hotline in your country, or reach out to someone you trust right now.",
      "It sounds like you're in a lot of pain. I can’t provide crisis help, but you don’t have to face this alone. If you can, consider talking to a mental health professional or a trusted person, and if you're in danger, contact emergency services or a crisis line in your area.",
      "Those are very heavy feelings to carry. I can’t safely handle emergencies, but asking for human support is really important here — from a professional, a helpline, or someone close to you who can be with you in this moment.",
      "Hearing you talk about not wanting to live tells me how intense this is for you. I’m limited in what I can do, and I’m not a substitute for crisis support. If you might hurt yourself, please reach out to a crisis hotline, emergency services, or someone you trust offline.",
      "You matter, even if it doesn’t feel that way right now. I’m not equipped to keep you safe in real time, but a crisis service, doctor, or trusted person could be. Reaching out to them could be an important step.",
      "It’s very serious to feel like this, and I’m glad you typed it instead of keeping it inside. I can offer conversation, but not emergency care. If you can, please contact local emergency services, a crisis line, or someone nearby who can support you."
    ]
  },

  // 5) Anxiety (specific)
  {
    pattern: /\b(anxiety|anxious|worry|worried|on edge|nervous|restless)(.*)/iu,
    responses: [
      "When your anxiety shows up like this{fragment}, what does it usually focus on or say to you?",
      "In moments when you feel anxious{fragment}, what happens in your body and thoughts?",
      "What are the situations or triggers that most often bring up this anxiety for you?",
      "When the worry gets strong{fragment}, do you notice any small things that help it calm down even a little?",
      "If your anxiety{fragment} had a voice, what do you imagine it would be trying to protect you from?",
      "How does anxiety affect your decisions or daily life{fragment} — what do you avoid or push yourself to do?"
    ]
  },

  // 6) Panic attacks
  {
    pattern: /(panic attack|panic attacks|panic episode|panic episodes|panicking|i'm panicking|i am panicking|i have panic)(.*)/iu,
    responses: [
      "Panic attacks can feel terrifying, even though they aren’t usually dangerous. What is it like for you when one starts?",
      "When you experience a panic attack{fragment}, where in your body do you notice it first?",
      "Do you remember the first time you had a panic attack, and what was happening around that time?",
      "During a panic episode{fragment}, what thoughts run through your mind — for example, about your health, safety, or control?",
      "After the panic eases, how do you usually feel — exhausted, ashamed, relieved, something else?",
      "Have you discovered anything, even small, that helps you ride out a panic attack{fragment}, like breathing patterns or grounding techniques?"
    ]
  },

  // 7) Fear
  {
    pattern: /\b(afraid|scared|terrified|fear|frightened)(.*)/iu,
    responses: [
      "What is it that you feel most afraid of{fragment} in this situation?",
      "On a scale from 1 to 10, how strong is this fear{fragment} right now?",
      "If you imagine the fear{fragment} as a shape or image, what does it look like?",
      "Is this fear{fragment} about something happening now, or more about what could happen in the future?",
      "When you feel this scared{fragment}, what do you usually do — fight it, freeze, run away, reach out?",
      "Has there ever been a moment when you faced something similar and the outcome was less bad than you feared?"
    ]
  },

  // 8) Loneliness
  {
    pattern: /\b(lonely|alone|no one cares|no one understands|nobody cares|nobody understands)(.*)/iu,
    responses: [
      "Feeling alone like that can be very painful. When do those thoughts show up the most for you?",
      "In moments when you feel lonely{fragment}, what do you wish someone could see or understand about you?",
      "Is there anyone in your life who knows even a little bit about how alone you feel{fragment}?",
      "Sometimes loneliness is about not being truly seen, even around people. Does that resonate with you{fragment}?",
      "If there were one person you could safely be honest with about this loneliness{fragment}, who might that be?",
      "What kinds of connection — conversations, activities, shared interests — do you find yourself missing the most?"
    ]
  },

  // 9) Irritation / anger
  {
    pattern: /(angry|mad at|irritated|annoyed|frustrated|rage|furious)(.*)/iu,
    responses: [
      "Anger and irritation often show where our boundaries or needs are being crossed. What do you feel is being violated here{fragment}?",
      "When you feel this angry or irritated{fragment}, do you tend to express it outwardly or keep it inside?",
      "What is usually underneath your anger{fragment} — hurt, fear, feeling disrespected, something else?",
      "How does your body react when you get really frustrated or mad{fragment}?",
      "If your anger{fragment} could speak calmly for a moment, what would it say it wants for you?",
      "Have you noticed any patterns about who or what tends to trigger this level of irritation for you?"
    ]
  },

  // 10) Body / physical sensations
  {
    pattern: /(my body|in my body|physically|physical symptom|physical symptoms|symptoms|stomach|chest|heart is racing|heart racing|tight chest|tension|tense|dizzy|lightheaded|nausea|nauseous|headache|migraine)/iu,
    responses: [
      "It sounds like your body is carrying a lot. Where do you feel it the most — chest, stomach, head, or somewhere else?",
      "When these physical sensations show up, what is usually happening around you or in your thoughts?",
      "Do you notice if the sensations get better or worse depending on stress, rest, or certain situations?",
      "Sometimes the body speaks when words are hard. If your body could describe what it’s going through, what would it say?",
      "How do you usually respond to these physical feelings — ignore them, worry about them, try to soothe them?",
      "Have you talked with a healthcare professional about these symptoms yet? Emotional support is important, but medical input can also be helpful."
    ]
  },

  // 11) Pain (emotional / physical)
  {
    pattern: /(pain|it hurts|hurting|ache|aching|hurts so much)(.*)/iu,
    responses: [
      "What kind of pain is this for you{fragment} — emotional, physical, or a mix of both?",
      "On a scale from 1 to 10, how intense does this pain feel{fragment} right now?",
      "When did you first start noticing this kind of pain{fragment} in your life?",
      "How do you usually try to cope when it hurts this much{fragment}?",
      "If your pain{fragment} could be understood by someone else, what would you want them to know about it?",
      "Are there small moments, places, or people where this pain eases just a little, even briefly?"
    ]
  },

  // 12) “I feel / I'm feeling …”
  {
    pattern: /\b(i feel|i'm feeling|i am feeling)(.*)/iu,
    responses: [
      "Why do you feel{fragment}? If you look back, was there a moment when this started to get stronger?",
      "How long have you been feeling{fragment}? Has it stayed the same, or does it come and go in waves?",
      "When you feel{fragment}, what do you usually do — or what do you wish you could do — to take care of yourself?",
      "If you gave a name or label to this feeling{fragment}, what would you call it?",
      "What tends to make this feeling{fragment} a little better, and what tends to make it worse?",
      "If you talked to a younger version of yourself who felt{fragment}, what would you want to say to them?"
    ]
  },

  // 13) Common emotional states (sad, anxious, etc.)
  {
    pattern: /\b(i am|i'm|feel|feeling)\s+(sad|down|depressed|anxious|worried|stressed|overwhelmed|lonely|empty)(.*)/iu,
    responses: [
      "Being{fragment} can be exhausting. What does a typical day look like for you when you're in this state?",
      "When you feel{fragment}, are there particular situations, people, or thoughts that seem to make it worse?",
      "If someone you cared about told you they felt{fragment}, how would you respond to them?",
      "Do you remember a time you didn’t feel this way{fragment}? What was different about that period of your life?",
      "When this feeling{fragment} shows up, what do you most need from others — space, comfort, understanding, something else?",
      "How does this emotional state{fragment} affect your sleep, eating, or motivation?"
    ]
  },

  // 14) Harsh self-judgments
  {
    pattern: /\b(i am|i'm)\s+(a failure|a loser|worthless|useless|broken|not good enough|stupid|hopeless)(.*)/iu,
    responses: [
      "It sounds like you're being very hard on yourself. Where do you think these messages about yourself first came from?",
      "When you say you are{fragment}, is that your own voice, or does it remind you of how someone else used to talk to you?",
      "If a close friend described themselves as{fragment}, what would you want to say to them in that moment?",
      "How often do these thoughts{fragment} show up for you, and in which situations do they get the loudest?",
      "Is there any part of you that disagrees, even a little, with the idea that you are{fragment}?",
      "What small evidence exists, however tiny, that you are more than just{fragment}?"
    ]
  },

  // 15) “I think …”
  {
    pattern: /\b(i think|i believe)(.*)/iu,
    responses: [
      "What leads you to think{fragment}? Are there particular experiences that shaped this belief?",
      "How strongly do you believe{fragment} on a scale from 1 to 10, and what would move it one point in either direction?",
      "Could there be another way to look at{fragment}, even if it feels less convincing right now?",
      "If someone you trust gently questioned your belief that{fragment}, how would that feel?",
      "Is this thought{fragment} something that helps you, protects you, or mainly hurts you?",
      "When did you first remember thinking something similar to{fragment}?"
    ]
  },

  // 16) “I want / I need …”
  {
    pattern: /\b(i want|i need)(.*)/iu,
    responses: [
      "Why is it important for you to have{fragment}? What does it represent for you emotionally?",
      "If you woke up tomorrow and you already had{fragment}, what would feel different about your day?",
      "What is one very small step in the direction of{fragment} that feels realistic, even if tiny?",
      "When you think about not having{fragment}, what emotions come up the most?",
      "Is the desire for{fragment} something you’ve carried for a long time, or is it more recent?",
      "If someone else stopped you from moving toward{fragment}, what would you want to tell them?"
    ]
  },

  // 17) “I can't …”
  {
    pattern: /\b(i can['’]?t|i cannot|i'm not able to)(.*)/iu,
    responses: [
      "What makes you feel you truly can’t{fragment}? Is it more about fear, energy, skills, or something else?",
      "Has there ever been a time when you did something you thought you couldn’t — even in a different area of life?",
      "If you imagined that you could{fragment} just 5% more than now, what would that small difference look like?",
      "What do you imagine would happen if you tried to{fragment}, and it didn’t go perfectly?",
      "Are there people or circumstances around you that make it harder to{fragment}?",
      "If someone believed in your ability to{fragment}, what would they say to you right now?"
    ]
  },

  // 18) Decisions / “should I … ?”
  {
    pattern: /\bshould i\b(.*)/iu,
    responses: [
      "When you ask whether you should{fragment}, what part of you is saying “yes”, and what part is saying “no”?",
      "If you imagine yourself one year from now, looking back, what do you hope you’ll have done about{fragment}?",
      "What are the main fears and the main hopes connected to the decision to{fragment}?",
      "If a friend came to you with the exact same dilemma about whether they should{fragment}, what would you tell them?",
      "What would a very small, low-risk experiment toward{fragment} look like, without committing fully yet?",
      "What values of yours — like honesty, safety, growth, stability — are most involved in this decision?"
    ]
  },

  // 19) Relationships
  {
    pattern: /(relationship|partner|boyfriend|girlfriend|husband|wife|marriage|breakup|break up|ex\b|family|parent|mother|father|mom|dad|friend|friends)/iu,
    responses: [
      "Relationships can stir up a lot of emotions. What’s been happening between you and the other person lately?",
      "How do you usually feel during or after interactions with them — more energized, drained, anxious, relieved?",
      "If that relationship could change in one small but meaningful way, what would you want that change to be?",
      "How long has this pattern in the relationship been going on, and has it always been like this?",
      "What feels unsaid between you and this person — things you think but don’t express?",
      "If you felt completely safe and heard with them, what would you want to say about how you feel?"
    ]
  },

  // 20) Work / study / burnout
  {
    pattern: /(work|job|career|boss|coworker|colleague|office|burnout|school|university|college|study|studies|exam|exams|grades)/iu,
    responses: [
      "Work and studies can create a lot of pressure. What feels heaviest about this situation for you right now?",
      "How long have you been feeling this way about work or studies, and has anything made it slightly better or worse over time?",
      "What would “a bit more manageable” look like in this area — not perfect, just one notch easier?",
      "Do you feel more overwhelmed by the workload itself, or by expectations (from others or from yourself)?",
      "Are there any boundaries or changes you wish you could set around your work or study life?",
      "When you imagine a healthier balance with work or studies, what is one piece of that picture?"
    ]
  },

  // 21) Sleep / energy
  {
    pattern: /(sleep|insomnia|tired all the time|no energy|exhausted|can['’]?t sleep|sleeping too much|oversleeping)/iu,
    responses: [
      "Changes in sleep and energy can affect everything else. What has your sleep been like recently?",
      "Do you notice certain thoughts, worries, or habits that show up around the times you can’t sleep or feel exhausted?",
      "If your tiredness or insomnia had a message for you about your life right now, what might it be saying?",
      "How long have you noticed these changes in sleep or energy, and have they shifted over time?",
      "Are there small things that help even a little — routine, light, movement, less screen time, something else?",
      "Have you talked with a professional about your sleep or energy yet? Both emotional and physical factors can be involved."
    ]
  },

  // 22) “Why … ?”
  {
    pattern: /^why\b(.*)/iu,
    responses: [
      "If you had to guess, what are a few possible answers to why{fragment} — even if you’re not sure any of them are fully right?",
      "Sometimes the question “why{fragment}” can hide another question, like “what does this mean about me?”. Does that fit here?",
      "What part of this “why{fragment}” question hurts the most for you personally?",
      "If you never found a perfect answer to “why{fragment}”, what would you hope to understand instead?",
      "Do you feel this “why{fragment}” is more about blame, understanding, or trying to prevent it in the future?",
      "Has your answer to “why{fragment}” changed over time, even a little?"
    ]
  },

  // 23) General fallback
  {
    pattern: /(.*)/u,
    responses: [
      "Tell me a bit more about that. What part of it is the hardest for you personally?",
      "When you say “{fragment}”, what feelings or body sensations do you notice, even small ones?",
      "Why is this situation important enough that you're talking about it right now?",
      "As you think about “{fragment}”, what thoughts or images keep coming back the most?",
      "If you could change one small thing about this situation, what would you choose to start with?",
      "What do you wish other people understood about “{fragment}” that they don’t seem to see?",
      "How long has “{fragment}” been a theme in your life — is it new, or something more familiar?",
      "What would feeling even 5% better about “{fragment}” look like in practice?"
    ]
  }
];

function reflect(fragment: string): string {
  const trimmed = fragment.trim();
  if (!trimmed) return "";

  const words = trimmed.split(/\s+/);
  const result: string[] = [];

  for (const w of words) {
    const lower = w.toLowerCase();
    const replacement = REFLECTIONS[lower];

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

  const joined = result.join(" ");
  return joined ? " " + joined : "";
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class Eliza {
  respond(input: string): string {
    const text = (input ?? "").trim();

    for (const rule of RULES) {
      const match = rule.pattern.exec(text);
      if (match) {
        // For patterns like "(trigger)(.*)" we want the trailing text (group 2).
        // For patterns with only "(.*)" we use group 1.
        const rawFragment = match[2] ?? match[1] ?? "";
        const reflected = reflect(rawFragment);
        const template = pickRandom(rule.responses);
        return template.replace(/\{fragment\}/g, reflected);
      }
    }

    // Fallback (shouldn’t really be hit because of the final /(.*)/ rule)
    return "I'm listening. Tell me a bit more about what's on your mind.";
  }
}
