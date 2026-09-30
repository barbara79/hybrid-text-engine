import { jobApplicationMode } from "@/engine/modes/jobApplication";
import { runEngine } from "@/engine/core/engine";
import { Audience, EngineContext, EngineInput, Tone } from "@/engine/core/types";
import { FakeRunner } from "@/engine/runner/fakeRunner";
import { JobApplicationContent } from "@/engine/core/content";

describe("JobApplicationMode", () => {
  it("should return cover letter, resume, and quality analysis", async () => {
    const input: EngineInput<JobApplicationContent> = {
      context: EngineContext.JOB,
      tone: Tone.PROFESSIONAL,
      audience: Audience.RECRUITERS,
      content: {
        role: "Frontend Developer",
        company: "Awesome Startup",
        jobDescription: "Looking for a Frontend Developer with 5+ years of React experience.",
        experience: "5+ years React, TypeScript",
        skills: ["React", "TypeScript"],
        education: "B.Sc. Computer Science",
      },
    };

    const runner = new FakeRunner();

    jest.spyOn(runner, "run").mockResolvedValue(
      JSON.stringify({
        coverLetter: "Dear Hiring Manager, I am excited to apply for the Frontend Developer role...",
        resume: "Senior developer with 5+ years of React and TypeScript experience.",
        analysis: {
          detectedRole: "Frontend Developer",
          detectedCompany: "Awesome Startup",
          score: 90,
          critique: "Strong technical alignment with the role.",
          suggestions: ["Add a measurable achievement", "Shorten the opening paragraph"],
        },
      })
    );

    const result = await runEngine(jobApplicationMode, input, runner);

    expect(result.sections).toBeDefined();
    expect(result.sections.coverLetter).toContain("Frontend Developer");
    expect(result.sections.detectedRole).toBe("Frontend Developer");
    expect(result.sections.detectedCompany).toBe("Awesome Startup");

    expect(result.analysis).toBeDefined();
    expect(result.analysis?.score).toBeGreaterThan(0);
    expect(result.analysis?.suggestions.length).toBeGreaterThan(0);
    expect(result).toMatchSnapshot();
  });

  it("should trigger a refinement pass when the first score is below 80", async () => {
    const input: EngineInput<JobApplicationContent> = {
      context: EngineContext.JOB,
      tone: Tone.PROFESSIONAL,
      audience: Audience.RECRUITERS,
      content: {
        role: "Frontend Developer",
        company: "Awesome Startup",
        jobDescription: "Looking for a Frontend Developer.",
        experience: "2 years React",
      },
    };

    const runner = new FakeRunner();

    jest
      .spyOn(runner, "run")
      .mockResolvedValueOnce(
        JSON.stringify({
          coverLetter: "A generic first attempt.",
          resume: "Some resume text.",
          analysis: {
            detectedRole: "Frontend Developer",
            detectedCompany: "Awesome Startup",
            score: 60,
            critique: "Too generic, no specific detail.",
            suggestions: ["Add specifics"],
          },
        })
      )
      .mockResolvedValueOnce(
        JSON.stringify({
          coverLetter: "A much more specific, tailored cover letter.",
          resume: "Some resume text.",
          analysis: {
            detectedRole: "Frontend Developer",
            detectedCompany: "Awesome Startup",
            score: 92,
            critique: "Strong, specific alignment.",
            suggestions: [],
          },
        })
      );

    const result = await runEngine(jobApplicationMode, input, runner);

    expect(runner.run).toHaveBeenCalledTimes(2);
    expect(result.analysis?.score).toBe(92);
    expect(result.meta?.refinementApplied).toBe(true);
  });
});