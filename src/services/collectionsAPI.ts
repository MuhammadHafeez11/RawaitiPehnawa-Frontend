import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    publicId: string;
  };
  season: 'winter' | 'summer' | 'all-season';
  isSpecial: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const collectionsAPI = {
  getCollections: (): Promise<{ success: boolean; data: { collections: Collection[] } }> =>
    api.get('/collections').then(res => res.data),

  getCollection: (slug: string): Promise<{ success: boolean; data: { collection: Collection } }> =>
    api.get(`/collections/${slug}`).then(res => res.data),

  createCollection: (collectionData: Partial<Collection>): Promise<{ success: boolean; data: { collection: Collection } }> =>
    api.post('/collections', collectionData).then(res => res.data),

  updateCollection: (id: string, collectionData: Partial<Collection>): Promise<{ success: boolean; data: { collection: Collection } }> =>
    api.put(`/collections/${id}`, collectionData).then(res => res.data),

  deleteCollection: (id: string): Promise<{ success: boolean; message: string }> =>
    api.delete(`/collections/${id}`).then(res => res.data),
};