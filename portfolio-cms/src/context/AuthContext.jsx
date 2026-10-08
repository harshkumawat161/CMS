import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cms_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('cms_access_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('cms_access_token');
    localStorage.removeItem('cms_refresh_token');
    localStorage.removeItem('cms_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleLogoutEvent = () => {
      logout();
    };

    window.addEventListener('cms:auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('cms:auth:logout', handleLogoutEvent);
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      const currentToken = localStorage.getItem('cms_access_token');
      if (currentToken) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
          localStorage.setItem('cms_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Initial session validation failed or refreshed:', err);
          // If token refresh failed completely, logout will be handled by api interceptor
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { accessToken, refreshToken, username, email: userEmail, role } = res;

    localStorage.setItem('cms_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('cms_refresh_token', refreshToken);
    }

    const userData = { username, email: userEmail, role };
    localStorage.setItem('cms_user', JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
