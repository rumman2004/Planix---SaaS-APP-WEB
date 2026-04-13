import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data?.success && response.data?.data) {
          setUser(response.data.data);
        } else {
          setUser(null);
        }
        setError(null);
      } catch (err) {
        console.error('❌ Auth check failed:', err.response?.data?.message || err.message);
        setUser(null);
        // Don't set error on initial check - user just isn't logged in
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('❌ Logout failed:', err);
      setError('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};