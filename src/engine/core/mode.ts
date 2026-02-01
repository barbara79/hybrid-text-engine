import { EngineContext, EngineInput, EngineOutput } from "./types"

export interface EngineMode<TContent> {
  id: EngineContext;  
  name: string;
  buildPrompt(input: EngineInput<TContent>): string;
  formatOutput(
    raw: string,
    input: EngineInput<TContent>
  ): EngineOutput;
}
