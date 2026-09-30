import { EngineContext, EngineInput, EngineOutput } from "./types"

export interface EngineMode<TContent> {
  id: EngineContext;  
  name: string;
  /** True only when analysis.score measures the quality of the generated text (not e.g. a match %). */
  refinable?: boolean;
  buildPrompt(input: EngineInput<TContent>): string;
  formatOutput(
    raw: string,
    input: EngineInput<TContent>
  ): EngineOutput;
  processParsedData?(parsed: unknown, input: EngineInput<TContent>): EngineOutput; 
}