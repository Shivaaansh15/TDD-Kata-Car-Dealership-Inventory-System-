import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      
      // Extract token and user from backend response flexible structures
      const jwtToken = data.token || data.jwt || (typeof data === 'string' ? data : '');
      const userData = data.user || { email, name: data.name || email.split('@')[0] };

      if (!jwtToken) {
        throw new Error('No authentication token received from server');
      }

      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        'Login failed. Please check your credentials.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await registerApi({ name, email, password });

      // If backend returns token automatically on registration, log user in
      const jwtToken = data.token || data.jwt;
      if (jwtToken) {
        const userData = data.user || { name, email };
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        'Registration failed. Please try again.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
