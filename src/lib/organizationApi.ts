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

export interface OrganizationUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'org_admin' | 'org_user';
  organization_id: string;
  organization_name: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface OrganizationUsersResponse {
  users: OrganizationUser[];
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

// Delete organization (Super Admin only) - WARNING: This deletes all associated data
export async function deleteOrganization(
  authHeaders: Record<string, string>,
  organizationId: string
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to delete organization');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
}

// List users in specific organization
export async function listOrganizationUsers(
  authHeaders: Record<string, string>,
  organizationId: string,
  page: number = 1,
  per_page: number = 20
): Promise<OrganizationUsersResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/users?page=${page}&per_page=${per_page}`,
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
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to fetch organization users');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching organization users:', error);
    throw error;
  }
}

// User management types
export interface CreateUserRequest {
  email: string;
  full_name: string;
  password: string;
  role: 'super_admin' | 'org_admin' | 'org_user';
  organization_id: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  role?: 'super_admin' | 'org_admin' | 'org_user';
  is_active?: boolean;
  organization_id?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'org_admin' | 'org_user';
  organization_id: string;
  organization_name: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
}

// Create a new user and assign to organization (Super Admin only)
export async function createUser(
  authHeaders: Record<string, string>,
  userData: CreateUserRequest
): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to create user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update any user (Super Admin only)
export async function updateUser(
  authHeaders: Record<string, string>,
  userId: string,
  userData: UpdateUserRequest
): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to update user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete any user and their data (Super Admin only)
export async function deleteUser(
  authHeaders: Record<string, string>,
  userId: string
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.[0]?.msg || 'Failed to delete user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
