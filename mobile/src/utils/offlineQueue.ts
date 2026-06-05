import AsyncStorage from '@react-native-async-storage/async-storage'

const QUEUE_KEY = 'civic_offline_queue'

export interface PendingReport {
  id: string
  title: string
  description?: string
  latitude: number
  longitude: number
  address?: string
  municipality_id: number
  imageUri?: string
  createdAt: string
}

export const getQueue = async (): Promise<PendingReport[]> => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const addToQueue = async (report: PendingReport): Promise<void> => {
  try {
    const queue = await getQueue()
    queue.push(report)
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch (err) {
    console.error('Failed to add to offline queue:', err)
  }
}

export const removeFromQueue = async (id: string): Promise<void> => {
  try {
    const queue = await getQueue()
    const updated = queue.filter((r) => r.id !== id)
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to remove from queue:', err)
  }
}

export const clearQueue = async (): Promise<void> => {
  await AsyncStorage.removeItem(QUEUE_KEY)
}