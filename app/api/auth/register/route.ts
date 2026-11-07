import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import { setAuthCookies } from "@/lib/api/auth-cookies"
import type { RegisterRequest, TokenResponse } from "@/types/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json() as RegisterRequest

    const response = await backendFetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(body)
    })

    const tokens = await backendJson<TokenResponse>(response)

    const result = NextResponse.json({
      success: true
    })

    setAuthCookies(result, tokens)

    return result
  } catch (error) {
    return NextResponse.json(
      {
        detail: error instanceof Error ? error.message : "Registration failed"
      },
      { status: 400 }
    )
  }
}