"use client";
import React, { ReactNode, useEffect, useState, createContext, useContext } from "react";
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
  token_type: string;
  expires_in: number;
  user: User;
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
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");
      
      if (storedToken && storedUser) {
        try {
          // Basic token validation (you could add JWT expiration check here)
          const user = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      }
      setIsInitialized(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail?.[0]?.msg || "Login failed";
        return { success: false, error: errorMessage };
      }

      const data: AuthResponse = await response.json();
      
      // Store auth data
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      setToken(data.access_token);
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
      
      // Store auth data
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      setToken(data.access_token);
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
      
      // Store auth data
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      setToken(data.access_token);
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
      localStorage.removeItem("auth_user");
      setToken(null);
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
    }}>
      {children}
    </AuthContext.Provider>
  );
} 