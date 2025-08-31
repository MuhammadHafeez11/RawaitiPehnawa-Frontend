import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('Session expired, logging out...');
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
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Dashboard
  getDashboardStats: () =>
    api.get('/admin/dashboard').then(res => res.data),

  getSalesAnalytics: (period = '7d') =>
    api.get(`/admin/analytics/sales?period=${period}`).then(res => res.data),

  // Products Management
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products?${queryString}`).then(res => res.data);
  },

  getProduct: (id: string) =>
    api.get(`/products/${id}`).then(res => res.data),

  createProduct: (productData: any) =>
    api.post('/products', productData).then(res => res.data),

  updateProduct: (id: string, productData: any) =>
    api.put(`/products/${id}`, productData).then(res => res.data),

  deleteProduct: (id: string) =>
    api.delete(`/products/${id}`).then(res => res.data),

  // Categories Management
  getCategories: () =>
    api.get('/categories').then(res => res.data),

  createCategory: (categoryData: any) =>
    api.post('/categories', categoryData).then(res => res.data),

  updateCategory: (id: string, categoryData: any) =>
    api.put(`/categories/${id}`, categoryData).then(res => res.data),

  deleteCategory: (id: string) =>
    api.delete(`/categories/${id}`).then(res => res.data),

  // Orders Management
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/guest-orders/admin?${queryString}`).then(res => res.data);
  },

  getOrder: (id: string) =>
    api.get(`/guest-orders/admin/${id}`).then(res => res.data),

  updateOrderStatus: (id: string, statusData: any) =>
    api.put(`/guest-orders/admin/${id}/status`, statusData).then(res => res.data),

  // Upload
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  }
};