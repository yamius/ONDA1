// src/bot/flows/index.ts
import rawFlows from "./flows.json";
import type { FlowDefinition } from "../flowsTypes";
import { validateFlows } from "../flowsValidation";

export const flows = rawFlows as FlowDefinition[];

const validationErrors = validateFlows(flows);

if (validationErrors.length > 0) {
  // eslint-disable-next-line no-console
  console.error("Flow definition errors:", validationErrors);
  throw new Error("Invalid flow definitions. See console for details.");
}
