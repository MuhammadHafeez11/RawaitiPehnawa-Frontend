import axios from 'axios';
import { ApiResponse, AuthResponse, User, Product, ProductsResponse, Category, Cart, Order, FilterOptions } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://ecommerce-backend-psi-six.vercel.app/api' 
    : 'http://localhost:5000/api');

// Add request interceptor to handle CORS
axios.defaults.withCredentials = true;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor to add token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await api.post('/auth/refresh');
        const newToken = response.data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        setAccessToken(newToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear token and redirect
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        
        // Show notification
        if (typeof window !== 'undefined') {
          import('react-hot-toast').then(({ default: toast }) => {
            toast.error('Session expired. Please login again.');
          });
          
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
        
        return Promise.reject(refreshError);
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

// Auth API
export const authAPI = {
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/register', userData).then(res => res.data),

  login: (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> =>
    api.post('/auth/login', credentials).then(res => res.data),

  logout: (): Promise<ApiResponse<null>> =>
    api.post('/auth/logout').then(res => res.data),

  getProfile: (): Promise<ApiResponse<{ user: User }>> =>
    api.get('/auth/me').then(res => res.data),

  refreshToken: (): Promise<ApiResponse<{ accessToken: string }>> =>
    api.post('/auth/refresh').then(res => res.data),
};

// Products API
export const productsAPI = {
  getProducts: (filters: FilterOptions = {}): Promise<ApiResponse<ProductsResponse>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    return api.get(`/products?${params}`).then(res => res.data);
  },

  getProduct: (id: string): Promise<ApiResponse<{ product: Product }>> =>
    api.get(`/products/${id}`).then(res => res.data),

  getFeaturedProducts: (): Promise<ApiResponse<{ products: Product[] }>> =>
    api.get('/products/featured').then(res => res.data),

  createProduct: (productData: any): Promise<ApiResponse<{ product: Product }>> =>
    api.post('/products', productData).then(res => res.data),

  updateProduct: (id: string, productData: any): Promise<ApiResponse<{ product: Product }>> =>
    api.put(`/products/${id}`, productData).then(res => res.data),

  deleteProduct: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/products/${id}`).then(res => res.data),
};

// Categories API
export const categoriesAPI = {
  getCategories: (): Promise<ApiResponse<{ categories: Category[] }>> =>
    api.get('/categories').then(res => res.data),

  getCategory: (id: string): Promise<ApiResponse<{ category: Category }>> =>
    api.get(`/categories/${id}`).then(res => res.data),

  createCategory: (categoryData: any): Promise<ApiResponse<{ category: Category }>> =>
    api.post('/categories', categoryData).then(res => res.data),

  updateCategory: (id: string, categoryData: any): Promise<ApiResponse<{ category: Category }>> =>
    api.put(`/categories/${id}`, categoryData).then(res => res.data),

  deleteCategory: (id: string): Promise<ApiResponse<null>> =>
    api.delete(`/categories/${id}`).then(res => res.data),
};

// Cart API
export const cartAPI = {
  getCart: (): Promise<ApiResponse<{ cart: Cart }>> =>
    api.get('/cart').then(res => res.data),

  addToCart: (item: {
    productId: string;
    variant: { size: string; color: string; price: number };
    quantity: number;
  }): Promise<ApiResponse<{ cart: Cart }>> =>
    api.post('/cart/items', item).then(res => res.data),

  updateCartItem: (itemId: string, quantity: number): Promise<ApiResponse<{ cart: Cart }>> =>
    api.put(`/cart/items/${itemId}`, { quantity }).then(res => res.data),

  removeFromCart: (itemId: string): Promise<ApiResponse<{ cart: Cart }>> =>
    api.delete(`/cart/items/${itemId}`).then(res => res.data),

  clearCart: (): Promise<ApiResponse<{ cart: Cart }>> =>
    api.delete('/cart').then(res => res.data),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData: {
    shippingAddress: any;
    paymentMethod?: string;
  }): Promise<ApiResponse<{ order: Order; clientSecret?: string }>> =>
    api.post('/orders', orderData).then(res => res.data),

  getOrders: (page = 1, limit = 10): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> =>
    api.get(`/orders?page=${page}&limit=${limit}`).then(res => res.data),

  getOrder: (id: string): Promise<ApiResponse<{ order: Order }>> =>
    api.get(`/orders/${id}`).then(res => res.data),

  getAllOrders: (page = 1, limit = 20): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> =>
    api.get(`/orders/admin/all?page=${page}&limit=${limit}`).then(res => res.data),

  updateOrderStatus: (id: string, status: string, trackingData?: any): Promise<ApiResponse<{ order: Order }>> =>
    api.put(`/orders/${id}/status`, { status, ...trackingData }).then(res => res.data),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File): Promise<ApiResponse<{ url: string; publicId: string }>> => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  uploadImages: (files: File[]): Promise<ApiResponse<{ images: Array<{ url: string; publicId: string }> }>> => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },

  deleteImage: (publicId: string): Promise<ApiResponse<null>> =>
    api.delete(`/upload/image/${encodeURIComponent(publicId)}`).then(res => res.data),
};

export default api;