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
 
      try {
          const response = await this.client.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', 
            contents: prompt,
          });

        const text = response.text || "";

        return typeof text === 'object' ? JSON.stringify(text) : String(text).trim();
    } catch (error) {
        console.error("Gemini Execution Error:", error);
        throw error;
    }
  }
}