import { useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { apiCallWithRefresh } from '@/lib/utils';

export function useAuthenticatedApi() {
  const { getAuthHeaders, refreshToken } = useAuth();

  const authenticatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return apiCallWithRefresh(url, options, getAuthHeaders, refreshToken);
  }, [getAuthHeaders, refreshToken]);

  const authenticatedPost = useCallback(async (
    url: string,
    data: any,
    options: RequestInit = {}
  ): Promise<Response> => {
    return authenticatedFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
  }, [authenticatedFetch]);

  const authenticatedGet = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return authenticatedFetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  }, [authenticatedFetch]);

  const authenticatedPut = useCallback(async (
    url: string,
    data: any,
    options: RequestInit = {}
  ): Promise<Response> => {
    return authenticatedFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
  }, [authenticatedFetch]);

  const authenticatedDelete = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return authenticatedFetch(url, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  }, [authenticatedFetch]);

  return {
    authenticatedFetch,
    authenticatedPost,
    authenticatedGet,
    authenticatedPut,
    authenticatedDelete,
  };
}
