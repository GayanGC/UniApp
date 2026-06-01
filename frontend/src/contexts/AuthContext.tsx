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

  const handleAuthSuccess = (user: User, accessToken: string) => {
    Cookies.set('auth_token', accessToken, { 
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    Cookies.set('user', JSON.stringify(user), { 
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    setToken(accessToken);
    setUser(user);

    const dashboardRoute = getDashboardRoute(user.role);
    router.push(dashboardRoute);
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiService.login(credentials);
      if (response.requires2FA) {
        return { requires2FA: true, userId: response.userId };
      }
      handleAuthSuccess(response.user, response.accessToken);
      return {};
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const response = await apiService.googleLogin(token);
      if (response.requires2FA) {
        return { requires2FA: true, userId: response.userId };
      }
      handleAuthSuccess(response.user, response.accessToken);
      return {};
    } catch (error) {
      throw error;
    }
  };

  const authenticate2FA = async (userId: string, code: string) => {
    try {
      const response = await apiService.authenticate2FA(userId, code);
      handleAuthSuccess(response.user, response.accessToken);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiService.register(data);
      handleAuthSuccess(response.user, response.accessToken);
    } catch (error) {
      throw error;
    }
  };

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

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    Cookies.set('user', JSON.stringify(updatedUser), { 
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  };

  const value: AuthContextType = {
    user,
    token,
    loading: isLoading,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    googleLogin,
    authenticate2FA,
    register,
    logout,
    updateUser,
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
