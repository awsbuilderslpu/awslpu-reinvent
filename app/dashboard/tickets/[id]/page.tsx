"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  Download,
  MapPin,
  Ticket as TicketIcon
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { QrCode } from "@/components/qr-code"
import type { Ticket } from "@/types/ticketing"

export default function TicketDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = use(params)
  const { user, authenticated, loading: authLoading } = useAuth()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.replace("/auth?mode=login")
      return
    }

    async function loadTicket() {
      try {
        setLoading(true)
        const res = await fetch(`/api/tickets/${id}`)
        if (!res.ok) {
          throw new Error("Ticket not found or unauthorized")
        }
        const data = await res.json()
        setTicket(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ticket")
      } finally {
        setLoading(false)
      }
    }

    if (authenticated) {
      loadTicket()
    }
  }, [id, authenticated, authLoading, router])

  const copyCode = () => {
    if (!ticket) return
    navigator.clipboard.writeText(ticket.ticket_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#FF00D4]" />
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-center text-white">
        <TicketIcon className="h-12 w-12 text-white/20" />
        <h2 className="mt-4 text-2xl font-light">Ticket Not Found</h2>
        <p className="mt-2 text-xs text-white/50">{error || "The requested ticket is invalid or inaccessible."}</p>
        <Link
          href="/dashboard"
          className="mt-6 flex h-10 items-center gap-2 border border-white/20 px-6 text-xs uppercase tracking-wider hover:border-[#FF00D4]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    )
  }

  const attendeeName = user ? `${user.first_name} ${user.last_name}` : "Festival Attendee"

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] px-5 pb-20 pt-28 text-white sm:px-10 sm:pt-40">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.18),transparent_55%)]" />

      <div className="relative mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Tickets</span>
        </Link>

        <div className="relative overflow-hidden border border-[#FF00D4] bg-linear-to-b from-[#130d22] via-[#090611] to-[#050505] p-6 sm:p-12 shadow-[0_0_60px_rgba(255,0,212,0.25)]">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF00D4]/15 blur-[80px]" />

          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/50">
                AWS Student Builder Group
              </span>
              <h1 className="mt-1 text-2xl font-light tracking-[-0.05em] text-white sm:text-3xl">
                re<span className="text-[#FF2D87]">:</span>Invent 2026
              </h1>
            </div>

            <span className="border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              {ticket.status}
            </span>
          </div>

          <div className="mt-8 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FF00D4]">
              Official Delegate Pass
            </span>
            <h2 className="mt-2 text-3xl font-light text-white sm:text-4xl">
              {ticket.category_name}
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Attendee: <span className="font-semibold text-white">{attendeeName}</span>
            </p>
          </div>

          <div className="my-8 flex justify-center">
            <div className="max-w-[220px] sm:max-w-none">
              <QrCode value={ticket.ticket_code} size={220} />
            </div>
          </div>

          <div className="space-y-3 border-y border-white/10 py-6 text-xs text-white/60">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-white/40">
                <MapPin className="h-3.5 w-3.5 text-[#FF00D4]" />
                Event Venue
              </span>
              <span className="text-white font-medium">Lovely Professional University</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-white/40">
                <Calendar className="h-3.5 w-3.5 text-[#8B5CFF]" />
                Dates
              </span>
              <span className="text-white font-medium">Nov 30 – Dec 04, 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Ticket ID</span>
              <span className="font-mono text-[11px] text-white/80">{ticket.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Ticket Code</span>
              <span className="font-mono text-[10px] text-[#FF00D4] break-all max-w-[200px] sm:max-w-[240px]">
                {ticket.ticket_code}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={copyCode}
              className="flex-1 flex h-11 items-center justify-center gap-2 border border-white/20 text-xs uppercase tracking-wider text-white hover:border-white transition-all cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Code Copied" : "Copy Code"}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-11 items-center justify-center gap-2 border border-[#FF00D4] bg-[#FF00D4]/20 px-6 text-xs uppercase tracking-wider text-white hover:bg-[#FF00D4]/30 transition-all shadow-[0_0_20px_rgba(255,0,212,0.2)] cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Print Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
