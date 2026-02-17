import { EngineMode } from "../core/mode"
import { EngineContext, EngineInput, EngineOutput } from "../core/types"
import { MarketplaceContent } from "../core/content"

export const marketplaceMode: EngineMode<MarketplaceContent> = {
  id: EngineContext.MARKETPLACE,
  name: "Marketplace Mode",

  buildPrompt(input: EngineInput<MarketplaceContent>) {
      const { productName, description, price, platform } = input.content;
      const { tone, audience } = input; 

      return `
      You are a professional e-commerce copywriter.
      
      TASK:
      1. Create a high-converting marketplace listing for: ${productName}.
      2. Details: ${description}, Price: ${price}, Platform: ${platform}.
      3. Analyze the listing for SEO and buyer psychology.
      
      Tone: ${tone}
      Audience: ${audience}

      Return ONLY a JSON object:
      {
        "title": "A catchy, SEO-optimized title",
        "description": "The full sales description",
        "tags": ["tag1", "tag2", "tag3"],
        "analysis": {
          "score": number,
          "critique": "Why this listing will or won't sell",
          "suggestions": ["Improvement 1", "Improvement 2"]
        }
      }
    `;
  },

  formatOutput(raw: string, input: EngineInput<MarketplaceContent>): EngineOutput {
    try {
      const parsed = JSON.parse(raw);

      return {
        body: String(parsed.description ?? ""),
        sections: {
          title: String(parsed.title ?? input.content.productName),
          description: String(parsed.description ?? ""),
          seoTags: Array.isArray(parsed.tags) ? parsed.tags.join(", ") : "",
        },
        analysis: {
          score: Number(parsed.analysis?.score ?? 0),
          critique: String(parsed.analysis?.critique ?? ""),
          suggestions: parsed.analysis?.suggestions ?? [],
        },
        meta: {
          mode: EngineContext.MARKETPLACE,
          tone: input.tone,
        },
      };
    } catch (e) {
      return {
        body: raw,
        sections: { error: "Failed to parse AI marketplace data" },
        meta: { mode: EngineContext.MARKETPLACE },
      };
    }
  },
}
