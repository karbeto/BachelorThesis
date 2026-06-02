import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { OfflineQueue } from '../utils/offlineQueue'

export function useNetworkSync() {
  const isSyncing = useRef(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const canConnect = state.isConnected && state.isInternetReachable !== false
      
      if (canConnect && !isSyncing.current) {
        await triggerSyncProcess()
      }
    })

    return () => unsubscribe()
  }, [])

  const triggerSyncProcess = async () => {
    const queue = await OfflineQueue.getQueue()
    if (queue.length === 0) return

    isSyncing.current = true
    console.log(`[Offline Sync] Internet restored. Syncing ${queue.length} reports...`)

    for (const report of queue) {
      try {
        const formData = new FormData()
        formData.append('title', report.title)
        formData.append('description', report.description)
        formData.append('category_id', report.category_id)
        formData.append('latitude', String(report.latitude))
        formData.append('longitude', String(report.longitude))

        if (report.images && report.images.length > 0) {
          report.images.forEach((imageUri, index) => {
            const filename = imageUri.split('/').pop() || `image_${index}.jpg`
            const match = /\.(\w+)$/.exec(filename)
            const type = match ? `image/${match[1]}` : 'image/jpeg'
            
            formData.append('images', {
              uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
              name: filename,
              type,
            } as any)
          })
        }

        await new Promise((resolve) => setTimeout(resolve, 1500))
        await OfflineQueue.dequeue(report.id)
        console.log(`[Offline Sync] Successfully uploaded report: ${report.id}`)
      } catch (error) {
        console.error(`[Offline Sync] Upload failed for report ${report.id}. Aborting queue execution.`, error)
        break
      }
    }

    isSyncing.current = false
  }
}