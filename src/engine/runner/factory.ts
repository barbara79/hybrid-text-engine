import { GeminiRunner } from "./geminiRunner";
import { OpenAIRunner } from "./openAIRunner";
import { FakeRunner } from "./fakeRunner";
import { EngineRunner } from "./types";
import { Provider } from "../core/types";

import { GroqRunner } from "./groqRunner";

export function getRunner(provider: Provider): EngineRunner {
  const keys = {
    openai: process.env.OPENAI_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
  };

  const isPlaceholder = (key?: string) => 
    !key || key.includes("_your_") || key.includes("sk_****");

 switch (provider) {
    case Provider.OPENAI:
      return isPlaceholder(keys.openai) ? new FakeRunner() : new OpenAIRunner({ apiKey: keys.openai! });
    
    case Provider.GEMINI:
      return isPlaceholder(keys.gemini) ? new FakeRunner() : new GeminiRunner({ apiKey: keys.gemini! });

    case Provider.GROQ:
      // When you build RitaRunner, just swap this out!
      return isPlaceholder(keys.groq) ? new FakeRunner() : new GroqRunner({ apiKey: keys.groq! }); 

    default:
      return new FakeRunner();
  }
}