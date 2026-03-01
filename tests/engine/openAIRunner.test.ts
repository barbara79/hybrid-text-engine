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
                title: "Vintage Denim Jacket", // Change this from "Mocked Marketplace Title"
                description: "This is a fake marketplace description.",
                tags: ["denim", "jacket"],
                analysis: {
                    score: 95,
                    critique: "Great description!",
                    suggestions: []
                }
            });
        const mockOpenAIResponse = JSON.stringify({
            choices: [{ message: { content: aiContent } }]
        });

    // Mock fetch response (simulating OpenAI API)
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

    it("should throw error if OPENAI_API_KEY missing", () => {
    const originalKey = process.env.OPENAI_API_KEY;
    
    delete process.env.OPENAI_API_KEY;

    expect(() => {
        new OpenAIRunner({ apiKey: undefined });
    }).toThrow(/OPENAI_API_KEY is required/);

    process.env.OPENAI_API_KEY = originalKey;
    });
});
