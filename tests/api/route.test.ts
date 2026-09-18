import { POST } from "../../src/app/api/generate/route";
import { NextRequest } from "next/server";

// Helper to create a mock NextRequest with a JSON body
function createRequest(body: object): NextRequest {
  return {
    method: "POST",
    json: jest.fn().mockResolvedValue(body),
    headers: new Headers({ "content-type": "application/json" }),
  } as unknown as NextRequest;
}

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, opts) => ({
      status: opts?.status ?? 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

describe("POST /api/generate", () => {
  it("should generate content for JobApplication mode", async () => {
    const req = createRequest({
      mode: "jobApplication",
      // getRunner() reads body.provider directly — without this, the
      // route falls back to FakeRunner by coincidence (its default
      // case), not by an explicit decision. Setting it here makes the
      // test actually assert what it looks like it's asserting.
      provider: "openai",
      context: "job",
      tone: "professional",
      audience: "HR managers",
      content: {
        role: "Frontend Developer",
        company: "Awesome Startup",
        // jobDescription is required on JobApplicationContent
        jobDescription: "Looking for a Frontend Developer with React experience.",
        experience: "5+ years",
        skills: ["React"],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.sections).toBeDefined();
    expect(data.sections.coverLetter).toBeDefined();
    // This must match what FakeRunner's job-application branch returns —
    // see fakeRunner.ts's "career consultant" / "RESUME:" match.
    expect(data.sections.coverLetter).toContain("excited to apply");
  });

  it("should return 400 for unknown mode", async () => {
    const req = createRequest({
      mode: "unknown" as any,
      provider: "openai",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid mode");
  });
});