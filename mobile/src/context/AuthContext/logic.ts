import * as SecureStore from 'expo-secure-store'
import { User } from './types'

const TOKEN_KEY = 'civic_token'
const USER_KEY = 'civic_user'

export const saveAuth = async (user: User, token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user))
}

export const loadAuth = async (): Promise<{ user: User; token: string } | null> => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY)
  const userStr = await SecureStore.getItemAsync(USER_KEY)
  if (token && userStr) {
    return { token, user: JSON.parse(userStr) }
  }
  return null
}

export const clearAuth = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
  await SecureStore.deleteItemAsync(USER_KEY)
}