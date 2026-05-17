export interface User {
  id: number
  email: string
  full_name: string
  role: string
  phone?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  setAuth: (user: User, token: string) => Promise<void>
  logout: () => Promise<void>
}