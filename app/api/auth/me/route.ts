import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies
} from "@/lib/api/auth-cookies"
import type { AuthUser, TokenResponse } from "@/types/auth"

export async function GET(request: Request) {
  const { accessToken, refreshToken } = getAuthCookies(request)

  if (!accessToken && !refreshToken) {
    const result = NextResponse.json(
      { detail: "Not authenticated" },
      { status: 401 }
    )

    clearAuthCookies(result)
    return result
  }

  let currentAccessToken = accessToken
  let refreshedTokens: TokenResponse | null = null

  try {
    if (!currentAccessToken && refreshToken) {
      const refreshResponse = await backendFetch("/api/v1/auth/refresh", {
        method: "POST",
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      })

      if (!refreshResponse.ok) {
        const result = NextResponse.json(
          { detail: "Session expired" },
          { status: 401 }
        )

        clearAuthCookies(result)
        return result
      }

      refreshedTokens = await backendJson<TokenResponse>(refreshResponse)
      currentAccessToken = refreshedTokens.access_token
    }

    let response = await backendFetch("/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`
      }
    })

    if (response.status === 401 && refreshToken && !refreshedTokens) {
      const refreshResponse = await backendFetch("/api/v1/auth/refresh", {
        method: "POST",
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      })

      if (!refreshResponse.ok) {
        const result = NextResponse.json(
          { detail: "Session expired" },
          { status: 401 }
        )

        clearAuthCookies(result)
        return result
      }

      refreshedTokens = await backendJson<TokenResponse>(refreshResponse)
      currentAccessToken = refreshedTokens.access_token

      response = await backendFetch("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${currentAccessToken}`
        }
      })
    }

    if (!response.ok) {
      const result = NextResponse.json(
        { detail: "Unable to retrieve user profile" },
        { status: response.status }
      )

      if (response.status === 401) {
        clearAuthCookies(result)
      }

      return result
    }

    const user = await backendJson<AuthUser>(response)
    const result = NextResponse.json({ user })

    if (refreshedTokens) {
      setAuthCookies(result, refreshedTokens)
    }

    return result
  } catch {
    return NextResponse.json(
      { detail: "Authentication service unavailable" },
      { status: 502 }
    )
  }
}