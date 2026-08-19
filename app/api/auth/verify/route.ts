import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import type { AuthVerifyPayload } from "@/lib/types"

const MOCK_OTP = "123456"

export async function POST(request: Request) {
  await sleep(500)
  const body: AuthVerifyPayload = await request.json()
  const { identifier, otp } = body

  if (!identifier || !otp) {
    return NextResponse.json({ success: false, message: "Identifier and OTP are required" }, { status: 400 })
  }

  if (otp !== MOCK_OTP) {
    return NextResponse.json({ success: false, message: "Invalid OTP. Please try again." }, { status: 401 })
  }

  // In production: validate real OTP, create session/JWT
  return NextResponse.json({
    success: true,
    message: "Authentication successful",
    data: {
      user: {
        id: "usr-001",
        name: "Arjun Sharma",
        identifier,
      },
      token: "mock-jwt-token-skyvest-2026",
    },
  })
}
