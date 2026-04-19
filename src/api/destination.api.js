import api from './index';

export const getAll = async (params = {}) => {
  const response = await api.get('/destinations', { params });
  return response.data;
};

export const search = async (query) => {
  const response = await api.get('/destinations/search', { params: { q: query } });
  return response.data;
};

export const filter = async (filters) => {
  const response = await api.post('/destinations/filter', filters);
  return response.data;
};

export const getById = async (id) => {
  const response = await api.get(`/destinations/${id}`);
  return response.data;
};

export const getTrending = async () => {
  const response = await api.get('/destinations/trending');
  return response.data;
};
