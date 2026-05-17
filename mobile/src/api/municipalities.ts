import client from './client'

export const getMunicipalities = async () => {
  const { data } = await client.get('/municipalities')
  return data
}