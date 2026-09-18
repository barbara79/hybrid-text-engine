import { NextRequest, NextResponse } from "next/server"
import { runEngine } from "@/engine/core/engine"
import { EngineRequest } from "@/engine/core/request"
import { MODE_REGISTRY } from "@/engine/core/registry"
import { getRunner } from "@/engine/runner/factory";
import { EngineMode } from "@/engine/core/mode";


export async function POST(req: NextRequest) {
  try {
    const body: EngineRequest = await req.json();
    if (!body?.mode || !body?.provider) {
      return NextResponse.json({ error: "Missing required fields: mode, provider" }, { status: 400 });
    }

    if (!MODE_REGISTRY[body.mode]) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const modeLogic = MODE_REGISTRY[body.mode];
  
    if (!modeLogic) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const runner = getRunner(body.provider);

    const result = await runEngine(modeLogic as EngineMode<any>, body, runner);

    return NextResponse.json(result);
  } catch (err) {
    console.error("API Error:", err);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    )
  }
}

