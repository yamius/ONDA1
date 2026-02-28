import os
import threading
import time
from pathlib import Path

import telebot
from datetime import datetime

TOKEN = os.environ.get('TELEGRAM_TOKEN')
CHAT_ID = os.environ.get('MY_CHAT_ID')
OPENAI_KEY = os.environ.get('OPENAI_API_KEY')

bot = telebot.TeleBot(TOKEN)
ARTICLES_DIR = 'articles'
INTERVAL_HOURS = int(os.environ.get('ARTICLE_INTERVAL_HOURS', '24'))
FIRST_DELAY_SEC = int(os.environ.get('ARTICLE_FIRST_DELAY_SEC', '3600'))  # 1h default

_STOPWORDS = {'the', 'a', 'an', 'and', 'or', 'but', 'for', 'in', 'on', 'at', 'to', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'this', 'that', 'it', 'its', 'as', 'by', 'with'}


def ensure_articles_dir():
    if not os.path.exists(ARTICLES_DIR):
        os.makedirs(ARTICLES_DIR)


@bot.message_handler(commands=['start'])
def handle_start(message):
    bot.reply_to(message, "Welcome! Use /next to get started.")


@bot.message_handler(commands=['next'])
def handle_next(message):
    bot.reply_to(message, "Send me content and use the approve button to save it.")


@bot.message_handler(commands=['generate'])
def handle_generate(message):
    """Generate article now (only for MY_CHAT_ID)."""
    try:
        chat_id = int(CHAT_ID) if CHAT_ID else None
    except (ValueError, TypeError):
        chat_id = None
    if not chat_id or message.chat.id != chat_id:
        bot.reply_to(message, "Not authorized.")
        return
    if not OPENAI_KEY:
        bot.reply_to(message, "OPENAI_API_KEY not set.")
        return
    bot.reply_to(message, "Generating article...")
    def run():
        _generate_and_send()
    threading.Thread(target=run, daemon=True).start()


@bot.message_handler(commands=['test'])
def handle_test(message):
    """Send sample article with Approve/Reject for testing."""
    sample = """[ ARTICLE: TEST_ARTICLE // SAMPLE ]
THE INTRO
This is a test article. Click Approve to save to articles/, or Reject to discard.
THE HACK: [ PROTOCOL_TEST ]
- Step 1
- Step 2
[ HARDWARE_VALIDATION ]
STATUS: TEST_MODE"""
    markup = telebot.types.InlineKeyboardMarkup()
    markup.row(
        telebot.types.InlineKeyboardButton('✅ Approve', callback_data='approve'),
        telebot.types.InlineKeyboardButton('❌ Reject', callback_data='reject'),
    )
    bot.reply_to(message, sample, reply_markup=markup)


@bot.message_handler(func=lambda message: message.text and not message.text.startswith('/'))
def handle_text(message):
    markup = telebot.types.InlineKeyboardMarkup()
    markup.row(
        telebot.types.InlineKeyboardButton('✅ Approve', callback_data='approve'),
        telebot.types.InlineKeyboardButton('❌ Reject', callback_data='reject'),
    )
    bot.reply_to(message, "Сохранить это сообщение как статью?", reply_markup=markup)


@bot.callback_query_handler(func=lambda call: call.data == 'approve')
def handle_approve(call):
    ensure_articles_dir()

    original = call.message.reply_to_message
    message_text = (original.text or original.caption or '') if original else (call.message.text or '')
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = os.path.join(ARTICLES_DIR, f'article_{timestamp}.md')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(message_text)

    bot.answer_callback_query(call.id, "Article saved!")
    bot.send_message(call.message.chat.id, f"Article saved to `{filename}`.", parse_mode='Markdown')


@bot.callback_query_handler(func=lambda call: call.data == 'reject')
def handle_reject(call):
    bot.answer_callback_query(call.id, "Rejected")
    try:
        bot.edit_message_reply_markup(
            chat_id=call.message.chat.id,
            message_id=call.message.message_id,
            reply_markup=None,
        )
    except Exception:
        pass


REDDIT_SUBS = os.environ.get('REDDIT_SUBS', 'biohacking,Nootropics,longevity').split(',')


def _fetch_reddit_topics(limit=10):
    try:
        import feedparser
        topics = []
        for sub in REDDIT_SUBS[:3]:
            url = f'https://www.reddit.com/r/{sub.strip()}/top/.rss?t=day&limit=10'
            d = feedparser.parse(url)
            for e in d.entries[:limit]:
                t = (e.get('title') or '').strip()
                if t and len(t) > 10:
                    topics.append(t)
            if len(topics) >= limit:
                break
        return topics[:limit]
    except Exception as e:
        print(f'[reddit] {e}')
        return []


def _words(text):
    w = [x.lower() for x in text.replace("'", " ").split() if len(x) >= 3 and x.lower() not in _STOPWORDS]
    return set(w)


def _is_similar(topic, used_topics, min_overlap=2):
    tw = _words(topic)
    if len(tw) < 2:
        return False
    for u in used_topics:
        uw = _words(u)
        if len(tw & uw) >= min_overlap:
            return True
    return False


def _load_used_topics():
    used = []
    if os.path.exists(ARTICLES_DIR):
        for f in os.listdir(ARTICLES_DIR):
            if f.endswith('.md'):
                try:
                    first = open(os.path.join(ARTICLES_DIR, f), encoding='utf-8').readline().strip()
                    if first and len(first) > 10:
                        used.append(first)
                except Exception:
                    pass
    return used


def _load_topics():
    topics = _fetch_reddit_topics(10)
    if not topics:
        path = Path(__file__).parent / 'scripts' / 'topics.txt'
        if path.exists():
            lines = path.read_text(encoding='utf-8').strip().split('\n')
            topics = [l.strip() for l in lines if l.strip() and not l.strip().startswith('#')]
    return topics


def _generate_and_send():
    if not all([CHAT_ID, OPENAI_KEY]):
        return
    try:
        from openai import OpenAI
        topics = _load_topics()
        if not topics:
            return
        used = _load_used_topics()
        topic = None
        for t in topics:
            if not _is_similar(t, used):
                topic = t
                break
        if topic is None:
            topic = topics[0]
        client = OpenAI(api_key=OPENAI_KEY)
        prompt = f"""Write a short ONDA Life style article (max 3500 chars) in English.
Structure: [ ARTICLE: TITLE // SUBTITLE ], THE INTRO, THE HACK: [ PROTOCOL_NAME ], THE LOGIC, [ HARDWARE_VALIDATION ].
Style: technical, biohacking, biocomputer metaphor. Markdown. Topic: {topic}"""
        r = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': 'ONDA Life biohacking articles. Technical, markdown, under 3500 chars.'},
                {'role': 'user', 'content': prompt},
            ],
            max_tokens=1500,
        )
        text = r.choices[0].message.content.strip()
        if len(text) > 4000:
            text = text[:3997] + '...'
        markup = telebot.types.InlineKeyboardMarkup()
        markup.row(
            telebot.types.InlineKeyboardButton('✅ Approve', callback_data='approve'),
            telebot.types.InlineKeyboardButton('❌ Reject', callback_data='reject'),
        )
        bot.send_message(CHAT_ID, text, reply_markup=markup)
    except Exception as e:
        print(f'[generator] {e}')


def _generator_loop():
    time.sleep(FIRST_DELAY_SEC)
    while True:
        _generate_and_send()
        time.sleep(INTERVAL_HOURS * 3600)


if __name__ == '__main__':
    ensure_articles_dir()
    if CHAT_ID and OPENAI_KEY:
        t = threading.Thread(target=_generator_loop, daemon=True)
        t.start()
        print(f'[generator] 1 article/day')
    bot.infinity_polling()
