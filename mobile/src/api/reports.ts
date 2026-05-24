import client from './client';

export const getReports = async (params?: any) => {
  const { data } = await client.get('/reports/', { params });
  return data;
};

export const getReport = async (id: number) => {
  const { data } = await client.get(`/reports/${id}`);
  return data;
};

export const submitReport = async (formData: FormData) => {
  // Added trailing slash to prevent 307 redirect
  const { data } = await client.post('/reports/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const voteReport = async (id: number) => {
  const { data } = await client.post(`/reports/${id}/vote`);
  return data;
};

export const unvoteReport = async (id: number) => {
  await client.delete(`/reports/${id}/vote`);
};

export const rateReport = async (id: number, rating: number, comment?: string) => {
  const { data } = await client.post(`/reports/${id}/rating`, { rating, comment });
  return data;
};

export const getMyReports = async () => {
  const { data } = await client.get('/reports/my');
  return data;
};