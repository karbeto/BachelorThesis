import { View, Text } from 'react-native'
import { useTheme } from '../../context/ThemeContext'

export default function IdeasScreen() {
  const { theme } = useTheme()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>IdeasScreen</Text>
    </View>
  )
}