import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import type { AuthStartPayload } from "@/lib/types"

export async function POST(request: Request) {
  await sleep(400)
  const body: AuthStartPayload = await request.json()
  const { identifier, type } = body

  if (!identifier) {
    return NextResponse.json({ success: false, message: "Identifier is required" }, { status: 400 })
  }

  if (type === "email" && !identifier.includes("@")) {
    return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 })
  }

  if (type === "mobile" && !/^\+?[\d\s]{10,14}$/.test(identifier.replace(/\s/g, ""))) {
    return NextResponse.json({ success: false, message: "Invalid mobile number" }, { status: 400 })
  }

  // In production: send real OTP
  return NextResponse.json({
    success: true,
    message: `OTP sent to ${identifier}`,
    data: { identifier, type },
  })
}
