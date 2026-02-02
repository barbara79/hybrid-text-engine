import { marketplaceMode } from "../../src/engine/modes/marketplace"; 
import { EngineContext, EngineInput, Tone } from "@/engine/core/types";
import { MarketplaceContent } from "@/engine/core/content";
import { runFakeEngine } from "../helper";

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
  };

  await expect(
    runFakeEngine(marketplaceMode, input)
  ).rejects.toThrow("Engine context mismatch");
});
});
