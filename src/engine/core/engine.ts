import { EngineInput, EngineOutput } from "./types"
import { EngineMode } from "./mode"

import { assertContextMatch } from "./assertions";
import { EngineRunner } from "../runner/types";

export const MIN_SCORE = 80;
// Total generations allowed: 1 initial + up to 2 refinement passes.
export const MAX_ATTEMPTS = 3;

type Analysis = NonNullable<EngineOutput["analysis"]>;

// Model output is untrusted: only a finite number between 0 and 100 is a valid score.
// Anything else (a string like "85/100", 250, -5, NaN) returns null.
function normalizeScore(raw: unknown): number | null {
  return typeof raw === "number" && Number.isFinite(raw) && raw >= 0 && raw <= 100
    ? raw
    : null;
}

const scoreOf = (output: EngineOutput): number | null =>
  normalizeScore(output.analysis?.score);

// A draft needs refinement when it has an analysis but its score is
// invalid or below the threshold. Without an analysis (e.g. a parse error)
// there is nothing to refine from.
function needsRefinement(output: EngineOutput): boolean {
  if (!output.analysis) return false;
  const score = scoreOf(output);
  return score === null || score < MIN_SCORE;
}

// The runner is stateless, so the refinement prompt must carry the original
// task and the previous answer, not just the critique.
function buildRefinementPrompt(originalPrompt: string, previousRaw: string, analysis: Analysis): string {
  const suggestions = Array.isArray(analysis.suggestions) ? analysis.suggestions : [];
  return `
${originalPrompt}

---
YOUR PREVIOUS ANSWER:
${previousRaw}

QUALITY REVIEW OF THAT ANSWER:
Score: ${analysis.score}/100
Critique: ${analysis.critique}
Suggestions: ${suggestions.join("; ")}

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
  // True only when a refined draft actually replaced the previous one.
  let refinementApplied = false;

  while (
    mode.refinable &&
    result.analysis &&
    needsRefinement(result) &&
    attempts < MAX_ATTEMPTS
  ) {
    attempts++;

    let refinedRaw: string;
    let refined: EngineOutput;
    try {
      refinedRaw = await runner.run(buildRefinementPrompt(prompt, raw, result.analysis));
      refined = mode.formatOutput(refinedRaw, input);
    } catch (err) {
      // A failed refinement is optional work: keep the draft we already have.
      console.error("Refinement failed, keeping previous result:", err);
      break;
    }

    const before = scoreOf(result);
    const after = scoreOf(refined);

    // Discard the refined draft if it has no valid score or scores lower.
    if (after === null || (before !== null && after < before)) break;

    raw = refinedRaw;
    result = refined;
    refinementApplied = true;
  }

  return {
    ...result,
    meta: {
      ...result.meta,
      mode: result.meta?.mode ?? input.context,
      refinementApplied,
      finalScore: scoreOf(result) ?? undefined,
    },
  };
}