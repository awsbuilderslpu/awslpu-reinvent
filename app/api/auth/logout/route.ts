import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/api/backend"
import {
  clearAuthCookies,
  getAuthCookies
} from "@/lib/api/auth-cookies"

export async function POST(request: Request) {
  const { refreshToken } = getAuthCookies(request)

  if (refreshToken) {
    try {
      await backendFetch("/api/v1/auth/logout", {
        method: "POST",
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      })
    } catch {}
  }

  const result = NextResponse.json({
    success: true
  })

  clearAuthCookies(result)

  return result
}