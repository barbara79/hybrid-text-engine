import { runEngine } from "@/engine/core/engine";
import { jobApplicationMode } from "@/engine/modes/jobApplication";
import { FakeRunner } from "@/engine/runner/fakeRunner";
import { Audience, EngineContext, EngineInput, Tone } from "@/engine/core/types";
import { JobApplicationContent } from "@/engine/core/content";

// If your engine exports the threshold, import it instead of hardcoding.
const THRESHOLD = 80;

const jobInput: EngineInput<JobApplicationContent> = {
  context: EngineContext.JOB,
  tone: Tone.PROFESSIONAL,
  audience: Audience.RECRUITERS,
  content: {
    role: "Backend Developer",
    company: "Acme",
    jobDescription: "PHP and Symfony",
    experience: "8 years PHP",
  },
};

const reply = (score: unknown, letter = "letter") =>
  JSON.stringify({
    coverLetter: letter,
    resume: "summary",
    analysis: {
      detectedRole: "r",
      detectedCompany: "c",
      score,
      critique: "too generic",
      suggestions: ["be specific"],
    },
  });

describe("Critic loop: threshold behaviour", () => {
  it("does not refine when the first score meets the threshold exactly", async () => {
    const runner = new FakeRunner();
    const spy = jest.spyOn(runner, "run").mockResolvedValue(reply(THRESHOLD));

    const result = await runEngine(jobApplicationMode, jobInput, runner);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result.meta?.refinementApplied).toBe(false);
  });

  it("refines when the score is just below the threshold", async () => {
    const runner = new FakeRunner();
    const spy = jest
      .spyOn(runner, "run")
      .mockResolvedValueOnce(reply(THRESHOLD - 1))
      .mockResolvedValueOnce(reply(90));

    await runEngine(jobApplicationMode, jobInput, runner);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("returns the refined draft when refinement reaches the threshold", async () => {
    const runner = new FakeRunner();
    const spy = jest
      .spyOn(runner, "run")
      .mockResolvedValueOnce(reply(50, "FIRST_DRAFT"))
      .mockResolvedValueOnce(reply(90, "SECOND_DRAFT"));

    const result = await runEngine(jobApplicationMode, jobInput, runner);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(result.body).toBe("SECOND_DRAFT");
    expect(result.analysis?.score).toBe(90);
    expect(result.meta?.refinementApplied).toBe(true);
  });
});

describe("Critic loop: untrusted scores from the model", () => {
  // ASSUMPTION: a missing, non-numeric or out-of-range score counts as
  // "invalid" and triggers a refinement instead of passing silently.
  // If you prefer to throw or clamp, change the expectation, but decide on purpose.
  it.each([
    ["a string like 85/100", "85/100"],
    ["a missing score", undefined],
    ["null", null],
    ["a negative number", -5],
    ["a number above 100", 250],
  ])("treats %s as an invalid score and refines", async (_label, badScore) => {
    const runner = new FakeRunner();
    const spy = jest
      .spyOn(runner, "run")
      .mockResolvedValueOnce(reply(badScore, "FIRST_DRAFT"))
      .mockResolvedValueOnce(reply(90, "SECOND_DRAFT"));

    const result = await runEngine(jobApplicationMode, jobInput, runner);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(result.body).toBe("SECOND_DRAFT");
  });
});

describe("Critic loop: refinement makes things worse", () => {
  // ASSUMPTION: the engine keeps the higher-scoring draft.
  // If this fails, the engine returns the second draft no matter what,
  // which is a real finding: "refined" does not always mean "better".
  it("keeps the first draft when the refined draft scores lower", async () => {
    const runner = new FakeRunner();
    jest
      .spyOn(runner, "run")
      .mockResolvedValueOnce(reply(70, "FIRST_DRAFT"))
      .mockResolvedValueOnce(reply(40, "SECOND_DRAFT"));

    const result = await runEngine(jobApplicationMode, jobInput, runner);

    expect(result.body).toBe("FIRST_DRAFT");
    expect(result.analysis?.score).toBe(70);
  });
});

describe("Critic loop: runner failures", () => {
  // ASSUMPTION: same policy as an unparseable refinement. Keep the first draft.
  it("keeps the first draft when the runner throws during refinement", async () => {
    const runner = new FakeRunner();
    jest
      .spyOn(runner, "run")
      .mockResolvedValueOnce(reply(65, "FIRST_DRAFT"))
      .mockRejectedValueOnce(new Error("network error"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await runEngine(jobApplicationMode, jobInput, runner);

    expect(result.body).toBe("FIRST_DRAFT");
    expect(result.analysis?.score).toBe(65);
    errorSpy.mockRestore();
  });

  it("propagates the error when the first call fails (nothing to fall back to)", async () => {
    const runner = new FakeRunner();
    jest.spyOn(runner, "run").mockRejectedValue(new Error("network error"));

    await expect(
      runEngine(jobApplicationMode, jobInput, runner)
    ).rejects.toThrow("network error");
  });

  it("returns an error result when the first response is not parseable", async () => {
    const runner = new FakeRunner();
    jest.spyOn(runner, "run").mockResolvedValue("not json at all");
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await runEngine(jobApplicationMode, jobInput, runner);

    expect(result.sections).toEqual({ error: "Parsing failed" });
    expect(result.meta?.refinementApplied).toBe(false);
    errorSpy.mockRestore();
});
});