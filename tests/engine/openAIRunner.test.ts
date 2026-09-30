import { MarketplaceContent } from "@/engine/core/content";
import { runEngine } from "@/engine/core/engine";
import { Audience, EngineContext, EngineInput, Tone } from "@/engine/core/types";
import { marketplaceMode } from "@/engine/modes/marketplace";
import { OpenAIRunner } from "@/engine/runner/openAIRunner";

describe("OpenAIRunner Integration (mocked fetch)", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should produce deterministic output for MarketplaceMode", async () => {
    const aiContent = JSON.stringify({
      title: "Vintage Denim Jacket",
      description: "This is a fake marketplace description.",
      tags: ["denim", "jacket"],
      analysis: {
        score: 95,
        critique: "Great description!",
        suggestions: [],
      },
    });
    const mockOpenAIResponse = JSON.stringify({
      choices: [{ message: { content: aiContent } }],
    });

    fetchMock.mockResponseOnce(mockOpenAIResponse);

    const runner = new OpenAIRunner({ apiKey: "test" });

    const input: EngineInput<MarketplaceContent> = {
      context: EngineContext.MARKETPLACE,
      tone: Tone.FRIENDLY,
      audience: Audience.BUYERS,
      content: {
        productName: "Vintage Denim Jacket",
        description: "Classic denim jacket, very good condition",
        price: 85,
        platform: "Vinted",
      },
    };

    const result = await runEngine(marketplaceMode, input, runner);

    expect(result.sections).toBeDefined();
    expect(result.sections.title).toBe("Vintage Denim Jacket");
  });

  it("should throw an error if the API key is missing", () => {
    expect(() => {
      new OpenAIRunner({ apiKey: undefined });
    }).toThrow(/OPENAI_API_KEY is required/);
  });
});