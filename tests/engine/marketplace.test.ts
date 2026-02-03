// tests/engine/marketplace.test.ts
import { marketplaceMode } from "../../src/engine/modes/marketplace"; 
import { EngineContext, EngineInput, Tone } from "@/engine/core/types";
import { MarketplaceContent } from "@/engine/core/content";
import { FakeRunner } from "@/engine/runner/fakeRunner";
import { runEngine } from "@/engine/core/engine";

describe("Marketplace Mode", () => {
  it("should return deterministic sections from fixed input", async () => {
    const input: EngineInput<MarketplaceContent> = {
      context: EngineContext.MARKETPLACE,
      tone: Tone.FRIENDLY,
      audience: "general buyers",
      content: {
        productName: "Vintage Leather Bag",
        description: "Genuine leather, slightly used, excellent condition",
        price: 120,
        platform: "eBay",
      },
    };

    const runner = new FakeRunner();

    const result = await runEngine(marketplaceMode, input, runner);


    expect(result.sections).toBeDefined();
    expect(result.sections?.title).toContain("Vintage Leather Bag");
    expect(result.sections?.body).toContain("Price: 120");
    expect(result.sections?.body).toContain("eBay");
    expect(result.body).toContain("Vintage Leather Bag");

  // Snapshot test used to lock the full output contract.
  // This helps detect accidental breaking changes when extending the engine.
    expect(result).toMatchSnapshot();
  });
});