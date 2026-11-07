"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"

import type {
  AuthUser,
  LoginRequest,
  RegisterRequest
} from "@/types/auth"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  authenticated: boolean
  login: (credentials: LoginRequest) => Promise<AuthUser>
  register: (data: RegisterRequest) => Promise<AuthUser>
  refreshUser: () => Promise<AuthUser | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function getError(response: Response) {
  const data = await response.json().catch(() => null)

  return (
    data?.detail ||
    data?.message ||
    "Something went wrong. Please try again."
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store"
      })

      if (!response.ok) {
        setUser(null)
        return null
      }

      const data = await response.json()

      setUser(data.user)

      return data.user as AuthUser
    } catch {
      setUser(null)
      return null
    }
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      throw new Error(await getError(response))
    }

    const authenticatedUser = await refreshUser()

    if (!authenticatedUser) {
      throw new Error("Login succeeded, but user profile could not be loaded.")
    }

    return authenticatedUser
  }, [refreshUser])

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(await getError(response))
    }

    const authenticatedUser = await refreshUser()

    if (!authenticatedUser) {
      throw new Error("Registration succeeded, but user profile could not be loaded.")
    }

    return authenticatedUser
  }, [refreshUser])

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      })
    } finally {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let active = true

    async function initialize() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store"
        })

        if (!response.ok) {
          if (active) setUser(null)
          return
        }

        const data = await response.json()

        if (active) {
          setUser(data.user)
        }
      } catch {
        if (active) setUser(null)
      } finally {
        if (active) setLoading(false)
      }
    }

    initialize()

    return () => {
      active = false
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated: !!user,
        login,
        register,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}