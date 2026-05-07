import client from './client'

export const getIdeas = async (params) => {
  const { data } = await client.get('/ideas', { params })
  return data
}

export const updateIdeaStatus = async (id, status) => {
  const { data } = await client.patch(`/ideas/${id}/status`, { status })
  return data
}