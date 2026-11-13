import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import type { TicketCategory } from "@/types/ticketing"

export async function GET() {
  try {
    const response = await backendFetch("/api/v1/ticket/categories")

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      return NextResponse.json(
        { detail: err?.detail || err?.message || "Failed to fetch ticket categories" },
        { status: response.status }
      )
    }

    const data = await backendJson<TicketCategory[]>(response)
    if (Array.isArray(data)) {
      return NextResponse.json(data)
    }

    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}
