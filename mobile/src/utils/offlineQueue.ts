import AsyncStorage from '@react-native-async-storage/async-storage'

const QUEUE_STORAGE_KEY = '@citizens_activism_offline_reports'

export interface QueuedReport {
  id: string 
  title: string
  description: string
  category_id: string
  latitude: number
  longitude: number
  images: string[] 
  timestamp: number
}

export const OfflineQueue = {
  getQueue: async (): Promise<QueuedReport[]> => {
    try {
      const data = await AsyncStorage.getItem(QUEUE_STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading offline queue:', error)
      return []
    }
  },

  enqueue: async (report: Omit<QueuedReport, 'id' | 'timestamp'>): Promise<void> => {
    try {
      const queue = await OfflineQueue.getQueue()
      const newReport: QueuedReport = {
        ...report,
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      }
      
      queue.push(newReport)
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
    } catch (error) {
      console.error('Error saving report to offline queue:', error)
      throw error;
    }
  },

  dequeue: async (id: string): Promise<void> => {
    try {
      const queue = await OfflineQueue.getQueue()
      const filteredQueue = queue.filter((item) => item.id !== id)
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(filteredQueue))
    } catch (error) {
      console.error('Error removing item from offline queue:', error)
    }
  }
}