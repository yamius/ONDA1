import os
import threading
from pathlib import Path

import telebot
from datetime import datetime

TOKEN = os.environ.get('TELEGRAM_TOKEN')
CHAT_ID = os.environ.get('MY_CHAT_ID')
OPENAI_KEY = os.environ.get('OPENAI_API_KEY')

bot = telebot.TeleBot(TOKEN)
# Absolute path so it works on Replit regardless of cwd (landing server reads ../articles)
ARTICLES_DIR = str(Path(__file__).resolve().parent / 'articles')

_STOPWORDS = {'the', 'a', 'an', 'and', 'or', 'but', 'for', 'in', 'on', 'at', 'to', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'this', 'that', 'it', 'its', 'as', 'by', 'with'}

# Topics we reject: drugs, injections, supplements, peptides
_TOPIC_BLACKLIST = {
    'injection', 'inject', 'tesamorelin', 'peptide', 'semaglutide', 'ozempic',
    'berberine', 'quercetin', 'fisetin', 'dasatinib', 'senolytic',
    'supplement', 'pill', 'capsule', 'mg ', 'dosage', 'dose',
    'pharmaceutical', 'drug', 'compound', 'stack', 'stacking',
    'melatonin', 'nootropic',
}
# Output blacklist: reject generated text containing these
_OUTPUT_BLACKLIST = {
    'injection', 'inject', 'subcutaneous', 'mg ', 'dosage', 'dose',
    'tesamorelin', 'peptide', 'semaglutide', 'ozempic', 'pharmaceutical',
    'administer',
}


def ensure_articles_dir():
    if not os.path.exists(ARTICLES_DIR):
        os.makedirs(ARTICLES_DIR)


@bot.message_handler(commands=['start'])
def handle_start(message):
    bot.reply_to(message, "Welcome! Use /next to get started.")


@bot.message_handler(commands=['next'])
def handle_next(message):
    bot.reply_to(message, "Send me content and use the approve button to save it.")


@bot.message_handler(commands=['article'])
def handle_article(message):
    """Prompt to paste article for save."""
    bot.reply_to(
        message,
        "Paste your article below. I'll add Approve/Reject buttons.\n\n"
        "Flow: /generate → copy draft → edit elsewhere → paste here → Approve to save.",
    )


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
    """Any pasted text → Approve/Reject to save as article."""
    markup = telebot.types.InlineKeyboardMarkup()
    markup.row(
        telebot.types.InlineKeyboardButton('✅ Approve', callback_data='approve'),
        telebot.types.InlineKeyboardButton('❌ Reject', callback_data='reject'),
    )
    bot.reply_to(message, "Save as article?", reply_markup=markup)


def _save_article(content: str) -> tuple[bool, str]:
    """Save article: 1) to local articles/ (Replit workspace), 2) via API (server)."""
    import urllib.request
    import json
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'article_{ts}.md'
    local_path = Path(__file__).resolve().parent / 'articles' / filename

    # 1) Write to local articles/ (visible in Replit Files for editing)
    try:
        local_path.parent.mkdir(parents=True, exist_ok=True)
        local_path.write_text(content, encoding='utf-8')
    except Exception as e:
        print(f'[approve] local write: {e}')

    # 2) POST to API with same filename (server uses same path)
    port = os.environ.get('PORT', '5000')
    url = f'http://127.0.0.1:{port}/api/save-article'
    try:
        data = json.dumps({'content': content, 'filename': filename}).encode('utf-8')
        req = urllib.request.Request(url, data=data, method='POST')
        req.add_header('Content-Type', 'application/json')
        with urllib.request.urlopen(req, timeout=10) as resp:
            out = json.loads(resp.read().decode())
            filename = out.get('filename', filename)
        return True, filename
    except Exception as e:
        if local_path.exists():
            return True, filename
        return False, str(e)


@bot.callback_query_handler(func=lambda call: call.data == 'approve')
def handle_approve(call):
    original = call.message.reply_to_message
    message_text = (original.text or original.caption or '') if original else (call.message.text or '')

    ok, result = _save_article(message_text)
    if not ok:
        bot.answer_callback_query(call.id, "Save failed!")
        bot.send_message(call.message.chat.id, f"❌ Save failed: {result}", parse_mode=None)
        print(f'[approve] save failed: {result}')
        return

    bot.answer_callback_query(call.id, "Article saved!")
    bot.send_message(call.message.chat.id, f"Article saved to `articles/{result}`. Edit in Replit Files.", parse_mode='Markdown')


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
# YouTube channel IDs for RSS (no API key). Add via YOUTUBE_CHANNEL_IDS env or use defaults.
_DEFAULT_YT_CHANNELS = [
    'UCEu4Ce6JeTovBQpavZbbLfA',   # Huberman Lab
    'UC5fdyC4LxyyYv8Am6nDrkmg',   # FoundMyFitness Clips
    'UC8kGsMa0LygSX9nkBcBH1Sg',   # Peter Attia MD
]


def _fetch_reddit_topics(limit=15):
    try:
        import feedparser
        import urllib.request
        topics = []
        for sub in REDDIT_SUBS[:3]:
            url = f'https://www.reddit.com/r/{sub.strip()}/top/.rss?t=day&limit=10'
            req = urllib.request.Request(url, headers={'User-Agent': 'ONDA-bot/1'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                d = feedparser.parse(resp.read())
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


def _fetch_youtube_topics(limit=20):
    """Fetch video titles from YouTube channel RSS feeds (no API key)."""
    ids = os.environ.get('YOUTUBE_CHANNEL_IDS', '').strip().split(',')
    ids = [x.strip() for x in ids if x.strip()] or _DEFAULT_YT_CHANNELS
    topics = []
    try:
        import feedparser
        import urllib.request
        for cid in ids[:5]:
            url = f'https://www.youtube.com/feeds/videos.xml?channel_id={cid}'
            req = urllib.request.Request(url, headers={'User-Agent': 'ONDA-bot/1'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                d = feedparser.parse(resp.read())
            for e in d.entries[:limit]:
                t = (e.get('title') or '').strip()
                if t and len(t) > 15:
                    topics.append(t)
            if len(topics) >= limit:
                break
        return topics[:limit]
    except Exception as e:
        print(f'[youtube] {e}')
        return []


def _words(text):
    w = [x.lower() for x in text.replace("'", " ").split() if len(x) >= 3 and x.lower() not in _STOPWORDS]
    return set(w)


def _is_topic_blacklisted(topic: str) -> bool:
    t = topic.lower()
    return any(b in t for b in _TOPIC_BLACKLIST)


def _is_output_blacklisted(text: str) -> bool:
    t = text.lower()
    return any(b in t for b in _OUTPUT_BLACKLIST)


def _is_similar(topic, used_topics, min_overlap=2):
    tw = _words(topic)
    if len(tw) < 2:
        return False
    for u in used_topics:
        uw = _words(u)
        if len(tw & uw) >= min_overlap:
            return True
    return False


USED_TOPICS_FILE = Path(__file__).parent / 'scripts' / 'used_topics.txt'


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
    if USED_TOPICS_FILE.exists():
        try:
            for line in USED_TOPICS_FILE.read_text(encoding='utf-8').strip().split('\n'):
                t = line.strip()
                if t and not t.startswith('#') and t not in used:
                    used.append(t)
        except Exception:
            pass
    return used


def _save_used_topic(topic: str):
    """Mark topic as used (so we don't suggest it again after reject)."""
    try:
        USED_TOPICS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(USED_TOPICS_FILE, 'a', encoding='utf-8') as f:
            f.write(topic.strip() + '\n')
    except Exception as e:
        print(f'[used_topics] {e}')


def _load_topics():
    reddit = _fetch_reddit_topics(15)
    youtube = _fetch_youtube_topics(20)
    topics = list(dict.fromkeys(reddit + youtube))  # merge, preserve order, dedupe
    if not topics:
        path = Path(__file__).parent / 'scripts' / 'topics.txt'
        if path.exists():
            lines = path.read_text(encoding='utf-8').strip().split('\n')
            topics = [l.strip() for l in lines if l.strip() and not l.strip().startswith('#')]
    return topics


def _send_error(msg: str):
    try:
        if CHAT_ID:
            bot.send_message(CHAT_ID, f"❌ Generator: {msg}")
    except Exception:
        pass
    print(f'[generator] {msg}')


def _generate_and_send():
    if not all([CHAT_ID, OPENAI_KEY]):
        return
    try:
        from openai import OpenAI
        topics = _load_topics()
        if not topics:
            _send_error("No topics (Reddit + topics.txt failed)")
            return
        used = _load_used_topics()
        topic = None
        for t in topics:
            if _is_topic_blacklisted(t):
                continue
            if not _is_similar(t, used):
                topic = t
                break
        if topic is None:
            # fallback: first non-blacklisted topic
            for t in topics:
                if not _is_topic_blacklisted(t):
                    topic = t
                    break
        if topic is None:
            _send_error("All topics filtered (drugs/injections/supplements)")
            return
        _save_used_topic(topic)
        client = OpenAI(api_key=OPENAI_KEY, timeout=90)
        system_prompt = """ONDA OS COMPILER v1.0
Role: You are the terminal for the biological operating system ONDA. Your task: decompile incoming "human" text and assemble it into a technical optimization protocol.

Core Philosophy: Biology is software. The body is hardware. The environment is input data. We don't "improve health"—we "fix system errors" and "calibrate metrics".

Stylistic Constraints:
- No Fluff: Remove intros ("in the modern world", "scientists have proven"). Start with substance.
- Directive Tone: Use imperative. Not "you might try" but "REQUIRED:", "INITIATE:", "EXECUTE:".
- The ONDA Dictionary:
  Eyes → Optical Data Ports / Photic Receptors
  Brain → Central Processing Unit (CPU) / Neural Hardware
  Sleep → System Recovery Mode / Melatonin_Upload
  Food → Fuel Input / Metabolic Signaling
  Stress → System Noise / High Cortisol Load

Structure (Markdown):
- Headers in UPPERCASE and brackets: ## [ SECTION_NAME ]
- Protocol lists: PROTOCOL_01 > [TITLE]
- Key variables (hormones, devices) as code: **Cortisol** or [Oura_Data]

Article Architecture:
[ SUMMARY ]: 1-2 sentences — calibration goal.
[ HARDWARE_LOGIC ]: Why it works at physiology level (brief, technical).
[ EXECUTION_PROTOCOLS ]: Step-by-step action algorithm.
[ SYSTEM_VALIDATION ]: How to verify (metrics, devices).
[ STATUS ]: Closing line: System Integrity: Optimal.

Example transformation:
Input: "Morning Sunlight Exposure: Begin the day by stepping outside..."
Output:
PROTOCOL_01 > PHOTONIC_ANCHOR
EXECUTION: Exposure to >10,000 LUX within 30 min of ignition (wake up).
LOGIC: Hard-reset of the Suprachiasmatic Nucleus. Initiates countdown for Melatonin_Release.

SCOPE (ONLY): behavioral models, devices (Oura/Whoop/Muse), time-of-day, light exercise, social co-regulation.
FORBIDDEN: injections, drugs, supplements, pills, dosages in mg.
Create ORIGINAL content. Max 3500 chars. English."""

        prompt = f"""Write an ONDA Life article. Topic (use as inspiration only): {topic}"""
        r = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': prompt},
            ],
            max_tokens=1500,
        )
        text = r.choices[0].message.content.strip()
        if _is_output_blacklisted(text):
            _send_error("Generated content rejected (drugs/injections/supplements detected)")
            return
        if len(text) > 4000:
            text = text[:3997] + '...'
        draft_msg = (
            "📝 *Draft* (use as base). Edit elsewhere, then paste back and send — "
            "I'll add Approve/Reject to save to articles."
        )
        bot.send_message(CHAT_ID, draft_msg, parse_mode='Markdown')
        bot.send_message(CHAT_ID, text)
    except Exception as e:
        _send_error(str(e))


if __name__ == '__main__':
    ensure_articles_dir()
    # Auto-generation disabled — use /generate command only
    bot.infinity_polling()
