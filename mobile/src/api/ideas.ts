import client from './client'

export const getIdeas = async (params?: any) => {
  const { data } = await client.get('/ideas', { params })
  return data
}

export const submitIdea = async (payload: {
  title: string
  description: string
  municipality_id: number
  latitude?: number
  longitude?: number
}) => {
  const { data } = await client.post('/ideas', payload)
  return data
}

export const voteIdea = async (id: number) => {
  const { data } = await client.post(`/ideas/${id}/vote`)
  return data
}

export const unvoteIdea = async (id: number) => {
  await client.delete(`/ideas/${id}/vote`)
}