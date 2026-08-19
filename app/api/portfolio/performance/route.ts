import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { portfolioPerformance } from "@/lib/mock-data"

export async function GET(request: Request) {
  await sleep(200)
  const { searchParams } = new URL(request.url)
  const range = (searchParams.get("range") as keyof typeof portfolioPerformance) || "1Y"
  const data = portfolioPerformance[range] || portfolioPerformance["1Y"]
  return NextResponse.json({ success: true, data })
}
