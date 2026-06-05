import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { ThemeProvider } from './src/context/ThemeContext'
import { AuthProvider } from './src/context/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'
import { useNetworkSync } from './src/hooks/useNetworkSync'

const queryClient = new QueryClient()

function AppWithSync() {
  useNetworkSync()
  return <AppNavigator />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppWithSync />
          <Toast />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}