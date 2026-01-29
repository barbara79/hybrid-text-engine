import { EngineInput, EngineOutput } from "./types"

export interface EngineMode<TContent> {
  id: "job" | "marketplace";  
  name: string;
  buildPrompt(input: EngineInput<TContent>): string;
  formatOutput(raw: string): EngineOutput;
}
