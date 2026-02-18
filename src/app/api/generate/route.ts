import { NextRequest, NextResponse } from "next/server"
import { runEngine } from "@/engine/core/engine"
import { EngineRequest } from "@/engine/core/request"
import { OpenAIRunner } from "@/engine/runner/openAIRunner";
import { FakeRunner } from "@/engine/runner/fakeRunner"
import { MODE_REGISTRY } from "@/engine/core/registry"

export async function POST(req: NextRequest) {
  try {


    const body: EngineRequest = await req.json();

    const mode = MODE_REGISTRY[body.mode];
    if (!mode) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const runner = 
      process.env.USE_OPENAI === "true"
      ? new OpenAIRunner({apiKey: process.env.OPENAI_API_KEY})
      : new FakeRunner();

    const result = await runEngine(mode, body, runner);

    return NextResponse.json(result);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    )
  }
}

