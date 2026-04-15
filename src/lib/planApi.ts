import { API_BASE_URL } from "../app/constants";
import { apiCallWithRefresh } from "./utils";
import {
  PublicApiError,
  throwPublicHttpError,
  USAGE_LIMIT_EXCEEDED_MESSAGE,
} from "./apiClientErrors";

// Types for plan data
export interface PlanInfo {
  subscription_id: string;
  plan_id: string;
  plan_name: string;
  plan_tier: string;
  plan_kind: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  was_auto_created: boolean;
}

export interface FeatureUsage {
  display_key: string;
  display_name: string;
  description: string;
  icon: string;
  current_count: number;
  max_count: number;
  remaining: number;
  usage_percentage: number;
  reset_period: 'monthly' | 'yearly' | 'weekly' | 'daily';
  period_start: string;
  period_end: string;
}

export interface PlanUsage {
  subscription_id: string;
  plan_name: string;
  plan_tier: string;
  features: FeatureUsage[];
  as_of: string;
}

export interface UsageHistoryRecord {
  id: string;
  feature: string;
  count: number;
  service_name: string;
  request_id: string | null;
  recorded_at: string;
}

export interface UsageHistory {
  records: UsageHistoryRecord[];
  total: number;
  page: number;
  per_page: number;
}

export interface FeatureUsageDetail {
  feature: string;
  display_name: string;
  description: string;
  icon: string;
  current_count: number;
  max_count: number;
  remaining: number;
  reset_period: 'monthly' | 'yearly' | 'weekly' | 'daily';
  period_start: string;
  period_end: string;
  recent_records: UsageHistoryRecord[];
}

// Fetch current plan info
export async function fetchPlanInfo(
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<PlanInfo> {
  try {
    const response = await apiCallWithRefresh(
      `${API_BASE_URL}/plans/me`,
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
      const errorText = await response.text();
      throwPublicHttpError('GET /plans/me', response.status, errorText, {
        default: 'Could not load your plan information. Please try again.',
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching plan info:', error);
    throw error;
  }
}

// Fetch plan usage
export async function fetchPlanUsage(
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<PlanUsage> {
  try {
    const response = await apiCallWithRefresh(
      `${API_BASE_URL}/plans/me/usage`,
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
      const errorText = await response.text();
      const status = response.status;
      if (status === 429 || (status >= 500 && status < 600)) {
        console.error('Error fetching plan usage:', status, errorText);
        throw new PublicApiError(USAGE_LIMIT_EXCEEDED_MESSAGE, { status });
      }
      throwPublicHttpError('GET /plans/me/usage', status, errorText, {
        default: 'Could not load your usage details. Please try again.',
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching plan usage:', error);
    throw error;
  }
}

// Fetch usage history
export async function fetchUsageHistory(
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>,
  page: number = 1,
  perPage: number = 20,
  feature?: string
): Promise<UsageHistory> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (feature) {
      params.append('feature', feature);
    }

    const response = await apiCallWithRefresh(
      `${API_BASE_URL}/plans/me/usage/history?${params.toString()}`,
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
      const errorText = await response.text().catch(() => '');
      throwPublicHttpError('GET /plans/me/usage/history', response.status, errorText, {
        default: 'Could not load your usage history. Please try again.',
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching usage history:', error);
    throw error;
  }
}

// Fetch detailed usage for a specific feature
export async function fetchFeatureUsageDetail(
  feature: string,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<FeatureUsageDetail> {
  try {
    const response = await apiCallWithRefresh(
      `${API_BASE_URL}/plans/me/usage/${feature}`,
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
      const errorText = await response.text().catch(() => '');
      throwPublicHttpError(`GET /plans/me/usage/${feature}`, response.status, errorText, {
        default: 'Could not load usage details for this feature. Please try again.',
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feature usage detail:', error);
    throw error;
  }
}

// Helper function to format date
export function formatPeriodDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Helper function to get icon component name (for lucide-react)
export function getIconName(iconKey: string): string {
  const iconMap: Record<string, string> = {
    'scale': 'Scale',
    'file-search': 'FileSearch',
    'message-circle': 'MessageCircle',
    'clock': 'Clock',
    'folder-tree': 'FolderTree',
    'pen-tool': 'PenTool',
  };
  return iconMap[iconKey] || 'Circle';
}

// Helper function to get status badge color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
    case 'inactive':
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    case 'cancelled':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    case 'expired':
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

// Helper function to get plan tier badge color
export function getPlanTierColor(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'professional':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'business':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    case 'enterprise':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}
