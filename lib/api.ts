export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  registration_number?: string;
  role: "ATTENDEE" | "VOLUNTEER" | "ORGANIZER" | "ADMIN";
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface TicketCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_in_cents: number;
  total_capacity: number;
  available_capacity: number;
  max_per_user: number;
  status: "UPCOMING" | "ACTIVE" | "SOLD_OUT" | "PAUSED";
  sales_start_at?: string;
  sales_end_at?: string;
}

export interface Ticket {
  id: string;
  ticket_code: string;
  category_id: string;
  status: "CONFIRMED" | "CHECKED_IN" | "CANCELLED" | "REFUNDED";
  qr_hash: string;
  created_at: string;
  category?: TicketCategory;
}

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("reinvent_token");
};

export const setStoredToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("reinvent_token", token);
  }
};

export const clearStoredToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("reinvent_token");
  }
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = "Something went wrong";
    try {
      const data = await res.json();
      errorDetail = data.detail || errorDetail;
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  return res.json();
}
