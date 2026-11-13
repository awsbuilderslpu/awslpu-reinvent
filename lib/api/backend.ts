import "server-only"

const BACKEND_API_URL = process.env.BACKEND_API_URL || ""
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ""

export async function backendFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiUrl = process.env.BACKEND_API_URL || BACKEND_API_URL
  if (!apiUrl) {
    throw new Error("BACKEND_API_URL is not configured")
  }

  const headers = new Headers(options.headers)

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  const apiKey = process.env.BACKEND_API_KEY || BACKEND_API_KEY
  if (apiKey && !headers.has("X-API-KEY")) {
    headers.set("X-API-KEY", apiKey)
  }

  return fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
    ...options,
    headers,
    cache: "no-store"
  })
}

export async function backendJson<T>(
  response: Response
): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Backend request failed (${response.status})`

    throw new Error(message)
  }

  return data as T
}
