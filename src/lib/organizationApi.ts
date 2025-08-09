import { API_BASE_URL } from "../app/constants";

// Types for organization management
export interface Organization {
  id: string;
  name: string;
  domain: string;
  logo_url?: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  max_users: number;
  status: 'active' | 'inactive' | 'suspended';
  user_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationRequest {
  name: string;
  domain: string;
  logo_url?: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  max_users: number;
}

export interface UpdateOrganizationRequest {
  name?: string;
  domain?: string;
  logo_url?: string;
  status?: 'active' | 'inactive' | 'suspended';
  subscription_plan?: 'basic' | 'premium' | 'enterprise';
  max_users?: number;
}

export interface OrganizationsResponse {
  organizations: Organization[];
  total: number;
  page: number;
  per_page: number;
}

// Create a new organization (Super Admin only)
export async function createOrganization(
  authHeaders: Record<string, string>,
  organizationData: CreateOrganizationRequest
): Promise<Organization> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(organizationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to create organization');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
}

// List all organizations with pagination and filtering (Super Admin only)
export async function listOrganizations(
  authHeaders: Record<string, string>,
  page: number = 1,
  per_page: number = 20
): Promise<OrganizationsResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/organizations?page=${page}&per_page=${per_page}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          ...authHeaders,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch organizations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
}

// Get organization details
export async function getOrganization(
  authHeaders: Record<string, string>,
  organizationId: string
): Promise<Organization> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch organization');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching organization:', error);
    throw error;
  }
}

// Update organization
export async function updateOrganization(
  authHeaders: Record<string, string>,
  organizationId: string,
  organizationData: UpdateOrganizationRequest
): Promise<Organization> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(organizationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to update organization');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
}
