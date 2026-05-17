import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../../screens/Auth/Login/LoginScreen'
import RegisterScreen from '../../screens/Auth/Register/RegisterScreen'

const Stack = createNativeStackNavigator()

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}