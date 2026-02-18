import { jobApplicationMode } from "../../src/engine/modes/jobApplication"
import { runEngine } from "../../src/engine/core/engine"
import { EngineContext, EngineInput, Tone } from "../../src/engine/core/types"
import { FakeRunner } from "@/engine/runner/fakeRunner"
import { JobApplicationContent } from "@/engine/core/content"

describe("JobApplicationMode", () => {
  it("should return cover letter, resume, and quality analysis", async () => {
    const input: EngineInput<JobApplicationContent> = {
      context: EngineContext.JOB,
      tone: Tone.PROFESSIONAL,
      audience: "HR",
      content: {
        role: "Frontend Developer",
        company: "Awesome Startup",
        experience: "5+ years React, TypeScript",
        skills: ["React", "TypeScript"],
        education: "B.Sc. Computer Science",
      },
    }

    const runner = new FakeRunner();

    const result = await runEngine(jobApplicationMode, input, runner);

    // Assert the sections exist
    expect(result.sections).toBeDefined();
    // Assert the "Unique" features (The Analysis)
    expect(result.analysis).toBeDefined();
    expect(result.analysis?.score).toBeGreaterThan(0);
    expect(result.analysis?.suggestions.length).toBeGreaterThan(0);

  // Snapshot test used to lock the full output contract.
  // This helps detect accidental breaking changes when extending the engine.
    expect(result).toMatchSnapshot();
  })
})
