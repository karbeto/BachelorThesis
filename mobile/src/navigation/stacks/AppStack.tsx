import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabs from '../MainTabs'
import SubmitReportScreen from '../../screens/Report/SubmitReportScreen'
import ReportDetailScreen from '../../screens/Report/ReportDetailScreen'
import SubmitIdeaScreen from '../../screens/Ideas/SubmitIdeaScreen'
import { useTheme } from '../../context/ThemeContext'

const Stack = createNativeStackNavigator()

export default function AppStack() {
  const { theme } = useTheme()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="SubmitReport"
        component={SubmitReportScreen}
        options={{
          headerShown: true,
          title: 'Нова пријава',
          headerBackTitle: '',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{
          headerShown: true,
          title: 'Детали',
          headerBackTitle: '',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen
        name="SubmitIdea"
        component={SubmitIdeaScreen}
        options={{
          headerShown: true,
          title: 'Нова идеја',
          headerBackTitle: '',
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
        }}
      />
    </Stack.Navigator>
  )
}