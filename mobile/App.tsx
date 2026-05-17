import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { ThemeProvider } from './src/context/ThemeContext'
import { AuthProvider } from './src/context/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
          <Toast />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}