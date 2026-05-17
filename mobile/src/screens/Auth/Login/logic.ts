import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { login } from '../../../api/auth'
import {
  useFormField,
  validateEmail,
  validatePassword,
} from '../../../utils/formHooks'
import Toast from 'react-native-toast-message'

export function useLoginLogic(navigation: any) {
  const { setAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const email = useFormField('', validateEmail)
  const password = useFormField('', validatePassword)

  const handleLogin = async () => {
    const emailValid = email.validateField()
    const passwordValid = password.validateField()
    if (!emailValid || !passwordValid) return

    setLoading(true)
    try {
      const data = await login(email.value, password.value)
      await setAuth(data.user, data.access_token)
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Грешка при најава',
        text2: err.response?.data?.detail || 'Невалидна е-пошта или лозинка',
      })
    } finally {
      setLoading(false)
    }
  }

  const goToRegister = () => navigation.navigate('Register')

  return {
    email,
    password,
    loading,
    showPassword,
    setShowPassword,
    handleLogin,
    goToRegister,
  }
}