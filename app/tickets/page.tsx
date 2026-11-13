"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Ticket as TicketIcon,
  Clock,
  ArrowUpRight,
  Lock,
  Loader2,
  Info
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { openRazorpayCheckout } from "@/lib/razorpay"
import { getMissingProfileFields } from "@/lib/profile-completion"
import type { TicketCategory, Order, Ticket } from "@/types/ticketing"

interface CartSelection {
  [categoryId: string]: number
}

const tierPerks: Record<string, string[]> = {
  "student pass (early bird)": [
    "Full 5-Day Access (Nov 30 – Dec 4)",
    "Keynotes & Technical Breakout Tracks",
    "Official Festival Kit & Lanyard",
    "Digital Certificate of Participation",
    "Access to Builder Networking Lounge"
  ],
  "builder pass": [
    "Everything in Student Pass",
    "Hands-on Cloud Lab Sandbox Access",
    "48-Hour Builders Hackathon Entry",
    "Priority Workshop Seating",
    "Daily Lunch & High Tea Networking",
    "Exclusive AWS Builder Hoodie & Kit"
  ],
  "all-access vip pass": [
    "Everything in Builder Pass",
    "Front-Row Keynote Reserved Seating",
    "Speaker & Executive Lounge Entry",
    "Private Networking Dinner with Speakers",
    "1-on-1 Engineering Career Mentorship",
    "AWS Certification Prep Exam Voucher"
  ]
}

export default function TicketsPage() {
  const router = useRouter()
  const { user, authenticated, loading: authLoading } = useAuth()

  const [categories, setCategories] = useState<TicketCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [existingTicket, setExistingTicket] = useState<Ticket | null>(null)
  const [checkingExisting, setCheckingExisting] = useState(false)

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<"select" | "review" | "processing" | "success">("select")
  const [orderError, setOrderError] = useState<string | null>(null)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  const [pollingStatus, setPollingStatus] = useState<string>("")

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true)
        const res = await fetch("/api/tickets/categories")
        if (!res.ok) throw new Error("Failed to load ticket categories")
        const data = await res.json()
        setCategories(data || [])
      } catch (err) {
        setOrderError(err instanceof Error ? err.message : "Error loading passes")
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    async function checkUserTickets() {
      if (!authenticated) {
        setExistingTicket(null)
        return
      }
      try {
        setCheckingExisting(true)
        const res = await fetch("/api/tickets")
        if (res.ok) {
          const data = await res.json()
          if (data.tickets && data.tickets.length > 0) {
            setExistingTicket(data.tickets[0])
          } else {
            setExistingTicket(null)
          }
        }
      } catch {
        setExistingTicket(null)
      } finally {
        setCheckingExisting(false)
      }
    }
    checkUserTickets()
  }, [authenticated])

  const toggleSelectCategory = (categoryId: string) => {
    if (existingTicket) return
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId))
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const unitPrice = selectedCategory ? selectedCategory.price_in_paise / 100 : 0
  const totalAmount = unitPrice

  const handleStartCheckout = () => {
    if (!authenticated) {
      router.push("/auth?mode=login&redirect=/tickets")
      return
    }
    if (getMissingProfileFields(user).length > 0) {
      router.push("/dashboard?tab=profile&returnTo=%2Ftickets")
      return
    }
    if (existingTicket) {
      setOrderError("You already have an active pass. Each attendee is strictly limited to 1 ticket.")
      return
    }
    setOrderError(null)
    setCheckoutStep("review")
  }

  const handleProceedPayment = async () => {
    if (!authenticated) {
      router.push("/auth?mode=login&redirect=/tickets")
      return
    }

    if (getMissingProfileFields(user).length > 0) {
      router.push("/dashboard?tab=profile&returnTo=%2Ftickets")
      return
    }

    if (!selectedCategoryId) {
      setOrderError("Please select a pass tier.")
      return
    }

    setOrderError(null)
    setCheckoutStep("processing")
    setPollingStatus("Reserving ticket...")

    try {
      const orderPayload = {
        items: [
          {
            category_id: selectedCategoryId,
            quantity: 1
          }
        ]
      }

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      })

      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => null)
        throw new Error(errorData?.detail || "Could not reserve ticket. Please try again.")
      }

      const order: Order = await orderRes.json()
      setCreatedOrder(order)

      setPollingStatus("Opening Razorpay payment gateway...")

      const checkoutData = order.checkout || {
        key: order.razorpay_key_id || "rzp_test_TxGH1dx8IuuXrD",
        order_id: order.razorpay_order_id || "",
        amount: order.total_amount,
        currency: order.currency || "INR"
      }

      const buyerName = user ? `${user.first_name} ${user.last_name}` : ""
      const buyerEmail = user?.email || ""
      const buyerPhone = user?.phone || ""

      try {
        await openRazorpayCheckout({
          key: checkoutData.key,
          amount: checkoutData.amount,
          currency: checkoutData.currency,
          order_id: checkoutData.order_id,
          name: "AWS Re:Invent Fest 2026",
          description: `Festival Pass Reservation (${order.id.slice(-6)})`,
          prefill: {
            name: buyerName,
            email: buyerEmail,
            contact: buyerPhone
          }
        })
      } catch (paymentErr) {
        const msg = paymentErr instanceof Error ? paymentErr.message : "Payment was cancelled"
        setOrderError(msg)
        setCheckoutStep("review")
        return
      }

      setPollingStatus("Confirming payment & issuing digital ticket...")
      let attempts = 0
      const maxAttempts = 12

      while (attempts < maxAttempts) {
        attempts++
        try {
          const checkRes = await fetch(`/api/orders/${order.id}`)
          if (checkRes.ok) {
            const checkData: Order = await checkRes.json()
            if (checkData.status === "paid") {
              setCreatedOrder(checkData)
              setCheckoutStep("success")
              return
            }
            if (checkData.status === "failed") {
              throw new Error("Payment was rejected by gateway.")
            }
          }
        } catch (pollErr) {
          if (attempts >= maxAttempts) throw pollErr
        }
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      setCheckoutStep("success")
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Payment processing encountered an issue.")
      setCheckoutStep("review")
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_65%,rgba(255,0,212,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 pb-24 pt-32 sm:px-10 sm:pt-40 lg:px-16">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#FF00D4]" />
              <span className="text-xs uppercase tracking-[0.22em] text-[#FF00D4]">
                Official Registration
              </span>
            </div>

            <h1 className="text-[clamp(2.8rem,7vw,6.5rem)] font-light leading-[0.88] tracking-[-0.075em]">
              Choose your{" "}
              <span className="bg-gradient-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
                pass.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              Secure your individual access to AWS Re:Invent Fest 2026. Every pass includes full five-day access to keynotes, workshops, and hackathons at Lovely Professional University.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 text-xs text-white/50 sm:items-end">
            <span className="flex items-center gap-2 border border-[#FF00D4]/30 bg-[#FF00D4]/10 px-3 py-1.5 text-[#FF2D87]">
              <Info className="h-3.5 w-3.5" />
              Limit: 1 Ticket per Attendee
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Verified Razorpay Checkout
            </span>
          </div>
        </div>

        {existingTicket && (
          <div className="mt-8 flex flex-col gap-4 border border-[#FF00D4]/60 bg-linear-to-r from-[#FF00D4]/15 to-[#8B5CFF]/15 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-400 bg-emerald-400/10 text-emerald-400">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Active Ticket Already Issued
                </p>
                <h3 className="mt-1 text-lg font-light text-white">
                  You already hold a <span className="font-semibold">{existingTicket.category_name}</span>
                </h3>
                <p className="text-xs text-white/55">
                  Each registered attendee is limited to 1 pass. Your QR entry code is ready in your dashboard.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="flex h-11 shrink-0 items-center justify-center gap-2 bg-linear-to-r from-[#FF00D4] to-[#702cff] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,0,212,0.3)]"
            >
              <span>View Pass in Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {authenticated && getMissingProfileFields(user).length > 0 && (
          <div className="mt-8 flex flex-col gap-4 border border-amber-400/40 bg-amber-400/10 p-5 text-amber-200 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              Complete your required contact and academic details in your dashboard before checkout.
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard?tab=profile&returnTo=%2Ftickets")}
              className="shrink-0 text-left text-xs font-semibold uppercase tracking-wider text-amber-100 underline underline-offset-4"
            >
              Complete profile
            </button>
          </div>
        )}

        {orderError && (
          <div className="mt-8 flex items-center gap-3 border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <p>{orderError}</p>
          </div>
        )}

        {checkoutStep === "select" && (
          <div className="mt-12">
            {loadingCategories ? (
              <div className="flex flex-col items-center justify-center py-24 text-white/50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#FF00D4]" />
                <p className="mt-4 text-xs uppercase tracking-widest">Loading available passes...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-white/10 bg-white/[0.01] py-20 text-center">
                <TicketIcon className="h-10 w-10 text-white/30 mb-3" />
                <h3 className="text-xl font-light text-white">No passes currently available</h3>
                <p className="mt-2 text-xs text-white/50 max-w-md">
                  Ticket categories for AWS Re:Invent Fest 2026 have not been published yet or registration is closed. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3">
                {categories.map((cat, idx) => {
                  const key = cat.name.toLowerCase().trim()
                  const perks = tierPerks[key] || [
                    "5-Day Full Festival Admission",
                    "Access to Keynotes & Technical Tracks",
                    "Official Delegate Kit & Certificate",
                    "Community Networking Access"
                  ]
                  const priceInRupees = cat.price_in_paise / 100
                  const isHighlight = idx === 1 || cat.name.toLowerCase().includes("builder")
                  const isSelected = selectedCategoryId === cat.id
                  const available = (cat.quantity || 100) - (cat.quantity_sold || 0)
                  const isSoldOut = available <= 0

                  return (
                    <div
                      key={cat.id}
                      className={`relative flex flex-col justify-between border p-8 transition-all duration-300 ${
                        isSelected
                          ? "border-[#FF00D4] bg-linear-to-b from-[#FF00D4]/20 via-[#FF00D4]/5 to-transparent shadow-[0_0_45px_rgba(255,0,212,0.25)]"
                          : isHighlight
                          ? "border-[#FF00D4]/60 bg-linear-to-b from-[#FF00D4]/10 via-white/[0.02] to-transparent shadow-[0_0_30px_rgba(255,0,212,0.1)]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/30"
                      }`}
                    >
                      {isHighlight && (
                        <span className="absolute right-6 top-6 bg-[#FF00D4] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">
                          Recommended
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-light tracking-tight">{cat.name}</h3>
                        </div>

                        <p className="mt-2 text-xs leading-relaxed text-white/50">
                          {cat.description}
                        </p>

                        <div className="my-8 flex items-baseline gap-2">
                          <span className="text-5xl font-extralight tracking-tight text-white">
                            ₹{priceInRupees.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs uppercase tracking-widest text-white/40">
                            INR / 1 Pass
                          </span>
                        </div>

                        <div className="mb-6 flex items-center justify-between border-y border-white/10 py-3 text-xs text-white/50">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#FF2D87]" />
                            {isSoldOut ? "Sold Out" : "Instant Digital Issuance"}
                          </span>
                          <span className={isSoldOut ? "text-red-400" : "text-emerald-400"}>
                            {isSoldOut ? "0 Left" : "Available"}
                          </span>
                        </div>

                        <ul className="space-y-3.5">
                          {perks.map((perk) => (
                            <li key={perk} className="flex items-start gap-3 text-xs text-white/75">
                              <Check className="h-4 w-4 shrink-0 text-[#FF00D4]" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-10 border-t border-white/10 pt-6">
                        {isSoldOut ? (
                          <div className="flex h-12 w-full items-center justify-center border border-white/15 bg-white/5 text-xs uppercase tracking-wider text-white/30">
                            Pass Sold Out
                          </div>
                        ) : existingTicket ? (
                          <div className="flex h-12 w-full items-center justify-center border border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-white/40">
                            Limit Reached (1 Pass Owned)
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleSelectCategory(cat.id)}
                            className={`flex h-12 w-full items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
                              isSelected
                                ? "bg-[#FF00D4] text-white shadow-[0_0_24px_rgba(255,0,212,0.4)]"
                                : "border border-white/25 text-white hover:border-[#FF00D4] hover:bg-white/[0.04]"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span>Selected Pass (1)</span>
                              </>
                            ) : (
                              <span>Select Pass</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {selectedCategory && !existingTicket && (
              <aside
                aria-label="Checkout action bar"
                className="fixed bottom-6 inset-x-5 z-40 mx-auto max-w-3xl border border-[#FF00D4] bg-[#0c0816]/95 p-5 shadow-[0_0_50px_rgba(255,0,212,0.3)] backdrop-blur-xl sm:px-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#FF2D87]">
                      1 Pass Selected: {selectedCategory.name}
                    </p>
                    <p className="text-2xl font-light text-white sm:text-3xl">
                      ₹{totalAmount.toLocaleString("en-IN")}{" "}
                      <span className="text-xs uppercase text-white/40 tracking-widest">INR</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartCheckout}
                    className="flex h-12 items-center justify-center gap-3 bg-linear-to-r from-[#FF00D4] to-[#702cff] px-8 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:opacity-95"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </aside>
            )}
          </div>
        )}

        {checkoutStep === "review" && selectedCategory && (
          <div className="mx-auto mt-12 max-w-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-12">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#FF00D4]">
                  Step 2 of 2
                </span>
                <h2 className="text-2xl font-light tracking-tight text-white sm:text-3xl">
                  Order Summary
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutStep("select")}
                className="text-xs uppercase text-white/50 hover:text-white"
              >
                ← Change Pass
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 text-sm">
                <div>
                  <p className="font-medium text-white">{selectedCategory.name}</p>
                  <p className="text-xs text-white/45">
                    1 Attendee Pass · 5-Day Admission
                  </p>
                </div>
                <span className="text-lg font-light text-white">
                  ₹{unitPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 text-sm text-white/60">
                <span>Pass Allocation</span>
                <span>1 Ticket (Max Limit)</span>
              </div>
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>GST & Service Taxes</span>
                <span className="text-emerald-400">Included</span>
              </div>

              <div className="flex items-center justify-between border-t border-white/15 pt-6 text-lg sm:text-xl font-light text-white">
                <span>Total Amount Due</span>
                <span className="text-2xl font-light text-[#FF00D4]">
                  ₹{totalAmount.toLocaleString("en-IN")}{" "}
                  <span className="text-xs text-white/50 uppercase">INR</span>
                </span>
              </div>
            </div>

            <div className="mt-10 border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-xs uppercase tracking-widest text-[#8B5CFF] mb-4">
                Attendee Information
              </h3>
              <div className="space-y-3 text-xs text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/40">Full Name</span>
                  <span className="text-white font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Email Address</span>
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Phone Number</span>
                  <span className="text-white font-medium">{user?.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button
                type="button"
                onClick={handleProceedPayment}
                className="flex h-14 w-full items-center justify-center gap-3 bg-linear-to-r from-[#FF00D4] to-[#702cff] text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_30px_rgba(255,0,212,0.3)] transition-all hover:opacity-95"
              >
                <Lock className="h-4 w-4" />
                <span>Pay ₹{totalAmount.toLocaleString("en-IN")} via Razorpay</span>
              </button>

              <p className="text-center text-[10px] text-white/40">
                Strict limit: 1 ticket per attendee account. Non-transferable digital pass.
              </p>
            </div>
          </div>
        )}

        {checkoutStep === "processing" && (
          <div className="mx-auto mt-20 max-w-md border border-[#FF00D4]/40 bg-white/[0.02] p-12 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#FF00D4]" />
            <h3 className="mt-6 text-xl font-light text-white">Processing Booking</h3>
            <p className="mt-3 text-xs leading-relaxed text-white/55">{pollingStatus}</p>
            <p className="mt-6 text-[10px] text-white/35">
              Please do not close or refresh this page.
            </p>
          </div>
        )}

        {checkoutStep === "success" && (
          <div className="mx-auto mt-12 max-w-2xl border border-emerald-400/40 bg-emerald-950/10 p-8 text-center sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400 bg-emerald-400/10 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>

            <span className="mt-6 inline-block text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
              Pass Confirmed & Issued
            </span>

            <h2 className="mt-3 text-3xl font-light text-white sm:text-5xl">
              Welcome to Re:Invent Fest.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
              Your delegate pass and entry QR code have been issued to your account.
            </p>

            {createdOrder && (
              <div className="mt-8 border border-white/10 bg-black/40 p-6 text-left text-xs">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/40">Order Reference</span>
                  <span className="font-mono text-white">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/40">Pass Issued</span>
                  <span className="text-white">{selectedCategory?.name || "1 Festival Pass"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white/40">Status</span>
                  <span className="text-emerald-400 uppercase font-semibold">Confirmed</span>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-3 bg-linear-to-r from-[#FF00D4] to-[#702cff] px-8 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(255,0,212,0.3)]"
              >
                <span>View Ticket in Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/schedule"
                className="flex h-12 w-full sm:w-auto items-center justify-center border border-white/20 px-6 text-xs uppercase tracking-[0.14em] text-white/70 hover:border-white hover:text-white"
              >
                Explore Festival Schedule
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
