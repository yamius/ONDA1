import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Eliza } from '../bot/eliza';
import { ConversationEngine, createInitialState } from '../bot/conversationEngine';
import type { BotMessage, EngineState } from '../bot/conversationEngine';
import { flows } from '../bot/flowsIndex';

interface LizaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmotion?: string;
}

type ChatMessage = {
  id: string;
  from: 'user' | 'bot';
  text: string;
  ui?: BotMessage;
};

const eliza = new Eliza();

export function LizaChatModal({ isOpen, onClose, initialEmotion }: LizaChatModalProps) {
  const { t } = useTranslation();
  const [engine] = useState(() => new ConversationEngine({ eliza, flows, t }));
  const [state, setState] = useState<EngineState>(() => createInitialState());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = t('liza.greeting');
      const emotionPrompt = initialEmotion ? t('liza.emotion_prompt', { emotion: t(`emotional_check.emotions.${initialEmotion}`) }) : '';
      
      setTimeout(() => {
        pushMessage({
          from: 'bot',
          text: greeting + (emotionPrompt ? '\n\n' + emotionPrompt : ''),
          ui: { type: 'text', text: greeting }
        });
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  function pushMessage(msg: Omit<ChatMessage, 'id'>) {
    setMessages(prev => [
      ...prev,
      {
        ...msg,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`
      }
    ]);
  }

  function sendUserText(text: string) {
    if (!text.trim()) return;
    
    pushMessage({ from: 'user', text });
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const { state: newState, bot } = engine.handleUserMessage(state, { text });
      setState(newState);
      pushMessage({ from: 'bot', text: bot.text, ui: bot });
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }

  function sendUserValue(value: string | number, label?: string) {
    if (label) {
      pushMessage({ from: 'user', text: label });
    }
    setIsTyping(true);

    setTimeout(() => {
      const { state: newState, bot } = engine.handleUserMessage(state, { value });
      setState(newState);
      pushMessage({ from: 'bot', text: bot.text, ui: bot });
      setIsTyping(false);
    }, 600 + Math.random() * 500);
  }

  function startFlow(flowId: string) {
    setIsTyping(true);
    setTimeout(() => {
      const { state: newState, bot } = engine.startFlow(state, flowId);
      setState(newState);
      pushMessage({ from: 'bot', text: bot.text, ui: bot });
      setIsTyping(false);
    }, 500);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendUserText(inputText);
    }
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="relative w-full sm:max-w-lg h-[90vh] sm:h-[80vh] bg-gradient-to-b from-slate-900 to-slate-800 rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{t('liza.name')}</h3>
              <p className="text-white/50 text-xs">{t('liza.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            data-testid="button-close-liza-chat"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.from === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-slate-700/80 text-white/90 rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                
                {msg.from === 'bot' && msg.ui?.type === 'buttons' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.ui.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => sendUserValue(opt.value, opt.label)}
                        className="bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 text-xs px-3 py-1.5 rounded-full transition-colors border border-blue-400/30"
                        data-testid={`button-option-${opt.value}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
                
                {msg.from === 'bot' && msg.ui?.type === 'scale' && (
                  <div className="mt-3">
                    <input
                      type="range"
                      min={msg.ui.min}
                      max={msg.ui.max}
                      defaultValue={Math.floor((msg.ui.min + msg.ui.max) / 2)}
                      className="w-full accent-blue-500"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        sendUserValue(val, `${val}`);
                      }}
                    />
                    <div className="flex justify-between text-xs text-white/50 mt-1">
                      <span>{msg.ui.min}</span>
                      <span>{msg.ui.max}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700/80 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {state.mode === 'eliza' && messages.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => startFlow('anxiety_basic')}
                className="flex-shrink-0 bg-slate-700/50 hover:bg-slate-600/50 text-white/80 text-xs px-3 py-1.5 rounded-full transition-colors border border-white/10"
                data-testid="button-flow-anxiety"
              >
                {t('liza.flows.anxiety')}
              </button>
              <button
                onClick={() => startFlow('panic_grounding')}
                className="flex-shrink-0 bg-slate-700/50 hover:bg-slate-600/50 text-white/80 text-xs px-3 py-1.5 rounded-full transition-colors border border-white/10"
                data-testid="button-flow-panic"
              >
                {t('liza.flows.panic')}
              </button>
              <button
                onClick={() => startFlow('body_scan')}
                className="flex-shrink-0 bg-slate-700/50 hover:bg-slate-600/50 text-white/80 text-xs px-3 py-1.5 rounded-full transition-colors border border-white/10"
                data-testid="button-flow-body"
              >
                {t('liza.flows.body')}
              </button>
              <button
                onClick={() => startFlow('loneliness_connection')}
                className="flex-shrink-0 bg-slate-700/50 hover:bg-slate-600/50 text-white/80 text-xs px-3 py-1.5 rounded-full transition-colors border border-white/10"
                data-testid="button-flow-loneliness"
              >
                {t('liza.flows.loneliness')}
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('liza.input_placeholder')}
              className="flex-1 bg-slate-700/50 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
              disabled={isTyping}
              data-testid="input-liza-message"
            />
            <button
              onClick={() => sendUserText(inputText)}
              disabled={!inputText.trim() || isTyping}
              className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:opacity-50 flex items-center justify-center transition-colors"
              data-testid="button-send-liza-message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
