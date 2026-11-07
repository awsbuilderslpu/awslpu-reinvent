"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  User,
  ExternalLink,
  X,
  Users,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { LinkedinIcon, GithubIcon } from "@/components/icons"
import type { PopulatedSession, Speaker } from "@/types/schedule"

const trackFilters: { id: string; label: string }[] = [
  { id: "all", label: "All Sessions" },
  { id: "keynote", label: "Keynotes" },
  { id: "talk", label: "Talks" },
  { id: "breakout", label: "Breakouts" },
  { id: "workshop", label: "Workshops" },
  { id: "hackathon", label: "Hackathons" },
  { id: "panel", label: "Panels" }
]

export default function SchedulePage() {
  const [sessions, setSessions] = useState<PopulatedSession[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedTrack, setSelectedTrack] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSession, setActiveSession] = useState<PopulatedSession | null>(null)
  const [activeTab, setActiveTab] = useState<"schedule" | "speakers">("schedule")

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const res = await fetch("/api/schedule")
        if (!res.ok) throw new Error("Could not load schedule")
        const data = await res.json()
        const fetchedSessions: PopulatedSession[] = Array.isArray(data.sessions) ? data.sessions : []
        const fetchedSpeakers: Speaker[] = Array.isArray(data.speakers) ? data.speakers : []
        setSessions(fetchedSessions)
        setSpeakers(fetchedSpeakers)

        if (fetchedSessions.length > 0) {
          const firstDate = fetchedSessions[0].start_at ? fetchedSessions[0].start_at.slice(0, 10) : ""
          if (firstDate) {
            setSelectedDay(firstDate)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schedule")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const availableDays = useMemo(() => {
    const dates = Array.from(
      new Set(
        sessions
          .map((s) => (s.start_at ? s.start_at.slice(0, 10) : ""))
          .filter(Boolean)
      )
    ).sort()

    return dates.map((dateStr, idx) => {
      let dateLabel = dateStr
      try {
        const d = new Date(`${dateStr}T00:00:00Z`)
        dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      } catch {}
      return {
        id: dateStr,
        label: `Day 0${idx + 1}`,
        date: dateLabel,
        title: `Festival Day 0${idx + 1}`
      }
    })
  }, [sessions])

  useEffect(() => {
    if (availableDays.length > 0 && (!selectedDay || !availableDays.find((d) => d.id === selectedDay))) {
      setSelectedDay(availableDays[0].id)
    }
  }, [availableDays, selectedDay])

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const sessionDate = s.start_at ? s.start_at.slice(0, 10) : ""
      const matchesDay = !selectedDay || sessionDate === selectedDay

      const matchesTrack =
        selectedTrack === "all" || s.session_type === selectedTrack

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.topics && s.topics.some((t) => t.toLowerCase().includes(q))) ||
        (s.speakers &&
          s.speakers.some(
            (spk) =>
              spk.full_name.toLowerCase().includes(q) ||
              (spk.company && spk.company.toLowerCase().includes(q))
          ))

      return matchesDay && matchesTrack && matchesSearch
    })
  }, [sessions, selectedDay, selectedTrack, searchQuery])

  function formatTime(isoString: string) {
    try {
      const d = new Date(isoString)
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    } catch {
      return isoString
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
                Schedule & Speakers
              </span>
            </div>

            <h1 className="text-4xl font-light tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Festival <span className="bg-gradient-to-r from-[#FF2D87] via-[#FF00D4] to-[#8B5CFF] bg-clip-text text-transparent">Program</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Explore technical keynotes, builder labs, hackathons, and high-impact industry panels at Lovely Professional University.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`h-11 px-6 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                activeTab === "schedule"
                  ? "border border-[#FF00D4] bg-[#FF00D4]/15 text-white shadow-[0_0_20px_rgba(255,0,212,0.2)]"
                  : "border border-white/15 bg-white/[0.02] text-white/60 hover:text-white"
              }`}
            >
              Sessions Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("speakers")}
              className={`h-11 px-6 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                activeTab === "speakers"
                  ? "border border-[#FF00D4] bg-[#FF00D4]/15 text-white shadow-[0_0_20px_rgba(255,0,212,0.2)]"
                  : "border border-white/15 bg-white/[0.02] text-white/60 hover:text-white"
              }`}
            >
              All Speakers ({speakers.length})
            </button>
          </div>
        </div>

        {activeTab === "schedule" ? (
          <div className="mt-10">
            {availableDays.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-5">
                {availableDays.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDay(d.id)}
                    className={`flex flex-col justify-between border p-4 text-left transition-all duration-200 ${
                      selectedDay === d.id
                        ? "border-[#FF00D4] bg-[#FF00D4]/10 shadow-[0_0_25px_rgba(255,0,212,0.18)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FF2D87]">
                        {d.label}
                      </span>
                      <span className="text-xs text-white/50">{d.date}</span>
                    </div>
                    <p className="mt-3 text-xs font-medium line-clamp-1 text-white">
                      {d.title}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {trackFilters.map((tf) => (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setSelectedTrack(tf.id)}
                    className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider transition-all ${
                      selectedTrack === tf.id
                        ? "border border-[#8B5CFF] bg-[#8B5CFF]/20 text-[#B69AFF]"
                        : "border border-white/10 text-white/50 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search topic or speaker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full border border-white/15 bg-white/[0.03] pl-9 pr-4 text-xs text-white placeholder-white/35 focus:border-[#FF00D4] focus:outline-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="mt-16 flex flex-col items-center justify-center py-24 text-white/50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#FF00D4]" />
                <p className="mt-4 text-xs tracking-widest uppercase">Loading festival agenda...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center border border-white/10 bg-white/[0.01] py-20 text-center">
                <Calendar className="h-10 w-10 text-white/20" />
                <h3 className="mt-4 text-lg font-medium text-white/80">Festival Schedule Coming Soon</h3>
                <p className="mt-2 max-w-md text-xs text-white/40">
                  All keynote stages, builder labs, hackathon tracks, and panels are being scheduled and will appear here shortly.
                </p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center border border-white/10 bg-white/[0.01] py-20 text-center">
                <Calendar className="h-10 w-10 text-white/20" />
                <h3 className="mt-4 text-lg font-medium text-white/80">No sessions match your filter</h3>
                <p className="mt-2 text-xs text-white/40">Try selecting another filter or clear your search keyword.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrack("all")
                    setSearchQuery("")
                  }}
                  className="mt-6 border border-white/20 px-5 py-2 text-xs uppercase tracking-wider hover:border-[#FF00D4]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {filteredSessions.map((session) => (
                  <article
                    key={session.id}
                    onClick={() => setActiveSession(session)}
                    className="group relative cursor-pointer border border-white/10 bg-white/[0.02] p-6 transition-all duration-200 hover:border-[#FF00D4]/70 hover:bg-white/[0.035] hover:shadow-[0_0_30px_rgba(255,0,212,0.08)] sm:p-8"
                  >
                    <div className="grid gap-6 md:grid-cols-[180px_1fr_auto] md:items-center">
                      <div>
                        {session.start_at && (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF2D87]">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {formatTime(session.start_at)} {session.end_at ? `– ${formatTime(session.end_at)}` : ""}
                            </span>
                          </div>
                        )}
                        <span className="mt-2 inline-block border border-white/15 bg-white/[0.03] px-2.5 py-1 text-[9px] uppercase tracking-wider text-white/60">
                          {session.session_type}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-medium tracking-tight text-white group-hover:text-[#FF2D87] transition-colors sm:text-2xl">
                          {session.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-white/55 line-clamp-2">
                          {session.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/60">
                          {session.venue && (
                            <span className="flex items-center gap-1.5 text-white/40">
                              <MapPin className="h-3.5 w-3.5 text-[#FF00D4]" />
                              {session.venue.name} {session.venue.building ? `(${session.venue.building})` : ""}
                            </span>
                          )}

                          {session.capacity && (
                            <span className="flex items-center gap-1 text-white/40">
                              <Users className="h-3.5 w-3.5 text-[#8B5CFF]" />
                              {session.capacity} Seats
                            </span>
                          )}

                          {session.topics && session.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {session.topics.map((t) => (
                                <span
                                  key={t}
                                  className="border border-white/10 px-2 py-0.5 text-[9px] uppercase text-white/45"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 border-t border-white/10 pt-4 md:border-t-0 md:pt-0">
                        {session.speakers && session.speakers.map((spk) => (
                          <div key={spk.id} className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10">
                              {spk.profile_picture ? (
                                <img
                                  src={spk.profile_picture}
                                  alt={spk.full_name}
                                  className="h-full w-full object-cover grayscale contrast-125 group-hover:grayscale-0"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40">
                                  <User className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="hidden sm:block text-left">
                              <p className="text-xs font-medium text-white">{spk.full_name}</p>
                              <p className="text-[10px] text-white/45 line-clamp-1">{spk.company || spk.designation}</p>
                            </div>
                          </div>
                        ))}

                        <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 group-hover:border-[#FF00D4] group-hover:text-white transition-all">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div id="speakers" className="mt-12">
            {loading ? (
              <div className="mt-16 flex flex-col items-center justify-center py-24 text-white/50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#FF00D4]" />
                <p className="mt-4 text-xs tracking-widest uppercase">Loading speakers...</p>
              </div>
            ) : speakers.length === 0 ? (
              <div className="mt-12 flex flex-col items-center justify-center border border-white/10 bg-white/[0.01] py-20 text-center">
                <Users className="h-10 w-10 text-white/20" />
                <h3 className="mt-4 text-lg font-medium text-white/80">Speaker Lineup Coming Soon</h3>
                <p className="mt-2 max-w-md text-xs text-white/40">
                  Keynote speakers, industry engineers, and community leaders will be announced soon.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {speakers.map((spk) => (
                  <div
                    key={spk.id}
                    className="group relative flex flex-col justify-between border border-white/10 bg-white/[0.02] p-7 transition-all duration-300 hover:border-[#FF00D4]/70 hover:shadow-[0_0_35px_rgba(255,0,212,0.1)]"
                  >
                    <div>
                      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
                        {spk.profile_picture ? (
                          <img
                            src={spk.profile_picture}
                            alt={spk.full_name}
                            className="h-full w-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/30">
                            <User className="h-16 w-16" />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>

                      <div className="mt-6">
                        {spk.company && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FF00D4]">
                            {spk.company}
                          </span>
                        )}
                        <h3 className="mt-1 text-2xl font-medium tracking-tight text-white group-hover:text-[#FF2D87] transition-colors">
                          {spk.full_name}
                        </h3>
                        <p className="mt-1 text-xs text-white/60">{spk.designation}</p>
                        <p className="mt-4 text-xs leading-relaxed text-white/50 line-clamp-3">
                          {spk.bio}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {spk.topics && spk.topics.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="border border-white/10 px-2 py-0.5 text-[9px] uppercase text-white/40"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        {spk.socials?.linkedin && (
                          <a
                            href={spk.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${spk.full_name} LinkedIn`}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <LinkedinIcon className="h-4 w-4" />
                          </a>
                        )}
                        {spk.socials?.github && (
                          <a
                            href={spk.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${spk.full_name} GitHub`}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <GithubIcon className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSession && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setActiveSession(null)}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#FF00D4] bg-[#0c0814] p-6 shadow-[0_0_50px_rgba(255,0,212,0.25)] sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveSession(null)}
                className="absolute right-4 top-4 p-2 text-white/50 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-[#8B5CFF]/40 bg-[#8B5CFF]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#B69AFF]">
                  {activeSession.session_type}
                </span>
                {activeSession.start_at && (
                  <span className="flex items-center gap-1.5 text-xs text-white/60">
                    <Clock className="h-3.5 w-3.5 text-[#FF2D87]" />
                    {formatTime(activeSession.start_at)} {activeSession.end_at ? `– ${formatTime(activeSession.end_at)}` : ""}
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-light tracking-tight text-white sm:text-3xl">
                {activeSession.title}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {activeSession.description}
              </p>

              {activeSession.venue && (
                <div className="mt-6 border-t border-white/10 pt-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#FF00D4]">Venue Location</h4>
                  <p className="mt-1 text-sm font-medium text-white">{activeSession.venue.name}</p>
                  <p className="text-xs text-white/50">{activeSession.venue.building} {activeSession.venue.floor ? `· ${activeSession.venue.floor}` : ""}</p>
                </div>
              )}

              {activeSession.speakers && activeSession.speakers.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#FF2D87] mb-3">Featured Speakers</h4>
                  <div className="space-y-3">
                    {activeSession.speakers.map((spk) => (
                      <div key={spk.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10">
                          {spk.profile_picture ? (
                            <img src={spk.profile_picture} alt={spk.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">{spk.full_name}</p>
                          <p className="text-[11px] text-white/50">{spk.designation} {spk.company ? `· ${spk.company}` : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSession(null)}
                  className="border border-white/20 px-6 py-2 text-xs uppercase tracking-wider text-white hover:border-white transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
