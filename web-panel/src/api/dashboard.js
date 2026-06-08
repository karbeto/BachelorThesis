import client from './client'

export const getStats = async (params) => {
  const { data } = await client.get('/dashboard/stats', { params })
  return data
}

export const getHeatmap = async (params) => {
  const { data } = await client.get('/dashboard/heatmap', { params })
  return data
}