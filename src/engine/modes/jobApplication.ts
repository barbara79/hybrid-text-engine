import { EngineMode } from "../core/mode";
import { EngineContext, EngineInput, EngineOutput } from "../core/types";
import { JobApplicationContent } from "../core/content";

export const jobApplicationMode: EngineMode<JobApplicationContent> = {
  id: EngineContext.JOB,
  name: "Job Application Mode",

  buildPrompt(input: EngineInput<JobApplicationContent>): string {
    const resumeText = input.content.experience;
    const jobDescription = input.content.jobDescription;

    return `
      You are an elite career consultant specializing in tech transitions.

      INPUTS:
      - RESUME: ${resumeText}
      - JOB DESCRIPTION: ${jobDescription}

      TASK:
      1. Extract "detectedRole" and "detectedCompany" from the JOB DESCRIPTION.
      2. Identify the 2-3 strongest connections between the RESUME's actual experience and the JOB DESCRIPTION's requirements — do not invent achievements not present in the resume.
      3. Write a cover letter that makes those connections explicit and specific, avoiding generic phrases like "I am passionate about" or "great fit."

      OUTPUT FORMAT (STRICT JSON ONLY, no markdown fences):
        {
        "coverLetter": "Full letter text...",
        "resume": "Tailored summary...",
        "analysis": {
          "detectedRole": "extracted title",
          "detectedCompany": "extracted company",
          "score": 90,
          "critique": "short feedback",
          "suggestions": ["tip 1", "tip 2"]
        }
      }
    `.trim();
  },

  formatOutput(raw: string, input: EngineInput<JobApplicationContent>): EngineOutput {
    try {
      const cleanRaw = raw.replace(/```json\n?|```/g, "").trim();
      const parsed = JSON.parse(cleanRaw);

      return this.processParsedData!(parsed, input);
    } catch (e) {
      console.error("Format Error:", e);
      return {
        body: "AI returned malformed data. Raw: " + raw.substring(0, 100),
        sections: { error: "Parsing failed" },
        meta: { mode: EngineContext.JOB }
      };
    }
  },

  // Helper to keep formatOutput clean
  processParsedData(parsed: any, input: EngineInput<JobApplicationContent>): EngineOutput {
    return {
      body: parsed.coverLetter || "",
      sections: {
        coverLetter: String(parsed.coverLetter || ""),
        resume: String(parsed.resume || ""),
        // Explicitly passing these so the frontend {result.analysis.detectedRole} works
        detectedRole: String(parsed.analysis?.detectedRole || ""),
        detectedCompany: String(parsed.analysis?.detectedCompany || ""),
      },
      analysis: {
        score: Number(parsed.analysis?.score || 0),
        critique: String(parsed.analysis?.critique || ""),
        suggestions: Array.isArray(parsed.analysis?.suggestions) ? parsed.analysis.suggestions : [],
        // Adding them here too just to match your frontend code line 72
        detectedRole: String(parsed.analysis?.detectedRole || ""),
        detectedCompany: String(parsed.analysis?.detectedCompany || ""),
      },
      meta: {
        mode: EngineContext.JOB,
        tone: input.tone,
        refinementApplied: input.constraints?.refinementApplied 
      }
    };
  }
};