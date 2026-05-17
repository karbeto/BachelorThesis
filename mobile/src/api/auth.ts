import client from './client'

export const login = async (email: string, password: string) => {
  const { data } = await client.post('/auth/login', { email, password })
  return data
}

export const register = async (payload: {
  email: string
  password: string
  full_name: string
  phone?: string
}) => {
  const { data } = await client.post('/auth/register', payload)
  return data
}

export const getMe = async () => {
  const { data } = await client.get('/auth/me')
  return data
}