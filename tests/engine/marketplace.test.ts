// tests/engine/marketplace.test.ts
import { MarketplaceContent, marketplaceMode } from "../../src/engine/modes/marketplace";
// import { runEngine } from "../../src/engine/core/engine";
import { EngineInput } from "@/engine/core/types";
import { runFakeEngine } from "../helper";

describe("Marketplace Mode", () => {
  it("should return deterministic sections from fixed input", async () => {
    const input: EngineInput<MarketplaceContent> = {
      context: "marketplace",
      tone: "friendly",
      audience: "general buyers",
      content: {
        productName: "Vintage Leather Bag",
        description: "Genuine leather, slightly used, excellent condition",
        price: 120,
        platform: "eBay",
      },
    };

//     const fakeRunEngine = async (): Promise<EngineOutput> => {
//       const raw = `
// Generate a product listing for an online marketplace.

// Item: ${input.content.productName}
// Description: ${input.content.description}
// Price: ${input.content.price ?? "Not specified"}
// Platform: ${input.content.platform ?? "Not specified"}

// Tone: ${input.tone}
// Audience: ${input.audience}
// `;
//       return marketplaceMode.formatOutput(raw);
//     };

    const output = await runFakeEngine(marketplaceMode, input);

    expect(output.sections!.title).toBe("Generate a product listing for an online marketplace.");
    expect(output.sections!.body).toContain("Item: Vintage Leather Bag");
    expect(output.sections!.body).toContain("Price: 120");
    expect(output.sections!.body).toContain("Platform: eBay");
    expect(output.body).toContain("Tone: friendly");
  });
});