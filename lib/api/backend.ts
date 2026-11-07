import "server-only"

const BACKEND_API_URL = process.env.BACKEND_API_URL

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not configured")
}

export async function backendFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers)

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  return fetch(`${BACKEND_API_URL!.replace(/\/$/, "")}${path}`, {
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