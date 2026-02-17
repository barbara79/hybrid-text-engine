import { EngineInput, EngineOutput, EngineContext, ComparisonContent } from "../core/types";
import { EngineMode } from "../core/mode";

export const comparisonMode: EngineMode<ComparisonContent> = {
  id: EngineContext.COMPARISON,
  name: "Match Analysis",

  buildPrompt(input: EngineInput<ComparisonContent>) {
    const { jobDescription, userResume } = input.content;
    return `
      You are an expert Technical Recruiter and ATS (Applicant Tracking System) optimizer.
      
      TASK:
      1. Compare the following Resume against the Job Description.
      2. Calculate a Match Percentage (0-100) based on skills, seniority, and keywords.
      3. Identify specific "Matches" (Skills the user has).
      4. Identify specific "Gaps" (Skills/Requirements the user is missing).

      Job Description: ${jobDescription}
      User Resume: ${userResume}

      Return ONLY a JSON object:
      {
        "matchScore": number,
        "matchingSkills": ["skill1", "skill2"],
        "missingSkills": ["skillA", "skillB"],
        "summary": "One sentence summary of the fit",
        "actionPlan": ["suggestion 1", "suggestion 2"]
      }
    `;
  },

  formatOutput(raw: string, input: EngineInput<ComparisonContent>): EngineOutput {
    try {
      const parsed = JSON.parse(raw);

      const matchList = parsed.matchingSkills.map((s: string) => `✅ ${s}`).join("\n");
      const gapList = parsed.missingSkills.map((s: string) => `❌ ${s}`).join("\n");

      return {
        body: `### Match Score: ${parsed.matchScore}%\n\n${parsed.summary}`,
        sections: {
          score: `${parsed.matchScore}%`,
          matches: matchList,
          gaps: gapList,
          advice: parsed.actionPlan.join(". ")
        },
        analysis: {
          score: Number(parsed.matchScore),
          critique: String(parsed.summary),
          suggestions: parsed.actionPlan
        },
        meta: {
          mode: EngineContext.COMPARISON,
          tone: input.tone
        }
      };
    } catch (e) {
      return {
        body: "Error parsing comparison data.",
        sections: { error: "Failed to analyze match." },
        meta: { mode: EngineContext.COMPARISON }
      };
    }
  }
};