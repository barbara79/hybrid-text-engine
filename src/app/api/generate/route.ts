import { NextRequest, NextResponse } from "next/server"
import { runEngine } from "@/engine/core/engine"
import { marketplaceMode } from "@/engine/modes/marketplace"
import { jobApplicationMode } from "@/engine/modes/jobApplication"
import { FakeRunner } from "@/engine/runner/FakeRunner"
import { EngineRequest } from "@/engine/core/request"

export async function POST(req: NextRequest) {
  try {
    const runner = new FakeRunner();
    const body: EngineRequest = await req.json();

    switch (body.mode) {
      case "jobApplication": {
        const result = await runEngine(jobApplicationMode, body, runner);
        return NextResponse.json(result);
      }

      case "marketplace": {
        const result = await runEngine(marketplaceMode, body, runner);
        return NextResponse.json(result);
      }

      default:
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

