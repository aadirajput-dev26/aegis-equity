import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { enquiries } from "@/lib/mock-data"
import type { Enquiry, EnquiryCreatePayload } from "@/lib/types"

export async function GET(request: Request) {
  await sleep(300)
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const status = searchParams.get("status")

  let result = [...enquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (type) result = result.filter((e) => e.type === type)
  if (status) result = result.filter((e) => e.status === status)

  return NextResponse.json({ success: true, data: result })
}

export async function POST(request: Request) {
  await sleep(400)
  const body: EnquiryCreatePayload = await request.json()
  const { companyId, type, quantity, indicativePrice, notes } = body

  if (!companyId || !type || !quantity || !indicativePrice) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
  }

  const { companies } = await import("@/lib/mock-data")
  const company = companies.find((c) => c.id === companyId)
  if (!company) {
    return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 })
  }

  const newEnquiry: Enquiry = {
    id: `enq-${Date.now()}`,
    companyId,
    companyName: company.name,
    type,
    quantity,
    indicativePrice,
    totalValue: quantity * indicativePrice,
    status: "pending",
    notes: notes || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  enquiries.push(newEnquiry)
  return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 })
}
