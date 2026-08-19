import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { companies } from "@/lib/mock-data"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await sleep(200)
  const { id } = await params
  const company = companies.find((c) => c.id === id || c.slug === id)
  if (!company) {
    return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: company })
}
