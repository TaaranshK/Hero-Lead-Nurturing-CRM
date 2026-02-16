import apiClient from './apiClient';

export const authService = {
  login: (username, password) => {
    return apiClient.post('/auth/login', { username, password });
  }
};
