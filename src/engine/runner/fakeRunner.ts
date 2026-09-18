import { EngineRunner } from "./types";

/**
 * FakeRunner simulates an AI provider without making real API calls.
 * It inspects the prompt text to figure out which mode is calling it,
 * then returns a canned JSON response shaped like that mode expects.
 *
 * IMPORTANT: the strings this checks for (e.g. "RESUME:") must match
 * whatever your real buildPrompt() functions actually write. If you
 * change a prompt's wording, check this file still matches it.
 */
export class FakeRunner implements EngineRunner {
  async run(prompt: string): Promise<string> {
    // 1. JOB APPLICATION
    // Matches jobApplicationMode.buildPrompt, which writes:
    //   "You are an elite career consultant..." and "- RESUME: ..."
    if (prompt.includes("career consultant") || prompt.includes("RESUME:")) {
      return JSON.stringify({
        coverLetter: "Dear Hiring Manager, I am excited to apply for this role...",
        resume: "Tailored summary based on candidate experience.",
        analysis: {
          detectedRole: "Frontend Developer",
          detectedCompany: "Awesome Startup",
          score: 90,
          critique: "Strong skills match.",
          suggestions: ["Quantify achievements."],
        },
      });
    }

    // 2. MARKETPLACE
    // Matches marketplaceMode.buildPrompt, which writes:
    //   "You are a professional e-commerce copywriter..."
    //   "Create a high-converting marketplace listing for: <productName>."
    if (prompt.includes("e-commerce copywriter") || prompt.includes("marketplace listing")) {
      const itemMatch = prompt.match(/marketplace listing for:\s*(.*?)\./) || [null, "Vintage Leather Bag"];
      const itemName = itemMatch[1]?.trim() || "Vintage Leather Bag";

      return JSON.stringify({
        title: itemName,
        description: `This ${itemName} is a great item for sale.`,
        tags: ["test", "demo"],
        analysis: {
          score: 85,
          critique: "Good description.",
          suggestions: ["Add more keywords."],
        },
      });
    }

    // 3. JOB COMPARISON
    // Matches jobComparisonMode.buildPrompt, which writes:
    //   "You are an expert Technical Recruiter and ATS optimizer..."
    if (prompt.includes("ATS optimizer") || prompt.includes("Match Percentage")) {
      return JSON.stringify({
        matchScore: 75,
        matchingSkills: ["TypeScript", "React"],
        missingSkills: ["Docker"],
        summary: "Good fit but lacks DevOps.",
        actionPlan: ["Take a Docker course"],
      });
    }

    // Fallback: if none of the above matched, something in a prompt's
    // wording changed and this file needs updating to match it.
    return JSON.stringify({ error: "No mock data for this prompt" });
  }
}