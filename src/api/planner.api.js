import api from './index';

export const createTrip = async (tripData) => {
  const response = await api.post('/planner/trips', tripData);
  return response.data;
};

export const updateDay = async (tripId, dayIndex, dayData) => {
  const response = await api.put(`/planner/trips/${tripId}/days/${dayIndex}`, dayData);
  return response.data;
};

export const getBudgetEstimate = async (tripId) => {
  const response = await api.get(`/planner/trips/${tripId}/budget`);
  return response.data;
};

export const replanTrip = async (tripId, alertData) => {
  const response = await api.post(`/planner/trips/${tripId}/replan`, alertData);
  return response.data;
};
