import { EngineRunner } from "./engineRunner";

export class OpenAIRunner implements EngineRunner {
  async run(prompt: string): Promise<string> {
    // TODO: call OpenAI / other LLM
    throw new Error("Not implemented yet")
  }
}
