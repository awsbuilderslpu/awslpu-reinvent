import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import type { Venue } from "@/types/schedule"

export async function GET() {
  try {
    const response = await backendFetch("/api/v1/venues/")
    if (response.ok) {
      const data = await backendJson<Venue[]>(response)
      if (Array.isArray(data)) {
        return NextResponse.json(data)
      }
    }
    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}
