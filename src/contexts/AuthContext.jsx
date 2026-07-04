import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)
const API_BASE = '/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('fitness_user')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()

      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem('fitness_user', JSON.stringify(data.user))

        // Initialize user data on first login
        try {
          await fetch(`${API_BASE}/setup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id })
          })
        } catch {}

        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('fitness_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
