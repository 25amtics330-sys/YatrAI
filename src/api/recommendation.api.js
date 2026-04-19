import api from './index';

export const getByPreference = async (preferences) => {
  const response = await api.post('/recommendations/preference', preferences);
  return response.data;
};

export const getByState = async (stateId) => {
  const response = await api.get(`/recommendations/state/${stateId}`);
  return response.data;
};

export const getFestivalCalendar = async (month, year) => {
  const response = await api.get('/recommendations/festivals', {
    params: { month, year },
  });
  return response.data;
};
