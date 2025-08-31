import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, ProductVariant } from '../types';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  addedAt: string;
}

interface GuestCartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant: ProductVariant; quantity: number } }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface GuestCartContextType extends GuestCartState {
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const GuestCartContext = createContext<GuestCartContextType | undefined>(undefined);

const cartReducer = (state: GuestCartState, action: CartAction): GuestCartState => {
  const calculateItemPrice = (item: CartItem) => {
    // Use current price (discounted if available, otherwise regular price)
    return item.product.discountedPrice && item.product.discountedPrice < item.product.price 
      ? item.product.discountedPrice 
      : item.product.price;
  };

  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload;
      const itemId = `${product._id}-${variant.size}`;
      
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      
      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: itemId,
          product,
          variant,
          quantity,
          addedAt: new Date().toISOString()
        };
        newItems = [...state.items, newItem];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);
      
      return { items: newItems, totalItems, totalAmount };
    }
    
    case 'UPDATE_ITEM': {
      const { id, quantity } = action.payload;
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);
      
      return { items: newItems, totalItems, totalAmount };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = newItems.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);
      
      return { items: newItems, totalItems, totalAmount };
    }
    
    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalAmount: 0 };
    
    case 'LOAD_CART': {
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);
      
      return { items, totalItems, totalAmount };
    }
    
    default:
      return state;
  }
};

const initialState: GuestCartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

export const GuestCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('guestCart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    // Check stock from product or variant
    const availableStock = variant.stock !== undefined ? variant.stock : (product.stock || 0);
    if (availableStock < quantity) {
      toast.error('Insufficient stock available');
      return;
    }
    
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    toast.success(`${product.name} added to cart`);
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    const item = state.items.find(item => item.id === id);
    if (item) {
      const availableStock = item.variant.stock !== undefined ? item.variant.stock : (item.product.stock || 0);
      if (availableStock < quantity) {
        toast.error('Insufficient stock available');
        return;
      }
    }
    
    dispatch({ type: 'UPDATE_ITEM', payload: { id, quantity } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const getCartItemCount = (): number => {
    return state.totalItems;
  };

  const getCartTotal = (): number => {
    return state.totalAmount;
  };

  const value: GuestCartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal
  };

  return (
    <GuestCartContext.Provider value={value}>
      {children}
    </GuestCartContext.Provider>
  );
};

export const useGuestCart = (): GuestCartContextType => {
  const context = useContext(GuestCartContext);
  if (context === undefined) {
    throw new Error('useGuestCart must be used within a GuestCartProvider');
  }
  return context;
};