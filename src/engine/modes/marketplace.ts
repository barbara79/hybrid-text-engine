import { EngineMode } from "../core/mode"
import { EngineInput } from "../core/types"

export interface MarketplaceContent {
  productName: string;
  description: string;
  price?: number;
  audience?: string;
  platform?: string;
}

export const marketplaceMode: EngineMode<MarketplaceContent> = {
  id: "marketplace",
  name: "marketplaceMode",

  buildPrompt(input: EngineInput<MarketplaceContent>) {
      const { productName, description, price, platform } = input.content;
      const { tone, audience } = input; 

      return `
Generate a product listing for an online marketplace.

Item: ${productName}
Description: ${description}
Price: ${price ?? "Not specified"}
Platform: ${platform ?? "Not specified"}

Tone: ${tone}
Audience: ${audience}

Return a clear title and a concise description.
`},

  formatOutput(raw: string) {
    // Split first line as title, rest as description
    const lines = raw.trim().split("\n").filter(Boolean);
    const title = lines[0] || "Untitled Product";
    const description = lines.slice(1).join("\n") || "No description";

    return {
      sections: {
        title,
        body: description,
      },
      body: raw.trim(),
    };
  }
}
