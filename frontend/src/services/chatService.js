import apiClient from './apiClient';

export const chatService = {
  // Send a message
  sendMessage: (leadId, message) => {
    return apiClient.post(`/api/chat/${leadId}`, { message });
  },

  // Get chat history
  getChatHistory: (leadId) => {
    return apiClient.get(`/api/chat/${leadId}`);
  }
};
