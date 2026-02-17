import { POST } from "../../src/app/api/generate/route";
import { NextRequest } from "next/server";



// Helper to create a mock NextRequest with JSON body
function createRequest(body: object): NextRequest {
  return {
    method: 'POST',
    json: jest.fn().mockResolvedValue(body),
    headers: new Headers({ 'content-type': 'application/json' }),
  } as unknown as NextRequest;
}

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, opts) => ({
      status: opts?.status ?? 200,
      // Ensure json() is a function that returns a PROMISE of the data
      json: () => Promise.resolve(data), 
    })),
  },
}));

describe("POST /api/generate", () => {

  beforeAll(() => {
    process.env.USE_OPENAI = "false"; 
  });

  
  it("should generate content for JobApplication mode", async () => {
    const req = createRequest({
      mode: "jobApplication",
      context: "job",
      tone: "professional",
      audience: "HR managers",
      content: {
        role: "Frontend Developer",
        company: "Awesome Startup",
        experience: "5+ years",
        skills: ["React"],
      },
    });

    const res = await POST(req);
    const data = await res.json();

    // Now testing the parsed JSON sections from your FakeRunner
    expect(data.sections).toBeDefined();
    expect(data.sections.coverLetter).toBeDefined();
    // These strings must match what your FakeRunner returns!
    expect(data.sections.coverLetter).toContain("Frontend Developer");
  });

  it("should return 400 for unknown mode", async () => {
    const req = createRequest({
      mode: "unknown" as any,
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid mode");
  });
});
