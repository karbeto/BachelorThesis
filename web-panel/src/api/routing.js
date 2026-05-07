import client from './client'

export const getRoutings = async (params) => {
  const { data } = await client.get('/routing', { params })
  return data
}

export const createRouting = async (payload) => {
  const { data } = await client.post('/routing', payload)
  return data
}

export const updateRouting = async (id, payload) => {
  const { data } = await client.patch(`/routing/${id}`, payload)
  return data
}

export const deleteRouting = async (id) => {
  await client.delete(`/routing/${id}`)
}