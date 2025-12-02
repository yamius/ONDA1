// src/bot/useChatEngine.ts
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eliza } from "./eliza";
import { ConversationEngine, createInitialState } from "./conversationEngine";
import type { BotMessage, EngineState } from "./conversationEngine";
import { flows } from "./flowsIndex";

const eliza = new Eliza();

export type ChatMessage = {
  id: string;
  from: "user" | "bot";
  text: string;
  ui?: BotMessage;
};

export function useChatEngine() {
  const { t } = useTranslation();
  const [engine] = useState(
    () => new ConversationEngine({ eliza, flows, t })
  );
  const [state, setState] = useState<EngineState>(() => createInitialState());
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function pushMessage(msg: Omit<ChatMessage, "id">) {
    setMessages(prev => [
      ...prev,
      {
        ...msg,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`
      }
    ]);
  }

  function sendUserText(text: string) {
    pushMessage({ from: "user", text });

    const { state: newState, bot } = engine.handleUserMessage(state, { text });
    setState(newState);
    pushMessage({ from: "bot", text: bot.text, ui: bot });
  }

  function sendUserValue(value: string | number) {
    const { state: newState, bot } = engine.handleUserMessage(state, { value });
    setState(newState);
    pushMessage({ from: "bot", text: bot.text, ui: bot });
  }

  function startFlow(flowId: string) {
    const { state: newState, bot } = engine.startFlow(state, flowId);
    setState(newState);
    pushMessage({ from: "bot", text: bot.text, ui: bot });
  }

  return {
    messages,
    state,
    sendUserText,
    sendUserValue,
    startFlow
  };
}
