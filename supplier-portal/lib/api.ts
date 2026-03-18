import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
export const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('supplier_token');
    if (t) config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});
api.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('supplier_token');
    window.location.href = '/auth/login';
  }
  return Promise.reject(err);
});
