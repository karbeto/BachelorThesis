import { NavigationContainer } from '@react-navigation/native'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import AuthStack from './stacks/AuthStack'
import AppStack from './stacks/AppStack'

export default function AppNavigator() {
  const { token, isLoading } = useAuth()
  const { theme } = useTheme()

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}