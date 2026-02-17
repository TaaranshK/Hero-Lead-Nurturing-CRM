import apiClient from './apiClient';

export const authService = {
  login: (username, password) => {
    return apiClient.post('/auth/login', { username, password });
  },

  forgotPassword: (username, email) => {
    return apiClient.post('/auth/forgot-password', { username, email });
  },

  verifyOtp: (username, otp) => {
    return apiClient.post('/auth/verify-otp', { username, otp });
  },

  resetPassword: (username, newPassword, confirmPassword) => {
    return apiClient.post('/auth/reset-password', { 
      username, 
      newPassword, 
      confirmPassword 
    });
  }
};
