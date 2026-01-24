import { EngineMode } from "../core/mode"
import { EngineInput } from "../core/types"

export interface MarketplaceContent {
  itemName: string
  brand?: string
  condition: string
  details?: string
}

export const marketplaceMode: EngineMode<MarketplaceContent> = {
  name: "marketplace",

  buildPrompt(input: EngineInput<MarketplaceContent>) {
    const { itemName, brand, condition, details } = input.content

    return `
Write a product description for an online marketplace.

Item: ${itemName}
Brand: ${brand ?? "Not specified"}
Condition: ${condition}
Details: ${details ?? "None"}

Tone: ${input.tone}
Audience: ${input.audience}

Return a clear title and a concise description.
`
  },

  formatOutput(raw: string) {
    return {
      body: raw.trim(),
    }
  },
}
