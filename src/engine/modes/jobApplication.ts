import { EngineMode } from "../core/mode"
import { EngineInput, EngineOutput, JobApplicationContent } from "../core/types"



export const jobApplicationMode: EngineMode<JobApplicationContent> = {
  name: "jobApplication",

  buildPrompt(input: EngineInput<JobApplicationContent>) {
    const { role, company, experience, skills, education } = input.content
    const tone = input.tone ?? "professional"

    return `
Generate two professional documents for a job application:

1. Cover Letter: personalized for role "${role}" at "${company}". Use ${tone} tone.
2. CV / Resume: summarize candidate experience, skills, and education.

Candidate info:
Experience: ${experience}
Skills: ${skills?.join(", ") ?? "Not specified"}
Education: ${education ?? "Not specified"}

Return both sections clearly labeled.
`.trim()
  },

  formatOutput(raw: string): EngineOutput {
    // For now, placeholder logic — later replace with AI output parsing
    return {
      sections: {
        coverLetter: `Dear Hiring Manager,\n\n${raw}\n\nBest regards,\nCandidate`,
        resume: `Candidate Resume:\n\n${raw}`,
      },
      body: raw, // fallback 
    }
  },
}
