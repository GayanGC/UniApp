'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiService } from '@/services/api';
import type { 
  User, 
  AuthContextType, 
  LoginRequest, 
  RegisterRequest,
  UserRole 
} from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Initialize auth state from cookies
   */
  useEffect(() => {
    const initAuth = () => {
      const storedToken = Cookies.get('auth_token');
      const storedUser = Cookies.get('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          Cookies.remove('auth_token');
          Cookies.remove('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Get dashboard route based on user role
   */
  const getDashboardRoute = useCallback((role: UserRole): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'boarding_provider':
        return '/provider/dashboard';
      case 'prospective':
        return '/prospective/dashboard';
      default:
        return '/';
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await apiService.login(credentials);
      
      // Store token and user in cookies
      Cookies.set('auth_token', response.accessToken, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      Cookies.set('user', JSON.stringify(response.user), { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      setToken(response.accessToken);
      setUser(response.user);

      // Redirect based on role
      const dashboardRoute = getDashboardRoute(response.user.role);
      router.push(dashboardRoute);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }, [router, getDashboardRoute]);

  /**
   * Register new user
   */
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await apiService.register(data);
      
      // Store token and user in cookies
      Cookies.set('auth_token', response.accessToken, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      Cookies.set('user', JSON.stringify(response.user), { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      setToken(response.accessToken);
      setUser(response.user);

      // Redirect based on role
      const dashboardRoute = getDashboardRoute(response.user.role);
      router.push(dashboardRoute);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }, [router, getDashboardRoute]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    Cookies.remove('auth_token');
    Cookies.remove('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const value: AuthContextType = {
    user,
    token,
    loading: isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * Access authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
