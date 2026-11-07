import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import { getAuthCookies } from "@/lib/api/auth-cookies"
import type { TicketListResponse } from "@/types/ticketing"

export async function GET(request: Request) {
  const { accessToken } = getAuthCookies(request)

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Authentication required" },
      { status: 401 }
    )
  }

  try {
    const response = await backendFetch("/api/v1/tickets/", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      return NextResponse.json(
        { detail: err?.detail || "Failed to fetch tickets" },
        { status: response.status }
      )
    }

    const data = await backendJson<TicketListResponse>(response)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}
