import { Appearance } from 'react-native'
import { loadTheme, saveTheme } from './storage'
import { ThemeMode } from './types'

export const getSystemTheme = (): 'light' | 'dark' => {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
}

export const initializeTheme = async (): Promise<ThemeMode> => {
  const saved = await loadTheme()
  if (saved) return saved as ThemeMode
  return 'system'
}

export const toggleThemeLogic = async (
  current: boolean,
): Promise<{ isDarkMode: boolean; mode: ThemeMode }> => {
  const newIsDark = !current
  const newMode: ThemeMode = newIsDark ? 'dark' : 'light'
  await saveTheme(newMode)
  return { isDarkMode: newIsDark, mode: newMode }
}