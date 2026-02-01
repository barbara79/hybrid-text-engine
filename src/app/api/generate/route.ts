import { NextRequest, NextResponse } from "next/server"
import { runEngine } from "@/engine/core/engine"
import { marketplaceMode } from "@/engine/modes/marketplace"
import { jobApplicationMode } from "@/engine/modes/jobApplication"
import { FakeRunner } from "@/engine/runner/FakeRunner"
import { EngineRequest } from "@/engine/core/request"

export async function POST(req: NextRequest) {
  try {
    // TODO: Use FakeRunner for demonstration; later replace with AI runner as needed
    const runner = new FakeRunner();
    const body: EngineRequest = await req.json();

    switch (body.mode) {
      case "jobApplication":
        // TS knows body.content is JobApplicationContent here
        return NextResponse.json(await runEngine(jobApplicationMode, body, runner));

      case "marketplace":
        // TS knows body.content is MarketplaceContent here
        return NextResponse.json(await runEngine(marketplaceMode, body, runner));

      default:
        // Should never happen, but safe fallback
        return NextResponse.json(
          { error: "Invalid mode" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
