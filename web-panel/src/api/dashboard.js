import client from './client'

export const getStats = async () => {
  const { data } = await client.get('/dashboard/stats')
  return data
}

export const getHeatmap = async () => {
  const { data } = await client.get('/dashboard/heatmap')
  return data
}