import { jobApplicationMode } from "../../src/engine/modes/jobApplication"
import { runEngine } from "../../src/engine/core/engine"
import { EngineInput, JobApplicationContent } from "../../src/engine/core/types"

describe("JobApplicationMode", () => {
  it("should return both cover letter and resume sections", async () => {
    const input: EngineInput<JobApplicationContent> = {
      tone: "professional",
      content: {
        role: "Frontend Developer",
        company: "Awesome Startup",
        experience: "5+ years React, TypeScript",
        skills: ["React", "TypeScript"],
        education: "B.Sc. Computer Science",
      },
      audience: "HR",
      context: "job",
    }

    const result = await runEngine(jobApplicationMode, input)

    expect(result.sections).toBeDefined()
    expect(result.sections?.coverLetter).toContain("Dear")
    expect(result.sections?.resume).toContain("Resume")
  })
})
