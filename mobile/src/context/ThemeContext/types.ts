import { Theme } from '../../constants/theme'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeContextType {
  theme: Theme
  isDarkMode: boolean
  mode: ThemeMode
  toggleTheme: () => void
}