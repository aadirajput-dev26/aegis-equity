import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { watchlistItems } from "@/lib/mock-data"
import { companies } from "@/lib/mock-data"
import type { WatchlistItem } from "@/lib/types"

export async function GET() {
  await sleep(250)
  return NextResponse.json({ success: true, data: watchlistItems })
}

export async function POST(request: Request) {
  await sleep(300)
  const body = await request.json()
  const { companyId } = body

  const existing = watchlistItems.find((w) => w.companyId === companyId)
  if (existing) {
    return NextResponse.json({ success: false, message: "Company already in watchlist" }, { status: 409 })
  }

  const company = companies.find((c) => c.id === companyId)
  if (!company) {
    return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 })
  }

  const newItem: WatchlistItem = {
    id: `wl-${Date.now()}`,
    companyId: company.id,
    companyName: company.name,
    sector: company.sector,
    category: company.category,
    status: company.status,
    indicativePrice: company.indicativePrice,
    previousPrice: company.previousPrice,
    priceChange: company.priceChange,
    priceChangePercent: company.priceChangePercent,
    lastUpdated: company.lastUpdated,
    addedAt: new Date().toISOString(),
  }

  watchlistItems.push(newItem)
  return NextResponse.json({ success: true, data: newItem }, { status: 201 })
}
