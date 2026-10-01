#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { resolve, relative } from "node:path";

const [, , targetPath] = process.argv;

if (!targetPath) {
  console.error("Usage: node scripts/ai-test-draft.mjs <path-to-source-file>");
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Set GEMINI_API_KEY first (export GEMINI_API_KEY=AIzaSy...).");
  process.exit(1);
}

const absPath = resolve(targetPath);
if (!existsSync(absPath)) {
  console.error(`File not found: ${targetPath}`);
  process.exit(1);
}

const sourceCode = readFileSync(absPath, "utf8");
const relPath = relative(process.cwd(), absPath);

let styleReference = "";
const sampleTestPath = resolve("tests/engine/jobApplication.test.ts");
if (existsSync(sampleTestPath)) {
  styleReference = `\n\nHere is an existing test in this repo, to match its style and conventions:\n\`\`\`ts\n${readFileSync(sampleTestPath, "utf8")}\n\`\`\``;
}

const prompt = `You are drafting a Jest test file for the TypeScript source file below (path: ${relPath}).

Rules:
- Test observable behavior and edge cases (empty input, error paths, boundary values), not implementation details.
- Do not assert trivial things like "does not throw" as the only check.
- Use mocks for any external calls (LLM providers, network, filesystem).
- Flag with a "// REVIEW:" comment any assumption you had to make about behavior that wasn't clear from the code alone.
- Output ONLY valid TypeScript/Jest test code, no explanatory text or markdown blocks.

Source file:
\`\`\`ts
${sourceCode}
\`\`\`${styleReference}`;

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  }),
});

if (!response.ok) {
  console.error(`API error ${response.status}: ${await response.text()}`);
  process.exit(1);
}

const data = await response.json();
let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

// Pulizia di eventuali blocchi markdown
text = text.replace(/^```(typescript|ts)?\n/i, "").replace(/\n```$/, "");

console.log(text);
console.error(`\n--- Draft generated for ${relPath}. Review before saving under tests/. ---`);