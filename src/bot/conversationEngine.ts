// src/bot/conversationEngine.ts
import { Eliza } from "./eliza";
import type { FlowDefinition, FlowStep } from "./flowsTypes";

export type Mode = "eliza" | "flow";

export interface EngineState {
  mode: Mode;
  activeFlowId?: string;
  activeStepId?: string;
  flowContext: Record<string, unknown>;
}

export type BotMessage =
  | { type: "text"; text: string }
  | {
      type: "buttons";
      text: string;
      options: { value: string; label: string }[];
    }
  | {
      type: "scale";
      text: string;
      min: number;
      max: number;
    };

interface EngineConfig {
  eliza: Eliza;
  flows: FlowDefinition[];
  t: (key: string, vars?: Record<string, unknown>) => string;
}

export function createInitialState(): EngineState {
  return {
    mode: "eliza",
    activeFlowId: undefined,
    activeStepId: undefined,
    flowContext: {}
  };
}

export class ConversationEngine {
  private eliza: Eliza;
  private flows: FlowDefinition[];
  private t: EngineConfig["t"];
  private flowIndex: Map<string, FlowDefinition>;

  constructor(config: EngineConfig) {
    this.eliza = config.eliza;
    this.flows = config.flows;
    this.t = config.t;

    this.flowIndex = new Map(this.flows.map(f => [f.id, f]));
  }

  /** Start a specific flow by id (e.g. "anxiety_basic"). */
  startFlow(
    state: EngineState,
    flowId: string
  ): { state: EngineState; bot: BotMessage } {
    const flow = this.flowIndex.get(flowId);
    if (!flow || flow.steps.length === 0) {
      // fallback to ELIZA if flow missing
      const text = this.eliza.respond("I want to talk about my anxiety.");
      return {
        state: { ...state, mode: "eliza" },
        bot: { type: "text", text }
      };
    }

    const firstStep = flow.steps[0];
    const bot = this.buildBotMessage(firstStep, {});
    return {
      state: {
        mode: "flow",
        activeFlowId: flow.id,
        activeStepId: firstStep.id,
        flowContext: {}
      },
      bot
    };
  }

  /** Main entry point: user sends something (text or choice/scale value). */
  handleUserMessage(
    state: EngineState,
    userInput: { text?: string; value?: string | number }
  ): { state: EngineState; bot: BotMessage } {
    if (state.mode === "flow" && state.activeFlowId && state.activeStepId) {
      return this.handleFlowMessage(state, userInput);
    }

    // ELIZA mode
    const text = this.eliza.respond(userInput.text ?? "");
    return {
      state,
      bot: { type: "text", text }
    };
  }

  // --- internal helpers ---

  private handleFlowMessage(
    state: EngineState,
    userInput: { text?: string; value?: string | number }
  ): { state: EngineState; bot: BotMessage } {
    const flow = this.flowIndex.get(state.activeFlowId!);
    if (!flow) {
      return this.fallbackToEliza(state, userInput);
    }

    const step = flow.steps.find(s => s.id === state.activeStepId);
    if (!step) {
      return this.fallbackToEliza(state, userInput);
    }

    const context: Record<string, unknown> = { ...state.flowContext };

    // 1) Save user's answer into flow context
    if (step.saveAs) {
      context[step.saveAs] =
        userInput.value !== undefined ? userInput.value : (userInput.text ?? "");
    }

    // 2) Determine next step
    let nextStepId: string | null | undefined = step.next ?? null;

    if (
      step.input?.type === "buttons" &&
      step.nextByAnswer &&
      userInput.value != null
    ) {
      const val = String(userInput.value);
      if (step.nextByAnswer[val]) {
        nextStepId = step.nextByAnswer[val];
      }
    }

    // 3) Flow finished → back to ELIZA
    if (!nextStepId) {
      const closingText = this.t("flows.common.end_thanks");
      const elizaComment = this.eliza.respond(
        "I just finished a helpful exercise."
      );
      return {
        state: {
          mode: "eliza",
          activeFlowId: undefined,
          activeStepId: undefined,
          flowContext: {}
        },
        bot: {
          type: "text",
          text: `${closingText}\n\n${elizaComment}`
        }
      };
    }

    const nextStep = flow.steps.find(s => s.id === nextStepId);
    if (!nextStep) {
      return this.fallbackToEliza(state, userInput);
    }

    const bot = this.buildBotMessage(nextStep, context);

    return {
      state: {
        ...state,
        mode: "flow",
        activeStepId: nextStep.id,
        flowContext: context
      },
      bot
    };
  }

  private buildBotMessage(step: FlowStep, ctx: Record<string, unknown>): BotMessage {
    const text = this.t(step.botTextKey, ctx);

    if (!step.input) {
      return { type: "text", text };
    }

    switch (step.input.type) {
      case "buttons":
        return {
          type: "buttons",
          text,
          options: step.input.options.map(o => ({
            value: o.value,
            label: this.t(o.labelKey)
          }))
        };

      case "scale":
        return {
          type: "scale",
          text,
          min: step.input.min,
          max: step.input.max
        };

      case "text":
      default:
        return { type: "text", text };
    }
  }

  private fallbackToEliza(
    state: EngineState,
    userInput: { text?: string; value?: string | number }
  ): { state: EngineState; bot: BotMessage } {
    const text = this.eliza.respond(userInput.text ?? "");
    return {
      state: {
        mode: "eliza",
        activeFlowId: undefined,
        activeStepId: undefined,
        flowContext: {}
      },
      bot: { type: "text", text }
    };
  }
}
