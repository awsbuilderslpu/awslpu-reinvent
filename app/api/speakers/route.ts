import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import type { Speaker } from "@/types/schedule"

export async function GET() {
  try {
    const response = await backendFetch("/api/v1/speakers/")
    if (response.ok) {
      const data = await backendJson<Speaker[]>(response)
      if (Array.isArray(data)) {
        return NextResponse.json(data)
      }
    }
    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}
