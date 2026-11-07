import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import { getAuthCookies } from "@/lib/api/auth-cookies"
import type { AuthUser } from "@/types/auth"

export async function PATCH(request: Request) {
  const { accessToken } = getAuthCookies(request)

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Authentication required" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const response = await backendFetch("/api/v1/users/me", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      return NextResponse.json(
        { detail: err?.detail || "Failed to update profile" },
        { status: response.status }
      )
    }

    const updatedUser = await backendJson<AuthUser>(response)
    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}
