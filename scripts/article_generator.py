#!/usr/bin/env python3
"""
Article generator: finds topics → OpenAI → sends to Telegram.
Run: uv run python scripts/article_generator.py [topic]
Or: uv run python scripts/article_generator.py  (picks from topics.txt)
"""
import os
import sys
from pathlib import Path

import telebot
from openai import OpenAI

TOKEN = os.environ.get('TELEGRAM_TOKEN')
CHAT_ID = os.environ.get('MY_CHAT_ID')
OPENAI_KEY = os.environ.get('OPENAI_API_KEY')

if not all([TOKEN, CHAT_ID, OPENAI_KEY]):
    print("Missing env: TELEGRAM_TOKEN, MY_CHAT_ID, OPENAI_API_KEY")
    sys.exit(1)

bot = telebot.TeleBot(TOKEN)
client = OpenAI(api_key=OPENAI_KEY)

PROMPT = """Write a short ONDA Life style article (max 3500 chars) in English.

Structure:
- [ ARTICLE: TITLE // SUBTITLE ]
- THE INTRO (2-3 sentences)
- THE HACK: [ PROTOCOL_NAME ] (3-5 bullet points)
- THE LOGIC (2-3 paragraphs)
- [ HARDWARE_VALIDATION ] block with DEVICE, METRIC, STATUS

Style: technical, biohacking, biocomputer metaphor. Markdown. No images.
Topic: {topic}"""


def load_topics() -> list[str]:
    path = Path(__file__).parent / "topics.txt"
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8").strip().split("\n")
    return [l.strip() for l in lines if l.strip() and not l.strip().startswith("#")]


def generate_article(topic: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You write ONDA Life biohacking articles. Technical, markdown, under 3500 chars."},
            {"role": "user", "content": PROMPT.format(topic=topic)},
        ],
        max_tokens=1500,
    )
    return response.choices[0].message.content.strip()


def send_to_telegram(text: str) -> None:
    if len(text) > 4000:
        text = text[:3997] + "..."
    markup = telebot.types.InlineKeyboardMarkup()
    markup.add(telebot.types.InlineKeyboardButton("✅ Approve", callback_data="approve"))
    bot.send_message(CHAT_ID, text, reply_markup=markup, parse_mode=None)


def main():
    if len(sys.argv) > 1:
        topic = " ".join(sys.argv[1:])
    else:
        topics = load_topics()
        if not topics:
            print("No topics in scripts/topics.txt. Usage: python article_generator.py <topic>")
            sys.exit(1)
        topic = topics[0]
        print(f"Using topic: {topic}")

    print("Generating...")
    article = generate_article(topic)
    print("Sending to Telegram...")
    send_to_telegram(article)
    print("Done. Check Telegram and click Approve to save.")


if __name__ == "__main__":
    main()
