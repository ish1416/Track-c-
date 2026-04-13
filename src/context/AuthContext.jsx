import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

const BASE = ''  // proxied via vite

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem('trackc_token') ?? null)
  const [user,  setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('trackc_user')) } catch { return null }
  })
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const register = useCallback(async ({ name, email, password, role = 'citizen' }) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Registration failed')
      return { ok: true }
    } catch (e) {
      setAuthError(e.message)
      return { ok: false }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setAuthLoading(true)
    setAuthError('')
    try {
      const body = new URLSearchParams({ username: email, password })
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Login failed')
      // Role is in the JWT payload, not the response body — decode it
      let role = 'citizen'
      try {
        const payload = JSON.parse(atob(data.access_token.split('.')[1]))
        role = payload.role ?? 'citizen'
      } catch {}
      const userData = { email, name: email.split('@')[0], role }
      setToken(data.access_token)
      setUser(userData)
      localStorage.setItem('trackc_token', data.access_token)
      localStorage.setItem('trackc_user', JSON.stringify(userData))
      return { ok: true, role: userData.role }
    } catch (e) {
      setAuthError(e.message)
      return { ok: false }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('trackc_token')
    localStorage.removeItem('trackc_user')
  }, [])

  // Auto-logout on 401 — skip auth endpoints to avoid clearing token during login
  useEffect(() => {
    const origFetch = window.fetch
    window.fetch = async (...args) => {
      const res = await origFetch(...args)
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url ?? ''
      const isAuthRoute = url.includes('/auth/')
      if (res.status === 401 && !isAuthRoute) {
        setToken(null)
        setUser(null)
        localStorage.removeItem('trackc_token')
        localStorage.removeItem('trackc_user')
      }
      return res
    }
    return () => { window.fetch = origFetch }
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, authError, authLoading, login, logout, register, setAuthError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
