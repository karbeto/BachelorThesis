import client from './client'

export const getNotifications = async (unread_only = false) => {
  const { data } = await client.get('/notifications', {
    params: { unread_only },
  })
  return data
}

export const markAsRead = async (id: number) => {
  const { data } = await client.patch(`/notifications/${id}/read`)
  return data
}

export const markAllAsRead = async () => {
  await client.patch('/notifications/read-all')
}