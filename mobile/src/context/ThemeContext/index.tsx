import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Appearance, ColorSchemeName } from 'react-native'
import { darkTheme, lightTheme } from '../../constants/theme'
import { initializeTheme, toggleThemeLogic } from './logic'
import { ThemeContextType, ThemeMode } from './types'
import { Theme } from '../../constants/theme'

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  mode: 'light',
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === 'dark',
  )
  const [mode, setMode] = useState<ThemeMode>('system')

  useEffect(() => {
    const setup = async () => {
      const savedMode = await initializeTheme()
      setMode(savedMode)
      if (savedMode === 'system') {
        setIsDarkMode(Appearance.getColorScheme() === 'dark')
      } else {
        setIsDarkMode(savedMode === 'dark')
      }
    }
    setup()
  }, [])

  useEffect(() => {
    const handleSystemChange = ({
      colorScheme,
    }: {
      colorScheme: ColorSchemeName
    }) => {
      if (mode === 'system') {
        setIsDarkMode(colorScheme === 'dark')
      }
    }
    const subscription = Appearance.addChangeListener(handleSystemChange)
    return () => subscription.remove()
  }, [mode])

  const toggleTheme = async () => {
    const { isDarkMode: newDark, mode: newMode } =
      await toggleThemeLogic(isDarkMode)
    setIsDarkMode(newDark)
    setMode(newMode)
  }

  const currentTheme: Theme = isDarkMode ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, toggleTheme, isDarkMode, mode }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)