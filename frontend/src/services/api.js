import axios from 'axios';

// Base API URL pointing to Express + MongoDB backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global response errors & 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If not already on auth pages, redirect to login
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const registerApi = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

// --- Cars Endpoints ---
// GET /api/cars
export const getCarsApi = async () => {
  const response = await api.get('/api/cars');
  return response.data;
};

// POST /api/cars - fields: { brand, model, year, price, quantity }
export const addCarApi = async (carData) => {
  const response = await api.post('/api/cars', carData);
  return response.data;
};

// PUT /api/cars/:id - fields: { brand, model, year, price, quantity }
export const updateCarApi = async (id, carData) => {
  const response = await api.put(`/api/cars/${id}`, carData);
  return response.data;
};

// DELETE /api/cars/:id
export const deleteCarApi = async (id) => {
  const response = await api.delete(`/api/cars/${id}`);
  return response.data;
};

// PATCH /api/cars/:id/purchase
export const purchaseCarApi = async (id) => {
  const response = await api.patch(`/api/cars/${id}/purchase`);
  return response.data;
};

// PATCH /api/cars/:id/restock
export const restockCarApi = async (id) => {
  const response = await api.patch(`/api/cars/${id}/restock`);
  return response.data;
};

export default api;
