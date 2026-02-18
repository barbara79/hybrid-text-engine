import { EngineRunner } from "./engineRunner";

export class FakeRunner implements EngineRunner {
  async run(prompt: string): Promise<string> {
    // 1. JOB APPLICATION ECHO
    if (prompt.includes("career coach") || prompt.includes("Role:")) {
      const roleMatch = prompt.match(/Role:\s*(.*?),/) || [null, "Frontend Developer"];
      const role = roleMatch[1];

      return JSON.stringify({
        coverLetter: `Dear Hiring Manager, I am a ${role}...`,
        resume: `Role: ${role}\nSummary: Expert developer.`,
        analysis: {
          score: 90,
          critique: "Strong skills match.",
          suggestions: ["Quantify achievements."]
        }
      });
    }

    // 2. MARKETPLACE ECHO
    if (prompt.includes("marketplace") || prompt.includes("Item:") || prompt.includes("productName")) {
      // Look for the product name in the prompt
      const itemMatch = prompt.match(/Item:\s*(.*?)\n/) || prompt.match(/productName:\s*(.*?)\n/) || [null, "Vintage Leather Bag"];
      const itemName = itemMatch[1]?.trim() || "Vintage Leather Bag";

      return JSON.stringify({
        title: itemName,
        description: `This ${itemName} is a great item for sale. Price: 120 Platform: eBay`,
        tags: ["test", "demo"],
        analysis: {
          score: 85,
          critique: "Good description.",
          suggestions: ["Add more keywords."]
        }
      });
    }

    // 3. COMPARISON ECHO
    if (prompt.includes("ATS") || prompt.includes("Match Analysis")) {
      return JSON.stringify({
        matchScore: 75,
        matchingSkills: ["TypeScript", "React"],
        missingSkills: ["Docker"],
        summary: "Good fit but lacks DevOps.",
        actionPlan: ["Take a Docker course"]
      });
    }

    return JSON.stringify({ error: "No mock data for this prompt" });
  }
}
