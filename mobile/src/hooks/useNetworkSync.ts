import { useEffect, useRef } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { useQueryClient } from '@tanstack/react-query'
import { submitReport } from '../api/reports'
import {
  getQueue,
  removeFromQueue,
  PendingReport,
} from './../utils/offlineQueue'
import Toast from 'react-native-toast-message'

async function buildFormData(report: PendingReport): Promise<FormData> {
  const formData = new FormData()
  formData.append('title', report.title)
  if (report.description) formData.append('description', report.description)
  formData.append('latitude', String(report.latitude))
  formData.append('longitude', String(report.longitude))
  formData.append('municipality_id', String(report.municipality_id))
  if (report.address) formData.append('address', report.address)

  if (report.imageUri) {
    const filename = report.imageUri.split('/').pop() || 'photo.jpg'
    const match = /\.(\w+)$/.exec(filename)
    const type = match ? `image/${match[1]}` : 'image/jpeg'
    formData.append('image', { uri: report.imageUri, name: filename, type } as any)
  }

  return formData
}

export function useNetworkSync() {
  const queryClient = useQueryClient()
  const isSyncing = useRef(false)

  const flushQueue = async () => {
    if (isSyncing.current) return
    isSyncing.current = true

    try {
      const queue = await getQueue()
      if (queue.length === 0) return

      Toast.show({
        type: 'info',
        text1: `Се синхронизираат ${queue.length} пријави...`,
        visibilityTime: 3000,
      })

      let successCount = 0
      let failCount = 0

      for (const report of queue) {
        try {
          const formData = await buildFormData(report)
          await submitReport(formData)
          await removeFromQueue(report.id)
          successCount++
        } catch (err) {
          console.error(`Failed to sync report ${report.id}:`, err)
          failCount++
        }
      }

      if (successCount > 0) {
        queryClient.invalidateQueries({ queryKey: ['reports-map'] })
        queryClient.invalidateQueries({ queryKey: ['my-reports'] })
        Toast.show({
          type: 'success',
          text1: `${successCount} пријав${successCount === 1 ? 'а' : 'и'} се поднесени успешно ✓`,
        })
      }

      if (failCount > 0) {
        Toast.show({
          type: 'error',
          text1: `${failCount} пријав${failCount === 1 ? 'а' : 'и'} не можеа да се поднесат`,
          text2: 'Ќе се обидеме повторно при следното поврзување',
        })
      }
    } finally {
      isSyncing.current = false
    }
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected && state.isInternetReachable
      if (isConnected) {
        flushQueue()
      }
    })

    NetInfo.fetch().then((state) => {
      if (state.isConnected && state.isInternetReachable) {
        flushQueue()
      }
    })

    return () => unsubscribe()
  }, [])
}