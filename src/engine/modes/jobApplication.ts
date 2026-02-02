import { EngineMode } from "../core/mode"
import { EngineContext, EngineInput, EngineOutput } from "../core/types"
import { JobApplicationContent } from "../core/content"



export const jobApplicationMode: EngineMode<JobApplicationContent> = {
  id: EngineContext.JOB,
  name: "Job Application Mode",

  buildPrompt(input: EngineInput<JobApplicationContent>) {
    const { role, company, experience, skills, education } = input.content
    

    return `
Write a professional cover letter for the following job application.

Role: ${role}
Company: ${company}
Experience: ${experience}
Skills: ${skills?.join(", ") ?? "Not specified"}
Education: ${education ?? "Not specified"}

Tone: ${input.tone}
Audience: ${input.audience}
`;
  },

  formatOutput(raw: string, input: EngineInput<JobApplicationContent>) {
    const { role, company, experience, skills, education } = input.content;

    const coverLetter = `
Dear Hiring Manager,

I am applying for the ${role} position at ${company}.

${experience}

${skills ? `My skills include: ${skills.join(", ")}.` : ""}

Kind regards,
Candidate
`.trim();

  const resume = `
Role: ${role}
Company: ${company}

Experience:
${experience}

${skills ? `Skills: ${skills.join(", ")}` : ""}
${education ? `Education: ${education}` : ""}
`.trim();

  return {
    sections: {
      coverLetter,
      resume,
    },
    body: `${coverLetter}\n\n---\n\n${resume}`,
  };
}

}
