// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

// Lead Types
export type LeadStatus = 'NEW' | 'QUALIFIED' | 'UNQUALIFIED' | 'LOST';

export interface Lead {
  id: number;
  contactNumber: string;
  firstName: string;
  lastName?: string;
  governmentId?: string;
  email?: string;
  city?: string;
  address?: string;
  modelName?: string;
  leadSource?: string;
  leadMode?: string;
  followUpDate?: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LeadModification {
  id: number;
  leadId: number;
  modifiedField: string;
  oldValue?: string;
  newValue?: string;
  modifiedBy: string;
  modifiedAt: string;
}

// Chat Types
export interface ChatMessage {
  id: number;
  leadId: number;
  sender: string;
  message: string;
  timestamp: string;
}

// Dashboard Types
export interface DashboardStats {
  totalLeads: number;
  qualifiedLeads: number;
  unqualifiedLeads: number;
  lostLeads: number;
  pendingLeads: number;
  conversionRate: number;
  sourceDistribution: Record<string, number>;
}

// Upload Types
export interface UploadResponse {
  success: boolean;
  message: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
}
