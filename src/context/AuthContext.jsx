import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { getCurrentUser as getStoredUser, login as authLogin, logout as authLogout } from '../services/authService.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const loggedUser = await authLogin(email, password)
      setUser(loggedUser)
      return loggedUser
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(user)
  const isAdmin = user?.role === 'admin'
  const isKitchen = user?.role === 'kitchen'

  const value = useMemo(
    () => ({ user, loading, isAuthenticated, isAdmin, isKitchen, login, logout }),
    [user, loading, isAuthenticated, isAdmin, isKitchen, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
