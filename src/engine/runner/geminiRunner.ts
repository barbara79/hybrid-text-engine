import { GoogleGenAI } from "@google/genai";
import { EngineRunner } from "./types";

export class GeminiRunner implements EngineRunner {
  private client: GoogleGenAI;

  constructor(config: { apiKey: string }) {
    this.client = new GoogleGenAI({
      apiKey: config.apiKey, 
      apiVersion: 'v1',
    });
  }

  async run(prompt: string): Promise<string> {
    // the FLASH model is included in the free-tier, so we can use it for testing without needing a paid account

      try {
          const response = await this.client.models.generateContent({
            model: 'gemini-1.5-flash-latest', 
            contents: prompt,
            // We leave out config entirely for a moment to prove the connection
          });

        const text = response.text || "";

        return typeof text === 'object' ? JSON.stringify(text) : String(text).trim();
    } catch (error) {
        console.error("Gemini Execution Error:", error);
        throw error;
    }
  }
}