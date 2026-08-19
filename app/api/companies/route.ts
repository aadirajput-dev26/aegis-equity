import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { companies } from "@/lib/mock-data"

export async function GET(request: Request) {
  await sleep(250)
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.toLowerCase()
  const sector = searchParams.get("sector")
  const status = searchParams.get("status")

  let result = companies

  if (q) {
    result = result.filter(
      (c) => c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    )
  }
  if (sector) {
    result = result.filter((c) => c.sector === sector)
  }
  if (status) {
    result = result.filter((c) => c.status === status)
  }

  return NextResponse.json({ success: true, data: result })
}
