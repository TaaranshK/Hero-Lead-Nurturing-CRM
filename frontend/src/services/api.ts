import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  Lead,
  LeadModification,
  ChatMessage,
  DashboardStats,
  UploadResponse,
} from '../types';

const API_BASE_URL = 'http://localhost:9090';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  // backend returns LoginResponse directly (not wrapped in ApiResponse)
  login: (credentials: LoginRequest) => api.post<LoginResponse>('/auth/login', credentials),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Lead Service
export const leadService = {
  create: (lead: Partial<Lead>) =>
    api.post<ApiResponse<Lead>>('/api/leads', lead),
  
  getAll: () =>
    api.get<ApiResponse<Lead[]>>('/api/leads'),
  
  getById: (id: number) =>
    api.get<ApiResponse<Lead>>(`/api/leads/${id}`),
  
  update: (id: number, lead: Partial<Lead>) =>
    api.put<ApiResponse<Lead>>(`/api/leads/${id}`, lead),
  
  delete: (id: number) =>
    api.delete<ApiResponse<string>>(`/api/leads/${id}`),
  
  filterByStatus: (status: string) =>
    api.get<ApiResponse<Lead[]>>(`/api/leads/filter/status?status=${status}`),
  
  filterByCity: (city: string) =>
    api.get<ApiResponse<Lead[]>>(`/api/leads/filter/city?city=${city}`),
  
  filterByDate: (fromDate: string, toDate: string) =>
    api.get<ApiResponse<Lead[]>>(`/api/leads/filter/date?fromDate=${fromDate}&toDate=${toDate}`),
  
  getModificationHistory: (id: number) =>
    api.get<ApiResponse<LeadModification[]>>(`/api/leads/${id}/modifications`),
};

// Chat Service
export const chatService = {
  sendMessage: (leadId: number, message: string) =>
    api.post<ApiResponse<ChatMessage>>(`/api/chat/${leadId}`, message),
  
  getChatHistory: (leadId: number) =>
    api.get<ApiResponse<ChatMessage[]>>(`/api/chat/${leadId}`),
};

// Dashboard Service
export const dashboardService = {
  getStats: (fromDate?: string, toDate?: string) => {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    return api.get<ApiResponse<DashboardStats>>(`/api/dashboard?${params.toString()}`);
  },
};

// Upload Service
export const uploadService = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ApiResponse<UploadResponse>>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
