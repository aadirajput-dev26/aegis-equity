import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { watchlistItems } from "@/lib/mock-data"

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await sleep(250)
  const { id } = await params
  const index = watchlistItems.findIndex((w) => w.id === id || w.companyId === id)
  if (index === -1) {
    return NextResponse.json({ success: false, message: "Watchlist item not found" }, { status: 404 })
  }
  watchlistItems.splice(index, 1)
  return NextResponse.json({ success: true, message: "Removed from watchlist" })
}
