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

    // 1. Check the structured sections
    expect(result.sections).toBeDefined();
    expect(result.sections.title).toBeDefined();
    // In our new mode, tags are joined by a comma
    expect(result.sections.seoTags).toBeDefined(); 

    // 2. Check the "Unique" Analysis logic
    expect(result.analysis).toBeDefined();
    expect(typeof result.analysis?.score).toBe("number");
    expect(result.analysis?.score).toBeGreaterThan(0);
    expect(result.analysis?.critique).not.toBe("");

    // 3. Ensure the body is being populated correctly from the AI JSON
    // Note: Your FakeRunner needs to return "Vintage Leather Bag" for this to pass!
    expect(result.body).toContain("Vintage Leather Bag");

    // 4. Update snapshot to include the new JSON structure (score, tags, etc.)
    expect(result).toMatchSnapshot();
  });
});