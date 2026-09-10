import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { getCurrentUser, login } from './authApi'
import type { AuthUser, LoginCredentials } from './authTypes'

type AuthContextValue = {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  loginUser: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const ACCESS_TOKEN_KEY = 'clinic-stock-access-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(ACCESS_TOKEN_KEY),
  )

  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!accessToken) {
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser(accessToken)
        setUser(currentUser)
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        setAccessToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [accessToken])

  async function loginUser(credentials: LoginCredentials) {
    const response = await login(credentials)

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken)
    setAccessToken(response.accessToken)

    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      image: response.image,
    })
  }

  function logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    setAccessToken(null)
    setUser(null)
  }

  const value: AuthContextValue = {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken && user),
    isLoading,
    loginUser,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
