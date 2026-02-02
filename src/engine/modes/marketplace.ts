import { EngineMode } from "../core/mode"
import { EngineContext, EngineInput } from "../core/types"
import { MarketplaceContent } from "../core/content"

export const marketplaceMode: EngineMode<MarketplaceContent> = {
  id: EngineContext.MARKETPLACE,
  name: "Marketplace Mode",

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

  formatOutput(raw: string, input: EngineInput<MarketplaceContent>) {
  const { productName, description, price, platform } = input.content;

  const body = `
Item: ${productName}
Description: ${description}
Price: ${price ?? "Not specified"}
Platform: ${platform ?? "Not specified"}
`.trim();

  return {
    sections: {
      title: productName,
      body,
    },
    body, 
  };
}


}
