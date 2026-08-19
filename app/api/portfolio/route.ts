import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { portfolioSummary } from "@/lib/mock-data"

export async function GET() {
  await sleep(300)
  return NextResponse.json({ success: true, data: portfolioSummary })
}
