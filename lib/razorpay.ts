"use client"

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  image?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color?: string
    backdrop_color?: string
  }
  modal?: {
    ondismiss?: () => void
    escape?: boolean
    animation?: boolean
  }
  handler?: (response: RazorpayResponse) => void
}

export interface RazorpayInstance {
  open: () => void
  on: (event: string, callback: (response: unknown) => void) => void
  close: () => void
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false)
      return
    }

    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function openRazorpayCheckout(
  options: Omit<RazorpayOptions, "name" | "description"> & {
    name?: string
    description?: string
  }
): Promise<RazorpayResponse> {
  const loaded = await loadRazorpayScript()
  if (!loaded || !window.Razorpay) {
    throw new Error("Unable to load Razorpay payment gateway")
  }

  return new Promise((resolve, reject) => {
    let resolved = false

    const rzp = new window.Razorpay!({
      ...options,
      name: options.name || "AWS Re:Invent Fest 2026",
      description: options.description || "Festival Pass Booking",
      theme: {
        color: "#FF00D4",
        backdrop_color: "#050505",
        ...options.theme
      },
      handler: (response: RazorpayResponse) => {
        resolved = true
        resolve(response)
      },
      modal: {
        ...options.modal,
        ondismiss: () => {
          if (!resolved) {
            reject(new Error("Payment window was closed by the user"))
          }
          options.modal?.ondismiss?.()
        }
      }
    })

    rzp.on("payment.failed", () => {
      resolved = true
      reject(new Error("Payment failed or was rejected by bank"))
    })

    rzp.open()
  })
}
