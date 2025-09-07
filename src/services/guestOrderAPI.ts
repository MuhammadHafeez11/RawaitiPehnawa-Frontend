import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GuestOrderData {
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    variant: {
      size: string;
      color: string;
    };
    quantity: number;
  }>;
}

export const guestOrderAPI = {
  createOrder: (orderData: GuestOrderData) =>
    api.post('/guest-orders', orderData).then(res => res.data),
};