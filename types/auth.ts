export interface Academic {
  institution: string
  degree?: string | null
  department?: string | null
  graduation_year?: number | null
}

export interface Socials {
  linkedin?: string | null
  github?: string | null
}

export interface AuthUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  profile_picture: string | null
  academic: Academic
  socials: Socials | null
  roles: string[]
  is_active: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  phone: string
  workspace_name?: string | null
  workspace_uid?: string | null
  password: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface AuthResponse {
  user: AuthUser
}

export interface ApiError {
  detail?: string
  message?: string
}