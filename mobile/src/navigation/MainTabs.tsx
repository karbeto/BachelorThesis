import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

import MapScreen from '../screens/Map/MapScreen'
import MyReportsScreen from '../screens/MyReports/MyReportsScreen'
import IdeasScreen from '../screens/Ideas/Idea/IdeasScreen'
import NotificationsScreen from '../screens/Notifications/NotificationsScreen'
import ProfileScreen from '../screens/Profile/ProfileScreen'

const Tab = createBottomTabNavigator()

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const tabs = [
  {
    name: 'Map',
    component: MapScreen,
    label: 'Мапа',
    icon: 'map-outline' as IoniconsName,
    iconActive: 'map' as IoniconsName,
  },
  {
    name: 'MyReports',
    component: MyReportsScreen,
    label: 'Пријави',
    icon: 'document-text-outline' as IoniconsName,
    iconActive: 'document-text' as IoniconsName,
  },
  {
    name: 'Ideas',
    component: IdeasScreen,
    label: 'Идеи',
    icon: 'bulb-outline' as IoniconsName,
    iconActive: 'bulb' as IoniconsName,
  },
  {
    name: 'Notifications',
    component: NotificationsScreen,
    label: 'Известувања',
    icon: 'notifications-outline' as IoniconsName,
    iconActive: 'notifications' as IoniconsName,
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    label: 'Профил',
    icon: 'person-outline' as IoniconsName,
    iconActive: 'person' as IoniconsName,
  },
]

export default function MainTabs() {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color }) => {
          const tab = tabs.find((t) => t.name === route.name)
          const iconName = focused ? tab?.iconActive : tab?.icon
          return <Ionicons name={iconName!} size={22} color={color} />
        },
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label }}
        />
      ))}
    </Tab.Navigator>
  )
}