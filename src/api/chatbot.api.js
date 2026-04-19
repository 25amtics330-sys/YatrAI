import api from './index';

export const sendMessage = async (message, language = 'en') => {
  const response = await api.post('/chatbot/message', { message, language });
  return response.data;
};

export const getQuickReplies = async () => {
  const response = await api.get('/chatbot/quick-replies');
  return response.data;
};

export const getSuggestions = async (context) => {
  const response = await api.get('/chatbot/suggestions', {
    params: { context },
  });
  return response.data;
};
