import apiClient from './apiClient';

export const leadService = {
  // Get all leads
  getAllLeads: () => {
    return apiClient.get('/api/leads');
  },

  // Get lead by ID
  getLeadById: (id) => {
    return apiClient.get(`/api/leads/${id}`);
  },

  // Create new lead
  createLead: (leadData) => {
    return apiClient.post('/api/leads', leadData);
  },

  // Update lead
  updateLead: (id, leadData) => {
    return apiClient.put(`/api/leads/${id}`, leadData);
  },

  // Delete lead
  deleteLead: (id) => {
    return apiClient.delete(`/api/leads/${id}`);
  },

  // Filter by status
  filterByStatus: (status) => {
    return apiClient.get(`/api/leads/filter/status?status=${status}`);
  },

  // Filter by city
  filterByCity: (city) => {
    return apiClient.get(`/api/leads/filter/city?city=${city}`);
  },

  // Filter by date
  filterByDate: (fromDate, toDate) => {
    return apiClient.get('/api/leads/filter/date', {
      params: { fromDate, toDate }
    });
  },

  // Get modification history
  getModificationHistory: (id) => {
    return apiClient.get(`/api/leads/${id}/modifications`);
  },

  // Upload leads from Excel
  uploadLeads: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};
