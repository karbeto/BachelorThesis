import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { saveAuth, loadAuth, clearAuth } from './logic'
import { AuthContextType, User } from './types'
import { authTrigger } from '../../utils/authTrigger' 

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  setAuth: async () => {},
  logout: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const saved = await loadAuth()
      if (saved) {
        setUser(saved.user)
        setToken(saved.token)
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const setAuth = async (user: User, token: string) => {
    await saveAuth(user, token)
    setUser(user)
    setToken(token)
  }

  const logout = async () => {
    await clearAuth()
    setUser(null)
    setToken(null)
  }

  useEffect(() => {
    authTrigger.logout = logout;
  }, [logout])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)