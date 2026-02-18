import { marketplaceMode } from "../../src/engine/modes/marketplace"; 
import { EngineContext, EngineInput, Tone } from "@/engine/core/types";
import { MarketplaceContent } from "@/engine/core/content";
import { FakeRunner } from "@/engine/runner/fakeRunner";
import { runEngine } from "@/engine/core/engine";

describe("Engine Context Validation", () => {
it("throws when mode and input context do not match", async () => {
  const input: EngineInput<MarketplaceContent> = {
    context: EngineContext.JOB, // Mismatched context
    tone: "friendly",
    audience: "buyers",
    content: {
      productName: "Bag",
      description: "Leather",
    },
  } as any;

  const runner = new FakeRunner();

  await expect(
    runEngine(marketplaceMode, input, runner)
  ).rejects.toThrow("Engine context mismatch");
});
});
