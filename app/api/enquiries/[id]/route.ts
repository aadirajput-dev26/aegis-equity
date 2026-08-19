import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { enquiries } from "@/lib/mock-data"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await sleep(200)
  const { id } = await params
  const enquiry = enquiries.find((e) => e.id === id)
  if (!enquiry) {
    return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: enquiry })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await sleep(300)
  const { id } = await params
  const body = await request.json()
  const index = enquiries.findIndex((e) => e.id === id)
  if (index === -1) {
    return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 })
  }
  enquiries[index] = { ...enquiries[index], ...body, updatedAt: new Date().toISOString() }
  return NextResponse.json({ success: true, data: enquiries[index] })
}
