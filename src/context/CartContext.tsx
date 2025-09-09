import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product, ProductVariant } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'CART_LOADING' }
  | { type: 'CART_SUCCESS'; payload: Cart }
  | { type: 'CART_ERROR'; payload: string }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  getCartCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'CART_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'CART_SUCCESS':
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        error: null,
      };
    case 'CART_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: null,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartAPI.getCart();
      
      if (response.success && response.data) {
        dispatch({ type: 'CART_SUCCESS', payload: response.data.cart });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load cart';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
    }
  };

  const addToCart = async (product: Product, variant: ProductVariant, quantity: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      dispatch({ type: 'CART_LOADING' });
      
      const response = await cartAPI.addToCart({
        productId: product._id,
        variant: {
          size: variant.size,
          color: 'Default',
          price: variant.price,
        },
        quantity,
      });

      if (response.success && response.data) {
        dispatch({ type: 'CART_SUCCESS', payload: response.data.cart });
        toast.success(`${product.name} added to cart`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: 'CART_LOADING' });
      
      const response = await cartAPI.updateCartItem(itemId, quantity);
      
      if (response.success && response.data) {
        dispatch({ type: 'CART_SUCCESS', payload: response.data.cart });
        toast.success('Cart updated');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: 'CART_LOADING' });
      
      const response = await cartAPI.removeFromCart(itemId);
      
      if (response.success && response.data) {
        dispatch({ type: 'CART_SUCCESS', payload: response.data.cart });
        toast.success('Item removed from cart');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'CART_LOADING' });
      
      const response = await cartAPI.clearCart();
      
      if (response.success && response.data) {
        dispatch({ type: 'CART_SUCCESS', payload: response.data.cart });
        toast.success('Cart cleared');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const getCartItemCount = (): number => {
    return state.cart?.totalItems || state.cart?.count || 0;
  };

  const getCartTotal = (): number => {
    return state.cart?.totalAmount || 0;
  };

  // Safe cart count getter
  const getCartCount = (): number => {
    return state.cart?.count || state.cart?.totalItems || 0;
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
    getCartCount,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};