import os
import telebot
from datetime import datetime

TOKEN = os.environ.get('TELEGRAM_TOKEN')
bot = telebot.TeleBot(TOKEN)

ARTICLES_DIR = 'articles'


def ensure_articles_dir():
    if not os.path.exists(ARTICLES_DIR):
        os.makedirs(ARTICLES_DIR)


@bot.message_handler(commands=['start'])
def handle_start(message):
    bot.reply_to(message, "Welcome! Use /next to get started.")


@bot.message_handler(commands=['next'])
def handle_next(message):
    bot.reply_to(message, "Send me content and use the approve button to save it.")


@bot.message_handler(func=lambda message: message.text and not message.text.startswith('/'))
def handle_text(message):
    markup = telebot.types.InlineKeyboardMarkup()
    markup.add(telebot.types.InlineKeyboardButton('Approve', callback_data='approve'))
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


if __name__ == '__main__':
    ensure_articles_dir()
    bot.infinity_polling()
