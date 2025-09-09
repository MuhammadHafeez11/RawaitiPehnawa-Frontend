export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentCategory?: string;
  subcategories?: Category[];
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  size: string;
  stock: number;
  price: number;
  sku: string;
}



export interface ProductImage {
  url: string;
  alt: string;
  publicId?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category;
  categories?: Category[];
  brand?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  colors: string[];
  price: number;
  discountedPrice?: number;
  currentPrice: number;
  discountPercentage: number;
  hasDiscount: boolean;
  tags: string[];
  features: string[];
  materials: string[];
  careInstructions?: string;
  isActive: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  stock?: number;
  totalStock: number;
  soldCount: number;
  currentStock?: number;
  stockStatus?: string;
  targetGender?: string;
  stitchType?: string;
  pieceCount?: number;
  season?: string;
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  variant: {
    size: string;
    color: string;
    price: number;
  };
  quantity: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  variant: {
    size: string;
    color: string;
    sku: string;
  };
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: {
    method: 'stripe' | 'paypal' | 'cash_on_delivery';
    stripePaymentIntentId?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paidAt?: string;
  };
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationData;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface FilterOptions {
  category?: string;
  search?: string;
  targetGender?: string;
  stitchType?: string;
  pieceCount?: string;
  season?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}