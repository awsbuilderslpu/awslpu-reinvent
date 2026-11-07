import { NextResponse } from "next/server"
import { backendFetch, backendJson } from "@/lib/api/backend"
import type { Session, Speaker, Venue, PopulatedSession } from "@/types/schedule"

export async function GET() {
  try {
    const [sessionsRes, speakersRes, venuesRes] = await Promise.allSettled([
      backendFetch("/api/v1/sessions/"),
      backendFetch("/api/v1/speakers/"),
      backendFetch("/api/v1/venues/")
    ])

    let rawSessions: Session[] = []
    let speakers: Speaker[] = []
    let venues: Venue[] = []

    if (speakersRes.status === "fulfilled" && speakersRes.value.ok) {
      const data = await backendJson<Speaker[]>(speakersRes.value).catch(() => null)
      if (Array.isArray(data)) {
        speakers = data
      }
    }

    if (venuesRes.status === "fulfilled" && venuesRes.value.ok) {
      const data = await backendJson<Venue[]>(venuesRes.value).catch(() => null)
      if (Array.isArray(data)) {
        venues = data
      }
    }

    if (sessionsRes.status === "fulfilled" && sessionsRes.value.ok) {
      const data = await backendJson<Session[]>(sessionsRes.value).catch(() => null)
      if (Array.isArray(data)) {
        rawSessions = data
      }
    }

    const speakerMap = new Map<string, Speaker>(speakers.map((s) => [s.id, s]))
    const venueMap = new Map<string, Venue>(venues.map((v) => [v.id, v]))

    const populated: PopulatedSession[] = rawSessions.map((session) => ({
      ...session,
      speakers: (session.speaker_ids || [])
        .map((id) => speakerMap.get(id))
        .filter((s): s is Speaker => Boolean(s)),
      venue: venueMap.get(session.venue_id)
    }))

    return NextResponse.json({
      sessions: populated,
      speakers,
      venues
    })
  } catch {
    return NextResponse.json({
      sessions: [],
      speakers: [],
      venues: []
    })
  }
}
