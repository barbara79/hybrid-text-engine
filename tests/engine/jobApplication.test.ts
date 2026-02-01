import { jobApplicationMode } from "../../src/engine/modes/jobApplication"
import { runEngine } from "../../src/engine/core/engine"
import { EngineContext, EngineInput, Tone } from "../../src/engine/core/types"
import { FakeRunner } from "@/engine/runner/FakeRunner"
import { JobApplicationContent } from "@/engine/core/content"

describe("JobApplicationMode", () => {
  it("should return both cover letter and resume sections", async () => {
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

    expect(result.sections).toBeDefined();
    expect(result.sections?.coverLetter).toContain("Dear");
    expect(result.sections?.coverLetter).toContain("Frontend Developer");
    expect(result.sections?.resume).toContain("Role: Frontend Developer");
    expect(result.sections?.resume).toContain("Company: Awesome Startup");
    expect(result.sections?.resume).toContain("Skills: React, TypeScript");
    expect(result.sections?.resume).toContain("Education: B.Sc. Computer Science");
  })
})
