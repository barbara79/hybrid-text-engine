import { OpenAIRunner } from "@/engine/runner/openAIRunner";

// Assumes jest-fetch-mock is set up globally, as in your existing runner test.
describe("OpenAIRunner error handling (mocked fetch)", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("throws on a non-200 response", async () => {
    fetchMock.mockResponseOnce("Internal Server Error", { status: 500 });
    const runner = new OpenAIRunner({ apiKey: "test" });

    await expect(runner.run("prompt")).rejects.toThrow();
  });

  it("throws on a rate limit response (429)", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: { message: "rate limited" } }), {
      status: 429,
    });
    const runner = new OpenAIRunner({ apiKey: "test" });

    await expect(runner.run("prompt")).rejects.toThrow();
  });

  it("throws when the response has no choices", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ choices: [] }));
    const runner = new OpenAIRunner({ apiKey: "test" });

    await expect(runner.run("prompt")).rejects.toThrow();
  });

  it("throws when the network request fails", async () => {
    fetchMock.mockRejectOnce(new Error("network down"));
    const runner = new OpenAIRunner({ apiKey: "test" });

    await expect(runner.run("prompt")).rejects.toThrow("network down");
  });
});