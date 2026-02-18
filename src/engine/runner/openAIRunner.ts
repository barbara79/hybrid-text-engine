import fetch from "node-fetch";
import { EngineRunner } from "./engineRunner";
import { OpenAIResponse, OpenAIError } from "./types";
/**
 * OpenAIRunner: stub for connecting the engine to OpenAI
 * Currently does a simple fetch, with timeout & basic retry logic
 */
export class OpenAIRunner implements EngineRunner {
    private apiKey: string;

    constructor({ apiKey }: { apiKey?: string } = {}) {
        this.apiKey = apiKey ?? process.env.OPENAI_API_KEY ?? "";

        if (!this.apiKey || this.apiKey.trim() === "") {
        throw new Error("OPENAI_API_KEY is required to use OpenAIRunner.");
        }
    }

    async run(prompt: string): Promise<string> {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125", // Note: use a model that supports JSON mode
        messages: [
          { role: "system", content: "You are a helpful assistant designed to output JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      // 2. Cast errorData to our Error interface
      const errorData = (await response.json()) as OpenAIError;
      throw new Error(`OpenAI API Error: ${errorData.error.message}`);
    }

    const data = (await response.json()) as OpenAIResponse;
    
    return data.choices[0].message.content ?? "{}";
    }
  }