import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../../api/notifications'
import Toast from 'react-native-toast-message'

export function useNotificationsLogic() {
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()
  const [unreadOnly, setUnreadOnly] = useState(false)

  const { data: notifications, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: () => getNotifications(unreadOnly),
  })

  const markReadMutation = useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      Toast.show({ type: 'success', text1: 'Сите известувања се прочитани ✓' })
    },
  })

  const handleNotificationPress = (notification: any) => {
    if (!notification.is_read) {
      markReadMutation.mutate(notification.id)
    }
    if (notification.report_id) {
      navigation.navigate('ReportDetail', { id: notification.report_id })
    }
  }

  const unreadCount = notifications?.filter((n: any) => !n.is_read).length ?? 0

  return {
    notifications,
    isLoading,
    refetch,
    isRefetching,
    unreadOnly,
    setUnreadOnly,
    unreadCount,
    handleNotificationPress,
    handleMarkAll: () => markAllMutation.mutate(),
    isMarkingAll: markAllMutation.isPending,
  }
}