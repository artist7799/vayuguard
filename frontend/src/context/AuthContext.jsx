import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vayuguard_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and verify authentication session on application load
  useEffect(() => {
    async function verifyAuthSession() {
      const storedToken = localStorage.getItem('vayuguard_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await getCurrentUser(storedToken);
        if (res && res.user) {
          setUser(res.user);
          setToken(storedToken);
        } else {
          throw new Error('Invalid user payload');
        }
      } catch (err) {
        console.warn('VayuGuard session validation failed:', err.message);
        localStorage.removeItem('vayuguard_token');
        localStorage.removeItem('vayuguard_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    verifyAuthSession();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await loginUser({ email, password });
      if (data && data.token) {
        localStorage.setItem('vayuguard_token', data.token);
        if (data.user) {
          localStorage.setItem('vayuguard_user', JSON.stringify(data.user));
          setUser(data.user);
        }
        setToken(data.token);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await registerUser({ name, email, password });
      if (data && data.token) {
        localStorage.setItem('vayuguard_token', data.token);
        if (data.user) {
          localStorage.setItem('vayuguard_user', JSON.stringify(data.user));
          setUser(data.user);
        }
        setToken(data.token);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('vayuguard_token');
    localStorage.removeItem('vayuguard_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
