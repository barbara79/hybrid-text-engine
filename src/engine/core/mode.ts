import { EngineInput, EngineOutput } from "./types"

export interface EngineMode<TContent> {
  name: string
  buildPrompt(input: EngineInput<TContent>): string
  formatOutput(raw: string): EngineOutput
}
