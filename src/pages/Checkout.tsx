import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import { useGuestCart } from '../context/GuestCartContext';
import { formatPrice } from '../utils/currency';
import { guestOrderAPI, GuestOrderData } from '../services/guestOrderAPI';
import toast from 'react-hot-toast';

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

const Checkout: React.FC = () => {
  const { items, totalAmount, clearCart } = useGuestCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const pakistaniCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerDetails.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      showFieldError('firstName', 'First name is required');
    }
    if (!customerDetails.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      showFieldError('lastName', 'Last name is required');
    }
    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required';
      showFieldError('email', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      newErrors.email = 'Please enter a valid email';
      showFieldError('email', 'Please enter a valid email address');
    }
    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      showFieldError('phone', 'Phone number is required');
    } else if (!/^(\+92|0)?[0-9]{10}$/.test(customerDetails.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Pakistani phone number';
      showFieldError('phone', 'Please enter a valid Pakistani phone number');
    }
    if (!customerDetails.address.trim()) {
      newErrors.address = 'Address is required';
      showFieldError('address', 'Complete address is required');
    }
    if (!customerDetails.city.trim()) {
      newErrors.city = 'City is required';
      showFieldError('city', 'Please select a city');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const showFieldError = (field: string, message: string) => {
    toast.error(message, {
      duration: 3000,
      position: 'top-center'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const orderData: GuestOrderData = {
        customerDetails,
        items: items.map(item => ({
          productId: item.product._id,
          variant: {
            size: item.variant?.size || 'One Size',
            color: 'Default'
          },
          quantity: item.quantity
        }))
      };

      const response = await guestOrderAPI.createOrder(orderData);
      
      if (response.success) {
        setOrderNumber(response.data.orderNumber);
        clearCart();
        setOrderPlaced(true);
        toast.success('Order placed successfully!');
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingCost = totalAmount >= 15000 ? 0 : 200; // Free shipping over PKR 15000
  const finalTotal = totalAmount + shippingCost;

  if (items.length === 0 && !orderPlaced) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl font-bold text-secondary-800 mb-4">
            Your cart is empty
          </h1>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-secondary-800 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-secondary-600 mb-6">
              Thank you for your order. We have received your order details.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Order Number: {orderNumber}
              </h2>
              <p className="text-green-700">
                We will contact you shortly on <strong>{customerDetails.phone}</strong> to confirm your order and arrange delivery.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/products')}
                className="btn-primary"
              >
                Continue Shopping
              </button>
              <p className="text-sm text-secondary-600">
                You will receive a confirmation call within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold text-secondary-800 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Customer Details Form */}
          <div>
            <h2 className="text-xl font-semibold text-secondary-800 mb-6">
              Customer Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerDetails.firstName}
                    onChange={handleInputChange}
                    className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerDetails.lastName}
                    onChange={handleInputChange}
                    className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Contact Fields */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="03XXXXXXXXX"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Complete Address *
                </label>
                <textarea
                  name="address"
                  value={customerDetails.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="House/Flat No, Street, Area"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={customerDetails.city}
                    onChange={handleInputChange}
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select City</option>
                    {pakistaniCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={customerDetails.postalCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  value={customerDetails.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="Any special delivery instructions..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-semibold text-secondary-800 mb-6">
              Order Summary
            </h2>

            <div className="card p-6 sticky top-40">
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]?.url || '/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-800">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {item.variant?.size || 'One Size'} • Default • Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-secondary-800">
                        {formatPrice((item.product.discountedPrice && item.product.discountedPrice < item.product.price 
                          ? item.product.discountedPrice 
                          : item.product.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-secondary-200 pt-4">
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

                <div className="flex justify-between text-lg font-semibold border-t border-secondary-200 pt-3">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                {totalAmount < 15000 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-yellow-800">
                      Add {formatPrice(15000 - totalAmount)} more for free shipping!
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <h3 className="font-semibold text-secondary-800 mb-3">Payment Method</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">Cash on Delivery</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Pay when your order is delivered to your doorstep
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

export default Checkout;