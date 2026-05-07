import client from './client'

export const getCategories = async () => {
  const { data } = await client.get('/categories')
  return data
}

export const createCategory = async (payload) => {
  const { data } = await client.post('/categories', payload)
  return data
}

export const updateCategory = async (id, payload) => {
  const { data } = await client.patch(`/categories/${id}`, payload)
  return data
}

export const deleteCategory = async (id) => {
  await client.delete(`/categories/${id}`)
}