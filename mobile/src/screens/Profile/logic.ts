import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { getMyReports } from '../../api/reports'
import { useFormField, useModal } from '../../utils/formHooks'
import client from '../../api/client'
import Toast from 'react-native-toast-message'

const validatePassword = (v: string) =>
  v.length >= 6 ? undefined : 'Минимум 6 карактери'

const validateConfirm = (password: string) => (v: string) =>
  v === password ? undefined : 'Лозинките не се совпаѓаат'

export function useProfileLogic() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme, isDarkMode } = useTheme()
  const navigation = useNavigation<any>()

  const passwordModal = useModal()
  const logoutModal = useModal()

  const [changingPassword, setChangingPassword] = useState(false)

  const currentPassword = useFormField<string>('', validatePassword)
  const newPassword = useFormField<string>('', validatePassword)
  const confirmPassword = useFormField<string>(
    '',
    validateConfirm(newPassword.value),
  )

  const { data: myReports } = useQuery({
    queryKey: ['my-reports'],
    queryFn: getMyReports,
  })

  const stats = {
    total: myReports?.length ?? 0,
    resolved: myReports?.filter((r: any) => r.status === 'resolved').length ?? 0,
    pending: myReports?.filter((r: any) =>
      r.status === 'submitted' || r.status === 'in_progress'
    ).length ?? 0,
  }

  const handleChangePassword = async () => {
    const c = currentPassword.validateField()
    const n = newPassword.validateField()
    const conf = confirmPassword.validateField()
    if (!c || !n || !conf) return

    setChangingPassword(true)
    try {
      await client.patch('/users/me/password', {
        current_password: currentPassword.value,
        new_password: newPassword.value,
      })
      Toast.show({ type: 'success', text1: 'Лозинката е променета ✓' })
      passwordModal.close()
      currentPassword.setValue('')
      newPassword.setValue('')
      confirmPassword.setValue('')
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.detail || 'Грешка при промена',
      })
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    logoutModal.close()
  }

  const getRoleLabel = (role: string) => {
    const map: Record<string, string> = {
      citizen: 'Граѓанин',
      municipality_admin: 'Општина Админ',
      superadmin: 'Супер Админ',
    }
    return map[role] || role
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return {
    user,
    stats,
    isDarkMode,
    toggleTheme,
    passwordModal,
    logoutModal,
    currentPassword,
    newPassword,
    confirmPassword,
    changingPassword,
    handleChangePassword,
    handleLogout,
    getRoleLabel,
    getInitials,
  }
}