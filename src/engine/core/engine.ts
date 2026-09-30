import { EngineInput, EngineOutput } from "./types"
import { EngineMode } from "./mode"

import { assertContextMatch } from "./assertions";
import { EngineRunner } from "../runner/types";

export const MIN_SCORE = 80;
// Total generations allowed: 1 initial + up to 2 refinement passes.
export const MAX_ATTEMPTS = 3;

type Analysis = NonNullable<EngineOutput["analysis"]>;

// The runner is stateless, so the refinement prompt must carry the original
// task and the previous answer, not just the critique.
function buildRefinementPrompt(originalPrompt: string, previousRaw: string, analysis: Analysis): string {
  return `
${originalPrompt}

---
YOUR PREVIOUS ANSWER:
${previousRaw}

QUALITY REVIEW OF THAT ANSWER:
Score: ${analysis.score}/100
Critique: ${analysis.critique}
Suggestions: ${analysis.suggestions.join("; ")}

Rewrite your previous answer to address the review. Keep the same task and rules as above, do not invent facts, and return ONLY the JSON in the same format.
  `.trim();
}

export async function runEngine<TContent>(
  mode: EngineMode<TContent>,
  input: EngineInput<TContent>,
  runner: EngineRunner
): Promise<EngineOutput> {
  assertContextMatch(mode.id, input.context);

  const prompt = mode.buildPrompt(input);
  let raw = await runner.run(prompt);
  let result = mode.formatOutput(raw, input);
  let attempts = 1;

  while (
    mode.refinable &&
    result.analysis &&
    result.analysis.score < MIN_SCORE &&
    attempts < MAX_ATTEMPTS
  ) {
    const refinedRaw = await runner.run(buildRefinementPrompt(prompt, raw, result.analysis));
    const refined = mode.formatOutput(refinedRaw, input);
    attempts++;

    if (!refined.analysis || refined.analysis.score < result.analysis.score) break;

    raw = refinedRaw;
    result = refined;
  }

  return {
    ...result,
    meta: {
      ...result.meta,
      mode: result.meta?.mode ?? input.context,
      refinementApplied: attempts > 1,
      finalScore: result.analysis?.score,
    },
  };
}