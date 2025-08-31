import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const { cart, updateCartItem, removeFromCart, clearCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBagIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-secondary-800 mb-4">
              Please Sign In
            </h1>
            <p className="text-secondary-600 mb-6">
              You need to be signed in to view your cart
            </p>
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBagIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-secondary-800 mb-4">
              Your cart is empty
            </h1>
            <p className="text-secondary-600 mb-6">
              Looks like you haven't added any items to your cart yet
            </p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-800">
            Shopping Cart ({cart.totalItems} items)
          </h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="card p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                    <img
                      src={item.product.images[0]?.url || '/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-lg font-semibold text-secondary-800 hover:text-primary-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    
                    {item.product.brand && (
                      <p className="text-sm text-secondary-600 mt-1">
                        {item.product.brand}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-600">
                      <span>Size: {item.variant.size}</span>
                      <span>Color: {item.variant.color}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-full border border-secondary-300 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="p-1 rounded-full border border-secondary-300 hover:bg-secondary-50"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold text-secondary-800">
                            {formatPrice(item.variant.price * item.quantity)}
                          </div>
                          <div className="text-sm text-secondary-600">
                            {formatPrice(item.variant.price)} each
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-40">
              <h2 className="text-xl font-semibold text-secondary-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cart.totalAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="font-medium">
                    {cart.totalAmount >= 50 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(10)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax</span>
                  <span className="font-medium">{formatPrice(cart.totalAmount * 0.08)}</span>
                </div>

                <hr className="border-secondary-200" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>
                    {formatPrice(
                      cart.totalAmount + 
                      (cart.totalAmount >= 50 ? 0 : 10) + 
                      (cart.totalAmount * 0.08)
                    )}
                  </span>
                </div>

                {cart.totalAmount < 50 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Add {formatPrice(50 - cart.totalAmount)} more for free shipping!
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-primary mt-6"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/products"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-secondary-600">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span>Secure Checkout</span>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-2 space-x-2">
                  <div className="bg-secondary-100 rounded px-2 py-1 text-xs font-bold">VISA</div>
                  <div className="bg-secondary-100 rounded px-2 py-1 text-xs font-bold">MC</div>
                  <div className="bg-secondary-100 rounded px-2 py-1 text-xs font-bold">AMEX</div>
                  <div className="bg-secondary-100 rounded px-2 py-1 text-xs font-bold">PP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;