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

// API configuration
const API_BASE_URL = 'https://api.myjurist.io/api/v1';

// Fetch dashboard stats
export async function fetchDashboardStats(authHeaders: Record<string, string>): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        ...authHeaders,
      },
    });

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