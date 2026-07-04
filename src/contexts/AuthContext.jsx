import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { USERS } from '../data/users'

const AuthContext = createContext(null)

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

  const login = useCallback((username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password)
    if (found) {
      const { password: _, ...safe } = found
      setUser(safe)
      localStorage.setItem('fitness_user', JSON.stringify(safe))
      return true
    }
    return false
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
