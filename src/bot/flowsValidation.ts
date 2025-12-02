// src/bot/flowsValidation.ts
import type { FlowDefinition } from "./flowsTypes";

export interface FlowValidationError {
  flowId: string;
  stepId?: string;
  message: string;
}

export function validateFlows(flows: FlowDefinition[]): FlowValidationError[] {
  const errors: FlowValidationError[] = [];

  // Check unique flow IDs
  const flowIdSet = new Set<string>();
  for (const flow of flows) {
    if (flowIdSet.has(flow.id)) {
      errors.push({
        flowId: flow.id,
        message: `Duplicate flow id "${flow.id}".`
      });
    } else {
      flowIdSet.add(flow.id);
    }
  }

  for (const flow of flows) {
    const { id: flowId, steps } = flow;

    if (!steps || steps.length === 0) {
      errors.push({
        flowId,
        message: `Flow "${flowId}" has no steps.`
      });
      continue;
    }

    // Collect step IDs and check duplicates
    const stepIdSet = new Set<string>();
    for (const step of steps) {
      if (stepIdSet.has(step.id)) {
        errors.push({
          flowId,
          stepId: step.id,
          message: `Duplicate step id "${step.id}" in flow "${flowId}".`
        });
      } else {
        stepIdSet.add(step.id);
      }
    }

    // Check references and inputs
    for (const step of steps) {
      const stepLabel = `"${flowId}" -> step "${step.id}"`;

      // next
      if (step.next && !stepIdSet.has(step.next)) {
        errors.push({
          flowId,
          stepId: step.id,
          message: `${stepLabel}: "next" points to unknown step "${step.next}".`
        });
      }

      // nextByAnswer
      if (step.nextByAnswer) {
        for (const [answerValue, targetId] of Object.entries(step.nextByAnswer)) {
          if (!stepIdSet.has(targetId)) {
            errors.push({
              flowId,
              stepId: step.id,
              message: `${stepLabel}: nextByAnswer["${answerValue}"] points to unknown step "${targetId}".`
            });
          }
        }
      }

      // Input sanity checks
      if (step.input) {
        if (step.input.type === "buttons") {
          if (!step.input.options || step.input.options.length === 0) {
            errors.push({
              flowId,
              stepId: step.id,
              message: `${stepLabel}: "buttons" input has no options.`
            });
          }
        }

        if (step.input.type === "scale") {
          if (step.input.min >= step.input.max) {
            errors.push({
              flowId,
              stepId: step.id,
              message: `${stepLabel}: "scale" input has min >= max (${step.input.min} >= ${step.input.max}).`
            });
          }
        }
      }

      // Logical check: nextByAnswer only makes sense with buttons
      if (step.nextByAnswer && step.input?.type !== "buttons") {
        errors.push({
          flowId,
          stepId: step.id,
          message: `${stepLabel}: has nextByAnswer but input.type is not "buttons".`
        });
      }
    }
  }

  return errors;
}
