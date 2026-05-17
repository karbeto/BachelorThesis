import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface User {
  id: number
  email: string
  full_name: string
  role: string
  phone?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => Promise<void>
  logout: () => Promise<void>
  loadFromStorage: () => Promise<void>
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('token', token)
    await SecureStore.setItemAsync('user', JSON.stringify(user))
    set({ user, token })
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token')
    await SecureStore.deleteItemAsync('user')
    set({ user: null, token: null })
  },

  loadFromStorage: async () => {
    const token = await SecureStore.getItemAsync('token')
    const userStr = await SecureStore.getItemAsync('user')
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) })
    }
  },
}))

export default useAuthStore
