import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4500/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to all requests
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

// Handle authentication errors (401) - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Store token and user info in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Credential management API calls
export const credentialService = {
  getAll: async () => {
    const response = await api.get('/credentials');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/credentials/${id}`);
    return response.data;
  },

  getByDivision: async (divisionId) => {
    const response = await api.get(`/credentials/division/${divisionId}`);
    return response.data;
  },

  create: async (credentialData) => {
    const response = await api.post('/credentials', credentialData);
    return response.data;
  },

  update: async (id, credentialData) => {
    const response = await api.put(`/credentials/${id}`, credentialData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/credentials/${id}`);
    return response.data;
  },
};

// Organizational Unit API calls
export const ouService = {
  getAll: async () => {
    const response = await api.get('/ou');
    return response.data;
  },
};

// Division API calls
export const divisionService = {
  getAll: async () => {
    const response = await api.get('/divisions');
    return response.data;
  },

  getByOU: async (ouId) => {
    const response = await api.get(`/divisions/ou/${ouId}`);
    return response.data;
  },
};

// User management API calls (admin only)
export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  assignToDivision: async (userId, divisionId) => {
    const response = await api.post('/users/assign-division', { userId, divisionId });
    return response.data;
  },

  deassignFromDivision: async (userId) => {
    const response = await api.post('/users/deassign-division', { userId });
    return response.data;
  },

  changeRole: async (userId, role) => {
    const response = await api.post('/users/change-role', { userId, role });
    return response.data;
  },

  updateProfile: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;
