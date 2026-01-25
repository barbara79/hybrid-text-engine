import { NextRequest, NextResponse } from "next/server"
import { runEngine } from "@/engine/core/engine"
import { marketplaceMode } from "@/engine/modes/marketplace"
import { jobApplicationMode } from "@/engine/modes/jobApplication"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const mode =
      body.mode === "jobApplication" ? jobApplicationMode : marketplaceMode

    const result = await runEngine(mode, body)

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
