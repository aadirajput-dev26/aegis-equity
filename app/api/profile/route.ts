import { NextResponse } from "next/server"
import { sleep } from "@/lib/utils"
import { profileData } from "@/lib/mock-data"

export async function GET() {
  await sleep(200)
  return NextResponse.json({ success: true, data: profileData })
}

export async function PATCH(request: Request) {
  await sleep(350)
  const body = await request.json()
  // In-memory update
  Object.assign(profileData, body)
  return NextResponse.json({ success: true, data: profileData })
}

