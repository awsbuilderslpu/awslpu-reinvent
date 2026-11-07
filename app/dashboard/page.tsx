"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Ticket as TicketIcon,
  UserRound,
  Mail,
  MapPin,
  ShieldCheck,
  QrCode as QrIcon,
  Download,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Clock,
  Sparkles,
  Save,
  CheckCircle2
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { QrCode } from "@/components/qr-code"
import type { Ticket } from "@/types/ticketing"
import type { Venue } from "@/types/schedule"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, authenticated, refreshUser } = useAuth()

  const [activeTab, setActiveTab] = useState<"overview" | "tickets" | "profile" | "guide">("overview")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [ticketError, setTicketError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [loadingVenues, setLoadingVenues] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [institution, setInstitution] = useState("")
  const [degree, setDegree] = useState("")
  const [department, setDepartment] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [github, setGithub] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace("/auth?mode=login")
    }
  }, [loading, authenticated, router])

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "")
      setLastName(user.last_name || "")
      setPhone(user.phone || "")
      setInstitution(user.academic?.institution || "")
      setDegree(user.academic?.degree || "")
      setDepartment(user.academic?.department || "")
      setGraduationYear(
        user.academic?.graduation_year ? String(user.academic.graduation_year) : ""
      )
      setLinkedin(user.socials?.linkedin || "")
      setGithub(user.socials?.github || "")
    }
  }, [user])

  useEffect(() => {
    async function loadTickets() {
      if (!authenticated) return
      try {
        setLoadingTickets(true)
        const res = await fetch("/api/tickets")
        if (res.ok) {
          const data = await res.json()
          setTickets(data.tickets || [])
        } else {
          setTickets([])
        }
      } catch (err) {
        setTicketError("Failed to fetch tickets")
      } finally {
        setLoadingTickets(false)
      }
    }
    loadTickets()
  }, [authenticated])

  useEffect(() => {
    async function loadVenues() {
      try {
        setLoadingVenues(true)
        const res = await fetch("/api/venues")
        if (res.ok) {
          const data = await res.json()
          setVenues(Array.isArray(data) ? data : [])
        }
      } catch {
        setVenues([])
      } finally {
        setLoadingVenues(false)
      }
    }
    loadVenues()
  }, [])

  const handleCopyTicketCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileSuccess(null)
    setProfileError(null)

    try {
      const payload: Record<string, unknown> = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim()
      }

      if (institution.trim()) {
        payload.academic = {
          institution: institution.trim(),
          degree: degree.trim() || null,
          department: department.trim() || null,
          graduation_year: graduationYear ? parseInt(graduationYear, 10) : null
        }
      }

      if (linkedin.trim() || github.trim()) {
        payload.socials = {
          linkedin: linkedin.trim() || null,
          github: github.trim() || null
        }
      }

      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || "Could not update profile")
      }

      await refreshUser()
      setProfileSuccess("Profile updated successfully")
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Error saving profile")
    } finally {
      setSavingProfile(false)
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#FF2D87]" />
      </main>
    )
  }

  const fullName = `${user.first_name} ${user.last_name}`

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,0,255,0.12),transparent_55%)]" />

      <section className="relative mx-auto max-w-[1500px] px-5 pb-24 pt-32 sm:px-10 sm:pt-40 lg:px-16">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#FF2D87]">
              Attendee Portal
            </p>

            <h1 className="text-4xl font-light tracking-[-0.06em] sm:text-6xl">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
                {user.first_name}.
              </span>
            </h1>

            <p className="mt-4 text-sm text-white/50">
              Manage your Re:Invent Fest passes, access QR entry codes, and customize your experience.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2.5 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verified Attendee
            </div>

            <Link
              href="/tickets"
              className="flex h-10 items-center justify-center border border-[#FF00D4] bg-[#FF00D4]/20 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#FF00D4]/30 transition-all shadow-[0_0_20px_rgba(255,0,212,0.2)]"
            >
              Get More Passes
            </Link>
          </div>
        </div>

        <div className="mt-8 flex gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "overview"
                ? "border border-[#FF00D4] bg-[#FF00D4]/15 text-white shadow-[0_0_15px_rgba(255,0,212,0.2)]"
                : "border border-transparent text-white/50 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "tickets"
                ? "border border-[#FF00D4] bg-[#FF00D4]/15 text-white shadow-[0_0_15px_rgba(255,0,212,0.2)]"
                : "border border-transparent text-white/50 hover:text-white"
            }`}
          >
            <span>My Tickets</span>
            {tickets.length > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF00D4] text-[9px] text-white">
                {tickets.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "profile"
                ? "border border-[#FF00D4] bg-[#FF00D4]/15 text-white shadow-[0_0_15px_rgba(255,0,212,0.2)]"
                : "border border-transparent text-white/50 hover:text-white"
            }`}
          >
            Profile & Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "guide"
                ? "border border-[#FF00D4] bg-[#FF00D4]/15 text-white shadow-[0_0_15px_rgba(255,0,212,0.2)]"
                : "border border-transparent text-white/50 hover:text-white"
            }`}
          >
            Festival Venue Guide
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            <div className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
              <div className="relative overflow-hidden border border-white/10 bg-white/[0.025] p-8 sm:p-12">
                <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#8B5CFF]/15 blur-[100px]" />

                <div className="relative">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF2D87]">
                    30 Nov — 04 Dec 2026
                  </span>

                  <h2 className="mt-6 text-5xl font-light leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                    Imagine.
                    <br />
                    Build.
                    <br />
                    <span className="bg-gradient-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
                      Re:Invent.
                    </span>
                  </h2>

                  <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/60">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#FF00D4]" />
                      Lovely Professional University, Punjab
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#8B5CFF]" />
                      5 Days of Sessions, Labs & Hackathons
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab("tickets")}
                      className="flex h-11 items-center gap-2 border border-white/25 bg-white/[0.04] px-6 text-xs font-semibold uppercase tracking-wider text-white hover:border-[#FF00D4]"
                    >
                      <TicketIcon className="h-4 w-4 text-[#FF00D4]" />
                      <span>View My Passes ({tickets.length})</span>
                    </button>
                    <Link
                      href="/schedule"
                      className="flex h-11 items-center gap-2 border border-white/20 px-6 text-xs uppercase tracking-wider text-white/70 hover:border-white hover:text-white"
                    >
                      <span>Explore Schedule</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border border-white/10 bg-white/[0.025] p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#FF00D4]">
                      <TicketIcon className="h-4 w-4" />
                      Pass Summary
                    </div>
                    <span className="text-xs text-white/40">
                      {tickets.length} Registered
                    </span>
                  </div>

                  {loadingTickets ? (
                    <div className="my-10 flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#FF00D4]" />
                    </div>
                  ) : tickets.length > 0 ? (
                    <div className="mt-6 space-y-3">
                      {tickets.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedTicket(t)
                            setActiveTab("tickets")
                          }}
                          className="group cursor-pointer border border-white/10 bg-black/40 p-3.5 transition-all hover:border-[#FF00D4]/70"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white group-hover:text-[#FF2D87]">
                              {t.category_name}
                            </span>
                            <span className="text-[10px] uppercase text-emerald-400">
                              {t.status}
                            </span>
                          </div>
                          <p className="mt-1 font-mono text-[10px] text-white/40">
                            {t.ticket_code.slice(0, 16)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="my-8 text-center">
                      <TicketIcon className="mx-auto h-8 w-8 text-white/20" />
                      <p className="mt-3 text-sm text-white/60">No tickets yet.</p>
                      <p className="mt-1 text-xs text-white/40">
                        Select a pass to claim your admission spot.
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  href="/tickets"
                  className="mt-6 flex h-11 items-center justify-between border border-[#FF00D4]/50 bg-[#FF00D4]/10 px-5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#FF00D4]/20 transition-all"
                >
                  <span>Book Festival Pass</span>
                  <ArrowUpRight className="h-4 w-4 text-[#FF00D4]" />
                </Link>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="border border-white/10 bg-white/[0.02] p-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Profile Overview</h3>
                  <UserRound className="h-5 w-5 text-[#FF2D87]" />
                </div>

                <div className="mt-6 space-y-4 text-xs">
                  <div>
                    <span className="text-white/40">Full Name</span>
                    <p className="mt-1 text-sm text-white font-medium">{fullName}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Registered Email</span>
                    <p className="mt-1 text-sm text-white">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-white/40">Institution</span>
                    <p className="mt-1 text-sm text-white">
                      {user.academic?.institution || "Not added yet"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-[#FF2D87] hover:underline w-full"
                >
                  <span>Edit Profile & Academic Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="border border-white/10 bg-white/[0.02] p-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Account Details</h3>
                  <ShieldCheck className="h-5 w-5 text-[#8B5CFF]" />
                </div>

                <div className="mt-6 space-y-4 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-white/50">Email Status</span>
                    <span className={user.email_verified ? "text-emerald-400" : "text-amber-400"}>
                      {user.email_verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-white/50">Account Status</span>
                    <span className={user.is_active ? "text-emerald-400" : "text-red-400"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-white/50">Roles</span>
                    <div className="flex gap-1">
                      {user.roles.map((r) => (
                        <span key={r} className="border border-[#8B5CFF]/30 px-2 py-0.5 text-[10px] uppercase text-[#B69AFF]">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-white/50">Member Since</span>
                    <span className="text-white/70">
                      {new Date(user.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="mt-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-light tracking-tight">Your Festival Tickets</h2>
                <p className="text-xs text-white/50 mt-1">
                  Present your ticket QR code at the event entrance for verification and badge collection.
                </p>
              </div>
              <span className="text-xs text-[#FF00D4] uppercase font-semibold">
                {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
              </span>
            </div>

            {loadingTickets ? (
              <div className="flex flex-col items-center justify-center py-24 text-white/50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#FF00D4]" />
                <p className="mt-4 text-xs uppercase tracking-widest">Loading issued tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="mt-12 flex flex-col items-center justify-center border border-white/10 bg-white/[0.015] py-20 text-center">
                <TicketIcon className="h-12 w-12 text-white/20" />
                <h3 className="mt-4 text-lg font-medium text-white/80">No Tickets Issued Yet</h3>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/50">
                  You haven't purchased any festival passes yet. Reserve your pass now to secure entry to AWS Re:Invent Fest 2026.
                </p>
                <Link
                  href="/tickets"
                  className="mt-6 flex h-11 items-center gap-2 border border-[#FF00D4] bg-[#FF00D4]/20 px-6 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#FF00D4]/30"
                >
                  Browse Available Passes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="group relative flex flex-col justify-between border border-white/15 bg-white/[0.025] p-6 transition-all hover:border-[#FF00D4] hover:shadow-[0_0_35px_rgba(255,0,212,0.15)]"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FF2D87]">
                          re:Invent 2026 Pass
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-[9px] uppercase font-semibold ${
                            ticket.status === "valid"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-light tracking-tight text-white">
                        {ticket.category_name}
                      </h3>

                      <p className="mt-1 text-xs text-white/50">
                        Holder: {fullName}
                      </p>

                      <div className="my-6 flex justify-center">
                        <QrCode value={ticket.ticket_code} size={180} />
                      </div>

                      <div className="space-y-2 border-t border-white/10 pt-4 text-[11px] text-white/60">
                        <div className="flex justify-between">
                          <span className="text-white/40">Status</span>
                          <span className="text-emerald-400 capitalize">{ticket.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">Dates</span>
                          <span className="text-white">30 Nov — 04 Dec 2026</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/40">Ticket Code</span>
                          <span className="font-mono text-[9px] text-[#FF00D4] line-clamp-1 max-w-[130px]">
                            {ticket.ticket_code}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(ticket)}
                        className="flex-1 flex h-10 items-center justify-center gap-1.5 border border-white/20 bg-white/5 text-xs uppercase tracking-wider hover:border-[#FF00D4] hover:text-white transition-all"
                      >
                        <QrIcon className="h-3.5 w-3.5 text-[#FF00D4]" />
                        <span>View Pass</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyTicketCode(ticket.ticket_code)}
                        className="flex h-10 w-10 items-center justify-center border border-white/20 hover:border-white transition-all text-white/60 hover:text-white"
                        title="Copy ticket verification code"
                      >
                        {copiedCode ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="mx-auto mt-8 max-w-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-light tracking-tight">Attendee Profile</h2>
              <p className="mt-1 text-xs text-white/50">
                Keep your attendee badge information and academic affiliation up to date.
              </p>
            </div>

            {profileSuccess && (
              <div className="mt-6 flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mt-6 flex items-center gap-2 border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="mt-2 h-11 w-full border border-white/10 bg-white/[0.01] px-4 text-sm text-white/40 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/50">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8B5CFF] mb-4">
                  Academic / Organizational Affiliation
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/50">University / College / Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Lovely Professional University"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-white/50">Degree</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-white/50">Department</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-white/50">Graduation Year</label>
                      <input
                        type="number"
                        placeholder="e.g. 2027"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#FF2D87] mb-4">
                  Public Profiles & Social Links
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/50">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-white/50">GitHub Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="mt-2 h-11 w-full border border-white/15 bg-white/[0.03] px-4 text-sm text-white focus:border-[#FF00D4] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex h-11 items-center gap-2 bg-linear-to-r from-[#FF00D4] to-[#702cff] px-8 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(255,0,212,0.25)] hover:opacity-95 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{savingProfile ? "Saving Changes..." : "Save Profile"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "guide" && (
          <div className="mt-8 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8">
              <h2 className="text-2xl font-light tracking-tight">Campus & Venue Locations</h2>
              <p className="mt-1 text-xs text-white/50">
                All festival stages, labs, and hackathon venues are located across LPU campus with direct shuttle and signage.
              </p>

              {loadingVenues ? (
                <div className="mt-12 flex flex-col items-center justify-center py-16 text-white/50">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-[#FF00D4]" />
                  <p className="mt-4 text-xs tracking-widest uppercase">Loading venue locations...</p>
                </div>
              ) : venues.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center border border-white/10 bg-white/[0.01] py-16 text-center">
                  <MapPin className="h-10 w-10 text-white/20" />
                  <h3 className="mt-4 text-base font-medium text-white">Festival Venue Guide Coming Soon</h3>
                  <p className="mt-1 max-w-sm text-xs text-white/50">
                    Stage locations, building halls, and interactive lab maps are being finalized and will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {venues.map((v) => (
                    <div key={v.id} className="border border-white/10 bg-black/40 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FF00D4]">
                          {v.building} {v.floor ? `· ${v.floor}` : ""} {v.room || v.room_number ? `· ${v.room || v.room_number}` : ""}
                        </span>
                        {v.capacity ? (
                          <span className="text-[10px] text-white/40">Capacity: {v.capacity}</span>
                        ) : null}
                      </div>
                      <h3 className="mt-2 text-lg font-medium text-white">
                        {v.name}
                      </h3>
                      {v.description && (
                        <p className="mt-2 text-xs leading-relaxed text-white/50">
                          {v.description}
                        </p>
                      )}
                      {v.amenities && v.amenities.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {v.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/60"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTicket && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setSelectedTicket(null)}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto border border-[#FF00D4] bg-[#0c0818] p-8 text-center shadow-[0_0_60px_rgba(255,0,212,0.35)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-[9px] uppercase tracking-widest text-[#FF2D87]">
                  AWS Re:Invent Fest 2026
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-400">
                  {selectedTicket.status}
                </span>
              </div>

              <h3 className="mt-6 text-3xl font-light text-white">
                {selectedTicket.category_name}
              </h3>

              <p className="mt-2 text-xs text-white/60">
                Official Delegate: <strong className="text-white">{fullName}</strong>
              </p>

              <div className="my-8 flex justify-center">
                <QrCode value={selectedTicket.ticket_code} size={220} />
              </div>

              <div className="space-y-2 border-y border-white/10 py-4 text-left text-xs text-white/60">
                <div className="flex justify-between">
                  <span>Ticket ID:</span>
                  <span className="font-mono text-white/80">{selectedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Festival Dates:</span>
                  <span className="text-white">Nov 30 – Dec 04, 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Verification Hash:</span>
                  <span className="font-mono text-[9px] text-[#FF00D4]">
                    {selectedTicket.ticket_code.slice(0, 20)}...
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyTicketCode(selectedTicket.ticket_code)}
                  className="flex-1 flex h-11 items-center justify-center gap-2 border border-white/20 text-xs uppercase tracking-wider hover:border-white text-white"
                >
                  {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex h-11 items-center justify-center gap-2 border border-[#FF00D4] bg-[#FF00D4]/20 px-5 text-xs uppercase tracking-wider text-white hover:bg-[#FF00D4]/30"
                >
                  <Download className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="mt-6 text-xs uppercase text-white/40 hover:text-white"
              >
                Close Ticket View
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
