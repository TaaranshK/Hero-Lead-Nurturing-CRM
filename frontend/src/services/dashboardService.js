import apiClient from './apiClient';

export const dashboardService = {
  // Get dashboard statistics
  getStats: (fromDate = null, toDate = null) => {
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    
    return apiClient.get('/api/dashboard', { params });
  }
};
