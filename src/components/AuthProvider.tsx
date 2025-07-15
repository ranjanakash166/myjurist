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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, full_name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  getAuthHeaders: () => ({}),
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      }
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

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
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
      login,
      register,
      logout,
      getAuthHeaders,
    }}>
      {children}
    </AuthContext.Provider>
  );
} 