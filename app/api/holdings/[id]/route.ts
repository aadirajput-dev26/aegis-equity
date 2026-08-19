import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { holdings } from "@/lib/mock-data"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await sleep(200)
  const { id } = await params
  const holding = holdings.find((h) => h.id === id)
  if (!holding) {
    return NextResponse.json({ success: false, message: "Holding not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: holding })
}
