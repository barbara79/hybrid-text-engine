import { NextRequest, NextResponse } from "next/server"
import { runEngine } from "@/engine/core/engine"
import { EngineRequest } from "@/engine/core/request"
import { MODE_REGISTRY } from "@/engine/core/registry"
import { getRunner } from "@/engine/runner/factory";


export async function POST(req: NextRequest) {
  try {
    const body: EngineRequest = await req.json();
    const modeLogic = MODE_REGISTRY[body.mode];
  
  if (!modeLogic) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

    const runner = getRunner(body.provider);

    const result = await runEngine(modeLogic, body, runner);

    return NextResponse.json(result);
  } catch (err) {
    console.error("API Error:", err);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    )
  }
}

