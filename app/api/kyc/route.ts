import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { kycData } from "@/lib/mock-data"

export async function GET() {
  await sleep(200)
  return NextResponse.json({ success: true, data: kycData })
}
