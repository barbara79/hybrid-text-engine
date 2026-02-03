export interface EngineRunner {
  run(prompt: string): Promise<string>;
}
