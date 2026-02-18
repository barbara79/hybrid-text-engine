import { EngineInput, EngineOutput } from "./types"
import { EngineMode } from "./mode"
import { EngineRunner } from "../runner/engineRunner";
import { assertContextMatch } from "./assertions";

export async function runEngine<TContent>(
mode: EngineMode<TContent>,
  input: EngineInput<TContent>,
  runner: EngineRunner
): Promise<EngineOutput> {
  assertContextMatch(mode.id, input.context);

  const firstPrompt = mode.buildPrompt(input);
  const firstRaw = await runner.run(firstPrompt);
  let result = mode.formatOutput(firstRaw, input);

if (result.analysis && result.analysis.score < 80) {
    const refinementPrompt = `
      Your previous attempt received a quality score of ${result.analysis.score}/100.
      Critique: ${result.analysis.critique}
      
      Please rewrite the content to address these specific suggestions:
      ${result.analysis.suggestions.join(", ")}
      
      Return the updated version in the same JSON format.
    `;

    const refinedRaw = await runner.run(refinementPrompt);
    result = mode.formatOutput(refinedRaw, input);
  }

  return result;
}