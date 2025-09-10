import axios from 'axios';

// HARDCODED FIX: Use the WORKING backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log('🔗 Admin API Base URL:', API_BASE_URL);
console.log('✅ Using WORKING backend for admin!');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Disable for CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      
      // Show notification
      if (typeof window !== 'undefined') {
        // Import toast dynamically to avoid SSR issues
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error('Session expired. Please login again.');
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } else if (error.response?.status >= 500) {
      // Handle server errors
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error('Server error. Please try again later.');
        });
      }
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      // Handle network errors
      if (typeof window !== 'undefined') {
        import('react-hot-toast').then(({ default: toast }) => {
          toast.error('Network error. Please check your connection.');
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Dashboard
  getDashboardStats: () =>
    api.get('/api/admin/dashboard').then(res => res.data),

  getSalesAnalytics: (period = '7d') =>
    api.get(`/api/admin/analytics/sales?period=${period}`).then(res => res.data),

  // Products Management
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/api/admin/products?${queryString}`).then(res => res.data);
  },

  getProduct: (id: string) =>
    api.get(`/api/admin/products/${id}`).then(res => res.data),

  createProduct: (productData: any) =>
    api.post('/api/admin/products', productData).then(res => res.data),

  updateProduct: (id: string, productData: any) =>
    api.put(`/api/admin/products/${id}`, productData).then(res => res.data),

  deleteProduct: (id: string) =>
    api.delete(`/api/admin/products/${id}`).then(res => res.data),

  // Categories Management
  getCategories: () =>
    api.get('/api/admin/categories').then(res => res.data),

  createCategory: (categoryData: any) =>
    api.post('/api/admin/categories', categoryData).then(res => res.data),

  updateCategory: (id: string, categoryData: any) =>
    api.put(`/api/admin/categories/${id}`, categoryData).then(res => res.data),

  deleteCategory: (id: string) =>
    api.delete(`/api/admin/categories/${id}`).then(res => res.data),

  // Orders Management
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/api/admin/orders?${queryString}`).then(res => res.data);
  },

  getOrder: (id: string) =>
    api.get(`/api/admin/orders/${id}`).then(res => res.data),

  updateOrderStatus: (id: string, statusData: any) =>
    api.put(`/api/admin/orders/${id}/status`, statusData).then(res => res.data),

  // Upload
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/api/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  // Settings Management
  getSettings: () =>
    api.get('/api/admin/settings').then(res => res.data),

  updateSettings: (section: string, settingsData: any) =>
    api.put(`/api/admin/settings/${section}`, settingsData).then(res => res.data)
};