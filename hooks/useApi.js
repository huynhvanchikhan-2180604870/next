'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();

  const apiCall = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error('Phiên đăng nhập đã hết hạn');
        }
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const get = (url) => apiCall(url);
  
  const post = (url, data) => apiCall(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  const put = (url, data) => apiCall(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  const del = (url) => apiCall(url, {
    method: 'DELETE',
  });

  const uploadFile = async (url, file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error('Phiên đăng nhập đã hết hạn');
        }
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
    uploadFile,
  };
}