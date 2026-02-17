import { EngineMode } from "../core/mode"
import { EngineContext, EngineInput, EngineOutput } from "../core/types"
import { JobApplicationContent } from "../core/content"



export const jobApplicationMode: EngineMode<JobApplicationContent> = {
  id: EngineContext.JOB,
  name: "Job Application Mode",

  buildPrompt(input: EngineInput<JobApplicationContent>) {
    const { role, company, experience, skills, education } = input.content
    
    return `
    You are an expert career coach. 
    
    TASK:
    1. Generate a cover letter and a resume summary for:
       Role: ${role}, Company: ${company}, Experience: ${experience}, Skills: ${skills?.join(", ")}, Education: ${education}.
    2. Critically analyze the output. Identify if the tone is too generic or if key skills are missing.
    3. Provide a quality score (0-100) and specific improvement suggestions.

    Tone: ${input.tone}
    Audience: ${input.audience}

    Return the result ONLY as a JSON object with this exact structure:
    {
      "coverLetter": "text",
      "resume": "text",
      "analysis": {
        "score": number,
        "critique": "string highlighting strengths/weaknesses",
        "suggestions": ["suggestion 1", "suggestion 2"]
      }
    }
  `;
  },

  formatOutput(raw: string, input: EngineInput<JobApplicationContent>): EngineOutput {
  try {
    const parsed = JSON.parse(raw);

    return {
      body: `${parsed.coverLetter ?? ""}\n\n---\n\n${parsed.resume ?? ""}`,
      sections: {
        coverLetter: String(parsed.coverLetter ?? ""),
        resume: String(parsed.resume ?? ""),
      },
      analysis: {
          score: Number(parsed.analysis?.score ?? 0),
          critique: String(parsed.analysis?.critique ?? "No critique provided."),
          suggestions: Array.isArray(parsed.analysis?.suggestions) ? parsed.analysis.suggestions : [],
        },
      meta: {
        mode: EngineContext.JOB,
        tone: input.tone,
      }
    };
  } catch (e) {
    console.error("Failed to parse AI response", e);
      return {
        body: raw,
        sections: { error: "Could not parse specific sections" },
        meta: { mode: EngineContext.JOB }
      };
    }
  }
}
