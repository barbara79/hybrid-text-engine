import { runEngine, MAX_ATTEMPTS } from "@/engine/core/engine";
import { jobApplicationMode } from "@/engine/modes/jobApplication";
import { jobComparisonMode } from "@/engine/modes/jobComparison";
import { FakeRunner } from "@/engine/runner/fakeRunner";
import { Audience, EngineContext, EngineInput, Tone } from "@/engine/core/types";
import { ComparisonContent, JobApplicationContent } from "@/engine/core/content";

const jobInput: EngineInput<JobApplicationContent> = {
  context: EngineContext.JOB,
  tone: Tone.PROFESSIONAL,
  audience: Audience.RECRUITERS,
  content: {
    role: "Backend Developer",
    company: "Acme",
    jobDescription: "JD_MARKER: PHP and Symfony",
    experience: "RESUME_MARKER: 8 years PHP",
  },
};

const reply = (score: number, letter = "letter") =>
  JSON.stringify({
    coverLetter: letter,
    resume: "summary",
    analysis: { detectedRole: "r", detectedCompany: "c", score, critique: "too generic", suggestions: ["be specific"] },
  });

describe("Critic refinement", () => {
  it("sends the original task and the previous answer in the refinement prompt", async () => {
    const runner = new FakeRunner();
    const spy = jest
      .spyOn(runner, "run")
      .mockResolvedValueOnce(reply(50, "FIRST_DRAFT"))
      .mockResolvedValueOnce(reply(90, "SECOND_DRAFT"));

    await runEngine(jobApplicationMode, jobInput, runner);

    const refinementPrompt = spy.mock.calls[1][0];
    expect(refinementPrompt).toContain("JD_MARKER");
    expect(refinementPrompt).toContain("RESUME_MARKER");
    expect(refinementPrompt).toContain("FIRST_DRAFT");
    expect(refinementPrompt).toContain("too generic");
  });

  it("stops after MAX_ATTEMPTS even if the score never reaches the threshold", async () => {
    const runner = new FakeRunner();
    const spy = jest.spyOn(runner, "run").mockResolvedValue(reply(60));

    const result = await runEngine(jobApplicationMode, jobInput, runner);

    expect(spy).toHaveBeenCalledTimes(MAX_ATTEMPTS);
    expect(result.meta?.refinementApplied).toBe(true);
  });

  it("keeps the previous result when the refinement is unparseable", async () => {
    const runner = new FakeRunner();
    jest
      .spyOn(runner, "run")
      .mockResolvedValueOnce(reply(65, "GOOD_ENOUGH"))
      .mockResolvedValueOnce("not json at all");
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await runEngine(jobApplicationMode, jobInput, runner);

    expect(result.body).toBe("GOOD_ENOUGH");
    expect(result.analysis?.score).toBe(65);
    errorSpy.mockRestore();
  });

  it("does not refine the comparison mode, where the score is a match %, not a quality score", async () => {
    const input: EngineInput<ComparisonContent> = {
      context: EngineContext.COMPARISON,
      tone: Tone.PROFESSIONAL,
      audience: Audience.RECRUITERS,
      content: { jobDescription: "JD", userResume: "CV" },
    };
    const runner = new FakeRunner();
    const spy = jest.spyOn(runner, "run").mockResolvedValue(
      JSON.stringify({ matchScore: 40, matchingSkills: ["PHP"], missingSkills: ["Go"], summary: "s", actionPlan: ["a"] })
    );

    const result = await runEngine(jobComparisonMode, input, runner);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.meta?.refinementApplied).toBe(false);
  });
});