import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import type { TicketCategory } from "@/types/ticketing"

const fallbackCategories: TicketCategory[] = [
  {
    id: "student-early-bird",
    name: "Student Pass (Early Bird)",
    description: "Full 5-day festival access for students. Includes all keynote addresses, technical tracks, event kit, and official certificate of participation.",
    price_in_paise: 49900,
    quantity: 1200,
    quantity_sold: 420,
    quantity_reserved: 12,
    sales_start: "2026-10-01T00:00:00Z",
    sales_end: "2026-11-28T23:59:59Z",
    is_active: true
  },
  {
    id: "builder-pass",
    name: "Builder Pass",
    description: "Complete festival access with priority seating, hands-on lab environments, hackathon access, daily lunch & refreshments, and exclusive builder swag pack.",
    price_in_paise: 99900,
    quantity: 800,
    quantity_sold: 310,
    quantity_reserved: 18,
    sales_start: "2026-10-01T00:00:00Z",
    sales_end: "2026-11-29T23:59:59Z",
    is_active: true
  },
  {
    id: "vip-all-access",
    name: "All-Access VIP Pass",
    description: "VIP festival experience including Front-row seating, Speaker Lounge entry, Invitation-only networking dinner, 1-on-1 mentorship session, and AWS certification exam prep bundle.",
    price_in_paise: 249900,
    quantity: 250,
    quantity_sold: 145,
    quantity_reserved: 5,
    sales_start: "2026-10-01T00:00:00Z",
    sales_end: "2026-11-29T23:59:59Z",
    is_active: true
  }
]

export async function GET() {
  try {
    let response = await backendFetch("/api/v1/tickets/categories")
    if (!response.ok) {
      response = await backendFetch("/api/v1/ticket/categories")
    }

    if (response.ok) {
      const data = await backendJson<TicketCategory[]>(response)
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data)
      }
    }

    return NextResponse.json(fallbackCategories)
  } catch {
    return NextResponse.json(fallbackCategories)
  }
}
