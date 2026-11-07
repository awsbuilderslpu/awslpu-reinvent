export type SessionType =
  | "keynote"
  | "talk"
  | "workshop"
  | "panel"
  | "fireside_chat"
  | "lightning_talk"
  | "community"
  | "other"
  | "breakout"
  | "hackathon"

export interface SpeakerSocials {
  linkedin?: string
  github?: string
  website?: string
  twitter?: string
}

export interface Speaker {
  id: string
  full_name: string
  designation: string
  company?: string
  bio: string
  profile_picture?: string
  socials: SpeakerSocials
  topics: string[]
  is_active?: boolean
}

export interface Venue {
  id: string
  name: string
  code?: string
  description?: string
  building: string
  floor?: string
  room?: string
  room_number?: string
  capacity: number
  amenities?: string[]
  is_active?: boolean
}

export interface Session {
  id: string
  title: string
  description: string
  session_type: SessionType | string
  speaker_ids: string[]
  venue_id: string
  start_at: string
  end_at: string
  capacity: number
  topics: string[]
  is_active?: boolean
}

export interface PopulatedSession extends Omit<Session, "speaker_ids" | "venue_id"> {
  speakers: Speaker[]
  venue?: Venue
}
