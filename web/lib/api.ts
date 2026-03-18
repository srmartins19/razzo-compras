import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bidflow_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('bidflow_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  },
);

// Typed API helpers
export const rfqsApi = {
  list:          (params?: object) => api.get('/rfqs', { params }),
  get:           (id: string)      => api.get(`/rfqs/${id}`),
  create:        (data: object)    => api.post('/rfqs', data),
  updateStatus:  (id: string, status: string) => api.patch(`/rfqs/${id}/status`, { status }),
  invite:        (id: string, supplierIds: string[]) => api.post(`/rfqs/${id}/invite-suppliers`, { supplierIds }),
  comparison:    (id: string)      => api.get(`/rfqs/${id}/comparison`),
  selectWinner:  (id: string, supplierId: string) => api.post(`/rfqs/${id}/select-winner`, { supplierId }),
};

export const suppliersApi = {
  list:    (params?: object) => api.get('/suppliers', { params }),
  create:  (data: object)    => api.post('/suppliers', data),
  approve: (id: string)      => api.patch(`/suppliers/${id}/approve`),
};

export const ordersApi = {
  list:           (params?: object) => api.get('/orders', { params }),
  generateFromRfq:(rfqId: string)   => api.post(`/orders/generate-from-rfq/${rfqId}`),
  updateStatus:   (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

export const analyticsApi = {
  dashboard:    ()                => api.get('/analytics/dashboard'),
  priceHistory: (itemId: string)  => api.get(`/analytics/item-price-history/${itemId}`),
  ranking:      ()                => api.get('/analytics/supplier-ranking'),
  monthly:      (months?: number) => api.get('/analytics/monthly', { params: { months } }),
};

export const authApi = {
  login:    (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: object) => api.post('/auth/register', data),
};
