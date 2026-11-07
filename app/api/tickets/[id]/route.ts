import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import { getAuthCookies } from "@/lib/api/auth-cookies"
import type { Ticket } from "@/types/ticketing"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { accessToken } = getAuthCookies(request)
  const { id } = await params

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Authentication required" },
      { status: 401 }
    )
  }

  try {
    const response = await backendFetch(`/api/v1/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      return NextResponse.json(
        { detail: err?.detail || "Ticket not found" },
        { status: response.status }
      )
    }

    const data = await backendJson<Ticket>(response)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}
