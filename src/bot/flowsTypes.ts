// src/bot/flowsTypes.ts

export type FlowInputType = "text" | "buttons" | "scale";

export interface FlowOption {
  value: string;     // stored value, used in nextByAnswer and context
  labelKey: string;  // i18n key
}

export interface FlowInputText {
  type: "text";
}

export interface FlowInputButtons {
  type: "buttons";
  options: FlowOption[];
}

export interface FlowInputScale {
  type: "scale";
  min: number;
  max: number;
}

export type FlowInput = FlowInputText | FlowInputButtons | FlowInputScale;

export interface FlowStep {
  id: string;
  botTextKey: string;
  input?: FlowInput;
  saveAs?: string;
  next?: string | null;
  nextByAnswer?: Record<string, string>;
  isSummaryStep?: boolean;
}

export interface FlowDefinition {
  id: string;
  titleKey: string;
  steps: FlowStep[];
}
