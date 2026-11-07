import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies
} from "@/lib/api/auth-cookies"
import type { TokenResponse } from "@/types/auth"

export async function POST(request: Request) {
  const { refreshToken } = getAuthCookies(request)

  if (!refreshToken) {
    return NextResponse.json(
      { detail: "Refresh token missing" },
      { status: 401 }
    )
  }

  try {
    const response = await backendFetch("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    })

    const tokens = await backendJson<TokenResponse>(response)

    const result = NextResponse.json({
      success: true
    })

    setAuthCookies(result, tokens)

    return result
  } catch {
    const result = NextResponse.json(
      { detail: "Session expired" },
      { status: 401 }
    )

    clearAuthCookies(result)

    return result
  }
}