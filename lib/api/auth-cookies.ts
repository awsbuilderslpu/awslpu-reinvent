import { NextResponse } from "next/server"
import type { TokenResponse } from "@/types/auth"

export const ACCESS_COOKIE = "reinvent_access"
export const REFRESH_COOKIE = "reinvent_refresh"

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/"
}

export function setAuthCookies(
  response: NextResponse,
  tokens: TokenResponse
) {
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
    ...cookieOptions,
    maxAge: tokens.expires_in
  })

  response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
    ...cookieOptions
  })
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0
  })

  response.cookies.set(REFRESH_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0
  })
}

export function getAuthCookies(request: Request) {
  const cookieHeader = request.headers.get("cookie") || ""

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const separator = cookie.indexOf("=")

      if (separator === -1) return ["", ""]

      return [
        cookie.slice(0, separator).trim(),
        decodeURIComponent(cookie.slice(separator + 1).trim())
      ]
    })
  )

  return {
    accessToken: cookies[ACCESS_COOKIE] || null,
    refreshToken: cookies[REFRESH_COOKIE] || null
  }
}