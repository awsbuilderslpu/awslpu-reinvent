import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import { getAuthCookies } from "@/lib/api/auth-cookies"
import type { Order } from "@/types/ticketing"

export async function POST(request: Request) {
  const { accessToken } = getAuthCookies(request)

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Please sign in to complete your ticket booking" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const response = await backendFetch("/api/v1/orders/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      return NextResponse.json(
        { detail: err?.detail || "Order creation failed" },
        { status: response.status }
      )
    }

    const data = await backendJson<Order>(response)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { accessToken } = getAuthCookies(request)

  if (!accessToken) {
    return NextResponse.json(
      { detail: "Authentication required" },
      { status: 401 }
    )
  }

  try {
    const response = await backendFetch("/api/v1/orders/", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      return NextResponse.json(
        { detail: err?.detail || "Failed to fetch orders" },
        { status: response.status }
      )
    }

    const data = await backendJson<Order[]>(response)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}
