import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: Product[] };

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (exists) return state;
      
      return {
        items: [...state.items, action.payload]
      };
    }
    
    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter(item => item._id !== action.payload)
      };
    }
    
    case 'CLEAR_WISHLIST':
      return { items: [] };
    
    case 'LOAD_WISHLIST': {
      return { items: action.payload };
    }
    
    default:
      return state;
  }
};

const initialState: WishlistState = {
  items: []
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlistItems = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
      } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to wishlist`);
  };

  const removeFromWishlist = (productId: string) => {
    const product = state.items.find(item => item._id === productId);
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    if (product) {
      toast.success(`${product.name} removed from wishlist`);
    }
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    toast.success('Wishlist cleared');
  };

  const isInWishlist = (productId: string): boolean => {
    return state.items.some(item => item._id === productId);
  };

  const getWishlistCount = (): number => {
    return state.items.length;
  };

  const value: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};