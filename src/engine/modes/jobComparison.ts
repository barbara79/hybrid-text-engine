import { EngineInput, EngineOutput, EngineContext } from "../core/types";
import { EngineMode } from "../core/mode";
import { ComparisonContent } from "../core/content"

export const jobComparisonMode: EngineMode<ComparisonContent> = {
  id: EngineContext.COMPARISON,
  name: "Match Analysis",

  buildPrompt(input: EngineInput<ComparisonContent>): string {
    const { jobDescription, userResume } = input.content;
    return `
      You are an expert Technical Recruiter and ATS optimizer.
      TASK:
      1. Compare the following Resume against the Job Description.
      2. Calculate a Match Percentage (0-100) based on how many of the JD's explicitly stated requirements are evidenced in the resume — not general seniority or tone.
      3. Identify "Matches" and "Gaps" as concrete, named skills/requirements, not vague categories.
      Job Description: ${jobDescription}
      User Resume: ${userResume}

      Return ONLY a JSON object, no markdown fences:
      {
        "matchScore": number,
        "matchingSkills": ["skill1"],
        "missingSkills": ["skillA"],
        "summary": "text",
        "actionPlan": ["suggestion"]
      }
    `.trim();
  },

  formatOutput(raw: string, input: EngineInput<ComparisonContent>): EngineOutput {
    try {
      const cleanRaw = raw.replace(/```json\n?|```/g, "").trim();
      const parsed = JSON.parse(cleanRaw);

      // Ensure arrays exist before mapping to prevent runtime crashes
      const matches = Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills : [];
      const gaps = Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [];
      const plan = Array.isArray(parsed.actionPlan) ? parsed.actionPlan : [];

      return {
        body: `### Match Score: ${parsed.matchScore ?? 0}%\n\n${parsed.summary ?? ""}`,
        sections: {
          score: `${parsed.matchScore ?? 0}%`,
          matches: matches.map((s: string) => `✅ ${s}`).join("\n"),
          gaps: gaps.map((s: string) => `❌ ${s}`).join("\n"),
          advice: plan.join(". ")
        },
        analysis: {
          score: Number(parsed.matchScore ?? 0),
          critique: String(parsed.summary ?? ""),
          suggestions: plan
        },
        meta: {
          mode: EngineContext.COMPARISON,
          tone: input.tone
        }
      };
    } catch (e) {
      console.error("Comparison Parse Error:", e);
      return {
        body: "Error parsing comparison data.",
        sections: { error: "Failed to analyze match." },
        meta: { mode: EngineContext.COMPARISON }
      };
    }
  }
};