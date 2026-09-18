import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh'),
    getMe: () => api.get('/auth/me')
  },

  // Upload endpoints
  upload: {
    uploadInvoice: (file) => {
      const formData = new FormData();
      formData.append('invoice', file);
      return api.post('/upload', formData);
    },
    getUploadStatus: (uploadId) => api.get(`/upload/${uploadId}`),
    cancelUpload: (uploadId) => api.delete(`/upload/${uploadId}`)
  },

  // Invoice endpoints
  invoices: {
    getInvoices: (params) => api.get('/invoices', { params }),
    getInvoiceById: (id) => api.get(`/invoices/${id}`),
    updateInvoice: (id, data) => api.put(`/invoices/${id}`, data),
    deleteInvoice: (id) => api.delete(`/invoices/${id}`),
    startProcessing: (id) => api.post(`/invoices/${id}/process`)
  },

  // Vendor endpoints
  vendors: {
    getVendors: (params) => api.get('/vendors', { params }),
    getVendorById: (id) => api.get(`/vendors/${id}`),
    createVendor: (data) => api.post('/vendors', data),
    updateVendor: (id, data) => api.put(`/vendors/${id}`, data),
    deleteVendor: (id) => api.delete(`/vendors/${id}`)
  },

  // Analytics endpoints
  analytics: {
    getSummary: () => api.get('/analytics/summary'),
    getTrends: (params) => api.get('/analytics/trends', { params }),
    getVendorAnalytics: (params) => api.get('/analytics/vendors', { params })
  }
};

export default apiService;