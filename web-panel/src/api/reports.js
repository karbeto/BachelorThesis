import client from './client'

export const getReports = async (params) => {
  const { data } = await client.get('/reports', { params })
  return data
}

export const getReport = async (id) => {
  const { data } = await client.get(`/reports/${id}`)
  return data
}

export const updateReportStatus = async (id, status, note) => {
  const { data } = await client.patch(`/reports/${id}/status`, { status, note })
  return data
}

export const getReportHistory = async (id) => {
  const { data } = await client.get(`/reports/${id}/history`)
  return data
}