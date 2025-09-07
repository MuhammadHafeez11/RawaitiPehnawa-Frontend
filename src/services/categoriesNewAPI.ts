import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CategoryNew {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
  };
  parentCategory?: string | CategoryNew;
  level: number;
  categoryPath: string;
  categoryType: 'main' | 'gender' | 'stitch-type' | 'piece-type' | 'item-type';
  stitchType: 'stitched' | 'unstitched' | 'both';
  pieceCount?: number;
  targetGender: 'women' | 'men' | 'boys' | 'girls' | 'unisex';
  sizes: string[];
  isActive: boolean;
  sortOrder: number;
  subcategories?: CategoryNew[];
  createdAt: string;
  updatedAt: string;
}

export const categoriesNewAPI = {
  getCategories: (params?: {
    level?: number;
    parentCategory?: string;
    targetGender?: string;
    stitchType?: string;
  }): Promise<{ success: boolean; data: { categories: CategoryNew[] } }> => {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return api.get(`/categories-new?${queryString}`).then(res => res.data);
  },

  getCategoryTree: (params?: {
    targetGender?: string;
  }): Promise<{ success: boolean; data: { categories: CategoryNew[] } }> => {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return api.get(`/categories-new/tree?${queryString}`).then(res => res.data);
  },

  getCategory: (slug: string): Promise<{ success: boolean; data: { category: CategoryNew } }> =>
    api.get(`/categories-new/${slug}`).then(res => res.data),

  createCategory: (categoryData: Partial<CategoryNew>): Promise<{ success: boolean; data: { category: CategoryNew } }> =>
    api.post('/categories-new', categoryData).then(res => res.data),

  updateCategory: (id: string, categoryData: Partial<CategoryNew>): Promise<{ success: boolean; data: { category: CategoryNew } }> =>
    api.put(`/categories-new/${id}`, categoryData).then(res => res.data),

  deleteCategory: (id: string): Promise<{ success: boolean; message: string }> =>
    api.delete(`/categories-new/${id}`).then(res => res.data),
};