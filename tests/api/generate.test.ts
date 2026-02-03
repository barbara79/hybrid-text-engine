import { POST } from "../../src/app/api/generate/route";
import { NextRequest } from "next/server";
import { FakeRunner } from "@/engine/runner/fakeRunner"


// Helper to create a mock NextRequest with JSON body
function createRequest(body: object): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe("POST /api/generate", () => {

  it("should generate content for JobApplication mode", async () => {
    const req = createRequest({
      mode: "jobApplication",
      context: "job",
      tone: "professional",
      audience: "HR managers",
      content: {
        role: "Frontend Developer",
        company: "Awesome Startup",
        experience: "5+ years React, TypeScript",
        skills: ["React", "TypeScript"],
        education: "B.Sc. Computer Science",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.sections).toBeDefined();
    expect(data.sections.coverLetter).toContain("Frontend Developer");
    expect(data.sections.resume).toContain("Awesome Startup");
    expect(data.body).toContain("Role: Frontend Developer");
  });

  it("should generate content for Marketplace mode", async () => {
    const req = createRequest({
      mode: "marketplace",
      context: "marketplace",
      tone: "friendly",
      audience: "general buyers",
      content: {
        productName: "Vintage Leather Bag",
        description: "Genuine leather, slightly used, excellent condition",
        price: 120,
        platform: "eBay",
      },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.sections).toBeDefined();
    expect(data.sections.title).toContain("Vintage Leather Bag");
    expect(data.sections.body).toContain("Price: 120");
    expect(data.sections.body).toContain("eBay");
    expect(data.body).toContain("Vintage Leather Bag");
  });

  it("should return 400 for unknown mode", async () => {
    const req = createRequest({
      mode: "unknown",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid mode");
  });
});
