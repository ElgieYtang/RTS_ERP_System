import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

const AUTH_STORAGE_KEY = 'rc-erp-session'

interface AuthUser {
  name: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_USER: AuthUser = {
  name: 'Admin',
  email: 'admin@responsivcode.com',
}

const DEMO_PASSWORD = 'admin123'

function readStoredUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase()
    const validEmail = normalized === DEMO_USER.email || normalized === 'admin'
    const validPassword = password === DEMO_PASSWORD || password === 'admin'

    if (!validEmail || !validPassword) return false

    const sessionUser = { ...DEMO_USER, email: normalized === 'admin' ? DEMO_USER.email : normalized }
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return true
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
