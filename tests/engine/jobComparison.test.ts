import { runEngine } from "@/engine/core/engine";
import { EngineContext, Tone } from "@/engine/core/types";
import { jobComparisonMode } from "@/engine/modes/jobComparison";
import { FakeRunner } from "@/engine/runner/fakeRunner";

describe("Job Comparison Mode", () => {
  it("should analyze resume against JD and format output correctly", async () => {
    const input = {
      context: EngineContext.COMPARISON,
      tone: Tone.PROFESSIONAL,
      audience: "Recruiter",
      content: {
        userResume: "Senior Dev with React and Node experience.",
        jobDescription: "Wanted: Senior Engineer expert in React and Rust.",
      },
    };

    const runner = new FakeRunner();
    jest.spyOn(runner, "run").mockResolvedValue(
      JSON.stringify({
        matchScore: 85,
        matchingSkills: ["React", "Seniority"],
        missingSkills: ["Rust"],
        summary: "Strong candidate with a minor stack gap.",
        actionPlan: ["Learn Rust basics", "Highlight Node backend strength"],
      })
    );

    const result = await runEngine(jobComparisonMode, input as any, runner);

    expect(result.sections.score).toBe("85%");
    expect(result.sections.matches).toContain("✅ React");
    expect(result.sections.gaps).toContain("❌ Rust");
    expect(result.body).toContain("### Match Score: 85%");

    expect(result.analysis?.score).toBe(85);
    expect(result.analysis?.suggestions).toHaveLength(2);
  });

  it("should handle invalid JSON from AI gracefully", async () => {
    const input = {
      context: EngineContext.COMPARISON,
      content: { userResume: "...", jobDescription: "..." },
    };

    const runner = new FakeRunner();
    jest.spyOn(runner, "run").mockResolvedValue("Not a JSON string");

    const result = await runEngine(jobComparisonMode, input as any, runner);

    expect(result.body).toBe("Error parsing comparison data.");
    expect(result.sections.error).toBeDefined();
  });

  it("should throw a mismatch error when context is missing (undefined)", async () => {
    const inputWithMissingContext = {
      // context is intentionally omitted here
      tone: Tone.PROFESSIONAL,
      content: {
        userResume: "...",
        jobDescription: "...",
      },
    };

    const runner = new FakeRunner();

    await expect(
      runEngine(jobComparisonMode, inputWithMissingContext as any, runner)
    ).rejects.toThrow(
      "Engine context mismatch: mode 'comparison' cannot handle context 'undefined'"
    );
  });
});

describe("Engine Context Validation", () => {
  it("throws when mode and input context do not match", async () => {
    const input = {
      context: EngineContext.JOB, // Mismatched on purpose: mode below is marketplace
      tone: "friendly",
      audience: "buyers",
      content: {
        productName: "Bag",
        description: "Leather",
      },
    } as any;

    const runner = new FakeRunner();

    // Import marketplaceMode locally to keep this cross-mode check in one place
    const { marketplaceMode } = await import("@/engine/modes/marketplace");

    await expect(
      runEngine(marketplaceMode, input, runner)
    ).rejects.toThrow("Engine context mismatch");
  });
});