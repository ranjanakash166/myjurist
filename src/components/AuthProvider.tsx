"use client";
import React, { ReactNode, useEffect, useState, createContext, useContext, useCallback } from "react";
import { API_BASE_URL } from "../app/constants";

interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  preferred_ai_provider?: string | null;
  preferred_model?: string | null;
  role: 'super_admin' | 'org_admin' | 'org_user';
  organization_id: string;
  organization_name?: string | null;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
  user: User;
  session_id: string;
  session_expires_at: string;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
  user: User;
  session_id: string;
  session_expires_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, full_name: string) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (email: string, full_name: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  verifyOtp: (email: string, otp_code: string, password: string, full_name: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  logout: () => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  sendOtp: async () => ({ success: false }),
  verifyOtp: async () => ({ success: false }),
  requestPasswordReset: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  logout: async () => {},
  getAuthHeaders: () => ({}),
  refreshToken: async () => false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const [refreshTokenExpiry, setRefreshTokenExpiry] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to generate device fingerprint
  const generateDeviceFingerprint = useCallback(() => {
    if (typeof window === "undefined") return "server";
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    // Create a simple hash of the fingerprint
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `device_${Math.abs(hash).toString(36)}`;
  }, []);

  // Helper function to check if token is expired
  const isTokenExpired = useCallback((expiryTime: number | null) => {
    if (!expiryTime) return true;
    // Add 30 second buffer before expiry
    return Date.now() >= (expiryTime - 30000);
  }, []);

  // Helper function to check if refresh token is expired
  const isRefreshTokenExpired = useCallback((expiryTime: number | null) => {
    if (!expiryTime) return true;
    return Date.now() >= expiryTime;
  }, []);

  // Function to refresh the access token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (!refreshToken || isRefreshing) return false;
    
    // Check if refresh token is expired
    if (isRefreshTokenExpired(refreshTokenExpiry)) {
      console.log("Refresh token expired, logging out");
      await logout();
      return false;
    }

    try {
      setIsRefreshing(true);
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        console.log("Token refresh failed, logging out");
        await logout();
        return false;
      }

      const data: RefreshResponse = await response.json();
      
      // Calculate expiry times
      const newTokenExpiry = Date.now() + (data.expires_in * 1000);
      const newRefreshTokenExpiry = Date.now() + (data.refresh_expires_in * 1000);
      const newSessionExpiry = new Date(data.session_expires_at).getTime();
      
      // Store new tokens and expiry times
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("token_expiry", newTokenExpiry.toString());
      localStorage.setItem("refresh_token_expiry", newRefreshTokenExpiry.toString());
      localStorage.setItem("session_id", data.session_id);
      localStorage.setItem("session_expiry", newSessionExpiry.toString());
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      setToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setTokenExpiry(newTokenExpiry);
      setRefreshTokenExpiry(newRefreshTokenExpiry);
      setSessionId(data.session_id);
      setSessionExpiry(newSessionExpiry);
      setUser(data.user);
      setIsAuthenticated(true);
      
      console.log("Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      await logout();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshToken, refreshTokenExpiry, isRefreshing, isRefreshTokenExpired]);

  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      const storedRefreshToken = localStorage.getItem("refresh_token");
      const storedTokenExpiry = localStorage.getItem("token_expiry");
      const storedRefreshTokenExpiry = localStorage.getItem("refresh_token_expiry");
      const storedSessionId = localStorage.getItem("session_id");
      const storedSessionExpiry = localStorage.getItem("session_expiry");
      const storedUser = localStorage.getItem("auth_user");
      
      if (storedToken && storedRefreshToken && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const tokenExpiryTime = storedTokenExpiry ? parseInt(storedTokenExpiry) : null;
          const refreshTokenExpiryTime = storedRefreshTokenExpiry ? parseInt(storedRefreshTokenExpiry) : null;
          const sessionExpiryTime = storedSessionExpiry ? parseInt(storedSessionExpiry) : null;
          
          // Check if access token is expired but refresh token is still valid
          if (isTokenExpired(tokenExpiryTime) && !isRefreshTokenExpired(refreshTokenExpiryTime)) {
            // Token is expired but refresh token is valid, try to refresh
            setToken(storedToken);
            setRefreshToken(storedRefreshToken);
            setTokenExpiry(tokenExpiryTime);
            setRefreshTokenExpiry(refreshTokenExpiryTime);
            setSessionId(storedSessionId);
            setSessionExpiry(sessionExpiryTime);
            setUser(user);
            setIsAuthenticated(true);
            setIsInitialized(true);
            
            // Attempt to refresh token
            refreshAccessToken();
            return;
          }
          
          // If refresh token is also expired, clear everything
          if (isRefreshTokenExpired(refreshTokenExpiryTime)) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("token_expiry");
            localStorage.removeItem("refresh_token_expiry");
            localStorage.removeItem("session_id");
            localStorage.removeItem("session_expiry");
            localStorage.removeItem("auth_user");
          } else {
            // Both tokens are valid
            setToken(storedToken);
            setRefreshToken(storedRefreshToken);
            setTokenExpiry(tokenExpiryTime);
            setRefreshTokenExpiry(refreshTokenExpiryTime);
            setSessionId(storedSessionId);
            setSessionExpiry(sessionExpiryTime);
            setUser(user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_expiry");
          localStorage.removeItem("refresh_token_expiry");
          localStorage.removeItem("session_id");
          localStorage.removeItem("session_expiry");
          localStorage.removeItem("auth_user");
        }
      }
      setIsInitialized(true);
    }
  }, [isTokenExpired, isRefreshTokenExpired, refreshAccessToken]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!isAuthenticated || !tokenExpiry) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired(tokenExpiry)) {
        refreshAccessToken();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    
    // Also check immediately
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [isAuthenticated, tokenExpiry, isTokenExpired, refreshAccessToken]);

  const login = async (email: string, password: string) => {
    try {
      const deviceFingerprint = generateDeviceFingerprint();
      
      const response = await fetch(`${API_BASE_URL}/auth/enhanced/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password, 
          device_fingerprint: deviceFingerprint 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail?.[0]?.msg || "Login failed";
        return { success: false, error: errorMessage };
      }

      const data: AuthResponse = await response.json();
      
      // Calculate expiry times
      const tokenExpiryTime = Date.now() + (data.expires_in * 1000);
      const refreshTokenExpiryTime = Date.now() + (data.refresh_expires_in * 1000);
      const sessionExpiryTime = new Date(data.session_expires_at).getTime();
      
      // Store auth data
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("token_expiry", tokenExpiryTime.toString());
      localStorage.setItem("refresh_token_expiry", refreshTokenExpiryTime.toString());
      localStorage.setItem("session_id", data.session_id);
      localStorage.setItem("session_expiry", sessionExpiryTime.toString());
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      setToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setTokenExpiry(tokenExpiryTime);
      setRefreshTokenExpiry(refreshTokenExpiryTime);
      setSessionId(data.session_id);
      setSessionExpiry(sessionExpiryTime);
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred during login" };
    }
  };

  const sendOtp = async (email: string, full_name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, full_name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail?.[0]?.msg || "Failed to send OTP";
        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred while sending OTP" };
    }
  };

  const verifyOtp = async (email: string, otp_code: string, password: string, full_name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp_code, password, full_name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail?.[0]?.msg || "OTP verification failed";
        return { success: false, error: errorMessage };
      }

      const data: AuthResponse = await response.json();
      
      // Calculate expiry times
      const tokenExpiryTime = Date.now() + (data.expires_in * 1000);
      const refreshTokenExpiryTime = Date.now() + (data.refresh_expires_in * 1000);
      const sessionExpiryTime = new Date(data.session_expires_at).getTime();
      
      // Store auth data
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("token_expiry", tokenExpiryTime.toString());
      localStorage.setItem("refresh_token_expiry", refreshTokenExpiryTime.toString());
      localStorage.setItem("session_id", data.session_id);
      localStorage.setItem("session_expiry", sessionExpiryTime.toString());
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      setToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setTokenExpiry(tokenExpiryTime);
      setRefreshTokenExpiry(refreshTokenExpiryTime);
      setSessionId(data.session_id);
      setSessionExpiry(sessionExpiryTime);
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred during OTP verification" };
    }
  };

  const register = async (email: string, password: string, full_name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, full_name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail?.[0]?.msg || "Registration failed";
        return { success: false, error: errorMessage };
      }

      const data: AuthResponse = await response.json();
      
      // Calculate expiry times
      const tokenExpiryTime = Date.now() + (data.expires_in * 1000);
      const refreshTokenExpiryTime = Date.now() + (data.refresh_expires_in * 1000);
      const sessionExpiryTime = new Date(data.session_expires_at).getTime();
      
      // Store auth data
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("token_expiry", tokenExpiryTime.toString());
      localStorage.setItem("refresh_token_expiry", refreshTokenExpiryTime.toString());
      localStorage.setItem("session_id", data.session_id);
      localStorage.setItem("session_expiry", sessionExpiryTime.toString());
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      setToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setTokenExpiry(tokenExpiryTime);
      setRefreshTokenExpiry(refreshTokenExpiryTime);
      setSessionId(data.session_id);
      setSessionExpiry(sessionExpiryTime);
      setUser(data.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred during registration" };
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail?.[0]?.msg || "Failed to request password reset";
        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred while requesting password reset" };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail?.[0]?.msg || "Password reset failed";
        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message || "An error occurred during password reset" };
    }
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate session on server
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: getAuthHeaders(),
        });
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API call failed:", error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("refresh_token_expiry");
      localStorage.removeItem("session_id");
      localStorage.removeItem("session_expiry");
      localStorage.removeItem("auth_user");
      setToken(null);
      setRefreshToken(null);
      setTokenExpiry(null);
      setRefreshTokenExpiry(null);
      setSessionId(null);
      setSessionExpiry(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const getAuthHeaders = () => {
    if (!token) return {};
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isInitialized,
      login,
      register,
      sendOtp,
      verifyOtp,
      requestPasswordReset,
      resetPassword,
      logout,
      getAuthHeaders,
      refreshToken: refreshAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
} 