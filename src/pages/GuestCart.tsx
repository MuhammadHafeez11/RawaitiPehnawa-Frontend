import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import { useGuestCart } from '../context/GuestCartContext';
import { formatPrice } from '../utils/currency';

const GuestCart: React.FC = () => {
  const { items, updateCartItem, removeFromCart, clearCart, totalAmount, totalItems } = useGuestCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
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

  const shippingCost = totalAmount >= 5000 ? 0 : 200;
  const finalTotal = totalAmount + shippingCost;

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-800">
            Shopping Cart ({totalItems} items)
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
            {items.map((item) => (
              <div key={item.id} className="card p-6">
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
                      <span>Color: Default</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-full border border-secondary-300 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
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
                          onClick={() => handleRemoveItem(item.id)}
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
                  <span className="font-medium">{formatPrice(totalAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                <hr className="border-secondary-200" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                {totalAmount < 5000 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Add {formatPrice(5000 - totalAmount)} more for free shipping!
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

              {/* Payment Method */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">Cash on Delivery</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Pay when your order is delivered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuestCart;