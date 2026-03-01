import { GoogleGenerativeAI } from "@google/generative-ai";
import { EngineRunner } from "./types";

export class GeminiRunner implements EngineRunner {
  private genAI: GoogleGenerativeAI;

  constructor(config: { apiKey: string }) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
  }

  async run(prompt: string): Promise<string> {
    // the FLASH model is included in the free-tier, so we can use it for testing without needing a paid account
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Regex to remove Markdown code blocks
    return text.replace(/```json\n?|```/g, "").trim();
  }
}