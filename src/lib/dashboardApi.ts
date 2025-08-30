import { API_BASE_URL } from "../app/constants";
import { apiCallWithRefresh } from "./utils";

// Types for dashboard data
export interface DashboardStats {
  total_documents_analyzed: number;
  total_patents_analyzed: number;
  recent_activity: ActivityItem[];
  user_info: UserInfo;
}

export interface ActivityItem {
  type: 'document' | 'patent' | 'chat';
  title: string;
  timestamp: string;
  status: 'completed' | 'active' | 'failed';
  details: {
    filename?: string;
    file_size?: number;
    total_tokens?: number;
    content_type?: string;
    session_id?: string;
    document_count?: number;
    document_name?: string;
    message_count?: number;
    applicant?: string;
    word_count?: number;
    format?: string;
    report_type?: string;
  };
}

export interface UserInfo {
  name: string;
  email: string;
  member_since: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  preferred_ai_provider?: string;
  preferred_model?: string;
}

export interface AvailableModel {
  provider: string;
  model_name: string;
  display_name: string;
  context_length: number;
  is_configured: boolean;
}

export interface AvailableModelsResponse {
  available_models: AvailableModel[];
  current_provider: string;
  current_model: string;
}

export interface UpdatePreferencesRequest {
  preferred_ai_provider: string;
  preferred_model: string;
}

export interface UpdatePreferencesResponse {
  success: boolean;
  message: string;
  updated_preferences: {
    preferred_ai_provider: string;
    preferred_model: string;
  };
  }

// Fetch dashboard stats
export async function fetchDashboardStats(
  authHeaders: Record<string, string>,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<DashboardStats> {
  try {
    const response = await apiCallWithRefresh(
      `${API_BASE_URL}/dashboard/stats`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      },
      getAuthHeaders,
      refreshToken
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

export async function fetchUserProfile(
  authHeaders: Record<string, string>,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<UserProfile> {
  const response = await apiCallWithRefresh(
    `${API_BASE_URL}/auth/me`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    },
    getAuthHeaders,
    refreshToken
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchAvailableModels(
  authHeaders: Record<string, string>,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<AvailableModelsResponse> {
  const response = await apiCallWithRefresh(
    `${API_BASE_URL}/models/available`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    },
    getAuthHeaders,
    refreshToken
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function updatePreferences(
  authHeaders: Record<string, string>,
  body: UpdatePreferencesRequest,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<UpdatePreferencesResponse> {
  const response = await apiCallWithRefresh(
    `${API_BASE_URL}/models/preferences`,
    {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    getAuthHeaders,
    refreshToken
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData?.detail?.[0]?.msg || `HTTP error! status: ${response.status}`;
    throw new Error(errorMsg);
  }
  return response.json();
}

// Helper function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Helper function to get activity icon
export function getActivityIcon(type: string): string {
  switch (type) {
    case 'document':
      return '📄';
    case 'patent':
      return '📋';
    case 'chat':
      return '💬';
    default:
      return '📝';
  }
}

// Helper function to get status color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'active':
      return 'text-blue-600 bg-blue-100';
    case 'failed':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
} 