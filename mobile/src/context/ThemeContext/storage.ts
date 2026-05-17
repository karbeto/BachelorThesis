import * as SecureStore from 'expo-secure-store'

const THEME_KEY = 'civic_theme_mode'

export const saveTheme = async (mode: string): Promise<void> => {
  await SecureStore.setItemAsync(THEME_KEY, mode)
}

export const loadTheme = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(THEME_KEY)
}