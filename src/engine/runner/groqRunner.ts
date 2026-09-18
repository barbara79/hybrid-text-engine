import { EngineRunner } from "./types";

export class GroqRunner implements EngineRunner {
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions";

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  async run(prompt: string): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // One of Groq's fastest free models
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}