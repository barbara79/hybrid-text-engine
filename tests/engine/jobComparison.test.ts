import { runEngine } from "@/engine/core/engine";
import { EngineContext, Tone } from "@/engine/core/types";
import { jobComparisonMode } from "@/engine/modes/jobComparison";
import { FakeRunner } from "@/engine/runner/fakeRunner";


describe("Job Comparison Mode", () => {
  it("should analyze resume against JD and format output correctly", async () => {
    // 1. Setup Input following the ComparisonContent interface
    const input = {
      context: EngineContext.COMPARISON,
      tone: Tone.PROFESSIONAL,
      audience: "Recruiter",
      content: {
        userResume: "Senior Dev with React and Node experience.",
        jobDescription: "Wanted: Senior Engineer expert in React and Rust."
      },
    };

    // 2. Setup FakeRunner to return the specific JSON structure the mode expects
    const runner = new FakeRunner();
    jest.spyOn(runner, "run").mockResolvedValue(JSON.stringify({
      matchScore: 85,
      matchingSkills: ["React", "Seniority"],
      missingSkills: ["Rust"],
      summary: "Strong candidate with a minor stack gap.",
      actionPlan: ["Learn Rust basics", "Highlight Node backend strength"]
    }));

    // 3. Execute
    const result = await runEngine(jobComparisonMode, input as any, runner);

    // 4. Assertions based on your formatOutput logic
    expect(result.sections.score).toBe("85%");
    expect(result.sections.matches).toContain("✅ React");
    expect(result.sections.gaps).toContain("❌ Rust");
    expect(result.body).toContain("### Match Score: 85%");
    
    // Check Analysis mapping (used for the auto-refinement logic)
    expect(result.analysis?.score).toBe(85);
    expect(result.analysis?.suggestions).toHaveLength(2);
  });

  it("should handle invalid JSON from AI gracefully", async () => {
    const input = {
      context: EngineContext.COMPARISON,
      content: { userResume: "...", jobDescription: "..." }
    };

    const runner = new FakeRunner();
    jest.spyOn(runner, "run").mockResolvedValue("Not a JSON string");

    const result = await runEngine(jobComparisonMode, input as any, runner);

    expect(result.body).toBe("Error parsing comparison data.");
    expect(result.sections.error).toBeDefined();
  });

  it("should throw a mismatch error when context is missing (undefined)", async () => {
    // We intentionally omit 'context' to reproduce your error
    const inputWithMissingContext = {
      // context: EngineContext.COMPARISON, <--- Missing!
      tone: Tone.PROFESSIONAL,
      content: {
        userResume: "...",
        jobDescription: "..."
      },
    };

    const runner = new FakeRunner();

    // We expect runEngine to throw the specific error you've been seeing
    await expect(
      runEngine(jobComparisonMode, inputWithMissingContext as any, runner)
    ).rejects.toThrow("Engine context mismatch: mode 'comparison' cannot handle context 'undefined'");
  });
});