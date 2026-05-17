import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { register } from '../../../api/auth'
import {
  useFormField,
  validateEmail,
  validatePassword,
  validateName,
} from '../../../utils/formHooks'
import Toast from 'react-native-toast-message'

const validatePhone = (value: string) => {
  if (!value) return undefined // optional
  const regex = /^[+]?[\d\s\-()]{7,15}$/
  return regex.test(value) ? undefined : 'Невалиден телефонски број'
}

const validateConfirmPassword = (password: string) => (value: string) => {
  if (!value) return 'Потврдете ја лозинката'
  if (value !== password) return 'Лозинките не се совпаѓаат'
  return undefined
}

export function useRegisterLogic(navigation: any) {
  const { setAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fullName = useFormField<string>('', validateName)
  const email = useFormField<string>('', validateEmail)
  const phone = useFormField<string>('', validatePhone)
  const password = useFormField<string>('', validatePassword)
  const confirmPassword = useFormField<string>(
    '',
    validateConfirmPassword(password.value),
  )

  const handleRegister = async () => {
    const nameValid = fullName.validateField()
    const emailValid = email.validateField()
    const passwordValid = password.validateField()
    const confirmValid = confirmPassword.validateField()
    if (!nameValid || !emailValid || !passwordValid || !confirmValid) return

    setLoading(true)
    try {
      const data = await register({
        email: email.value,
        password: password.value,
        full_name: fullName.value,
        phone: phone.value || undefined,
      })
      await setAuth(data.user, data.access_token)
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Грешка при регистрација',
        text2: err.response?.data?.detail || 'Обидете се повторно',
      })
    } finally {
      setLoading(false)
    }
  }

  const goToLogin = () => navigation.navigate('Login')

  return {
    fullName,
    email,
    phone,
    password,
    confirmPassword,
    loading,
    showPassword,
    showConfirm,
    setShowPassword,
    setShowConfirm,
    handleRegister,
    goToLogin,
  }
}