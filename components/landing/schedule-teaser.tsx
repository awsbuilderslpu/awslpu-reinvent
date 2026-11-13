"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ArrowUpRight, Clock, MapPin } from "lucide-react"
import type { PopulatedSession } from "@/types/schedule"

export function ScheduleTeaser() {
  const [sessions, setSessions] = useState<PopulatedSession[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDate, setActiveDate] = useState<string>("")

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const res = await fetch("/api/schedule")
        if (res.ok) {
          const data = await res.json()
          const items: PopulatedSession[] = Array.isArray(data.sessions) ? data.sessions : []
          setSessions(items)
          if (items.length > 0) {
            const firstDate = items[0].start_at ? items[0].start_at.slice(0, 10) : ""
            setActiveDate(firstDate)
          }
        }
      } catch {
        setSessions([])
      } finally {
        setLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  const uniqueDates = useMemo(() => {
    const dates = Array.from(
      new Set(
        sessions
          .map((s) => (s.start_at ? s.start_at.slice(0, 10) : ""))
          .filter(Boolean)
      )
    ).sort()
    return dates
  }, [sessions])

  const activeSessions = useMemo(() => {
    if (!activeDate) return sessions.slice(0, 4)
    return sessions.filter((s) => s.start_at && s.start_at.slice(0, 10) === activeDate)
  }, [sessions, activeDate])

  function formatTime(isoString: string) {
    try {
      return new Date(isoString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    } catch {
      return ""
    }
  }

  function formatDate(isoDate: string) {
    try {
      const d = new Date(`${isoDate}T00:00:00Z`)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    } catch {
      return isoDate
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-20 text-white sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(108,0,255,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#FF00D4]" />
              <span className="text-xs uppercase tracking-[0.22em] text-[#FF00D4]">
                Event Agenda
              </span>
            </div>

            <h2 className="text-4xl font-light tracking-[-0.06em] sm:text-6xl">
              Five days of{" "}
              <span className="bg-gradient-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">
                discovery.
              </span>
            </h2>
          </div>

          <Link
            href="/schedule"
            className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 transition-colors hover:text-[#FF2D87]"
          >
            Explore Full Schedule
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#FF2D87]" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 h-64 animate-pulse border border-white/5 bg-white/[0.02]" />
        ) : sessions.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center border border-white/10 bg-white/[0.01] py-16 text-center">
            <span className="text-xs uppercase tracking-widest text-[#FF00D4]">
              Festival Program
            </span>
            <h3 className="mt-2 text-xl font-light text-white">
              Schedule Announced Soon
            </h3>
            <p className="mt-2 max-w-md text-xs text-white/50">
              Keynotes, workshops, breakout sessions, and hackathon schedules are being curated by our technical committee.
            </p>
          </div>
        ) : (
          <div className="mt-10">
            {uniqueDates.length > 1 && (
              <div className="mb-6 flex gap-2.5 overflow-x-auto pb-2 scrollbar-none touch-pan-x snap-x snap-mandatory">
                {uniqueDates.map((dateStr, idx) => (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setActiveDate(dateStr)}
                    className={`shrink-0 snap-start min-w-[130px] sm:min-w-[150px] border px-4 py-3 sm:px-5 sm:py-3.5 text-left transition-all duration-200 cursor-pointer ${
                      activeDate === dateStr
                        ? "border-[#FF00D4] bg-[#FF00D4]/15 shadow-[0_0_20px_rgba(255,0,212,0.2)] text-white"
                        : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-wider text-[#FF2D87]">Day 0{idx + 1}</p>
                    <p className="text-sm font-semibold text-white">{formatDate(dateStr)}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="border border-white/10 bg-white/[0.015] p-5 sm:p-8 lg:p-10">
              <div className="grid gap-5 md:grid-cols-2">
                {activeSessions.map((ses) => (
                  <div
                    key={ses.id}
                    className="group relative flex flex-col justify-between border border-white/10 bg-black/40 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF00D4]/70 hover:bg-white/[0.03] hover:shadow-[0_0_30px_rgba(255,0,212,0.12)]"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="border border-[#8B5CFF]/30 bg-[#8B5CFF]/10 px-2.5 py-1 text-[9px] uppercase tracking-wider text-[#B69AFF]">
                          {ses.session_type}
                        </span>
                        {ses.start_at && (
                          <span className="flex items-center gap-1.5 text-xs text-white/50">
                            <Clock className="h-3.5 w-3.5 text-[#FF2D87]" />
                            {formatTime(ses.start_at)}
                            {ses.end_at ? ` - ${formatTime(ses.end_at)}` : ""}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-normal leading-snug tracking-tight text-white group-hover:text-[#FF2D87] transition-colors">
                        {ses.title}
                      </h4>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4 space-y-1 text-xs text-white/50">
                      {ses.speakers && ses.speakers.length > 0 && (
                        <p className="text-white/80 font-medium">
                          {ses.speakers.map((s) => s.full_name).join(", ")}
                        </p>
                      )}
                      {ses.venue && (
                        <p className="flex items-center gap-1.5 text-white/40">
                          <MapPin className="h-3 w-3 text-[#FF00D4]" />
                          {ses.venue.name} {ses.venue.building ? `(${ses.venue.building})` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
