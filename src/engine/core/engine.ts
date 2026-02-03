import { EngineInput, EngineOutput } from "./types"
import { EngineMode } from "./mode"
import { EngineRunner } from "../runner/engineRunner";
import { assert } from "console";
import { assertContextMatch } from "./assertions";

export async function runEngine<TContent>(
  mode: EngineMode<TContent>,
  input: EngineInput<TContent>,
  runner: EngineRunner
): Promise<EngineOutput> {

  assertContextMatch(mode.id, input.context);

  const prompt = mode.buildPrompt(input);

  const raw = await runner.run(prompt);

  return mode.formatOutput(raw, input);
}
