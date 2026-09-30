import { marketplaceMode } from "@/engine/modes/marketplace";
import { Audience, EngineContext, EngineInput, Tone } from "@/engine/core/types";
import { MarketplaceContent } from "@/engine/core/content";
import { FakeRunner } from "@/engine/runner/fakeRunner";
import { runEngine } from "@/engine/core/engine";

describe("Marketplace Mode", () => {
  const baseInput: EngineInput<MarketplaceContent> = {
    context: EngineContext.MARKETPLACE,
    tone: Tone.FRIENDLY,
    audience: Audience.BUYERS,
    content: {
      productName: "Vintage Leather Bag",
      description: "Genuine leather, slightly used, excellent condition",
      price: 120,
      platform: "eBay",
    },
  };

  it("should return deterministic sections from fixed input", async () => {
    const runner = new FakeRunner();

    jest.spyOn(runner, "run").mockResolvedValue(
      JSON.stringify({
        title: "Vintage Leather Bag - Genuine Leather, Excellent Condition",
        description: "This vintage leather bag is in excellent condition...",
        tags: ["vintage", "leather", "bag"],
        analysis: {
          score: 88,
          critique: "Clear, appealing description with good keywords.",
          suggestions: ["Mention dimensions"],
        },
      })
    );

    const result = await runEngine(marketplaceMode, baseInput, runner);

    expect(result.sections).toBeDefined();
    expect(result.sections.title).toBeDefined();
    expect(result.sections.seoTags).toBe("vintage, leather, bag");

    expect(result.analysis).toBeDefined();
    expect(typeof result.analysis?.score).toBe("number");
    expect(result.analysis?.score).toBeGreaterThan(0);
    expect(result.analysis?.critique).not.toBe("");

    expect(result.body).toContain("vintage leather bag");

    expect(result).toMatchSnapshot();
  });

  it("should correctly parse a response wrapped in a markdown code fence", async () => {
    const runner = new FakeRunner();

    const fencedResponse =
      "```json\n" +
      JSON.stringify({
        title: "Vintage Leather Bag",
        description: "A great bag.",
        tags: ["vintage", "leather"],
        analysis: { score: 80, critique: "Solid.", suggestions: [] },
      }) +
      "\n```";

    jest.spyOn(runner, "run").mockResolvedValue(fencedResponse);

    const result = await runEngine(marketplaceMode, baseInput, runner);

    expect(result.sections.error).toBeUndefined();
    expect(result.sections.title).toBe("Vintage Leather Bag");
  });
});